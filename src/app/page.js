'use client';

import { useState, useCallback, useEffect } from 'react';
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
import { apiClient } from '@/lib/api';
import { ImageIcon, Mic, Zap, RefreshCw, AlertTriangle, CheckCircle, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_IMAGE_SETTINGS = {
  format: '',
  quality: 80,
  width: '',
  height: '',
  rotate: 0,
  autoEnhance: false,
  stripMetadata: true,
  maintainAspectRatio: true,
};

const DEFAULT_MEDIA_SETTINGS = {
  action: 'transcribe',
  extractAudioOnly: false,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('image'); // 'image' or 'media'
  const [files, setFiles] = useState([]);
  const [imageSettings, setImageSettings] = useState(DEFAULT_IMAGE_SETTINGS);
  const [mediaSettings, setMediaSettings] = useState(DEFAULT_MEDIA_SETTINGS);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [results, setResults] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [transcriptionResult, setTranscriptionResult] = useState(null);
  const [bypassCode, setBypassCode] = useState('');

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const notifySuccess = (title, body) => {
    // Attempt to play a chime
    try {
      const audio = new Audio('data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'); // Very short blank mp3 to avoid 404, we'll suggest adding a real chime later
      audio.play().catch(() => { }); // catch autoplay blocks
    } catch (e) { }

    // Show HTML5 Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    handleClearAll(); // Clear files when switching modes to prevent confusion
  };

  const handleFilesAdded = useCallback((newFiles) => {
    setFiles((prev) => {
      // In media mode, limit to 1 file at a time due to heavy processing/AI limits
      if (activeTab === 'media') {
        return [newFiles[0]];
      }
      const combined = [...prev, ...newFiles];
      return combined.slice(0, 50); // Max 50 files for images
    });
    setResults(null);
    setSummary(null);
    setError(null);
    setTranscriptionResult(null);
  }, [activeTab]);

  const handleRemoveFile = useCallback((index) => {
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

  const handleOptimizeImages = async () => {
    if (files.length === 0) return;

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
      const concurrencyLimit = 3;

      for (let i = 0; i < files.length; i += concurrencyLimit) {
        const batch = files.slice(i, i + concurrencyLimit);
        const response = await apiClient.convertImages(batch, { ...imageSettings, bypassCode });

        if (response.success) {
          allResults.push(...response.results);
          totalOriginalSize += response.summary.totalOriginalSize;
          totalProcessedSize += response.summary.totalProcessedSize;

          // Save to localStorage for guest syncing later
          try {
            const guestHistory = JSON.parse(localStorage.getItem('guest_processing_history') || '[]');
            const newHistoryItems = response.results.map(r => ({
              file_name: r.originalName,
              action_type: 'compress',
              original_size: r.originalSize,
              processed_size: r.processedSize
            }));
            localStorage.setItem('guest_processing_history', JSON.stringify([...guestHistory, ...newHistoryItems]));
          } catch (e) {
            console.error('Failed to save guest history to localStorage', e);
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
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.message || 'An error occurred during image processing.');
      notifySuccess('Optimization Failed', 'An error occurred while processing images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessMedia = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setTranscriptionResult(null);
    setResults(null); // Clear any old results

    try {
      // Process one media file at a time
      const file = files[0];
      const response = await apiClient.processMedia(file, { ...mediaSettings, bypassCode });

      if (mediaSettings.extractAudioOnly) {
        // Show as a generic result card
        setResults([{
          originalName: file.name,
          originalSize: file.size,
          processedName: response.downloadName,
          processedSize: 0, // We dont calc full size savings strictly here
          savingsPercent: 0
        }]);
        setSummary({
          filesProcessed: 1,
          totalOriginalSize: file.size,
          totalProcessedSize: 0,
          totalSavingsPercent: 'N/A'
        });
      } else {
        // Transcription Text
        setTranscriptionResult({
          mode: response.mode,
          text: response.text
        });
      }

      notifySuccess('Media Processing Complete', 'Your media has been successfully processed.');

    } catch (err) {
      console.error('Media processing error:', err);
      setError(err.message || 'An error occurred during media processing.');
      notifySuccess('Media Processing Failed', 'An error occurred while processing media.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />

      <main className="app-container">
        <LandingHero />

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

            {/*
          <button
            className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => handleTabChange('media')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Mic size={18} /> Video & Audio AI
          </button>
          */}
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
            <DropZone
              onFilesAdded={handleFilesAdded}
              disabled={isProcessing}
              acceptTypes={{
                'video/mp4': ['.mp4'],
                'video/webm': ['.webm'],
                'video/quicktime': ['.mov'],
                'video/x-msvideo': ['.avi'],
                'audio/mpeg': ['.mp3'],
                'audio/wav': ['.wav'],
                'audio/x-wav': ['.wav'],
              }}
              formatLabels={['MP4', 'MOV', 'AVI', 'WebM', 'MP3', 'WAV']}
            />
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

              {/* <div className="bypass-code-input" style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Got a bypass code? (Optional)"
                  value={bypassCode}
                  onChange={(e) => setBypassCode(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    flex: 1
                  }}
                />
              </div> */}

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
                      <Zap size={18} fill="currentColor" />
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
                summary={summary}
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

        <HowToUse />

        <LandingBento />

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

        <FAQAccordion />

        {/* Bottom Ad Banner */}
        {/* <AdBanner slot="bottom-banner" format="horizontal" /> */}
      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}
