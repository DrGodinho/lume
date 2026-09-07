'use client';

import { useMemo } from 'react';
import { LeadTable } from './LeadTable';
import type { Lead } from '../types';

interface DashboardProntosProps {
  leads: Lead[];
  onOpenLead: (lead: Lead) => void;
  onOpenLeads: () => void;
  onOpenCreateModal: () => void;
}

/** Agendados de maior valor — o que está mais perto de fechar. */
export function DashboardProntos({ leads, onOpenLead, onOpenLeads, onOpenCreateModal }: DashboardProntosProps) {
  const prontos = useMemo(
    () => leads.filter((lead) => lead.status === 'Agendado').sort((a, b) => b.value - a.value).slice(0, 3),
    [leads],
  );

  return (
    <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">Prontos para fechar</h3>
          <p className="text-xs text-white/40">Agendados de maior valor</p>
        </div>
        <button type="button" onClick={onOpenLeads} className="text-xs font-bold text-[#c9a227] hover:underline">
          Ver todos os leads →
        </button>
      </div>

      <div className="overflow-x-auto">
        <LeadTable
          compact
          leads={prontos}
          emptyMessage={leads.length === 0 ? 'Nenhum lead registrado no sistema.' : 'Nenhum lead agendado no momento.'}
          emptyActionLabel={leads.length === 0 ? 'Criar primeiro lead' : 'Ver todos os leads'}
          onEmptyAction={leads.length === 0 ? onOpenCreateModal : onOpenLeads}
          onOpenLead={onOpenLead}
        />
      </div>
    </div>
  );
}
