import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import type { BlogPostMeta, BlogPostData } from '@/types';

const postsDirectory: string = path.join(process.cwd(), '_posts');

export const POSTS_PER_PAGE = 9;

/** Frontmatter shape expected in each markdown file. */
interface PostFrontmatter {
    title: string;
    date: string;
    excerpt: string;
}

/** Total number of blog posts. */
export function getPostCount(): number {
    if (!fs.existsSync(postsDirectory)) return 0;
    return fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md')).length;
}

/** Total number of pages given POSTS_PER_PAGE. */
export function getTotalPages(): number {
    return Math.max(1, Math.ceil(getPostCount() / POSTS_PER_PAGE));
}

/** Posts for a specific page (1-indexed). Returns [] for out-of-range pages. */
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

        return {
            slug,
            title: data.title,
            date: data.date,
            excerpt: data.excerpt,
        };
    });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllPostSlugs(): Array<{ params: { slug: string } }> {
    if (!fs.existsSync(postsDirectory)) return [];
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                slug: fileName.replace(/\.md$/, ''),
            },
        };
    });
}

export async function getPostData(slug: string): Promise<BlogPostData> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);
    const data = matterResult.data as PostFrontmatter;

    const processedContent = await remark()
        .use(remarkGfm)
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        slug,
        contentHtml,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
    };
}
