'use client';

import type { KeyboardEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Briefcase,
  Check,
  ChevronDown,
  Clipboard,
  Gauge,
  Info,
  Landmark,
  Trophy,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { sportsData } from './data';
import { KpiCard } from './components/KpiCard';
import { OverviewChart } from './components/OverviewChart';
import type { SortDirection, SportMetricKey, SportSummary } from './types';

const metricConfig: Record<SportMetricKey, {
  label: string;
  shortLabel: string;
  unit: 'currency' | 'number';
  accentClass: string;
  getValue: (sport: SportSummary) => number | null;
}> = {
  movEco: {
    label: 'Movimentacao economica',
    shortLabel: 'Mov. economica',
    unit: 'currency',
    accentClass: 'text-emerald-300',
    getValue: (sport) => sport.movimentacaoEconomica.total,
  },
  renda: {
    label: 'Geracao de renda',
    shortLabel: 'Renda',
    unit: 'currency',
    accentClass: 'text-amber-300',
    getValue: (sport) => sport.geracaoRenda.total,
  },
  empregos: {
    label: 'Postos de trabalho',
    shortLabel: 'Empregos',
    unit: 'number',
    accentClass: 'text-sky-300',
    getValue: (sport) => sport.postosTrabalho.total,
  },
  tributos: {
    label: 'Tributos gerados',
    shortLabel: 'Tributos',
    unit: 'currency',
    accentClass: 'text-cyan-300',
    getValue: (sport) => sport.tributos,
  },
  vaPib: {
    label: 'VA / PIB esportivo',
    shortLabel: 'VA/PIB',
    unit: 'currency',
    accentClass: 'text-lime-300',
    getValue: (sport) => sport.vaPib,
  },
};

const metricOrder: SportMetricKey[] = ['movEco', 'renda', 'empregos', 'tributos', 'vaPib'];
const sportNames = sportsData.map((sport) => sport.esporte);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

const formatNumber = (value: number) => value.toLocaleString('pt-BR');

const formatMetric = (value: number | null, metric: SportMetricKey) => {
  if (value === null) return 'N/D';
  return metricConfig[metric].unit === 'currency' ? formatCurrency(value) : formatNumber(value);
};

const getSportInitials = (sport: string) =>
  sport
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

const getMetricRows = (metric: SportMetricKey) =>
  sportsData
    .map((sport) => ({ sport, value: metricConfig[metric].getValue(sport) }))
    .filter((row): row is { sport: SportSummary; value: number } => row.value !== null)
    .sort((left, right) => right.value - left.value);

const getRank = (sportName: string, metric: SportMetricKey) => {
  const rows = getMetricRows(metric);
  const index = rows.findIndex((row) => row.sport.esporte === sportName);
  return index >= 0 ? index + 1 : null;
};

const isMetricKey = (value: string | null): value is SportMetricKey =>
  !!value && metricOrder.includes(value as SportMetricKey);

const isSortDirection = (value: string | null): value is SortDirection =>
  value === 'asc' || value === 'desc';

const normalizeSportName = (value: string | null) => {
  if (!value) return null;
  const decoded = value.trim();
  return sportNames.includes(decoded) ? decoded : null;
};

const getInitialUrlParam = (key: string) => {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(key);
};

const getInitialMetric = () => {
  const metric = getInitialUrlParam('metric');
  return isMetricKey(metric) ? metric : 'movEco';
};

const getInitialSortMetric = (fallbackMetric: SportMetricKey) => {
  const sort = getInitialUrlParam('sort');
  return isMetricKey(sort) ? sort : fallbackMetric;
};

const getInitialSortDirection = () => {
  const dir = getInitialUrlParam('dir');
  return isSortDirection(dir) ? dir : 'desc';
};

const formatMetricDisplay = (sport: SportSummary, metric: SportMetricKey) =>
  formatMetric(metricConfig[metric].getValue(sport), metric);

const isActivationKey = (key: string) => key === 'Enter' || key === ' ';

function MetricButton({
  metric,
  activeMetric,
  onClick,
}: {
  metric: SportMetricKey;
  activeMetric: SportMetricKey;
  onClick: (metric: SportMetricKey) => void;
}) {
  const isActive = activeMetric === metric;
  const config = metricConfig[metric];

  return (
    <button
      type="button"
      onClick={() => onClick(metric)}
      className={`rounded-sm border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] outline-none transition focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        isActive
          ? 'border-slate-200 bg-slate-200 text-slate-950 shadow-lg shadow-black/15'
          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-100'
      }`}
    >
      {config.shortLabel}
    </button>
  );
}

function SortHeader({
  metric,
  tableSortMetric,
  tableSortDir,
  onSort,
}: {
  metric: SportMetricKey;
  tableSortMetric: SportMetricKey;
  tableSortDir: SortDirection;
  onSort: (metric: SportMetricKey) => void;
}) {
  const isActive = metric === tableSortMetric;

  return (
    <button
      type="button"
      onClick={() => onSort(metric)}
      aria-label={`Ordenar por ${metricConfig[metric].shortLabel}${isActive ? `, atual ${tableSortDir}` : ''}`}
      className={`inline-flex items-center gap-1 rounded-sm text-left text-xs font-bold uppercase tracking-[0.16em] outline-none transition focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        isActive ? 'text-lime-300' : 'text-slate-500 hover:text-slate-200'
      }`}
    >
      {metricConfig[metric].shortLabel}
      <span className="text-[10px]">{isActive ? (tableSortDir === 'desc' ? 'v' : '^') : '-'}</span>
    </button>
  );
}

function SportPill({
  sport,
  selectedSport,
  onSelectSport,
}: {
  sport: SportSummary;
  selectedSport: string | null;
  onSelectSport: (sport: string) => void;
}) {
  const isActive = selectedSport === sport.esporte;

  return (
    <button
      type="button"
      onClick={() => onSelectSport(sport.esporte)}
      className={`group inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        isActive
          ? 'border-slate-200 bg-slate-200 text-slate-950'
          : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
      }`}
    >
      <span
        className={`grid h-6 w-6 place-items-center rounded-sm text-[10px] font-black ${
          isActive ? 'bg-slate-950 text-slate-100' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
        }`}
      >
        {getSportInitials(sport.esporte)}
      </span>
      {sport.esporte}
    </button>
  );
}

function SportDetailPanel({
  sport,
  selectedMetric,
}: {
  sport: SportSummary;
  selectedMetric: SportMetricKey;
}) {
  const rows = metricOrder.map((metric) => {
    const value = metricConfig[metric].getValue(sport);
    const metricRows = getMetricRows(metric);
    const maxValue = metricRows[0]?.value ?? 0;
    const rank = getRank(sport.esporte, metric);
    return {
      metric,
      value,
      rank,
      width: value && maxValue ? Math.max(6, (value / maxValue) * 100) : 0,
    };
  });

  return (
    <section className="mt-5 rounded-md border border-slate-800 bg-slate-900/85 p-5 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-sm border border-slate-700 bg-slate-200 text-sm font-black text-slate-950">
              {getSportInitials(sport.esporte)}
            </span>
            <div>
              <h3 className="text-2xl font-black text-white">{sport.esporte}</h3>
              <p className="text-sm text-slate-400">Perfil comparativo entre as 8 modalidades</p>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-slate-800 bg-slate-950 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Metrica ativa</p>
          <p className={`mt-1 text-xl font-black ${metricConfig[selectedMetric].accentClass}`}>
            #{getRank(sport.esporte, selectedMetric) ?? '-'} em {metricConfig[selectedMetric].shortLabel}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-5">
        {rows.map((row) => {
          const config = metricConfig[row.metric];
          return (
            <article
              key={row.metric}
              className={`rounded-sm border bg-slate-950 p-4 ${
                row.metric === selectedMetric ? 'border-slate-300/60' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{config.shortLabel}</p>
                  <p className="mt-1 text-lg font-black text-white">{formatMetric(row.value, row.metric)}</p>
                </div>
                <span className={`text-xs font-black ${config.accentClass}`}>{row.rank ? `#${row.rank}` : 'N/D'}</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-sm bg-slate-800">
                <div className="h-full rounded-sm bg-lime-300" style={{ width: `${row.width}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">Valor absoluto informado na base local</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ComparePanel({
  primarySport,
  compareSport,
  selectedMetric,
  onPrimaryChange,
  onCompareChange,
  onClear,
}: {
  primarySport: SportSummary | null;
  compareSport: SportSummary | null;
  selectedMetric: SportMetricKey;
  onPrimaryChange: (sport: string) => void;
  onCompareChange: (sport: string) => void;
  onClear: () => void;
}) {
  const rows = metricOrder.map((metric) => {
    const primaryValue = primarySport ? metricConfig[metric].getValue(primarySport) : null;
    const compareValue = compareSport ? metricConfig[metric].getValue(compareSport) : null;
    const maxValue = Math.max(primaryValue ?? 0, compareValue ?? 0);
    const delta = primaryValue !== null && compareValue !== null ? primaryValue - compareValue : null;

    return {
      metric,
      primaryValue,
      compareValue,
      primaryWidth: maxValue > 0 && primaryValue !== null ? Math.max(5, (primaryValue / maxValue) * 100) : 0,
      compareWidth: maxValue > 0 && compareValue !== null ? Math.max(5, (compareValue / maxValue) * 100) : 0,
      delta,
    };
  });

  return (
    <section className="rounded-md border border-slate-800 bg-slate-950 p-5">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Comparar duas modalidades</h2>
          <p className="text-sm text-slate-500">Escolha duas modalidades para ver diferencas absolutas por indicador.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Base
            <select
              value={primarySport?.esporte ?? ''}
              onChange={(event) => onPrimaryChange(event.target.value)}
              className="min-w-44 rounded-sm border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-white outline-none transition focus:border-lime-300/60 focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <option value="">Escolha</option>
              {sportsData.map((sport) => (
                <option key={`primary-${sport.esporte}`} value={sport.esporte}>{sport.esporte}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Comparar com
            <select
              value={compareSport?.esporte ?? ''}
              onChange={(event) => onCompareChange(event.target.value)}
              className="min-w-44 rounded-sm border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-white outline-none transition focus:border-lime-300/60 focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <option value="">Escolha</option>
              {sportsData.map((sport) => (
                <option
                  key={`compare-${sport.esporte}`}
                  value={sport.esporte}
                  disabled={sport.esporte === primarySport?.esporte}
                >
                  {sport.esporte}
                </option>
              ))}
            </select>
          </label>

          {(primarySport || compareSport) && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center justify-center gap-1.5 self-end rounded-sm border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400 outline-none transition hover:border-slate-700 hover:text-white focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <X className="h-3.5 w-3.5" />
              Limpar
            </button>
          )}
        </div>
      </div>

      {primarySport && compareSport ? (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {[primarySport, compareSport].map((sport, index) => (
              <article
                key={`compare-summary-${sport.esporte}`}
                className={`rounded-sm border p-4 ${
                  index === 0 ? 'border-lime-300/30 bg-lime-300/10' : 'border-sky-300/30 bg-sky-300/10'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{index === 0 ? 'Base' : 'Comparacao'}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-sm text-xs font-black ${
                      index === 0 ? 'bg-lime-300 text-slate-950' : 'bg-sky-300 text-slate-950'
                    }`}>
                      {getSportInitials(sport.esporte)}
                    </span>
                    <div>
                      <h3 className="text-xl font-black text-white">{sport.esporte}</h3>
                      <p className="text-xs text-slate-400">
                        #{getRank(sport.esporte, selectedMetric) ?? '-'} em {metricConfig[selectedMetric].shortLabel}
                      </p>
                    </div>
                  </div>
                  <p className={`text-lg font-black ${index === 0 ? 'text-lime-200' : 'text-sky-200'}`}>
                    {formatMetric(metricConfig[selectedMetric].getValue(sport), selectedMetric)}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {rows.map((row) => {
            const config = metricConfig[row.metric];
            return (
              <article
                key={`compare-row-${row.metric}`}
                className={`rounded-sm border bg-slate-900 p-4 ${
                  row.metric === selectedMetric ? 'border-lime-300/40' : 'border-slate-800'
                }`}
              >
                <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-white">{config.shortLabel}</p>
                  <p className="text-xs font-semibold text-slate-400">
                    Diferenca: <span className={row.delta && row.delta >= 0 ? 'text-lime-200' : 'text-sky-200'}>
                      {row.delta === null ? 'N/D' : formatMetric(Math.abs(row.delta), row.metric)}
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-semibold text-lime-200">{primarySport.esporte}</span>
                      <span className="text-slate-300">{formatMetric(row.primaryValue, row.metric)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-sm bg-slate-800">
                      <div className="h-full rounded-sm bg-lime-300" style={{ width: `${row.primaryWidth}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-semibold text-sky-200">{compareSport.esporte}</span>
                      <span className="text-slate-300">{formatMetric(row.compareValue, row.metric)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-sm bg-slate-800">
                      <div className="h-full rounded-sm bg-sky-300" style={{ width: `${row.compareWidth}%` }} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
          Selecione duas modalidades para abrir a comparacao. A primeira tambem sincroniza com os graficos.
        </div>
      )}
    </section>
  );
}

export default function DashboardEsportesPage() {
  const initialMetric = getInitialMetric();
  const [selectedSportName, setSelectedSportName] = useState<string | null>(null);
  const [compareSportName, setCompareSportName] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<SportMetricKey>(initialMetric);
  const [tableSortMetric, setTableSortMetric] = useState<SportMetricKey>(() => getInitialSortMetric(initialMetric));
  const [tableSortDir, setTableSortDir] = useState<SortDirection>(() => getInitialSortDirection());
  const [showMethodology, setShowMethodology] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [urlStateReady, setUrlStateReady] = useState(false);

  const selectedSport = useMemo(
    () => sportsData.find((sport) => sport.esporte === selectedSportName) ?? null,
    [selectedSportName],
  );
  const compareSport = useMemo(
    () => sportsData.find((sport) => sport.esporte === compareSportName) ?? null,
    [compareSportName],
  );

  const totals = useMemo(() => ({
    movEco: sportsData.reduce((acc, sport) => acc + sport.movimentacaoEconomica.total, 0),
    renda: sportsData.reduce((acc, sport) => acc + sport.geracaoRenda.total, 0),
    empregos: sportsData.reduce((acc, sport) => acc + sport.postosTrabalho.total, 0),
    tributos: sportsData.reduce((acc, sport) => acc + sport.tributos, 0),
    vaPib: sportsData.reduce((acc, sport) => acc + (sport.vaPib ?? 0), 0),
  }), []);

  const tableRanking = useMemo(() => {
    const direction = tableSortDir === 'desc' ? -1 : 1;
    return [...sportsData]
      .map((sport) => ({ sport, value: metricConfig[tableSortMetric].getValue(sport) }))
      .sort((left, right) => {
        if (left.value === null && right.value === null) return left.sport.esporte.localeCompare(right.sport.esporte);
        if (left.value === null) return 1;
        if (right.value === null) return -1;
        if (left.value === right.value) return left.sport.esporte.localeCompare(right.sport.esporte);
        return left.value > right.value ? direction : -direction;
      });
  }, [tableSortDir, tableSortMetric]);

  useEffect(() => {
    const restoreHandle = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const metric = params.get('metric');
      const sort = params.get('sort');
      const dir = params.get('dir');
      const sport = normalizeSportName(params.get('sport'));
      const compare = normalizeSportName(params.get('compare'));

      if (isMetricKey(metric)) {
        setSelectedMetric(metric);
        setTableSortMetric(metric);
      }
      if (isMetricKey(sort)) setTableSortMetric(sort);
      if (isSortDirection(dir)) setTableSortDir(dir);
      if (sport) setSelectedSportName(sport);
      if (compare && compare !== sport) setCompareSportName(compare);
      setUrlStateReady(true);
    }, 0);

    return () => window.clearTimeout(restoreHandle);
  }, []);

  useEffect(() => {
    if (!urlStateReady) return;

    const nextUrl = new URL(window.location.href);
    const params = nextUrl.searchParams;

    if (selectedMetric !== 'movEco') params.set('metric', selectedMetric);
    else params.delete('metric');

    params.delete('mode');

    if (tableSortMetric !== selectedMetric) params.set('sort', tableSortMetric);
    else params.delete('sort');

    if (tableSortDir !== 'desc') params.set('dir', tableSortDir);
    else params.delete('dir');

    if (selectedSportName) params.set('sport', selectedSportName);
    else params.delete('sport');

    if (selectedSportName && compareSportName && compareSportName !== selectedSportName) params.set('compare', compareSportName);
    else params.delete('compare');

    const nextSearch = params.toString();
    const nextPath = `${nextUrl.pathname}${nextSearch ? `?${nextSearch}` : ''}${nextUrl.hash}`;
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextPath !== currentPath) {
      window.history.replaceState({}, '', nextPath);
    }
  }, [compareSportName, selectedMetric, selectedSportName, tableSortDir, tableSortMetric, urlStateReady]);

  const handleSelectSport = (sport: string) => {
    const nextSport = selectedSportName === sport ? null : sport;
    setSelectedSportName(nextSport);
    if (nextSport && compareSportName === nextSport) setCompareSportName(null);
  };

  const handleTableRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, sport: string) => {
    if (!isActivationKey(event.key)) return;
    event.preventDefault();
    handleSelectSport(sport);
  };

  const handlePrimaryCompareChange = (sport: string) => {
    const nextSport = normalizeSportName(sport);
    setSelectedSportName(nextSport);
    if (nextSport && compareSportName === nextSport) {
      setCompareSportName(null);
    }
  };

  const handleCompareSportChange = (sport: string) => {
    const nextSport = normalizeSportName(sport);
    if (!nextSport || nextSport === selectedSportName) {
      setCompareSportName(null);
      return;
    }
    setCompareSportName(nextSport);
  };

  const clearCompare = () => {
    setCompareSportName(null);
  };

  const handleMetricChange = (metric: SportMetricKey) => {
    setSelectedMetric(metric);
    setTableSortMetric(metric);
    setTableSortDir('desc');
  };

  const handleTableSort = (metric: SportMetricKey) => {
    if (tableSortMetric === metric) {
      setTableSortDir((current) => (current === 'desc' ? 'asc' : 'desc'));
      return;
    }
    setTableSortMetric(metric);
    setTableSortDir('desc');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus('copied');
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    } catch {
      setCopyStatus('error');
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d12] text-slate-100">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-7 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-md border border-slate-800 bg-slate-950 px-5 py-6 shadow-2xl shadow-black/25 sm:px-8">
          <div className="max-w-5xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
              <Activity className="h-3.5 w-3.5" />
              FGV / ABDI - Estudo de impacto economico
            </div>
            <h1 className="text-4xl font-extrabold tracking-normal text-white sm:text-5xl lg:text-[3.4rem]">
              Impacto economico do esporte brasileiro
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
              Painel executivo para comparar movimentacao economica, renda, empregos, tributos e VA/PIB em 8 modalidades esportivas.
            </p>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Metrica de leitura</p>
              <div className="flex flex-wrap gap-2">
                {metricOrder.map((metric) => (
                  <MetricButton
                    key={metric}
                    metric={metric}
                    activeMetric={selectedMetric}
                    onClick={handleMetricChange}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 xl:justify-end">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 rounded-sm border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-300 outline-none transition hover:border-slate-700 hover:text-white focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                {copyStatus === 'copied' ? <Check className="h-3.5 w-3.5 text-lime-300" /> : <Clipboard className="h-3.5 w-3.5" />}
                {copyStatus === 'copied' ? 'Link copiado' : copyStatus === 'error' ? 'Nao copiou' : 'Copiar link'}
              </button>
              <button
                type="button"
                onClick={() => setShowMethodology((current) => !current)}
                className="inline-flex items-center gap-2 rounded-sm border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-300 outline-none transition hover:border-slate-700 hover:text-white focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <Info className="h-3.5 w-3.5 text-sky-300" />
                Metodologia
                <ChevronDown className={`h-3.5 w-3.5 transition ${showMethodology ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </header>

        {showMethodology && (
          <section className="rounded-md border border-slate-800 bg-slate-950 p-5">
            <div className="grid gap-4 md:grid-cols-3">
              <article>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Fonte</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Base local derivada da planilha FGV / ABDI informada para o estudo de impacto economico do esporte brasileiro.
                </p>
              </article>
              <article>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Direto e indireto</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Valores diretos representam impacto associado diretamente a cada modalidade; indiretos representam encadeamentos economicos estimados.
                </p>
              </article>
              <article>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Caveats</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Ginastica nao possui VA/PIB divulgado na base local. Rankings de VA/PIB usam apenas linhas com valor valido para a metrica.
                </p>
              </article>
            </div>
          </section>
        )}

        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <KpiCard
            title="Movimentacao economica"
            value={formatCurrency(totals.movEco)}
            subtext="Total direto + indireto nas 8 modalidades"
            icon={TrendingUp}
            colorClass="text-emerald-300"
          />
          <KpiCard
            title="Geracao de renda"
            value={formatCurrency(totals.renda)}
            subtext="Renda direta e indireta consolidada"
            icon={Briefcase}
            colorClass="text-amber-300"
          />
          <KpiCard
            title="Postos de trabalho"
            value={formatNumber(totals.empregos)}
            suffix="postos"
            subtext="Empregos diretos e indiretos"
            icon={Users}
            colorClass="text-sky-300"
          />
          <KpiCard
            title="Tributos"
            value={formatCurrency(totals.tributos)}
            subtext="Arrecadacao fiscal consolidada"
            icon={Landmark}
            colorClass="text-cyan-300"
          />
        </section>

        <OverviewChart
          data={sportsData}
          selectedMetric={selectedMetric}
          selectedSport={selectedSportName}
          onSelectSport={handleSelectSport}
        />

        <section className="rounded-md border border-slate-800 bg-slate-950 p-4">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Explorar por modalidade</h2>
              <p className="text-sm text-slate-500">A selecao destaca a mesma modalidade nos graficos e na tabela.</p>
            </div>
            {selectedSportName && (
              <button
                type="button"
                onClick={() => setSelectedSportName(null)}
                className="self-start rounded-sm border border-slate-700 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-300 outline-none hover:border-slate-600 hover:text-white focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Limpar selecao
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sportsData.map((sport) => (
              <SportPill
                key={sport.esporte}
                sport={sport}
                selectedSport={selectedSportName}
                onSelectSport={handleSelectSport}
              />
            ))}
          </div>

          {selectedSport && (
            <SportDetailPanel sport={selectedSport} selectedMetric={selectedMetric} />
          )}
        </section>

        <ComparePanel
          primarySport={selectedSport}
          compareSport={compareSport}
          selectedMetric={selectedMetric}
          onPrimaryChange={handlePrimaryCompareChange}
          onCompareChange={handleCompareSportChange}
          onClear={clearCompare}
        />

        <section className="overflow-hidden rounded-md border border-slate-800 bg-slate-900/70 shadow-xl shadow-slate-950/20">
          <div className="border-b border-slate-800 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Resumo comparativo</h2>
                <p className="text-xs uppercase tracking-wider text-slate-500">Clique em uma linha para sincronizar a selecao</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-sm border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-400">
                <Gauge className="h-3.5 w-3.5 text-lime-300" />
                Ordenado por: {metricConfig[tableSortMetric].shortLabel} ({tableSortDir})
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 md:hidden">
            {tableRanking.map((row, index) => {
              const sport = row.sport;
              const isActive = selectedSportName === sport.esporte;
              const activeValue = metricConfig[tableSortMetric].getValue(sport);
              return (
                <button
                  key={`mobile-summary-${sport.esporte}`}
                  type="button"
                  onClick={() => handleSelectSport(sport.esporte)}
                  className={`w-full rounded-sm border p-4 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                    isActive
                      ? 'border-lime-300/50 bg-lime-300/10'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-xs font-black ${
                        index === 0 ? 'bg-lime-300 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-base font-black text-white">{sport.esporte}</h3>
                          {index === 0 && <Trophy className="h-4 w-4 shrink-0 text-lime-300" />}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">Ranking por {metricConfig[tableSortMetric].shortLabel}</p>
                      </div>
                    </div>
                    <p className={`shrink-0 text-right text-sm font-black ${metricConfig[tableSortMetric].accentClass}`}>
                      {formatMetric(activeValue, tableSortMetric)}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-sm bg-slate-900 p-2">
                      <p className="text-slate-500">Mov. economica</p>
                      <p className="mt-1 font-bold text-emerald-200">{formatMetricDisplay(sport, 'movEco')}</p>
                    </div>
                    <div className="rounded-sm bg-slate-900 p-2">
                      <p className="text-slate-500">Empregos</p>
                      <p className="mt-1 font-bold text-sky-200">{formatMetricDisplay(sport, 'empregos')}</p>
                    </div>
                    <div className="rounded-sm bg-slate-900 p-2">
                      <p className="text-slate-500">Tributos</p>
                      <p className="mt-1 font-bold text-cyan-200">{formatMetricDisplay(sport, 'tributos')}</p>
                    </div>
                    <div className="rounded-sm bg-slate-900 p-2">
                      <p className="text-slate-500">VA/PIB</p>
                      <p className="mt-1 font-bold text-lime-200">{formatMetricDisplay(sport, 'vaPib')}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">#</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Modalidade</th>
                  {metricOrder.map((metric) => (
                    <th
                      key={`header-${metric}`}
                      className="px-5 py-4"
                      aria-sort={tableSortMetric === metric ? (tableSortDir === 'desc' ? 'descending' : 'ascending') : 'none'}
                    >
                      <SortHeader
                        metric={metric}
                        tableSortMetric={tableSortMetric}
                        tableSortDir={tableSortDir}
                        onSort={handleTableSort}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRanking.map((row, index) => {
                  const sport = row.sport;
                  const isActive = selectedSportName === sport.esporte;
                  return (
                    <tr
                      key={sport.esporte}
                      tabIndex={0}
                      aria-label={`Selecionar ${sport.esporte} na tabela`}
                      onClick={() => handleSelectSport(sport.esporte)}
                      onKeyDown={(event) => handleTableRowKeyDown(event, sport.esporte)}
                      className={`cursor-pointer border-b border-slate-800/70 outline-none transition hover:bg-slate-800/60 focus-visible:bg-slate-800/80 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lime-300 ${
                        isActive ? 'bg-lime-300/10' : ''
                      }`}
                    >
                      <td className="px-5 py-4">
                        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-sm text-xs font-black ${
                          index === 0 ? 'bg-lime-300 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-8 w-8 place-items-center rounded-sm bg-slate-800 text-xs font-black text-slate-200">
                            {getSportInitials(sport.esporte)}
                          </span>
                          <span className="font-bold text-white">{sport.esporte}</span>
                          {index === 0 && <Trophy className="h-4 w-4 text-lime-300" />}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-emerald-200">{formatMetricDisplay(sport, 'movEco')}</td>
                      <td className="px-5 py-4 font-semibold text-amber-200">{formatMetricDisplay(sport, 'renda')}</td>
                      <td className="px-5 py-4 font-semibold text-sky-200">{formatMetricDisplay(sport, 'empregos')}</td>
                      <td className="px-5 py-4 font-semibold text-cyan-200">{formatMetricDisplay(sport, 'tributos')}</td>
                      <td className="px-5 py-4 font-semibold text-lime-200">{formatMetricDisplay(sport, 'vaPib')}</td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-950">
                  <td className="px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500" colSpan={2}>Total</td>
                  <td className="px-5 py-4 font-black text-emerald-200">{formatCurrency(totals.movEco)}</td>
                  <td className="px-5 py-4 font-black text-amber-200">{formatCurrency(totals.renda)}</td>
                  <td className="px-5 py-4 font-black text-sky-200">{formatNumber(totals.empregos)}</td>
                  <td className="px-5 py-4 font-black text-cyan-200">{formatCurrency(totals.tributos)}</td>
                  <td className="px-5 py-4 font-black text-lime-200">{formatCurrency(totals.vaPib)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-slate-800 pb-6 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Fonte: FGV / ABDI - Estudo de Impacto Economico do Esporte Brasileiro.</p>
          <p>Nota: Ginastica nao apresenta VA/PIB divulgado na base local.</p>
        </footer>
      </div>
    </div>
  );
}
