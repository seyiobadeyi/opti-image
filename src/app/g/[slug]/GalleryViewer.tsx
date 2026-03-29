'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Lock, Mail, Download, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { GalleryPublicMeta, GalleryItem } from '@/types';

interface GalleryViewerProps {
    slug: string;
}

export default function GalleryViewer({ slug }: GalleryViewerProps): React.JSX.Element {
    const [gallery, setGallery] = useState<GalleryPublicMeta | null>(null);
    const [items, setItems] = useState<GalleryItem[] | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const [pin, setPin] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [gateError, setGateError] = useState<string | null>(null);
    const [gateLoading, setGateLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    // Load gallery metadata
    useEffect(() => {
        apiClient.getGalleryPublic(slug)
            .then(setGallery)
            .catch(() => setNotFound(true));
    }, [slug]);

    // If gallery is public, auto-verify
    useEffect(() => {
        if (gallery?.access_type === 'public') {
            apiClient.verifyGalleryAccess(slug)
                .then(token => setAccessToken(token))
                .catch(() => setGateError('Failed to load gallery'));
        }
    }, [gallery, slug]);

    // Load items once we have an access token
    useEffect(() => {
        if (!accessToken) return;
        apiClient.getGalleryItems(slug, accessToken)
            .then(setItems)
            .catch(() => setGateError('Failed to load images'));
    }, [accessToken, slug]);

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setGateLoading(true);
        setGateError(null);
        try {
            const token = await apiClient.verifyGalleryAccess(
                slug,
                gallery?.access_type === 'pin' ? pin : undefined,
                gallery?.access_type === 'email_list' ? emailInput : undefined,
            );
            setAccessToken(token);
        } catch (err: unknown) {
            setGateError(err instanceof Error ? err.message : 'Access denied');
        } finally {
            setGateLoading(false);
        }
    };

    const openLightbox = (index: number): void => setLightboxIndex(index);
    const closeLightbox = (): void => setLightboxIndex(null);

    const prevImage = useCallback((): void => {
        if (lightboxIndex === null || !items) return;
        setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);
    }, [lightboxIndex, items]);

    const nextImage = useCallback((): void => {
        if (lightboxIndex === null || !items) return;
        setLightboxIndex((lightboxIndex + 1) % items.length);
    }, [lightboxIndex, items]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent): void => {
            if (lightboxIndex === null) return;
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'Escape') closeLightbox();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightboxIndex, prevImage, nextImage]);

    const downloadImage = (item: GalleryItem): void => {
        const a = document.createElement('a');
        a.href = item.original_url;
        a.download = item.filename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (notFound) {
        return (
            <div style={styles.page}>
                <div style={styles.notFound}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Gallery not found</h1>
                    <p style={{ color: '#9ca3af' }}>This gallery may have expired or been removed.</p>
                </div>
            </div>
        );
    }

    if (!gallery) {
        return (
            <div style={styles.page}>
                <div style={styles.loading}>Loading...</div>
            </div>
        );
    }

    // PIN / email gate
    const needsGate = gallery.access_type !== 'public' && !accessToken;

    if (needsGate) {
        return (
            <div style={styles.page}>
                <div style={styles.gateContainer}>
                    <div style={styles.gateCard}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            {gallery.access_type === 'pin'
                                ? <Lock size={40} style={{ color: '#7c3aed', marginBottom: '16px' }} />
                                : <Mail size={40} style={{ color: '#7c3aed', marginBottom: '16px' }} />
                            }
                            <h1 style={styles.gateTitle}>{gallery.title}</h1>
                            {gallery.description && (
                                <p style={styles.gateSubtitle}>{gallery.description}</p>
                            )}
                            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '8px' }}>
                                {gallery.access_type === 'pin'
                                    ? 'Enter the PIN to view this gallery'
                                    : 'Enter your email address to request access'}
                            </p>
                        </div>

                        {gateError && (
                            <div style={styles.gateError}>{gateError}</div>
                        )}

                        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {gallery.access_type === 'pin' ? (
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPin(e.target.value)}
                                    placeholder="Enter PIN"
                                    required
                                    autoFocus
                                    style={styles.gateInput}
                                />
                            ) : (
                                <input
                                    type="email"
                                    value={emailInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailInput(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    autoFocus
                                    style={styles.gateInput}
                                />
                            )}
                            <button type="submit" disabled={gateLoading} style={styles.gateButton}>
                                {gateLoading ? 'Verifying...' : 'View Gallery'}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280', fontSize: '0.8rem' }}>
                            Powered by <a href="/" style={{ color: '#7c3aed', textDecoration: 'none' }}>Optimage</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Gallery grid
    return (
        <div style={styles.page}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div>
                        <h1 style={styles.galleryTitle}>{gallery.title}</h1>
                        {gallery.description && (
                            <p style={styles.galleryDesc}>{gallery.description}</p>
                        )}
                    </div>
                    {items && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '0.85rem' }}>
                            <Eye size={14} />
                            {items.length} {items.length === 1 ? 'photo' : 'photos'}
                        </div>
                    )}
                </div>
            </header>

            {/* Grid */}
            {!items ? (
                <div style={styles.loading}>Loading photos...</div>
            ) : items.length === 0 ? (
                <div style={styles.loading}>No photos in this gallery yet.</div>
            ) : (
                <div style={styles.grid}>
                    {items.map((item, index) => (
                        <div key={item.id} className="gallery-grid-item" style={styles.gridItem} onClick={() => openLightbox(index)}>
                            <Image
                                src={item.display_url}
                                alt={item.filename}
                                fill
                                unoptimized
                                style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                            />
                            <div className="gallery-grid-overlay" style={styles.gridOverlay}>
                                {gallery.allow_download && (
                                    <button
                                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); downloadImage(item); }}
                                        style={styles.downloadBtn}
                                        title="Download original"
                                    >
                                        <Download size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            <footer style={styles.footer}>
                <p>Powered by <a href="/" style={{ color: '#7c3aed', textDecoration: 'none' }}>Optimage</a></p>
            </footer>

            {/* Lightbox */}
            {lightboxIndex !== null && items && items[lightboxIndex] && (
                <div style={styles.lightboxOverlay} onClick={closeLightbox}>
                    <button style={styles.lbClose} onClick={closeLightbox}><X size={24} /></button>
                    <button style={{ ...styles.lbNav, left: '16px' }} onClick={(e) => { e.stopPropagation(); prevImage(); }}><ChevronLeft size={32} /></button>
                    <button style={{ ...styles.lbNav, right: '16px' }} onClick={(e) => { e.stopPropagation(); nextImage(); }}><ChevronRight size={32} /></button>

                    <div style={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image
                                src={items[lightboxIndex].display_url}
                                alt={items[lightboxIndex].filename}
                                fill
                                unoptimized
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                    </div>

                    {gallery.allow_download && (
                        <button
                            style={styles.lbDownload}
                            onClick={(e) => { e.stopPropagation(); downloadImage(items[lightboxIndex]!); }}
                        >
                            <Download size={16} style={{ marginRight: '6px' }} />
                            Download Original
                        </button>
                    )}

                    <div style={styles.lbCounter}>
                        {lightboxIndex + 1} / {items.length}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#ffffff',
        fontFamily: 'inherit',
    },
    notFound: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '32px',
    },
    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: '#6b7280',
        fontSize: '1rem',
    },
    gateContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
    },
    gateCard: {
        background: '#111111',
        border: '1px solid #1f1f1f',
        borderRadius: '20px',
        padding: '48px 40px',
        maxWidth: '420px',
        width: '100%',
    },
    gateTitle: {
        fontSize: '1.6rem',
        fontWeight: 700,
        color: '#ffffff',
        marginBottom: '8px',
    },
    gateSubtitle: {
        fontSize: '0.95rem',
        color: '#9ca3af',
        lineHeight: 1.5,
    },
    gateError: {
        padding: '12px 16px',
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: '10px',
        color: '#ef4444',
        fontSize: '0.9rem',
        marginBottom: '16px',
    },
    gateInput: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1px solid #2a2a2a',
        background: '#1a1a1a',
        color: '#ffffff',
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box',
    },
    gateButton: {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        background: '#7c3aed',
        color: '#ffffff',
        border: 'none',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
    },
    header: {
        borderBottom: '1px solid #1a1a1a',
        padding: '24px 32px',
    },
    headerInner: {
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
    },
    galleryTitle: {
        fontSize: '1.8rem',
        fontWeight: 700,
        color: '#ffffff',
        margin: 0,
    },
    galleryDesc: {
        color: '#9ca3af',
        fontSize: '0.95rem',
        marginTop: '6px',
        lineHeight: 1.5,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '4px',
        padding: '4px',
        maxWidth: '1400px',
        margin: '0 auto',
    },
    gridItem: {
        position: 'relative',
        aspectRatio: '1',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#111',
    },
    gridOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        opacity: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '12px',
        transition: 'opacity 0.2s',
    },
    downloadBtn: {
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '8px',
        color: '#ffffff',
        padding: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        textAlign: 'center',
        padding: '32px',
        color: '#4b5563',
        fontSize: '0.85rem',
        borderTop: '1px solid #1a1a1a',
        marginTop: '32px',
    },
    lightboxOverlay: {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lightboxContent: {
        position: 'relative',
        width: 'calc(100vw - 160px)',
        height: 'calc(100vh - 120px)',
        maxWidth: '1200px',
    },
    lbClose: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        color: '#fff',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    lbNav: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        color: '#fff',
        borderRadius: '50%',
        width: '52px',
        height: '52px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    lbDownload: {
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(124,58,237,0.85)',
        border: '1px solid rgba(124,58,237,0.5)',
        backdropFilter: 'blur(8px)',
        color: '#fff',
        borderRadius: '10px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        zIndex: 10,
    },
    lbCounter: {
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#9ca3af',
        fontSize: '0.85rem',
        zIndex: 10,
    },
};
