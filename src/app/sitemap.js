import { getAllPostSlugs } from '@/lib/markdown';

export default function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://optiimage.dreamintrepid.com';

    // Core static routes
    const routes = [
        '',
        '/blog',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Dynamic Blog routes
    const posts = getAllPostSlugs().map((post) => ({
        url: `${baseUrl}/blog/${post.params.slug}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [...routes, ...posts];
}
