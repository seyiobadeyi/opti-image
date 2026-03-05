'use client';

import { useState, useCallback, useMemo } from 'react';
import {
    History, Zap, Image as ImageIcon, Settings, SlidersHorizontal,
    ArrowRight, Upload, Pencil, Check, X, Download, RefreshCw, AlertTriangle, BarChart3, Film
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';

// ─── Helper Functions ───────────────────────────────────────────
function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = [
    { key: 'optimize', label: 'Images', icon: Zap },
    { key: 'video', label: 'Video', icon: Film },
    { key: 'history', label: 'History', icon: History },
    { key: 'settings', label: 'Preferences', icon: Settings },
];

// ─── Main Component ──────────────────────────────────────────────
export default function DashboardClient({ user, profile, history: initialHistory }) {
    const [history, setHistory] = useState(initialHistory || []);
    const [activeTab, setActiveTab] = useState('optimize');

    // ── Inline optimizer state ─────────────────────────
    const [files, setFiles] = useState([]);
    const [fileNames, setFileNames] = useState({}); // { index: customName }
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [imageSettings, setImageSettings] = useState({
        format: '', quality: 80, width: '', height: '',
        stripMetadata: true, maintainAspectRatio: true,
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [processed, setProcessed] = useState(0);
    const [results, setResults] = useState(null);
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);

    // ── Prefs state (UI-only for now) ──────────────────
    const [prefsAutoWebP, setPrefsAutoWebP] = useState(true);
    const [prefsStripMeta, setPrefsStripMeta] = useState(true);

    // ── Video state ────────────────────────────────────
    const [videoFile, setVideoFile] = useState(null);
    const [videoSettings, setVideoSettings] = useState({ format: 'mp4', quality: 28, action: 'compress' });
    const [videoProcessing, setVideoProcessing] = useState(false);
    const [videoResult, setVideoResult] = useState(null);
    const [videoError, setVideoError] = useState(null);

    // ── Stats ──────────────────────────────────────────
    const totalProcessed = history?.length || 0;
    const totalSaved = history?.reduce((acc, curr) => {
        if (curr.action_type === 'compress') return acc + ((curr.original_size || 0) - (curr.processed_size || 0));
        return acc;
    }, 0) || 0;

    // ── File Handling ──────────────────────────────────
    const handleFilesAdded = useCallback((e) => {
        const incomingFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...incomingFiles].slice(0, 50));
        setResults(null);
        setSummary(null);
        setError(null);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const incomingFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        setFiles(prev => [...prev, ...incomingFiles].slice(0, 50));
        setResults(null);
        setSummary(null);
        setError(null);
    }, []);

    const handleRemoveFile = useCallback((index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setFileNames(prev => {
            const clone = { ...prev };
            delete clone[index];
            return clone;
        });
    }, []);

    const handleClearAll = useCallback(() => {
        setFiles([]);
        setFileNames({});
        setResults(null);
        setSummary(null);
        setError(null);
        setProcessed(0);
    }, []);

    // ── Rename Handling ────────────────────────────────
    const startRename = (index) => {
        const currentName = fileNames[index] || files[index].name.replace(/\.[^/.]+$/, '');
        setEditingIndex(index);
        setEditValue(currentName);
    };
    const saveRename = (index) => {
        setFileNames(prev => ({ ...prev, [index]: editValue }));
        setEditingIndex(null);
    };
    const cancelRename = () => {
        setEditingIndex(null);
        setEditValue('');
    };

    const getDisplayName = (index) => {
        if (fileNames[index]) return fileNames[index];
        return files[index].name.replace(/\.[^/.]+$/, '');
    };

    // ── Thumbnails ─────────────────────────────────────
    const thumbnails = useMemo(() => {
        return files.map(file => URL.createObjectURL(file));
    }, [files]);

    // ── Processing ─────────────────────────────────────
    const handleOptimize = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);
        setError(null);
        setResults(null);
        setSummary(null);
        setProcessed(0);

        try {
            const batchSize = 10;
            const allResults = [];
            let totalOriginalSize = 0;
            let totalProcessedSize = 0;

            for (let i = 0; i < files.length; i += batchSize) {
                const batch = files.slice(i, i + batchSize);
                const response = await apiClient.convertImages(batch, imageSettings);

                if (response.success) {
                    allResults.push(...response.results);
                    totalOriginalSize += response.summary.totalOriginalSize;
                    totalProcessedSize += response.summary.totalProcessedSize;

                    const newHistoryItems = response.results.map(r => ({
                        id: crypto.randomUUID(),
                        file_name: r.originalName,
                        action_type: 'compress',
                        original_size: r.originalSize,
                        processed_size: r.processedSize,
                        created_at: new Date().toISOString()
                    }));
                    setHistory(prev => [...newHistoryItems, ...prev]);
                }
                setProcessed(Math.min(i + batchSize, files.length));
            }

            const totalSavings = totalOriginalSize - totalProcessedSize;
            setResults(allResults);
            setSummary({
                filesProcessed: allResults.length,
                totalOriginalSize, totalProcessedSize,
                totalSavings,
                totalSavingsPercent: totalOriginalSize > 0 ? ((totalSavings / totalOriginalSize) * 100).toFixed(1) : '0.0',
            });
        } catch (err) {
            console.error('Processing error:', err);
            setError(err.message || 'An error occurred during processing.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = (processedName, index) => {
        const customName = fileNames[index];
        const url = apiClient.getDownloadUrl(processedName);
        const link = document.createElement('a');
        link.href = url;
        link.download = customName ? `${customName}.${processedName.split('.').pop()}` : processedName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ────────────────────────────────────────────────────
    return (
        <div className="dashboard-wrapper">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 800, letterSpacing: '-0.02em' }}>Your Workspace</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Welcome back, <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{user.email}</span></p>
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}><ImageIcon size={16} /> Images Processed</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalProcessed}</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--gradient-primary)', borderRadius: '20px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, fontSize: '0.9rem', marginBottom: '8px' }}><Zap size={16} /> Bandwidth Saved</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{formatBytes(totalSaved)}</div>
                    <Zap size={80} style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.15 }} />
                </div>
                <div style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}><BarChart3 size={16} /> Avg Compression</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalProcessed > 0 && totalSaved > 0 ? `${((totalSaved / (totalSaved + (history?.reduce((a, c) => a + (c.processed_size || 0), 0) || 1))) * 100).toFixed(0)}%` : '—'}</div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '12px 20px', fontSize: '0.95rem', fontWeight: 600,
                                border: 'none', borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                background: 'transparent', color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                        >
                            <Icon size={18} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ═══════════ Tab: Optimize ═══════════ */}
            {activeTab === 'optimize' && (
                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                    {/* Left: Dropzone + File List */}
                    <div style={{ flex: '1 1 55%', minWidth: '300px' }}>
                        {!results ? (
                            <>
                                {/* Drop Zone */}
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    style={{
                                        border: '2px dashed var(--border)', borderRadius: '24px',
                                        padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
                                        background: 'var(--bg-card)', marginBottom: '24px',
                                        transition: 'border-color 0.2s',
                                    }}
                                    onDragEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                                    onDragLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                                    onClick={() => document.getElementById('dashboard-file-input').click()}
                                >
                                    <Upload size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                                    <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Drop images here or click to browse</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>JPEG, PNG, WebP, AVIF, TIFF, GIF, SVG, BMP • Up to 50 files</p>
                                    <input
                                        id="dashboard-file-input"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFilesAdded}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                {/* File Cards with Rename */}
                                {files.length > 0 && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                                <ImageIcon size={18} /> {files.length} file{files.length !== 1 ? 's' : ''} queued
                                            </h3>
                                            <button onClick={handleClearAll} className="text-btn" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Clear all</button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {files.map((file, index) => (
                                                <div key={`${file.name}-${index}`} style={{
                                                    display: 'flex', alignItems: 'center', gap: '12px',
                                                    padding: '12px 16px', background: 'var(--bg-card)', borderRadius: '16px',
                                                    border: '1px solid var(--border)',
                                                }}>
                                                    <img
                                                        src={thumbnails[index]}
                                                        alt={file.name}
                                                        style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                                                    />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        {editingIndex === index ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <input
                                                                    autoFocus
                                                                    value={editValue}
                                                                    onChange={(e) => setEditValue(e.target.value)}
                                                                    onKeyDown={(e) => { if (e.key === 'Enter') saveRename(index); if (e.key === 'Escape') cancelRename(); }}
                                                                    style={{
                                                                        flex: 1, padding: '6px 10px', borderRadius: '8px',
                                                                        border: '1px solid var(--accent-primary)', background: 'var(--bg-tertiary)',
                                                                        color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem',
                                                                    }}
                                                                />
                                                                <button onClick={() => saveRename(index)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--success)', padding: '4px' }}><Check size={18} /></button>
                                                                <button onClick={cancelRename} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}><X size={18} /></button>
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={file.name}>
                                                                    {getDisplayName(index)}
                                                                </span>
                                                                {fileNames[index] && <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'rgba(108,92,231,0.1)', padding: '2px 8px', borderRadius: '100px', flexShrink: 0 }}>renamed</span>}
                                                                <button onClick={() => startRename(index)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', flexShrink: 0 }} title="Rename output file"><Pencil size={14} /></button>
                                                            </div>
                                                        )}
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                            {formatBytes(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'IMAGE'}
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleRemoveFile(index)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }} title="Remove"><X size={18} /></button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                            <button
                                                className="btn btn-primary btn-large"
                                                onClick={handleOptimize}
                                                disabled={isProcessing || files.length === 0}
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                            >
                                                {isProcessing ? (
                                                    <><RefreshCw size={18} className="spinner" /> Processing {processed}/{files.length}...</>
                                                ) : (
                                                    <><Zap size={18} fill="currentColor" /> Optimize {files.length} Image{files.length !== 1 ? 's' : ''}</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', color: '#ef4444', marginTop: '16px' }}>
                                        <AlertTriangle size={20} /> {error}
                                    </div>
                                )}
                            </>
                        ) : (
                            /* ── Results ── */
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{summary.filesProcessed}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Processed</div>
                                    </div>
                                    <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatBytes(summary.totalOriginalSize)}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Original</div>
                                    </div>
                                    <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatBytes(summary.totalProcessedSize)}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>New Size</div>
                                    </div>
                                    <div style={{ padding: '16px', background: 'rgba(46,213,115,0.1)', borderRadius: '16px', border: '1px solid rgba(46,213,115,0.2)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2ed573' }}>{summary.totalSavingsPercent}%</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Saved</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {results.map((result, index) => (
                                        <div key={index} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '16px', background: 'var(--bg-card)', borderRadius: '16px',
                                            border: '1px solid var(--border)', gap: '12px', flexWrap: 'wrap',
                                        }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {fileNames[index] || result.originalName}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                    {formatBytes(result.originalSize)} → {formatBytes(result.processedSize)}
                                                    <span style={{ color: '#2ed573', marginLeft: '8px', fontWeight: 600 }}>↓ {result.savingsPercent}%</span>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => handleDownload(result.processedName, index)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem', borderRadius: '100px', flexShrink: 0 }}
                                            >
                                                <Download size={16} /> Download
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={handleClearAll} className="btn btn-primary" style={{ width: '100%', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <RefreshCw size={18} /> Optimize More
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Settings Panel */}
                    <div style={{ flex: '1 1 35%', minWidth: '280px' }}>
                        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', padding: '24px', position: 'sticky', top: '100px' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '1.2rem' }}><SlidersHorizontal size={20} /> Output Settings</h3>

                            {/* Format */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>Output Format</label>
                                <select
                                    value={imageSettings.format}
                                    onChange={(e) => setImageSettings(prev => ({ ...prev, format: e.target.value }))}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                                >
                                    <option value="">Same as input</option>
                                    <option value="webp">WebP — Best for web</option>
                                    <option value="avif">AVIF — Maximum compression</option>
                                    <option value="jpeg">JPEG — Universal compatibility</option>
                                    <option value="png">PNG — Lossless transparency</option>
                                    <option value="tiff">TIFF — Print quality</option>
                                    <option value="gif">GIF — Animated/simple graphics</option>
                                    <option value="heif">HEIF — Apple ecosystem</option>
                                </select>
                            </div>

                            {/* Quality */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
                                    Quality <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{imageSettings.quality}%</span>
                                </label>
                                <input
                                    type="range" min="1" max="100"
                                    value={imageSettings.quality}
                                    onChange={(e) => setImageSettings(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                                    style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <span>Smallest file</span><span>Best quality</span>
                                </div>
                            </div>

                            {/* Resize */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>Resize (optional)</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="number" placeholder="Width"
                                        value={imageSettings.width}
                                        onChange={(e) => setImageSettings(prev => ({ ...prev, width: e.target.value }))}
                                        style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                    <span style={{ alignSelf: 'center', color: 'var(--text-muted)' }}>×</span>
                                    <input
                                        type="number" placeholder="Height"
                                        value={imageSettings.height}
                                        onChange={(e) => setImageSettings(prev => ({ ...prev, height: e.target.value }))}
                                        style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Toggles */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '12px', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Strip Metadata</span>
                                    <input type="checkbox" checked={imageSettings.stripMetadata} onChange={(e) => setImageSettings(prev => ({ ...prev, stripMetadata: e.target.checked }))} style={{ accentColor: 'var(--accent-primary)', width: '20px', height: '20px' }} />
                                </label>
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '12px', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Maintain Aspect Ratio</span>
                                    <input type="checkbox" checked={imageSettings.maintainAspectRatio} onChange={(e) => setImageSettings(prev => ({ ...prev, maintainAspectRatio: e.target.checked }))} style={{ accentColor: 'var(--accent-primary)', width: '20px', height: '20px' }} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════ Tab: History ═══════════ */}
            {activeTab === 'history' && (
                <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    {history && history.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-tertiary)' }}>
                                        <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>File</th>
                                        <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>Action</th>
                                        <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>Savings</th>
                                        <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 500 }}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item) => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <ImageIcon size={18} color="var(--text-muted)" />
                                                    </div>
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500, maxWidth: '200px' }}>{item.file_name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ padding: '4px 12px', borderRadius: '100px', background: 'rgba(46,213,115,0.1)', color: '#2ed573', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>{item.action_type}</span>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                {item.action_type === 'compress' ? (
                                                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>{formatBytes(item.original_size)} → {formatBytes(item.processed_size)}</span>
                                                ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                                            </td>
                                            <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{formatDate(item.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: '64px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={32} color="var(--text-muted)" />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>No activity yet</h3>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '300px' }}>Your optimization history will appear here as you process images.</p>
                            <button onClick={() => setActiveTab('optimize')} className="btn btn-secondary" style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                Start Optimizing <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════ Tab: Settings/Preferences ═══════════ */}
            {activeTab === 'settings' && (
                <div style={{ maxWidth: '600px' }}>
                    <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', padding: '32px', marginBottom: '24px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem', marginBottom: '8px' }}><Settings size={20} /> Default Preferences</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6 }}>These settings will be your default every time you open the optimizer.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '16px' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Auto-Convert to WebP</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Automatically output all images as WebP for maximum compression.</div>
                                </div>
                                <button
                                    onClick={() => setPrefsAutoWebP(!prefsAutoWebP)}
                                    style={{
                                        width: '48px', height: '28px', borderRadius: '20px', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                                        background: prefsAutoWebP ? 'var(--accent-primary)' : 'var(--border)', transition: 'background 0.2s',
                                    }}
                                >
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', transition: 'left 0.2s', left: prefsAutoWebP ? '23px' : '3px' }} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '16px' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Strip EXIF Metadata</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Remove GPS, camera model, and other metadata from exported images.</div>
                                </div>
                                <button
                                    onClick={() => setPrefsStripMeta(!prefsStripMeta)}
                                    style={{
                                        width: '48px', height: '28px', borderRadius: '20px', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                                        background: prefsStripMeta ? 'var(--accent-primary)' : 'var(--border)', transition: 'background 0.2s',
                                    }}
                                >
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', transition: 'left 0.2s', left: prefsStripMeta ? '23px' : '3px' }} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', padding: '32px' }}>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Account</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>Signed in as <strong style={{ color: 'var(--text-primary)' }}>{user.email}</strong></p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '16px', lineHeight: 1.6 }}>
                            Need to change your password or manage your account? Head to the <Link href="/" style={{ color: 'var(--accent-primary)' }}>homepage</Link> and click "Forgot Password" in the login modal.
                        </p>
                    </div>
                </div>
            )}

            {/* ═══════════ Tab: Video ═══════════ */}
            {activeTab === 'video' && (
                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                    {/* Left: Video Dropzone & Results */}
                    <div style={{ flex: '1 1 55%', minWidth: '300px' }}>
                        {!videoResult ? (
                            <>
                                <div
                                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f && f.type.startsWith('video/')) { setVideoFile(f); setVideoResult(null); setVideoError(null); } }}
                                    onDragOver={(e) => e.preventDefault()}
                                    style={{ border: '2px dashed var(--border)', borderRadius: '24px', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-card)', marginBottom: '24px' }}
                                    onClick={() => document.getElementById('dashboard-video-input').click()}
                                >
                                    <Film size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                                    <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Drop a video file here or click to browse</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>MP4, WebM, MOV, AVI • Requires login</p>
                                    <input id="dashboard-video-input" type="file" accept="video/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setVideoFile(f); setVideoResult(null); setVideoError(null); } }} style={{ display: 'none' }} />
                                </div>

                                {videoFile && (
                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '16px' }}>
                                            <Film size={24} color="var(--accent-primary)" />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{videoFile.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatBytes(videoFile.size)} • {videoFile.type}</div>
                                            </div>
                                            <button onClick={() => setVideoFile(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                                        </div>

                                        <button
                                            className="btn btn-primary btn-large"
                                            disabled={videoProcessing}
                                            onClick={async () => {
                                                setVideoProcessing(true);
                                                setVideoError(null);
                                                try {
                                                    const supabase = createClient();
                                                    const { data: { session } } = await supabase.auth.getSession();
                                                    const headers = {};
                                                    if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
                                                    const formData = new FormData();
                                                    formData.append('file', videoFile);
                                                    formData.append('action', videoSettings.action);
                                                    formData.append('format', videoSettings.format);
                                                    formData.append('quality', String(videoSettings.quality));
                                                    const response = await fetch(`${apiClient.getServerUrl()}/api/media/process`, { method: 'POST', body: formData, headers });
                                                    if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error(err.message || 'Video processing failed'); }
                                                    const data = await response.json();
                                                    setVideoResult(data.result);

                                                    setHistory(prev => [{
                                                        id: crypto.randomUUID(),
                                                        file_name: data.result.originalName,
                                                        action_type: videoSettings.action,
                                                        original_size: data.result.originalSize,
                                                        processed_size: data.result.processedSize,
                                                        created_at: new Date().toISOString()
                                                    }, ...prev]);
                                                } catch (err) { setVideoError(err.message); } finally { setVideoProcessing(false); }
                                            }}
                                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            {videoProcessing ? <><RefreshCw size={18} className="spinner" /> Compressing...</> : <><Zap size={18} fill="currentColor" /> Compress Video</>}
                                        </button>
                                    </div>
                                )}

                                {videoError && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', color: '#ef4444' }}>
                                        <AlertTriangle size={20} /> {videoError}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{formatBytes(videoResult.originalSize)}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Original</div>
                                    </div>
                                    <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{formatBytes(videoResult.processedSize)}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Compressed</div>
                                    </div>
                                    <div style={{ padding: '16px', background: 'rgba(46,213,115,0.1)', borderRadius: '16px', border: '1px solid rgba(46,213,115,0.2)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2ed573' }}>{videoResult.savingsPercent}%</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Saved</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '16px' }}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{videoResult.originalName}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatBytes(videoResult.originalSize)} → {formatBytes(videoResult.processedSize)}</div>
                                    </div>
                                    <a href={`${apiClient.getServerUrl()}/api/media/${videoResult.processedName}/download`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem', borderRadius: '100px', textDecoration: 'none' }}>
                                        <Download size={16} /> Download
                                    </a>
                                </div>

                                <button onClick={() => { setVideoFile(null); setVideoResult(null); }} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <RefreshCw size={18} /> Compress Another
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Video Settings */}
                    <div style={{ flex: '1 1 35%', minWidth: '280px' }}>
                        <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', padding: '24px', position: 'sticky', top: '100px' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '1.2rem' }}><SlidersHorizontal size={20} /> Video Settings</h3>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>Output Format</label>
                                <select value={videoSettings.format} onChange={(e) => setVideoSettings(prev => ({ ...prev, format: e.target.value }))} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}>
                                    <option value="mp4">MP4 — Universal</option>
                                    <option value="webm">WebM — Web optimized</option>
                                    <option value="avi">AVI — Legacy</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
                                    Compression Level (CRF) <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{videoSettings.quality}</span>
                                </label>
                                <input type="range" min="18" max="40" value={videoSettings.quality} onChange={(e) => setVideoSettings(prev => ({ ...prev, quality: parseInt(e.target.value) }))} style={{ width: '100%', accentColor: 'var(--accent-primary)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <span>Best quality</span><span>Smallest file</span>
                                </div>
                            </div>

                            <div style={{ padding: '16px', background: 'rgba(108,92,231,0.08)', borderRadius: '12px', marginTop: '16px' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    <strong>CRF 18–23:</strong> Near-lossless, large output<br />
                                    <strong>CRF 24–28:</strong> Good balance (recommended)<br />
                                    <strong>CRF 29–40:</strong> Heavy compression, smaller file
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
