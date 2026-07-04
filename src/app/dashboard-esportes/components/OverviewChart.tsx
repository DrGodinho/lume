'use client';

import type { KeyboardEvent } from 'react';
import type { SportMetricKey, SportSummary } from '../types';

interface OverviewChartProps {
  data: SportSummary[];
  selectedMetric: SportMetricKey;
  selectedSport: string | null;
  onSelectSport: (sport: string) => void;
}

interface MetricSegment {
  label: string;
  value: number;
  colorClass: string;
}

interface MetricRow {
  esporte: string;
  total: number;
  totalLabel: string;
  segments: MetricSegment[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

const formatNumber = (value: number) => value.toLocaleString('pt-BR');

const metricCopy: Record<SportMetricKey, {
  title: string;
  subtitle: string;
  emptyNote?: string;
}> = {
  movEco: {
    title: 'Movimentacao economica por modalidade',
    subtitle: 'Valores absolutos: direta + indireta',
  },
  renda: {
    title: 'Geracao de renda por modalidade',
    subtitle: 'Valores absolutos: renda direta + indireta',
  },
  empregos: {
    title: 'Postos de trabalho por modalidade',
    subtitle: 'Valores absolutos: empregos diretos + indiretos',
  },
  tributos: {
    title: 'Tributos gerados por modalidade',
    subtitle: 'Valores absolutos de arrecadacao fiscal',
  },
  vaPib: {
    title: 'VA/PIB esportivo por modalidade',
    subtitle: 'Valores absolutos da base local',
    emptyNote: 'Ginastica aparece como N/D na base e fica fora deste ranking.',
  },
};

function getMetricRow(sport: SportSummary, metric: SportMetricKey): MetricRow | null {
  if (metric === 'movEco') {
    return {
      esporte: sport.esporte,
      total: sport.movimentacaoEconomica.total,
      totalLabel: formatCurrency(sport.movimentacaoEconomica.total),
      segments: [
        { label: 'Direta', value: sport.movimentacaoEconomica.direta, colorClass: 'bg-emerald-400' },
        { label: 'Indireta', value: sport.movimentacaoEconomica.indireta, colorClass: 'bg-amber-500' },
      ],
    };
  }

  if (metric === 'renda') {
    return {
      esporte: sport.esporte,
      total: sport.geracaoRenda.total,
      totalLabel: formatCurrency(sport.geracaoRenda.total),
      segments: [
        { label: 'Direta', value: sport.geracaoRenda.direta, colorClass: 'bg-amber-300' },
        { label: 'Indireta', value: sport.geracaoRenda.indireta, colorClass: 'bg-orange-500' },
      ],
    };
  }

  if (metric === 'empregos') {
    return {
      esporte: sport.esporte,
      total: sport.postosTrabalho.total,
      totalLabel: formatNumber(sport.postosTrabalho.total),
      segments: [
        { label: 'Diretos', value: sport.postosTrabalho.direto, colorClass: 'bg-sky-400' },
        { label: 'Indiretos', value: sport.postosTrabalho.indireto, colorClass: 'bg-orange-500' },
      ],
    };
  }

  if (metric === 'tributos') {
    return {
      esporte: sport.esporte,
      total: sport.tributos,
      totalLabel: formatCurrency(sport.tributos),
      segments: [{ label: 'Tributos', value: sport.tributos, colorClass: 'bg-cyan-300' }],
    };
  }

  if (sport.vaPib === null) return null;

  return {
    esporte: sport.esporte,
    total: sport.vaPib,
    totalLabel: formatCurrency(sport.vaPib),
    segments: [{ label: 'VA/PIB', value: sport.vaPib, colorClass: 'bg-lime-300' }],
  };
}

export function OverviewChart({ data, selectedMetric, selectedSport, onSelectSport }: OverviewChartProps) {
  const chartData = data
    .map((sport) => getMetricRow(sport, selectedMetric))
    .filter((row): row is MetricRow => row !== null)
    .sort((left, right) => right.total - left.total);
  const leader = chartData[0];
  const maxTotal = leader?.total ?? 0;
  const selectedIndex = chartData.findIndex((entry) => entry.esporte === selectedSport);
  const copy = metricCopy[selectedMetric];

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
      aria-label={`Ranking de ${copy.title}. Use as setas para navegar entre modalidades.`}
      className="rounded-md border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 outline-none transition focus-visible:border-lime-300/70 focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{copy.title}</h2>
          <p className="text-xs uppercase tracking-wider text-slate-400">{copy.subtitle}</p>
        </div>
        {leader && (
          <p className="text-xs font-medium text-lime-300">
            Lider: {leader.esporte} ({leader.totalLabel})
          </p>
        )}
      </div>

      <div className="space-y-3">
        {chartData.map((entry) => {
          const isActive = selectedSport === entry.esporte;
          const totalWidth = maxTotal > 0 ? Math.max(4, (entry.total / maxTotal) * 100) : 0;

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
                  {entry.segments.map((segment, index) => {
                    const segmentWidth = entry.total > 0 ? (segment.value / entry.total) * 100 : 0;
                    const radiusClass = entry.segments.length === 1
                      ? 'rounded-sm'
                      : index === 0
                        ? 'rounded-l-sm'
                        : index === entry.segments.length - 1
                          ? 'rounded-r-sm'
                          : '';

                    return (
                      <span
                        key={segment.label}
                        aria-label={`${segment.label}: ${segment.value}`}
                        className={`h-full ${segment.colorClass} ${radiusClass}`}
                        style={{ width: `${segmentWidth}%` }}
                      />
                    );
                  })}
                </span>
              </span>
              <span className="text-right text-xs font-black text-slate-100">{entry.totalLabel}</span>
            </button>
          );
        })}
      </div>

      {copy.emptyNote && <p className="mt-3 text-xs text-slate-500">{copy.emptyNote}</p>}
    </section>
  );
}
