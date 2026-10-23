import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createSupabaseAdmin } from '@/lib/serverAuth';

const publicLeadSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres.'),
  phone: z.string().trim().min(8, 'Telefone inválido.'),
  neighborhood: z.string().trim().optional().default('Rio de Janeiro'),
  filmType: z.string().trim().min(1, 'Tipo de película não informado.'),
  sqm: z.number().optional().default(10),
  value: z.number().optional().default(0),
  location: z.string().optional().default(''),
  condoRule: z.string().optional().default(''),
  priorities: z.array(z.string()).optional().default([]),
  notes: z.string().optional().default(''),
  honeypot: z.string().optional().default(''),
});

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

const isMissingOptionalColumnError = (message?: string) =>
  !!message && [...OPTIONAL_LEAD_COLUMNS].some((column) => message.includes(`'${column}' column`));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parseResult = publicLeadSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          issues: parseResult.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        },
        { status: 400 },
      );
    }

    const data = parseResult.data;

    // Honeypot anti-spam check
    if (data.honeypot && data.honeypot.trim().length > 0) {
      // Silently return success to mislead spambots
      return NextResponse.json({ success: true, leadId: 'lead_bot_trap' });
    }

    const supabaseAdmin = createSupabaseAdmin();
    if (!supabaseAdmin) {
      // Graceful fallback if database credentials are not available in current environment
      return NextResponse.json(
        { success: true, leadId: `lead_local_${Date.now()}`, warning: 'Supabase admin client unavailable' },
        { status: 200 },
      );
    }

    const nowIso = new Date().toISOString();
    const dateOnly = nowIso.split('T')[0];
    const leadId = `lead_sim_${Date.now()}`;

    const priorityText = data.priorities.length > 0 ? data.priorities.join(', ') : 'Não informadas';
    const roomText = data.location ? data.location : 'Geral';
    const condoText = data.condoRule ? data.condoRule : 'Livre / Não restrito';

    const fullNotes = [
      `[Origem: Simulador Online LUME]`,
      `Ambiente: ${roomText}`,
      `Regra Condomínio: ${condoText}`,
      `Prioridades: ${priorityText}`,
      data.notes ? `Observações extras: ${data.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const leadRow: Record<string, unknown> = {
      id: leadId,
      name: data.name,
      phone: data.phone,
      email: '',
      address: '',
      neighborhood: data.neighborhood || 'Rio de Janeiro',
      film_type: data.filmType,
      sqm: Math.max(1, data.sqm),
      value: Math.max(0, data.value),
      status: 'Novo',
      status_changed_at: dateOnly,
      notes: fullNotes,
      proximo_contato: null,
      data_servico: null,
      service_status: null,
      dormant: false,
      pinned: false,
      archived: false,
      updated_at: nowIso,
      created_at: dateOnly,
      deleted_at: null,
    };

    const { error } = await supabaseAdmin.from('leads').insert(leadRow);

    if (error) {
      if (isMissingOptionalColumnError(error.message)) {
        // Fallback for minimal schema columns
        const minimalRow = Object.fromEntries(
          Object.entries(leadRow).filter(([key]) => !OPTIONAL_LEAD_COLUMNS.has(key)),
        );
        const retry = await supabaseAdmin.from('leads').insert(minimalRow);
        if (retry.error) {
          return NextResponse.json(
            { success: true, leadId, warning: 'Failed writing lead, proceeding to WhatsApp' },
            { status: 200 },
          );
        }
      } else {
        return NextResponse.json(
          { success: true, leadId, warning: 'Failed writing lead, proceeding to WhatsApp' },
          { status: 200 },
        );
      }
    }

    // Attempt to log status history (best effort)
    try {
      await supabaseAdmin.from('lead_status_history').insert({
        lead_id: leadId,
        from_status: null,
        to_status: 'Novo',
        changed_at: nowIso,
        changed_by: 'Simulador Online',
      });
    } catch {
      // Non-blocking
    }

    return NextResponse.json({ success: true, leadId });
  } catch {
    return NextResponse.json(
      { success: true, leadId: `lead_err_${Date.now()}`, warning: 'Error caught, non-blocking' },
      { status: 200 },
    );
  }
}
