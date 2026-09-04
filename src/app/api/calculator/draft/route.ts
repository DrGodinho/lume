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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corpo da requisicao invalido' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Corpo da requisicao invalido' }, { status: 400 });
  }
  const raw = body as Record<string, unknown>;

  // Sanitiza apenas as colunas conhecidas para nunca gerar 500 por coluna inexistente.
  const row: Record<string, unknown> = { id: ownerKey };

  if (typeof raw.cliente === 'string') row.cliente = raw.cliente;
  if (typeof raw.phone === 'string') row.phone = raw.phone;
  if (Array.isArray(raw.vidros)) row.vidros = raw.vidros;

  const asNumber = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : undefined);
  const asString = (value: unknown) => (typeof value === 'string' ? value : undefined);

  const numeroDesconto = asNumber(raw.desconto);
  if (numeroDesconto !== undefined) row.desconto = numeroDesconto;
  const descontoInput = asString(raw.desconto_input);
  if (descontoInput !== undefined) row.desconto_input = descontoInput;
  const rollW = asNumber(raw.roll_w);
  if (rollW !== undefined) row.roll_w = rollW;
  const price = asNumber(raw.price);
  if (price !== undefined) row.price = price;
  const margin = asNumber(raw.margin);
  if (margin !== undefined) row.margin = margin;
  const modoOtimizacao = asString(raw.modo_otimizacao);
  if (modoOtimizacao !== undefined) row.modo_otimizacao = modoOtimizacao;
  const userName = asString(raw.user_name);
  if (userName !== undefined) row.user_name = userName;
  const selectedFilm = asString(raw.selected_film);
  if (selectedFilm !== undefined) row.selected_film = selectedFilm;
  const lastSaved = asNumber(raw.last_saved);
  if (lastSaved !== undefined) row.last_saved = lastSaved;

  row.updated_at = new Date().toISOString();

  // Colunas opcionais que podem nao existir no banco (schema antigo).
  // Se o PostgREST reclamar de uma coluna inexistente, remove-a e tenta de novo
  // em vez de devolver 500.
  const OPTIONAL_COLUMNS = ['last_saved'] as const;
  let currentRow = row;
  for (let attempt = 0; attempt <= OPTIONAL_COLUMNS.length; attempt++) {
    const { error } = await supabaseAdmin
      .from('calculator_draft')
      .upsert(currentRow);

    if (!error) return NextResponse.json({ success: true });

    const missingColumn = OPTIONAL_COLUMNS.find((column) => error.message?.includes(column));
    if (!missingColumn || !(missingColumn in currentRow)) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { [missingColumn]: _dropped, ...remaining } = currentRow;
    void _dropped;
    currentRow = remaining;
  }

  return NextResponse.json({ error: 'Falha ao salvar o rascunho' }, { status: 500 });
}
