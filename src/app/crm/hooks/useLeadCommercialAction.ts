'use client';

import { useCallback, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { appendCommercialNote } from '../utils';
import { formatDateInputValue, getLeadServiceStatus } from './useAgenda';
import type { CommercialActionDraft, Lead } from '../types';

interface ToastApi {
  error: (message: string) => void;
  success: (message: string) => void;
  warning: (message: string) => void;
}

interface UpdateSingleLeadResult {
  synced: boolean;
  lead: Lead | null;
}

export interface UseLeadCommercialActionReturn {
  commercialAction: CommercialActionDraft | null;
  setCommercialAction: Dispatch<SetStateAction<CommercialActionDraft | null>>;
  openCommercialAction: (lead: Lead, action: CommercialActionDraft['action']) => void;
  applyCommercialAction: (event: FormEvent) => Promise<void>;
  commercialActionTitle: string;
  commercialActionLabel: string;
}

export const useLeadCommercialAction = (
  updateSingleLead: (leadId: string, updater: (lead: Lead) => Lead) => Promise<UpdateSingleLeadResult>,
  setLeadDetail: (lead: Lead | null) => void,
  toast: ToastApi,
): UseLeadCommercialActionReturn => {
  const [commercialAction, setCommercialAction] = useState<CommercialActionDraft | null>(null);

  const openCommercialAction = useCallback((lead: Lead, action: CommercialActionDraft['action']) => {
    setCommercialAction({
      lead,
      action,
      followUpDate: formatDateInputValue(lead.proximoContato) || new Date().toISOString().split('T')[0],
      serviceDate: formatDateInputValue(lead.dataServico) || new Date().toISOString().split('T')[0],
      note: action === 'servico' && getLeadServiceStatus(lead) === 'Reagendar' ? 'Reagendado a pedido do cliente.' : '',
    });
  }, []);

  const applyCommercialAction = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!commercialAction) return;

    const { lead, action, followUpDate, serviceDate, note } = commercialAction;
    if (action === 'retorno' && !followUpDate) {
      toast.warning('Escolha a data do proximo retorno.');
      return;
    }
    if (action === 'servico' && !serviceDate) {
      toast.warning('Escolha a data do servico.');
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
      servico: 'Servico agendado',
      fechado: 'Lead marcado como fechado',
      perdido: 'Lead marcado como perdido',
    }[action];

    if (synced) {
      toast.success(`${actionLabel}.`);
    } else {
      toast.error(`Nao foi possivel concluir: ${actionLabel.toLowerCase()}.`);
    }
  }, [commercialAction, setLeadDetail, toast, updateSingleLead]);

  const commercialActionTitle = commercialAction ? {
    retorno: 'Agendar retorno comercial',
    servico: 'Agendar servico',
    fechado: 'Fechar venda',
    perdido: 'Marcar como perdido',
  }[commercialAction.action] : '';

  const commercialActionLabel = commercialAction ? {
    retorno: 'Salvar retorno',
    servico: 'Salvar servico',
    fechado: 'Confirmar fechamento',
    perdido: 'Confirmar perda',
  }[commercialAction.action] : '';

  return {
    commercialAction,
    setCommercialAction,
    openCommercialAction,
    applyCommercialAction,
    commercialActionTitle,
    commercialActionLabel,
  };
};
