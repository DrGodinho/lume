import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/crm-auth';
import { roundCurrency, roundMeasure } from '@/lib/numberPrecision';

type LeadStatus = 'Novo' | 'Em Contato' | 'Agendado' | 'Fechado' | 'Perdido';

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
  updatedAt?: string;
}

const normalizeLeadStatus = (status: unknown): LeadStatus => {
  if (status === 'Proposta Enviada') return 'Agendado';
  if (status === 'Novo' || status === 'Em Contato' || status === 'Agendado' || status === 'Fechado' || status === 'Perdido') {
    return status;
  }
  return 'Novo';
};

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
  if (!crmToken) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  const payload = await verifyToken(crmToken);
  if (!payload) {
    return NextResponse.json({ error: 'Sessao expirada ou invalida' }, { status: 401 });
  }

  return null;
}

export async function GET(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin nao configurado' }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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

  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin nao configurado' }, { status: 500 });
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
    updated_at: lead.updatedAt,
    created_at: createdAt,
  };

  const { error } = await supabaseAdmin.from('leads').insert(row);

  if (error?.message.includes("'data_servico' column")) {
    const fallbackRow = Object.fromEntries(
      Object.entries(row).filter(([key]) => key !== 'data_servico')
    );
    const retry = await supabaseAdmin.from('leads').insert(fallbackRow);
    if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500 });
  } else if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id, ...lead, createdAt }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin nao configurado' }, { status: 500 });
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
    updated_at: lead.updatedAt,
  };

  const { error } = await supabaseAdmin.from('leads').upsert(row, { onConflict: 'id' });

  if (error?.message.includes("'status_changed_at' column") || error?.message.includes("'data_servico' column")) {
    const fallbackRow = Object.fromEntries(
      Object.entries(row).filter(([key]) => key !== 'status_changed_at' && key !== 'data_servico')
    );
    const retry = await supabaseAdmin.from('leads').upsert(fallbackRow, { onConflict: 'id' });
    if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500 });
  } else if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(lead);
}

export async function DELETE(request: NextRequest) {
  const authError = await ensureAuthorized(request);
  if (authError) return authError;

  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin nao configurado' }, { status: 500 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID do lead e obrigatorio' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('leads').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
