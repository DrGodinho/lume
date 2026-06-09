import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createToken } from '@/lib/crm-auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();

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
    return NextResponse.json({ error: 'Credenciais invalidas' }, { status: 401 });
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
