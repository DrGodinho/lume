'use client';

import { format } from 'date-fns';
import { formatBRL } from '../utils';
import { getLeadStatusClasses } from '../hooks/useAgenda';
import type { Lead } from '../types';

interface LeadListItemProps {
  lead: Lead;
  getLeadServiceDate: (lead: Lead) => Date | null;
  daysInStatus: (lead: Lead) => number;
  onOpenDetail: (lead: Lead) => void;
  onOpenEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

/** Card de lead para listas mobile (visão tabela no celular). */
export function LeadListItem({
  lead,
  getLeadServiceDate,
  daysInStatus,
  onOpenDetail,
  onOpenEdit,
  onDelete,
}: LeadListItemProps) {
  return (
    <article className="rounded-2xl border border-white/5 bg-[#04080f]/85 p-4">
      <button type="button" onClick={() => onOpenDetail(lead)} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-white">{lead.name}</h3>
            <p className="mt-1 text-xs text-white/40">{lead.phone || 'Sem telefone'}</p>
          </div>
          <span className="shrink-0 text-sm font-black text-[#c9a227]">{formatBRL(lead.value)}</span>
        </div>
      </button>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-white/60">{lead.neighborhood}</span>
        <span className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-white/60">{lead.filmType}</span>
        {getLeadServiceDate(lead) && (
          <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 font-semibold text-sky-300">
            Serviço {format(getLeadServiceDate(lead)!, 'dd/MM')}
          </span>
        )}
        <span className={`rounded-full border px-2.5 py-1 font-bold uppercase tracking-wider ${getLeadStatusClasses(lead.status)}`}>{lead.status}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <span className="text-xs text-white/40">{lead.sqm.toFixed(2)}m² · {daysInStatus(lead)}d no status</span>
        <div className="flex gap-3">
          <button type="button" onClick={() => onOpenEdit(lead)} className="text-xs font-semibold text-white/60 hover:text-white">Editar</button>
          <button type="button" onClick={() => onDelete(lead.id)} className="text-xs font-semibold text-red-300/70 hover:text-red-300">Excluir</button>
        </div>
      </div>
    </article>
  );
}
