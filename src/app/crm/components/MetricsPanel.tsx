'use client';

import { MonthlyChart } from './MonthlyChart';
import type { DashboardStats, Lead, MonthlyEvolutionData, MonthlyEvolutionSeries } from '../types';

interface MetricsPanelProps {
  leads: Lead[];
  stats: DashboardStats;
  monthlyEvolution: MonthlyEvolutionData;
  monthDifference: number;
  monthDifferencePercent: number;
  monthTrendIsPositive: boolean;
  visibleMonthlySeries: Record<MonthlyEvolutionSeries, boolean>;
  onToggleMonthlySeries: (series: MonthlyEvolutionSeries) => void;
  formatDashboardCurrency: (value: number) => string;
  formatCurrency: (value: number) => string;
  getLeadStatusClasses: (status: Lead['status']) => string;
  onOpenLead: (lead: Lead) => void;
  onOpenCreateModal: () => void;
  onOpenAgendaNoAction: () => void;
  onOpenAgendaToday: () => void;
  onOpenLeads: () => void;
  targetGoal: number;
  targetPercent: number;
  editingTarget: boolean;
  targetInput: string;
  setTargetInput: (value: string) => void;
  setEditingTarget: (value: boolean) => void;
  saveTargetGoal: (value: number) => Promise<void>;
}

export function MetricsPanel({
  leads,
  stats,
  monthlyEvolution,
  monthDifference,
  monthDifferencePercent,
  monthTrendIsPositive,
  visibleMonthlySeries,
  onToggleMonthlySeries,
  formatDashboardCurrency,
  formatCurrency,
  getLeadStatusClasses,
  onOpenLead,
  onOpenCreateModal,
  onOpenAgendaNoAction,
  onOpenAgendaToday,
  onOpenLeads,
  targetGoal,
  targetPercent,
  editingTarget,
  targetInput,
  setTargetInput,
  setEditingTarget,
  saveTargetGoal,
}: MetricsPanelProps) {
  return (
    <div className="space-y-8">
      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group rounded-xl border border-white/5 bg-[#07111d]/50 p-2.5 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#c9a227]/20">
          <div className="flex items-start justify-between">
            <span className="text-[9px] uppercase tracking-[0.14em] text-white/50">Serviços Futuros</span>
            <div className="rounded-md border border-white/5 bg-white/[0.02] p-1 text-[#c9a227] transition group-hover:border-[#c9a227]/30">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1 leading-none">
            <span className="text-lg font-black text-white">{stats.futureServices}</span>
            <span className="text-[9px] text-white/40">{stats.servicesToday} hoje</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAgendaNoAction}
          className="group rounded-xl border border-red-500/30 bg-[linear-gradient(135deg,rgba(239,68,68,0.18),rgba(127,29,29,0.10))] p-2.5 text-left shadow-lg shadow-red-950/20 transition-all duration-300 hover:border-red-400/40"
        >
          <div className="flex items-start justify-between">
            <span className="text-[9px] uppercase tracking-[0.14em] text-red-100/70">Alerta Comercial</span>
            <div className="rounded-md border border-red-200/10 bg-red-200/10 p-1 text-red-100 transition group-hover:border-red-200/20">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86 1.82 18a2.25 2.25 0 0 0 1.93 3.38h16.5A2.25 2.25 0 0 0 22.18 18L13.71 3.86a2.25 2.25 0 0 0-3.42 0Z" />
              </svg>
            </div>
          </div>
          <div className="mt-1 flex items-end justify-between gap-2 leading-none">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-white">{stats.staleNoAgenda}</span>
              <span className="text-[9px] text-red-50/75">sem agenda 3+ dias</span>
            </div>
            <span className="text-[9px] text-red-100/55">Abrir fila</span>
          </div>
        </button>

        <div className="group rounded-xl border border-white/5 bg-[#07111d]/50 p-2.5 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#c9a227]/20">
          <div className="flex items-start justify-between">
            <span className="text-[9px] uppercase tracking-[0.14em] text-white/50">Sem Próxima Ação</span>
            <div className="rounded-md border border-white/5 bg-white/[0.02] p-1 text-emerald-400 transition group-hover:border-[#c9a227]/30">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-1 flex items-baseline gap-1 leading-none">
            <span className="text-lg font-black text-white">{stats.noNextAction}</span>
            <span className="text-[9px] text-white/40">{stats.staleNoAgenda} há 3+ dias</span>
          </div>
        </div>

        <div className="group rounded-xl border border-white/5 bg-[#07111d]/50 p-2.5 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#c9a227]/20">
          <div className="flex items-start justify-between">
            <span className="text-[9px] uppercase tracking-[0.14em] text-white/50">Previsão por Serviço</span>
            <div className="rounded-md border border-white/5 bg-white/[0.02] p-1 text-[#c9a227] transition group-hover:border-[#c9a227]/30">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V5" />
              </svg>
            </div>
          </div>
          <div className="mt-1 flex flex-col leading-none">
            <span className="text-base font-black tracking-tight text-[#c9a227]">{formatDashboardCurrency(stats.servicePipelineValue)}</span>
            <span className="mt-1 text-[9px] text-white/45">{stats.responseRate}% taxa de resposta</span>
            <span className="mt-1 text-[9px] font-bold uppercase text-white/40">{stats.priorityRoute}</span>
          </div>
        </div>
      </section>

      <MonthlyChart
        monthlyEvolution={monthlyEvolution}
        monthDifference={monthDifference}
        monthDifferencePercent={monthDifferencePercent}
        monthTrendIsPositive={monthTrendIsPositive}
        visibleMonthlySeries={visibleMonthlySeries}
        onToggleSeries={onToggleMonthlySeries}
        formatDashboardCurrency={formatDashboardCurrency}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg backdrop-blur-md lg:col-span-2">
          <h3 className="mb-6 font-display text-base font-bold uppercase tracking-wider text-white">Distribuição Comercial do Funil</h3>

          <div className="space-y-4">
            {[
              { label: 'Novos Leads', stage: 'Novo', color: 'bg-blue-500' },
              { label: 'Em Atendimento', stage: 'Em Contato', color: 'bg-amber-500' },
              { label: 'Agendados', stage: 'Agendado', color: 'bg-sky-500' },
              { label: 'Contratos Fechados', stage: 'Fechado', color: 'bg-emerald-500' },
              { label: 'Perdidos / Descartados', stage: 'Perdido', color: 'bg-red-500' },
            ].map((item) => {
              const count = leads.filter((lead) => lead.status === item.stage).length;
              const percent = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
              return (
                <div key={item.stage} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white/60">{item.label}</span>
                    <span className="text-white">{count} ({percent}%)</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/5 p-0.5">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg backdrop-blur-md">
          <div>
            <h3 className="mb-1 font-display text-base font-bold uppercase tracking-wider text-white">Meta de Vendas</h3>
            <p className="text-xs text-white/50">Progresso do consultor LUME</p>
          </div>

          <div className="my-6 flex flex-col items-center">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="absolute left-0 top-0 h-full w-full -rotate-90">
                <circle cx="64" cy="64" r="54" className="stroke-white/5" strokeWidth="8" fill="transparent" />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  className="stroke-[#c9a227]"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 * (1 - targetPercent / 100)}
                />
              </svg>
              <div className="text-center">
                <span className="text-3xl font-black text-white">{targetPercent}%</span>
                <p className="text-[10px] font-semibold uppercase text-white/40">Metas</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-white/5 pt-4 text-xs font-semibold">
            <div className="flex justify-between">
              <span className="text-white/40">Faturamento Atual:</span>
              <span className="text-white">R$ {stats.revenue.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/40">Meta Estabelecida:</span>
              <span className="flex items-center gap-1.5 text-[#c9a227]">
                {editingTarget ? (
                  <input
                    type="number"
                    value={targetInput}
                    onChange={(event) => setTargetInput(event.target.value)}
                    onBlur={() => {
                      const value = parseInt(targetInput, 10);
                      if (value > 0) {
                        void saveTargetGoal(value);
                      } else {
                        setEditingTarget(false);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        const value = parseInt(targetInput, 10);
                        if (value > 0) {
                          void saveTargetGoal(value);
                        }
                      }
                      if (event.key === 'Escape') setEditingTarget(false);
                    }}
                    className="w-24 rounded-lg border border-[#c9a227]/40 bg-[#04080f] px-2 py-0.5 text-right text-xs text-white focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <>
                    R$ {targetGoal.toLocaleString('pt-BR')}
                    <button type="button" onClick={() => setEditingTarget(true)} className="text-white/30 transition hover:text-white/60" title="Editar meta">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-4 shadow-lg shadow-black/20 backdrop-blur-md sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5d77a]/75">Capacidade da semana</p>
            <h3 className="mt-1 text-base font-black text-white sm:text-lg">Serviços por dia e valor previsto</h3>
          </div>
          <p className="text-xs font-semibold text-white/55 sm:text-sm">{formatDashboardCurrency(stats.servicePipelineValue)} em serviços futuros</p>
        </div>

        <div className="mt-4 -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 sm:hidden">
          {stats.weeklyCapacity.map((day) => (
            <article
              key={`${day.day}-${day.label}-mobile`}
              className="min-w-[158px] snap-start rounded-2xl border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/35">{day.label}</p>
                  <p className="mt-1 text-xs font-semibold text-white/65">{day.day}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold text-white/55">
                  {day.count}x
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-2xl font-black leading-none text-white">{day.count}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35">serviços</p>
                </div>
                <p className="max-w-[88px] text-right text-[11px] font-bold leading-tight text-[#f5d77a]">
                  {formatDashboardCurrency(day.value)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 hidden gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-7">
          {stats.weeklyCapacity.map((day) => (
            <div key={`${day.day}-${day.label}`} className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">{day.label}</p>
              <p className="mt-1 text-sm font-semibold text-white/70">{day.day}</p>
              <p className="mt-3 text-2xl font-black text-white">{day.count}</p>
              <p className="mt-1 text-[11px] text-white/40">serviços</p>
              <p className="mt-2 text-xs font-bold text-[#f5d77a]">{formatDashboardCurrency(day.value)}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">Leads Recentes no Funil</h3>
            <p className="text-xs text-white/40">Últimos clientes adicionados ao LUME CRM</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={onOpenAgendaToday} className="text-xs font-bold text-red-300 hover:underline">
              Ir para a agenda →
            </button>
            <button type="button" onClick={onOpenLeads} className="text-xs font-bold text-[#c9a227] hover:underline">
              Ver todos os leads →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-white/80">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-white/40">
                <th className="pb-3 font-semibold">Cliente</th>
                <th className="pb-3 font-semibold">Bairro</th>
                <th className="pb-3 font-semibold">Película</th>
                <th className="pb-3 font-semibold">Valor</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.slice(0, 3).map((lead) => (
                <tr key={lead.id} className="cursor-pointer hover:bg-white/[0.01]" onClick={() => onOpenLead(lead)}>
                  <td className="py-3.5 font-semibold text-white">
                    <div className="flex flex-col">
                      <span className="border-b border-dotted border-white/20 transition hover:border-[#c9a227]/60">{lead.name}</span>
                      <span className="text-xs font-normal text-white/40">{lead.phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-white/70">{lead.neighborhood}</td>
                  <td className="py-3.5">
                    <span className="inline-flex rounded-lg border border-white/5 bg-white/[0.02] px-2 py-0.5 text-xs text-white/70">
                      {lead.filmType}
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-[#c9a227]">R$ {formatCurrency(lead.value)}</td>
                  <td className="py-3.5">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getLeadStatusClasses(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <p className="font-semibold text-white/40">Nenhum lead registrado no sistema.</p>
                      <button
                        type="button"
                        onClick={onOpenCreateModal}
                        className="rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f5d77a] transition hover:bg-[#c9a227]/15"
                      >
                        Criar primeiro lead
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
