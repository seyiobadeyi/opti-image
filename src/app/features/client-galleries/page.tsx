import type { Metadata } from 'next';
import Link from 'next/link';
import {
    Lock,
    Clock,
    Download,
    Droplets,
    Smartphone,
    Share2,
    CheckCircle,
    ChevronRight,
    Users,
    Image as ImageIcon,
    FolderOpen,
    Shield,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { c } from '@/lib/colors';

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
    title: 'Free Client Photo Galleries for Photographers',
    description:
        'Optimage gives photographers free private client galleries with PIN protection, custom expiry dates, and download controls — no Pixieset subscription needed.',
    keywords: [
        'client photo gallery',
        'photo delivery for photographers',
        'private photo gallery',
        'PIN protected gallery',
        'free photo gallery for photographers',
        'Pixieset alternative',
        'ShootProof alternative',
        'photo delivery software',
        'online photo gallery',
    ],
    openGraph: {
        title: 'Free Client Photo Galleries for Photographers | Optimage',
        description:
            'Deliver photos to clients in a private, PIN-protected gallery — free forever. No Pixieset subscription, no per-gallery fees.',
        url: 'https://optimage.dreamintrepid.com/features/client-galleries',
        siteName: 'Optimage',
        type: 'website',
        images: [
            {
                url: 'https://optimage.dreamintrepid.com/og-client-galleries.jpg',
                width: 1200,
                height: 630,
                alt: 'Optimage client photo gallery delivery',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Client Photo Galleries for Photographers | Optimage',
        description:
            'Deliver photos to clients in a private, PIN-protected gallery — free forever.',
    },
    alternates: {
        canonical: 'https://optimage.dreamintrepid.com/features/client-galleries',
    },
};

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebPage',
            '@id': 'https://optimage.dreamintrepid.com/features/client-galleries',
            url: 'https://optimage.dreamintrepid.com/features/client-galleries',
            name: 'Free Client Photo Galleries for Photographers | Optimage',
            description:
                'Optimage gives photographers free private client galleries with PIN protection, custom expiry dates, and download controls — no Pixieset subscription needed.',
            isPartOf: {
                '@type': 'WebSite',
                name: 'Optimage',
                url: 'https://optimage.dreamintrepid.com',
            },
            breadcrumb: {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://optimage.dreamintrepid.com' },
                    { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://optimage.dreamintrepid.com/features' },
                    { '@type': 'ListItem', position: 3, name: 'Client Galleries', item: 'https://optimage.dreamintrepid.com/features/client-galleries' },
                ],
            },
        },
        {
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: 'Is the client gallery feature free?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes. Client galleries are free on Optimage with no monthly subscription and no per-gallery fees. You can create unlimited galleries and share them with your clients at no cost.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Can I password-protect my gallery?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes. Every gallery supports PIN protection built in. You set a PIN when creating the gallery, then share it with your client separately so only they can access the photos.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Can clients download the original full-resolution photos?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'You decide. Optimage lets you enable or disable downloads per gallery, and choose whether clients can download all photos or only the ones you select. Full-resolution originals are preserved.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'How long do galleries stay active?',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'You set the expiry date when creating the gallery. Galleries can be set to expire after a number of days or on a specific date. After expiry, the link stops working automatically.',
                    },
                },
            ],
        },
    ],
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
    {
        icon: Lock,
        title: 'PIN-protected access',
        desc: 'Set a PIN for every gallery. Only clients with the code can view your photos.',
    },
    {
        icon: Clock,
        title: 'Custom expiry dates',
        desc: 'Galleries expire automatically on the date you choose — no manual cleanup needed.',
    },
    {
        icon: Download,
        title: 'Download controls',
        desc: 'Let clients download all photos, a selection only, or disable downloads entirely.',
    },
    {
        icon: Droplets,
        title: 'Watermark protection',
        desc: 'Add a text watermark to the preview images so clients cannot save unpaid proofs.',
    },
    {
        icon: Smartphone,
        title: 'Mobile-friendly viewing',
        desc: 'Galleries look great on any screen — phone, tablet, or desktop — no app required.',
    },
    {
        icon: Share2,
        title: 'Direct client link sharing',
        desc: 'Copy the gallery link and send it by email, WhatsApp, or any channel you prefer.',
    },
];

const steps = [
    {
        number: '1',
        title: 'Create your gallery',
        desc: 'Go to your Optimage dashboard and create a new client gallery. Give it a name, set a PIN, and choose your expiry date.',
    },
    {
        number: '2',
        title: 'Upload your photos',
        desc: 'Upload the edited photos directly to the gallery. Batch upload supported — drop hundreds of images at once.',
    },
    {
        number: '3',
        title: 'Share the PIN-protected link',
        desc: 'Copy the gallery link and send it to your client. Share the PIN separately by email or message.',
    },
    {
        number: '4',
        title: 'Client browses and downloads',
        desc: 'Your client opens the gallery in their browser, views every photo, and downloads the ones they love — at full resolution.',
    },
];

const comparisonRows = [
    {
        feature: 'Cost',
        optimage: 'Free forever',
        pixieset: 'Free tier (limited)',
        shootproof: 'From $10/month',
        optimageBest: true,
    },
    {
        feature: 'Galleries included',
        optimage: 'Unlimited',
        pixieset: '3 galleries',
        shootproof: 'Unlimited (paid)',
        optimageBest: true,
    },
    {
        feature: 'Photos per gallery',
        optimage: 'Unlimited',
        pixieset: '500 photos',
        shootproof: 'Unlimited (paid)',
        optimageBest: true,
    },
    {
        feature: 'PIN protection',
        optimage: 'Built in, free',
        pixieset: 'Paid plans only',
        shootproof: 'Paid plans only',
        optimageBest: true,
    },
    {
        feature: 'Custom expiry dates',
        optimage: 'Yes',
        pixieset: 'No',
        shootproof: 'Paid plans only',
        optimageBest: true,
    },
    {
        feature: 'Watermark on proofs',
        optimage: 'Yes',
        pixieset: 'Yes',
        shootproof: 'Yes',
        optimageBest: false,
    },
];

const faqs = [
    {
        q: 'Is the client gallery feature free?',
        a: 'Yes. Client galleries are free on Optimage with no monthly subscription and no per-gallery fees. You can create unlimited galleries and share them with your clients at no cost.',
    },
    {
        q: 'Can I password-protect my gallery?',
        a: 'Yes. Every gallery supports PIN protection built in. You set a PIN when creating the gallery, then share it with your client separately so only they can access the photos.',
    },
    {
        q: 'Can clients download the original full-resolution photos?',
        a: 'You decide. Optimage lets you enable or disable downloads per gallery, and choose whether clients can download all photos or only the ones you select. Full-resolution originals are preserved.',
    },
    {
        q: 'How long do galleries stay active?',
        a: 'You set the expiry date when creating the gallery. Galleries can be set to expire after a number of days or on a specific date. After expiry, the link stops working automatically.',
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClientGalleriesPage(): React.JSX.Element {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div style={{ minHeight: '100vh', background: '#fff', color: c.text, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                <Header />

                {/* ── Hero ──────────────────────────────────────────────────────── */}
                <section style={{ maxWidth: '760px', margin: '0 auto', padding: '72px 24px 56px', textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: 'clamp(1.9rem, 5vw, 2.8rem)',
                        fontWeight: 800,
                        color: c.text,
                        letterSpacing: '-0.025em',
                        lineHeight: 1.15,
                        marginBottom: '20px',
                    }}>
                        Deliver photos to clients in a private, branded gallery — free
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: c.textSecondary, lineHeight: 1.7, marginBottom: '36px', maxWidth: '600px', margin: '0 auto 36px' }}>
                        Create PIN-protected galleries in seconds. Set download controls, add expiry dates, and share a single link — no subscription required.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link
                            href="/dashboard/galleries"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: c.accent,
                                color: '#fff',
                                padding: '14px 28px',
                                borderRadius: '12px',
                                fontWeight: 700,
                                fontSize: '1rem',
                                textDecoration: 'none',
                                transition: 'background 0.15s',
                            }}
                        >
                            Create your first gallery <ChevronRight size={16} />
                        </Link>
                        <a
                            href="#how-it-works"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '14px 28px',
                                borderRadius: '12px',
                                border: `1.5px solid ${c.border}`,
                                color: c.textSecondary,
                                fontWeight: 600,
                                fontSize: '1rem',
                                textDecoration: 'none',
                            }}
                        >
                            See how it works
                        </a>
                    </div>
                </section>

                {/* ── Trust bar ─────────────────────────────────────────────────── */}
                <section style={{
                    borderTop: `1px solid ${c.border}`,
                    borderBottom: `1px solid ${c.border}`,
                    background: c.bgSubtle,
                }}>
                    <div style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        padding: '16px 24px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '32px',
                        flexWrap: 'wrap',
                    }}>
                        {[
                            { icon: CheckCircle, label: 'Free forever' },
                            { icon: Shield, label: 'No Pixieset subscription' },
                            { icon: Lock, label: 'PIN protection built in' },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600, color: c.textSecondary }}>
                                <Icon size={15} color={c.accent} />
                                {label}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Feature grid ──────────────────────────────────────────────── */}
                <section style={{ maxWidth: '1080px', margin: '0 auto', padding: '80px 24px' }}>
                    <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: c.text, textAlign: 'center', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                        Everything you need to deliver photos professionally
                    </h2>
                    <p style={{ textAlign: 'center', color: c.textSecondary, fontSize: '1rem', marginBottom: '52px', maxWidth: '540px', margin: '0 auto 52px' }}>
                        Built for photographers who want a clean, reliable client experience — without paying for a platform just to share files.
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px',
                    }}>
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                style={{
                                    padding: '28px 24px',
                                    border: `1px solid ${c.border}`,
                                    borderRadius: '16px',
                                    background: '#fff',
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
                                    <Icon size={20} color={c.accent} />
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: c.text, marginBottom: '8px' }}>
                                    {title}
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: c.textSecondary, lineHeight: 1.65, margin: 0 }}>
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── How it works ──────────────────────────────────────────────── */}
                <section id="how-it-works" style={{ background: c.bgSubtle, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
                    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '80px 24px' }}>
                        <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: c.text, textAlign: 'center', marginBottom: '52px', letterSpacing: '-0.02em' }}>
                            How it works
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {steps.map((step, i) => (
                                <div
                                    key={step.number}
                                    style={{
                                        display: 'flex',
                                        gap: '24px',
                                        alignItems: 'flex-start',
                                        paddingBottom: i < steps.length - 1 ? '40px' : '0',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Step line */}
                                    {i < steps.length - 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '21px',
                                            top: '44px',
                                            bottom: '0',
                                            width: '2px',
                                            background: c.border,
                                        }} />
                                    )}

                                    {/* Number circle */}
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        background: c.accent,
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '1rem',
                                        flexShrink: 0,
                                        zIndex: 1,
                                        position: 'relative',
                                    }}>
                                        {step.number}
                                    </div>

                                    <div style={{ paddingTop: '10px' }}>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: c.text, marginBottom: '6px' }}>
                                            {step.title}
                                        </h3>
                                        <p style={{ fontSize: '0.92rem', color: c.textSecondary, lineHeight: 1.65, margin: 0 }}>
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Comparison ────────────────────────────────────────────────── */}
                <section style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px' }}>
                    <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: c.text, textAlign: 'center', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                        Free alternative to Pixieset and ShootProof
                    </h2>
                    <p style={{ textAlign: 'center', color: c.textSecondary, fontSize: '0.95rem', marginBottom: '44px', maxWidth: '540px', margin: '0 auto 44px' }}>
                        Optimage delivers the core features photographers need — without the monthly subscription that eats into your revenue.
                    </p>

                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '520px' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '12px 16px', color: c.textMuted, fontWeight: 600, fontSize: '0.8rem', borderBottom: `2px solid ${c.border}` }}>
                                        Feature
                                    </th>
                                    <th style={{ padding: '12px 16px', background: c.accentLight, color: c.accent, fontWeight: 800, fontSize: '0.88rem', borderBottom: `2px solid ${c.accent}`, borderRadius: '8px 8px 0 0', textAlign: 'center' }}>
                                        Optimage
                                    </th>
                                    <th style={{ padding: '12px 16px', color: c.textSecondary, fontWeight: 600, fontSize: '0.88rem', borderBottom: `2px solid ${c.border}`, textAlign: 'center' }}>
                                        Pixieset free
                                    </th>
                                    <th style={{ padding: '12px 16px', color: c.textSecondary, fontWeight: 600, fontSize: '0.88rem', borderBottom: `2px solid ${c.border}`, textAlign: 'center' }}>
                                        ShootProof
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row, i) => (
                                    <tr key={row.feature} style={{ background: i % 2 === 0 ? '#fff' : c.bgSubtle }}>
                                        <td style={{ padding: '13px 16px', color: c.textSecondary, fontWeight: 500, borderBottom: `1px solid ${c.border}` }}>
                                            {row.feature}
                                        </td>
                                        <td style={{
                                            padding: '13px 16px',
                                            background: row.optimageBest ? c.accentLight : undefined,
                                            color: row.optimageBest ? c.accent : c.text,
                                            fontWeight: row.optimageBest ? 700 : 500,
                                            borderBottom: `1px solid ${c.border}`,
                                            borderLeft: `2px solid ${c.accent}`,
                                            borderRight: `2px solid ${c.accent}`,
                                            textAlign: 'center',
                                        }}>
                                            {row.optimageBest && (
                                                <CheckCircle size={13} color={c.accent} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                                            )}
                                            {row.optimage}
                                        </td>
                                        <td style={{ padding: '13px 16px', color: c.textSecondary, borderBottom: `1px solid ${c.border}`, textAlign: 'center' }}>
                                            {row.pixieset}
                                        </td>
                                        <td style={{ padding: '13px 16px', color: c.textSecondary, borderBottom: `1px solid ${c.border}`, textAlign: 'center' }}>
                                            {row.shootproof}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: c.textMuted, textAlign: 'center', marginTop: '16px' }}>
                        Comparison based on publicly listed plans as of 2025. Verify current pricing on each provider&apos;s website.
                    </p>
                </section>

                {/* ── Testimonial ───────────────────────────────────────────────── */}
                <section style={{ background: c.bgSubtle, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
                    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '72px 24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <div style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '50%',
                                background: c.bgMuted,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Users size={22} color={c.textMuted} />
                            </div>
                        </div>
                        <blockquote style={{ margin: 0, padding: 0 }}>
                            <p style={{
                                fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
                                color: c.text,
                                lineHeight: 1.7,
                                fontStyle: 'italic',
                                marginBottom: '20px',
                            }}>
                                &ldquo;I was paying $15 a month for Pixieset just to get PIN protection on my galleries. Switched to Optimage and the whole thing is free. My clients say the experience is cleaner too.&rdquo;
                            </p>
                            <footer>
                                <cite style={{ fontSize: '0.88rem', fontStyle: 'normal', color: c.textSecondary, fontWeight: 600 }}>
                                    Sarah M., wedding photographer — Portland, OR
                                </cite>
                            </footer>
                        </blockquote>
                    </div>
                </section>

                {/* ── FAQ ───────────────────────────────────────────────────────── */}
                <section style={{ maxWidth: '700px', margin: '0 auto', padding: '80px 24px' }}>
                    <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: c.text, marginBottom: '40px', letterSpacing: '-0.02em' }}>
                        Frequently asked questions
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {faqs.map((faq, i) => (
                            <details
                                key={faq.q}
                                style={{
                                    borderTop: `1px solid ${c.border}`,
                                    borderBottom: i === faqs.length - 1 ? `1px solid ${c.border}` : 'none',
                                }}
                            >
                                <summary style={{
                                    padding: '20px 0',
                                    fontSize: '0.97rem',
                                    fontWeight: 700,
                                    color: c.text,
                                    cursor: 'pointer',
                                    listStyle: 'none',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    userSelect: 'none',
                                }}>
                                    {faq.q}
                                    <ChevronRight size={16} color={c.textMuted} style={{ flexShrink: 0, marginLeft: '12px', transition: 'transform 0.2s' }} />
                                </summary>
                                <p style={{
                                    fontSize: '0.92rem',
                                    color: c.textSecondary,
                                    lineHeight: 1.7,
                                    paddingBottom: '20px',
                                    margin: 0,
                                }}>
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* ── CTA banner ────────────────────────────────────────────────── */}
                <section style={{
                    background: c.bgSubtle,
                    borderTop: `1px solid ${c.border}`,
                }}>
                    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '72px 24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                background: c.accentLight,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <FolderOpen size={26} color={c.accent} />
                            </div>
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: c.text, marginBottom: '14px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                            Start delivering photos to clients today — it&apos;s free
                        </h2>
                        <p style={{ color: c.textSecondary, fontSize: '1rem', lineHeight: 1.65, marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
                            No credit card. No subscription. Create your first client gallery in under two minutes.
                        </p>
                        <Link
                            href="/dashboard/galleries"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: c.accent,
                                color: '#fff',
                                padding: '16px 36px',
                                borderRadius: '14px',
                                fontWeight: 700,
                                fontSize: '1.05rem',
                                textDecoration: 'none',
                            }}
                        >
                            Create your free gallery <ChevronRight size={18} />
                        </Link>

                        {/* Internal links */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '36px', flexWrap: 'wrap' }}>
                            {[
                                { href: '/galleries', label: 'Browse all galleries' },
                                { href: '/compress', label: 'Compress photos' },
                                { href: '/watermark', label: 'Add a watermark' },
                            ].map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    style={{
                                        fontSize: '0.88rem',
                                        color: c.textSecondary,
                                        textDecoration: 'underline',
                                        textUnderlineOffset: '3px',
                                    }}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Related tools micro-nav ───────────────────────────────────── */}
                <section style={{ borderTop: `1px solid ${c.border}` }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
                        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '20px', textAlign: 'center' }}>
                            More tools for photographers
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {[
                                { href: '/compress', icon: ImageIcon, label: 'Compress images' },
                                { href: '/watermark', icon: Droplets, label: 'Add watermarks' },
                                { href: '/resize', label: 'Resize images', icon: Smartphone },
                                { href: '/galleries', icon: FolderOpen, label: 'Client galleries' },
                            ].map(({ href, icon: Icon, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '7px',
                                        padding: '9px 16px',
                                        border: `1.5px solid ${c.border}`,
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        color: c.textSecondary,
                                        textDecoration: 'none',
                                        background: '#fff',
                                    }}
                                >
                                    <Icon size={14} color={c.accent} />
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>

            <style>{`
                details[open] > summary > svg {
                    transform: rotate(90deg);
                }
                @media (max-width: 600px) {
                    table { font-size: 0.82rem; }
                }
            `}</style>
        </>
    );
}
