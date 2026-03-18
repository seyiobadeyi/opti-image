'use client';

import React, { useState, useEffect } from 'react';
import { Check, Tag, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';
import type { PriceInfo, FormStatus } from '@/types';

export default function PricingTiers(): React.JSX.Element {
    const [pricing, setPricing] = useState<PriceInfo | null>(null);
    const [promoCode, setPromoCode] = useState<string>('');
    const [promoStatus, setPromoStatus] = useState<FormStatus>('idle');
    const [checkoutStatus, setCheckoutStatus] = useState<FormStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        apiClient.getPrice().then(setPricing).catch(() => {
            setPricing({ originalPrice: 6000, finalPrice: 6000, discount: 0, promoApplied: null, planId: '1y', planLabel: '1 Year', durationDays: 365 });
        });

        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
        });
    }, []);

    const handleApplyPromo = async (): Promise<void> => {
        if (!promoCode.trim()) return;
        setPromoStatus('loading');
        setError(null);

        try {
            const result = await apiClient.getPrice(promoCode.trim());
            setPricing(result);
            setPromoStatus(result.promoApplied ? 'success' : 'error');
            if (!result.promoApplied) {
                setError('Invalid promo code');
                setTimeout(() => { setPromoStatus('idle'); setError(null); }, 3000);
            }
        } catch {
            setPromoStatus('error');
            setError('Failed to validate promo code');
            setTimeout(() => { setPromoStatus('idle'); setError(null); }, 3000);
        }
    };

    const handleSubscribe = async (): Promise<void> => {
        if (!isAuthenticated) {
            window.dispatchEvent(new CustomEvent('open-auth-modal'));
            return;
        }

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
                window.location.href = result.authorization_url;
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

    const features = [
        'All image formats (JPEG, PNG, WebP, AVIF, TIFF, GIF)',
        'Bulk processing — up to 50 files per batch',
        'Video compression with FFmpeg',
        'Audio extraction from video',
        'AI-powered transcription & translation',
        'Full processing history & dashboard',
        'Priority email support',
    ];

    return (
        <section id="pricing" className="pricing-section" style={{ margin: '80px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Simple, Transparent Pricing</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    One plan. Everything included. No limits on processing.
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="pricing-card popular" style={{ maxWidth: '440px', width: '100%' }}>
                    <div className="popular-badge">
                        <Sparkles size={14} style={{ marginRight: '4px' }} /> Full Access
                    </div>

                    <div className="pricing-header">
                        <h3>Yearly Plan</h3>
                        <div className="price">
                            {pricing?.discount && pricing.discount > 0 ? (
                                <>
                                    <span style={{
                                        fontSize: '1.2rem',
                                        color: 'var(--text-muted)',
                                        textDecoration: 'line-through',
                                        marginRight: '8px',
                                    }}>
                                        {formatPrice(pricing.originalPrice)}
                                    </span>
                                    <span className="amount">{formatPrice(pricing.finalPrice)}</span>
                                </>
                            ) : (
                                <span className="amount">
                                    {pricing ? formatPrice(pricing.originalPrice) : '₦6,000'}
                                </span>
                            )}
                            <span className="period">/year</span>
                        </div>
                        {pricing?.promoApplied && (
                            <p style={{
                                color: 'var(--success)',
                                fontSize: '0.85rem',
                                marginTop: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                            }}>
                                <Check size={14} />
                                Code &quot;{pricing.promoApplied}&quot; applied — save {formatPrice(pricing.discount)}
                            </p>
                        )}
                        <p className="description">
                            Everything you need for professional media optimization. Process images, videos, and audio without limits.
                        </p>
                    </div>

                    <ul className="pricing-features">
                        {features.map((feature) => (
                            <li key={feature} className="included">
                                <Check size={18} className="icon-check" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Promo Code Input */}
                    {!pricing?.promoApplied && (
                        <div style={{ padding: '0 0 16px', display: 'flex', gap: '8px' }}>
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
                                    placeholder="Have a promo code?"
                                    value={promoCode}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value)}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (e.key === 'Enter') { e.preventDefault(); handleApplyPromo(); }
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
                                style={{ padding: '10px 16px', fontSize: '0.85rem', borderRadius: '10px', whiteSpace: 'nowrap' }}
                            >
                                {promoStatus === 'loading' ? '...' : 'Apply'}
                            </button>
                        </div>
                    )}

                    {error && (
                        <p style={{ color: '#ef4444', fontSize: '0.82rem', textAlign: 'center', marginBottom: '12px' }}>
                            {error}
                        </p>
                    )}

                    <div className="pricing-footer">
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={handleSubscribe}
                            disabled={checkoutStatus === 'loading'}
                        >
                            {checkoutStatus === 'loading'
                                ? 'Processing...'
                                : !isAuthenticated
                                    ? 'Sign In to Subscribe'
                                    : pricing?.finalPrice === 0
                                        ? 'Activate Free Access'
                                        : 'Subscribe Now'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
