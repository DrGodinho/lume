import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { roundCurrency, roundMeasure } from '@/lib/numberPrecision';
import { CRM_COLLAPSED_CARDS_STORAGE_KEY, CRM_FILM_TYPE_LABELS } from './constants';
import { normalizeLeadStatus, normalizeServiceStatus } from './hooks/useAgenda';
import type { Lead, CalculatorHistoryRow } from './types';

type LeadRow = Record<string, unknown> & { film_type?: string };

const asString = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

const asNullableString = (value: unknown) => (typeof value === 'string' && value ? value : null);

export const getFilmTypeLabel = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (CRM_FILM_TYPE_LABELS[normalized]) return CRM_FILM_TYPE_LABELS[normalized];
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export const mapLeadRow = (row: LeadRow): Lead => ({
  id: asString(row.id, 'lead_sem_id'),
  name: asString(row.name),
  phone: asString(row.phone),
  email: asString(row.email),
  address: asString(row.address),
  neighborhood: asString(row.neighborhood, 'Barra da Tijuca'),
  filmType: asString(row.film_type, 'Nano Ceramica'),
  sqm: roundMeasure(row.sqm),
  value: roundCurrency(row.value),
  status: normalizeLeadStatus(row.status),
  createdAt: asString(row.created_at, new Date().toISOString().split('T')[0]),
  statusChangedAt: asString(row.status_changed_at, asString(row.created_at, new Date().toISOString().split('T')[0])),
  notes: asString(row.notes),
  proximoContato: asNullableString(row.proximo_contato),
  dataServico: asNullableString(row.data_servico),
  serviceStatus: normalizeServiceStatus(row.service_status),
  dormant: typeof row.dormant === 'boolean' ? row.dormant : false,
  pinned: typeof row.pinned === 'boolean' ? row.pinned : false,
  updatedAt: asString(row.updated_at, asString(row.status_changed_at, asString(row.created_at, new Date().toISOString()))),
  deletedAt: asNullableString(row.deleted_at),
});

export const normalizeLeadAmounts = (lead: Lead): Lead => ({
  ...lead,
  sqm: roundMeasure(lead.sqm),
  value: roundCurrency(lead.value),
  status: normalizeLeadStatus(lead.status),
  serviceStatus: normalizeServiceStatus(lead.serviceStatus) || (lead.dataServico ? 'Marcado' : null),
  dormant: Boolean(lead.dormant),
  pinned: Boolean(lead.pinned),
});

export const getInitialCollapsedCards = () => {
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

export const getCrmApiHeaders = async () => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!supabase) return headers;

  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
};

export const getCrmApiErrorMessage = (payload: unknown, fallback: string) => {
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
    dormant: normalized.dormant,
    pinned: normalized.pinned,
    notes: normalized.notes,
    updatedAt: normalized.updatedAt ?? null,
    createdAt: normalized.createdAt,
  });
};

export const areLeadCollectionsEquivalent = (left: Lead[], right: Lead[]) => {
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

export const formatLeadCurrency = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

export const appendCommercialNote = (currentNotes: string, note: string) => {
  const cleanNote = note.trim();
  if (!cleanNote) return currentNotes;
  const stamp = format(new Date(), 'dd/MM/yyyy');
  const entry = `[${stamp}] ${cleanNote}`;
  return currentNotes ? `${currentNotes}\n${entry}` : entry;
};

export const getHistoryFilmLabel = (history: CalculatorHistoryRow) => {
  const legacyFilmMap: Record<string, string> = {
    densidade: 'Nano Ceramica',
    facilidade: 'Refletiva',
    facilidade_v2: 'Carbono',
  };

  if (history.selected_film) return CRM_FILM_TYPE_LABELS[history.selected_film] || history.selected_film;
  return legacyFilmMap[history.modo_otimizacao || ''] || history.modo_otimizacao || '—';
};
