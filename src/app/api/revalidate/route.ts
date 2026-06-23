import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getStaggeredBatch, getAllPostSlugs } from '@/lib/markdown';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    // Accept either: Vercel's automatic "Authorization: Bearer $CRON_SECRET" header
    // (sent on cron-triggered requests), or the manual "?secret=" query param.
    const authHeader = request.headers.get('authorization');
    const querySecret = request.nextUrl.searchParams.get('secret');
    const cronSecret = process.env.CRON_SECRET;
    const manualSecret = process.env.REVALIDATE_SECRET;

    const authorized =
        (!!cronSecret && authHeader === `Bearer ${cronSecret}`) ||
        (!!manualSecret && querySecret === manualSecret);

    if (!authorized) {
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

        // Ping Bing's sitemap endpoint (Google retired its sitemap ping in 2023 —
        // no longer worth calling) and submit the revalidated URLs to IndexNow,
        // which Bing/Yandex/Naver/Seznam use for near-instant re-crawl.
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimage.dreamintrepid.com';
        const sitemapUrl = encodeURIComponent(`${siteUrl}/sitemap.xml`);
        const indexNowKey = process.env.INDEXNOW_KEY;
        const postUrls = slugsToRevalidate.map(slug => `${siteUrl}/blog/${slug}`);
        void Promise.allSettled([
            fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`),
            indexNowKey
                ? fetch('https://api.indexnow.org/indexnow', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: JSON.stringify({
                        host: siteUrl.replace(/^https?:\/\//, ''),
                        key: indexNowKey,
                        urlList: postUrls,
                    }),
                })
                : Promise.resolve(),
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
