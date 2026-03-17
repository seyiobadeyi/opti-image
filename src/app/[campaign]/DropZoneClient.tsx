'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import DropZone from '@/components/DropZone';
import FileList from '@/components/FileList';
import SettingsPanel from '@/components/SettingsPanel';
import MediaPanel from '@/components/MediaPanel';
import ProgressTracker from '@/components/ProgressTracker';
import ResultsPanel from '@/components/ResultsPanel';
import SubscriptionPaywall from '@/components/SubscriptionPaywall';
import { apiClient } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';
import { ImageIcon, RefreshCw, AlertTriangle, CheckCircle, Clipboard, Mic } from 'lucide-react';
import type { ActiveTab, FileWithCustomName, ImageSettings, MediaSettings, ProcessedImage, ProcessingSummary, TranscriptionResult, User } from '@/types';

const DEFAULT_IMAGE_SETTINGS: ImageSettings = {
    format: '',
    quality: 80,
    width: '',
    height: '',
    rotate: 0,
    autoEnhance: false,
    stripMetadata: true,
    maintainAspectRatio: true,
};

const DEFAULT_MEDIA_SETTINGS: MediaSettings = {
    action: 'transcribe',
    extractAudioOnly: false,
};

export default function DropZoneClient(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<ActiveTab>('image');
    const [files, setFiles] = useState<FileWithCustomName[]>([]);
    const [imageSettings, setImageSettings] = useState<ImageSettings>(DEFAULT_IMAGE_SETTINGS);
    const [mediaSettings, setMediaSettings] = useState<MediaSettings>(DEFAULT_MEDIA_SETTINGS);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [processed, setProcessed] = useState<number>(0);
    const [results, setResults] = useState<ProcessedImage[] | null>(null);
    const [summary, setSummary] = useState<ProcessingSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
    const [showPaywall, setShowPaywall] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const notifySuccess = (title: string, body: string): void => {
        try {
            const audio = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
            audio.play().catch(() => { });
        } catch (_e: unknown) { }

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/favicon.ico' });
        }
    };

    const handleTabChange = (tab: ActiveTab): void => {
        setActiveTab(tab);
        handleClearAll();
    };

    const handleFilesAdded = useCallback((newFiles: FileWithCustomName[]): void => {
        setFiles((prev) => {
            if (activeTab === 'media') {
                const first = newFiles[0];
                return first ? [first] : prev;
            }
            const combined = [...prev, ...newFiles];
            return combined.slice(0, 50);
        });
        setResults(null);
        setSummary(null);
        setError(null);
        setTranscriptionResult(null);
    }, [activeTab]);

    const handleRemoveFile = useCallback((index: number): void => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handleClearAll = useCallback((): void => {
        setFiles([]);
        setResults(null);
        setSummary(null);
        setError(null);
        setTranscriptionResult(null);
        setProcessed(0);
    }, []);

    /** Returns true if the user is authenticated AND has an active subscription. */
    const checkAuthAndSubscription = async (): Promise<boolean> => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            if (!window.authModalDispatching) {
                window.authModalDispatching = true;
                window.dispatchEvent(new CustomEvent('open-auth-modal'));
                setTimeout(() => { window.authModalDispatching = false; }, 500);
            }
            return false;
        }
        const status = await apiClient.getSubscriptionStatus();
        if (!status.active) {
            setShowPaywall(true);
            return false;
        }
        return true;
    };

    const handleOptimizeImages = async (): Promise<void> => {
        if (files.length === 0) return;
        if (!(await checkAuthAndSubscription())) return;

        setIsProcessing(true);
        setError(null);
        setResults(null);
        setSummary(null);
        setProcessed(0);

        try {
            const allResults = [];
            let totalOriginalSize = 0;
            let totalProcessedSize = 0;
            let completedCount = 0;

            // Process in small batches of 2-3 to ensure smooth progress bar update
            // while not hammering the network/backend too hard.
            const concurrencyLimit = 3;

            for (let i = 0; i < files.length; i += concurrencyLimit) {
                const batch = files.slice(i, i + concurrencyLimit);

                // We still send a small batch to the API, but the progress bar updates
                // much more frequently than sending chunks of 10-50.
                const response = await apiClient.convertImages(batch, { ...imageSettings });

                if (response.success) {
                    allResults.push(...response.results);
                    totalOriginalSize += response.summary.totalOriginalSize;
                    totalProcessedSize += response.summary.totalProcessedSize;

                    try {
                        const guestHistory = JSON.parse(localStorage.getItem('guest_processing_history') || '[]');
                        const newHistoryItems = response.results.map(r => ({
                            file_name: r.originalName,
                            action_type: 'compress',
                            original_size: r.originalSize,
                            processed_size: r.processedSize
                        }));
                        localStorage.setItem('guest_processing_history', JSON.stringify([...guestHistory, ...newHistoryItems]));
                    } catch (e: unknown) {
                        console.error('Failed to save guest history', e);
                    }
                }

                completedCount += batch.length;
                setProcessed(completedCount);
            }

            const totalSavings = totalOriginalSize - totalProcessedSize;
            setResults(allResults);
            setSummary({
                filesProcessed: allResults.length,
                totalOriginalSize,
                totalProcessedSize,
                totalSavings,
                totalSavingsPercent: totalOriginalSize > 0
                    ? ((totalSavings / totalOriginalSize) * 100).toFixed(1) : '0.0',
            });
            notifySuccess('Optimization Complete', `Successfully processed ${allResults.length} images.`);
        } catch (err: unknown) {
            console.error('Processing error:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            notifySuccess('Optimization Failed', 'An error occurred while processing images.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleProcessMedia = async (): Promise<void> => {
        if (files.length === 0) return;
        if (!(await checkAuthAndSubscription())) return;

        setIsProcessing(true);
        setError(null);
        setTranscriptionResult(null);
        setResults(null);

        try {
            const file = files[0];
            if (!file) return;
            const response = await apiClient.processMedia(file, { ...mediaSettings });

            if (mediaSettings.extractAudioOnly) {
                setResults([{
                    id: '',
                    originalName: file.name,
                    originalSize: file.size,
                    processedName: response.downloadName ?? file.name,
                    processedSize: 0,
                    width: 0,
                    height: 0,
                    format: '',
                    savingsPercent: '0',
                }]);
                setSummary({
                    filesProcessed: 1,
                    totalOriginalSize: file.size,
                    totalProcessedSize: 0,
                    totalSavingsPercent: 'N/A'
                });
            } else {
                setTranscriptionResult({
                    mode: response.mode ?? '',
                    text: response.text ?? '',
                });
            }

            notifySuccess('Media Processing Complete', 'Your media has been successfully processed.');
        } catch (err: unknown) {
            console.error('Media error:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            notifySuccess('Media Processing Failed', 'An error occurred while processing media.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <section id="dropzone-area" style={{ scrollMarginTop: '100px', maxWidth: '1200px', margin: '0 auto 80px', padding: '0 24px' }}>
            <div className="tabs-container">
                <button
                    className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`}
                    onClick={() => handleTabChange('image')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ImageIcon size={18} /> Image Optimization
                </button>
                <button
                    className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
                    onClick={() => handleTabChange('media')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}
                >
                    <Mic size={18} /> Video & Audio AI
                    <span style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        background: 'var(--gradient-primary)',
                        fontSize: '0.65rem',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        color: 'white',
                        fontWeight: 700,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}>SOON</span>
                </button>
            </div>

            {activeTab === 'image' ? (
                <DropZone
                    onFilesAdded={handleFilesAdded}
                    disabled={isProcessing}
                    acceptTypes={{
                        'image/jpeg': ['.jpg', '.jpeg'],
                        'image/png': ['.png'],
                        'image/webp': ['.webp'],
                        'image/avif': ['.avif'],
                        'image/tiff': ['.tif', '.tiff'],
                        'image/gif': ['.gif'],
                        'image/svg+xml': ['.svg'],
                        'image/bmp': ['.bmp'],
                    }}
                    formatLabels={['JPEG', 'PNG', 'WebP', 'AVIF', 'TIFF', 'GIF', 'SVG', 'BMP']}
                />
            ) : (
                <div style={{
                    padding: '60px 40px',
                    background: 'var(--bg-card)',
                    borderRadius: '24px',
                    border: '2px dashed var(--border)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    width: '100%'
                }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'rgba(108, 92, 231, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-primary)'
                    }}>
                        <Mic size={32} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px' }}>AI Media Processing Coming Soon</h3>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto', lineHeight: 1.6, fontSize: '1rem' }}>
                            Our engineering team is currently optimizing the high-performance video pipeline. We'll notify all members once this feature is live!
                        </p>
                    </div>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setActiveTab('image')}
                        style={{ marginTop: '8px' }}
                    >
                        Go Back to Images
                    </button>
                </div>
            )}

            {files.length > 0 && !results && !transcriptionResult && (
                <div className="configuration-section">
                    <FileList files={files} onRemove={handleRemoveFile} />
                    {activeTab === 'image' ? (
                        <SettingsPanel settings={imageSettings} onSettingsChange={setImageSettings} />
                    ) : (
                        <MediaPanel settings={mediaSettings} onSettingsChange={setMediaSettings} />
                    )}

                    <div className="action-bar">
                        <button
                            className="btn btn-primary btn-large"
                            onClick={activeTab === 'image' ? handleOptimizeImages : handleProcessMedia}
                            disabled={isProcessing || files.length === 0}
                        >
                            {isProcessing ? (
                                <><span className="spinner"></span>Processing...</>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <img src="/logo.png" alt="Process" style={{ height: '1.2em', width: 'auto', objectFit: 'contain' }} />
                                    <span>Process {activeTab === 'image' ? files.length : ''} {activeTab === 'image' ? (files.length !== 1 ? 'Images' : 'Image') : 'Media'}</span>
                                </div>
                            )}
                        </button>
                        <button className="btn btn-secondary" onClick={handleClearAll} disabled={isProcessing}>
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {isProcessing && activeTab === 'image' && <ProgressTracker processed={processed} total={files.length} />}
            {isProcessing && activeTab === 'media' && (
                <div className="progress-section">
                    <div className="progress-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RefreshCw className="spinner" size={20} />
                        <h3 style={{ margin: 0 }}>Processing Media...</h3>
                    </div>
                    <p>Extracting audio and/or processing AI models.</p>
                </div>
            )}

            {error && (
                <div className="error-box" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {results && (
                <>
                    <ResultsPanel results={results} summary={summary!} serverUrl={apiClient.getServerUrl()} />
                    <div className="action-bar">
                        <button className="btn btn-primary btn-large" onClick={handleClearAll} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
                            <RefreshCw size={18} /> Process More
                        </button>
                    </div>
                </>
            )}

            {transcriptionResult && (
                <div className="transcription-panel">
                    <h3 className="settings-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={20} color="var(--success)" />
                        {transcriptionResult.mode === 'translate' ? 'Translation' : 'Transcription'} Complete
                    </h3>
                    <div className="transcription-box">{transcriptionResult.text}</div>
                    <div className="action-bar" style={{ marginTop: 24 }}>
                        <button className="btn btn-success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => {
                            navigator.clipboard.writeText(transcriptionResult.text);
                            alert('Copied to clipboard!');
                        }}>
                            <Clipboard size={18} /> Copy Text
                        </button>
                        <button className="btn btn-primary" onClick={handleClearAll} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <RefreshCw size={18} /> Process More Media
                        </button>
                    </div>
                </div>
            )}

            {showPaywall && (
                <SubscriptionPaywall
                    onSubscribed={() => setShowPaywall(false)}
                    onClose={() => setShowPaywall(false)}
                />
            )}
        </section>
    );
}
