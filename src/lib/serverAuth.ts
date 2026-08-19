import { createClient } from '@supabase/supabase-js';
import { verifyAccessToken } from './crm-auth';
import { normalizeCalculatorScopeKey } from './calculatorScope';
import type { NextRequest } from 'next/server';

export function createSupabaseAdmin() {
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

/**
 * Verifica o crm-token do cookie e deriva o owner_key do calculador a partir do
 * e-mail autenticado. Mantem a mesma regra da autenticacao anterior (parte
 * local do e-mail, ex.: "jrquintans@lume.local" -> "jrquintans"). Retorna null
 * quando nao autenticado.
 */
export async function getCalculatorOwnerKeyFromRequest(request: NextRequest): Promise<string | null> {
  const crmToken = request.cookies.get('crm-token')?.value;
  if (!crmToken) return null;

  const payload = await verifyAccessToken(crmToken);
  if (!payload?.email) return null;

  const localPart = String(payload.email).includes('@')
    ? String(payload.email).split('@')[0]
    : String(payload.email);

  return normalizeCalculatorScopeKey(localPart);
}
