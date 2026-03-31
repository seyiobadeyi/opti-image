'use client';

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Share2, CheckCircle2, Package, Download,
    Twitter, Linkedin, Copy, Check, Sparkles, Mail,
    Link2, Code2, ExternalLink, FileImage
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { apiClient } from '@/lib/api';
import { subscribeNewsletter } from '@/app/actions';
import type { ResultsPanelProps, FormStatus, NewsletterResult } from '@/types';

// ─── Per-file result row with rich "Use image" menu ─────────────────────────

/**
 * Appends UTM tracking parameters to a URL.
 * Only call on navigable links (not on image src / background-image URLs —
 * those are resource fetches that never run GA, so UTM there is wasted).
 */
function withUtm(url: string, content: string): string {
    const base = url.split('?')[0] ?? url;
    const params = new URLSearchParams({
        utm_source: 'optimage',
        utm_medium: 'hosted_image',
        utm_campaign: 'user_share',
        utm_content: content,
    });
    return `${base}?${params.toString()}`;
}

interface FileResultRowProps {
    result: import('@/types').ProcessedImage;
    savingsNum: number;
    onDownload: () => void;
}

function UseImageMenu({
    hostedUrl, trackedUrl, altText, utmContent, width, height, onClose,
}: {
    hostedUrl: string;
    trackedUrl: string;
    altText: string;
    utmContent: string;
    width: number;
    height: number;
    onClose: () => void;
}) {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const result_width = width;
    const result_height = height;

    const copy = (text: string, key: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 2000);
        });
    };

    const menuItems: { key: string; icon: React.ReactNode; label: string; value: string; description: string }[] = [
        {
            key: 'url',
            icon: <Link2 size={15} />,
            label: 'Copy link',
            value: trackedUrl,
            description: 'Paste anywhere — Notion, WhatsApp, Slack, docs',
        },
        {
            key: 'html',
            icon: <Code2 size={15} />,
            label: 'Copy as HTML',
            value: `<a href="https://optimage.dreamintrepid.com?utm_source=optimage&utm_medium=img_link&utm_campaign=user_embed&utm_content=${utmContent}" title="Optimized with Optimage" target="_blank" rel="noopener">\n  <img src="${hostedUrl}" alt="${altText}" width="${result_width}" height="${result_height}" loading="lazy">\n</a>`,
            description: 'Ready to paste into any website or HTML editor',
        },
        {
            key: 'md',
            icon: <FileImage size={15} />,
            label: 'Copy as Markdown',
            value: `![${altText}](${hostedUrl})`,
            description: 'For GitHub, Notion, Obsidian, or any .md file',
        },
        {
            key: 'css',
            icon: <Code2 size={15} />,
            label: 'Copy as CSS',
            value: `background-image: url('${hostedUrl}');`,
            description: 'Use as a CSS background image',
        },
    ];

    return (
        <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '6px',
            zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            minWidth: '260px',
        }}>
            {/* Preview / open link */}
            <a
                href={trackedUrl ?? hostedUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '10px 12px', borderRadius: '8px',
                    color: 'var(--text-primary)', textDecoration: 'none',
                    transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
                <span style={{ marginTop: '1px', flexShrink: 0, color: 'var(--accent-primary)' }}>
                    <ExternalLink size={15} />
                </span>
                <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Preview in browser</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Open the hosted image in a new tab
                    </div>
                </div>
            </a>

            <div style={{ height: '1px', background: 'var(--border)', margin: '4px 6px' }} />

            {/* Native share on mobile */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
                <>
                    <button
                        onClick={() => {
                            navigator.share({ url: trackedUrl ?? hostedUrl, title: altText }).catch(() => {});
                            onClose();
                        }}
                        style={{
                            display: 'flex', alignItems: 'flex-start', gap: '10px',
                            padding: '10px 12px', width: '100%', borderRadius: '8px',
                            background: 'transparent', border: 'none',
                            color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <span style={{ marginTop: '1px', flexShrink: 0, color: 'var(--accent-primary)' }}>
                            <Share2 size={15} />
                        </span>
                        <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Share</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                WhatsApp, Messages, email, and more
                            </div>
                        </div>
                    </button>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '4px 6px' }} />
                </>
            )}

            {/* Copy options */}
            {menuItems.map(item => (
                <button
                    key={item.key}
                    onClick={() => { copy(item.value, item.key); }}
                    style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '10px 12px', width: '100%', borderRadius: '8px',
                        background: copiedKey === item.key ? 'rgba(46,213,115,0.08)' : 'transparent',
                        border: 'none', color: 'var(--text-primary)',
                        cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (copiedKey !== item.key) e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                    onMouseLeave={e => { if (copiedKey !== item.key) e.currentTarget.style.background = 'transparent'; }}
                >
                    <span style={{
                        marginTop: '1px', flexShrink: 0,
                        color: copiedKey === item.key ? 'var(--success)' : 'var(--accent-primary)',
                    }}>
                        {copiedKey === item.key ? <Check size={15} /> : item.icon}
                    </span>
                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                            {copiedKey === item.key ? 'Copied!' : item.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {item.description}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}

function FileResultCard({
    result, savingsNum, onDownload, setEditedName,
}: FileResultRowProps & { serverUrl: string; setEditedName: (name: string) => void }) {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setLocalEditedName] = useState(result.originalName);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const { hostedUrl, originalName, id } = result;
    const altText = originalName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    const utmContent = id ?? originalName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const trackedUrl = hostedUrl ? withUtm(hostedUrl, utmContent) : undefined;

    const handleNameBlur = () => {
        setIsEditing(false);
        setEditedName(editedName);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            setEditedName(editedName);
        }
    };

    return (
        <div style={{ flexShrink: 0, width: '180px' }}>
            {/* Square thumbnail card */}
            <div
                style={{
                    width: '180px', height: '180px', borderRadius: '12px', overflow: 'hidden',
                    position: 'relative', background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)', flexShrink: 0,
                    cursor: 'pointer',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => hostedUrl && setOpen(v => !v)}
            >
                {hostedUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={hostedUrl}
                        alt={altText}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-muted)',
                    }}>
                        <FileImage size={48} />
                    </div>
                )}

                {/* Hover overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.65)',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDownload(); }}
                        title="Download"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '38px', height: '38px', borderRadius: '8px',
                            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                            color: '#fff', cursor: 'pointer', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                    >
                        <Download size={16} />
                    </button>
                    {hostedUrl && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
                            title="Use image"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '38px', height: '38px', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                                color: '#fff', cursor: 'pointer', transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        >
                            <Link2 size={16} />
                        </button>
                    )}
                </div>

                {/* Use image dropdown */}
                {open && hostedUrl && trackedUrl && (
                    <div ref={menuRef} style={{ position: 'absolute', bottom: 0, left: 0 }} onClick={e => e.stopPropagation()}>
                        <UseImageMenu
                            hostedUrl={hostedUrl}
                            trackedUrl={trackedUrl}
                            altText={altText}
                            utmContent={utmContent}
                            width={result.width}
                            height={result.height}
                            onClose={() => setOpen(false)}
                        />
                    </div>
                )}
            </div>

            {/* Filename — inline editable */}
            <div style={{ marginTop: '8px' }}>
                {isEditing ? (
                    <input
                        autoFocus
                        value={editedName}
                        onChange={e => setLocalEditedName(e.target.value)}
                        onBlur={handleNameBlur}
                        onKeyDown={handleNameKeyDown}
                        style={{
                            fontSize: '0.78rem', fontWeight: 600, width: '180px',
                            background: 'var(--bg-tertiary)', border: '1px solid var(--accent-primary)',
                            borderRadius: '4px', color: 'var(--text-primary)',
                            padding: '2px 4px', outline: 'none',
                        }}
                    />
                ) : (
                    <div
                        onClick={() => setIsEditing(true)}
                        title={result.originalName}
                        style={{
                            fontSize: '0.78rem', fontWeight: 600,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            maxWidth: '180px', cursor: 'text',
                            color: 'var(--text-primary)',
                        }}
                    >
                        {editedName}
                    </div>
                )}
            </div>

            {/* Sizes line */}
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                {formatBytes(result.processedSize)} · <span style={{ color: savingsNum >= 0 ? 'var(--success)' : '#ef4444' }}>
                    −{Math.abs(savingsNum)}%
                </span>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ResultsPanel({ results, summary, serverUrl }: ResultsPanelProps): React.JSX.Element | null {
    const [showShareMenu, setShowShareMenu] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [newsletterEmail, setNewsletterEmail] = useState<string>('');
    const [newsletterStatus, setNewsletterStatus] = useState<FormStatus>('idle');
    const [badgeCopied, setBadgeCopied] = useState<boolean>(false);
    const [editedNames, setEditedNames] = useState<Record<string, string>>({});
    const supabase = useMemo(() => createClient(), []);

    const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!newsletterEmail.trim()) return;
        setNewsletterStatus('loading');
        try {
            const result: NewsletterResult = await subscribeNewsletter(newsletterEmail.trim());
            if (result.error) { setNewsletterStatus('error'); return; }
            setNewsletterStatus('success');
        } catch {
            setNewsletterStatus('error');
            setTimeout(() => setNewsletterStatus('idle'), 3000);
        }
    };

    if (!results || results.length === 0) return null;

    const handleDownload = async (processedName: string, downloadAs?: string): Promise<void> => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.dispatchEvent(new Event('open-auth-modal'));
            return;
        }

        try {
            const response = await fetch(`${serverUrl}/api/images/${processedName}/download`);
            if (!response.ok) throw new Error('Download failed');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = downloadAs ?? processedName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err: unknown) {
            console.error('Download failed:', err instanceof Error ? err.message : 'Unknown error');
            alert('Download failed. Please try again.');
        }
    };

    const handleBulkDownload = async (): Promise<void> => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.dispatchEvent(new Event('open-auth-modal'));
            return;
        }

        const fileNames = results.map((r) => r.processedName);
        try {
            await apiClient.downloadBulkImages(fileNames);
        } catch (err: unknown) {
            console.error('Bulk download failed:', err instanceof Error ? err.message : 'An unknown error occurred');
            alert('Failed to download ZIP. Please try individual downloads.');
        }
    };

    const shareUrl: string = typeof window !== 'undefined' ? (window.location.href.split('?')[0] ?? window.location.href) : '';
    const shareText = `I just shrunk my website images by ${summary.totalSavingsPercent}% using Optimage! Faster load times, better SEO.`;

    const handleShare = async (): Promise<void> => {
        const shareData = { title: 'Optimage', text: shareText, url: shareUrl };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData) && /Mobi|Android/i.test(navigator.userAgent)) {
            // Use native share on strictly mobile devices
            try { await navigator.share(shareData); } catch (err: unknown) { console.error('Error sharing:', err instanceof Error ? err.message : 'An unknown error occurred'); }
        } else {
            // Toggle custom share menu on Desktop
            setShowShareMenu(!showShareMenu);
        }
    };

    const copyToClipboard = (): void => {
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Calculate PageSpeed Estimate
    // Assuming a Slow 4G/Fast 3G connection of roughly ~1.5 Mbps (187.5 KB/s)
    const bytesSaved = summary.totalOriginalSize - summary.totalProcessedSize;
    const estimatedSecondsSaved = bytesSaved > 0 ? (bytesSaved / 1024 / 187.5).toFixed(1) : 0;

    return (
        <div className="results-panel">
            <h3 className="settings-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 color="var(--success)" size={24} /> Optimization Complete
            </h3>

            {/* Summary Stats */}
            <div className="results-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div className="stat-card" style={{ padding: '24px' }}>
                    <div className="stat-value" style={{ fontSize: '2rem' }}>{summary.filesProcessed}</div>
                    <div className="stat-label">Files Processed</div>
                </div>
                <div className="stat-card" style={{ padding: '24px' }}>
                    <div className="stat-value" style={{ fontSize: '2rem' }}>{formatBytes(summary.totalOriginalSize)}</div>
                    <div className="stat-label">Original Size</div>
                </div>
                <div className="stat-card" style={{ padding: '24px' }}>
                    <div className="stat-value" style={{ fontSize: '2rem' }}>{formatBytes(summary.totalProcessedSize)}</div>
                    <div className="stat-label">Optimized Size</div>
                </div>
                {(() => {
                    const savPct = parseFloat(summary.totalSavingsPercent);
                    const isNeg = savPct < 0;
                    return (
                        <div className="stat-card" style={{
                            padding: '24px',
                            border: `2px solid ${isNeg ? 'rgba(239,68,68,0.4)' : 'var(--success)'}`,
                            background: isNeg ? 'rgba(239,68,68,0.06)' : 'var(--success-bg)',
                        }}>
                            <div className={`stat-value ${isNeg ? '' : 'success'}`} style={{
                                fontSize: '3rem', fontWeight: 900,
                                color: isNeg ? '#ef4444' : undefined,
                            }}>
                                {isNeg ? '+' : ''}{Math.abs(savPct)}%
                            </div>
                            <div className="stat-label" style={{
                                color: isNeg ? '#ef4444' : 'var(--success)',
                                fontWeight: 700, fontSize: '1rem',
                            }}>
                                {isNeg ? 'Size Increased' : 'Total Reduction'}
                            </div>
                            {isNeg && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                                    Lower quality setting or switch to WebP/AVIF to reduce file size.
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>

            {/* SEO Impact Banner */}
            {Number(estimatedSecondsSaved) > 0 && (
                <div style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 24px',
                    marginBottom: '32px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    color: 'var(--text-primary)'
                }}>
                    <img src="/logo.png" alt="Impact" style={{ height: '1.2rem', width: 'auto', objectFit: 'contain', flexShrink: 0 }} />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>SEO & Performance Impact</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                            You just shaved an estimated <strong>~{estimatedSecondsSaved} seconds</strong> off your page load time (on 3G) and improved your Core Web Vitals.
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="action-bar" style={{ position: 'relative' }}>
                {results.length > 1 && (
                    <button className="btn btn-success btn-large" onClick={handleBulkDownload} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Package size={20} /> Download All as ZIP
                    </button>
                )}
                <div style={{ position: 'relative' }}>
                    <button
                        className="btn btn-primary btn-large"
                        onClick={handleShare}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}
                    >
                        <Share2 size={20} /> Share Optimage
                    </button>

                    {/* Custom Share Dropdown for Desktop */}
                    {showShareMenu && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: '12px', padding: '8px', zIndex: 50,
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)', minWidth: '200px',
                            display: 'flex', flexDirection: 'column', gap: '4px'
                        }}>
                            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: 'var(--text-primary)', textDecoration: 'none', borderRadius: '8px', transition: 'background 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <Twitter size={18} color="#1DA1F2" /> Twitter
                            </a>
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: 'var(--text-primary)', textDecoration: 'none', borderRadius: '8px', transition: 'background 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <Linkedin size={18} color="#0A66C2" /> LinkedIn
                            </a>
                            <button onClick={copyToClipboard}
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: 'var(--text-primary)', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s', width: '100%', textAlign: 'left', fontSize: '0.95rem' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Dashboard Upsell Banner */}
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '16px 20px', marginBottom: '20px',
                    background: 'linear-gradient(135deg, rgba(108,92,231,0.12), rgba(162,155,254,0.08))',
                    border: '1px solid rgba(108,92,231,0.25)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer', transition: 'border-color 0.2s',
                }}>
                    <div style={{
                        width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Sparkles size={18} color="#fff" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            Want more power? Head to your Dashboard →
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            Rotation, auto-enhance, custom file names, processing history &amp; video compression. All in one place.
                        </div>
                    </div>
                </div>
            </Link>

            {/* Newsletter nudge — shown after successful processing */}
            {newsletterStatus !== 'success' && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 18px', marginBottom: '20px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    flexWrap: 'wrap',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <Mail size={15} color="var(--accent-primary)" />
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                            Get weekly performance tips:
                        </span>
                    </div>
                    <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '6px', flex: 1, minWidth: '200px' }}>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={newsletterEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewsletterEmail(e.target.value)}
                            disabled={newsletterStatus === 'loading'}
                            required
                            style={{
                                flex: 1, padding: '7px 11px', borderRadius: '8px',
                                border: '1px solid var(--border)', background: 'var(--bg-card)',
                                color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none',
                                minWidth: 0,
                            }}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={newsletterStatus === 'loading'}
                            style={{ padding: '7px 14px', fontSize: '0.8rem', borderRadius: '8px', whiteSpace: 'nowrap', flexShrink: 0 }}
                        >
                            {newsletterStatus === 'loading' ? '...' : 'Subscribe'}
                        </button>
                    </form>
                    {newsletterStatus === 'error' && (
                        <span style={{ fontSize: '0.78rem', color: '#ef4444' }}>Try again.</span>
                    )}
                </div>
            )}
            {newsletterStatus === 'success' && (
                <div style={{
                    padding: '12px 18px', marginBottom: '20px',
                    background: 'rgba(46,213,115,0.08)', border: '1px solid rgba(46,213,115,0.25)',
                    borderRadius: 'var(--radius-lg)', fontSize: '0.85rem',
                    color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                    <Check size={15} /> You are subscribed! Tips landing in your inbox soon.
                </div>
            )}

            {/* Individual File Results — Horizontal carousel */}
            <div style={{
                display: 'flex', gap: '16px', overflowX: 'auto', overflowY: 'visible',
                paddingBottom: '12px', paddingTop: '4px',
                scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent',
            }}>
                {results.map((result) => {
                    const savingsNum = parseFloat(result.savingsPercent);
                    return (
                        <FileResultCard
                            key={result.id}
                            result={result}
                            savingsNum={savingsNum}
                            onDownload={() => handleDownload(result.processedName, editedNames[result.id] ?? result.originalName)}
                            serverUrl={serverUrl}
                            setEditedName={(name) => setEditedNames(prev => ({ ...prev, [result.id]: name }))}
                        />
                    );
                })}
            </div>

            {/* "Powered by Optimage" embed badge — creates natural backlinks */}
            <div style={{
                marginTop: '28px',
                padding: '20px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Share the love on your site
                    </span>
                    <button
                        onClick={() => {
                            // UTM on the badge link so GA shows exactly how many clicks
                            // are coming from "Powered by" placements on third-party sites.
                            const badge = `<a href="https://optimage.dreamintrepid.com?utm_source=badge&utm_medium=website_badge&utm_campaign=powered_by" title="Images optimized with Optimage" target="_blank" rel="noopener">Images optimized with Optimage</a>`;
                            navigator.clipboard.writeText(badge).then(() => {
                                setBadgeCopied(true);
                                setTimeout(() => setBadgeCopied(false), 2500);
                            });
                        }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 12px', borderRadius: '8px',
                            background: badgeCopied ? 'rgba(46,213,115,0.12)' : 'var(--bg-card)',
                            border: `1px solid ${badgeCopied ? 'rgba(46,213,115,0.4)' : 'var(--border)'}`,
                            color: badgeCopied ? 'var(--success)' : 'var(--text-secondary)',
                            fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {badgeCopied ? <Check size={13} /> : <Copy size={13} />}
                        {badgeCopied ? 'Copied!' : 'Copy HTML'}
                    </button>
                </div>
                <code style={{
                    display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)',
                    background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid var(--border)', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                    lineHeight: 1.6,
                }}>
                    {`<a href="https://optimage.dreamintrepid.com?utm_source=badge&utm_medium=website_badge&utm_campaign=powered_by" title="Images optimized with Optimage" target="_blank" rel="noopener">Images optimized with Optimage</a>`}
                </code>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Drop this anywhere on your site. It helps others find the tool and keeps it free.
                </p>
            </div>
        </div>
    );
}
