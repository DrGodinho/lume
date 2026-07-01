'use client';

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { format } from 'date-fns';
import { areLeadCollectionsEquivalent, getCrmApiErrorMessage, getCrmApiHeaders, mapLeadRow, normalizeLeadAmounts } from '../utils';
import type { CrmSyncState, Lead, LeadStatusInfoUpdate, LeadSyncStatus } from '../types';

interface CloudSnapshotResult {
  ok: boolean;
  details?: string;
  leads?: Lead[];
}

interface SyncLeadResult {
  ok: boolean;
  details?: string;
}

export interface UseLeadSyncReturn {
  crmSync: CrmSyncState;
  setCrmSync: Dispatch<SetStateAction<CrmSyncState>>;
  leadSyncState: Record<string, LeadSyncStatus>;
  syncLeadToCloud: (lead: Lead, method?: 'POST' | 'PUT') => Promise<boolean>;
  syncLeadStatusPatch: (leadId: string, patch: LeadStatusInfoUpdate) => Promise<Lead | null>;
  handleVerifyCloudLeads: () => Promise<void>;
  isVerifyingCloud: boolean;
  lastCloudCheckAt: string | null;
  markLeadSyncState: (leadId: string, status: LeadSyncStatus) => void;
}

const SYNC_RETRY_DELAYS = [1000, 3000, 9000] as const;

const wait = (ms: number) => new Promise((resolve) => {
  window.setTimeout(resolve, ms);
});

const fetchCloudLeadsSnapshot = async (): Promise<CloudSnapshotResult> => {
  const response = await fetch('/api/crm/leads', {
    headers: await getCrmApiHeaders(),
    credentials: 'same-origin',
    cache: 'no-store',
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !Array.isArray(payload)) {
    return { ok: false, details: getCrmApiErrorMessage(payload, response.statusText) };
  }

  return { ok: true, leads: payload.map(mapLeadRow) };
};

const requestLeadSync = async (lead: Lead, method: 'POST' | 'PUT'): Promise<SyncLeadResult> => {
  try {
    const response = await fetch('/api/crm/leads', {
      method,
      headers: await getCrmApiHeaders(),
      credentials: 'same-origin',
      body: JSON.stringify(normalizeLeadAmounts(lead)),
    });

    if (response.ok) return { ok: true };
    const payload = await response.json().catch(() => null);
    return { ok: false, details: getCrmApiErrorMessage(payload, response.statusText) };
  } catch (error) {
    return {
      ok: false,
      details: error instanceof Error ? error.message : 'Erro desconhecido ao sincronizar lead.',
    };
  }
};

export const useLeadSync = (
  leads: Lead[],
  setLeads: Dispatch<SetStateAction<Lead[]>>,
): UseLeadSyncReturn => {
  const [crmSync, setCrmSync] = useState<CrmSyncState>({
    status: 'warning',
    message: 'Carregando leads do Supabase...',
  });
  const [leadSyncState, setLeadSyncState] = useState<Record<string, LeadSyncStatus>>({});
  const [isVerifyingCloud, setIsVerifyingCloud] = useState(false);
  const [lastCloudCheckAt, setLastCloudCheckAt] = useState<string | null>(null);

  const markLeadSyncState = useCallback((leadId: string, status: LeadSyncStatus) => {
    setLeadSyncState((current) => ({ ...current, [leadId]: status }));
  }, []);

  const markCloudLeadsSynced = useCallback((cloudLeads: Lead[]) => {
    setLeadSyncState(Object.fromEntries(cloudLeads.map((lead) => [lead.id, 'ok'])));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCloudLeads = async () => {
      try {
        const result = await fetchCloudLeadsSnapshot();
        if (cancelled) return;

        if (!result.ok || !result.leads) {
          setLeads([]);
          setCrmSync({ status: 'error', message: 'Supabase nao carregou os leads.', details: result.details });
          return;
        }

        const cloudLeads = result.leads.map(normalizeLeadAmounts);
        setLeads(cloudLeads);
        markCloudLeadsSynced(cloudLeads);
        setLastCloudCheckAt(new Date().toISOString());
        setCrmSync({
          status: 'ok',
          message: cloudLeads.length ? 'Leads carregados direto do Supabase.' : 'Nenhum lead encontrado no Supabase ainda.',
        });
      } catch (error) {
        if (!cancelled) {
          setLeads([]);
          setCrmSync({
            status: 'error',
            message: 'Falha de conexao com o Supabase ao carregar os leads.',
            details: error instanceof Error ? error.message : 'Erro desconhecido ao carregar leads.',
          });
        }
      }
    };

    void loadCloudLeads();
    return () => {
      cancelled = true;
    };
  }, [markCloudLeadsSynced, setLeads]);

  const syncLeadToCloud = useCallback(async (lead: Lead, method: 'POST' | 'PUT' = 'PUT') => {
    const actionLabel = method === 'POST' ? 'Criando lead no Supabase...' : 'Salvando alteracao no Supabase...';
    markLeadSyncState(lead.id, 'pending');
    setCrmSync({ status: 'warning', message: actionLabel });

    let details = '';
    for (const delay of [0, ...SYNC_RETRY_DELAYS]) {
      if (delay > 0) {
        markLeadSyncState(lead.id, 'pending');
        await wait(delay);
      }

      const result = await requestLeadSync(lead, method);
      if (result.ok) {
        markLeadSyncState(lead.id, 'ok');
        setCrmSync({
          status: 'ok',
          message: method === 'POST' ? 'Lead criado no Supabase.' : 'Ultima alteracao sincronizada com o Supabase.',
        });
        return true;
      }

      details = result.details || 'Falha desconhecida na sincronizacao.';
      markLeadSyncState(lead.id, 'error');
      setCrmSync({
        status: 'error',
        message: method === 'POST' ? 'Supabase recusou a criacao do lead.' : 'Supabase recusou a ultima sincronizacao do lead.',
        details,
      });
    }

    return false;
  }, [markLeadSyncState]);

  const handleVerifyCloudLeads = useCallback(async () => {
    setIsVerifyingCloud(true);
    setCrmSync({ status: 'warning', message: 'Conferindo os dados reais no Supabase...' });

    try {
      const result = await fetchCloudLeadsSnapshot();
      if (!result.ok || !result.leads) {
        setCrmSync({ status: 'error', message: 'Nao foi possivel confirmar os dados no Supabase.', details: result.details });
        return;
      }

      const cloudLeads = result.leads.map(normalizeLeadAmounts);
      const isExactMatch = areLeadCollectionsEquivalent(leads.map(normalizeLeadAmounts), cloudLeads);
      const checkedAt = new Date().toISOString();

      setLeads(cloudLeads);
      markCloudLeadsSynced(cloudLeads);
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
  }, [leads, markCloudLeadsSynced, setLeads]);

  const syncLeadStatusPatch = useCallback(async (leadId: string, patch: LeadStatusInfoUpdate) => {
    const sanitizedPatch: LeadStatusInfoUpdate = { updatedAt: new Date().toISOString(), ...patch };
    const previousLead = leads.find((lead) => lead.id === leadId);
    if (!previousLead) return null;

    markLeadSyncState(leadId, 'pending');
    setCrmSync({ status: 'warning', message: 'Atualizando status do lead no Supabase...' });

    let details = '';
    for (const delay of [0, ...SYNC_RETRY_DELAYS]) {
      if (delay > 0) {
        markLeadSyncState(leadId, 'pending');
        await wait(delay);
      }

      try {
        const response = await fetch('/api/crm/leads', {
          method: 'PATCH',
          headers: await getCrmApiHeaders(),
          credentials: 'same-origin',
          body: JSON.stringify({ id: leadId, ...sanitizedPatch }),
        });
        const payload = await response.json().catch(() => null);

        if (response.ok) {
          const mergedLead = normalizeLeadAmounts({ ...previousLead, ...sanitizedPatch, ...(payload?.lead ? mapLeadRow(payload.lead) : {}) });
          markLeadSyncState(leadId, 'ok');
          setCrmSync({ status: 'ok', message: 'Status do lead atualizado no Supabase.' });
          setLeads((current) => current.map((lead) => (lead.id === leadId ? mergedLead : lead)));
          return mergedLead;
        }

        details = getCrmApiErrorMessage(payload, response.statusText);
        markLeadSyncState(leadId, 'error');
        setCrmSync({
          status: 'error',
          message: 'Supabase recusou a atualizacao parcial do lead.',
          details,
        });
      } catch (error) {
        details = error instanceof Error ? error.message : 'Erro desconhecido ao sincronizar lead.';
        markLeadSyncState(leadId, 'error');
        setCrmSync({
          status: 'error',
          message: 'Falha de conexao com o Supabase ao atualizar o status do lead.',
          details,
        });
      }
    }

    return null;
  }, [leads, markLeadSyncState, setCrmSync, setLeads]);

  return {
    crmSync,
    setCrmSync,
    leadSyncState,
    syncLeadToCloud,
    syncLeadStatusPatch,
    handleVerifyCloudLeads,
    isVerifyingCloud,
    lastCloudCheckAt,
    markLeadSyncState,
  };
};
