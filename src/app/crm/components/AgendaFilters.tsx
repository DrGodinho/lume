'use client';

import type { AgendaView } from '../types';

export interface AgendaFilterCounts {
  hoje: number;
  semana: number;
  parados: number;
  servicos: number;
  mes: number;
  ciclo5Anos: number;
}

interface AgendaFiltersProps {
  activeView: AgendaView;
  counts: AgendaFilterCounts;
  onSelect: (view: AgendaView) => void;
}

/** Trilhos da agenda (abas com contadores). O ciclo de 5 anos só aparece com leads. */
export function AgendaFilters({ activeView, counts, onSelect }: AgendaFiltersProps) {
  const summaryCards: Array<{
    view: AgendaView;
    label: string;
    count: number;
    description: string;
    activeClass: string;
    idleClass: string;
    labelClass: string;
  }> = [
    {
      view: 'hoje',
      label: 'Contatar hoje',
      count: counts.hoje,
      description: 'Atrasados e contatos do dia.',
      activeClass: 'border-red-400/45 bg-red-500/[0.12]',
      idleClass: 'border-red-500/20 bg-red-500/[0.055] hover:border-red-400/35 hover:bg-red-500/[0.08]',
      labelClass: 'text-red-300/80',
    },
    {
      view: 'semana',
      label: 'Proximos 7 dias',
      count: counts.semana,
      description: 'Retornos agendados para a semana.',
      activeClass: 'border-[#c9a227]/50 bg-[#c9a227]/15',
      idleClass: 'border-[#c9a227]/20 bg-[#c9a227]/5 hover:border-[#c9a227]/35 hover:bg-[#c9a227]/10',
      labelClass: 'text-[#f5d77a]',
    },
    {
      view: 'parados',
      label: 'Parados',
      count: counts.parados,
      description: 'Sem retorno agendado — o selo mostra o motivo.',
      activeClass: 'border-white/25 bg-white/[0.07]',
      idleClass: 'border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]',
      labelClass: 'text-white/38',
    },
    {
      view: 'servicos',
      label: 'Servicos',
      count: counts.servicos,
      description: 'Datas de servico marcadas.',
      activeClass: 'border-sky-400/45 bg-sky-500/[0.11]',
      idleClass: 'border-sky-500/15 bg-sky-500/[0.045] hover:border-sky-400/30 hover:bg-sky-500/[0.07]',
      labelClass: 'text-sky-300/85',
    },
    {
      view: 'mes',
      label: 'Mes',
      count: counts.mes,
      description: 'Retornos e servicos do mes.',
      activeClass: 'border-emerald-400/45 bg-emerald-500/[0.11]',
      idleClass: 'border-emerald-500/15 bg-emerald-500/[0.045] hover:border-emerald-400/30 hover:bg-emerald-500/[0.07]',
      labelClass: 'text-emerald-300/85',
    },
    {
      view: 'ciclo_5anos',
      label: 'Ciclo de 5 Anos',
      count: counts.ciclo5Anos,
      description: 'Instalacoes com 5 anos concluidos.',
      activeClass: 'border-[#c9a227]/50 bg-[#c9a227]/15',
      idleClass: 'border-[#c9a227]/20 bg-[#c9a227]/5 hover:border-[#c9a227]/35 hover:bg-[#c9a227]/10',
      labelClass: 'text-[#f5d77a]',
    },
  ];

  return (
    <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {summaryCards.filter((card) => card.view !== 'ciclo_5anos' || counts.ciclo5Anos > 0).map((card) => {
        const selected = activeView === card.view;

        return (
          <button
            key={card.view}
            type="button"
            onClick={() => onSelect(card.view)}
            aria-pressed={selected}
            className={`group flex min-h-[86px] w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 text-left shadow-md shadow-black/10 transition duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5d77a]/60 ${
              selected ? card.activeClass : card.idleClass
            }`}
          >
            <div className="min-w-0">
              <p className={`truncate text-[9px] font-black uppercase tracking-[0.22em] ${card.labelClass}`}>{card.label}</p>
              <p className="mt-1.5 line-clamp-2 text-[11px] font-semibold leading-snug text-white/45 group-hover:text-white/55">
                {card.description}
              </p>
            </div>
            <span className="shrink-0 text-2xl font-black leading-none text-white sm:text-3xl">{card.count}</span>
          </button>
        );
      })}
    </section>
  );
}
