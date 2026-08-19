import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyRefreshToken, createTokenPair } from '@/lib/crm-auth';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('crm-refresh-token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'Refresh token nao fornecido' }, { status: 401 });
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload || !payload.email) {
    const response = NextResponse.json({ error: 'Refresh token invalido ou expirado' }, { status: 401 });
    response.cookies.set('crm-token', '', { maxAge: 0, path: '/' });
    response.cookies.set('crm-refresh-token', '', { maxAge: 0, path: '/' });
    return response;
  }

  const { accessToken, refreshToken: newRefreshToken } = await createTokenPair({ email: payload.email });

  const response = NextResponse.json({ success: true, accessToken });

  response.cookies.set('crm-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  });

  response.cookies.set('crm-refresh-token', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}