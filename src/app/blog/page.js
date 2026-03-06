import { getSortedPostsData } from '@/lib/markdown';
import Link from 'next/link';

export const metadata = {
    title: 'Blog - Performance & Image Optimization Engineering',
    description: 'Deep technical diving into lossless algorithms, edge computing, audio transcription, and maximizing Web Vitals via precise media compression.',
};

export default function BlogIndex() {
    const allPostsData = getSortedPostsData() || [];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em' }}>Optimage Engineering Blog</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '64px', lineHeight: 1.6 }}>
                Technical insights, coding tutorials, and deep dives into the math and architecture powering modern lossless compression algorithms.
            </p>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {allPostsData.map(({ slug, date, title, excerpt }) => (
                    <li key={slug} style={{ marginBottom: '48px' }}>
                        <Link href={`/blog/${slug}`} style={{ textDecoration: 'none' }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px', color: 'var(--accent-primary)', transition: 'color 0.2s', ':hover': { color: 'var(--accent-glow)' } }}>
                                {title}
                            </h2>
                        </Link>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{date}</div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{excerpt}</p>
                        <Link href={`/blog/${slug}`} style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '12px', display: 'inline-block' }}>
                            Read exactly how we built it →
                        </Link>
                    </li>
                ))}
            </ul>

            {allPostsData.length === 0 && (
                <div style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '16px' }}>Content Generating...</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Our engineering team is currently pushing new technical write-ups. Check back soon.</p>
                </div>
            )}
        </div>
    );
}
