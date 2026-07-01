'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CRM_PLAYBOOKS_STORAGE_KEY } from '../constants';
import { getCrmApiErrorMessage, getCrmApiHeaders } from '../utils';
import { createDefaultSellerPlaybook, normalizeSellerId, sanitizePlaybookRules } from '../utils/playbooks';
import type { FollowUpPlaybookRule, SellerPlaybook } from '../types';

interface PlaybooksApiPayload {
  activeSellerId?: string;
  activePlaybook?: SellerPlaybook;
  sellerIds?: string[];
}

export interface UsePlaybooksReturn {
  activeSellerId: string;
  activePlaybook: SellerPlaybook;
  sellerIds: string[];
  playbookLoading: boolean;
  playbookSaving: boolean;
  playbookError: string | null;
  setActiveSellerId: (sellerId: string) => void;
  updatePlaybookRule: (ruleId: string, patch: Partial<FollowUpPlaybookRule>) => void;
  resetActivePlaybook: () => void;
  reloadPlaybooks: () => Promise<void>;
}

const readStoredSellerId = () => {
  if (typeof window === 'undefined') return 'equipe-lume';
  const stored = window.localStorage.getItem(CRM_PLAYBOOKS_STORAGE_KEY);
  if (!stored) return 'equipe-lume';

  try {
    const parsed = JSON.parse(stored);
    if (typeof parsed === 'string') return normalizeSellerId(parsed);
    if (parsed && typeof parsed === 'object' && typeof parsed.activeSellerId === 'string') {
      return normalizeSellerId(parsed.activeSellerId);
    }
  } catch {
    return normalizeSellerId(stored);
  }

  return 'equipe-lume';
};

const storeSellerId = (sellerId: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CRM_PLAYBOOKS_STORAGE_KEY, JSON.stringify(normalizeSellerId(sellerId)));
};

const sanitizeApiPlaybook = (payload: PlaybooksApiPayload, fallbackSellerId: string) => {
  const sellerId = normalizeSellerId(payload.activeSellerId || fallbackSellerId);
  const activePlaybook = payload.activePlaybook
    ? {
        sellerId: normalizeSellerId(payload.activePlaybook.sellerId || sellerId),
        rules: sanitizePlaybookRules(payload.activePlaybook.rules || []),
      }
    : createDefaultSellerPlaybook(sellerId);

  const sellerIds = Array.from(new Set([
    activePlaybook.sellerId,
    ...(Array.isArray(payload.sellerIds) ? payload.sellerIds.map(normalizeSellerId) : []),
  ])).sort();

  return {
    activeSellerId: activePlaybook.sellerId,
    activePlaybook,
    sellerIds,
  };
};

export const usePlaybooks = (): UsePlaybooksReturn => {
  const [activeSellerId, setActiveSellerIdState] = useState('equipe-lume');
  const [activePlaybook, setActivePlaybook] = useState<SellerPlaybook>(() => createDefaultSellerPlaybook());
  const [sellerIds, setSellerIds] = useState<string[]>(['equipe-lume']);
  const [playbookLoading, setPlaybookLoading] = useState(true);
  const [playbookSaving, setPlaybookSaving] = useState(false);
  const [playbookError, setPlaybookError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    const storedSellerId = readStoredSellerId();
    setActiveSellerIdState(storedSellerId);
    setActivePlaybook(createDefaultSellerPlaybook(storedSellerId));
    setSellerIds([storedSellerId]);
    setRestored(true);
  }, []);

  const loadPlaybooks = useCallback(async (sellerId: string) => {
    setPlaybookLoading(true);
    setPlaybookError(null);

    try {
      const response = await fetch(`/api/crm/playbooks?sellerId=${encodeURIComponent(sellerId)}`, {
        headers: await getCrmApiHeaders(),
        credentials: 'same-origin',
        cache: 'no-store',
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setPlaybookError(getCrmApiErrorMessage(payload, response.statusText));
        return;
      }

      const nextState = sanitizeApiPlaybook(payload || {}, sellerId);
      setActiveSellerIdState(nextState.activeSellerId);
      setActivePlaybook(nextState.activePlaybook);
      setSellerIds(nextState.sellerIds);
      storeSellerId(nextState.activeSellerId);
    } catch (error) {
      setPlaybookError(error instanceof Error ? error.message : 'Erro desconhecido ao carregar playbooks.');
    } finally {
      setPlaybookLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!restored) return;
    void loadPlaybooks(activeSellerId);
  }, [activeSellerId, loadPlaybooks, restored]);

  const savePlaybook = useCallback(async (playbook: SellerPlaybook) => {
    setPlaybookSaving(true);
    setPlaybookError(null);

    try {
      const response = await fetch('/api/crm/playbooks', {
        method: 'PUT',
        headers: await getCrmApiHeaders(),
        credentials: 'same-origin',
        body: JSON.stringify({
          sellerId: playbook.sellerId,
          rules: sanitizePlaybookRules(playbook.rules),
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setPlaybookError(getCrmApiErrorMessage(payload, response.statusText));
        return;
      }

      const nextState = sanitizeApiPlaybook(payload || {}, playbook.sellerId);
      setActiveSellerIdState(nextState.activeSellerId);
      setActivePlaybook(nextState.activePlaybook);
      setSellerIds(nextState.sellerIds);
      storeSellerId(nextState.activeSellerId);
    } catch (error) {
      setPlaybookError(error instanceof Error ? error.message : 'Erro desconhecido ao salvar playbook.');
    } finally {
      setPlaybookSaving(false);
    }
  }, []);

  const setActiveSellerId = useCallback((sellerId: string) => {
    const nextSellerId = normalizeSellerId(sellerId);
    setActiveSellerIdState(nextSellerId);
    setActivePlaybook(createDefaultSellerPlaybook(nextSellerId));
    setSellerIds((current) => Array.from(new Set([...current, nextSellerId])).sort());
    storeSellerId(nextSellerId);
  }, []);

  const updatePlaybookRule = useCallback((ruleId: string, patch: Partial<FollowUpPlaybookRule>) => {
    setActivePlaybook((current) => {
      const nextPlaybook = {
        sellerId: current.sellerId,
        rules: sanitizePlaybookRules(
          current.rules.map((rule) => (
            rule.id === ruleId
              ? {
                  ...rule,
                  ...patch,
                  id: rule.id,
                  triggerStatus: rule.triggerStatus,
                  actionType: 'follow_up',
                }
              : rule
          )),
        ),
      };
      void savePlaybook(nextPlaybook);
      return nextPlaybook;
    });
  }, [savePlaybook]);

  const resetActivePlaybook = useCallback(() => {
    const nextPlaybook = createDefaultSellerPlaybook(activeSellerId);
    setActivePlaybook(nextPlaybook);
    void savePlaybook(nextPlaybook);
  }, [activeSellerId, savePlaybook]);

  const reloadPlaybooks = useCallback(() => loadPlaybooks(activeSellerId), [activeSellerId, loadPlaybooks]);

  const stableSellerIds = useMemo(() => (
    Array.from(new Set([activePlaybook.sellerId, ...sellerIds])).sort()
  ), [activePlaybook.sellerId, sellerIds]);

  return {
    activeSellerId,
    activePlaybook,
    sellerIds: stableSellerIds,
    playbookLoading,
    playbookSaving,
    playbookError,
    setActiveSellerId,
    updatePlaybookRule,
    resetActivePlaybook,
    reloadPlaybooks,
  };
};
