'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { loadConfigFromCloud } from '@/lib/cloudSync';
import { roundCurrency, roundMeasure } from '@/lib/numberPrecision';
import { CRM_UI_PREFERENCES_STORAGE_KEY, DEFAULT_CRM_FILM_OPTIONS, MONTHLY_EVOLUTION_SERIES } from '../constants';
import { formatDateInputValue, getLeadServiceStatus, normalizeLeadStatus } from './useAgenda';
import { appendCommercialNote, areLeadCollectionsEquivalent, getCrmApiErrorMessage, getCrmApiHeaders, getFilmTypeLabel, getInitialCollapsedCards, mapLeadRow, normalizeLeadAmounts } from '../utils';
import type {
  AgendaView,
  CalculatorHistoryRow,
  CommercialActionDraft,
  CreateLeadModalOptions,
  CrmSyncState,
  CrmTab,
  Lead,
  LeadFormValues,
  LeadSortKey,
  LeadStatus,
  LeadStatusHistoryEntry,
  MonthlyEvolutionSeries,
  ServiceStatus,
} from '../types';

interface CloudSnapshotResult {
  ok: boolean;
  details?: string;
  leads?: Lead[];
}

interface CrmUiPreferences {
  searchQuery: string;
  filterNeighborhood: string;
  filterStatus: string;
  viewMode: 'kanban' | 'table';
  agendaInitialView: AgendaView;
  sortKey: LeadSortKey;
  sortDir: 'asc' | 'desc';
}

const DEFAULT_CRM_UI_PREFERENCES: CrmUiPreferences = {
  searchQuery: '',
  filterNeighborhood: '',
  filterStatus: '',
  viewMode: 'kanban',
  agendaInitialView: 'hoje',
  sortKey: '',
  sortDir: 'asc',
};

const VALID_VIEW_MODES = new Set<CrmUiPreferences['viewMode']>(['kanban', 'table']);
const VALID_AGENDA_VIEWS = new Set<AgendaView>(['hoje', 'semana', 'mes', 'servicos', 'sem_acao', 'dormentes']);
const VALID_SORT_DIRECTIONS = new Set<CrmUiPreferences['sortDir']>(['asc', 'desc']);
const VALID_SORT_KEYS = new Set<LeadSortKey>(['', 'name', 'neighborhood', 'filmType', 'sqm', 'value', 'status', 'dataServico', 'serviceStatus']);

const parseCrmUiPreferencesFromSearchParams = (searchParams: URLSearchParams): Partial<CrmUiPreferences> => {
  const searchQuery = searchParams.get('q');
  const filterNeighborhood = searchParams.get('bairro');
  const filterStatus = searchParams.get('status');
  const viewMode = searchParams.get('view');
  const agendaInitialView = searchParams.get('agenda');
  const sortKey = searchParams.get('sort');
  const sortDir = searchParams.get('dir');

  return {
    searchQuery: typeof searchQuery === 'string' ? searchQuery : undefined,
    filterNeighborhood: typeof filterNeighborhood === 'string' ? filterNeighborhood : undefined,
    filterStatus: typeof filterStatus === 'string' ? filterStatus : undefined,
    viewMode: VALID_VIEW_MODES.has(viewMode as CrmUiPreferences['viewMode'])
      ? viewMode as CrmUiPreferences['viewMode']
      : undefined,
    agendaInitialView: VALID_AGENDA_VIEWS.has(agendaInitialView as AgendaView)
      ? agendaInitialView as AgendaView
      : undefined,
    sortKey: VALID_SORT_KEYS.has(sortKey as LeadSortKey)
      ? sortKey as LeadSortKey
      : undefined,
    sortDir: VALID_SORT_DIRECTIONS.has(sortDir as CrmUiPreferences['sortDir'])
      ? sortDir as CrmUiPreferences['sortDir']
      : undefined,
  };
};

const mergeCrmUiPreferences = (base: CrmUiPreferences, overrides: Partial<CrmUiPreferences>): CrmUiPreferences => ({
  searchQuery: typeof overrides.searchQuery === 'string' ? overrides.searchQuery : base.searchQuery,
  filterNeighborhood: typeof overrides.filterNeighborhood === 'string' ? overrides.filterNeighborhood : base.filterNeighborhood,
  filterStatus: typeof overrides.filterStatus === 'string' ? overrides.filterStatus : base.filterStatus,
  viewMode: VALID_VIEW_MODES.has(overrides.viewMode as CrmUiPreferences['viewMode'])
    ? overrides.viewMode as CrmUiPreferences['viewMode']
    : base.viewMode,
  agendaInitialView: VALID_AGENDA_VIEWS.has(overrides.agendaInitialView as AgendaView)
    ? overrides.agendaInitialView as AgendaView
    : base.agendaInitialView,
  sortKey: VALID_SORT_KEYS.has(overrides.sortKey as LeadSortKey)
    ? overrides.sortKey as LeadSortKey
    : base.sortKey,
  sortDir: VALID_SORT_DIRECTIONS.has(overrides.sortDir as CrmUiPreferences['sortDir'])
    ? overrides.sortDir as CrmUiPreferences['sortDir']
    : base.sortDir,
});

const loadCrmUiPreferences = (): CrmUiPreferences => {
  if (typeof window === 'undefined') {
    return DEFAULT_CRM_UI_PREFERENCES;
  }

  let basePreferences = DEFAULT_CRM_UI_PREFERENCES;
  const savedPreferences = localStorage.getItem(CRM_UI_PREFERENCES_STORAGE_KEY);

  if (savedPreferences) {
    try {
      const parsed = JSON.parse(savedPreferences) as Partial<CrmUiPreferences>;
      basePreferences = mergeCrmUiPreferences(DEFAULT_CRM_UI_PREFERENCES, parsed);
    } catch {
      localStorage.removeItem(CRM_UI_PREFERENCES_STORAGE_KEY);
    }
  }

  return mergeCrmUiPreferences(basePreferences, parseCrmUiPreferencesFromSearchParams(new URLSearchParams(window.location.search)));
};

export const useLeads = (activeTab: CrmTab) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState(DEFAULT_CRM_UI_PREFERENCES.searchQuery);
  const [filterNeighborhood, setFilterNeighborhood] = useState(DEFAULT_CRM_UI_PREFERENCES.filterNeighborhood);
  const [filterStatus, setFilterStatus] = useState(DEFAULT_CRM_UI_PREFERENCES.filterStatus);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>(DEFAULT_CRM_UI_PREFERENCES.viewMode);
  const [collapsedCards, setCollapsedCards] = useState<Set<string>>(new Set());
  const [collapsedCardsLoaded, setCollapsedCardsLoaded] = useState(false);
  const [visibleMonthlySeries, setVisibleMonthlySeries] = useState(MONTHLY_EVOLUTION_SERIES);
  const [agendaInitialView, setAgendaInitialView] = useState<AgendaView>(DEFAULT_CRM_UI_PREFERENCES.agendaInitialView);
  const [sortKey, setSortKey] = useState<LeadSortKey>(DEFAULT_CRM_UI_PREFERENCES.sortKey);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(DEFAULT_CRM_UI_PREFERENCES.sortDir);
  const [uiPreferencesRestored, setUiPreferencesRestored] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadDetail, setLeadDetail] = useState<Lead | null>(null);
  const [commercialAction, setCommercialAction] = useState<CommercialActionDraft | null>(null);
  const [trashedLeads, setTrashedLeads] = useState<Lead[]>([]);
  const [loadingTrashLeads, setLoadingTrashLeads] = useState(false);
  const [leadStatusHistory, setLeadStatusHistory] = useState<LeadStatusHistoryEntry[]>([]);
  const [loadingLeadStatusHistory, setLoadingLeadStatusHistory] = useState(false);
  const [filmTypeOptions, setFilmTypeOptions] = useState<string[]>(DEFAULT_CRM_FILM_OPTIONS);
  const [defaultLeadFilmType, setDefaultLeadFilmType] = useState(DEFAULT_CRM_FILM_OPTIONS[0] || 'Outro');
  const [notification, setNotification] = useState<string | null>(null);
  const [crmSync, setCrmSync] = useState<CrmSyncState>({
    status: 'warning',
    message: 'Carregando leads do Supabase...',
  });
  const [linkedOrcamento, setLinkedOrcamento] = useState<CalculatorHistoryRow | null>(null);
  const [pendingCalculatorHistoryId, setPendingCalculatorHistoryId] = useState<string | null>(null);
  const [targetGoal, setTargetGoal] = useState(10000);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState('10000');
  const [isVerifyingCloud, setIsVerifyingCloud] = useState(false);
  const [lastCloudCheckAt, setLastCloudCheckAt] = useState<string | null>(null);
  const [renderTime] = useState(() => Date.now());
  const leadTableClickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [leadForm, setLeadForm] = useState<LeadFormValues>({
    name: '',
    phone: '',
    email: '',
    address: '',
    neighborhood: 'Barra da Tijuca',
    filmType: DEFAULT_CRM_FILM_OPTIONS[0] || 'Outro',
    sqm: 0,
    value: 0,
    status: 'Novo',
    statusChangedAt: new Date().toISOString().split('T')[0],
    dataServico: null,
    serviceStatus: null,
    proximoContato: null,
    dormant: false,
    notes: '',
  });

  const availableFilmTypeOptions = useMemo(() => {
    if (!leadForm.filmType) return filmTypeOptions;
    return filmTypeOptions.includes(leadForm.filmType)
      ? filmTypeOptions
      : [leadForm.filmType, ...filmTypeOptions];
  }, [filmTypeOptions, leadForm.filmType]);

  const notify = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  useEffect(() => () => {
    if (leadTableClickTimeoutRef.current) {
      clearTimeout(leadTableClickTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    const restoredPreferences = loadCrmUiPreferences();
    setSearchQuery(restoredPreferences.searchQuery);
    setFilterNeighborhood(restoredPreferences.filterNeighborhood);
    setFilterStatus(restoredPreferences.filterStatus);
    setViewMode(restoredPreferences.viewMode);
    setAgendaInitialView(restoredPreferences.agendaInitialView);
    setSortKey(restoredPreferences.sortKey);
    setSortDir(restoredPreferences.sortDir);
    setUiPreferencesRestored(true);
  }, []);

  const fetchCloudLeadsSnapshot = useCallback(async (): Promise<CloudSnapshotResult> => {
    const response = await fetch('/api/crm/leads', {
      headers: await getCrmApiHeaders(),
      credentials: 'same-origin',
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok || !Array.isArray(payload)) {
      return {
        ok: false,
        details: getCrmApiErrorMessage(payload, response.statusText),
      };
    }

    return {
      ok: true,
      leads: payload.map(mapLeadRow),
    };
  }, []);

  const fetchTrashLeadsSnapshot = useCallback(async (): Promise<CloudSnapshotResult> => {
    const response = await fetch('/api/crm/leads?trash=1', {
      headers: await getCrmApiHeaders(),
      credentials: 'same-origin',
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok || !Array.isArray(payload)) {
      return {
        ok: false,
        details: getCrmApiErrorMessage(payload, response.statusText),
      };
    }

    return {
      ok: true,
      leads: payload.map(mapLeadRow),
    };
  }, []);

  useEffect(() => {
    const loadCloudLeads = async () => {
      try {
        const result = await fetchCloudLeadsSnapshot();
        if (!result.ok || !result.leads) {
          setLeads([]);
          setCrmSync({
            status: 'error',
            message: 'Supabase não carregou os leads.',
            details: result.details,
          });
          return;
        }

        const cloudLeads = result.leads.map(normalizeLeadAmounts);
        setLeads(cloudLeads);
        setLastCloudCheckAt(new Date().toISOString());
        setCrmSync({
          status: 'ok',
          message: cloudLeads.length
            ? 'Leads carregados direto do Supabase.'
            : 'Nenhum lead encontrado no Supabase ainda.',
        });
      } catch (error) {
        setLeads([]);
        setCrmSync({
          status: 'error',
          message: 'Falha de conexão com o Supabase ao carregar os leads.',
          details: error instanceof Error ? error.message : 'Erro desconhecido ao carregar leads.',
        });
      }
    };

    const loadCalculatorConfig = async () => {
      const config = await loadConfigFromCloud();
      if (!config) return;

      const loadedFilmTypeOptions = Object.keys(config.filmTypes || {})
        .map(getFilmTypeLabel)
        .filter((option, index, options) => option && options.indexOf(option) === index);

      if (loadedFilmTypeOptions.length > 0) {
        setFilmTypeOptions(loadedFilmTypeOptions);
      }

      const selectedFilmLabel = config.selectedFilm ? getFilmTypeLabel(config.selectedFilm) : null;
      if (selectedFilmLabel) {
        setDefaultLeadFilmType(selectedFilmLabel);
      }
    };

    void loadCloudLeads();
    void loadCalculatorConfig();

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
    localStorage.setItem('lume_crm_collapsed_cards', JSON.stringify([...collapsedCards]));
  }, [collapsedCards, collapsedCardsLoaded]);

  useEffect(() => {
    if (!uiPreferencesRestored) return;

    const nextPreferences = {
      searchQuery,
      filterNeighborhood,
      filterStatus,
      viewMode,
      agendaInitialView,
      sortKey,
      sortDir,
    } satisfies CrmUiPreferences;

    localStorage.setItem(CRM_UI_PREFERENCES_STORAGE_KEY, JSON.stringify(nextPreferences));

    if (typeof window === 'undefined') return;

    const nextUrl = new URL(window.location.href);
    const params = nextUrl.searchParams;

    if (searchQuery) params.set('q', searchQuery);
    else params.delete('q');

    if (filterNeighborhood) params.set('bairro', filterNeighborhood);
    else params.delete('bairro');

    if (filterStatus) params.set('status', filterStatus);
    else params.delete('status');

    if (viewMode !== DEFAULT_CRM_UI_PREFERENCES.viewMode) params.set('view', viewMode);
    else params.delete('view');

    if (agendaInitialView !== DEFAULT_CRM_UI_PREFERENCES.agendaInitialView) params.set('agenda', agendaInitialView);
    else params.delete('agenda');

    if (sortKey) params.set('sort', sortKey);
    else params.delete('sort');

    if (sortKey && sortDir !== DEFAULT_CRM_UI_PREFERENCES.sortDir) params.set('dir', sortDir);
    else params.delete('dir');

    const nextSearch = params.toString();
    const currentSearch = window.location.search.startsWith('?')
      ? window.location.search.slice(1)
      : window.location.search;

    if (nextSearch !== currentSearch) {
      window.history.replaceState({}, '', `${nextUrl.pathname}${nextSearch ? `?${nextSearch}` : ''}${nextUrl.hash}`);
    }
  }, [agendaInitialView, filterNeighborhood, filterStatus, searchQuery, sortDir, sortKey, uiPreferencesRestored, viewMode]);

  useEffect(() => {
    if (!leadDetail) {
      setLeadStatusHistory([]);
      return;
    }

    let cancelled = false;

    const loadStatusHistory = async () => {
      setLoadingLeadStatusHistory(true);

      try {
        const response = await fetch(`/api/crm/lead-status-history?leadId=${encodeURIComponent(leadDetail.id)}`, {
          headers: await getCrmApiHeaders(),
          credentials: 'same-origin',
          cache: 'no-store',
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !Array.isArray(payload)) {
          if (!cancelled) {
            setLeadStatusHistory([]);
          }
          return;
        }

        if (!cancelled) {
          setLeadStatusHistory(payload as LeadStatusHistoryEntry[]);
        }
      } finally {
        if (!cancelled) {
          setLoadingLeadStatusHistory(false);
        }
      }
    };

    void loadStatusHistory();

    return () => {
      cancelled = true;
    };
  }, [leadDetail]);

  const handleVerifyCloudLeads = useCallback(async () => {
    setIsVerifyingCloud(true);
    setCrmSync({
      status: 'warning',
      message: 'Conferindo os dados reais no Supabase...',
    });

    try {
      const result = await fetchCloudLeadsSnapshot();
      if (!result.ok || !result.leads) {
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
      setLastCloudCheckAt(checkedAt);
      setCrmSync({
        status: 'ok',
        message: isExactMatch
          ? `Dados conferidos no Supabase as ${format(new Date(checkedAt), 'HH:mm:ss')}.`
          : `Havia divergencia com a tela atual. Os dados reais do Supabase foram recarregados as ${format(new Date(checkedAt), 'HH:mm:ss')}.`,
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

  const saveTargetGoal = useCallback(async (value: number) => {
    setTargetGoal(value);
    setEditingTarget(false);
    if (!supabase) return;
    await supabase.from('configuracoes').upsert({ id: 'default', meta_valor: value }, { onConflict: 'id' });
  }, []);

  const loadTrashLeads = useCallback(async () => {
    setLoadingTrashLeads(true);

    try {
      const result = await fetchTrashLeadsSnapshot();
      if (!result.ok || !result.leads) {
        notify('Nao foi possivel carregar a lixeira.');
        return;
      }

      setTrashedLeads(result.leads.map(normalizeLeadAmounts));
    } finally {
      setLoadingTrashLeads(false);
    }
  }, [fetchTrashLeadsSnapshot, notify]);

  useEffect(() => {
    if (activeTab !== 'trash') return;
    void loadTrashLeads();
  }, [activeTab, loadTrashLeads]);

  const upsertLeadInState = useCallback((lead: Lead) => {
    const normalized = normalizeLeadAmounts(lead);
    setLeads((currentLeads) => {
      const alreadyExists = currentLeads.some((currentLead) => currentLead.id === normalized.id);
      if (!alreadyExists) {
        return [normalized, ...currentLeads];
      }

      return currentLeads.map((currentLead) => (
        currentLead.id === normalized.id ? normalized : currentLead
      ));
    });

    return normalized;
  }, []);

  const syncLeadToCloud = useCallback(async (lead: Lead, method: 'POST' | 'PUT' = 'PUT') => {
    setCrmSync({
      status: 'warning',
      message: method === 'POST' ? 'Criando lead no Supabase...' : 'Salvando alteracao no Supabase...',
    });

    const headers = await getCrmApiHeaders();
    const response = await fetch('/api/crm/leads', {
      method,
      headers,
      credentials: 'same-origin',
      body: JSON.stringify(normalizeLeadAmounts(lead)),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const details = getCrmApiErrorMessage(payload, response.statusText);
      setCrmSync({
        status: 'error',
        message: method === 'POST'
          ? 'Supabase recusou a criacao do lead.'
          : 'Supabase recusou a ultima sincronizacao do lead.',
        details,
      });
      return false;
    }

    setCrmSync({
      status: 'ok',
      message: method === 'POST'
        ? 'Lead criado no Supabase.'
        : 'Ultima alteracao sincronizada com o Supabase.',
    });
    return true;
  }, []);

  const linkCalculatorHistoryToLead = useCallback(async (calculatorHistoryId: string, leadId: string) => {
    if (!supabase) return false;

    const { error } = await supabase
      .from('calculator_history')
      .update({ lead_id: leadId })
      .eq('id', calculatorHistoryId);

    return !error;
  }, []);

  const updateSingleLead = useCallback(async (leadId: string, updater: (lead: Lead) => Lead) => {
    const currentLead = leads.find((lead) => lead.id === leadId);
    if (!currentLead) {
      return { synced: false, lead: null };
    }

    const leadToSync = normalizeLeadAmounts(updater(currentLead));
    const synced = await syncLeadToCloud(leadToSync);

    if (synced) {
      upsertLeadInState(leadToSync);
    }

    return { synced, lead: synced ? leadToSync : currentLead };
  }, [leads, syncLeadToCloud, upsertLeadInState]);

  const openCommercialAction = useCallback((lead: Lead, action: CommercialActionDraft['action']) => {
    setCommercialAction({
      lead,
      action,
      followUpDate: formatDateInputValue(lead.proximoContato) || new Date().toISOString().split('T')[0],
      serviceDate: formatDateInputValue(lead.dataServico) || new Date().toISOString().split('T')[0],
      note: action === 'servico' && getLeadServiceStatus(lead) === 'Reagendar' ? 'Reagendado a pedido do cliente.' : '',
    });
  }, []);

  const closeLeadModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLead(null);
    setLinkedOrcamento(null);
    setPendingCalculatorHistoryId(null);
  }, []);

  const closeLeadDetailModal = useCallback(() => {
    setLeadDetail(null);
  }, []);

  const applyCommercialAction = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!commercialAction) return;

    const { lead, action, followUpDate, serviceDate, note } = commercialAction;
    if (action === 'retorno' && !followUpDate) {
      notify('Escolha a data do proximo retorno.');
      return;
    }
    if (action === 'servico' && !serviceDate) {
      notify('Escolha a data do servico.');
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
        dormant: false,
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

    notify(synced ? `${actionLabel}.` : `Nao foi possivel concluir: ${actionLabel.toLowerCase()}.`);
  }, [commercialAction, notify, updateSingleLead]);

  const setCollapsedStateForAllLeads = useCallback((collapsed: boolean) => {
    setCollapsedCards(new Set(collapsed ? leads.map((lead) => lead.id) : []));
  }, [leads]);

  const toggleCollapsedCard = useCallback((leadId: string) => {
    setCollapsedCards((current) => {
      const next = new Set(current);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  }, []);

  const handleLeadSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!leadForm.name) {
      notify('Preencha o campo obrigatorio (Nome)');
      return;
    }

    if (selectedLead) {
      const updatedLead = normalizeLeadAmounts({
        ...selectedLead,
        ...leadForm,
        updatedAt: new Date().toISOString(),
      });
      const synced = await syncLeadToCloud(updatedLead);
      if (!synced) {
        notify('Nao foi possivel atualizar o lead no Supabase.');
        return;
      }

      upsertLeadInState(updatedLead);
      notify('Lead atualizado com sucesso!');
    } else {
      const newLead = normalizeLeadAmounts({
        id: `lead_${Date.now()}`,
        ...leadForm,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
      });
      const synced = await syncLeadToCloud(newLead, 'POST');
      if (!synced) {
        notify('Nao foi possivel criar o lead no Supabase.');
        return;
      }

      let linkedCalculatorHistory = true;
      if (pendingCalculatorHistoryId) {
        linkedCalculatorHistory = await linkCalculatorHistoryToLead(pendingCalculatorHistoryId, newLead.id);
      }

      upsertLeadInState(newLead);
      notify(
        linkedCalculatorHistory
          ? 'Lead criado com sucesso!'
          : 'Lead criado, mas o vinculo com o orçamento nao foi salvo.',
      );
    }

    closeLeadModal();
  }, [closeLeadModal, leadForm, linkCalculatorHistoryToLead, notify, pendingCalculatorHistoryId, selectedLead, syncLeadToCloud, upsertLeadInState]);

  const openCreateModal = useCallback((options?: CreateLeadModalOptions) => {
    const prefill = options?.prefill;
    setSelectedLead(null);
    setLinkedOrcamento(null);
    setPendingCalculatorHistoryId(options?.sourceCalculatorHistoryId || null);
    setLeadForm(prefill || {
      name: '',
      phone: '',
      email: '',
      address: '',
      neighborhood: 'Barra da Tijuca',
      filmType: defaultLeadFilmType,
      sqm: 0,
      value: 0,
      status: 'Novo',
      statusChangedAt: new Date().toISOString().split('T')[0],
      dataServico: null,
      serviceStatus: null,
      proximoContato: null,
      dormant: false,
      notes: '',
    });
    setIsModalOpen(true);
  }, [defaultLeadFilmType]);

  const openEditModal = useCallback(async (lead: Lead) => {
    setSelectedLead(lead);
    setPendingCalculatorHistoryId(null);
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
      dormant: lead.dormant,
      notes: lead.notes,
    });
    setIsModalOpen(true);

    if (!supabase) {
      setLinkedOrcamento(null);
      return;
    }

    const { data: linkedByLeadId } = await supabase
      .from('calculator_history')
      .select('*')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (linkedByLeadId) {
      setLinkedOrcamento(linkedByLeadId as CalculatorHistoryRow);
      return;
    }

    if (!lead.name) {
      setLinkedOrcamento(null);
      return;
    }

    const { data: linkedByName } = await supabase
      .from('calculator_history')
      .select('*')
      .is('lead_id', null)
      .ilike('cliente', `%${lead.name}%`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    setLinkedOrcamento((linkedByName as CalculatorHistoryRow | null) || null);
  }, []);

  const handleLeadTableRowClick = useCallback((lead: Lead) => {
    if (leadTableClickTimeoutRef.current) {
      clearTimeout(leadTableClickTimeoutRef.current);
    }

    leadTableClickTimeoutRef.current = setTimeout(() => {
      setLeadDetail(lead);
      leadTableClickTimeoutRef.current = null;
    }, 220);
  }, []);

  const handleLeadTableRowDoubleClick = useCallback((lead: Lead) => {
    if (leadTableClickTimeoutRef.current) {
      clearTimeout(leadTableClickTimeoutRef.current);
      leadTableClickTimeoutRef.current = null;
    }

    void openEditModal(lead);
  }, [openEditModal]);

  const handleDeleteLead = useCallback(async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) {
      return;
    }

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
      const payload = await response.json().catch(() => null);
      const deletedLead = payload?.lead ? normalizeLeadAmounts(mapLeadRow(payload.lead)) : null;
      setLeads((currentLeads) => currentLeads.filter((lead) => lead.id !== id));
      if (deletedLead) {
        setTrashedLeads((currentLeads) => [deletedLead, ...currentLeads.filter((lead) => lead.id !== deletedLead.id)]);
      }
      setCrmSync({ status: 'ok', message: 'Lead removido no Supabase.' });
      notify('Lead removido.');
      return;
    }

    const payload = await response.json().catch(() => null);
    const details = getCrmApiErrorMessage(payload, response.statusText);
    setCrmSync({
      status: 'error',
      message: 'Supabase nao confirmou a exclusao do lead.',
      details,
    });
    notify('Nao foi possivel excluir o lead no Supabase.');
  }, [notify]);

  const handleRestoreLead = useCallback(async (lead: Lead) => {
    setCrmSync({
      status: 'warning',
      message: 'Restaurando lead da lixeira...',
    });

    const response = await fetch('/api/crm/leads', {
      method: 'PATCH',
      headers: await getCrmApiHeaders(),
      credentials: 'same-origin',
      body: JSON.stringify({ id: lead.id, action: 'restore' }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.lead) {
      setCrmSync({
        status: 'error',
        message: 'Nao foi possivel restaurar o lead.',
        details: getCrmApiErrorMessage(payload, response.statusText),
      });
      notify('Nao foi possivel restaurar o lead.');
      return;
    }

    const restoredLead = normalizeLeadAmounts(mapLeadRow(payload.lead));
    setTrashedLeads((currentLeads) => currentLeads.filter((currentLead) => currentLead.id !== restoredLead.id));
    upsertLeadInState(restoredLead);
    setCrmSync({
      status: 'ok',
      message: 'Lead restaurado com sucesso.',
    });
    notify('Lead restaurado com sucesso!');
  }, [notify, upsertLeadInState]);

  const handleStatusChange = useCallback(async (id: string, newStatus: LeadStatus) => {
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
      status: normalizeLeadStatus(newStatus),
      statusChangedAt: currentLead.status === newStatus ? currentLead.statusChangedAt : today,
      updatedAt: now,
    }));
    notify(synced ? `Status alterado para: ${newStatus}` : `Nao foi possivel alterar o status para: ${newStatus}`);
  }, [leads, notify, openCommercialAction, updateSingleLead]);

  const handleAgendaSchedule = useCallback(async (leadId: string, date: string) => {
    const nextContact = new Date(`${date}T12:00:00`).toISOString();
    const now = new Date().toISOString();
    const { synced } = await updateSingleLead(leadId, (lead) => ({
      ...lead,
      proximoContato: nextContact,
      dormant: false,
      updatedAt: now,
    }));
    notify(synced ? 'Retorno agendado com sucesso!' : 'Nao foi possivel agendar o retorno no Supabase.');
  }, [notify, updateSingleLead]);

  const handleServiceStatusChange = useCallback(async (leadId: string, serviceStatus: ServiceStatus) => {
    const now = new Date().toISOString();
    const today = new Date().toISOString().split('T')[0];
    const { synced } = await updateSingleLead(leadId, (lead) => ({
      ...lead,
      status: lead.status === 'Novo' && serviceStatus !== 'Concluido' ? 'Agendado' : lead.status,
      statusChangedAt: lead.status === 'Novo' && serviceStatus !== 'Concluido' ? today : lead.statusChangedAt,
      serviceStatus,
      dormant: false,
      updatedAt: now,
    }));

    notify(synced ? `Serviço atualizado para ${serviceStatus}.` : `Nao foi possivel atualizar o servico para ${serviceStatus}.`);
  }, [notify, updateSingleLead]);

  const handleAgendaMarkDone = useCallback(async (leadId: string) => {
    const { synced } = await updateSingleLead(leadId, (lead) => ({
      ...lead,
      proximoContato: null,
      updatedAt: new Date().toISOString(),
    }));
    notify(synced ? 'Follow-up registrado!' : 'Nao foi possivel registrar o follow-up no Supabase.');
  }, [notify, updateSingleLead]);

  const handleDormantStateChange = useCallback(async (leadId: string, dormant: boolean) => {
    setCrmSync({
      status: 'warning',
      message: dormant ? 'Marcando lead como dormente...' : 'Reativando lead dormente...',
    });

    const response = await fetch('/api/crm/leads', {
      method: 'PATCH',
      headers: await getCrmApiHeaders(),
      credentials: 'same-origin',
      body: JSON.stringify({ id: leadId, action: dormant ? 'dormant' : 'activate' }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.lead) {
      setCrmSync({
        status: 'error',
        message: dormant ? 'Nao foi possivel marcar o lead como dormente.' : 'Nao foi possivel reativar o lead.',
        details: getCrmApiErrorMessage(payload, response.statusText),
      });
      notify(dormant ? 'Nao foi possivel marcar o lead como dormente.' : 'Nao foi possivel reativar o lead.');
      return;
    }

    const updatedLead = normalizeLeadAmounts(mapLeadRow(payload.lead));
    upsertLeadInState(updatedLead);
    setCrmSync({
      status: 'ok',
      message: dormant ? 'Lead marcado como dormente.' : 'Lead reativado com sucesso.',
    });
    notify(dormant ? 'Lead marcado como dormente.' : 'Lead reativado com sucesso!');
  }, [notify, upsertLeadInState]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
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
  }, [filterNeighborhood, filterStatus, leads, searchQuery]);

  const toggleSort = useCallback((key: LeadSortKey) => {
    if (sortKey === key) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDir('asc');
  }, [sortKey]);

  const sortedFilteredLeads = useMemo(() => {
    if (!sortKey) return filteredLeads;

    return [...filteredLeads].sort((left, right) => {
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

  const toggleMonthlySeries = useCallback((series: MonthlyEvolutionSeries) => {
    setVisibleMonthlySeries((current) => ({
      ...current,
      [series]: !current[series],
    }));
  }, []);

  const daysInStatus = useCallback((lead: Lead) => {
    return Math.floor((renderTime - new Date(lead.statusChangedAt).getTime()) / 86400000);
  }, [renderTime]);

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

  return {
    leads,
    searchQuery,
    setSearchQuery,
    filterNeighborhood,
    setFilterNeighborhood,
    filterStatus,
    setFilterStatus,
    viewMode,
    setViewMode,
    collapsedCards,
    visibleMonthlySeries,
    toggleMonthlySeries,
    agendaInitialView,
    setAgendaInitialView,
    sortKey,
    sortDir,
    isModalOpen,
    selectedLead,
    leadDetail,
    commercialAction,
    setCommercialAction,
    trashedLeads,
    loadingTrashLeads,
    leadStatusHistory,
    loadingLeadStatusHistory,
    availableFilmTypeOptions,
    notification,
    crmSync,
    linkedOrcamento,
    targetGoal,
    editingTarget,
    setEditingTarget,
    targetInput,
    setTargetInput,
    saveTargetGoal,
    isVerifyingCloud,
    lastCloudCheckAt,
    leadForm,
    setLeadForm,
    filteredLeads,
    sortedFilteredLeads,
    handleVerifyCloudLeads,
    loadTrashLeads,
    openCommercialAction,
    applyCommercialAction,
    setCollapsedStateForAllLeads,
    toggleCollapsedCard,
    handleLeadSubmit,
    openCreateModal,
    openEditModal,
    closeLeadModal,
    closeLeadDetailModal,
    handleLeadTableRowClick,
    handleLeadTableRowDoubleClick,
    handleDeleteLead,
    handleRestoreLead,
    handleStatusChange,
    handleAgendaSchedule,
    handleServiceStatusChange,
    handleAgendaMarkDone,
    handleDormantStateChange,
    toggleSort,
    daysInStatus,
    commercialActionTitle,
    commercialActionLabel,
    setLeadDetail,
    setIsModalOpen,
  };
};
