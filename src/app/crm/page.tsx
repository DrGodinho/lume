'use client';

import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Database,
  LogOut,
  Plus,
  ReceiptText,
  RefreshCw,
  Settings,
  Trash2,
  UsersRound,
  XCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AgendaSection } from './components/AgendaSection';
import { CommercialActionModal, LeadDetailModal, LeadFormModal } from './components/LeadModal';
import { TabErrorBoundary } from './components/ErrorBoundary';
import { HistoricoSupabase } from './components/HistoricoSupabase';
import { KanbanBoard } from './components/KanbanBoard';
import { MetricsPanel } from './components/MetricsPanel';
import { PlaybookSettings } from './components/PlaybookSettings';
import { ToastProvider, ToastViewport } from './components/ToastProvider';
import { TrashLeadsView } from './components/TrashLeadsView';
import { ExtratosMensaisSupabase } from './ExtratosMensaisSupabase';
import { CRM_ACTIVE_TAB_STORAGE_KEY, DEFAULT_CRM_TARGET_GOAL, RJ_NEIGHBORHOODS } from './constants';
import { useAgenda, formatCurrencyBRL, formatDateInputValue, getLeadActivityDate, getLeadFollowUpDate, getLeadPhoneHref, getLeadServiceDate, getLeadServiceStatus, getLeadStatusClasses, getWhatsAppHref, isClosedLead, SERVICE_STATUS_META } from './hooks/useAgenda';
import { useLeads } from './hooks/useLeads';
import { useLogout } from './hooks/useLogout';
import { useMetrics } from './hooks/useMetrics';
import { useMonthlySnapshots } from './hooks/useMonthlySnapshots';
import { formatLeadCurrency } from './utils';
import type { CrmTab } from './types';

const VALID_CRM_TABS = new Set<CrmTab>(['dashboard', 'leads', 'trash', 'historico', 'extratos', 'agenda', 'settings']);

type NavTone = 'gold' | 'red' | 'slate';

interface CrmNavItem {
  id: CrmTab;
  label: string;
  description: string;
  icon: LucideIcon;
  tone: NavTone;
}

const CRM_NAV_SECTIONS: Array<{ label: string; items: CrmNavItem[] }> = [
  {
    label: 'Operação',
    items: [
      { id: 'dashboard', label: 'Painel Geral', description: 'Métricas e meta', icon: BarChart3, tone: 'gold' },
      { id: 'leads', label: 'Controle de Leads', description: 'Funil comercial', icon: UsersRound, tone: 'gold' },
      { id: 'agenda', label: 'Agenda & Follow-up', description: 'Retornos e serviços', icon: CalendarClock, tone: 'red' },
    ],
  },
  {
    label: 'Dados',
    items: [
      { id: 'historico', label: 'Histórico Supabase', description: 'Orçamentos salvos', icon: Database, tone: 'slate' },
      { id: 'extratos', label: 'Extratos Mensais', description: 'Fechamentos por mês', icon: ReceiptText, tone: 'slate' },
      { id: 'settings', label: 'Configuracoes', description: 'Playbooks e automacoes', icon: Settings, tone: 'slate' },
      { id: 'trash', label: 'Lixeira', description: 'Leads removidos', icon: Trash2, tone: 'red' },
    ],
  },
];

const NAV_TONE_CLASSES: Record<NavTone, { active: string; icon: string; badge: string }> = {
  gold: {
    active: 'border-[#c9a227] bg-[#c9a227]/10 text-white shadow-[inset_0_0_0_1px_rgba(201,162,39,0.08)]',
    icon: 'bg-[#c9a227]/15 text-[#f5d77a]',
    badge: 'bg-[#c9a227] text-[#04080f]',
  },
  red: {
    active: 'border-red-400 bg-red-500/10 text-white shadow-[inset_0_0_0_1px_rgba(248,113,113,0.08)]',
    icon: 'bg-red-500/15 text-red-300',
    badge: 'bg-red-500 text-white',
  },
  slate: {
    active: 'border-white/30 bg-white/[0.06] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]',
    icon: 'bg-white/[0.06] text-white/70',
    badge: 'bg-white/15 text-white',
  },
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<CrmTab>('dashboard');
  const [activeTabRestored, setActiveTabRestored] = useState(false);
  const [sidebarEditingTarget, setSidebarEditingTarget] = useState(false);
  const {
    leads,
    searchQuery,
    setSearchQuery,
    filterNeighborhood,
    setFilterNeighborhood,
    filterStatus,
    setFilterStatus,
    hasActiveFilters,
    clearFilters,
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
    isLeadFormDirty,
    setInitialLeadForm,
    commercialAction,
    setCommercialAction,
    trashedLeads,
    loadingTrashLeads,
    leadStatusHistory,
    loadingLeadStatusHistory,
    availableFilmTypeOptions,
    crmSync,
    leadSyncState,
    linkedOrcamento,
    linkedDetailOrcamento,
    targetGoal,
    editingTarget,
    setEditingTarget,
    targetInput,
    setTargetInput,
    saveTargetGoal,
    activeSellerId,
    activePlaybook,
    sellerIds,
    playbookLoading,
    playbookSaving,
    playbookError,
    setActiveSellerId,
    updatePlaybookRule,
    resetActivePlaybook,
    reloadPlaybooks,
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
    handleLeadSave,
    openCreateModal,
    openEditModal,
    closeLeadModal,
    closeLeadDetailModal,
    handleLeadTableRowClick,
    handleLeadTableRowDoubleClick,
    handleDeleteLead,
    handleRestoreLead,
    handleStatusChange,
    handleKanbanReorder,
    handleAgendaSchedule,
    handleServiceStatusChange,
    handleAgendaMarkDone,
    handleDormantStateChange,
    handleTogglePin,
    toggleSort,
    daysInStatus,
    commercialActionTitle,
    commercialActionLabel,
    setLeadDetail,
  } = useLeads(activeTab);
  const { agendaUrgentCount } = useAgenda(leads);
  const { snapshots: monthlySnapshots } = useMonthlySnapshots();
  const {
    stats,
    monthlyEvolution,
    monthDifference,
    monthDifferencePercent,
    monthTrendIsPositive,
    targetPercent,
    formatDashboardCurrency,
  } = useMetrics(leads, targetGoal, monthlySnapshots);
  const syncTone = crmSync.status === 'error' ? 'error' : crmSync.status === 'warning' ? 'warning' : 'ok';
  const syncStatusLabel = syncTone === 'error'
    ? 'Erro'
    : syncTone === 'warning'
      ? 'Sincronizando'
      : 'Sincronizado';
  const lastCloudCheckLabel = lastCloudCheckAt
    ? format(new Date(lastCloudCheckAt), 'HH:mm')
    : '--:--';
  const SyncIcon = syncTone === 'error' ? XCircle : syncTone === 'warning' ? RefreshCw : CheckCircle2;
  const syncClasses = {
    error: {
      panel: 'border-red-500/25 bg-red-500/10',
      icon: 'bg-red-500/15 text-red-300',
      dot: 'bg-red-400',
      text: 'text-red-200',
      button: 'border-red-400/25 text-red-200 hover:bg-red-500/10',
    },
    warning: {
      panel: 'border-[#c9a227]/25 bg-[#c9a227]/10',
      icon: 'bg-[#c9a227]/15 text-[#f5d77a]',
      dot: 'animate-pulse bg-[#f5d77a]',
      text: 'text-[#f5d77a]',
      button: 'border-[#c9a227]/30 text-[#f5d77a] hover:bg-[#c9a227]/10',
    },
    ok: {
      panel: 'border-emerald-500/20 bg-emerald-500/10',
      icon: 'bg-emerald-500/15 text-emerald-300',
      dot: 'bg-emerald-400',
      text: 'text-emerald-300',
      button: 'border-emerald-400/25 text-emerald-200 hover:bg-emerald-500/10',
    },
  }[syncTone];

  const { isLoggingOut, logout: handleLogout } = useLogout('/login');

  const beginSidebarTargetEdit = useCallback(() => {
    setTargetInput(String(targetGoal ?? DEFAULT_CRM_TARGET_GOAL));
    setSidebarEditingTarget(true);
  }, [setTargetInput, targetGoal]);

  const closeSidebarTargetEdit = useCallback(() => {
    setTargetInput(String(targetGoal ?? DEFAULT_CRM_TARGET_GOAL));
    setSidebarEditingTarget(false);
  }, [setTargetInput, targetGoal]);

  const commitTargetGoal = useCallback(() => {
    const value = parseInt(targetInput, 10);
    if (value > 0) {
      void saveTargetGoal(value);
      setSidebarEditingTarget(false);
      return;
    }

    closeSidebarTargetEdit();
  }, [closeSidebarTargetEdit, saveTargetGoal, targetInput]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const tabFromUrl = searchParams.get('tab');
    const nextTab =
      tabFromUrl && VALID_CRM_TABS.has(tabFromUrl as CrmTab)
        ? tabFromUrl as CrmTab
        : (() => {
            const tabFromStorage = window.sessionStorage.getItem(CRM_ACTIVE_TAB_STORAGE_KEY);
            return tabFromStorage && VALID_CRM_TABS.has(tabFromStorage as CrmTab)
              ? tabFromStorage as CrmTab
              : 'dashboard';
          })();

    const restoreHandle = window.setTimeout(() => {
      setActiveTab(nextTab);
      setActiveTabRestored(true);
    }, 0);

    return () => window.clearTimeout(restoreHandle);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!activeTabRestored) return;

    window.sessionStorage.setItem(CRM_ACTIVE_TAB_STORAGE_KEY, activeTab);

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('tab', activeTab);
    const nextSearch = nextUrl.searchParams.toString();
    const currentSearch = window.location.search.startsWith('?')
      ? window.location.search.slice(1)
      : window.location.search;

    if (nextSearch !== currentSearch) {
      window.history.replaceState({}, '', `${nextUrl.pathname}${nextSearch ? `?${nextSearch}` : ''}${nextUrl.hash}`);
    }
  }, [activeTab, activeTabRestored]);

  return (
    <ToastProvider>
      <div className="crm-technical-density flex min-h-screen flex-col overflow-x-hidden bg-[#03060b] font-sans lg:flex-row">
        <ToastViewport />

      <aside className="sticky top-0 z-40 flex w-full flex-col border-b border-white/10 bg-[#050b13] p-3 lg:relative lg:z-10 lg:w-64 lg:border-b-0 lg:border-r lg:p-4">
        <div className="flex items-center justify-between gap-3 lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a227] p-0.5 shadow-lg shadow-[#c9a227]/10">
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
            <button onClick={() => openCreateModal()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227] text-[#04080f] shadow-lg shadow-[#c9a227]/10 transition active:scale-95" title="Novo Lead">
              <Plus className="h-4.5 w-4.5" strokeWidth={3} />
            </button>
            <button onClick={() => void handleLogout()} disabled={isLoggingOut} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] text-white/45 transition hover:text-red-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" title="Sair do CRM">
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <div className="mt-5 hidden lg:block">
          {sidebarEditingTarget ? (
            <div className="rounded-xl border border-[#c9a227]/30 bg-[#03060b] p-3 shadow-[inset_0_0_0_1px_rgba(201,162,39,0.06)]">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white/60">Faturamento Mensal</span>
                <span className="text-[#c9a227]">{targetPercent ?? '--'}{targetPercent !== null ? '%' : ''}</span>
              </div>
              <input
                type="number"
                value={targetInput}
                min={1}
                onChange={(event) => setTargetInput(event.target.value)}
                onBlur={commitTargetGoal}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.currentTarget.blur();
                  }
                }}
                className="mt-3 w-full rounded-lg border border-[#c9a227]/35 bg-[#04080f] px-2.5 py-2 text-right text-sm font-bold text-white outline-none transition focus:border-[#f5d77a]/70"
                aria-label="Meta mensal do CRM"
                autoFocus
              />
              <p className="mt-2 text-right text-[10px] text-white/40">Enter salva a meta</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={beginSidebarTargetEdit}
              className="w-full rounded-xl border border-white/10 bg-[#03060b] p-3 text-left transition hover:border-[#c9a227]/35 hover:bg-[#07111d]"
              title="Alterar meta mensal"
            >
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white/60">Faturamento Mensal</span>
                <span className="text-[#c9a227]">{targetPercent ?? '--'}{targetPercent !== null ? '%' : ''}</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/5 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#c9a227] to-[#d4ad30] shadow-inner transition-all duration-1000"
                  style={{ width: `${targetPercent ?? 0}%` }}
                />
              </div>
              <p className="mt-2 text-right text-[10px] text-white/40">
                {targetGoal !== null ? `Meta: R$ ${targetGoal.toLocaleString('pt-BR')}` : 'Sem meta definida'}
              </p>
            </button>
          )}
        </div>

        <nav className="mt-3 flex flex-1 gap-2 overflow-x-auto pb-1 lg:mt-6 lg:flex-none lg:flex-col lg:gap-4 lg:overflow-visible lg:pb-0">
          {CRM_NAV_SECTIONS.map((section) => (
            <div key={section.label} className="flex shrink-0 gap-2 lg:flex-col">
              <p className="hidden px-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/30 lg:block">
                {section.label}
              </p>
              <div className="flex gap-2 lg:flex-col">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const tone = NAV_TONE_CLASSES[item.tone];
                  const isActive = activeTab === item.id;
                  const urgentAgenda = item.id === 'agenda' && agendaUrgentCount > 0;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`group flex min-w-40 shrink-0 items-center gap-2.5 rounded-xl border-l-4 px-3 py-2.5 text-left text-sm font-semibold tracking-wide transition-all active:scale-[0.98] lg:min-w-0 lg:shrink ${
                        isActive
                          ? tone.active
                          : 'border-transparent text-white/58 hover:bg-white/[0.03] hover:text-white'
                      }`}
                    >
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${isActive ? tone.icon : 'bg-white/[0.05] text-white/55 group-hover:text-white/85'}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{item.label}</span>
                        <span className="hidden truncate text-[10px] font-medium normal-case tracking-normal text-white/35 lg:block">
                          {item.description}
                        </span>
                      </span>
                      {urgentAgenda && (
                        <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[10px] font-black ${tone.badge}`}>
                          {agendaUrgentCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <nav className="hidden">
          {[
            { id: 'dashboard' as const, label: 'Painel Geral' },
            { id: 'leads' as const, label: 'Controle de Leads' },
            { id: 'historico' as const, label: 'Histórico Supabase' },
            { id: 'extratos' as const, label: 'Extratos Mensais' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex shrink-0 items-center gap-3.5 rounded-2xl border-l-4 px-4 py-3.5 text-sm font-semibold tracking-wide transition-all lg:shrink ${
                activeTab === item.id
                  ? 'border-[#c9a227] bg-gradient-to-r from-[#c9a227]/10 to-[#c9a227]/5 text-white'
                  : 'border-transparent text-white/60 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('agenda')}
            className={`flex shrink-0 items-center gap-3.5 rounded-2xl border-l-4 px-4 py-3.5 text-sm font-semibold tracking-wide transition-all lg:shrink ${
              activeTab === 'agenda'
                ? 'border-red-400 bg-gradient-to-r from-red-500/10 to-[#c9a227]/5 text-white'
                : 'border-transparent text-white/60 hover:bg-white/[0.02] hover:text-white'
            }`}
          >
            <span className="flex-1 text-left">Agenda & Follow-up</span>
            {agendaUrgentCount > 0 && (
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-[10px] font-black text-white">
                {agendaUrgentCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('trash')}
            className={`flex shrink-0 items-center gap-3.5 rounded-2xl border-l-4 px-4 py-3.5 text-sm font-semibold tracking-wide transition-all lg:shrink ${
              activeTab === 'trash'
                ? 'border-red-400 bg-gradient-to-r from-red-500/10 to-red-500/5 text-white'
                : 'border-transparent text-white/60 hover:bg-white/[0.02] hover:text-white'
            }`}
          >
            Lixeira
          </button>
        </nav>

        <div className="hidden lg:mt-3 lg:block lg:space-y-2 lg:border-t lg:border-white/10 lg:pt-3">
          <button
            onClick={() => openCreateModal()}
            className="flex w-full items-center gap-3 rounded-xl border-l-4 border-[#c9a227] bg-[#c9a227]/12 px-3 py-2.5 text-sm font-semibold tracking-wide text-[#f5d77a] transition-all hover:bg-[#c9a227]/18 hover:text-white active:scale-95"
          >
            <Plus className="h-4.5 w-4.5" strokeWidth={2.5} />
            Novo Lead
          </button>
          <button
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-xl border-l-4 border-transparent px-3 py-2.5 text-sm font-semibold tracking-wide text-white/65 transition-all hover:bg-red-500/10 hover:text-red-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-4.5 w-4.5" />
            {isLoggingOut ? 'Saindo...' : 'Sair do CRM'}
          </button>
        </div>
      </aside>

      <main className="relative z-10 flex-1 overflow-x-hidden p-3 sm:p-5 lg:p-7">
        <header className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between lg:mb-6">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c9a227] sm:text-xs sm:tracking-[0.35em]">LUME Elite</span>
            <h2 className="mt-1 font-display text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
              {activeTab === 'dashboard' && 'Painel Geral'}
              {activeTab === 'leads' && 'Gestão de Leads'}
              {activeTab === 'trash' && 'Lixeira de Leads'}
              {activeTab === 'historico' && 'Histórico Supabase'}
              {activeTab === 'extratos' && 'Extratos Mensais'}
              {activeTab === 'agenda' && 'Agenda & Follow-up'}
              {activeTab === 'settings' && 'Configuracoes do CRM'}
            </h2>
          </div>

          <div className={`flex w-full flex-col gap-2 rounded-xl border p-2 sm:w-auto sm:min-w-0 sm:flex-row sm:items-center ${syncClasses.panel}`}>
            <div className="flex items-center gap-2.5">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${syncClasses.icon}`}>
                <SyncIcon className={`h-4 w-4 ${isVerifyingCloud ? 'animate-spin' : ''}`} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className={`h-1.5 w-1.5 rounded-full ${syncClasses.dot}`} />
                  <p className={`truncate text-[11px] font-black uppercase tracking-[0.14em] ${syncClasses.text}`}>
                    {syncStatusLabel}
                  </p>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/38">{lastCloudCheckLabel}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleVerifyCloudLeads()}
              disabled={isVerifyingCloud}
              className={`inline-flex h-6 items-center justify-center self-start rounded-md border px-2 text-[9px] font-black uppercase tracking-[0.12em] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto ${syncClasses.button}`}
              title="Buscar um snapshot novo do Supabase e comparar com o que está na tela"
            >
              Sincronizar
            </button>
          </div>

          <div className="hidden">
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
              <span className={`h-1.5 w-1.5 rounded-full ${
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
              onClick={() => void handleVerifyCloudLeads()}
              disabled={isVerifyingCloud}
              className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/70 transition hover:border-[#c9a227]/30 hover:text-[#f5d77a] disabled:cursor-not-allowed disabled:opacity-50"
              title="Buscar um snapshot novo do Supabase e comparar com o que esta na tela"
            >
              {isVerifyingCloud ? 'Conferindo...' : 'Verificar'}
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <TabErrorBoundary fallbackTitle="Painel Geral">
            <MetricsPanel
              leads={leads}
              stats={stats}
              monthlyEvolution={monthlyEvolution}
              monthDifference={monthDifference}
              monthDifferencePercent={monthDifferencePercent}
              monthTrendIsPositive={monthTrendIsPositive}
              visibleMonthlySeries={visibleMonthlySeries}
              onToggleMonthlySeries={toggleMonthlySeries}
              formatDashboardCurrency={formatDashboardCurrency}
              formatCurrency={formatLeadCurrency}
              getLeadStatusClasses={getLeadStatusClasses}
              onOpenLead={setLeadDetail}
              onOpenCreateModal={() => openCreateModal()}
              onOpenAgendaNoAction={() => {
                setAgendaInitialView('sem_acao');
                setActiveTab('agenda');
              }}
              onOpenAgendaToday={() => {
                setAgendaInitialView('hoje');
                setActiveTab('agenda');
              }}
              onOpenLeads={() => setActiveTab('leads')}
              targetGoal={targetGoal}
              targetPercent={targetPercent}
              editingTarget={editingTarget}
              targetInput={targetInput}
              setTargetInput={setTargetInput}
              setEditingTarget={setEditingTarget}
              saveTargetGoal={saveTargetGoal}
            />
          </TabErrorBoundary>
        )}

        {activeTab === 'leads' && (
          <TabErrorBoundary fallbackTitle="Controle de Leads">
            <KanbanBoard
              leads={leads}
              filteredLeads={filteredLeads}
              sortedFilteredLeads={sortedFilteredLeads}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterNeighborhood={filterNeighborhood}
              setFilterNeighborhood={setFilterNeighborhood}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              neighborhoods={RJ_NEIGHBORHOODS}
              viewMode={viewMode}
              setViewMode={setViewMode}
              collapsedCards={collapsedCards}
              onCollapseAll={() => setCollapsedStateForAllLeads(true)}
              onExpandAll={() => setCollapsedStateForAllLeads(false)}
              onToggleCollapse={toggleCollapsedCard}
              onOpenCreateModal={() => openCreateModal()}
              onOpenDetail={setLeadDetail}
              onOpenEdit={(lead) => void openEditModal(lead)}
              onDelete={(leadId) => void handleDeleteLead(leadId)}
              onStatusChange={(leadId, status) => void handleStatusChange(leadId, status)}
              onReorderLead={handleKanbanReorder}
              onTogglePin={(leadId) => void handleTogglePin(leadId)}
              onTableRowClick={handleLeadTableRowClick}
              onTableRowDoubleClick={handleLeadTableRowDoubleClick}
              sortKey={sortKey}
              sortDir={sortDir}
              onToggleSort={toggleSort}
              daysInStatus={daysInStatus}
              formatCurrency={formatLeadCurrency}
              getLeadServiceDate={getLeadServiceDate}
              getLeadStatusClasses={getLeadStatusClasses}
              leadSyncState={leadSyncState}
            />
          </TabErrorBoundary>
        )}

        {activeTab === 'trash' && (
          <TabErrorBoundary fallbackTitle="Lixeira de Leads">
            <TrashLeadsView
              leads={trashedLeads}
              loading={loadingTrashLeads}
              onRefresh={loadTrashLeads}
              onRestore={(lead) => handleRestoreLead(lead)}
            />
          </TabErrorBoundary>
        )}

        {activeTab === 'historico' && (
          <TabErrorBoundary fallbackTitle="Histórico Supabase">
            <HistoricoSupabase
              setActiveTab={setActiveTab}
              openCreateModal={openCreateModal}
            />
          </TabErrorBoundary>
        )}

        {activeTab === 'extratos' && (
          <TabErrorBoundary fallbackTitle="Extratos Mensais">
            <ExtratosMensaisSupabase />
          </TabErrorBoundary>
        )}

        {activeTab === 'settings' && (
          <TabErrorBoundary fallbackTitle="Configuracoes do CRM">
            <PlaybookSettings
              activeSellerId={activeSellerId}
              activePlaybook={activePlaybook}
              sellerIds={sellerIds}
              loading={playbookLoading}
              saving={playbookSaving}
              error={playbookError}
              onChangeSeller={setActiveSellerId}
              onUpdateRule={updatePlaybookRule}
              onResetPlaybook={resetActivePlaybook}
              onReload={reloadPlaybooks}
            />
          </TabErrorBoundary>
        )}

        {activeTab === 'agenda' && (
          <TabErrorBoundary fallbackTitle="Agenda & Follow-up">
            <AgendaSection
              leads={leads}
              initialView={agendaInitialView}
              onAgendarRetorno={handleAgendaSchedule}
              onMarcarFeito={handleAgendaMarkDone}
              onSetDormant={handleDormantStateChange}
              onUpdateServiceStatus={handleServiceStatusChange}
              onAbrirLead={setLeadDetail}
              isClosedLead={isClosedLead}
              getLeadFollowUpDate={getLeadFollowUpDate}
              getLeadServiceDate={getLeadServiceDate}
              getLeadActivityDate={getLeadActivityDate}
              getLeadServiceStatus={getLeadServiceStatus}
              getLeadStatusClasses={getLeadStatusClasses}
              getLeadPhoneHref={getLeadPhoneHref}
              getWhatsAppHref={getWhatsAppHref}
              formatCurrencyBRL={formatCurrencyBRL}
              serviceStatusMeta={SERVICE_STATUS_META}
            />
          </TabErrorBoundary>
        )}
      </main>

      <LeadFormModal
        isOpen={isModalOpen}
        selectedLead={selectedLead}
        linkedOrcamento={linkedOrcamento}
        activeFilmOptions={availableFilmTypeOptions}
        neighborhoods={RJ_NEIGHBORHOODS}
        leadForm={leadForm}
        setLeadForm={setLeadForm}
        isDirty={isLeadFormDirty}
        onClose={closeLeadModal}
        onSubmit={handleLeadSubmit}
        onSave={async () => {
          const saved = await handleLeadSave();
          if (saved) {
            setInitialLeadForm(leadForm);
          }
          return saved;
        }}
        onOpenHistory={() => setActiveTab('historico')}
        formatDateInputValue={formatDateInputValue}
      />

      <LeadDetailModal
        leadDetail={leadDetail}
        leadStatusHistory={leadStatusHistory}
        loadingLeadStatusHistory={loadingLeadStatusHistory}
        linkedOrcamento={linkedDetailOrcamento}
        getLeadPhoneHref={getLeadPhoneHref}
        getLeadStatusClasses={getLeadStatusClasses}
        getLeadServiceDate={getLeadServiceDate}
        getLeadFollowUpDate={getLeadFollowUpDate}
        getWhatsAppHref={getWhatsAppHref}
        formatCurrency={formatLeadCurrency}
        onClose={closeLeadDetailModal}
        onOpenEdit={(lead) => {
          void openEditModal(lead);
          closeLeadDetailModal();
        }}
        onDuplicate={(lead) => {
          openCreateModal({
            prefill: {
              name: `${lead.name} (cópia)`,
              phone: lead.phone,
              email: lead.email,
              address: lead.address,
              neighborhood: lead.neighborhood,
              filmType: lead.filmType,
              sqm: lead.sqm,
              value: lead.value,
              status: 'Novo',
              statusChangedAt: new Date().toISOString().split('T')[0],
              dataServico: null,
              serviceStatus: null,
              proximoContato: null,
              dormant: false,
              pinned: false,
              notes: '',
            },
            sourceCalculatorHistoryId: null,
          });
          closeLeadDetailModal();
        }}
        onOpenHistory={() => {
          setActiveTab('historico');
          closeLeadDetailModal();
        }}
        onOpenCommercialAction={openCommercialAction}
      />

      <CommercialActionModal
        commercialAction={commercialAction}
        title={commercialActionTitle}
        label={commercialActionLabel}
        onClose={() => setCommercialAction(null)}
        onSubmit={applyCommercialAction}
        setCommercialAction={setCommercialAction}
      />
      </div>
    </ToastProvider>
  );
}
