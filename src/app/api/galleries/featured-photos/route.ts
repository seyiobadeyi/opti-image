import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const revalidate = 300; // re-fetch every 5 min

const THRESHOLD = 15;

export interface FeaturedPhoto {
    url: string;
    studioName: string;
    website: string | null;
    brandingColor: string;
    gallerySlug?: string;
    isReal: boolean;
}

// Curated CC0 photography from Unsplash — used until enough user galleries exist
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

export async function GET() {
    try {
        const supabase = await createClient();

        // Step 1: Fetch public active galleries
        const { data: galleries, error: galError } = await supabase
            .from('galleries')
            .select('id, slug, owner_id')
            .eq('access_type', 'public')
            .eq('status', 'active')
            .limit(20);

        if (galError || !galleries?.length) {
            return NextResponse.json({ isReal: false, photos: CC0_PHOTOS });
        }

        const galleryIds = galleries.map(g => g.id);
        const ownerIds = [...new Set(galleries.map(g => g.owner_id))];

        // Step 2: Fetch display_urls from those galleries
        const { data: items, error: itemsError } = await supabase
            .from('gallery_items')
            .select('gallery_id, display_url')
            .in('gallery_id', galleryIds)
            .not('display_url', 'is', null)
            .limit(60);

        if (itemsError || !items?.length || items.length < THRESHOLD) {
            return NextResponse.json({ isReal: false, photos: CC0_PHOTOS });
        }

        // Step 3: Fetch photographer attribution
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name, branding_studio_name, branding_website, branding_color')
            .in('id', ownerIds);

        const profileMap = new Map((profiles ?? []).map(p => [p.id, p]));
        const galleryOwnerMap = new Map(galleries.map(g => [g.id, g.owner_id]));
        const gallerySlugMap = new Map(galleries.map(g => [g.id, g.slug]));

        // Shuffle and cap at 18
        const shuffled = items
            .filter(i => i.display_url)
            .sort(() => Math.random() - 0.5)
            .slice(0, 18);

        const photos: FeaturedPhoto[] = shuffled.map(item => {
            const ownerId = galleryOwnerMap.get(item.gallery_id) ?? '';
            const profile = profileMap.get(ownerId);
            return {
                url: item.display_url as string,
                studioName: profile?.branding_studio_name ?? profile?.display_name ?? 'Photographer',
                website: profile?.branding_website ?? null,
                brandingColor: profile?.branding_color ?? '#db5a42',
                gallerySlug: gallerySlugMap.get(item.gallery_id),
                isReal: true,
            };
        });

        return NextResponse.json({ isReal: true, photos });
    } catch {
        return NextResponse.json({ isReal: false, photos: CC0_PHOTOS });
    }
}
