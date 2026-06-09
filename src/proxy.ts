import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/crm-auth';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

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
          supabaseResponse = NextResponse.next({ request });
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

  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith('/admin/crm') ||
    pathname.startsWith('/admin/relatorios');

  if (pathname.startsWith('/crm')) {
    if (user) {
      return supabaseResponse;
    }

    const crmToken = request.cookies.get('crm-token')?.value;
    if (!crmToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    const payload = await verifyToken(crmToken);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set('crm-token', '', { maxAge: 0, path: '/' });
      return response;
    }
    return supabaseResponse;
  }

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && (pathname === '/login' || pathname === '/login/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/crm/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/crm/:path*', '/admin/relatorios/:path*', '/login', '/crm/:path*'],
};
