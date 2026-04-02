'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import JSZip from 'jszip';
import { Lock, Mail, Download, X, ChevronLeft, ChevronRight, Eye, CheckSquare, Square, Package, UserCircle, Clock, CreditCard, Camera, ArrowRight, AlertTriangle, Heart, Send, Share2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';
import AuthModal from '@/components/AuthModal';
import type { GalleryPublicMeta, GalleryItem } from '@/types';
import type { Session } from '@supabase/supabase-js';

interface GalleryViewerProps {
    slug: string;
    ownerToken?: string;
}

export default function GalleryViewer({ slug, ownerToken }: GalleryViewerProps): React.JSX.Element {
    const [gallery, setGallery]       = useState<GalleryPublicMeta | null>(null);
    const [items, setItems]           = useState<GalleryItem[]>([]);
    // If the caller passes an ownerToken we bootstrap accessToken immediately
    // so the draft gate / payment gate is bypassed for owner previews
    const [accessToken, setAccessToken] = useState<string | null>(ownerToken ?? null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // ── Pagination / infinite scroll state
    const [itemsPage, setItemsPage]       = useState(1);
    const [hasMoreItems, setHasMoreItems] = useState(false);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [totalItems, setTotalItems]     = useState(0);

    // ── Gate state (PIN / email)
    const [pin, setPin]               = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [gateError, setGateError]   = useState<string | null>(null);
    const [gateLoading, setGateLoading] = useState(false);
    const [notFound, setNotFound]     = useState(false);

    // ── Account gate state (Supabase session + inline OTP)
    const [session, setSession]             = useState<Session | null>(null);
    const [sessionLoading, setSessionLoading] = useState(true);
    const [otpEmail, setOtpEmail]           = useState('');
    const [otpCode, setOtpCode]             = useState('');
    const [otpStep, setOtpStep]             = useState<'email' | 'code'>('email');
    const [otpLoading, setOtpLoading]       = useState(false);
    const [otpError, setOtpError]           = useState<string | null>(null);

    // ── Cover page state
    const [showCover, setShowCover]         = useState<boolean>(true);

    // ── Multi-select state
    const [selectMode, setSelectMode]       = useState(false);
    const [selectedIds, setSelectedIds]     = useState<Set<string>>(new Set());
    const [zipProgress, setZipProgress]     = useState<number | null>(null); // 0–100 or null
    const [zipError, setZipError]           = useState<string | null>(null);

    // ── Favourites state
    const [favoriteIds, setFavoriteIds]     = useState<Set<string>>(new Set());
    const [viewerIdentifier, setViewerIdentifier] = useState<string>('');
    const [favSubmitting, setFavSubmitting] = useState(false);
    const [favSubmitted, setFavSubmitted]   = useState(false);
    const [favError, setFavError]           = useState<string | null>(null);
    const [showFavMode, setShowFavMode]     = useState(false);

    // ── Share state
    const [shareCopied, setShareCopied]         = useState(false);

    // ── Auth modal (gallery has no Header, so it manages its own)
    const [authModalOpen, setAuthModalOpen]     = useState(false);


    // ── Load gallery metadata
    useEffect(() => {
        apiClient.getGalleryPublic(slug)
            .then(setGallery)
            .catch(() => setNotFound(true));
    }, [slug]);

    // ── Track Supabase session (needed for 'account' galleries)
    useEffect(() => {
        const supabase = createClient();

        const applySession = (s: typeof session) => {
            setSession(s);
            setSessionLoading(false);
            if (!s?.user) return;
            // Use display_name from profile if available, fall back to email
            // so the photographer sees "Sarah" not "sarah@gmail.com"
            void supabase
                .from('profiles')
                .select('display_name, username')
                .eq('id', s.user.id)
                .maybeSingle()
                .then(({ data }) => {
                    const label = data?.display_name ?? data?.username ?? s.user.email ?? s.user.id;
                    setViewerIdentifier(label);
                });
        };

        supabase.auth.getSession().then(({ data }) => applySession(data.session));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
            applySession(s);
        });
        return () => subscription.unsubscribe();
    }, []);

    // ── Auto-verify public galleries
    useEffect(() => {
        if (gallery?.access_type === 'public') {
            apiClient.verifyGalleryAccess(slug)
                .then(token => setAccessToken(token))
                .catch(() => setGateError('Failed to load gallery'));
        }
    }, [gallery, slug]);

    // ── Auto-verify 'account' galleries once we have a session
    useEffect(() => {
        if (gallery?.access_type !== 'account' || !session || accessToken) return;
        apiClient.verifyGalleryAccess(slug, undefined, undefined, session.access_token)
            .then(token => setAccessToken(token))
            .catch(err => setGateError(err instanceof Error ? err.message : 'Access denied'));
    }, [gallery, session, slug, accessToken]);

    // ── Load items once we have an access token
    useEffect(() => {
        if (!accessToken) return;
        setItemsLoading(true);
        apiClient.getGalleryItems(slug, accessToken, 1, 48)
            .then(({ items: newItems, hasMore, total }) => {
                setItems(newItems);
                setHasMoreItems(hasMore);
                setTotalItems(total);
                setItemsPage(1);
            })
            .catch(() => setGateError('Failed to load images'))
            .finally(() => setItemsLoading(false));
    }, [accessToken, slug]);

    // ── Load existing favourites once we know the viewer identifier
    useEffect(() => {
        if (!accessToken || !viewerIdentifier) return;
        apiClient.getGalleryFavorites(slug, accessToken, viewerIdentifier)
            .then(ids => setFavoriteIds(new Set(ids)))
            .catch(() => null);
    }, [accessToken, viewerIdentifier, slug]);

    // ── Account gate: send OTP email
    const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!otpEmail.trim()) return;
        setOtpLoading(true);
        setOtpError(null);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOtp({
                email: otpEmail.trim(),
                options: { shouldCreateUser: true },
            });
            if (error) throw error;
            setOtpStep('code');
        } catch (err: unknown) {
            setOtpError(err instanceof Error ? err.message : 'Failed to send code. Try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    // ── Account gate: verify OTP code
    const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!otpCode.trim()) return;
        setOtpLoading(true);
        setOtpError(null);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.verifyOtp({
                email: otpEmail.trim(),
                token: otpCode.trim(),
                type: 'email',
            });
            if (error) throw error;
            // Session will be set by onAuthStateChange → auto-verify fires automatically
        } catch (err: unknown) {
            setOtpError(err instanceof Error ? err.message : 'Invalid code. Try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    // ── PIN / email gate submit
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
            if (gallery?.access_type === 'email_list') setViewerIdentifier(emailInput.trim());
        } catch (err: unknown) {
            setGateError(err instanceof Error ? err.message : 'Access denied');
        } finally {
            setGateLoading(false);
        }
    };

    // ── Lightbox navigation
    const openLightbox  = (index: number): void => { if (!selectMode) setLightboxIndex(index); };
    const closeLightbox = (): void => setLightboxIndex(null);

    const prevImage = useCallback((): void => {
        if (lightboxIndex === null || items.length === 0) return;
        setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);
    }, [lightboxIndex, items]);

    const nextImage = useCallback((): void => {
        if (lightboxIndex === null || items.length === 0) return;
        setLightboxIndex((lightboxIndex + 1) % items.length);
    }, [lightboxIndex, items]);

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

    // ── Infinite scroll — load next page
    const loadMoreItems = useCallback(async () => {
        if (!accessToken || itemsLoading || !hasMoreItems) return;
        setItemsLoading(true);
        try {
            const nextPage = itemsPage + 1;
            const { items: newItems, hasMore } = await apiClient.getGalleryItems(slug, accessToken, nextPage, 48);
            setItems(prev => [...prev, ...newItems]);
            setHasMoreItems(hasMore);
            setItemsPage(nextPage);
        } catch (e) {
            console.error(e);
        } finally {
            setItemsLoading(false);
        }
    }, [accessToken, itemsLoading, hasMoreItems, itemsPage, slug]);

    // ── IntersectionObserver sentinel
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasMoreItems) return;
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0]?.isIntersecting) void loadMoreItems(); },
            { rootMargin: '200px' }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMoreItems, loadMoreItems]);

    // ── Download helper (choose version)
    const triggerDownload = (url: string, filename: string): void => {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const downloadOriginal = (item: GalleryItem): void => triggerDownload(item.original_url, item.filename);
    const downloadWebP = (item: GalleryItem): void => {
        const webpName = item.filename.replace(/\.[^.]+$/, '.webp');
        triggerDownload(item.display_url, webpName);
    };

    // ── Auth gate for downloads and favourites
    // Signed-in users proceed immediately. Everyone else sees the AuthModal.
    // If session is still resolving, we wait — no false positives.
    const requireAuth = (fn: () => void): void => {
        if (sessionLoading) return;
        if (!session) {
            setAuthModalOpen(true);
            return;
        }
        fn();
    };

    // ── Multi-select helpers
    const toggleSelect = (id: string): void => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectMode = (): void => {
        setSelectMode(prev => {
            if (prev) setSelectedIds(new Set());
            return !prev;
        });
    };

    const selectAll   = (): void => setSelectedIds(new Set(items.map(i => i.id)));
    const deselectAll = (): void => setSelectedIds(new Set());

    // ── ZIP download — useWebP=false → originals, useWebP=true → display WebP versions
    const downloadSelected = async (useWebP: boolean): Promise<void> => {
        if (selectedIds.size === 0) return;
        const toDownload = items.filter(i => selectedIds.has(i.id));
        setZipProgress(0);
        setZipError(null);

        try {
            const zip = new JSZip();
            let done = 0;

            await Promise.all(toDownload.map(async (item) => {
                try {
                    const url = useWebP ? item.display_url : item.original_url;
                    const name = useWebP
                        ? item.filename.replace(/\.[^.]+$/, '.webp')
                        : (item.filename || `photo-${item.id}.jpg`);
                    const res = await fetch(url);
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const blob = await res.blob();
                    zip.file(name, blob);
                } finally {
                    done++;
                    setZipProgress(Math.round((done / toDownload.length) * 80));
                }
            }));

            setZipProgress(85);
            const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
            setZipProgress(98);

            const objUrl = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = objUrl;
            a.download = `${gallery?.title ?? 'gallery'}-${useWebP ? 'webp' : 'originals'}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(objUrl), 10_000);

            setZipProgress(100);
            setTimeout(() => {
                setZipProgress(null);
                setSelectedIds(new Set());
                setSelectMode(false);
            }, 1200);
        } catch (err: unknown) {
            setZipError(err instanceof Error ? err.message : 'Download failed');
            setZipProgress(null);
        }
    };

    // ── Favourites helpers
    const toggleFavorite = (itemId: string): void => {
        setFavoriteIds(prev => {
            const next = new Set(prev);
            next.has(itemId) ? next.delete(itemId) : next.add(itemId);
            return next;
        });
    };

    const submitFavorites = async (): Promise<void> => {
        if (!accessToken || !viewerIdentifier || !gallery) return;
        setFavSubmitting(true);
        try {
            await apiClient.setGalleryFavorites(
                slug, accessToken,
                Array.from(favoriteIds),
                viewerIdentifier,
                true, // notify photographer
            );
            setFavSubmitted(true);
            setShowFavMode(false);
            setTimeout(() => setFavSubmitted(false), 5000);
        } catch (err: unknown) {
            setFavError(err instanceof Error ? err.message : 'Failed to save favourites');
        } finally {
            setFavSubmitting(false);
        }
    };

    // ───────────────────────────────────────────────────────────────────────────

    if (notFound) {
        return (
            <div style={styles.page}>
                <div style={styles.centered}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Gallery not found</h1>
                    <p style={{ color: '#9ca3af' }}>This gallery may have expired or been removed.</p>
                </div>
            </div>
        );
    }

    if (!gallery) {
        return <div style={styles.page}><div style={styles.loading}>Loading...</div></div>;
    }

    // Check if gallery has expired
    const isExpired = gallery.expires_at ? new Date(gallery.expires_at) < new Date() : false;
    if (isExpired) {
        return (
            <div style={styles.page}>
                <div style={styles.gateContainer}>
                    <div style={styles.gateCard}>
                        <div style={{ textAlign: 'center' }}>
                            <AlertTriangle size={44} style={{ color: '#f59e0b', margin: '0 auto 16px' }} />
                            <h1 style={styles.gateTitle}>{gallery.title}</h1>
                            <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginTop: '12px', lineHeight: 1.6 }}>
                                This gallery has expired and is no longer available.
                            </p>
                            {gallery.photographer_name && (
                                <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '8px' }}>
                                    Gallery by {gallery.photographer_name}
                                </p>
                            )}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '32px' }}>
                            <button onClick={() => setShowCover(true)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.82rem', cursor: 'pointer', padding: '8px' }}>
                                Go Back
                            </button>
                        </div>
                        <p style={{ textAlign: 'center', marginTop: '16px', color: '#4b5563', fontSize: '0.78rem' }}>
                            Powered by <a href="https://optimage.dreamintrepid.com" style={{ color: '#7c3aed', textDecoration: 'none' }}>Optimage</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Draft / maintenance mode — shown to everyone EXCEPT the owner previewing via token ───
    if (gallery.status === 'draft' && !ownerToken) {
        return (
            <div style={styles.page}>
                <div style={styles.gateContainer}>
                    <div style={styles.gateCard}>
                        <div style={{ textAlign: 'center' }}>
                            <Clock size={44} style={{ color: '#7c3aed', marginBottom: '16px' }} />
                            <h1 style={styles.gateTitle}>{gallery.title}</h1>
                            <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginTop: '12px', lineHeight: 1.6 }}>
                                This gallery is currently being prepared.<br />
                                Check back soon — your photographer will let you know when it's ready.
                            </p>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <button onClick={() => setShowCover(true)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.82rem', cursor: 'pointer', padding: '8px' }}>
                                Go Back
                            </button>
                        </div>
                        <p style={{ textAlign: 'center', marginTop: '16px', color: '#4b5563', fontSize: '0.78rem' }}>
                            Powered by <a href="https://optimage.dreamintrepid.com" style={{ color: '#7c3aed', textDecoration: 'none' }}>Optimage</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Payment gate ───────────────────────────────────────────────────────────
    if (gallery.payment_required && !gallery.payment_unlocked) {
        return (
            <div style={styles.page}>
                <div style={styles.gateContainer}>
                    <div style={styles.gateCard}>
                        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                            <CreditCard size={44} style={{ color: '#7c3aed', margin: '0 auto 16px' }} />
                            <h1 style={styles.gateTitle}>{gallery.title}</h1>
                            {gallery.description && <p style={styles.gateSubtitle}>{gallery.description}</p>}
                            <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginTop: '10px' }}>
                                Payment is required to access this gallery.
                            </p>
                        </div>
                        {gallery.payment_instructions && (
                            <div style={{ background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                                <p style={{ color: '#a78bfa', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                                    Payment instructions
                                </p>
                                <p style={{ color: '#e5e7eb', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
                                    {gallery.payment_instructions}
                                </p>
                            </div>
                        )}
                        <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '10px', padding: '14px 16px' }}>
                            <p style={{ color: '#c4b5fd', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
                                Once you've made payment, send your receipt to your photographer. They'll unlock your gallery and you'll be able to access it at this link.
                            </p>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <button onClick={() => setShowCover(true)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.82rem', cursor: 'pointer', padding: '8px' }}>
                                Cancel / Go Back
                            </button>
                        </div>
                        <p style={{ textAlign: 'center', marginTop: '16px', color: '#4b5563', fontSize: '0.78rem' }}>
                            Powered by <a href="https://optimage.dreamintrepid.com" style={{ color: '#7c3aed', textDecoration: 'none' }}>Optimage</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Account gate screen
    if (gallery.access_type === 'account' && !accessToken) {
        // Still resolving session — show spinner
        if (sessionLoading) {
            return <div style={styles.page}><div style={styles.loading}>Checking access…</div></div>;
        }

        // Already signed in but access token not yet granted — wait for auto-verify
        if (session && !gateError) {
            return <div style={styles.page}><div style={styles.loading}>Loading gallery…</div></div>;
        }

        // Not signed in (or access was explicitly denied) — show sign-in prompt
        return (
            <div style={styles.page}>
                <div style={styles.gateContainer}>
                    <div style={styles.gateCard}>
                        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                            <UserCircle size={44} style={{ color: '#7c3aed', marginBottom: '14px' }} />
                            <h1 style={styles.gateTitle}>{gallery.title}</h1>
                            {gallery.description && <p style={styles.gateSubtitle}>{gallery.description}</p>}
                            <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginTop: '10px', lineHeight: 1.55 }}>
                                This gallery is for Optimage members only.<br />
                                Sign in or create a <strong style={{ color: '#c4b5fd' }}>free account</strong> to view it — no credit card needed.
                            </p>
                        </div>

                        {gateError && (
                            <div style={styles.gateError}>{gateError}</div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button onClick={() => setAuthModalOpen(true)} style={styles.gateButton}>
                                Sign in & view gallery
                            </button>
                            <button onClick={() => setShowCover(true)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.82rem', cursor: 'pointer', padding: '8px' }}>
                                Cancel / Go Back
                            </button>
                        </div>

                        <p style={{ textAlign: 'center', marginTop: '24px', color: '#4b5563', fontSize: '0.78rem' }}>
                            Powered by <a href="https://optimage.dreamintrepid.com" style={{ color: '#7c3aed', textDecoration: 'none' }}>Optimage</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── PIN / email gate screen
    if (gallery.access_type !== 'public' && gallery.access_type !== 'account' && !accessToken) {
        return (
            <div style={styles.page}>
                <div style={styles.gateContainer}>
                    <div style={styles.gateCard}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            {gallery.access_type === 'pin'
                                ? <Lock size={40} style={{ color: '#7c3aed', margin: '0 auto 16px' }} />
                                : <Mail size={40} style={{ color: '#7c3aed', margin: '0 auto 16px' }} />
                            }
                            <h1 style={styles.gateTitle}>{gallery.title}</h1>
                            {gallery.description && <p style={styles.gateSubtitle}>{gallery.description}</p>}
                            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '8px' }}>
                                {gallery.access_type === 'pin'
                                    ? 'Enter the PIN to view this gallery'
                                    : 'Enter your email address to request access'}
                            </p>
                        </div>
                        {gateError && <div style={styles.gateError}>{gateError}</div>}
                        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {gallery.access_type === 'pin' ? (
                                <input type="password" value={pin}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPin(e.target.value)}
                                    placeholder="Enter PIN" required autoFocus style={styles.gateInput} />
                            ) : (
                                <input type="email" value={emailInput}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailInput(e.target.value)}
                                    placeholder="your@email.com" required autoFocus style={styles.gateInput} />
                            )}
                            <button type="submit" disabled={gateLoading} style={styles.gateButton}>
                                {gateLoading ? 'Verifying...' : 'View Gallery'}
                            </button>
                            <button type="button" onClick={() => setShowCover(true)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.82rem', cursor: 'pointer', padding: '8px' }}>
                                Cancel / Go Back
                            </button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280', fontSize: '0.8rem' }}>
                            Powered by <a href="https://optimage.dreamintrepid.com" style={{ color: '#7c3aed', textDecoration: 'none' }}>Optimage</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Cover page — shown before photos (and before gate for PIN galleries)
    if (showCover) {
        const hasCover = !!gallery.cover_image_url;
        return (
            <div style={{
                minHeight: '100vh',
                background: '#000',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}>
                {/* Background cover image */}
                {hasCover ? (
                    <>
                        <Image
                            src={gallery.cover_image_url!}
                            alt={gallery.title}
                            fill
                            unoptimized
                            priority
                            style={{ objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.45)', userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
                            onContextMenu={(e) => e.preventDefault()}
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                        />
                        {/* Gradient overlay for text readability */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.7) 100%)',
                            zIndex: 1,
                        }} />
                    </>
                ) : (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a1a 100%)',
                        zIndex: 0,
                    }} />
                )}

                {/* Cover content */}
                <div style={{
                    position: 'relative', zIndex: 2,
                    textAlign: 'center',
                    padding: '40px 32px',
                    maxWidth: '700px',
                }}>
                    <h1 style={{
                        fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
                        fontWeight: 800,
                        color: '#ffffff',
                        letterSpacing: '-0.01em',
                        textTransform: 'uppercase',
                        lineHeight: 1.1,
                        marginBottom: '20px',
                        textShadow: '0 2px 24px rgba(0,0,0,0.5)',
                    }}>
                        {gallery.title}
                    </h1>
                    {gallery.description && (
                        <p style={{
                            fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
                            color: 'rgba(255,255,255,0.75)',
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            marginBottom: '40px',
                            fontWeight: 400,
                        }}>
                            {gallery.description}
                        </p>
                    )}
                    <button
                        onClick={() => setShowCover(false)}
                        style={{
                            padding: '14px 40px',
                            border: '1.5px solid rgba(255,255,255,0.75)',
                            background: 'transparent',
                            color: '#ffffff',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s ease',
                            borderRadius: '2px',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        }}
                    >
                        View Gallery <ArrowRight size={15} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Photographer credit at bottom */}
                {gallery.photographer_name && (
                    <div style={{
                        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
                        zIndex: 2,
                        textAlign: 'center',
                    }}>
                        <p style={{
                            color: 'rgba(255,255,255,0.55)',
                            fontSize: '0.72rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            margin: 0,
                        }}>
                            {gallery.photographer_name}
                        </p>
                    </div>
                )}

                {/* Optimage watermark — bottom right */}
                <div style={{
                    position: 'absolute', bottom: '24px', right: '24px', zIndex: 2,
                }}>
                    <a href="https://optimage.dreamintrepid.com" target="_blank" rel="noreferrer"
                        style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', textDecoration: 'none', letterSpacing: '0.1em' }}>
                        OPTIMAGE
                    </a>
                </div>
            </div>
        );
    }

    const allSelected = items.length > 0 && selectedIds.size === items.length;

    // ── Main gallery view
    return (
        <div style={styles.page}>
            {/* Owner management bar — only visible to the gallery owner when signed in */}
            {gallery.is_owner && (
                <div style={{
                    background: 'linear-gradient(90deg, rgba(124,58,237,0.15), rgba(139,92,246,0.08))',
                    borderBottom: '1px solid rgba(124,58,237,0.25)',
                    padding: '10px 24px',
                    display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
                }}>
                    <span style={{ fontSize: '0.78rem', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <Camera size={13} /> You are viewing your own gallery
                    </span>
                    <a href="/dashboard" style={{
                        marginLeft: 'auto', padding: '6px 14px', borderRadius: '8px',
                        background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
                        color: '#c4b5fd', fontSize: '0.78rem', fontWeight: 600,
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
                    }}>
                        Manage gallery
                    </a>
                </div>
            )}
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div>
                        <h1 style={styles.galleryTitle}>{gallery.title}</h1>
                        {gallery.description && <p style={styles.galleryDesc}>{gallery.description}</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {(totalItems > 0 || items.length > 0) && (
                            <span style={{ color: '#6b7280', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Eye size={14} /> {totalItems || items.length} {(totalItems || items.length) === 1 ? 'photo' : 'photos'}
                            </span>
                        )}
                        {gallery.allow_download && items.length > 0 && (
                            <button
                                onClick={toggleSelectMode}
                                style={{
                                    padding: '8px 16px', borderRadius: '10px', border: '1px solid #2a2a2a',
                                    background: selectMode ? '#7c3aed' : 'transparent',
                                    color: selectMode ? '#fff' : '#9ca3af',
                                    fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <CheckSquare size={15} />
                                {selectMode ? 'Cancel selection' : 'Select photos'}
                            </button>
                        )}
                        <button
                            onClick={() => requireAuth(() => {
                                setShowFavMode(v => !v);
                                setSelectMode(false);
                                setSelectedIds(new Set());
                            })}
                            style={{
                                padding: '8px 16px', borderRadius: '10px', border: '1px solid #2a2a2a',
                                background: showFavMode ? 'rgba(236,72,153,0.2)' : 'transparent',
                                color: showFavMode ? '#f472b6' : '#9ca3af',
                                fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                transition: 'all 0.15s',
                            }}
                        >
                            <Heart size={15} fill={showFavMode ? '#f472b6' : 'none'} />
                            {showFavMode
                                ? (favoriteIds.size > 0 ? `${favoriteIds.size} liked` : 'Pick favourites')
                                : 'Pick favourites'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Selection toolbar */}
            {selectMode && (
                <div style={{
                    position: 'sticky', top: 0, zIndex: 100,
                    background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #1f1f1f',
                    padding: '12px 32px',
                    display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                }}>
                    <button onClick={allSelected ? deselectAll : selectAll}
                        style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '6px 0' }}>
                        {allSelected ? <CheckSquare size={16} color="#7c3aed" /> : <Square size={16} />}
                        {allSelected ? 'Deselect all' : 'Select all'}
                    </button>
                    <span style={{ color: '#4b5563', fontSize: '0.85rem' }}>
                        {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Click photos to select'}
                    </span>
                    {selectedIds.size > 0 && zipProgress === null && (
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => requireAuth(() => void downloadSelected(true))}
                                style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.4)', color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Package size={14} /> ZIP — WebP <span style={{ opacity: 0.65, fontWeight: 400 }}>(smaller)</span>
                            </button>
                            <button
                                onClick={() => requireAuth(() => void downloadSelected(false))}
                                style={{ padding: '8px 16px', borderRadius: '10px', background: '#7c3aed', border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Package size={14} /> ZIP — Originals
                            </button>
                        </div>
                    )}
                    {zipProgress !== null && (
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '140px', height: '4px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${zipProgress}%`, background: '#7c3aed', borderRadius: '4px', transition: 'width 0.2s' }} />
                            </div>
                            <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Building ZIP… {zipProgress}%</span>
                        </div>
                    )}
                    {zipError && (
                        <span style={{ color: '#ef4444', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {zipError}
                            <button onClick={() => setZipError(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
                        </span>
                    )}
                </div>
            )}

            {/* Favourites submit toolbar */}
            {showFavMode && (
                <div style={{
                    position: 'sticky', top: 0, zIndex: 100,
                    background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #1f1f1f',
                    padding: '12px 32px',
                    display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                }}>
                    <Heart size={16} color="#f472b6" fill="#f472b6" />
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                        {favoriteIds.size > 0
                            ? `${favoriteIds.size} photo${favoriteIds.size !== 1 ? 's' : ''} liked — click photos to add more`
                            : 'Tap photos to pick your favourites'}
                    </span>
                    {favError && (
                        <span style={{ color: '#ef4444', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                            {favError}
                            <button onClick={() => setFavError(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
                        </span>
                    )}
                    {favoriteIds.size > 0 && !favSubmitting && !favError && (
                        <button
                            onClick={() => { setFavError(null); void submitFavorites(); }}
                            style={{
                                marginLeft: 'auto',
                                padding: '8px 20px', borderRadius: '10px',
                                background: '#ec4899', border: 'none',
                                color: '#fff', fontSize: '0.85rem', fontWeight: 600,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                            }}
                        >
                            <Send size={14} /> Send to photographer
                        </button>
                    )}
                    {favSubmitting && (
                        <span style={{ marginLeft: 'auto', color: '#f472b6', fontSize: '0.85rem' }}>Sending…</span>
                    )}
                </div>
            )}

            {/* Favourites submitted confirmation */}
            {favSubmitted && (
                <div style={{
                    background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)',
                    borderRadius: '12px', padding: '16px 24px', margin: '16px 32px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                    <Heart size={20} color="#f472b6" fill="#f472b6" />
                    <div>
                        <p style={{ color: '#f472b6', fontWeight: 600, margin: 0 }}>Favourites sent!</p>
                        <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                            Your photographer has been notified with your {favoriteIds.size} selected photos.
                        </p>
                    </div>
                </div>
            )}

            {/* Grid */}
            {items.length === 0 && itemsLoading ? (
                <div style={styles.loading}>Loading photos...</div>
            ) : items.length === 0 && !itemsLoading ? (
                <div style={styles.loading}>No photos in this gallery yet.</div>
            ) : (
                <div style={styles.grid}>
                    {items.map((item, index) => {
                        const isSelected = selectedIds.has(item.id);
                        return (
                            <div
                                key={item.id}
                                className="gallery-grid-item"
                                style={{
                                    ...styles.gridItem,
                                    outline: isSelected ? '3px solid #7c3aed' : 'none',
                                    outlineOffset: '-3px',
                                }}
                                onClick={() => selectMode ? toggleSelect(item.id) : (showFavMode ? toggleFavorite(item.id) : openLightbox(index))}
                                onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                            >
                                <Image
                                    src={item.display_url}
                                    alt={item.filename}
                                    fill unoptimized
                                    style={{ objectFit: 'cover', transition: 'transform 0.3s ease', userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                                    onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                                    draggable={false}
                                    onDragStart={(e: React.DragEvent) => e.preventDefault()}
                                />
                                {/* Select mode checkbox */}
                                {selectMode && (
                                    <div style={{
                                        position: 'absolute', top: '10px', left: '10px', zIndex: 5,
                                        background: isSelected ? '#7c3aed' : 'rgba(0,0,0,0.6)',
                                        border: `2px solid ${isSelected ? '#7c3aed' : 'rgba(255,255,255,0.4)'}`,
                                        borderRadius: '6px', width: '22px', height: '22px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.15s',
                                    }}>
                                        {isSelected && <X size={13} color="#fff" strokeWidth={3} />}
                                    </div>
                                )}
                                {/* Favourite indicator */}
                                {showFavMode && (
                                    <div
                                        style={{
                                            position: 'absolute', top: '10px', right: '10px', zIndex: 5,
                                            background: favoriteIds.has(item.id) ? 'rgba(236,72,153,0.85)' : 'rgba(0,0,0,0.5)',
                                            borderRadius: '50%', width: '32px', height: '32px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.15s', cursor: 'pointer',
                                            border: favoriteIds.has(item.id) ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                                        }}
                                        onClick={() => toggleFavorite(item.id)}
                                    >
                                        <Heart
                                            size={16}
                                            color={favoriteIds.has(item.id) ? '#fff' : 'rgba(255,255,255,0.7)'}
                                            fill={favoriteIds.has(item.id) ? '#fff' : 'none'}
                                        />
                                    </div>
                                )}
                                {/* Hover overlay (normal mode only) */}
                                {!selectMode && (
                                    <div className="gallery-grid-overlay" style={styles.gridOverlay}>
                                        {gallery.allow_download && (
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button
                                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); requireAuth(() => downloadWebP(item)); }}
                                                    style={{ ...styles.downloadBtn, fontSize: '0.7rem', padding: '6px 10px', gap: '4px', display: 'flex', alignItems: 'center' }}
                                                    title="Download WebP (optimised)"
                                                >
                                                    <Download size={13} /> WebP
                                                </button>
                                                <button
                                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); requireAuth(() => downloadOriginal(item)); }}
                                                    style={{ ...styles.downloadBtn, fontSize: '0.7rem', padding: '6px 10px', gap: '4px', display: 'flex', alignItems: 'center' }}
                                                    title="Download original file"
                                                >
                                                    <Download size={13} /> Original
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} style={{ height: 1 }} />
            {itemsLoading && items.length > 0 && (
                <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af', fontSize: '0.85rem' }}>
                    Loading more photos…
                </div>
            )}

            {/* Auth modal — gallery has no site Header, so it owns this itself */}
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

            {/* Footer */}
            <footer style={styles.footer}>
                {gallery.branding_studio_name ? (
                    <div>
                        <p style={{ fontWeight: 600, color: gallery.branding_color ?? '#9ca3af', marginBottom: '4px' }}>
                            {gallery.branding_studio_name}
                        </p>
                        {gallery.branding_website && (
                            <a href={gallery.branding_website} target="_blank" rel="noreferrer"
                                style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none' }}>
                                {gallery.branding_website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                        <p style={{ color: '#374151', fontSize: '0.72rem', marginTop: '12px' }}>
                            Delivered via <a href="https://optimage.dreamintrepid.com" style={{ color: '#7c3aed', textDecoration: 'none' }}>Optimage</a>
                        </p>
                    </div>
                ) : (
                    <p>Powered by <a href="https://optimage.dreamintrepid.com" style={{ color: '#7c3aed', textDecoration: 'none' }}>Optimage</a></p>
                )}
            </footer>

            {/* Lightbox */}
            {lightboxIndex !== null && items[lightboxIndex] && (
                <div style={styles.lightboxOverlay} onClick={closeLightbox}>
                    <button style={styles.lbClose} onClick={closeLightbox}><X size={24} /></button>
                    <button style={{ ...styles.lbNav, left: '16px' }} onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                        <ChevronLeft size={32} />
                    </button>
                    <button style={{ ...styles.lbNav, right: '16px' }} onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                        <ChevronRight size={32} />
                    </button>

                    {/* Lightbox shows display version (2048px WebP — faster + high quality) */}
                    <div style={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image
                                src={items[lightboxIndex].display_url}
                                alt={items[lightboxIndex].filename}
                                fill unoptimized
                                style={{ objectFit: 'contain', userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
                                priority
                                onContextMenu={(e) => e.preventDefault()}
                                draggable={false}
                                onDragStart={(e: React.DragEvent) => e.preventDefault()}
                            />
                        </div>
                    </div>

                    <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
                        {gallery.allow_download && (
                            <>
                                <button
                                    style={{ ...styles.lbDownload, position: 'static', transform: 'none', background: 'rgba(30,20,60,0.85)', border: '1px solid rgba(124,58,237,0.4)' }}
                                    onClick={(e) => { e.stopPropagation(); requireAuth(() => downloadWebP(items[lightboxIndex]!)); }}
                                >
                                    <Download size={15} style={{ marginRight: '5px' }} /> WebP
                                </button>
                                <button
                                    style={{ ...styles.lbDownload, position: 'static', transform: 'none' }}
                                    onClick={(e) => { e.stopPropagation(); requireAuth(() => downloadOriginal(items[lightboxIndex]!)); }}
                                >
                                    <Download size={15} style={{ marginRight: '5px' }} /> Original
                                </button>
                            </>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const shareUrl = `${window.location.origin}/g/${slug}`;
                                if (navigator.share) {
                                    void navigator.share({
                                        title: gallery?.title ?? 'Gallery',
                                        text: `Check out this photo gallery: ${gallery?.title ?? ''}`,
                                        url: shareUrl,
                                    });
                                } else {
                                    void navigator.clipboard.writeText(shareUrl).then(() => {
                                        setShareCopied(true);
                                        setTimeout(() => setShareCopied(false), 2000);
                                    });
                                }
                            }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '8px 16px', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff', fontSize: '0.85rem',
                                cursor: 'pointer', transition: 'background 0.15s',
                            }}
                            title="Share gallery"
                        >
                            <Share2 size={16} /> {shareCopied ? 'Copied!' : 'Share'}
                        </button>
                    </div>

                    <div style={styles.lbCounter}>
                        {lightboxIndex + 1} / {items.length}
                        <span style={{ color: '#6b7280', marginLeft: '8px', fontSize: '0.78rem' }}>
                            {items[lightboxIndex].filename}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    page:        { minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', fontFamily: 'inherit' },
    centered:    { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '32px' },
    loading:     { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#6b7280', fontSize: '1rem' },
    gateContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' },
    gateCard:    { background: '#111111', border: '1px solid #1f1f1f', borderRadius: '20px', padding: '48px 40px', maxWidth: '420px', width: '100%' },
    gateTitle:   { fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' },
    gateSubtitle:{ fontSize: '0.95rem', color: '#9ca3af', lineHeight: 1.5 },
    gateError:   { padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#ef4444', fontSize: '0.9rem', marginBottom: '16px' },
    gateInput:   { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #2a2a2a', background: '#1a1a1a', color: '#ffffff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
    gateButton:  { width: '100%', padding: '14px', borderRadius: '12px', background: '#7c3aed', color: '#ffffff', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
    header:      { borderBottom: '1px solid #1a1a1a', padding: '24px 32px' },
    headerInner: { maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' },
    galleryTitle:{ fontSize: '1.8rem', fontWeight: 700, color: '#ffffff', margin: 0 },
    galleryDesc: { color: '#9ca3af', fontSize: '0.95rem', marginTop: '6px', lineHeight: 1.5 },
    grid:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '4px', padding: '4px', maxWidth: '1400px', margin: '0 auto' },
    gridItem:    { position: 'relative', aspectRatio: '1', overflow: 'hidden', cursor: 'pointer', background: '#111', userSelect: 'none' as const, WebkitUserSelect: 'none' as const },
    gridOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', opacity: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '12px', transition: 'opacity 0.2s' },
    downloadBtn: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#ffffff', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    footer:      { textAlign: 'center', padding: '32px', color: '#4b5563', fontSize: '0.85rem', borderTop: '1px solid #1a1a1a', marginTop: '32px' },
    lightboxOverlay: { position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    lightboxContent: { position: 'relative', width: 'calc(100vw - 160px)', height: 'calc(100vh - 120px)', maxWidth: '1200px' },
    lbClose:     { position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    lbNav:       { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', width: '52px', height: '52px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
    lbDownload:  { position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(124,58,237,0.85)', border: '1px solid rgba(124,58,237,0.5)', backdropFilter: 'blur(8px)', color: '#fff', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', zIndex: 10 },
    lbCounter:   { position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', color: '#9ca3af', fontSize: '0.85rem', zIndex: 10, whiteSpace: 'nowrap' },
};
