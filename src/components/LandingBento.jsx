'use client';

import Image from 'next/image';

export default function LandingBento() {
    return (
        <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <h2 className="bento-heading" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em' }}>Crafted for Performance</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
                    We stripped away the clutter to focus on what actually matters passing the strictest Web Vitals checks while preserving the soul of your photography.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* 1. Large Showcase Block (Lossless Compression) - From original Bento */}
                <div className="bento-box" style={{
                    background: 'var(--bg-card)',
                    borderRadius: '32px',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: '1 1 400px', padding: '64px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 className="bento-title" style={{ fontSize: '2.5rem', marginBottom: '16px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>Lossless compression isn't a buzzword.</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.1rem' }}>
                            We leverage modern codecs like AVIF and WebP under the hood. When you upload a heavy TIFF file, our engine strips the bloat while calculating the exact mathematical threshold needed to retain human-perceptible perfection. The result? 90% size reductions that your eyes simply cannot detect.
                        </p>
                    </div>
                    <div style={{ flex: '1 1 400px', position: 'relative', minHeight: '400px' }}>
                        <Image unoptimized src="/image-5.png" alt="High fidelity comparison" fill style={{ objectFit: 'cover' }} />
                    </div>
                </div>

                {/* 2 & 3. Split Block (Edge Infrastructure & Privacy) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '32px',
                }}>
                    <div className="bento-box" style={{
                        background: 'var(--bg-card)',
                        borderRadius: '24px',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        padding: '40px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ position: 'relative', height: '240px', width: '100%', marginBottom: '32px', borderRadius: '16px', overflow: 'hidden' }}>
                            <Image unoptimized src="/image-2.png" alt="Edge Infrastructure" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <h3 className="bento-subtitle" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Edge Infrastructure</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                            Milliseconds matter. We bypass slow legacy queues by routing your uploads through high-throughput edge nodes, executing the transformation exactly where you are located.
                        </p>
                    </div>

                    <div className="bento-box" style={{
                        background: 'var(--bg-card)',
                        borderRadius: '24px',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        padding: '40px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ position: 'relative', height: '240px', width: '100%', marginBottom: '32px', borderRadius: '16px', overflow: 'hidden' }}>
                            <Image unoptimized src="/image-11.png" alt="Privacy architecture" fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
                        </div>
                        <h3 className="bento-subtitle" style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Zero Retention Policy</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                            Your data is yours. The moment your files are converted and downloaded, our server scripts meticulously purge them from the temporary drives. No model training, no silent hoarding.
                        </p>
                    </div>
                </div>

                {/* 4. Full Width Cinematic Banner (Native Web Vitals) */}
                <div className="bento-box" style={{
                    position: 'relative',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border)'
                }}>
                    <Image unoptimized src="/image-4.png" alt="Native Web Vitals" fill style={{ objectFit: 'cover', filter: 'brightness(0.4)' }} />
                    <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px', padding: '0 40px' }}>
                        <h3 className="bento-hero-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px', color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>Native Web Vitals</h3>
                        <p style={{ fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.7, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                            Unlock maximum Lighthouse scores. Stop bleeding organic traffic due to unoptimized LCP delays. Our pipeline guarantees green metrics across the board.
                        </p>
                    </div>
                </div>

                {/* 5, 6 & 7. Three Column Grid (API, Batch, Asset Mgmt) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px',
                }}>
                    <div className="bento-box" style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', padding: '32px' }}>
                        <div style={{ position: 'relative', height: '160px', width: '100%', marginBottom: '24px', borderRadius: '12px', overflow: 'hidden' }}>
                            <Image unoptimized src="/image-8.png" alt="Developer API" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <h4 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Developer API</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Architected for builders. Hook directly into our microservices. Push massive media buffers programmatically without writing the compression mathematics yourself.</p>
                    </div>
                    <div className="bento-box" style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', padding: '32px' }}>
                        <div style={{ position: 'relative', height: '160px', width: '100%', marginBottom: '24px', borderRadius: '12px', overflow: 'hidden' }}>
                            <Image unoptimized src="/image-6.png" alt="Batch Processing" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <h4 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Batch Processing</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Drag 50 images at once. Our engine crunches them into a neat ZIP archive in seconds without locking up your browser.</p>
                    </div>
                    <div className="bento-box" style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', padding: '32px' }}>
                        <div style={{ position: 'relative', height: '160px', width: '100%', marginBottom: '24px', borderRadius: '12px', overflow: 'hidden' }}>
                            <Image unoptimized src="/image-10.png" alt="Asset Management" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <h4 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Asset Management</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Keep your optimized files organized with our dynamic visual dashboards and processing history views.</p>
                    </div>
                </div>

                {/* 8. Reversed Large Showcase Block (Smart Analysis) */}
                <div className="bento-box" style={{
                    background: 'var(--bg-card)',
                    borderRadius: '32px',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: '1 1 400px', padding: '64px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 className="bento-title" style={{ fontSize: '2.5rem', marginBottom: '16px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>Smart Analysis Routing</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.1rem' }}>
                            AI-assisted routing determines the exact compression threshold per pixel, ensuring gradients stay smooth and text stays crisp. We don't just compress; we understand the visual data inside the container.
                        </p>
                    </div>
                    <div style={{ flex: '1 1 400px', position: 'relative', minHeight: '400px' }}>
                        <Image unoptimized src="/image-3.png" alt="Smart Analysis" fill style={{ objectFit: 'cover', objectPosition: 'left center' }} />
                    </div>
                </div>

                {/* 9 & 10. Split Block Bottom (Enterprise & Dark Mode) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '32px',
                }}>
                    <div className="bento-box" style={{
                        background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.1), transparent)',
                        borderRadius: '24px',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        padding: '40px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ position: 'relative', height: '200px', width: '100%', marginBottom: '32px', borderRadius: '16px', overflow: 'hidden' }}>
                            <Image unoptimized src="/image-9.png" alt="Enterprise SLAs" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <h3 className="bento-subtitle" style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Enterprise SLAs</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                            Custom agreements and dedicated processing clusters for high-volume enterprise pipelines. Run massive marketing catalogs through our premium tier.
                        </p>
                    </div>

                    <div className="bento-box" style={{
                        background: '#0a0a0f',
                        borderRadius: '24px',
                        border: '1px solid var(--border)',
                        overflow: 'hidden',
                        padding: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ position: 'relative', height: '200px', width: '100%', marginBottom: '32px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1a1a2e' }}>
                            <Image unoptimized src="/image-12.png" alt="Dark Mode Native" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <h3 className="bento-subtitle" style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#fff' }}>Dark Mode Native</h3>
                        <p style={{ color: '#8892b0', fontSize: '1.05rem', lineHeight: 1.6 }}>
                            Beautifully engineered aesthetic built for night owls, ensuring less eye strain during late-night development sessions.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
