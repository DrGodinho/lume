'use client';

import type { KeyboardEvent } from 'react';
import type { SportSummary } from '../types';

interface DistributionChartProps {
  data: SportSummary[];
  selectedSport: string | null;
  onSelectSport: (sport: string) => void;
}

interface DistributionRow {
  esporte: string;
  value: number;
  label: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export function DistributionChart({ data, selectedSport, onSelectSport }: DistributionChartProps) {
  const chartData: DistributionRow[] = data
    .filter((sport) => sport.vaPib !== null)
    .map((sport) => ({
      esporte: sport.esporte,
      value: sport.vaPib as number,
      label: formatCurrency(sport.vaPib as number),
    }))
    .sort((left, right) => right.value - left.value);

  const leader = chartData[0];
  const maxValue = leader?.value ?? 0;
  const selectedIndex = chartData.findIndex((entry) => entry.esporte === selectedSport);

  const handleChartKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!chartData.length) return;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = selectedIndex >= 0 ? (selectedIndex + 1) % chartData.length : 0;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = selectedIndex > 0 ? selectedIndex - 1 : chartData.length - 1;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = chartData.length - 1;
    } else if (event.key === 'Enter' || event.key === ' ') {
      nextIndex = selectedIndex >= 0 ? selectedIndex : 0;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    onSelectSport(chartData[nextIndex].esporte);
  };

  return (
    <section
      tabIndex={0}
      onKeyDown={handleChartKeyDown}
      aria-label="Grafico de VA PIB esportivo. Use as setas para navegar entre modalidades."
      className="rounded-md border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 outline-none transition focus-visible:border-amber-300/70 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">VA/PIB esportivo por modalidade</h2>
          <p className="text-xs uppercase tracking-wider text-slate-400">Valores absolutos da base local</p>
        </div>
        {leader && (
          <p className="text-xs font-medium text-amber-300">
            Lider: {leader.esporte} ({leader.label})
          </p>
        )}
      </div>

      <div className="space-y-3">
        {chartData.map((entry, index) => {
          const isActive = selectedSport === entry.esporte;
          const barWidth = maxValue > 0 ? Math.max(4, (entry.value / maxValue) * 100) : 0;

          return (
            <button
              key={entry.esporte}
              type="button"
              onClick={() => onSelectSport(entry.esporte)}
              className={`grid w-full gap-2 rounded-sm border p-3 text-left outline-none transition sm:grid-cols-[92px_minmax(0,1fr)_86px] sm:items-center ${
                isActive
                  ? 'border-slate-300/60 bg-slate-950'
                  : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
              }`}
            >
              <span className="truncate text-xs font-bold text-slate-200">{entry.esporte}</span>
              <span className="h-5 rounded-sm bg-slate-800">
                <span
                  className={`block h-full rounded-sm ${index === 0 ? 'bg-amber-300' : 'bg-lime-300'}`}
                  style={{ width: `${barWidth}%` }}
                />
              </span>
              <span className="text-right text-xs font-black text-slate-100">{entry.label}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-500">Ginastica aparece como N/D na base e fica fora deste ranking.</p>
    </section>
  );
}
