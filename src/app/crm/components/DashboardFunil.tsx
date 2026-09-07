'use client';

import { LEAD_STAGE_DOT_COLORS, LEAD_STAGE_LABELS, LEAD_STAGES } from '../constants';
import type { Lead } from '../types';

interface DashboardFunilProps {
  leads: Lead[];
}

/** Distribuição de leads por etapa do funil. */
export function DashboardFunil({ leads }: DashboardFunilProps) {
  return (
    <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg backdrop-blur-md lg:col-span-2">
      <h3 className="mb-6 font-display text-base font-bold uppercase tracking-wider text-white">Distribuição Comercial do Funil</h3>

      <div className="space-y-4">
        {LEAD_STAGES.map((stage) => {
          const count = leads.filter((lead) => lead.status === stage).length;
          const percent = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
          return (
            <div key={stage} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white/60">{LEAD_STAGE_LABELS[stage]}</span>
                <span className="text-white">{count} ({percent}%)</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/5 p-0.5">
                <div className={`h-full rounded-full ${LEAD_STAGE_DOT_COLORS[stage]}`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
