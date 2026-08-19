'use client';

import dynamic from 'next/dynamic';
import {
  formatCurrencyBRL,
  getLeadActivityDate,
  getLeadFollowUpDate,
  getLeadPhoneHref,
  getLeadServiceDate,
  getLeadServiceStatus,
  getLeadStatusClasses,
  getWhatsAppHref,
  isClosedLead,
  SERVICE_STATUS_META,
} from '../hooks/useAgenda';
import { useCrmSettings } from '../hooks/useCrmSettings';
import { useLeads } from '../hooks/useLeads';
import { useMetrics } from '../hooks/useMetrics';
import { formatLeadCurrency } from '../utils';
import { RJ_NEIGHBORHOODS } from '../constants';
import { TabErrorBoundary } from './ErrorBoundary';
import type { CrmTab } from '../types';

const AgendaSection = dynamic(() => import('./AgendaSection').then((m) => m.AgendaSection), {
  loading: () => <TabSkeleton />,
});
const HistoricoSupabase = dynamic(() => import('./HistoricoSupabase').then((m) => m.HistoricoSupabase), {
  loading: () => <TabSkeleton />,
});
const KanbanBoard = dynamic(() => import('./KanbanBoard').then((m) => m.KanbanBoard), {
  loading: () => <TabSkeleton />,
});
const MetricsPanel = dynamic(() => import('./MetricsPanel').then((m) => m.MetricsPanel), {
  loading: () => <TabSkeleton />,
});
const PlaybookSettings = dynamic(() => import('./PlaybookSettings').then((m) => m.PlaybookSettings), {
  loading: () => <TabSkeleton />,
});
const TrashLeadsView = dynamic(() => import('./TrashLeadsView').then((m) => m.TrashLeadsView), {
  loading: () => <TabSkeleton />,
});
const ArchiveLeadsView = dynamic(() => import('./ArchiveLeadsView').then((m) => m.ArchiveLeadsView), {
  loading: () => <TabSkeleton />,
});
const ExtratosMensaisSupabase = dynamic(() => import('../ExtratosMensaisSupabase').then((m) => m.ExtratosMensaisSupabase), {
  loading: () => <TabSkeleton />,
});

function TabSkeleton() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <span className="animate-pulse text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a227]/70">
        Carregando...
      </span>
    </div>
  );
}

interface CrmTabRouterProps {
  activeTab: CrmTab;
  onSelectTab: (tab: CrmTab) => void;
  crm: ReturnType<typeof useLeads>;
  metrics: ReturnType<typeof useMetrics>;
  crmSettings: ReturnType<typeof useCrmSettings>;
}

export function CrmTabRouter({ activeTab, onSelectTab, crm, metrics, crmSettings }: CrmTabRouterProps) {
  if (activeTab === 'dashboard') {
    return (
      <TabErrorBoundary fallbackTitle="Painel Geral">
        <MetricsPanel
          leads={crm.leads}
          stats={metrics.stats}
          monthlyEvolution={metrics.monthlyEvolution}
          periodSummary={metrics.periodSummary}
          metricsPeriod={crm.metricsPeriod}
          onMetricsPeriodChange={crm.setMetricsPeriod}
          customStart={crm.customStart}
          customEnd={crm.customEnd}
          onCustomStartChange={crm.setCustomStart}
          onCustomEndChange={crm.setCustomEnd}
          monthDifference={metrics.monthDifference}
          monthDifferencePercent={metrics.monthDifferencePercent}
          monthTrendIsPositive={metrics.monthTrendIsPositive}
          visibleMonthlySeries={crm.visibleMonthlySeries}
          onToggleMonthlySeries={crm.toggleMonthlySeries}
          formatDashboardCurrency={metrics.formatDashboardCurrency}
          formatCurrency={formatLeadCurrency}
          getLeadStatusClasses={getLeadStatusClasses}
          onOpenLead={crm.setLeadDetail}
          onOpenCreateModal={() => crm.openCreateModal()}
          onOpenAgendaNoAction={() => {
            crm.setAgendaInitialView('sem_acao');
            onSelectTab('agenda');
          }}
          onOpenAgendaToday={() => {
            crm.setAgendaInitialView('hoje');
            onSelectTab('agenda');
          }}
          onOpenLeads={() => onSelectTab('leads')}
          targetGoal={crm.targetGoal}
          targetPercent={metrics.targetPercent}
          editingTarget={crm.editingTarget}
          targetInput={crm.targetInput}
          setTargetInput={crm.setTargetInput}
          setEditingTarget={crm.setEditingTarget}
          saveTargetGoal={crm.saveTargetGoal}
        />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'leads') {
    return (
      <TabErrorBoundary fallbackTitle="Controle de Leads">
        <KanbanBoard
          leads={crm.leads}
          filteredLeads={crm.filteredLeads}
          sortedFilteredLeads={crm.sortedFilteredLeads}
          searchQuery={crm.searchQuery}
          setSearchQuery={crm.setSearchQuery}
          filterNeighborhood={crm.filterNeighborhood}
          setFilterNeighborhood={crm.setFilterNeighborhood}
          filterStatus={crm.filterStatus}
          setFilterStatus={crm.setFilterStatus}
          hasActiveFilters={crm.hasActiveFilters}
          onClearFilters={crm.clearFilters}
          neighborhoods={RJ_NEIGHBORHOODS}
          viewMode={crm.viewMode}
          setViewMode={crm.setViewMode}
          collapsedCards={crm.collapsedCards}
          onCollapseAll={() => crm.setCollapsedStateForAllLeads(true)}
          onExpandAll={() => crm.setCollapsedStateForAllLeads(false)}
          onToggleCollapse={crm.toggleCollapsedCard}
          onOpenCreateModal={() => crm.openCreateModal()}
          onOpenDetail={crm.setLeadDetail}
          onOpenEdit={(lead) => void crm.openEditModal(lead)}
          onDelete={(leadId) => void crm.handleDeleteLead(leadId)}
          onStatusChange={(leadId, status) => void crm.handleStatusChange(leadId, status)}
          onReorderLead={crm.handleKanbanReorder}
          onTogglePin={(leadId) => void crm.handleTogglePin(leadId)}
          onTableRowClick={crm.handleLeadTableRowClick}
          onTableRowDoubleClick={crm.handleLeadTableRowDoubleClick}
          sortKey={crm.sortKey}
          sortDir={crm.sortDir}
          onToggleSort={crm.toggleSort}
          daysInStatus={crm.daysInStatus}
          formatCurrency={formatLeadCurrency}
          getLeadServiceDate={getLeadServiceDate}
          getLeadStatusClasses={getLeadStatusClasses}
          leadSyncState={crm.leadSyncState}
        />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'trash') {
    return (
      <TabErrorBoundary fallbackTitle="Lixeira de Leads">
        <TrashLeadsView
          leads={crm.trashedLeads}
          loading={crm.loadingTrashLeads}
          onRefresh={crm.loadTrashLeads}
          onRestore={(lead) => crm.handleRestoreLead(lead)}
        />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'archive') {
    return (
      <TabErrorBoundary fallbackTitle="Arquivo de Leads">
        <ArchiveLeadsView
          leads={crm.archivedLeads}
          loading={crm.loadingArchivedLeads}
          onRefresh={crm.loadArchivedLeads}
          onRestore={(lead) => crm.handleRestoreFromArchive(lead)}
        />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'historico') {
    return (
      <TabErrorBoundary fallbackTitle="Histórico Supabase">
        <HistoricoSupabase
          setActiveTab={onSelectTab}
          openCreateModal={crm.openCreateModal}
        />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'extratos') {
    return (
      <TabErrorBoundary fallbackTitle="Extratos Mensais">
        <ExtratosMensaisSupabase />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'settings') {
    return (
      <TabErrorBoundary fallbackTitle="Configuracoes do CRM">
        <PlaybookSettings
          activeSellerId={crm.activeSellerId}
          activePlaybook={crm.activePlaybook}
          sellerIds={crm.sellerIds}
          loading={crm.playbookLoading}
          saving={crm.playbookSaving}
          error={crm.playbookError}
          onChangeSeller={crm.setActiveSellerId}
          onUpdateRule={crm.updatePlaybookRule}
          onResetPlaybook={crm.resetActivePlaybook}
          onReload={crm.reloadPlaybooks}
          archiveAfterDays={crmSettings.archiveAfterDays}
          loadingArchiveAfterDays={crmSettings.loadingArchiveAfterDays}
          savingArchiveAfterDays={crmSettings.savingArchiveAfterDays}
          archiveAfterDaysError={crmSettings.archiveAfterDaysError}
          onUpdateArchiveAfterDays={crmSettings.updateArchiveAfterDays}
        />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'agenda') {
    return (
      <TabErrorBoundary fallbackTitle="Agenda & Follow-up">
        <AgendaSection
          leads={crm.leads}
          initialView={crm.agendaInitialView}
          onAgendarRetorno={crm.handleAgendaSchedule}
          onMarcarFeito={crm.handleAgendaMarkDone}
          onSetDormant={crm.handleDormantStateChange}
          onUpdateServiceStatus={crm.handleServiceStatusChange}
          onAbrirLead={crm.setLeadDetail}
          onRestoreFromArchive={crm.handleRestoreFromArchive}
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
    );
  }

  return null;
}
