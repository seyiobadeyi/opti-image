'use client';

import React from 'react';
import { Mic, Info } from 'lucide-react';
import { InfoTooltip } from '@/components/Tooltip';
import type { MediaPanelProps, MediaSettings } from '@/types';

export default function MediaPanel({ settings, onSettingsChange }: MediaPanelProps): React.JSX.Element {
    const handleChange = <K extends keyof MediaSettings>(key: K, value: MediaSettings[K]): void => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="settings-panel">
            <h3 className="settings-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic size={20} className="text-primary" /> Media Processing Settings
            </h3>

            {/* Primary Action */}
            <div className="setting-group" style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                    Select Action
                    <InfoTooltip content="Transcription output languages are automatically detected by Whisper. Translation always outputs to English." />
                </label>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="media-action"
                            checked={settings.extractAudioOnly}
                            onChange={() => {
                                handleChange('extractAudioOnly', true);
                                handleChange('action', null);
                            }}
                        />
                        Extract Audio (MP3)
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="media-action"
                            checked={!settings.extractAudioOnly && settings.action === 'transcribe'}
                            onChange={() => {
                                handleChange('extractAudioOnly', false);
                                handleChange('action', 'transcribe');
                            }}
                        />
                        AI Transcription (Original Language)
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="media-action"
                            checked={!settings.extractAudioOnly && settings.action === 'translate'}
                            onChange={() => {
                                handleChange('extractAudioOnly', false);
                                handleChange('action', 'translate');
                            }}
                        />
                        AI Translation (To English)
                    </label>
                </div>
            </div>

            <div className="info-box" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Info size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
                {!settings.extractAudioOnly ? (
                    <p>
                        AI Transcription requires standard OpenAI API credits. Audio longer than OpenAI limitations will fail. Results will be displayed onscreen.
                    </p>
                ) : (
                    <p>
                        Audio extraction separates audio tracks from Video inputs, returning an optimized mono 16kHz MP3 file.
                    </p>
                )}
            </div>
        </div>
    );
}
