import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import type { BlogPostMeta, BlogPostData, BlogHeading, BlogVariant, BlogFaqItem } from '@/types';

const postsDirectory: string = path.join(process.cwd(), '_posts');

export const POSTS_PER_PAGE = 9;

interface PostFrontmatter {
    title: string;
    date: string;
    excerpt: string;
    keyTakeaways?: string[];
    /** Optional rotating variants — excerpt + keyTakeaways rotate every 3 days */
    variants?: BlogVariant[];
    /** Optional TL;DR shown above the first section — distinct from the meta-description excerpt */
    summary?: string;
    /** Optional FAQ section — rendered on-page and emitted as FAQPage JSON-LD */
    faq?: BlogFaqItem[];
}

export function getPostCount(): number {
    if (!fs.existsSync(postsDirectory)) return 0;
    return fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md')).length;
}

export function getTotalPages(): number {
    return Math.max(1, Math.ceil(getPostCount() / POSTS_PER_PAGE));
}

export function getPostsForPage(page: number): BlogPostMeta[] {
    const all = getSortedPostsData();
    const start = (page - 1) * POSTS_PER_PAGE;
    return all.slice(start, start + POSTS_PER_PAGE);
}

export function getSortedPostsData(): BlogPostMeta[] {
    if (!fs.existsSync(postsDirectory)) return [];
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData: BlogPostMeta[] = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const data = matterResult.data as PostFrontmatter;
        const fm = matterResult.data as PostFrontmatter & { description?: string };
        return { slug, title: data.title, date: data.date, excerpt: fm.excerpt ?? fm.description ?? '' };
    });
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostSlugs(): Array<{ params: { slug: string } }> {
    if (!fs.existsSync(postsDirectory)) return [];
    return fs.readdirSync(postsDirectory).map((fileName) => ({
        params: { slug: fileName.replace(/\.md$/, '') },
    }));
}

/** Extract h2/h3 headings from rendered HTML for the TOC. */
function extractHeadings(html: string): BlogHeading[] {
    const headings: BlogHeading[] = [];
    const pattern = /<h([23])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/gi;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html)) !== null) {
        const level = parseInt(match[1]!) as 2 | 3;
        const id = match[2]!;
        const text = match[3]!.replace(/<[^>]+>/g, '').trim();
        if (text) headings.push({ id, text, level });
    }
    return headings;
}

/** Auto-generate key takeaways from the excerpt when no frontmatter variants exist. */
function deriveKeyTakeaways(excerpt: string): string[] {
    const sentences = excerpt
        .split(/(?<=\.)\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 20 && s.length < 200);
    if (sentences.length >= 2) return sentences.slice(0, 4);
    const parts = excerpt.split(/[—,]/).map(s => s.trim()).filter(s => s.length > 20);
    if (parts.length >= 2) return parts.slice(0, 4);
    return [excerpt];
}

/**
 * Pick which variant is active based on a 3-day rotation cycle.
 * Deterministic: same day always returns same variant, so Vercel's cached
 * page is consistent until the next staggered revalidation fires.
 */
function pickVariant(variants: BlogVariant[] | undefined): BlogVariant | null {
    if (!variants?.length) return null;
    const cycleIndex = Math.floor(Date.now() / (3 * 24 * 60 * 60 * 1000));
    return variants[cycleIndex % variants.length] ?? null;
}

/** Pick which posts to revalidate in this cron run (5 per run, rotating). */
export function getStaggeredBatch(batchSize = 5): string[] {
    const all = getAllPostSlugs().map(s => s.params.slug);
    const totalBatches = Math.ceil(all.length / batchSize);
    const cycleIndex = Math.floor(Date.now() / (3 * 24 * 60 * 60 * 1000));
    const batchIndex = cycleIndex % totalBatches;
    const start = batchIndex * batchSize;
    return all.slice(start, start + batchSize);
}

/** Pick 3 related posts (adjacent by date, excluding current slug). */
export function getRelatedPosts(currentSlug: string, count = 3): BlogPostMeta[] {
    const all = getSortedPostsData();
    const idx = all.findIndex(p => p.slug === currentSlug);
    const others = all.filter(p => p.slug !== currentSlug);
    const nearby = [
        ...others.slice(Math.max(0, idx - 2), idx),
        ...others.slice(idx, idx + count),
    ].slice(0, count);
    return nearby.length >= count ? nearby : others.slice(0, count);
}

export async function getPostData(slug: string): Promise<BlogPostData> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    const data = matterResult.data as PostFrontmatter;

    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSlug)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(matterResult.content);

    const contentHtml = processedContent.toString();
    const headings = extractHeadings(contentHtml);
    const activeVariant = pickVariant(data.variants);

    // Active variant overrides static fields; fall back to frontmatter, then auto-derive
    const keyTakeaways = activeVariant?.keyTakeaways
        ?? data.keyTakeaways
        ?? deriveKeyTakeaways(data.excerpt);

    return {
        slug,
        contentHtml,
        headings,
        keyTakeaways,
        activeVariant,
        title: data.title,
        // Serve the variant excerpt to the page so hero + meta rotate
        excerpt: activeVariant?.excerpt ?? data.excerpt,
        date: data.date,
        summary: data.summary,
        faq: data.faq,
    };
}
