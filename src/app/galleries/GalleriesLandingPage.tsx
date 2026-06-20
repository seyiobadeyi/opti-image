'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { FeaturedPhoto } from '../api/galleries/featured-photos/route';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    Camera, Lock, Heart, CreditCard, Clock, Eye, ArrowRight,
    CheckCircle, ChevronRight, ChevronDown, Share2, Shield, Users,
    Globe, Star, Zap,
} from 'lucide-react';

// Register once at module level — safe in 'use client' (never runs on server)
gsap.registerPlugin(ScrollTrigger);

const ACCENT = '#db5a42';
const TEXT_PRIMARY = '#111827';
const TEXT_SECONDARY = '#374151';
const TEXT_MUTED = '#9ca3af';
const BORDER = '#e5e7eb';
const SUCCESS = '#16a34a';

const RAIN_POSITIONS = [
    { x: 3,  initRot: '-8deg',  endRot: '-4deg',  delay: 0,   dur: 8    },
    { x: 10, initRot: '5deg',   endRot: '9deg',   delay: 1.2, dur: 9.5  },
    { x: 18, initRot: '-3deg',  endRot: '1deg',   delay: 0.4, dur: 7.8  },
    { x: 27, initRot: '7deg',   endRot: '3deg',   delay: 2.1, dur: 10.2 },
    { x: 35, initRot: '-6deg',  endRot: '-2deg',  delay: 0.8, dur: 8.5  },
    { x: 43, initRot: '4deg',   endRot: '8deg',   delay: 3.5, dur: 9.1  },
    { x: 51, initRot: '-9deg',  endRot: '-5deg',  delay: 1.5, dur: 8.2  },
    { x: 59, initRot: '6deg',   endRot: '2deg',   delay: 2.8, dur: 7.6  },
    { x: 67, initRot: '-4deg',  endRot: '0deg',   delay: 0.2, dur: 9.8  },
    { x: 75, initRot: '8deg',   endRot: '4deg',   delay: 1.9, dur: 8.9  },
    { x: 83, initRot: '-2deg',  endRot: '2deg',   delay: 3.1, dur: 10.5 },
    { x: 91, initRot: '5deg',   endRot: '9deg',   delay: 0.6, dur: 7.4  },
    { x: 7,  initRot: '-7deg',  endRot: '-3deg',  delay: 4.2, dur: 8.7  },
    { x: 22, initRot: '3deg',   endRot: '7deg',   delay: 2.5, dur: 9.3  },
    { x: 38, initRot: '-5deg',  endRot: '-1deg',  delay: 1.1, dur: 7.9  },
    { x: 54, initRot: '9deg',   endRot: '5deg',   delay: 3.8, dur: 10.1 },
    { x: 70, initRot: '-3deg',  endRot: '1deg',   delay: 0.9, dur: 8.4  },
    { x: 86, initRot: '6deg',   endRot: '10deg',  delay: 2.3, dur: 9.6  },
] as const;

function RainCard({ photo, pos }: { photo: FeaturedPhoto; pos: (typeof RAIN_POSITIONS)[number] }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="gallery-rain-card"
            style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: 0,
                width: '140px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.65)',
                animation: `photoRain ${pos.dur}s ${pos.delay}s infinite linear`,
                '--init-rot': pos.initRot,
                '--end-rot': pos.endRot,
            } as React.CSSProperties}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={photo.url}
                alt={`Gallery by ${photo.studioName}`}
                style={{ width: '100%', height: '175px', objectFit: 'cover', display: 'block' }}
                loading="lazy"
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: `linear-gradient(transparent, ${photo.brandingColor}ee)`,
                    padding: '24px 10px 8px',
                    transform: hovered ? 'translateY(0)' : 'translateY(100%)',
                    transition: 'transform 0.25s ease',
                }}
            >
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'white', lineHeight: 1.3, margin: 0 }}>
                    {photo.studioName}
                </p>
                {photo.website && (
                    <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>
                        {photo.website.replace(/^https?:\/\//, '')}
                    </p>
                )}
            </div>
        </div>
    );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ borderBottom: `1px solid ${BORDER}`, cursor: 'pointer' }} onClick={() => setOpen(!open)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', gap: '16px' }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: TEXT_PRIMARY, lineHeight: 1.5 }}>{question}</span>
                <ChevronRight size={18} color={TEXT_MUTED} style={{ flexShrink: 0, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </div>
            {open && (
                <p style={{ fontSize: '0.95rem', color: TEXT_SECONDARY, lineHeight: 1.8, paddingBottom: '20px' }}>{answer}</p>
            )}
        </div>
    );
}

// ── Audience panels data ──────────────────────────────────────────────────────
const AUDIENCE_PANELS = [
    {
        bg: '#0d0d12',
        image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
        label: 'For Photographers',
        heading: 'Your work delivered\nwith the attention\nit deserves.',
        body: 'Stop sending Dropbox links for galleries that represent months of your creative work. Every delivery reflects your brand.',
        benefits: [
            'PIN-protected galleries your client can\'t share without permission',
            'Client picks favourites without WhatsApp back-and-forth',
            'Hold delivery until the invoice is settled',
            'Your studio name and brand on every gallery page',
        ],
        cta: 'Create your studio gallery',
        accent: '#db5a42',
    },
    {
        bg: '#180d07',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
        label: 'For Event Planners',
        heading: 'One link.\nEvery attendee.\nZero headaches.',
        body: 'Share event coverage with hundreds of attendees, sponsors, and vendors — all from a single branded gallery link.',
        benefits: [
            'Share publicly or restrict to your approved attendee list',
            'Your event branding carried through the gallery experience',
            'Full activity log: who viewed, who downloaded, and when',
            'No per-attendee fees or download limits',
        ],
        cta: 'Set up your event gallery',
        accent: '#e8866f',
    },
    {
        bg: '#111827',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        label: 'For Organisations',
        heading: 'Internal media.\nSecure. Organized.\nActually findable.',
        body: 'Team headshots, office events, product launches — keep visual assets accessible to the right people without IT overhead.',
        benefits: [
            'Account-gated access keeps media internal to your team',
            'Multiple galleries per account with no per-gallery fee',
            'Activity log for audit trails and compliance teams',
            'No subscription — all included with your free account',
        ],
        cta: 'Organise your team media',
        accent: '#c9b8b0',
    },
];

// ── Step panels data ──────────────────────────────────────────────────────────
const STEP_PANELS = [
    {
        bg: '#111827',
        num: '01',
        title: 'Create a gallery in under a minute.',
        body: 'Open your dashboard, hit New Gallery, give it a name, set an expiry date, and choose your access mode. No plan upgrade required. You\'re done in 45 seconds.',
        image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=1200&q=80',
        imgLeft: false,
    },
    {
        bg: '#0d1810',
        num: '02',
        title: 'Upload your edited photos.',
        body: 'Drag in your JPEGs or WebPs. Files are compressed, format-optimised, and stored in your private Cloudinary folder. Originals preserved. Fast delivery builds ready immediately.',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
        imgLeft: true,
    },
    {
        bg: '#0d0d24',
        num: '03',
        title: 'Set exactly who can open it.',
        body: 'Public link, PIN-protected, email-list only, or Optimage account required. Switch access modes any time. Enable or disable downloads independently. One click to go live.',
        image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80',
        imgLeft: false,
    },
    {
        bg: '#1a0d0d',
        num: '04',
        title: 'Your client takes it from there.',
        body: 'Click Send to Client, enter their email. They receive a branded delivery notification. They browse, heart their favourites, download. You get notified at every step — view, select, download.',
        image: 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?auto=format&fit=crop&w=1200&q=80',
        imgLeft: true,
    },
];

// ── Feature cards data ────────────────────────────────────────────────────────
const FEATURE_CARDS = [
    { icon: <Clock size={22} color={ACCENT} />, name: 'Draft Mode', headline: 'Publish when you\'re ready — not a second earlier.', body: 'Create and upload while still culling. The client gets the link but sees "Gallery being prepared" until you flip it live.' },
    { icon: <Heart size={22} color={ACCENT} />, name: 'Client Favourites', headline: 'Stop guessing which photos they love.', body: 'Clients browse and tap heart on every shot they want. You get an email: "Sarah selected 47 photos." No spreadsheets, no WhatsApp lists.' },
    { icon: <CreditCard size={22} color={ACCENT} />, name: 'Payment Confirmation', headline: 'Deliver when the invoice is settled.', body: 'Client sees your bank details. Once they\'ve paid and you confirm, one click unlocks the gallery. You keep 100% of the invoice.' },
    { icon: <Lock size={22} color={ACCENT} />, name: 'Access Control', headline: 'Decide exactly who can open the gallery.', body: 'Public, PIN-protected, email-list only, or account-required. Switch modes any time. PINs are hashed — never stored in plain text.' },
    { icon: <Globe size={22} color={ACCENT} />, name: 'Your Branding', headline: 'Your studio name on every gallery page.', body: 'Set your studio name, brand colour, and website URL once. The gallery footer shows your brand — not ours.' },
    { icon: <Eye size={22} color={ACCENT} />, name: 'Activity Tracking', headline: 'Know when your client opened the gallery.', body: 'Every view logged with a timestamp. Know when your client first opened it, how many times they returned, who submitted favourites.' },
    { icon: <Shield size={22} color={ACCENT} />, name: 'Right-Click Protection', headline: 'Basic download friction built in.', body: 'Gallery images disable right-click and drag-save by default. Downloads happen only via the Download button, which requires an account.' },
    { icon: <Users size={22} color={ACCENT} />, name: 'No Client Account Needed', headline: 'Public and PIN galleries open in any browser.', body: 'For public and PIN-protected galleries, your client just needs the link. No sign-up friction. Account only required for private galleries.' },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function GalleriesLandingPage({
    initialPhotos,
    photosAreReal,
}: {
    initialPhotos: FeaturedPhoto[];
    photosAreReal: boolean;
}) {
    const containerRef    = useRef<HTMLDivElement>(null);
    const heroRef         = useRef<HTMLElement>(null);
    const heroContentRef  = useRef<HTMLDivElement>(null);
    const audienceWrapRef = useRef<HTMLDivElement>(null);
    const stepsWrapRef    = useRef<HTMLDivElement>(null);
    const featSecRef      = useRef<HTMLElement>(null);
    const featTrackRef    = useRef<HTMLDivElement>(null);

    // ── GSAP effects ──────────────────────────────────────────────────────────
    useEffect(() => {
        // gsap + ScrollTrigger are imported synchronously at module level —
        // no async flash, no race with cleanup.
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // ── Animations that run at ALL screen sizes ──────────────────────

            // Hero text parallax out
            if (heroRef.current && heroContentRef.current) {
                gsap.to(heroContentRef.current, {
                    y: -80,
                    opacity: 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    },
                });
            }

            // Generic reveals (all viewports)
            gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
                gsap.from(el, {
                    y: 40,
                    opacity: 0,
                    duration: 0.85,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    },
                });
            });

            gsap.from('.showcase-photo', {
                scale: 0.9,
                opacity: 0,
                stagger: 0.06,
                duration: 0.65,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.showcase-grid',
                    start: 'top 82%',
                    toggleActions: 'play none none none',
                },
            });

            gsap.from('.comp-row', {
                x: -24,
                opacity: 0,
                stagger: 0.05,
                duration: 0.55,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.comp-table',
                    start: 'top 82%',
                    toggleActions: 'play none none none',
                },
            });

            // ── Desktop only: pinned stacking panels + horizontal scroll ─────
            // matchMedia disables pin-based effects on narrow viewports where
            // GSAP pinning is unreliable and hurts UX (industry standard).
            mm.add('(min-width: 768px)', () => {
                // ── Audience panels ───────────────────────────────────────────
                const audiencePanels = gsap.utils.toArray<HTMLElement>('.audience-panel');
                if (audienceWrapRef.current && audiencePanels.length > 1) {
                    // GSAP owns the transform — set off-screen synchronously
                    // before first paint so there's no flash of all panels.
                    audiencePanels.forEach((p, i) => {
                        if (i > 0) gsap.set(p, { yPercent: 100 });
                    });

                    const aCount = audiencePanels.length - 1;

                    const aTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: audienceWrapRef.current,
                            start: 'top top',
                            // Each transition = 1 full viewport height of scroll
                            end: () => `+=${aCount * window.innerHeight}`,
                            pin: true,
                            pinSpacing: true,
                            // scrub: true = 1:1 with scroll position (most premium feel)
                            scrub: true,
                            invalidateOnRefresh: true,
                        },
                    });

                    audiencePanels.forEach((panel, i) => {
                        if (i === 0) return;
                        // ease: 'none' is correct for scrub — smoothness comes from
                        // the scrub lag, not the tween easing.
                        aTl.to(panel, { yPercent: 0, ease: 'none', duration: 1 }, i - 1);
                        const img = panel.querySelector<HTMLElement>('.audience-img');
                        if (img) {
                            gsap.set(img, { scale: 1.08 });
                            aTl.to(img, { scale: 1, ease: 'none', duration: 1 }, i - 1);
                        }
                    });
                }

                // ── Step panels ───────────────────────────────────────────────
                const stepPanels = gsap.utils.toArray<HTMLElement>('.step-panel');
                if (stepsWrapRef.current && stepPanels.length > 1) {
                    stepPanels.forEach((p, i) => {
                        if (i > 0) gsap.set(p, { yPercent: 100 });
                    });

                    const sCount = stepPanels.length - 1;

                    const sTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: stepsWrapRef.current,
                            start: 'top top',
                            end: () => `+=${sCount * window.innerHeight}`,
                            pin: true,
                            pinSpacing: true,
                            scrub: true,
                            invalidateOnRefresh: true,
                        },
                    });

                    stepPanels.forEach((panel, i) => {
                        if (i === 0) return;
                        sTl.to(panel, { yPercent: 0, ease: 'none', duration: 1 }, i - 1);
                        const img = panel.querySelector<HTMLElement>('.step-img');
                        if (img) {
                            gsap.set(img, { scale: 1.1 });
                            sTl.to(img, { scale: 1, ease: 'none', duration: 1 }, i - 1);
                        }
                    });
                }

                // ── Features: horizontal scroll ───────────────────────────────
                if (featSecRef.current && featTrackRef.current) {
                    const track = featTrackRef.current;
                    const getOverflow = () => track.scrollWidth - window.innerWidth;

                    gsap.to(track, {
                        x: () => -getOverflow(),
                        ease: 'none',
                        scrollTrigger: {
                            trigger: featSecRef.current,
                            start: 'top top',
                            end: () => `+=${getOverflow()}`,
                            pin: true,
                            pinSpacing: true,
                            scrub: true,
                            invalidateOnRefresh: true,
                        },
                    });
                }

                // matchMedia callback return = cleanup for this breakpoint
                return () => {
                    // Reset panel positions when dropping below 768px
                    gsap.utils.toArray<HTMLElement>('.audience-panel, .step-panel')
                        .forEach((p) => gsap.set(p, { clearProps: 'transform' }));
                };
            });

        }, containerRef); // scope to container — auto-cleans child tweens/triggers

        return () => ctx.revert();
    }, []);

    const comparisonRows = [
        { feature: 'Commission on client payments', optimage: '0%',          others: 'Up to 15%'        },
        { feature: 'Per-gallery fees',               optimage: 'None',        others: '$0–12 / gallery'  },
        { feature: 'Client favourites / proofing',   optimage: 'Included',    others: 'Paid tier only'   },
        { feature: 'Photographer branding',          optimage: 'Included',    others: 'Paid tier only'   },
        { feature: 'Activity tracking',              optimage: 'Included',    others: 'Paid tier only'   },
        { feature: 'Payment gating',                 optimage: 'Included',    others: 'Not available'    },
    ];

    const faqItems = [
        { question: 'Do my clients need an Optimage account?', answer: 'For public and PIN-protected galleries, no — just the link. For account-gated galleries, they create a free Optimage account in about 20 seconds using email OTP.' },
        { question: 'What happens to my photos if I delete a gallery?', answer: 'Deleting a gallery removes it from our system and queues the Cloudinary files for deletion. Download originals before deleting.' },
        { question: 'Can I watermark the photos?', answer: 'Watermark mode is on our roadmap. Right-click and drag protection blocks casual copying. Downloads are button-only and require a client account.' },
        { question: 'What file formats can I upload?', answer: 'JPEG, PNG, WebP, TIFF, and most camera RAW formats (CR2, NEF, ARW, DNG). RAW files are converted to JPEG automatically for delivery.' },
        { question: 'Is there a limit on photos per gallery?', answer: 'Default is 500 photos per gallery and 20 galleries per account. Need higher limits? Contact us and we\'ll increase them directly at no cost.' },
    ];

    // Showcase photos: real if above threshold, else first 9 from CC0 pool
    const showcasePhotos = initialPhotos.slice(0, 9);

    return (
        <div ref={containerRef} style={{ background: '#ffffff', color: TEXT_PRIMARY, minHeight: '100vh' }}>
            <style>{`
                @keyframes photoRain {
                    0%   { transform: translateY(-340px) rotate(var(--init-rot, 0deg)); opacity: 0; }
                    4%   { opacity: 0.82; }
                    92%  { opacity: 0.7; }
                    100% { transform: translateY(calc(100vh + 340px)) rotate(var(--end-rot, 5deg)); opacity: 0; }
                }
                @keyframes bobDown {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(7px); }
                }
                .gallery-rain-card img { pointer-events: none; }

                /* Panel stacking — GSAP owns the transforms, no CSS initial offset */
                .audience-panel  { position: absolute; inset: 0; will-change: transform; }
                .step-panel      { position: absolute; inset: 0; will-change: transform; }

                /* Panel inner layout (default desktop: 50/50 row) */
                .audience-inner, .step-inner {
                    display: flex;
                    height: 100%;
                    align-items: stretch;
                    flex-direction: row;
                }
                .step-inner.img-left { flex-direction: row-reverse; }
                .panel-img-half {
                    flex: 0 0 50%;
                    position: relative;
                    overflow: hidden;
                    min-height: 280px;
                }
                .panel-img-half img {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .panel-text-half {
                    flex: 0 0 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: clamp(32px,5vw,72px) clamp(24px,4vw,64px);
                    overflow-y: auto;
                }

                /* Feature cards — min width on track items */
                .feat-card { flex: 0 0 300px; }

                /* Showcase grid */
                .showcase-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }

                /* Comparison table */
                .comp-table { overflow-x: auto; border-radius: 20px; border: 1px solid #e5e7eb; }
                .comp-table table { width: 100%; border-collapse: collapse; font-size: 0.92rem; background: #ffffff; }

                /* Trust bar */
                .trust-bar { display: flex; justify-content: space-around; align-items: center; gap: 24px; flex-wrap: wrap; }
                .trust-item { display: flex; align-items: center; gap: 12px; min-width: 160px; }

                /* Hero buttons */
                .hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
                .hero-btn-primary, .hero-btn-secondary { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }

                /* Viral / showcase two-col */
                .viral-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 56px; align-items: center; }

                /* Final CTA buttons */
                .final-cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

                /* ── Below 768px: panels leave pin mode, stack as normal flow ── */
                @media (max-width: 767px) {
                    /* Panels revert to normal document flow */
                    .audience-panel, .step-panel {
                        position: relative !important;
                        inset: unset !important;
                        transform: none !important;
                    }
                    /* Wrappers auto-height instead of fixed 100vh */
                    .panel-wrapper { height: auto !important; }
                }

                /* ── TABLET (≤900px) ── */
                @media (max-width: 900px) {
                    /* Stack panels vertically on tablet/mobile: image on top, text below */
                    .audience-inner, .step-inner { flex-direction: column !important; }
                    .step-inner.img-left { flex-direction: column !important; }
                    .panel-img-half { flex: 0 0 42vh !important; width: 100%; }
                    .panel-text-half { flex: 1 1 auto !important; width: 100%; padding: 28px 24px !important; overflow-y: auto; }

                    /* Feature cards narrower */
                    .feat-card { flex: 0 0 260px !important; }

                    /* Showcase 2-col on tablet */
                    .showcase-grid { grid-template-columns: repeat(2, 1fr) !important; }

                    /* Hero */
                    .hero-btns { flex-direction: column; align-items: stretch; }
                    .hero-btn-primary, .hero-btn-secondary { justify-content: center; }

                    /* Viral cols single */
                    .viral-cols { grid-template-columns: 1fr !important; gap: 40px !important; }

                    /* CTA buttons */
                    .final-cta-btns { flex-direction: column; align-items: stretch; }
                    .final-cta-btns a { justify-content: center; }

                    /* Trust bar */
                    .trust-bar { gap: 20px; justify-content: center; }
                    .trust-item { min-width: 140px; }

                    /* Comparison */
                    .comp-table td, .comp-table th { padding: 10px 12px !important; font-size: 0.78rem !important; }
                }

                /* ── MOBILE (≤600px) ── */
                @media (max-width: 600px) {
                    /* Pinned sections: on very small screens disable pinning gracefully */
                    .panel-img-half { flex: 0 0 38vh !important; }
                    .panel-text-half { padding: 20px 18px !important; }

                    /* Feature section: just scroll normally */
                    .feat-card { flex: 0 0 240px !important; }

                    /* Showcase 1-col */
                    .showcase-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }

                    /* Rain cards narrower on mobile */
                    .gallery-rain-card { width: 100px !important; }
                    .gallery-rain-card img { height: 125px !important; }

                    /* Trust bar: 2 per row */
                    .trust-bar { justify-content: flex-start; gap: 16px 24px; }
                    .trust-item { min-width: calc(50% - 24px); }

                    /* Comparison: hide last column, simplify */
                    .comp-col-others { display: none; }

                    /* Text scale */
                    .panel-num-ghost { font-size: clamp(3.5rem,18vw,6rem) !important; }
                }
            `}</style>

            <Header />

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section
                ref={heroRef}
                style={{
                    background: '#0d0d12',
                    height: '100vh',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Rain layer */}
                <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    {initialPhotos.map((photo, i) => (
                        <RainCard key={i} photo={photo} pos={RAIN_POSITIONS[i % RAIN_POSITIONS.length]!} />
                    ))}
                </div>

                {/* Vignette */}
                <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(13,13,18,0.5) 0%, rgba(13,13,18,0.82) 65%, #0d0d12 100%)', zIndex: 2 }} />

                {/* Content */}
                <div
                    ref={heroContentRef}
                    style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 24px', maxWidth: '900px' }}
                >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(219,90,66,0.35)', background: 'rgba(219,90,66,0.1)', marginBottom: '28px', fontSize: '0.8rem', fontWeight: 500, color: '#e8866f' }}>
                        <Camera size={13} color={ACCENT} />
                        Gallery Delivery for Photographers &amp; Events
                    </div>

                    <h1 style={{ fontSize: 'clamp(3rem,7vw,5.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.06, color: '#ffffff', marginBottom: '24px' }}>
                        Your clients deserve<br />
                        <span style={{ background: 'linear-gradient(135deg, #db5a42 0%, #ff8a6a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            a gallery, not a link.
                        </span>
                    </h1>

                    <p style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto 40px' }}>
                        Private galleries with client proofing, payment confirmation, and your branding.
                        Free — zero commissions, no per-gallery fees.
                    </p>

                    <div className="hero-btns">
                        <Link href="/dashboard" className="hero-btn-primary" style={{ padding: '14px 30px', borderRadius: '100px', background: 'linear-gradient(135deg, #db5a42 0%, #c44d32 100%)', color: 'white', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 0 32px rgba(219,90,66,0.45)' }}>
                            Start free <ArrowRight size={16} />
                        </Link>
                        <a href="#how-it-works" className="hero-btn-secondary" style={{ padding: '14px 28px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.88)', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
                            See how it works <ChevronRight size={16} />
                        </a>
                    </div>
                </div>

                {/* Scroll cue */}
                <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {photosAreReal ? 'Real galleries from our community' : 'Gallery delivery built for professionals'}
                    </span>
                    <ChevronDown size={18} color="rgba(255,255,255,0.28)" style={{ animation: 'bobDown 1.6s ease-in-out infinite' }} />
                </div>
            </section>

            {/* ── TRUST BAR ────────────────────────────────────────────────── */}
            <section style={{ background: '#ffffff', borderBottom: `1px solid ${BORDER}`, padding: '0 24px' }}>
                <div className="trust-bar" style={{ maxWidth: '1100px', margin: '0 auto', height: '52px' }}>
                    {[
                        { icon: <Zap size={13} color={TEXT_MUTED} />,         label: '0% commission on payments'   },
                        { icon: <CheckCircle size={13} color={TEXT_MUTED} />,  label: 'All features free'           },
                        { icon: <Lock size={13} color={TEXT_MUTED} />,         label: '4 access control modes'      },
                        { icon: <Star size={13} color={TEXT_MUTED} />,         label: 'Gallery live in under 5 min' },
                    ].map(({ icon, label }, idx, arr) => (
                        <div key={label} className="trust-item" style={{ gap: '7px', minWidth: 'auto' }}>
                            {icon}
                            <span style={{ fontSize: '0.78rem', color: TEXT_MUTED, fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</span>
                            {idx < arr.length - 1 && (
                                <span aria-hidden style={{ width: '1px', height: '14px', background: BORDER, marginLeft: '16px', flexShrink: 0 }} />
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── AUDIENCE PANELS (stacked, GSAP pinned) ───────────────────── */}
            <div
                ref={audienceWrapRef}
                className="panel-wrapper"
                style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}
            >
                {AUDIENCE_PANELS.map((panel, i) => (
                    <div
                        key={i}
                        className="audience-panel"
                        style={{ background: panel.bg }}
                    >
                        <div className="audience-inner">
                            {/* Image half */}
                            <div className="panel-img-half">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    className="audience-img"
                                    src={panel.image}
                                    alt={panel.label}
                                    style={{ transformOrigin: 'center center' }}
                                    loading={i === 0 ? 'eager' : 'lazy'}
                                />
                                {/* Color overlay */}
                                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${panel.bg}88, transparent)` }} />
                                {/* Label pill */}
                                <div style={{ position: 'absolute', bottom: '20px', left: '20px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: `1px solid ${panel.accent}44`, zIndex: 2 }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: panel.accent, letterSpacing: '0.06em' }}>{panel.label}</span>
                                </div>
                            </div>

                            {/* Text half */}
                            <div className="panel-text-half">
                                <p className="panel-line" style={{ fontSize: '0.72rem', fontWeight: 700, color: panel.accent, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '20px' }}>
                                    {String(i + 1).padStart(2, '0')} / {AUDIENCE_PANELS.length.toString().padStart(2, '0')}
                                </p>
                                <h2 className="panel-line" style={{ fontSize: 'clamp(1.7rem,3.5vw,3rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.12, letterSpacing: '-0.04em', marginBottom: '20px', whiteSpace: 'pre-line' }}>
                                    {panel.heading}
                                </h2>
                                <p className="panel-line" style={{ fontSize: 'clamp(0.9rem,1.4vw,1.05rem)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: '28px', maxWidth: '440px' }}>
                                    {panel.body}
                                </p>
                                <ul className="panel-line" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                                    {panel.benefits.map((b) => (
                                        <li key={b} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                            <CheckCircle size={15} color={panel.accent} style={{ flexShrink: 0, marginTop: '3px' }} />
                                            <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6 }}>{b}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="panel-line" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                                    <Link
                                        href="/dashboard"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            padding: '11px 22px', borderRadius: '100px',
                                            background: ACCENT, color: '#fff',
                                            fontWeight: 700, fontSize: '0.88rem',
                                            textDecoration: 'none',
                                            boxShadow: '0 0 24px rgba(219,90,66,0.4)',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {panel.cta} <ArrowRight size={14} />
                                    </Link>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>Free account · No credit card</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── STEP PANELS (stacked, GSAP pinned) ───────────────────────── */}
            <div
                id="how-it-works"
                ref={stepsWrapRef}
                className="panel-wrapper"
                style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}
            >
                {STEP_PANELS.map((step, i) => (
                    <div
                        key={i}
                        className={`step-panel${step.imgLeft ? ' img-left' : ''}`}
                        style={{ background: step.bg }}
                    >
                        <div className={`step-inner${step.imgLeft ? ' img-left' : ''}`}>
                            {/* Image half */}
                            <div className="panel-img-half">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    className="step-img"
                                    src={step.image}
                                    alt={step.title}
                                    style={{ transformOrigin: 'center center' }}
                                    loading={i === 0 ? 'eager' : 'lazy'}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(${step.imgLeft ? 'to left' : 'to right'}, ${step.bg}66, transparent)` }} />
                            </div>

                            {/* Text half */}
                            <div className="panel-text-half">
                                <p className="step-line panel-num-ghost" style={{ fontSize: 'clamp(4rem,10vw,8rem)', fontWeight: 900, color: 'rgba(255,255,255,0.05)', lineHeight: 1, letterSpacing: '-0.06em', marginBottom: '-20px', userSelect: 'none' }}>
                                    {step.num}
                                </p>
                                <h2 className="step-line" style={{ fontSize: 'clamp(1.6rem,3vw,2.6rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '16px' }}>
                                    {step.title}
                                </h2>
                                <p className="step-line" style={{ fontSize: 'clamp(0.88rem,1.4vw,1rem)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.85, maxWidth: '440px', marginBottom: i === STEP_PANELS.length - 1 ? '32px' : '0' }}>
                                    {step.body}
                                </p>
                                {i === STEP_PANELS.length - 1 && (
                                    <div className="step-line" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                                        <Link
                                            href="/dashboard"
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                padding: '12px 24px', borderRadius: '100px',
                                                background: ACCENT, color: '#fff',
                                                fontWeight: 700, fontSize: '0.92rem',
                                                textDecoration: 'none',
                                                boxShadow: '0 0 28px rgba(219,90,66,0.45)',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            Create your first gallery <ArrowRight size={15} />
                                        </Link>
                                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)' }}>Free · Live in 5 minutes</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── FEATURES: horizontal scroll ───────────────────────────────── */}
            <section
                ref={featSecRef}
                style={{ background: '#0d0d12', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
                {/* Header row */}
                <div style={{ padding: '0 clamp(24px,5vw,64px) 48px', flexShrink: 0 }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#e8866f', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px' }}>Feature set</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
                        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.15, maxWidth: '560px', margin: 0 }}>
                            Everything a working photographer needs.
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                            <Link
                                href="/dashboard"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 20px', borderRadius: '100px',
                                    background: ACCENT, color: '#fff',
                                    fontWeight: 700, fontSize: '0.85rem',
                                    textDecoration: 'none',
                                    boxShadow: '0 0 20px rgba(219,90,66,0.4)',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Get all features free <ArrowRight size={14} />
                            </Link>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', margin: 0, textAlign: 'right' }}>Scroll to explore →</p>
                        </div>
                    </div>
                </div>

                {/* Horizontal track */}
                <div ref={featTrackRef} style={{ display: 'flex', gap: '20px', paddingLeft: 'clamp(24px,5vw,64px)', paddingRight: 'clamp(24px,5vw,64px)', willChange: 'transform', flexShrink: 0 }}>
                    {FEATURE_CARDS.map((f) => (
                        <div
                            key={f.name}
                            className="feat-card"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '20px',
                                padding: '32px 28px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                            }}
                        >
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(219,90,66,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {f.icon}
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#e8866f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{f.name}</p>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.35, marginBottom: '10px' }}>{f.headline}</h3>
                                <p style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>{f.body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── PHOTOGRAPHER SHOWCASE ────────────────────────────────────── */}
            <section style={{ background: '#ffffff', padding: 'clamp(64px,10vw,100px) clamp(24px,5vw,60px)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="viral-cols reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center' }}>
                        {/* Copy */}
                        <div>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
                                {photosAreReal ? 'From our community' : 'Gallery showcase'}
                            </p>
                            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', color: TEXT_PRIMARY, lineHeight: 1.2, marginBottom: '20px' }}>
                                Your galleries market you automatically.
                            </h2>
                            <p style={{ fontSize: '1rem', color: TEXT_SECONDARY, lineHeight: 1.8, marginBottom: '28px' }}>
                                Every gallery your client shares with family becomes a portfolio view for your studio.
                                Each gallery carries a subtle studio credit — your name, your website, discoverable by
                                every person who opens the link.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                                {[
                                    { icon: <Share2 size={15} color={ACCENT} />, text: 'Client shares gallery link with 30 guests' },
                                    { icon: <Eye size={15} color={ACCENT} />,    text: '30 guests see your studio brand in the footer' },
                                    { icon: <Camera size={15} color={ACCENT} />, text: '2–3 book their own sessions from word of mouth' },
                                ].map(({ icon, text }) => (
                                    <div key={text} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(219,90,66,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {icon}
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: TEXT_SECONDARY, lineHeight: 1.6, paddingTop: '4px' }}>{text}</p>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                <Link
                                    href="/dashboard"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        padding: '12px 24px', borderRadius: '100px',
                                        background: ACCENT, color: '#fff',
                                        fontWeight: 700, fontSize: '0.92rem',
                                        textDecoration: 'none',
                                        boxShadow: '0 4px 20px rgba(219,90,66,0.3)',
                                    }}
                                >
                                    Create your gallery <ArrowRight size={15} />
                                </Link>
                                <span style={{ fontSize: '0.8rem', color: TEXT_MUTED }}>Takes under 5 minutes</span>
                            </div>
                        </div>

                        {/* Photo grid with real data */}
                        <div className="showcase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {showcasePhotos.map((photo, i) => (
                                <div
                                    key={i}
                                    className="showcase-photo"
                                    style={{ position: 'relative', aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', cursor: 'default' }}
                                    title={photo.studioName}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={photo.url}
                                        alt={`Gallery by ${photo.studioName}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        loading="lazy"
                                    />
                                    {/* Photographer color strip on hover */}
                                    {photo.isReal && (
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: photo.brandingColor }} />
                                    )}
                                    {/* Heart on one random photo */}
                                    {i === 3 && (
                                        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(219,90,66,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Heart size={12} color="white" fill="white" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {/* If fewer than 9 photos, fill remaining with placeholders */}
                            {Array.from({ length: Math.max(0, 9 - showcasePhotos.length) }).map((_, i) => (
                                <div key={`ph-${i}`} style={{ aspectRatio: '1', borderRadius: '10px', background: '#f3f4f6' }} />
                            ))}
                            {/* Attribution footer */}
                            {photosAreReal && showcasePhotos[0] && (
                                <div style={{ gridColumn: '1 / -1', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: showcasePhotos[0].brandingColor, flexShrink: 0 }} />
                                    <p style={{ fontSize: '0.72rem', color: TEXT_MUTED }}>
                                        {showcasePhotos[0].studioName}
                                        {showcasePhotos[0].website && ` · ${showcasePhotos[0].website.replace(/^https?:\/\//, '')}`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── COMPARISON ───────────────────────────────────────────────── */}
            <section style={{ background: '#f9fafb', padding: 'clamp(64px,10vw,100px) clamp(24px,5vw,60px)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div className="reveal" style={{ marginBottom: 'clamp(40px,6vw,56px)' }}>
                        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: TEXT_PRIMARY }}>
                            Free to use. No commissions. No per-gallery fees.
                        </h2>
                        <p style={{ fontSize: '1rem', color: TEXT_SECONDARY, marginTop: '12px', lineHeight: 1.7 }}>
                            Everything included with your free Optimage account.
                        </p>
                    </div>
                    <div className="comp-table" style={{ overflowX: 'auto', borderRadius: '20px', border: `1px solid ${BORDER}` }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem', background: '#ffffff' }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                                    <th style={{ textAlign: 'left', padding: '16px 24px', color: TEXT_MUTED, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', width: '50%' }}>Feature</th>
                                    <th style={{ textAlign: 'center', padding: '16px 24px', color: ACCENT, fontWeight: 700, fontSize: '0.88rem' }}>Optimage</th>
                                    <th className="comp-col-others" style={{ textAlign: 'center', padding: '16px 24px', color: TEXT_MUTED, fontWeight: 600, fontSize: '0.88rem' }}>Pixieset / ShootProof</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row, i) => (
                                    <tr key={row.feature} className="comp-row" style={{ borderBottom: i < comparisonRows.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                                        <td style={{ padding: '14px 24px', color: TEXT_PRIMARY, fontWeight: 500 }}>{row.feature}</td>
                                        <td style={{ padding: '14px 24px', textAlign: 'center' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: SUCCESS, fontWeight: 600 }}>
                                                <CheckCircle size={14} color={SUCCESS} />{row.optimage}
                                            </span>
                                        </td>
                                        <td className="comp-col-others" style={{ padding: '14px 24px', textAlign: 'center', color: TEXT_MUTED, fontSize: '0.88rem' }}>{row.others}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Post-comparison CTA */}
                    <div className="reveal" style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
                        <p style={{ fontSize: '1rem', color: TEXT_SECONDARY, fontWeight: 500 }}>
                            Everything in that left column is included in your free Optimage account. No catch.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link
                                href="/dashboard"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '12px 28px', borderRadius: '100px',
                                    background: ACCENT, color: '#fff',
                                    fontWeight: 700, fontSize: '0.95rem',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 20px rgba(219,90,66,0.28)',
                                }}
                            >
                                Start for free <ArrowRight size={15} />
                            </Link>
                            <span style={{ fontSize: '0.8rem', color: TEXT_MUTED }}>No credit card · No commission ever</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ──────────────────────────────────────────────────────── */}
            <section style={{ background: '#ffffff', padding: 'clamp(64px,10vw,100px) clamp(24px,5vw,60px)' }}>
                <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <h2 className="reveal" style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', color: TEXT_PRIMARY, marginBottom: 'clamp(32px,5vw,48px)', textAlign: 'center' }}>
                        Questions we get asked.
                    </h2>
                    <div style={{ borderTop: `1px solid ${BORDER}` }}>
                        {faqItems.map((item) => (
                            <FaqItem key={item.question} {...item} />
                        ))}
                    </div>

                    {/* Post-FAQ CTA */}
                    <div className="reveal" style={{ marginTop: '48px', padding: '32px', borderRadius: '20px', background: '#f9fafb', border: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '1rem', color: TEXT_PRIMARY, marginBottom: '4px' }}>Ready to send your next gallery?</p>
                            <p style={{ fontSize: '0.88rem', color: TEXT_MUTED, margin: 0 }}>Free account. Live in under 5 minutes.</p>
                        </div>
                        <Link
                            href="/dashboard"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '11px 24px', borderRadius: '100px',
                                background: ACCENT, color: '#fff',
                                fontWeight: 700, fontSize: '0.9rem',
                                textDecoration: 'none',
                                flexShrink: 0,
                            }}
                        >
                            Create a gallery <ArrowRight size={15} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ────────────────────────────────────────────────── */}
            <section style={{ background: '#0d0d12', padding: 'clamp(80px,14vw,140px) clamp(24px,5vw,60px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(219,90,66,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
                    <div className="reveal">
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
                            {[Camera, Heart, Shield].map((Icon, i) => (
                                <div key={i} style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(219,90,66,0.14)', border: '1px solid rgba(219,90,66,0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} color={ACCENT} />
                                </div>
                            ))}
                        </div>
                        <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, color: '#ffffff', marginBottom: '20px' }}>
                            The next gallery you deliver<br />
                            <span style={{ background: 'linear-gradient(135deg, #db5a42 0%, #ff8a6a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                should feel different.
                            </span>
                        </h2>
                        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '40px' }}>
                            Set up your first gallery in under 5 minutes. Free account — no credit card, no commission ever.
                        </p>
                        <div className="final-cta-btns" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '15px 32px', borderRadius: '100px', background: 'linear-gradient(135deg, #db5a42 0%, #c44d32 100%)', color: 'white', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 0 40px rgba(219,90,66,0.5)' }}>
                                Create a gallery <ArrowRight size={16} />
                            </Link>
                            <Link href="/compress" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '15px 28px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.82)', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
                                Try the image tools
                            </Link>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: '24px' }}>
                            Free account · No credit card · No commission
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
