'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';
import { subscribeNewsletter } from '@/app/actions';
import { getCookie, setCookie } from '@/utils/cookies';
import type { FormStatus, NewsletterResult } from '@/types';

export default function NewsletterPopup(): React.JSX.Element | null {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [isAlreadySubscribed, setIsAlreadySubscribed] = useState<boolean>(false);
    const popupRef = useRef<HTMLDivElement | null>(null);
    // Track whether any other overlay (AuthModal, SubscriptionPaywall) is open
    const overlayOpenRef = useRef<boolean>(false);
    const pendingShowRef = useRef<boolean>(false);

    // Listen for other modals/overlays opening and closing
    useEffect(() => {
        const handleOverlayOpen = (): void => {
            overlayOpenRef.current = true;
            // If we were about to show, hide temporarily
            if (isOpen) setIsOpen(false);
        };

        const handleOverlayClose = (): void => {
            overlayOpenRef.current = false;
            // If there was a pending show request, show now after a short delay
            if (pendingShowRef.current) {
                pendingShowRef.current = false;
                setTimeout(() => {
                    if (!overlayOpenRef.current) setIsOpen(true);
                }, 600);
            }
        };

        window.addEventListener('optimage:overlay:open', handleOverlayOpen);
        window.addEventListener('optimage:overlay:close', handleOverlayClose);
        return () => {
            window.removeEventListener('optimage:overlay:open', handleOverlayOpen);
            window.removeEventListener('optimage:overlay:close', handleOverlayClose);
        };
    }, [isOpen]);

    // Show popup after 15 seconds if user hasn't seen it
    useEffect(() => {
        const hasSeenNewsletter = getCookie('optimage_newsletter_seen') ?? localStorage.getItem('optimage_newsletter_seen');
        if (hasSeenNewsletter) return;

        const timerId = setTimeout(() => {
            if (overlayOpenRef.current) {
                // Another modal is open — mark as pending, show after it closes
                pendingShowRef.current = true;
            } else {
                setIsOpen(true);
            }
        }, 15000);

        return () => clearTimeout(timerId);
    }, []);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent): void => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleClose = (): void => {
        setIsOpen(false);
        setCookie('optimage_newsletter_seen', 'true', { maxAge: 60 * 60 * 24 * 30 }); // 30 days
        localStorage.setItem('optimage_newsletter_seen', 'true'); // backward compatibility
    };

    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setErrorMsg('');
        try {
            const result: NewsletterResult = await subscribeNewsletter(email);

            if (result.error) {
                setStatus('error');
                setErrorMsg(result.error);
                return;
            }

            if (result.alreadySubscribed) {
                setIsAlreadySubscribed(true);
                setStatus('success');
                setTimeout(() => handleClose(), 3000);
            } else {
                setStatus('success');
                setIsAlreadySubscribed(false);
                setTimeout(() => handleClose(), 2500);
            }
        } catch (err: unknown) {
            console.error('Newsletter error:', err instanceof Error ? err.message : 'An unknown error occurred');
            setStatus('error');
            setErrorMsg('An unexpected error occurred.');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={popupRef}
            className="newsletter-popup-card"
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                padding: '24px',
                width: 'min(360px, calc(100vw - 32px))',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(108,92,231,0.15)',
                overflow: 'hidden',
                animation: 'newsletterSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            {/* Decorative glow */}
            <div style={{
                position: 'absolute', top: '-50px', right: '-50px',
                width: '150px', height: '150px',
                background: 'var(--accent-glow)', filter: 'blur(50px)',
                borderRadius: '50%', zIndex: 0, pointerEvents: 'none',
            }} />

            {/* Close button */}
            <button
                onClick={handleClose}
                aria-label="Close newsletter popup"
                style={{
                    position: 'absolute', top: '14px', right: '14px',
                    background: 'var(--bg-tertiary)', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    padding: '6px', borderRadius: '50%', zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
            >
                <X size={16} />
            </button>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                        background: 'var(--gradient-primary)', width: '34px', height: '34px',
                        borderRadius: '10px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', flexShrink: 0,
                    }}>
                        <Sparkles size={17} />
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Join 10k+ Creators</h3>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.55, marginBottom: '16px' }}>
                    Weekly insights on image optimization, performance, and web speed. No spam, ever.
                </p>

                <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={14} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 13px 10px 36px',
                                borderRadius: '10px', border: '1px solid var(--border)',
                                background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                                outline: 'none', fontSize: '0.88rem',
                                boxSizing: 'border-box',
                            }}
                            onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'var(--border)'; }}
                            required
                            disabled={status === 'loading'}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%', padding: '10px', fontSize: '0.88rem',
                            borderRadius: '10px', fontWeight: 600,
                            background: status === 'success' ? 'var(--success)' : '',
                        }}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading'
                            ? 'Subscribing...'
                            : status === 'success'
                                ? (isAlreadySubscribed ? '✨ Already on the list!' : '✓ You are in!')
                                : 'Subscribe Free'
                        }
                    </button>

                    {status === 'error' && (
                        <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center', margin: '2px 0 0' }}>
                            {errorMsg || 'Failed. Try again.'}
                        </p>
                    )}
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '10px', marginBottom: 0 }}>
                    No spam. Unsubscribe any time.
                </p>
            </div>
        </div>
    );
}
