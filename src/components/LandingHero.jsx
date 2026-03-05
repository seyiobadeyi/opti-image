'use client';

import Image from 'next/image';
import { ArrowDown } from 'lucide-react';

export default function LandingHero() {
    const scrollToDropzone = () => {
        document.getElementById('dropzone-area')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="landing-hero" style={{
            position: 'relative',
            padding: '120px 24px 80px',
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '80vh',
            justifyContent: 'center'
        }}>

            <div style={{ position: 'absolute', top: '10%', left: '5%', zIndex: -1, opacity: 0.15, transform: 'rotate(-5deg)' }}>
                <Image unoptimized src="/image-1.png" alt="Optimization tech" width={300} height={300} style={{ borderRadius: '24px', filter: 'blur(2px)' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '15%', right: '5%', zIndex: -1, opacity: 0.15, transform: 'rotate(5deg)' }}>
                <Image unoptimized src="/image-2.png" alt="Server tech" width={350} height={350} style={{ borderRadius: '24px', filter: 'blur(1px)' }} />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--bg-tertiary)', borderRadius: '100px', marginBottom: '32px', border: '1px solid var(--border)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }}></span>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Unlimited Free Image Processing</span>
            </div>

            <h1 style={{
                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                lineHeight: 1.1,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '24px',
                color: 'var(--text-primary)'
            }}>
                Respect the <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Pixels.</span>
                <br />
                Save the Bandwidth.
            </h1>

            <p style={{
                fontSize: '1.2rem',
                color: 'var(--text-secondary)',
                maxWidth: '650px',
                margin: '0 auto 48px',
                lineHeight: 1.6
            }}>
                A fiercely independent media processing suite built for developers, photographers, and creators who need flawless compression without the hassle. Drag, drop, and witness pixel-perfect optimizations locally via the Edge. No subscriptions to process.
            </p>

            <button
                onClick={scrollToDropzone}
                className="btn btn-primary btn-large"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 32px',
                    fontSize: '1.1rem',
                    boxShadow: 'var(--shadow-glow)'
                }}>
                Start Optimizing for Free
                <ArrowDown size={20} />
            </button>

        </section>
    );
}
