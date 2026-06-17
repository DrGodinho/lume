import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/crm-auth';
import { roundCurrency, roundMeasure } from '@/lib/numberPrecision';

type LeadStatus = 'Novo' | 'Em Contato' | 'Agendado' | 'Fechado' | 'Perdido';
type ServiceStatus = 'Marcado' | 'Confirmado' | 'Em Execucao' | 'Concluido' | 'Reagendar';
type LeadRow = Record<string, string | number | null | undefined>;
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
  updatedAt?: string;
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

export async function GET(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseClient = await createSupabaseRequestClient(request);
  if (!supabaseClient) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  const { data, error } = await supabaseClient
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

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
  const lead: LeadPayload = {
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
    proximoContato: body.proximoContato || null,
    dataServico: body.dataServico || null,
    serviceStatus: normalizeServiceStatus(body.serviceStatus) || (body.dataServico ? 'Marcado' : null),
    updatedAt: body.updatedAt || new Date().toISOString(),
  };

  if (!lead.name) {
    return NextResponse.json({ error: 'Nome e obrigatorio' }, { status: 400 });
  }

  const id = `lead_${Date.now()}`;
  const createdAt = new Date().toISOString().split('T')[0];

  const row = {
    id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    address: lead.address,
    neighborhood: lead.neighborhood,
    film_type: lead.filmType,
    sqm: lead.sqm,
    value: lead.value,
    status: lead.status,
    notes: lead.notes,
    proximo_contato: lead.proximoContato,
    data_servico: lead.dataServico,
    service_status: lead.serviceStatus,
    updated_at: lead.updatedAt,
    created_at: createdAt,
  };

  const { error } = await supabaseClient.from('leads').insert(row);

  if (isMissingOptionalLeadColumnError(error?.message)) {
    const fallbackRow = withoutOptionalLeadColumns(row);
    const retry = await supabaseClient.from('leads').insert(fallbackRow);
    if (retry.error) return crmErrorResponse(retry.error);
  } else if (error) {
    return crmErrorResponse(error);
  }

  return NextResponse.json({ id, ...lead, createdAt }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseClient = await createSupabaseRequestClient(request);
  if (!supabaseClient) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  const body = await request.json();
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
    updatedAt: body.updatedAt || new Date().toISOString(),
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
    created_at: lead.createdAt,
    status_changed_at: lead.statusChangedAt,
    notes: lead.notes,
    proximo_contato: lead.proximoContato,
    data_servico: lead.dataServico,
    service_status: lead.serviceStatus,
    updated_at: lead.updatedAt,
  };

  const { error } = await supabaseClient.from('leads').upsert(row, { onConflict: 'id' });

  if (isMissingOptionalLeadColumnError(error?.message)) {
    const fallbackRow = withoutOptionalLeadColumns(row);
    const retry = await supabaseClient.from('leads').upsert(fallbackRow, { onConflict: 'id' });
    if (retry.error) return crmErrorResponse(retry.error);
  } else if (error) {
    return crmErrorResponse(error);
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

  const { error } = await supabaseClient.from('leads').delete().eq('id', id);
  if (error) return crmErrorResponse(error);

  return NextResponse.json({ success: true });
}
