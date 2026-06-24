import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Photo Editor - Coming Soon',
    description: 'Fine-tune brightness, contrast, saturation and apply filters to any image. Coming soon to Optimage.',
    alternates: { canonical: '/editor' },
};

const clr = { accent: '#db5a42', accentLt: '#fdf3f1', g200: '#e5e7eb', g400: '#9ca3af', g700: '#374151', g900: '#111827' };

export default function EditorPage(): React.JSX.Element {
    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: clr.g900 }}>
            <Header />

            <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: clr.accentLt, border: `1px solid rgba(219,90,66,0.2)`, borderRadius: '999px', padding: '6px 16px', fontSize: '0.82rem', fontWeight: 600, color: clr.accent, marginBottom: '28px' }}>
                    Coming Soon
                </div>
                <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 800, color: clr.g900, marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    Photo Editor
                </h1>
                <p style={{ fontSize: '1.05rem', color: clr.g700, lineHeight: 1.7, marginBottom: '40px' }}>
                    Fine-tune brightness, contrast, saturation and apply filters to any image. A full non-destructive editor right in your browser. We&apos;re building it now.
                </p>

                <div style={{ background: '#f9fafb', border: `1px solid ${clr.g200}`, borderRadius: '16px', padding: '28px', marginBottom: '36px', textAlign: 'left' }}>
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: clr.g900, marginBottom: '16px' }}>While you wait, try these tools:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { href: '/enhance', label: 'Auto Enhance',   desc: 'Correct colour and brightness' },
                            { href: '/resize',  label: 'Resize Images',  desc: 'Set exact pixel dimensions' },
                            { href: '/rotate',  label: 'Flip and Rotate', desc: 'Mirror or rotate to any angle' },
                        ].map(t => (
                            <Link key={t.href} href={t.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: '#fff', border: `1px solid ${clr.g200}`, textDecoration: 'none' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: clr.g900 }}>{t.label}</div>
                                    <div style={{ fontSize: '0.78rem', color: clr.g400, marginTop: '2px' }}>{t.desc}</div>
                                </div>
                                <span style={{ color: clr.accent, fontSize: '1rem' }}>→</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <Link href="/" style={{ color: clr.g400, fontSize: '0.88rem', textDecoration: 'none' }}>← Back to all tools</Link>
            </div>
            <Footer />
        </div>
    );
}
