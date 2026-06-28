import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import DashboardClient from '@/app/dashboard/DashboardClient';
import type { UserProfile, ProcessingHistoryItem, DashboardTab } from '@/types';

// Never statically pre-generate — this page reads auth cookies on every request
export const dynamic = 'force-dynamic';

const VALID_TABS: DashboardTab[] = ['optimize', 'tools', 'video', 'history', 'galleries', 'referrals', 'settings'];

interface Props {
    params: Promise<{ tab: string }>;
    searchParams: Promise<{ gallery?: string }>;
}

export default async function DashboardTabPage({ params, searchParams }: Props) {
    const { tab } = await params;
    if (!VALID_TABS.includes(tab as DashboardTab)) notFound();

    const { gallery: galleryId } = await searchParams;

    // Middleware guarantees the user is authenticated before reaching here.
    // No redirect needed — just fetch the data.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const [{ data: profile }, { data: history }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user!.id).single(),
        supabase.from('processing_history').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }),
    ]);

    return (
        <DashboardClient
            user={{ email: user!.email ?? '' }}
            profile={(profile as UserProfile) ?? null}
            history={(history as ProcessingHistoryItem[]) ?? []}
            initialTab={tab as DashboardTab}
            initialGalleryId={galleryId}
        />
    );
}
