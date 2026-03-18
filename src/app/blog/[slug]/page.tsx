import { getPostData, getAllPostSlugs } from '@/lib/markdown';
import NewsletterPopup from '@/components/NewsletterPopup';
import './blog.css'; // We will create this for styling markdown HTML
import type { Metadata } from 'next';
import type { BlogPostData } from '@/types';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const postData: BlogPostData = await getPostData(slug);
    return {
        title: `${postData.title} - The Optimage Journal`,
        description: postData.excerpt,
    };
}

export default async function Post({ params }: BlogPostPageProps): Promise<React.JSX.Element> {
    const { slug } = await params;
    const postData: BlogPostData = await getPostData(slug);

    return (
        <article style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
            <header style={{ marginBottom: '48px', borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    {postData.title}
                </h1>
                <div style={{ fontSize: '1rem', color: 'var(--text-muted)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <span>{new Date(postData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span style={{ width: '4px', height: '4px', background: 'var(--text-muted)', borderRadius: '50%' }}></span>
                    <span>By Optimage</span>
                </div>
            </header>

            {/* The markdown injected content */}
            <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
            />

            <NewsletterPopup />
        </article>
    );
}

// Generate static routes at build time for ultimate SEO performance
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
    const slugs = getAllPostSlugs();
    return slugs.map((obj) => ({
        slug: obj.params.slug,
    }));
}
