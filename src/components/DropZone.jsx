'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

const ACCEPTED_TYPES = {
    // Images
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'image/avif': ['.avif'],
    'image/tiff': ['.tif', '.tiff'],
    'image/gif': ['.gif'],
    'image/svg+xml': ['.svg'],
    'image/bmp': ['.bmp'],
    // Video
    'video/mp4': ['.mp4'],
    'video/webm': ['.webm'],
    'video/quicktime': ['.mov'],
    'video/x-msvideo': ['.avi'],
    // Audio
    'audio/mpeg': ['.mp3'],
    'audio/wav': ['.wav'],
    'audio/x-wav': ['.wav'],
};

const FORMATS = ['JPEG', 'PNG', 'WebP', 'AVIF', 'MP4', 'MOV', 'MP3', 'WAV'];

export default function DropZone({ onFilesAdded, disabled, acceptTypes = ACCEPTED_TYPES, formatLabels = FORMATS }) {
    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFilesAdded(acceptedFiles);
            }
        },
        [onFilesAdded]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone(/** @type {any} */ ({
        onDrop,
        accept: acceptTypes,
        maxSize: 100 * 1024 * 1024, // 100MB
        maxFiles: 50,
        disabled,
    }));

    return (
        <div className="dropzone-wrapper">
            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
            >
                <input {...getInputProps()} />
                <div className="dropzone-icon" style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                    <UploadCloud size={48} />
                </div>
                <div className="dropzone-text">
                    {isDragActive ? (
                        <h3>Drop your files here...</h3>
                    ) : (
                        <>
                            <h3>Drag & drop your media here</h3>
                            <p>
                                or <span className="browse-btn">browse files</span> from your device
                            </p>
                        </>
                    )}
                    <p style={{ marginTop: 8 }}>Max 50 files • 100MB each</p>
                </div>
                <div className="supported-formats">
                    {formatLabels.map((fmt) => (
                        <span key={fmt} className="format-badge">{fmt}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
