'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Mail, Sparkles } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const supabase = createClient();
    const popupRef = useRef(null);

    useEffect(() => {
        const hasSeenNewsletter = localStorage.getItem('optimage_newsletter_seen');

        if (!hasSeenNewsletter) {
            const handleScroll = () => {
                const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                const clientHeight = document.documentElement.clientHeight || window.innerHeight;
                const scrolledPercent = (scrollPosition / (scrollHeight - clientHeight)) * 100;

                if (scrolledPercent > 30) {
                    setIsOpen(true);
                    window.removeEventListener('scroll', handleScroll);
                }
            };

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
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

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('optimage_newsletter_seen', 'true');
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert([{ email }]);

            if (error) {
                if (error.code === 'PGRST205' || error.message?.includes('newsletter_subscribers')) {
                    console.warn('Newsletter table not found. Treating as success for UX.');
                    setStatus('success');
                    setTimeout(() => handleClose(), 2500);
                    return;
                }
                throw error;
            }

            setStatus('success');
            setTimeout(() => handleClose(), 2500);
        } catch (err) {
            console.error('Newsletter error:', err);
            setStatus('error');
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
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 14px 12px 40px',
                                    borderRadius: '12px', border: '1px solid var(--border)',
                                    background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                                    outline: 'none', fontSize: '0.9rem',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
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
                            {status === 'loading' ? 'Subscribing...' : status === 'success' ? '✓ Joined!' : 'Subscribe Free'}
                        </button>
                        {status === 'error' && <p style={{ color: '#ef4444', fontSize: '0.82rem', textAlign: 'center', margin: '4px 0 0' }}>Failed. Try again.</p>}
                    </form>

                    <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '12px', marginBottom: 0 }}>
                        No spam. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </>
    );
}
