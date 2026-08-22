'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import { getCrmApiErrorMessage, getCrmApiHeaders } from '../utils';
import type { LeadNote } from '../types';

export interface UseLeadNotesReturn {
  notes: LeadNote[];
  loading: boolean;
  adding: boolean;
  error: string | null;
  addNote: (body: string) => Promise<boolean>;
  reload: () => Promise<void>;
}

export const useLeadNotes = (leadId: string): UseLeadNotesReturn => {
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!leadId) {
      setNotes([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithTimeout(
        `/api/crm/leads/notes?leadId=${encodeURIComponent(leadId)}`,
        {
          headers: await getCrmApiHeaders(),
          credentials: 'same-origin',
          cache: 'no-store',
        },
      );
      if (!response.ok) {
        setNotes([]);
        return;
      }
      const payload = await response.json().catch(() => null);
      setNotes(Array.isArray(payload?.notes) ? (payload.notes as LeadNote[]) : []);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    void load();
  }, [load]);

  const addNote = useCallback(
    async (body: string) => {
      const trimmed = body.trim();
      if (!trimmed || !leadId) return false;
      setAdding(true);
      setError(null);
      try {
        const response = await fetchWithTimeout('/api/crm/leads/notes', {
          method: 'POST',
          headers: await getCrmApiHeaders(),
          credentials: 'same-origin',
          body: JSON.stringify({ leadId, body: trimmed }),
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setError(getCrmApiErrorMessage(payload, response.statusText));
          return false;
        }
        const payload = await response.json().catch(() => null);
        if (payload?.note) setNotes((current) => [payload.note as LeadNote, ...current]);
        return true;
      } catch (catched) {
        setError(catched instanceof Error ? catched.message : 'Erro ao adicionar nota.');
        return false;
      } finally {
        setAdding(false);
      }
    },
    [leadId],
  );

  return { notes, loading, adding, error, addNote, reload: load };
};
