export type CrmTab = 'dashboard' | 'leads' | 'trash' | 'historico' | 'extratos' | 'agenda' | 'settings';

import type { LeadStatus } from './constants/stages';

export { LEAD_STAGES, isLeadStatus } from './constants/stages';
export type { LeadStatus } from './constants/stages';

export type ServiceStatus = 'Marcado' | 'Confirmado' | 'Em Execucao' | 'Concluido' | 'Reagendar';

export type AgendaView = 'hoje' | 'semana' | 'mes' | 'servicos' | 'sem_acao' | 'dormentes';

export type LeadCardKind = 'followup' | 'service' | 'idle' | 'dormant';

export type MonthlyEvolutionSeries = 'atualDia' | 'atual' | 'anterior' | 'anteriorAcumulado' | 'previsto';

export type LeadSyncStatus = 'pending' | 'ok' | 'error';

export type LeadSortKey = '' | 'name' | 'neighborhood' | 'filmType' | 'sqm' | 'value' | 'status' | 'dataServico' | 'serviceStatus';

export type CommercialActionType = 'retorno' | 'servico' | 'fechado' | 'perdido';

export type PlaybookActionType = 'follow_up';

export interface FollowUpPlaybookRule {
  id: string;
  triggerStatus: LeadStatus;
  scheduleOffsetDays: number;
  actionType: PlaybookActionType;
  enabled: boolean;
}

export interface SellerPlaybook {
  sellerId: string;
  rules: FollowUpPlaybookRule[];
}

/**
 * Campos imutáveis do lead — definidos na criação e que identificam o lead comercialmente.
 * Mudanças nessa camada significam que é um lead diferente (use um novo id).
 */
export interface LeadCore {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  neighborhood: string;
  filmType: string;
  sqm: number;
  value: number;
  createdAt: string;
}

/**
 * Estado mutável do lead — status, datas, flags e observações livres.
 * Atualizado continuamente ao longo do ciclo de vida comercial.
 *
 * Observação: `notes` mora aqui temporariamente até a issue #17 movê-lo para
 * a tabela relacional `LeadNote[]` (1:N com lead).
 */
export interface LeadStatusInfo {
  status: LeadStatus;
  statusChangedAt: string;
  notes: string;
  dataServico?: string | null;
  serviceStatus?: ServiceStatus | null;
  proximoContato?: string | null;
  dormant: boolean;
  pinned?: boolean;
  updatedAt?: string;
  deletedAt?: string | null;
}

/**
 * Placeholder para a issue #17 — quando virar relacional, `LeadStatusInfo.notes`
 * deixa de existir e os componentes passam a ler `LeadNote[]` via hook dedicado.
 */
export interface LeadNote {
  id: number;
  leadId: string;
  body: string;
  createdAt: string;
  createdBy: string | null;
}

/**
 * Tipo composto para uso geral (retrocompatibilidade).
 * Para updates parciais prefira `LeadCoreUpdate` ou `LeadStatusInfoUpdate`.
 */
export type Lead = LeadCore & LeadStatusInfo;

/** Subset parcial de LeadCore — usado em updates que tocam só identidade. */
export type LeadCoreUpdate = Partial<LeadCore>;

/** Subset parcial de LeadStatusInfo — usado em updates parciais (pin, dormant, agenda etc). */
export type LeadStatusInfoUpdate = Partial<LeadStatusInfo>;

/** Union genérico quando o caller pode atualizar qualquer subset. */
export type LeadUpdate = LeadCoreUpdate & LeadStatusInfoUpdate;

export type LeadFormValues = Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export interface ServiceStatusMeta {
  label: string;
  badge: string;
  button: string;
}

export interface CrmSyncState {
  status: 'ok' | 'warning' | 'error';
  message: string;
  details?: string;
}

export interface LeadStatusHistoryEntry {
  id: number;
  lead_id: string;
  from_status: string | null;
  to_status: string;
  changed_at: string;
  changed_by: string | null;
}

export interface CommercialActionDraft {
  lead: Lead;
  action: CommercialActionType;
  followUpDate: string;
  serviceDate: string;
  note: string;
}

export interface CalculatorGlass {
  label?: string;
  h?: number;
  w?: number;
  oh?: number;
  ow?: number;
  cor?: string;
}

export interface CalculatorHistoryRow {
  id: string;
  cliente?: string;
  phone?: string;
  selected_film?: string;
  modo_otimizacao?: string;
  valor?: number;
  qtd?: number;
  created_at?: string;
  vidros?: CalculatorGlass[];
  desconto?: number;
  lead_id?: string | null;
}

export interface CreateLeadModalOptions {
  prefill?: LeadFormValues;
  sourceCalculatorHistoryId?: string | null;
}

export interface MonthlyChartPoint {
  dia: string;
  diaAnterior: string;
  atual: number | null;
  anterior: number | null;
  previsto: number | null;
  atualDia: number | null;
  anteriorDia: number | null;
  previstoDia: number;
}

export interface MonthlyTooltipPayload {
  payload?: MonthlyChartPoint;
}

export interface MonthlyEvolutionData {
  chartData: MonthlyChartPoint[];
  currentTotal: number;
  previousTotal: number;
  currentCount: number;
  previousCount: number;
  bestDay: {
    label: string;
    value: number;
  };
  futureTotal: number;
  futureCount: number;
}

export interface DashboardStats {
  total: number;
  activeLeads: number;
  activeProposals: number;
  closed: number;
  revenue: number;
  conversionRate: number;
  responseRate: number;
  servicesToday: number;
  futureServices: number;
  overdueFollowUps: number;
  dueFollowUpsToday: number;
  noNextAction: number;
  staleNoAgenda: number;
  servicePipelineValue: number;
  serviceStatusCounts: Record<ServiceStatus, number>;
  priorityRoute: string;
  weeklyCapacity: Array<{
    label: string;
    day: string;
    count: number;
    value: number;
  }>;
}
