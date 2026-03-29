'use client';

import React from 'react';
import Image from 'next/image';

export default function LandingBento(): React.JSX.Element {
    return (
        <section className="bento-section" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <h2 className="bento-heading" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em' }}>
                    Crafted for Performance
                </h2>
                <p className="bento-intro-text" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
                    We stripped away the clutter to focus on what actually matters — passing the strictest Web Vitals checks while preserving the soul of your photography.
                </p>
            </div>

            <div className="bento-stack" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* 1. Large Showcase — Lossless Compression */}
                <div className="bento-box bento-card-lg" style={{
                    background: 'var(--bg-card)',
                    borderRadius: '28px',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}>
                    <div className="bento-showcase-content bento-box-padded" style={{
                        flex: '1 1 360px',
                        padding: '56px 44px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}>
                        <h3 className="bento-title" style={{ fontSize: '2.2rem', marginBottom: '16px', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
                            Lossless compression isn&apos;t a buzzword.
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                            We leverage modern codecs like AVIF and WebP under the hood. When you upload a heavy TIFF file, our engine strips the bloat while calculating the exact mathematical threshold needed to retain human-perceptible perfection. The result? 90% size reductions that your eyes simply cannot detect.
                        </p>
                    </div>
                    <div className="bento-showcase-img" style={{ flex: '1 1 360px', position: 'relative', minHeight: '380px' }}>
                        <Image unoptimized src="/image-5.png" alt="High fidelity comparison" fill style={{ objectFit: 'cover' }} />
                    </div>
                </div>

                {/* 2 & 3. Split — Edge Infrastructure & Privacy */}
                <div className="bento-grid-2" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '24px',
                }}>
                    <div className="bento-box bento-card bento-box-padded" style={{
                        background: 'var(--bg-card)',
                        borderRadius: '20px',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <div className="bento-card-img" style={{ position: 'relative', height: '220px', width: '100%', marginBottom: '28px', borderRadius: '12px', overflow: 'hidden' }}>
                            <Image unoptimized src="/image-2.png" alt="Edge Infrastructure" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <h3 className="bento-subtitle" style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Edge Infrastructure</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65 }}>
                            Milliseconds matter. We bypass slow legacy queues by routing your uploads through high-throughput edge nodes, executing the transformation exactly where you are.
                        </p>
                    </div>

                    <div className="bento-box bento-card bento-box-padded" style={{
                        background: 'var(--bg-card)',
                        borderRadius: '20px',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <div className="bento-card-img" style={{ position: 'relative', height: '220px', width: '100%', marginBottom: '28px', borderRadius: '12px', overflow: 'hidden' }}>
                            <Image unoptimized src="/image-11.png" alt="Privacy architecture" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
                        </div>
                        <h3 className="bento-subtitle" style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Your Data, Your Control</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65 }}>
                            Processed files are cleared from our servers within 30 minutes. Subscribers can also save work to a personal cloud gallery for download anytime. We never use your images for model training.
                        </p>
                    </div>
                </div>

                {/* 4. Full-Width Cinematic Banner — Native Web Vitals */}
                <div className="bento-box bento-cinematic" style={{
                    position: 'relative',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    height: '460px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border)',
                }}>
                    <Image unoptimized src="/image-4.png" alt="Native Web Vitals" fill style={{ objectFit: 'cover', filter: 'brightness(0.38)' }} />
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '780px', padding: '0 32px' }}>
                        <h3 className="bento-hero-text" style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '18px', color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                            Native Web Vitals
                        </h3>
                        <p className="bento-cinematic-sub" style={{ fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.7, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                            Unlock maximum Lighthouse scores. Stop bleeding organic traffic due to unoptimized LCP delays. Our pipeline guarantees green metrics across the board.
                        </p>
                    </div>
                </div>

                {/* 5, 6 & 7. Three Column Grid — API, Batch, Asset Mgmt */}
                <div className="bento-grid-3" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '24px',
                }}>
                    {([
                        {
                            img: '/image-8.png', alt: 'Developer API',
                            title: 'Developer API',
                            badge: 'Coming Soon',
                            desc: 'Architected for builders. Hook directly into our microservices. Push massive media buffers programmatically without writing the compression mathematics yourself.',
                        },
                        {
                            img: '/image-6.png', alt: 'Batch Processing',
                            title: 'Batch Processing',
                            desc: 'Drag 50 images at once. Our engine crunches them into a neat ZIP archive in seconds without locking up your browser.',
                        },
                        {
                            img: '/image-10.png', alt: 'Asset Management',
                            title: 'Asset Management',
                            desc: 'Keep your optimised files organised with our dynamic visual dashboards and processing history views.',
                        },
                    ] as { img: string; alt: string; title: string; badge?: string; desc: string }[]).map(({ img, alt, title, badge, desc }) => (
                        <div key={title} className="bento-box bento-card bento-box-padded" style={{ background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--border)', padding: '28px' }}>
                            <div className="bento-sm-img" style={{ position: 'relative', height: '150px', width: '100%', marginBottom: '22px', borderRadius: '10px', overflow: 'hidden' }}>
                                <Image unoptimized src={img} alt={alt} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                {title}
                                {badge && (
                                    <span style={{ fontSize: '0.68rem', padding: '3px 8px', background: 'var(--bg-tertiary)', borderRadius: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                        {badge}
                                    </span>
                                )}
                            </h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.65 }}>{desc}</p>
                        </div>
                    ))}
                </div>

                {/* 8. Reversed Showcase — Built from real work */}
                <div className="bento-box bento-card-lg" style={{
                    background: 'var(--bg-card)',
                    borderRadius: '28px',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    flexWrap: 'wrap',
                }}>
                    <div className="bento-showcase-content bento-box-padded" style={{
                        flex: '1 1 360px',
                        padding: '56px 44px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}>
                        <h3 className="bento-title" style={{ fontSize: '2.2rem', marginBottom: '16px', letterSpacing: '-0.01em', lineHeight: 1.15 }}>
                            Built from real work.
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                            Optimage wasn&apos;t built in a lab. It started as an internal tool used daily across Shopify builds, WordPress sites, CRO experiments, and marketing campaigns. Every project had the same challenge: images were the heaviest part of the page. So we built a system to fix it automatically. Now it&apos;s open for everyone.
                        </p>
                    </div>
                    <div className="bento-showcase-img" style={{ flex: '1 1 360px', position: 'relative', minHeight: '380px' }}>
                        <Image unoptimized src="/image-3.png" alt="Smart Analysis" fill style={{ objectFit: 'cover', objectPosition: 'left center' }} />
                    </div>
                </div>

                {/* 9 & 10. Bottom Split — Enterprise & Dark Mode */}
                <div className="bento-grid-2" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '24px',
                }}>
                    <div className="bento-box bento-card bento-box-padded" style={{
                        background: 'linear-gradient(135deg, rgba(108,92,231,0.1), transparent)',
                        borderRadius: '20px',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <div className="bento-card-img" style={{ position: 'relative', height: '190px', width: '100%', marginBottom: '28px', borderRadius: '12px', overflow: 'hidden' }}>
                            <Image unoptimized src="/image-9.png" alt="Enterprise SLAs" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <h3 className="bento-subtitle" style={{ fontSize: '1.4rem', marginBottom: '10px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            Enterprise SLAs
                            <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', color: 'var(--text-secondary)' }}>
                                Coming Soon
                            </span>
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65 }}>
                            Custom agreements and dedicated processing clusters for high-volume enterprise pipelines. Run massive marketing catalogs through our premium tier.
                        </p>
                    </div>

                    <div className="bento-box bento-card bento-box-padded" style={{
                        background: '#0a0a0f',
                        borderRadius: '20px',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)',
                    }}>
                        <div className="bento-card-img" style={{ position: 'relative', height: '190px', width: '100%', marginBottom: '28px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a2e' }}>
                            <Image unoptimized src="/image-12.png" alt="Dark Mode Native" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <h3 className="bento-subtitle" style={{ fontSize: '1.4rem', marginBottom: '10px', color: '#fff' }}>Dark Mode Native</h3>
                        <p style={{ color: '#8892b0', fontSize: '1rem', lineHeight: 1.65 }}>
                            Beautifully engineered aesthetic built for night owls, ensuring less eye strain during late-night development sessions.
                        </p>
                    </div>
                </div>

            </div>

            {/* Dream Intrepid attribution */}
            <div style={{ textAlign: 'center', marginTop: '56px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Optimage is one of several professional tools built by
                </p>
                <a
                    href="https://dreamintrepid.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '100px', border: '1px solid var(--border)', background: 'var(--bg-card)', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                >
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Dream Intrepid</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>— digital products &amp; creative tools →</span>
                </a>
            </div>
        </section>
    );
}
