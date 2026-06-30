import { ImageResponse } from 'next/og';

// Shared Open Graph image renderer. Generates a branded 1200×630 card on the fly
// so every page gets a unique, on-brand social thumbnail — no static images in
// /public, no per-post artwork to maintain.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const ACCENT = '#db5a42';

export function renderOgImage({ title, eyebrow = 'Optimage' }: { title: string; eyebrow?: string }) {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '72px',
                    backgroundColor: '#0d0d12',
                    backgroundImage: 'radial-gradient(circle at 18% -10%, rgba(219,90,66,0.30), transparent 55%)',
                    color: '#ffffff',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Wordmark */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '13px', backgroundColor: ACCENT, display: 'flex' }} />
                    <div style={{ display: 'flex', fontSize: '30px', fontWeight: 700 }}>Optimage</div>
                </div>

                {/* Title block */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', fontSize: '22px', letterSpacing: '3px', textTransform: 'uppercase', color: ACCENT, fontWeight: 600, marginBottom: '20px' }}>
                        {eyebrow}
                    </div>
                    <div style={{ display: 'flex', fontSize: '62px', fontWeight: 800, lineHeight: 1.12, maxWidth: '1010px' }}>
                        {title}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', fontSize: '24px', color: 'rgba(255,255,255,0.55)' }}>
                    optimage.dreamintrepid.com
                </div>
            </div>
        ),
        { ...OG_SIZE },
    );
}
