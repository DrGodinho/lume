'use client';

import { format, isSameDay, isSameMonth, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { MonthActionDay } from '../hooks/useAgendaLists';

interface AgendaMonthCalendarProps {
  days: MonthActionDay[];
  mesVisivel: Date;
  diaSelecionado: Date | null;
  onHighlightDay: (day: Date) => void;
  onClearDay: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToday: () => void;
  filteredFollowUps: number;
  filteredServices: number;
  selectedDayLabel: string;
  formatMoney: (value: number) => string;
}

/** Calendário mensal da agenda (navegação + filtro por dia). */
export function AgendaMonthCalendar({
  days,
  mesVisivel,
  diaSelecionado,
  onHighlightDay,
  onClearDay,
  onPrevMonth,
  onNextMonth,
  onGoToday,
  filteredFollowUps,
  filteredServices,
  selectedDayLabel,
  formatMoney,
}: AgendaMonthCalendarProps) {
  return (
    <section>
      <div className="rounded-[2rem] border border-white/5 bg-[#07111d]/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35">Calendario mensal</p>
            <h3 className="mt-1 text-lg font-black text-white sm:text-xl">{format(mesVisivel, "MMMM 'de' yyyy", { locale: ptBR })}</h3>
            <p className="mt-2 text-sm text-white/55">Azul marca retornos comerciais. Verde destaca servicos agendados. Clique no dia para filtrar os cards.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/65">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
              Retornos
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Servicos
            </div>
            {diaSelecionado && (
              <button
                onClick={onClearDay}
                className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-semibold text-white/60 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              >
                Limpar dia
              </button>
            )}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] p-1">
              <button
                type="button"
                onClick={onPrevMonth}
                className="rounded-full px-3 py-2 text-sm font-bold text-white/70 transition hover:bg-white/[0.05] hover:text-white"
                aria-label="Mes anterior"
              >
                ←
              </button>
              <button
                type="button"
                onClick={onGoToday}
                className="rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f5d77a] transition hover:bg-[#c9a227]/10"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={onNextMonth}
                className="rounded-full px-3 py-2 text-sm font-bold text-white/70 transition hover:bg-white/[0.05] hover:text-white"
                aria-label="Proximo mes"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-2 text-center">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((label) => (
            <div key={label} className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-white/30">
              {label}
            </div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-2">
          {days.map(({ day, followUps, services, total, forecastValue }) => {
            const selected = diaSelecionado ? isSameDay(day, diaSelecionado) : false;
            const inCurrentMonth = isSameMonth(day, mesVisivel);
            const hasItems = total > 0;

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => onHighlightDay(day)}
                className={`min-h-[92px] rounded-2xl border p-2.5 text-left transition duration-300 ${
                  selected
                    ? 'border-[#c9a227]/50 bg-[linear-gradient(180deg,rgba(201,162,39,0.18),rgba(201,162,39,0.06))] shadow-[0_0_0_1px_rgba(201,162,39,0.18)]'
                    : hasItems
                      ? 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                      : 'border-white/5 bg-white/[0.015] hover:border-white/10'
                } ${isToday(day) ? 'ring-1 ring-[#f5d77a]/35' : ''} ${inCurrentMonth ? 'text-white' : 'text-white/28'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-black ${isToday(day) && inCurrentMonth ? 'text-[#f5d77a]' : ''}`}>{format(day, 'd')}</p>
                  {total > 0 && (
                    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-white/70">
                      {total}
                    </span>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 flex-1 rounded-full bg-sky-400/85" style={{ opacity: followUps > 0 ? 1 : 0.14 }} />
                    <span className="h-2.5 flex-1 rounded-full bg-emerald-400/85" style={{ opacity: services > 0 ? 1 : 0.14 }} />
                  </div>
                  <div className="space-y-1 text-[10px]">
                    <p className="text-sky-200/80">{followUps} retornos</p>
                    <p className="text-emerald-200/80">{services} servicos</p>
                    <p className="truncate font-semibold text-[#f5d77a]/85">{forecastValue > 0 ? formatMoney(forecastValue) : 'Sem valor'}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
          {diaSelecionado ? (
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
              <p>Exibindo <span className="font-semibold text-white">{selectedDayLabel}</span> dentro de {format(mesVisivel, "MMMM 'de' yyyy", { locale: ptBR })}.</p>
              <p className="text-white/40">{filteredFollowUps} retornos e {filteredServices} servicos neste filtro.</p>
            </div>
          ) : (
            <p>Sem dia selecionado, os cards abaixo mostram todo o volume do mes.</p>
          )}
        </div>
      </div>
    </section>
  );
}
