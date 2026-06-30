import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { getPostData, getAllPostSlugs } from '@/lib/markdown';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Optimage blog post';

// Pre-generate one OG card per post at build time (mirrors the page).
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
    return getAllPostSlugs().map((s) => ({ slug: s.params.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let title = 'Optimage Blog';
    try {
        const post = await getPostData(slug);
        title = post.title;
    } catch {
        // fall back to the generic title
    }
    return renderOgImage({ title, eyebrow: 'Optimage Blog' });
}
