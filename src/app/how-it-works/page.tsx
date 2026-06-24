import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Lock, Zap, Globe, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'How It Works',
    description: 'Learn how Optimage compresses, converts and resizes images. Fast, private and free — no account needed to start.',
    alternates: { canonical: '/how-it-works' },
};

const steps = [
    {
        num: '01',
        title: 'Upload your images',
        body: 'Drag and drop up to 50 images at once, or click to browse. We support JPG, PNG, WebP, AVIF, GIF, TIFF, BMP and HEIC — any image format you throw at us.',
    },
    {
        num: '02',
        title: 'Choose your settings',
        body: "Pick a compression level, target format, or output dimensions. Our defaults are tuned for the best balance of quality and file size — but you're always in control.",
    },
    {
        num: '03',
        title: 'We process on our servers',
        body: 'Your images are securely uploaded and processed by our pipeline using professional-grade tools. Most jobs are done in seconds.',
    },
    {
        num: '04',
        title: 'Download and done',
        body: 'Download individual files or grab everything as a ZIP. Your processed files are available for a short window and then permanently deleted from our servers.',
    },
];

const features: { icon: React.ReactNode; title: string; body: string }[] = [
    { icon: <Lock size={20} color="#db5a42" />, title: 'Private by design', body: 'Files are processed and deleted promptly. We never use your images for training or analysis.' },
    { icon: <Zap size={20} color="#db5a42" />, title: 'Fast processing', body: 'Powered by professional-grade tools built for speed. Even large batch jobs finish in seconds.' },
    { icon: <Globe size={20} color="#db5a42" />, title: 'Works in any browser', body: 'No app to install. Open any tool in your browser and start processing — desktop, tablet or mobile.' },
    { icon: <Star size={20} color="#db5a42" />, title: 'Free for everyone', body: 'All tools are completely free with no account required. Sign up to access client galleries and processing history.' },
];

export default function HowItWorksPage(): React.JSX.Element {
    const clr = { accent: '#db5a42', accentLt: '#fdf3f1', g200: '#e5e7eb', g400: '#9ca3af', g700: '#374151', g900: '#111827', g50: '#f9fafb' };

    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: clr.g900 }}>
            <Header />

            {/* Hero */}
            <div style={{ textAlign: 'center', padding: '60px 24px 48px' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: clr.g900, marginBottom: '16px', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
                    How Optimage works
                </h1>
                <p style={{ color: clr.g400, fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
                    Simple, fast and private image processing in four steps. No account needed to start.
                </p>
            </div>

            {/* Steps */}
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px 64px' }}>
                {steps.map((step, i) => (
                    <div key={step.num} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: i < steps.length - 1 ? '40px' : 0 }}>
                        <div style={{
                            flexShrink: 0, width: '48px', height: '48px',
                            background: clr.accentLt, border: `1.5px solid rgba(219,90,66,0.2)`,
                            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 800, color: clr.accent, letterSpacing: '0.02em',
                        }}>
                            {step.num}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: clr.g900, marginBottom: '6px' }}>{step.title}</h3>
                            <p style={{ fontSize: '0.95rem', color: clr.g700, lineHeight: 1.7 }}>{step.body}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Features */}
            <div style={{ background: clr.g50, borderTop: `1px solid ${clr.g200}`, borderBottom: `1px solid ${clr.g200}`, padding: '56px 24px' }}>
                <div style={{ maxWidth: '920px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: clr.g900, marginBottom: '40px', letterSpacing: '-0.02em' }}>
                        Why Optimage?
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        {features.map(f => (
                            <div key={f.title} style={{ background: '#fff', border: `1px solid ${clr.g200}`, borderRadius: '14px', padding: '20px' }}>
                                <div style={{ marginBottom: '10px' }}>{f.icon}</div>
                                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: clr.g900, marginBottom: '6px' }}>{f.title}</div>
                                <div style={{ fontSize: '0.83rem', color: clr.g400, lineHeight: 1.6 }}>{f.body}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', padding: '56px 24px 80px' }}>
                <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: clr.g900, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                    Ready to try it?
                </h2>
                <p style={{ color: clr.g400, fontSize: '0.97rem', marginBottom: '28px' }}>Free for everyone. No account needed.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <Link href="/compress"
                        style={{ background: clr.accent, color: '#fff', textDecoration: 'none', borderRadius: '12px', padding: '13px 28px', fontSize: '0.97rem', fontWeight: 700 }}>
                        Compress images →
                    </Link>
                    <Link href="/"
                        style={{ background: clr.g50, color: clr.g700, textDecoration: 'none', borderRadius: '12px', padding: '13px 28px', fontSize: '0.97rem', fontWeight: 600, border: `1px solid ${clr.g200}` }}>
                        Browse all tools
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
