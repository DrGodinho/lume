'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  formatDateInputValue,
  getLeadFollowUpDate,
  getLeadPhoneHref,
  getLeadServiceDate,
  getLeadStatusClasses,
  getWhatsAppHref,
  useAgenda,
} from './hooks/useAgenda';
import { useLogout } from './hooks/useLogout';
import { useMetrics } from './hooks/useMetrics';
import { useMonthlySnapshots } from './hooks/useMonthlySnapshots';
import { useCrmSettings } from './hooks/useCrmSettings';
import { usePullToRefresh } from './hooks/usePullToRefresh';
import { formatLeadCurrency } from './utils';
import { RefreshCw } from 'lucide-react';
import type { CrmTab } from './types';
import { AuthGuard } from './hooks/useAuthGuard';
import { useTokenRefresh } from './hooks/useTokenRefresh';
import { CommercialActionModal, LeadDetailModal, LeadFormModal } from './components/LeadModal';
import { ToastProvider, ToastViewport } from './components/ToastProvider';
import { CrmSidebar } from './components/CrmSidebar';
import { CrmHeader } from './components/CrmHeader';
import { CrmTabRouter } from './components/CrmTabRouter';
import { OfflineBanner } from './components/OfflineBanner';
import { CRM_ACTIVE_TAB_STORAGE_KEY, DEFAULT_CRM_TARGET_GOAL, RJ_NEIGHBORHOODS } from './constants';
import { CrmProvider, useCrm } from './context/CrmContext';

const VALID_CRM_TABS = new Set<CrmTab>(['dashboard', 'leads', 'trash', 'archive', 'historico', 'extratos', 'agenda', 'settings']);

function CrmContent() {
  useTokenRefresh();
  const [activeTab, setActiveTab] = useState<CrmTab>('dashboard');
  const [activeTabRestored, setActiveTabRestored] = useState(false);

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
      <CrmProvider activeTab={activeTab}>
        <CrmApp activeTab={activeTab} onSelectTab={setActiveTab} />
      </CrmProvider>
    </ToastProvider>
  );
}

function CrmApp({ activeTab, onSelectTab }: { activeTab: CrmTab; onSelectTab: (tab: CrmTab) => void }) {
  const crm = useCrm();
  const [sidebarEditingTarget, setSidebarEditingTarget] = useState(false);
  const { agendaUrgentCount } = useAgenda(crm.leads);
  const { snapshots: monthlySnapshots } = useMonthlySnapshots();
  const crmSettings = useCrmSettings();
  const metrics = useMetrics(crm.leads, crm.targetGoal, monthlySnapshots, crm.metricsPeriod, crm.customStart, crm.customEnd, crm.archivedLeads);
  const { isLoggingOut, logout: handleLogout } = useLogout('/login');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const pendingFocusSearchRef = useRef(false);
  const activeTabRef = useRef(activeTab);
  const crmRef = useRef(crm);

  useEffect(() => {
    activeTabRef.current = activeTab;
    crmRef.current = crm;
  });

  const handleVerifyCloud = useCallback(() => {
    void crmRef.current.handleVerifyCloudLeads();
  }, []);

  const { pullDistance, refreshing, threshold } = usePullToRefresh({ onRefresh: handleVerifyCloud });

  useEffect(() => {
    const isEditableTarget = (el: Element | null) => {
      if (!el) return false;
      const tag = el.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el as HTMLElement).isContentEditable;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const current = crmRef.current;

      if (event.key === '/' && !isEditableTarget(document.activeElement)) {
        event.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        } else {
          pendingFocusSearchRef.current = true;
          if (activeTabRef.current !== 'leads') onSelectTab('leads');
        }
        return;
      }

      if ((event.key === 'n' || event.key === 'N') && !event.ctrlKey && !event.metaKey && !isEditableTarget(document.activeElement)) {
        if (current.isModalOpen || current.leadDetail) return;
        event.preventDefault();
        current.openCreateModal();
        return;
      }

      if (event.key === 'Escape') {
        if (current.leadDetail) {
          current.closeLeadDetailModal();
          return;
        }
        if (current.isModalOpen && !current.isLeadFormDirty) {
          current.closeLeadModal();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onSelectTab]);

  useEffect(() => {
    if (pendingFocusSearchRef.current && activeTab === 'leads' && searchInputRef.current) {
      pendingFocusSearchRef.current = false;
      searchInputRef.current.focus();
      searchInputRef.current.select();
    }
  }, [activeTab]);

  const beginSidebarTargetEdit = useCallback(() => {
    crm.setTargetInput(String(crm.targetGoal ?? DEFAULT_CRM_TARGET_GOAL));
    setSidebarEditingTarget(true);
  }, [crm]);

  const closeSidebarTargetEdit = useCallback(() => {
    crm.setTargetInput(String(crm.targetGoal ?? DEFAULT_CRM_TARGET_GOAL));
    setSidebarEditingTarget(false);
  }, [crm]);

  const commitTargetGoal = useCallback(() => {
    const value = parseInt(crm.targetInput, 10);
    if (value > 0) {
      void crm.saveTargetGoal(value);
      setSidebarEditingTarget(false);
      return;
    }

    closeSidebarTargetEdit();
  }, [closeSidebarTargetEdit, crm]);

  return (
    <div className="crm-technical-density flex min-h-screen flex-col overflow-x-hidden bg-[#03060b] font-sans lg:flex-row">
      <OfflineBanner />
      <ToastViewport />

      <CrmSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        agendaUrgentCount={agendaUrgentCount}
        sidebarEditingTarget={sidebarEditingTarget}
        onBeginTargetEdit={beginSidebarTargetEdit}
        onCommitTargetEdit={commitTargetGoal}
        targetInput={crm.targetInput}
        onTargetInputChange={crm.setTargetInput}
        targetGoal={crm.targetGoal}
        targetPercent={metrics.targetPercent}
        onOpenCreateModal={() => crm.openCreateModal()}
        onLogout={() => void handleLogout()}
        isLoggingOut={isLoggingOut}
      />

      <main className="relative z-10 flex-1 overflow-x-hidden p-3 sm:p-5 lg:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#07111d]/90 px-3 py-1.5 text-[11px] font-semibold text-white/70 shadow-lg backdrop-blur"
          style={{
            transform: refreshing ? 'translate(-50%, 0)' : `translate(-50%, ${Math.max(0, pullDistance - threshold)}px)`,
            opacity: pullDistance > 0 || refreshing ? 1 : 0,
            transition: refreshing ? 'transform 0.2s ease' : 'none',
          }}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Atualizando...' : pullDistance >= threshold ? 'Solte para atualizar' : 'Puxe para atualizar'}
        </div>

        <CrmHeader
          activeTab={activeTab}
          crmSync={crm.crmSync}
          lastCloudCheckAt={crm.lastCloudCheckAt}
          isVerifyingCloud={crm.isVerifyingCloud}
          onVerifyCloud={handleVerifyCloud}
        />

        <CrmTabRouter
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          metrics={metrics}
          crmSettings={crmSettings}
          searchInputRef={searchInputRef}
        />
      </main>

      <LeadFormModal
        isOpen={crm.isModalOpen}
        selectedLead={crm.selectedLead}
        linkedOrcamento={crm.linkedOrcamento}
        activeFilmOptions={crm.availableFilmTypeOptions}
        neighborhoods={RJ_NEIGHBORHOODS}
        leadForm={crm.leadForm}
        setLeadForm={crm.setLeadForm}
        isDirty={crm.isLeadFormDirty}
        onClose={crm.closeLeadModal}
        onSubmit={crm.handleLeadSubmit}
        onSave={async () => {
          const saved = await crm.handleLeadSave();
          if (saved) {
            crm.setInitialLeadForm(crm.leadForm);
          }
          return saved;
        }}
        onOpenHistory={() => onSelectTab('historico')}
        formatDateInputValue={formatDateInputValue}
        leads={crm.leads}
        onOpenLead={(lead) => {
          crm.closeLeadModal();
          crm.setLeadDetail(lead);
        }}
      />

      <LeadDetailModal
        leadDetail={crm.leadDetail}
        leadStatusHistory={crm.leadStatusHistory}
        loadingLeadStatusHistory={crm.loadingLeadStatusHistory}
        linkedOrcamento={crm.linkedDetailOrcamento}
        getLeadPhoneHref={getLeadPhoneHref}
        getLeadStatusClasses={getLeadStatusClasses}
        getLeadServiceDate={getLeadServiceDate}
        getLeadFollowUpDate={getLeadFollowUpDate}
        getWhatsAppHref={getWhatsAppHref}
        formatCurrency={formatLeadCurrency}
        onClose={crm.closeLeadDetailModal}
        onOpenEdit={(lead) => {
          void crm.openEditModal(lead);
          crm.closeLeadDetailModal();
        }}
        onDuplicate={(lead) => {
          crm.openCreateModal({
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
          crm.closeLeadDetailModal();
        }}
        onOpenHistory={() => {
          onSelectTab('historico');
          crm.closeLeadDetailModal();
        }}
        onOpenCommercialAction={crm.openCommercialAction}
      />

      <CommercialActionModal
        commercialAction={crm.commercialAction}
        title={crm.commercialActionTitle}
        label={crm.commercialActionLabel}
        onClose={() => crm.setCommercialAction(null)}
        onSubmit={crm.applyCommercialAction}
        setCommercialAction={crm.setCommercialAction}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthGuard>
      <CrmContent />
    </AuthGuard>
  );
}
