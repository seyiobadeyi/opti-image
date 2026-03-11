'use client';

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

import { useState } from 'react';
import {
    Share2, CheckCircle2, Package, Download,
    ArrowDown, ArrowUp, Twitter, Linkedin, Copy, Check
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { apiClient } from '@/lib/api';

export default function ResultsPanel({ results, summary, serverUrl }) {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!results || results.length === 0) return null;

    const supabase = createClient();

    const handleDownload = async (processedName) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.dispatchEvent(new Event('open-auth-modal'));
            return;
        }

        const url = `${serverUrl}/api/images/${processedName}/download`;
        const link = document.createElement('a');
        link.href = url;
        link.download = processedName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBulkDownload = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.dispatchEvent(new Event('open-auth-modal'));
            return;
        }

        const fileNames = results.map((r) => r.processedName);
        try {
            await apiClient.downloadBulkImages(fileNames);
        } catch (err) {
            console.error('Bulk download failed:', err);
            alert('Failed to download ZIP. Please try individual downloads.');
        }
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareText = `I just shrunk my website images by ${summary.totalSavingsPercent}% using Optimage! Faster load times, better SEO.`;

    const handleShare = async () => {
        const shareData = { title: 'Optimage', text: shareText, url: shareUrl };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData) && /Mobi|Android/i.test(navigator.userAgent)) {
            // Use native share on strictly mobile devices
            try { await navigator.share(shareData); } catch (err) { console.error('Error sharing:', err); }
        } else {
            // Toggle custom share menu on Desktop
            setShowShareMenu(!showShareMenu);
        }
    };

    const copyToClipboard = () => {
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
            {estimatedSecondsSaved > 0 && (
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
                    <img src="/logo.png" alt="Impact" style={{ width: '24px', height: '24px', objectFit: 'contain', flexShrink: 0, marginTop: '2px' }} />
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
                                onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                                <Twitter size={18} color="#1DA1F2" /> Twitter
                            </a>
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: 'var(--text-primary)', textDecoration: 'none', borderRadius: '8px', transition: 'background 0.2s' }}
                                onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'} onMouseLeave={(e) => e.target.style.background = 'transparent'}
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

            {/* Individual File Results */}
            <div className="result-file-list">
                {results.map((result, index) => {
                    const savingsNum = parseFloat(result.savingsPercent);
                    return (
                        <div key={index} className="result-file-card">
                            <div className="result-file-info">
                                <div className="result-file-name" title={result.originalName}>
                                    {result.originalName}
                                </div>
                                <div className="result-file-sizes">
                                    <span>{formatBytes(result.originalSize)}</span>
                                    <span className="size-arrow" style={{ padding: '0 8px' }}>→</span>
                                    <span>{formatBytes(result.processedSize)}</span>
                                    <span className={`savings-badge ${savingsNum < 0 ? 'negative' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                        {savingsNum >= 0 ? <ArrowDown size={14} /> : <ArrowUp size={14} />} {Math.abs(savingsNum)}%
                                    </span>
                                </div>
                            </div>
                            <button
                                className="result-file-download"
                                onClick={() => handleDownload(result.processedName)}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Download size={16} /> Download
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
