import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdmin, getCalculatorOwnerKeyFromRequest } from '@/lib/serverAuth';

const DEFAULT_OWNER_KEY = 'default';

export async function GET(request: NextRequest) {
  const ownerKey = await getCalculatorOwnerKeyFromRequest(request);
  if (!ownerKey) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  let { data, error } = await supabaseAdmin
    .from('calculator_draft')
    .select('*')
    .eq('id', ownerKey)
    .maybeSingle();

  if ((error || !data) && ownerKey !== DEFAULT_OWNER_KEY) {
    const fallbackRes = await supabaseAdmin
      .from('calculator_draft')
      .select('*')
      .eq('id', DEFAULT_OWNER_KEY)
      .maybeSingle();
    if (!fallbackRes.error && fallbackRes.data) {
      data = fallbackRes.data;
      error = null;
    }
  }

  if (error || !data) {
    return NextResponse.json({ draft: null });
  }

  const { id: _id, updated_at: _updatedAt, ...draft } = data as Record<string, unknown>;
  void _id;
  void _updatedAt;
  return NextResponse.json({ draft });
}

export async function PUT(request: NextRequest) {
  const ownerKey = await getCalculatorOwnerKeyFromRequest(request);
  if (!ownerKey) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corpo da requisicao invalido' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('calculator_draft')
    .upsert({ id: ownerKey, ...body, updated_at: new Date().toISOString() });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
