import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardClient from './DashboardClient';
import type { UserProfile, ProcessingHistoryItem } from '@/types';

export default async function DashboardPage(): Promise<React.JSX.Element> {
    const supabase = await createClient();

    // Server-side auth check
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect('/?login=true');
    }

    // Fetch user profile (credits)
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch processing history
    const { data: history } = await supabase
        .from('processing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <>
            <Header />
            <main className="main-content" style={{ minHeight: '80vh', padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
                <DashboardClient user={{ email: user.email ?? '' }} profile={(profile as UserProfile) ?? null} history={(history as ProcessingHistoryItem[]) ?? []} />
            </main>
            <Footer />
        </>
    );
}
