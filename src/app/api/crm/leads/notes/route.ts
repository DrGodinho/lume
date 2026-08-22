import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAccessToken } from '@/lib/crm-auth';
import type { LeadNote } from '@/app/crm/types';

function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function ensureAuthorized(request: NextRequest) {
  const crmToken = request.cookies.get('crm-token')?.value;
  if (crmToken && (await verifyAccessToken(crmToken))) return null;

  const auth = request.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice('Bearer '.length).trim() : null;
  if (token) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && anonKey) {
      const client = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
      const { error } = await client.auth.getUser(token);
      if (!error) return null;
    }
  }

  return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
}

const isMissingTableError = (error?: { code?: string; message?: string } | null) =>
  error?.code === '42P01' || Boolean(error?.message?.includes('lead_notes'));

const mapRowToLeadNote = (row: {
  id: number;
  lead_id: string;
  body: string;
  created_at: string;
  created_by: string | null;
}): LeadNote => ({
  id: row.id,
  leadId: row.lead_id,
  body: row.body,
  createdAt: row.created_at,
  createdBy: row.created_by ?? null,
});

export async function GET(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabase = createSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });

  const leadId = request.nextUrl.searchParams.get('leadId');
  if (!leadId) return NextResponse.json({ error: 'leadId e obrigatorio' }, { status: 400 });

  const { data, error } = await supabase
    .from('lead_notes')
    .select('id, lead_id, body, created_at, created_by')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (isMissingTableError(error)) return NextResponse.json({ notes: [] });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ notes: (data || []).map(mapRowToLeadNote) });
}

export async function POST(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabase = createSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const leadId = typeof body?.leadId === 'string' ? body.leadId : '';
  const noteBody = typeof body?.body === 'string' ? body.body.trim() : '';
  if (!leadId || !noteBody) {
    return NextResponse.json({ error: 'leadId e body sao obrigatorios' }, { status: 400 });
  }

  const crmToken = request.cookies.get('crm-token')?.value;
  const payload = crmToken ? await verifyAccessToken(crmToken) : null;
  const createdBy = payload?.email ?? null;

  const { data, error } = await supabase
    .from('lead_notes')
    .insert({ lead_id: leadId, body: noteBody, created_by: createdBy })
    .select('id, lead_id, body, created_at, created_by')
    .single();

  if (isMissingTableError(error)) {
    return NextResponse.json(
      { error: 'A tabela lead_notes ainda nao existe no Supabase.', hint: 'Rode o SQL de migracao supabase/crm_lead_notes.sql.' },
      { status: 409 },
    );
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ note: mapRowToLeadNote(data) }, { status: 201 });
}
