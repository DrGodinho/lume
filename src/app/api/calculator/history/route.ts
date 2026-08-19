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

  const params = request.nextUrl.searchParams;
  const scope = params.get('scope');
  const isAdminWide = scope === 'all';

  // Busca por lead/ cliente (usada para vinculacao de orcamentos ao CRM).
  // Eh admin-wide: ignora o owner_key, pois leads nao sao segmentados por usuario.
  const leadId = params.get('leadId');
  const leadIds = params.get('leadIds');
  const cliente = params.get('cliente');
  const unlinked = params.get('unlinked') === '1';

  if (leadId || leadIds || cliente) {
    let query = supabaseAdmin.from('calculator_history').select('*');
    if (leadId) {
      query = query.eq('lead_id', leadId);
    } else if (leadIds) {
      const ids = leadIds
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      query = query.in('lead_id', ids);
    } else if (cliente) {
      query = query.ilike('cliente', `%${cliente}%`);
      if (unlinked) query = query.is('lead_id', null);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data) {
      return NextResponse.json({ items: [] });
    }
    return NextResponse.json({ items: data });
  }

  let { data, error } = await supabaseAdmin
    .from('calculator_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(isAdminWide ? 100 : 20);

  if (!isAdminWide) {
    const ownerRes = await supabaseAdmin
      .from('calculator_history')
      .select('*')
      .eq('owner_key', ownerKey)
      .order('created_at', { ascending: false })
      .limit(20);
    data = ownerRes.data;
    error = ownerRes.error;

    if ((error || !data || data.length === 0) && ownerKey !== DEFAULT_OWNER_KEY) {
      const fallbackRes = await supabaseAdmin
        .from('calculator_history')
        .select('*')
        .eq('owner_key', DEFAULT_OWNER_KEY)
        .order('created_at', { ascending: false })
        .limit(20);
      if (!fallbackRes.error && fallbackRes.data && fallbackRes.data.length > 0) {
        data = fallbackRes.data;
        error = null;
      }
    }
  }

  if (error || !data) {
    return NextResponse.json({ items: [] });
  }

  // Retorna as linhas em formato snake_case (igual ao retorno direto do Supabase),
  // preservando o contrato esperado pelos componentes de historico.
  return NextResponse.json({ items: data });
}

export async function POST(request: NextRequest) {
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

  const id = typeof body.id === 'string' ? body.id : '';
  if (!id) {
    return NextResponse.json({ error: 'ID do orcamento e obrigatorio' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('calculator_history').upsert({
    id,
    owner_key: ownerKey,
    cliente: body.cliente,
    phone: body.phone ?? null,
    data: body.data,
    valor: body.valor,
    qtd: body.qtd,
    vidros: body.vidros,
    config: body.config,
    desconto: body.desconto,
    modo_otimizacao: body.modoOtimizacao,
    selected_film: body.selectedFilm ?? null,
    lead_id: body.leadId ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const ownerKey = await getCalculatorOwnerKeyFromRequest(request);
  if (!ownerKey) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID do orcamento e obrigatorio' }, { status: 400 });
  }

  const scope = request.nextUrl.searchParams.get('scope');
  const isAdminWide = scope === 'all';

  let query = supabaseAdmin.from('calculator_history').delete().eq('id', id);
  if (!isAdminWide) {
    query = query.eq('owner_key', ownerKey);
  }

  const { error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const ownerKey = await getCalculatorOwnerKeyFromRequest(request);
  if (!ownerKey) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  let body: { id?: unknown; updates?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corpo da requisicao invalido' }, { status: 400 });
  }

  const id = typeof body.id === 'string' ? body.id : '';
  const updates = body.updates;
  if (
    !id ||
    typeof updates !== 'object' ||
    updates === null ||
    Array.isArray(updates)
  ) {
    return NextResponse.json({ error: 'ID e updates obrigatorios' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('calculator_history')
    .update(updates as Record<string, unknown>)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
