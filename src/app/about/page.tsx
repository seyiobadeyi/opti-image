import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'About Optimage | Dream Intrepid Ltd',
    description: 'Optimage is a free image optimization tool built by Dream Intrepid Ltd. Compress, convert, resize and enhance images — right in your browser.',
};

export default function AboutPage(): React.JSX.Element {
    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#111827' }}>
            <style>{`.tool-card:hover { border-color: #db5a42 !important; }`}</style>
            <Header />

            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px 80px' }}>

                <div style={{ marginBottom: '48px' }}>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 800, color: '#111827', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        About Optimage
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#374151', lineHeight: 1.75, marginBottom: '20px' }}>
                        Optimage is a suite of free image tools built for creators, developers and photographers who need fast, reliable image processing — without sending files to questionable third-party servers or installing heavyweight software.
                    </p>
                    <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.75 }}>
                        Every tool runs through our secure processing pipeline. Files are processed and deleted promptly. We never store your images beyond what&apos;s needed to complete your job.
                    </p>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '40px', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>The team</h2>
                    <p style={{ fontSize: '0.97rem', color: '#374151', lineHeight: 1.75, marginBottom: '16px' }}>
                        Optimage is built and maintained by{' '}
                        <a href="https://dreamintrepid.com" target="_blank" rel="noopener noreferrer"
                            style={{ color: '#db5a42', textDecoration: 'none', fontWeight: 500 }}>
                            Dream Intrepid Ltd
                        </a>
                        , a small product studio focused on building tools that do one thing well.
                    </p>
                    <p style={{ fontSize: '0.97rem', color: '#374151', lineHeight: 1.75 }}>
                        We believe that professional-grade image tooling should be accessible to everyone — not locked behind expensive subscriptions or cluttered with ads.
                    </p>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '40px', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>What we offer</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                        {[
                            { href: '/compress', label: 'Image Compression', desc: 'Up to 90% smaller, invisible quality loss' },
                            { href: '/convert', label: 'Format Conversion', desc: 'WebP, AVIF, JPEG, PNG and more' },
                            { href: '/resize', label: 'Image Resizing', desc: 'Pixel-perfect or percentage scaling' },
                            { href: '/enhance', label: 'Photo Enhancement', desc: 'Auto-correct colour and brightness' },
                            { href: '/metadata', label: 'Metadata Removal', desc: 'Strip GPS and EXIF before sharing' },
                            { href: '/rotate', label: 'Rotate & Flip', desc: 'Correct orientation in seconds' },
                            { href: '/galleries', label: 'Client Galleries', desc: 'PIN-protected delivery for pros' },
                        ].map(t => (
                            <Link key={t.href} href={t.href}
                                className="tool-card"
                                style={{ display: 'block', padding: '14px 16px', borderRadius: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', textDecoration: 'none', transition: 'border-color 0.15s' }}
                            >
                                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#111827', marginBottom: '3px' }}>{t.label}</div>
                                <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{t.desc}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '40px' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Get in touch</h2>
                    <p style={{ fontSize: '0.97rem', color: '#374151', lineHeight: 1.75, marginBottom: '16px' }}>
                        Got a question, feature request or bug report? We&apos;d love to hear from you.
                    </p>
                    <Link href="/contact"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#db5a42', color: '#fff', textDecoration: 'none', borderRadius: '10px', padding: '11px 24px', fontSize: '0.92rem', fontWeight: 600 }}>
                        Contact us →
                    </Link>
                </div>

            </div>

            <Footer />
        </div>
    );
}
