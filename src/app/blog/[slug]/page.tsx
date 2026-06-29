import { getPostData, getAllPostSlugs, getRelatedPosts } from '@/lib/markdown';
import './blog.css';
import type { Metadata } from 'next';
import type { BlogPostData, BlogHeading, BlogPostMeta } from '@/types';
import Link from 'next/link';
import AdBanner, { AD_SLOTS } from '@/components/AdBanner';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimage.dreamintrepid.com';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

function readingTime(html: string): number {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text.split(' ').filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const postData: BlogPostData = await getPostData(slug);
    const postUrl = `${SITE_URL}/blog/${slug}`;

    return {
        title: postData.title,
        description: postData.excerpt,
        authors: [{ name: 'Optimage', url: SITE_URL }],
        alternates: { canonical: postUrl },
        openGraph: {
            title: postData.title,
            description: postData.excerpt,
            url: postUrl,
            siteName: 'Optimage',
            type: 'article',
            publishedTime: postData.date,
            modifiedTime: postData.date,
            authors: [`${SITE_URL}/#organization`],
            section: 'Media Optimization',
            images: [{ url: `${SITE_URL}/og-blog.jpg`, width: 1200, height: 630, alt: postData.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: postData.title,
            description: postData.excerpt,
            images: [`${SITE_URL}/og-blog.jpg`],
            creator: '@dreamintrepid',
        },
    };
}

function Summary({ text }: { text: string }) {
    return (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderLeft: '4px solid #db5a42', borderRadius: '12px', padding: '18px 22px', marginBottom: '32px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#db5a42', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>TL;DR</span>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#374151', lineHeight: 1.6 }}>{text}</p>
        </div>
    );
}

function FaqSection({ items }: { items: import('@/types').BlogFaqItem[] }) {
    if (items.length === 0) return null;
    return (
        <div style={{ marginTop: '56px', paddingTop: '40px', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '20px', letterSpacing: '-0.01em' }}>Frequently asked questions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {items.map((item, i) => (
                    <div key={i} style={{ padding: '18px 22px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '14px' }}>
                        <p style={{ margin: '0 0 8px 0', fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{item.question}</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151', lineHeight: 1.6 }}>{item.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function KeyTakeaways({ items }: { items: string[] }) {
    return (
        <div style={{ background: '#fdf3f1', border: '1px solid #f9c5b8', borderRadius: '16px', padding: '24px 28px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '28px', background: '#db5a42', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827', letterSpacing: '-0.01em' }}>Key Takeaways</span>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: '#374151', lineHeight: 1.65 }}>
                        <span style={{ color: '#db5a42', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>✓</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TableOfContents({ headings }: { headings: BlogHeading[] }) {
    if (headings.length < 2) return null;
    return (
        <nav aria-label="Table of contents" style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '22px 26px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em' }}>In this article</span>
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {headings.map((h, i) => (
                    <li key={h.id} style={{ paddingLeft: h.level === 3 ? '16px' : '0' }}>
                        <a
                            href={`#${h.id}`}
                            style={{ display: 'flex', alignItems: 'baseline', gap: '8px', color: '#374151', textDecoration: 'none', fontSize: h.level === 3 ? '0.83rem' : '0.88rem', lineHeight: 1.5, padding: '3px 0' }}
                        >
                            <span style={{ color: '#db5a42', fontWeight: 700, fontSize: '0.72rem', flexShrink: 0, minWidth: '18px' }}>{i + 1}.</span>
                            <span>{h.text}</span>
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

function RelatedPosts({ posts }: { posts: BlogPostMeta[] }) {
    if (posts.length === 0) return null;
    return (
        <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '20px', letterSpacing: '-0.01em' }}>Continue reading</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {posts.map(post => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', textDecoration: 'none', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                        className="related-post-card"
                    >
                        <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 500 }}>{formatDate(post.date)}</span>
                        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827', lineHeight: 1.4 }}>{post.title}</span>
                        <span style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.55, flex: 1 }}>{(post.excerpt ?? '').substring(0, 100)}…</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#db5a42', marginTop: '4px' }}>Read more →</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default async function Post({ params }: BlogPostPageProps): Promise<React.JSX.Element> {
    const { slug } = await params;
    const [postData, relatedPosts] = await Promise.all([
        getPostData(slug),
        Promise.resolve(getRelatedPosts(slug, 3)),
    ]);
    const postUrl = `${SITE_URL}/blog/${slug}`;
    const mins = readingTime(postData.contentHtml);

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': postUrl,
        headline: postData.title,
        description: postData.excerpt,
        url: postUrl,
        datePublished: postData.date,
        dateModified: postData.date,
        inLanguage: 'en-US',
        author: {
            '@type': 'Person',
            name: 'Optimage Editorial Team',
            url: `${SITE_URL}/blog`,
            worksFor: {
                '@type': 'Organization',
                name: 'Dream Intrepid Ltd',
                '@id': `${SITE_URL}/#organization`,
            },
        },
        publisher: {
            '@type': 'Organization',
            name: 'Dream Intrepid Ltd',
            '@id': `${SITE_URL}/#organization`,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
        },
        image: { '@type': 'ImageObject', url: `${SITE_URL}/og-blog.jpg`, width: 1200, height: 630 },
        mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
        isPartOf: { '@type': 'Blog', name: 'The Optimage Journal', url: `${SITE_URL}/blog` },
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'The Optimage Journal', item: `${SITE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: postData.title, item: postUrl },
        ],
    };

    // FAQPage schema — only emitted when the post actually has a user-facing
    // Q&A section, per AEO best practice (don't force-fit schema that doesn't
    // match on-page content).
    const faqSchema = postData.faq?.length ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: postData.faq.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
    } : null;

    return (
        <div style={{ background: '#fff', minHeight: '100vh', color: '#111827' }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            {faqSchema && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            )}

            {/* Hero band */}
            <div style={{ background: '#fdf3f1', borderBottom: '1px solid #f9c5b8', paddingTop: '96px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 44px' }}>

                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" style={{ marginBottom: '24px', fontSize: '0.78rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</Link>
                        <span>/</span>
                        <Link href="/blog" style={{ color: '#9ca3af', textDecoration: 'none' }}>The Optimage Journal</Link>
                        <span>/</span>
                        <span style={{ color: '#374151' }}>{postData.title}</span>
                    </nav>

                    {/* Category chip */}
                    <div style={{ marginBottom: '18px' }}>
                        <span style={{ display: 'inline-block', background: '#fff', border: '1px solid #f9c5b8', color: '#db5a42', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '20px' }}>
                            Image Optimization
                        </span>
                    </div>

                    {/* Title */}
                    <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '18px', letterSpacing: '-0.02em', lineHeight: 1.18, color: '#111827' }}>
                        {postData.title}
                    </h1>

                    {/* Excerpt */}
                    <p style={{ fontSize: '1.08rem', color: '#374151', lineHeight: 1.7, marginBottom: '28px', maxWidth: '660px' }}>
                        {postData.excerpt}
                    </p>

                    {/* Meta row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', borderTop: '1px solid #f9c5b8', paddingTop: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#db5a42', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <img src="/logo.png" alt="Optimage" style={{ width: '20px', height: '20px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.83rem', fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>Optimage</div>
                                <div style={{ fontSize: '0.73rem', color: '#9ca3af' }}>
                                    <time dateTime={postData.date}>Published {formatDate(postData.date)}</time>
                                    <span style={{ margin: '0 6px' }}>·</span>
                                    <span>Updated {new Date(postData.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: 'auto' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{mins} min read</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article body */}
            <article style={{ maxWidth: '800px', margin: '0 auto', padding: '52px 24px 80px' }}>

                {/* TL;DR */}
                {postData.summary && <Summary text={postData.summary} />}

                {/* Key Takeaways */}
                <KeyTakeaways items={postData.keyTakeaways} />

                {/* Table of Contents */}
                <TableOfContents headings={postData.headings} />

                {/* In-content ad (after the intro/TOC) — hidden until ads are enabled */}
                <AdBanner slot={AD_SLOTS.horizontal} />

                {/* Post content */}
                <div className="blog-content" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />

                {/* Ad after the article body — hidden until ads are enabled */}
                <AdBanner slot={AD_SLOTS.square} />

                {/* FAQ */}
                {postData.faq && <FaqSection items={postData.faq} />}

                {/* Related posts */}
                <RelatedPosts posts={relatedPosts} />

                {/* CTA */}
                <div style={{ marginTop: '56px', padding: '36px', background: '#fdf3f1', borderRadius: '20px', border: '1px solid #f9c5b8', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#db5a42', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '8px', color: '#111827' }}>Try Optimage — it&apos;s free</p>
                    <p style={{ color: '#374151', fontSize: '0.9rem', marginBottom: '22px', maxWidth: '400px', margin: '0 auto 22px' }}>
                        Compress, convert, and optimize images in seconds. No sign-up, no limits.
                    </p>
                    <Link href="/" style={{ display: 'inline-block', padding: '13px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, background: '#db5a42', color: '#fff', fontSize: '0.95rem' }}>
                        Start Optimizing Free
                    </Link>
                </div>

                <div style={{ marginTop: '28px', textAlign: 'center' }}>
                    <Link href="/blog" style={{ color: '#9ca3af', fontSize: '0.85rem', textDecoration: 'none' }}>
                        ← Back to The Optimage Journal
                    </Link>
                </div>
            </article>

            <style>{`
                .related-post-card:hover {
                    border-color: #db5a42 !important;
                    box-shadow: 0 4px 20px rgba(219,90,66,0.1) !important;
                }
            `}</style>
        </div>
    );
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
    const slugs = getAllPostSlugs();
    return slugs.map((obj) => ({ slug: obj.params.slug }));
}
