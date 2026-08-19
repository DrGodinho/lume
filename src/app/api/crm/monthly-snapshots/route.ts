import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdmin, getCalculatorOwnerKeyFromRequest } from '@/lib/serverAuth';

export async function GET(request: NextRequest) {
  const ownerKey = await getCalculatorOwnerKeyFromRequest(request);
  if (!ownerKey) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  const supabaseAdmin = createSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Sessao Supabase nao restaurada' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('crm_monthly_snapshots')
    .select('month, revenue, lead_count')
    .order('month', { ascending: false })
    .limit(24);

  if (error || !data) {
    return NextResponse.json({ snapshots: [] });
  }

  return NextResponse.json({ snapshots: data });
}
