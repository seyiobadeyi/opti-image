'use client';

import React, { useState, useEffect } from 'react';
import { Check, Tag, Sparkles, Zap, Image, Film, Mic, Clock, Globe, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';
import { getCookie } from '@/utils/cookies';
import type { PriceInfo, SubscriptionPlan, UsdPlan, FormStatus } from '@/types';

// ── Feature list ──────────────────────────────────────────────────────────────
const FEATURES = [
    { icon: Image,  label: 'All image formats', sub: 'JPEG, PNG, WebP, AVIF, TIFF, GIF' },
    { icon: Film,   label: 'Video compression', sub: 'H.264 via FFmpeg, no quality loss' },
    { icon: Mic,    label: 'AI transcription',  sub: 'Audio & video to text, multi-language' },
    { icon: Zap,    label: 'Bulk processing',   sub: 'Up to 50 files at once, ZIP download' },
    { icon: Clock,  label: 'Processing history',sub: 'Dashboard with full audit trail' },
    { icon: Check,  label: 'Priority support',  sub: 'Email support with real responses' },
];

const FREE_FEATURES = [
    'Single-file image compression',
    'JPEG, PNG, WebP conversion',
    'Up to 3 compressions per session',
    'No account required',
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtNgn(amount: number): string {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
}
function fmtUsd(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PricingPage(): React.JSX.Element {
    const [currency, setCurrency] = useState<'ngn' | 'usd'>(() => {
        if (typeof window === 'undefined') return 'usd';
        return getCookie('optimage_country') === 'NG' ? 'ngn' : 'usd';
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // NGN state
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState('1y');
    const [pricing, setPricing] = useState<PriceInfo | null>(null);
    const [promoCode, setPromoCode] = useState('');
    const [promoStatus, setPromoStatus] = useState<FormStatus>('idle');
    const [checkoutStatus, setCheckoutStatus] = useState<FormStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    // USD state
    const [usdPlans, setUsdPlans] = useState<UsdPlan[]>([]);
    const [selectedUsdId, setSelectedUsdId] = useState('1y');
    const [usdStatus, setUsdStatus] = useState<FormStatus>('idle');

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => setIsAuthenticated(!!session));

        apiClient.getPlans().then(loaded => {
            if (loaded.length > 0) {
                setPlans(loaded);
                const def = loaded.find(p => p.id === '1y') ?? loaded[loaded.length - 1];
                if (def) setSelectedPlanId(def.id);
            }
        }).catch(() => setPlans([{ id: '1y', days: 365, price: 6000, label: '1 Year' }]));

        apiClient.getUsdPlans().then(setUsdPlans).catch(() => {});
    }, []);

    useEffect(() => {
        const applied = pricing?.promoApplied ?? undefined;
        apiClient.getPrice(applied, selectedPlanId).then(setPricing).catch(() => {
            const plan = plans.find(p => p.id === selectedPlanId);
            if (plan) setPricing({ originalPrice: plan.price, finalPrice: plan.price, discount: 0, promoApplied: null, planId: plan.id, planLabel: plan.label, durationDays: plan.days });
        });
    }, [selectedPlanId, plans]);

    const applyPromo = async () => {
        if (!promoCode.trim()) return;
        setPromoStatus('loading');
        setError(null);
        try {
            const result = await apiClient.getPrice(promoCode.trim(), selectedPlanId);
            setPricing(result);
            setPromoStatus(result.promoApplied ? 'success' : 'error');
            if (!result.promoApplied) {
                setError('That promo code isn\'t valid');
                setTimeout(() => { setPromoStatus('idle'); setError(null); }, 3000);
            }
        } catch {
            setPromoStatus('error');
            setError('Could not validate code');
            setTimeout(() => { setPromoStatus('idle'); setError(null); }, 3000);
        }
    };

    const subscribeNgn = async () => {
        if (!isAuthenticated) { window.dispatchEvent(new CustomEvent('open-auth-modal')); return; }
        setCheckoutStatus('loading');
        setError(null);
        try {
            const result = await apiClient.createSubscriptionCheckout(pricing?.promoApplied ?? undefined);
            if (result.authorization_url) window.location.href = result.authorization_url;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Checkout failed');
            setCheckoutStatus('idle');
        }
    };

    const subscribeUsd = async () => {
        if (!isAuthenticated) { window.dispatchEvent(new CustomEvent('open-auth-modal')); return; }
        const plan = usdPlans.find(p => p.id === selectedUsdId);
        if (!plan) return;
        setUsdStatus('loading');
        try {
            const result = await apiClient.createUsdCheckout(plan.id);
            if (result?.checkoutUrl) window.location.href = result.checkoutUrl;
        } catch {
            setUsdStatus('idle');
        }
    };

    const selectedNgnPlan = plans.find(p => p.id === selectedPlanId);
    const selectedUsdPlan = usdPlans.find(p => p.id === selectedUsdId);

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 24px 100px' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '72px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(109,40,217,0.12)', border: '1px solid rgba(109,40,217,0.25)', borderRadius: '20px', padding: '6px 14px', marginBottom: '20px' }}>
                    <Sparkles size={13} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.3px' }}>Simple pricing</span>
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, marginBottom: '18px', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                    One plan. Everything included.
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.65 }}>
                    No seat limits, no per-file fees, no hidden charges. Pick your currency and get full access to every tool.
                </p>

                {/* Currency toggle */}
                <div style={{ display: 'inline-flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', gap: '4px', marginTop: '32px' }}>
                    <button
                        onClick={() => setCurrency('ngn')}
                        style={{
                            padding: '8px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                            background: currency === 'ngn' ? 'var(--accent-primary)' : 'transparent',
                            color: currency === 'ngn' ? '#fff' : 'var(--text-secondary)',
                            fontSize: '0.88rem', fontWeight: 700, transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                    >
                        🇳🇬 Pay in Naira
                    </button>
                    <button
                        onClick={() => setCurrency('usd')}
                        style={{
                            padding: '8px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                            background: currency === 'usd' ? 'var(--accent-primary)' : 'transparent',
                            color: currency === 'usd' ? '#fff' : 'var(--text-secondary)',
                            fontSize: '0.88rem', fontWeight: 700, transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                    >
                        <Globe size={14} /> Pay in USD
                    </button>
                </div>
            </div>

            {/* Plans grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '860px', margin: '0 auto 80px' }}>

                {/* Free tier */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>Free</h2>
                        <div style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>₦0</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>No sign-up needed</div>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                        {FREE_FEATURES.map(f => (
                            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <Check size={15} color="var(--text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/dashboard"
                        style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}
                    >
                        Start for free
                    </Link>
                </div>

                {/* Paid tier — NGN */}
                {currency === 'ngn' && (
                    <div style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.08), transparent)', border: '2px solid var(--accent-primary)', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '4px 14px', borderRadius: '20px', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                            <Sparkles size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />FULL ACCESS
                        </div>

                        {/* Plan selector */}
                        {plans.length > 1 && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                {plans.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPlanId(p.id)}
                                        style={{
                                            padding: '5px 12px', borderRadius: '8px', border: `1px solid ${selectedPlanId === p.id ? 'var(--accent-primary)' : 'var(--border)'}`,
                                            background: selectedPlanId === p.id ? 'var(--accent-primary)' : 'transparent',
                                            color: selectedPlanId === p.id ? '#fff' : 'var(--text-secondary)',
                                            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                                        }}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
                                {selectedNgnPlan?.label ?? '1 Year'} Plan
                            </h2>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                {pricing?.discount && pricing.discount > 0 ? (
                                    <>
                                        <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                            {fmtNgn(pricing.originalPrice)}
                                        </span>
                                        <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--accent-primary)', lineHeight: 1 }}>
                                            {fmtNgn(pricing.finalPrice)}
                                        </span>
                                    </>
                                ) : (
                                    <span style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>
                                        {pricing ? fmtNgn(pricing.originalPrice) : '₦6,000'}
                                    </span>
                                )}
                            </div>
                            {pricing?.promoApplied && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', color: 'var(--success)', fontSize: '0.82rem', fontWeight: 600 }}>
                                    <Check size={13} /> Code "{pricing.promoApplied}" applied — saves {fmtNgn(pricing.discount)}
                                </div>
                            )}
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                                <CreditCard size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                Pay once via Paystack · Secure card processing
                            </div>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            {FEATURES.map(({ icon: Icon, label, sub }) => (
                                <li key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <Icon size={15} color="var(--accent-primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sub}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Promo code */}
                        {!pricing?.promoApplied && (
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <Tag size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        placeholder="Promo code"
                                        value={promoCode}
                                        onChange={e => setPromoCode(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && applyPromo()}
                                        disabled={promoStatus === 'loading'}
                                        style={{ width: '100%', padding: '9px 10px 9px 30px', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.83rem', outline: 'none', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <button
                                    onClick={applyPromo}
                                    disabled={promoStatus === 'loading' || !promoCode.trim()}
                                    style={{ padding: '9px 14px', borderRadius: '9px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >
                                    {promoStatus === 'loading' ? '...' : 'Apply'}
                                </button>
                            </div>
                        )}
                        {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '10px' }}>{error}</p>}

                        <button
                            className="btn btn-primary"
                            onClick={subscribeNgn}
                            disabled={checkoutStatus === 'loading'}
                            style={{ width: '100%', padding: '13px', fontSize: '0.95rem' }}
                        >
                            {checkoutStatus === 'loading' ? 'Processing…' : !isAuthenticated ? 'Sign in to subscribe' : pricing?.finalPrice === 0 ? '🎉 Activate Free Access' : 'Subscribe with Paystack'}
                        </button>
                    </div>
                )}

                {/* Paid tier — USD */}
                {currency === 'usd' && (
                    <div style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.08), transparent)', border: '2px solid var(--accent-primary)', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '4px 14px', borderRadius: '20px', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                            <Sparkles size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />FULL ACCESS
                        </div>

                        {/* Plan selector */}
                        {usdPlans.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                {usdPlans.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedUsdId(p.id)}
                                        style={{
                                            padding: '5px 12px', borderRadius: '8px', border: `1px solid ${selectedUsdId === p.id ? 'var(--accent-primary)' : 'var(--border)'}`,
                                            background: selectedUsdId === p.id ? 'var(--accent-primary)' : 'transparent',
                                            color: selectedUsdId === p.id ? '#fff' : 'var(--text-secondary)',
                                            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', position: 'relative',
                                        }}
                                    >
                                        {p.label}
                                        {p.isPopular && <span style={{ position: 'absolute', top: '-8px', right: '-6px', fontSize: '0.55rem', background: '#f59e0b', color: '#000', borderRadius: '6px', padding: '1px 4px', fontWeight: 800 }}>HOT</span>}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
                                {selectedUsdPlan?.label ?? '1 Year'} Plan
                            </h2>
                            <span style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>
                                {selectedUsdPlan ? fmtUsd(selectedUsdPlan.priceUsd) : '$—'}
                            </span>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                                <Globe size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                Billed via Lemon Squeezy · All major cards accepted
                            </div>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                            {FEATURES.map(({ icon: Icon, label, sub }) => (
                                <li key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <Icon size={15} color="var(--accent-primary)" style={{ marginTop: '3px', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sub}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <button
                            className="btn btn-primary"
                            onClick={subscribeUsd}
                            disabled={usdStatus === 'loading' || usdPlans.length === 0}
                            style={{ width: '100%', padding: '13px', fontSize: '0.95rem' }}
                        >
                            {usdStatus === 'loading' ? 'Processing…' : !isAuthenticated ? 'Sign in to subscribe' : `Subscribe with Lemon Squeezy`}
                        </button>
                    </div>
                )}
            </div>

            {/* Feature comparison row */}
            <div style={{ maxWidth: '860px', margin: '0 auto 80px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ padding: '28px 32px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>What's included in the paid plan</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0' }}>
                    {[
                        { label: 'Image formats', free: '3 formats', paid: 'All 6 formats' },
                        { label: 'Files per session', free: 'Up to 3', paid: 'Up to 50 (bulk)' },
                        { label: 'Video compression', free: '—', paid: '✓ Included' },
                        { label: 'AI transcription', free: '—', paid: '✓ Included' },
                        { label: 'Processing history', free: '—', paid: '✓ Dashboard' },
                        { label: 'Support', free: 'Community', paid: 'Priority email' },
                    ].map(({ label, free, paid }, i) => (
                        <div key={label} style={{ padding: '16px 24px', borderRight: i % 3 !== 2 ? '1px solid var(--border)' : 'none', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{label}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Free: {free}</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700 }}>{paid}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '32px', textAlign: 'center' }}>Common questions</h2>
                {[
                    {
                        q: 'Can I use a promo code?',
                        a: 'Yes. Enter it in the promo field above. Codes like OPT100 give you free access for a set period. When that period ends, you\'ll get reminder emails and can subscribe to continue.',
                    },
                    {
                        q: 'Does the subscription auto-renew?',
                        a: 'For USD plans via Lemon Squeezy — yes, monthly/yearly auto-renewal. For NGN plans via Paystack — currently one-time payment for the selected period. You\'ll get reminders before your access expires.',
                    },
                    {
                        q: 'What happens to my files?',
                        a: 'Nothing is kept. The moment you download your files, they\'re purged from our servers. Zero retention, no exceptions.',
                    },
                    {
                        q: 'Can I cancel?',
                        a: 'Yes, anytime via Lemon Squeezy\'s customer portal. Your access runs until the end of the paid period. No questions asked.',
                    },
                    {
                        q: 'Is there a limit on file size?',
                        a: 'Images up to 50MB per file. Video files up to 2GB. No per-file fees regardless of size.',
                    },
                ].map(({ q, a }) => (
                    <div key={q} style={{ borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{q}</div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{a}</div>
                    </div>
                ))}
            </div>

            {/* Dream Intrepid attribution */}
            <div style={{ textAlign: 'center', marginTop: '64px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Optimage is crafted and maintained by
                </p>
                <a
                    href="https://dreamintrepid.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '1.05rem', fontWeight: 700, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textDecoration: 'none' }}
                >
                    Dream Intrepid Ltd — Building professional digital tools
                </a>
            </div>
        </div>
    );
}
