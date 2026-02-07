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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Protected Routes: Require Authentication


  const protectedRoutes = ['/dashboard', '/onboarding', '/profile', '/matches', '/campaigns'];
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

  if (user) {
    const isEmailVerified = !!user.email_confirmed_at;

    // Auth Routes: Redirect to dashboard if already logged in
    const authRoutes = ['/login', '/signup', '/forgot-password', '/verify-email'];
    const isAuthRoute = authRoutes.some((route) => path === route);

    if (isAuthRoute) {
      if (isEmailVerified) {
        url.pathname = '/onboarding';
        return NextResponse.redirect(url);
      } else if (path !== '/verify-email') {
        url.pathname = '/verify-email';
        return NextResponse.redirect(url);
      }
    }
  } else {
    // If user is NOT logged in, redirect protected pages to login
    if (isProtectedRoute) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
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
