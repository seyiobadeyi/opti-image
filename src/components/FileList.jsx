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
                    <div key={`${file.name}-${index}`} className="file-card">
                        <img
                            src={url}
                            alt={file.name}
                            className="file-thumbnail"
                            onLoad={() => {/* Keep URL until component unmounts */ }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="file-info">
                            <div className="file-name" title={file.name}>{file.name}</div>
                            <div className="file-meta">
                                {formatBytes(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'IMAGE'}
                            </div>
                        </div>
                        <button
                            className="file-remove"
                            onClick={() => onRemove(index)}
                            title="Remove file"
                            aria-label={`Remove ${file.name}`}
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
