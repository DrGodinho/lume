import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/crm-auth';
import { createDefaultSellerPlaybook, normalizeSellerId, sanitizePlaybookRules } from '@/app/crm/utils/playbooks';
import type { FollowUpPlaybookRule, SellerPlaybook } from '@/app/crm/types';

type SupabaseError = {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
};

type PlaybookRow = {
  seller_id: string;
  rules: unknown;
  updated_at?: string | null;
  updated_by?: string | null;
};

const PLAYBOOK_TABLE_HINT = 'Rode o SQL helper supabase/crm_playbooks.sql para habilitar playbooks compartilhados.';

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

const crmErrorResponse = (error: SupabaseError, status = 500) =>
  NextResponse.json(
    {
      error: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    },
    { status },
  );

const isMissingPlaybookTableError = (error?: SupabaseError | null) =>
  error?.code === '42P01' || !!error?.message?.includes('crm_playbooks');

const mapPlaybookRow = (row: PlaybookRow): SellerPlaybook => ({
  sellerId: normalizeSellerId(row.seller_id),
  rules: sanitizePlaybookRules(Array.isArray(row.rules) ? row.rules as FollowUpPlaybookRule[] : []),
});

const buildPlaybookResponse = (rows: PlaybookRow[], requestedSellerId: string) => {
  const sellers = rows.map(mapPlaybookRow);
  const activePlaybook = sellers.find((playbook) => playbook.sellerId === requestedSellerId)
    || createDefaultSellerPlaybook(requestedSellerId);
  const sellerIds = Array.from(new Set([activePlaybook.sellerId, ...sellers.map((playbook) => playbook.sellerId)])).sort();

  return {
    activeSellerId: activePlaybook.sellerId,
    activePlaybook,
    sellerIds,
  };
};

export async function GET(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseClient = createSupabaseAdmin();
  if (!supabaseClient) {
    return NextResponse.json({ error: 'Supabase admin nao configurado para playbooks.' }, { status: 500 });
  }

  const sellerId = normalizeSellerId(request.nextUrl.searchParams.get('sellerId') || 'equipe-lume');
  const { data, error } = await supabaseClient
    .from('crm_playbooks')
    .select('seller_id,rules,updated_at,updated_by')
    .order('seller_id', { ascending: true });

  if (isMissingPlaybookTableError(error)) {
    return NextResponse.json({ error: 'Tabela crm_playbooks ainda nao existe.', hint: PLAYBOOK_TABLE_HINT }, { status: 409 });
  }

  if (error) return crmErrorResponse(error);
  return NextResponse.json(buildPlaybookResponse((data || []) as PlaybookRow[], sellerId));
}

export async function PUT(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseClient = createSupabaseAdmin();
  if (!supabaseClient) {
    return NextResponse.json({ error: 'Supabase admin nao configurado para playbooks.' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const sellerId = normalizeSellerId(typeof body?.sellerId === 'string' ? body.sellerId : 'equipe-lume');
  const rules = sanitizePlaybookRules(Array.isArray(body?.rules) ? body.rules as FollowUpPlaybookRule[] : []);
  const updatedAt = new Date().toISOString();
  const updatedBy = await resolveActor(request);

  const { error: upsertError } = await supabaseClient
    .from('crm_playbooks')
    .upsert({
      seller_id: sellerId,
      rules,
      updated_at: updatedAt,
      updated_by: updatedBy,
    }, { onConflict: 'seller_id' });

  if (isMissingPlaybookTableError(upsertError)) {
    return NextResponse.json({ error: 'Tabela crm_playbooks ainda nao existe.', hint: PLAYBOOK_TABLE_HINT }, { status: 409 });
  }

  if (upsertError) return crmErrorResponse(upsertError);

  const { data, error } = await supabaseClient
    .from('crm_playbooks')
    .select('seller_id,rules,updated_at,updated_by')
    .order('seller_id', { ascending: true });

  if (error) return crmErrorResponse(error);
  return NextResponse.json(buildPlaybookResponse((data || []) as PlaybookRow[], sellerId));
}
