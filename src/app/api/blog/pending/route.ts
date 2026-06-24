/**
 * GET /api/blog/pending
 *
 * Called every ~10 minutes by the Railway server's BlogPublishTriggerService.
 * Finds posts whose scheduled `date` fell within the last PENDING_WINDOW_MINUTES
 * (i.e. they just went live), force-revalidates their pages + the blog index +
 * sitemap so the next visitor/crawler gets fresh content immediately, and
 * reports their URLs back so the caller can submit them to IndexNow.
 *
 * This is what makes "6 posts committed at once, staggered through the day"
 * actually staggered: the post files can already be deployed, but nothing
 * announces or force-refreshes a slug until its `date` has genuinely passed.
 *
 * Auth: ?secret=<REVALIDATE_SECRET> query param.
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSortedPostsData } from '@/lib/markdown';

export const runtime = 'nodejs';

// Wider than the cron's tick interval so a slow tick or cold start never skips a slot.
const PENDING_WINDOW_MINUTES = 20;

export async function GET(request: NextRequest) {
    const secret = process.env.REVALIDATE_SECRET;
    const querySecret = request.nextUrl.searchParams.get('secret');
    if (!secret || querySecret !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimage.dreamintrepid.com';
    const now = Date.now();
    const windowMs = PENDING_WINDOW_MINUTES * 60 * 1000;

    const justPublished = getSortedPostsData().filter((post) => {
        const publishedAt = new Date(post.date).getTime();
        return publishedAt <= now && publishedAt > now - windowMs;
    });

    for (const post of justPublished) {
        revalidatePath(`/blog/${post.slug}`, 'page');
    }
    if (justPublished.length > 0) {
        revalidatePath('/blog', 'layout');
        revalidatePath('/sitemap.xml');
    }

    return NextResponse.json({
        published: justPublished.map((post) => ({
            slug: post.slug,
            title: post.title,
            url: `${siteUrl}/blog/${post.slug}`,
        })),
    });
}
