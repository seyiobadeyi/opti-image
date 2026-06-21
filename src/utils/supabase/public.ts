import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Cookieless Supabase client for reading PUBLIC data inside statically-rendered
 * (ISR) routes — e.g. the /galleries landing page.
 *
 * The cookie-based server client (utils/supabase/server.ts) calls next/headers
 * `cookies()`, which forces a route into dynamic rendering. A route that also
 * declares `export const revalidate = N` then ends up in an inconsistent state
 * (declares itself static-revalidatable, yet reads per-request cookies), which
 * breaks RSC payload generation/prefetch. This client touches no cookies, so any
 * page using it stays cleanly static/ISR. Only use it for data that is the same
 * for every visitor (no per-user/auth-gated rows).
 */
export function createPublicClient(): SupabaseClient {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        { auth: { persistSession: false, autoRefreshToken: false } }
    )
}
