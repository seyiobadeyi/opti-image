import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // If Supabase redirects to any page other than /auth/callback with an OAuth
    // code (happens when the Supabase dashboard Site URL is set to "/" instead
    // of "/auth/callback"), forward it so the code gets properly exchanged.
    const code = searchParams.get('code');
    if (code && !pathname.startsWith('/auth/callback')) {
        const callbackUrl = new URL('/auth/callback', request.url);
        callbackUrl.searchParams.set('code', code);
        // Preserve where the user originally landed as the post-auth destination,
        // but fall back to dashboard for root-level redirects.
        const next = pathname === '/' ? '/dashboard' : pathname;
        callbackUrl.searchParams.set('next', next);
        return NextResponse.redirect(callbackUrl);
    }

    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
