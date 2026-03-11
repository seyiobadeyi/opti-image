'use client';

import { useMemo } from 'react';
import { Paperclip, X } from 'lucide-react';

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function FileList({ files, onRemove }) {
    const thumbnails = useMemo(() => {
        return files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
    }, [files]);

    if (files.length === 0) return null;

    return (
        <div className="file-list">
            <div className="file-list-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Paperclip size={18} /> Uploaded Files</h3>
                <span className="file-count">{files.length} file{files.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="file-grid">
                {thumbnails.map(({ file, url }, index) => (
                    <div key={`${file.name}-${index}`} className="file-card" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={url}
                            alt={file.name}
                            className="file-thumbnail"
                            onLoad={() => {/* Keep URL until component unmounts */ }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                        />
                        <div className="file-info" style={{ flex: 1, minWidth: 0 }}>
                            <input
                                type="text"
                                className="file-name-input"
                                defaultValue={path.parse(file.name).name}
                                onChange={(e) => {
                                    file.customName = e.target.value;
                                }}
                                title="Click to rename"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    width: '100%',
                                    outline: 'none',
                                    marginBottom: '2px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            />
                            <div className="file-meta" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                {formatBytes(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'IMAGE'}
                            </div>
                        </div>
                        <button
                            className="file-remove"
                            onClick={() => onRemove(index)}
                            title="Remove file"
                            aria-label={`Remove ${file.name}`}
                            style={{
                                padding: '6px',
                                borderRadius: '50%',
                                background: 'rgba(255,100,100,0.1)',
                                color: '#ff6b6b',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                flexShrink: 0
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
