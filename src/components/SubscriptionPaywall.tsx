'use client';

import { useState, useEffect } from 'react';
import { X, Check, Tag, Zap, Image, Film, Mic, Clock, ChevronDown } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { deleteCookie, getCookie } from '@/utils/cookies';
import type { PriceInfo, SubscriptionPlan, UsdPlan, SubscriptionPaywallProps, FormStatus } from '@/types';

const FEATURES: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; label: string }[] = [
    { icon: Image, label: 'All image formats' },
    { icon: Film, label: 'Video compression' },
    { icon: Mic, label: 'AI transcription' },
    { icon: Zap, label: 'Bulk up to 50 files' },
    { icon: Check, label: 'Processing history' },
    { icon: Clock, label: 'Full access period' },
];

export default function SubscriptionPaywall({ onSubscribed, onClose }: SubscriptionPaywallProps): React.JSX.Element {
    // Notify the newsletter popup so it doesn't conflict with this modal
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('optimage:overlay:open'));
        return () => {
            window.dispatchEvent(new CustomEvent('optimage:overlay:close'));
        };
    }, []);

    const [plans, setPlans]               = useState<SubscriptionPlan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string>('1y');
    const [promoCode, setPromoCode]       = useState<string>('');
    const [showPromo, setShowPromo]       = useState<boolean>(false);
    const [promoStatus, setPromoStatus]   = useState<FormStatus>('idle');
    const [pricing, setPricing]           = useState<PriceInfo | null>(null);
    const [checkoutStatus, setCheckoutStatus] = useState<FormStatus>('idle');
    const [error, setError]               = useState<string | null>(null);

    // Currency toggle — auto-detected from geo cookie set by middleware
    // Default to USD; switch to NGN only for Nigeria (NG)
    const [currency, setCurrency]         = useState<'ngn' | 'usd'>(() => {
        const country = getCookie('optimage_country');
        return country === 'NG' ? 'ngn' : 'usd';
    });
    const [usdPlans, setUsdPlans]         = useState<UsdPlan[]>([]);
    const [selectedUsdPlanId, setSelectedUsdPlanId] = useState<string>('1y');

    // Auto-select NGN only for Nigerian visitors (in case the cookie arrives later)
    useEffect(() => {
        const country = getCookie('optimage_country');
        if (country === 'NG') {
            setCurrency('ngn');
        }
    }, []);

    // Load NGN plans on mount
    useEffect(() => {
        apiClient.getPlans().then((loaded) => {
            if (loaded.length > 0) {
                setPlans(loaded);
                // Default to 1y if available, otherwise the last plan
                const defaultPlan = loaded.find((p) => p.id === '1y') ?? loaded[loaded.length - 1] ?? loaded[0];
                if (defaultPlan) setSelectedPlanId(defaultPlan.id);
            }
        }).catch(() => {
            // Fallback so the modal still works if the plans endpoint is temporarily down
            setPlans([{ id: '1y', days: 365, price: 6000, label: '1 Year' }]);
        });
    }, []);

    // Load USD plans on mount
    useEffect(() => {
        apiClient.getUsdPlans().then(setUsdPlans).catch(() => {});
    }, []);

    // Re-fetch price whenever selected plan or promo code changes (after promo is applied)
    useEffect(() => {
        const appliedPromo = pricing?.promoApplied ?? undefined;
        apiClient.getPrice(appliedPromo, selectedPlanId).then(setPricing).catch(() => {
            const plan = plans.find((p) => p.id === selectedPlanId);
            if (plan) {
                setPricing({ originalPrice: plan.price, finalPrice: plan.price, discount: 0, promoApplied: null, planId: plan.id, planLabel: plan.label, durationDays: plan.days });
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPlanId, plans]);

    const handleSelectPlan = (planId: string) => {
        setSelectedPlanId(planId);
        // Re-apply existing promo (if any) to the new plan
        const appliedPromo = pricing?.promoApplied;
        if (appliedPromo) {
            apiClient.getPrice(appliedPromo, planId).then(setPricing).catch(() => {});
        }
    };

    const handleApplyPromo = async (): Promise<void> => {
        if (!promoCode.trim()) return;
        setPromoStatus('loading');
        setError(null);
        try {
            const result = await apiClient.getPrice(promoCode.trim(), selectedPlanId);
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
            const referralCode = getCookie('optimage_referral_code')
                || (typeof window !== 'undefined' ? localStorage.getItem('optimage_referral_code') : null)
                || undefined;

            const result = await apiClient.createSubscriptionCheckout(
                pricing?.promoApplied || undefined,
                referralCode,
                selectedPlanId,
            );

            if (result.authorization_url) {
                if (result.reference.startsWith('free_')) {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('optimage_referral_code');
                    }
                    deleteCookie('optimage_referral_code');
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

    const handleUsdSubscribe = async (): Promise<void> => {
        setCheckoutStatus('loading');
        setError(null);
        try {
            const result = await apiClient.createUsdCheckout(selectedUsdPlanId);
            window.location.href = result.checkoutUrl;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Checkout failed');
            setCheckoutStatus('idle');
        }
    };

    const formatNgnPrice = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency', currency: 'NGN', minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatUsdPrice = (amountInCents: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', minimumFractionDigits: 2,
        }).format(amountInCents / 100);
    };

    const selectedUsdPlan = usdPlans.find((p) => p.id === selectedUsdPlanId);
    const effectiveDuration = currency === 'usd'
        ? (selectedUsdPlan?.label ?? '1 Year')
        : (pricing?.planLabel ?? plans.find((p) => p.id === selectedPlanId)?.label ?? '1 Year');

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
                maxWidth: '460px',
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 32px 64px rgba(0,0,0,0.4), 0 0 80px rgba(108,92,231,0.1)',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
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
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,92,231,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(162,155,254,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', position: 'relative' }}>
                        <img src="/logo.png" alt="Optimage" style={{ height: '2rem', width: 'auto', objectFit: 'contain' }} />
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white', lineHeight: 1.1 }}>Unlock Full Access</div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginTop: '3px' }}>Choose your plan below</div>
                        </div>
                    </div>

                    {/* Price Display */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                        {currency === 'usd' ? (
                            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>
                                {selectedUsdPlan ? formatUsdPrice(selectedUsdPlan.priceUsd) : '...'}
                            </span>
                        ) : (
                            pricing?.discount && pricing.discount > 0 ? (
                                <>
                                    <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>
                                        {formatNgnPrice(pricing.originalPrice)}
                                    </span>
                                    <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>
                                        {formatNgnPrice(pricing.finalPrice)}
                                    </span>
                                </>
                            ) : (
                                <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>
                                    {pricing ? formatNgnPrice(pricing.originalPrice) : '...'}
                                </span>
                            )
                        )}
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                            / {effectiveDuration.toLowerCase()}
                        </span>
                    </div>

                    {currency === 'ngn' && pricing?.promoApplied && (
                        <div style={{
                            marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '5px',
                            background: 'rgba(46,213,115,0.18)', border: '1px solid rgba(46,213,115,0.35)',
                            borderRadius: '100px', padding: '4px 12px', fontSize: '0.78rem', color: '#2ed573',
                        }}>
                            <Check size={11} />
                            &quot;{pricing.promoApplied}&quot; applied — {effectiveDuration} access {pricing.discount > 0 ? `saves ${formatNgnPrice(pricing.discount)}` : 'FREE'}
                        </div>
                    )}
                </div>

                {/* Body */}
                <div
                    className="paywall-scroll"
                    style={{
                        padding: '22px 28px',
                        overflowY: 'auto',
                        flex: 1,
                    }}
                >

                    {/* Currency Toggle */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                        <button
                            onClick={() => setCurrency('ngn')}
                            style={{
                                flex: 1, padding: '9px 14px', borderRadius: '100px', fontWeight: 700,
                                fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s ease',
                                border: '2px solid var(--accent-primary)',
                                background: currency === 'ngn' ? 'var(--gradient-primary)' : 'transparent',
                                color: currency === 'ngn' ? '#fff' : 'var(--text-secondary)',
                            }}
                        >
                            Pay in NGN ₦
                        </button>
                        <button
                            onClick={() => setCurrency('usd')}
                            style={{
                                flex: 1, padding: '9px 14px', borderRadius: '100px', fontWeight: 700,
                                fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s ease',
                                border: '2px solid var(--accent-primary)',
                                background: currency === 'usd' ? 'var(--gradient-primary)' : 'transparent',
                                color: currency === 'usd' ? '#fff' : 'var(--text-secondary)',
                            }}
                        >
                            Pay in USD $
                        </button>
                    </div>

                    {currency === 'usd' ? (
                        <>
                            {/* USD Plan Selector */}
                            {usdPlans.length > 0 ? (
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                        Select Plan
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {usdPlans.map((plan) => {
                                            const isSelected = selectedUsdPlanId === plan.id;
                                            return (
                                                <button
                                                    key={plan.id}
                                                    onClick={() => setSelectedUsdPlanId(plan.id)}
                                                    style={{
                                                        position: 'relative',
                                                        padding: '10px 14px',
                                                        borderRadius: '12px',
                                                        border: isSelected
                                                            ? '2px solid var(--accent-primary)'
                                                            : '2px solid var(--border)',
                                                        background: isSelected
                                                            ? 'rgba(108,92,231,0.12)'
                                                            : 'var(--bg-tertiary)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                        flex: '1 1 auto',
                                                        minWidth: '80px',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {plan.isPopular && (
                                                        <div style={{
                                                            position: 'absolute', top: '-10px', left: '50%',
                                                            transform: 'translateX(-50%)',
                                                            background: 'var(--gradient-primary)',
                                                            color: '#fff', fontSize: '0.6rem', fontWeight: 700,
                                                            padding: '2px 8px', borderRadius: '100px',
                                                            whiteSpace: 'nowrap', letterSpacing: '0.04em',
                                                        }}>
                                                            BEST VALUE
                                                        </div>
                                                    )}
                                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)', marginBottom: '2px' }}>
                                                        {plan.label}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                                                        {formatUsdPrice(plan.priceUsd)}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px', textAlign: 'center' }}>
                                    USD plans are not yet configured. Please use NGN payment or check back later.
                                </p>
                            )}

                            {/* Feature Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                                {FEATURES.map(({ icon: Icon, label }) => {
                                    const usdPlan = usdPlans.find(p => p.id === selectedUsdPlanId);
                                    const usdDuration = usdPlan?.label ?? '1 Year';
                                    return (
                                        <div key={label} style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            padding: '9px 11px', borderRadius: '10px',
                                            background: 'var(--bg-tertiary)',
                                            fontSize: '0.8rem', color: 'var(--text-secondary)',
                                        }}>
                                            <Icon size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                                            {label === 'Full access period' ? `${usdDuration} access` : label}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Error */}
                            {error && (
                                <p style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: '10px', textAlign: 'center' }}>
                                    {error}
                                </p>
                            )}

                            {/* USD CTA Button */}
                            <button
                                onClick={handleUsdSubscribe}
                                disabled={checkoutStatus === 'loading' || usdPlans.length === 0}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '14px', fontWeight: 700 }}
                            >
                                {checkoutStatus === 'loading'
                                    ? 'Redirecting to payment...'
                                    : (() => {
                                        const usdPlan = usdPlans.find(p => p.id === selectedUsdPlanId);
                                        return usdPlan
                                            ? `Subscribe — ${formatUsdPrice(usdPlan.priceUsd)}/${usdPlan.label.toLowerCase()}`
                                            : 'Subscribe';
                                    })()
                                }
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                                Secure checkout via Lemon Squeezy · Prices in USD · Works with any international card
                            </p>
                        </>
                    ) : (
                        <>
                            {/* Plan Selector */}
                            {plans.length > 1 && !pricing?.promoApplied && (
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                        Select Plan
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {plans.map((plan) => {
                                            const isSelected = selectedPlanId === plan.id;
                                            const isPopular = plan.id === '1y';
                                            return (
                                                <button
                                                    key={plan.id}
                                                    onClick={() => handleSelectPlan(plan.id)}
                                                    style={{
                                                        position: 'relative',
                                                        padding: '10px 14px',
                                                        borderRadius: '12px',
                                                        border: isSelected
                                                            ? '2px solid var(--accent-primary)'
                                                            : '2px solid var(--border)',
                                                        background: isSelected
                                                            ? 'rgba(108,92,231,0.12)'
                                                            : 'var(--bg-tertiary)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                        flex: '1 1 auto',
                                                        minWidth: '80px',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {isPopular && (
                                                        <div style={{
                                                            position: 'absolute', top: '-10px', left: '50%',
                                                            transform: 'translateX(-50%)',
                                                            background: 'var(--gradient-primary)',
                                                            color: '#fff', fontSize: '0.6rem', fontWeight: 700,
                                                            padding: '2px 8px', borderRadius: '100px',
                                                            whiteSpace: 'nowrap', letterSpacing: '0.04em',
                                                        }}>
                                                            BEST VALUE
                                                        </div>
                                                    )}
                                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)', marginBottom: '2px' }}>
                                                        {plan.label}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                                                        {formatNgnPrice(plan.price)}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Feature Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                                {FEATURES.map(({ icon: Icon, label }) => (
                                    <div key={label} style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '9px 11px', borderRadius: '10px',
                                        background: 'var(--bg-tertiary)',
                                        fontSize: '0.8rem', color: 'var(--text-secondary)',
                                    }}>
                                        <Icon size={13} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                                        {label === 'Full access period'
                                            ? `${effectiveDuration} access`
                                            : label}
                                    </div>
                                ))}
                            </div>

                            {/* Promo Code — collapsible, hidden when promo already applied */}
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
                                disabled={checkoutStatus === 'loading' || !pricing}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '14px', fontWeight: 700 }}
                            >
                                {checkoutStatus === 'loading'
                                    ? 'Redirecting to payment...'
                                    : pricing?.finalPrice === 0
                                        ? `Activate Free Access (${effectiveDuration})`
                                            : `Subscribe — ${pricing ? formatNgnPrice(pricing.finalPrice) : '...'}/${effectiveDuration.toLowerCase()}`
                                }
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                                Secure checkout via Paystack · Instant activation · Cancel anytime
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
