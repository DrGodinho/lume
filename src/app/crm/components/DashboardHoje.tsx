'use client';

import { Fragment, type ReactNode } from 'react';

interface DashboardHojeProps {
  overdue: number;
  today: number;
  servicesToday: number;
  onOpenAgenda: () => void;
  aside?: ReactNode;
}

/** Barra compacta do dia: contadores clicáveis + espaço para controle auxiliar (período). */
export function DashboardHoje({ overdue, today, servicesToday, onOpenAgenda, aside }: DashboardHojeProps) {
  const stats = [
    { key: 'atrasados', count: overdue, label: 'atrasados', countClass: 'text-red-300' },
    { key: 'hoje', count: today, label: 'hoje', countClass: 'text-white' },
    { key: 'servicos', count: servicesToday, label: 'serviços', countClass: 'text-sky-300' },
  ];

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#07111d]/50 px-3 py-2 shadow-lg shadow-black/20 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center">
        {stats.map((stat, index) => (
          <Fragment key={stat.key}>
            {index > 0 && <span aria-hidden="true" className="mx-1 h-6 w-px bg-white/10" />}
            <button
              type="button"
              onClick={onOpenAgenda}
              title="Abrir agenda de hoje"
              className="flex items-baseline gap-1.5 rounded-lg px-2 py-1 transition hover:bg-white/[0.04]"
            >
              <span className={`text-lg font-black leading-none ${stat.countClass}`}>{stat.count}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/45">{stat.label}</span>
            </button>
          </Fragment>
        ))}
      </div>
      {aside && <div className="flex flex-wrap items-center gap-1.5">{aside}</div>}
    </div>
  );
}
