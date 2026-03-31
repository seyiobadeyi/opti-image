'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    Camera,
    Lock,
    Heart,
    CreditCard,
    Clock,
    Eye,
    Mail,
    Star,
    Zap,
    ArrowRight,
    CheckCircle,
    Image as ImageIcon,
    Globe,
    ChevronRight,
} from 'lucide-react';

// ─── Reusable style tokens ────────────────────────────────────────────────────
const ACCENT = 'var(--accent-primary)';
const ACCENT_SECONDARY = 'var(--accent-secondary)';
const BG_PRIMARY = 'var(--bg-primary)';
const BG_SECONDARY = 'var(--bg-secondary)';
const BG_CARD = 'var(--bg-card)';
const TEXT_PRIMARY = 'var(--text-primary)';
const TEXT_SECONDARY = 'var(--text-secondary)';
const TEXT_MUTED = 'var(--text-muted)';
const BORDER = 'var(--border)';
const SUCCESS = 'var(--success)';

const sectionPadding: React.CSSProperties = {
    paddingTop: 'clamp(64px, 10vw, 120px)',
    paddingBottom: 'clamp(64px, 10vw, 120px)',
};

const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
};

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            style={{
                borderBottom: `1px solid ${BORDER}`,
                cursor: 'pointer',
            }}
            onClick={() => setOpen(!open)}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 0',
                    gap: '16px',
                }}
            >
                <span
                    style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: TEXT_PRIMARY,
                        lineHeight: 1.5,
                    }}
                >
                    {question}
                </span>
                <ChevronRight
                    size={18}
                    color={TEXT_MUTED}
                    style={{
                        flexShrink: 0,
                        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                    }}
                />
            </div>
            {open && (
                <p
                    style={{
                        fontSize: '0.95rem',
                        color: TEXT_SECONDARY,
                        lineHeight: 1.75,
                        paddingBottom: '20px',
                    }}
                >
                    {answer}
                </p>
            )}
        </div>
    );
}

// ─── Feature Block ────────────────────────────────────────────────────────────
function FeatureBlock({
    icon,
    name,
    headline,
    body,
}: {
    icon: React.ReactNode;
    name: string;
    headline: string;
    body: string;
}) {
    return (
        <div
            style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(24px, 3vw, 36px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(108, 92, 231, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {icon}
            </div>
            <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: ACCENT_SECONDARY, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    {name}
                </p>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: TEXT_PRIMARY, lineHeight: 1.35, marginBottom: '8px' }}>
                    {headline}
                </h3>
                <p style={{ fontSize: '0.92rem', color: TEXT_SECONDARY, lineHeight: 1.7 }}>
                    {body}
                </p>
            </div>
        </div>
    );
}

// ─── Step Card ────────────────────────────────────────────────────────────────
function StepCard({
    number,
    title,
    body,
    isLast,
}: {
    number: string;
    title: string;
    body: string;
    isLast?: boolean;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', flex: '1 1 200px', minWidth: '160px', position: 'relative' }}>
            <div
                style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: 'white',
                    flexShrink: 0,
                }}
            >
                {number}
            </div>
            <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: TEXT_PRIMARY, marginBottom: '6px' }}>
                    {title}
                </h4>
                <p style={{ fontSize: '0.88rem', color: TEXT_SECONDARY, lineHeight: 1.65 }}>
                    {body}
                </p>
            </div>
            {!isLast && (
                <div
                    className="step-connector"
                    style={{
                        position: 'absolute',
                        top: '22px',
                        left: '44px',
                        right: '-16px',
                        height: '1px',
                        background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
                        opacity: 0.3,
                    }}
                />
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GalleriesLandingPage() {
    const features = [
        {
            icon: <Clock size={24} color={ACCENT} />,
            name: 'Draft Mode',
            headline: 'Publish when you\'re ready. Not a second earlier.',
            body: 'Create a gallery and upload while you\'re still culling. The client gets the link but sees a \'Gallery being prepared\' screen until you flip it live. No half-finished deliveries, no accidental early access.',
        },
        {
            icon: <Heart size={24} color={ACCENT} />,
            name: 'Client Favourites',
            headline: 'Stop guessing which photos they love.',
            body: 'Clients browse the gallery and tap the heart on every shot they want to keep. When they submit, you get an email: \'Sarah selected 47 photos from Smith Wedding.\' No spreadsheets. No numbered lists on WhatsApp.',
        },
        {
            icon: <CreditCard size={24} color={ACCENT} />,
            name: 'Payment Confirmation',
            headline: 'Deliver the gallery when the invoice is settled.',
            body: 'Set the gallery to require payment confirmation. Your client sees your bank details and payment instructions. Once they\'ve paid and you\'ve confirmed it, one click unlocks the gallery. They get a notification. You keep 100% of the invoice.',
        },
        {
            icon: <Lock size={24} color={ACCENT} />,
            name: 'Access Control',
            headline: 'Decide exactly who can open the gallery.',
            body: 'Public link, PIN-protected, email-list only, or Optimage account required. Switch between them any time. PINs are hashed — not stored in plain text. No brute-force vulnerabilities.',
        },
        {
            icon: <Star size={24} color={ACCENT} />,
            name: 'Photographer Branding',
            headline: 'Your studio name on every gallery page.',
            body: 'Set your studio name, brand colour, and website URL in settings. The gallery footer shows your brand — not ours. The \'Powered by Optimage\' credit stays small. Your clients remember your name.',
        },
        {
            icon: <Eye size={24} color={ACCENT} />,
            name: 'Activity Tracking',
            headline: 'See who\'s opened the gallery and when.',
            body: 'Every gallery view is logged with a timestamp. You\'ll know when your client first opened it, how many times they\'ve been back, and who submitted favourites. Stop wondering if they got the link.',
        },
    ];

    const faqItems = [
        {
            question: 'Do my clients need an Optimage account?',
            answer: 'For public and PIN-protected galleries, no. They just need the link (and PIN if set). For account-gated galleries, they create a free Optimage account — which takes about 20 seconds with email OTP. Downloads and favourites require a free account so activity is tracked properly.',
        },
        {
            question: 'What happens to my photos after I delete a gallery?',
            answer: 'Deleting a gallery removes it from our system and queues the Cloudinary files for deletion. Photos are not retained after a gallery is deleted. We recommend downloading originals before deleting.',
        },
        {
            question: 'Can I watermark the photos in the gallery?',
            answer: 'Watermark mode is on our roadmap. In the meantime, the right-click and drag protection on gallery images means casual copying is blocked. Downloads are button-only.',
        },
        {
            question: 'What file formats can I upload to a gallery?',
            answer: 'JPEG, PNG, WebP, TIFF, and most camera RAW formats (CR2, NEF, ARW, DNG). RAW files are converted to JPEG automatically — we never store the RAW file as it\'s too large for delivery purposes.',
        },
        {
            question: 'Is there a limit on how many photos per gallery?',
            answer: 'The default limit is 500 photos per gallery and 20 galleries per account. For professional photographers who need higher limits, contact us and we\'ll adjust your account directly.',
        },
    ];

    const comparisonRows = [
        { feature: 'Commission on client payments', optimage: '0%', others: 'Up to 15%', optimagGood: true },
        { feature: 'Per-gallery fees', optimage: 'None', others: '$0–12/gallery', optimagGood: true },
        { feature: 'Client favourites / proofing', optimage: 'Included', others: 'Paid tier only', optimagGood: true },
        { feature: 'Photographer branding', optimage: 'Included', others: 'Paid tier only', optimagGood: true },
        { feature: 'Activity tracking', optimage: 'Included', others: 'Paid tier only', optimagGood: true },
        { feature: 'Payment gating', optimage: 'Included', others: 'Not available', optimagGood: true },
    ];

    return (
        <div style={{ background: BG_PRIMARY, color: TEXT_PRIMARY, minHeight: '100vh' }}>
            <style>{`
                @media (max-width: 768px) {
                    .feature-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .problem-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .steps-row {
                        flex-direction: column !important;
                    }
                    .step-connector {
                        display: none !important;
                    }
                    .hero-ctas {
                        flex-direction: column !important;
                        align-items: stretch !important;
                    }
                    .hero-ctas a, .hero-ctas button {
                        text-align: center !important;
                        justify-content: center !important;
                    }
                    .trust-stats {
                        flex-direction: column !important;
                        gap: 16px !important;
                    }
                    .comparison-table th, .comparison-table td {
                        padding: 12px 10px !important;
                        font-size: 0.82rem !important;
                    }
                    .final-cta-btns {
                        flex-direction: column !important;
                        align-items: stretch !important;
                    }
                }
            `}</style>

            <Header />

            {/* ── SECTION 1: HERO ──────────────────────────────────────────── */}
            <section
                style={{
                    background: 'linear-gradient(180deg, #07070d 0%, #0a0a0f 60%, #12121a 100%)',
                    paddingTop: 'clamp(80px, 14vw, 140px)',
                    paddingBottom: 'clamp(64px, 10vw, 120px)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Subtle radial glow */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        top: '-10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '800px',
                        height: '400px',
                        background: 'radial-gradient(ellipse, rgba(108, 92, 231, 0.14) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <div style={{ ...containerStyle, position: 'relative', textAlign: 'center' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 14px',
                            borderRadius: '100px',
                            border: `1px solid ${BORDER}`,
                            background: 'rgba(108, 92, 231, 0.08)',
                            marginBottom: '32px',
                            fontSize: '0.82rem',
                            fontWeight: 500,
                            color: ACCENT_SECONDARY,
                            letterSpacing: '0.03em',
                        }}
                    >
                        <Camera size={14} color={ACCENT} />
                        Gallery Delivery for Photographers
                    </div>

                    <h1
                        style={{
                            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            lineHeight: 1.08,
                            color: TEXT_PRIMARY,
                            maxWidth: '820px',
                            margin: '0 auto 24px',
                        }}
                    >
                        Deliver galleries your clients
                        <br />
                        <span
                            style={{
                                background: 'var(--gradient-primary)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            will come back to.
                        </span>
                    </h1>

                    <p
                        style={{
                            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                            color: TEXT_SECONDARY,
                            lineHeight: 1.7,
                            maxWidth: '620px',
                            margin: '0 auto 40px',
                        }}
                    >
                        Professional photo delivery with client proofing, payment confirmation,
                        and access control — all under one subscription. No commissions. No extra fees.
                    </p>

                    <div
                        className="hero-ctas"
                        style={{
                            display: 'flex',
                            gap: '16px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '64px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Link
                            href="/dashboard"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 28px',
                                borderRadius: '100px',
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1rem',
                                textDecoration: 'none',
                                boxShadow: '0 0 24px rgba(108, 92, 231, 0.35)',
                            }}
                        >
                            Start delivering
                            <ArrowRight size={16} />
                        </Link>
                        <a
                            href="#features"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 28px',
                                borderRadius: '100px',
                                border: `1px solid ${BORDER}`,
                                background: 'transparent',
                                color: TEXT_PRIMARY,
                                fontWeight: 600,
                                fontSize: '1rem',
                                textDecoration: 'none',
                            }}
                        >
                            See the features
                            <ChevronRight size={16} />
                        </a>
                    </div>

                    {/* Trust stats */}
                    <div
                        className="trust-stats"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '40px',
                            flexWrap: 'wrap',
                        }}
                    >
                        {[
                            { icon: <Zap size={16} color={ACCENT} />, label: 'WebP delivery by default' },
                            { icon: <CheckCircle size={16} color={SUCCESS} />, label: 'Zero commission on your sales' },
                            { icon: <Star size={16} color={ACCENT_SECONDARY} />, label: 'Your branding, not ours' },
                        ].map(({ icon, label }) => (
                            <div
                                key={label}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.88rem',
                                    color: TEXT_SECONDARY,
                                    fontWeight: 500,
                                }}
                            >
                                {icon}
                                {label}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECTION 2: THE PROBLEM ───────────────────────────────────── */}
            <section style={{ ...sectionPadding, background: BG_SECONDARY }}>
                <div style={containerStyle}>
                    <h2
                        style={{
                            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.2,
                            color: TEXT_PRIMARY,
                            maxWidth: '720px',
                            marginBottom: 'clamp(40px, 6vw, 64px)',
                        }}
                    >
                        Most photographers deliver photos the way people send files in 2012.
                    </h2>

                    <div
                        className="problem-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px',
                        }}
                    >
                        {[
                            {
                                icon: <Globe size={22} color={TEXT_MUTED} />,
                                title: 'Google Drive links',
                                body: 'They expire. Clients can\'t find them. The download experience is embarrassing compared to the quality of your work.',
                            },
                            {
                                icon: <Mail size={22} color={TEXT_MUTED} />,
                                title: 'WhatsApp feedback loops',
                                body: 'You deliver 300 photos. The client says \'I like the ones with the trees.\' You spend 45 minutes figuring out which ones.',
                            },
                            {
                                icon: <CreditCard size={22} color={TEXT_MUTED} />,
                                title: 'Platforms that take a cut',
                                body: 'You deliver the work. You invoice the client. Then a third platform takes 15% of that invoice for hosting the gallery. That\'s not a partnership.',
                            },
                        ].map(({ icon, title, body }) => (
                            <div
                                key={title}
                                style={{
                                    background: BG_CARD,
                                    border: `1px solid ${BORDER}`,
                                    borderRadius: 'var(--radius-xl)',
                                    padding: 'clamp(24px, 3vw, 32px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                }}
                            >
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'rgba(255,255,255,0.04)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {icon}
                                </div>
                                <h3
                                    style={{
                                        fontSize: '1.05rem',
                                        fontWeight: 700,
                                        color: TEXT_PRIMARY,
                                    }}
                                >
                                    {title}
                                </h3>
                                <p style={{ fontSize: '0.92rem', color: TEXT_SECONDARY, lineHeight: 1.7 }}>
                                    {body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: SOLUTION INTRODUCTION ────────────────────────── */}
            <section style={{ ...sectionPadding, background: BG_PRIMARY }}>
                <div style={{ ...containerStyle, textAlign: 'center' }}>
                    <h2
                        style={{
                            fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            lineHeight: 1.1,
                            color: TEXT_PRIMARY,
                            maxWidth: '760px',
                            margin: '0 auto 24px',
                        }}
                    >
                        You already edited the photos.
                        <br />
                        <span
                            style={{
                                background: 'var(--gradient-accent)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            The delivery should take 3 minutes.
                        </span>
                    </h2>
                    <p
                        style={{
                            fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                            color: TEXT_SECONDARY,
                            lineHeight: 1.75,
                            maxWidth: '620px',
                            margin: '0 auto',
                        }}
                    >
                        Upload your edited photos, set your access settings, copy the link, and send it. That's the whole process. Everything else — reminders, proofing, notifications, branding — runs automatically.
                    </p>
                </div>
            </section>

            {/* ── SECTION 4: FEATURE DEEP DIVE ────────────────────────────── */}
            <section id="features" style={{ ...sectionPadding, background: BG_SECONDARY }}>
                <div style={containerStyle}>
                    <div style={{ marginBottom: 'clamp(40px, 6vw, 64px)' }}>
                        <h2
                            style={{
                                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                color: TEXT_PRIMARY,
                                lineHeight: 1.2,
                                maxWidth: '600px',
                            }}
                        >
                            Every tool a working photographer actually needs.
                        </h2>
                    </div>

                    <div
                        className="feature-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '20px',
                        }}
                    >
                        {features.map((f) => (
                            <FeatureBlock key={f.name} {...f} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECTION 5: HOW IT WORKS ──────────────────────────────────── */}
            <section style={{ ...sectionPadding, background: BG_PRIMARY }}>
                <div style={containerStyle}>
                    <h2
                        style={{
                            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            color: TEXT_PRIMARY,
                            lineHeight: 1.2,
                            marginBottom: 'clamp(40px, 6vw, 64px)',
                        }}
                    >
                        From upload to client in under 5 minutes.
                    </h2>

                    <div
                        className="steps-row"
                        style={{
                            display: 'flex',
                            gap: '32px',
                            alignItems: 'flex-start',
                        }}
                    >
                        <StepCard
                            number="1"
                            title="Create"
                            body="Open your dashboard, create a new gallery, set the title and access type. Takes 30 seconds."
                        />
                        <StepCard
                            number="2"
                            title="Upload"
                            body="Drag in your edited JPEGs or WebPs. We store them in your private Cloudinary folder. Originals preserved."
                        />
                        <StepCard
                            number="3"
                            title="Send"
                            body="Click 'Send to client', enter their email. They get a branded delivery email with the gallery link."
                        />
                        <StepCard
                            number="4"
                            title="Deliver"
                            body="Toggle the gallery live when you're ready. Client views, picks favourites, downloads. You get notified at every step."
                            isLast
                        />
                    </div>
                </div>
            </section>

            {/* ── SECTION 6: PRICING CONTEXT ───────────────────────────────── */}
            <section style={{ ...sectionPadding, background: BG_SECONDARY }}>
                <div style={containerStyle}>
                    <h2
                        style={{
                            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            color: TEXT_PRIMARY,
                            lineHeight: 1.2,
                            marginBottom: '32px',
                        }}
                    >
                        Everything in one subscription. No surprises.
                    </h2>

                    {/* Pricing card */}
                    <div
                        style={{
                            background: BG_CARD,
                            border: `1px solid ${BORDER}`,
                            borderRadius: 'var(--radius-xl)',
                            padding: 'clamp(28px, 4vw, 48px)',
                            marginBottom: '32px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                        }}
                    >
                        <p
                            style={{
                                fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                                color: TEXT_SECONDARY,
                                lineHeight: 1.8,
                                maxWidth: '780px',
                            }}
                        >
                            Gallery delivery is included in every Optimage subscription — the same subscription that handles your image compression, format conversion, and video transcription. You're not paying per gallery, per client, or per photo delivered. One flat rate. Everything included.
                        </p>
                        <div>
                            <Link
                                href="/pricing"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 24px',
                                    borderRadius: '100px',
                                    background: 'var(--gradient-primary)',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    textDecoration: 'none',
                                }}
                            >
                                See pricing
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </div>

                    {/* Comparison table */}
                    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-xl)', border: `1px solid ${BORDER}` }}>
                        <table
                            className="comparison-table"
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: '0.92rem',
                                background: BG_CARD,
                            }}
                        >
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                                    <th
                                        style={{
                                            textAlign: 'left',
                                            padding: '16px 24px',
                                            color: TEXT_MUTED,
                                            fontWeight: 600,
                                            fontSize: '0.82rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.06em',
                                            width: '50%',
                                        }}
                                    >
                                        Feature
                                    </th>
                                    <th
                                        style={{
                                            textAlign: 'center',
                                            padding: '16px 24px',
                                            color: ACCENT_SECONDARY,
                                            fontWeight: 700,
                                            fontSize: '0.88rem',
                                        }}
                                    >
                                        Optimage
                                    </th>
                                    <th
                                        style={{
                                            textAlign: 'center',
                                            padding: '16px 24px',
                                            color: TEXT_MUTED,
                                            fontWeight: 600,
                                            fontSize: '0.88rem',
                                        }}
                                    >
                                        Others
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row, i) => (
                                    <tr
                                        key={row.feature}
                                        style={{
                                            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                                            borderBottom: i < comparisonRows.length - 1 ? `1px solid ${BORDER}` : 'none',
                                        }}
                                    >
                                        <td style={{ padding: '14px 24px', color: TEXT_PRIMARY, fontWeight: 500 }}>
                                            {row.feature}
                                        </td>
                                        <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    color: SUCCESS,
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                }}
                                            >
                                                <CheckCircle size={14} color={SUCCESS} />
                                                {row.optimage}
                                            </span>
                                        </td>
                                        <td
                                            style={{
                                                padding: '14px 24px',
                                                textAlign: 'center',
                                                color: TEXT_MUTED,
                                                fontSize: '0.88rem',
                                            }}
                                        >
                                            — {row.others}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── SECTION 7: FAQ ───────────────────────────────────────────── */}
            <section style={{ ...sectionPadding, background: BG_PRIMARY }}>
                <div style={containerStyle}>
                    <h2
                        style={{
                            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            color: TEXT_PRIMARY,
                            lineHeight: 1.2,
                            marginBottom: 'clamp(32px, 5vw, 56px)',
                        }}
                    >
                        Questions we get asked.
                    </h2>

                    <div style={{ maxWidth: '760px', borderTop: `1px solid ${BORDER}` }}>
                        {faqItems.map((item) => (
                            <FaqItem
                                key={item.question}
                                question={item.question}
                                answer={item.answer}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SECTION 8: FINAL CTA ─────────────────────────────────────── */}
            <section
                style={{
                    ...sectionPadding,
                    background: 'linear-gradient(180deg, #0a0a0f 0%, #07070d 100%)',
                    borderTop: `1px solid ${BORDER}`,
                    textAlign: 'center',
                }}
            >
                <div style={containerStyle}>
                    {/* Decorative icon cluster */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '16px',
                            marginBottom: '32px',
                        }}
                    >
                        {[
                            <ImageIcon key="img" size={20} color={ACCENT} />,
                            <Heart key="heart" size={20} color={ACCENT} />,
                            <Lock key="lock" size={20} color={ACCENT} />,
                        ]}
                    </div>

                    <h2
                        style={{
                            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            lineHeight: 1.15,
                            color: TEXT_PRIMARY,
                            maxWidth: '680px',
                            margin: '0 auto 16px',
                        }}
                    >
                        The next gallery you deliver should feel different.
                    </h2>

                    <p
                        style={{
                            fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                            color: TEXT_SECONDARY,
                            lineHeight: 1.7,
                            marginBottom: '40px',
                        }}
                    >
                        Set up your first gallery in under 5 minutes.
                    </p>

                    <div
                        className="final-cta-btns"
                        style={{
                            display: 'flex',
                            gap: '16px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginBottom: '24px',
                        }}
                    >
                        <Link
                            href="/dashboard"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 28px',
                                borderRadius: '100px',
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1rem',
                                textDecoration: 'none',
                                boxShadow: '0 0 32px rgba(108, 92, 231, 0.4)',
                            }}
                        >
                            Create a gallery
                            <ArrowRight size={16} />
                        </Link>
                        <Link
                            href="/pricing"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 28px',
                                borderRadius: '100px',
                                border: `1px solid ${BORDER}`,
                                background: 'transparent',
                                color: TEXT_PRIMARY,
                                fontWeight: 600,
                                fontSize: '1rem',
                                textDecoration: 'none',
                            }}
                        >
                            View pricing
                        </Link>
                    </div>

                    <p
                        style={{
                            fontSize: '0.8rem',
                            color: TEXT_MUTED,
                            lineHeight: 1.6,
                        }}
                    >
                        Requires an active Optimage subscription. 14-day trial available.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
