'use client';

import { useState, useEffect } from 'react';
import { X, Check, Tag, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { PriceInfo, SubscriptionPaywallProps, FormStatus } from '@/types';

export default function SubscriptionPaywall({ onSubscribed, onClose }: SubscriptionPaywallProps): React.JSX.Element {
    const [promoCode, setPromoCode] = useState<string>('');
    const [promoStatus, setPromoStatus] = useState<FormStatus>('idle');
    const [pricing, setPricing] = useState<PriceInfo | null>(null);
    const [checkoutStatus, setCheckoutStatus] = useState<FormStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    // Load base price on mount
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
            // Retrieve referral code from localStorage if present
            const referralCode = typeof window !== 'undefined'
                ? localStorage.getItem('optimage_referral_code') || undefined
                : undefined;

            const result = await apiClient.createSubscriptionCheckout(
                pricing?.promoApplied || undefined,
                referralCode,
            );

            if (result.authorization_url) {
                // For free promo codes, the URL points to dashboard
                if (result.reference.startsWith('free_')) {
                    // Clean up referral code
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('optimage_referral_code');
                    }
                    onSubscribed?.();
                    window.location.href = result.authorization_url;
                } else {
                    // Redirect to Paystack
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
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            padding: '20px',
        }} onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
            <div style={{
                background: 'var(--bg-card)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                padding: '40px 32px',
                maxWidth: '440px',
                width: '100%',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}>
                {/* Close button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '4px',
                        }}
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}>
                        <Sparkles size={28} color="#fff" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
                        Unlock Full Access
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        Subscribe to process images, compress videos, and transcribe media — unlimited for a whole year.
                    </p>
                </div>

                {/* Price */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    padding: '20px',
                    borderRadius: '12px',
                    background: 'var(--bg-tertiary)',
                }}>
                    {pricing?.discount && pricing.discount > 0 ? (
                        <>
                            <span style={{
                                fontSize: '1rem',
                                color: 'var(--text-muted)',
                                textDecoration: 'line-through',
                                marginRight: '8px',
                            }}>
                                {formatPrice(pricing.originalPrice)}
                            </span>
                            <span style={{
                                fontSize: '2rem',
                                fontWeight: 800,
                                background: 'var(--gradient-primary)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                {formatPrice(pricing.finalPrice)}
                            </span>
                        </>
                    ) : (
                        <span style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            {pricing ? formatPrice(pricing.originalPrice) : '₦6,000'}
                        </span>
                    )}
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}> / year</span>
                    {pricing?.promoApplied && (
                        <div style={{
                            marginTop: '8px',
                            fontSize: '0.8rem',
                            color: 'var(--success)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                        }}>
                            <Check size={14} />
                            Promo &quot;{pricing.promoApplied}&quot; applied — you save {formatPrice(pricing.discount)}
                        </div>
                    )}
                </div>

                {/* Features */}
                <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 24px',
                    display: 'grid',
                    gap: '10px',
                }}>
                    {[
                        'All image formats (JPEG, PNG, WebP, AVIF, TIFF, GIF)',
                        'Bulk processing up to 50 files',
                        'Video compression & audio extraction',
                        'AI-powered transcription',
                        'Full processing history',
                    ].map((feature) => (
                        <li key={feature} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '0.85rem',
                            color: 'var(--text-secondary)',
                        }}>
                            <Check size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* Promo Code */}
                {!pricing?.promoApplied && (
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                        }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <Tag size={14} style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)',
                                }} />
                                <input
                                    type="text"
                                    placeholder="Promo code"
                                    value={promoCode}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleApplyPromo();
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px 10px 34px',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border)',
                                        background: 'var(--bg-tertiary)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.85rem',
                                        outline: 'none',
                                    }}
                                    disabled={promoStatus === 'loading'}
                                />
                            </div>
                            <button
                                onClick={handleApplyPromo}
                                disabled={promoStatus === 'loading' || !promoCode.trim()}
                                className="btn btn-secondary"
                                style={{
                                    padding: '10px 16px',
                                    fontSize: '0.85rem',
                                    borderRadius: '10px',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {promoStatus === 'loading' ? '...' : 'Apply'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p style={{
                        color: '#ef4444',
                        fontSize: '0.82rem',
                        textAlign: 'center',
                        marginBottom: '12px',
                    }}>
                        {error}
                    </p>
                )}

                {/* Subscribe Button */}
                <button
                    onClick={handleSubscribe}
                    disabled={checkoutStatus === 'loading'}
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        padding: '14px',
                        fontSize: '1rem',
                        borderRadius: '12px',
                        fontWeight: 700,
                    }}
                >
                    {checkoutStatus === 'loading'
                        ? 'Processing...'
                        : pricing?.finalPrice === 0
                            ? 'Activate Free Access'
                            : `Subscribe Now — ${pricing ? formatPrice(pricing.finalPrice) : '₦6,000'}/year`
                    }
                </button>
            </div>
        </div>
    );
}
