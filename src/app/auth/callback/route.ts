import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('display_name, use_case')
                    .eq('id', user.id)
                    .single();

                // Fully onboarded — go straight to the destination
                if (profile?.display_name && profile?.use_case) {
                    return NextResponse.redirect(`${origin}${next}`);
                }

                // If no display_name yet, auto-save from Google OAuth metadata so that
                // closing or skipping the wizard never leaves the user in a stuck state.
                if (!profile?.display_name) {
                    const meta = user.user_metadata ?? {};
                    const autoName = (
                        meta.full_name ||
                        meta.name ||
                        [meta.given_name, meta.family_name].filter(Boolean).join(' ')
                    ).trim();
                    if (autoName) {
                        await supabase
                            .from('profiles')
                            .update({ display_name: autoName })
                            .eq('id', user.id);
                    }
                }

                // display_name exists but use_case is missing → show wizard for role/referral only
                // (name step will be auto-skipped in the wizard because metadata is pre-filled)
                return NextResponse.redirect(`${origin}/?onboarding=1&next=${encodeURIComponent(next)}`);
            }
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/?error=auth`);
}
