import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllPostSlugs } from '@/lib/markdown';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');
    const expected = process.env.REVALIDATE_SECRET;

    if (!expected || secret !== expected) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Revalidate the blog index and all individual post pages
        revalidatePath('/blog', 'layout');

        const slugs = getAllPostSlugs();
        for (const { params } of slugs) {
            revalidatePath(`/blog/${params.slug}`, 'page');
        }

        // Ping sitemaps so search engines re-crawl on next cycle
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimage.dreamintrepid.com';
        const sitemapUrl = encodeURIComponent(`${siteUrl}/sitemap.xml`);
        await Promise.allSettled([
            fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`, { method: 'GET' }),
            fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`, { method: 'GET' }),
        ]);

        return NextResponse.json({
            revalidated: true,
            posts: slugs.length,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('[revalidate]', err);
        return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
    }
}
