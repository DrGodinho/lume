'use client';

import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import { useEffect, useState } from 'react';

export interface MonthlySnapshot {
  month: string; // 'yyyy-MM'
  revenue: number;
  lead_count: number;
}

type SnapshotMap = Record<string, MonthlySnapshot>;

const fetchSnapshotsDirectly = async (): Promise<MonthlySnapshot[]> => {
  try {
    const response = await fetchWithTimeout('/api/crm/monthly-snapshots', {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const result = await response.json();
    const data = Array.isArray(result?.snapshots) ? result.snapshots : [];
    return data.map((row: Record<string, unknown>) => ({
      month: String(row.month),
      revenue: Number(row.revenue) || 0,
      lead_count: Number(row.lead_count) || 0,
    }));
  } catch {
    return [];
  }
};

export const useMonthlySnapshots = () => {
  const [snapshots, setSnapshots] = useState<SnapshotMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const rows = await fetchSnapshotsDirectly();

      if (!cancelled) {
        const map: SnapshotMap = {};
        for (const row of rows) {
          map[row.month] = row;
        }
        setSnapshots(map);
        setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, []);

  const getSnapshotForMonth = (month: string): MonthlySnapshot | null =>
    snapshots[month] ?? null;

  return { snapshots, getSnapshotForMonth, loading };
};
