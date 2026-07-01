'use client';

import { useEffect, useState } from 'react';
import { getCrmApiHeaders } from '../utils';
import type { Lead, LeadStatusHistoryEntry } from '../types';

export interface UseLeadStatusHistoryReturn {
  leadStatusHistory: LeadStatusHistoryEntry[];
  loadingLeadStatusHistory: boolean;
}

export const useLeadStatusHistory = (leadDetail: Lead | null): UseLeadStatusHistoryReturn => {
  const [leadStatusHistory, setLeadStatusHistory] = useState<LeadStatusHistoryEntry[]>([]);
  const [loadingLeadStatusHistory, setLoadingLeadStatusHistory] = useState(false);

  useEffect(() => {
    if (!leadDetail) {
      setLeadStatusHistory([]);
      return;
    }

    let cancelled = false;

    const loadStatusHistory = async () => {
      setLoadingLeadStatusHistory(true);

      try {
        const response = await fetch(`/api/crm/lead-status-history?leadId=${encodeURIComponent(leadDetail.id)}`, {
          headers: await getCrmApiHeaders(),
          credentials: 'same-origin',
          cache: 'no-store',
        });
        const payload = await response.json().catch(() => null);

        if (!cancelled) {
          setLeadStatusHistory(response.ok && Array.isArray(payload) ? payload as LeadStatusHistoryEntry[] : []);
        }
      } finally {
        if (!cancelled) {
          setLoadingLeadStatusHistory(false);
        }
      }
    };

    void loadStatusHistory();

    return () => {
      cancelled = true;
    };
  }, [leadDetail]);

  return { leadStatusHistory, loadingLeadStatusHistory };
};
