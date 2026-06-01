'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Minimize2, RefreshCw, Crop, RotateCcw, Sparkles, ShieldOff,
    Camera, Layers, ChevronRight, ImagePlus, Type,
    Maximize2, Scissors, Image, ZoomIn, ArrowRight,
    CheckCircle, Zap, Globe,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { c } from '@/lib/colors';

// ── Tool definitions ──────────────────────────────────────────────────────

type Category = 'all' | 'optimize' | 'convert' | 'deliver';

interface Tool {
    name: string;
    desc: string;
    href: string;
    Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
    iconBg: string;
    iconColor: string;
    category: Category[];
    badge?: string;
    soon?: boolean;
}

const IC = { bg: c.accentLight, color: c.accent };

const TOOLS: Tool[] = [
    {
        name: 'Compress Images',
        desc: 'Shrink photos by up to 90% with no visible quality loss. Works with JPG, PNG, WebP, AVIF and more.',
        href: '/compress',
        Icon: Minimize2,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'optimize'],
        badge: 'Popular',
    },
    {
        name: 'Resize Images',
        desc: 'Set exact pixel dimensions or scale images up and down while keeping them sharp.',
        href: '/resize',
        Icon: Crop,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
    },
    {
        name: 'Convert Format',
        desc: 'Turn any image into WebP, AVIF, JPEG or PNG. The format your project actually needs.',
        href: '/convert',
        Icon: RefreshCw,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
    },
    {
        name: 'Flip & Rotate',
        desc: 'Mirror images horizontally or vertically, rotate to any angle in one click.',
        href: '/rotate',
        Icon: RotateCcw,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
    },
    {
        name: 'Auto Enhance',
        desc: 'Automatically correct colours, contrast and brightness so photos look their best.',
        href: '/enhance',
        Icon: Sparkles,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'optimize'],
    },
    {
        name: 'Remove Metadata',
        desc: 'Strip hidden camera data like GPS location and device info before you share.',
        href: '/metadata',
        Icon: ShieldOff,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'optimize'],
    },
    {
        name: 'Client Galleries',
        desc: 'Deliver your work in private, PIN-protected galleries with download controls.',
        href: '/dashboard?tab=galleries',
        Icon: Camera,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'deliver'],
        badge: 'New',
    },
    {
        name: 'Batch Process',
        desc: 'Upload up to 50 images at once and apply all settings in a single click.',
        href: '/compress',
        Icon: Layers,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'optimize'],
    },
    {
        name: 'Crop Image',
        desc: 'Trim your images to a specific area or aspect ratio. Portrait, landscape or square.',
        href: '/crop',
        Icon: Scissors,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
        soon: true,
    },
    {
        name: 'Upscale Image',
        desc: 'Increase image resolution without blurring. Great for low-res photos and icons.',
        href: '/upscale',
        Icon: ZoomIn,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'optimize'],
        soon: true,
    },
    {
        name: 'Remove Background',
        desc: 'Instantly cut out backgrounds from product photos, portraits and logos.',
        href: '/remove-bg',
        Icon: ImagePlus,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
        soon: true,
    },
    {
        name: 'Add Watermark',
        desc: 'Protect your images with a custom text or logo watermark before sharing.',
        href: '/watermark',
        Icon: Type,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
        soon: true,
    },
    {
        name: 'Photo Editor',
        desc: 'Fine-tune brightness, contrast, saturation and apply filters to any image.',
        href: '/editor',
        Icon: Image,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
        soon: true,
    },
    {
        name: 'Increase Size',
        desc: 'Export images at a larger canvas size or higher DPI for print-ready output.',
        href: '/increase-size',
        Icon: Maximize2,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
        soon: true,
    },
];

const CATEGORIES: { id: Category; label: string }[] = [
    { id: 'all',      label: 'All tools' },
    { id: 'optimize', label: 'Optimize' },
    { id: 'convert',  label: 'Convert & Edit' },
    { id: 'deliver',  label: 'Deliver' },
];

// ── Styles ────────────────────────────────────────────────────────────────

const S: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        background: '#fff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: c.gray900,
    },
    hero: {
        textAlign: 'center',
        padding: '72px 24px 44px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    h1: {
        fontSize: 'clamp(2rem, 5vw, 3.2rem)',
        fontWeight: 800,
        color: c.gray900,
        marginBottom: '18px',
        letterSpacing: '-0.025em',
        lineHeight: 1.12,
    },
    heroSub: {
        color: c.gray500,
        fontSize: '1.1rem',
        lineHeight: 1.7,
        maxWidth: '580px',
        margin: '0 auto',
    },
    catRow: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        padding: '0 24px 44px',
        flexWrap: 'wrap',
    },
    grid: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
        gap: '16px',
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '22px',
        background: '#fff',
        border: `1px solid ${c.gray200}`,
        borderRadius: '16px',
        textDecoration: 'none',
        color: c.gray900,
        transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
        position: 'relative',
        overflow: 'hidden',
    },
    iconWrap: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    toolName:  { fontWeight: 700, fontSize: '0.97rem', color: c.gray900, marginBottom: '4px' },
    toolDesc:  { color: c.gray500, fontSize: '0.85rem', lineHeight: 1.55 },
    arrow: {
        marginTop: 'auto',
        paddingTop: '10px',
        color: c.accent,
        fontSize: '0.82rem',
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        fontWeight: 600,
    },
    popBadge: {
        position: 'absolute',
        top: '14px',
        right: '14px',
        background: c.accent,
        color: '#fff',
        fontSize: '0.6rem',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '100px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    soonBadge: {
        position: 'absolute',
        top: '14px',
        right: '14px',
        background: c.gray100,
        color: c.gray500,
        fontSize: '0.6rem',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '100px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    // ── "Work your way" section ──────────────────────────────────────────
    featureSection: {
        background: c.gray50,
        borderTop: `1px solid ${c.gray200}`,
        borderBottom: `1px solid ${c.gray200}`,
        padding: '72px 24px',
    },
    featureInner: {
        maxWidth: '1100px',
        margin: '0 auto',
    },
    sectionTitle: {
        fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
        fontWeight: 800,
        color: c.gray900,
        letterSpacing: '-0.02em',
        marginBottom: '10px',
        textAlign: 'center',
    },
    sectionSub: {
        color: c.gray500,
        fontSize: '1.05rem',
        textAlign: 'center',
        maxWidth: '560px',
        margin: '0 auto 48px',
        lineHeight: 1.65,
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    featureCard: {
        background: '#fff',
        border: `1px solid ${c.gray200}`,
        borderRadius: '16px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    featureIcon: {
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: '#fdf3f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureName:  { fontWeight: 700, fontSize: '1rem', color: c.gray900 },
    featureDesc:  { color: c.gray500, fontSize: '0.88rem', lineHeight: 1.6 },
    featureLink:  { display: 'flex', alignItems: 'center', gap: '4px', color: c.accent, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', marginTop: 'auto' },
    // ── Premium CTA ──────────────────────────────────────────────────────
    premiumSection: {
        padding: '72px 24px',
        background: '#fff',
    },
    premiumInner: {
        maxWidth: '1100px',
        margin: '0 auto',
        background: `linear-gradient(135deg, ${c.accent} 0%, ${c.accentDark} 100%)`,
        borderRadius: '24px',
        padding: '56px 48px',
        display: 'flex',
        gap: '40px',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    premiumText: { flex: '1 1 320px' },
    premiumH2:   { fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 800, color: '#fff', marginBottom: '14px', letterSpacing: '-0.02em' },
    premiumSub:  { color: 'rgba(255,255,255,0.82)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '28px' },
    premiumList: { listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '10px' },
    premiumBtn:  { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: c.accent, border: 'none', borderRadius: '10px', padding: '13px 28px', fontSize: '0.97rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', transition: 'opacity 0.15s' },
    // ── Trust strip ──────────────────────────────────────────────────────
    trustStrip: {
        borderTop: `1px solid ${c.gray200}`,
        borderBottom: `1px solid ${c.gray200}`,
        padding: '36px 24px',
        display: 'flex',
        justifyContent: 'center',
        gap: '56px',
        flexWrap: 'wrap',
        background: c.gray50,
    },
    trustItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
    },
    trustNum: { fontSize: '1.6rem', fontWeight: 800, color: c.gray900, letterSpacing: '-0.02em' },
    trustLbl: { fontSize: '0.82rem', color: c.gray500 },
};

const TRUST = [
    { num: '500K+', lbl: 'Images processed' },
    { num: '90%',   lbl: 'Average size reduction' },
    { num: '50',    lbl: 'Images per batch' },
    { num: '5+',    lbl: 'Output formats' },
];

const FEATURES = [
    {
        Icon: Zap,
        name: 'Lightning fast processing',
        desc: 'Powered by Sharp — the fastest image processing library available. Most files are ready in under a second.',
        href: '/compress',
    },
    {
        Icon: Layers,
        name: 'True bulk operations',
        desc: 'Upload up to 50 images and apply compression, format conversion and resizing all in one go.',
        href: '/compress',
    },
    {
        Icon: Camera,
        name: 'Client gallery delivery',
        desc: 'Share work with clients in private, PIN-protected galleries. Set download rules, payment gates and expiry dates.',
        href: '/dashboard?tab=galleries',
    },
    {
        Icon: Globe,
        name: 'Works anywhere',
        desc: 'No software to install. Works in any browser on desktop, tablet or phone. Your images stay on your device until you compress.',
        href: '/compress',
    },
    {
        Icon: RefreshCw,
        name: 'Any format, any direction',
        desc: 'Convert between JPEG, PNG, WebP, AVIF, TIFF and GIF. Modern formats like WebP cut file size by up to 35% over JPEG at the same quality.',
        href: '/compress',
    },
    {
        Icon: CheckCircle,
        name: 'Built for real workflows',
        desc: 'Rename files before download, adjust per-image settings, and re-compress the same batch with different settings without re-uploading.',
        href: '/compress',
    },
];

// ── Component ─────────────────────────────────────────────────────────────

export default function Home(): React.JSX.Element {
    const [category, setCategory] = useState<Category>('all');

    const visibleTools = TOOLS.filter(t => t.category.includes(category));

    return (
        <div style={S.page}>
            <Header />

            {/* ── Hero ────────────────────────────────────────────────── */}
            <div style={S.hero}>
                <h1 style={S.h1}>The image toolkit that<br />doesn&apos;t charge you to use it</h1>
                <p style={S.heroSub}>
                    Compress, convert, resize and deliver your images — completely free.
                    No installs. No paywalls. No account needed to start.
                </p>
            </div>

            {/* ── Category pills ───────────────────────────────────────── */}
            <div style={S.catRow}>
                {CATEGORIES.map(cat => (
                    <button key={cat.id} type="button" onClick={() => setCategory(cat.id)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '100px',
                            border: `1.5px solid ${category === cat.id ? c.accent : c.gray200}`,
                            background: category === cat.id ? c.accent : '#fff',
                            color: category === cat.id ? '#fff' : c.gray600,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { if (category !== cat.id) { (e.currentTarget as HTMLButtonElement).style.borderColor = c.accent; (e.currentTarget as HTMLButtonElement).style.color = c.accent; } }}
                        onMouseLeave={e => { if (category !== cat.id) { (e.currentTarget as HTMLButtonElement).style.borderColor = c.gray200; (e.currentTarget as HTMLButtonElement).style.color = c.gray600; } }}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* ── Tool grid ───────────────────────────────────────────── */}
            <div style={S.grid}>
                {visibleTools.map(tool => (
                    <Link key={tool.name} href={tool.href} style={S.card}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = c.accent; el.style.boxShadow = '0 4px 20px rgba(37,99,235,0.1)'; el.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = c.gray200; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; }}
                    >
                        {tool.badge && <span style={S.popBadge}>{tool.badge}</span>}
                        {tool.soon && <span style={S.soonBadge}>Soon</span>}
                        <div style={{ ...S.iconWrap, background: tool.iconBg }}>
                            <tool.Icon size={22} color={tool.iconColor} strokeWidth={2} />
                        </div>
                        <div>
                            <div style={S.toolName}>{tool.name}</div>
                            <div style={S.toolDesc}>{tool.desc}</div>
                        </div>
                        <div style={S.arrow}>
                            {tool.soon ? 'Coming soon' : 'Get started'} <ChevronRight size={13} strokeWidth={2.5} />
                        </div>
                    </Link>
                ))}
            </div>

            {/* ── "Work your way" feature section ─────────────────────── */}
            <section style={S.featureSection}>
                <div style={S.featureInner}>
                    <h2 style={S.sectionTitle}>Work your way</h2>
                    <p style={S.sectionSub}>
                        Every tool is built around how you actually work — not the other way around.
                    </p>
                    <div style={S.featureGrid}>
                        {FEATURES.map(f => (
                            <div key={f.name} style={S.featureCard}>
                                <div style={S.featureIcon}>
                                    <f.Icon size={20} color={c.accent} strokeWidth={2} />
                                </div>
                                <div>
                                    <div style={S.featureName}>{f.name}</div>
                                </div>
                                <div style={S.featureDesc}>{f.desc}</div>
                                <Link href={f.href} style={S.featureLink}
                                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = c.accentDark; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = c.accent; }}>
                                    Learn more <ArrowRight size={13} strokeWidth={2.5} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Trust strip ─────────────────────────────────────────── */}
            <div style={S.trustStrip}>
                {TRUST.map(({ num, lbl }) => (
                    <div key={lbl} style={S.trustItem}>
                        <span style={S.trustNum}>{num}</span>
                        <span style={S.trustLbl}>{lbl}</span>
                    </div>
                ))}
            </div>

            {/* ── Free account CTA ─────────────────────────────────── */}
            <section style={S.premiumSection}>
                <div style={S.premiumInner}>
                    <div style={S.premiumText}>
                        <h2 style={S.premiumH2}>All tools free. Sign up to get even more.</h2>
                        <p style={S.premiumSub}>
                            Every image tool on Optimage is free for everyone. Create a free account and unlock processing history, client galleries, and your personal dashboard.
                        </p>
                        <ul style={S.premiumList}>
                            {[
                                'Processing history — every file you\'ve optimised, searchable',
                                'Client galleries with PIN protection and download controls',
                                'Dashboard to manage all your files in one place',
                                'No file limits, no paywalls, no credit card ever',
                            ].map(item => (
                                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                                    <CheckCircle size={15} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/dashboard" style={S.premiumBtn}
                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.92'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}>
                            Create a free account <ArrowRight size={16} strokeWidth={2.5} />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
            <CookieConsent />
        </div>
    );
}
