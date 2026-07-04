'use client';

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { loadConfigFromCloud } from '@/lib/cloudSync';
import { DEFAULT_CRM_FILM_OPTIONS, DEFAULT_CRM_TARGET_GOAL } from '../constants';
import { getCrmApiErrorMessage, getCrmApiHeaders, getFilmTypeLabel, mapLeadRow, normalizeLeadAmounts } from '../utils';
import type { CrmTab, Lead } from '../types';

interface TrashSnapshotResult {
  ok: boolean;
  details?: string;
  leads?: Lead[];
}

interface ToastApi {
  error: (message: string) => void;
}

export interface UseLeadListReturn {
  leads: Lead[];
  setLeads: Dispatch<SetStateAction<Lead[]>>;
  trashedLeads: Lead[];
  setTrashedLeads: Dispatch<SetStateAction<Lead[]>>;
  loadingTrashLeads: boolean;
  filmTypeOptions: string[];
  defaultLeadFilmType: string;
  targetGoal: number | null;
  editingTarget: boolean;
  setEditingTarget: Dispatch<SetStateAction<boolean>>;
  targetInput: string;
  setTargetInput: Dispatch<SetStateAction<string>>;
  saveTargetGoal: (value: number) => Promise<void>;
  loadTrashLeads: () => Promise<void>;
  upsertLeadInState: (lead: Lead) => Lead;
}

const fetchTrashLeadsSnapshot = async (): Promise<TrashSnapshotResult> => {
  const response = await fetch('/api/crm/leads?trash=1', {
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

const getMonthlyTargetConfigId = () => `crm_goal_${format(new Date(), 'yyyy-MM')}`;

export const useLeadList = (
  activeTab: CrmTab,
  toast: ToastApi,
): UseLeadListReturn => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [trashedLeads, setTrashedLeads] = useState<Lead[]>([]);
  const [loadingTrashLeads, setLoadingTrashLeads] = useState(false);
  const [filmTypeOptions, setFilmTypeOptions] = useState<string[]>(DEFAULT_CRM_FILM_OPTIONS);
  const [defaultLeadFilmType, setDefaultLeadFilmType] = useState(DEFAULT_CRM_FILM_OPTIONS[0] || 'Outro');
  const [targetGoal, setTargetGoal] = useState<number | null>(DEFAULT_CRM_TARGET_GOAL);
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(String(DEFAULT_CRM_TARGET_GOAL));

  useEffect(() => {
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

    void loadCalculatorConfig();

    if (supabase) {
      supabase.from('configuracoes').select('meta_valor').eq('id', getMonthlyTargetConfigId()).maybeSingle().then(({ data }) => {
        if (data?.meta_valor) {
          const monthlyGoal = Number(data.meta_valor);
          setTargetGoal(monthlyGoal);
          setTargetInput(String(monthlyGoal));
        }
      });
    }
  }, []);

  const saveTargetGoal = useCallback(async (value: number) => {
    setTargetGoal(value);
    setTargetInput(String(value));
    setEditingTarget(false);
    if (!supabase) return;
    await supabase.from('configuracoes').upsert({ id: getMonthlyTargetConfigId(), meta_valor: value }, { onConflict: 'id' });
  }, []);

  const loadTrashLeads = useCallback(async () => {
    setLoadingTrashLeads(true);

    try {
      const result = await fetchTrashLeadsSnapshot();
      if (!result.ok || !result.leads) {
        toast.error('Nao foi possivel carregar a lixeira.');
        return;
      }

      setTrashedLeads(result.leads.map(normalizeLeadAmounts));
    } finally {
      setLoadingTrashLeads(false);
    }
  }, [toast]);

  useEffect(() => {
    if (activeTab !== 'trash') return;
    void loadTrashLeads();
  }, [activeTab, loadTrashLeads]);

  const upsertLeadInState = useCallback((lead: Lead) => {
    const normalized = normalizeLeadAmounts(lead);
    setLeads((currentLeads) => {
      const alreadyExists = currentLeads.some((currentLead) => currentLead.id === normalized.id);
      return alreadyExists
        ? currentLeads.map((currentLead) => (currentLead.id === normalized.id ? normalized : currentLead))
        : [normalized, ...currentLeads];
    });
    return normalized;
  }, []);

  return {
    leads,
    setLeads,
    trashedLeads,
    setTrashedLeads,
    loadingTrashLeads,
    filmTypeOptions,
    defaultLeadFilmType,
    targetGoal,
    editingTarget,
    setEditingTarget,
    targetInput,
    setTargetInput,
    saveTargetGoal,
    loadTrashLeads,
    upsertLeadInState,
  };
};
