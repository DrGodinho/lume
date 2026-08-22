import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAccessToken } from '@/lib/crm-auth';
import { roundCurrency, roundMeasure } from '@/lib/numberPrecision';
import { createDefaultPlaybookRules, getPlaybookFollowUpDate, normalizeSellerId, sanitizePlaybookRules } from '@/app/crm/utils/playbooks';
import { leadPayloadSchema } from '@/app/crm/schemas/leadSchema';
import { CRM_ARCHIVE_AFTER_DAYS_CONFIG_KEY, DEFAULT_CRM_ARCHIVE_AFTER_DAYS, MAX_CRM_ARCHIVE_AFTER_DAYS, MIN_CRM_ARCHIVE_AFTER_DAYS } from '@/app/crm/constants/targets';
import type { FollowUpPlaybookRule } from '@/app/crm/types';

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
  'pinned',
  'archived',
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
  pinned?: boolean;
  archived?: boolean;
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

const validateLeadPayload = (lead: LeadPayload) => {
  const validation = leadPayloadSchema.safeParse(lead);
  if (validation.success) return null;
  return NextResponse.json(
    {
      error: 'Dados invalidos',
      issues: validation.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    },
    { status: 400 },
  );
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
    const payload = await verifyAccessToken(crmToken);
    if (payload) return null;
  }

  if (await hasValidSupabaseSession(request)) return null;

  return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
}

async function resolveActor(request: NextRequest) {
  const crmToken = request.cookies.get('crm-token')?.value;
  if (crmToken) {
    const payload = await verifyAccessToken(crmToken);
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

async function upsertMonthlySnapshot(
  supabaseClient: Awaited<ReturnType<typeof createSupabaseRequestClient>>,
  lead: { status: LeadStatus; value: number; statusChangedAt?: string; createdAt?: string },
) {
  if (!supabaseClient || lead.status !== 'Fechado') return;

  const dateStr = lead.statusChangedAt || lead.createdAt || new Date().toISOString().split('T')[0];
  const month = dateStr.slice(0, 7); // 'yyyy-MM'

  // Recalculate the full month total from all Fechado leads (active + trashed)
  const { data, error } = await supabaseClient
    .from('leads')
    .select('value')
    .eq('status', 'Fechado')
    .gte('status_changed_at', `${month}-01`)
    .lt('status_changed_at', month === new Date().toISOString().slice(0, 7)
      ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0]
      : `${month.slice(0, 4)}-${String(Number(month.slice(5, 7)) + 1).padStart(2, '0')}-01`);

  if (error) return; // Silently fail — snapshot is best-effort

  const revenue = (data || []).reduce((sum, row) => sum + (Number(row.value) || 0), 0);
  const lead_count = (data || []).length;

  await Promise.resolve(
    supabaseClient
      .from('crm_monthly_snapshots')
      .upsert({ month, revenue, lead_count, updated_at: new Date().toISOString() }, { onConflict: 'month' })
  ).catch(() => {}); // best-effort
}

const isMissingPlaybookTableError = (error?: SupabaseError | null) =>
  error?.code === '42P01' || !!error?.message?.includes('crm_playbooks');

async function loadSellerPlaybookRules(
  supabaseClient: Awaited<ReturnType<typeof createSupabaseRequestClient>>,
  sellerId: string | null,
) {
  if (!supabaseClient) return createDefaultPlaybookRules();

  const normalizedSellerId = normalizeSellerId(sellerId || 'equipe-lume');
  const { data, error } = await supabaseClient
    .from('crm_playbooks')
    .select('rules')
    .eq('seller_id', normalizedSellerId)
    .maybeSingle();

  if (isMissingPlaybookTableError(error)) return createDefaultPlaybookRules();
  if (error) return createDefaultPlaybookRules();
  if (!Array.isArray(data?.rules)) return createDefaultPlaybookRules();

  return sanitizePlaybookRules(data.rules as FollowUpPlaybookRule[]);
}

async function loadArchiveAfterDays(
  supabaseClient: Awaited<ReturnType<typeof createSupabaseRequestClient>>,
): Promise<number> {
  if (!supabaseClient) return DEFAULT_CRM_ARCHIVE_AFTER_DAYS;

  const { data, error } = await supabaseClient
    .from('configuracoes')
    .select('meta_valor')
    .eq('id', CRM_ARCHIVE_AFTER_DAYS_CONFIG_KEY)
    .maybeSingle();

  if (error || !data) return DEFAULT_CRM_ARCHIVE_AFTER_DAYS;

  const stored = Number(data.meta_valor);
  if (!Number.isFinite(stored) || stored < MIN_CRM_ARCHIVE_AFTER_DAYS) {
    return DEFAULT_CRM_ARCHIVE_AFTER_DAYS;
  }
  return Math.min(Math.floor(stored), MAX_CRM_ARCHIVE_AFTER_DAYS);
}

const applyServerPlaybookToLead = async (
  supabaseClient: Awaited<ReturnType<typeof createSupabaseRequestClient>>,
  lead: LeadPayload,
  sellerId: string | null,
  options: { overwriteExisting?: boolean } = {},
) => {
  const rules = await loadSellerPlaybookRules(supabaseClient, sellerId);
  return {
    ...lead,
    proximoContato: getPlaybookFollowUpDate(
      lead.status,
      lead.proximoContato,
      rules,
      { overwriteExisting: options.overwriteExisting },
    ),
  };
};

export async function GET(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseClient = await createSupabaseRequestClient(request);
  if (!supabaseClient) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  const trashOnly = request.nextUrl.searchParams.get('trash') === '1';
  const archiveOnly = request.nextUrl.searchParams.get('archive') === '1';
  const includeAll = request.nextUrl.searchParams.get('include_all') === '1';
  const thirtyDaysAgoIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let query = supabaseClient
    .from('leads')
    .select('*');

  if (trashOnly) {
    query = query
      .not('deleted_at', 'is', null)
      .gte('deleted_at', thirtyDaysAgoIso)
      .order('deleted_at', { ascending: false });
  } else if (archiveOnly) {
    query = query
      .is('deleted_at', null)
      .eq('archived', true)
      .order('status_changed_at', { ascending: false });
  } else if (includeAll) {
    // Include all non-trashed leads (both archived and non-archived)
    query = query
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
  } else {
    // Default: show active leads and recently archived leads (within 5 years)
    const archiveAfterDays = await loadArchiveAfterDays(supabaseClient);
    const archiveCutoffIso = new Date(Date.now() - archiveAfterDays * 24 * 60 * 60 * 1000).toISOString();
    const nowIso = new Date().toISOString();

    // Auto-archive old 'Fechado' leads before fetching active list
    await Promise.resolve(
      supabaseClient
        .from('leads')
        .update({
          archived: true,
          updated_at: nowIso
        })
        .is('deleted_at', null)
        .eq('archived', false)
        .eq('status', 'Fechado')
        .lt('status_changed_at', archiveCutoffIso)
    ).catch(() => {}); // Ignore errors if columns are missing

    const fiveYearsAgoDate = new Date();
    fiveYearsAgoDate.setFullYear(fiveYearsAgoDate.getFullYear() - 5);
    const fiveYearsAgoIso = fiveYearsAgoDate.toISOString().split('T')[0];

    query = query
      .is('deleted_at', null)
      .or(`archived.eq.false,and(archived.eq.true,data_servico.lte.${fiveYearsAgoIso})`)
      .order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    // The default branch filters by the optional `archived`/`data_servico` columns.
    // If those columns do not exist yet in the schema, retry without them so the
    // leads still load (same resilience the write handlers already have).
    if (!trashOnly && !archiveOnly && !includeAll && isMissingOptionalLeadColumnError(error.message)) {
      const { data: fallbackData, error: fallbackError } = await supabaseClient
        .from('leads')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (fallbackError) return crmErrorResponse(fallbackError);

      return NextResponse.json(
        (fallbackData || []).map((lead) => ({
          ...lead,
          sqm: roundMeasure(lead.sqm),
          value: roundCurrency(lead.value),
        }))
      );
    }

    return crmErrorResponse(error);
  }

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
  let lead: LeadPayload = {
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
    pinned: body.pinned === true,
    archived: body.archived === true,
    updatedAt: body.updatedAt || new Date().toISOString(),
    deletedAt: body.deletedAt || null,
  };

  const validationError = validateLeadPayload(lead);
  if (validationError) return validationError;

  lead = await applyServerPlaybookToLead(supabaseClient, lead, changedBy);

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
    pinned: lead.pinned,
    archived: lead.archived,
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

  await upsertMonthlySnapshot(supabaseClient, lead);

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
  let lead: LeadPayload = {
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
    pinned: body.pinned === true,
    archived: body.archived === true,
    updatedAt: body.updatedAt || new Date().toISOString(),
    deletedAt: body.deletedAt || null,
  };

  const validationError = validateLeadPayload(lead);
  if (validationError) return validationError;

  const { data: existingLead, error: existingLeadError } = await supabaseClient
    .from('leads')
    .select('status')
    .eq('id', lead.id)
    .maybeSingle();

  if (existingLeadError) {
    return crmErrorResponse(existingLeadError);
  }

  const previousStatus = normalizeLeadStatus(existingLead?.status);

  if (!existingLead || previousStatus !== lead.status) {
    lead = await applyServerPlaybookToLead(supabaseClient, lead, changedBy);
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
    dormant: lead.dormant,
    pinned: lead.pinned,
    archived: lead.archived,
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

  // Always sync snapshot (handles value edits on Fechado leads too)
  await upsertMonthlySnapshot(supabaseClient, lead);

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

const LEAD_STATUS_INFO_PATCH_FIELDS = new Set([
  'status',
  'status_changed_at',
  'notes',
  'proximo_contato',
  'data_servico',
  'service_status',
  'dormant',
  'pinned',
  'archived',
  'updated_at',
]);

const buildStatusInfoUpdate = (body: Record<string, unknown>) => {
  const update: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (LEAD_STATUS_INFO_PATCH_FIELDS.has(key)) update[key] = value;
  }
  if ('statusChangedAt' in body) update.status_changed_at = body.statusChangedAt;
  if ('proximoContato' in body) update.proximo_contato = body.proximoContato;
  if ('dataServico' in body) update.data_servico = body.dataServico;
  if ('serviceStatus' in body) update.service_status = body.serviceStatus;
  if ('updatedAt' in body) update.updated_at = body.updatedAt;
  if ('archived' in body) update.archived = body.archived;
  return update;
};

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

  if (!id) {
    return NextResponse.json({ error: 'ID do lead e obrigatorio' }, { status: 400 });
  }

  if (action && ['restore', 'dormant', 'activate'].includes(action)) {
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

  const statusInfoPatch = buildStatusInfoUpdate(body);
  if (Object.keys(statusInfoPatch).length === 0) {
    return NextResponse.json({ error: 'PATCH precisa de uma acao ou ao menos um campo de status.' }, { status: 400 });
  }

  const { data: existingLead, error: existingLeadError } = await supabaseClient
    .from('leads')
    .select('status,proximo_contato')
    .eq('id', id)
    .maybeSingle();

  if (existingLeadError) {
    return crmErrorResponse(existingLeadError);
  }

  const previousStatus = normalizeLeadStatus(existingLead?.status);
  const nextStatus = 'status' in statusInfoPatch
    ? normalizeLeadStatus(statusInfoPatch.status)
    : previousStatus;

  if ('status' in statusInfoPatch) {
    statusInfoPatch.status = nextStatus;
  }

  if (existingLead && nextStatus !== previousStatus && !('proximo_contato' in statusInfoPatch)) {
    const changedBy = await resolveActor(request);
    const rules = await loadSellerPlaybookRules(supabaseClient, changedBy);
    statusInfoPatch.proximo_contato = getPlaybookFollowUpDate(
      nextStatus,
      existingLead.proximo_contato as string | null | undefined,
      rules,
      { overwriteExisting: true },
    );
  }

  statusInfoPatch.updated_at = statusInfoPatch.updated_at || new Date().toISOString();

  const { data, error } = await supabaseClient
    .from('leads')
    .update(statusInfoPatch)
    .eq('id', id)
    .select('*')
    .single();

  if (isMissingOptionalLeadColumnError(error?.message)) {
    const { pinned: _ignoredPinned, ...withoutPinned } = statusInfoPatch;
    void _ignoredPinned;
    const retry = await supabaseClient
      .from('leads')
      .update(withoutPinned)
      .eq('id', id)
      .select('*')
      .single();
    if (retry.error) return crmErrorResponse(retry.error);

    if (nextStatus === 'Fechado' && retry.data) {
      await upsertMonthlySnapshot(supabaseClient, {
        status: 'Fechado',
        value: roundCurrency(retry.data.value),
        statusChangedAt: typeof retry.data.status_changed_at === 'string' ? retry.data.status_changed_at : undefined,
        createdAt: typeof retry.data.created_at === 'string' ? retry.data.created_at : undefined,
      });
    }

    return NextResponse.json({
      success: true,
      partial: true,
      lead: retry.data
        ? { ...retry.data, sqm: roundMeasure(retry.data.sqm), value: roundCurrency(retry.data.value) }
        : null,
    });
  }

  if (error) return crmErrorResponse(error);

  if (nextStatus === 'Fechado' && data) {
    await upsertMonthlySnapshot(supabaseClient, {
      status: 'Fechado',
      value: roundCurrency(data.value),
      statusChangedAt: typeof data.status_changed_at === 'string' ? data.status_changed_at : undefined,
      createdAt: typeof data.created_at === 'string' ? data.created_at : undefined,
    });
  }

  return NextResponse.json({
    success: true,
    partial: true,
    lead: data
      ? { ...data, sqm: roundMeasure(data.sqm), value: roundCurrency(data.value) }
      : null,
  });
}
