import { getPostData, getAllPostSlugs } from '@/lib/markdown';
import './blog.css';
import type { Metadata } from 'next';
import type { BlogPostData } from '@/types';
import Link from 'next/link';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimage.dreamintrepid.com';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

function readingTime(html: string): number {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text.split(' ').filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
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
            images: [`${SITE_URL}/image-2.png`],
            creator: '@dreamintrepid',
        },
    };
}

export default async function Post({ params }: BlogPostPageProps): Promise<React.JSX.Element> {
    const { slug } = await params;
    const postData: BlogPostData = await getPostData(slug);
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
            '@type': 'Organization',
            name: 'Optimage',
            '@id': `${SITE_URL}/#organization`,
            url: SITE_URL,
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

    const formattedDate = new Date(postData.date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div style={{ background: '#fff', minHeight: '100vh', color: '#111827' }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
                                <time dateTime={postData.date} style={{ fontSize: '0.73rem', color: '#9ca3af' }}>{formattedDate}</time>
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
                <div className="blog-content" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />

                {/* In-article CTA */}
                <div style={{ marginTop: '72px', padding: '36px', background: '#fdf3f1', borderRadius: '20px', border: '1px solid #f9c5b8', textAlign: 'center' }}>
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
        </div>
    );
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
    const slugs = getAllPostSlugs();
    return slugs.map((obj) => ({ slug: obj.params.slug }));
}
