'use client';

import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import { useCallback } from 'react';
import type { CalculatorHistoryRow, Lead } from '../types';

export interface UseLeadOrcamentoReturn {
  linkCalculatorHistoryToLead: (calculatorHistoryId: string, leadId: string) => Promise<boolean>;
  fetchLinkedOrcamento: (lead: Lead) => Promise<CalculatorHistoryRow | null>;
}

const mapRow = (row: Record<string, unknown>): CalculatorHistoryRow =>
  row as unknown as CalculatorHistoryRow;

export const useLeadOrcamento = (): UseLeadOrcamentoReturn => {
  const linkCalculatorHistoryToLead = useCallback(async (calculatorHistoryId: string, leadId: string) => {
    try {
      const response = await fetchWithTimeout('/api/calculator/history', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: calculatorHistoryId, updates: { lead_id: leadId } }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  const fetchLinkedOrcamento = useCallback(async (lead: Lead): Promise<CalculatorHistoryRow | null> => {
    try {
      const byLeadResponse = await fetchWithTimeout(
        `/api/calculator/history?leadId=${encodeURIComponent(lead.id)}`,
        { credentials: 'include', cache: 'no-store' }
      );

      if (byLeadResponse.ok) {
        const payload = await byLeadResponse.json();
        const items = Array.isArray(payload?.items) ? payload.items : [];
        if (items.length > 0) return mapRow(items[0]);
      }

      const trimmedName = lead.name.trim();
      if (!trimmedName) return null;

      const byNameResponse = await fetchWithTimeout(
        `/api/calculator/history?cliente=${encodeURIComponent(trimmedName)}&unlinked=1`,
        { credentials: 'include', cache: 'no-store' }
      );

      if (byNameResponse.ok) {
        const payload = await byNameResponse.json();
        const items = Array.isArray(payload?.items) ? payload.items : [];
        if (items.length > 0) return mapRow(items[0]);
      }

      return null;
    } catch {
      return null;
    }
  }, []);

  return { linkCalculatorHistoryToLead, fetchLinkedOrcamento };
};

