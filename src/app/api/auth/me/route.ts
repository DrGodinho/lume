import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/crm-auth';

export async function GET(request: Request) {
  const accessToken = request.headers.get('authorization')?.replace('Bearer ', '')
    || request.headers.get('cookie')?.split('; ').find((c) => c.startsWith('crm-token='))?.split('=')[1];

  if (!accessToken) {
    return NextResponse.json({ error: 'Token nao fornecido' }, { status: 401 });
  }

  const payload = await verifyAccessToken(accessToken);
  if (!payload || !payload.email) {
    return NextResponse.json({ error: 'Token invalido ou expirado' }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, email: payload.email });
}