'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';
import { subscribeNewsletter } from '@/app/actions';
import type { FormStatus, NewsletterResult } from '@/types';

export default function NewsletterPopup(): React.JSX.Element | null {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [status, setStatus] = useState<FormStatus>('idle');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [isAlreadySubscribed, setIsAlreadySubscribed] = useState<boolean>(false);
    const popupRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const hasSeenNewsletter = localStorage.getItem('optimage_newsletter_seen');

        if (!hasSeenNewsletter) {
            const timerId = setTimeout(() => {
                setIsOpen(true);
            }, 15000);

            return () => clearTimeout(timerId);
        }
    }, []);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent): void => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        // Delay adding the listener so the popup opening click doesn't immediately close it
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
        localStorage.setItem('optimage_newsletter_seen', 'true');
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
        <>
            {/* Backdrop — clicking it closes the popup */}
            <div
                style={{
                    position: 'fixed', inset: 0, zIndex: 9998,
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                }}
                onClick={handleClose}
            />

            {/* Popup Card */}
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
                    padding: '28px',
                    width: 'min(380px, calc(100vw - 48px))',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{
                            background: 'var(--gradient-primary)', width: '36px', height: '36px',
                            borderRadius: '10px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: 'white', flexShrink: 0,
                        }}>
                            <Sparkles size={18} />
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Join 10k+ Creators</h3>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
                        Weekly insights on image optimization, lossless math, and Next.js scale pipelines.
                    </p>

                    <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ position: 'relative' }}>
                            <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                placeholder="hello@yourcompany.com"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 14px 12px 40px',
                                    borderRadius: '12px', border: '1px solid var(--border)',
                                    background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                                    outline: 'none', fontSize: '0.9rem',
                                }}
                                onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = 'var(--accent-primary)'}
                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => e.target.style.borderColor = 'var(--border)'}
                                required
                                disabled={status === 'loading'}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                width: '100%', padding: '12px', fontSize: '0.9rem',
                                borderRadius: '12px', fontWeight: 600,
                                background: status === 'success' ? 'var(--success)' : '',
                            }}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Subscribing...' : status === 'success' ? (isAlreadySubscribed ? '✨ Already on the list!' : '✓ Joined!') : 'Subscribe Free'}
                        </button>
                        {status === 'error' && <p style={{ color: '#ef4444', fontSize: '0.82rem', textAlign: 'center', margin: '4px 0 0' }}>{errorMsg || 'Failed. Try again.'}</p>}
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '12px', marginBottom: 0 }}>
                        No spam. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </>
    );
}
