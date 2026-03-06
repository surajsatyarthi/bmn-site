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

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const url = request.nextUrl.clone();
  const path = url.pathname;

  function redirectWithCookies(targetUrl: URL, cookieSource: NextResponse): NextResponse {
    const res = NextResponse.redirect(targetUrl);
    cookieSource.cookies.getAll().forEach((cookie) => {
      res.cookies.set(cookie.name, cookie.value);
    });
    return res;
  }

  const protectedRoutes = ['/dashboard', '/onboarding', '/profile', '/matches', '/campaigns', '/admin', '/database'];
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

  if (user) {
    const isEmailVerified = !!user.email_confirmed_at;

    const authRoutes = ['/login', '/signup', '/forgot-password', '/verify-email'];
    const isAuthRoute = authRoutes.some((route) => path === route);

    if (isAuthRoute) {
      if (isEmailVerified) {
        // Send to /matches — the app handles onboarding redirect internally
        url.pathname = '/matches';
        url.search = '';
        return redirectWithCookies(url, supabaseResponse);
      } else if (path !== '/verify-email') {
        url.pathname = '/verify-email';
        return redirectWithCookies(url, supabaseResponse);
      }
    }
  } else {
    if (isProtectedRoute) {
      url.pathname = '/login';
      return redirectWithCookies(url, supabaseResponse);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
