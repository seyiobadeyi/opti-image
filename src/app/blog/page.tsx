import { getSortedPostsData } from '@/lib/markdown';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { BlogPostMeta } from '@/types';

export const metadata: Metadata = {
    title: 'The Optimage Journal: Insights on Media, Performance & the Web',
    description: 'Practical guides, data-driven research, and real-world insights on image optimization, web performance, and building faster digital products.',
};

export default function BlogIndex(): React.JSX.Element {
    const allPostsData: BlogPostMeta[] = getSortedPostsData() || [];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em' }}>The Optimage Journal</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '64px', lineHeight: 1.6 }}>
                Practical guides, data-driven research, and real-world insights on image optimization, web performance, and building faster digital products.
            </p>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {allPostsData.map(({ slug, date, title, excerpt }: BlogPostMeta) => (
                    <li key={slug} style={{ marginBottom: '48px' }}>
                        <Link href={`/blog/${slug}`} style={{ textDecoration: 'none' }}>
                            <h2 className="blog-post-title" style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>
                                {title}
                            </h2>
                        </Link>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{excerpt}</p>
                        <Link href={`/blog/${slug}`} style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '12px', display: 'inline-block' }}>
                            Read more →
                        </Link>
                    </li>
                ))}
            </ul>

            {allPostsData.length === 0 && (
                <div style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '16px' }}>Content Generating...</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>New articles are on the way. Check back soon.</p>
                </div>
            )}
        </div>
    );
}
