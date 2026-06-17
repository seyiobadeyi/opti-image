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
import type { BlogPostMeta, BlogPostData, BlogHeading } from '@/types';

const postsDirectory: string = path.join(process.cwd(), '_posts');

export const POSTS_PER_PAGE = 9;

interface PostFrontmatter {
    title: string;
    date: string;
    excerpt: string;
    keyTakeaways?: string[];
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
        return { slug, title: data.title, date: data.date, excerpt: data.excerpt };
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
        const level = parseInt(match[1]) as 2 | 3;
        const id = match[2];
        // Strip any nested HTML tags from the heading text
        const text = match[3].replace(/<[^>]+>/g, '').trim();
        if (text) headings.push({ id, text, level });
    }
    return headings;
}

/** Auto-generate key takeaways from the excerpt (split on '. '). */
function deriveKeyTakeaways(excerpt: string, title: string): string[] {
    // Split excerpt into sentences, clean up, take up to 4
    const sentences = excerpt
        .split(/(?<=\.)\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 20 && s.length < 200);

    if (sentences.length >= 2) return sentences.slice(0, 4);

    // Fallback: split on em-dash or comma-separated clauses
    const parts = excerpt.split(/[—,]/).map(s => s.trim()).filter(s => s.length > 20);
    if (parts.length >= 2) return parts.slice(0, 4);

    // Last resort: return excerpt as single takeaway
    return [excerpt];
}

/** Pick 3 related posts (adjacent by date, excluding current slug). */
export function getRelatedPosts(currentSlug: string, count = 3): BlogPostMeta[] {
    const all = getSortedPostsData();
    const idx = all.findIndex(p => p.slug === currentSlug);
    const others = all.filter(p => p.slug !== currentSlug);
    // Prefer neighbours around the current post, then fill from start
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
    const keyTakeaways = data.keyTakeaways?.length
        ? data.keyTakeaways
        : deriveKeyTakeaways(data.excerpt, data.title);

    return {
        slug,
        contentHtml,
        headings,
        keyTakeaways,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
    };
}
