import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAccessToken } from '@/lib/crm-auth';

function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function ensureAuthorized(request: NextRequest) {
  const crmToken = request.cookies.get('crm-token')?.value;
  if (crmToken) {
    const payload = await verifyAccessToken(crmToken);
    if (payload) return null;
  }
  return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
}

const isValidKey = (key: unknown): key is string =>
  typeof key === 'string' && key.length > 0 && key.length <= 100;

export async function GET(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!isValidKey(id)) {
    return NextResponse.json({ error: 'ID de configuracao invalido' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('configuracoes')
    .select('meta_valor')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data?.meta_valor !== null && data?.meta_valor !== undefined) {
    return NextResponse.json({ id, meta_valor: data.meta_valor });
  }

  // Se for consulta de meta mensal e este mês ainda não possuir meta específica gravada,
  // herda a meta mais recente configurada (<= mês solicitado) ou a meta 'default'
  if (id.startsWith('crm_goal_')) {
    const { data: previousGoal } = await supabaseAdmin
      .from('configuracoes')
      .select('meta_valor')
      .like('id', 'crm_goal_%')
      .lte('id', id)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (previousGoal?.meta_valor !== null && previousGoal?.meta_valor !== undefined) {
      return NextResponse.json({ id, meta_valor: previousGoal.meta_valor });
    }

    const { data: anyGoal } = await supabaseAdmin
      .from('configuracoes')
      .select('meta_valor')
      .like('id', 'crm_goal_%')
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (anyGoal?.meta_valor !== null && anyGoal?.meta_valor !== undefined) {
      return NextResponse.json({ id, meta_valor: anyGoal.meta_valor });
    }

    const { data: defaultGoal } = await supabaseAdmin
      .from('configuracoes')
      .select('meta_valor')
      .eq('id', 'default')
      .maybeSingle();

    if (defaultGoal?.meta_valor !== null && defaultGoal?.meta_valor !== undefined) {
      return NextResponse.json({ id, meta_valor: defaultGoal.meta_valor });
    }
  }

  return NextResponse.json({ id, meta_valor: null });
}

export async function PUT(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  let body: { id?: unknown; meta_valor?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corpo da requisicao invalido' }, { status: 400 });
  }

  if (!isValidKey(body.id)) {
    return NextResponse.json({ error: 'ID de configuracao invalido' }, { status: 400 });
  }

  if (typeof body.meta_valor !== 'number' && typeof body.meta_valor !== 'string') {
    return NextResponse.json({ error: 'meta_valor invalido' }, { status: 400 });
  }

  const numericValue = Number(body.meta_valor);
  if (!Number.isFinite(numericValue)) {
    return NextResponse.json({ error: 'meta_valor precisa ser numerico' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('configuracoes')
    .upsert({ id: body.id, meta_valor: numericValue }, { onConflict: 'id' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Ao salvar a meta de um mês, sincroniza também 'default' para garantir
  // continuidade automática nos meses subsequentes
  if (typeof body.id === 'string' && body.id.startsWith('crm_goal_')) {
    try {
      await supabaseAdmin
        .from('configuracoes')
        .upsert({ id: 'default', meta_valor: numericValue }, { onConflict: 'id' });
    } catch {
      // Falha silenciosa na sincronização secundária para não travar a resposta principal
    }
  }

  return NextResponse.json({ id: body.id, meta_valor: numericValue });
}
