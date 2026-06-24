import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://optimage.dreamintrepid.com';

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: 'Compress Images Online: Free Image Compressor',
    description:
        'Compress JPEG, PNG, WebP, AVIF, GIF and HEIC online for free. Reduce file size by up to 90% with no visible quality loss. No signup needed.',
    keywords: [
        'image compressor', 'compress images online', 'compress jpeg online free',
        'compress png online free', 'compress webp', 'reduce image size',
        'image size reducer', 'photo compressor', 'bulk image compressor',
        'free image compressor', 'compress images without losing quality',
        'online image optimizer', 'compress heic online', 'image file size reducer',
    ],
    alternates: {
        canonical: '/compress',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: 'Compress Images Online: Free & Fast | Optimage',
        description: 'Reduce image file sizes by up to 90% instantly. Supports JPEG, PNG, WebP, AVIF, GIF, HEIC. Free for everyone — no account needed.',
        url: `${SITE_URL}/compress`,
        siteName: 'Optimage',
        images: [
            {
                url: `${SITE_URL}/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: 'Optimage Image Compressor',
                type: 'image/png',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Compress Images Online Free | Optimage',
        description: 'Make your images up to 90% smaller with no visible quality loss. Free to start, no account needed.',
        images: [`${SITE_URL}/og-image.jpg`],
        creator: '@dreamintrepid',
        site: '@dreamintrepid',
    },
};

export default function CompressLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
    return <>{children}</>;
}
