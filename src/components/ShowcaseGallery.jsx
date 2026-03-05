'use client';

import Image from 'next/image';

export default function ShowcaseGallery() {
    const images = Array.from({ length: 12 }, (_, i) => `/image-${i + 1}.png`);

    return (
        <section className="showcase-section" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '40px auto 0', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                Pixel Perfect Optimization
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 48px' }}>
                Deliver lightning-fast experiences with flawless visual fidelity. See the quality of our WebP and AVIF conversions below.
            </p>

            <div className="gallery-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '20px',
            }}>
                {images.map((src, idx) => (
                    <div key={idx} className="gallery-item" style={{
                        position: 'relative',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        aspectRatio: idx % 4 === 0 ? '3/4' : '1/1',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }}
                    >
                        <Image
                            src={src}
                            alt={`Optimized sample ${idx + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
