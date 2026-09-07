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
  Agendado: 'bg-purple-500',
  Fechado: 'bg-emerald-500',
  Perdido: 'bg-red-500',
};

export interface LeadStageStyle {
  border: string;
  headerBg: string;
  badge: string;
}

/** Estilo canônico de cada etapa (Kanban, funil e telas futuras consomem daqui). */
export const LEAD_STAGE_STYLES: Record<LeadStatus, LeadStageStyle> = {
  Novo: {
    border: 'border-blue-500/20 hover:border-blue-500/40',
    headerBg: 'bg-blue-500/10 text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300',
  },
  'Em Contato': {
    border: 'border-amber-500/20 hover:border-amber-500/40',
    headerBg: 'bg-amber-500/10 text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300',
  },
  Agendado: {
    border: 'border-purple-500/20 hover:border-purple-500/40',
    headerBg: 'bg-purple-500/10 text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300',
  },
  Fechado: {
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    headerBg: 'bg-emerald-500/10 text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300',
  },
  Perdido: {
    border: 'border-red-500/20 hover:border-red-500/40',
    headerBg: 'bg-red-500/10 text-red-400',
    badge: 'bg-red-500/20 text-red-300',
  },
};
