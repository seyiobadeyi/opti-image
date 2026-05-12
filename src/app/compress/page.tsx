'use client';

/**
 * /compress — Standalone white-theme compress tool page
 *
 * Completely self-contained. Uses inline styles only (no dark CSS variables).
 * Features:
 *  - Drag & drop (react-dropzone, no interfering ::before overlay)
 *  - Instant local preview thumbnails before processing
 *  - Dropbox import (Dropbox Chooser SDK)
 *  - Google Drive import (Google Picker API)
 *  - Quality slider + format selector
 *  - Per-file results with savings percentage
 *  - Download all as ZIP (with user-defined filenames)
 *  - Save to Dropbox
 *  - Re-compress same batch with different settings
 */

import React, { useState, useCallback, useRef } from 'react';
import { Image as ImageIcon, X, CheckCircle, Download } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { apiClient } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { c } from '@/lib/colors';
import type { ProcessedImage, ProcessingSummary } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtBytes(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function stripExt(name: string): string {
    return name.replace(/\.[^.]+$/, '');
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface FileEntry {
    file: File;
    localUrl: string;
    name: string;
}

interface ResultEntry extends ProcessedImage {
    displayName: string;
    localUrl?: string;
}

// ─── Cloud SDK loaders ───────────────────────────────────────────────────────

function loadScript(id: string, src: string, attrs?: Record<string, string>): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.getElementById(id)) { resolve(); return; }
        const s = document.createElement('script');
        s.id = id;
        s.src = src;
        if (attrs) Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
        s.onload = () => resolve();
        s.onerror = () => reject();
        document.head.appendChild(s);
    });
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Window { Dropbox: any; gapi: any; google: any; }
}

// ─── Styles (all light / white) ───────────────────────────────────────────────

const clr = {
    blue:       c.accent,
    blueDark:   c.accentDark,
    blueLight:  c.accentLight,
    green:      c.success,
    greenLight: '#f0fdf4',
    greenBorder:'#bbf7d0',
    red:        c.error,
    redLight:   '#fef2f2',
    gray50:     c.gray50,
    gray100:    c.gray100,
    gray200:    c.border,
    gray400:    c.textMuted,
    gray600:    c.gray600,
    gray700:    c.textSecondary,
    gray900:    c.text,
};

const S: Record<string, React.CSSProperties> = {
    page:         { minHeight: '100vh', background: '#fff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: clr.gray900 },
    hero:         { textAlign: 'center', padding: '44px 24px 28px' },
    h1:           { fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 800, color: clr.gray900, marginBottom: '10px', letterSpacing: '-0.02em', lineHeight: 1.2 },
    subtext:      { color: clr.gray400, fontSize: '0.97rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 },
    tool:         { maxWidth: '760px', margin: '0 auto', padding: '0 20px 80px' },
    dropZone:     { border: `2px dashed ${clr.gray200}`, borderRadius: '16px', background: clr.gray50, padding: '52px 24px', textAlign: 'center', cursor: 'pointer', outline: 'none', transition: 'border-color 0.2s, background 0.2s' },
    dropZoneActive:{ borderColor: clr.blue, background: clr.blueLight },
    selectBtn:    { background: clr.blue, color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 30px', fontSize: '0.97rem', fontWeight: 700, cursor: 'pointer', display: 'inline-block', transition: 'background 0.15s', marginBottom: '12px' },
    dropHint:     { color: clr.gray400, fontSize: '0.88rem', marginTop: '10px' },
    cloudRow:     { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '18px', flexWrap: 'wrap' },
    cloudBtn:     { display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', border: `1.5px solid ${clr.gray200}`, borderRadius: '8px', background: '#fff', fontSize: '0.83rem', fontWeight: 600, color: clr.gray700, cursor: 'pointer', transition: 'border-color 0.15s' },
    fileList:     { marginTop: '20px', borderRadius: '12px', border: `1px solid ${clr.gray200}`, overflow: 'hidden' },
    fileRow:      { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderBottom: `1px solid ${clr.gray100}` },
    fileThumb:    { width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover', background: clr.gray100, flexShrink: 0 },
    fileName:     { flex: 1, fontSize: '0.86rem', color: clr.gray700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    fileSize:     { fontSize: '0.78rem', color: clr.gray400, whiteSpace: 'nowrap' },
    rmBtn:        { background: 'none', border: 'none', color: clr.gray200, cursor: 'pointer', padding: '4px', fontSize: '1rem', lineHeight: 1, display: 'flex', alignItems: 'center', transition: 'color 0.15s' },
    addMoreBtn:   { display: 'block', width: '100%', textAlign: 'center', marginTop: '10px', padding: '11px', border: `1.5px dashed ${clr.gray200}`, borderRadius: '10px', color: clr.gray400, fontSize: '0.88rem', cursor: 'pointer', background: 'none', transition: 'border-color 0.15s, color 0.15s' },
    settingsBox:  { marginTop: '20px', padding: '18px 20px', background: clr.gray50, borderRadius: '12px', border: `1px solid ${clr.gray200}` },
    settingRow:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' },
    settingLabel: { fontSize: '0.88rem', fontWeight: 600, color: clr.gray700 },
    settingNote:  { fontSize: '0.75rem', color: clr.gray400, marginTop: '2px' },
    slider:       { width: '180px', accentColor: clr.blue, cursor: 'pointer' },
    sliderVal:    { fontSize: '0.88rem', fontWeight: 700, color: clr.blue, minWidth: '38px', textAlign: 'right' },
    divider:      { borderTop: `1px solid ${clr.gray200}`, margin: '14px 0' },
    compressBtn:  { display: 'block', width: '100%', padding: '15px', marginTop: '24px', background: clr.blue, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s', textAlign: 'center' },
    progressBar:  { height: '5px', borderRadius: '999px', background: clr.gray100, overflow: 'hidden', marginTop: '20px' },
    progressFill: { height: '100%', background: clr.blue, borderRadius: '999px', transition: 'width 0.3s ease' },
    progressLabel:{ textAlign: 'center', fontSize: '0.85rem', color: clr.gray400, marginTop: '8px' },
    errorBox:     { marginTop: '14px', padding: '12px 16px', background: clr.redLight, border: `1px solid #fecaca`, borderRadius: '10px', color: clr.red, fontSize: '0.88rem' },
    resultBanner: { marginTop: '28px', background: clr.greenLight, border: `1.5px solid ${clr.greenBorder}`, borderRadius: '16px', padding: '24px 20px', textAlign: 'center' },
    resultPct:    { fontSize: '3rem', fontWeight: 900, color: clr.green, letterSpacing: '-0.04em', lineHeight: 1 },
    resultLbl:    { fontSize: '0.95rem', color: '#166534', fontWeight: 600, marginTop: '4px' },
    resultSizes:  { fontSize: '0.86rem', color: clr.gray600, marginTop: '4px' },
    dlAllBtn:     { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', marginTop: '18px', background: clr.blue, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.97rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.15s' },
    cloudShareRow:{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' },
    cloudShareBtn:{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px', border: `1.5px solid ${clr.gray200}`, borderRadius: '10px', background: '#fff', fontSize: '0.83rem', fontWeight: 600, color: clr.gray700, cursor: 'pointer', transition: 'border-color 0.15s', minWidth: '120px' },
    resultList:   { marginTop: '16px', border: `1px solid ${clr.gray200}`, borderRadius: '12px', overflow: 'hidden' },
    resultRow:    { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderBottom: `1px solid ${clr.gray100}` },
    savingsPill:  { fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: '#dcfce7', color: clr.green, whiteSpace: 'nowrap' },
    dlBtn:        { background: 'none', border: `1.5px solid ${clr.gray200}`, borderRadius: '8px', color: clr.gray700, fontSize: '0.8rem', fontWeight: 600, padding: '4px 11px', cursor: 'pointer', transition: 'border-color 0.15s', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' },
    resetBtn:     { display: 'block', width: '100%', textAlign: 'center', marginTop: '20px', color: clr.gray400, fontSize: '0.88rem', cursor: 'pointer', background: 'none', border: 'none', padding: '8px', textDecoration: 'underline', textUnderlineOffset: '2px' },
};

// ─── Icons ───────────────────────────────────────────────────────────────────

const DriveIcon = (): React.JSX.Element => (
    <svg width="15" height="15" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
        <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
        <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
        <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
        <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
        <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
        <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 27h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
    </svg>
);

const DropboxIcon = (): React.JSX.Element => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#0061ff">
        <path d="M6 2L0 6l6 4 6-4-6-4zM18 2l-6 4 6 4 6-4-6-4zM0 14l6 4 6-4-6-4-6 4zM18 10l-6 4 6 4 6-4-6-4zM6 19.5L12 23l6-3.5-6-4-6 4z"/>
    </svg>
);

// ─── Main ────────────────────────────────────────────────────────────────────

export default function CompressPage(): React.JSX.Element {
    const [entries, setEntries] = useState<FileEntry[]>([]);
    const [quality, setQuality] = useState(80);
    const [format, setFormat] = useState('');
    const [processing, setProcessing] = useState(false);
    const [processed, setProcessed] = useState(0);
    const [results, setResults] = useState<ResultEntry[] | null>(null);
    const [summary, setSummary] = useState<ProcessingSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editVal, setEditVal] = useState('');
    const addMoreInputRef = useRef<HTMLInputElement>(null);

    // ── File management
    const addFiles = useCallback((newFiles: File[]) => {
        const imgs = newFiles.filter(f => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name));
        const added = imgs.map(f => ({
            file: f,
            localUrl: URL.createObjectURL(f),
            name: stripExt(f.name),
        }));
        setEntries(prev => [...prev, ...added].slice(0, 50));
        setResults(null);
        setError(null);
        setProcessed(0);
    }, []);

    const removeEntry = useCallback((idx: number) => {
        setEntries(prev => {
            const next = [...prev];
            URL.revokeObjectURL(next[idx]!.localUrl);
            next.splice(idx, 1);
            return next;
        });
    }, []);

    const reset = useCallback(() => {
        entries.forEach(e => URL.revokeObjectURL(e.localUrl));
        setEntries([]);
        setResults(null);
        setSummary(null);
        setError(null);
        setProcessed(0);
    }, [entries]);

    // ── Dropzone (clean — no ::before overlay, no interfering styles)
    const { getRootProps, getInputProps, isDragActive, open: openFilePicker } = useDropzone({
        onDrop: addFiles,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp'],
            'image/avif': ['.avif'],
            'image/tiff': ['.tif', '.tiff'],
            'image/gif': ['.gif'],
            'image/bmp': ['.bmp'],
            'image/heic': ['.heic'],
            'image/heif': ['.heif'],
        },
        maxFiles: 50,
        maxSize: 100 * 1024 * 1024,
        disabled: processing,
    });

    // ── Dropbox import
    const openDropbox = useCallback(async () => {
        try {
            await loadScript(
                'dropbox-sdk',
                'https://www.dropbox.com/static/api/2/dropins.js',
                { 'data-app-key': process.env.NEXT_PUBLIC_DROPBOX_APP_KEY ?? '' }
            );
            if (!window.Dropbox) return;
            window.Dropbox.choose({
                success: async (files: Array<{ name: string; link: string }>) => {
                    const fetched: File[] = [];
                    for (const f of files) {
                        try {
                            const res = await fetch(f.link.replace('?dl=0', '?dl=1'));
                            const blob = await res.blob();
                            fetched.push(new File([blob], f.name, { type: blob.type }));
                        } catch { /* skip */ }
                    }
                    if (fetched.length) addFiles(fetched);
                },
                cancel: () => {},
                linkType: 'direct',
                multiselect: true,
                extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.tiff', '.bmp'],
            });
        } catch { alert('Dropbox is unavailable right now. Please upload files directly.'); }
    }, [addFiles]);

    // ── Google Drive import
    const openGoogleDrive = useCallback(async () => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const apiKey   = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
        if (!clientId || !apiKey) {
            alert('Google Drive integration is not configured yet.');
            return;
        }
        try {
            await loadScript('gapi-js', 'https://apis.google.com/js/api.js');
            await loadScript('gsi-js', 'https://accounts.google.com/gsi/client');
            window.gapi.load('picker', {
                callback: () => {
                    const tokenClient = window.google.accounts.oauth2.initTokenClient({
                        client_id: clientId,
                        scope: 'https://www.googleapis.com/auth/drive.readonly',
                        callback: async (token: { access_token: string }) => {
                            const picker = new window.google.picker.PickerBuilder()
                                .setOAuthToken(token.access_token)
                                .setDeveloperKey(apiKey)
                                .addView(window.google.picker.ViewId.DOCS_IMAGES)
                                .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
                                .setCallback(async (data: { action: string; docs: Array<{ id: string; name: string; mimeType: string }> }) => {
                                    if (data.action !== 'picked') return;
                                    const fetched: File[] = [];
                                    for (const doc of data.docs) {
                                        try {
                                            const res = await fetch(
                                                `https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`,
                                                { headers: { Authorization: `Bearer ${token.access_token}` } }
                                            );
                                            const blob = await res.blob();
                                            fetched.push(new File([blob], doc.name, { type: doc.mimeType }));
                                        } catch { /* skip */ }
                                    }
                                    if (fetched.length) addFiles(fetched);
                                }).build();
                            picker.setVisible(true);
                        },
                    });
                    tokenClient.requestAccessToken({ prompt: '' });
                },
            });
        } catch { alert('Google Drive is unavailable right now. Please upload files directly.'); }
    }, [addFiles]);

    // ── Compression
    const handleCompress = useCallback(async () => {
        if (!entries.length || processing) return;

        setProcessing(true);
        setError(null);
        setResults(null);
        setSummary(null);
        setProcessed(0);

        const allResults: ResultEntry[] = [];
        let totalOrig = 0;
        let totalProc = 0;

        try {
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i]!;
                // Attach customName to the File object so the server uses it
                const namedFile = new File([entry.file], entry.file.name, { type: entry.file.type });
                const resp = await apiClient.convertImages(
                    [Object.assign(namedFile, { customName: entry.name })],
                    {
                        quality,
                        format: format as '' | 'jpeg' | 'png' | 'webp' | 'avif' | 'tiff' | 'gif',
                        stripMetadata: true,
                    }
                );
                if (resp.success && resp.results[0]) {
                    const r = resp.results[0];
                    const ext = format || r.format;
                    allResults.push({ ...r, displayName: `${entry.name}.${ext}`, localUrl: entry.localUrl });
                    totalOrig += r.originalSize;
                    totalProc += r.processedSize;
                }
                setProcessed(i + 1);
            }

            const savings = totalOrig - totalProc;
            setResults(allResults);
            setSummary({
                filesProcessed: allResults.length,
                totalOriginalSize: totalOrig,
                totalProcessedSize: totalProc,
                totalSavings: savings,
                totalSavingsPercent: totalOrig > 0 ? ((savings / totalOrig) * 100).toFixed(1) : '0.0',
            });
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
    }, [entries, processing, quality, format]);

    // ── Downloads
    const downloadOne = useCallback(async (result: ResultEntry) => {
        try {
            const res = await fetch(`${apiClient.getServerUrl()}/api/images/${result.processedName}/download`);
            if (!res.ok) throw new Error('Download failed');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = result.displayName; a.click();
            URL.revokeObjectURL(url);
        } catch { alert('Download failed. Please try again.'); }
    }, []);

    const downloadAll = useCallback(async () => {
        if (!results) return;
        await apiClient.downloadBulkImages(
            results.map(r => r.processedName),
            results.map(r => r.displayName),
        );
    }, [results]);

    const saveToDropbox = useCallback(() => {
        if (!results?.length) return;
        if (results.length === 1 && results[0]) {
            const url = `${apiClient.getServerUrl()}/api/images/${results[0].processedName}/download`;
            window.open(
                `https://www.dropbox.com/save?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(results[0].displayName)}`,
                '_blank'
            );
        } else {
            void downloadAll();
        }
    }, [results, downloadAll]);

    // ── Derived
    const compressionLabel =
        quality >= 85 ? 'Gentle — closest to original' :
        quality >= 70 ? 'Balanced — recommended' :
        quality >= 50 ? 'Strong — great for web' :
                        'Maximum — smallest file';

    const hasSavings = summary && parseFloat(summary.totalSavingsPercent ?? '0') > 0;
    // Show the big dropzone only when no files have been added yet (and no results shown)
    const showDrop   = entries.length === 0 && !results;

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div style={S.page}>

            <Header />

            {/* ── Hero ────────────────────────────────────────────────────── */}
            <div style={S.hero}>
                <h1 style={S.h1}>Compress your images</h1>
                <p style={S.subtext}>
                    Make JPG, PNG, WebP and more up to 90% smaller — with no visible difference.<br />
                    Free for up to 5 files. No account needed to start.
                </p>
            </div>

            {/* ── Tool ────────────────────────────────────────────────────── */}
            <div style={S.tool}>

                {/* ── Drop zone (always visible until results appear) ── */}
                {showDrop && (
                    <>
                        <div
                            {...getRootProps()}
                            style={{
                                ...S.dropZone,
                                ...(isDragActive ? S.dropZoneActive : {}),
                            }}
                        >
                            <input {...getInputProps()} />

                            {isDragActive ? (
                                <p style={{ color: clr.blue, fontWeight: 700, fontSize: '1.05rem' }}>
                                    Release to add your images
                                </p>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><ImageIcon size={40} color={clr.gray400} /></div>
                                    <button
                                        type="button"
                                        style={S.selectBtn}
                                        onClick={e => { e.stopPropagation(); openFilePicker(); }}
                                        onMouseEnter={e => (e.currentTarget.style.background = clr.blueDark)}
                                        onMouseLeave={e => (e.currentTarget.style.background = clr.blue)}
                                    >
                                        Select images
                                    </button>
                                    <p style={S.dropHint}>or drag and drop your images here</p>
                                    <p style={{ ...S.dropHint, marginTop: '4px', fontSize: '0.78rem' }}>
                                        JPG · PNG · WebP · AVIF · GIF · TIFF · BMP · HEIC &nbsp;|&nbsp; Max 50 files · 100 MB each
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Cloud import — only shown when API keys are configured */}
                        {(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_DROPBOX_APP_KEY) && (
                            <div style={S.cloudRow}>
                                {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                                    <button type="button" style={S.cloudBtn} onClick={openGoogleDrive}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#4285F4')}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = clr.gray200)}>
                                        <DriveIcon /> Import from Google Drive
                                    </button>
                                )}
                                {process.env.NEXT_PUBLIC_DROPBOX_APP_KEY && (
                                    <button type="button" style={S.cloudBtn} onClick={openDropbox}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#0061ff')}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = clr.gray200)}>
                                        <DropboxIcon /> Import from Dropbox
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* ── File list + settings ── */}
                {entries.length > 0 && !results && (
                    <>
                        {/* File rows */}
                        <div style={S.fileList}>
                            {entries.map((entry, i) => (
                                <div key={i} style={{ ...S.fileRow, background: i % 2 === 0 ? '#fff' : clr.gray50 }}>
                                    <img src={entry.localUrl} alt={entry.name} style={S.fileThumb as React.CSSProperties} />

                                    {editingIdx === i ? (
                                        <input
                                            autoFocus
                                            value={editVal}
                                            onChange={e => setEditVal(e.target.value)}
                                            onBlur={() => {
                                                setEntries(prev => prev.map((ent, j) =>
                                                    j === i ? { ...ent, name: editVal.trim() || ent.name } : ent
                                                ));
                                                setEditingIdx(null);
                                            }}
                                            onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') (e.target as HTMLInputElement).blur(); }}
                                            style={{ flex: 1, border: `1.5px solid ${clr.blue}`, borderRadius: '6px', padding: '3px 8px', fontSize: '0.86rem', outline: 'none' }}
                                        />
                                    ) : (
                                        <span
                                            style={{ ...S.fileName, cursor: 'text' }}
                                            title="Click to rename"
                                            onClick={() => { setEditingIdx(i); setEditVal(entry.name); }}
                                        >
                                            {entry.name}
                                        </span>
                                    )}

                                    <span style={S.fileSize}>{fmtBytes(entry.file.size)}</span>
                                    <button type="button" style={S.rmBtn}
                                        onClick={() => removeEntry(i)}
                                        onMouseEnter={e => (e.currentTarget.style.color = clr.red)}
                                        onMouseLeave={e => (e.currentTarget.style.color = clr.gray200)}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Hidden file input for "Add more" */}
                        <input
                            ref={addMoreInputRef}
                            type="file"
                            multiple
                            accept="image/*,.heic,.heif"
                            style={{ display: 'none' }}
                            onChange={e => { if (e.target.files) { addFiles(Array.from(e.target.files)); e.target.value = ''; } }}
                        />
                        <button
                            type="button"
                            style={S.addMoreBtn}
                            onClick={() => addMoreInputRef.current?.click()}
                            onMouseEnter={e => { (e.currentTarget.style.borderColor = clr.blue); (e.currentTarget.style.color = clr.blue); }}
                            onMouseLeave={e => { (e.currentTarget.style.borderColor = clr.gray200); (e.currentTarget.style.color = clr.gray400); }}
                        >
                            + Add more images
                        </button>

                        {/* Settings */}
                        <div style={S.settingsBox}>
                            {/* Quality */}
                            <div style={S.settingRow}>
                                <div>
                                    <div style={S.settingLabel}>Compression level</div>
                                    <div style={S.settingNote}>{compressionLabel}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="range"
                                        min={30}
                                        max={95}
                                        step={5}
                                        value={quality}
                                        onChange={e => setQuality(Number(e.target.value))}
                                        style={S.slider}
                                    />
                                    <span style={S.sliderVal}>{quality}%</span>
                                </div>
                            </div>

                            {/* Format */}
                            <div style={S.divider} />
                            <div style={S.settingRow}>
                                <div>
                                    <div style={S.settingLabel}>Save as</div>
                                    <div style={S.settingNote}>WebP is the best for websites and apps</div>
                                </div>
                                <select
                                    value={format}
                                    onChange={e => setFormat(e.target.value)}
                                    style={{ border: `1.5px solid ${clr.gray200}`, borderRadius: '8px', padding: '7px 10px', fontSize: '0.88rem', background: '#fff', color: clr.gray700, cursor: 'pointer', outline: 'none' }}
                                >
                                    <option value="">Same as original</option>
                                    <option value="webp">WebP — smallest size</option>
                                    <option value="jpeg">JPEG</option>
                                    <option value="png">PNG</option>
                                    <option value="avif">AVIF</option>
                                </select>
                            </div>
                        </div>

                        {error && <div style={S.errorBox}>{error}</div>}

                        {/* Compress button */}
                        <button
                            type="button"
                            disabled={processing}
                            onClick={handleCompress}
                            style={{ ...S.compressBtn, ...(processing ? { background: '#93c5fd', cursor: 'not-allowed' } : {}) }}
                            onMouseEnter={e => { if (!processing) (e.currentTarget as HTMLButtonElement).style.background = clr.blueDark; }}
                            onMouseLeave={e => { if (!processing) (e.currentTarget as HTMLButtonElement).style.background = clr.blue; }}
                        >
                            {processing ? `Compressing… ${processed} / ${entries.length}` : `Compress ${entries.length} image${entries.length !== 1 ? 's' : ''}`}
                        </button>

                        {processing && (
                            <>
                                <div style={S.progressBar}>
                                    <div style={{ ...S.progressFill, width: `${(processed / entries.length) * 100}%` }} />
                                </div>
                                <p style={S.progressLabel}>{processed} of {entries.length} done</p>
                            </>
                        )}
                    </>
                )}

                {/* ── Results ── */}
                {results && summary && (
                    <>
                        {/* Summary */}
                        <div style={S.resultBanner}>
                            {hasSavings
                                ? <div style={S.resultPct}>{summary.totalSavingsPercent}%</div>
                                : <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}><CheckCircle size={44} color={clr.green} /></div>
                            }
                            <div style={S.resultLbl}>{hasSavings ? 'smaller' : 'images compressed'}</div>
                            <div style={S.resultSizes}>
                                {fmtBytes(summary.totalOriginalSize)} → {fmtBytes(summary.totalProcessedSize ?? 0)}
                                &nbsp;·&nbsp; {results.length} {results.length === 1 ? 'file' : 'files'}
                            </div>
                        </div>

                        {/* Download all */}
                        <button
                            type="button"
                            style={S.dlAllBtn}
                            onClick={downloadAll}
                            onMouseEnter={e => (e.currentTarget.style.background = clr.blueDark)}
                            onMouseLeave={e => (e.currentTarget.style.background = clr.blue)}
                        >
                            <Download size={16} /> Download {results.length > 1 ? `all ${results.length} as ZIP` : 'compressed file'}
                        </button>

                        {/* Cloud export row */}
                        <div style={S.cloudShareRow}>
                            <button type="button" style={S.cloudShareBtn} onClick={saveToDropbox}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = '#0061ff')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = clr.gray200)}>
                                <DropboxIcon /> Save to Dropbox
                            </button>
                            <button type="button" style={{ ...S.cloudShareBtn, opacity: 0.45, cursor: 'default' }} title="Google Drive export coming soon">
                                <DriveIcon /> Save to Drive
                            </button>
                        </div>

                        {/* Per-file rows */}
                        <div style={S.resultList}>
                            {results.map((r, i) => {
                                const pct = parseFloat(r.savingsPercent ?? '0');
                                return (
                                    <div key={r.id} style={{ ...S.resultRow, background: i % 2 === 0 ? '#fff' : clr.gray50 }}>
                                        {r.localUrl ? (
                                            <img src={r.localUrl} alt={r.displayName} style={S.fileThumb as React.CSSProperties} />
                                        ) : (
                                            <div style={{ ...S.fileThumb, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={18} color={clr.gray400} /></div>
                                        )}
                                        <span style={S.fileName}>{r.displayName}</span>
                                        {pct > 0 && <span style={S.savingsPill}>−{r.savingsPercent}%</span>}
                                        <span style={S.fileSize}>{fmtBytes(r.processedSize)}</span>
                                        <button type="button" style={S.dlBtn} onClick={() => downloadOne(r)}
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = clr.blue)}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = clr.gray200)}>
                                            <Download size={13} /> Save
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Compress more / reset */}
                        <button type="button" style={S.resetBtn} onClick={reset}>
                            ← Compress more images
                        </button>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}
