'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { createScopedLogger } from '@/lib/logger';
import {
  CRM_ARCHIVE_AFTER_DAYS_CONFIG_KEY,
  DEFAULT_CRM_ARCHIVE_AFTER_DAYS,
  MAX_CRM_ARCHIVE_AFTER_DAYS,
  MIN_CRM_ARCHIVE_AFTER_DAYS,
} from '../constants';

const logger = createScopedLogger('crm-settings');

const clampArchiveDays = (days: number) => {
  if (!Number.isFinite(days) || days <= 0) return DEFAULT_CRM_ARCHIVE_AFTER_DAYS;
  return Math.min(Math.max(Math.floor(days), MIN_CRM_ARCHIVE_AFTER_DAYS), MAX_CRM_ARCHIVE_AFTER_DAYS);
};

export interface UseCrmSettingsReturn {
  archiveAfterDays: number;
  loadingArchiveAfterDays: boolean;
  savingArchiveAfterDays: boolean;
  archiveAfterDaysError: string | null;
  updateArchiveAfterDays: (next: number) => Promise<void>;
}

export const useCrmSettings = (): UseCrmSettingsReturn => {
  const [archiveAfterDays, setArchiveAfterDays] = useState<number>(DEFAULT_CRM_ARCHIVE_AFTER_DAYS);
  const [loadingArchiveAfterDays, setLoadingArchiveAfterDays] = useState(true);
  const [savingArchiveAfterDays, setSavingArchiveAfterDays] = useState(false);
  const [archiveAfterDaysError, setArchiveAfterDaysError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingArchiveAfterDays(true);
      try {
        if (!supabase) {
          setArchiveAfterDays(DEFAULT_CRM_ARCHIVE_AFTER_DAYS);
          return;
        }
        const { data, error } = await supabase
          .from('configuracoes')
          .select('meta_valor')
          .eq('id', CRM_ARCHIVE_AFTER_DAYS_CONFIG_KEY)
          .maybeSingle();

        if (error) {
          logger.warn('Failed to load archive-after-days', { message: error.message });
          setArchiveAfterDays(DEFAULT_CRM_ARCHIVE_AFTER_DAYS);
          return;
        }

        if (cancelled) return;
        const stored = Number(data?.meta_valor);
        setArchiveAfterDays(Number.isFinite(stored) && stored > 0 ? clampArchiveDays(stored) : DEFAULT_CRM_ARCHIVE_AFTER_DAYS);
      } finally {
        if (!cancelled) setLoadingArchiveAfterDays(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateArchiveAfterDays = useCallback(async (next: number) => {
    const clamped = clampArchiveDays(next);
    setArchiveAfterDays(clamped);
    setSavingArchiveAfterDays(true);
    setArchiveAfterDaysError(null);
    try {
      if (!supabase) return;
      const { error } = await supabase
        .from('configuracoes')
        .upsert({ id: CRM_ARCHIVE_AFTER_DAYS_CONFIG_KEY, meta_valor: clamped }, { onConflict: 'id' });
      if (error) {
        setArchiveAfterDaysError(error.message);
        logger.error('Failed to save archive-after-days', undefined, { message: error.message });
      }
    } finally {
      setSavingArchiveAfterDays(false);
    }
  }, []);

  return {
    archiveAfterDays,
    loadingArchiveAfterDays,
    savingArchiveAfterDays,
    archiveAfterDaysError,
    updateArchiveAfterDays,
  };
};
