'use client';

import { format, parseISO } from 'date-fns';
import { Archive, RefreshCw } from 'lucide-react';
import type { Lead } from '../types';

interface ArchiveLeadsViewProps {
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

export function ArchiveLeadsView({
  leads,
  loading,
  onRefresh,
  onRestore,
}: ArchiveLeadsViewProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-8 text-center text-white/45 flex items-center justify-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin text-[#c9a227]" />
        Carregando arquivo...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-[#c9a227]/10 p-3 text-[#f5d77a] shrink-0">
            <Archive className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5d77a]/75">LUME ELITE</p>
            <h3 className="mt-1 text-lg font-black text-white">Arquivo de Leads</h3>
            <p className="mt-2 text-sm text-white/45">Leads fechados antigos salvos para acompanhamento comercial.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void onRefresh()}
          className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 transition hover:border-[#c9a227]/40 hover:text-[#f5d77a]"
        >
          Atualizar
        </button>
      </div>

      <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg backdrop-blur-md">
        {leads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/35">
            Nenhum lead arquivado no momento.
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => {
              const serviceDate = parseAgendaDate(lead.dataServico || null);
              const formattedDate = serviceDate ? format(serviceDate, 'dd/MM/yyyy') : 'Sem data';

              return (
                <article
                  key={lead.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#04080f]/80 p-4 sm:flex-row sm:items-center sm:justify-between hover:border-[#c9a227]/20 transition duration-350"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white hover:text-[#f5d77a] transition">{lead.name}</p>
                    <p className="mt-1 text-xs text-white/40">
                      {lead.phone || 'Sem telefone'} · {lead.neighborhood || 'Sem bairro'} · {lead.filmType}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <span className="rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-2.5 py-1 text-[#f5d77a]">
                        Serviço executado em {formattedDate}
                      </span>
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-300">
                        R$ {lead.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => void onRestore(lead)}
                    className="rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#f5d77a] transition hover:bg-[#c9a227]/20"
                  >
                    Reativar Lead
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
