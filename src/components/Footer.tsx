'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { c } from '@/lib/colors';
import type { FormStatus } from '@/types';

const COLS = [
    {
        title: 'Product',
        links: [
            { label: 'Compress Images',  href: '/compress' },
            { label: 'Convert Format',   href: '/convert' },
            { label: 'Resize Images',    href: '/resize' },
            { label: 'Client Galleries', href: '/dashboard?tab=galleries' },
            { label: 'Pricing',          href: '/pricing' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'Blog',         href: '/blog' },
            { label: 'Galleries',    href: '/galleries' },
            { label: 'How it works', href: '/how-it-works' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About',   href: '/about' },
            { label: 'Contact', href: '/contact' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Use',   href: '/terms' },
        ],
    },
];

export default function Footer(): React.JSX.Element {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<FormStatus>('idle');
    const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);

    const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error((err as { message?: string }).message ?? 'Subscription failed');
            }
            const data: { alreadySubscribed?: boolean } = await res.json();
            setIsAlreadySubscribed(!!data.alreadySubscribed);
            setStatus('success');
            setEmail('');
            setTimeout(() => { setStatus('idle'); setIsAlreadySubscribed(false); }, 4000);
        } catch (err: unknown) {
            console.error('Newsletter error:', err instanceof Error ? err.message : 'Unknown error');
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <footer style={{ background: c.bg, borderTop: `1px solid ${c.border}` }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 0' }}>

                {/* Top: branding + newsletter */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap', marginBottom: '48px' }}>

                    {/* Branding */}
                    <div style={{ flex: '1 1 280px', minWidth: '220px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '12px', width: 'fit-content' }}>
                            <img src="/logo.png" alt="Optimage" style={{ height: '28px', width: 'auto' }} />
                            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: c.text }}>Optimage</span>
                        </Link>
                        <p style={{ color: c.textSecondary, fontSize: '0.85rem', lineHeight: 1.65, maxWidth: '300px' }}>
                            Free image tools for creators, developers and photographers.
                            Built by{' '}
                            <a href="https://dreamintrepid.com" target="_blank" rel="noopener noreferrer"
                                style={{ color: c.accent, textDecoration: 'none', fontWeight: 500 }}>Dream Intrepid Ltd</a>.
                        </p>
                    </div>

                    {/* Newsletter */}
                    <div style={{ flex: '1 1 300px', maxWidth: '380px', background: c.bgSubtle, padding: '24px', borderRadius: '14px', border: `1px solid ${c.border}` }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, color: c.text, marginBottom: '8px' }}>
                            <Mail size={15} color={c.accent} /> Newsletter
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: c.textSecondary, marginBottom: '12px', lineHeight: 1.5 }}>
                            Optimization tips, new tools, and AVIF codec news.
                        </p>
                        <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                disabled={status === 'loading'}
                                style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: `1.5px solid ${c.border}`, background: c.bg, color: c.text, fontSize: '0.85rem', outline: 'none', minWidth: 0 }}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                style={{ padding: '9px 16px', background: status === 'success' ? c.success : c.accent, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition: 'background 0.15s', flexShrink: 0 }}
                                onMouseEnter={e => { if (status !== 'success' && status !== 'loading') (e.currentTarget as HTMLButtonElement).style.background = c.accentDark; }}
                                onMouseLeave={e => { if (status !== 'success' && status !== 'loading') (e.currentTarget as HTMLButtonElement).style.background = c.accent; }}
                            >
                                {status === 'loading' ? '...' : status === 'success' ? (isAlreadySubscribed ? 'Already in!' : 'Done!') : 'Subscribe'}
                            </button>
                        </form>
                        {status === 'error' && <p style={{ color: c.error, fontSize: '0.78rem', marginTop: '6px' }}>Something went wrong. Try again.</p>}
                    </div>
                </div>

                {/* Link columns */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '32px 24px', marginBottom: '40px' }}>
                    {COLS.map(col => (
                        <div key={col.title}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: c.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
                                {col.title}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {col.links.map(link => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        style={{ color: c.textSecondary, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 400, transition: 'color 0.12s' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = c.accent; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = c.textSecondary; }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: `1px solid ${c.border}`, background: c.bgSubtle }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: c.textMuted }}>
                        © {new Date().getFullYear()} Dream Intrepid Ltd. All rights reserved.
                    </span>
                    <span style={{ fontSize: '0.8rem', color: c.textMuted }}>
                        Made with care for the web.
                    </span>
                </div>
            </div>
        </footer>
    );
}
