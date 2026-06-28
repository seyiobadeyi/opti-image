'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, X, CheckCircle, Download, Plus, Droplets } from 'lucide-react';
import { apiClient } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { c } from '@/lib/colors';
import type { ProcessedImage, ProcessingSummary, WatermarkPosition } from '@/types';

function fmtBytes(b: number): string {
    if (!b) return '0 B';
    const k = 1024, s = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + s[i];
}
function stripExt(n: string): string { return n.replace(/\.[^.]+$/, ''); }

interface FileEntry { file: File; localUrl: string; name: string; }
interface ResultEntry extends ProcessedImage { displayName: string; localUrl?: string; }

const POSITIONS: { id: WatermarkPosition; label: string }[] = [
    { id: 'top-left', label: 'Top left' },
    { id: 'top-center', label: 'Top center' },
    { id: 'top-right', label: 'Top right' },
    { id: 'center-left', label: 'Center left' },
    { id: 'center', label: 'Center' },
    { id: 'center-right', label: 'Center right' },
    { id: 'bottom-left', label: 'Bottom left' },
    { id: 'bottom-center', label: 'Bottom center' },
    { id: 'bottom-right', label: 'Bottom right' },
];

/** Maps a watermark position to CSS placement for the live preview overlay. */
function positionStyle(pos: WatermarkPosition): React.CSSProperties {
    const pad = '4%';
    const base: React.CSSProperties = { position: 'absolute' };
    if (pos === 'tile') return base;
    const [vert, horiz] = pos === 'center' ? ['center', 'center'] : pos.split('-');

    if (vert === 'top') base.top = pad; else if (vert === 'bottom') base.bottom = pad; else { base.top = '50%'; base.transform = 'translateY(-50%)'; }
    if (horiz === 'left') base.left = pad; else if (horiz === 'right') base.right = pad; else {
        base.left = '50%';
        base.transform = base.transform ? 'translate(-50%, -50%)' : 'translateX(-50%)';
    }
    return base;
}

export function WatermarkTool({ embedded = false }: { embedded?: boolean }): React.JSX.Element {
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [activeIdx, setActiveIdx] = useState(0);

    const [watermarkText, setWatermarkText] = useState('© Your Brand');
    const [position, setPosition] = useState<WatermarkPosition>('bottom-right');
    const [opacity, setOpacity] = useState(50);
    const [size, setSize] = useState(5);
    const [color, setColor] = useState('#ffffff');
    const [format, setFormat] = useState('');

    const [processing, setProcessing] = useState(false);
    const [processed, setProcessed] = useState(0);
    const [results, setResults] = useState<ResultEntry[] | null>(null);
    const [summary, setSummary] = useState<ProcessingSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const addMoreRef = useRef<HTMLInputElement>(null);

    // ── File management ──────────────────────────────────────────────────────
    const addFiles = useCallback((files: File[]) => {
        const imgs = files.filter(f => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name));
        setEntries(prev => [...prev, ...imgs.map(f => ({
            file: f, localUrl: URL.createObjectURL(f), name: stripExt(f.name),
        }))].slice(0, 50));
        setResults(null); setError(null); setProcessed(0);
    }, []);

    const removeEntry = useCallback((i: number) => {
        setEntries(prev => { const n = [...prev]; URL.revokeObjectURL(n[i]!.localUrl); n.splice(i, 1); return n; });
        setActiveIdx(a => (a >= i && a > 0) ? a - 1 : a);
    }, []);

    const reset = useCallback(() => {
        entries.forEach(e => URL.revokeObjectURL(e.localUrl));
        setEntries([]); setResults(null); setSummary(null); setError(null);
        setProcessed(0); setActiveIdx(0);
    }, [entries]);

    const { getRootProps, getInputProps, isDragActive, open: openPicker } = useDropzone({
        onDrop: addFiles,
        accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/avif': ['.avif'], 'image/tiff': ['.tif', '.tiff'], 'image/gif': ['.gif'], 'image/bmp': ['.bmp'], 'image/heic': ['.heic'], 'image/heif': ['.heif'] },
        maxFiles: 50, maxSize: 100 * 1024 * 1024, disabled: processing,
    });

    // ── Process ──────────────────────────────────────────────────────────────
    const handleProcess = useCallback(async () => {
        if (!entries.length || processing || !watermarkText.trim()) return;

        setProcessing(true); setError(null); setResults(null); setSummary(null); setProcessed(0);
        const allResults: ResultEntry[] = [];
        let totalOrig = 0, totalProc = 0;

        try {
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i]!;
                const namedFile = new File([entry.file], entry.file.name, { type: entry.file.type });

                const resp = await apiClient.convertImages([namedFile], {
                    watermarkText: watermarkText.trim(),
                    watermarkPosition: position,
                    watermarkOpacity: opacity,
                    watermarkSize: size,
                    watermarkColor: color,
                    format: format as '' | 'jpeg' | 'png' | 'webp' | 'avif' | 'tiff' | 'gif',
                    quality: 90,
                });
                if (resp.success && resp.results[0]) {
                    const r = resp.results[0];
                    const ext = format || r.format;
                    allResults.push({ ...r, displayName: `${entry.name}-watermarked.${ext}`, localUrl: entry.localUrl });
                    totalOrig += r.originalSize; totalProc += r.processedSize;
                }
                setProcessed(i + 1);
            }
            const savings = totalOrig - totalProc;
            setResults(allResults);
            setSummary({ filesProcessed: allResults.length, totalOriginalSize: totalOrig, totalProcessedSize: totalProc, totalSavings: savings, totalSavingsPercent: totalOrig > 0 ? ((savings / totalOrig) * 100).toFixed(1) : '0.0' });
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Something went wrong.';
            if (msg.toLowerCase().includes('subscri') || msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('401')) {
                window.dispatchEvent(new Event('open-auth-modal'));
            } else {
                setError(msg);
            }
        } finally {
            setProcessing(false);
        }
    }, [entries, processing, watermarkText, position, opacity, size, color, format]);

    const downloadOne = useCallback(async (r: ResultEntry) => {
        try {
            const res = await fetch(`${apiClient.getServerUrl()}/api/images/${r.processedName}/download`);
            if (!res.ok) throw new Error('Failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = r.displayName; a.click();
            URL.revokeObjectURL(url);
        } catch { alert('Download failed. Please try again.'); }
    }, []);

    const downloadAll = useCallback(async () => {
        if (!results) return;
        await apiClient.downloadBulkImages(results.map(r => r.processedName), results.map(r => r.displayName));
    }, [results]);

    const hasFiles = entries.length > 0;
    const showTool = hasFiles && !results;
    const multiImage = entries.length > 1;
    const activeEntry = entries[activeIdx] ?? entries[0];

    // ── Live preview overlay ──────────────────────────────────────────────────
    const PreviewOverlay = (
        <>
            {position === 'tile' ? (
                <div style={{
                    position: 'absolute', inset: 0, overflow: 'hidden',
                    display: 'flex', flexWrap: 'wrap', alignContent: 'space-around', justifyContent: 'space-around',
                    transform: 'rotate(-20deg) scale(1.4)', pointerEvents: 'none',
                }}>
                    {Array.from({ length: 24 }).map((_, idx) => (
                        <span key={idx} style={{
                            fontSize: `${Math.max(8, size * 1.2)}px`, fontWeight: 700,
                            color, opacity: opacity / 100, whiteSpace: 'nowrap', margin: '14px 22px',
                        }}>
                            {watermarkText || 'Watermark'}
                        </span>
                    ))}
                </div>
            ) : (
                <span style={{
                    ...positionStyle(position),
                    fontSize: `${Math.max(10, size * 1.6)}px`, fontWeight: 700,
                    color, opacity: opacity / 100, whiteSpace: 'nowrap', pointerEvents: 'none',
                    fontFamily: 'Arial, Helvetica, sans-serif',
                }}>
                    {watermarkText || 'Watermark'}
                </span>
            )}
        </>
    );

    // ── Options panel ──────────────────────────────────────────────────────
    const OptionsPanel = (
        <div className="wm-options" style={{
            width: '300px', flexShrink: 0,
            position: 'sticky', top: '80px',
            background: '#fff', border: `1px solid ${c.border}`,
            borderRadius: '18px', padding: '22px',
        }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: c.text, marginBottom: '16px' }}>
                Watermark options
            </h3>

            {/* Text */}
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>
                Watermark text
            </label>
            <input
                type="text"
                value={watermarkText}
                onChange={e => setWatermarkText(e.target.value.slice(0, 120))}
                placeholder="© Your Brand"
                style={{ width: '100%', border: `1.5px solid ${c.border}`, borderRadius: '8px', padding: '8px 10px', fontSize: '0.85rem', color: c.text, outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }}
            />

            {/* Position grid */}
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '8px' }}>
                Position
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '10px' }}>
                {POSITIONS.map(p => (
                    <button key={p.id} type="button" title={p.label} onClick={() => setPosition(p.id)}
                        style={{
                            aspectRatio: '1', borderRadius: '8px', cursor: 'pointer',
                            border: `1.5px solid ${position === p.id ? c.accent : c.border}`,
                            background: position === p.id ? c.accentLight : '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                        }}>
                        <span style={{
                            width: '8px', height: '8px', borderRadius: '2px',
                            background: position === p.id ? c.accent : c.gray300,
                        }} />
                    </button>
                ))}
            </div>
            <button type="button" onClick={() => setPosition('tile')}
                style={{
                    width: '100%', padding: '8px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                    border: `1.5px solid ${position === 'tile' ? c.accent : c.border}`,
                    background: position === 'tile' ? c.accentLight : '#fff',
                    color: position === 'tile' ? c.accent : c.text,
                    fontSize: '0.82rem', fontWeight: 600, marginBottom: '16px', transition: 'all 0.15s',
                }}>
                Repeat / tile
            </button>

            {/* Opacity */}
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: c.textSecondary, display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Opacity</span><span>{opacity}%</span>
            </label>
            <input type="range" min={5} max={100} value={opacity} onChange={e => setOpacity(parseInt(e.target.value))}
                style={{ width: '100%', marginBottom: '16px', accentColor: c.accent }} />

            {/* Size */}
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: c.textSecondary, display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Text size</span><span>{size}%</span>
            </label>
            <input type="range" min={1} max={20} value={size} onChange={e => setSize(parseInt(e.target.value))}
                style={{ width: '100%', marginBottom: '16px', accentColor: c.accent }} />

            {/* Color */}
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>
                Color
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <input type="color" value={color} onChange={e => setColor(e.target.value)}
                    style={{ width: '38px', height: '32px', border: `1.5px solid ${c.border}`, borderRadius: '8px', cursor: 'pointer', padding: '2px', background: '#fff' }} />
                <input type="text" value={color} onChange={e => setColor(e.target.value)}
                    style={{ flex: 1, border: `1.5px solid ${c.border}`, borderRadius: '8px', padding: '8px 10px', fontSize: '0.85rem', color: c.text, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* Format */}
            <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: '16px', marginBottom: '16px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '6px' }}>Save as</label>
                <select value={format} onChange={e => setFormat(e.target.value)}
                    style={{ width: '100%', border: `1.5px solid ${c.border}`, borderRadius: '8px', padding: '8px 10px', fontSize: '0.85rem', background: '#fff', color: c.text, cursor: 'pointer', outline: 'none' }}>
                    <option value="">Same as original</option>
                    <option value="webp">WebP — smallest size</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="avif">AVIF</option>
                </select>
            </div>

            {error && <div style={{ padding: '10px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: c.error, fontSize: '0.82rem', marginBottom: '12px' }}>{error}</div>}

            <button type="button" disabled={processing || !watermarkText.trim()} onClick={handleProcess}
                style={{
                    display: 'block', width: '100%', padding: '14px',
                    background: (processing || !watermarkText.trim()) ? c.textMuted : c.accent,
                    color: '#fff', border: 'none', borderRadius: '12px',
                    fontSize: '0.97rem', fontWeight: 700,
                    cursor: (processing || !watermarkText.trim()) ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s', textAlign: 'center',
                }}
                onMouseEnter={e => { if (!processing && watermarkText.trim()) (e.currentTarget as HTMLButtonElement).style.background = c.accentDark; }}
                onMouseLeave={e => { if (!processing && watermarkText.trim()) (e.currentTarget as HTMLButtonElement).style.background = c.accent; }}
            >
                {processing ? `Adding watermark… ${processed} / ${entries.length}` : `Watermark ${entries.length} image${entries.length !== 1 ? 's' : ''}`}
            </button>

            {processing && (
                <div style={{ marginTop: '12px' }}>
                    <div style={{ height: '4px', background: c.bgMuted, borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: c.accent, borderRadius: '999px', transition: 'width 0.3s ease', width: `${(processed / entries.length) * 100}%` }} />
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.78rem', color: c.textMuted, marginTop: '6px' }}>{processed} of {entries.length} done</p>
                </div>
            )}
        </div>
    );

    return (
        <div style={embedded
            ? { background: 'transparent', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: c.text }
            : { minHeight: '100vh', background: '#fff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: c.text }}>
            {!embedded && <Header />}

            {/* Hero */}
            {!embedded && (
                <div style={{ textAlign: 'center', padding: '40px 24px 24px' }}>
                    <h1 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 800, color: c.text, marginBottom: '8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        Add a watermark
                    </h1>
                    <p style={{ color: c.textMuted, fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto', lineHeight: 1.6 }}>
                        Stamp your name, logo text, or copyright notice across your photos. Batch watermark up to 50 images at once.
                    </p>
                </div>
            )}

            {/* ── Drop zone ── */}
            {!hasFiles && !results && (
                <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px 80px' }}>
                    <div
                        {...getRootProps()}
                        style={{
                            border: `2px dashed ${isDragActive ? c.accent : c.border}`,
                            borderRadius: '20px',
                            background: isDragActive ? c.accentLight : c.bgSubtle,
                            padding: '64px 24px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'border-color 0.2s, background 0.2s',
                        }}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p style={{ color: c.accent, fontWeight: 700, fontSize: '1.1rem' }}>Release to add your images</p>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                    <Droplets size={40} color={c.gray300} />
                                </div>
                                <button type="button"
                                    style={{ background: c.accent, color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 36px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: '14px', transition: 'background 0.15s' }}
                                    onClick={e => { e.stopPropagation(); openPicker(); }}
                                    onMouseEnter={e => (e.currentTarget.style.background = c.accentDark)}
                                    onMouseLeave={e => (e.currentTarget.style.background = c.accent)}>
                                    Select images to watermark
                                </button>
                                <p style={{ color: c.textMuted, fontSize: '0.88rem', marginTop: '4px' }}>or drag and drop your images here</p>
                                <p style={{ color: c.textMuted, fontSize: '0.78rem', marginTop: '6px' }}>
                                    JPG · PNG · WebP · AVIF · GIF · TIFF · BMP · HEIC &nbsp;|&nbsp; Max 50 files · 100 MB each
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── Split-panel tool ── */}
            {showTool && (
                <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px 80px' }}>
                    <div className="wm-split" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                        {/* LEFT: Preview + thumbnails */}
                        <div style={{ flex: '1 1 0', minWidth: 0 }}>

                            {activeEntry && (
                                <div style={{
                                    position: 'relative',
                                    width: '100%', margin: '0 auto 14px',
                                    background: c.bgMuted, border: `1px solid ${c.border}`,
                                    borderRadius: '16px', overflow: 'hidden',
                                    minHeight: '240px', maxHeight: '520px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <img
                                        src={activeEntry.localUrl}
                                        alt={activeEntry.name}
                                        style={{ display: 'block', width: '100%', maxHeight: '520px', objectFit: 'contain' }}
                                        draggable={false}
                                    />
                                    {PreviewOverlay}
                                </div>
                            )}

                            {/* Thumbnail row */}
                            {multiImage && (
                                <div className="wm-thumb-row" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
                                    {entries.map((entry, i) => {
                                        const isActive = i === activeIdx;
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => setActiveIdx(i)}
                                                style={{
                                                    position: 'relative',
                                                    flexShrink: 0,
                                                    width: '100px',
                                                    height: '100px',
                                                    borderRadius: '10px',
                                                    overflow: 'hidden',
                                                    border: isActive ? `2.5px solid ${c.accent}` : `1.5px solid ${c.border}`,
                                                    cursor: 'pointer',
                                                    boxShadow: isActive ? `0 0 0 3px ${c.accentLight}` : 'none',
                                                    transition: 'border-color 0.15s, box-shadow 0.15s',
                                                    scrollSnapAlign: 'start',
                                                }}
                                            >
                                                <img
                                                    src={entry.localUrl}
                                                    alt={entry.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={e => { e.stopPropagation(); removeEntry(i); }}
                                                    style={{
                                                        position: 'absolute', top: '4px', right: '4px',
                                                        background: 'rgba(0,0,0,0.5)', color: '#fff',
                                                        border: 'none', borderRadius: '50%', width: '20px', height: '20px',
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        transition: 'background 0.15s', flexShrink: 0,
                                                    }}
                                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.85)')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.5)')}
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Single image: show filename + size */}
                            {!multiImage && activeEntry && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: c.bgSubtle, borderRadius: '10px', border: `1px solid ${c.border}` }}>
                                    <span style={{ flex: 1, fontSize: '0.85rem', color: c.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeEntry.name}</span>
                                    <span style={{ fontSize: '0.78rem', color: c.textMuted, whiteSpace: 'nowrap' }}>{fmtBytes(activeEntry.file.size)}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeEntry(0)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, display: 'flex', alignItems: 'center', padding: '2px', borderRadius: '4px', transition: 'color 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = c.error)}
                                        onMouseLeave={e => (e.currentTarget.style.color = c.textMuted)}
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            )}

                            {/* Add more button */}
                            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input ref={addMoreRef} type="file" multiple accept="image/*,.heic,.heif" style={{ display: 'none' }}
                                    onChange={e => { if (e.target.files) { addFiles(Array.from(e.target.files)); e.target.value = ''; } }} />
                                <button type="button"
                                    onClick={() => addMoreRef.current?.click()}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 14px', border: `1.5px dashed ${c.border}`,
                                        borderRadius: '8px', background: 'none', color: c.textMuted,
                                        fontSize: '0.85rem', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s',
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = c.accent; (e.currentTarget as HTMLButtonElement).style.color = c.accent; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = c.border; (e.currentTarget as HTMLButtonElement).style.color = c.textMuted; }}
                                >
                                    <Plus size={13} />
                                    Add more
                                </button>
                                <span style={{ fontSize: '0.82rem', color: c.textMuted }}>
                                    {entries.length} image{entries.length !== 1 ? 's' : ''} selected
                                </span>
                            </div>
                        </div>

                        {/* RIGHT: Options panel */}
                        {OptionsPanel}
                    </div>
                </div>
            )}

            {/* ── Results ── */}
            {results && summary && (
                <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 80px' }}>
                    <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '16px', padding: '24px 20px', textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                            <CheckCircle size={32} color="#16a34a" />
                        </div>
                        <div style={{ fontSize: '0.95rem', color: '#166534', fontWeight: 600 }}>
                            {results.length} {results.length === 1 ? 'image' : 'images'} watermarked
                        </div>
                        <div style={{ fontSize: '0.85rem', color: c.gray500, marginTop: '4px' }}>
                            {fmtBytes(summary.totalProcessedSize)} total · ready to download
                        </div>
                    </div>

                    <button type="button"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', marginBottom: '12px', background: c.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.97rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' }}
                        onClick={downloadAll}
                        onMouseEnter={e => (e.currentTarget.style.background = c.accentDark)}
                        onMouseLeave={e => (e.currentTarget.style.background = c.accent)}
                    >
                        <Download size={16} />
                        {results.length > 1 ? `Download all ${results.length} as ZIP` : 'Download watermarked file'}
                    </button>

                    <div style={{ border: `1px solid ${c.border}`, borderRadius: '12px', overflow: 'hidden' }}>
                        {results.map((r, i) => (
                            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderBottom: i < results.length - 1 ? `1px solid ${c.bgMuted}` : 'none', background: i % 2 === 0 ? '#fff' : c.bgSubtle }}>
                                {r.localUrl
                                    ? <img src={r.localUrl} alt={r.displayName} style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', background: c.bgMuted, flexShrink: 0 }} />
                                    : <div style={{ width: '38px', height: '38px', borderRadius: '6px', background: c.bgMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <ImageIcon size={18} color={c.gray300} />
                                    </div>
                                }
                                <span style={{ flex: 1, fontSize: '0.86rem', color: c.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.displayName}</span>
                                <span style={{ fontSize: '0.78rem', color: c.textMuted, whiteSpace: 'nowrap' }}>{r.width} × {r.height}</span>
                                <span style={{ fontSize: '0.78rem', color: c.textMuted, whiteSpace: 'nowrap' }}>{fmtBytes(r.processedSize)}</span>
                                <button type="button"
                                    style={{ background: 'none', border: `1.5px solid ${c.border}`, borderRadius: '8px', color: c.textSecondary, fontSize: '0.8rem', fontWeight: 600, padding: '5px 12px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px', transition: 'border-color 0.15s' }}
                                    onClick={() => downloadOne(r)}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = c.accent)}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = c.border)}
                                >
                                    <Download size={13} />
                                    Save
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Sign-up nudge */}
                    <div style={{ marginTop: '16px', padding: '14px 16px', background: '#fdf3f1', border: '1px solid #fce4dc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: c.text }}>Save your watermark settings</div>
                            <div style={{ fontSize: '0.78rem', color: c.textMuted, marginTop: '2px' }}>Free account — track every file you&apos;ve processed.</div>
                        </div>
                        <button type="button"
                            onClick={() => window.dispatchEvent(new Event('open-auth-modal'))}
                            style={{ background: c.accent, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.background = c.accentDark)}
                            onMouseLeave={e => (e.currentTarget.style.background = c.accent)}>
                            Sign up free
                        </button>
                    </div>

                    <button type="button" onClick={reset}
                        style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '20px', color: c.textMuted, fontSize: '0.88rem', cursor: 'pointer', background: 'none', border: 'none', padding: '8px', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                        Watermark more images
                    </button>
                </div>
            )}

            {/* ── Responsive styles ── */}
            <style>{`
                @media (max-width: 700px) {
                    .wm-split { flex-direction: column !important; }
                    .wm-options { width: 100% !important; position: static !important; }
                }
                .wm-thumb-row::-webkit-scrollbar { display: none; }
                @media (max-width: 700px) {
                    .wm-thumb-row {
                        mask-image: linear-gradient(to right, transparent 0, black 36px, black calc(100% - 36px), transparent 100%);
                        -webkit-mask-image: linear-gradient(to right, transparent 0, black 36px, black calc(100% - 36px), transparent 100%);
                        padding: 0 4px;
                    }
                }
            `}</style>

            {!embedded && <Footer />}
        </div>
    );
}

export default function WatermarkPage(): React.JSX.Element {
    return <WatermarkTool />;
}
