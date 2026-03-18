'use client';

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

import React, { useState, useMemo, useCallback } from 'react';
import {
    Share2, CheckCircle2, Package, Download,
    ArrowDown, ArrowUp, Twitter, Linkedin, Copy, Check, Sparkles, Mail
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { apiClient } from '@/lib/api';
import { subscribeNewsletter } from '@/app/actions';
import type { ResultsPanelProps, FormStatus, NewsletterResult } from '@/types';

export default function ResultsPanel({ results, summary, serverUrl }: ResultsPanelProps): React.JSX.Element | null {
    const [showShareMenu, setShowShareMenu] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [newsletterEmail, setNewsletterEmail] = useState<string>('');
    const [newsletterStatus, setNewsletterStatus] = useState<FormStatus>('idle');
    const [badgeCopied, setBadgeCopied] = useState<boolean>(false);
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

    const handleDownload = async (processedName: string): Promise<void> => {
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
            link.download = processedName;
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

    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
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
                <div className="stat-card" style={{ padding: '24px', border: '2px solid var(--success)', background: 'var(--success-bg)' }}>
                    <div className="stat-value success" style={{ fontSize: '3rem', fontWeight: 900 }}>{summary.totalSavingsPercent}%</div>
                    <div className="stat-label" style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1rem' }}>Total Reduction</div>
                </div>
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
                            Rotation, auto-enhance, custom file names, processing history &amp; video compression — all in one place.
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

            {/* Individual File Results */}
            <div className="result-file-list">
                {results.map((result, index) => {

                    const savingsNum = parseFloat(result.savingsPercent);
                    return (
                        <div key={index} className="result-file-card" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '16px',
                            flexWrap: 'wrap' // Allow wrapping on very small screens
                        }}>
                            <div className="result-file-info" style={{ flex: '1', minWidth: '150px', overflow: 'hidden' }}>
                                <div className="result-file-name" title={result.originalName} style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '100%'
                                }}>
                                    {result.originalName}
                                </div>
                                <div className="result-file-sizes" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: '4px' }}>
                                    <span>{formatBytes(result.originalSize)}</span>
                                    <span className="size-arrow" style={{ padding: '0 8px' }}>→</span>
                                    <span>{formatBytes(result.processedSize)}</span>
                                    <span className={`savings-badge ${savingsNum < 0 ? 'negative' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginLeft: '8px' }}>
                                        {savingsNum >= 0 ? <ArrowDown size={14} /> : <ArrowUp size={14} />} {Math.abs(savingsNum)}%
                                    </span>
                                </div>
                            </div>
                            <button
                                className="result-file-download"
                                onClick={() => handleDownload(result.processedName)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    flexShrink: 0,
                                    width: 'auto', // Ensure it doesn't stretch
                                    minWidth: 'fit-content'
                                }}
                            >
                                <Download size={16} /> Download
                            </button>
                        </div>
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
                            const badge = `<a href="https://optimage.dreamintrepid.com" title="Images optimized with Optimage" target="_blank" rel="noopener">Images optimized with Optimage</a>`;
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
                    {`<a href="https://optimage.dreamintrepid.com" title="Images optimized with Optimage" target="_blank" rel="noopener">Images optimized with Optimage</a>`}
                </code>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Drop this anywhere on your site. It helps others find the tool and keeps it free.
                </p>
            </div>
        </div>
    );
}
