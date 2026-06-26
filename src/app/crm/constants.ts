import type { LeadStatus, MonthlyEvolutionSeries } from './types';

export const LEAD_STAGES: LeadStatus[] = ['Novo', 'Em Contato', 'Agendado', 'Fechado', 'Perdido'];

export const MONTHLY_EVOLUTION_SERIES: Record<MonthlyEvolutionSeries, boolean> = {
  atualDia: true,
  atual: true,
  anterior: true,
  previsto: true,
};

export const CRM_COLLAPSED_CARDS_STORAGE_KEY = 'lume_crm_collapsed_cards';
export const CRM_UI_PREFERENCES_STORAGE_KEY = 'lume_crm_ui_preferences';
export const CRM_ACTIVE_TAB_STORAGE_KEY = 'lume_crm_active_tab';

export const CRM_FILM_TYPE_LABELS: Record<string, string> = {
  carbono: 'Carbono',
  refletiva: 'Refletiva',
  dupla_camada: 'Dupla Camada',
  nano_ceramica: 'Nano Ceramica',
  jateado: 'Jateado',
};

export const DEFAULT_CRM_FILM_OPTIONS = ['Nano Ceramica', 'Refletiva', 'Carbono', 'Jateado'];

export const RJ_NEIGHBORHOODS = [
  'Barra da Tijuca',
  'Recreio dos Bandeirantes',
  'Jacarepagua',
  'Bangu',
  'Realengo',
  'Campo Grande',
  'Outro',
];
