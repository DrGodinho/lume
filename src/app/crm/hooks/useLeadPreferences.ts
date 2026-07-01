'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CRM_UI_PREFERENCES_STORAGE_KEY, MONTHLY_EVOLUTION_SERIES } from '../constants';
import { isLeadStatus, type LeadStatus } from '../constants/stages';
import { getInitialCollapsedCards } from '../utils';
import type { AgendaView, Lead, LeadSortKey, MonthlyEvolutionSeries } from '../types';

interface CrmUiPreferences {
  searchQuery: string;
  filterNeighborhood: string[];
  filterStatus: LeadStatus[];
  viewMode: 'kanban' | 'table';
  agendaInitialView: AgendaView;
  sortKey: LeadSortKey;
  sortDir: 'asc' | 'desc';
}

export interface UseLeadPreferencesReturn {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterNeighborhood: string[];
  setFilterNeighborhood: (value: string[]) => void;
  filterStatus: LeadStatus[];
  setFilterStatus: (value: LeadStatus[]) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  viewMode: 'kanban' | 'table';
  setViewMode: (mode: 'kanban' | 'table') => void;
  collapsedCards: Set<string>;
  visibleMonthlySeries: Record<MonthlyEvolutionSeries, boolean>;
  agendaInitialView: AgendaView;
  setAgendaInitialView: (view: AgendaView) => void;
  sortKey: LeadSortKey;
  sortDir: 'asc' | 'desc';
  filteredLeads: Lead[];
  sortedFilteredLeads: Lead[];
  setCollapsedStateForAllLeads: (collapsed: boolean) => void;
  toggleCollapsedCard: (leadId: string) => void;
  toggleSort: (key: LeadSortKey) => void;
  toggleMonthlySeries: (series: MonthlyEvolutionSeries) => void;
}

const DEFAULT_CRM_UI_PREFERENCES: CrmUiPreferences = {
  searchQuery: '',
  filterNeighborhood: [],
  filterStatus: [],
  viewMode: 'kanban',
  agendaInitialView: 'hoje',
  sortKey: '',
  sortDir: 'asc',
};

const VALID_VIEW_MODES = new Set<CrmUiPreferences['viewMode']>(['kanban', 'table']);
const VALID_AGENDA_VIEWS = new Set<AgendaView>(['hoje', 'semana', 'mes', 'servicos', 'sem_acao', 'dormentes']);
const VALID_SORT_DIRECTIONS = new Set<CrmUiPreferences['sortDir']>(['asc', 'desc']);
const VALID_SORT_KEYS = new Set<LeadSortKey>(['', 'name', 'neighborhood', 'filmType', 'sqm', 'value', 'status', 'dataServico', 'serviceStatus']);

const parseCsvFilter = (raw: string | null, validator?: (value: string) => boolean): string[] => {
  if (!raw) return [];
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && (!validator || validator(item)));
};

const parseStringArray = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
  }
  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }
  return undefined;
};

const parseLeadStatusArray = (value: unknown): LeadStatus[] | undefined => {
  const items = parseStringArray(value);
  if (!items) return undefined;
  return items.filter(isLeadStatus);
};

const parseCrmUiPreferencesFromSearchParams = (searchParams: URLSearchParams): Partial<CrmUiPreferences> => ({
  searchQuery: searchParams.get('q') ?? undefined,
  filterNeighborhood: (() => {
    const parsed = parseCsvFilter(searchParams.get('bairro'));
    return parsed.length > 0 ? parsed : undefined;
  })(),
  filterStatus: (() => {
    const parsed = parseCsvFilter(searchParams.get('status'), isLeadStatus);
    return parsed.length > 0 ? (parsed as LeadStatus[]) : undefined;
  })(),
  viewMode: VALID_VIEW_MODES.has(searchParams.get('view') as CrmUiPreferences['viewMode'])
    ? searchParams.get('view') as CrmUiPreferences['viewMode']
    : undefined,
  agendaInitialView: VALID_AGENDA_VIEWS.has(searchParams.get('agenda') as AgendaView)
    ? searchParams.get('agenda') as AgendaView
    : undefined,
  sortKey: VALID_SORT_KEYS.has(searchParams.get('sort') as LeadSortKey)
    ? searchParams.get('sort') as LeadSortKey
    : undefined,
  sortDir: VALID_SORT_DIRECTIONS.has(searchParams.get('dir') as CrmUiPreferences['sortDir'])
    ? searchParams.get('dir') as CrmUiPreferences['sortDir']
    : undefined,
});

const mergeCrmUiPreferences = (base: CrmUiPreferences, overrides: Partial<CrmUiPreferences>): CrmUiPreferences => {
  const filterNeighborhoodOverride = parseStringArray(overrides.filterNeighborhood);
  const filterStatusOverride = parseLeadStatusArray(overrides.filterStatus);

  return {
    searchQuery: typeof overrides.searchQuery === 'string' ? overrides.searchQuery : base.searchQuery,
    filterNeighborhood: filterNeighborhoodOverride ?? base.filterNeighborhood,
    filterStatus: filterStatusOverride ?? base.filterStatus,
    viewMode: VALID_VIEW_MODES.has(overrides.viewMode as CrmUiPreferences['viewMode']) ? overrides.viewMode as CrmUiPreferences['viewMode'] : base.viewMode,
    agendaInitialView: VALID_AGENDA_VIEWS.has(overrides.agendaInitialView as AgendaView) ? overrides.agendaInitialView as AgendaView : base.agendaInitialView,
    sortKey: VALID_SORT_KEYS.has(overrides.sortKey as LeadSortKey) ? overrides.sortKey as LeadSortKey : base.sortKey,
    sortDir: VALID_SORT_DIRECTIONS.has(overrides.sortDir as CrmUiPreferences['sortDir']) ? overrides.sortDir as CrmUiPreferences['sortDir'] : base.sortDir,
  };
};

const loadCrmUiPreferences = (): CrmUiPreferences => {
  if (typeof window === 'undefined') return DEFAULT_CRM_UI_PREFERENCES;

  let basePreferences = DEFAULT_CRM_UI_PREFERENCES;
  const savedPreferences = localStorage.getItem(CRM_UI_PREFERENCES_STORAGE_KEY);
  if (savedPreferences) {
    try {
      basePreferences = mergeCrmUiPreferences(DEFAULT_CRM_UI_PREFERENCES, JSON.parse(savedPreferences) as Partial<CrmUiPreferences>);
    } catch {
      localStorage.removeItem(CRM_UI_PREFERENCES_STORAGE_KEY);
    }
  }

  return mergeCrmUiPreferences(basePreferences, parseCrmUiPreferencesFromSearchParams(new URLSearchParams(window.location.search)));
};

const syncCrmUiPreferencesToUrl = (preferences: CrmUiPreferences) => {
  localStorage.setItem(CRM_UI_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  const nextUrl = new URL(window.location.href);
  const params = nextUrl.searchParams;

  if (preferences.searchQuery) params.set('q', preferences.searchQuery);
  else params.delete('q');
  if (preferences.filterNeighborhood.length > 0) params.set('bairro', preferences.filterNeighborhood.join(','));
  else params.delete('bairro');
  if (preferences.filterStatus.length > 0) params.set('status', preferences.filterStatus.join(','));
  else params.delete('status');
  if (preferences.viewMode !== DEFAULT_CRM_UI_PREFERENCES.viewMode) params.set('view', preferences.viewMode);
  else params.delete('view');
  if (preferences.agendaInitialView !== DEFAULT_CRM_UI_PREFERENCES.agendaInitialView) params.set('agenda', preferences.agendaInitialView);
  else params.delete('agenda');
  if (preferences.sortKey) params.set('sort', preferences.sortKey);
  else params.delete('sort');
  if (preferences.sortKey && preferences.sortDir !== DEFAULT_CRM_UI_PREFERENCES.sortDir) params.set('dir', preferences.sortDir);
  else params.delete('dir');

  const nextSearch = params.toString();
  const currentSearch = window.location.search.startsWith('?') ? window.location.search.slice(1) : window.location.search;
  if (nextSearch !== currentSearch) {
    window.history.replaceState({}, '', `${nextUrl.pathname}${nextSearch ? `?${nextSearch}` : ''}${nextUrl.hash}`);
  }
};

export const useLeadPreferences = (leads: Lead[]): UseLeadPreferencesReturn => {
  const [searchQuery, setSearchQuery] = useState(DEFAULT_CRM_UI_PREFERENCES.searchQuery);
  const [filterNeighborhood, setFilterNeighborhood] = useState<string[]>(DEFAULT_CRM_UI_PREFERENCES.filterNeighborhood);
  const [filterStatus, setFilterStatus] = useState<LeadStatus[]>(DEFAULT_CRM_UI_PREFERENCES.filterStatus);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>(DEFAULT_CRM_UI_PREFERENCES.viewMode);
  const [collapsedCards, setCollapsedCards] = useState<Set<string>>(new Set());
  const [collapsedCardsLoaded, setCollapsedCardsLoaded] = useState(false);
  const [visibleMonthlySeries, setVisibleMonthlySeries] = useState(MONTHLY_EVOLUTION_SERIES);
  const [agendaInitialView, setAgendaInitialView] = useState<AgendaView>(DEFAULT_CRM_UI_PREFERENCES.agendaInitialView);
  const [sortKey, setSortKey] = useState<LeadSortKey>(DEFAULT_CRM_UI_PREFERENCES.sortKey);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(DEFAULT_CRM_UI_PREFERENCES.sortDir);
  const [uiPreferencesRestored, setUiPreferencesRestored] = useState(false);

  useEffect(() => {
    const restoreHandle = window.setTimeout(() => {
      const restoredPreferences = loadCrmUiPreferences();
      setSearchQuery(restoredPreferences.searchQuery);
      setFilterNeighborhood(restoredPreferences.filterNeighborhood);
      setFilterStatus(restoredPreferences.filterStatus);
      setViewMode(restoredPreferences.viewMode);
      setAgendaInitialView(restoredPreferences.agendaInitialView);
      setSortKey(restoredPreferences.sortKey);
      setSortDir(restoredPreferences.sortDir);
      setUiPreferencesRestored(true);
    }, 0);

    return () => window.clearTimeout(restoreHandle);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setCollapsedCards(getInitialCollapsedCards());
      setCollapsedCardsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (collapsedCardsLoaded) {
      localStorage.setItem('lume_crm_collapsed_cards', JSON.stringify([...collapsedCards]));
    }
  }, [collapsedCards, collapsedCardsLoaded]);

  useEffect(() => {
    if (!uiPreferencesRestored || typeof window === 'undefined') return;
    syncCrmUiPreferencesToUrl({ searchQuery, filterNeighborhood, filterStatus, viewMode, agendaInitialView, sortKey, sortDir });
  }, [agendaInitialView, filterNeighborhood, filterStatus, searchQuery, sortDir, sortKey, uiPreferencesRestored, viewMode]);

  const filteredLeads = useMemo(() => leads.filter((lead) => {
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(normalizedQuery) ||
      lead.phone.includes(searchQuery) ||
      (lead.email && lead.email.toLowerCase().includes(normalizedQuery)) ||
      lead.address.toLowerCase().includes(normalizedQuery) ||
      lead.notes.toLowerCase().includes(normalizedQuery);

    const matchesNeighborhood = filterNeighborhood.length === 0 || filterNeighborhood.includes(lead.neighborhood);
    const matchesStatus = filterStatus.length === 0 || filterStatus.includes(lead.status);

    return matchesSearch && matchesNeighborhood && matchesStatus;
  }), [filterNeighborhood, filterStatus, leads, searchQuery]);

  const sortedFilteredLeads = useMemo(() => {
    const compareByPin = (left: Lead, right: Lead) => {
      const leftPinned = left.pinned ? 1 : 0;
      const rightPinned = right.pinned ? 1 : 0;
      if (leftPinned !== rightPinned) return rightPinned - leftPinned;
      return 0;
    };

    if (!sortKey) {
      return [...filteredLeads].sort(compareByPin);
    }

    return [...filteredLeads].sort((left, right) => {
      const pinDiff = compareByPin(left, right);
      if (pinDiff !== 0) return pinDiff;

      const leftValue = left[sortKey];
      const rightValue = right[sortKey];
      const leftNormalized = typeof leftValue === 'string' ? leftValue.toLowerCase() : leftValue;
      const rightNormalized = typeof rightValue === 'string' ? rightValue.toLowerCase() : rightValue;
      if (leftNormalized == null && rightNormalized == null) return 0;
      if (leftNormalized == null) return sortDir === 'asc' ? -1 : 1;
      if (rightNormalized == null) return sortDir === 'asc' ? 1 : -1;
      if (leftNormalized < rightNormalized) return sortDir === 'asc' ? -1 : 1;
      if (leftNormalized > rightNormalized) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortDir, sortKey]);

  const setCollapsedStateForAllLeads = useCallback((collapsed: boolean) => {
    setCollapsedCards(new Set(collapsed ? leads.map((lead) => lead.id) : []));
  }, [leads]);

  const toggleCollapsedCard = useCallback((leadId: string) => {
    setCollapsedCards((current) => {
      const next = new Set(current);
      if (next.has(leadId)) next.delete(leadId);
      else next.add(leadId);
      return next;
    });
  }, []);

  const toggleSort = useCallback((key: LeadSortKey) => {
    if (sortKey === key) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir('asc');
  }, [sortKey]);

  const toggleMonthlySeries = useCallback((series: MonthlyEvolutionSeries) => {
    setVisibleMonthlySeries((current) => ({ ...current, [series]: !current[series] }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilterNeighborhood([]);
    setFilterStatus([]);
    setSearchQuery('');
  }, []);

  const hasActiveFilters = filterNeighborhood.length > 0 || filterStatus.length > 0 || searchQuery.length > 0;

  return {
    searchQuery, setSearchQuery, filterNeighborhood, setFilterNeighborhood, filterStatus, setFilterStatus,
    clearFilters, hasActiveFilters, viewMode, setViewMode, collapsedCards, visibleMonthlySeries,
    agendaInitialView, setAgendaInitialView, sortKey, sortDir, filteredLeads, sortedFilteredLeads,
    setCollapsedStateForAllLeads, toggleCollapsedCard, toggleSort, toggleMonthlySeries,
  };
};
