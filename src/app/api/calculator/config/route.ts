import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdmin, getCalculatorOwnerKeyFromRequest } from '@/lib/serverAuth';

const DEFAULT_OWNER_KEY = 'default';

const CONFIG_OPTIONAL_COLUMNS = [
  'modo_perdas',
  'perdas_fixas',
  'modo_cor_config',
  'agressividade_corte',
  'film_types',
  'selected_film',
  'draft_expiration',
] as const;

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
    .from('calculator_config')
    .select('*')
    .eq('id', ownerKey)
    .maybeSingle();

  if ((error || !data) && ownerKey !== DEFAULT_OWNER_KEY) {
    const fallbackRes = await supabaseAdmin
      .from('calculator_config')
      .select('*')
      .eq('id', DEFAULT_OWNER_KEY)
      .maybeSingle();
    if (!fallbackRes.error && fallbackRes.data) {
      data = fallbackRes.data;
      error = null;
    }
  }

  if (error || !data) {
    return NextResponse.json({ config: null });
  }

  const { id: _id, updated_at: _updatedAt, ...config } = data as Record<string, unknown>;
  void _id;
  void _updatedAt;
  return NextResponse.json({ config });
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

  const row: Record<string, unknown> = {
    id: ownerKey,
    ...body,
    updated_at: new Date().toISOString(),
  };

  // Garante que film_types seja sempre um objeto valido para a coluna jsonb.
  if (typeof row.film_types === 'string') {
    try {
      row.film_types = JSON.parse(row.film_types);
    } catch {
      row.film_types = null;
    }
  }
  if (row.film_types !== null && (typeof row.film_types !== 'object' || Array.isArray(row.film_types))) {
    row.film_types = null;
  }
  if (row.selected_film !== null && typeof row.selected_film !== 'string') {
    row.selected_film = null;
  }

  while (true) {
    const { error } = await supabaseAdmin.from('calculator_config').upsert(row);
    if (!error) return NextResponse.json({ success: true });

    const missingColumn = CONFIG_OPTIONAL_COLUMNS.find((column) => error.message?.includes(column));

    if (!missingColumn || !(missingColumn in row)) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    delete row[missingColumn];
  }
}
