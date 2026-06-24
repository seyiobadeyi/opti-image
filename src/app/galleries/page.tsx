import type { Metadata } from 'next';
import { createPublicClient } from '@/utils/supabase/public';
import GalleriesLandingPage from './GalleriesLandingPage';
import type { FeaturedPhoto } from '../api/galleries/featured-photos/route';

export const revalidate = 300;

export const metadata: Metadata = {
    title: 'Free Client Photo Gallery Delivery for Photographers | Optimage',
    description: 'Deliver private client photo galleries for free — PIN protection, client favourites, payment gate, your branding. No commissions, no fees.',
    keywords: 'free client gallery software, photo delivery platform, photographer client gallery free, alternative to Pixieset, photo gallery no commission, event photo sharing, client proofing software',
    openGraph: {
        title: 'Free Client Photo Gallery Delivery | Optimage',
        description: 'Private galleries. Client favourites. Payment confirmation. Your branding. Free — no commissions, no per-gallery fees.',
        url: 'https://optimage.dreamintrepid.com/galleries',
        siteName: 'Optimage',
        type: 'website',
        images: [{ url: 'https://optimage.dreamintrepid.com/og-galleries.jpg', width: 1200, height: 630, alt: 'Optimage Client Gallery Delivery Platform' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Free Client Gallery Delivery | Optimage',
        description: 'Deliver photo galleries. Gate access. Confirm payment. Let clients pick favourites. Free with Optimage.',
    },
    alternates: { canonical: 'https://optimage.dreamintrepid.com/galleries' },
};

const CC0_PHOTOS: FeaturedPhoto[] = [
    { url: 'https://images.unsplash.com/photo-1519741497674-611c2d3e84af?auto=format&fit=crop&w=500&q=80', studioName: 'Wedding Studio', website: null, brandingColor: '#9a6b4b', isReal: false },
    { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=500&q=80', studioName: 'Event Photography', website: null, brandingColor: '#3b5998', isReal: false },
    { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=500&q=80', studioName: 'Portrait Studio', website: null, brandingColor: '#c0392b', isReal: false },
    { url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80', studioName: 'Fashion Collective', website: null, brandingColor: '#2c3e50', isReal: false },
    { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&q=80', studioName: 'Sports Media', website: null, brandingColor: '#e74c3c', isReal: false },
    { url: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=500&q=80', studioName: 'Live Events Co.', website: null, brandingColor: '#8e44ad', isReal: false },
    { url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=500&q=80', studioName: 'Studio Collective', website: null, brandingColor: '#16a085', isReal: false },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=500&q=80', studioName: 'Landscape Works', website: null, brandingColor: '#27ae60', isReal: false },
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80', studioName: 'Product Studio', website: null, brandingColor: '#e67e22', isReal: false },
    { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=500&q=80', studioName: 'Food & Lifestyle', website: null, brandingColor: '#f39c12', isReal: false },
    { url: 'https://images.unsplash.com/photo-1465495976275-a5d8b929cd47?auto=format&fit=crop&w=500&q=80', studioName: 'Ceremony Films', website: null, brandingColor: '#d35400', isReal: false },
    { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80', studioName: 'Editorial House', website: null, brandingColor: '#1abc9c', isReal: false },
    { url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=500&q=80', studioName: 'Conference Media', website: null, brandingColor: '#2980b9', isReal: false },
    { url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=500&q=80', studioName: 'Street Lens', website: null, brandingColor: '#7f8c8d', isReal: false },
    { url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=500&q=80', studioName: 'Portrait & Soul', website: null, brandingColor: '#c0392b', isReal: false },
    { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=500&q=80', studioName: 'Nature Photography', website: null, brandingColor: '#27ae60', isReal: false },
    { url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=500&q=80', studioName: 'Movement Studio', website: null, brandingColor: '#9b59b6', isReal: false },
    { url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf145a?auto=format&fit=crop&w=500&q=80', studioName: 'Music & Arts', website: null, brandingColor: '#e74c3c', isReal: false },
];

async function getFeaturedPhotos(): Promise<{ isReal: boolean; photos: FeaturedPhoto[] }> {
    try {
        // Cookieless client → this page stays static/ISR (revalidate = 300).
        // All rows read here are public galleries, so no auth/cookies are needed.
        const supabase = createPublicClient();
        const { data: galleries } = await supabase
            .from('galleries')
            .select('id, slug, owner_id')
            .eq('access_type', 'public')
            .eq('status', 'active')
            .limit(20);

        if (!galleries?.length) return { isReal: false, photos: CC0_PHOTOS };

        const galleryIds = galleries.map(g => g.id as string);
        const ownerIds = [...new Set(galleries.map(g => g.owner_id as string))];

        const { data: items } = await supabase
            .from('gallery_items')
            .select('gallery_id, display_url')
            .in('gallery_id', galleryIds)
            .not('display_url', 'is', null)
            .limit(60);

        if (!items?.length || items.length < 15) return { isReal: false, photos: CC0_PHOTOS };

        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name, branding_studio_name, branding_website, branding_color')
            .in('id', ownerIds);

        const profileMap = new Map((profiles ?? []).map(p => [p.id as string, p]));
        const galleryOwnerMap = new Map(galleries.map(g => [g.id as string, g.owner_id as string]));
        const gallerySlugMap = new Map(galleries.map(g => [g.id as string, g.slug as string]));

        const shuffled = items
            .filter(i => i.display_url)
            .sort(() => Math.random() - 0.5)
            .slice(0, 18);

        const photos: FeaturedPhoto[] = shuffled.map(item => {
            const ownerId = galleryOwnerMap.get(item.gallery_id as string) ?? '';
            const profile = profileMap.get(ownerId);
            return {
                url: item.display_url as string,
                studioName: profile?.branding_studio_name ?? profile?.display_name ?? 'Photographer',
                website: profile?.branding_website ?? null,
                brandingColor: profile?.branding_color ?? '#db5a42',
                gallerySlug: gallerySlugMap.get(item.gallery_id as string),
                isReal: true,
            };
        });

        return { isReal: true, photos };
    } catch {
        return { isReal: false, photos: CC0_PHOTOS };
    }
}

const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Optimage Client Galleries',
    applicationCategory: 'PhotographyApplication',
    operatingSystem: 'Web',
    description: 'Free client photo gallery delivery platform. Private galleries with PIN protection, client favourites, payment gates, and photographer branding. No commissions.',
    url: 'https://optimage.dreamintrepid.com/galleries',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: ['Draft mode', 'Client favourites / proofing', 'Payment gate', 'PIN access control', 'Photographer branding', 'Activity tracking'],
};

const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to deliver a photo gallery to a client for free',
    description: 'Create a private, PIN-protected client photo gallery in under 5 minutes using Optimage.',
    step: [
        { '@type': 'HowToStep', position: 1, name: 'Create a gallery', text: 'Open your Optimage dashboard and create a new gallery. Set a title, expiry date, and access type.' },
        { '@type': 'HowToStep', position: 2, name: 'Upload your photos', text: 'Drag and drop your edited JPEGs or WebPs. Originals are stored in your private Cloudinary folder.' },
        { '@type': 'HowToStep', position: 3, name: 'Set access rules', text: 'Choose public, PIN-protected, email-list, or account-gated access. Enable or disable downloads.' },
        { '@type': 'HowToStep', position: 4, name: 'Send to your client', text: 'Click Send to Client, enter their email. They receive a branded delivery email with the gallery link.' },
    ],
};

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        { '@type': 'Question', name: 'Is Optimage galleries free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Gallery delivery is included with every free Optimage account. No subscription, no commission on client payments, no per-gallery fees.' } },
        { '@type': 'Question', name: 'What is the best free alternative to Pixieset?', acceptedAnswer: { '@type': 'Answer', text: 'Optimage is the best free Pixieset alternative for client gallery delivery. It offers PIN-protected galleries, client favourites, payment confirmation, and photographer branding at no cost.' } },
        { '@type': 'Question', name: 'Do my clients need an account to view the gallery?', acceptedAnswer: { '@type': 'Answer', text: 'For public and PIN-protected galleries, no — clients just need the link and optional PIN. Account-gated galleries require a free Optimage account (20-second signup with email OTP).' } },
        { '@type': 'Question', name: 'How do I share photos with clients professionally?', acceptedAnswer: { '@type': 'Answer', text: 'Create an Optimage gallery, upload your photos, set a PIN, and send the link. Clients see a branded gallery, can pick favourites, and download approved images. Takes under 5 minutes to set up.' } },
    ],
};

export default async function GalleriesPage() {
    const { isReal, photos } = await getFeaturedPhotos();

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <GalleriesLandingPage initialPhotos={photos} photosAreReal={isReal} />
        </>
    );
}
