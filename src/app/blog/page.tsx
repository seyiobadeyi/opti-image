import { getPostsForPage, getTotalPages, getPostCount, POSTS_PER_PAGE } from '@/lib/markdown';
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
    const totalPosts = getPostCount();
    const safePage = Math.min(currentPage, totalPages);
    const posts: BlogPostMeta[] = getPostsForPage(safePage);

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 24px 80px' }}>

            {/* Header */}
            <div style={{ maxWidth: '680px', marginBottom: '60px' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    The Optimage Journal
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    Practical guides, data-driven research, and real-world insights on image optimization, web performance, and building faster digital products.
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                    {totalPosts} article{totalPosts !== 1 ? 's' : ''} published
                </p>
            </div>

            {posts.length === 0 ? (
                <div style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '16px' }}>Content Generating...</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>New articles are on the way. Check back soon.</p>
                </div>
            ) : (
                <>
                    {/* Card grid */}
                    <div className="blog-grid">
                        {posts.map(({ slug, date, title, excerpt }: BlogPostMeta) => (
                            <Link key={slug} href={`/blog/${slug}`} className="blog-card">
                                <span className="blog-card-date">
                                    {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                                <h2 className="blog-card-title">{title}</h2>
                                <p className="blog-card-excerpt">{excerpt}</p>
                                <span className="blog-card-cta">
                                    Read article <span>→</span>
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '8px', marginTop: '56px', flexWrap: 'wrap',
                        }}>
                            {safePage > 1 ? (
                                <Link
                                    href={safePage === 2 ? '/blog' : `/blog?page=${safePage - 1}`}
                                    style={{
                                        padding: '8px 18px', borderRadius: '10px',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-primary)', textDecoration: 'none',
                                        fontSize: '0.88rem', fontWeight: 600,
                                    }}
                                >
                                    ← Previous
                                </Link>
                            ) : (
                                <span style={{ padding: '8px 18px', borderRadius: '10px', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.88rem', opacity: 0.35 }}>
                                    ← Previous
                                </span>
                            )}

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                const isActive = page === safePage;
                                const show = page === 1 || page === totalPages || Math.abs(page - safePage) <= 1;
                                const showEllipsis = (page === safePage - 2 && safePage > 3) || (page === safePage + 2 && safePage < totalPages - 2);

                                if (showEllipsis) return <span key={`e-${page}`} style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>…</span>;
                                if (!show) return null;
                                return (
                                    <Link
                                        key={page}
                                        href={page === 1 ? '/blog' : `/blog?page=${page}`}
                                        style={{
                                            padding: '8px 14px', borderRadius: '10px',
                                            border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border)'}`,
                                            background: isActive ? 'var(--accent-primary)' : 'transparent',
                                            color: isActive ? '#fff' : 'var(--text-primary)',
                                            textDecoration: 'none', fontSize: '0.88rem',
                                            fontWeight: isActive ? 700 : 500,
                                            minWidth: '38px', textAlign: 'center',
                                        }}
                                    >
                                        {page}
                                    </Link>
                                );
                            })}

                            {safePage < totalPages ? (
                                <Link
                                    href={`/blog?page=${safePage + 1}`}
                                    style={{
                                        padding: '8px 18px', borderRadius: '10px',
                                        border: '1px solid var(--border)',
                                        color: 'var(--text-primary)', textDecoration: 'none',
                                        fontSize: '0.88rem', fontWeight: 600,
                                    }}
                                >
                                    Next →
                                </Link>
                            ) : (
                                <span style={{ padding: '8px 18px', borderRadius: '10px', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.88rem', opacity: 0.35 }}>
                                    Next →
                                </span>
                            )}
                        </div>
                    )}

                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px' }}>
                        Page {safePage} of {totalPages} &nbsp;·&nbsp; {POSTS_PER_PAGE} per page
                    </p>
                </>
            )}
        </div>
    );
}
