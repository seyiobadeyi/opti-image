'use client';

import Image from 'next/image';

import React from 'react';

export default function ShowcaseGallery(): React.JSX.Element {
    const images = Array.from({ length: 12 }, (_, i) => `/image-${i + 1}.png`);

    return (
        <section className="showcase-section" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '40px auto 0', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: 800, background: 'linear-gradient(135deg, #db5a42 0%, #c44d32 100%)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                Pixel Perfect Optimization
            </h2>
            <p style={{ color: '#9ca3af', marginBottom: '48px', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 48px' }}>
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
                        borderRadius: '16px',
                        overflow: 'hidden',
                        aspectRatio: idx % 4 === 0 ? '3/4' : '1/1',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(219, 90, 66, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
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
