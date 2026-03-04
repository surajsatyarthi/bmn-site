import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // --- AUTH BYPASS FOR TESTING ---
  let user = null;
  // Allow bypass in dev OR if explicitly enabled via env var (for CI/Product builds running smoke tests)
  const enableBypass = process.env.NODE_ENV !== 'production';
  const bypassHeader = request.headers.get('x-test-auth-bypass');
  const unconfirmedHeader = request.headers.get('x-test-unconfirmed');
  
  if (enableBypass && (bypassHeader === 'true' || unconfirmedHeader === 'true')) {
     console.log('🚧 MIDDLEWARE BYPASS: User Authenticated 🚧');
     // ... mock user object
     user = {
       id: 'd2d4586e-9646-4b16-b363-c301ada79540',
       aud: 'authenticated',
       role: 'authenticated',
       email: 'mock_bypass@bmn.com',
       email_confirmed_at: unconfirmedHeader === 'true' ? null : new Date().toISOString(),
     };
  } else {
     // Debug logging to see why it failed
     if(bypassHeader) {
         console.log(`[Middleware] Bypass failed. NODE_ENV: ${process.env.NODE_ENV}, Header: ${bypassHeader}`);
     }
     const { data } = await supabase.auth.getUser();
     user = data.user;
  }
  // -------------------------------

  const url = request.nextUrl.clone();
  const path = url.pathname;

  function redirectWithCookies(url: URL, cookieSource: NextResponse): NextResponse {
    const res = NextResponse.redirect(url);
    cookieSource.cookies.getAll().forEach((cookie) => {
      res.cookies.set(cookie.name, cookie.value);
    });
    return res;
  }

  // Protected Routes: Require Authentication


  const protectedRoutes = ['/dashboard', '/onboarding', '/profile', '/matches', '/campaigns', '/admin', '/database'];
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

  if (user) {
    const isEmailVerified = !!user.email_confirmed_at;

    // Auth Routes: Redirect to onboarding if already logged in
    const authRoutes = ['/login', '/signup', '/forgot-password', '/verify-email'];
    const isAuthRoute = authRoutes.some((route) => path === route);

    if (isAuthRoute) {
      if (isEmailVerified) {
        url.pathname = '/onboarding';
        url.search = '';
        return redirectWithCookies(url, supabaseResponse);
      } else if (path !== '/verify-email') {
        url.pathname = '/verify-email';
        return redirectWithCookies(url, supabaseResponse);
      }
    }
  } else {
    // If user is NOT logged in, redirect protected pages to login
    if (isProtectedRoute) {
      url.pathname = '/login';
      return redirectWithCookies(url, supabaseResponse);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes - handled separately or let through)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
