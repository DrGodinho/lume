import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/crm-auth';

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

export async function GET(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin indisponivel' }, { status: 500 });
  }

  const leadId = request.nextUrl.searchParams.get('leadId');
  if (!leadId) {
    return NextResponse.json({ error: 'leadId e obrigatorio' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('lead_status_history')
    .select('*')
    .eq('lead_id', leadId)
    .order('changed_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
