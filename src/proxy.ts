import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/crm-auth';

async function hasValidCrmToken(request: NextRequest) {
  const crmToken = request.cookies.get('crm-token')?.value;
  if (!crmToken) return false;

  const payload = await verifyToken(crmToken);
  return !!payload;
}

function getSafeRedirectPath(pathname: string, search: string) {
  const candidate = `${pathname}${search}`;
  if (!candidate.startsWith('/') || candidate.startsWith('//')) return '/crm/';
  return candidate;
}

function redirectToLogin(request: NextRequest, clearToken = false) {
  const url = request.nextUrl.clone();
  url.pathname = '/login/';
  url.searchParams.set('redirectTo', getSafeRedirectPath(request.nextUrl.pathname, request.nextUrl.search));

  const response = NextResponse.redirect(url);
  if (clearToken) {
    response.cookies.set('crm-token', '', { maxAge: 0, path: '/' });
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/crm') || pathname.startsWith('/admin')) {
    const crmToken = request.cookies.get('crm-token')?.value;
    if (!crmToken) {
      return redirectToLogin(request);
    }

    const payload = await verifyToken(crmToken);
    if (!payload) {
      return redirectToLogin(request, true);
    }

    return NextResponse.next();
  }

  if ((pathname === '/login' || pathname === '/login/') && await hasValidCrmToken(request)) {
    const url = request.nextUrl.clone();
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    url.pathname = redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')
      ? redirectTo
      : '/crm/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/login/:path*', '/crm/:path*'],
};
