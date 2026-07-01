'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeLeadStatus } from './useAgenda';
import { useLeadCommercialAction } from './useLeadCommercialAction';
import { useLeadList } from './useLeadList';
import { useLeadModal } from './useLeadModal';
import { useLeadMutations } from './useLeadMutations';
import { useLeadOrcamento } from './useLeadOrcamento';
import { useLeadPreferences } from './useLeadPreferences';
import { useLeadStatusHistory } from './useLeadStatusHistory';
import { useLeadSync } from './useLeadSync';
import { usePlaybooks } from './usePlaybooks';
import { useToastApi } from './useToast';
import { reorderKanbanItems } from '../utils/kanbanDnd';
import { applyFollowUpPlaybook } from '../utils/playbooks';
import type { CrmTab, Lead, LeadStatus } from '../types';

export const useLeads = (activeTab: CrmTab) => {
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
};
