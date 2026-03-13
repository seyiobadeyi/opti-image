import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '404 — Page Not Found | Optimage',
    description: 'The page you are looking for does not exist.',
};

export default function NotFound(): React.JSX.Element {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden',
        }}>
            {/* Decorative blobs */}
            <div style={{ position: 'absolute', top: '-200px', left: '-200px', width: '500px', height: '500px', background: 'var(--accent-glow)', filter: 'blur(120px)', borderRadius: '50%', opacity: 0.15, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-200px', right: '-200px', width: '400px', height: '400px', background: 'rgba(108, 92, 231, 0.15)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                {/* Giant 404 */}
                <h1 style={{
                    fontSize: 'clamp(8rem, 20vw, 14rem)', fontWeight: 900,
                    background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    lineHeight: 1, marginBottom: '16px', letterSpacing: '-0.05em',
                    textShadow: 'none',
                }}>
                    404
                </h1>

                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                    Lost in the Compression Pipeline
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '40px' }}>
                    Looks like this page was optimized a little too aggressively — it no longer exists. Let's get you back to something real.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/" className="btn btn-primary" style={{ padding: '14px 32px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        ← Back to Home
                    </Link>
                    <Link href="/blog" className="btn btn-secondary" style={{ padding: '14px 32px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        Read Our Blog
                    </Link>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '48px' }}>
                    Error Code: 404 — Resource Not Found
                </p>
            </div>
        </div>
    );
}
