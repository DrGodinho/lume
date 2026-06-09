import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface LeadPayload {
  name: string;
  phone: string;
  email: string;
  address: string;
  neighborhood: string;
  filmType: string;
  sqm: number;
  value: number;
  status: 'Novo' | 'Em Contato' | 'Proposta Enviada' | 'Fechado' | 'Perdido';
  notes: string;
  proximoContato?: string | null;
  updatedAt?: string;
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
  }

  const body = await request.json();
  const lead: LeadPayload = {
    name: body.name || '',
    phone: body.phone || '',
    email: body.email || '',
    address: body.address || '',
    neighborhood: body.neighborhood || 'Barra da Tijuca',
    filmType: body.filmType || 'Nano Cerâmica',
    sqm: body.sqm || 0,
    value: body.value || 0,
    status: body.status || 'Novo',
    notes: body.notes || '',
    proximoContato: body.proximoContato || null,
    updatedAt: body.updatedAt || new Date().toISOString(),
  };

  if (!lead.name) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
  }

  const id = `lead_${Date.now()}`;
  const createdAt = new Date().toISOString().split('T')[0];

  const { error } = await supabase.from('leads').insert({
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
    updated_at: lead.updatedAt,
    created_at: createdAt,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id, ...lead, createdAt }, { status: 201 });
}
