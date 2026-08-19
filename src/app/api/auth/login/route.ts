import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createTokenPair } from '@/lib/crm-auth';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record || now > record.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetAt: record.resetAt };
}

function normalizeLoginIdentifier(value: string) {
  const identifier = value.trim().toLowerCase();
  if (!identifier) return '';
  if (identifier.includes('@')) return identifier;
  return `${identifier}@lume.local`;
}

function isSafeLocalPath(value: string | null | undefined): value is string {
  return (
    !!value &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('//')
  );
}

function getSafeRedirectFromRequest(request: NextRequest, formRedirectTo?: string) {
  const fallback = '/crm/';

  // Prioridade 1: cookie gravado pelo middleware (survive mobile/sem referer)
  const destFromCookie = request.cookies.get('crm-login-dest')?.value;
  if (isSafeLocalPath(destFromCookie) && destFromCookie !== '/login/') {
    return destFromCookie;
  }

  // Prioridade 2: redirectTo do form/URL
  if (isSafeLocalPath(formRedirectTo) && formRedirectTo !== '/login/') {
    return formRedirectTo;
  }

  // Prioridade 3: redirectTo vindo no referer (desktop)
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const redirectTo = new URL(referer).searchParams.get('redirectTo');
      if (isSafeLocalPath(redirectTo) && redirectTo !== '/login/') {
        return redirectTo;
      }
    } catch {
      // ignora referer invalido
    }
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

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || '';
  const isFormPost = contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data');
  const credentials = isFormPost
    ? Object.fromEntries(await request.formData())
    : await request.json();
  const login = String(credentials.login || credentials.email || '');
  const password = String(credentials.password || '');
  const email = normalizeLoginIdentifier(login);

  const rateLimit = checkRateLimit(email);
  if (!rateLimit.allowed) {
    const resetSeconds = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    if (isFormPost) {
      const loginUrl = new URL('/login/', 'http://local.invalid');
      loginUrl.searchParams.set('error', 'rate_limit');
      return redirectRelative(`${loginUrl.pathname}${loginUrl.search}`);
    }
    const errorResponse = NextResponse.json(
      { error: 'Muitas tentativas de login. Tente novamente mais tarde.', retryAfter: resetSeconds },
      { status: 429 }
    );
    errorResponse.headers.set('Retry-After', String(resetSeconds));
    errorResponse.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
    errorResponse.headers.set('X-RateLimit-Remaining', '0');
    errorResponse.headers.set('X-RateLimit-Reset', String(Math.ceil(rateLimit.resetAt / 1000)));
    return errorResponse;
  }

  if (!email || !password) {
    if (isFormPost) {
      const loginUrl = new URL('/login/', 'http://local.invalid');
      loginUrl.searchParams.set('error', 'invalid');
      return redirectRelative(`${loginUrl.pathname}${loginUrl.search}`);
    }
    return NextResponse.json({ error: 'Credenciais invalidas' }, { status: 401 });
  }

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
    const errorResponse = NextResponse.json({ error: 'Credenciais invalidas' }, { status: 401 });
    errorResponse.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
    errorResponse.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    return errorResponse;
  }

  const { accessToken, refreshToken } = await createTokenPair({ email });
  const formRedirectTo = isFormPost ? String(credentials.redirectTo || '') : undefined;
  const response = isFormPost
    ? redirectRelative(getSafeRedirectFromRequest(request, formRedirectTo))
    : NextResponse.json({
        success: true,
        session: data.session
          ? {
              accessToken: data.session.access_token,
              refreshToken: data.session.refresh_token,
            }
          : null,
      });

  response.cookies.set('crm-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  });

  response.cookies.set('crm-refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  // Limpa o destino temporario gravado pelo middleware apos login bem-sucedido
  response.cookies.set('crm-login-dest', '', { maxAge: 0, path: '/' });

  response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));

  return response;
}
