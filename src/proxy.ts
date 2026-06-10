import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from '@/lib/crm-auth';

async function hasValidCrmToken(request: NextRequest) {
  const crmToken = request.cookies.get('crm-token')?.value;
  if (!crmToken) return false;

  const payload = await verifyToken(crmToken);
  return !!payload;
}

function redirectToLogin(request: NextRequest, clearToken = false) {
  const url = request.nextUrl.clone();
  url.pathname = '/login/';

  const response = NextResponse.redirect(url);
  if (clearToken) {
    response.cookies.set('crm-token', '', { maxAge: 0, path: '/' });
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/crm') || pathname.startsWith('/admin/relatorios') || pathname.startsWith('/admin/blog')) {
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
    url.pathname = '/crm/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/blog/:path*', '/admin/relatorios/:path*', '/login', '/login/:path*', '/crm/:path*'],
};
