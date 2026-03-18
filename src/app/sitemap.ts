import type { MetadataRoute } from 'next';
import { getSortedPostsData, getAllPostSlugs } from '@/lib/markdown';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimage.dreamintrepid.com';

    // ── Static routes ──
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/stats`,
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: '2026-01-01',
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: '2026-01-01',
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // ── Blog posts — use actual post dates, not build time ──
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const posts = getSortedPostsData();
        blogRoutes = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.date).toISOString().split('T')[0],
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));
    } catch {
        // Fallback if markdown is unavailable during build
        const slugs = getAllPostSlugs();
        blogRoutes = slugs.map((post) => ({
            url: `${baseUrl}/blog/${post.params.slug}`,
            lastModified: new Date().toISOString().split('T')[0],
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));
    }

    return [...staticRoutes, ...blogRoutes];
}
