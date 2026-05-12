import { getPostData, getAllPostSlugs } from '@/lib/markdown';
import './blog.css';
import type { Metadata } from 'next';
import type { BlogPostData } from '@/types';
import Link from 'next/link';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimage.dreamintrepid.com';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const postData: BlogPostData = await getPostData(slug);
    const postUrl = `${SITE_URL}/blog/${slug}`;

    return {
        title: postData.title,
        description: postData.excerpt,
        authors: [{ name: 'Optimage', url: SITE_URL }],
        alternates: {
            canonical: postUrl,
        },
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
            images: [
                {
                    url: `${SITE_URL}/og-blog.jpg`,
                    width: 1200,
                    height: 630,
                    alt: postData.title,
                },
            ],
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
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.png`,
            },
        },
        image: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/og-blog.jpg`,
            width: 1200,
            height: 630,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': postUrl,
        },
        isPartOf: {
            '@type': 'Blog',
            name: 'The Optimage Journal',
            url: `${SITE_URL}/blog`,
        },
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

    return (
        <div style={{ background: '#fff', minHeight: '100vh', color: '#111827' }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <article style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
                {/* Visible breadcrumb trail */}
                <nav aria-label="Breadcrumb" style={{ marginBottom: '32px', fontSize: '0.82rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</Link>
                    <span>/</span>
                    <Link href="/blog" style={{ color: '#9ca3af', textDecoration: 'none' }}>The Optimage Journal</Link>
                    <span>/</span>
                    <span style={{ color: '#374151' }}>{postData.title}</span>
                </nav>

                <header style={{ marginBottom: '48px', borderBottom: '1px solid #e5e7eb', paddingBottom: '32px' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                        {postData.title}
                    </h1>
                    <div style={{ fontSize: '1rem', color: '#9ca3af', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <time dateTime={postData.date}>
                            {new Date(postData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                        <span style={{ width: '4px', height: '4px', background: '#9ca3af', borderRadius: '50%' }} aria-hidden="true" />
                        <span>By Optimage</span>
                    </div>
                    <p style={{ marginTop: '16px', fontSize: '1.05rem', color: '#374151', lineHeight: 1.7, fontStyle: 'italic' }}>
                        {postData.excerpt}
                    </p>
                </header>

                <div className="blog-content" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />

                {/* In-article CTA */}
                <footer style={{ marginTop: '64px', padding: '28px', background: 'linear-gradient(135deg, rgba(219,90,66,0.1), rgba(232,134,111,0.06))', borderRadius: '16px', border: '1px solid rgba(219,90,66,0.2)', textAlign: 'center' }}>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>Try Optimage Free</p>
                    <p style={{ color: '#374151', fontSize: '0.9rem', marginBottom: '16px' }}>Compress, convert, and optimize your images in seconds. No sign-up needed to start.</p>
                    <Link href="/" className="btn btn-primary" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600 }}>
                        Start Optimizing Free
                    </Link>
                </footer>

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <Link href="/blog" style={{ color: '#9ca3af', fontSize: '0.88rem', textDecoration: 'none' }}>
                        Back to The Optimage Journal
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
