'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { c } from '@/lib/colors';
import type { FormStatus } from '@/types';

const COLS = [
    {
        title: 'Tools',
        links: [
            { label: 'Compress Images', href: '/compress' },
            { label: 'Resize Images',   href: '/resize' },
            { label: 'Convert Format',  href: '/convert' },
            { label: 'Crop Image',      href: '/crop' },
            { label: 'Flip & Rotate',   href: '/rotate' },
        ],
    },
    {
        title: 'More tools',
        links: [
            { label: 'Add Watermark',    href: '/watermark' },
            { label: 'Auto Enhance',     href: '/enhance' },
            { label: 'Remove Metadata',  href: '/metadata' },
            { label: 'Batch Process',    href: '/compress' },
            { label: 'Client Galleries', href: '/dashboard?tab=galleries' },
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
        <footer style={{ background: c.bg, paddingTop: '90px' }}>

            {/* Floating newsletter CTA — pulled up above the footer top edge */}
            <div style={{ maxWidth: '1100px', margin: '-90px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
                <div className="footer-newsletter" style={{
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    borderRadius: '20px',
                    boxShadow: '0 8px 40px rgba(17, 24, 39, 0.09)',
                    padding: '28px 36px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '28px',
                }}>
                    {/* Icon + text */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: c.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Mail size={20} color={c.accent} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: c.text, margin: 0, marginBottom: '3px', whiteSpace: 'nowrap' }}>
                                Stay in the loop
                            </h4>
                            <p style={{ fontSize: '0.82rem', color: c.textSecondary, margin: 0, lineHeight: 1.5, whiteSpace: 'nowrap' }}>
                                Optimization tips, new tools, and format news.
                            </p>
                        </div>
                    </div>

                    {/* Form — expands to fill remaining width */}
                    <form onSubmit={handleSubscribe} className="footer-newsletter-form" style={{ display: 'flex', gap: '10px', flex: 1, minWidth: 0, position: 'relative' }}>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={status === 'loading'}
                            style={{ flex: 1, minWidth: 0, padding: '11px 16px', borderRadius: '10px', border: `1.5px solid ${c.border}`, background: c.bgSubtle, color: c.text, fontSize: '0.88rem', outline: 'none' }}
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '11px 22px', background: status === 'success' ? c.success : c.accent, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition: 'background 0.15s', flexShrink: 0 }}
                            onMouseEnter={e => { if (status !== 'success' && status !== 'loading') (e.currentTarget as HTMLButtonElement).style.background = c.accentDark; }}
                            onMouseLeave={e => { if (status !== 'success' && status !== 'loading') (e.currentTarget as HTMLButtonElement).style.background = c.accent; }}
                        >
                            {status === 'loading' ? '...' : status === 'success' ? (isAlreadySubscribed ? 'Already in!' : 'Done!') : (
                                <>Subscribe <ArrowRight size={14} /></>
                            )}
                        </button>
                        {status === 'error' && (
                            <p style={{ position: 'absolute', bottom: '-22px', left: 0, color: c.error, fontSize: '0.78rem', margin: 0 }}>
                                Something went wrong. Try again.
                            </p>
                        )}
                    </form>
                </div>
            </div>

            {/* Main footer content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px 32px' }}>
                <div className="footer-grid" style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', justifyContent: 'space-between' }}>

                    {/* Branding */}
                    <div className="footer-brand" style={{ flex: '1 1 240px', maxWidth: '320px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '14px', width: 'fit-content' }}>
                            <img src="/logo.png" alt="Optimage" style={{ height: '32px', width: 'auto', display: 'block' }} />
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: c.text, lineHeight: 1 }}>Optimage</span>
                        </Link>
                        <p style={{ color: c.textSecondary, fontSize: '0.85rem', lineHeight: 1.65, maxWidth: '280px' }}>
                            Free image tools for creators, developers and photographers.
                            Built by{' '}
                            <a href="https://dreamintrepid.com" target="_blank" rel="noopener noreferrer"
                                style={{ color: c.accent, textDecoration: 'none', fontWeight: 500 }}>Dream Intrepid Ltd</a>.
                        </p>
                    </div>

                    {/* Link columns */}
                    <div className="footer-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(120px, 1fr))', gap: '32px', flex: '2 1 600px' }}>
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
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: `1px solid ${c.border}`, background: c.bgSubtle }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src="/logo.png" alt="Optimage" style={{ height: '20px', width: 'auto', display: 'block' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: c.text, lineHeight: 1 }}>Optimage</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: c.textMuted }}>
                        © {new Date().getFullYear()} Dream Intrepid Ltd. All rights reserved.
                    </span>
                    <span style={{ fontSize: '0.8rem', color: c.textMuted }}>
                        Made with care for the web.
                    </span>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .footer-cols { grid-template-columns: repeat(3, minmax(110px, 1fr)) !important; }
                    .footer-newsletter { flex-direction: column !important; align-items: stretch !important; gap: 20px !important; }
                    .footer-newsletter > div:first-child { flex-shrink: 1 !important; }
                    .footer-newsletter > div:first-child p,
                    .footer-newsletter > div:first-child h4 { white-space: normal !important; }
                    .footer-newsletter-form { flex: 1 !important; }
                }
                @media (max-width: 600px) {
                    .footer-cols { grid-template-columns: repeat(2, minmax(110px, 1fr)) !important; gap: 28px 20px !important; }
                    .footer-newsletter { padding: 24px !important; border-radius: 16px !important; }
                    .footer-newsletter-form { flex-direction: column !important; }
                    .footer-newsletter-form button { width: 100% !important; justify-content: center !important; }
                }
            `}</style>
        </footer>
    );
}
