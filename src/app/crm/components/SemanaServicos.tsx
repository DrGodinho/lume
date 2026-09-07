'use client';

import type { DashboardStats } from '../types';

interface SemanaServicosProps {
  weeklyCapacity: DashboardStats['weeklyCapacity'];
  pipelineValue: number;
  formatMoney: (value: number) => string;
}

/** Serviços da semana: um `map` só. No celular vira carrossel com snap;
 * no desktop, grade de 7 colunas — mesmo card nos dois. */
export function SemanaServicos({ weeklyCapacity, pipelineValue, formatMoney }: SemanaServicosProps) {
  return (
    <section className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-4 shadow-lg shadow-black/20 backdrop-blur-md sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5d77a]/75">Capacidade da semana</p>
          <h3 className="mt-1 text-base font-black text-white sm:text-lg">Serviços por dia e valor previsto</h3>
        </div>
        <p className="text-xs font-semibold text-white/55 sm:text-sm">{formatMoney(pipelineValue)} em serviços futuros</p>
      </div>

      <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-7">
        {weeklyCapacity.map((day) => (
          <div
            key={`${day.day}-${day.label}`}
            className="min-w-[158px] snap-start rounded-2xl border border-white/5 bg-white/[0.025] p-4 sm:min-w-0"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">{day.label}</p>
            <p className="mt-1 text-sm font-semibold text-white/70">{day.day}</p>
            <p className="mt-3 text-2xl font-black text-white">{day.count}</p>
            <p className="mt-1 text-[11px] text-white/40">serviços</p>
            <p className="mt-2 text-xs font-bold text-[#f5d77a]">{formatMoney(day.value)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
