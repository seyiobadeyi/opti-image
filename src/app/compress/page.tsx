import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    Zap, ArrowRight, CheckCircle, Image as ImageIcon,
    Shield, Globe, Settings, Clock, Download, Star,
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Image Compression & Optimisation | Optimage',
    description: 'Compress, convert, and optimise images online. JPEG, PNG, WebP, AVIF, TIFF, GIF, SVG — one tool for every format. Up to 90% file size reduction without visible quality loss.',
    keywords: 'image compression, compress images online, WebP converter, PNG to JPEG, AVIF conversion, image optimisation tool, bulk image compressor, reduce image file size',
    alternates: { canonical: 'https://optimage.dreamintrepid.com/compress' },
    openGraph: {
        title: 'Image Compression & Optimisation | Optimage',
        description: 'Reduce image file sizes by up to 90% without quality loss. Batch process dozens of formats. Strip metadata, convert, resize — all in one place.',
        type: 'website',
        url: 'https://optimage.dreamintrepid.com/compress',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Image Compression & Optimisation | Optimage',
        description: 'Reduce image file sizes by up to 90% without quality loss.',
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Optimage Image Compressor',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    description: 'Compress, resize, convert and enhance images — JPEG, PNG, WebP, AVIF, TIFF, GIF, SVG, BMP — with up to 90% size reduction.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: 'Dream Intrepid Ltd', url: 'https://optimage.dreamintrepid.com' },
    featureList: [
        'Batch image compression (up to 50 files)',
        'JPEG, PNG, WebP, AVIF, TIFF, GIF, SVG, BMP',
        'Custom quality level (1-100)',
        'Resize and rotate',
        'Metadata stripping',
        'Format conversion',
        'Auto enhance',
        'Aspect ratio lock',
    ],
};

export default function CompressPage(): React.JSX.Element {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Header />
            <main style={{ background: 'var(--bg-primary)', overflowX: 'hidden' }}>

                {/* ── Hero ── */}
                <section style={{
                    minHeight: '82vh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: 'clamp(80px, 12vw, 140px) 24px clamp(60px, 8vw, 100px)',
                    textAlign: 'center', position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
                        width: '600px', height: '350px',
                        background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '6px 16px', borderRadius: '100px',
                        background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
                        color: '#93c5fd', fontSize: '0.8rem', fontWeight: 600,
                        marginBottom: '32px', letterSpacing: '0.05em',
                    }}>
                        <Zap size={13} />
                        IMAGE OPTIMISATION
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900,
                        lineHeight: 1.06, letterSpacing: '-0.03em',
                        marginBottom: '28px', maxWidth: '860px', color: 'var(--text-primary)',
                    }}>
                        Smaller files.{' '}
                        <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Same quality.
                        </span>{' '}
                        Faster everywhere.
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', color: 'var(--text-secondary)',
                        maxWidth: '620px', lineHeight: 1.7, marginBottom: '48px',
                    }}>
                        Compress images up to 90% smaller without visible quality loss. Batch process 50 files at once. Convert between 8 formats. All in your browser — no upload limits, no subscriptions for basic use.
                    </p>

                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Link href="/#dropzone-area" style={{
                            padding: '16px 36px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                            color: '#fff', fontWeight: 700, fontSize: '1rem',
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 8px 32px rgba(59,130,246,0.3)',
                        }}>
                            Start Compressing Free <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div style={{
                        marginTop: '52px', display: 'flex', gap: '32px',
                        flexWrap: 'wrap', justifyContent: 'center',
                        color: 'var(--text-muted)', fontSize: '0.82rem',
                    }}>
                        {['No account required for free use', 'Processed server-side, deleted within 30 min', 'Up to 50 files at once'].map(item => (
                            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <CheckCircle size={13} style={{ color: '#22c55e' }} /> {item}
                            </span>
                        ))}
                    </div>
                </section>

                {/* ── Why it matters ── */}
                <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) 24px' }}>
                    <div style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: '24px', padding: 'clamp(32px, 5vw, 60px)',
                    }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#93c5fd', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>Why file size matters</p>
                        <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '40px', letterSpacing: '-0.02em' }}>
                            Your images are the biggest drag on your page speed.
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                            {[
                                { stat: '4.9s', label: 'Average mobile load time with unoptimised images', note: 'Google Core Web Vitals threshold: 2.5s' },
                                { stat: '90%', label: 'File size reduction achievable converting PNG to WebP at quality 80', note: 'Without perceptible visual difference' },
                                { stat: '53%', label: 'Of mobile users abandon pages that take over 3 seconds', note: 'Source: Google/SOASTA Research' },
                            ].map(({ stat, label, note }) => (
                                <div key={stat} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)' }}>
                                    <p style={{ fontSize: '2.8rem', fontWeight: 900, color: '#3b82f6', lineHeight: 1, marginBottom: '10px' }}>{stat}</p>
                                    <p style={{ fontWeight: 600, marginBottom: '6px', fontSize: '0.95rem' }}>{label}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{note}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Formats ── */}
                <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(20px, 4vw, 60px) 24px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#93c5fd', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', textAlign: 'center' }}>Supported formats</p>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: '40px' }}>
                        Every format you actually use
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                        {[
                            { fmt: 'JPEG', note: 'Best for photos' },
                            { fmt: 'PNG', note: 'Lossless, transparency' },
                            { fmt: 'WebP', note: 'Modern standard' },
                            { fmt: 'AVIF', note: 'Smallest modern format' },
                            { fmt: 'TIFF', note: 'High fidelity print' },
                            { fmt: 'GIF', note: 'Animated images' },
                            { fmt: 'SVG', note: 'Vector graphics' },
                            { fmt: 'BMP', note: 'Uncompressed bitmap' },
                        ].map(({ fmt, note }) => (
                            <div key={fmt} style={{
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                borderRadius: '12px', padding: '16px', textAlign: 'center',
                            }}>
                                <p style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text-primary)' }}>{fmt}</p>
                                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{note}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Features ── */}
                <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) 24px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#93c5fd', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '14px', textAlign: 'center' }}>Features</p>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: '52px' }}>
                        More than just compression
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        {[
                            { icon: <Settings size={22} />, color: '#3b82f6', title: 'Precise quality control', desc: 'Set quality from 1 to 100. See exactly what you get before downloading. Pick the crossover point between size and fidelity that your use case demands.' },
                            { icon: <ImageIcon size={22} />, color: '#8b5cf6', title: 'Format conversion', desc: 'Convert from any to any supported format. Drop in a PNG, export a WebP. Drop in a TIFF, export a JPEG. No desktop software needed.' },
                            { icon: <Globe size={22} />, color: '#22c55e', title: 'Resize and rotate', desc: 'Set pixel dimensions, lock aspect ratio, rotate in 90° increments. Standard operations that normally require Photoshop, done in seconds.' },
                            { icon: <Shield size={22} />, color: '#f59e0b', title: 'Metadata stripping', desc: 'EXIF data contains GPS location, camera model, date and time. Strip all of it on export with one toggle — important for privacy.' },
                            { icon: <Star size={22} />, color: '#f472b6', title: 'Auto enhance', desc: 'Optimage can intelligently adjust exposure, contrast, and saturation during processing — a one-click improvement before you download.' },
                            { icon: <Download size={22} />, color: '#38bdf8', title: 'Batch download', desc: 'Process up to 50 images at once. Download individual files or grab the entire batch as a ZIP. Average processing time: under 3 seconds per image.' },
                        ].map(feat => (
                            <div key={feat.title} style={{
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                borderRadius: '20px', padding: '28px',
                            }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: `${feat.color}18`, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    color: feat.color, marginBottom: '18px',
                                }}>
                                    {feat.icon}
                                </div>
                                <h3 style={{ fontWeight: 700, marginBottom: '10px', fontSize: '1.05rem' }}>{feat.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section style={{ maxWidth: '720px', margin: '0 auto', padding: 'clamp(40px, 6vw, 80px) 24px' }}>
                    <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, textAlign: 'center', letterSpacing: '-0.02em', marginBottom: '40px' }}>
                        Common questions
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {[
                            { q: 'What happens to my files on the server?', a: 'Images are uploaded to our processing server, compressed, and the output is stored temporarily (under 30 minutes) for you to download. We do not retain your images, use them for any other purpose, or share them with third parties.' },
                            { q: 'Is there a file size limit?', a: 'Free use supports files up to 20MB per image. Subscribers get higher limits and batch sizes. Most camera photos (even RAW-derived JPEGs) are well within the free limit.' },
                            { q: 'What quality setting should I use?', a: 'For web use: 75–82 is the sweet spot for JPEG. For WebP, 75–85. For print-quality JPEG: 90+. The visual difference between 82 and 100 is nearly imperceptible, but the file size difference is significant.' },
                            { q: 'Will compression affect my resolution?', a: 'No — unless you explicitly set a width or height in the settings. Compression only affects file size and quality encoding. Pixel dimensions are unchanged by default.' },
                            { q: 'Can I compress images without an account?', a: 'Yes. Basic compression is available without creating an account. Batch processing beyond 5 files, processing history, and gallery features require a free account and optionally a subscription.' },
                        ].map(({ q, a }) => (
                            <div key={q} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px 24px' }}>
                                <p style={{ fontWeight: 700, marginBottom: '10px', fontSize: '0.98rem' }}>{q}</p>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', margin: 0 }}>{a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <section style={{ maxWidth: '1100px', margin: '0 auto 80px', padding: '0 24px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #0a1628 0%, #1a2744 100%)',
                        borderRadius: '28px', padding: 'clamp(40px, 7vw, 80px) 32px',
                        textAlign: 'center', border: '1px solid rgba(59,130,246,0.3)',
                    }}>
                        <Zap size={40} style={{ color: '#60a5fa', marginBottom: '20px' }} />
                        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', marginBottom: '16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                            Your images are too big.<br />Fix that now — free.
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px', lineHeight: 1.7 }}>
                            No signup required for your first images. Import, compress, download in under 60 seconds.
                        </p>
                        <Link href="/#dropzone-area" style={{
                            padding: '16px 36px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                            color: '#fff', fontWeight: 700, fontSize: '1rem',
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 8px 32px rgba(59,130,246,0.3)',
                        }}>
                            Compress Images Free <ArrowRight size={17} />
                        </Link>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
