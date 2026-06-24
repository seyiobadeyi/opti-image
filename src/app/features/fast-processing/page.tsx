import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Zap, Shield, Layers, Upload, Cpu, Download } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { c } from '@/lib/colors';

export const metadata: Metadata = {
    title: 'Lightning Fast Image Processing — Optimage',
    description:
        'Optimage processes images in under a second using Sharp. Compress, resize and convert up to 50 files at once — free, no account required.',
    openGraph: {
        title: 'Lightning Fast Image Processing — Optimage',
        description:
            'Optimage processes images in under a second using Sharp. Compress, resize and convert up to 50 files at once — free, no account required.',
        url: 'https://optimage.dreamintrepid.com/features/fast-processing',
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            '@id': 'https://optimage.dreamintrepid.com/features/fast-processing',
            url: 'https://optimage.dreamintrepid.com/features/fast-processing',
            name: 'Lightning Fast Image Processing — Optimage',
            description:
                'Optimage processes images in under a second using Sharp. Compress, resize and convert up to 50 files at once — free, no account required.',
            isPartOf: { '@id': 'https://optimage.dreamintrepid.com' },
        },
        {
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: 'How fast does Optimage process images?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Optimage processes most images in under one second. It uses Sharp, a high-performance Node.js image processing library built on libvips, which is typically 4–5x faster than ImageMagick.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Does Optimage store my images on a server?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'No. Your images are processed and immediately discarded — they are never stored, indexed, or shared. Processing happens transiently and files are deleted as soon as your download is ready.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Can I process many images at once?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes. Optimage supports batch processing of up to 50 files in a single session. You can drag and drop an entire folder and download all results at once.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'What formats does Optimage support?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Optimage supports JPEG, PNG, WebP, AVIF, GIF, and TIFF for input. Output formats include JPEG, PNG, WebP, and AVIF — ideal for modern web performance.',
                    },
                },
            ],
        },
    ],
};

export default function FastProcessingPage(): React.JSX.Element {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#ffffff',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                color: c.text,
            }}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Header />

            {/* Hero */}
            <section style={{ background: '#ffffff', padding: '80px 24px 64px' }}>
                <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
                    <h1
                        style={{
                            fontSize: 'clamp(2rem, 5.5vw, 3.2rem)',
                            fontWeight: 800,
                            color: c.text,
                            letterSpacing: '-0.03em',
                            lineHeight: 1.15,
                            marginBottom: '20px',
                        }}
                    >
                        Process images in under a second
                    </h1>
                    <p
                        style={{
                            fontSize: '1.1rem',
                            color: c.textSecondary,
                            lineHeight: 1.75,
                            maxWidth: '580px',
                            margin: '0 auto 36px',
                        }}
                    >
                        Optimage is powered by{' '}
                        <strong style={{ color: c.text }}>Sharp</strong> — the same
                        high-performance library used by Netflix, Vercel, and thousands of
                        production pipelines. No waiting. No queues. Results in milliseconds.
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Link
                            href="/compress"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: c.accent,
                                color: '#ffffff',
                                textDecoration: 'none',
                                borderRadius: '10px',
                                padding: '13px 28px',
                                fontSize: '1rem',
                                fontWeight: 600,
                            }}
                        >
                            Compress images free →
                        </Link>
                        <Link
                            href="/"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#ffffff',
                                color: c.text,
                                textDecoration: 'none',
                                borderRadius: '10px',
                                padding: '13px 28px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                border: `1px solid ${c.border}`,
                            }}
                        >
                            See all tools
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats row */}
            <section style={{ background: '#ffffff', padding: '0 24px 72px' }}>
                <div
                    style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '16px',
                    }}
                >
                    {[
                        { stat: '<1s', label: 'average processing time' },
                        { stat: '50', label: 'files at once in batch mode' },
                        { stat: '100% free', label: 'no account to start' },
                    ].map((item) => (
                        <div
                            key={item.stat}
                            style={{
                                background: c.accentLight,
                                borderRadius: '14px',
                                padding: '28px 24px',
                                textAlign: 'center',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                                    fontWeight: 800,
                                    color: c.accent,
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1.1,
                                    marginBottom: '8px',
                                }}
                            >
                                {item.stat}
                            </div>
                            <div
                                style={{
                                    fontSize: '0.92rem',
                                    color: c.textSecondary,
                                    fontWeight: 500,
                                }}
                            >
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section style={{ background: c.bgSubtle, padding: '72px 24px' }}>
                <div style={{ maxWidth: '860px', margin: '0 auto' }}>
                    <h2
                        style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                            fontWeight: 700,
                            color: c.text,
                            textAlign: 'center',
                            marginBottom: '12px',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        How fast is fast?
                    </h2>
                    <p
                        style={{
                            fontSize: '1rem',
                            color: c.textMuted,
                            textAlign: 'center',
                            marginBottom: '48px',
                        }}
                    >
                        Three steps. Most jobs finish before you blink.
                    </p>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '20px',
                        }}
                    >
                        {[
                            {
                                step: '1',
                                icon: <Upload size={24} color={c.accent} />,
                                title: 'Upload',
                                desc: 'Drag your files — JPEG, PNG, WebP, AVIF or GIF — straight onto the tool. Up to 50 at a time.',
                            },
                            {
                                step: '2',
                                icon: <Cpu size={24} color={c.accent} />,
                                title: 'Process',
                                desc: 'Sharp runs server-side in milliseconds. No browser lag, no client-side stuttering — just raw speed.',
                            },
                            {
                                step: '3',
                                icon: <Download size={24} color={c.accent} />,
                                title: 'Download',
                                desc: 'Your optimised files are ready to download individually or as a single ZIP. Done.',
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '14px',
                                    border: `1px solid ${c.border}`,
                                    padding: '28px 24px',
                                }}
                            >
                                <div
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        background: c.accentLight,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        color: c.accent,
                                        marginBottom: '16px',
                                    }}
                                >
                                    {item.step}
                                </div>
                                <div style={{ marginBottom: '12px' }}>{item.icon}</div>
                                <h3
                                    style={{
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        color: c.text,
                                        marginBottom: '8px',
                                    }}
                                >
                                    {item.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: '0.9rem',
                                        color: c.textSecondary,
                                        lineHeight: 1.65,
                                        margin: 0,
                                    }}
                                >
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits grid */}
            <section style={{ background: '#ffffff', padding: '72px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2
                        style={{
                            fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)',
                            fontWeight: 700,
                            color: c.text,
                            textAlign: 'center',
                            marginBottom: '48px',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Built for speed without compromise
                    </h2>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px',
                        }}
                    >
                        <div
                            style={{
                                borderRadius: '14px',
                                border: `1px solid ${c.border}`,
                                padding: '28px 24px',
                            }}
                        >
                            <Zap size={28} color={c.accent} />
                            <h3
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    color: c.text,
                                    margin: '14px 0 8px',
                                }}
                            >
                                Sharp — industry-standard speed
                            </h3>
                            <p
                                style={{
                                    fontSize: '0.9rem',
                                    color: c.textSecondary,
                                    lineHeight: 1.65,
                                    margin: 0,
                                }}
                            >
                                Sharp is built on libvips, the fastest open-source image processing
                                library available. It consistently outperforms ImageMagick and other
                                alternatives by a factor of four or more.
                            </p>
                        </div>

                        <div
                            style={{
                                borderRadius: '14px',
                                border: `1px solid ${c.border}`,
                                padding: '28px 24px',
                            }}
                        >
                            <Shield size={28} color={c.accent} />
                            <h3
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    color: c.text,
                                    margin: '14px 0 8px',
                                }}
                            >
                                Privacy-first — images never stored
                            </h3>
                            <p
                                style={{
                                    fontSize: '0.9rem',
                                    color: c.textSecondary,
                                    lineHeight: 1.65,
                                    margin: 0,
                                }}
                            >
                                Your files are processed transiently and deleted the moment your
                                download is ready. Optimage never indexes, caches, or shares your
                                images — client confidentiality is built in, not bolted on.
                            </p>
                        </div>

                        <div
                            style={{
                                borderRadius: '14px',
                                border: `1px solid ${c.border}`,
                                padding: '28px 24px',
                            }}
                        >
                            <Layers size={28} color={c.accent} />
                            <h3
                                style={{
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    color: c.text,
                                    margin: '14px 0 8px',
                                }}
                            >
                                Batch mode — 50 files, one session
                            </h3>
                            <p
                                style={{
                                    fontSize: '0.9rem',
                                    color: c.textSecondary,
                                    lineHeight: 1.65,
                                    margin: 0,
                                }}
                            >
                                Drop an entire shoot or asset library in one go and walk away. Batch
                                jobs run in parallel and a single ZIP download gets every output back
                                to you in seconds.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison table */}
            <section style={{ background: c.bgSubtle, padding: '72px 24px' }}>
                <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <h2
                        style={{
                            fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)',
                            fontWeight: 700,
                            color: c.text,
                            textAlign: 'center',
                            marginBottom: '36px',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Optimage vs typical cloud tools
                    </h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: '0.92rem',
                                background: '#ffffff',
                                borderRadius: '14px',
                                overflow: 'hidden',
                                border: `1px solid ${c.border}`,
                            }}
                        >
                            <thead>
                                <tr style={{ background: c.bgMuted }}>
                                    <th
                                        style={{
                                            padding: '14px 20px',
                                            textAlign: 'left',
                                            fontWeight: 700,
                                            color: c.text,
                                            borderBottom: `1px solid ${c.border}`,
                                            borderRight: `1px solid ${c.border}`,
                                        }}
                                    >
                                        Feature
                                    </th>
                                    <th
                                        style={{
                                            padding: '14px 20px',
                                            textAlign: 'center',
                                            fontWeight: 700,
                                            color: c.accent,
                                            borderBottom: `1px solid ${c.border}`,
                                            borderRight: `1px solid ${c.border}`,
                                        }}
                                    >
                                        Optimage
                                    </th>
                                    <th
                                        style={{
                                            padding: '14px 20px',
                                            textAlign: 'center',
                                            fontWeight: 700,
                                            color: c.textMuted,
                                            borderBottom: `1px solid ${c.border}`,
                                        }}
                                    >
                                        Typical cloud tool
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        feature: 'Speed',
                                        optimage: 'Under 1 second',
                                        other: '5–30 seconds',
                                    },
                                    {
                                        feature: 'Files per batch',
                                        optimage: 'Up to 50',
                                        other: '5–20 (varies)',
                                    },
                                    {
                                        feature: 'Privacy',
                                        optimage: 'Never stored',
                                        other: 'Often retained 24h+',
                                    },
                                    {
                                        feature: 'Price',
                                        optimage: '100% free',
                                        other: 'Free tier, then paid',
                                    },
                                ].map((row, i) => (
                                    <tr
                                        key={row.feature}
                                        style={{
                                            background: i % 2 === 1 ? c.bgSubtle : '#ffffff',
                                        }}
                                    >
                                        <td
                                            style={{
                                                padding: '13px 20px',
                                                fontWeight: 600,
                                                color: c.text,
                                                borderBottom: `1px solid ${c.border}`,
                                                borderRight: `1px solid ${c.border}`,
                                            }}
                                        >
                                            {row.feature}
                                        </td>
                                        <td
                                            style={{
                                                padding: '13px 20px',
                                                textAlign: 'center',
                                                color: c.accent,
                                                fontWeight: 600,
                                                borderBottom: `1px solid ${c.border}`,
                                                borderRight: `1px solid ${c.border}`,
                                            }}
                                        >
                                            {row.optimage}
                                        </td>
                                        <td
                                            style={{
                                                padding: '13px 20px',
                                                textAlign: 'center',
                                                color: c.textMuted,
                                                borderBottom: `1px solid ${c.border}`,
                                            }}
                                        >
                                            {row.other}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p
                        style={{
                            fontSize: '0.82rem',
                            color: c.textMuted,
                            textAlign: 'center',
                            marginTop: '16px',
                        }}
                    >
                        Also try{' '}
                        <Link
                            href="/resize"
                            style={{ color: c.accent, textDecoration: 'none' }}
                        >
                            image resizing
                        </Link>
                        {' '}and{' '}
                        <Link
                            href="/convert"
                            style={{ color: c.accent, textDecoration: 'none' }}
                        >
                            format conversion
                        </Link>
                        {' '}— all powered by the same Sharp engine.
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section style={{ background: '#ffffff', padding: '72px 24px' }}>
                <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                    <h2
                        style={{
                            fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)',
                            fontWeight: 700,
                            color: c.text,
                            textAlign: 'center',
                            marginBottom: '40px',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Frequently asked questions
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            {
                                q: 'How fast does Optimage process images?',
                                a: 'Optimage processes most images in under one second. It runs on Sharp, a high-performance Node.js image processing library built on libvips — typically 4–5x faster than ImageMagick. Large files or very high batch counts may take a few seconds, but the average job is done before you scroll down the page.',
                            },
                            {
                                q: 'Does Optimage store my images on a server?',
                                a: 'No. Your images are processed transiently and deleted immediately after your download is ready. Optimage never stores, indexes, or shares your files. This applies to every tool — compress, resize, convert, and all others.',
                            },
                            {
                                q: 'Can I process many images at once?',
                                a: 'Yes. Optimage supports batch processing of up to 50 files per session. Drop a folder, pick your settings, and download all outputs as a single ZIP archive. There is no queue — all files are handled in parallel.',
                            },
                            {
                                q: 'What formats does Optimage support?',
                                a: 'Input formats include JPEG, PNG, WebP, AVIF, GIF, and TIFF. You can output to JPEG, PNG, WebP, and AVIF. WebP and AVIF outputs are particularly useful for modern web performance, often achieving 30–50% smaller file sizes than JPEG at equivalent visual quality.',
                            },
                        ].map((item) => (
                            <details
                                key={item.q}
                                style={{
                                    borderRadius: '12px',
                                    border: `1px solid ${c.border}`,
                                    overflow: 'hidden',
                                }}
                            >
                                <summary
                                    style={{
                                        padding: '18px 22px',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: '0.97rem',
                                        color: c.text,
                                        listStyle: 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        userSelect: 'none',
                                    }}
                                >
                                    {item.q}
                                </summary>
                                <div
                                    style={{
                                        padding: '0 22px 18px',
                                        fontSize: '0.92rem',
                                        color: c.textSecondary,
                                        lineHeight: 1.7,
                                        borderTop: `1px solid ${c.border}`,
                                        paddingTop: '16px',
                                    }}
                                >
                                    {item.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA banner */}
            <section style={{ background: '#ffffff', padding: '0 24px 80px' }}>
                <div
                    style={{
                        maxWidth: '860px',
                        margin: '0 auto',
                        background: c.accentLight,
                        borderRadius: '20px',
                        padding: '56px 40px',
                        textAlign: 'center',
                    }}
                >
                    <h2
                        style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                            fontWeight: 800,
                            color: c.text,
                            letterSpacing: '-0.025em',
                            marginBottom: '12px',
                        }}
                    >
                        Ready to compress your images in seconds?
                    </h2>
                    <p
                        style={{
                            fontSize: '1rem',
                            color: c.textSecondary,
                            marginBottom: '28px',
                            lineHeight: 1.65,
                        }}
                    >
                        No sign-up. No file size caps on free usage. Just fast, private image
                        processing.
                    </p>
                    <Link
                        href="/compress"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: c.accent,
                            color: '#ffffff',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            padding: '14px 32px',
                            fontSize: '1rem',
                            fontWeight: 700,
                        }}
                    >
                        Start compressing free
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
