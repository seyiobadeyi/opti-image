'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { FeaturedPhoto } from '../api/galleries/featured-photos/route';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
    Camera, Lock, Heart, CreditCard, Clock, Eye,
    ArrowRight, CheckCircle, Globe, ChevronRight, ChevronDown,
    Users, Calendar, Building2, Share2, Shield, Zap, Star, Image as ImageIcon,
} from 'lucide-react';

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

// ── Rain Card ─────────────────────────────────────────────────────────────────
function RainCard({
    photo,
    pos,
}: {
    photo: FeaturedPhoto;
    pos: (typeof RAIN_POSITIONS)[number];
}) {
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

// ── Audience Flip Card ────────────────────────────────────────────────────────
function AudienceCard({
    icon,
    audience,
    tagline,
    benefits,
    accent,
}: {
    icon: React.ReactNode;
    audience: string;
    tagline: string;
    benefits: string[];
    accent: string;
}) {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            style={{ perspective: '1000px', height: '320px', cursor: 'pointer' }}
            onMouseEnter={() => setFlipped(true)}
            onMouseLeave={() => setFlipped(false)}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.55s ease',
                    transform: flipped ? 'rotateY(180deg)' : 'none',
                }}
            >
                {/* Front */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background: '#ffffff',
                        border: `1px solid ${BORDER}`,
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                        padding: '32px',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '20px',
                            background: `${accent}18`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {icon}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: TEXT_PRIMARY, marginBottom: '8px' }}>
                            {audience}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: TEXT_SECONDARY, lineHeight: 1.65 }}>{tagline}</p>
                    </div>
                    <div style={{ fontSize: '0.73rem', color: TEXT_MUTED, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Hover to see why <ChevronRight size={12} />
                    </div>
                </div>

                {/* Back */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background: accent,
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '28px',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <h4
                        style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.65)',
                            marginBottom: '16px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                        }}
                    >
                        Built for {audience}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {benefits.map((b) => (
                            <li key={b} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <CheckCircle size={15} color="rgba(255,255,255,0.85)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.92)', lineHeight: 1.55 }}>
                                    {b}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

// ── Feature Flip Card ─────────────────────────────────────────────────────────
function FeatureCard({
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
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            style={{ perspective: '1000px', height: '220px', cursor: 'pointer' }}
            onMouseEnter={() => setFlipped(true)}
            onMouseLeave={() => setFlipped(false)}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.5s ease',
                    transform: flipped ? 'rotateY(180deg)' : 'none',
                }}
            >
                {/* Front */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background: '#ffffff',
                        border: `1px solid ${BORDER}`,
                        borderRadius: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '28px',
                    }}
                >
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'rgba(219,90,66,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {icon}
                    </div>
                    <div>
                        <p
                            style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: '#e8866f',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                marginBottom: '4px',
                            }}
                        >
                            {name}
                        </p>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: TEXT_PRIMARY, lineHeight: 1.35 }}>
                            {headline}
                        </h3>
                    </div>
                </div>

                {/* Back */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background: '#0d0d12',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '24px',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <p style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.78 }}>{body}</p>
                </div>
            </div>
        </div>
    );
}

// ── Step Panel ────────────────────────────────────────────────────────────────
function StepPanel({
    num,
    title,
    body,
    bg,
    svgContent,
    reverse,
}: {
    num: string;
    title: string;
    body: string;
    bg: string;
    svgContent: React.ReactNode;
    reverse?: boolean;
}) {
    return (
        <section
            style={{
                background: bg,
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                padding: 'clamp(64px,10vw,100px) clamp(24px,5vw,80px)',
            }}
        >
            <div
                className={`step-inner${reverse ? ' step-inner-rev' : ''}`}
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    gap: 'clamp(40px,8vw,100px)',
                    alignItems: 'center',
                    flexDirection: reverse ? 'row-reverse' : 'row',
                    width: '100%',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, x: reverse ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ flex: '1 1 380px' }}
                >
                    <p
                        style={{
                            fontSize: 'clamp(5rem,12vw,9rem)',
                            fontWeight: 900,
                            color: 'rgba(255,255,255,0.05)',
                            lineHeight: 1,
                            marginBottom: '-20px',
                            letterSpacing: '-0.06em',
                            userSelect: 'none',
                        }}
                    >
                        {num}
                    </p>
                    <h2
                        style={{
                            fontSize: 'clamp(1.8rem,4vw,2.8rem)',
                            fontWeight: 800,
                            color: '#ffffff',
                            lineHeight: 1.15,
                            letterSpacing: '-0.03em',
                            marginBottom: '20px',
                        }}
                    >
                        {title}
                    </h2>
                    <p
                        style={{
                            fontSize: 'clamp(0.95rem,1.6vw,1.05rem)',
                            color: 'rgba(255,255,255,0.65)',
                            lineHeight: 1.85,
                            maxWidth: '480px',
                        }}
                    >
                        {body}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: reverse ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        flex: '0 0 auto',
                        width: 'clamp(180px,32vw,340px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {svgContent}
                </motion.div>
            </div>
        </section>
    );
}

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            style={{ borderBottom: `1px solid ${BORDER}`, cursor: 'pointer' }}
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
                <span style={{ fontSize: '1rem', fontWeight: 600, color: TEXT_PRIMARY, lineHeight: 1.5 }}>
                    {question}
                </span>
                <ChevronRight
                    size={18}
                    color={TEXT_MUTED}
                    style={{
                        flexShrink: 0,
                        transform: open ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s ease',
                    }}
                />
            </div>
            {open && (
                <p style={{ fontSize: '0.95rem', color: TEXT_SECONDARY, lineHeight: 1.8, paddingBottom: '20px' }}>
                    {answer}
                </p>
            )}
        </div>
    );
}

// ── SVG Illustrations ─────────────────────────────────────────────────────────
function GalleryGridSVG() {
    return (
        <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '280px' }}>
            <rect x="20" y="20" width="110" height="110" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            <rect x="20" y="150" width="110" height="110" rx="14" fill="rgba(219,90,66,0.22)" stroke="rgba(219,90,66,0.4)" strokeWidth="1.5" />
            <rect x="150" y="20" width="110" height="110" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            <rect x="150" y="150" width="110" height="110" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            <circle cx="75" cy="72" r="16" fill="rgba(255,255,255,0.1)" />
            <path d="M20 130 L70 90 L130 130" stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none" />
            <circle cx="205" cy="65" r="13" fill="rgba(255,255,255,0.1)" />
            <path d="M150 130 L190 100 L235 128" stroke="rgba(255,255,255,0.18)" strokeWidth="2" fill="none" />
            <path d="M75 188 C75 183 68 178 63 183 C58 188 63 198 75 207 C87 198 92 188 87 183 C82 178 75 183 75 188Z" fill="#db5a42" />
        </svg>
    );
}

function UploadSVG() {
    return (
        <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '280px' }}>
            <ellipse cx="140" cy="168" rx="90" ry="38" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <ellipse cx="98" cy="156" rx="50" ry="28" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <ellipse cx="182" cy="154" rx="44" ry="26" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <line x1="140" y1="198" x2="140" y2="76" stroke="#db5a42" strokeWidth="3" strokeLinecap="round" />
            <path d="M120 102 L140 76 L160 102" stroke="#db5a42" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <rect x="56" y="96" width="44" height="44" rx="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            <rect x="178" y="86" width="44" height="44" rx="8" fill="rgba(219,90,66,0.18)" stroke="rgba(219,90,66,0.32)" strokeWidth="1" />
            <rect x="86" y="40" width="36" height="36" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        </svg>
    );
}

function LockSVG() {
    return (
        <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '280px' }}>
            <rect x="60" y="130" width="160" height="120" rx="20" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
            <path d="M100 130 L100 94 C100 71 180 71 180 94 L180 130" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="140" cy="180" r="18" fill="#db5a42" />
            <rect x="136" y="177" width="8" height="20" rx="4" fill="rgba(255,255,255,0.9)" />
            <rect x="202" y="48" width="66" height="24" rx="12" fill="rgba(22,163,74,0.18)" stroke="rgba(22,163,74,0.38)" strokeWidth="1" />
            <text x="210" y="65" fontSize="11" fill="rgba(22,163,74,0.9)" fontFamily="sans-serif" fontWeight="600">Public</text>
            <rect x="202" y="80" width="66" height="24" rx="12" fill="rgba(219,90,66,0.18)" stroke="rgba(219,90,66,0.38)" strokeWidth="1" />
            <text x="214" y="97" fontSize="11" fill="rgba(219,90,66,0.9)" fontFamily="sans-serif" fontWeight="600">PIN</text>
            <rect x="202" y="112" width="66" height="24" rx="12" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            <text x="208" y="129" fontSize="11" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif" fontWeight="600">Private</text>
        </svg>
    );
}

function SendSVG() {
    return (
        <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '280px' }}>
            <rect x="95" y="40" width="90" height="160" rx="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            <rect x="105" y="55" width="70" height="130" rx="8" fill="rgba(255,255,255,0.03)" />
            <rect x="110" y="65" width="28" height="28" rx="5" fill="rgba(219,90,66,0.28)" />
            <rect x="142" y="65" width="28" height="28" rx="5" fill="rgba(255,255,255,0.1)" />
            <rect x="110" y="97" width="28" height="28" rx="5" fill="rgba(255,255,255,0.1)" />
            <rect x="142" y="97" width="28" height="28" rx="5" fill="rgba(219,90,66,0.18)" />
            <path d="M140 145 C140 142 135 139 132 142 C129 145 132 151 140 156 C148 151 151 145 148 142 C145 139 140 142 140 145Z" fill="#db5a42" />
            <path d="M185 140 L235 115 L215 140 L235 165 Z" fill="rgba(219,90,66,0.75)" />
            <circle cx="230" cy="74" r="20" fill="rgba(22,163,74,0.18)" stroke="rgba(22,163,74,0.38)" strokeWidth="1.5" />
            <path d="M222 74 L228 80 L239 69" stroke="rgba(22,163,74,0.9)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function GalleriesLandingPage({
    initialPhotos,
    photosAreReal,
}: {
    initialPhotos: FeaturedPhoto[];
    photosAreReal: boolean;
}) {
    const comparisonRows = [
        { feature: 'Commission on client payments', optimage: '0%',           others: 'Up to 15%'         },
        { feature: 'Per-gallery fees',               optimage: 'None',         others: '$0–12 / gallery'   },
        { feature: 'Client favourites / proofing',   optimage: 'Included',     others: 'Paid tier only'    },
        { feature: 'Photographer branding',          optimage: 'Included',     others: 'Paid tier only'    },
        { feature: 'Activity tracking',              optimage: 'Included',     others: 'Paid tier only'    },
        { feature: 'Payment gating',                 optimage: 'Included',     others: 'Not available'     },
    ];

    const faqItems = [
        {
            question: 'Do my clients need an Optimage account?',
            answer: 'For public and PIN-protected galleries, no — they just need the link. For account-gated galleries, they create a free Optimage account in about 20 seconds using email OTP.',
        },
        {
            question: 'What happens to my photos if I delete a gallery?',
            answer: 'Deleting a gallery removes it from our system and queues the Cloudinary files for deletion. Photos are not retained after deletion. Download originals before deleting.',
        },
        {
            question: 'Can I watermark the photos?',
            answer: 'Watermark mode is on our roadmap. Right-click and drag protection blocks casual copying in the meantime. Downloads are button-only and require a client account.',
        },
        {
            question: 'What file formats can I upload?',
            answer: 'JPEG, PNG, WebP, TIFF, and most camera RAW formats (CR2, NEF, ARW, DNG). RAW files are converted to JPEG automatically for delivery — originals are not stored.',
        },
        {
            question: 'Is there a limit on photos per gallery?',
            answer: 'The default is 500 photos per gallery and 20 galleries per account. Need more? Contact us and we\'ll increase your limits directly at no cost.',
        },
    ];

    return (
        <div style={{ background: '#ffffff', color: TEXT_PRIMARY, minHeight: '100vh' }}>
            <style>{`
                @keyframes photoRain {
                    0%   { transform: translateY(-340px) rotate(var(--init-rot, 0deg)); opacity: 0; }
                    4%   { opacity: 0.82; }
                    92%  { opacity: 0.7; }
                    100% { transform: translateY(calc(100vh + 340px)) rotate(var(--end-rot, 5deg)); opacity: 0; }
                }
                @keyframes bobDown {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(6px); }
                }
                .gallery-rain-card { pointer-events: all; }
                .gallery-rain-card img { pointer-events: none; }
                @media (max-width: 768px) {
                    .step-inner, .step-inner-rev { flex-direction: column !important; }
                    .audience-grid  { grid-template-columns: 1fr !important; }
                    .feature-grid-3 { grid-template-columns: 1fr !important; }
                    .hero-btns      { flex-direction: column !important; align-items: stretch !important; }
                    .trust-bar      { flex-wrap: wrap !important; gap: 16px !important; justify-content: center !important; }
                    .viral-cols     { grid-template-columns: 1fr !important; }
                    .final-cta-btns { flex-direction: column !important; align-items: stretch !important; }
                    .comparison-table td,
                    .comparison-table th { padding: 10px 14px !important; font-size: 0.8rem !important; }
                }
            `}</style>

            <Header />

            {/* ── HERO: PHOTO RAIN ─────────────────────────────────────────── */}
            <section
                style={{
                    background: '#0d0d12',
                    minHeight: '100vh',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: '80px',
                }}
            >
                {/* Photo rain */}
                <div
                    aria-hidden
                    style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
                >
                    {initialPhotos.map((photo, i) => (
                        <RainCard
                            key={i}
                            photo={photo}
                            pos={RAIN_POSITIONS[i % RAIN_POSITIONS.length]!}
                        />
                    ))}
                </div>

                {/* Vignette overlay */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                            'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(13,13,18,0.5) 0%, rgba(13,13,18,0.82) 65%, #0d0d12 100%)',
                        zIndex: 2,
                    }}
                />

                {/* Hero text */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 3,
                        textAlign: 'center',
                        padding: '0 24px',
                        maxWidth: '900px',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.2 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 16px',
                            borderRadius: '100px',
                            border: '1px solid rgba(219,90,66,0.35)',
                            background: 'rgba(219,90,66,0.1)',
                            marginBottom: '28px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            color: '#e8866f',
                            letterSpacing: '0.03em',
                        }}
                    >
                        <Camera size={13} color={ACCENT} />
                        Gallery Delivery for Photographers &amp; Events
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.35 }}
                        style={{
                            fontSize: 'clamp(3rem,7vw,5.5rem)',
                            fontWeight: 900,
                            letterSpacing: '-0.04em',
                            lineHeight: 1.06,
                            color: '#ffffff',
                            marginBottom: '24px',
                        }}
                    >
                        Your clients deserve
                        <br />
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #db5a42 0%, #ff8a6a 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            a gallery, not a link.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        style={{
                            fontSize: 'clamp(1rem,2vw,1.2rem)',
                            color: 'rgba(255,255,255,0.65)',
                            lineHeight: 1.8,
                            maxWidth: '600px',
                            margin: '0 auto 40px',
                        }}
                    >
                        Private galleries with client proofing, payment confirmation, and your branding.
                        Free — zero commissions, no per-gallery fees.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.65 }}
                        className="hero-btns"
                        style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <Link
                            href="/dashboard"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 30px',
                                borderRadius: '100px',
                                background: 'linear-gradient(135deg, #db5a42 0%, #c44d32 100%)',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1rem',
                                textDecoration: 'none',
                                boxShadow: '0 0 32px rgba(219,90,66,0.45)',
                            }}
                        >
                            Start free
                            <ArrowRight size={16} />
                        </Link>
                        <a
                            href="#how-it-works"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '14px 28px',
                                borderRadius: '100px',
                                border: '1px solid rgba(255,255,255,0.18)',
                                background: 'rgba(255,255,255,0.06)',
                                color: 'rgba(255,255,255,0.88)',
                                fontWeight: 600,
                                fontSize: '1rem',
                                textDecoration: 'none',
                            }}
                        >
                            See how it works
                            <ChevronRight size={16} />
                        </a>
                    </motion.div>
                </div>

                {/* Scroll cue */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                    style={{
                        position: 'absolute',
                        bottom: '32px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    <span
                        style={{
                            fontSize: '0.7rem',
                            color: 'rgba(255,255,255,0.3)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        {photosAreReal ? 'Real galleries from our community' : 'Gallery delivery built for professionals'}
                    </span>
                    <ChevronDown
                        size={18}
                        color="rgba(255,255,255,0.28)"
                        style={{ animation: 'bobDown 1.6s ease-in-out infinite' }}
                    />
                </motion.div>
            </section>

            {/* ── TRUST BAR ────────────────────────────────────────────────── */}
            <section
                style={{
                    background: '#ffffff',
                    borderBottom: `1px solid ${BORDER}`,
                    padding: '28px 24px',
                }}
            >
                <div
                    className="trust-bar"
                    style={{
                        maxWidth: '1100px',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        gap: '24px',
                    }}
                >
                    {[
                        { icon: <Zap size={18} color={ACCENT} />,        stat: '0%',     label: 'Commission on payments'  },
                        { icon: <CheckCircle size={18} color={SUCCESS} />, stat: 'Free',   label: 'All features, forever'   },
                        { icon: <Lock size={18} color={ACCENT} />,         stat: '4',      label: 'Access control modes'    },
                        { icon: <Star size={18} color="#f59e0b" />,        stat: '< 5 min',label: 'Gallery setup time'      },
                    ].map(({ icon, stat, label }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {icon}
                            <div>
                                <p style={{ fontSize: '1.05rem', fontWeight: 800, color: TEXT_PRIMARY, lineHeight: 1, marginBottom: '2px' }}>
                                    {stat}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: TEXT_MUTED, fontWeight: 500 }}>{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── WHO IS THIS FOR ──────────────────────────────────────────── */}
            <section
                style={{
                    background: '#f9fafb',
                    padding: 'clamp(64px,10vw,100px) clamp(24px,5vw,60px)',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6 }}
                        style={{ marginBottom: 'clamp(40px,6vw,64px)' }}
                    >
                        <h2
                            style={{
                                fontSize: 'clamp(1.8rem,4vw,2.8rem)',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                color: TEXT_PRIMARY,
                                marginBottom: '12px',
                            }}
                        >
                            Built for everyone who delivers photos professionally.
                        </h2>
                        <p style={{ fontSize: '1.05rem', color: TEXT_SECONDARY, maxWidth: '560px', lineHeight: 1.7 }}>
                            Whether you shoot weddings, corporate events, or product campaigns — your clients
                            need a better experience than a Dropbox link.
                        </p>
                    </motion.div>

                    <div
                        className="audience-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '24px',
                        }}
                    >
                        {[
                            {
                                icon: <Camera size={28} color="#db5a42" />,
                                audience: 'Photographers',
                                tagline: 'Deliver wedding, portrait, and event galleries that protect your work and impress clients.',
                                benefits: [
                                    'PIN-protected delivery — no accidental link sharing',
                                    'Client picks favourites without WhatsApp chaos',
                                    'Gate delivery until invoice is paid',
                                    'Your studio brand on every gallery page',
                                ],
                                accent: '#db5a42',
                                delay: 0,
                            },
                            {
                                icon: <Calendar size={28} color="#2563eb" />,
                                audience: 'Event Planners',
                                tagline: 'Share event memories with attendees, sponsors, and vendors in one organised space.',
                                benefits: [
                                    'Share with full attendee lists or keep it private',
                                    'Branded gallery matches your event identity',
                                    'Track who has viewed and downloaded photos',
                                    'No storage limit headaches on your end',
                                ],
                                accent: '#2563eb',
                                delay: 0.1,
                            },
                            {
                                icon: <Building2 size={28} color="#059669" />,
                                audience: 'Organisations',
                                tagline: 'Internal media libraries, conference coverage, and team photo delivery without IT overhead.',
                                benefits: [
                                    'Account-gated access for staff only',
                                    'Activity log for compliance and accountability',
                                    'Multiple galleries per account',
                                    'No per-seat or per-gallery fees',
                                ],
                                accent: '#059669',
                                delay: 0.2,
                            },
                        ].map((card) => (
                            <motion.div
                                key={card.audience}
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: card.delay }}
                            >
                                <AudienceCard {...card} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
            <div id="how-it-works">
                <StepPanel
                    num="01"
                    title="Create your gallery in under a minute."
                    body="Open your Optimage dashboard, hit 'New Gallery', give it a name, set the expiry date, and choose public or PIN-protected. No settings maze. No required plan upgrade. Done."
                    bg="#111827"
                    svgContent={<GalleryGridSVG />}
                />
                <StepPanel
                    num="02"
                    title="Upload your edited photos."
                    body="Drag and drop your JPEGs or WebPs. Files are automatically compressed, format-optimised, and stored in your private Cloudinary folder. Originals preserved. Delivery size optimised."
                    bg="#0d1a12"
                    svgContent={<UploadSVG />}
                    reverse
                />
                <StepPanel
                    num="03"
                    title="Set exactly who can see it."
                    body="Public link, PIN-protected, email-list only, or Optimage account required. Switch modes any time. Enable or disable downloads independently. Set an expiry date. One click to go live."
                    bg="#0d0d24"
                    svgContent={<LockSVG />}
                />
                <StepPanel
                    num="04"
                    title="Send it. Your client takes it from there."
                    body="Click Send to Client, enter their email. They get a branded delivery notification. They browse, pick favourites, and download. You get notified at every step — view, favourite, download."
                    bg="#1a0d0d"
                    svgContent={<SendSVG />}
                    reverse
                />
            </div>

            {/* ── FEATURE FLIP CARDS ───────────────────────────────────────── */}
            <section
                id="features"
                style={{
                    background: '#f9fafb',
                    padding: 'clamp(64px,10vw,100px) clamp(24px,5vw,60px)',
                }}
            >
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ marginBottom: 'clamp(40px,6vw,64px)' }}
                    >
                        <p
                            style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#e8866f',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '12px',
                            }}
                        >
                            Feature set
                        </p>
                        <h2
                            style={{
                                fontSize: 'clamp(1.8rem,4vw,2.8rem)',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                color: TEXT_PRIMARY,
                                maxWidth: '560px',
                                lineHeight: 1.2,
                            }}
                        >
                            Everything a working photographer needs. Nothing you don&apos;t.
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: TEXT_MUTED, marginTop: '12px' }}>
                            Hover any card to learn more.
                        </p>
                    </motion.div>

                    <div
                        className="feature-grid-3"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px',
                        }}
                    >
                        {[
                            {
                                icon: <Clock size={22} color={ACCENT} />,
                                name: 'Draft Mode',
                                headline: 'Publish when you\'re ready. Not a second earlier.',
                                body: 'Create and upload while still culling. The client gets the link but sees "Gallery being prepared" until you flip it live. No half-finished deliveries.',
                            },
                            {
                                icon: <Heart size={22} color={ACCENT} />,
                                name: 'Client Favourites',
                                headline: 'Stop guessing which photos they love.',
                                body: 'Clients browse and tap heart on every shot they want. When they submit, you get an email: "Sarah selected 47 photos." No spreadsheets, no WhatsApp lists.',
                            },
                            {
                                icon: <CreditCard size={22} color={ACCENT} />,
                                name: 'Payment Confirmation',
                                headline: 'Deliver when the invoice is settled.',
                                body: 'Set payment-confirmation mode. Client sees your bank details. Once they\'ve paid and you confirm, one click unlocks the gallery. You keep 100% of the invoice.',
                            },
                            {
                                icon: <Lock size={22} color={ACCENT} />,
                                name: 'Access Control',
                                headline: 'Decide exactly who can open the gallery.',
                                body: 'Public, PIN-protected, email-list only, or account-required. Switch modes any time. PINs are hashed — never stored in plain text.',
                            },
                            {
                                icon: <Globe size={22} color={ACCENT} />,
                                name: 'Photographer Branding',
                                headline: 'Your studio name on every gallery page.',
                                body: 'Set your studio name, brand colour, and website URL once. The gallery footer shows your brand — not ours. Your clients remember your name.',
                            },
                            {
                                icon: <Eye size={22} color={ACCENT} />,
                                name: 'Activity Tracking',
                                headline: 'See who\'s opened the gallery and when.',
                                body: 'Every view is logged with a timestamp. Know when your client first opened it, how many times they returned, and who submitted favourites.',
                            },
                        ].map((f, i) => (
                            <motion.div
                                key={f.name}
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                            >
                                <FeatureCard {...f} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── VIRAL LOOP ───────────────────────────────────────────────── */}
            <section
                style={{
                    background: '#fff7f5',
                    borderTop: '1px solid rgba(219,90,66,0.1)',
                    borderBottom: '1px solid rgba(219,90,66,0.1)',
                    padding: 'clamp(64px,10vw,100px) clamp(24px,5vw,60px)',
                }}
            >
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div
                        className="viral-cols"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '64px',
                            alignItems: 'center',
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -28 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.65 }}
                        >
                            <p
                                style={{
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: ACCENT,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    marginBottom: '16px',
                                }}
                            >
                                Growth flywheel
                            </p>
                            <h2
                                style={{
                                    fontSize: 'clamp(1.8rem,4vw,2.6rem)',
                                    fontWeight: 800,
                                    letterSpacing: '-0.03em',
                                    color: TEXT_PRIMARY,
                                    lineHeight: 1.2,
                                    marginBottom: '20px',
                                }}
                            >
                                Your galleries market you automatically.
                            </h2>
                            <p
                                style={{
                                    fontSize: '1rem',
                                    color: TEXT_SECONDARY,
                                    lineHeight: 1.8,
                                    marginBottom: '28px',
                                }}
                            >
                                Every gallery your client shares with family becomes a portfolio view for
                                your studio. Optimage galleries include a subtle studio credit — your name,
                                your website, discoverable by every person who views the gallery.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {[
                                    { icon: <Share2 size={15} color={ACCENT} />, text: 'Client shares gallery link with 30 guests' },
                                    { icon: <Eye size={15} color={ACCENT} />,    text: '30 guests see your studio brand in the footer' },
                                    { icon: <Camera size={15} color={ACCENT} />, text: '2–3 book their own sessions from word of mouth' },
                                ].map(({ icon, text }) => (
                                    <div key={text} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <div
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '8px',
                                                background: 'rgba(219,90,66,0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {icon}
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: TEXT_SECONDARY, lineHeight: 1.6, paddingTop: '4px' }}>
                                            {text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Gallery mock-up */}
                        <motion.div
                            initial={{ opacity: 0, x: 28 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.65, delay: 0.1 }}
                        >
                            <div
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '20px',
                                    border: `1px solid ${BORDER}`,
                                    overflow: 'hidden',
                                    boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
                                }}
                            >
                                {/* Browser chrome */}
                                <div
                                    style={{
                                        background: '#f3f4f6',
                                        padding: '10px 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        borderBottom: `1px solid ${BORDER}`,
                                    }}
                                >
                                    {['#f87171', '#fbbf24', '#34d399'].map((c) => (
                                        <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
                                    ))}
                                    <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '4px', height: '18px', marginLeft: '8px' }} />
                                </div>

                                <div style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: TEXT_PRIMARY }}>
                                                Smith &amp; Jones Wedding
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>247 photos · June 2026</p>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                color: SUCCESS,
                                                background: 'rgba(22,163,74,0.1)',
                                                padding: '4px 10px',
                                                borderRadius: '100px',
                                            }}
                                        >
                                            Live
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '6px',
                                            marginBottom: '16px',
                                        }}
                                    >
                                        {['#d1c5b8', '#b8c5d1', '#c5d1b8', '#d1b8c5', '#b8d1c5', '#c5b8d1'].map((bg, i) => (
                                            <div
                                                key={i}
                                                style={{
                                                    aspectRatio: '1',
                                                    borderRadius: '8px',
                                                    background: bg,
                                                    position: 'relative',
                                                }}
                                            >
                                                {(i === 1 || i === 4) && (
                                                    <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                                                        <Heart size={12} color="#db5a42" fill="#db5a42" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div
                                        style={{
                                            borderTop: `1px solid ${BORDER}`,
                                            paddingTop: '12px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <p style={{ fontSize: '0.7rem', color: TEXT_MUTED }}>
                                            Delivered by{' '}
                                            <span style={{ color: ACCENT, fontWeight: 600 }}>YourStudio.com</span>
                                        </p>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <Eye size={12} color={TEXT_MUTED} />
                                            <span style={{ fontSize: '0.7rem', color: TEXT_MUTED }}>14 views</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── COMPARISON ───────────────────────────────────────────────── */}
            <section
                style={{
                    background: '#ffffff',
                    padding: 'clamp(64px,10vw,100px) clamp(24px,5vw,60px)',
                }}
            >
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ marginBottom: 'clamp(40px,6vw,56px)' }}
                    >
                        <h2
                            style={{
                                fontSize: 'clamp(1.8rem,4vw,2.8rem)',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                color: TEXT_PRIMARY,
                            }}
                        >
                            Free to use. No commissions. No per-gallery fees.
                        </h2>
                        <p style={{ fontSize: '1rem', color: TEXT_SECONDARY, marginTop: '12px', lineHeight: 1.7 }}>
                            Everything included with your free Optimage account.
                        </p>
                    </motion.div>

                    <div style={{ overflowX: 'auto', borderRadius: '20px', border: `1px solid ${BORDER}` }}>
                        <table
                            className="comparison-table"
                            style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem', background: '#ffffff' }}
                        >
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                                    <th style={{ textAlign: 'left', padding: '16px 24px', color: TEXT_MUTED, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', width: '50%' }}>
                                        Feature
                                    </th>
                                    <th style={{ textAlign: 'center', padding: '16px 24px', color: ACCENT, fontWeight: 700, fontSize: '0.88rem' }}>
                                        Optimage
                                    </th>
                                    <th style={{ textAlign: 'center', padding: '16px 24px', color: TEXT_MUTED, fontWeight: 600, fontSize: '0.88rem' }}>
                                        Pixieset / ShootProof
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonRows.map((row, i) => (
                                    <tr
                                        key={row.feature}
                                        style={{
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
                                                }}
                                            >
                                                <CheckCircle size={14} color={SUCCESS} />
                                                {row.optimage}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 24px', textAlign: 'center', color: TEXT_MUTED, fontSize: '0.88rem' }}>
                                            {row.others}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── FAQ ──────────────────────────────────────────────────────── */}
            <section
                style={{
                    background: '#f9fafb',
                    padding: 'clamp(64px,10vw,100px) clamp(24px,5vw,60px)',
                }}
            >
                <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{
                            fontSize: 'clamp(1.8rem,4vw,2.4rem)',
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            color: TEXT_PRIMARY,
                            marginBottom: 'clamp(32px,5vw,48px)',
                            textAlign: 'center',
                        }}
                    >
                        Questions we get asked.
                    </motion.h2>
                    <div style={{ borderTop: `1px solid ${BORDER}` }}>
                        {faqItems.map((item) => (
                            <FaqItem key={item.question} {...item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ────────────────────────────────────────────────── */}
            <section
                style={{
                    background: '#0d0d12',
                    padding: 'clamp(80px,14vw,140px) clamp(24px,5vw,60px)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(219,90,66,0.13) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />

                <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
                            {[Camera, Heart, Shield].map((Icon, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: 'rgba(219,90,66,0.14)',
                                        border: '1px solid rgba(219,90,66,0.24)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Icon size={20} color={ACCENT} />
                                </div>
                            ))}
                        </div>

                        <h2
                            style={{
                                fontSize: 'clamp(2rem,5vw,3.5rem)',
                                fontWeight: 900,
                                letterSpacing: '-0.04em',
                                lineHeight: 1.1,
                                color: '#ffffff',
                                marginBottom: '20px',
                            }}
                        >
                            The next gallery you deliver
                            <br />
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #db5a42 0%, #ff8a6a 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                should feel different.
                            </span>
                        </h2>

                        <p
                            style={{
                                fontSize: '1.05rem',
                                color: 'rgba(255,255,255,0.6)',
                                lineHeight: 1.8,
                                marginBottom: '40px',
                            }}
                        >
                            Set up your first gallery in under 5 minutes. Free account — no credit card, no commission ever.
                        </p>

                        <div
                            className="final-cta-btns"
                            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
                        >
                            <Link
                                href="/dashboard"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '15px 32px',
                                    borderRadius: '100px',
                                    background: 'linear-gradient(135deg, #db5a42 0%, #c44d32 100%)',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    textDecoration: 'none',
                                    boxShadow: '0 0 40px rgba(219,90,66,0.5)',
                                }}
                            >
                                Create a gallery
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/compress"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '15px 28px',
                                    borderRadius: '100px',
                                    border: '1px solid rgba(255,255,255,0.14)',
                                    background: 'rgba(255,255,255,0.06)',
                                    color: 'rgba(255,255,255,0.82)',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    textDecoration: 'none',
                                }}
                            >
                                Try the image tools
                            </Link>
                        </div>

                        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', marginTop: '24px' }}>
                            Free account · No credit card · No commission
                        </p>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
