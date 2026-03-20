'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    History, Image as ImageIcon, Settings, SlidersHorizontal,
    ArrowRight, Upload, Pencil, Check, X, Download, RefreshCw, AlertTriangle, BarChart3, Film, Package,
    Users, Copy, Share2, Gift, Crown, Calendar, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import SubscriptionPaywall from '@/components/SubscriptionPaywall';
import { apiClient } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';
import type {
    DashboardClientProps, DashboardTab, DashboardFileNames, ImageSettings,
    VideoSettings, VideoResult, ProcessedImage, ProcessingSummary,
    FileWithCustomName, ProcessingHistoryItem, SubscriptionStatus, ReferralStats,
} from '@/types';

// ─── Helper Functions ───────────────────────────────────────────
function formatBytes(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// ─── Skeleton ────────────────────────────────────────────────────
function SkeletonBox({ width, height, style }: { width?: string; height?: string; style?: React.CSSProperties }): React.JSX.Element {
    return (
        <div style={{
            width: width || '100%',
            height: height || '16px',
            background: 'linear-gradient(90deg, #1e1e2e 25%, #2a2a3e 50%, #1e1e2e 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeletonPulse 1.5s ease-in-out infinite',
            borderRadius: '8px',
            ...style,
        }} />
    );
}

// ─── Tabs ────────────────────────────────────────────────────────
const LogoIcon = ({ size: _size }: { size?: number }): React.JSX.Element => <img src="/logo.png" alt="Optimage" style={{ height: '1.1em', width: 'auto', objectFit: 'contain', verticalAlign: 'middle' }} />;

const TABS: { key: DashboardTab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { key: 'optimize', label: 'Images', icon: LogoIcon },
    { key: 'video', label: 'Video', icon: Film },
    { key: 'history', label: 'History', icon: History },
    { key: 'referrals', label: 'Referrals', icon: Users },
    { key: 'settings', label: 'Preferences', icon: Settings },
];

// ─── Main Component ──────────────────────────────────────────────
export default function DashboardClient({ user, profile, history: initialHistory }: DashboardClientProps): React.JSX.Element {
    const [history, setHistory] = useState<ProcessingHistoryItem[]>(initialHistory || []);
    const [activeTab, setActiveTab] = useState<DashboardTab>('optimize');

    // ── Inline optimizer state ─────────────────────────
    const [files, setFiles] = useState<FileWithCustomName[]>([]);
    const [fileNames, setFileNames] = useState<DashboardFileNames>({});
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [imageSettings, setImageSettings] = useState<ImageSettings>({
        format: '', quality: 80, width: '', height: '',
        rotate: 0, autoEnhance: false,
        stripMetadata: true, maintainAspectRatio: true,
    });
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [processed, setProcessed] = useState<number>(0);
    const [results, setResults] = useState<ProcessedImage[] | null>(null);
    const [summary, setSummary] = useState<ProcessingSummary | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ── Prefs state (UI-only for now) ──────────────────
    const [prefsAutoWebP, setPrefsAutoWebP] = useState<boolean>(true);
    const [prefsStripMeta, setPrefsStripMeta] = useState<boolean>(true);

    // ── Video state ────────────────────────────────────
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoSettings, setVideoSettings] = useState<VideoSettings>({ format: 'mp4', quality: 28, action: 'compress' });
    const [videoProcessing, setVideoProcessing] = useState<boolean>(false);
    const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
    const [videoError, setVideoError] = useState<string | null>(null);

    // ── Subscription & Referral state ────────────────────
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
    const [subscriptionLoading, setSubscriptionLoading] = useState<boolean>(true);
    const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
    const [referralLoading, setReferralLoading] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);
    const [showPaywall, setShowPaywall] = useState<boolean>(false);

    useEffect(() => {
        // Load subscription status
        apiClient.getSubscriptionStatus()
            .then(setSubscriptionStatus)
            .catch(() => {
                setSubscriptionStatus({ active: false, expiresAt: null });
            })
            .finally(() => setSubscriptionLoading(false));

        // Load referral stats
        apiClient.getReferralStats()
            .then(setReferralStats)
            .catch(() => setReferralStats(null))
            .finally(() => setReferralLoading(false));
    }, []);

    // ── Load preferences from localStorage on mount ───
    useEffect(() => {
        try {
            const storedAutoWebP = localStorage.getItem('pref_auto_webp');
            const storedStripMeta = localStorage.getItem('pref_strip_meta');
            const autoWebP = storedAutoWebP !== null ? storedAutoWebP === 'true' : false;
            const stripMeta = storedStripMeta !== null ? storedStripMeta !== 'false' : true;
            if (storedAutoWebP !== null) setPrefsAutoWebP(autoWebP);
            if (storedStripMeta !== null) setPrefsStripMeta(stripMeta);
            setImageSettings(prev => ({
                ...prev,
                ...(storedAutoWebP !== null && { format: autoWebP ? 'webp' : prev.format }),
                ...(storedStripMeta !== null && { stripMetadata: stripMeta }),
            }));
        } catch { /* localStorage not available */ }
    }, []);

    const handlePrefsAutoWebPChange = (val: boolean): void => {
        setPrefsAutoWebP(val);
        try { localStorage.setItem('pref_auto_webp', String(val)); } catch { /* ignore */ }
        setImageSettings(prev => ({ ...prev, format: val ? 'webp' : '' }));
    };

    const handlePrefsStripMetaChange = (val: boolean): void => {
        setPrefsStripMeta(val);
        try { localStorage.setItem('pref_strip_meta', String(val)); } catch { /* ignore */ }
        setImageSettings(prev => ({ ...prev, stripMetadata: val }));
    };

    const referralLink = referralStats?.referralCode
        ? `${typeof window !== 'undefined' ? window.location.origin : 'https://optimage.dreamintrepid.com'}/?ref=${referralStats.referralCode}`
        : null;

    const handleCopyReferralLink = (): void => {
        if (!referralLink) return;
        navigator.clipboard.writeText(referralLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = referralLink;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleShareTwitter = (): void => {
        if (!referralLink) return;
        const text = encodeURIComponent('Check out Optimage, the fastest way to optimize images, compress videos, and transcribe media! 🚀');
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`, '_blank');
    };

    const handleShareWhatsApp = (): void => {
        if (!referralLink) return;
        const text = encodeURIComponent(`Check out Optimage: optimize images, compress videos & transcribe media! ${referralLink}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const handleShareEmail = (): void => {
        if (!referralLink) return;
        const subject = encodeURIComponent('Try Optimage: Image & Media Optimization');
        const body = encodeURIComponent(`Hey! I've been using Optimage to optimize images and compress videos. Check it out:\n\n${referralLink}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
    };

    const formatSubscriptionDate = (dateStr: string): string => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
    };

    const getSubscriptionDaysLeft = (expiresAt: string): number => {
        const now = new Date();
        const expires = new Date(expiresAt);
        return Math.max(0, Math.ceil((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    };

    // ── Stats ──────────────────────────────────────────
    const totalProcessed = history?.length || 0;
    const totalSaved = history?.reduce((acc, curr) => {
        if (curr.action_type === 'compress') return acc + ((curr.original_size || 0) - (curr.processed_size || 0));
        return acc;
    }, 0) || 0;

    // ── File Handling ──────────────────────────────────
    const handleFilesAdded = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        const incomingFiles = Array.from(e.target.files || []) as FileWithCustomName[];
        setFiles(prev => [...prev, ...incomingFiles].slice(0, 50));
        setResults(null);
        setSummary(null);
        setError(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const incomingFiles = (Array.from(e.dataTransfer.files) as FileWithCustomName[]).filter(f => f.type.startsWith('image/'));
        setFiles(prev => [...prev, ...incomingFiles].slice(0, 50));
        setResults(null);
        setSummary(null);
        setError(null);
    }, []);

    const handleRemoveFile = useCallback((index: number): void => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setFileNames(prev => {
            const clone = { ...prev };
            delete clone[index];
            return clone;
        });
    }, []);

    const handleClearAll = useCallback((): void => {
        setFiles([]);
        setFileNames({});
        setResults(null);
        setSummary(null);
        setError(null);
        setProcessed(0);
    }, []);

    // ── Rename Handling ────────────────────────────────
    const startRename = (index: number): void => {
        const file = files[index];
        const currentName = fileNames[index] ?? (file ? file.name.replace(/\.[^/.]+$/, '') : '');
        setEditingIndex(index);
        setEditValue(currentName);
    };
    const saveRename = (index: number): void => {
        setFileNames(prev => ({ ...prev, [index]: editValue }));
        setEditingIndex(null);
    };
    const cancelRename = (): void => {
        setEditingIndex(null);
        setEditValue('');
    };

    const getDisplayName = (index: number): string => {
        const custom = fileNames[index];
        if (custom) return custom;
        const file = files[index];
        return file ? file.name.replace(/\.[^/.]+$/, '') : '';
    };

    // ── Thumbnails ─────────────────────────────────────
    const thumbnails = useMemo(() => {
        return files.map(file => URL.createObjectURL(file));
    }, [files]);

    // ── Processing ─────────────────────────────────────
    const handleOptimize = async (): Promise<void> => {
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
        } catch (err: unknown) {
            console.error('Processing error:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = async (processedName: string, index: number): Promise<void> => {
        const customName = fileNames[index];
        const ext = processedName.split('.').pop() ?? '';
        const downloadFileName = customName ? `${customName}.${ext}` : processedName;
        try {
            const response = await fetch(apiClient.getDownloadUrl(processedName));
            if (!response.ok) throw new Error('Download failed');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = downloadFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err: unknown) {
            console.error('Download failed:', err instanceof Error ? err.message : 'Unknown error');
            alert('Download failed. Please try again.');
        }
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}><ImageIcon size={16} /> Images Processed</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalProcessed}</div>
                </div>
                <div style={{ padding: '20px', background: 'var(--gradient-primary)', borderRadius: '20px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, fontSize: '0.9rem', marginBottom: '8px' }}>
                        <img src="/logo.png" alt="Bandwidth" style={{ height: '1.2em', width: 'auto', objectFit: 'contain' }} /> Bandwidth Saved
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{formatBytes(totalSaved)}</div>
                    <img src="/logo.png" alt="" style={{ position: 'absolute', right: '-10px', bottom: '-10px', width: '80px', height: '80px', opacity: 0.15, objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}><BarChart3 size={16} /> Avg Compression</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800 }}>{totalProcessed > 0 && totalSaved > 0 ? `${((totalSaved / (totalSaved + (history?.reduce((a, c) => a + (c.processed_size || 0), 0) || 1))) * 100).toFixed(0)}%` : 'N/A'}</div>
                </div>
                {/* Subscription stat skeleton */}
                {subscriptionLoading && (
                    <div style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                        <SkeletonBox height="14px" width="70%" style={{ marginBottom: '12px' }} />
                        <SkeletonBox height="28px" width="50%" />
                    </div>
                )}
            </div>

            {/* Subscription Status Card */}
            {subscriptionLoading ? (
                <div style={{ padding: '20px 24px', borderRadius: '20px', marginBottom: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <SkeletonBox width="20px" height="20px" style={{ borderRadius: '50%', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <SkeletonBox height="14px" width="160px" style={{ marginBottom: '8px' }} />
                            <SkeletonBox height="12px" width="240px" />
                        </div>
                        <SkeletonBox width="110px" height="36px" style={{ borderRadius: '100px', flexShrink: 0 }} />
                    </div>
                </div>
            ) : subscriptionStatus && (
                <div style={{
                    borderRadius: '20px', marginBottom: '24px',
                    background: subscriptionStatus.active ? 'rgba(46,213,115,0.06)' : 'rgba(239,68,68,0.06)',
                    border: `1px solid ${subscriptionStatus.active ? 'rgba(46,213,115,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    overflow: 'hidden',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '20px 24px', flexWrap: 'wrap', gap: '12px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Crown size={22} style={{ color: subscriptionStatus.active ? '#2ed573' : '#ef4444', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                    {subscriptionStatus.active ? 'Active Subscription' : 'No Active Subscription'}
                                </div>
                                {subscriptionStatus.active && subscriptionStatus.expiresAt ? (() => {
                                    const daysLeft = getSubscriptionDaysLeft(subscriptionStatus.expiresAt);
                                    const daysColor = daysLeft > 7 ? '#2ed573' : daysLeft >= 3 ? '#fdcb6e' : '#ef4444';
                                    return (
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={13} style={{ verticalAlign: 'middle' }} />
                                                Expires {formatSubscriptionDate(subscriptionStatus.expiresAt)}
                                            </span>
                                            <span style={{
                                                padding: '2px 10px', borderRadius: '100px', fontSize: '0.78rem',
                                                fontWeight: 700, color: daysColor,
                                                background: daysLeft > 7 ? 'rgba(46,213,115,0.1)' : daysLeft >= 3 ? 'rgba(253,203,110,0.1)' : 'rgba(239,68,68,0.1)',
                                            }}>
                                                {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                                            </span>
                                        </div>
                                    );
                                })() : subscriptionStatus.active ? (
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>VIP - Permanent access</div>
                                ) : (
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Subscribe to process images, compress videos, and more</div>
                                )}
                            </div>
                        </div>
                        {!subscriptionStatus.active && (
                            <button
                                onClick={() => setShowPaywall(true)}
                                className="btn btn-primary"
                                style={{ padding: '10px 24px', fontSize: '0.9rem', borderRadius: '100px', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer' }}
                            >
                                Upgrade
                            </button>
                        )}
                    </div>

                    {/* Cancellation info */}
                    {subscriptionStatus.active && (
                        <div style={{
                            padding: '12px 24px',
                            borderTop: `1px solid ${subscriptionStatus.active ? 'rgba(46,213,115,0.15)' : 'rgba(239,68,68,0.15)'}`,
                            fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6,
                        }}>
                            To cancel your subscription, contact us at{' '}
                            <a href="mailto:optimage@dreamintrepid.com" style={{ color: 'var(--accent-secondary)', textDecoration: 'none' }}>
                                optimage@dreamintrepid.com
                            </a>{' '}
                            or manage it directly via your payment provider.
                        </div>
                    )}
                </div>
            )}

            {/* Tab Navigation */}
            <div className="dashboard-tabs">
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
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {/* Left: Dropzone + File List */}
                    <div style={{ flex: '1 1 55%', minWidth: '280px' }}>
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
                                    onClick={() => document.getElementById('dashboard-file-input')?.click()}
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
                                                    <><img src="/logo.png" alt="Optimize" style={{ height: '1.2em', width: 'auto', objectFit: 'contain' }} /> Optimize {files.length} Image{files.length !== 1 ? 's' : ''}</>
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
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{summary?.filesProcessed ?? 0}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Processed</div>
                                    </div>
                                    <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatBytes(summary?.totalOriginalSize ?? 0)}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Original</div>
                                    </div>
                                    <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatBytes(summary?.totalProcessedSize ?? 0)}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>New Size</div>
                                    </div>
                                    <div style={{ padding: '16px', background: 'rgba(46,213,115,0.1)', borderRadius: '16px', border: '1px solid rgba(46,213,115,0.2)', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2ed573' }}>{summary?.totalSavingsPercent ?? '0'}%</div>
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

                                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                    {results.length > 1 && (
                                        <button
                                            onClick={async () => {
                                                const processedNames = results.map(r => r.processedName);
                                                try {
                                                    await apiClient.downloadBulkImages(processedNames);
                                                } catch (err: unknown) {
                                                    console.error('Bulk download failed:', err);
                                                    alert('Failed to download ZIP. Please try individual downloads.');
                                                }
                                            }}
                                            className="btn btn-secondary"
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            <Package size={20} /> Download All as ZIP
                                        </button>
                                    )}
                                    <button onClick={handleClearAll} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <RefreshCw size={18} /> Optimize More
                                    </button>
                                </div>
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
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setImageSettings(prev => ({ ...prev, format: e.target.value as ImageSettings['format'] }))}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                                >
                                    <option value="">Same as input</option>
                                    <option value="webp">WebP (Best for web)</option>
                                    <option value="avif">AVIF (Maximum compression)</option>
                                    <option value="jpeg">JPEG (Universal compatibility)</option>
                                    <option value="png">PNG (Lossless transparency)</option>
                                    <option value="tiff">TIFF (Print quality)</option>
                                    <option value="gif">GIF (Animated/simple graphics)</option>
                                    <option value="heif">HEIF (Apple ecosystem)</option>
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
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <input
                                        type="number" placeholder="Width"
                                        value={imageSettings.width}
                                        onChange={(e) => setImageSettings(prev => ({ ...prev, width: e.target.value }))}
                                        style={{ flex: '1 1 40%', minWidth: '80px', padding: '10px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                    <span style={{ color: 'var(--text-muted)' }}>×</span>
                                    <input
                                        type="number" placeholder="Height"
                                        value={imageSettings.height}
                                        onChange={(e) => setImageSettings(prev => ({ ...prev, height: e.target.value }))}
                                        style={{ flex: '1 1 40%', minWidth: '80px', padding: '10px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Rotation */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>Rotation</label>
                                <select
                                    value={imageSettings.rotate ?? 0}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setImageSettings(prev => ({ ...prev, rotate: parseInt(e.target.value) as ImageSettings['rotate'] }))}
                                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                                >
                                    <option value={0}>No rotation</option>
                                    <option value={90}>90° Clockwise</option>
                                    <option value={180}>180° Flip</option>
                                    <option value={270}>270° (90° Counter-CW)</option>
                                </select>
                            </div>

                            {/* Toggles */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '12px', cursor: 'pointer' }}>
                                    <div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block' }}>Auto-Enhance</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Boost brightness, contrast &amp; sharpness</span>
                                    </div>
                                    <input type="checkbox" checked={imageSettings.autoEnhance ?? false} onChange={(e) => setImageSettings(prev => ({ ...prev, autoEnhance: e.target.checked }))} style={{ accentColor: 'var(--accent-primary)', width: '20px', height: '20px', flexShrink: 0 }} />
                                </label>
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
                                                ) : <span style={{ color: 'var(--text-muted)' }}>-</span>}
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

            {/* ═══════════ Tab: Referrals ═══════════ */}
            {activeTab === 'referrals' && (
                <div style={{ maxWidth: '700px' }}>
                    {/* Referral Hero Card */}
                    <div style={{
                        background: 'var(--gradient-primary)', borderRadius: '24px',
                        padding: '32px', marginBottom: '24px', color: 'white', position: 'relative', overflow: 'hidden',
                    }}>
                        <img src="/logo.png" alt="" style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '120px', height: '120px', opacity: 0.1, objectFit: 'contain' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <Gift size={28} />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Invite Friends, Get Rewarded</h2>
                        </div>
                        <p style={{ opacity: 0.9, lineHeight: 1.6, maxWidth: '500px', margin: 0 }}>
                            Share your unique referral link. When a friend subscribes, you both win: they get a discount and you earn free subscription time.
                        </p>
                    </div>

                    {/* Referral Link Card */}
                    <div style={{
                        background: 'var(--bg-card)', borderRadius: '24px',
                        border: '1px solid var(--border)', padding: '28px', marginBottom: '24px',
                    }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '16px' }}>
                            <Share2 size={20} /> Your Referral Link
                        </h3>

                        {referralLoading ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                        ) : referralLink ? (
                            <>
                                {/* Link display + copy */}
                                <div style={{
                                    display: 'flex', gap: '8px', marginBottom: '20px',
                                }}>
                                    <div style={{
                                        flex: 1, padding: '12px 16px', borderRadius: '12px',
                                        background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                                        fontSize: '0.9rem', color: 'var(--text-primary)',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        fontFamily: 'monospace',
                                    }}>
                                        {referralLink}
                                    </div>
                                    <button
                                        onClick={handleCopyReferralLink}
                                        className="btn btn-primary"
                                        style={{
                                            padding: '12px 20px', borderRadius: '12px',
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            fontSize: '0.9rem', whiteSpace: 'nowrap', flexShrink: 0,
                                        }}
                                    >
                                        {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
                                    </button>
                                </div>

                                {/* Share buttons */}
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={handleShareTwitter}
                                        style={{
                                            flex: '1 1 auto', padding: '12px 16px', borderRadius: '12px',
                                            border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)',
                                            transition: 'border-color 0.2s',
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                        Share on X
                                    </button>
                                    <button
                                        onClick={handleShareWhatsApp}
                                        style={{
                                            flex: '1 1 auto', padding: '12px 16px', borderRadius: '12px',
                                            border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)',
                                            transition: 'border-color 0.2s',
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                        WhatsApp
                                    </button>
                                    <button
                                        onClick={handleShareEmail}
                                        style={{
                                            flex: '1 1 auto', padding: '12px 16px', borderRadius: '12px',
                                            border: '1px solid var(--border)', background: 'var(--bg-tertiary)',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)',
                                            transition: 'border-color 0.2s',
                                        }}
                                    >
                                        <ExternalLink size={16} /> Email
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Your referral code will be generated when your account is fully set up.
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '16px', marginBottom: '24px',
                    }}>
                        <div style={{
                            padding: '24px', background: 'var(--bg-card)', borderRadius: '20px',
                            border: '1px solid var(--border)', textAlign: 'center',
                        }}>
                            <Users size={24} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                                {referralStats?.totalReferred ?? 0}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                Friends Referred
                            </div>
                        </div>
                        <div style={{
                            padding: '24px', background: 'var(--bg-card)', borderRadius: '20px',
                            border: '1px solid var(--border)', textAlign: 'center',
                        }}>
                            <Check size={24} color="#2ed573" style={{ marginBottom: '12px' }} />
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                                {referralStats?.totalConverted ?? 0}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                Subscribed
                            </div>
                        </div>
                        <div style={{
                            padding: '24px', background: 'var(--bg-card)', borderRadius: '20px',
                            border: '1px solid var(--border)', textAlign: 'center',
                        }}>
                            <Gift size={24} color="var(--accent-secondary)" style={{ marginBottom: '12px' }} />
                            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                                {referralStats?.rewardEarned ?? 'None yet'}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                Reward Earned
                            </div>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div style={{
                        background: 'var(--bg-card)', borderRadius: '24px',
                        border: '1px solid var(--border)', padding: '28px',
                    }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>How It Works</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { step: '1', title: 'Share your link', desc: 'Send your unique referral link to friends or share on social media.' },
                                { step: '2', title: 'Friend subscribes', desc: 'When they sign up and subscribe through your link, they get a discount.' },
                                { step: '3', title: 'You get rewarded', desc: 'You earn free subscription time for every friend who subscribes.' },
                            ].map((item) => (
                                <div key={item.step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        background: 'var(--gradient-primary)', color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 800, fontSize: '0.9rem', flexShrink: 0,
                                    }}>
                                        {item.step}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
                                    onClick={() => handlePrefsAutoWebPChange(!prefsAutoWebP)}
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
                                    onClick={() => handlePrefsStripMetaChange(!prefsStripMeta)}
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

                        {/* Subscription Info */}
                        {subscriptionLoading ? (
                            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
                                <SkeletonBox height="14px" width="50%" style={{ marginBottom: '10px' }} />
                                <SkeletonBox height="12px" width="75%" />
                            </div>
                        ) : subscriptionStatus && (
                            <div style={{
                                marginTop: '16px', padding: '16px', borderRadius: '12px',
                                background: 'var(--bg-tertiary)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <Crown size={16} style={{ color: subscriptionStatus.active ? '#2ed573' : 'var(--text-muted)' }} />
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                        {subscriptionStatus.active ? 'Active Subscription' : 'No Subscription'}
                                    </span>
                                </div>
                                {subscriptionStatus.active && subscriptionStatus.expiresAt ? (() => {
                                    const daysLeft = getSubscriptionDaysLeft(subscriptionStatus.expiresAt);
                                    const daysColor = daysLeft > 7 ? '#2ed573' : daysLeft >= 3 ? '#fdcb6e' : '#ef4444';
                                    return (
                                        <>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 6px' }}>
                                                Expires {formatSubscriptionDate(subscriptionStatus.expiresAt)}
                                            </p>
                                            <span style={{
                                                fontSize: '0.8rem', fontWeight: 700, color: daysColor,
                                            }}>
                                                {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                                            </span>
                                        </>
                                    );
                                })() : subscriptionStatus.active ? (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                                        VIP - Lifetime access
                                    </p>
                                ) : (
                                    <button onClick={() => setShowPaywall(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', fontSize: '0.85rem', padding: 0, textAlign: 'left' }}>
                                        Subscribe to unlock all features
                                    </button>
                                )}
                            </div>
                        )}

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '16px', lineHeight: 1.6 }}>
                            Need to change your password or manage your account? Head to the <Link href="/" style={{ color: 'var(--accent-primary)' }}>homepage</Link> and click &quot;Forgot Password&quot; in the login modal.
                        </p>
                    </div>
                </div>
            )}

            {/* ═══════════ Subscription Paywall Modal ═══════════ */}
            {showPaywall && (
                <SubscriptionPaywall
                    onSubscribed={() => {
                        setShowPaywall(false);
                        apiClient.getSubscriptionStatus().then(setSubscriptionStatus).catch(() => {});
                    }}
                    onClose={() => setShowPaywall(false)}
                />
            )}

            {/* ═══════════ Tab: Video ═══════════ */}
            {activeTab === 'video' && (
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {/* Left: Video Dropzone & Results */}
                    <div style={{ flex: '1 1 55%', minWidth: '280px' }}>
                        {!videoResult ? (
                            <>
                                <div
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const f = e.dataTransfer.files[0];
                                        if (f && f.type.startsWith('video/')) {
                                            const maxVideoSizeMb = parseInt(process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE_MB || '50', 10);
                                            const MAX_SIZE = maxVideoSizeMb * 1024 * 1024;
                                            if (f.size > MAX_SIZE) {
                                                setVideoError(`Video exceeds the ${maxVideoSizeMb}MB maximum limit for this environment.`);
                                                setVideoFile(null);
                                            } else {
                                                setVideoFile(f); setVideoResult(null); setVideoError(null);
                                            }
                                        }
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                    style={{ border: '2px dashed var(--border)', borderRadius: '24px', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-card)', marginBottom: '24px' }}
                                    onClick={() => document.getElementById('dashboard-video-input')?.click()}
                                >
                                    <Film size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                                    <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Drop a video file here or click to browse</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>MP4, WebM, MOV, AVI • Max {process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE_MB || '50'}MB • Requires login</p>
                                    <input id="dashboard-video-input" type="file" accept="video/*" onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) {
                                            const maxVideoSizeMb = parseInt(process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE_MB || '50', 10);
                                            const MAX_SIZE = maxVideoSizeMb * 1024 * 1024;
                                            if (f.size > MAX_SIZE) {
                                                setVideoError(`Video exceeds the ${maxVideoSizeMb}MB maximum limit for this environment.`);
                                                setVideoFile(null);
                                            } else {
                                                setVideoFile(f); setVideoResult(null); setVideoError(null);
                                            }
                                        }
                                    }} style={{ display: 'none' }} />
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
                                                    const headers: Record<string, string> = {};
                                                    if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
                                                    const formData = new FormData();
                                                    formData.append('file', videoFile);
                                                    formData.append('action', videoSettings.action);
                                                    formData.append('format', videoSettings.format);
                                                    formData.append('quality', String(videoSettings.quality));
                                                    const response = await fetch(`${apiClient.getServerUrl()}/api/media/process`, { method: 'POST', body: formData, headers });
                                                    if (!response.ok) { const errBody = await response.json().catch(() => ({})) as { message?: string }; throw new Error(errBody.message || 'Video processing failed'); }
                                                    const data = await response.json() as { result: VideoResult };
                                                    setVideoResult(data.result);

                                                    setHistory(prev => [{
                                                        id: crypto.randomUUID(),
                                                        file_name: data.result.originalName,
                                                        action_type: videoSettings.action,
                                                        original_size: data.result.originalSize,
                                                        processed_size: data.result.processedSize,
                                                        created_at: new Date().toISOString()
                                                    }, ...prev]);
                                                } catch (err: unknown) { setVideoError(err instanceof Error ? err.message : 'An unknown error occurred'); } finally { setVideoProcessing(false); }
                                            }}
                                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                        >
                                            {videoProcessing ? <> <RefreshCw size={18} className="spinner" /> Compressing...</> : <><img src="/logo.png" alt="Compress" style={{ height: '1.2em', width: 'auto', objectFit: 'contain' }} /> Compress Video</>}
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
                                    <button
                                        className="btn btn-secondary"
                                        onClick={async () => {
                                            try {
                                                const url = `${apiClient.getServerUrl()}/api/media/${videoResult.processedName}/download`;
                                                const response = await fetch(url);
                                                if (!response.ok) throw new Error('Download failed');
                                                const blob = await response.blob();
                                                const objUrl = URL.createObjectURL(blob);
                                                const link = document.createElement('a');
                                                link.href = objUrl;
                                                link.download = videoResult.processedName;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                                URL.revokeObjectURL(objUrl);
                                            } catch (err: unknown) {
                                                console.error('Video download failed:', err instanceof Error ? err.message : 'Unknown error');
                                                alert('Download failed. Please try again.');
                                            }
                                        }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem', borderRadius: '100px' }}
                                    >
                                        <Download size={16} /> Download
                                    </button>
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
                                    <option value="mp4">MP4 (Universal)</option>
                                    <option value="webm">WebM (Web optimized)</option>
                                    <option value="avi">AVI (Legacy)</option>
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

                        {/* AI Transcription Card */}
                        {(() => {
                            const transcriptionAvailable = process.env.NEXT_PUBLIC_OPENAI_AVAILABLE === 'true';
                            return (
                                <div style={{
                                    marginTop: '20px',
                                    background: 'var(--bg-card)',
                                    borderRadius: '24px',
                                    border: '1px solid var(--border)',
                                    padding: '24px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    opacity: transcriptionAvailable ? 1 : 0.8,
                                }}>
                                    {/* Coming Soon overlay badge */}
                                    {!transcriptionAvailable && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '14px',
                                            right: '14px',
                                            background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
                                            color: 'white',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            padding: '4px 10px',
                                            borderRadius: '100px',
                                        }}>
                                            Coming Soon
                                        </div>
                                    )}

                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '1rem', paddingRight: transcriptionAvailable ? 0 : '90px' }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                            <line x1="12" y1="19" x2="12" y2="23" />
                                            <line x1="8" y1="23" x2="16" y2="23" />
                                        </svg>
                                        AI Audio Transcription
                                    </h3>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                                        Automatically transcribe audio tracks from your media files using AI.
                                    </p>

                                    <div title={transcriptionAvailable ? undefined : 'AI transcription is being activated - check back soon.'}>
                                        <button
                                            disabled={!transcriptionAvailable}
                                            style={{
                                                width: '100%',
                                                padding: '11px',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border)',
                                                background: 'var(--bg-tertiary)',
                                                color: transcriptionAvailable ? 'var(--text-primary)' : 'var(--text-muted)',
                                                fontSize: '0.88rem',
                                                fontWeight: 600,
                                                cursor: transcriptionAvailable ? 'pointer' : 'not-allowed',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontFamily: 'inherit',
                                            }}
                                        >
                                            {transcriptionAvailable ? 'Transcribe Audio' : 'AI transcription is being activated - check back soon.'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}
