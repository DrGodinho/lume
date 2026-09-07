'use client';

import { format, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { WeekActionDay } from '../hooks/useAgendaLists';

interface AgendaWeekStripProps {
  days: WeekActionDay[];
  diaSelecionado: Date | null;
  onHighlightDay: (day: Date) => void;
  onClearFilter: () => void;
  formatMoney: (value: number) => string;
}

/** Faixa "Capacidade diária": filtro por dia da semana (mobile em lista, desktop em grade). */
export function AgendaWeekStrip({ days, diaSelecionado, onHighlightDay, onClearFilter, formatMoney }: AgendaWeekStripProps) {
  return (
    <section>
      <div className="rounded-[2rem] border border-white/5 bg-[#07111d]/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35">Acoes da semana</p>
          <h3 className="mt-1 text-lg font-black text-white sm:text-xl">Capacidade diaria</h3>
        </div>
        {diaSelecionado && (
          <button
            onClick={onClearFilter}
            className="w-fit rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs font-semibold text-white/60 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
          >
            Limpar filtro
          </button>
        )}
      </div>

      <div className="mt-4 space-y-2 sm:hidden">
        {days.map(({ day, followUps, services, total, forecastValue }) => {
          const selected = diaSelecionado ? isSameDay(day, diaSelecionado) : false;

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onHighlightDay(day)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 text-left transition ${
                selected
                  ? 'border-[#c9a227]/50 bg-[#c9a227]/10 text-white'
                  : 'border-white/5 bg-white/[0.02] text-white/70'
              } ${isToday(day) ? 'ring-1 ring-[#f5d77a]/30' : ''}`}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">{format(day, 'EEE', { locale: ptBR })}</p>
                <p className={`mt-1 text-base font-black ${isToday(day) ? 'text-[#f5d77a]' : 'text-white'}`}>
                  {format(day, "d 'de' MMM", { locale: ptBR })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-white">{total} acoes</p>
                <p className="mt-0.5 text-[11px] text-white/45">{services} servicos · {followUps} retornos</p>
                <p className="mt-0.5 text-[11px] font-semibold text-[#f5d77a]">{formatMoney(forecastValue)}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 hidden grid-cols-7 gap-2 sm:grid">
        {days.map(({ day, followUps, services, total, forecastValue }) => {
          const selected = diaSelecionado ? isSameDay(day, diaSelecionado) : false;

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onHighlightDay(day)}
              className={`group rounded-2xl border p-2.5 text-left transition duration-300 ${
                selected
                  ? 'border-[#c9a227]/50 bg-[linear-gradient(180deg,rgba(201,162,39,0.16),rgba(201,162,39,0.06))] shadow-[0_0_0_1px_rgba(201,162,39,0.18)]'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]'
              } ${isToday(day) ? 'ring-1 ring-[#f5d77a]/35' : ''}`}
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">{format(day, 'EEE', { locale: ptBR })}</p>
              <p className={`mt-1.5 text-base font-black ${isToday(day) ? 'text-[#f5d77a]' : 'text-white'}`}>{format(day, 'd')}</p>
              <p className="mt-0.5 text-[10px] text-white/45">{total} itens</p>
              <p className="mt-0.5 truncate text-[10px] font-semibold text-[#f5d77a]">{formatMoney(forecastValue)}</p>
              <div className="mt-1.5 flex gap-1">
                <span className="h-1.5 flex-1 rounded-full bg-[#c9a227]/40" style={{ opacity: followUps > 0 ? 1 : 0.18 }} />
                <span className="h-1.5 flex-1 rounded-full bg-sky-400/50" style={{ opacity: services > 0 ? 1 : 0.18 }} />
              </div>
            </button>
          );
        })}
      </div>

      </div>
    </section>
  );
}
