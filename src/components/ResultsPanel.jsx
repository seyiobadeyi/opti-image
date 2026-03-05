'use client';

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

import { createClient } from '@/utils/supabase/client';

export default function ResultsPanel({ results, summary, serverUrl }) {
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
            const res = await fetch(`${serverUrl}/api/download/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileNames }),
            });

            if (!res.ok) throw new Error('Download failed');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `optimized-images-${Date.now()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Bulk download failed:', err);
            alert('Failed to download ZIP. Please try individual downloads.');
        }
    };

    return (
        <div className="results-panel">
            <h3 className="settings-title">✅ Optimization Complete</h3>

            {/* Summary Stats */}
            <div className="results-summary">
                <div className="stat-card">
                    <div className="stat-value">{summary.filesProcessed}</div>
                    <div className="stat-label">Files Processed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{formatBytes(summary.totalOriginalSize)}</div>
                    <div className="stat-label">Original Size</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{formatBytes(summary.totalProcessedSize)}</div>
                    <div className="stat-label">New Size</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value success">{summary.totalSavingsPercent}%</div>
                    <div className="stat-label">Total Saved</div>
                </div>
            </div>

            {/* Download All Button */}
            {results.length > 1 && (
                <div className="action-bar">
                    <button className="btn btn-success btn-large" onClick={handleBulkDownload}>
                        📦 Download All as ZIP
                    </button>
                </div>
            )}

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
                                    <span className="size-arrow">→</span>
                                    <span>{formatBytes(result.processedSize)}</span>
                                    <span className={`savings-badge ${savingsNum < 0 ? 'negative' : ''}`}>
                                        {savingsNum >= 0 ? '↓' : '↑'} {Math.abs(savingsNum)}%
                                    </span>
                                </div>
                            </div>
                            <button
                                className="result-file-download"
                                onClick={() => handleDownload(result.processedName)}
                            >
                                ⬇ Download
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
