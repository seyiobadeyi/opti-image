'use client';

import React, { useState, useCallback } from 'react';
import { Image as ImageIcon, X, CheckCircle, Download, Lock } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { apiClient } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { ProcessedImage, ProcessingSummary } from '@/types';

function fmtBytes(b: number): string {
    if (!b) return '0 B';
    const k = 1024, s = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + s[i];
}
function stripExt(n: string): string { return n.replace(/\.[^.]+$/, ''); }

interface FileEntry { file: File; localUrl: string; name: string; }
interface ResultEntry extends ProcessedImage { displayName: string; localUrl?: string; }

const clr = {
    accent: '#db5a42', accentDk: '#c44d32', accentLt: '#fdf3f1',
    green: '#16a34a', greenLt: '#f0fdf4', greenBd: '#bbf7d0',
    red: '#dc2626', redLt: '#fef2f2',
    g50: '#f9fafb', g100: '#f3f4f6', g200: '#e5e7eb',
    g400: '#9ca3af', g600: '#4b5563', g700: '#374151', g900: '#111827',
};

const S: Record<string, React.CSSProperties> = {
    page:       { minHeight: '100vh', background: '#fff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: clr.g900 },
    hero:       { textAlign: 'center', padding: '44px 24px 28px' },
    h1:         { fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 800, color: clr.g900, marginBottom: '10px', letterSpacing: '-0.02em', lineHeight: 1.2 },
    sub:        { color: clr.g400, fontSize: '0.97rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 },
    infoBox:    { maxWidth: '760px', margin: '0 auto 24px', padding: '0 20px' },
    infoCard:   { background: clr.accentLt, border: `1px solid rgba(219,90,66,0.2)`, borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start' },
    tool:       { maxWidth: '760px', margin: '0 auto', padding: '0 20px 80px' },
    dz:         { border: `2px dashed ${clr.g200}`, borderRadius: '16px', background: clr.g50, padding: '52px 24px', textAlign: 'center', cursor: 'pointer', outline: 'none', transition: 'border-color 0.2s, background 0.2s' },
    dzActive:   { borderColor: clr.accent, background: clr.accentLt },
    selBtn:     { background: clr.accent, color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 30px', fontSize: '0.97rem', fontWeight: 700, cursor: 'pointer', display: 'inline-block', transition: 'background 0.15s', marginBottom: '12px' },
    hint:       { color: clr.g400, fontSize: '0.88rem', marginTop: '10px' },
    fileList:   { marginTop: '20px', borderRadius: '12px', border: `1px solid ${clr.g200}`, overflow: 'hidden' },
    fileRow:    { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderBottom: `1px solid ${clr.g100}` },
    thumb:      { width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' as const, background: clr.g100, flexShrink: 0 },
    fname:      { flex: 1, fontSize: '0.86rem', color: clr.g700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    fsize:      { fontSize: '0.78rem', color: clr.g400, whiteSpace: 'nowrap' },
    rmBtn:      { background: 'none', border: 'none', color: clr.g200, cursor: 'pointer', padding: '4px', fontSize: '1rem', lineHeight: 1, display: 'flex', alignItems: 'center', transition: 'color 0.15s' },
    settings:   { marginTop: '20px', padding: '18px 20px', background: clr.g50, borderRadius: '12px', border: `1px solid ${clr.g200}` },
    sRow:       { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' as const },
    sLabel:     { fontSize: '0.88rem', fontWeight: 600, color: clr.g700 },
    sNote:      { fontSize: '0.75rem', color: clr.g400, marginTop: '2px' },
    divider:    { borderTop: `1px solid ${clr.g200}`, margin: '14px 0' },
    actionBtn:  { display: 'block', width: '100%', padding: '15px', marginTop: '24px', background: clr.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s', textAlign: 'center' as const },
    errBox:     { marginTop: '14px', padding: '12px 16px', background: clr.redLt, border: '1px solid #fecaca', borderRadius: '10px', color: clr.red, fontSize: '0.88rem' },
    progress:   { height: '5px', borderRadius: '999px', background: clr.g100, overflow: 'hidden', marginTop: '20px' },
    progFill:   { height: '100%', background: clr.accent, borderRadius: '999px', transition: 'width 0.3s ease' },
    progLbl:    { textAlign: 'center' as const, fontSize: '0.85rem', color: clr.g400, marginTop: '8px' },
    banner:     { marginTop: '28px', background: clr.greenLt, border: `1.5px solid ${clr.greenBd}`, borderRadius: '16px', padding: '24px 20px', textAlign: 'center' as const },
    bannerPct:  { fontSize: '3rem', fontWeight: 900, color: clr.green, letterSpacing: '-0.04em', lineHeight: 1 },
    bannerLbl:  { fontSize: '0.95rem', color: '#166534', fontWeight: 600, marginTop: '4px' },
    bannerSub:  { fontSize: '0.86rem', color: clr.g600, marginTop: '4px' },
    dlAllBtn:   { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', marginTop: '18px', background: clr.accent, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.97rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' },
    resList:    { marginTop: '16px', border: `1px solid ${clr.g200}`, borderRadius: '12px', overflow: 'hidden' },
    resRow:     { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderBottom: `1px solid ${clr.g100}` },
    cleanPill:  { fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: clr.greenLt, color: clr.green, whiteSpace: 'nowrap' as const },
    dlBtn:      { background: 'none', border: `1.5px solid ${clr.g200}`, borderRadius: '8px', color: clr.g700, fontSize: '0.8rem', fontWeight: 600, padding: '4px 11px', cursor: 'pointer', transition: 'border-color 0.15s', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' as const },
    resetBtn:   { display: 'block', width: '100%', textAlign: 'center' as const, marginTop: '20px', color: clr.g400, fontSize: '0.88rem', cursor: 'pointer', background: 'none', border: 'none', padding: '8px', textDecoration: 'underline', textUnderlineOffset: '2px' },
};

export function MetadataTool({ embedded = false }: { embedded?: boolean }): React.JSX.Element {
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [format, setFormat] = useState('');
    const [processing, setProcessing] = useState(false);
    const [processed, setProcessed] = useState(0);
    const [results, setResults] = useState<ResultEntry[] | null>(null);
    const [summary, setSummary] = useState<ProcessingSummary | null>(null);
    const [error, setError] = useState<string | null>(null);

    const addFiles = useCallback((files: File[]) => {
        const imgs = files.filter(f => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name));
        setEntries(prev => [...prev, ...imgs.map(f => ({ file: f, localUrl: URL.createObjectURL(f), name: stripExt(f.name) }))].slice(0, 50));
        setResults(null); setError(null); setProcessed(0);
    }, []);

    const removeEntry = useCallback((i: number) => {
        setEntries(prev => { const n = [...prev]; URL.revokeObjectURL(n[i]!.localUrl); n.splice(i, 1); return n; });
    }, []);

    const reset = useCallback(() => {
        entries.forEach(e => URL.revokeObjectURL(e.localUrl));
        setEntries([]); setResults(null); setSummary(null); setError(null); setProcessed(0);
    }, [entries]);

    const { getRootProps, getInputProps, isDragActive, open: openPicker } = useDropzone({
        onDrop: addFiles,
        accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/avif': ['.avif'], 'image/tiff': ['.tif', '.tiff'], 'image/gif': ['.gif'], 'image/bmp': ['.bmp'], 'image/heic': ['.heic'], 'image/heif': ['.heif'] },
        maxFiles: 50, maxSize: 100 * 1024 * 1024, disabled: processing,
    });

    const handleProcess = useCallback(async () => {
        if (!entries.length || processing) return;

        setProcessing(true); setError(null); setResults(null); setSummary(null); setProcessed(0);
        const allResults: ResultEntry[] = [];
        let totalOrig = 0, totalProc = 0;

        try {
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i]!;
                const namedFile = Object.assign(new File([entry.file], entry.file.name, { type: entry.file.type }), { customName: entry.name });
                const resp = await apiClient.convertImages([namedFile], {
                    stripMetadata: true,
                    format: format as '' | 'jpeg' | 'png' | 'webp' | 'avif' | 'tiff' | 'gif',
                    quality: 95,
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
    }, [entries, processing, format]);

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

    const showDrop = entries.length === 0 && !results;

    return (
        <div style={embedded ? { ...S.page, minHeight: 'auto', background: 'transparent' } : S.page}>
            {!embedded && <Header />}

            {!embedded && (
                <div style={S.hero}>
                    <h1 style={S.h1}>Remove image metadata</h1>
                    <p style={S.sub}>Strip hidden camera data like GPS location, device model and timestamps before you share your photos.</p>
                </div>
            )}

            <div style={S.infoBox}>
                <div style={S.infoCard}>
                    <span style={{ flexShrink: 0 }}><Lock size={20} color={clr.accent} /></span>
                    <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: clr.accent, marginBottom: '4px' }}>What gets removed</div>
                        <div style={{ fontSize: '0.82rem', color: clr.g700, lineHeight: 1.6 }}>
                            GPS coordinates, camera model, lens info, shutter speed, ISO, copyright notices, author name, software used, and other EXIF/IPTC data embedded in your image files.
                        </div>
                    </div>
                </div>
            </div>

            <div style={S.tool}>
                {showDrop && (
                    <div {...getRootProps()} style={{ ...S.dz, ...(isDragActive ? S.dzActive : {}) }}>
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p style={{ color: clr.accent, fontWeight: 700, fontSize: '1.05rem' }}>Release to add your images</p>
                        ) : (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><ImageIcon size={40} color={clr.g400} /></div>
                                <button type="button" style={S.selBtn} onClick={e => { e.stopPropagation(); openPicker(); }}
                                    onMouseEnter={e => (e.currentTarget.style.background = clr.accentDk)}
                                    onMouseLeave={e => (e.currentTarget.style.background = clr.accent)}>
                                    Select images
                                </button>
                                <p style={S.hint}>or drag and drop your images here</p>
                                <p style={{ ...S.hint, marginTop: '4px', fontSize: '0.78rem' }}>JPG · PNG · WebP · AVIF · GIF · TIFF · BMP · HEIC &nbsp;|&nbsp; Max 50 files · 100 MB each</p>
                            </>
                        )}
                    </div>
                )}

                {entries.length > 0 && !results && (
                    <>
                        <div style={S.fileList}>
                            {entries.map((entry, i) => (
                                <div key={i} style={{ ...S.fileRow, background: i % 2 === 0 ? '#fff' : clr.g50 }}>
                                    <img src={entry.localUrl} alt={entry.name} style={S.thumb} />
                                    <span style={S.fname}>{entry.name}</span>
                                    <span style={S.fsize}>{fmtBytes(entry.file.size)}</span>
                                    <button type="button" style={S.rmBtn} onClick={() => removeEntry(i)}
                                        onMouseEnter={e => (e.currentTarget.style.color = clr.red)}
                                        onMouseLeave={e => (e.currentTarget.style.color = clr.g200)}><X size={12} /></button>
                                </div>
                            ))}
                        </div>

                        <div style={S.settings}>
                            <div style={S.sRow}>
                                <div>
                                    <div style={S.sLabel}>Save as</div>
                                    <div style={S.sNote}>Keep the same format or convert</div>
                                </div>
                                <select value={format} onChange={e => setFormat(e.target.value)}
                                    style={{ border: `1.5px solid ${clr.g200}`, borderRadius: '8px', padding: '7px 10px', fontSize: '0.88rem', background: '#fff', color: clr.g700, cursor: 'pointer', outline: 'none' }}>
                                    <option value="">Same as original</option>
                                    <option value="jpeg">JPEG</option>
                                    <option value="webp">WebP</option>
                                    <option value="png">PNG</option>
                                </select>
                            </div>
                        </div>

                        {error && <div style={S.errBox}>{error}</div>}

                        <button type="button" disabled={processing} onClick={handleProcess}
                            style={{ ...S.actionBtn, ...(processing ? { background: clr.g400, cursor: 'not-allowed' } : {}) }}
                            onMouseEnter={e => { if (!processing) (e.currentTarget as HTMLButtonElement).style.background = clr.accentDk; }}
                            onMouseLeave={e => { if (!processing) (e.currentTarget as HTMLButtonElement).style.background = clr.accent; }}>
                            {processing ? `Stripping... ${processed} / ${entries.length}` : `Strip metadata from ${entries.length} image${entries.length !== 1 ? 's' : ''}`}
                        </button>

                        {processing && (
                            <>
                                <div style={S.progress}><div style={{ ...S.progFill, width: `${(processed / entries.length) * 100}%` }} /></div>
                                <p style={S.progLbl}>{processed} of {entries.length} done</p>
                            </>
                        )}
                    </>
                )}

                {results && summary && (
                    <>
                        <div style={S.banner}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}><CheckCircle size={36} color={clr.green} /></div>
                            <div style={S.bannerLbl}>Metadata removed from {results.length} {results.length === 1 ? 'image' : 'images'}</div>
                            <div style={S.bannerSub}>GPS, camera data and EXIF stripped clean</div>
                        </div>

                        <button type="button" style={S.dlAllBtn} onClick={downloadAll}
                            onMouseEnter={e => (e.currentTarget.style.background = clr.accentDk)}
                            onMouseLeave={e => (e.currentTarget.style.background = clr.accent)}>
                            <Download size={16} /> Download {results.length > 1 ? `all ${results.length} as ZIP` : 'clean file'}
                        </button>

                        <div style={S.resList}>
                            {results.map((r, i) => (
                                <div key={r.id} style={{ ...S.resRow, background: i % 2 === 0 ? '#fff' : clr.g50 }}>
                                    {r.localUrl ? <img src={r.localUrl} alt={r.displayName} style={S.thumb} /> : <div style={{ ...S.thumb, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={18} color={clr.g400} /></div>}
                                    <span style={S.fname}>{r.displayName}</span>
                                    <span style={S.cleanPill}>Clean</span>
                                    <span style={S.fsize}>{fmtBytes(r.processedSize)}</span>
                                    <button type="button" style={S.dlBtn} onClick={() => downloadOne(r)}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = clr.accent)}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = clr.g200)}>
                                        <Download size={13} /> Save
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button type="button" style={S.resetBtn} onClick={reset}>← Clean more images</button>
                    </>
                )}
            </div>

            {!embedded && <Footer />}
        </div>
    );
}

export default function MetadataPage(): React.JSX.Element {
    return <MetadataTool />;
}
