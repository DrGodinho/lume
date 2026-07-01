export const LEAD_STAGES = ['Novo', 'Em Contato', 'Agendado', 'Fechado', 'Perdido'] as const;

export type LeadStatus = (typeof LEAD_STAGES)[number];

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && (LEAD_STAGES as readonly string[]).includes(value);
}

export const LEAD_STAGE_LABELS: Record<LeadStatus, string> = {
  Novo: 'Novos Leads',
  'Em Contato': 'Em Atendimento',
  Agendado: 'Agendados',
  Fechado: 'Contratos Fechados',
  Perdido: 'Perdidos / Descartados',
};

export const LEAD_STAGE_DOT_COLORS: Record<LeadStatus, string> = {
  Novo: 'bg-blue-500',
  'Em Contato': 'bg-amber-500',
  Agendado: 'bg-sky-500',
  Fechado: 'bg-emerald-500',
  Perdido: 'bg-red-500',
};
