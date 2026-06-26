export type CrmTab = 'dashboard' | 'leads' | 'trash' | 'historico' | 'extratos' | 'agenda';

export type LeadStatus = 'Novo' | 'Em Contato' | 'Agendado' | 'Fechado' | 'Perdido';

export type ServiceStatus = 'Marcado' | 'Confirmado' | 'Em Execucao' | 'Concluido' | 'Reagendar';

export type AgendaView = 'hoje' | 'semana' | 'mes' | 'servicos' | 'sem_acao' | 'dormentes';

export type LeadCardKind = 'followup' | 'service' | 'idle' | 'dormant';

export type MonthlyEvolutionSeries = 'atualDia' | 'atual' | 'anterior' | 'previsto';

export type LeadSortKey = '' | 'name' | 'neighborhood' | 'filmType' | 'sqm' | 'value' | 'status' | 'dataServico' | 'serviceStatus';

export type CommercialActionType = 'retorno' | 'servico' | 'fechado' | 'perdido';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  neighborhood: string;
  filmType: string;
  sqm: number;
  value: number;
  status: LeadStatus;
  createdAt: string;
  statusChangedAt: string;
  notes: string;
  proximoContato?: string | null;
  dataServico?: string | null;
  serviceStatus?: ServiceStatus | null;
  dormant: boolean;
  updatedAt?: string;
  deletedAt?: string | null;
}

export type LeadFormValues = Omit<Lead, 'id' | 'createdAt'>;

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
