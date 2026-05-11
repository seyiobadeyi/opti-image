'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import {
    Minimize2, RefreshCw, Crop, RotateCcw, Sparkles, ShieldOff,
    Camera, Layers, ChevronRight, ImagePlus, Droplets, Type,
    Maximize2, Scissors, Image, ZoomIn, Menu, X, ArrowRight,
    CheckCircle, Zap, Globe,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import AuthModal from '@/components/AuthModal';
import CookieConsent from '@/components/CookieConsent';

// ── Palette ───────────────────────────────────────────────────────────────

const c = {
    blue:    '#db5a42',
    blueDk:  '#c44d32',
    blueLt:  '#fdf3f1',
    gray50:  '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
};

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

const IC = { bg: '#fdf3f1', color: '#db5a42' };

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
        href: '/compress',
        Icon: Crop,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
    },
    {
        name: 'Convert Format',
        desc: 'Turn any image into WebP, AVIF, JPEG or PNG. The format your project actually needs.',
        href: '/compress',
        Icon: RefreshCw,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
    },
    {
        name: 'Flip & Rotate',
        desc: 'Mirror images horizontally or vertically, rotate to any angle in one click.',
        href: '/compress',
        Icon: RotateCcw,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
    },
    {
        name: 'Auto Enhance',
        desc: 'Automatically correct colours, contrast and brightness so photos look their best.',
        href: '/compress',
        Icon: Sparkles,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'optimize'],
    },
    {
        name: 'Remove Metadata',
        desc: 'Strip hidden camera data like GPS location and device info before you share.',
        href: '/compress',
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
        href: '/compress',
        Icon: Scissors,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
        soon: true,
    },
    {
        name: 'Upscale Image',
        desc: 'Increase image resolution without blurring. Great for low-res photos and icons.',
        href: '/compress',
        Icon: ZoomIn,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'optimize'],
        soon: true,
    },
    {
        name: 'Remove Background',
        desc: 'Instantly cut out backgrounds from product photos, portraits and logos.',
        href: '/compress',
        Icon: ImagePlus,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
        soon: true,
    },
    {
        name: 'Add Watermark',
        desc: 'Protect your images with a custom text or logo watermark before sharing.',
        href: '/compress',
        Icon: Type,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
        soon: true,
    },
    {
        name: 'Photo Editor',
        desc: 'Fine-tune brightness, contrast, saturation and apply filters to any image.',
        href: '/compress',
        Icon: Image,
        iconBg: IC.bg, iconColor: IC.color,
        category: ['all', 'convert'],
    },
    {
        name: 'Increase Size',
        desc: 'Export images at a larger canvas size or higher DPI for print-ready output.',
        href: '/compress',
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

const NAV_LINKS = [
    { href: '/compress',                label: 'Compress' },
    { href: '/compress',                label: 'Convert' },
    { href: '/compress',                label: 'Resize' },
    { href: '/dashboard?tab=galleries', label: 'Galleries' },
    { href: '/pricing',                 label: 'Pricing' },
    { href: '/blog',                    label: 'Blog' },
];

// ── Styles ────────────────────────────────────────────────────────────────

const S: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        background: '#fff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: c.gray900,
    },
    header: {
        borderBottom: `1px solid ${c.gray200}`,
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    headerInner: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none',
        color: c.gray900,
        fontWeight: 800,
        fontSize: '1.1rem',
        flexShrink: 0,
    },
    navLink: {
        color: c.gray600,
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: '0.9rem',
        padding: '6px 12px',
        borderRadius: '8px',
        whiteSpace: 'nowrap',
        transition: 'background 0.1s, color 0.1s',
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
        color: c.blue,
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
        background: c.blue,
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
    featureLink:  { display: 'flex', alignItems: 'center', gap: '4px', color: c.blue, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', marginTop: 'auto' },
    // ── Premium CTA ──────────────────────────────────────────────────────
    premiumSection: {
        padding: '72px 24px',
        background: '#fff',
    },
    premiumInner: {
        maxWidth: '1100px',
        margin: '0 auto',
        background: `linear-gradient(135deg, ${c.blue} 0%, ${c.blueDk} 100%)`,
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
    premiumBtn:  { display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: c.blue, border: 'none', borderRadius: '10px', padding: '13px 28px', fontSize: '0.97rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', transition: 'opacity 0.15s' },
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
    // ── Footer ───────────────────────────────────────────────────────────
    footer: {
        background: c.gray900,
        color: 'rgba(255,255,255,0.6)',
        padding: '56px 24px 32px',
    },
    footerInner: {
        maxWidth: '1100px',
        margin: '0 auto',
    },
    footerGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '32px',
        marginBottom: '48px',
    },
    footerColTitle: {
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.875rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: '16px',
    },
    footerLink: {
        color: 'rgba(255,255,255,0.55)',
        textDecoration: 'none',
        fontSize: '0.875rem',
        display: 'block',
        marginBottom: '10px',
        transition: 'color 0.12s',
    },
    footerBottom: {
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.82rem',
        color: 'rgba(255,255,255,0.4)',
    },
    mobileOverlay: {
        position: 'fixed',
        inset: 0,
        background: '#fff',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px 32px',
    },
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

const FOOTER_COLS = [
    {
        title: 'Product',
        links: [
            { label: 'Compress Images',  href: '/compress' },
            { label: 'Convert Format',   href: '/compress' },
            { label: 'Resize Images',    href: '/compress' },
            { label: 'Client Galleries', href: '/dashboard?tab=galleries' },
            { label: 'Pricing',          href: '/pricing' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'Blog',         href: '/blog' },
            { label: 'Galleries',    href: '/galleries' },
            { label: 'How it works', href: '/compress' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About',   href: 'https://dreamintrepid.com' },
            { label: 'Contact', href: 'mailto:hello@dreamintrepid.com' },
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

// ── Component ─────────────────────────────────────────────────────────────

export default function Home(): React.JSX.Element {
    const [category,   setCategory]   = useState<Category>('all');
    const [authed,     setAuthed]     = useState(false);
    const [authOpen,   setAuthOpen]   = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setAuthed(!!session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setAuthed(!!s));
        const handleOpen = (): void => setAuthOpen(true);
        window.addEventListener('open-auth-modal', handleOpen);
        return () => {
            subscription.unsubscribe();
            window.removeEventListener('open-auth-modal', handleOpen);
        };
    }, [supabase]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const visibleTools = TOOLS.filter(t => t.category.includes(category));

    return (
        <div style={S.page}>

            {/* ── Mobile nav ──────────────────────────────────────────── */}
            {mobileOpen && (
                <div style={S.mobileOverlay}>
                    <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${c.gray200}` }}>
                        <Link href="/" style={S.logo} onClick={() => setMobileOpen(false)}>
                            <img src="/logo.png" alt="Optimage" style={{ height: '28px', width: 'auto' }} />
                            Optimage
                        </Link>
                        <button type="button" onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.gray600, display: 'flex', padding: '4px' }}>
                            <X size={22} />
                        </button>
                    </div>
                    <nav style={{ display: 'flex', flexDirection: 'column', paddingTop: '16px', gap: '4px' }}>
                        {NAV_LINKS.map(nav => (
                            <Link key={nav.label} href={nav.href} onClick={() => setMobileOpen(false)}
                                style={{ color: c.gray700, textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem', padding: '14px 0', borderBottom: `1px solid ${c.gray100}` }}>
                                {nav.label}
                            </Link>
                        ))}
                    </nav>
                    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {authed ? (
                            <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                                style={{ background: c.blue, color: '#fff', textDecoration: 'none', borderRadius: '12px', padding: '14px', fontSize: '1rem', fontWeight: 700, textAlign: 'center' }}>
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <button type="button" onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
                                    style={{ background: c.blue, color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
                                    Get started free
                                </button>
                                <button type="button" onClick={() => { setMobileOpen(false); setAuthOpen(true); }}
                                    style={{ background: 'none', border: `1.5px solid ${c.gray200}`, borderRadius: '12px', padding: '14px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', color: c.gray700 }}>
                                    Sign in
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── Header ──────────────────────────────────────────────── */}
            <header style={S.header}>
                <div style={S.headerInner}>
                    <Link href="/" style={S.logo}>
                        <img src="/logo.png" alt="Optimage" style={{ height: '28px', width: 'auto' }} />
                        Optimage
                    </Link>

                    <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }} className="hide-mobile">
                        {NAV_LINKS.map(nav => (
                            <Link key={nav.label} href={nav.href} style={S.navLink}
                                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = c.gray100; (e.currentTarget as HTMLAnchorElement).style.color = c.gray900; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = c.gray600; }}>
                                {nav.label}
                            </Link>
                        ))}
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }} className="hide-mobile">
                        {authed ? (
                            <Link href="/dashboard" style={{ background: c.blue, color: '#fff', textDecoration: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.9rem', fontWeight: 600 }}>
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <button type="button" onClick={() => setAuthOpen(true)}
                                    style={{ background: 'none', border: 'none', color: c.gray600, fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', padding: '8px 12px', borderRadius: '8px' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = c.gray100; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                                    Sign in
                                </button>
                                <button type="button" onClick={() => setAuthOpen(true)}
                                    style={{ background: c.blue, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = c.blueDk; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = c.blue; }}>
                                    Get started free
                                </button>
                            </>
                        )}
                    </div>

                    <button type="button" onClick={() => setMobileOpen(true)} className="show-mobile"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.gray700, display: 'none', padding: '4px', alignItems: 'center' }}>
                        <Menu size={22} />
                    </button>
                </div>
            </header>

            {/* ── Hero ────────────────────────────────────────────────── */}
            <div style={S.hero}>
                <h1 style={S.h1}>Every image tool you need,<br />right here</h1>
                <p style={S.heroSub}>
                    Compress, convert, resize and deliver your images — free, fast, and built for real work.
                    No installs. No waiting. Just results.
                </p>
            </div>

            {/* ── Category pills ───────────────────────────────────────── */}
            <div style={S.catRow}>
                {CATEGORIES.map(cat => (
                    <button key={cat.id} type="button" onClick={() => setCategory(cat.id)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '100px',
                            border: `1.5px solid ${category === cat.id ? c.blue : c.gray200}`,
                            background: category === cat.id ? c.blue : '#fff',
                            color: category === cat.id ? '#fff' : c.gray600,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { if (category !== cat.id) { (e.currentTarget as HTMLButtonElement).style.borderColor = c.blue; (e.currentTarget as HTMLButtonElement).style.color = c.blue; } }}
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
                        onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = c.blue; el.style.boxShadow = '0 4px 20px rgba(37,99,235,0.1)'; el.style.transform = 'translateY(-2px)'; }}
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
                                    <f.Icon size={20} color={c.blue} strokeWidth={2} />
                                </div>
                                <div>
                                    <div style={S.featureName}>{f.name}</div>
                                </div>
                                <div style={S.featureDesc}>{f.desc}</div>
                                <Link href={f.href} style={S.featureLink}
                                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = c.blueDk; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = c.blue; }}>
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

            {/* ── Premium CTA ─────────────────────────────────────────── */}
            <section style={S.premiumSection}>
                <div style={S.premiumInner}>
                    <div style={S.premiumText}>
                        <h2 style={S.premiumH2}>Get more with a Pro account</h2>
                        <p style={S.premiumSub}>
                            Unlock unlimited batch processing, client gallery delivery with payment gating, advanced export settings and priority support.
                        </p>
                        <ul style={S.premiumList}>
                            {[
                                'Unlimited images per session',
                                'Private client galleries with PIN & payment gate',
                                'Priority processing queue',
                                'Advanced filters — Vivid, Muted, B&W, Warm, Cool',
                                'Custom watermarks & metadata control',
                            ].map(item => (
                                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                                    <CheckCircle size={15} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/pricing" style={S.premiumBtn}
                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.92'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}>
                            See pricing <ArrowRight size={16} strokeWidth={2.5} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Footer ──────────────────────────────────────────────── */}
            <footer style={S.footer}>
                <div style={S.footerInner}>
                    {/* Logo row */}
                    <div style={{ marginBottom: '40px' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff', fontWeight: 800, fontSize: '1rem', width: 'fit-content' }}>
                            <img src="/logo.png" alt="Optimage" style={{ height: '26px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
                            Optimage
                        </Link>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.83rem', marginTop: '8px', maxWidth: '320px', lineHeight: 1.6 }}>
                            Free image tools for creators, developers and photographers. Built by Dream Intrepid Ltd.
                        </p>
                    </div>

                    {/* Link columns */}
                    <div style={S.footerGrid}>
                        {FOOTER_COLS.map(col => (
                            <div key={col.title}>
                                <div style={S.footerColTitle}>{col.title}</div>
                                {col.links.map(link => (
                                    <Link key={link.label} href={link.href} style={S.footerLink}
                                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'; }}>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div style={S.footerBottom}>
                        <span>© {new Date().getFullYear()} Dream Intrepid Ltd. All rights reserved.</span>
                        <span>Made with care for the web.</span>
                    </div>
                </div>
            </footer>

            <AnimatePresence>
                {authOpen && (
                    <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialStep="email" />
                )}
            </AnimatePresence>
            <CookieConsent />

            <style>{`
                @media (max-width: 768px) {
                    .hide-mobile { display: none !important; }
                    .show-mobile { display: flex !important; }
                }
                @media (min-width: 769px) {
                    .show-mobile { display: none !important; }
                }
            `}</style>
        </div>
    );
}
