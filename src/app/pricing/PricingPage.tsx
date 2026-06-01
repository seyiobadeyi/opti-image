import React from 'react';
import { Check, Image, Film, Mic, Zap, Clock, Lock } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
    { icon: Image,  label: 'All image formats', sub: 'JPEG, PNG, WebP, AVIF, TIFF, GIF, HEIC' },
    { icon: Zap,    label: 'Bulk processing',   sub: 'Up to 50 files at once, ZIP download' },
    { icon: Film,   label: 'Video compression', sub: 'H.264 via FFmpeg, with quality control' },
    { icon: Mic,    label: 'AI transcription',  sub: 'Audio and video to text, multi-language' },
    { icon: Clock,  label: 'Processing history', sub: 'Dashboard with full session history' },
    { icon: Lock,   label: 'Private by design', sub: 'Files deleted after processing' },
];

export default function PricingPage(): React.JSX.Element {
    return (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px 100px', textAlign: 'center' }}>

            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                100% free. No plans, no paywalls.
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#374151', maxWidth: '520px', margin: '0 auto 56px', lineHeight: 1.65 }}>
                Every tool on Optimage is free for everyone. No account required to start, no file limits, no hidden fees.
            </p>

            {/* Feature grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '56px', textAlign: 'left' }}>
                {FEATURES.map(({ icon: Icon, label, sub }) => (
                    <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px' }}>
                        <Icon size={18} color="#db5a42" style={{ marginBottom: '10px' }} />
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{label}</div>
                        <div style={{ fontSize: '0.78rem', color: '#9ca3af', lineHeight: 1.5 }}>{sub}</div>
                    </div>
                ))}
            </div>

            {/* Account benefits note */}
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px 32px', marginBottom: '40px', textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '12px' }}>
                    What you get with a free account
                </div>
                {[
                    'Processing history — see every file you have optimized',
                    'Client galleries — share photos with clients in private galleries',
                    'Dashboard — manage all your files and settings in one place',
                ].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px', fontSize: '0.9rem', color: '#374151' }}>
                        <Check size={14} color="#db5a42" style={{ marginTop: '2px', flexShrink: 0 }} />
                        {item}
                    </div>
                ))}
                <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '8px', marginBottom: 0 }}>
                    No credit card needed. Sign up takes 30 seconds.
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                    href="/compress"
                    style={{ background: '#db5a42', color: '#fff', textDecoration: 'none', borderRadius: '12px', padding: '13px 28px', fontSize: '0.97rem', fontWeight: 700 }}
                >
                    Start compressing
                </Link>
                <Link
                    href="/"
                    style={{ background: '#f9fafb', color: '#374151', textDecoration: 'none', borderRadius: '12px', padding: '13px 28px', fontSize: '0.97rem', fontWeight: 600, border: '1px solid #e5e7eb' }}
                >
                    Browse all tools
                </Link>
            </div>
        </div>
    );
}
