'use client';

import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MonthlyEvolutionData, MonthlyEvolutionSeries, MonthlyTooltipPayload } from '../types';

interface MonthlyChartProps {
  monthlyEvolution: MonthlyEvolutionData;
  monthDifference: number;
  monthDifferencePercent: number;
  monthTrendIsPositive: boolean;
  visibleMonthlySeries: Record<MonthlyEvolutionSeries, boolean>;
  onToggleSeries: (series: MonthlyEvolutionSeries) => void;
  formatDashboardCurrency: (value: number) => string;
}

export function MonthlyChart({
  monthlyEvolution,
  monthDifference,
  monthDifferencePercent,
  monthTrendIsPositive,
  visibleMonthlySeries,
  onToggleSeries,
  formatDashboardCurrency,
}: MonthlyChartProps) {
  const cumulativeData = monthlyEvolution.chartData;

  return (
    <div className="overflow-hidden rounded-3xl border border-[#c9a227]/15 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.16),transparent_34%),linear-gradient(180deg,rgba(7,17,29,0.92),rgba(4,8,15,0.86))] p-5 shadow-2xl shadow-black/25 backdrop-blur-md sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#f5d77a]/80">Fechamentos acumulados</span>
          <h3 className="mt-1 font-display text-xl font-black uppercase tracking-wider text-white">EVOLUÇÃO DO MÊS</h3>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-white/45">
            Comparativo acumulado contra o mês anterior completo, com previsão separada para serviços futuros.
          </p>
        </div>

        <div
          className={`w-fit rounded-2xl border px-4 py-3 text-left shadow-lg ${
            monthTrendIsPositive
              ? 'border-emerald-500/25 bg-emerald-500/10 shadow-emerald-950/20'
              : 'border-red-500/25 bg-red-500/10 shadow-red-950/20'
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Vs. mês anterior</p>
          <p className={`mt-1 text-2xl font-black ${monthTrendIsPositive ? 'text-emerald-300' : 'text-red-300'}`}>
            {monthTrendIsPositive ? '+' : '-'}
            {Math.abs(monthDifferencePercent).toFixed(1)}%
          </p>
          <p className="text-[11px] text-white/50">
            {monthTrendIsPositive ? '+' : '-'}
            {formatDashboardCurrency(Math.abs(monthDifference))}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-white/[0.035] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">Mês atual</p>
          <p className="mt-2 text-xl font-black text-[#f5d77a]">{formatDashboardCurrency(monthlyEvolution.currentTotal)}</p>
          <p className="mt-1 text-[11px] text-white/40">{monthlyEvolution.currentCount} fechamentos até hoje</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">Mês anterior</p>
          <p className="mt-2 text-xl font-black text-white/75">{formatDashboardCurrency(monthlyEvolution.previousTotal)}</p>
          <p className="mt-1 text-[11px] text-white/40">{monthlyEvolution.previousCount} fechamentos no mês passado</p>
        </div>
        <div className="rounded-2xl border border-sky-400/15 bg-sky-400/[0.045] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-200/60">Ganhos futuros</p>
          <p className="mt-2 text-xl font-black text-sky-200">{formatDashboardCurrency(monthlyEvolution.futureTotal)}</p>
          <p className="mt-1 text-[11px] text-white/40">{monthlyEvolution.futureCount} serviços agendados</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">Diferença</p>
          <p className={`mt-2 text-xl font-black ${monthTrendIsPositive ? 'text-emerald-300' : 'text-red-300'}`}>
            {formatDashboardCurrency(Math.abs(monthDifference))}
          </p>
          <p className="mt-1 text-[11px] text-white/40">{monthTrendIsPositive ? 'acima do período anterior' : 'abaixo do período anterior'}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-white/55">
        <button
          type="button"
          onClick={() => onToggleSeries('atualDia')}
          aria-pressed={visibleMonthlySeries.atualDia}
          className={`inline-flex items-center gap-2 rounded-full transition hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/40 ${visibleMonthlySeries.atualDia ? 'text-white/55' : 'text-white/25'}`}
          title="Mostrar ou ocultar Valor do dia"
        >
          <span className="h-2 w-8 rounded-full bg-[#38bdf8] shadow-[0_0_18px_rgba(56,189,248,0.5)]" />
          Valor do dia
        </button>
        <button
          type="button"
          onClick={() => onToggleSeries('atual')}
          aria-pressed={visibleMonthlySeries.atual}
          className={`inline-flex items-center gap-2 rounded-full transition hover:text-white focus:outline-none focus:ring-2 focus:ring-[#f5d77a]/35 ${visibleMonthlySeries.atual ? 'text-white/55' : 'text-white/25'}`}
          title="Mostrar ou ocultar Mês atual acumulado"
        >
          <span className="h-2 w-8 rounded-full bg-[#f5d77a] shadow-[0_0_18px_rgba(245,215,122,0.45)]" />
          Mês atual acumulado
        </button>
        <button
          type="button"
          onClick={() => onToggleSeries('anterior')}
          aria-pressed={visibleMonthlySeries.anterior}
          className={`inline-flex items-center gap-2 rounded-full transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25 ${visibleMonthlySeries.anterior ? 'text-white/55' : 'text-white/25'}`}
          title="Mostrar ou ocultar Mês anterior diário"
        >
          <span className="h-0 w-8 border-t border-dashed border-white/35" />
          Mês anterior diário
        </button>
        <button
          type="button"
          onClick={() => onToggleSeries('anteriorAcumulado')}
          aria-pressed={visibleMonthlySeries.anteriorAcumulado}
          className={`inline-flex items-center gap-2 rounded-full transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/25 ${visibleMonthlySeries.anteriorAcumulado ? 'text-white/55' : 'text-white/25'}`}
          title="Mostrar ou ocultar Mês anterior acumulado"
        >
          <span className="h-0 w-8 border-t-2 border-dotted border-white/60" />
          Mês anterior acumulado
        </button>
        <button
          type="button"
          onClick={() => onToggleSeries('previsto')}
          aria-pressed={visibleMonthlySeries.previsto}
          className={`inline-flex items-center gap-2 rounded-full transition hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/40 ${visibleMonthlySeries.previsto ? 'text-white/55' : 'text-white/25'}`}
          title="Mostrar ou ocultar Ganhos previstos"
        >
          <span className="h-0 w-8 border-t-2 border-dashed border-sky-300" />
          Ganhos previstos
        </button>
      </div>

      {monthlyEvolution.currentTotal === 0 && monthlyEvolution.previousTotal === 0 && monthlyEvolution.futureTotal === 0 ? (
        <p className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] py-10 text-center text-xs text-white/30">
          Nenhum fechamento ou serviço futuro registrado nos períodos comparados
        </p>
      ) : (
        <div className="mt-3 h-[280px] rounded-2xl border border-white/5 bg-[#04080f]/35 px-2 py-4 sm:px-3">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cumulativeData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="currentMonthRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5d77a" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#f5d77a" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.45)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis
                tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.42)' }}
                tickFormatter={(value: number) => `R$${(value / 1000).toFixed(1)}k`}
                width={56}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ stroke: 'rgba(245,215,122,0.25)', strokeWidth: 1 }}
                content={({ active, payload, label }: { active?: boolean; payload?: MonthlyTooltipPayload[]; label?: string }) => {
                  const point = payload?.[0]?.payload;
                  if (!active || !point) return null;
                  return (
                    <div className="min-w-52 rounded-2xl border border-white/10 bg-[#07111d]/95 p-4 text-xs shadow-2xl shadow-black/30 backdrop-blur-xl">
                      <p className="font-bold uppercase tracking-[0.2em] text-white/40">Dia {label}</p>
                      <div className="mt-3 space-y-2">
                        {visibleMonthlySeries.atual && (
                          <div className="flex items-center justify-between gap-5">
                            <span className="text-[#f5d77a]">Atual acumulado</span>
                            <span className="font-bold text-white">{point.atual === null ? '--' : formatDashboardCurrency(point.atual)}</span>
                          </div>
                        )}
                        {visibleMonthlySeries.atualDia && (
                          <div className="flex items-center justify-between gap-5">
                            <span className="text-[#38bdf8]">Atual no dia</span>
                            <span className="font-bold text-white">{point.atualDia === null ? '--' : formatDashboardCurrency(point.atualDia)}</span>
                          </div>
                        )}
                        {visibleMonthlySeries.previsto && point.previsto !== null && (
                          <div className="border-t border-sky-300/15 pt-2">
                            <div className="flex items-center justify-between gap-5">
                              <span className="text-sky-200">Ganhos futuros</span>
                              <span className="font-bold text-white">{formatDashboardCurrency(point.previsto)}</span>
                            </div>
                          </div>
                        )}
                        {(visibleMonthlySeries.anterior || visibleMonthlySeries.anteriorAcumulado) && (
                          <div className="border-t border-white/10 pt-2">
                            {visibleMonthlySeries.anteriorAcumulado && (
                              <div className="flex items-center justify-between gap-5">
                                <span className="text-white/45">Anterior acumulado</span>
                                <span className="font-bold text-white/70">{point.anterior === null ? '--' : formatDashboardCurrency(point.anterior)}</span>
                              </div>
                            )}
                            {visibleMonthlySeries.anterior && (
                              <div className={`${visibleMonthlySeries.anteriorAcumulado ? 'mt-2' : ''} flex items-center justify-between gap-5`}>
                                <span className="text-white/35">Anterior em {point.diaAnterior}</span>
                                <span className="font-semibold text-white/55">{point.anteriorDia === null ? '--' : formatDashboardCurrency(point.anteriorDia)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }}
              />
              {visibleMonthlySeries.atual && <Area type="monotone" dataKey="atual" stroke="none" fill="url(#currentMonthRevenue)" />}
              {visibleMonthlySeries.anterior && <Line type="monotone" dataKey="anteriorDia" stroke="rgba(255,255,255,0.34)" strokeWidth={2} strokeDasharray="6 7" dot={false} activeDot={{ r: 4, fill: '#ffffff' }} />}
              {visibleMonthlySeries.anteriorAcumulado && <Line type="monotone" dataKey="anterior" stroke="rgba(255,255,255,0.58)" strokeWidth={2.4} strokeDasharray="2 5" dot={false} activeDot={{ r: 4, fill: '#ffffff' }} />}
              {visibleMonthlySeries.previsto && <Line type="monotone" dataKey="previsto" stroke="#7dd3fc" strokeWidth={3} strokeDasharray="5 7" dot={false} activeDot={{ r: 6, fill: '#7dd3fc', stroke: '#07111d', strokeWidth: 3 }} />}
              {visibleMonthlySeries.atual && <Line type="monotone" dataKey="atual" stroke="#f5d77a" strokeWidth={2} strokeOpacity={0.88} dot={false} activeDot={{ r: 5, fill: '#f5d77a', stroke: '#07111d', strokeWidth: 3 }} />}
              {visibleMonthlySeries.atualDia && <Line type="monotone" dataKey="atualDia" stroke="#38bdf8" strokeWidth={4} dot={false} activeDot={{ r: 7, fill: '#38bdf8', stroke: '#07111d', strokeWidth: 3 }} />}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
