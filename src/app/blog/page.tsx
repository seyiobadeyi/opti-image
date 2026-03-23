import { getPostsForPage, getTotalPages, POSTS_PER_PAGE } from '@/lib/markdown';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { BlogPostMeta } from '@/types';

export const metadata: Metadata = {
    title: 'The Optimage Journal: Insights on Media, Performance & the Web',
    description: 'Practical guides, data-driven research, and real-world insights on image optimization, web performance, and building faster digital products.',
};

interface BlogPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function BlogIndex({ searchParams }: BlogPageProps): Promise<React.JSX.Element> {
    const params = await searchParams;
    const currentPage = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
    const totalPages = getTotalPages();
    const safePage = Math.min(currentPage, totalPages);
    const posts: BlogPostMeta[] = getPostsForPage(safePage);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.02em' }}>
                The Optimage Journal
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '64px', lineHeight: 1.6 }}>
                Practical guides, data-driven research, and real-world insights on image optimization, web performance, and building faster digital products.
            </p>

            {posts.length === 0 ? (
                <div style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '16px' }}>Content Generating...</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>New articles are on the way. Check back soon.</p>
                </div>
            ) : (
                <>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {posts.map(({ slug, date, title, excerpt }: BlogPostMeta) => (
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '8px', marginTop: '48px', flexWrap: 'wrap',
                        }}>
                            {/* Previous */}
                            {safePage > 1 ? (
                                <Link
                                    href={safePage === 2 ? '/blog' : `/blog?page=${safePage - 1}`}
                                    style={{
                                        padding: '8px 16px', borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-primary)', textDecoration: 'none',
                                        fontSize: '0.9rem', fontWeight: 500,
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    ← Previous
                                </Link>
                            ) : (
                                <span style={{
                                    padding: '8px 16px', borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-muted)', fontSize: '0.9rem',
                                    fontWeight: 500, opacity: 0.4, cursor: 'default',
                                }}>
                                    ← Previous
                                </span>
                            )}

                            {/* Page numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                const isActive = page === safePage;
                                // Show first, last, current ±1, and ellipsis
                                const show =
                                    page === 1 ||
                                    page === totalPages ||
                                    Math.abs(page - safePage) <= 1;
                                const showEllipsisBefore = page === safePage - 2 && safePage > 3;
                                const showEllipsisAfter = page === safePage + 2 && safePage < totalPages - 2;

                                if (showEllipsisBefore || showEllipsisAfter) {
                                    return (
                                        <span key={`ellipsis-${page}`} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '0 4px' }}>
                                            …
                                        </span>
                                    );
                                }
                                if (!show) return null;

                                return (
                                    <Link
                                        key={page}
                                        href={page === 1 ? '/blog' : `/blog?page=${page}`}
                                        style={{
                                            padding: '8px 14px', borderRadius: '8px',
                                            border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border)'}`,
                                            background: isActive ? 'var(--accent-primary)' : 'transparent',
                                            color: isActive ? '#fff' : 'var(--text-primary)',
                                            textDecoration: 'none', fontSize: '0.9rem',
                                            fontWeight: isActive ? 700 : 500,
                                            minWidth: '38px', textAlign: 'center',
                                        }}
                                    >
                                        {page}
                                    </Link>
                                );
                            })}

                            {/* Next */}
                            {safePage < totalPages ? (
                                <Link
                                    href={`/blog?page=${safePage + 1}`}
                                    style={{
                                        padding: '8px 16px', borderRadius: '8px',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-primary)', textDecoration: 'none',
                                        fontSize: '0.9rem', fontWeight: 500,
                                    }}
                                >
                                    Next →
                                </Link>
                            ) : (
                                <span style={{
                                    padding: '8px 16px', borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-muted)', fontSize: '0.9rem',
                                    fontWeight: 500, opacity: 0.4, cursor: 'default',
                                }}>
                                    Next →
                                </span>
                            )}
                        </div>
                    )}

                    {/* Post count info */}
                    <p style={{
                        textAlign: 'center', fontSize: '0.8rem',
                        color: 'var(--text-muted)', marginTop: '20px',
                    }}>
                        Page {safePage} of {totalPages} &nbsp;·&nbsp; {POSTS_PER_PAGE} posts per page
                    </p>
                </>
            )}
        </div>
    );
}
