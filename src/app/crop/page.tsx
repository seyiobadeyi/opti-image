'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, X, CheckCircle, Download, Plus, Crop as CropIcon } from 'lucide-react';
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

/** Crop box in percent of the image's natural dimensions. */
interface Box { x: number; y: number; w: number; h: number; }

const MIN_SIZE = 5; // percent
const PREVIEW_MAX_W = 640;

const ASPECTS: { id: string; label: string; ratio: number | null }[] = [
    { id: 'free', label: 'Freeform', ratio: null },
    { id: '1:1', label: 'Square', ratio: 1 },
    { id: '4:3', label: '4:3', ratio: 4 / 3 },
    { id: '3:4', label: '3:4', ratio: 3 / 4 },
    { id: '16:9', label: '16:9', ratio: 16 / 9 },
    { id: '9:16', label: '9:16', ratio: 9 / 16 },
    { id: '3:2', label: '3:2', ratio: 3 / 2 },
    { id: '2:3', label: '2:3', ratio: 2 / 3 },
];

type Handle = 'move' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

function clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
}

function clampBox(b: Box): Box {
    let { x, y, w, h } = b;
    w = clamp(w, MIN_SIZE, 100);
    h = clamp(h, MIN_SIZE, 100);
    x = clamp(x, 0, 100 - w);
    y = clamp(y, 0, 100 - h);
    return { x, y, w, h };
}

/** Largest centered box matching `ratio` (target width/height in pixels). */
function centeredBox(imgW: number, imgH: number, ratio: number | null): Box {
    if (!ratio || !imgW || !imgH) return { x: 0, y: 0, w: 100, h: 100 };
    const imgRatio = imgW / imgH;
    const pctRatio = ratio / imgRatio; // w% / h%
    let w: number, h: number;
    if (pctRatio <= 1) {
        h = 100;
        w = 100 * pctRatio;
    } else {
        w = 100;
        h = 100 / pctRatio;
    }
    return { x: (100 - w) / 2, y: (100 - h) / 2, w, h };
}

function resizeBox(start: Box, handle: Handle, dxPct: number, dyPct: number, pctRatio: number | null): Box {
    if (handle === 'move') {
        return { ...start, x: start.x + dxPct, y: start.y + dyPct };
    }

    // Corner handles support aspect-ratio locking, anchored at the opposite corner.
    if (pctRatio && (handle === 'nw' || handle === 'ne' || handle === 'sw' || handle === 'se')) {
        const x2 = start.x + start.w;
        const y2 = start.y + start.h;
        switch (handle) {
            case 'se': {
                const w = start.w + dxPct;
                const h = w / pctRatio;
                return { x: start.x, y: start.y, w, h };
            }
            case 'nw': {
                const w = start.w - dxPct;
                const h = w / pctRatio;
                return { x: x2 - w, y: y2 - h, w, h };
            }
            case 'ne': {
                const w = start.w + dxPct;
                const h = w / pctRatio;
                return { x: start.x, y: y2 - h, w, h };
            }
            case 'sw': {
                const w = start.w - dxPct;
                const h = w / pctRatio;
                return { x: x2 - w, y: start.y, w, h };
            }
        }
    }

    let { x, y, w, h } = start;
    switch (handle) {
        case 'se': w += dxPct; h += dyPct; break;
        case 'sw': x += dxPct; w -= dxPct; h += dyPct; break;
        case 'ne': w += dxPct; y += dyPct; h -= dyPct; break;
        case 'nw': x += dxPct; y += dyPct; w -= dxPct; h -= dyPct; break;
        case 'n': y += dyPct; h -= dyPct; break;
        case 's': h += dyPct; break;
        case 'e': w += dxPct; break;
        case 'w': x += dxPct; w -= dxPct; break;
    }
    return { x, y, w, h };
}

const HANDLE_CURSORS: Record<Handle, string> = {
    move: 'move',
    n: 'ns-resize', s: 'ns-resize',
    e: 'ew-resize', w: 'ew-resize',
    ne: 'nesw-resize', sw: 'nesw-resize',
    nw: 'nwse-resize', se: 'nwse-resize',
};

/** Interactive crop-box overlay rendered on top of the active image preview. */
function CropOverlay({ box, onChange, ratio, imgW, imgH }: {
    box: Box;
    onChange: (b: Box) => void;
    ratio: number | null;
    imgW: number;
    imgH: number;
}): React.JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);
    const pctRatio = ratio && imgW && imgH ? ratio / (imgW / imgH) : null;

    const startDrag = useCallback((handle: Handle) => (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const startBox = box;
        const startX = e.clientX, startY = e.clientY;

        const onMove = (ev: PointerEvent) => {
            const dxPct = ((ev.clientX - startX) / rect.width) * 100;
            const dyPct = ((ev.clientY - startY) / rect.height) * 100;
            const next = clampBox(resizeBox(startBox, handle, dxPct, dyPct, pctRatio));
            onChange(next);
        };
        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    }, [box, onChange, pctRatio]);

    const cornerHandles: Handle[] = ['nw', 'ne', 'sw', 'se'];
    const edgeHandles: Handle[] = pctRatio ? [] : ['n', 's', 'e', 'w'];

    const handleStyle = (h: Handle): React.CSSProperties => {
        const base: React.CSSProperties = {
            position: 'absolute', cursor: HANDLE_CURSORS[h], touchAction: 'none',
        };
        const corner: React.CSSProperties = {
            width: '14px', height: '14px', background: '#fff',
            border: `2px solid ${c.accent}`, borderRadius: '3px',
        };
        const edgeBar: React.CSSProperties = { background: 'transparent' };
        switch (h) {
            case 'nw': return { ...base, ...corner, left: '-7px', top: '-7px' };
            case 'ne': return { ...base, ...corner, right: '-7px', top: '-7px' };
            case 'sw': return { ...base, ...corner, left: '-7px', bottom: '-7px' };
            case 'se': return { ...base, ...corner, right: '-7px', bottom: '-7px' };
            case 'n': return { ...base, ...edgeBar, left: '10px', right: '10px', top: '-6px', height: '12px' };
            case 's': return { ...base, ...edgeBar, left: '10px', right: '10px', bottom: '-6px', height: '12px' };
            case 'e': return { ...base, ...edgeBar, top: '10px', bottom: '10px', right: '-6px', width: '12px' };
            case 'w': return { ...base, ...edgeBar, top: '10px', bottom: '10px', left: '-6px', width: '12px' };
            default: return base;
        }
    };

    return (
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
            {/* Darkened mask outside the crop box */}
            <div
                onPointerDown={startDrag('move')}
                style={{
                    position: 'absolute',
                    left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%`,
                    boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
                    border: '1.5px solid #fff',
                    cursor: 'move', touchAction: 'none',
                }}
            >
                {/* Rule-of-thirds guide lines */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5 }}>
                    {[1, 2].map(i => (
                        <div key={`v${i}`} style={{ position: 'absolute', left: `${(i / 3) * 100}%`, top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.6)' }} />
                    ))}
                    {[1, 2].map(i => (
                        <div key={`h${i}`} style={{ position: 'absolute', top: `${(i / 3) * 100}%`, left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.6)' }} />
                    ))}
                </div>
                {[...cornerHandles, ...edgeHandles].map(h => (
                    <div key={h} onPointerDown={startDrag(h)} style={handleStyle(h)} />
                ))}
            </div>
        </div>
    );
}

export default function CropPage(): React.JSX.Element {
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [imageDims, setImageDims] = useState<Record<number, ImageDims>>({});
    const [cropBoxes, setCropBoxes] = useState<Record<number, Box>>({});
    const [aspectId, setAspectId] = useState('free');
    const [applyToAll, setApplyToAll] = useState(true);
    const [activeIdx, setActiveIdx] = useState(0);
    const [format, setFormat] = useState('');
    const [processing, setProcessing] = useState(false);
    const [processed, setProcessed] = useState(0);
    const [results, setResults] = useState<ResultEntry[] | null>(null);
    const [summary, setSummary] = useState<ProcessingSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const addMoreRef = useRef<HTMLInputElement>(null);

    const aspect = ASPECTS.find(a => a.id === aspectId) ?? ASPECTS[0]!;

    // Load natural dimensions for entries and seed their crop boxes.
    useEffect(() => {
        entries.forEach((entry, i) => {
            if (imageDims[i]) return;
            const img = new Image();
            img.onload = () => {
                const dims = { w: img.naturalWidth, h: img.naturalHeight };
                setImageDims(prev => ({ ...prev, [i]: dims }));
                setCropBoxes(prev => prev[i] ? prev : { ...prev, [i]: centeredBox(dims.w, dims.h, aspect.ratio) });
            };
            img.src = entry.localUrl;
        });
    }, [entries, imageDims, aspect.ratio]);

    const setActiveBox = useCallback((box: Box) => {
        setCropBoxes(prev => ({ ...prev, [activeIdx]: box }));
    }, [activeIdx]);

    const handleAspectChange = useCallback((id: string) => {
        setAspectId(id);
        const next = ASPECTS.find(a => a.id === id) ?? ASPECTS[0]!;
        setCropBoxes(prev => {
            const updated = { ...prev };
            const indices = applyToAll ? entries.map((_, i) => i) : [activeIdx];
            for (const i of indices) {
                const dims = imageDims[i];
                if (dims) updated[i] = centeredBox(dims.w, dims.h, next.ratio);
            }
            return updated;
        });
    }, [applyToAll, activeIdx, entries, imageDims]);

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
        const reindex = <T,>(rec: Record<number, T>): Record<number, T> => {
            const next: Record<number, T> = {};
            Object.entries(rec).forEach(([k, v]) => {
                const idx = parseInt(k);
                if (idx < i) next[idx] = v;
                else if (idx > i) next[idx - 1] = v;
            });
            return next;
        };
        setImageDims(reindex);
        setCropBoxes(reindex);
        setActiveIdx(a => (a >= i && a > 0) ? a - 1 : a);
    }, []);

    const reset = useCallback(() => {
        entries.forEach(e => URL.revokeObjectURL(e.localUrl));
        setEntries([]); setResults(null); setSummary(null); setError(null);
        setProcessed(0); setImageDims({}); setCropBoxes({}); setActiveIdx(0);
    }, [entries]);

    const { getRootProps, getInputProps, isDragActive, open: openPicker } = useDropzone({
        onDrop: addFiles,
        accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/avif': ['.avif'], 'image/tiff': ['.tif', '.tiff'], 'image/gif': ['.gif'], 'image/bmp': ['.bmp'], 'image/heic': ['.heic'], 'image/heif': ['.heif'] },
        maxFiles: 50, maxSize: 100 * 1024 * 1024, disabled: processing,
    });

    // ── Process ──────────────────────────────────────────────────────────────
    const handleProcess = useCallback(async () => {
        if (!entries.length || processing) return;

        setProcessing(true); setError(null); setResults(null); setSummary(null); setProcessed(0);
        const allResults: ResultEntry[] = [];
        let totalOrig = 0, totalProc = 0;

        try {
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i]!;
                const dims = imageDims[i];
                const box = cropBoxes[i] ?? (dims ? centeredBox(dims.w, dims.h, aspect.ratio) : { x: 0, y: 0, w: 100, h: 100 });

                const namedFile = new File([entry.file], entry.file.name, { type: entry.file.type });

                const cropOpts = dims ? {
                    cropLeft: Math.round((box.x / 100) * dims.w),
                    cropTop: Math.round((box.y / 100) * dims.h),
                    cropWidth: Math.max(1, Math.round((box.w / 100) * dims.w)),
                    cropHeight: Math.max(1, Math.round((box.h / 100) * dims.h)),
                } : {};

                const resp = await apiClient.convertImages([namedFile], {
                    ...cropOpts,
                    format: format as '' | 'jpeg' | 'png' | 'webp' | 'avif' | 'tiff' | 'gif',
                    quality: 90,
                });
                if (resp.success && resp.results[0]) {
                    const r = resp.results[0];
                    const ext = format || r.format;
                    allResults.push({ ...r, displayName: `${entry.name}-cropped.${ext}`, localUrl: entry.localUrl });
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
    }, [entries, processing, imageDims, cropBoxes, aspect.ratio, format]);

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
    const activeDims = imageDims[activeIdx];
    const activeBox = cropBoxes[activeIdx] ?? { x: 0, y: 0, w: 100, h: 100 };

    const cropPxW = activeDims ? Math.max(1, Math.round((activeBox.w / 100) * activeDims.w)) : null;
    const cropPxH = activeDims ? Math.max(1, Math.round((activeBox.h / 100) * activeDims.h)) : null;

    // ── Options panel ──────────────────────────────────────────────────────
    const OptionsPanel = (
        <div className="crop-options" style={{
            width: '300px', flexShrink: 0,
            position: 'sticky', top: '80px',
            background: '#fff', border: `1px solid ${c.border}`,
            borderRadius: '18px', padding: '22px',
        }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: c.text, marginBottom: '4px' }}>
                Crop options
            </h3>
            {multiImage && (
                <p style={{ fontSize: '0.75rem', color: c.textMuted, marginBottom: '14px' }}>
                    Image {activeIdx + 1} of {entries.length}
                </p>
            )}
            {!multiImage && <div style={{ marginBottom: '14px' }} />}

            {/* Aspect ratio presets */}
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: c.textSecondary, display: 'block', marginBottom: '8px' }}>
                Aspect ratio
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {ASPECTS.map(a => (
                    <button key={a.id} type="button" onClick={() => handleAspectChange(a.id)}
                        style={{
                            padding: '9px 8px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center',
                            border: `1.5px solid ${aspectId === a.id ? c.accent : c.border}`,
                            background: aspectId === a.id ? c.accentLight : '#fff',
                            color: aspectId === a.id ? c.accent : c.text,
                            fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.15s',
                        }}>
                        {a.label}
                    </button>
                ))}
            </div>

            {/* Crop dimensions readout */}
            {cropPxW && cropPxH && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: c.bgSubtle, borderRadius: '8px', marginBottom: '16px', fontSize: '0.82rem', color: c.textSecondary }}>
                    <span>Crop size</span>
                    <span style={{ fontWeight: 700, color: c.text }}>{cropPxW} × {cropPxH} px</span>
                </div>
            )}

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
                {processing ? `Cropping… ${processed} / ${entries.length}` : `Crop ${entries.length} image${entries.length !== 1 ? 's' : ''}`}
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
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: c.text }}>
            <Header />

            {/* Hero */}
            <div style={{ textAlign: 'center', padding: '40px 24px 24px' }}>
                <h1 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', fontWeight: 800, color: c.text, marginBottom: '8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    Crop images
                </h1>
                <p style={{ color: c.textMuted, fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto', lineHeight: 1.6 }}>
                    Drag to select the area you want to keep, or pick an aspect ratio. Batch crop up to 50 images at once.
                </p>
            </div>

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
                                    <CropIcon size={40} color={c.gray300} />
                                </div>
                                <button type="button"
                                    style={{ background: c.accent, color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 36px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: '14px', transition: 'background 0.15s' }}
                                    onClick={e => { e.stopPropagation(); openPicker(); }}
                                    onMouseEnter={e => (e.currentTarget.style.background = c.accentDark)}
                                    onMouseLeave={e => (e.currentTarget.style.background = c.accent)}>
                                    Select images to crop
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
                                    {applyToAll ? 'Apply same aspect ratio to all images' : 'Adjust crop per image'}
                                </span>
                                <span style={{ fontSize: '0.78rem', color: c.textMuted, marginLeft: '8px' }}>
                                    — picking a ratio re-centers the crop {applyToAll ? 'on every image' : 'on this image'}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="crop-split" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                        {/* LEFT: Preview + thumbnails */}
                        <div style={{ flex: '1 1 0', minWidth: 0 }}>

                            {activeEntry && activeDims && (
                                <div style={{
                                    position: 'relative',
                                    width: '100%', maxWidth: `${PREVIEW_MAX_W}px`, margin: '0 auto 14px',
                                    background: c.bgMuted, border: `1px solid ${c.border}`,
                                    borderRadius: '16px', overflow: 'hidden',
                                    aspectRatio: `${activeDims.w} / ${activeDims.h}`,
                                }}>
                                    <img
                                        src={activeEntry.localUrl}
                                        alt={activeEntry.name}
                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                                        draggable={false}
                                    />
                                    <CropOverlay
                                        box={activeBox}
                                        onChange={setActiveBox}
                                        ratio={aspect.ratio}
                                        imgW={activeDims.w}
                                        imgH={activeDims.h}
                                    />
                                </div>
                            )}
                            {activeEntry && !activeDims && (
                                <div style={{
                                    width: '100%', maxWidth: `${PREVIEW_MAX_W}px`, margin: '0 auto 14px',
                                    background: c.bgMuted, border: `1px solid ${c.border}`,
                                    borderRadius: '16px', minHeight: '240px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span style={{ color: c.textMuted, fontSize: '0.85rem' }}>Loading image…</span>
                                </div>
                            )}

                            {/* Thumbnail row */}
                            {multiImage && (
                                <div className="crop-thumb-row" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
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
                            {results.length} {results.length === 1 ? 'image' : 'images'} cropped
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
                        {results.length > 1 ? `Download all ${results.length} as ZIP` : 'Download cropped file'}
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
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: c.text }}>Save your crop history</div>
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
                        Crop more images
                    </button>
                </div>
            )}

            {/* ── Responsive styles ── */}
            <style>{`
                @media (max-width: 700px) {
                    .crop-split { flex-direction: column !important; }
                    .crop-options { width: 100% !important; position: static !important; }
                }
                .crop-thumb-row::-webkit-scrollbar { display: none; }
                @media (max-width: 700px) {
                    .crop-thumb-row {
                        mask-image: linear-gradient(to right, transparent 0, black 36px, black calc(100% - 36px), transparent 100%);
                        -webkit-mask-image: linear-gradient(to right, transparent 0, black 36px, black calc(100% - 36px), transparent 100%);
                        padding: 0 4px;
                    }
                }
            `}</style>

            <Footer />
        </div>
    );
}
