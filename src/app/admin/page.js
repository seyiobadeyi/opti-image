import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminClient from './AdminClient';

export default async function AdminPage() {
    const supabase = await createClient();

    // Server-side auth check
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect('/?login=true');
    }

    // Admin email whitelist check
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
    if (adminEmails.length > 0 && !adminEmails.includes(user.email?.toLowerCase())) {
        redirect('/');
    }

    // Fetch active bypass codes (we can use the regular client here since RLS allows select on active ones,
    // but we want to see ALL of them including inactive for the admin panel. 
    // We'll pass the Service Role fetching inside a Server component if needed, but let's just use the server client for now)

    // To see ALL codes (even inactive/expired), we must use Service Role on the server side
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: bypassCodes } = await supabaseAdmin
        .from('bypass_codes')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <>
            <Header />
            <main className="main-content" style={{ minHeight: '80vh', padding: '40px 24px', maxWidth: '1000px', margin: '0 auto' }}>
                <AdminClient bypassCodes={bypassCodes} />
            </main>
            <Footer />
        </>
    );
}
