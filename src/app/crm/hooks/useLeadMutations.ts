'use client';

import { useCallback, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { getCrmApiErrorMessage, getCrmApiHeaders, hasLeadNextAction, mapLeadRow, normalizeLeadAmounts, requiresLeadNextAction } from '../utils';
import { applyFollowUpPlaybook } from '../utils/playbooks';
import type { CrmSyncState, FollowUpPlaybookRule, Lead, LeadFormValues, LeadStatusInfoUpdate, LeadSyncStatus, ServiceStatus } from '../types';

interface ToastApi {
  error: (message: string) => void;
  success: (message: string) => void;
  warning: (message: string) => void;
}

interface UseLeadMutationsParams {
  leads: Lead[];
  setLeads: Dispatch<SetStateAction<Lead[]>>;
  setTrashedLeads: Dispatch<SetStateAction<Lead[]>>;
  leadForm: LeadFormValues;
  selectedLead: Lead | null;
  pendingCalculatorHistoryId: string | null;
  closeLeadModal: () => void;
  syncLeadToCloud: (lead: Lead, method?: 'POST' | 'PUT') => Promise<boolean>;
  syncLeadStatusPatch: (leadId: string, patch: LeadStatusInfoUpdate) => Promise<Lead | null>;
  upsertLeadInState: (lead: Lead) => Lead;
  linkCalculatorHistoryToLead: (calculatorHistoryId: string, leadId: string) => Promise<boolean>;
  setCrmSync: Dispatch<SetStateAction<CrmSyncState>>;
  markLeadSyncState: (leadId: string, status: LeadSyncStatus) => void;
  playbookRules: FollowUpPlaybookRule[];
  toast: ToastApi;
}

export interface UseLeadMutationsReturn {
  updateSingleLead: (leadId: string, updater: (lead: Lead) => Lead) => Promise<{ synced: boolean; lead: Lead | null }>;
  patchLeadStatusInfo: (leadId: string, patch: LeadStatusInfoUpdate) => Promise<{ synced: boolean; lead: Lead | null }>;
  handleLeadSubmit: (event: FormEvent) => Promise<void>;
  handleLeadSave: () => Promise<boolean>;
  handleDeleteLead: (id: string) => Promise<void>;
  handleRestoreLead: (lead: Lead) => Promise<void>;
  handleAgendaSchedule: (leadId: string, date: string) => Promise<void>;
  handleServiceStatusChange: (leadId: string, serviceStatus: ServiceStatus) => Promise<void>;
  handleAgendaMarkDone: (leadId: string) => Promise<void>;
  handleDormantStateChange: (leadId: string, dormant: boolean) => Promise<void>;
  handleTogglePin: (leadId: string) => Promise<void>;
}

export const useLeadMutations = ({
  leads,
  setLeads,
  setTrashedLeads,
  leadForm,
  selectedLead,
  pendingCalculatorHistoryId,
  closeLeadModal,
  syncLeadToCloud,
  syncLeadStatusPatch,
  upsertLeadInState,
  linkCalculatorHistoryToLead,
  setCrmSync,
  markLeadSyncState,
  playbookRules,
  toast,
}: UseLeadMutationsParams): UseLeadMutationsReturn => {
  const updateSingleLead = useCallback(async (leadId: string, updater: (lead: Lead) => Lead) => {
    const currentLead = leads.find((lead) => lead.id === leadId);
    if (!currentLead) return { synced: false, lead: null };

    const leadToSync = normalizeLeadAmounts(updater(currentLead));
    upsertLeadInState(leadToSync);
    const synced = await syncLeadToCloud(leadToSync);
    if (!synced) {
      upsertLeadInState(currentLead);
    }

    return { synced, lead: synced ? leadToSync : currentLead };
  }, [leads, syncLeadToCloud, upsertLeadInState]);

  const patchLeadStatusInfo = useCallback(async (leadId: string, patch: LeadStatusInfoUpdate) => {
    const currentLead = leads.find((lead) => lead.id === leadId);
    if (!currentLead) return { synced: false, lead: null };

    const mergedPatch: LeadStatusInfoUpdate = { updatedAt: new Date().toISOString(), ...patch };
    const optimisticLead = normalizeLeadAmounts({ ...currentLead, ...mergedPatch });
    upsertLeadInState(optimisticLead);

    const syncedLead = await syncLeadStatusPatch(leadId, mergedPatch);
    if (!syncedLead) {
      upsertLeadInState(currentLead);
      return { synced: false, lead: currentLead };
    }
    return { synced: true, lead: syncedLead };
  }, [leads, syncLeadStatusPatch, upsertLeadInState]);

  const handleLeadSave = useCallback(async () => {
    if (!leadForm.name) {
      toast.warning('Preencha o campo obrigatorio (Nome)');
      return false;
    }

    let resultLead: Lead;
    let isCreate = false;

    if (selectedLead) {
      const baseLead = normalizeLeadAmounts({ ...selectedLead, ...leadForm, updatedAt: new Date().toISOString() });
      const updatedLead = selectedLead.status === baseLead.status
        ? baseLead
        : applyFollowUpPlaybook(baseLead, playbookRules, { overwriteExisting: true });
      upsertLeadInState(updatedLead);
      const synced = await syncLeadToCloud(updatedLead);
      if (!synced) {
        upsertLeadInState(selectedLead);
        toast.error('Nao foi possivel atualizar o lead no Supabase.');
        return false;
      }
      resultLead = updatedLead;
    } else {
      isCreate = true;
      const baseLead = normalizeLeadAmounts({
        id: `lead_${Date.now()}`,
        ...leadForm,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString(),
      });
      const newLead = applyFollowUpPlaybook(baseLead, playbookRules);
      upsertLeadInState(newLead);
      const synced = await syncLeadToCloud(newLead, 'POST');
      if (!synced) {
        toast.error('Nao foi possivel criar o lead no Supabase.');
        return false;
      }
      resultLead = newLead;
    }

    if (requiresLeadNextAction(resultLead.status) && !hasLeadNextAction(resultLead)) {
      toast.warning('Lead salvo sem proxima acao. Nao aparecera na agenda (so na aba "Sem Acao" apos 3 dias sem movimento).');
      return true;
    }

    if (isCreate) {
      const linked = pendingCalculatorHistoryId
        ? await linkCalculatorHistoryToLead(pendingCalculatorHistoryId, resultLead.id)
        : true;
      if (linked) {
        toast.success('Lead criado com sucesso!');
      } else {
        toast.warning('Lead criado, mas o vinculo com o orcamento nao foi salvo.');
      }
    } else {
      toast.success('Lead atualizado com sucesso!');
    }
    return true;
  }, [leadForm, linkCalculatorHistoryToLead, pendingCalculatorHistoryId, playbookRules, selectedLead, syncLeadToCloud, toast, upsertLeadInState]);

  const handleLeadSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    const saved = await handleLeadSave();
    if (saved) {
      closeLeadModal();
    }
  }, [closeLeadModal, handleLeadSave]);

  const handleDeleteLead = useCallback(async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;
    markLeadSyncState(id, 'pending');
    setCrmSync({ status: 'warning', message: 'Excluindo lead no Supabase...' });

    const response = await fetch(`/api/crm/leads?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: await getCrmApiHeaders(),
      credentials: 'same-origin',
    });

    if (response.ok) {
      const payload = await response.json().catch(() => null);
      const deletedLead = payload?.lead ? normalizeLeadAmounts(mapLeadRow(payload.lead)) : null;
      setLeads((currentLeads) => currentLeads.filter((lead) => lead.id !== id));
      if (deletedLead) setTrashedLeads((currentLeads) => [deletedLead, ...currentLeads.filter((lead) => lead.id !== deletedLead.id)]);
      setCrmSync({ status: 'ok', message: 'Lead removido no Supabase.' });
      toast.success('Lead removido.');
      return;
    }

    const payload = await response.json().catch(() => null);
    markLeadSyncState(id, 'error');
    setCrmSync({ status: 'error', message: 'Supabase nao confirmou a exclusao do lead.', details: getCrmApiErrorMessage(payload, response.statusText) });
    toast.error('Nao foi possivel excluir o lead no Supabase.');
  }, [markLeadSyncState, setCrmSync, setLeads, setTrashedLeads, toast]);

  const handleRestoreLead = useCallback(async (lead: Lead) => {
    setCrmSync({ status: 'warning', message: 'Restaurando lead da lixeira...' });
    const response = await fetch('/api/crm/leads', {
      method: 'PATCH',
      headers: await getCrmApiHeaders(),
      credentials: 'same-origin',
      body: JSON.stringify({ id: lead.id, action: 'restore' }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.lead) {
      setCrmSync({ status: 'error', message: 'Nao foi possivel restaurar o lead.', details: getCrmApiErrorMessage(payload, response.statusText) });
      toast.error('Nao foi possivel restaurar o lead.');
      return;
    }

    const restoredLead = normalizeLeadAmounts(mapLeadRow(payload.lead));
    setTrashedLeads((currentLeads) => currentLeads.filter((currentLead) => currentLead.id !== restoredLead.id));
    upsertLeadInState(restoredLead);
    markLeadSyncState(restoredLead.id, 'ok');
    setCrmSync({ status: 'ok', message: 'Lead restaurado com sucesso.' });
    toast.success('Lead restaurado com sucesso!');
  }, [markLeadSyncState, setCrmSync, setTrashedLeads, toast, upsertLeadInState]);

  const handleAgendaSchedule = useCallback(async (leadId: string, date: string) => {
    const nextContact = new Date(`${date}T12:00:00`).toISOString();
    const { synced } = await patchLeadStatusInfo(leadId, { proximoContato: nextContact, dormant: false });
    if (synced) {
      toast.success('Retorno agendado com sucesso!');
    } else {
      toast.error('Nao foi possivel agendar o retorno no Supabase.');
    }
  }, [patchLeadStatusInfo, toast]);

  const handleServiceStatusChange = useCallback(async (leadId: string, serviceStatus: ServiceStatus) => {
    const currentLead = leads.find((lead) => lead.id === leadId);
    if (!currentLead) return;
    const today = new Date().toISOString().split('T')[0];
    const { synced } = await patchLeadStatusInfo(leadId, {
      status: currentLead.status === 'Novo' && serviceStatus !== 'Concluido' ? 'Agendado' : currentLead.status,
      statusChangedAt: currentLead.status === 'Novo' && serviceStatus !== 'Concluido' ? today : currentLead.statusChangedAt,
      serviceStatus,
      dormant: false,
    });
    if (synced) {
      toast.success(`Servico atualizado para ${serviceStatus}.`);
    } else {
      toast.error(`Nao foi possivel atualizar o servico para ${serviceStatus}.`);
    }
  }, [leads, patchLeadStatusInfo, toast]);

  const handleAgendaMarkDone = useCallback(async (leadId: string) => {
    const { synced } = await patchLeadStatusInfo(leadId, { proximoContato: null });
    if (synced) {
      toast.success('Follow-up registrado!');
    } else {
      toast.error('Nao foi possivel registrar o follow-up no Supabase.');
    }
  }, [patchLeadStatusInfo, toast]);

  const handleDormantStateChange = useCallback(async (leadId: string, dormant: boolean) => {
    markLeadSyncState(leadId, 'pending');
    setCrmSync({ status: 'warning', message: dormant ? 'Marcando lead como dormente...' : 'Reativando lead dormente...' });
    const response = await fetch('/api/crm/leads', {
      method: 'PATCH',
      headers: await getCrmApiHeaders(),
      credentials: 'same-origin',
      body: JSON.stringify({ id: leadId, action: dormant ? 'dormant' : 'activate' }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.lead) {
      markLeadSyncState(leadId, 'error');
      setCrmSync({ status: 'error', message: dormant ? 'Nao foi possivel marcar o lead como dormente.' : 'Nao foi possivel reativar o lead.', details: getCrmApiErrorMessage(payload, response.statusText) });
      if (dormant) {
        toast.error('Nao foi possivel marcar o lead como dormente.');
      } else {
        toast.error('Nao foi possivel reativar o lead.');
      }
      return;
    }

    const updatedLead = normalizeLeadAmounts(mapLeadRow(payload.lead));
    upsertLeadInState(updatedLead);
    markLeadSyncState(updatedLead.id, 'ok');
    setCrmSync({ status: 'ok', message: dormant ? 'Lead marcado como dormente.' : 'Lead reativado com sucesso.' });
    if (dormant) {
      toast.success('Lead marcado como dormente.');
    } else {
      toast.success('Lead reativado com sucesso!');
    }
  }, [markLeadSyncState, setCrmSync, toast, upsertLeadInState]);

  const handleTogglePin = useCallback(async (leadId: string) => {
    const currentLead = leads.find((lead) => lead.id === leadId);
    if (!currentLead) return;
    const { synced } = await patchLeadStatusInfo(leadId, { pinned: !currentLead.pinned });
    if (!synced) {
      toast.error('Nao foi possivel atualizar o pin do lead no Supabase.');
    }
  }, [leads, patchLeadStatusInfo, toast]);

  return {
    updateSingleLead,
    patchLeadStatusInfo,
    handleLeadSubmit,
    handleLeadSave,
    handleDeleteLead,
    handleRestoreLead,
    handleAgendaSchedule,
    handleServiceStatusChange,
    handleAgendaMarkDone,
    handleDormantStateChange,
    handleTogglePin,
  };
};
