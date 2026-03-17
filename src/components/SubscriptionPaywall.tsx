'use client';

import { useState, useEffect } from 'react';
import { X, Check, Tag, Zap, Image, Film, Mic, Clock, ChevronDown } from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { PriceInfo, SubscriptionPaywallProps, FormStatus } from '@/types';

const FEATURES: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; label: string }[] = [
    { icon: Image, label: 'All image formats' },
    { icon: Film, label: 'Video compression' },
    { icon: Mic, label: 'AI transcription' },
    { icon: Zap, label: 'Bulk up to 50 files' },
    { icon: Check, label: 'Processing history' },
    { icon: Clock, label: '1 full year access' },
];

export default function SubscriptionPaywall({ onSubscribed, onClose }: SubscriptionPaywallProps): React.JSX.Element {
    // Notify the newsletter popup so it doesn't conflict with this modal
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('optimage:overlay:open'));
        return () => {
            window.dispatchEvent(new CustomEvent('optimage:overlay:close'));
        };
    }, []);

    const [promoCode, setPromoCode] = useState<string>('');
    const [showPromo, setShowPromo] = useState<boolean>(false);
    const [promoStatus, setPromoStatus] = useState<FormStatus>('idle');
    const [pricing, setPricing] = useState<PriceInfo | null>(null);
    const [checkoutStatus, setCheckoutStatus] = useState<FormStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiClient.getPrice().then(setPricing).catch(() => {
            setPricing({ originalPrice: 6000, finalPrice: 6000, discount: 0, promoApplied: null });
        });
    }, []);

    const handleApplyPromo = async (): Promise<void> => {
        if (!promoCode.trim()) return;
        setPromoStatus('loading');
        setError(null);
        try {
            const result = await apiClient.getPrice(promoCode.trim());
            setPricing(result);
            if (result.promoApplied) {
                setPromoStatus('success');
            } else {
                setPromoStatus('error');
                setError('Invalid promo code');
                setTimeout(() => setPromoStatus('idle'), 3000);
            }
        } catch {
            setPromoStatus('error');
            setError('Failed to validate promo code');
            setTimeout(() => setPromoStatus('idle'), 3000);
        }
    };

    const handleSubscribe = async (): Promise<void> => {
        setCheckoutStatus('loading');
        setError(null);
        try {
            const referralCode = typeof window !== 'undefined'
                ? localStorage.getItem('optimage_referral_code') || undefined
                : undefined;

            const result = await apiClient.createSubscriptionCheckout(
                pricing?.promoApplied || undefined,
                referralCode,
            );

            if (result.authorization_url) {
                if (result.reference.startsWith('free_')) {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('optimage_referral_code');
                    }
                    onSubscribed?.();
                    window.location.href = result.authorization_url;
                } else {
                    window.location.href = result.authorization_url;
                }
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Checkout failed';
            setError(message);
            setCheckoutStatus('idle');
        }
    };

    const formatPrice = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency', currency: 'NGN', minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
                padding: '20px',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
        >
            <div style={{
                background: 'var(--bg-card)',
                borderRadius: '24px',
                border: '1px solid rgba(108,92,231,0.3)',
                maxWidth: '420px',
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 32px 64px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.1)',
            }}>
                {/* Close Button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: '14px', right: '14px', zIndex: 10,
                            background: 'rgba(255,255,255,0.1)', border: 'none',
                            cursor: 'pointer', color: 'white', padding: '6px',
                            borderRadius: '50%', display: 'flex', alignItems: 'center',
                        }}
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Gradient Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1a0a3a 0%, #2d1b69 50%, #1a0a3a 100%)',
                    padding: '28px 28px 22px',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Background glow orb */}
                    <div style={{
                        position: 'absolute', top: '-50px', right: '-50px',
                        width: '200px', height: '200px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(108,92,231,0.35) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-30px', left: '-30px',
                        width: '140px', height: '140px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(162,155,254,0.2) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', position: 'relative' }}>
                        <img src="/logo.png" alt="Optimage" style={{ height: '2rem', width: 'auto', objectFit: 'contain' }} />
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white', lineHeight: 1.1 }}>Unlock Full Access</div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginTop: '3px' }}>Everything, one plan, one year</div>
                        </div>
                    </div>

                    {/* Price Display */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                        {pricing?.discount && pricing.discount > 0 ? (
                            <>
                                <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>
                                    {formatPrice(pricing.originalPrice)}
                                </span>
                                <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>
                                    {formatPrice(pricing.finalPrice)}
                                </span>
                            </>
                        ) : (
                            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>
                                {pricing ? formatPrice(pricing.originalPrice) : '₦6,000'}
                            </span>
                        )}
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>/ year</span>
                    </div>

                    {pricing?.promoApplied && (
                        <div style={{
                            marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '5px',
                            background: 'rgba(46,213,115,0.18)', border: '1px solid rgba(46,213,115,0.35)',
                            borderRadius: '100px', padding: '4px 12px', fontSize: '0.78rem', color: '#2ed573',
                        }}>
                            <Check size={11} />
                            &quot;{pricing.promoApplied}&quot; applied — saves {formatPrice(pricing.discount)}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div style={{ padding: '22px 28px' }}>
                    {/* Feature Grid — 2 columns */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                        {FEATURES.map(({ icon: Icon, label }) => (
                            <div key={label} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '9px 11px', borderRadius: '10px',
                                background: 'var(--bg-tertiary)',
                                fontSize: '0.8rem', color: 'var(--text-secondary)',
                            }}>
                                <Icon size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                                {label}
                            </div>
                        ))}
                    </div>

                    {/* Promo Code — collapsible */}
                    {!pricing?.promoApplied && (
                        <div style={{ marginBottom: '16px' }}>
                            {!showPromo ? (
                                <button
                                    onClick={() => setShowPromo(true)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'var(--text-muted)', fontSize: '0.8rem',
                                        display: 'flex', alignItems: 'center', gap: '5px', padding: 0,
                                    }}
                                >
                                    <Tag size={12} /> Have a promo code? <ChevronDown size={12} />
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <Tag size={13} style={{
                                            position: 'absolute', left: '11px', top: '50%',
                                            transform: 'translateY(-50%)', color: 'var(--text-muted)',
                                        }} />
                                        <input
                                            type="text"
                                            placeholder="Promo code"
                                            value={promoCode}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)}
                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                if (e.key === 'Enter') { e.preventDefault(); handleApplyPromo(); }
                                            }}
                                            autoFocus
                                            style={{
                                                width: '100%', padding: '9px 11px 9px 32px',
                                                borderRadius: '10px', border: '1px solid var(--border)',
                                                background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                                                fontSize: '0.85rem', outline: 'none',
                                            }}
                                            disabled={promoStatus === 'loading'}
                                        />
                                    </div>
                                    <button
                                        onClick={handleApplyPromo}
                                        disabled={promoStatus === 'loading' || !promoCode.trim()}
                                        className="btn btn-secondary"
                                        style={{ padding: '9px 14px', fontSize: '0.82rem', borderRadius: '10px', whiteSpace: 'nowrap' }}
                                    >
                                        {promoStatus === 'loading' ? '...' : 'Apply'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <p style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: '10px', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    {/* CTA Button */}
                    <button
                        onClick={handleSubscribe}
                        disabled={checkoutStatus === 'loading'}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '14px', fontWeight: 700 }}
                    >
                        {checkoutStatus === 'loading'
                            ? 'Redirecting to payment...'
                            : pricing?.finalPrice === 0
                                ? '🎉 Activate Free Access'
                                : `Subscribe — ${pricing ? formatPrice(pricing.finalPrice) : '₦6,000'}/year`
                        }
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                        Secure checkout via Paystack · Instant activation
                    </p>
                </div>
            </div>
        </div>
    );
}
