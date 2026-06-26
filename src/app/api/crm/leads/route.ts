import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/crm-auth';
import { roundCurrency, roundMeasure } from '@/lib/numberPrecision';

type LeadStatus = 'Novo' | 'Em Contato' | 'Agendado' | 'Fechado' | 'Perdido';
type ServiceStatus = 'Marcado' | 'Confirmado' | 'Em Execucao' | 'Concluido' | 'Reagendar';
type LeadRow = Record<string, string | number | boolean | null | undefined>;
type SupabaseError = {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
};

const OPTIONAL_LEAD_COLUMNS = new Set([
  'status_changed_at',
  'proximo_contato',
  'data_servico',
  'service_status',
  'updated_at',
  'deleted_at',
  'dormant',
]);

interface LeadPayload {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  neighborhood: string;
  filmType: string;
  sqm: number;
  value: number;
  status: LeadStatus;
  notes: string;
  createdAt?: string;
  statusChangedAt?: string;
  proximoContato?: string | null;
  dataServico?: string | null;
  serviceStatus?: ServiceStatus | null;
  dormant?: boolean;
  updatedAt?: string;
  deletedAt?: string | null;
}

const normalizeLeadStatus = (status: unknown): LeadStatus => {
  if (status === 'Proposta Enviada') return 'Agendado';
  if (status === 'Novo' || status === 'Em Contato' || status === 'Agendado' || status === 'Fechado' || status === 'Perdido') {
    return status;
  }
  return 'Novo';
};

const normalizeServiceStatus = (status: unknown): ServiceStatus | null => {
  if (status === 'Marcado' || status === 'Confirmado' || status === 'Em Execucao' || status === 'Concluido' || status === 'Reagendar') {
    return status;
  }
  if (status === 'Em execução') return 'Em Execucao';
  return null;
};

const isMissingOptionalLeadColumnError = (message?: string) =>
  !!message && [...OPTIONAL_LEAD_COLUMNS].some((column) => message.includes(`'${column}' column`));

const withoutOptionalLeadColumns = (row: LeadRow) =>
  Object.fromEntries(
    Object.entries(row).filter(([key]) => !OPTIONAL_LEAD_COLUMNS.has(key))
  );

const crmErrorResponse = (error: SupabaseError, status = 500) =>
  NextResponse.json(
    {
      error: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    },
    { status }
  );

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

async function createSupabaseRequestClient(request: NextRequest) {
  const supabaseAdmin = createSupabaseAdmin();
  if (supabaseAdmin) return supabaseAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authHeader = request.headers.get('authorization');

  if (!supabaseUrl || !supabaseAnonKey || !authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });
}

const getBearerToken = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice('Bearer '.length).trim() || null;
};

async function hasValidSupabaseSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = getBearerToken(request);

  if (!supabaseUrl || !supabaseAnonKey || !token) return false;

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  const { data, error } = await supabaseClient.auth.getUser(token);

  return !error && !!data.user;
}

async function ensureAuthorized(request: NextRequest) {
  const crmToken = request.cookies.get('crm-token')?.value;

  if (crmToken) {
    const payload = await verifyToken(crmToken);
    if (payload) return null;
  }

  if (await hasValidSupabaseSession(request)) return null;

  return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
}

async function resolveActor(request: NextRequest) {
  const crmToken = request.cookies.get('crm-token')?.value;
  if (crmToken) {
    const payload = await verifyToken(crmToken);
    if (payload?.email) return payload.email;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = getBearerToken(request);

  if (!supabaseUrl || !supabaseAnonKey || !token) return null;

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabaseClient.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user.email || data.user.id || null;
}

async function insertLeadStatusHistory(
  supabaseClient: Awaited<ReturnType<typeof createSupabaseRequestClient>>,
  {
    leadId,
    fromStatus,
    toStatus,
    changedAt,
    changedBy,
  }: {
    leadId: string;
    fromStatus: LeadStatus | null;
    toStatus: LeadStatus;
    changedAt?: string | null;
    changedBy?: string | null;
  }
) {
  if (!supabaseClient) return null;

  const { error } = await supabaseClient.from('lead_status_history').insert({
    lead_id: leadId,
    from_status: fromStatus,
    to_status: toStatus,
    changed_at: changedAt || new Date().toISOString(),
    changed_by: changedBy || null,
  });

  return error;
}

export async function GET(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseClient = await createSupabaseRequestClient(request);
  if (!supabaseClient) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  const trashOnly = request.nextUrl.searchParams.get('trash') === '1';
  const thirtyDaysAgoIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let query = supabaseClient
    .from('leads')
    .select('*');

  if (trashOnly) {
    query = query
      .not('deleted_at', 'is', null)
      .gte('deleted_at', thirtyDaysAgoIso)
      .order('deleted_at', { ascending: false });
  } else {
    query = query
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) return crmErrorResponse(error);
  return NextResponse.json(
    (data || []).map((lead) => ({
      ...lead,
      sqm: roundMeasure(lead.sqm),
      value: roundCurrency(lead.value),
    }))
  );
}

export async function POST(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseClient = await createSupabaseRequestClient(request);
  if (!supabaseClient) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  const body = await request.json();
  const changedBy = await resolveActor(request);
  const lead: LeadPayload = {
    id: body.id || `lead_${Date.now()}`,
    name: body.name || '',
    phone: body.phone || '',
    email: body.email || '',
    address: body.address || '',
    neighborhood: body.neighborhood || 'Barra da Tijuca',
    filmType: body.filmType || 'Nano Ceramica',
    sqm: roundMeasure(body.sqm),
    value: roundCurrency(body.value),
    status: normalizeLeadStatus(body.status),
    notes: body.notes || '',
    createdAt: body.createdAt || new Date().toISOString().split('T')[0],
    statusChangedAt: body.statusChangedAt || body.createdAt || new Date().toISOString().split('T')[0],
    proximoContato: body.proximoContato || null,
    dataServico: body.dataServico || null,
    serviceStatus: normalizeServiceStatus(body.serviceStatus) || (body.dataServico ? 'Marcado' : null),
    dormant: body.dormant === true,
    updatedAt: body.updatedAt || new Date().toISOString(),
    deletedAt: body.deletedAt || null,
  };

  if (!lead.name) {
    return NextResponse.json({ error: 'Nome e obrigatorio' }, { status: 400 });
  }

  const row = {
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    address: lead.address,
    neighborhood: lead.neighborhood,
    film_type: lead.filmType,
    sqm: lead.sqm,
    value: lead.value,
    status: lead.status,
    status_changed_at: lead.statusChangedAt,
    notes: lead.notes,
    proximo_contato: lead.proximoContato,
    data_servico: lead.dataServico,
    service_status: lead.serviceStatus,
    dormant: lead.dormant,
    updated_at: lead.updatedAt,
    created_at: lead.createdAt,
    deleted_at: lead.deletedAt,
  };

  const { error } = await supabaseClient.from('leads').insert(row);

  if (isMissingOptionalLeadColumnError(error?.message)) {
    const fallbackRow = withoutOptionalLeadColumns(row);
    const retry = await supabaseClient.from('leads').insert(fallbackRow);
    if (retry.error) return crmErrorResponse(retry.error);
  } else if (error) {
    return crmErrorResponse(error);
  }

  const historyError = await insertLeadStatusHistory(supabaseClient, {
    leadId: lead.id!,
    fromStatus: null,
    toStatus: lead.status,
    changedAt: lead.updatedAt,
    changedBy,
  });

  if (historyError) {
    return crmErrorResponse(historyError);
  }

  return NextResponse.json(lead, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseClient = await createSupabaseRequestClient(request);
  if (!supabaseClient) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  const body = await request.json();
  const changedBy = await resolveActor(request);
  const lead: LeadPayload = {
    id: body.id || `lead_${Date.now()}`,
    name: body.name || '',
    phone: body.phone || '',
    email: body.email || '',
    address: body.address || '',
    neighborhood: body.neighborhood || 'Barra da Tijuca',
    filmType: body.filmType || 'Nano Ceramica',
    sqm: roundMeasure(body.sqm),
    value: roundCurrency(body.value),
    status: normalizeLeadStatus(body.status),
    notes: body.notes || '',
    createdAt: body.createdAt || new Date().toISOString().split('T')[0],
    statusChangedAt: body.statusChangedAt || body.createdAt || new Date().toISOString().split('T')[0],
    proximoContato: body.proximoContato || null,
    dataServico: body.dataServico || null,
    serviceStatus: normalizeServiceStatus(body.serviceStatus) || (body.dataServico ? 'Marcado' : null),
    dormant: body.dormant === true,
    updatedAt: body.updatedAt || new Date().toISOString(),
    deletedAt: body.deletedAt || null,
  };

  if (!lead.name) {
    return NextResponse.json({ error: 'Nome e obrigatorio' }, { status: 400 });
  }

  const { data: existingLead, error: existingLeadError } = await supabaseClient
    .from('leads')
    .select('status')
    .eq('id', lead.id)
    .maybeSingle();

  if (existingLeadError) {
    return crmErrorResponse(existingLeadError);
  }

  const previousStatus = normalizeLeadStatus(existingLead?.status);

  const row = {
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    address: lead.address,
    neighborhood: lead.neighborhood,
    film_type: lead.filmType,
    sqm: lead.sqm,
    value: lead.value,
    status: lead.status,
    created_at: lead.createdAt,
    status_changed_at: lead.statusChangedAt,
    notes: lead.notes,
    proximo_contato: lead.proximoContato,
    data_servico: lead.dataServico,
    service_status: lead.serviceStatus,
    dormant: lead.dormant,
    updated_at: lead.updatedAt,
    deleted_at: lead.deletedAt,
  };

  const { error } = await supabaseClient.from('leads').upsert(row, { onConflict: 'id' });

  if (isMissingOptionalLeadColumnError(error?.message)) {
    const fallbackRow = withoutOptionalLeadColumns(row);
    const retry = await supabaseClient.from('leads').upsert(fallbackRow, { onConflict: 'id' });
    if (retry.error) return crmErrorResponse(retry.error);
  } else if (error) {
    return crmErrorResponse(error);
  }

  if (!existingLead || previousStatus !== lead.status) {
    const historyError = await insertLeadStatusHistory(supabaseClient, {
      leadId: lead.id!,
      fromStatus: existingLead ? previousStatus : null,
      toStatus: lead.status,
      changedAt: lead.updatedAt,
      changedBy,
    });

    if (historyError) {
      return crmErrorResponse(historyError);
    }
  }

  return NextResponse.json(lead);
}

export async function DELETE(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseClient = await createSupabaseRequestClient(request);
  if (!supabaseClient) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID do lead e obrigatorio' }, { status: 400 });
  }

  const deletedAt = new Date().toISOString();
  const { data, error } = await supabaseClient
    .from('leads')
    .update({ deleted_at: deletedAt, updated_at: deletedAt })
    .eq('id', id)
    .is('deleted_at', null)
    .select('*')
    .single();

  if (error) return crmErrorResponse(error);

  return NextResponse.json({
    success: true,
    lead: data
      ? {
          ...data,
          sqm: roundMeasure(data.sqm),
          value: roundCurrency(data.value),
        }
      : null,
  });
}

export async function PATCH(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseClient = await createSupabaseRequestClient(request);
  if (!supabaseClient) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  const body = await request.json();
  const id = typeof body?.id === 'string' ? body.id : '';
  const action = typeof body?.action === 'string' ? body.action : '';

  if (!id || !['restore', 'dormant', 'activate'].includes(action)) {
    return NextResponse.json({ error: 'Acao invalida para leads' }, { status: 400 });
  }

  if (action === 'dormant' || action === 'activate') {
    const updatedAt = new Date().toISOString();
    const { data, error } = await supabaseClient
      .from('leads')
      .update({ dormant: action === 'dormant', updated_at: updatedAt })
      .eq('id', id)
      .is('deleted_at', null)
      .select('*')
      .single();

    if (isMissingOptionalLeadColumnError(error?.message)) {
      return NextResponse.json(
        { error: 'A coluna de lead dormente ainda nao existe no Supabase.', hint: 'Rode o SQL helper de dormencia para habilitar esta funcao.' },
        { status: 409 },
      );
    }

    if (error) return crmErrorResponse(error);

    return NextResponse.json({
      success: true,
      lead: data
        ? {
            ...data,
            sqm: roundMeasure(data.sqm),
            value: roundCurrency(data.value),
          }
        : null,
    });
  }

  const thirtyDaysAgoIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const restoredAt = new Date().toISOString();

  const { data, error } = await supabaseClient
    .from('leads')
    .update({ deleted_at: null, updated_at: restoredAt })
    .eq('id', id)
    .gte('deleted_at', thirtyDaysAgoIso)
    .select('*')
    .single();

  if (error) return crmErrorResponse(error);

  return NextResponse.json({
    success: true,
    lead: data
      ? {
          ...data,
          sqm: roundMeasure(data.sqm),
          value: roundCurrency(data.value),
        }
      : null,
  });
}
