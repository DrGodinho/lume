import { NextResponse, type NextRequest } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, createTokenPair } from '@/lib/crm-auth';

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
  const safePath = getSafeRedirectPath(request.nextUrl.pathname, request.nextUrl.search);
  const url = request.nextUrl.clone();
  url.pathname = '/login/';
  url.searchParams.set('redirectTo', safePath);

  const response = NextResponse.redirect(url);
  response.cookies.set('crm-token', '', { maxAge: 0, path: '/' });
  response.cookies.set('crm-refresh-token', '', { maxAge: 0, path: '/' });
  response.cookies.set('crm-login-dest', safePath, { path: '/', maxAge: 600 });

  return response;
}

// O crm-token deve ser um access token (type === 'access'). O refresh token
// (valido por 7 dias) nunca e aceito como autenticacao direta, mas e usado aqui
// para renovar silenciosamente o access token enquanto ainda estiver valido
// (sessao deslizante de 7 dias, sem precisar digitar a senha repetidamente).
type AuthResult =
  | { status: 'ok' }
  | { status: 'refresh'; accessToken: string; refreshToken: string }
  | { status: 'unauthenticated' };

async function authenticate(request: NextRequest): Promise<AuthResult> {
  const crmToken = request.cookies.get('crm-token')?.value;
  if (crmToken) {
    const accessPayload = await verifyAccessToken(crmToken);
    if (accessPayload) return { status: 'ok' };
  }

  // Access token ausente/expirado: tenta renovar usando o refresh token.
  const refreshToken = request.cookies.get('crm-refresh-token')?.value;
  if (refreshToken) {
    const refreshPayload = await verifyRefreshToken(refreshToken);
    if (refreshPayload?.email) {
      const { accessToken, refreshToken: newRefreshToken } = await createTokenPair({
        email: refreshPayload.email,
      });
      return { status: 'refresh', accessToken, refreshToken: newRefreshToken };
    }
  }

  const supabaseToken =
    request.cookies.get('sb-access-token')?.value ||
    request.cookies.get('supabase-auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  if (supabaseToken && (await verifySupabaseToken(supabaseToken))) {
    return { status: 'ok' };
  }

  return { status: 'unauthenticated' };
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

  const authResult = await authenticate(request);

  if (authResult.status === 'unauthenticated') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
    }
    return redirectToLogin(request);
  }

  const response = NextResponse.next();

  // Renova silenciosamente os cookies de sessao (access + refresh rotacionado).
  if (authResult.status === 'refresh') {
    response.cookies.set('crm-token', authResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
      path: '/',
    });
    response.cookies.set('crm-refresh-token', authResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  }

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: ['/crm/:path*', '/admin/:path*', '/api/crm/:path*'],
};
