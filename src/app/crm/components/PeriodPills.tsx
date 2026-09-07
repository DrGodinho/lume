'use client';

import { format, startOfMonth } from 'date-fns';
import type { MetricsPeriod } from '../utils/metricsPeriod';

interface PeriodPillsProps {
  value: MetricsPeriod;
  onChange: (period: MetricsPeriod) => void;
  customStart: string | null;
  customEnd: string | null;
  onCustomStartChange: (value: string | null) => void;
  onCustomEndChange: (value: string | null) => void;
}

const PERIOD_OPTIONS: Array<{ value: MetricsPeriod; label: string }> = [
  { value: 'mes', label: 'Este mês' },
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
  { value: 'custom', label: 'Personalizado' },
];

/** Seletor compacto de período (pílulas + datas inline no modo custom). */
export function PeriodPills({ value, onChange, customStart, customEnd, onCustomStartChange, onCustomEndChange }: PeriodPillsProps) {
  const handleChange = (period: MetricsPeriod) => {
    if (period === 'custom' && (!customStart || !customEnd)) {
      const now = new Date();
      onCustomStartChange(format(startOfMonth(now), 'yyyy-MM-dd'));
      onCustomEndChange(format(now, 'yyyy-MM-dd'));
    }
    onChange(period);
  };

  return (
    <>
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleChange(option.value)}
          aria-pressed={value === option.value}
          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${
            value === option.value
              ? 'border-[#c9a227]/60 bg-[#c9a227]/15 text-[#f5d77a]'
              : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25 hover:text-white'
          }`}
        >
          {option.label}
        </button>
      ))}
      {value === 'custom' && (
        <>
          <label className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
            De
            <input
              type="date"
              value={customStart ?? ''}
              onChange={(event) => onCustomStartChange(event.target.value)}
              className="rounded-lg border border-white/10 bg-[#04080f] px-1.5 py-1 text-[11px] text-white focus:border-[#c9a227]/40 focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
            Até
            <input
              type="date"
              value={customEnd ?? ''}
              onChange={(event) => onCustomEndChange(event.target.value)}
              className="rounded-lg border border-white/10 bg-[#04080f] px-1.5 py-1 text-[11px] text-white focus:border-[#c9a227]/40 focus:outline-none"
            />
          </label>
        </>
      )}
    </>
  );
}
