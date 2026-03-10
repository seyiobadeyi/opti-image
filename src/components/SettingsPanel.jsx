'use client';
import { Settings as SettingsIcon } from 'lucide-react';
import { InfoTooltip } from '@/components/Tooltip';

export default function SettingsPanel({ settings, onSettingsChange }) {
    const handleChange = (key, value) => {
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
                        onChange={(e) => handleChange('format', e.target.value)}
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
                        onChange={(e) => handleChange('rotate', parseInt(e.target.value))}
                    >
                        <option value={0}>Auto (0°)</option>
                        <option value={90}>Rotate 90° CW</option>
                        <option value={180}>Rotate 180°</option>
                        <option value={270}>Rotate 90° CCW</option>
                    </select>
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
        </div>
    );
}
