'use client';

import type { KeyboardEvent } from 'react';
import type { SportSummary } from '../types';

interface JobsChartProps {
  data: SportSummary[];
  selectedSport: string | null;
  onSelectSport: (sport: string) => void;
}

interface JobsRow {
  esporte: string;
  direto: number;
  indireto: number;
  total: number;
  absoluteLabel: string;
}

export function JobsChart({ data, selectedSport, onSelectSport }: JobsChartProps) {
  const chartData: JobsRow[] = data
    .map((sport) => ({
      esporte: sport.esporte,
      direto: sport.postosTrabalho.direto,
      indireto: sport.postosTrabalho.indireto,
      total: sport.postosTrabalho.total,
      absoluteLabel: sport.postosTrabalho.total.toLocaleString('pt-BR'),
    }))
    .sort((left, right) => right.total - left.total);
  const leader = chartData[0];
  const maxTotal = leader?.total ?? 0;
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
      aria-label="Grafico de postos de trabalho. Use as setas para navegar entre modalidades."
      className="rounded-md border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 outline-none transition focus-visible:border-sky-300/70 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Postos de trabalho gerados</h2>
          <p className="text-xs uppercase tracking-wider text-slate-400">Valores absolutos: empregos diretos e indiretos por modalidade</p>
        </div>
        {leader && (
          <p className="text-xs font-medium text-cyan-300">
            Lider: {leader.esporte} ({leader.total.toLocaleString('pt-BR')} postos)
          </p>
        )}
      </div>

      <div className="space-y-3">
        {chartData.map((entry) => {
          const isActive = selectedSport === entry.esporte;
          const totalWidth = maxTotal > 0 ? Math.max(4, (entry.total / maxTotal) * 100) : 0;
          const directWidth = entry.total > 0 ? (entry.direto / entry.total) * 100 : 0;
          const indirectWidth = entry.total > 0 ? (entry.indireto / entry.total) * 100 : 0;

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
                <span className="flex h-full rounded-sm" style={{ width: `${totalWidth}%` }}>
                  <span className="h-full rounded-l-sm bg-sky-400" style={{ width: `${directWidth}%` }} />
                  <span className="h-full rounded-r-sm bg-orange-500" style={{ width: `${indirectWidth}%` }} />
                </span>
              </span>
              <span className="text-right text-xs font-black text-slate-100">{entry.absoluteLabel}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
