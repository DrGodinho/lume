'use client';

import { differenceInDays, format, parseISO } from 'date-fns';
import type { Lead } from '../types';

interface TrashLeadsViewProps {
  leads: Lead[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onRestore: (lead: Lead) => Promise<void>;
}

const parseAgendaDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export function TrashLeadsView({
  leads,
  loading,
  onRefresh,
  onRestore,
}: TrashLeadsViewProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-8 text-center text-white/45">
        Carregando lixeira...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5d77a]/75">Recuperação em 30 dias</p>
          <h3 className="mt-1 text-lg font-black text-white">Lixeira de Leads</h3>
          <p className="mt-2 text-sm text-white/45">Leads excluídos ficam disponíveis para restauração por até 30 dias.</p>
        </div>
        <button
          type="button"
          onClick={() => void onRefresh()}
          className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 transition hover:border-white/20 hover:text-white"
        >
          Atualizar
        </button>
      </div>

      <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg backdrop-blur-md">
        {leads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/35">
            Nenhum lead na lixeira no período de recuperação.
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => {
              const deletedAt = parseAgendaDate(lead.deletedAt || null);
              const daysRemaining = deletedAt ? Math.max(0, 30 - differenceInDays(new Date(), deletedAt)) : 0;

              return (
                <article
                  key={lead.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#04080f]/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{lead.name}</p>
                    <p className="mt-1 text-xs text-white/40">{lead.phone || 'Sem telefone'} · {lead.neighborhood || 'Sem bairro'}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-red-300">
                        Excluído {deletedAt ? format(deletedAt, 'dd/MM/yyyy HH:mm') : 'recentemente'}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-white/50">
                        {daysRemaining} dia{daysRemaining === 1 ? '' : 's'} para recuperar
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void onRestore(lead)}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/15"
                  >
                    Restaurar
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
