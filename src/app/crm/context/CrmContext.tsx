'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { normalizeLeadStatus } from '../hooks/useAgenda';
import { useLeadCommercialAction } from '../hooks/useLeadCommercialAction';
import { useLeadList } from '../hooks/useLeadList';
import { useLeadModal } from '../hooks/useLeadModal';
import { useLeadMutations } from '../hooks/useLeadMutations';
import { useLeadOrcamento } from '../hooks/useLeadOrcamento';
import { useLeadPreferences } from '../hooks/useLeadPreferences';
import { useLeadStatusHistory } from '../hooks/useLeadStatusHistory';
import { useLeadSync } from '../hooks/useLeadSync';
import { usePlaybooks } from '../hooks/usePlaybooks';
import { useToastApi } from '../hooks/useToast';
import { reorderKanbanItems } from '../utils/kanbanDnd';
import { applyFollowUpPlaybook } from '../utils/playbooks';
import type { CrmTab, Lead, LeadStatus } from '../types';

/**
 * Composição central do CRM. Substitui o antigo `useLeads` "god hook": orquestra
 * os hooks de fatia (já separados) e expõe o estado via Context.
 */
export function useCrmState(activeTab: CrmTab) {
  const toast = useToastApi();
  const leadTableClickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [renderTime] = useState(() => Date.now());

  const leadList = useLeadList(activeTab, toast);
  const { setLeads } = leadList;
  const leadSync = useLeadSync(leadList.leads, leadList.setLeads);
  const leadPreferences = useLeadPreferences(leadList.leads);
  const playbooks = usePlaybooks();
  const leadOrcamento = useLeadOrcamento();
  const leadModal = useLeadModal(
    leadList.defaultLeadFilmType,
    leadList.filmTypeOptions,
    leadOrcamento.fetchLinkedOrcamento,
  );
  const statusHistory = useLeadStatusHistory(leadModal.leadDetail);

  const leadMutations = useLeadMutations({
    leads: leadList.leads,
    setLeads: leadList.setLeads,
    setTrashedLeads: leadList.setTrashedLeads,
    setArchivedLeads: leadList.setArchivedLeads,
    leadForm: leadModal.leadForm,
    selectedLead: leadModal.selectedLead,
    pendingCalculatorHistoryId: leadModal.pendingCalculatorHistoryId,
    closeLeadModal: leadModal.closeLeadModal,
    syncLeadToCloud: leadSync.syncLeadToCloud,
    syncLeadStatusPatch: leadSync.syncLeadStatusPatch,
    upsertLeadInState: leadList.upsertLeadInState,
    linkCalculatorHistoryToLead: leadOrcamento.linkCalculatorHistoryToLead,
    setCrmSync: leadSync.setCrmSync,
    markLeadSyncState: leadSync.markLeadSyncState,
    playbookRules: playbooks.activePlaybook.rules,
    toast,
  });

  const commercialAction = useLeadCommercialAction(
    leadMutations.updateSingleLead,
    leadModal.setLeadDetail,
    toast,
  );

  useEffect(() => () => {
    if (leadTableClickTimeoutRef.current) {
      clearTimeout(leadTableClickTimeoutRef.current);
    }
  }, []);

  const handleLeadTableRowClick = useCallback((lead: Lead) => {
    if (leadTableClickTimeoutRef.current) {
      clearTimeout(leadTableClickTimeoutRef.current);
    }

    leadTableClickTimeoutRef.current = setTimeout(() => {
      leadModal.setLeadDetail(lead);
      leadTableClickTimeoutRef.current = null;
    }, 220);
  }, [leadModal]);

  const handleLeadTableRowDoubleClick = useCallback((lead: Lead) => {
    if (leadTableClickTimeoutRef.current) {
      clearTimeout(leadTableClickTimeoutRef.current);
      leadTableClickTimeoutRef.current = null;
    }

    void leadModal.openEditModal(lead);
  }, [leadModal]);

  const handleStatusChange = useCallback(async (id: string, newStatus: LeadStatus) => {
    const lead = leadList.leads.find((item) => item.id === id);
    if (!lead) return;
    if (newStatus === 'Agendado') {
      commercialAction.openCommercialAction(lead, 'servico');
      return;
    }
    if (newStatus === 'Fechado') {
      commercialAction.openCommercialAction(lead, 'fechado');
      return;
    }
    if (newStatus === 'Perdido') {
      commercialAction.openCommercialAction(lead, 'perdido');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const { synced } = await leadMutations.updateSingleLead(id, (currentLead) => {
      const updatedLead = {
        ...currentLead,
        status: normalizeLeadStatus(newStatus),
        statusChangedAt: currentLead.status === newStatus ? currentLead.statusChangedAt : today,
        updatedAt: new Date().toISOString(),
      };
      return currentLead.status === newStatus
        ? updatedLead
        : applyFollowUpPlaybook(updatedLead, playbooks.activePlaybook.rules, { overwriteExisting: true });
    });

    if (synced) {
      toast.success(`Status alterado para: ${newStatus}`);
    } else {
      toast.error(`Nao foi possivel alterar o status para: ${newStatus}`);
    }
  }, [commercialAction, leadList.leads, leadMutations, playbooks.activePlaybook.rules, toast]);

  const handleKanbanReorder = useCallback((activeLeadId: string, overLeadId: string) => {
    setLeads((currentLeads) => reorderKanbanItems(currentLeads, activeLeadId, overLeadId));
  }, [setLeads]);

  const daysInStatus = useCallback((lead: Lead) => {
    return Math.floor((renderTime - new Date(lead.statusChangedAt).getTime()) / 86400000);
  }, [renderTime]);

  return {
    leads: leadList.leads,
    searchQuery: leadPreferences.searchQuery,
    setSearchQuery: leadPreferences.setSearchQuery,
    filterNeighborhood: leadPreferences.filterNeighborhood,
    setFilterNeighborhood: leadPreferences.setFilterNeighborhood,
    filterStatus: leadPreferences.filterStatus,
    setFilterStatus: leadPreferences.setFilterStatus,
    hasActiveFilters: leadPreferences.hasActiveFilters,
    clearFilters: leadPreferences.clearFilters,
    viewMode: leadPreferences.viewMode,
    setViewMode: leadPreferences.setViewMode,
    collapsedCards: leadPreferences.collapsedCards,
    visibleMonthlySeries: leadPreferences.visibleMonthlySeries,
    toggleMonthlySeries: leadPreferences.toggleMonthlySeries,
    agendaInitialView: leadPreferences.agendaInitialView,
    setAgendaInitialView: leadPreferences.setAgendaInitialView,
    sortKey: leadPreferences.sortKey,
    sortDir: leadPreferences.sortDir,
    metricsPeriod: leadPreferences.metricsPeriod,
    setMetricsPeriod: leadPreferences.setMetricsPeriod,
    customStart: leadPreferences.customStart,
    setCustomStart: leadPreferences.setCustomStart,
    customEnd: leadPreferences.customEnd,
    setCustomEnd: leadPreferences.setCustomEnd,
    isModalOpen: leadModal.isModalOpen,
    selectedLead: leadModal.selectedLead,
    leadDetail: leadModal.leadDetail,
    isLeadFormDirty: leadModal.isLeadFormDirty,
    initialLeadForm: leadModal.initialLeadForm,
    setInitialLeadForm: leadModal.setInitialLeadForm,
    commercialAction: commercialAction.commercialAction,
    setCommercialAction: commercialAction.setCommercialAction,
    trashedLeads: leadList.trashedLeads,
    loadingTrashLeads: leadList.loadingTrashLeads,
    archivedLeads: leadList.archivedLeads,
    loadingArchivedLeads: leadList.loadingArchivedLeads,
    leadStatusHistory: statusHistory.leadStatusHistory,
    loadingLeadStatusHistory: statusHistory.loadingLeadStatusHistory,
    availableFilmTypeOptions: leadModal.availableFilmTypeOptions,
    crmSync: leadSync.crmSync,
    leadSyncState: leadSync.leadSyncState,
    linkedOrcamento: leadModal.linkedOrcamento,
    linkedDetailOrcamento: leadModal.linkedDetailOrcamento,
    targetGoal: leadList.targetGoal,
    editingTarget: leadList.editingTarget,
    setEditingTarget: leadList.setEditingTarget,
    targetInput: leadList.targetInput,
    setTargetInput: leadList.setTargetInput,
    saveTargetGoal: leadList.saveTargetGoal,
    activeSellerId: playbooks.activeSellerId,
    activePlaybook: playbooks.activePlaybook,
    sellerIds: playbooks.sellerIds,
    playbookLoading: playbooks.playbookLoading,
    playbookSaving: playbooks.playbookSaving,
    playbookError: playbooks.playbookError,
    setActiveSellerId: playbooks.setActiveSellerId,
    updatePlaybookRule: playbooks.updatePlaybookRule,
    resetActivePlaybook: playbooks.resetActivePlaybook,
    reloadPlaybooks: playbooks.reloadPlaybooks,
    isVerifyingCloud: leadSync.isVerifyingCloud,
    lastCloudCheckAt: leadSync.lastCloudCheckAt,
    leadForm: leadModal.leadForm,
    setLeadForm: leadModal.setLeadForm,
    filteredLeads: leadPreferences.filteredLeads,
    sortedFilteredLeads: leadPreferences.sortedFilteredLeads,
    handleVerifyCloudLeads: leadSync.handleVerifyCloudLeads,
    loadTrashLeads: leadList.loadTrashLeads,
    loadArchivedLeads: leadList.loadArchivedLeads,
    openCommercialAction: commercialAction.openCommercialAction,
    applyCommercialAction: commercialAction.applyCommercialAction,
    setCollapsedStateForAllLeads: leadPreferences.setCollapsedStateForAllLeads,
    toggleCollapsedCard: leadPreferences.toggleCollapsedCard,
    handleLeadSubmit: leadMutations.handleLeadSubmit,
    handleLeadSave: leadMutations.handleLeadSave,
    patchLeadStatusInfo: leadMutations.patchLeadStatusInfo,
    openCreateModal: leadModal.openCreateModal,
    openEditModal: leadModal.openEditModal,
    closeLeadModal: leadModal.closeLeadModal,
    closeLeadDetailModal: leadModal.closeLeadDetailModal,
    handleLeadTableRowClick,
    handleLeadTableRowDoubleClick,
    handleDeleteLead: leadMutations.handleDeleteLead,
    handleRestoreLead: leadMutations.handleRestoreLead,
    handleArchiveLead: leadMutations.handleArchiveLead,
    handleRestoreFromArchive: leadMutations.handleRestoreFromArchive,
    handleStatusChange,
    handleKanbanReorder,
    handleAgendaSchedule: leadMutations.handleAgendaSchedule,
    handleServiceStatusChange: leadMutations.handleServiceStatusChange,
    handleAgendaMarkDone: leadMutations.handleAgendaMarkDone,
    handleDormantStateChange: leadMutations.handleDormantStateChange,
    handleTogglePin: leadMutations.handleTogglePin,
    toggleSort: leadPreferences.toggleSort,
    daysInStatus,
    commercialActionTitle: commercialAction.commercialActionTitle,
    commercialActionLabel: commercialAction.commercialActionLabel,
    setLeadDetail: leadModal.setLeadDetail,
  };
}

export type CrmContextValue = ReturnType<typeof useCrmState>;

const CrmContext = createContext<CrmContextValue | null>(null);

export function CrmProvider({
  activeTab,
  children,
}: {
  activeTab: CrmTab;
  children: ReactNode;
}) {
  const value = useCrmState(activeTab);
  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm(): CrmContextValue {
  const ctx = useContext(CrmContext);
  if (!ctx) {
    throw new Error('useCrm deve ser usado dentro de <CrmProvider>');
  }
  return ctx;
}

/* ---- Selectors por fatia (evita importar o objeto inteiro) ---- */

export function useCrmLeads() {
  const crm = useCrm();
  return {
    leads: crm.leads,
    trashedLeads: crm.trashedLeads,
    loadingTrashLeads: crm.loadingTrashLeads,
    archivedLeads: crm.archivedLeads,
    loadingArchivedLeads: crm.loadingArchivedLeads,
    loadTrashLeads: crm.loadTrashLeads,
    loadArchivedLeads: crm.loadArchivedLeads,
    targetGoal: crm.targetGoal,
    editingTarget: crm.editingTarget,
    setEditingTarget: crm.setEditingTarget,
    targetInput: crm.targetInput,
    setTargetInput: crm.setTargetInput,
    saveTargetGoal: crm.saveTargetGoal,
    handleKanbanReorder: crm.handleKanbanReorder,
    handleStatusChange: crm.handleStatusChange,
  };
}

export function useCrmFilters() {
  const crm = useCrm();
  return {
    searchQuery: crm.searchQuery,
    setSearchQuery: crm.setSearchQuery,
    filterNeighborhood: crm.filterNeighborhood,
    setFilterNeighborhood: crm.setFilterNeighborhood,
    filterStatus: crm.filterStatus,
    setFilterStatus: crm.setFilterStatus,
    hasActiveFilters: crm.hasActiveFilters,
    clearFilters: crm.clearFilters,
    viewMode: crm.viewMode,
    setViewMode: crm.setViewMode,
    collapsedCards: crm.collapsedCards,
    visibleMonthlySeries: crm.visibleMonthlySeries,
    toggleMonthlySeries: crm.toggleMonthlySeries,
    agendaInitialView: crm.agendaInitialView,
    setAgendaInitialView: crm.setAgendaInitialView,
    sortKey: crm.sortKey,
    sortDir: crm.sortDir,
    metricsPeriod: crm.metricsPeriod,
    setMetricsPeriod: crm.setMetricsPeriod,
    customStart: crm.customStart,
    setCustomStart: crm.setCustomStart,
    customEnd: crm.customEnd,
    setCustomEnd: crm.setCustomEnd,
    setCollapsedStateForAllLeads: crm.setCollapsedStateForAllLeads,
    toggleCollapsedCard: crm.toggleCollapsedCard,
    toggleSort: crm.toggleSort,
    filteredLeads: crm.filteredLeads,
    sortedFilteredLeads: crm.sortedFilteredLeads,
  };
}

export function useCrmModal() {
  const crm = useCrm();
  return {
    isModalOpen: crm.isModalOpen,
    selectedLead: crm.selectedLead,
    leadDetail: crm.leadDetail,
    isLeadFormDirty: crm.isLeadFormDirty,
    initialLeadForm: crm.initialLeadForm,
    setInitialLeadForm: crm.setInitialLeadForm,
    linkedOrcamento: crm.linkedOrcamento,
    linkedDetailOrcamento: crm.linkedDetailOrcamento,
    availableFilmTypeOptions: crm.availableFilmTypeOptions,
    leadForm: crm.leadForm,
    setLeadForm: crm.setLeadForm,
    openCreateModal: crm.openCreateModal,
    openEditModal: crm.openEditModal,
    closeLeadModal: crm.closeLeadModal,
    closeLeadDetailModal: crm.closeLeadDetailModal,
    setLeadDetail: crm.setLeadDetail,
  };
}

export function useCrmSync() {
  const crm = useCrm();
  return {
    crmSync: crm.crmSync,
    leadSyncState: crm.leadSyncState,
    isVerifyingCloud: crm.isVerifyingCloud,
    lastCloudCheckAt: crm.lastCloudCheckAt,
    handleVerifyCloudLeads: crm.handleVerifyCloudLeads,
  };
}

export function useCrmPlaybooks() {
  const crm = useCrm();
  return {
    activeSellerId: crm.activeSellerId,
    activePlaybook: crm.activePlaybook,
    sellerIds: crm.sellerIds,
    playbookLoading: crm.playbookLoading,
    playbookSaving: crm.playbookSaving,
    playbookError: crm.playbookError,
    setActiveSellerId: crm.setActiveSellerId,
    updatePlaybookRule: crm.updatePlaybookRule,
    resetActivePlaybook: crm.resetActivePlaybook,
    reloadPlaybooks: crm.reloadPlaybooks,
  };
}

export function useCrmMutations() {
  const crm = useCrm();
  return {
    handleLeadSubmit: crm.handleLeadSubmit,
    handleLeadSave: crm.handleLeadSave,
    patchLeadStatusInfo: crm.patchLeadStatusInfo,
    handleDeleteLead: crm.handleDeleteLead,
    handleRestoreLead: crm.handleRestoreLead,
    handleArchiveLead: crm.handleArchiveLead,
    handleRestoreFromArchive: crm.handleRestoreFromArchive,
    handleAgendaSchedule: crm.handleAgendaSchedule,
    handleServiceStatusChange: crm.handleServiceStatusChange,
    handleAgendaMarkDone: crm.handleAgendaMarkDone,
    handleDormantStateChange: crm.handleDormantStateChange,
    handleTogglePin: crm.handleTogglePin,
  };
}

export function useCrmCommercial() {
  const crm = useCrm();
  return {
    commercialAction: crm.commercialAction,
    setCommercialAction: crm.setCommercialAction,
    openCommercialAction: crm.openCommercialAction,
    applyCommercialAction: crm.applyCommercialAction,
    commercialActionTitle: crm.commercialActionTitle,
    commercialActionLabel: crm.commercialActionLabel,
  };
}

export function useCrmStatusHistory() {
  const crm = useCrm();
  return {
    leadStatusHistory: crm.leadStatusHistory,
    loadingLeadStatusHistory: crm.loadingLeadStatusHistory,
  };
}
