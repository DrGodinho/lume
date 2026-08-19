import { NextResponse, type NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/crm-auth';

const PROTECTED_PATHS = ['/crm', '/admin'];
const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout', '/api/auth/refresh', '/api/auth/me'];

async function verifySupabaseToken(token: string): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return false;

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseAnonKey,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

function getSafeRedirectPath(pathname: string, search: string) {
  const candidate = `${pathname}${search}`;
  if (!candidate.startsWith('/') || candidate.startsWith('//')) return '/crm/';
  return candidate;
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/login/';
  url.searchParams.set('redirectTo', getSafeRedirectPath(request.nextUrl.pathname, request.nextUrl.search));

  const response = NextResponse.redirect(url);
  response.cookies.set('crm-token', '', { maxAge: 0, path: '/' });
  response.cookies.set('crm-refresh-token', '', { maxAge: 0, path: '/' });

  return response;
}

// O crm-token deve ser um access token (type === 'access'). O refresh token
// (valido por 7 dias) nunca e aceito como autenticacao direta.
async function authenticate(request: NextRequest): Promise<boolean> {
  const crmToken = request.cookies.get('crm-token')?.value;
  if (crmToken && (await verifyAccessToken(crmToken))) {
    return true;
  }

  const supabaseToken =
    request.cookies.get('sb-access-token')?.value ||
    request.cookies.get('supabase-auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  if (supabaseToken && (await verifySupabaseToken(supabaseToken))) {
    return true;
  }

  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  const isProtectedPath = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  if (!(await authenticate(request))) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
    }
    return redirectToLogin(request);
  }

  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: ['/crm/:path*', '/admin/:path*', '/api/crm/:path*'],
};
