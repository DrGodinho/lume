'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface MonthlySnapshot {
  month: string; // 'yyyy-MM'
  revenue: number;
  lead_count: number;
}

type SnapshotMap = Record<string, MonthlySnapshot>;

const fetchSnapshotsDirectly = async (): Promise<MonthlySnapshot[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('crm_monthly_snapshots')
    .select('month, revenue, lead_count')
    .order('month', { ascending: false })
    .limit(24);

  if (error || !data) return [];
  return data.map((row) => ({
    month: String(row.month),
    revenue: Number(row.revenue) || 0,
    lead_count: Number(row.lead_count) || 0,
  }));
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
