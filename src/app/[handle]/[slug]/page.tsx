import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import GalleryViewer from '@/app/g/[slug]/GalleryViewer';
import type { GalleryPublicMeta } from '@/types';

interface UserGalleryPageProps {
    // [handle] here is the owner's username; [slug] is the gallery slug.
    // The segment is named "handle" because it shares the root dynamic slot with
    // the campaign route ([handle]/page.tsx) — Next.js requires one slug name.
    params: Promise<{ handle: string; slug: string }>;
    searchParams: Promise<{ ownerToken?: string }>;
}

async function fetchGalleryMeta(slug: string): Promise<GalleryPublicMeta | null> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
    try {
        const res = await fetch(`${apiUrl}/api/gallery/public/${slug}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        return res.json() as Promise<GalleryPublicMeta>;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: UserGalleryPageProps): Promise<Metadata> {
    const { handle: username, slug } = await params;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://optimage.dreamintrepid.com';

    const gallery = await fetchGalleryMeta(slug);
    if (!gallery || (gallery.owner_username && gallery.owner_username !== username)) {
        return { title: 'Gallery — Optimage', robots: { index: false, follow: false } };
    }

    const studioSuffix = gallery.branding_studio_name ? ` | ${gallery.branding_studio_name}` : ' | Gallery';
    const title = `${gallery.title}${studioSuffix}`;
    const description = gallery.description ?? `Browse photos from ${gallery.title}`;
    const coverUrl = gallery.cover_image_url ?? undefined;
    const canonicalUrl = `${siteUrl}/${username}/${slug}`;
    const isPublic = gallery.access_type === 'public';

    return {
        title,
        description,
        alternates: { canonical: canonicalUrl },
        robots: isPublic ? { index: true, follow: true } : { index: false, follow: false },
        openGraph: {
            title,
            description,
            type: 'website',
            images: coverUrl ? [{ url: coverUrl }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: coverUrl ? [coverUrl] : [],
        },
    };
}

export default async function UserGalleryPage({ params, searchParams }: UserGalleryPageProps) {
    const { handle: username, slug } = await params;
    const { ownerToken } = await searchParams;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://optimage.dreamintrepid.com';

    const gallery = await fetchGalleryMeta(slug);

    // 404 if gallery doesn't exist or belongs to a different user
    if (!gallery || (gallery.owner_username && gallery.owner_username !== username)) {
        notFound();
    }

    const isPublic = gallery.access_type === 'public';
    const jsonLd = isPublic
        ? {
            '@context': 'https://schema.org',
            '@type': 'ImageGallery',
            name: gallery.title,
            ...(gallery.description ? { description: gallery.description } : {}),
            url: `${siteUrl}/${username}/${slug}`,
            ...(gallery.branding_studio_name || gallery.branding_website
                ? {
                    author: {
                        '@type': 'Person',
                        ...(gallery.branding_studio_name ? { name: gallery.branding_studio_name } : {}),
                        ...(gallery.branding_website ? { url: gallery.branding_website } : {}),
                    },
                }
                : {}),
            ...(gallery.cover_image_url ? { image: gallery.cover_image_url } : {}),
        }
        : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <GalleryViewer slug={slug} ownerToken={ownerToken} />
        </>
    );
}
