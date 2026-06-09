import { NextResponse } from 'next/server';
import { createToken } from '@/lib/crm-auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const validEmail = process.env.CRM_EMAIL;
  const validPassword = process.env.CRM_PASSWORD;

  if (email !== validEmail || password !== validPassword) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  const token = await createToken({ email });

  const response = NextResponse.json({ success: true });

  response.cookies.set('crm-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}