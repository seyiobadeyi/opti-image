import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
    Layers,
    RefreshCw,
    Maximize2,
    Stamp,
    Upload,
    SlidersHorizontal,
    Eye,
    FolderDown,
    ShoppingCart,
    Camera,
    Code2,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { c } from '@/lib/colors';

// ── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
    title: 'Bulk Image Compression & Conversion — Process 50 Images at Once | Optimage',
    description:
        'Upload up to 50 images at once and compress, convert or resize the entire batch in seconds. 100% free — no account required.',
    openGraph: {
        title: 'Bulk Image Compression & Conversion — Process 50 Images at Once | Optimage',
        description:
            'Upload up to 50 images at once and compress, convert or resize the entire batch in seconds. 100% free — no account required.',
        url: 'https://optimage.dreamintrepid.com/features/bulk',
        siteName: 'Optimage',
        type: 'website',
    },
};

// ── JSON-LD ──────────────────────────────────────────────────────────────────

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'How many images can I compress at once?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You can upload and compress up to 50 images per session on Optimage, completely free. There is no daily cap — just start a new session once a batch is done.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I convert formats in bulk?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Select a target format such as WebP, AVIF, JPEG or PNG and every file in your batch will be converted to that format in one go.',
            },
        },
        {
            '@type': 'Question',
            name: 'Do all images get the same settings?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You can apply global settings to the whole batch or override quality, format and dimensions on individual files before you process.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is bulk processing really free?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Completely. Optimage is a 100% free tool suite. Bulk operations — including ZIP download — cost nothing and require no account.',
            },
        },
    ],
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BulkPage(): React.JSX.Element {
    const base: React.CSSProperties = {
        minHeight: '100vh',
        background: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: c.text,
    };

    return (
        <div style={base}>
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <Header />

            {/* ── 1. Hero ──────────────────────────────────────────────────── */}
            <section style={{ textAlign: 'center', padding: '64px 24px 48px', maxWidth: '760px', margin: '0 auto' }}>
                <p style={{
                    display: 'inline-block',
                    background: c.accentLight,
                    color: c.accent,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '5px 14px',
                    borderRadius: '999px',
                    marginBottom: '20px',
                }}>
                    True bulk operations
                </p>
                <h1 style={{
                    fontSize: 'clamp(2rem, 5.5vw, 3rem)',
                    fontWeight: 800,
                    color: c.text,
                    lineHeight: 1.15,
                    letterSpacing: '-0.025em',
                    marginBottom: '20px',
                }}>
                    Compress, convert and resize<br />50 images in one go
                </h1>
                <p style={{ fontSize: '1.07rem', color: c.textSecondary, lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 36px' }}>
                    Upload your whole batch once, pick your settings — quality, format, dimensions — and apply them to every file simultaneously. Download everything as a single ZIP.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link
                        href="/compress"
                        style={{
                            background: c.accent,
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            padding: '13px 28px',
                            fontSize: '0.97rem',
                            fontWeight: 700,
                            display: 'inline-block',
                        }}
                    >
                        Start batch processing →
                    </Link>
                    <Link
                        href="/convert"
                        style={{
                            background: '#fff',
                            color: c.text,
                            textDecoration: 'none',
                            borderRadius: '10px',
                            padding: '13px 28px',
                            fontSize: '0.97rem',
                            fontWeight: 600,
                            border: `1.5px solid ${c.border}`,
                            display: 'inline-block',
                        }}
                    >
                        Learn about formats
                    </Link>
                </div>
            </section>

            {/* ── 2. Stats row ─────────────────────────────────────────────── */}
            <section style={{ padding: '0 24px 64px', maxWidth: '900px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px',
                }}>
                    {[
                        { stat: '50 files', label: 'per session', sub: 'No daily cap — just start a new batch' },
                        { stat: 'All formats', label: 'supported', sub: 'JPG, PNG, WebP, AVIF, GIF, TIFF, BMP, HEIC' },
                        { stat: 'Per-file', label: 'settings or global', sub: 'Override quality & format for any image' },
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
                            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: c.accent, lineHeight: 1.1, marginBottom: '4px' }}>
                                {item.stat}
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: 600, color: c.text, marginBottom: '6px' }}>
                                {item.label}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: c.textSecondary, lineHeight: 1.5 }}>
                                {item.sub}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 3. What you can do in bulk ───────────────────────────────── */}
            <section style={{ background: c.bgSubtle, padding: '64px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: c.text, textAlign: 'center', marginBottom: '8px' }}>
                        What you can do in bulk
                    </h2>
                    <p style={{ textAlign: 'center', color: c.textSecondary, fontSize: '0.97rem', marginBottom: '40px' }}>
                        Every major operation on Optimage supports batch mode.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {[
                            {
                                Icon: Layers,
                                title: 'Bulk compression',
                                desc: 'Shrink entire product catalogues or photo libraries for web delivery in one click.',
                            },
                            {
                                Icon: RefreshCw,
                                title: 'Batch convert to WebP',
                                desc: 'Turn a folder of JPEGs into next-gen WebP files and cut page-load time instantly.',
                            },
                            {
                                Icon: Maximize2,
                                title: 'Resize to one dimension',
                                desc: 'Standardise thumbnails, avatars or hero images across your entire asset library.',
                            },
                            {
                                Icon: Stamp,
                                title: 'Add watermark to all',
                                desc: 'Apply your logo or copyright text to every image in the batch simultaneously.',
                            },
                        ].map(({ Icon, title, desc }) => (
                            <div
                                key={title}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '14px',
                                    border: `1px solid ${c.border}`,
                                    padding: '24px 20px',
                                }}
                            >
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '10px',
                                    background: c.accentLight,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '16px',
                                }}>
                                    <Icon size={22} color={c.accent} />
                                </div>
                                <div style={{ fontSize: '0.97rem', fontWeight: 700, color: c.text, marginBottom: '6px' }}>
                                    {title}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: c.textSecondary, lineHeight: 1.6 }}>
                                    {desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. How it works ──────────────────────────────────────────── */}
            <section style={{ padding: '64px 24px', maxWidth: '860px', margin: '0 auto' }}>
                <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: c.text, textAlign: 'center', marginBottom: '48px' }}>
                    How it works
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
                    {[
                        {
                            num: '1',
                            Icon: Upload,
                            title: 'Upload up to 50 files',
                            desc: 'Drag and drop your whole batch or click to browse. Supports JPG, PNG, WebP, AVIF, GIF, TIFF, BMP and HEIC.',
                        },
                        {
                            num: '2',
                            Icon: SlidersHorizontal,
                            title: 'Apply settings',
                            desc: 'Set global quality and format for the whole batch, or fine-tune individual files before processing.',
                        },
                        {
                            num: '3',
                            Icon: Eye,
                            title: 'Preview results',
                            desc: 'See per-file savings percentages and side-by-side comparisons before you commit to downloading.',
                        },
                        {
                            num: '4',
                            Icon: FolderDown,
                            title: 'Download as ZIP',
                            desc: 'Grab every processed file in a single ZIP archive — or download individual images if you prefer.',
                        },
                    ].map(({ num, Icon, title, desc }) => (
                        <div key={num} style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '50%',
                                background: c.accentLight,
                                color: c.accent,
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 14px',
                                position: 'relative',
                            }}>
                                {num}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                                <Icon size={24} color={c.textMuted} />
                            </div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: c.text, marginBottom: '6px' }}>
                                {title}
                            </div>
                            <div style={{ fontSize: '0.83rem', color: c.textSecondary, lineHeight: 1.65 }}>
                                {desc}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 5. Use cases ─────────────────────────────────────────────── */}
            <section style={{ background: c.bgSubtle, padding: '64px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: c.text, textAlign: 'center', marginBottom: '8px' }}>
                        Who uses bulk image processing?
                    </h2>
                    <p style={{ textAlign: 'center', color: c.textSecondary, fontSize: '0.97rem', marginBottom: '40px' }}>
                        Anyone who works with more than one image at a time.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                        {[
                            {
                                Icon: ShoppingCart,
                                persona: 'E-commerce teams',
                                context: 'Product photo optimisation',
                                body: 'Compress hundreds of product images before upload to Shopify or WooCommerce. Faster page loads, higher conversions.',
                            },
                            {
                                Icon: Camera,
                                persona: 'Photographers',
                                context: 'Client delivery',
                                body: 'Export a full shoot to web-ready WebP or compressed JPEG in seconds. Watermark every image before delivery.',
                            },
                            {
                                Icon: Code2,
                                persona: 'Web developers',
                                context: 'Asset optimisation',
                                body: 'Convert a design handoff folder to next-gen formats and resize assets to multiple breakpoints in one pass.',
                            },
                        ].map(({ Icon, persona, context, body }) => (
                            <div
                                key={persona}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '14px',
                                    border: `1px solid ${c.border}`,
                                    padding: '28px 24px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '10px',
                                        background: c.bgMuted,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <Icon size={22} color={c.textSecondary} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: c.text }}>
                                            {persona}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: c.textMuted }}>
                                            {context}
                                        </div>
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.87rem', color: c.textSecondary, lineHeight: 1.65, margin: 0 }}>
                                    {body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 6. Comparison table ──────────────────────────────────────── */}
            <section style={{ padding: '64px 24px', maxWidth: '820px', margin: '0 auto' }}>
                <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: c.text, textAlign: 'center', marginBottom: '12px' }}>
                    Optimage bulk vs competitors
                </h2>
                <p style={{ textAlign: 'center', color: c.textSecondary, fontSize: '0.95rem', marginBottom: '36px' }}>
                    See how Optimage compares on the features that matter for batch work.
                </p>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.9rem',
                        border: `1px solid ${c.border}`,
                        borderRadius: '12px',
                        overflow: 'hidden',
                    }}>
                        <thead>
                            <tr style={{ background: c.bgMuted }}>
                                <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: 700, color: c.text, borderBottom: `1px solid ${c.border}` }}>
                                    Feature
                                </th>
                                <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 700, color: c.accent, borderBottom: `1px solid ${c.border}`, background: c.accentLight }}>
                                    Optimage
                                </th>
                                <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, color: c.textSecondary, borderBottom: `1px solid ${c.border}` }}>
                                    TinyPNG
                                </th>
                                <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: 600, color: c.textSecondary, borderBottom: `1px solid ${c.border}` }}>
                                    Squoosh
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                {
                                    feature: 'Max files per batch',
                                    optimage: '50',
                                    tinypng: '20 (free tier)',
                                    squoosh: '1 at a time',
                                },
                                {
                                    feature: 'File size limit',
                                    optimage: '100 MB each',
                                    tinypng: '5 MB each',
                                    squoosh: 'Browser memory',
                                },
                                {
                                    feature: 'Price',
                                    optimage: 'Free',
                                    tinypng: 'Free / paid plans',
                                    squoosh: 'Free',
                                },
                                {
                                    feature: 'Formats supported',
                                    optimage: 'JPG, PNG, WebP, AVIF, GIF, TIFF, BMP, HEIC',
                                    tinypng: 'JPG, PNG, WebP',
                                    squoosh: 'JPG, PNG, WebP, AVIF',
                                },
                            ].map((row, i) => (
                                <tr key={row.feature} style={{ background: i % 2 === 0 ? '#fff' : c.bgSubtle }}>
                                    <td style={{ padding: '13px 18px', color: c.textSecondary, fontWeight: 500, borderBottom: `1px solid ${c.border}` }}>
                                        {row.feature}
                                    </td>
                                    <td style={{ padding: '13px 18px', textAlign: 'center', fontWeight: 700, color: c.accent, borderBottom: `1px solid ${c.border}`, background: '#fffaf9' }}>
                                        {row.optimage}
                                    </td>
                                    <td style={{ padding: '13px 18px', textAlign: 'center', color: c.textSecondary, borderBottom: `1px solid ${c.border}` }}>
                                        {row.tinypng}
                                    </td>
                                    <td style={{ padding: '13px 18px', textAlign: 'center', color: c.textSecondary, borderBottom: `1px solid ${c.border}` }}>
                                        {row.squoosh}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ── 7. FAQ ───────────────────────────────────────────────────── */}
            <section style={{ background: c.bgSubtle, padding: '64px 24px' }}>
                <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: c.text, textAlign: 'center', marginBottom: '40px' }}>
                        Frequently asked questions
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            {
                                q: 'How many images can I compress at once?',
                                a: 'You can upload and compress up to 50 images per session on Optimage, completely free. There is no daily cap — just start a new session once a batch is done.',
                            },
                            {
                                q: 'Can I convert formats in bulk?',
                                a: 'Yes. Select a target format such as WebP, AVIF, JPEG or PNG and every file in your batch will be converted to that format in one go. You can also leave the format as "same as original" to keep each file in its source type.',
                            },
                            {
                                q: 'Do all images get the same settings?',
                                a: 'You can apply global settings to the whole batch or override quality, format and dimensions on individual files before you process. This makes it straightforward to handle mixed batches with different requirements.',
                            },
                            {
                                q: 'Is bulk processing really free?',
                                a: 'Completely. Optimage is a 100% free tool suite. Bulk operations — including ZIP download — cost nothing and require no account. We are funded by non-intrusive advertising.',
                            },
                        ].map(({ q, a }) => (
                            <details
                                key={q}
                                style={{
                                    background: '#ffffff',
                                    border: `1px solid ${c.border}`,
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                }}
                            >
                                <summary style={{
                                    padding: '18px 20px',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    color: c.text,
                                    cursor: 'pointer',
                                    listStyle: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                }}>
                                    {q}
                                </summary>
                                <div style={{
                                    padding: '0 20px 18px',
                                    fontSize: '0.88rem',
                                    color: c.textSecondary,
                                    lineHeight: 1.7,
                                    borderTop: `1px solid ${c.border}`,
                                    paddingTop: '16px',
                                }}>
                                    {a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 8. CTA banner ────────────────────────────────────────────── */}
            <section style={{ padding: '64px 24px' }}>
                <div style={{
                    maxWidth: '680px',
                    margin: '0 auto',
                    background: c.accentLight,
                    borderRadius: '20px',
                    padding: '52px 40px',
                    textAlign: 'center',
                }}>
                    <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)', fontWeight: 800, color: c.text, marginBottom: '12px', letterSpacing: '-0.02em' }}>
                        Process your first batch free
                    </h2>
                    <p style={{ fontSize: '0.97rem', color: c.textSecondary, lineHeight: 1.65, marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px' }}>
                        No account. No file size tricks. Just upload up to 50 images and let Optimage handle the rest.
                    </p>
                    <Link
                        href="/compress"
                        style={{
                            display: 'inline-block',
                            background: c.accent,
                            color: '#ffffff',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            padding: '14px 32px',
                            fontSize: '1rem',
                            fontWeight: 700,
                        }}
                    >
                        Start batch processing →
                    </Link>
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        <Link href="/compress" style={{ fontSize: '0.83rem', color: c.accent, textDecoration: 'none', fontWeight: 500 }}>
                            Bulk compress
                        </Link>
                        <Link href="/convert" style={{ fontSize: '0.83rem', color: c.accent, textDecoration: 'none', fontWeight: 500 }}>
                            Bulk convert
                        </Link>
                        <Link href="/resize" style={{ fontSize: '0.83rem', color: c.accent, textDecoration: 'none', fontWeight: 500 }}>
                            Bulk resize
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
