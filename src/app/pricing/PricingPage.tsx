'use client';

import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Zap, Image, Film, Mic, Clock, Globe, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { createClient } from '@/utils/supabase/client';
import type { UsdPlan, FormStatus } from '@/types';

const FEATURES = [
    { icon: Image,  label: 'All image formats', sub: 'JPEG, PNG, WebP, AVIF, TIFF, GIF' },
    { icon: Film,   label: 'Video compression', sub: 'H.264 via FFmpeg, with quality control' },
    { icon: Mic,    label: 'AI transcription',  sub: 'Audio and video to text, multi-language' },
    { icon: Zap,    label: 'Bulk processing',   sub: 'Up to 50 files at once, ZIP download' },
    { icon: Clock,  label: 'Processing history', sub: 'Dashboard with full history' },
    { icon: Check,  label: 'Priority support',  sub: 'Email support with real responses' },
];

const FREE_FEATURES = [
    'Single-file image compression',
    'JPEG, PNG, WebP conversion',
    'Up to 3 compressions per session',
    'No account required',
];

function fmtUsd(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
}

export default function PricingPage(): React.JSX.Element {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [usdPlans, setUsdPlans] = useState<UsdPlan[]>([]);
    const [selectedUsdId, setSelectedUsdId] = useState('1y');
    const [usdStatus, setUsdStatus] = useState<FormStatus>('idle');

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => setIsAuthenticated(!!session));
        apiClient.getUsdPlans().then(loaded => {
            setUsdPlans(loaded);
            const def = loaded.find(p => p.id === '1y') ?? loaded[0];
            if (def) setSelectedUsdId(def.id);
        }).catch(() => {});
    }, []);

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

    const selectedUsdPlan = usdPlans.find(p => p.id === selectedUsdId);

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 24px 100px' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '72px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(219,90,66,0.08)', border: '1px solid rgba(219,90,66,0.2)', borderRadius: '20px', padding: '6px 14px', marginBottom: '20px' }}>
                    <Sparkles size={13} color="#db5a42" />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#db5a42', letterSpacing: '0.3px' }}>Simple pricing</span>
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, marginBottom: '18px', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                    One plan. Everything included.
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#374151', maxWidth: '540px', margin: '0 auto', lineHeight: 1.65 }}>
                    No seat limits, no per-file fees, no hidden charges. Full access to every tool for one simple price.
                </p>
            </div>

            {/* Plans grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '860px', margin: '0 auto 80px' }}>

                {/* Free tier */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>Free</h2>
                        <div style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>$0</div>
                        <div style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '6px' }}>No sign-up needed</div>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                        {FREE_FEATURES.map(f => (
                            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#374151' }}>
                                <Check size={15} color="#9ca3af" style={{ marginTop: '2px', flexShrink: 0 }} />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/compress"
                        style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', color: '#111827', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}
                    >
                        Start for free
                    </Link>
                </div>

                {/* Paid tier */}
                <div style={{ background: 'linear-gradient(135deg, rgba(219,90,66,0.06), transparent)', border: '2px solid #db5a42', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#db5a42', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '4px 14px', borderRadius: '20px', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        FULL ACCESS
                    </div>

                    {/* Plan selector */}
                    {usdPlans.length > 1 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            {usdPlans.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedUsdId(p.id)}
                                    style={{
                                        padding: '5px 12px', borderRadius: '8px',
                                        border: `1px solid ${selectedUsdId === p.id ? '#db5a42' : '#e5e7eb'}`,
                                        background: selectedUsdId === p.id ? '#db5a42' : 'transparent',
                                        color: selectedUsdId === p.id ? '#fff' : '#374151',
                                        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', position: 'relative',
                                    }}
                                >
                                    {p.label}
                                    {p.isPopular && <span style={{ position: 'absolute', top: '-8px', right: '-6px', fontSize: '0.55rem', background: '#d97706', color: '#fff', borderRadius: '6px', padding: '1px 4px', fontWeight: 800 }}>BEST</span>}
                                </button>
                            ))}
                        </div>
                    )}

                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
                            {selectedUsdPlan?.label ?? '1 Year'} Plan
                        </h2>
                        <span style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>
                            {selectedUsdPlan ? fmtUsd(selectedUsdPlan.priceUsd) : '...'}
                        </span>
                        <div style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '6px' }}>
                            <Globe size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            Billed via Lemon Squeezy. All major cards accepted.
                            <CreditCard size={11} style={{ marginLeft: '8px', marginRight: '4px', verticalAlign: 'middle' }} />
                            Secure checkout
                        </div>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                        {FEATURES.map(({ icon: Icon, label, sub }) => (
                            <li key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <Icon size={15} color="#db5a42" style={{ marginTop: '3px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{label}</div>
                                    <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{sub}</div>
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
                        {usdStatus === 'loading' ? 'Processing...' : !isAuthenticated ? 'Sign in to subscribe' : 'Subscribe with Lemon Squeezy'}
                    </button>
                </div>
            </div>

            {/* Feature comparison */}
            <div style={{ maxWidth: '860px', margin: '0 auto 80px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ padding: '28px 32px', borderBottom: '1px solid #e5e7eb' }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>What changes when you upgrade</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                    {[
                        { label: 'Image formats', free: '3 formats', paid: 'All 6 formats' },
                        { label: 'Files per session', free: 'Up to 3', paid: 'Up to 50 (bulk)' },
                        { label: 'Video compression', free: 'No', paid: 'Included' },
                        { label: 'AI transcription', free: 'No', paid: 'Included' },
                        { label: 'Processing history', free: 'No', paid: 'Full dashboard' },
                        { label: 'Support', free: 'Community', paid: 'Priority email' },
                    ].map(({ label, free, paid }, i) => (
                        <div key={label} style={{ padding: '16px 24px', borderRight: i % 3 !== 2 ? '1px solid #e5e7eb' : 'none', borderBottom: i < 3 ? '1px solid #e5e7eb' : 'none' }}>
                            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{label}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Free: {free}</span>
                                <span style={{ fontSize: '0.85rem', color: '#db5a42', fontWeight: 700 }}>{paid}</span>
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
                        a: "Yes. If you have a promo code, it will be applied at checkout. Codes like OPT100 give you free access for a set period. You'll get reminder emails before your access expires.",
                    },
                    {
                        q: 'Does the subscription auto-renew?',
                        a: 'Yes, USD plans via Lemon Squeezy renew monthly or yearly depending on the plan you choose. You can cancel anytime from the Lemon Squeezy customer portal before the next billing date.',
                    },
                    {
                        q: 'Can I cancel?',
                        a: "Yes, anytime via the Lemon Squeezy customer portal. Your access continues until the end of the paid period. No questions asked.",
                    },
                    {
                        q: 'Is there a file size limit?',
                        a: 'Images up to 50MB per file. Video files up to 2GB. No per-file fees regardless of size.',
                    },
                    {
                        q: 'What payment methods do you accept?',
                        a: 'All major credit and debit cards are accepted through Lemon Squeezy. PayPal is also supported on some plans.',
                    },
                ].map(({ q, a }) => (
                    <div key={q} style={{ borderBottom: '1px solid #e5e7eb', padding: '20px 0' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px', color: '#111827' }}>{q}</div>
                        <div style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.65 }}>{a}</div>
                    </div>
                ))}
            </div>

            {/* Attribution */}
            <div style={{ textAlign: 'center', marginTop: '64px', paddingTop: '32px', borderTop: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '10px' }}>
                    Optimage is crafted and maintained by
                </p>
                <a
                    href="https://dreamintrepid.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '1.05rem', fontWeight: 700, color: '#db5a42', textDecoration: 'none' }}
                >
                    Dream Intrepid Ltd
                </a>
            </div>
        </div>
    );
}
