import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getStaggeredBatch, getAllPostSlugs } from '@/lib/markdown';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');
    const expected = process.env.REVALIDATE_SECRET;

    if (!expected || secret !== expected) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Optional ?all=true param forces full revalidation (for manual use only)
    const forceAll = request.nextUrl.searchParams.get('all') === 'true';

    try {
        let slugsToRevalidate: string[];

        if (forceAll) {
            slugsToRevalidate = getAllPostSlugs().map(s => s.params.slug);
        } else {
            // Normal cron run: only 5 posts from the current rotation batch
            slugsToRevalidate = getStaggeredBatch(5);
        }

        // Revalidate selected post pages
        for (const slug of slugsToRevalidate) {
            revalidatePath(`/blog/${slug}`, 'page');
        }

        // Always keep the blog index fresh
        revalidatePath('/blog', 'layout');

        // Ping sitemaps (fire-and-forget, failures are non-fatal)
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimage.dreamintrepid.com';
        const sitemapUrl = encodeURIComponent(`${siteUrl}/sitemap.xml`);
        void Promise.allSettled([
            fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`),
            fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`),
        ]);

        const totalPosts = getAllPostSlugs().length;
        const batchSize = 5;
        const totalBatches = Math.ceil(totalPosts / batchSize);
        const cycleIndex = Math.floor(Date.now() / (3 * 24 * 60 * 60 * 1000));
        const batchIndex = cycleIndex % totalBatches;

        return NextResponse.json({
            revalidated: true,
            mode: forceAll ? 'full' : 'staggered',
            batch: forceAll ? 'all' : `${batchIndex + 1}/${totalBatches}`,
            postsRevalidated: slugsToRevalidate.length,
            slugs: slugsToRevalidate,
            nextBatchIn: '3 days',
            fullCycleIn: `${totalBatches * 3} days`,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error('[revalidate]', err);
        return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
    }
}
