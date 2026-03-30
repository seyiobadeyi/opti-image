import type { MetadataRoute } from 'next';
import { getSortedPostsData, getAllPostSlugs } from '@/lib/markdown';

interface SitemapGalleryEntry {
    slug: string;
    updated_at: string;
    owner_username?: string;
}

async function fetchPublicGalleries(): Promise<SitemapGalleryEntry[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
    try {
        const res = await fetch(`${apiUrl}/api/gallery/sitemap`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        return res.json() as Promise<SitemapGalleryEntry[]>;
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

    // ── Public gallery routes — fetched from the API ──
    const galleries = await fetchPublicGalleries();

    const galleryRoutes: MetadataRoute.Sitemap = galleries.map((g) => ({
        url: `${baseUrl}/g/${g.slug}`,
        lastModified: new Date(g.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const profileUsernames = Array.from(
        new Set(galleries.map((g) => g.owner_username).filter((u): u is string => Boolean(u))),
    );

    const profileRoutes: MetadataRoute.Sitemap = profileUsernames.map((username) => ({
        url: `${baseUrl}/p/${username}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...blogRoutes, ...galleryRoutes, ...profileRoutes];
}
