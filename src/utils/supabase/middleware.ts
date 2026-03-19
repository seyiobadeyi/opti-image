import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest): Promise<NextResponse> {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // For Admin-only routes, check for bypass and redirect if unauthorized
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        // Only allow logged in users (or specific roles in the future) to access admin
        return NextResponse.redirect(new URL('/?login=true', request.url))
    }

    // NOTE: You can also protect other routes here by checking if `!user`
    // and redirecting to the login page.

    // ── Geo: set country cookie for client-side currency auto-detection ──
    // Vercel injects x-vercel-ip-country on every request (ISO 3166-1 alpha-2).
    // In local/dev, default to 'US' so USD is the baseline.
    // The paywall reads this cookie to default Nigerian users to NGN and everyone else to USD.
    const vercelCountry = request.headers.get('x-vercel-ip-country');
    const isProd = process.env.NODE_ENV === 'production';

    // In production, always trust the Vercel header when present (keeps users correct if they travel/VPN).
    // In dev, keep it stable as US unless you manually set the cookie for testing.
    const shouldSetGeoCookie = (!isProd && !request.cookies.has('optimage_country')) || (isProd && !!vercelCountry) || (!isProd && !!vercelCountry);

    if (shouldSetGeoCookie) {
        const country = vercelCountry ?? (isProd ? 'US' : 'US');
        supabaseResponse.cookies.set('optimage_country', country, {
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
            httpOnly: false, // must be readable by client-side JS
            sameSite: 'lax',
            secure: isProd,
        });
    }

    return supabaseResponse
}
