'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import DropZone from '@/components/DropZone';
import FileList from '@/components/FileList';
import SettingsPanel from '@/components/SettingsPanel';
import MediaPanel from '@/components/MediaPanel';
import ProgressTracker from '@/components/ProgressTracker';
import ResultsPanel from '@/components/ResultsPanel';
import AdBanner from '@/components/AdBanner';
import CookieConsent from '@/components/CookieConsent';
import Footer from '@/components/Footer';
import HowToUse from '@/components/HowToUse';
import LandingHero from '@/components/LandingHero';
import LandingBento from '@/components/LandingBento';
import FAQAccordion from '@/components/FAQAccordion';
import ScrollReveal from '@/components/ScrollReveal';
import SubscriptionPaywall from '@/components/SubscriptionPaywall';
import { apiClient } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { ImageIcon, Mic, RefreshCw, AlertTriangle, CheckCircle, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ActiveTab, ImageSettings, MediaSettings, ProcessedImage, ProcessingSummary, TranscriptionResult } from '@/types';

const DEFAULT_IMAGE_SETTINGS: ImageSettings = {
  format: '',
  quality: 80,
  width: '',
  height: '',
  rotate: 0,
  autoEnhance: false,
  stripMetadata: true,
  maintainAspectRatio: true,
  exposure: 1.0,
  saturation: 1.0,
  filter: '',
};

const DEFAULT_MEDIA_SETTINGS: MediaSettings = {
  action: 'transcribe',
  extractAudioOnly: false,
};

export default function Home(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ActiveTab>('image');
  const [files, setFiles] = useState<File[]>([]);
  const [imageSettings, setImageSettings] = useState<ImageSettings>(DEFAULT_IMAGE_SETTINGS);
  const [mediaSettings, setMediaSettings] = useState<MediaSettings>(DEFAULT_MEDIA_SETTINGS);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processed, setProcessed] = useState<number>(0);
  const [results, setResults] = useState<ProcessedImage[] | null>(null);
  const [summary, setSummary] = useState<ProcessingSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
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

  // Capture referral code from URL (?ref=XXXX)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      // Store as cookie (works across tabs + survives stricter storage policies)
      document.cookie = `optimage_referral_code=${encodeURIComponent(ref)}; Max-Age=${60 * 60 * 24 * 30}; Path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
      // Backward compatibility for existing reads
      localStorage.setItem('optimage_referral_code', ref);
      // Clean the URL without reloading the page
      const url = new URL(window.location.href);
      url.searchParams.delete('ref');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const notifySuccess = (title: string, body: string): void => {
    // Attempt to play a chime
    try {
      const audio = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'); // Very short blank mp3 to avoid 404, we'll suggest adding a real chime later
      audio.play().catch(() => { }); // catch autoplay blocks
    } catch (_e: unknown) { /* autoplay may be blocked */ }

    // Show HTML5 Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  const handleTabChange = (tab: ActiveTab): void => {
    setActiveTab(tab);
    handleClearAll(); // Clear files when switching modes to prevent confusion
  };

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    setFiles((prev) => {
      // In media mode, limit to 1 file at a time due to heavy processing/AI limits
      if (activeTab === 'media') {
        const first = newFiles[0];
        return first ? [first] : prev;
      }
      const combined = [...prev, ...newFiles];
      return combined.slice(0, 50); // Max 50 files for images
    });
    setResults(null);
    setSummary(null);
    setError(null);
    setTranscriptionResult(null);
  }, [activeTab]);

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearAll = useCallback(() => {
    setFiles([]);
    setResults(null);
    setSummary(null);
    setError(null);
    setTranscriptionResult(null);
    setProcessed(0);
  }, []);

  /** Checks auth + subscription. Returns true if OK to proceed. */
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

    // Check subscription status
    const subStatus = await apiClient.getSubscriptionStatus();
    if (!subStatus.active) {
      setShowPaywall(true);
      return false;
    }

    return true;
  };

  const handleOptimizeImages = async (): Promise<void> => {
    if (files.length === 0) return;

    const canProceed = await checkAuthAndSubscription();
    if (!canProceed) return;

    setIsProcessing(true);
    setError(null);
    setResults(null);
    setSummary(null);
    setProcessed(0);

    try {
      const allResults: ProcessedImage[] = [];
      let totalOriginalSize = 0;
      let totalProcessedSize = 0;
      let completedCount = 0;

      // Process 1 file at a time so the progress bar advances smoothly per-file
      const concurrencyLimit = 1;

      for (let i = 0; i < files.length; i += concurrencyLimit) {
        const batch = files.slice(i, i + concurrencyLimit);
        const isLastBatch = i + concurrencyLimit >= files.length;
        const response = await apiClient.convertImages(batch, { ...imageSettings, notifyOnComplete: isLastBatch });

        if (response.success) {
          allResults.push(...response.results);
          totalOriginalSize += response.summary.totalOriginalSize;
          totalProcessedSize += response.summary.totalProcessedSize;

          // Save to localStorage for guest syncing later
          try {
            const guestHistory: unknown[] = JSON.parse(localStorage.getItem('guest_processing_history') || '[]');
            const newHistoryItems = response.results.map((r: ProcessedImage) => ({
              file_name: r.originalName,
              action_type: 'compress',
              original_size: r.originalSize,
              processed_size: r.processedSize
            }));
            localStorage.setItem('guest_processing_history', JSON.stringify([...guestHistory, ...newHistoryItems]));
          } catch (_e: unknown) {
            console.error('Failed to save guest history to localStorage');
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
      const message = err instanceof Error ? err.message : 'An error occurred during image processing.';
      // Handle 402 Payment Required from server
      if (message.toLowerCase().includes('subscribe') || message.toLowerCase().includes('subscription')) {
        setShowPaywall(true);
      } else {
        setError(message);
      }
      notifySuccess('Optimization Failed', 'An error occurred while processing images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessMedia = async (): Promise<void> => {
    if (files.length === 0) return;

    const canProceed = await checkAuthAndSubscription();
    if (!canProceed) return;

    setIsProcessing(true);
    setError(null);
    setTranscriptionResult(null);
    setResults(null); // Clear any old results

    try {
      // Process one media file at a time
      const file = files[0];
      if (!file) return;
      const response = await apiClient.processMedia(file, { ...mediaSettings });

      if (mediaSettings.extractAudioOnly) {
        // Show as a generic result card
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
          totalSavingsPercent: 'N/A',
        });
      } else {
        // Transcription Text
        setTranscriptionResult({
          mode: response.mode ?? 'transcribe',
          text: response.text ?? '',
        });
      }

      notifySuccess('Media Processing Complete', 'Your media has been successfully processed.');

    } catch (err: unknown) {
      console.error('Media processing error:', err);
      const message = err instanceof Error ? err.message : 'An error occurred during media processing.';
      if (message.toLowerCase().includes('subscribe') || message.toLowerCase().includes('subscription')) {
        setShowPaywall(true);
      } else {
        setError(message);
      }
      notifySuccess('Media Processing Failed', 'An error occurred while processing media.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />

      <main className="app-container">
        <LandingHero customHeadline={undefined} customSubtext={undefined} />

        {/* Upload Zone & Tool Area */}
        <section id="dropzone-area" style={{ scrollMarginTop: '100px', maxWidth: '1200px', margin: '0 auto 80px', padding: '0 24px' }}>

          {/* Top Ad Banner */}
          {/* <AdBanner slot="top-banner" format="horizontal" /> */}

          {/* Mode Tabs */}
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

          {/* Upload Zone */}
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
              padding: '80px 40px',
              background: 'var(--bg-card)',
              borderRadius: '24px',
              border: '2px dashed var(--border)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(108, 92, 231, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)'
              }}>
                <Mic size={40} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>AI Media Processing Coming Soon</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6, fontSize: '1.1rem' }}>
                  Our engineering team is currently optimizing the high-performance video pipeline and OpenAI transcription models. We'll notify all members once this feature is live!
                </p>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveTab('image')}
                style={{ marginTop: '12px' }}
              >
                Go Back to Images
              </button>
            </div>
          )}

          {/* File List & Settings */}
          {files.length > 0 && !results && !transcriptionResult && (
            <div className="configuration-section">
              <FileList files={files} onRemove={handleRemoveFile} />

              {activeTab === 'image' ? (
                <SettingsPanel settings={imageSettings} onSettingsChange={setImageSettings} />
              ) : (
                <MediaPanel settings={mediaSettings} onSettingsChange={setMediaSettings} />
              )}

              {/* Action Buttons */}
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
                      <img src="/logo.png" alt="Optimage Symbol" style={{ height: '1.2em', width: 'auto', objectFit: 'contain' }} />
                      <span>Process {activeTab === 'image' ? files.length : ''} {activeTab === 'image' ? (files.length !== 1 ? 'Images' : 'Image') : 'Media'}</span>
                    </div>
                  )}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleClearAll}
                  disabled={isProcessing}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Progress Tracker (Images only) */}
          {isProcessing && activeTab === 'image' && (
            <ProgressTracker processed={processed} total={files.length} />
          )}
          {isProcessing && activeTab === 'media' && (
            <div className="progress-section">
              <div className="progress-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw className="spinner" size={20} />
                <h3 style={{ margin: 0 }}>Processing Media...</h3>
                <span className="progress-status" style={{ marginLeft: 'auto' }}>This may take a minute</span>
              </div>
              <p>Extracting audio and/or processing AI models.</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-box" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Results Panel (Images or Audio Extraction) */}
          {results && (
            <>
              <ResultsPanel
                results={results}
                summary={summary!}
                serverUrl={apiClient.getServerUrl()}
              />
              <div className="action-bar">
                <button className="btn btn-primary btn-large" onClick={handleClearAll} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
                  <RefreshCw size={18} /> Process More
                </button>
              </div>
            </>
          )}
        </section>

        <ScrollReveal>
          <HowToUse />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <LandingBento />
        </ScrollReveal>

        {/* Bottom Ad Banner */}
        {transcriptionResult && (
          <div className="transcription-panel">
            <h3 className="settings-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} color="var(--success)" />
              {transcriptionResult.mode === 'translate' ? 'Translation' : 'Transcription'} Complete
            </h3>
            <div className="transcription-box">
              {transcriptionResult.text}
            </div>
            <div className="action-bar" style={{ marginTop: 24 }}>
              <button
                className="btn btn-success"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => {
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

        <ScrollReveal delay={0.2}>
          <FAQAccordion />
        </ScrollReveal>

        {/* Bottom Ad Banner */}
        {/* <AdBanner slot="bottom-banner" format="horizontal" /> */}
      </main>

      <Footer />
      <CookieConsent />

      {/* Subscription Paywall Modal */}
      {showPaywall && (
        <SubscriptionPaywall
          onClose={() => setShowPaywall(false)}
          onSubscribed={() => setShowPaywall(false)}
        />
      )}
    </>
  );
}
