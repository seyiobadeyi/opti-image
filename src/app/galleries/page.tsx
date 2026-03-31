import type { Metadata } from 'next';
import GalleriesLandingPage from './GalleriesLandingPage';

export const metadata: Metadata = {
    title: 'Client Gallery Delivery for Photographers | Optimage',
    description: 'Deliver stunning photo galleries to your clients. Draft mode, client favourites, payment gate, PIN protection, photographer branding — all in one platform. No commission. No per-gallery fees.',
    keywords: 'client gallery delivery, photo gallery software, photographer client gallery, gallery delivery platform, photography delivery tool, client proofing, photo delivery',
    openGraph: {
        title: 'Client Gallery Delivery for Photographers | Optimage',
        description: 'The gallery platform built for photographers who deliver. Private galleries, client favourites, payment confirmation, expiry reminders — everything Pixieset has, at a flat subscription rate.',
        url: 'https://optimage.dreamintrepid.com/galleries',
        siteName: 'Optimage',
        type: 'website',
        images: [{ url: 'https://optimage.dreamintrepid.com/og-galleries.jpg', width: 1200, height: 630, alt: 'Optimage Gallery Delivery' }],
    },
    twitter: { card: 'summary_large_image', title: 'Client Gallery Delivery | Optimage', description: 'Deliver photo galleries. Gate access. Confirm payment. Let clients pick favourites. One flat price.' },
    alternates: { canonical: 'https://optimage.dreamintrepid.com/galleries' },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Optimage Gallery Delivery',
    applicationCategory: 'PhotographyApplication',
    operatingSystem: 'Web',
    description: 'Professional photo gallery delivery platform for photographers. Create private client galleries with PIN protection, payment gates, client favouriting, and photographer branding.',
    url: 'https://optimage.dreamintrepid.com/galleries',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'NGN', description: 'Included with Optimage subscription' },
    featureList: [
        'Draft mode — curate before you share',
        'Client favourites / proofing',
        'Offline payment gate',
        'PIN and email-list access control',
        'Photographer branding',
        'Auto-expiry with client reminders',
        'Activity and download tracking',
        'Send-to-client delivery email',
    ],
};

export default function GalleriesPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <GalleriesLandingPage />
        </>
    );
}
