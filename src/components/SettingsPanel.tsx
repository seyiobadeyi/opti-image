'use client';

import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { InfoTooltip } from '@/components/Tooltip';
import type { SettingsPanelProps, ImageSettings, FilterPreset } from '@/types';

export default function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps): React.JSX.Element {
    const handleChange = <K extends keyof ImageSettings>(key: K, value: ImageSettings[K]): void => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="settings-panel">
            <h3 className="settings-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SettingsIcon size={20} className="text-primary" /> Optimization Settings
            </h3>
            <div className="settings-grid">
                {/* Output Format */}
                <div className="setting-group">
                    <label htmlFor="format-select" style={{ display: 'flex', alignItems: 'center' }}>
                        Output Format
                        <InfoTooltip content="WebP and AVIF are highly recommended for the smallest file sizes on the web." />
                    </label>
                    <select
                        id="format-select"
                        value={settings.format}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('format', e.target.value as ImageSettings['format'])}
                    >
                        <option value="">Keep Original</option>
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                        <option value="avif">AVIF</option>
                        <option value="tiff">TIFF</option>
                        <option value="gif">GIF</option>
                    </select>
                </div>

                {/* Rotation */}
                <div className="setting-group">
                    <label htmlFor="rotate-select" style={{ display: 'flex', alignItems: 'center' }}>
                        Rotate Image
                        <InfoTooltip content="Manually rotate the image. If 0°, EXIF orientation is respected automatically." />
                    </label>
                    <select
                        id="rotate-select"
                        value={settings.rotate || 0}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('rotate', Number(e.target.value) as ImageSettings['rotate'])}
                    >
                        <option value={0}>Auto (0°)</option>
                        <option value={90}>Rotate 90° CW</option>
                        <option value={180}>Rotate 180°</option>
                        <option value={270}>Rotate 90° CCW</option>
                    </select>
                </div>

                {/* Flip */}
                <div className="setting-group">
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                        Flip Image
                        <InfoTooltip content="Mirror the image horizontally (left-right) or vertically (top-bottom)." />
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="button"
                            onClick={() => handleChange('flipHorizontal', !settings.flipHorizontal)}
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: `1px solid ${settings.flipHorizontal ? 'var(--accent-primary)' : 'var(--border)'}`,
                                background: settings.flipHorizontal ? 'var(--accent-primary)' : 'var(--bg-card)',
                                color: settings.flipHorizontal ? '#ffffff' : 'var(--text-primary)',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                            }}
                        >
                            ↔ Horizontal
                        </button>
                        <button
                            type="button"
                            onClick={() => handleChange('flipVertical', !settings.flipVertical)}
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: `1px solid ${settings.flipVertical ? 'var(--accent-primary)' : 'var(--border)'}`,
                                background: settings.flipVertical ? 'var(--accent-primary)' : 'var(--bg-card)',
                                color: settings.flipVertical ? '#ffffff' : 'var(--text-primary)',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                            }}
                        >
                            ↕ Vertical
                        </button>
                    </div>
                </div>

                {/* Quality Slider */}
                <div className="setting-group">
                    <div className="quality-slider-container">
                        <div className="quality-header">
                            <label htmlFor="quality-slider" style={{ display: 'flex', alignItems: 'center' }}>
                                Quality
                                <InfoTooltip content="Values between 75-80 provide the best balance of visual quality and small file size." />
                            </label>
                            <span className="quality-value">{settings.quality}%</span>
                        </div>
                        <input
                            id="quality-slider"
                            type="range"
                            min="1"
                            max="100"
                            value={settings.quality}
                            onChange={(e) => handleChange('quality', parseInt(e.target.value))}
                            className="quality-slider"
                        />
                    </div>
                </div>

                {/* Width */}
                <div className="setting-group">
                    <label htmlFor="width-input" style={{ display: 'flex', alignItems: 'center' }}>
                        Max Width (px)
                        <InfoTooltip content="For Shopify or blogs, 1000px - 1500px is usually more than enough." />
                    </label>
                    <input
                        id="width-input"
                        type="number"
                        placeholder="Auto"
                        min="1"
                        max="8000"
                        value={settings.width || ''}
                        onChange={(e) => handleChange('width', e.target.value ? parseInt(e.target.value) : '')}
                    />
                </div>

                {/* Height */}
                <div className="setting-group">
                    <label htmlFor="height-input">Max Height (px)</label>
                    <input
                        id="height-input"
                        type="number"
                        placeholder="Auto"
                        min="1"
                        max="8000"
                        value={settings.height || ''}
                        onChange={(e) => handleChange('height', e.target.value ? parseInt(e.target.value) : '')}
                    />
                </div>
            </div>

            {/* Toggles */}
            <div style={{ marginTop: 24 }}>
                <div className="toggle-row">
                    <span className="toggle-label" style={{ display: 'flex', alignItems: 'center' }}>
                        Auto-Enhance (Cleanup Colors)
                        <InfoTooltip content="Automatically normalizes contrast and luminance to make dull photos pop." />
                    </span>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={settings.autoEnhance || false}
                            onChange={(e) => handleChange('autoEnhance', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
                <div className="toggle-row">
                    <span className="toggle-label" style={{ display: 'flex', alignItems: 'center' }}>
                        Strip metadata (EXIF, GPS, etc.)
                        <InfoTooltip content="Removes hidden camera data to reduce file size and protect privacy." />
                    </span>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={settings.stripMetadata}
                            onChange={(e) => handleChange('stripMetadata', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
                <div className="toggle-row">
                    <span className="toggle-label">Maintain aspect ratio</span>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={settings.maintainAspectRatio}
                            onChange={(e) => handleChange('maintainAspectRatio', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>

            {/* Filter Presets */}
            <div style={{ marginTop: 24 }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                    Filter Presets
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(['', 'vivid', 'muted', 'bw', 'warm', 'cool'] as FilterPreset[]).map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => handleChange('filter', preset)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                border: `1px solid ${settings.filter === preset ? 'var(--accent-primary)' : 'var(--border)'}`,
                                background: settings.filter === preset ? 'var(--accent-primary)' : 'var(--bg-card)',
                                color: settings.filter === preset ? '#ffffff' : 'var(--text-primary)',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                            }}
                        >
                            {preset === '' ? 'None' : preset === 'bw' ? 'B&W' : preset.charAt(0).toUpperCase() + preset.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Exposure & Saturation Sliders */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center' }}>
                            Exposure
                            <InfoTooltip content="Brighten or darken the image. 1.0 is unchanged; 2.0 is twice as bright." />
                        </label>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', minWidth: '36px', textAlign: 'right' }}>{(settings.exposure ?? 1.0).toFixed(2)}x</span>
                    </div>
                    <input
                        type="range"
                        min="0.25"
                        max="4"
                        step="0.05"
                        value={settings.exposure ?? 1.0}
                        onChange={(e) => handleChange('exposure', parseFloat(e.target.value))}
                        className="quality-slider"
                    />
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center' }}>
                            Saturation
                            <InfoTooltip content="Boost or reduce color intensity. 0 is grayscale; 1.0 is unchanged; 3.0 is highly saturated." />
                        </label>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', minWidth: '36px', textAlign: 'right' }}>{(settings.saturation ?? 1.0).toFixed(2)}x</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="3"
                        step="0.05"
                        value={settings.saturation ?? 1.0}
                        onChange={(e) => handleChange('saturation', parseFloat(e.target.value))}
                        className="quality-slider"
                    />
                </div>
            </div>
        </div>
    );
}
