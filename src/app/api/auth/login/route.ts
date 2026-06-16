import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createToken } from '@/lib/crm-auth';

function getSafeRedirectFromRequest(request: Request) {
  const fallback = '/crm/';
  const referer = request.headers.get('referer');
  if (!referer) return fallback;

  try {
    const redirectTo = new URL(referer).searchParams.get('redirectTo');
    if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
      return redirectTo;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function redirectRelative(path: string, status = 303) {
  return new NextResponse(null, {
    status,
    headers: {
      Location: path,
    },
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  const isFormPost = contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data');
  const credentials = isFormPost
    ? Object.fromEntries(await request.formData())
    : await request.json();
  const email = String(credentials.email || '');
  const password = String(credentials.password || '');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    if (isFormPost) {
      const loginUrl = new URL('/login/', 'http://local.invalid');
      loginUrl.searchParams.set('error', 'invalid');
      loginUrl.searchParams.set('redirectTo', getSafeRedirectFromRequest(request));
      return redirectRelative(`${loginUrl.pathname}${loginUrl.search}`);
    }
    return NextResponse.json({ error: 'Credenciais invalidas' }, { status: 401 });
  }

  const token = await createToken({ email });
  const response = isFormPost
    ? redirectRelative(getSafeRedirectFromRequest(request))
    : NextResponse.json({
        success: true,
        session: data.session
          ? {
              accessToken: data.session.access_token,
              refreshToken: data.session.refresh_token,
            }
          : null,
      });

  response.cookies.set('crm-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
