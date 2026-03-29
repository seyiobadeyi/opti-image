import type { Metadata } from 'next';
import GalleryViewer from './GalleryViewer';
import { apiClient } from '@/lib/api';

interface GalleryPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const gallery = await apiClient.getGalleryPublic(slug);
        return {
            title: `${gallery.title} — Optimage Gallery`,
            description: gallery.description ?? `View the ${gallery.title} photo gallery.`,
            openGraph: {
                title: gallery.title,
                description: gallery.description ?? undefined,
                images: gallery.cover_image_url ? [{ url: gallery.cover_image_url }] : [],
            },
        };
    } catch {
        return { title: 'Gallery — Optimage' };
    }
}

export default async function GalleryPage({ params }: GalleryPageProps) {
    const { slug } = await params;
    return <GalleryViewer slug={slug} />;
}
