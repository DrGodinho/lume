'use client';

import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import { useCallback, useEffect, useState } from 'react';
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
        const response = await fetchWithTimeout(
          `/api/crm/settings?id=${encodeURIComponent(CRM_ARCHIVE_AFTER_DAYS_CONFIG_KEY)}`,
          { credentials: 'include', cache: 'no-store' }
        );

        if (!response.ok) {
          logger.warn('Failed to load archive-after-days', { status: response.status });
          setArchiveAfterDays(DEFAULT_CRM_ARCHIVE_AFTER_DAYS);
          return;
        }

        const result = await response.json().catch(() => null);
        if (cancelled) return;

        const stored = Number(result?.meta_valor);
        setArchiveAfterDays(
          Number.isFinite(stored) && stored > 0 ? clampArchiveDays(stored) : DEFAULT_CRM_ARCHIVE_AFTER_DAYS
        );
      } catch (error) {
        logger.warn('Failed to load archive-after-days', { message: String(error) });
        setArchiveAfterDays(DEFAULT_CRM_ARCHIVE_AFTER_DAYS);
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
      const response = await fetchWithTimeout('/api/crm/settings', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: CRM_ARCHIVE_AFTER_DAYS_CONFIG_KEY, meta_valor: clamped }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        setArchiveAfterDaysError(result?.error || 'Falha ao salvar configuracao.');
        logger.error('Failed to save archive-after-days', undefined, { message: result?.error });
      }
    } catch (error) {
      setArchiveAfterDaysError('Falha ao salvar configuracao.');
      logger.error('Failed to save archive-after-days', undefined, { message: String(error) });
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
