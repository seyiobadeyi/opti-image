import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/** Derive a clean username slug from a display name. */
function makeUsername(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').slice(0, 30) || 'user';
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard/optimize';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('display_name, username')
                    .eq('id', user.id)
                    .single();

                if (profile?.display_name) {
                    // Already onboarded — ensure they have a username if not set
                    if (!profile.username) {
                        await assignUsername(supabase, user.id, profile.display_name);
                    }
                    return NextResponse.redirect(`${origin}${next}`);
                }

                // No display_name yet — try to auto-save from OAuth metadata
                const meta = user.user_metadata ?? {};
                const autoName = (
                    meta.full_name ||
                    meta.name ||
                    [meta.given_name, meta.family_name].filter(Boolean).join(' ')
                ).trim();

                if (autoName) {
                    const username = await assignUsername(supabase, user.id, autoName);
                    await supabase
                        .from('profiles')
                        .update({ display_name: autoName.slice(0, 80), username })
                        .eq('id', user.id);
                    return NextResponse.redirect(`${origin}${next}`);
                }

                // No name available — show onboarding wizard
                return NextResponse.redirect(`${origin}/?onboarding=1&next=${encodeURIComponent(next)}`);
            }
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/?error=auth`);
}

async function assignUsername(
    supabase: Awaited<ReturnType<typeof createClient>>,
    userId: string,
    displayName: string,
): Promise<string> {
    const base = makeUsername(displayName);
    let candidate = base;
    let suffix = 2;
    while (true) {
        const { count } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('username', candidate)
            .neq('id', userId);
        if ((count ?? 0) === 0) break;
        candidate = `${base}${suffix++}`;
        if (suffix > 99) { candidate = `${base}_${userId.slice(0, 6)}`; break; }
    }
    await supabase.from('profiles').update({ username: candidate }).eq('id', userId);
    return candidate;
}
