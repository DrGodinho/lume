'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { addDays, differenceInDays, eachDayOfInterval, endOfMonth, format, isPast, isSameDay, isToday, isWithinInterval, parseISO, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Calendar } from 'lucide-react';
import { ExtratosMensaisSupabase } from './ExtratosMensaisSupabase';
import { roundCurrency, roundMeasure } from '@/lib/numberPrecision';

type LeadStatus = 'Novo' | 'Em Contato' | 'Agendado' | 'Fechado' | 'Perdido';
type ServiceStatus = 'Marcado' | 'Confirmado' | 'Em Execucao' | 'Concluido' | 'Reagendar';
type MonthlyEvolutionSeries = 'atualDia' | 'atual' | 'anterior' | 'previsto';
type LeadSortKey = '' | 'name' | 'neighborhood' | 'filmType' | 'sqm' | 'value' | 'status' | 'dataServico' | 'serviceStatus';
type AgendaView = 'hoje' | 'semana' | 'servicos' | 'sem_acao';
type CommercialActionType = 'retorno' | 'servico' | 'fechado' | 'perdido';
type CrmSyncState = {
  status: 'ok' | 'warning' | 'error';
  message: string;
  details?: string;
};

const LEAD_STAGES: LeadStatus[] = ['Novo', 'Em Contato', 'Agendado', 'Fechado', 'Perdido'];
const MONTHLY_EVOLUTION_SERIES: Record<MonthlyEvolutionSeries, boolean> = {
  atualDia: true,
  atual: true,
  anterior: true,
  previsto: true,
};

// Interfaces
interface Lead {
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
  updatedAt?: string;
}

interface CommercialActionDraft {
  lead: Lead;
  action: CommercialActionType;
  followUpDate: string;
  serviceDate: string;
  note: string;
}

const normalizeLeadStatus = (status: unknown): LeadStatus => {
  if (status === 'Proposta Enviada') return 'Agendado';
  if (status === 'Novo' || status === 'Em Contato' || status === 'Agendado' || status === 'Fechado' || status === 'Perdido') {
    return status;
  }
  return 'Novo';
};

const normalizeServiceStatus = (status: unknown): ServiceStatus | null => {
  if (status === 'Marcado' || status === 'Confirmado' || status === 'Em Execucao' || status === 'Concluido' || status === 'Reagendar') {
    return status;
  }
  if (status === 'Em execução') return 'Em Execucao';
  return null;
};

const getLeadStatusClasses = (status: LeadStatus) => {
  if (status === 'Fechado') return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
  if (status === 'Agendado') return 'border-sky-500/20 bg-sky-500/10 text-sky-400';
  if (status === 'Em Contato') return 'border-amber-500/20 bg-amber-500/10 text-amber-400';
  if (status === 'Perdido') return 'border-red-500/20 bg-red-500/10 text-red-400';
  return 'border-blue-500/20 bg-blue-500/10 text-blue-400';
};

const SERVICE_STATUS_META: Record<ServiceStatus, { label: string; badge: string; button: string }> = {
  Marcado: {
    label: 'Marcado',
    badge: 'border-slate-400/20 bg-slate-400/10 text-slate-200',
    button: 'border-slate-400/20 bg-slate-400/10 text-slate-200 hover:bg-slate-400/15',
  },
  Confirmado: {
    label: 'Confirmado',
    badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    button: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15',
  },
  'Em Execucao': {
    label: 'Em execução',
    badge: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    button: 'border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/15',
  },
  Concluido: {
    label: 'Concluído',
    badge: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
    button: 'border-sky-500/20 bg-sky-500/10 text-sky-300 hover:bg-sky-500/15',
  },
  Reagendar: {
    label: 'Reagendar',
    badge: 'border-red-500/20 bg-red-500/10 text-red-300',
    button: 'border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/15',
  },
};

// Initial Mock Data
const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead_1',
    name: 'Carlos Henrique Silva',
    phone: '(21) 98765-4321',
    email: 'carlos.henrique@gmail.com',
    address: 'Av. das Américas, 4200 - Bloco 2',
    neighborhood: 'Barra da Tijuca',
    filmType: 'Nano Cerâmica',
    sqm: 14.5,
    value: 2175,
    status: 'Novo',
    createdAt: '2026-06-01',
    statusChangedAt: '2026-06-01',
    notes: 'Cliente quer redução de calor na sala de estar. Agendar medição.'
  },
  {
    id: 'lead_2',
    name: 'Mariana Costa Ferreira',
    phone: '(21) 99888-7766',
    email: 'mariana.costa@hotmail.com',
    address: 'Rua Nelson Cardoso, 321',
    neighborhood: 'Jacarepaguá',
    filmType: 'Refletiva',
    sqm: 8.2,
    value: 738,
    status: 'Agendado',
    createdAt: '2026-06-02',
    statusChangedAt: '2026-06-02',
    dataServico: '2026-06-08',
    serviceStatus: 'Confirmado',
    notes: 'Orçamento enviado por WhatsApp. Aguardando retorno sobre película de privacidade.'
  },
  {
    id: 'lead_3',
    name: 'Roberto de Souza',
    phone: '(21) 97111-2233',
    email: 'roberto.souza@yahoo.com.br',
    address: 'Rua Cônego de Vasconcelos, 15',
    neighborhood: 'Bangu',
    filmType: 'Carbono',
    sqm: 22.0,
    value: 2640,
    status: 'Fechado',
    createdAt: '2026-05-28',
    statusChangedAt: '2026-05-30',
    dataServico: '2026-06-06',
    serviceStatus: 'Concluido',
    notes: 'Contrato assinado. Instalação agendada para sábado de manhã. Película Carbono 20%.'
  },
  {
    id: 'lead_4',
    name: 'Doutor Godinho',
    phone: '(21) 98888-9999',
    email: 'drgodinho@gmail.com',
    address: 'Rua Silva Cardoso, 125',
    neighborhood: 'Bangu',
    filmType: 'Nano Cerâmica',
    sqm: 18.0,
    value: 2700,
    status: 'Em Contato',
    createdAt: '2026-06-03',
    statusChangedAt: '2026-06-03',
    notes: 'Interesse na película de alto desempenho térmico para consultório.'
  }
];

const CRM_COLLAPSED_CARDS_STORAGE_KEY = 'lume_crm_collapsed_cards';

const FILM_PRICES: Record<string, number> = {
  'Nano Cerâmica': 150,
  'Refletiva': 90,
  'Carbono': 120,
  'Jateada': 100,
};

const RJ_NEIGHBORHOODS = [
  'Barra da Tijuca',
  'Recreio dos Bandeirantes',
  'Jacarepaguá',
  'Bangu',
  'Realengo',
  'Campo Grande',
  'Outro'
];

// ─── HISTORICO SUPABASE COMPONENT ────────────────────────────────────────────

const isClosedLead = (status: Lead['status']) => status === 'Fechado' || status === 'Perdido';

const parseAgendaDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getLeadActivityDate = (lead: Lead) => parseAgendaDate(lead.updatedAt || lead.statusChangedAt || lead.createdAt);

const getLeadFollowUpDate = (lead: Lead) => parseAgendaDate(lead.proximoContato || null);

const getLeadServiceDate = (lead: Lead) => parseAgendaDate(lead.dataServico || null);

const getLeadServiceStatus = (lead: Lead): ServiceStatus => {
  const normalized = normalizeServiceStatus(lead.serviceStatus);
  if (normalized) return normalized;
  return lead.dataServico ? 'Marcado' : 'Reagendar';
};

const formatCurrencyBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDateInputValue = (value?: string | null) => {
  const date = parseAgendaDate(value);
  return date ? format(date, 'yyyy-MM-dd') : '';
};

interface DateFieldWithPickerProps {
  className: string;
  ariaLabel: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}

function DateFieldWithPicker({ ariaLabel, className, onChange, required = false, value }: DateFieldWithPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;

    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="date"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} pr-12`}
      />
      <button
        type="button"
        onClick={openPicker}
        aria-label={ariaLabel}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/45 transition hover:text-[#f5d77a] focus:outline-none"
      >
        <Calendar className="h-4 w-4" />
      </button>
    </div>
  );
}

type LeadRow = Record<string, unknown> & { film_type?: string };

const asString = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

const asNullableString = (value: unknown) => (typeof value === 'string' && value ? value : null);

interface CalculatorGlass {
  label?: string;
  h?: number;
  w?: number;
  oh?: number;
  ow?: number;
  cor?: string;
}

interface CalculatorHistoryRow {
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
}

interface MonthlyTooltipPayload {
  payload?: {
    diaAnterior: string;
    atual: number | null;
    atualDia: number | null;
    anterior: number | null;
    anteriorDia: number | null;
    previsto: number | null;
    previstoDia: number | null;
  };
}

const mapLeadRow = (r: LeadRow): Lead => ({
  id: asString(r.id, 'lead_sem_id'),
  name: asString(r.name),
  phone: asString(r.phone),
  email: asString(r.email),
  address: asString(r.address),
  neighborhood: asString(r.neighborhood, 'Barra da Tijuca'),
  filmType: asString(r.film_type, 'Nano Ceramica'),
  sqm: roundMeasure(r.sqm),
  value: roundCurrency(r.value),
  status: normalizeLeadStatus(r.status),
  createdAt: asString(r.created_at, new Date().toISOString().split('T')[0]),
  statusChangedAt: asString(r.status_changed_at, asString(r.created_at, new Date().toISOString().split('T')[0])),
  notes: asString(r.notes),
  proximoContato: asNullableString(r.proximo_contato),
  dataServico: asNullableString(r.data_servico),
  serviceStatus: normalizeServiceStatus(r.service_status),
  updatedAt: asString(r.updated_at, asString(r.status_changed_at, asString(r.created_at, new Date().toISOString()))),
});

const mergeCloudLeadsWithLocal = (cloudLeads: Lead[], savedLeads: Lead[]) => {
  const cloudById = new Map(cloudLeads.map((lead) => [lead.id, lead]));
  const merged = savedLeads.map((lead) => {
    const cloud = cloudById.get(lead.id);
    if (!cloud) return lead;
    return {
      ...lead,
      ...cloud,
      proximoContato: cloud.proximoContato ?? lead.proximoContato ?? null,
      dataServico: cloud.dataServico ?? lead.dataServico ?? null,
      serviceStatus: cloud.serviceStatus ?? lead.serviceStatus ?? null,
      updatedAt: cloud.updatedAt ?? lead.updatedAt,
      statusChangedAt: cloud.statusChangedAt || lead.statusChangedAt,
    };
  });

  const localIds = new Set(savedLeads.map((lead) => lead.id));
  const newFromCloud = cloudLeads.filter((lead) => !localIds.has(lead.id));
  return [...newFromCloud, ...merged];
};

const normalizeLeadAmounts = (lead: Lead): Lead => ({
  ...lead,
  sqm: roundMeasure(lead.sqm),
  value: roundCurrency(lead.value),
  status: normalizeLeadStatus(lead.status),
  serviceStatus: normalizeServiceStatus(lead.serviceStatus) || (lead.dataServico ? 'Marcado' : null),
});

const getStoredLeads = () => {
  if (typeof window === 'undefined') return INITIAL_LEADS;
  const saved = localStorage.getItem('lume_crm_leads');
  if (!saved) return INITIAL_LEADS;

  try {
    return (JSON.parse(saved) as Lead[]).map(normalizeLeadAmounts);
  } catch {
    return INITIAL_LEADS;
  }
};

const getInitialCollapsedCards = () => {
  if (typeof window === 'undefined') return new Set<string>();
  const savedCollapsed = localStorage.getItem(CRM_COLLAPSED_CARDS_STORAGE_KEY);
  if (!savedCollapsed) return new Set<string>();

  try {
    const parsed = JSON.parse(savedCollapsed);
    return Array.isArray(parsed)
      ? new Set(parsed.filter((value): value is string => typeof value === 'string'))
      : new Set<string>();
  } catch {
    localStorage.removeItem(CRM_COLLAPSED_CARDS_STORAGE_KEY);
    return new Set<string>();
  }
};

const getCrmApiHeaders = async () => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!supabase) return headers;

  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
};

const getCrmApiErrorMessage = (payload: unknown, fallback: string) => {
  if (!payload || typeof payload !== 'object') return fallback;
  const data = payload as { error?: unknown; message?: unknown; hint?: unknown; code?: unknown };
  const message = typeof data.error === 'string'
    ? data.error
    : typeof data.message === 'string'
      ? data.message
      : fallback;
  const hint = typeof data.hint === 'string' ? data.hint : '';
  const code = typeof data.code === 'string' ? ` (${data.code})` : '';
  return `${message}${code}${hint ? ` - ${hint}` : ''}`;
};

const getLeadComparisonSnapshot = (lead: Lead) => {
  const normalized = normalizeLeadAmounts(lead);
  return JSON.stringify({
    id: normalized.id,
    name: normalized.name,
    phone: normalized.phone,
    email: normalized.email,
    address: normalized.address,
    neighborhood: normalized.neighborhood,
    filmType: normalized.filmType,
    sqm: normalized.sqm,
    value: normalized.value,
    status: normalized.status,
    statusChangedAt: normalized.statusChangedAt,
    dataServico: normalized.dataServico ?? null,
    proximoContato: normalized.proximoContato ?? null,
    serviceStatus: normalized.serviceStatus ?? null,
    notes: normalized.notes,
    updatedAt: normalized.updatedAt ?? null,
    createdAt: normalized.createdAt,
  });
};

const areLeadCollectionsEquivalent = (left: Lead[], right: Lead[]) => {
  if (left.length !== right.length) return false;

  const leftSnapshots = left
    .map((lead) => ({ id: lead.id, snapshot: getLeadComparisonSnapshot(lead) }))
    .sort((a, b) => a.id.localeCompare(b.id));
  const rightSnapshots = right
    .map((lead) => ({ id: lead.id, snapshot: getLeadComparisonSnapshot(lead) }))
    .sort((a, b) => a.id.localeCompare(b.id));

  return leftSnapshots.every((entry, index) => (
    entry.id === rightSnapshots[index]?.id
    && entry.snapshot === rightSnapshots[index]?.snapshot
  ));
};

function LeadCardAgenda({
  lead,
  kind = 'followup',
  onAgendar,
  onMarcarFeito,
  onUpdateServiceStatus,
  onAbrirLead,
}: {
  lead: Lead;
  kind?: 'followup' | 'service' | 'idle';
  onAgendar: (leadId: string, data: string) => Promise<void>;
  onMarcarFeito: (leadId: string) => Promise<void>;
  onUpdateServiceStatus: (leadId: string, serviceStatus: ServiceStatus) => Promise<void>;
  onAbrirLead: (lead: Lead) => void;
}) {
  const [agendando, setAgendando] = useState(false);
  const [novaData, setNovaData] = useState('');
  const [salvando, setSalvando] = useState(false);

  const followUpDate = getLeadFollowUpDate(lead);
  const serviceDate = getLeadServiceDate(lead);
  const activityDate = getLeadActivityDate(lead);
  const inactivityDays = activityDate ? differenceInDays(new Date(), activityDate) : null;
  const atrasado = !!followUpDate && isPast(followUpDate) && !isToday(followUpDate);
  const hasFollowUp = !!followUpDate;
  const isServiceCard = kind === 'service';
  const isIdleCard = kind === 'idle';
  const serviceStatus = getLeadServiceStatus(lead);
  const serviceMeta = SERVICE_STATUS_META[serviceStatus];
  const cardLabel = isServiceCard ? 'Serviço' : isIdleCard ? 'Sem próxima ação' : 'Follow-up';
  const cardClasses = atrasado
    ? 'border-red-500/20 bg-red-500/[0.06] hover:border-red-500/35'
    : isServiceCard
      ? 'border-sky-500/15 bg-sky-500/[0.05] hover:border-sky-500/30'
      : isIdleCard
        ? 'border-white/10 bg-white/[0.025] hover:border-[#c9a227]/20'
        : 'border-white/5 bg-[#04080f]/90 hover:border-[#c9a227]/20';

  const salvarAgendamento = async () => {
    if (!novaData) return;
    setSalvando(true);
    try {
      await onAgendar(lead.id, novaData);
      setAgendando(false);
      setNovaData('');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <article
      className={`group rounded-3xl border p-5 shadow-lg transition duration-300 ${cardClasses}`}
    >
      <div className="flex items-start justify-between gap-3">
        <button onClick={() => onAbrirLead(lead)} className="min-w-0 text-left">
          <span className={`mb-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
            isServiceCard
              ? 'border-sky-500/20 bg-sky-500/10 text-sky-300'
              : isIdleCard
                ? 'border-white/10 bg-white/[0.03] text-white/45'
                : 'border-[#c9a227]/20 bg-[#c9a227]/10 text-[#f5d77a]'
          }`}>
            {cardLabel}
          </span>
          <p className="truncate text-sm font-bold text-white transition group-hover:text-[#f5d77a]">
            {lead.name}
          </p>
          <p className="mt-1 text-[11px] text-white/40">
            {lead.neighborhood} · {lead.filmType}
          </p>
        </button>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${getLeadStatusClasses(lead.status)}`}
          >
            {lead.status}
          </span>
          {isServiceCard && (
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${serviceMeta.badge}`}>
              {serviceMeta.label}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
        {atrasado && (
          <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-red-300">
            Atrasado
          </span>
        )}
        {!hasFollowUp && inactivityDays !== null && inactivityDays >= 3 && (
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-white/50">
            Parado ha {inactivityDays}d
          </span>
        )}
        {hasFollowUp && followUpDate && (
          <span className="rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-2.5 py-1 text-[#f2d98a]">
            {atrasado ? `Atrasado há ${differenceInDays(new Date(), followUpDate)}d` : `Retorno ${format(followUpDate, "d 'de' MMM", { locale: ptBR })}`}
          </span>
        )}
        {serviceDate && (
          <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-sky-300">
            Serviço {format(serviceDate, "d 'de' MMM", { locale: ptBR })}
          </span>
        )}
      </div>

      <div className={`mt-4 grid gap-3 text-xs text-white/55 ${isServiceCard ? 'grid-cols-2 xl:grid-cols-3' : 'grid-cols-2'}`}>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">Telefone</p>
          <p className="mt-1 font-medium text-white">{lead.phone || 'Sem telefone'}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">Bairro</p>
          <p className="mt-1 font-medium text-white">{lead.neighborhood || 'Sem bairro'}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">Valor</p>
          <p className="mt-1 font-semibold text-[#f5d77a]">
            R$ {lead.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        {isServiceCard && (
          <>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">Endereço</p>
              <p className="mt-1 line-clamp-2 font-medium text-white">{lead.address || 'Sem endereço'}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">Película</p>
              <p className="mt-1 font-medium text-white">{lead.filmType}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">Metragem</p>
              <p className="mt-1 font-medium text-white">{lead.sqm.toFixed(2)} m²</p>
            </div>
          </>
        )}
      </div>

      {agendando ? (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="date"
            value={novaData}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => setNovaData(e.target.value)}
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a227]/40"
          />
          <button
            onClick={salvarAgendamento}
            disabled={!novaData || salvando}
            className="rounded-2xl bg-[#c9a227] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#04080f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            onClick={() => {
              setAgendando(false);
              setNovaData('');
            }}
            className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/[0.03] hover:text-white"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setAgendando(true)}
            className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-[#c9a227]/40 hover:text-[#f5d77a]"
          >
            {hasFollowUp ? 'Reagendar retorno' : 'Agendar retorno'}
          </button>
          {hasFollowUp && (
            <button
              onClick={() => onMarcarFeito(lead.id)}
              className="rounded-2xl border border-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/10"
            >
              Feito
            </button>
          )}
          <a
            href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-emerald-500/40 hover:text-emerald-300"
          >
            WhatsApp
          </a>
          <button
            onClick={() => onAbrirLead(lead)}
            className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
          >
            Abrir
          </button>
        </div>
      )}
      {isServiceCard && (
        <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">Status do serviço</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(SERVICE_STATUS_META) as ServiceStatus[]).map((statusOption) => (
              <button
                key={statusOption}
                type="button"
                onClick={() => onUpdateServiceStatus(lead.id, statusOption)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                  statusOption === serviceStatus
                    ? SERVICE_STATUS_META[statusOption].button
                    : 'border-white/10 bg-white/[0.02] text-white/55 hover:border-white/20 hover:text-white'
                }`}
              >
                {SERVICE_STATUS_META[statusOption].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function AgendaFollowUpSection({
  leads,
  initialView = 'hoje',
  onAgendarRetorno,
  onMarcarFeito,
  onUpdateServiceStatus,
  onAbrirLead,
  onIrParaLeads,
}: {
  leads: Lead[];
  initialView?: AgendaView;
  onAgendarRetorno: (leadId: string, data: string) => Promise<void>;
  onMarcarFeito: (leadId: string) => Promise<void>;
  onUpdateServiceStatus: (leadId: string, serviceStatus: ServiceStatus) => Promise<void>;
  onAbrirLead: (lead: Lead) => void;
  onIrParaLeads: () => void;
}) {
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [agendaView, setAgendaView] = useState<AgendaView>('hoje');

  useEffect(() => {
    setAgendaView(initialView);
  }, [initialView]);

  const hoje = useMemo(() => new Date(), []);
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 });
  const diasSemana = Array.from({ length: 7 }, (_, index) => addDays(inicioSemana, index));
  const agendaViews: Array<{ id: AgendaView; label: string; count: number }> = [];

  const leadsAtivos = useMemo(() => leads.filter((lead) => !isClosedLead(lead.status)), [leads]);
  const leadsComRetorno = useMemo(() => leadsAtivos.filter((lead) => !!lead.proximoContato), [leadsAtivos]);
  const leadsComServico = useMemo(() => leadsAtivos.filter((lead) => !!lead.dataServico), [leadsAtivos]);

  const contactarHoje = useMemo(() => {
    return leadsAtivos.filter((lead) => {
      const followUpDate = getLeadFollowUpDate(lead);
      if (!followUpDate) return false;
      if (diaSelecionado) {
        if (isToday(diaSelecionado)) {
          return isSameDay(followUpDate, diaSelecionado) || isPast(followUpDate);
        }
        return isSameDay(followUpDate, diaSelecionado);
      }
      return isToday(followUpDate) || isPast(followUpDate);
    });
  }, [diaSelecionado, leadsAtivos]);

  const proximos7Dias = useMemo(() => {
    return leadsAtivos.filter((lead) => {
      const followUpDate = getLeadFollowUpDate(lead);
      if (!followUpDate) return false;

      const withinNextWeek = isWithinInterval(followUpDate, {
        start: addDays(hoje, 1),
        end: addDays(hoje, 7),
      });

      if (!withinNextWeek) return false;
      if (!diaSelecionado) return true;
      return isSameDay(followUpDate, diaSelecionado);
    });
  }, [diaSelecionado, leadsAtivos, hoje]);

  const parados = useMemo(() => {
    return leadsAtivos.filter((lead) => {
      if (lead.proximoContato || lead.dataServico) return false;
      const activityDate = getLeadActivityDate(lead);
      if (!activityDate) return false;
      return differenceInDays(hoje, activityDate) >= 3;
    });
  }, [hoje, leadsAtivos]);

  const emDiaCount = useMemo(() => {
    return leadsAtivos.filter((lead) => {
      if (lead.proximoContato) return false;
      const activityDate = getLeadActivityDate(lead);
      if (!activityDate) return true;
      return differenceInDays(hoje, activityDate) < 3;
    }).length;
  }, [hoje, leadsAtivos]);

  const servicosAgendados = useMemo(() => {
    return leadsComServico
      .filter((lead) => {
        const serviceDate = getLeadServiceDate(lead);
        if (!serviceDate) return false;
        return diaSelecionado ? isSameDay(serviceDate, diaSelecionado) : true;
      })
      .sort((a, b) => {
        const aDate = getLeadServiceDate(a)?.getTime() || 0;
        const bDate = getLeadServiceDate(b)?.getTime() || 0;
        return aDate - bDate;
      });
  }, [diaSelecionado, leadsComServico]);

  const servicosHoje = useMemo(() => {
    return leadsComServico.filter((lead) => {
      const serviceDate = getLeadServiceDate(lead);
      return serviceDate ? isSameDay(serviceDate, diaSelecionado || hoje) : false;
    });
  }, [diaSelecionado, hoje, leadsComServico]);

  const serviceStatusCounts = useMemo(() => {
    return servicosAgendados.reduce<Record<ServiceStatus, number>>((acc, lead) => {
      const status = getLeadServiceStatus(lead);
      acc[status] += 1;
      return acc;
    }, {
      Marcado: 0,
      Confirmado: 0,
      'Em Execucao': 0,
      Concluido: 0,
      Reagendar: 0,
    });
  }, [servicosAgendados]);

  const serviceRouteGroups = useMemo(() => {
    const grouped = servicosAgendados.reduce<Record<string, Lead[]>>((acc, lead) => {
      const key = lead.neighborhood || 'Sem bairro';
      if (!acc[key]) acc[key] = [];
      acc[key].push(lead);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([neighborhood, items]) => ({
        neighborhood,
        items: items.sort((a, b) => {
          const aDate = getLeadServiceDate(a)?.getTime() || 0;
          const bDate = getLeadServiceDate(b)?.getTime() || 0;
          return aDate - bDate;
        }),
        totalValue: items.reduce((sum, lead) => sum + lead.value, 0),
      }))
      .sort((a, b) => b.items.length - a.items.length || b.totalValue - a.totalValue);
  }, [servicosAgendados]);

  const topServiceNeighborhood = serviceRouteGroups[0]?.neighborhood || 'Sem rota definida';
  const servicePipelineValue = servicosAgendados.reduce((sum, lead) => sum + lead.value, 0);

  const followUpCountByDay = (day: Date) =>
    leadsComRetorno.filter((lead) => {
      const followUpDate = getLeadFollowUpDate(lead);
      return followUpDate ? isSameDay(followUpDate, day) : false;
    }).length;

  const serviceCountByDay = (day: Date) =>
    leadsComServico.filter((lead) => {
      const serviceDate = getLeadServiceDate(lead);
      return serviceDate ? isSameDay(serviceDate, day) : false;
    }).length;

  const agendaCountByDay = (day: Date) => followUpCountByDay(day) + serviceCountByDay(day);

  const weeklyActionDays = diasSemana.map((day) => {
    const followUps = followUpCountByDay(day);
    const services = serviceCountByDay(day);
    const dayServices = leadsComServico.filter((lead) => {
      const serviceDate = getLeadServiceDate(lead);
      return serviceDate ? isSameDay(serviceDate, day) : false;
    });
    return {
      day,
      followUps,
      services,
      total: followUps + services,
      forecastValue: dayServices.reduce((sum, lead) => sum + lead.value, 0),
    };
  });

  const selectedDayLabel = diaSelecionado ? format(diaSelecionado, "EEEE, d 'de' MMMM", { locale: ptBR }) : '';

  const sectionsEmpty = contactarHoje.length === 0 && proximos7Dias.length === 0 && parados.length === 0 && servicosAgendados.length === 0;

  agendaViews.push(
    { id: 'hoje', label: diaSelecionado ? 'Dia selecionado' : 'Hoje', count: contactarHoje.length + servicosHoje.length },
    { id: 'semana', label: 'Próximos 7 dias', count: proximos7Dias.length },
    { id: 'servicos', label: 'Serviços', count: servicosAgendados.length },
    { id: 'sem_acao', label: 'Sem ação', count: parados.length },
  );

  const activeAgendaEmpty =
    (agendaView === 'hoje' && contactarHoje.length === 0 && servicosHoje.length === 0) ||
    (agendaView === 'semana' && proximos7Dias.length === 0) ||
    (agendaView === 'servicos' && servicosAgendados.length === 0) ||
    (agendaView === 'sem_acao' && parados.length === 0);

  const highlightDay = (day: Date) => {
    if (diaSelecionado && isSameDay(day, diaSelecionado)) {
      setDiaSelecionado(null);
      return;
    }
    setDiaSelecionado(day);
  };

  const renderAgendaSection = (
    title: string,
    count: number,
    tone: 'red' | 'gold' | 'sky' | 'muted',
    items: Lead[],
    kind: 'followup' | 'service' | 'idle',
    emptyMessage: string,
  ) => {
    const toneClasses = {
      red: 'text-red-300 border-red-500/20 bg-red-500/10',
      gold: 'text-[#f5d77a] border-[#c9a227]/20 bg-[#c9a227]/10',
      sky: 'text-sky-300 border-sky-500/20 bg-sky-500/10',
      muted: 'text-white/55 border-white/10 bg-white/[0.03]',
    }[tone];

    if (items.length === 0) {
      return (
        <section className="rounded-[2rem] border border-white/5 bg-white/[0.02] px-6 py-10 text-center">
          <p className="text-lg font-black text-white">{title}</p>
          <p className="mt-2 text-sm text-white/45">{emptyMessage}</p>
        </section>
      );
    }

    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold uppercase tracking-[0.25em] ${toneClasses.split(' ')[0]}`}>{title}</span>
          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses}`}>
            {count}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((lead) => (
            <LeadCardAgenda
              key={`${kind}-${lead.id}`}
              lead={lead}
              kind={kind}
              onAgendar={onAgendarRetorno}
              onMarcarFeito={onMarcarFeito}
              onUpdateServiceStatus={onUpdateServiceStatus}
              onAbrirLead={onAbrirLead}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2.25rem] border border-white/5 bg-[radial-gradient(circle_at_top_left,_rgba(201,162,39,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.04),_transparent_25%),linear-gradient(180deg,#0a1320_0%,#050a11_100%)] p-6 shadow-2xl shadow-black/25 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#f5d77a]">LUME ELITE</p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
              Central de Agenda
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
              Separe retornos comerciais, serviços marcados e leads sem próxima ação para decidir o que fazer primeiro.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/5 bg-white/[0.04] p-4 shadow-lg shadow-black/15 backdrop-blur-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35">Hoje</p>
            <p className="mt-2 text-lg font-bold text-white">
              {format(hoje, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-red-300 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]">
                {contactarHoje.length} urgentes
              </span>
              <span className="rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-1 text-[#f5d77a] shadow-[0_0_0_1px_rgba(201,162,39,0.1)]">
                {proximos7Dias.length} próximos 7 dias
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-white/60">
                {emDiaCount} em dia
              </span>
              <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-sky-300">
                {servicosAgendados.length} serviços
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-red-500/20 bg-[linear-gradient(180deg,rgba(239,68,68,0.12),rgba(239,68,68,0.04))] p-5 shadow-lg shadow-black/10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-red-300/70">Contatar hoje</p>
          <p className="mt-3 text-4xl font-black text-white">{contactarHoje.length}</p>
          <p className="mt-2 text-sm text-white/50">Atrasados e contatos do dia.</p>
        </div>
        <div className="rounded-[1.75rem] border border-[#c9a227]/20 bg-[linear-gradient(180deg,rgba(201,162,39,0.16),rgba(201,162,39,0.05))] p-5 shadow-lg shadow-black/10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#f5d77a]">Próximos 7 dias</p>
          <p className="mt-3 text-4xl font-black text-white">{proximos7Dias.length}</p>
          <p className="mt-2 text-sm text-white/50">Retornos agendados para a semana.</p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-sky-300/80">Serviços</p>
          <p className="mt-3 text-4xl font-black text-white">{servicosAgendados.length}</p>
          <p className="mt-2 text-sm text-white/50">Datas de serviço marcadas.</p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">Parados</p>
          <p className="mt-3 text-4xl font-black text-white">{parados.length}</p>
          <p className="mt-2 text-sm text-white/50">Sem agenda e sem contato recente.</p>
        </div>
      </section>

      <section className="flex flex-wrap gap-2 rounded-[1.5rem] border border-white/5 bg-[#07111d]/70 p-2">
        {agendaViews.map((view) => (
          <button
            key={view.id}
            type="button"
            onClick={() => setAgendaView(view.id)}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] transition ${
              agendaView === view.id
                ? 'bg-[#c9a227] text-[#04080f]'
                : 'border border-white/5 bg-white/[0.02] text-white/50 hover:border-[#c9a227]/25 hover:text-white'
            }`}
          >
            <span>{view.label}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] ${agendaView === view.id ? 'bg-[#04080f]/15' : 'bg-white/[0.06]'}`}>
              {view.count}
            </span>
          </button>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/5 bg-[#07111d]/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-md">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35">Ações da semana</p>
              <h3 className="mt-1 text-xl font-black text-white">Capacidade diária</h3>
            </div>
            {diaSelecionado && (
              <button
                onClick={() => setDiaSelecionado(null)}
                className="w-fit rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs font-semibold text-white/60 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              >
                Limpar filtro
              </button>
            )}
          </div>

          <div className="mt-5 space-y-2 sm:hidden">
            {weeklyActionDays.map(({ day, followUps, services, total, forecastValue }) => {
              const selected = diaSelecionado ? isSameDay(day, diaSelecionado) : false;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => highlightDay(day)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    selected
                      ? 'border-[#c9a227]/50 bg-[#c9a227]/10 text-white'
                      : 'border-white/5 bg-white/[0.02] text-white/70'
                  } ${isToday(day) ? 'ring-1 ring-[#f5d77a]/30' : ''}`}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
                      {format(day, 'EEE', { locale: ptBR })}
                    </p>
                    <p className={`mt-1 text-base font-black ${isToday(day) ? 'text-[#f5d77a]' : 'text-white'}`}>
                      {format(day, "d 'de' MMM", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{total} ações</p>
                    <p className="mt-0.5 text-[11px] text-white/45">
                      {services} serviços · {followUps} retornos
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#f5d77a]">
                      {formatCurrencyBRL(forecastValue)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 hidden grid-cols-7 gap-2 sm:grid">
            {diasSemana.map((day) => {
              const selected = diaSelecionado ? isSameDay(day, diaSelecionado) : false;
              const dayCount = agendaCountByDay(day);
              const followUps = followUpCountByDay(day);
              const services = serviceCountByDay(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => highlightDay(day)}
                  className={`group rounded-2xl border p-3 text-left transition duration-300 ${
                    selected
                      ? 'border-[#c9a227]/50 bg-[linear-gradient(180deg,rgba(201,162,39,0.16),rgba(201,162,39,0.06))] shadow-[0_0_0_1px_rgba(201,162,39,0.18)]'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]'
                  } ${isToday(day) ? 'ring-1 ring-[#f5d77a]/35' : ''}`}
                >
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">
                    {format(day, 'EEE', { locale: ptBR })}
                  </p>
                  <p className={`mt-2 text-lg font-black ${isToday(day) ? 'text-[#f5d77a]' : 'text-white'}`}>
                    {format(day, 'd')}
                  </p>
                  <p className="mt-1 text-[11px] text-white/45">{dayCount} itens</p>
                  <p className="mt-1 truncate text-[10px] font-semibold text-[#f5d77a]">
                    {formatCurrencyBRL(weeklyActionDays.find((item) => isSameDay(item.day, day))?.forecastValue || 0)}
                  </p>
                  <div className="mt-2 flex gap-1">
                    <span className="h-1.5 flex-1 rounded-full bg-[#c9a227]/40" style={{ opacity: followUps > 0 ? 1 : 0.18 }} />
                    <span className="h-1.5 flex-1 rounded-full bg-sky-400/50" style={{ opacity: services > 0 ? 1 : 0.18 }} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm text-white/60">
            {diaSelecionado ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Exibindo o dia <span className="font-semibold text-white">{selectedDayLabel}</span>.
                </p>
                <p className="text-white/40">
                  Hoje seguem visíveis também os atrasados.
                </p>
              </div>
            ) : (
              <p>Clique em um dia para filtrar os blocos de contato da semana.</p>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/5 bg-[#07111d]/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35">Atalhos</p>
          <h3 className="mt-1 text-xl font-black text-white">Operação rápida</h3>

          <div className="mt-5 space-y-3">
            <button
              onClick={onIrParaLeads}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-[#c9a227]/30 hover:bg-[#c9a227]/10"
            >
              <div>
                <p className="text-sm font-semibold text-white">Ir para Controle de Leads</p>
                <p className="text-xs text-white/40">Ajuste status, cadastre e edite leads.</p>
              </div>
              <span className="text-[#f5d77a]">→</span>
            </button>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/35">Resumo rápido</p>
              <div className="mt-3 space-y-2 text-sm text-white/65">
                <div className="flex items-center justify-between">
                  <span>Urgentes</span>
                  <span className="font-semibold text-red-300">{contactarHoje.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Próximos 7 dias</span>
                  <span className="font-semibold text-[#f5d77a]">{proximos7Dias.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Serviços marcados</span>
                  <span className="font-semibold text-sky-300">{servicosAgendados.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Confirmados</span>
                  <span className="font-semibold text-emerald-300">{serviceStatusCounts.Confirmado}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reagendar</span>
                  <span className="font-semibold text-red-300">{serviceStatusCounts.Reagendar}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Parados</span>
                  <span className="font-semibold text-white">{parados.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Em dia</span>
                  <span className="font-semibold text-emerald-300">{emDiaCount}</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/35">Rota sugerida</p>
              <p className="mt-2 text-lg font-black text-white">{topServiceNeighborhood}</p>
              <div className="mt-3 flex items-center justify-between text-sm text-white/60">
                <span>Serviços na rota</span>
                <span className="font-semibold text-sky-300">{serviceRouteGroups[0]?.items.length || 0}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-white/60">
                <span>Valor da agenda</span>
                <span className="font-semibold text-[#f5d77a]">{formatCurrencyBRL(servicePipelineValue)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {agendaView === 'servicos' && servicosAgendados.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">Serviços agendados</span>
            <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-300">
              {servicosAgendados.length}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {([
              ['Marcado', serviceStatusCounts.Marcado],
              ['Confirmado', serviceStatusCounts.Confirmado],
              ['Em execução', serviceStatusCounts['Em Execucao']],
              ['Concluído', serviceStatusCounts.Concluido],
              ['Reagendar', serviceStatusCounts.Reagendar],
            ] as const).map(([label, count]) => (
              <div key={label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">{label}</p>
                <p className="mt-2 text-2xl font-black text-white">{count}</p>
              </div>
            ))}
          </div>
          <div className="space-y-5">
            {serviceRouteGroups.map((group) => (
              <section key={group.neighborhood} className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-5">
                <div className="flex flex-col gap-3 border-b border-white/5 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-300/80">Rota</p>
                    <h3 className="mt-1 text-xl font-black text-white">{group.neighborhood}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-white/60">
                      {group.items.length} serviços
                    </span>
                    <span className="rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-1 text-[#f5d77a]">
                      {formatCurrencyBRL(group.totalValue)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((lead) => (
                    <LeadCardAgenda
                      key={lead.id}
                      lead={lead}
                      kind="service"
                      onAgendar={onAgendarRetorno}
                      onMarcarFeito={onMarcarFeito}
                      onUpdateServiceStatus={onUpdateServiceStatus}
                      onAbrirLead={onAbrirLead}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      )}

      {agendaView === 'hoje' && contactarHoje.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-red-300">Contatar hoje</span>
            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300">
              {contactarHoje.length}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {contactarHoje.map((lead) => (
              <LeadCardAgenda
                key={lead.id}
                lead={lead}
                kind="followup"
                onAgendar={onAgendarRetorno}
                onMarcarFeito={onMarcarFeito}
                onUpdateServiceStatus={onUpdateServiceStatus}
                onAbrirLead={onAbrirLead}
              />
            ))}
          </div>
        </section>
      )}

      {agendaView === 'hoje' && servicosHoje.length > 0 && renderAgendaSection(
        diaSelecionado ? 'Serviços do dia' : 'Serviços de hoje',
        servicosHoje.length,
        'sky',
        servicosHoje,
        'service',
        diaSelecionado ? 'Nenhum serviço marcado neste dia.' : 'Nenhum serviço marcado para hoje.',
      )}

      {agendaView === 'semana' && proximos7Dias.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#f5d77a]">Próximos 7 dias</span>
            <span className="rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-2.5 py-1 text-xs font-semibold text-[#f5d77a]">
              {proximos7Dias.length}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {proximos7Dias.map((lead) => (
              <LeadCardAgenda
                key={lead.id}
                lead={lead}
                kind="followup"
                onAgendar={onAgendarRetorno}
                onMarcarFeito={onMarcarFeito}
                onUpdateServiceStatus={onUpdateServiceStatus}
                onAbrirLead={onAbrirLead}
              />
            ))}
          </div>
        </section>
      )}

      {agendaView === 'sem_acao' && parados.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-white/55">Sem atividade há 3+ dias</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-semibold text-white/55">
              {parados.length}
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {parados.map((lead) => (
              <LeadCardAgenda
                key={lead.id}
                lead={lead}
                kind="idle"
                onAgendar={onAgendarRetorno}
                onMarcarFeito={onMarcarFeito}
                onUpdateServiceStatus={onUpdateServiceStatus}
                onAbrirLead={onAbrirLead}
              />
            ))}
          </div>
        </section>
      )}

      {!sectionsEmpty && activeAgendaEmpty && (
        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] px-6 py-10 text-center shadow-lg shadow-black/10">
          <p className="text-xl font-black text-white">Nada neste filtro</p>
          <p className="mt-2 text-sm text-white/45">Escolha outro trilho da agenda ou selecione outro dia no calendário.</p>
        </div>
      )}

      {sectionsEmpty && (
        <div className="rounded-[2rem] border border-emerald-500/20 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),transparent_55%),linear-gradient(180deg,rgba(16,185,129,0.06),rgba(16,185,129,0.03))] px-6 py-10 text-center shadow-lg shadow-black/10">
          <p className="text-2xl font-black text-white">Agenda em dia</p>
          <p className="mt-2 text-sm text-white/55">Nenhum contato pendente para hoje, próximos dias ou leads parados.</p>
        </div>
      )}
    </div>
  );
}

interface HistoricoSupabaseProps {
  setActiveTab: (tab: 'dashboard' | 'leads' | 'historico') => void;
  openCreateModal: (prefill?: Omit<Lead, 'id' | 'createdAt'>) => void;
}

function HistoricoSupabase({ setActiveTab, openCreateModal }: HistoricoSupabaseProps) {
  const [history, setHistory] = useState<CalculatorHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrcamento, setSelectedOrcamento] = useState<CalculatorHistoryRow | null>(null);

  const legacyFilmMap = useMemo<Record<string, string>>(() => ({
    'densidade': 'Nano Cerâmica',
    'facilidade': 'Refletiva',
    'facilidade_v2': 'Carbono',
  }), []);

  const FILM_TYPE_LABELS = useMemo<Record<string, string>>(() => ({
    carbono: 'Carbono',
    refletiva: 'Refletiva',
    dupla_camada: 'Dupla Camada',
    nano_ceramica: 'Nano Cerâmica',
    jateado: 'Jateado',
  }), []);

  const getFilmLabel = useCallback((h: CalculatorHistoryRow) => {
    if (h.selected_film) return FILM_TYPE_LABELS[h.selected_film] || h.selected_film;
    return legacyFilmMap[h.modo_otimizacao || ''] || h.modo_otimizacao || '—';
  }, [FILM_TYPE_LABELS, legacyFilmMap]);

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.from('calculator_history').select('*').order('created_at', { ascending: false }).limit(100);

      if (data) setHistory(data as CalculatorHistoryRow[]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const q = searchQuery.toLowerCase();
    return history.filter((h) =>
      (h.cliente || '').toLowerCase().includes(q) ||
      getFilmLabel(h).toLowerCase().includes(q)
    );
  }, [getFilmLabel, history, searchQuery]);

  const stats = useMemo(() => {
    const total = history.length;
    const totalValue = history.reduce((s, h) => s + (h.valor || 0), 0);
    const avgValue = total > 0 ? totalValue / total : 0;
    return { total, totalValue, avgValue };
  }, [history]);

  const exportToCSV = () => {
    const headers = ['Cliente', 'Película', 'Valor', 'Qtd Vidros', 'Data'];
    const rows = filteredHistory.map((h) => [
      h.cliente || '',
      getFilmLabel(h),
      h.valor || 0,
      h.qtd || 0,
      h.created_at ? new Date(h.created_at).toLocaleDateString('pt-BR') : '',
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico_lume_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteOrcamento = async (id: string) => {
    if (!confirm('Excluir este orçamento do histórico?')) return;
    if (!supabase) return;

    const { error } = await supabase.from('calculator_history').delete().eq('id', id);
    if (!error) {
      setHistory(prev => prev.filter(h => h.id !== id));
    }
  };

const convertToLead = (orcamento: CalculatorHistoryRow) => {
    const totalM2 = roundMeasure((orcamento.vidros?.reduce((s, v) => s + (v.h || 0) * (v.w || 0), 0) || 0) / 10000);
    const prefill: Omit<Lead, 'id' | 'createdAt'> = {
      name: orcamento.cliente || 'Cliente do Histórico',
      phone: orcamento.phone || '',
      email: '',
      address: '',
      neighborhood: 'Barra da Tijuca',
      filmType: getFilmLabel(orcamento),
      sqm: totalM2,
      value: roundCurrency(orcamento.valor),
      status: 'Novo',
      statusChangedAt: new Date().toISOString().split('T')[0],
      dataServico: null,
      notes: `Orçamento convertido do Supabase (ID: ${orcamento.id}).\nPelícula: ${getFilmLabel(orcamento)}.\nVidros: ${orcamento.qtd}.`,
    };
    setActiveTab('leads');
    openCreateModal(prefill);
  };

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a227]" />
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <p className="text-red-400 font-semibold">Supabase não configurado</p>
        <p className="text-white/50 text-sm mt-2">Adicione as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 backdrop-blur-md shadow-lg sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-3.5 h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por cliente ou película..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/5 bg-white/[0.02] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-[#c9a227]/40 focus:outline-none"
          />
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c9a227] to-[#d4ad30] px-6 py-3 text-sm font-bold text-[#04080f] shadow-lg shadow-[#c9a227]/10 hover:brightness-110 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-[#07111d]/50 p-3">
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Total de Orçamentos</span>
          <p className="mt-1 text-xl font-black text-white">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#07111d]/50 p-3">
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Valor Total</span>
          <p className="mt-1 text-lg font-black text-[#c9a227]">{formatCurrency(stats.totalValue)}</p>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 backdrop-blur-md shadow-lg overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-white/80">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-white/40">
              <th className="pb-3 font-semibold">Cliente</th>
              <th className="pb-3 font-semibold">Película</th>
              <th className="pb-3 font-semibold text-right">Valor</th>
              <th className="pb-3 font-semibold text-center">Qtd</th>
              <th className="pb-3 font-semibold">Data</th>
              <th className="pb-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-white/30 font-semibold">
                  {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum orçamento no histórico'}
                </td>
              </tr>
            ) : (
              filteredHistory.map((h) => (
                <tr key={h.id} className="hover:bg-white/[0.01] cursor-pointer" onClick={() => setSelectedOrcamento(h)}>
                  <td className="py-3.5 font-semibold text-white group">
                    <span className="border-b border-dotted border-white/20 hover:border-[#c9a227]/60 transition">{h.cliente || '—'}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-0.5 text-xs text-white/70">
                      {getFilmLabel(h)}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-bold text-[#c9a227]">{formatCurrency(h.valor || 0)}</td>
                  <td className="py-3.5 text-center font-mono">{h.qtd || 0}</td>
                  <td className="py-3.5 text-white/50">
                    {h.created_at ? new Date(h.created_at).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setSelectedOrcamento(h)}
                        className="text-white/40 hover:text-white"
                        title="Ver detalhes"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => convertToLead(h)}
                        className="text-[#c9a227]/60 hover:text-[#c9a227]"
                        title="Converter em Lead"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteOrcamento(h.id)}
                        className="text-white/30 hover:text-red-400"
                        title="Excluir"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detalhes Modal */}
      {selectedOrcamento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={() => setSelectedOrcamento(null)}>
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#07111d] p-5 text-white shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg font-black text-white tracking-tight">
                {selectedOrcamento.cliente || 'Orçamento'}
              </h3>
              <button onClick={() => setSelectedOrcamento(null)} className="text-white/40 hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Película</span>
                <span className="font-bold text-sm text-white">{getFilmLabel(selectedOrcamento)}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Valor Total</span>
                <span className="font-black text-lg text-[#c9a227]">{formatCurrency(selectedOrcamento.valor || 0)}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Quantidade</span>
                <span className="font-bold text-sm text-white">{selectedOrcamento.qtd || 0} vidros</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Data</span>
                <span className="font-bold text-sm text-white">
                  {selectedOrcamento.created_at ? new Date(selectedOrcamento.created_at).toLocaleDateString('pt-BR') : '—'}
                </span>
              </div>
            </div>

            {selectedOrcamento.vidros && selectedOrcamento.vidros.length > 0 && (
              <div className="mt-3">
                <h4 className="text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-2">Vidros</h4>
                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {selectedOrcamento.vidros.map((v, i) => (
                    <div key={i} className="flex justify-between items-center rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-sm">
                      <span className="text-white/70">{v.label || `Vidro ${i + 1}`}</span>
                      <span className="font-mono text-white text-xs">{v.h || 0} x {v.w || 0} cm</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-4 border-t border-white/5 pt-3">
              <button
                onClick={() => setSelectedOrcamento(null)}
                className="flex-1 rounded-xl border border-white/5 bg-white/[0.01] py-2.5 text-sm font-semibold text-white/60 hover:bg-white/5 transition"
              >
                Fechar
              </button>
              <button
                onClick={() => { convertToLead(selectedOrcamento); setSelectedOrcamento(null); }}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#d4ad30] py-2.5 text-sm font-bold text-[#04080f] shadow-lg shadow-[#c9a227]/10 hover:brightness-110 transition"
              >
                Converter em Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'historico' | 'extratos' | 'agenda'>('dashboard');

  // Leads Database State
  const [leads, setLeads] = useState<Lead[]>(() => INITIAL_LEADS.map(normalizeLeadAmounts));

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterNeighborhood, setFilterNeighborhood] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [collapsedCards, setCollapsedCards] = useState<Set<string>>(new Set());
  const [collapsedCardsLoaded, setCollapsedCardsLoaded] = useState(false);
  const [visibleMonthlySeries, setVisibleMonthlySeries] = useState(MONTHLY_EVOLUTION_SERIES);
  const [agendaInitialView, setAgendaInitialView] = useState<AgendaView>('hoje');
  const [sortKey, setSortKey] = useState<LeadSortKey>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Lead CRUD Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadDetail, setLeadDetail] = useState<Lead | null>(null);
  const [commercialAction, setCommercialAction] = useState<CommercialActionDraft | null>(null);
  const [leadForm, setLeadForm] = useState<Omit<Lead, 'id' | 'createdAt'>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    neighborhood: 'Barra da Tijuca',
    filmType: 'Nano Cerâmica',
    sqm: 0,
    value: 0,
    status: 'Novo',
    statusChangedAt: new Date().toISOString().split('T')[0],
    dataServico: null,
    serviceStatus: null,
    proximoContato: null,
    notes: '',
  });



  // Notification Banner
  const [notification, setNotification] = useState<string | null>(null);
  const [crmSync, setCrmSync] = useState<CrmSyncState>({
    status: 'warning',
    message: 'Carregando cache local enquanto o Supabase confirma os dados.',
  });

  // Supabase linked orcamento state (for lead modal)
  const [linkedOrcamento, setLinkedOrcamento] = useState<CalculatorHistoryRow | null>(null);
  const [targetGoal, setTargetGoal] = useState(10000);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState('10000');
  const [isVerifyingCloud, setIsVerifyingCloud] = useState(false);
  const [lastCloudCheckAt, setLastCloudCheckAt] = useState<string | null>(null);
  const [renderTime] = useState(() => Date.now());
  const leadTableClickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (leadTableClickTimeoutRef.current) {
      clearTimeout(leadTableClickTimeoutRef.current);
    }
  }, []);

  const fetchCloudLeadsSnapshot = useCallback(async () => {
    const response = await fetch('/api/crm/leads', {
      headers: await getCrmApiHeaders(),
      credentials: 'same-origin',
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok || !Array.isArray(payload)) {
      return {
        ok: false as const,
        details: getCrmApiErrorMessage(payload, response.statusText),
      };
    }

    return {
      ok: true as const,
      leads: payload.map(mapLeadRow),
    };
  }, []);

  // Load database on mount
  useEffect(() => {
    const savedLeads = getStoredLeads();
    queueMicrotask(() => setLeads(savedLeads));
    localStorage.setItem('lume_crm_leads', JSON.stringify(savedLeads));

    const loadCloudLeads = async () => {
      try {
        const result = await fetchCloudLeadsSnapshot();
        if (!result.ok) {
          setCrmSync({
            status: 'error',
            message: 'Supabase não carregou os leads. O CRM está exibindo o cache local.',
            details: result.details,
          });
          return;
        }

        const cloudLeads = result.leads;
        const nextLeads = mergeCloudLeadsWithLocal(cloudLeads, savedLeads);
        setLeads(nextLeads);
        localStorage.setItem('lume_crm_leads', JSON.stringify(nextLeads));
        setLastCloudCheckAt(new Date().toISOString());
        setCrmSync({
          status: 'ok',
          message: 'Leads sincronizados com o Supabase.',
        });
      } catch (error) {
        setCrmSync({
          status: 'error',
          message: 'Falha de conexão com o Supabase. O CRM está exibindo o cache local.',
          details: error instanceof Error ? error.message : 'Erro desconhecido ao carregar leads.',
        });
      }
    };

    void loadCloudLeads();
    if (supabase) {
      supabase.from('configuracoes').select('*').eq('id', 'default').single().then(({ data }) => {
        if (data?.meta_valor) {
          setTargetGoal(data.meta_valor);
          setTargetInput(String(data.meta_valor));
        }
      });
    }
  }, [fetchCloudLeadsSnapshot]);

  useEffect(() => {
    queueMicrotask(() => {
      setCollapsedCards(getInitialCollapsedCards());
      setCollapsedCardsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!collapsedCardsLoaded) return;
    localStorage.setItem(CRM_COLLAPSED_CARDS_STORAGE_KEY, JSON.stringify([...collapsedCards]));
  }, [collapsedCards, collapsedCardsLoaded]);

  const handleVerifyCloudLeads = useCallback(async () => {
    setIsVerifyingCloud(true);
    setCrmSync({
      status: 'warning',
      message: 'Conferindo os dados reais no Supabase...',
    });

    try {
      const result = await fetchCloudLeadsSnapshot();
      if (!result.ok) {
        setCrmSync({
          status: 'error',
          message: 'Nao foi possivel confirmar os dados no Supabase.',
          details: result.details,
        });
        return;
      }

      const cloudLeads = result.leads.map(normalizeLeadAmounts);
      const currentLeads = leads.map(normalizeLeadAmounts);
      const isExactMatch = areLeadCollectionsEquivalent(currentLeads, cloudLeads);
      const checkedAt = new Date().toISOString();

      setLeads(cloudLeads);
      localStorage.setItem('lume_crm_leads', JSON.stringify(cloudLeads));
      setLastCloudCheckAt(checkedAt);
      setCrmSync({
        status: 'ok',
        message: isExactMatch
          ? `Dados conferidos no Supabase as ${format(new Date(checkedAt), 'HH:mm:ss')}.`
          : `Havia divergencia com o cache local. A tela foi atualizada com os dados reais do Supabase as ${format(new Date(checkedAt), 'HH:mm:ss')}.`,
      });
    } catch (error) {
      setCrmSync({
        status: 'error',
        message: 'Falha ao conferir os dados reais no Supabase.',
        details: error instanceof Error ? error.message : 'Erro desconhecido ao verificar os dados.',
      });
    } finally {
      setIsVerifyingCloud(false);
    }
  }, [fetchCloudLeadsSnapshot, leads]);

  const saveTargetGoal = async (valor: number) => {
    setTargetGoal(valor);
    setEditingTarget(false);
    if (!supabase) return;
    await supabase.from('configuracoes').upsert({ id: 'default', meta_valor: valor }, { onConflict: 'id' });
  };

  const persistLeadsLocally = (updated: Lead[]) => {
    const normalized = updated.map(normalizeLeadAmounts);
    setLeads(normalized);
    localStorage.setItem('lume_crm_leads', JSON.stringify(normalized));
    return normalized;
  };

  const syncLeadToCloud = async (lead: Lead) => {
    setCrmSync({
      status: 'warning',
      message: 'Salvando alteracao no Supabase...',
    });

    const headers = await getCrmApiHeaders();
    const response = await fetch('/api/crm/leads', {
      method: 'PUT',
      headers,
      credentials: 'same-origin',
      body: JSON.stringify(normalizeLeadAmounts(lead)),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const details = getCrmApiErrorMessage(payload, response.statusText);
      console.error('[CRM] Lead save error:', details);
      setCrmSync({
        status: 'error',
        message: 'Supabase recusou a última sincronização. A alteração ficou apenas no cache local.',
        details,
      });
      return false;
    }

    setCrmSync({
      status: 'ok',
      message: 'Última alteração sincronizada com o Supabase.',
    });
    return true;
  };

  const updateSingleLead = async (leadId: string, updater: (lead: Lead) => Lead) => {
    let leadToSync: Lead | null = null;
    const updated = leads.map((lead) => {
      if (lead.id !== leadId) return lead;
      leadToSync = normalizeLeadAmounts(updater(lead));
      return leadToSync;
    });

    persistLeadsLocally(updated);
    const synced = leadToSync ? await syncLeadToCloud(leadToSync) : false;
    return { synced, lead: leadToSync };
  };

  const appendCommercialNote = (currentNotes: string, note: string) => {
    const cleanNote = note.trim();
    if (!cleanNote) return currentNotes;
    const stamp = format(new Date(), 'dd/MM/yyyy');
    const entry = `[${stamp}] ${cleanNote}`;
    return currentNotes ? `${currentNotes}\n${entry}` : entry;
  };

  const getWhatsAppHref = (lead: Lead) => {
    const digits = lead.phone.replace(/\D/g, '');
    if (!digits) return '';
    const phone = digits.startsWith('55') ? digits : `55${digits}`;
    const text = encodeURIComponent(`Olá, ${lead.name}! Aqui é da LUME. Posso falar sobre seu atendimento?`);
    return `https://wa.me/${phone}?text=${text}`;
  };

  // Notification helper
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const openCommercialAction = (lead: Lead, action: CommercialActionType) => {
    setCommercialAction({
      lead,
      action,
      followUpDate: formatDateInputValue(lead.proximoContato) || new Date().toISOString().split('T')[0],
      serviceDate: formatDateInputValue(lead.dataServico) || new Date().toISOString().split('T')[0],
      note: action === 'servico' && getLeadServiceStatus(lead) === 'Reagendar' ? 'Reagendado a pedido do cliente.' : '',
    });
  };

  const applyCommercialAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commercialAction) return;

    const { lead, action, followUpDate, serviceDate, note } = commercialAction;
    if (action === 'retorno' && !followUpDate) {
      notify('Escolha a data do próximo retorno.');
      return;
    }
    if (action === 'servico' && !serviceDate) {
      notify('Escolha a data do serviço.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    const nextContact = followUpDate ? new Date(`${followUpDate}T12:00:00`).toISOString() : null;
    const nextService = serviceDate || null;

    const { synced, lead: updatedLead } = await updateSingleLead(lead.id, (currentLead) => {
      const baseLead = {
        ...currentLead,
        updatedAt: now,
        notes: appendCommercialNote(currentLead.notes, note),
      };

      if (action === 'retorno') {
        return {
          ...baseLead,
          status: currentLead.status === 'Novo' ? 'Em Contato' : currentLead.status,
          statusChangedAt: currentLead.status === 'Novo' ? today : currentLead.statusChangedAt,
          proximoContato: nextContact,
        };
      }

      if (action === 'servico') {
        return {
          ...baseLead,
          status: 'Agendado',
          statusChangedAt: currentLead.status === 'Agendado' ? currentLead.statusChangedAt : today,
          dataServico: nextService,
          serviceStatus: currentLead.serviceStatus === 'Reagendar' ? 'Reagendar' : 'Marcado',
          proximoContato: null,
        };
      }

      return {
        ...baseLead,
        status: action === 'fechado' ? 'Fechado' : 'Perdido',
        statusChangedAt: today,
        proximoContato: null,
      };
    });

    setCommercialAction(null);
    setLeadDetail(updatedLead);

    const actionLabel = {
      retorno: 'Retorno comercial agendado',
      servico: 'Serviço agendado',
      fechado: 'Lead marcado como fechado',
      perdido: 'Lead marcado como perdido',
    }[action];

    notify(synced ? `${actionLabel}.` : `${actionLabel} localmente; falha ao sincronizar.`);
  };

  const setCollapsedStateForAllLeads = (collapsed: boolean) => {
    setCollapsedCards(new Set(collapsed ? leads.map((lead) => lead.id) : []));
  };

  // Logout action
  const handleLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch {
      notify('Erro ao sair. Tente novamente.');
    }
  };

  // Lead Modal Submit handler
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name) {
      notify('Preencha o campo obrigatório (Nome)');
      return;
    }

    if (selectedLead) {
      const updatedLead = normalizeLeadAmounts({
        ...selectedLead,
        ...leadForm,
        updatedAt: new Date().toISOString(),
      });
      persistLeadsLocally(leads.map((lead) => (lead.id === selectedLead.id ? updatedLead : lead)));
      const synced = await syncLeadToCloud(updatedLead);
      notify(synced ? 'Lead atualizado com sucesso!' : 'Lead atualizado localmente; falha ao sincronizar.');
    } else {
      const newLead = normalizeLeadAmounts({
        id: `lead_${Date.now()}`,
        ...leadForm,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
      });
      persistLeadsLocally([newLead, ...leads]);
      const synced = await syncLeadToCloud(newLead);
      notify(synced ? 'Lead criado com sucesso!' : 'Lead criado localmente; falha ao sincronizar.');
    }

    setIsModalOpen(false);
    setSelectedLead(null);
    setLinkedOrcamento(null);
  };

  // Open Create Lead Modal
  const openCreateModal = (prefill?: Omit<Lead, 'id' | 'createdAt'>) => {
    setSelectedLead(null);
    setLinkedOrcamento(null);
    setLeadForm(prefill || {
      name: '',
      phone: '',
      email: '',
      address: '',
      neighborhood: 'Barra da Tijuca',
      filmType: 'Nano Cerâmica',
      sqm: 0,
      value: 0,
      status: 'Novo',
      statusChangedAt: new Date().toISOString().split('T')[0],
      dataServico: null,
      serviceStatus: null,
      proximoContato: null,
      notes: '',
    });
    setIsModalOpen(true);
  };

  // Open Edit Lead Modal
  const openEditModal = async (lead: Lead) => {
    setSelectedLead(lead);
    setLeadForm({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      neighborhood: lead.neighborhood,
      filmType: lead.filmType,
      sqm: roundMeasure(lead.sqm),
      value: roundCurrency(lead.value),
      status: lead.status,
      statusChangedAt: lead.statusChangedAt,
      dataServico: formatDateInputValue(lead.dataServico),
      serviceStatus: lead.serviceStatus || null,
      proximoContato: formatDateInputValue(lead.proximoContato),
      notes: lead.notes,
    });
    setIsModalOpen(true);

    // Buscar orçamento no Supabase pelo nome do cliente
    if (supabase && lead.name) {
      const { data } = await supabase
        .from('calculator_history')
        .select('*')
        .ilike('cliente', `%${lead.name}%`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      setLinkedOrcamento(data || null);
    } else {
      setLinkedOrcamento(null);
    }
  };

  const handleLeadTableRowClick = (lead: Lead) => {
    if (leadTableClickTimeoutRef.current) {
      clearTimeout(leadTableClickTimeoutRef.current);
    }

    leadTableClickTimeoutRef.current = setTimeout(() => {
      setLeadDetail(lead);
      leadTableClickTimeoutRef.current = null;
    }, 220);
  };

  const handleLeadTableRowDoubleClick = (lead: Lead) => {
    if (leadTableClickTimeoutRef.current) {
      clearTimeout(leadTableClickTimeoutRef.current);
      leadTableClickTimeoutRef.current = null;
    }

    void openEditModal(lead);
  };

  // Delete Lead Handler
  const handleDeleteLead = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lead?')) {
      persistLeadsLocally(leads.filter((lead) => lead.id !== id));
      setCrmSync({
        status: 'warning',
        message: 'Excluindo lead no Supabase...',
      });
      const response = await fetch(`/api/crm/leads?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: await getCrmApiHeaders(),
        credentials: 'same-origin',
      });
      if (response.ok) {
        setCrmSync({ status: 'ok', message: 'Lead removido no Supabase.' });
        notify('Lead removido.');
        return;
      }
      const payload = await response.json().catch(() => null);
      const details = getCrmApiErrorMessage(payload, response.statusText);
      setCrmSync({
        status: 'error',
        message: 'Supabase não confirmou a exclusão. O lead saiu apenas do cache local.',
        details,
      });
      notify('Lead removido localmente; falha ao sincronizar.');
    }
  };

  // Change lead status directly
  const handleStatusChange = async (id: string, newStatus: Lead['status']) => {
    const lead = leads.find((item) => item.id === id);
    if (!lead) return;
    if (newStatus === 'Agendado') {
      openCommercialAction(lead, 'servico');
      return;
    }
    if (newStatus === 'Fechado') {
      openCommercialAction(lead, 'fechado');
      return;
    }
    if (newStatus === 'Perdido') {
      openCommercialAction(lead, 'perdido');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    const { synced } = await updateSingleLead(id, (currentLead) => ({
      ...currentLead,
      status: newStatus,
      statusChangedAt: currentLead.status === newStatus ? currentLead.statusChangedAt : today,
      updatedAt: now,
    }));
    notify(synced ? `Status alterado para: ${newStatus}` : `Status alterado localmente para: ${newStatus}`);
  };

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const daysInStatus = (lead: Lead) => Math.floor((renderTime - new Date(lead.statusChangedAt).getTime()) / 86400000);
  const agendaUrgentCount = useMemo(() => {
    return leads.filter((lead) => {
      if (isClosedLead(lead.status)) return false;
      const followUpDate = getLeadFollowUpDate(lead);
      return !!followUpDate && (isToday(followUpDate) || isPast(followUpDate));
    }).length;
  }, [leads]);
  const commercialActionTitle = commercialAction ? {
    retorno: 'Agendar retorno comercial',
    servico: 'Agendar serviço',
    fechado: 'Fechar venda',
    perdido: 'Marcar como perdido',
  }[commercialAction.action] : '';
  const commercialActionLabel = commercialAction ? {
    retorno: 'Salvar retorno',
    servico: 'Salvar serviço',
    fechado: 'Confirmar fechamento',
    perdido: 'Confirmar perda',
  }[commercialAction.action] : '';

  const handleAgendaSchedule = async (leadId: string, data: string) => {
    const nextContact = new Date(`${data}T12:00:00`).toISOString();
    const now = new Date().toISOString();
    const { synced } = await updateSingleLead(leadId, (lead) => ({
      ...lead,
      proximoContato: nextContact,
      updatedAt: now,
    }));
    notify(synced ? 'Retorno agendado com sucesso!' : 'Retorno agendado localmente; falha ao sincronizar.');
  };

  const handleServiceStatusChange = async (leadId: string, serviceStatus: ServiceStatus) => {
    const now = new Date().toISOString();
    const today = new Date().toISOString().split('T')[0];
    const { synced } = await updateSingleLead(leadId, (lead) => ({
      ...lead,
      status: lead.status === 'Novo' && serviceStatus !== 'Concluido' ? 'Agendado' : lead.status,
      statusChangedAt: lead.status === 'Novo' && serviceStatus !== 'Concluido' ? today : lead.statusChangedAt,
      serviceStatus,
      updatedAt: now,
    }));

    const label = SERVICE_STATUS_META[serviceStatus].label;
    notify(synced ? `Serviço atualizado para ${label}.` : `Serviço atualizado localmente para ${label}.`);
  };

  const handleAgendaMarkDone = async (leadId: string) => {
    const { synced } = await updateSingleLead(leadId, (lead) => ({
      ...lead,
      proximoContato: null,
      updatedAt: new Date().toISOString(),
    }));
    notify(synced ? 'Follow-up registrado!' : 'Follow-up registrado localmente; falha ao sincronizar.');
  };

  // Filtering Logic for Leads Tab
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lead.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.notes.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesNeighborhood = filterNeighborhood ? lead.neighborhood === filterNeighborhood : true;
      const matchesStatus = filterStatus ? lead.status === filterStatus : true;

      return matchesSearch && matchesNeighborhood && matchesStatus;
    });
  }, [leads, searchQuery, filterNeighborhood, filterStatus]);

  const toggleSort = (key: LeadSortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedFilteredLeads = useMemo(() => {
    if (!sortKey) return filteredLeads;
    return [...filteredLeads].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const aNorm = typeof aVal === 'string' ? aVal.toLowerCase() : aVal;
      const bNorm = typeof bVal === 'string' ? bVal.toLowerCase() : bVal;
      if (aNorm == null && bNorm == null) return 0;
      if (aNorm == null) return sortDir === 'asc' ? -1 : 1;
      if (bNorm == null) return sortDir === 'asc' ? 1 : -1;
      if (aNorm < bNorm) return sortDir === 'asc' ? -1 : 1;
      if (aNorm > bNorm) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortKey, sortDir]);

  // Cumulative Month Data
  const monthlyEvolution = useMemo(() => {
    const now = new Date();
    const currentStart = startOfMonth(now);
    const currentEnd = now;
    const currentMonthEnd = endOfMonth(now);
    const previousReference = subMonths(now, 1);
    const previousStart = startOfMonth(previousReference);
    const previousEnd = endOfMonth(previousReference);
    let chartEnd = currentMonthEnd;
    const currentByDay: Record<string, { value: number; count: number }> = {};
    const previousByDay: Record<string, { value: number; count: number }> = {};
    const futureByDay: Record<string, { value: number; count: number }> = {};

    leads.filter(l => l.status === 'Fechado').forEach(l => {
      const d = parseAgendaDate(l.statusChangedAt || l.createdAt);
      if (!d) return;
      const bucket =
        d >= currentStart && d <= currentEnd
          ? currentByDay
          : d >= previousStart && d <= previousEnd
            ? previousByDay
            : null;

      if (bucket) {
        const key = format(d, 'yyyy-MM-dd');
        bucket[key] = {
          value: (bucket[key]?.value || 0) + l.value,
          count: (bucket[key]?.count || 0) + 1,
        };
      }
    });

    let futureTotal = 0;
    let futureCount = 0;

    leads.filter(l => !isClosedLead(l.status)).forEach(l => {
      const serviceDate = getLeadServiceDate(l);
      if (!serviceDate || serviceDate <= currentEnd) return;

      futureTotal += l.value;
      futureCount += 1;
      if (serviceDate > chartEnd) chartEnd = serviceDate;

      if (serviceDate >= currentStart) {
        const key = format(serviceDate, 'yyyy-MM-dd');
        futureByDay[key] = {
          value: (futureByDay[key]?.value || 0) + l.value,
          count: (futureByDay[key]?.count || 0) + 1,
        };
      }
    });

    const days = eachDayOfInterval({ start: currentStart, end: chartEnd });

    const monthlyTotals = days.reduce(
      (acc, day, index) => {
        const currentKey = format(day, 'yyyy-MM-dd');
        const previousDay = addDays(previousStart, index);
        const previousKey = format(previousDay, 'yyyy-MM-dd');
        const isCurrentPeriod = day <= currentEnd;
        const currentDay = isCurrentPeriod ? currentByDay[currentKey] || { value: 0, count: 0 } : { value: 0, count: 0 };
        const previousDayData =
          isCurrentPeriod && previousDay <= previousEnd ? previousByDay[previousKey] || { value: 0, count: 0 } : { value: 0, count: 0 };
        const futureDay = futureByDay[currentKey] || { value: 0, count: 0 };
        const currentAcc = acc.currentAcc + currentDay.value;
        const previousAcc = acc.previousAcc + previousDayData.value;
        const currentCount = acc.currentCount + currentDay.count;
        const previousCount = acc.previousCount + previousDayData.count;
        const bestDay =
          isCurrentPeriod && currentDay.value > acc.bestDay.value
            ? { label: format(day, 'dd/MM'), value: currentDay.value }
            : acc.bestDay;

        return {
          currentAcc,
          previousAcc,
          currentCount,
          previousCount,
          bestDay,
          chartData: [
            ...acc.chartData,
            {
              dia: format(day, 'dd/MM'),
              diaAnterior: previousDay <= previousEnd ? format(previousDay, 'dd/MM') : '--',
              atual: isCurrentPeriod ? currentAcc : null,
              anterior: isCurrentPeriod ? previousAcc : null,
              previsto: futureTotal > 0 && !isCurrentPeriod ? futureDay.value : null,
              atualDia: isCurrentPeriod ? currentDay.value : null,
              anteriorDia: isCurrentPeriod ? previousDayData.value : null,
              previstoDia: !isCurrentPeriod ? futureDay.value : 0,
            },
          ],
        };
      },
      {
        chartData: [] as Array<{
          dia: string;
          diaAnterior: string;
          atual: number | null;
          anterior: number | null;
          previsto: number | null;
          atualDia: number | null;
          anteriorDia: number | null;
          previstoDia: number;
        }>,
        currentAcc: 0,
        previousAcc: 0,
        currentCount: 0,
        previousCount: 0,
        bestDay: { label: '--', value: 0 },
      }
    );

    return {
      chartData: monthlyTotals.chartData,
      currentTotal: monthlyTotals.currentAcc,
      previousTotal: monthlyTotals.previousAcc,
      currentCount: monthlyTotals.currentCount,
      previousCount: monthlyTotals.previousCount,
      bestDay: monthlyTotals.bestDay,
      futureTotal,
      futureCount,
    };
  }, [leads]);
  const cumulativeData = monthlyEvolution.chartData;
  const monthDifference = monthlyEvolution.currentTotal - monthlyEvolution.previousTotal;
  const monthDifferencePercent =
    monthlyEvolution.previousTotal > 0
      ? (monthDifference / monthlyEvolution.previousTotal) * 100
      : monthlyEvolution.currentTotal > 0
        ? 100
        : 0;
  const monthTrendIsPositive = monthDifference >= 0;
  const formatDashboardCurrency = (value: number) => formatCurrencyBRL(value);
  const toggleMonthlySeries = (series: MonthlyEvolutionSeries) => {
    setVisibleMonthlySeries((current) => ({
      ...current,
      [series]: !current[series],
    }));
  };

  // Dashboard Stats Calculations
  const stats = useMemo(() => {
    const today = new Date();
    const todayStart = parseAgendaDate(format(today, 'yyyy-MM-dd')) || today;
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
    const total = leads.length;
    const activeProposals = leads.filter(l => l.status === 'Agendado').length;
    const closed = leads.filter(l => l.status === 'Fechado').length;
    const activeLeads = leads.filter((lead) => !isClosedLead(lead.status));
    const overdueFollowUpsList = leads.filter((lead) => {
      if (isClosedLead(lead.status)) return false;
      const followUpDate = getLeadFollowUpDate(lead);
      return !!followUpDate && isPast(followUpDate) && !isToday(followUpDate);
    });
    const dueFollowUpsToday = leads.filter((lead) => {
      if (isClosedLead(lead.status)) return false;
      const followUpDate = getLeadFollowUpDate(lead);
      return !!followUpDate && isToday(followUpDate);
    }).length;
    const noNextActionLeads = activeLeads.filter((lead) => !lead.proximoContato && !lead.dataServico);
    const staleNoAgendaLeads = noNextActionLeads.filter((lead) => {
      const activityDate = getLeadActivityDate(lead);
      return activityDate ? differenceInDays(today, activityDate) >= 3 : false;
    });
    const futureServices = leads.filter((lead) => {
      if (isClosedLead(lead.status) || getLeadServiceStatus(lead) === 'Concluido') return false;
      const serviceDate = getLeadServiceDate(lead);
      return !!serviceDate && serviceDate >= todayStart;
    });
    const servicesToday = futureServices.filter((lead) => {
      const serviceDate = getLeadServiceDate(lead);
      return serviceDate ? isSameDay(serviceDate, today) : false;
    }).length;
    const servicePipelineValue = futureServices
      .reduce((acc, curr) => acc + curr.value, 0);
    const weeklyCapacity = weekDays.map((day) => {
      const services = futureServices.filter((lead) => {
        const serviceDate = getLeadServiceDate(lead);
        return serviceDate ? isSameDay(serviceDate, day) : false;
      });
      return {
        label: format(day, 'EEE', { locale: ptBR }),
        day: format(day, 'dd/MM'),
        count: services.length,
        value: services.reduce((sum, lead) => sum + lead.value, 0),
      };
    });
    const serviceStatusCounts = leads.reduce<Record<ServiceStatus, number>>((acc, lead) => {
      if (!lead.dataServico) return acc;
      const serviceStatus = getLeadServiceStatus(lead);
      acc[serviceStatus] += 1;
      return acc;
    }, {
      Marcado: 0,
      Confirmado: 0,
      'Em Execucao': 0,
      Concluido: 0,
      Reagendar: 0,
    });
    const topServiceNeighborhood = leads
      .filter((lead) => !!lead.dataServico && getLeadServiceStatus(lead) !== 'Concluido')
      .reduce<Record<string, number>>((acc, lead) => {
        const key = lead.neighborhood || 'Sem bairro';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

    const revenue = leads
      .filter(l => l.status === 'Fechado')
      .reduce((acc, curr) => acc + curr.value, 0);

    const conversionRate = total > 0 ? Math.round((closed / total) * 100) : 0;
    const answeredLeads = activeLeads.filter((lead) => lead.status !== 'Novo' || !!lead.proximoContato || !!lead.dataServico).length;
    const responseRate = activeLeads.length > 0 ? Math.round((answeredLeads / activeLeads.length) * 100) : 0;

    const priorityRoute =
      Object.entries(topServiceNeighborhood).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sem rota';

    return {
      total,
      activeLeads: activeLeads.length,
      activeProposals,
      closed,
      revenue,
      conversionRate,
      responseRate,
      servicesToday,
      futureServices: futureServices.length,
      overdueFollowUps: overdueFollowUpsList.length,
      dueFollowUpsToday,
      noNextAction: noNextActionLeads.length,
      staleNoAgenda: staleNoAgendaLeads.length,
      servicePipelineValue,
      serviceStatusCounts,
      priorityRoute,
      weeklyCapacity,
    };
  }, [leads]);

  const targetPercent = Math.min(Math.round((stats.revenue / targetGoal) * 100), 100);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#04080f] font-sans lg:flex-row">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-bounce rounded-2xl border border-[#c9a227]/40 bg-[#07111d] px-6 py-4 text-sm font-semibold text-white shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c9a227] animate-ping" />
            {notification}
          </div>
        </div>
      )}

      {/* BACKGROUND ACCENTS */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
        <div className="absolute top-10 left-[15%] h-96 w-96 rounded-full bg-[#c9a227]/5 blur-[120px]" />
        <div className="absolute bottom-10 right-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[150px]" />
      </div>

      {/* SIDEBAR */}
      <aside className="sticky top-0 z-40 flex w-full flex-col border-b border-white/5 bg-[#07111d]/95 p-4 backdrop-blur-xl lg:relative lg:z-10 lg:w-72 lg:border-r lg:border-b-0 lg:p-6">
        <div className="flex items-center justify-between gap-3 lg:justify-start">
          <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#c9a227] to-[#d4ad30] p-0.5 shadow-lg shadow-[#c9a227]/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#04080f]">
              <svg className="h-5 w-5 text-[#c9a227]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="font-display text-lg font-black tracking-tight text-white">
              LUME <span className="text-[#c9a227]">CRM</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Painel Comercial</p>
          </div>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => openCreateModal()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227] text-[#04080f] shadow-lg shadow-[#c9a227]/10 transition active:scale-95"
              title="Novo Lead"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] text-white/45 transition hover:text-red-300 active:scale-95"
              title="Sair do CRM"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dynamic target counter in sidebar */}
        <div className="mt-8 hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 lg:block">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-white/60">Faturamento Mensal</span>
            <span className="text-[#c9a227]">{targetPercent}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/5 p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#c9a227] to-[#d4ad30] transition-all duration-1000 shadow-inner" 
              style={{ width: `${targetPercent}%` }} 
            />
          </div>
          <p className="mt-2 text-[10px] text-white/40 text-right">Meta: R$ {targetGoal.toLocaleString('pt-BR')}</p>
        </div>

        {/* Sidebar Nav */}
        <nav className="mt-4 flex flex-1 gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-none lg:flex-col lg:overflow-visible lg:pb-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex shrink-0 items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold tracking-wide transition-all lg:shrink ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-[#c9a227]/10 to-[#c9a227]/5 text-white border-l-4 border-[#c9a227]'
                : 'text-white/60 hover:bg-white/[0.02] hover:text-white border-l-4 border-transparent'
            }`}
          >
            <svg className={`h-5 w-5 transition-transform ${activeTab === 'dashboard' ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Painel Geral
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex shrink-0 items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold tracking-wide transition-all lg:shrink ${
              activeTab === 'leads'
                ? 'bg-gradient-to-r from-[#c9a227]/10 to-[#c9a227]/5 text-white border-l-4 border-[#c9a227]'
                : 'text-white/60 hover:bg-white/[0.02] hover:text-white border-l-4 border-transparent'
            }`}
          >
            <svg className={`h-5 w-5 transition-transform ${activeTab === 'leads' ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Controle de Leads
          </button>

          <button
            onClick={() => setActiveTab('historico')}
            className={`flex shrink-0 items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold tracking-wide transition-all lg:shrink ${
              activeTab === 'historico'
                ? 'bg-gradient-to-r from-[#c9a227]/10 to-[#c9a227]/5 text-white border-l-4 border-[#c9a227]'
                : 'text-white/60 hover:bg-white/[0.02] hover:text-white border-l-4 border-transparent'
            }`}
          >
            <svg className={`h-5 w-5 transition-transform ${activeTab === 'historico' ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            Histórico Supabase
          </button>

          <button
            onClick={() => setActiveTab('extratos')}
            className={`flex shrink-0 items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold tracking-wide transition-all lg:shrink ${
              activeTab === 'extratos'
                ? 'bg-gradient-to-r from-[#c9a227]/10 to-[#c9a227]/5 text-white border-l-4 border-[#c9a227]'
                : 'text-white/60 hover:bg-white/[0.02] hover:text-white border-l-4 border-transparent'
            }`}
          >
            <svg className={`h-5 w-5 transition-transform ${activeTab === 'extratos' ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 11h10M7 15h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
            Extratos Mensais
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`flex shrink-0 items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-semibold tracking-wide transition-all lg:shrink ${
              activeTab === 'agenda'
                ? 'bg-gradient-to-r from-red-500/10 to-[#c9a227]/5 text-white border-l-4 border-red-400'
                : 'text-white/60 hover:bg-white/[0.02] hover:text-white border-l-4 border-transparent'
            }`}
          >
            <svg className={`h-5 w-5 transition-transform ${activeTab === 'agenda' ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="flex-1 text-left">Agenda & Follow-up</span>
            {agendaUrgentCount > 0 && (
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-[10px] font-black text-white">
                {agendaUrgentCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action button at sidebar bottom */}
        <div className="hidden lg:mt-4 lg:block lg:space-y-2 lg:border-t lg:border-white/5 lg:pt-4">
          <button
            onClick={() => openCreateModal()}
            className="flex w-full items-center gap-3.5 rounded-2xl border-l-4 border-transparent bg-[#c9a227]/10 px-4 py-3.5 text-sm font-semibold tracking-wide text-[#f5d77a] transition-all hover:bg-[#c9a227]/15 hover:text-white active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Novo Lead
          </button>
          
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3.5 rounded-2xl border-l-4 border-transparent px-4 py-3.5 text-sm font-semibold tracking-wide text-white/60 transition-all hover:bg-red-500/10 hover:text-red-300 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair do CRM
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-10">
        
        {/* TOP NAVBAR */}
        <header className="mb-6 flex flex-col gap-3 border-b border-white/5 pb-4 sm:flex-row sm:items-center sm:justify-between lg:mb-8 lg:pb-6">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c9a227] sm:text-xs sm:tracking-[0.35em]">LUME Elite</span>
            <h2 className="font-display mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
              {activeTab === 'dashboard' && 'Painel Geral'}
              {activeTab === 'leads' && 'Gestão de Leads'}
              {activeTab === 'historico' && 'Histórico Supabase'}
              {activeTab === 'extratos' && 'Extratos Mensais'}
              {activeTab === 'agenda' && 'Agenda & Follow-up'}
            </h2>
          </div>
          
          {/* Quick Stats Summary inside navbar */}
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-xs text-white/40">Status da Sessão:</span>
            <span
              title={[
                crmSync.message,
                crmSync.details,
                lastCloudCheckAt ? `Ultima conferencia: ${format(new Date(lastCloudCheckAt), 'HH:mm:ss')}` : '',
              ].filter(Boolean).join(' - ')}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                crmSync.status === 'error'
                  ? 'border-red-500/25 bg-red-500/10 text-red-300'
                  : crmSync.status === 'warning'
                    ? 'border-[#c9a227]/25 bg-[#c9a227]/10 text-[#f5d77a]'
                    : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  crmSync.status === 'error'
                    ? 'bg-red-400'
                    : crmSync.status === 'warning'
                      ? 'animate-pulse bg-[#f5d77a]'
                      : 'bg-emerald-400'
                }`}
              />
              {crmSync.status === 'error' ? 'Erro' : crmSync.status === 'warning' ? (crmSync.message.includes('Salvando') || crmSync.message.includes('Excluindo') ? 'Salvando' : 'Sincronizando') : 'Salvo'}
            </span>
            <button
              type="button"
              onClick={handleVerifyCloudLeads}
              disabled={isVerifyingCloud}
              className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/70 transition hover:border-[#c9a227]/30 hover:text-[#f5d77a] disabled:cursor-not-allowed disabled:opacity-50"
              title="Buscar um snapshot novo do Supabase e comparar com o que esta na tela"
            >
              {isVerifyingCloud ? 'Conferindo...' : 'Verificar'}
            </button>
          </div>
        </header>

        <section hidden
          className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
            crmSync.status === 'error'
              ? 'border-red-500/25 bg-red-500/10 text-red-100'
              : crmSync.status === 'warning'
                ? 'border-[#c9a227]/25 bg-[#c9a227]/10 text-[#f5d77a]'
                : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
          }`}
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-bold">
                {crmSync.status === 'error' ? 'Erro de Supabase' : crmSync.status === 'warning' ? 'Sincronização em andamento' : 'Supabase conectado'}
              </p>
              <p className="mt-0.5 text-xs opacity-75">{crmSync.message}</p>
              {crmSync.details && (
                <p className="mt-2 rounded-xl border border-current/10 bg-black/15 px-3 py-2 text-xs opacity-80">
                  {crmSync.details}
                </p>
              )}
            </div>
            {crmSync.status === 'error' && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-2 w-fit rounded-xl border border-current/20 px-3 py-1.5 text-xs font-bold transition hover:bg-white/10 sm:mt-0"
              >
                Recarregar
              </button>
            )}
          </div>
        </section>

        {/* TAB CONTENTS */}

        {/* 1. DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* KPI STAT CARDS */}
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              
              <div className="rounded-2xl border border-white/5 bg-[#07111d]/50 p-3.5 backdrop-blur-md shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#c9a227]/20 sm:p-4 group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">Serviços Futuros</span>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-1.5 text-[#c9a227] transition group-hover:border-[#c9a227]/30">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">{stats.futureServices}</span>
                  <span className="text-[11px] text-white/40">{stats.servicesToday} hoje</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAgendaInitialView('sem_acao');
                  setActiveTab('agenda');
                }}
                className="group rounded-2xl border border-red-500/30 bg-[linear-gradient(135deg,rgba(239,68,68,0.18),rgba(127,29,29,0.10))] p-3.5 text-left shadow-lg shadow-red-950/20 transition-all duration-300 hover:border-red-400/40 sm:p-4"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-red-100/70">Alerta Comercial</span>
                  <div className="rounded-lg border border-red-200/10 bg-red-200/10 p-1.5 text-red-100 transition group-hover:border-red-200/20">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86 1.82 18a2.25 2.25 0 0 0 1.93 3.38h16.5A2.25 2.25 0 0 0 22.18 18L13.71 3.86a2.25 2.25 0 0 0-3.42 0Z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black text-white">{stats.staleNoAgenda}</span>
                  <p className="mt-1 text-[11px] text-red-50/75">leads sem agenda ha 3+ dias</p>
                  <p className="mt-2 text-[11px] text-red-100/55">Abrir fila sem acao</p>
                </div>
              </button>

              <div className="rounded-2xl border border-white/5 bg-[#07111d]/50 p-3.5 backdrop-blur-md shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#c9a227]/20 sm:p-4 group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">Sem Próxima Ação</span>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-1.5 text-emerald-400 transition group-hover:border-[#c9a227]/30">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">{stats.noNextAction}</span>
                  <span className="text-[11px] text-white/40">{stats.staleNoAgenda} há 3+ dias</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#07111d]/50 p-3.5 backdrop-blur-md shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#c9a227]/20 sm:p-4 group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">Previsão por Serviço</span>
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-1.5 text-[#c9a227] transition group-hover:border-[#c9a227]/30">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V5" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 flex flex-col">
                  <span className="text-xl font-black tracking-tight text-[#c9a227]">{formatDashboardCurrency(stats.servicePipelineValue)}</span>
                  <span className="mt-1 text-[11px] text-white/45">{stats.responseRate}% taxa de resposta</span>
                  <span className="mt-0.5 text-[10px] font-bold uppercase text-white/40">{stats.priorityRoute}</span>
                </div>
              </div>

            </section>

            {false && (
              <section className="rounded-3xl border border-red-500/30 bg-[linear-gradient(135deg,rgba(239,68,68,0.18),rgba(127,29,29,0.10))] p-5 shadow-2xl shadow-red-950/20">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-red-200/80">Alerta comercial</p>
                    <h3 className="mt-2 text-2xl font-black text-white">
                      {stats.staleNoAgenda} leads sem agenda há 3+ dias
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm text-red-50/70">
                      Esses leads não têm retorno nem data de serviço. Priorize contato ou marque a próxima ação antes de abrir novas oportunidades.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAgendaInitialView('sem_acao');
                      setActiveTab('agenda');
                    }}
                    className="rounded-2xl border border-red-200/20 bg-red-200/10 px-5 py-3 text-sm font-bold text-red-50 transition hover:bg-red-200/15"
                  >
                    Abrir fila sem ação
                  </button>
                </div>
              </section>
            )}

            {/* EVOLUÇÃO DO MÊS */}
            <div className="overflow-hidden rounded-3xl border border-[#c9a227]/15 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.16),transparent_34%),linear-gradient(180deg,rgba(7,17,29,0.92),rgba(4,8,15,0.86))] p-5 shadow-2xl shadow-black/25 backdrop-blur-md sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#f5d77a]/80">Fechamentos acumulados</span>
                  <h3 className="font-display mt-1 text-xl font-black uppercase tracking-wider text-white">EVOLUÇÃO DO MÊS</h3>
                  <p className="mt-2 max-w-2xl text-xs leading-5 text-white/45">
                    Comparativo acumulado contra o mês anterior no mesmo intervalo, com previsão separada para serviços futuros.
                  </p>
                </div>

                <div
                  className={`w-fit rounded-2xl border px-4 py-3 text-left shadow-lg ${
                    monthTrendIsPositive
                      ? 'border-emerald-500/25 bg-emerald-500/10 shadow-emerald-950/20'
                      : 'border-red-500/25 bg-red-500/10 shadow-red-950/20'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Vs. mês anterior</p>
                  <p className={`mt-1 text-2xl font-black ${monthTrendIsPositive ? 'text-emerald-300' : 'text-red-300'}`}>
                    {monthTrendIsPositive ? '+' : '-'}
                    {Math.abs(monthDifferencePercent).toFixed(1)}%
                  </p>
                  <p className="text-[11px] text-white/50">
                    {monthTrendIsPositive ? '+' : '-'}
                    {formatDashboardCurrency(Math.abs(monthDifference))}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/5 bg-white/[0.035] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">Mês atual</p>
                  <p className="mt-2 text-xl font-black text-[#f5d77a]">{formatDashboardCurrency(monthlyEvolution.currentTotal)}</p>
                  <p className="mt-1 text-[11px] text-white/40">{monthlyEvolution.currentCount} fechamentos até hoje</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">Mês anterior</p>
                  <p className="mt-2 text-xl font-black text-white/75">{formatDashboardCurrency(monthlyEvolution.previousTotal)}</p>
                  <p className="mt-1 text-[11px] text-white/40">{monthlyEvolution.previousCount} fechamentos no mesmo período</p>
                </div>
                <div className="rounded-2xl border border-sky-400/15 bg-sky-400/[0.045] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-200/60">Ganhos futuros</p>
                  <p className="mt-2 text-xl font-black text-sky-200">{formatDashboardCurrency(monthlyEvolution.futureTotal)}</p>
                  <p className="mt-1 text-[11px] text-white/40">{monthlyEvolution.futureCount} serviços agendados</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">Diferença</p>
                  <p className={`mt-2 text-xl font-black ${monthTrendIsPositive ? 'text-emerald-300' : 'text-red-300'}`}>
                    {formatDashboardCurrency(Math.abs(monthDifference))}
                  </p>
                  <p className="mt-1 text-[11px] text-white/40">{monthTrendIsPositive ? 'acima do período anterior' : 'abaixo do período anterior'}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-white/55">
                <button
                  type="button"
                  onClick={() => toggleMonthlySeries('atualDia')}
                  aria-pressed={visibleMonthlySeries.atualDia}
                  className={`inline-flex items-center gap-2 rounded-full transition hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/40 ${visibleMonthlySeries.atualDia ? 'text-white/55' : 'text-white/25'}`}
                  title="Mostrar ou ocultar Valor do dia"
                >
                  <span className="h-2 w-8 rounded-full bg-[#38bdf8] shadow-[0_0_18px_rgba(56,189,248,0.5)]" />
                  Valor do dia
                </button>
                <button
                  type="button"
                  onClick={() => toggleMonthlySeries('atual')}
                  aria-pressed={visibleMonthlySeries.atual}
                  className={`inline-flex items-center gap-2 rounded-full transition hover:text-white focus:outline-none focus:ring-2 focus:ring-[#f5d77a]/35 ${visibleMonthlySeries.atual ? 'text-white/55' : 'text-white/25'}`}
                  title="Mostrar ou ocultar Mês atual acumulado"
                >
                  <span className="h-2 w-8 rounded-full bg-[#f5d77a] shadow-[0_0_18px_rgba(245,215,122,0.45)]" />
                  Mês atual acumulado
                </button>
                <button
                  type="button"
                  onClick={() => toggleMonthlySeries('anterior')}
                  aria-pressed={visibleMonthlySeries.anterior}
                  className={`inline-flex items-center gap-2 rounded-full transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25 ${visibleMonthlySeries.anterior ? 'text-white/55' : 'text-white/25'}`}
                  title="Mostrar ou ocultar Mês anterior"
                >
                  <span className="h-0 w-8 border-t border-dashed border-white/35" />
                  Mês anterior
                </button>
                <button
                  type="button"
                  onClick={() => toggleMonthlySeries('previsto')}
                  aria-pressed={visibleMonthlySeries.previsto}
                  className={`inline-flex items-center gap-2 rounded-full transition hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/40 ${visibleMonthlySeries.previsto ? 'text-white/55' : 'text-white/25'}`}
                  title="Mostrar ou ocultar Ganhos previstos"
                >
                  <span className="h-0 w-8 border-t-2 border-dashed border-sky-300" />
                  Ganhos previstos
                </button>
              </div>

              {monthlyEvolution.currentTotal === 0 && monthlyEvolution.previousTotal === 0 && monthlyEvolution.futureTotal === 0 ? (
                <p className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] py-10 text-center text-xs text-white/30">
                  Nenhum fechamento ou serviço futuro registrado nos períodos comparados
                </p>
              ) : (
                <div className="mt-3 h-[280px] rounded-2xl border border-white/5 bg-[#04080f]/35 px-2 py-4 sm:px-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={cumulativeData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="currentMonthRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f5d77a" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#f5d77a" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey="dia" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.45)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                      <YAxis
                        tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.42)' }}
                        tickFormatter={(v: number) => `R$${(v / 1000).toFixed(1)}k`}
                        width={56}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ stroke: 'rgba(245,215,122,0.25)', strokeWidth: 1 }}
                        content={({ active, payload, label }: { active?: boolean; payload?: MonthlyTooltipPayload[]; label?: string }) => {
                          const point = payload?.[0]?.payload;
                          if (!active || !point) return null;
                          return (
                            <div className="min-w-52 rounded-2xl border border-white/10 bg-[#07111d]/95 p-4 text-xs shadow-2xl shadow-black/30 backdrop-blur-xl">
                              <p className="font-bold uppercase tracking-[0.2em] text-white/40">Dia {label}</p>
                              <div className="mt-3 space-y-2">
                                {visibleMonthlySeries.atual && (
                                  <div className="flex items-center justify-between gap-5">
                                    <span className="text-[#f5d77a]">Atual acumulado</span>
                                    <span className="font-bold text-white">{point.atual === null ? '--' : formatDashboardCurrency(point.atual)}</span>
                                  </div>
                                )}
                                {visibleMonthlySeries.atualDia && (
                                  <div className="flex items-center justify-between gap-5">
                                    <span className="text-[#38bdf8]">Atual no dia</span>
                                    <span className="font-bold text-white">{point.atualDia === null ? '--' : formatDashboardCurrency(point.atualDia)}</span>
                                  </div>
                                )}
                                {visibleMonthlySeries.previsto && point.previsto !== null && (
                                  <div className="border-t border-sky-300/15 pt-2">
                                    <div className="flex items-center justify-between gap-5">
                                      <span className="text-sky-200">Ganhos futuros</span>
                                      <span className="font-bold text-white">{formatDashboardCurrency(point.previsto)}</span>
                                    </div>
                                  </div>
                                )}
                                {visibleMonthlySeries.anterior && (
                                  <div className="border-t border-white/10 pt-2">
                                    <div className="flex items-center justify-between gap-5">
                                      <span className="text-white/45">Anterior acumulado</span>
                                      <span className="font-bold text-white/70">{point.anterior === null ? '--' : formatDashboardCurrency(point.anterior)}</span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between gap-5">
                                      <span className="text-white/35">Anterior em {point.diaAnterior}</span>
                                      <span className="font-semibold text-white/55">{point.anteriorDia === null ? '--' : formatDashboardCurrency(point.anteriorDia)}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }}
                      />
                      {visibleMonthlySeries.atual && <Area type="monotone" dataKey="atual" stroke="none" fill="url(#currentMonthRevenue)" />}
                      {visibleMonthlySeries.anterior && <Line type="monotone" dataKey="anterior" stroke="rgba(255,255,255,0.34)" strokeWidth={2} strokeDasharray="6 7" dot={false} activeDot={{ r: 4, fill: '#ffffff' }} />}
                      {visibleMonthlySeries.previsto && <Line type="monotone" dataKey="previsto" stroke="#7dd3fc" strokeWidth={3} strokeDasharray="5 7" dot={false} activeDot={{ r: 6, fill: '#7dd3fc', stroke: '#07111d', strokeWidth: 3 }} />}
                      {visibleMonthlySeries.atual && <Line type="monotone" dataKey="atual" stroke="#f5d77a" strokeWidth={2} strokeOpacity={0.88} dot={false} activeDot={{ r: 5, fill: '#f5d77a', stroke: '#07111d', strokeWidth: 3 }} />}
                      {visibleMonthlySeries.atualDia && <Line type="monotone" dataKey="atualDia" stroke="#38bdf8" strokeWidth={4} dot={false} activeDot={{ r: 7, fill: '#38bdf8', stroke: '#07111d', strokeWidth: 3 }} />}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* CHARTS / TARGET & FUNNEL DETAILS */}
            <div className="grid gap-6 lg:grid-cols-3">
              
              {/* Funnel distribution panel */}
              <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 backdrop-blur-md shadow-lg lg:col-span-2">
                <h3 className="font-display text-base font-bold text-white uppercase tracking-wider mb-6">Distribuição Comercial do Funil</h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Novos Leads', stage: 'Novo', color: 'bg-blue-500' },
                    { label: 'Em Atendimento', stage: 'Em Contato', color: 'bg-amber-500' },
                    { label: 'Agendados', stage: 'Agendado', color: 'bg-sky-500' },
                    { label: 'Contratos Fechados', stage: 'Fechado', color: 'bg-emerald-500' },
                    { label: 'Perdidos / Descartados', stage: 'Perdido', color: 'bg-red-500' },
                  ].map(item => {
                    const count = leads.filter(l => l.status === item.stage).length;
                    const percent = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
                    return (
                      <div key={item.stage} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-white/60">{item.label}</span>
                          <span className="text-white">{count} ({percent}%)</span>
                        </div>
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Targets panel */}
              <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 backdrop-blur-md shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-white uppercase tracking-wider mb-1">Meta de Vendas</h3>
                  <p className="text-xs text-white/50">Progresso do consultor LUME</p>
                </div>
                
                <div className="my-6 flex flex-col items-center">
                  <div className="relative flex h-32 w-32 items-center justify-center">
                    {/* Ring background */}
                    <svg className="absolute top-0 left-0 h-full w-full -rotate-90">
                      <circle cx="64" cy="64" r="54" className="stroke-white/5" strokeWidth="8" fill="transparent" />
                      <circle cx="64" cy="64" r="54" className="stroke-[#c9a227]" strokeWidth="8" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 54}
                        strokeDashoffset={2 * Math.PI * 54 * (1 - targetPercent / 100)}
                      />
                    </svg>
                    <div className="text-center">
                      <span className="text-3xl font-black text-white">{targetPercent}%</span>
                      <p className="text-[10px] text-white/40 uppercase font-semibold">Metas</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-4 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-white/40">Faturamento Atual:</span>
                    <span className="text-white">R$ {stats.revenue.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Meta Estabelecida:</span>
                    <span className="text-[#c9a227] flex items-center gap-1.5">
                      {editingTarget ? (
                        <input
                          type="number"
                          value={targetInput}
                          onChange={(e) => setTargetInput(e.target.value)}
                          onBlur={() => { const v = parseInt(targetInput); if (v > 0) saveTargetGoal(v); else setEditingTarget(false); }}
                          onKeyDown={(e) => { if (e.key === 'Enter') { const v = parseInt(targetInput); if (v > 0) saveTargetGoal(v); } if (e.key === 'Escape') setEditingTarget(false); }}
                          className="w-24 rounded-lg border border-[#c9a227]/40 bg-[#04080f] px-2 py-0.5 text-xs text-white text-right focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <>
                          R$ {targetGoal.toLocaleString('pt-BR')}
                          <button onClick={() => { setTargetInput(String(targetGoal)); setEditingTarget(true); }} className="text-white/30 hover:text-white/60 transition" title="Editar meta">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <section className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-5 shadow-lg shadow-black/20 backdrop-blur-md">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5d77a]/75">Capacidade da semana</p>
                  <h3 className="mt-1 text-lg font-black text-white">Serviços por dia e valor previsto</h3>
                </div>
                <p className="text-sm font-semibold text-white/55">{formatDashboardCurrency(stats.servicePipelineValue)} em serviços futuros</p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
                {stats.weeklyCapacity.map((day) => (
                  <div key={`${day.day}-${day.label}`} className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">{day.label}</p>
                    <p className="mt-1 text-sm font-semibold text-white/70">{day.day}</p>
                    <p className="mt-3 text-2xl font-black text-white">{day.count}</p>
                    <p className="mt-1 text-[11px] text-white/40">serviços</p>
                    <p className="mt-2 text-xs font-bold text-[#f5d77a]">{formatDashboardCurrency(day.value)}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* RECENT LEADS & ACTIONS */}
            <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 backdrop-blur-md shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display text-base font-bold text-white uppercase tracking-wider">Leads Recentes no Funil</h3>
                  <p className="text-xs text-white/40">Últimos clientes adicionados ao LUME CRM</p>
                </div>
                <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setAgendaInitialView('hoje');
              setActiveTab('agenda');
            }}
                    className="text-xs font-bold text-red-300 hover:underline"
                  >
                    Ir para a agenda →
                  </button>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs font-bold text-[#c9a227] hover:underline"
                  >
                    Ver todos os leads →
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-white/80">
                  <thead>
                    <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-white/40">
                      <th className="pb-3 font-semibold">Cliente</th>
                      <th className="pb-3 font-semibold">Bairro</th>
                      <th className="pb-3 font-semibold">Película</th>
                      <th className="pb-3 font-semibold">Valor</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads.slice(0, 3).map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/[0.01] cursor-pointer" onClick={() => setLeadDetail(lead)}>
                        <td className="py-3.5 font-semibold text-white">
                          <div className="flex flex-col">
                            <span className="border-b border-dotted border-white/20 hover:border-[#c9a227]/60 transition">{lead.name}</span>
                            <span className="text-xs font-normal text-white/40">{lead.phone}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-white/70">{lead.neighborhood}</td>
                        <td className="py-3.5">
                          <span className="inline-flex rounded-lg border border-white/5 bg-white/[0.02] px-2 py-0.5 text-xs text-white/70">
                            {lead.filmType}
                          </span>
                        </td>
                        <td className="py-3.5 font-bold text-[#c9a227]">R$ {formatCurrency(lead.value)}</td>
                        <td className="py-3.5">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getLeadStatusClasses(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-white/40 font-semibold">Nenhum lead registrado no sistema.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 2. LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            
            {/* SEARCH & FILTERS BAR */}
            <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#07111d]/50 p-4 backdrop-blur-md shadow-lg sm:rounded-3xl sm:p-6 lg:flex-row lg:items-center">
              
              {/* Search Field */}
              <div className="relative flex-1">
                <svg className="absolute left-4 top-3.5 h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Pesquisar por nome, telefone, observações..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/5 bg-white/[0.02] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-[#c9a227]/40 focus:outline-none focus:ring-1 focus:ring-[#c9a227]/40"
                />
              </div>

              {/* Filters dropdowns */}
              <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 lg:w-auto">
                
                <select
                  value={filterNeighborhood}
                  onChange={(e) => setFilterNeighborhood(e.target.value)}
                  className="min-w-0 rounded-2xl border border-white/5 bg-[#04080f] px-3 py-3 text-sm text-white/70 focus:border-[#c9a227]/40 focus:outline-none sm:px-4"
                >
                  <option value="">Todos os Bairros</option>
                  {RJ_NEIGHBORHOODS.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="min-w-0 rounded-2xl border border-white/5 bg-[#04080f] px-3 py-3 text-sm text-white/70 focus:border-[#c9a227]/40 focus:outline-none sm:px-4"
                >
                  <option value="">Todos os Status</option>
                  <option value="Novo">Novo</option>
                  <option value="Em Contato">Em Contato</option>
                  <option value="Agendado">Agendado</option>
                  <option value="Fechado">Fechado</option>
                  <option value="Perdido">Perdido</option>
                </select>

                {/* View Mode Toggles */}
                <div className="col-span-2 flex rounded-2xl border border-white/5 bg-[#04080f] p-1 sm:col-span-1">
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`flex-1 rounded-xl px-3 py-2 transition sm:flex-none sm:py-1.5 ${viewMode === 'kanban' ? 'bg-[#c9a227] text-[#04080f]' : 'text-white/60 hover:text-white'}`}
                    title="Visão Kanban"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex-1 rounded-xl px-3 py-2 transition sm:flex-none sm:py-1.5 ${viewMode === 'table' ? 'bg-[#c9a227] text-[#04080f]' : 'text-white/60 hover:text-white'}`}
                    title="Visão Tabela"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {viewMode === 'kanban' && (
                  <div className="col-span-2 flex rounded-2xl border border-white/5 bg-[#04080f] p-1 sm:col-span-1">
                    <button
                      onClick={() => setCollapsedStateForAllLeads(true)}
                      className="flex-1 rounded-xl px-3 py-2 text-xs font-semibold text-white/60 transition hover:text-white sm:flex-none sm:py-1.5"
                      title="Colapsar todos os cards"
                    >
                      Collapse all
                    </button>
                    <button
                      onClick={() => setCollapsedStateForAllLeads(false)}
                      className="flex-1 rounded-xl px-3 py-2 text-xs font-semibold text-white/60 transition hover:text-white sm:flex-none sm:py-1.5"
                      title="Expandir todos os cards"
                    >
                      Expand all
                    </button>
                  </div>
                )}

              </div>

            </div>

            {/* DYNAMIC LEADS VIEWS */}

            {/* A. KANBAN BOARD */}
            {viewMode === 'kanban' && (() => {
              const stageStyles: Record<string, { border: string; headerBg: string; badge: string }> = {
                'Novo': {
                  border: 'border-blue-500/20 hover:border-blue-500/40',
                  headerBg: 'bg-blue-500/10 text-blue-400',
                  badge: 'bg-blue-500/20 text-blue-300'
                },
                'Em Contato': {
                  border: 'border-amber-500/20 hover:border-amber-500/40',
                  headerBg: 'bg-amber-500/10 text-amber-400',
                  badge: 'bg-amber-500/20 text-amber-300'
                },
                'Agendado': {
                  border: 'border-purple-500/20 hover:border-purple-500/40',
                  headerBg: 'bg-purple-500/10 text-purple-400',
                  badge: 'bg-purple-500/20 text-purple-300'
                },
                'Fechado': {
                  border: 'border-emerald-500/20 hover:border-emerald-500/40',
                  headerBg: 'bg-emerald-500/10 text-emerald-400',
                  badge: 'bg-emerald-500/20 text-emerald-300'
                },
                'Perdido': {
                  border: 'border-red-500/20 hover:border-red-500/40',
                  headerBg: 'bg-red-500/10 text-red-400',
                  badge: 'bg-red-500/20 text-red-300'
                }
              };
              
              return (
                <div className="grid gap-3 pb-4 md:grid-cols-5 md:gap-4">
                  {LEAD_STAGES.map(stage => {
                    const stageLeads = filteredLeads.filter(l => l.status === stage);
                    const style = stageStyles[stage] || {
                      border: 'border-white/5',
                      headerBg: 'bg-white/5 text-white/50',
                      badge: 'bg-white/5 text-white/80'
                    };
                    
                    return (
                      <div
                        key={stage}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          try {
                            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                            if (data.fromStage !== stage) handleStatusChange(data.id, stage as Lead['status']);
                          } catch {
                            return;
                          }
                        }}
                        className={`flex min-h-0 flex-col rounded-2xl border ${style.border} bg-[#07111d]/30 p-3 transition duration-300 md:min-h-[500px] md:rounded-3xl md:p-4`}
                      >
                        
                        {/* Column Header */}
                        <div className={`flex justify-between items-center mb-4 border-b border-white/5 pb-2 px-2 py-1 rounded-xl ${style.headerBg}`}>
                          <span className="text-xs font-black uppercase tracking-wider">{stage}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${style.badge}`}>{stageLeads.length}</span>
                        </div>

                      {/* Leads Cards Container */}
                      <div className="flex-1 space-y-3 overflow-y-auto">
                        {stageLeads.map(lead => {
                          const collapsed = collapsedCards.has(lead.id);
                          const serviceDate = getLeadServiceDate(lead);
                          return (
                          <div 
                            key={lead.id}
                            draggable
                            onDragStart={(e) => { e.dataTransfer.setData('text/plain', JSON.stringify({ id: lead.id, fromStage: stage })); e.currentTarget.classList.add('opacity-40'); }}
                            onDragEnd={(e) => e.currentTarget.classList.remove('opacity-40')}
                            onDoubleClick={() => handleLeadTableRowDoubleClick(lead)}
                            title="Duplo clique para editar este lead"
                            className="group relative rounded-2xl border border-white/5 bg-[#04080f]/90 p-3 shadow-md transition hover:border-[#c9a227]/30 md:p-2.5 md:cursor-grab md:active:cursor-grabbing"
                          >
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const next = new Set(collapsedCards);
                                  if (collapsed) {
                                    next.delete(lead.id);
                                  } else {
                                    next.add(lead.id);
                                  }
                                  setCollapsedCards(next);
                                }}
                                onDoubleClick={(e) => e.stopPropagation()}
                                className="shrink-0 text-white/30 hover:text-white/60 transition"
                                title={collapsed ? 'Expandir' : 'Colapsar'}
                              >
                                <svg className={`h-3 w-3 transition ${collapsed ? '' : 'rotate-90'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLeadDetail(lead);
                                }}
                                onDoubleClick={(e) => {
                                  e.stopPropagation();
                                  void openEditModal(lead);
                                }}
                                className="text-left flex-1 min-w-0"
                              >
                                <h4 className="font-bold text-white text-xs border-b border-dotted border-white/20 hover:border-[#c9a227]/60 transition truncate">{lead.name}</h4>
                              </button>
                            </div>

                            {collapsed ? (
                              <div className="flex justify-between items-center mt-1.5">
                                <span className="text-xs text-white/50 truncate">{lead.phone}</span>
                                <span className="text-xs font-black text-[#c9a227] shrink-0">R$ {formatCurrency(lead.value)}</span>
                              </div>
                            ) : (
                              <>
                            <p className="text-[11px] text-white/40 mt-1">{lead.phone}</p>
                            <p className="text-[11px] text-white/40 mt-0.5 flex items-center gap-1">
                              <svg className="h-2.5 w-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                              {lead.sqm.toFixed(2)} m²
                            </p>
                            <p className="text-[11px] text-[#c9a227]/70 mt-0.5 font-semibold flex items-center gap-1">
                              <svg className="h-2.5 w-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <circle cx="12" cy="12" r="1.5" />
                              </svg>
                              {lead.neighborhood}
                            </p>
                            {serviceDate && (
                              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-sky-300/80">
                                <svg className="h-2.5 w-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Serviço {format(serviceDate, 'dd/MM')}
                              </p>
                            )}

                            <div className="mt-2 flex justify-between items-center border-t border-white/5 pt-1.5">
                              <span className="text-[10px] font-semibold text-white/60 bg-white/5 rounded px-1.5 py-0.5">{lead.filmType}</span>
                              <span className="flex items-center gap-2">
                                <span className="text-[10px] text-white/30 font-mono">{daysInStatus(lead)}d</span>
                                <span className="text-xs font-black text-[#c9a227]">R$ {formatCurrency(lead.value)}</span>
                              </span>
                            </div>

                            {/* Hover Edit/Delete/Action buttons */}
                            <div className="mt-2 flex justify-between items-center gap-1.5 border-t border-white/5 pt-1.5 opacity-100 transition duration-300 md:opacity-0 md:group-hover:opacity-100">
                              <button
                                disabled={stage === 'Novo'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const stages = LEAD_STAGES;
                                  const idx = stages.indexOf(stage);
                                  if (idx > 0) handleStatusChange(lead.id, stages[idx - 1]);
                                }}
                                onDoubleClick={(e) => e.stopPropagation()}
                                className="p-0.5 rounded bg-white/5 text-white/50 hover:text-[#c9a227] disabled:opacity-20 text-[11px] leading-none"
                                title="Mover para esquerda"
                              >
                                &larr;
                              </button>

                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    void openEditModal(lead);
                                  }}
                                  onDoubleClick={(e) => e.stopPropagation()}
                                  className="text-white/40 hover:text-white"
                                  title="Editar"
                                >
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    void handleDeleteLead(lead.id);
                                  }}
                                  onDoubleClick={(e) => e.stopPropagation()}
                                  className="text-white/30 hover:text-red-400"
                                  title="Excluir"
                                >
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>

                              <button
                                disabled={stage === 'Perdido'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const stages = LEAD_STAGES;
                                  const idx = stages.indexOf(stage);
                                  if (idx < stages.length - 1) handleStatusChange(lead.id, stages[idx + 1]);
                                }}
                                onDoubleClick={(e) => e.stopPropagation()}
                                className="p-0.5 rounded bg-white/5 text-white/50 hover:text-[#c9a227] disabled:opacity-20 text-[11px] leading-none"
                                title="Mover para direita"
                              >
                                &rarr;
                              </button>
                            </div>
                            </>
                            )}

                          </div>
                          );
                        })}

                        {stageLeads.length === 0 && (
                          <div className="border-2 border-dashed border-white/5 rounded-2xl p-6 text-center text-xs text-white/20 select-none">
                            Coluna Vazia
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )})()}

            {/* B. LIST TABLE VIEW */}
            {viewMode === 'table' && (
              <div className="rounded-2xl border border-white/5 bg-[#07111d]/50 p-4 backdrop-blur-md shadow-lg sm:rounded-3xl sm:p-6 md:overflow-x-auto">
                <div className="space-y-3 md:hidden">
                  {sortedFilteredLeads.map((lead) => (
                    <article key={lead.id} className="rounded-2xl border border-white/5 bg-[#04080f]/85 p-4">
                      <button onClick={() => setLeadDetail(lead)} className="w-full text-left">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-white">{lead.name}</h3>
                            <p className="mt-1 text-xs text-white/40">{lead.phone || 'Sem telefone'}</p>
                          </div>
                          <span className="shrink-0 text-sm font-black text-[#c9a227]">R$ {formatCurrency(lead.value)}</span>
                        </div>
                      </button>

                      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                        <span className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-white/60">{lead.neighborhood}</span>
                        <span className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-white/60">{lead.filmType}</span>
                        {getLeadServiceDate(lead) && (
                          <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 font-semibold text-sky-300">
                            Serviço {format(getLeadServiceDate(lead)!, 'dd/MM')}
                          </span>
                        )}
                        <span className={`rounded-full border px-2.5 py-1 font-bold uppercase tracking-wider ${getLeadStatusClasses(lead.status)}`}>{lead.status}</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-xs text-white/40">{lead.sqm.toFixed(2)}m² · {daysInStatus(lead)}d no status</span>
                        <div className="flex gap-3">
                          <button onClick={() => openEditModal(lead)} className="text-xs font-semibold text-white/60 hover:text-white">Editar</button>
                          <button onClick={() => handleDeleteLead(lead.id)} className="text-xs font-semibold text-red-300/70 hover:text-red-300">Excluir</button>
                        </div>
                      </div>
                    </article>
                  ))}
                  {filteredLeads.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm font-semibold text-white/30">
                      Nenhum lead encontrado com estes filtros.
                    </div>
                  )}
                </div>

                <table className="hidden w-full border-collapse text-left text-sm text-white/80 md:table">
                  <thead>
                    <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-white/40">
                      <th className="pb-3 font-semibold cursor-pointer hover:text-white select-none" onClick={() => toggleSort('name')}>
                        Cliente {sortKey === 'name' && <span className="text-[#c9a227] ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="pb-3 font-semibold cursor-pointer hover:text-white select-none" onClick={() => toggleSort('neighborhood')}>
                        Bairro {sortKey === 'neighborhood' && <span className="text-[#c9a227] ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="pb-3 font-semibold cursor-pointer hover:text-white select-none" onClick={() => toggleSort('filmType')}>
                        Película {sortKey === 'filmType' && <span className="text-[#c9a227] ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="pb-3 font-semibold text-center cursor-pointer hover:text-white select-none" onClick={() => toggleSort('sqm')}>
                        Área (m²) {sortKey === 'sqm' && <span className="text-[#c9a227] ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="pb-3 font-semibold text-right cursor-pointer hover:text-white select-none" onClick={() => toggleSort('value')}>
                        Valor {sortKey === 'value' && <span className="text-[#c9a227] ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="pb-3 font-semibold text-center cursor-pointer hover:text-white select-none" onClick={() => toggleSort('status')}>
                        Status {sortKey === 'status' && <span className="text-[#c9a227] ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="pb-3 font-semibold text-center cursor-pointer hover:text-white select-none" onClick={() => toggleSort('dataServico')}>
                        Serviço {sortKey === 'dataServico' && <span className="text-[#c9a227] ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                      <th className="pb-3 font-semibold text-center">Dias</th>
                      <th className="pb-3 font-semibold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sortedFilteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="group cursor-pointer hover:bg-white/[0.01]"
                        onClick={() => handleLeadTableRowClick(lead)}
                        onDoubleClick={() => handleLeadTableRowDoubleClick(lead)}
                        title="Clique para ver detalhes. Duplo clique para editar."
                      >
                        <td className="py-3.5 font-semibold text-white">
                          <div className="flex flex-col">
                            <span className="border-b border-dotted border-white/20 hover:border-[#c9a227]/60 transition">{lead.name}</span>
                            <span className="text-xs font-normal text-white/40">{lead.phone}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-white/70">{lead.neighborhood}</td>
                        <td className="py-3.5">
                          <span className="inline-flex rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-0.5 text-xs text-white/70">
                            {lead.filmType}
                          </span>
                        </td>
                        <td className="py-3.5 text-center font-mono">{lead.sqm.toFixed(2)}m²</td>
                        <td className="py-3.5 text-right font-bold text-[#c9a227]">R$ {formatCurrency(lead.value)}</td>
                        <td className="py-3.5 text-center">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getLeadStatusClasses(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-center text-xs font-semibold text-sky-300">
                          {getLeadServiceDate(lead) ? format(getLeadServiceDate(lead)!, 'dd/MM/yyyy') : '—'}
                        </td>
                        <td className="py-3.5 text-center font-mono text-xs text-white/40">{daysInStatus(lead)}d</td>
                        <td className="py-3.5 text-right">
                          <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition duration-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                void openEditModal(lead);
                              }}
                              onDoubleClick={(e) => e.stopPropagation()}
                              className="text-white/40 hover:text-white"
                              title="Editar"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                void handleDeleteLead(lead.id);
                              }}
                              onDoubleClick={(e) => e.stopPropagation()}
                              className="text-white/30 hover:text-red-400"
                              title="Excluir"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-10 text-center text-white/30 font-semibold">Nenhum lead encontrado com estes filtros.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* 3. HISTORICO SUPABASE TAB */}
        {activeTab === 'historico' && <HistoricoSupabase setActiveTab={setActiveTab} openCreateModal={openCreateModal} />}

        {/* 4. EXTRATOS MENSAIS TAB */}
        {activeTab === 'extratos' && <ExtratosMensaisSupabase />}

        {/* 5. AGENDA & FOLLOW-UP TAB */}
        {activeTab === 'agenda' && (
          <AgendaFollowUpSection
            leads={leads}
            initialView={agendaInitialView}
            onAgendarRetorno={handleAgendaSchedule}
            onMarcarFeito={handleAgendaMarkDone}
            onUpdateServiceStatus={handleServiceStatusChange}
            onAbrirLead={(lead) => setLeadDetail(lead)}
            onIrParaLeads={() => setActiveTab('leads')}
          />
        )}

      </main>

      {/* 4. CRUD ADD/EDIT LEAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition duration-300">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#07111d] p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Close Button */}
            <button
              onClick={() => { setIsModalOpen(false); setSelectedLead(null); setLinkedOrcamento(null); }}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Title */}
            <h3 className="font-display text-xl font-black text-white tracking-tight border-b border-white/5 pb-4">
              {selectedLead ? 'Editar Informações do Lead' : 'Cadastrar Novo Lead Comercial'}
            </h3>

            {/* Form */}
            <form onSubmit={handleLeadSubmit} className="mt-4 space-y-4">
              
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/50 font-semibold">Nome do Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo do lead"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#c9a227]/40 focus:outline-none"
                />
              </div>

              {/* Orcamento Vinculado do Supabase */}
              {selectedLead && linkedOrcamento && (
                <div className="rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase tracking-wider text-[#c9a227] font-semibold flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Orçamento do Supabase Encontrado
                    </h4>
                    <span className="text-[10px] text-white/40">
                      {linkedOrcamento.created_at ? new Date(linkedOrcamento.created_at).toLocaleDateString('pt-BR') : '—'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">Película:</span>
                      <span className="text-white font-semibold">{linkedOrcamento.modo_otimizacao || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Valor:</span>
                      <span className="text-[#c9a227] font-bold">
                        {linkedOrcamento.valor?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Qtd Vidros:</span>
                      <span className="text-white font-semibold">{linkedOrcamento.qtd || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Desconto:</span>
                      <span className="text-emerald-400 font-semibold">
                        {linkedOrcamento.desconto ? `${linkedOrcamento.desconto}%` : '—'}
                      </span>
                    </div>
                  </div>
                  {linkedOrcamento.vidros && linkedOrcamento.vidros.length > 0 && (
                    <div className="border-t border-white/5 pt-3 mt-2">
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Vidros:</p>
                      <div className="flex flex-wrap gap-1">
                        {linkedOrcamento.vidros.map((v, i) => (
                          <span key={i} className="text-xs bg-white/5 px-2 py-0.5 rounded text-white/70">
                            {v.h}x{v.w} {v.label && `(${v.label})`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('historico')}
                    className="w-full mt-2 text-xs text-[#c9a227] hover:underline font-semibold"
                  >
                    Ver todos os orçamentos no Histórico →
                  </button>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/50 font-semibold">Telefone/WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(21) XXXXX-XXXX"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#c9a227]/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/50 font-semibold">E-mail (Opcional)</label>
                  <input
                    type="email"
                    placeholder="email@cliente.com"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#c9a227]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/50 font-semibold">Endereço Completo</label>
                <input
                  type="text"
                  placeholder="Av, Rua, Número, Bloco..."
                  value={leadForm.address}
                  onChange={(e) => setLeadForm({ ...leadForm, address: e.target.value })}
                  className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#c9a227]/40 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/50 font-semibold">Bairro do RJ</label>
                  <select
                    value={leadForm.neighborhood}
                    onChange={(e) => setLeadForm({ ...leadForm, neighborhood: e.target.value })}
                    className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white/70 focus:border-[#c9a227]/40 focus:outline-none"
                  >
                    {RJ_NEIGHBORHOODS.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/50 font-semibold">Película Desejada</label>
                  <select
                    value={leadForm.filmType}
                    onChange={(e) => setLeadForm({ ...leadForm, filmType: e.target.value })}
                    className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white/70 focus:border-[#c9a227]/40 focus:outline-none"
                  >
                    {Object.keys(FILM_PRICES).map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/50 font-semibold">Área (m²)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={leadForm.sqm || ''}
                    onChange={(e) => setLeadForm({ ...leadForm, sqm: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white focus:border-[#c9a227]/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/50 font-semibold">Valor Fechado (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={leadForm.value || ''}
                    onChange={(e) => setLeadForm({ ...leadForm, value: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white focus:border-[#c9a227]/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/50 font-semibold">Status Inicial</label>
                  <select
                    value={leadForm.status}
                    onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value as Lead['status'] })}
                    className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white/70 focus:border-[#c9a227]/40 focus:outline-none"
                  >
                    <option value="Novo">Novo</option>
                    <option value="Em Contato">Em Contato</option>
                    <option value="Agendado">Agendado</option>
                    <option value="Fechado">Fechado</option>
                    <option value="Perdido">Perdido</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/50 font-semibold">Data do Serviço</label>
                  <DateFieldWithPicker
                    ariaLabel="Abrir calendário para data do serviço"
                    value={formatDateInputValue(leadForm.dataServico)}
                    onChange={(value) => setLeadForm({ ...leadForm, dataServico: value || null })}
                    className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white focus:border-[#c9a227]/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/50 font-semibold">Próximo Contato</label>
                  <DateFieldWithPicker
                    ariaLabel="Abrir calendário para próximo contato"
                    value={formatDateInputValue(leadForm.proximoContato)}
                    onChange={(value) => setLeadForm({ ...leadForm, proximoContato: value || null })}
                    className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white focus:border-[#c9a227]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/50 font-semibold">Observações Comerciais</label>
                <textarea
                  rows={3}
                  placeholder="Instruções de instalação, preferências, horários..."
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                  className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#c9a227]/40 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setSelectedLead(null); setLinkedOrcamento(null); }}
                  className="flex-1 rounded-2xl border border-white/5 bg-white/[0.01] py-3 text-sm font-semibold text-white/60 hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-gradient-to-r from-[#c9a227] to-[#d4ad30] py-3 text-sm font-bold text-[#04080f] shadow-lg shadow-[#c9a227]/10 hover:brightness-110 transition"
                >
                  {selectedLead ? 'Salvar Alterações' : 'Criar Novo Lead'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Detalhes do Lead */}
      {leadDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={() => setLeadDetail(null)}>
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#07111d] p-5 text-white shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg font-black text-white tracking-tight">{leadDetail.name}</h3>
              <button onClick={() => setLeadDetail(null)} className="text-white/40 hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Telefone</span>
                <span className="font-bold text-sm text-white">{leadDetail.phone || '—'}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Status</span>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getLeadStatusClasses(leadDetail.status)}`}>{leadDetail.status}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Serviço</span>
                <span className="font-bold text-sm text-sky-300">
                  {getLeadServiceDate(leadDetail)
                    ? format(getLeadServiceDate(leadDetail)!, 'dd/MM/yyyy')
                    : 'Sem data'}
                </span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Película</span>
                <span className="font-bold text-sm text-white">{leadDetail.filmType}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Próxima Ação</span>
                <span className="font-bold text-sm text-[#f5d77a]">
                  {getLeadFollowUpDate(leadDetail)
                    ? format(getLeadFollowUpDate(leadDetail)!, 'dd/MM/yyyy')
                    : 'Sem retorno'}
                </span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Valor</span>
                <span className="font-black text-lg text-[#c9a227]">R$ {formatCurrency(leadDetail.value)}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Bairro</span>
                <span className="font-bold text-sm text-white">{leadDetail.neighborhood || '—'}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Área</span>
                <span className="font-bold text-sm text-white">{leadDetail.sqm.toFixed(2)}m²</span>
              </div>
            </div>
            {leadDetail.email && (
              <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Email</span>
                <span className="font-bold text-sm text-white">{leadDetail.email}</span>
              </div>
            )}
            {leadDetail.notes && (
              <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="block text-[10px] uppercase tracking-wider text-white/50 font-semibold mb-1">Observações</span>
                <span className="text-sm text-white/80 whitespace-pre-wrap">{leadDetail.notes}</span>
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-2">
              {getWhatsAppHref(leadDetail) && (
                <a
                  href={getWhatsAppHref(leadDetail)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-center text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/15"
                >
                  WhatsApp
                </a>
              )}
              <button
                type="button"
                onClick={() => openCommercialAction(leadDetail, 'retorno')}
                className="rounded-xl border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-2.5 text-xs font-bold text-[#f5d77a] transition hover:bg-[#c9a227]/15"
              >
                Agendar Retorno
              </button>
              <button
                type="button"
                onClick={() => openCommercialAction(leadDetail, 'servico')}
                className="rounded-xl border border-sky-500/20 bg-sky-500/10 px-3 py-2.5 text-xs font-bold text-sky-300 transition hover:bg-sky-500/15"
              >
                Agendar Serviço
              </button>
              <button
                type="button"
                onClick={() => openCommercialAction(leadDetail, 'fechado')}
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/15"
              >
                Fechar Venda
              </button>
              <button
                type="button"
                onClick={() => openCommercialAction(leadDetail, 'perdido')}
                className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500/15"
              >
                Marcar Perdido
              </button>
            </div>
            <div className="flex gap-3 mt-4 border-t border-white/5 pt-3">
              <button
                onClick={() => setLeadDetail(null)}
                className="flex-1 rounded-xl border border-white/5 bg-white/[0.01] py-2.5 text-sm font-semibold text-white/60 hover:bg-white/5 transition"
              >
                Fechar
              </button>
              <button
                onClick={() => { openEditModal(leadDetail); setLeadDetail(null); }}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#d4ad30] py-2.5 text-sm font-bold text-[#04080f] shadow-lg shadow-[#c9a227]/10 hover:brightness-110 transition"
              >
                Editar Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {commercialAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setCommercialAction(null)}>
          <form
            onSubmit={applyCommercialAction}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#07111d] p-5 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5d77a]">Ação Comercial</p>
                <h3 className="mt-1 font-display text-lg font-black tracking-tight text-white">{commercialActionTitle}</h3>
                <p className="mt-1 text-sm text-white/50">{commercialAction.lead.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setCommercialAction(null)}
                className="rounded-full border border-white/5 p-2 text-white/40 transition hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {commercialAction.action === 'retorno' && (
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Próximo contato</label>
                  <DateFieldWithPicker
                    ariaLabel="Abrir calendário para próximo contato"
                    required
                    value={commercialAction.followUpDate}
                    onChange={(value) => setCommercialAction({ ...commercialAction, followUpDate: value })}
                    className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white focus:border-[#c9a227]/40 focus:outline-none"
                  />
                </div>
              )}

              {commercialAction.action === 'servico' && (
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">Data do serviço</label>
                  <DateFieldWithPicker
                    ariaLabel="Abrir calendário para data do serviço"
                    required
                    value={commercialAction.serviceDate}
                    onChange={(value) => setCommercialAction({ ...commercialAction, serviceDate: value })}
                    className="w-full rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white focus:border-sky-400/40 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/50">
                  {commercialAction.action === 'perdido' ? 'Motivo / observação' : 'Observação comercial'}
                </label>
                <textarea
                  rows={4}
                  value={commercialAction.note}
                  onChange={(e) => setCommercialAction({ ...commercialAction, note: e.target.value })}
                  placeholder={
                    commercialAction.action === 'fechado'
                      ? 'Ex.: cliente confirmou pagamento, instalar pela manhã...'
                      : commercialAction.action === 'perdido'
                        ? 'Ex.: preço, prazo, concorrente, sem resposta...'
                        : 'Ex.: combinado, dúvida, pendência ou próximo passo...'
                  }
                  className="w-full resize-none rounded-2xl border border-white/5 bg-[#04080f] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-[#c9a227]/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3 border-t border-white/5 pt-4">
              <button
                type="button"
                onClick={() => setCommercialAction(null)}
                className="flex-1 rounded-2xl border border-white/5 bg-white/[0.01] py-3 text-sm font-semibold text-white/60 transition hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-gradient-to-r from-[#c9a227] to-[#d4ad30] py-3 text-sm font-bold text-[#04080f] shadow-lg shadow-[#c9a227]/10 transition hover:brightness-110"
              >
                {commercialActionLabel}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
