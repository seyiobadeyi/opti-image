/**
 * GET /api/blog/check-new
 *
 * Called automatically by a Vercel deploy webhook after each production deploy.
 * Reads the latest markdown post from the _posts directory, then calls the
 * Railway blog-notify endpoint. The Railway endpoint is idempotent — if the
 * slug has already been notified it skips silently, so re-deploys are safe.
 *
 * Auth: ?secret=<BLOG_NOTIFY_SECRET> query param (set in Vercel env)
 *
 * How to wire up the Vercel deploy webhook:
 *   1. Vercel dashboard → your project → Settings → Git → Deploy Hooks
 *   2. Create a hook named "Blog notification check"
 *   3. After each deploy, the hook fires a GET to this URL:
 *      https://optimage.dreamintrepid.com/api/blog/check-new?secret=<your-secret>
 *   OR: manually call this URL after pushing a new post.
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '_posts');
const RAILWAY_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface PostFrontmatter {
    title: string;
    date: string;
    excerpt: string;
}

function getLatestPost(): { slug: string; title: string; excerpt: string; date: string } | null {
    if (!fs.existsSync(postsDirectory)) return null;

    const files = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));
    if (files.length === 0) return null;

    const posts = files.map(file => {
        const slug = file.replace(/\.md$/, '');
        const raw = fs.readFileSync(path.join(postsDirectory, file), 'utf8');
        const { data } = matter(raw);
        const fm = data as PostFrontmatter;
        return { slug, title: fm.title ?? slug, excerpt: fm.excerpt ?? '', date: fm.date ?? '' };
    });

    // Return the most recently dated post
    return posts.sort((a, b) => (a.date < b.date ? 1 : -1))[0] ?? null;
}

export async function GET(req: NextRequest) {
    // ── Auth ────────────────────────────────────────────────────────────────────
    const expectedSecret = process.env.BLOG_NOTIFY_SECRET;
    const incomingSecret = req.nextUrl.searchParams.get('secret');

    if (!expectedSecret || incomingSecret !== expectedSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Get latest post ─────────────────────────────────────────────────────────
    const latest = getLatestPost();
    if (!latest) {
        return NextResponse.json({ skipped: true, reason: 'no_posts_found' });
    }

    // ── Call Railway blog-notify endpoint ───────────────────────────────────────
    try {
        const res = await fetch(`${RAILWAY_URL}/api/newsletter/blog-notify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-notify-secret': expectedSecret,
            },
            body: JSON.stringify({
                slug: latest.slug,
                title: latest.title,
                excerpt: latest.excerpt,
            }),
        });

        const data = await res.json() as Record<string, unknown>;

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Railway endpoint error', detail: data },
                { status: 502 },
            );
        }

        return NextResponse.json({ post: latest.slug, result: data });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: 'Failed to reach Railway', detail: msg }, { status: 502 });
    }
}
