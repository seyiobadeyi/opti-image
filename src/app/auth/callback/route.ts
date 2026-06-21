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
                    .select('display_name')
                    .eq('id', user.id)
                    .single();

                if (profile?.display_name) {
                    // Already has a name — considered onboarded, go straight to destination
                    return NextResponse.redirect(`${origin}${next}`);
                }

                // No display_name yet. Try to auto-save from Google OAuth metadata so that
                // even if the user skips the wizard their name is persisted immediately.
                const meta = user.user_metadata ?? {};
                const autoName = (
                    meta.full_name ||
                    meta.name ||
                    [meta.given_name, meta.family_name].filter(Boolean).join(' ')
                ).trim();

                if (autoName) {
                    await supabase
                        .from('profiles')
                        .update({ display_name: autoName.slice(0, 80) })
                        .eq('id', user.id);
                    // Name saved — send straight to destination, no wizard needed
                    return NextResponse.redirect(`${origin}${next}`);
                }

                // Genuinely no name available (non-Google provider or empty metadata)
                // Show the onboarding wizard so the user can provide their name.
                return NextResponse.redirect(`${origin}/?onboarding=1&next=${encodeURIComponent(next)}`);
            }
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/?error=auth`);
}
