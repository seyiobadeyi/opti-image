'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Lock, Unlock, Image as ImageIcon, X, CheckCircle, Download, Plus, ArrowRight } from 'lucide-react';
import { apiClient } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { c } from '@/lib/colors';
import type { ProcessedImage, ProcessingSummary } from '@/types';

function fmtBytes(b: number): string {
    if (!b) return '0 B';
    const k = 1024, s = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + s[i];
}
function stripExt(n: string): string { return n.replace(/\.[^.]+$/, ''); }

interface FileEntry { file: File; localUrl: string; name: string; }
interface ImageDims { w: number; h: number; }
interface ResultEntry extends ProcessedImage { displayName: string; localUrl?: string; }
interface PerImageSetting { width: string; height: string; }

type ResizeMode = 'px' | 'pct';

const PCT_PRESETS = [
    { label: '25% smaller', value: 75 },
    { label: '50% smaller', value: 50 },
    { label: '75% smaller', value: 25 },
];

const PREVIEW_MAX_H = 380;

export function ResizeTool({ embedded = false }: { embedded?: boolean }): React.JSX.Element {
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [mode, setMode] = useState<ResizeMode>('px');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [keepAspect, setKeepAspect] = useState(true);
    const [pct, setPct] = useState(50);
    const [pctPreset, setPctPreset] = useState<number | null>(50);
    const [format, setFormat] = useState('');
    const [processing, setProcessing] = useState(false);
    const [processed, setProcessed] = useState(0);
    const [results, setResults] = useState<ResultEntry[] | null>(null);
    const [summary, setSummary] = useState<ProcessingSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imageDims, setImageDims] = useState<Record<number, ImageDims>>({});
    const [applyToAll, setApplyToAll] = useState(true);
    const [activeIdx, setActiveIdx] = useState(0);
    const [perImageSettings, setPerImageSettings] = useState<PerImageSetting[]>([]);
    const addMoreRef = useRef<HTMLInputElement>(null);

    // Load natural dimensions for entries
    useEffect(() => {
        entries.forEach((entry, i) => {
            if (imageDims[i]) return;
            const img = new Image();
            img.onload = () => setImageDims(prev => ({ ...prev, [i]: { w: img.naturalWidth, h: img.naturalHeight } }));
            img.src = entry.localUrl;
        });
    }, [entries]);

    // Keep perImageSettings in sync with entries length
    useEffect(() => {
        setPerImageSettings(prev => entries.map((_, i) => prev[i] ?? { width: '', height: '' }));
    }, [entries.length]);

    // ── Current width/height (global or per-image) ──────────────────────────
    const curW = applyToAll ? width : (perImageSettings[activeIdx]?.width ?? '');
    const curH = applyToAll ? height : (perImageSettings[activeIdx]?.height ?? '');

    const setCurW = useCallback((val: string) => {
        if (applyToAll) setWidth(val);
        else setPerImageSettings(prev => prev.map((s, i) => i === activeIdx ? { ...s, width: val } : s));
    }, [applyToAll, activeIdx]);

    const setCurH = useCallback((val: string) => {
        if (applyToAll) setHeight(val);
        else setPerImageSettings(prev => prev.map((s, i) => i === activeIdx ? { ...s, height: val } : s));
    }, [applyToAll, activeIdx]);

    const handleWidthChange = useCallback((val: string) => {
        setCurW(val);
        if (keepAspect) {
            const dims = imageDims[applyToAll ? 0 : activeIdx];
            if (dims && val) {
                const n = parseInt(val);
                if (!isNaN(n) && n > 0) setCurH(String(Math.round(n * dims.h / dims.w)));
            } else if (!val) {
                setCurH('');
            }
        }
    }, [keepAspect, imageDims, applyToAll, activeIdx, setCurW, setCurH]);

    const handleHeightChange = useCallback((val: string) => {
        setCurH(val);
        if (keepAspect) {
            const dims = imageDims[applyToAll ? 0 : activeIdx];
            if (dims && val) {
                const n = parseInt(val);
                if (!isNaN(n) && n > 0) setCurW(String(Math.round(n * dims.w / dims.h)));
            } else if (!val) {
                setCurW('');
            }
        }
    }, [keepAspect, imageDims, applyToAll, activeIdx, setCurW, setCurH]);

    // ── Compute preview target dimensions ───────────────────────────────────
    const activeDims = imageDims[activeIdx];
    const previewTargetW = (() => {
        if (mode === 'pct') return activeDims ? Math.round(activeDims.w * pct / 100) : null;
        const w = parseInt(curW);
        if (!isNaN(w) && w > 0) return w;
        if (keepAspect && curH && activeDims) {
            const h = parseInt(curH);
            if (!isNaN(h) && h > 0) return Math.round(h * activeDims.w / activeDims.h);
        }
        return null;
    })();
    const previewTargetH = (() => {
        if (mode === 'pct') return activeDims ? Math.round(activeDims.h * pct / 100) : null;
        const h = parseInt(curH);
        if (!isNaN(h) && h > 0) return h;
        if (keepAspect && curW && activeDims) {
            const w = parseInt(curW);
            if (!isNaN(w) && w > 0) return Math.round(w * activeDims.h / activeDims.w);
        }
        return null;
    })();

    // Scale preview dims to fit box while showing distortion when not keeping AR
    const getPreviewImgStyle = (): React.CSSProperties => {
        const MAX_W = 800, MAX_H = PREVIEW_MAX_H;
        if (!previewTargetW || !previewTargetH || keepAspect || mode !== 'px') {
            return { maxWidth: '100%', maxHeight: `${MAX_H}px`, width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' };
        }
        const scale = Math.min(MAX_W / previewTargetW, MAX_H / previewTargetH, 1);
        return {
            width: `${Math.round(previewTargetW * scale)}px`,
            height: `${Math.round(previewTargetH * scale)}px`,
            objectFit: 'fill',
            display: 'block',
            transition: 'width 0.25s ease, height 0.25s ease',
        };
    };

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
        setImageDims(prev => {
            const next: Record<number, ImageDims> = {};
            Object.entries(prev).forEach(([k, v]) => {
                const idx = parseInt(k);
                if (idx < i) next[idx] = v;
                else if (idx > i) next[idx - 1] = v;
            });
            return next;
        });
        setActiveIdx(a => (a >= i && a > 0) ? a - 1 : a);
    }, []);

    const reset = useCallback(() => {
        entries.forEach(e => URL.revokeObjectURL(e.localUrl));
        setEntries([]); setResults(null); setSummary(null); setError(null);
        setProcessed(0); setImageDims({}); setActiveIdx(0); setPerImageSettings([]);
    }, [entries]);

    const { getRootProps, getInputProps, isDragActive, open: openPicker } = useDropzone({
        onDrop: addFiles,
        accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/avif': ['.avif'], 'image/tiff': ['.tif', '.tiff'], 'image/gif': ['.gif'], 'image/bmp': ['.bmp'], 'image/heic': ['.heic'], 'image/heif': ['.heif'] },
        maxFiles: 50, maxSize: 100 * 1024 * 1024, disabled: processing,
    });

    // ── Process ──────────────────────────────────────────────────────────────
    const handleProcess = useCallback(async () => {
        if (!entries.length || processing) return;
        if (mode === 'px' && !width && !height) { setError('Enter a width, height, or both.'); return; }

        setProcessing(true); setError(null); setResults(null); setSummary(null); setProcessed(0);
        const allResults: ResultEntry[] = [];
        let totalOrig = 0, totalProc = 0;

        try {
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i]!;
                const namedFile = new File([entry.file], entry.file.name, { type: entry.file.type });
                const iW = applyToAll ? width : (perImageSettings[i]?.width ?? width);
                const iH = applyToAll ? height : (perImageSettings[i]?.height ?? height);

                let resizeOpts: { width?: number; height?: number; maintainAspectRatio?: boolean } = {};

                if (mode === 'px') {
                    resizeOpts = {
                        width: iW ? parseInt(iW) : undefined,
                        height: iH ? parseInt(iH) : undefined,
                        maintainAspectRatio: keepAspect,
                    };
                } else {
                    const dims = imageDims[i] ?? await new Promise<{ w: number; h: number }>((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
                        img.onerror = () => resolve({ w: 0, h: 0 });
                        img.src = entry.localUrl;
                    });
                    resizeOpts = {
                        width: dims.w ? Math.max(1, Math.round(dims.w * pct / 100)) : undefined,
                        height: dims.h ? Math.max(1, Math.round(dims.h * pct / 100)) : undefined,
                        maintainAspectRatio: false,
                    };
                }

                const resp = await apiClient.convertImages([namedFile], {
                    ...resizeOpts,
                    format: format as '' | 'jpeg' | 'png' | 'webp' | 'avif' | 'tiff' | 'gif',
                    quality: 90,
                });
                if (resp.success && resp.results[0]) {
                    const r = resp.results[0];
                    const ext = format || r.format;
                    allResults.push({ ...r, displayName: `${entry.name}.${ext}`, localUrl: entry.localUrl });
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
    }, [entries, processing, mode, width, height, keepAspect, pct, format, applyToAll, perImageSettings, imageDims]);

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

    // ── Options panel (shared between all/individual) ────────────────────────
    const OptionsPanel = (
        <div className="resize-options" style={{
            width: '300px', flexShrink: 0,
            position: 'sticky', top: '80px',
            background: '#fff', border: `1px solid ${c.border}`,
            borderRadius: '18px', padding: '22px',
        }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: c.text, marginBottom: !applyToAll && multiImage ? '4px' : '16px' }}>
                Resize options
            </h3>
            {!applyToAll && multiImage && (
                <p style={{ fontSize: '0.75rem', color: c.textMuted, marginBottom: '14px' }}>
                    Image {activeIdx + 1} of {entries.length}
                </p>
            )}

            {/* Mode toggle */}
            <div style={{ display: 'flex', background: c.bgMuted, borderRadius: '10px', padding: '3px', marginBottom: '18px' }}>
                {(['px', 'pct'] as ResizeMode[]).map(m => (
                    <button key={m} type="button" onClick={() => setMode(m)}
                        style={{
                            flex: 1, padding: '7px 0', fontSize: '0.85rem', fontWeight: 600,
                            borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: mode === m ? '#fff' : 'transparent',
                            color: mode === m ? c.text : c.textMuted,
                            boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.15s',
                        }}
                    >{m === 'px' ? 'By pixels' : 'By %'}</button>
                ))}
            </div>

            {/* Pixel mode */}
            {mode === 'px' && (
                <>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '4px' }}>Width (px)</label>
                            <input type="number" min={1} max={10000} placeholder="e.g. 1920" value={curW}
                                onChange={e => handleWidthChange(e.target.value)}
                                style={{ width: '100%', border: `1.5px solid ${c.border}`, borderRadius: '8px', padding: '8px 10px', fontSize: '0.88rem', background: '#fff', color: c.text, outline: 'none', boxSizing: 'border-box' }}
                                onFocus={e => (e.currentTarget.style.borderColor = c.accent)}
                                onBlur={e => (e.currentTarget.style.borderColor = c.border)}
                            />
                        </div>

                        <button type="button" onClick={() => setKeepAspect(!keepAspect)}
                            title={keepAspect ? 'Lock aspect ratio (click to unlock)' : 'Aspect ratio unlocked (click to lock)'}
                            style={{
                                width: '32px', height: '32px', marginBottom: '1px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: keepAspect ? c.accentLight : c.bgMuted,
                                border: `1.5px solid ${keepAspect ? c.accent : c.border}`,
                                borderRadius: '8px', cursor: 'pointer', flexShrink: 0,
                                transition: 'all 0.15s',
                            }}>
                            {keepAspect
                                ? <Lock size={13} color={c.accent} />
                                : <Unlock size={13} color={c.textMuted} />
                            }
                        </button>

                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '4px' }}>Height (px)</label>
                            <input type="number" min={1} max={10000} placeholder="e.g. 1080" value={curH}
                                onChange={e => handleHeightChange(e.target.value)}
                                style={{ width: '100%', border: `1.5px solid ${c.border}`, borderRadius: '8px', padding: '8px 10px', fontSize: '0.88rem', background: '#fff', color: c.text, outline: 'none', boxSizing: 'border-box' }}
                                onFocus={e => (e.currentTarget.style.borderColor = c.accent)}
                                onBlur={e => (e.currentTarget.style.borderColor = c.border)}
                            />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.73rem', color: c.textMuted, marginBottom: '14px', minHeight: '1.2em' }}>
                        {keepAspect ? 'Aspect ratio locked — enter one value to auto-fill the other.' : 'Both values set — image will be stretched to exact dimensions.'}
                    </p>
                </>
            )}

            {/* Percentage mode */}
            {mode === 'pct' && (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                        {PCT_PRESETS.map(p => (
                            <button key={p.value} type="button" onClick={() => { setPct(p.value); setPctPreset(p.value); }}
                                style={{
                                    padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left',
                                    border: `1.5px solid ${pctPreset === p.value ? c.accent : c.border}`,
                                    background: pctPreset === p.value ? c.accentLight : '#fff',
                                    transition: 'all 0.15s',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: pctPreset === p.value ? c.accent : c.text }}>{p.label}</span>
                                <span style={{ fontSize: '0.78rem', color: c.textMuted }}>{p.value}%</span>
                            </button>
                        ))}
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '4px' }}>Custom scale</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input type="range" min={10} max={200} step={5} value={pct}
                                onChange={e => { setPct(Number(e.target.value)); setPctPreset(null); }}
                                style={{ flex: 1, accentColor: c.accent, cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: c.accent, minWidth: '44px', textAlign: 'right' }}>{pct}%</span>
                        </div>
                    </div>
                </>
            )}

            {/* Format */}
            <div style={{ borderTop: `1px solid ${c.border}`, margin: '16px 0', paddingTop: '16px' }}>
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

            <button type="button" disabled={processing} onClick={handleProcess}
                style={{
                    display: 'block', width: '100%', padding: '14px',
                    background: processing ? c.textMuted : c.accent,
                    color: '#fff', border: 'none', borderRadius: '12px',
                    fontSize: '0.97rem', fontWeight: 700,
                    cursor: processing ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s', textAlign: 'center',
                }}
                onMouseEnter={e => { if (!processing) (e.currentTarget as HTMLButtonElement).style.background = c.accentDark; }}
                onMouseLeave={e => { if (!processing) (e.currentTarget as HTMLButtonElement).style.background = c.accent; }}
            >
                {processing ? `Resizing… ${processed} / ${entries.length}` : `Resize ${entries.length} image${entries.length !== 1 ? 's' : ''}`}
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
                        Resize images
                    </h1>
                    <p style={{ color: c.textMuted, fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto', lineHeight: 1.6 }}>
                        Set exact pixel dimensions or scale by percentage. Batch resize up to 50 images at once.
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
                                    <ImageIcon size={40} color={c.gray300} />
                                </div>
                                <button type="button"
                                    style={{ background: c.accent, color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 36px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: '14px', transition: 'background 0.15s' }}
                                    onClick={e => { e.stopPropagation(); openPicker(); }}
                                    onMouseEnter={e => (e.currentTarget.style.background = c.accentDark)}
                                    onMouseLeave={e => (e.currentTarget.style.background = c.accent)}>
                                    Select images to resize
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

                    {/* Apply to all / individual toggle (multiple images only) */}
                    {multiImage && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '14px 16px', background: c.bgSubtle, borderRadius: '12px', border: `1px solid ${c.border}` }}>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={applyToAll}
                                onClick={() => setApplyToAll(v => !v)}
                                style={{
                                    position: 'relative', width: '36px', height: '20px', border: 'none', cursor: 'pointer', padding: 0,
                                    background: applyToAll ? c.accent : c.gray300,
                                    borderRadius: '10px', transition: 'background 0.2s', flexShrink: 0,
                                }}
                            >
                                <span style={{
                                    position: 'absolute', top: '3px',
                                    left: applyToAll ? '19px' : '3px',
                                    width: '14px', height: '14px',
                                    background: '#fff', borderRadius: '50%',
                                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                }} />
                            </button>
                            <div>
                                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: c.text }}>
                                    {applyToAll ? 'Apply same settings to all images' : 'Adjust images individually'}
                                </span>
                                <span style={{ fontSize: '0.78rem', color: c.textMuted, marginLeft: '8px' }}>
                                    {applyToAll ? '— click to adjust per image' : '— click a thumbnail to edit its settings'}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="resize-split" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                        {/* LEFT: Preview + thumbnails */}
                        <div style={{ flex: '1 1 0', minWidth: 0 }}>

                            {/* Main image preview */}
                            {activeEntry && (
                                <div
                                    {...getRootProps({ onClick: e => e.preventDefault() })}
                                    style={{
                                        position: 'relative',
                                        background: isDragActive ? c.accentLight : c.bgMuted,
                                        border: isDragActive ? `2px dashed ${c.accent}` : `1px solid ${c.border}`,
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        marginBottom: '14px',
                                        minHeight: '200px',
                                        maxHeight: `${PREVIEW_MAX_H}px`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'border-color 0.2s, background 0.2s',
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    {isDragActive && (
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, pointerEvents: 'none' }}>
                                            <span style={{ color: c.accent, fontWeight: 700, fontSize: '1.1rem', background: 'rgba(255,255,255,0.9)', padding: '10px 20px', borderRadius: '10px' }}>Drop to add more</span>
                                        </div>
                                    )}
                                    <img
                                        src={activeEntry.localUrl}
                                        alt={activeEntry.name}
                                        style={getPreviewImgStyle()}
                                    />
                                    {/* Dimension badge */}
                                    <div style={{
                                        position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
                                        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
                                        color: '#fff', borderRadius: '20px', padding: '5px 14px',
                                        fontSize: '0.78rem', fontWeight: 600,
                                        display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap',
                                        maxWidth: 'calc(100% - 24px)',
                                    }}>
                                        <span>{activeDims ? `${activeDims.w} × ${activeDims.h}` : activeEntry.name}</span>
                                        {(previewTargetW || previewTargetH) && (
                                            <>
                                                <ArrowRight size={11} color="rgba(255,255,255,0.7)" />
                                                <span style={{ color: '#fbbf24' }}>
                                                    {previewTargetW ?? '?'} × {previewTargetH ?? '?'}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Thumbnail row (shown when >1 image, or always as the grid) */}
                            {multiImage && (
                                <div className="resize-thumb-row" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
                                    {entries.map((entry, i) => {
                                        const isActive = i === activeIdx;
                                        const perSetting = perImageSettings[i];
                                        const hasSetting = !applyToAll && perSetting && (perSetting.width || perSetting.height);
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
                                                {hasSetting && (
                                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.55)', padding: '3px 5px', fontSize: '0.6rem', color: '#fff', textAlign: 'center', fontWeight: 600 }}>
                                                        {perSetting.width || '?'} × {perSetting.height || '?'}
                                                    </div>
                                                )}
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

                            {/* Single image: show filename + size + remove */}
                            {!multiImage && activeEntry && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: c.bgSubtle, borderRadius: '10px', border: `1px solid ${c.border}` }}>
                                    <span style={{ flex: 1, fontSize: '0.85rem', color: c.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeEntry.name}</span>
                                    <span style={{ fontSize: '0.78rem', color: c.textMuted, whiteSpace: 'nowrap' }}>{fmtBytes(activeEntry.file.size)}</span>
                                    {activeDims && (
                                        <span style={{ fontSize: '0.78rem', color: c.textMuted, whiteSpace: 'nowrap' }}>{activeDims.w} × {activeDims.h}</span>
                                    )}
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
                            {results.length} {results.length === 1 ? 'image' : 'images'} resized
                        </div>
                        <div style={{ fontSize: '0.85rem', color: c.gray500, marginTop: '4px' }}>
                            {fmtBytes(summary.totalOriginalSize)} total · ready to download
                        </div>
                    </div>

                    <button type="button"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', marginBottom: '12px', background: c.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.97rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' }}
                        onClick={downloadAll}
                        onMouseEnter={e => (e.currentTarget.style.background = c.accentDark)}
                        onMouseLeave={e => (e.currentTarget.style.background = c.accent)}
                    >
                        <Download size={16} />
                        {results.length > 1 ? `Download all ${results.length} as ZIP` : 'Download resized file'}
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
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: c.text }}>Save your resize history</div>
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
                        Resize more images
                    </button>
                </div>
            )}

            {/* ── Responsive styles ── */}
            <style>{`
                @media (max-width: 700px) {
                    .resize-split { flex-direction: column !important; }
                    .resize-options { width: 100% !important; position: static !important; }
                }
                .resize-thumb-row::-webkit-scrollbar { display: none; }
                @media (max-width: 700px) {
                    .resize-thumb-row {
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

export default function ResizePage(): React.JSX.Element {
    return <ResizeTool />;
}
