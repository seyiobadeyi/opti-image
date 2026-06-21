import { createClient } from '@/utils/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardClient from '@/app/dashboard/DashboardClient';
import type { UserProfile, ProcessingHistoryItem, DashboardTab } from '@/types';

// Always server-render — never statically pre-generate this route
export const dynamic = 'force-dynamic';

const VALID_TABS: DashboardTab[] = ['optimize', 'video', 'history', 'galleries', 'referrals', 'settings'];

interface DashboardTabPageProps {
    params: Promise<{ tab: string }>;
    searchParams: Promise<{ gallery?: string }>;
}

export default async function DashboardTabPage({ params, searchParams }: DashboardTabPageProps): Promise<React.JSX.Element> {
    const { tab } = await params;
    const { gallery: galleryId } = await searchParams;

    if (!VALID_TABS.includes(tab as DashboardTab)) notFound();

    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) redirect('/?login=true');

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const { data: history } = await supabase
        .from('processing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div style={{ background: '#fff', minHeight: '100vh', color: '#111827' }}>
            <Header />
            <main className="main-content" style={{ minHeight: '80vh', padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                <DashboardClient
                    user={{ email: user.email ?? '' }}
                    profile={(profile as UserProfile) ?? null}
                    history={(history as ProcessingHistoryItem[]) ?? []}
                    initialTab={tab as DashboardTab}
                    initialGalleryId={galleryId}
                />
            </main>
            <Footer />
        </div>
    );
}
