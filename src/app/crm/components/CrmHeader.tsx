'use client';

import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { CheckCircle2, RefreshCw, XCircle } from 'lucide-react';
import type { CrmSyncState, CrmTab } from '../types';

interface CrmHeaderProps {
  activeTab: CrmTab;
  crmSync: CrmSyncState;
  lastCloudCheckAt: string | null;
  isVerifyingCloud: boolean;
  onVerifyCloud: () => void;
}

const TAB_TITLES: Record<CrmTab, string> = {
  dashboard: 'Painel Geral',
  leads: 'Leads',
  trash: 'Lixeira de Leads',
  archive: 'Arquivo de Leads',
  historico: 'Orçamentos',
  extratos: 'Extratos Mensais',
  agenda: 'Agenda & Follow-up',
  settings: 'Configuracoes do CRM',
};

function formatRelativeSync(iso: string | null, now: number): string {
  if (!iso) return 'ainda nao';
  const diffMs = now - new Date(iso).getTime();
  if (diffMs < 0) return 'agora';
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.floor(hours / 24);
  return `há ${days} d`;
}

export function CrmHeader({ activeTab, crmSync, lastCloudCheckAt, isVerifyingCloud, onVerifyCloud }: CrmHeaderProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(interval);
  }, []);

  const syncTone = crmSync.status === 'error' ? 'error' : crmSync.status === 'warning' ? 'warning' : 'ok';
  const syncStatusLabel = syncTone === 'error'
    ? 'Erro'
    : syncTone === 'warning'
      ? 'Atualizando'
      : 'Atualizado';
  const lastSyncRelative = formatRelativeSync(lastCloudCheckAt, now);
  const lastCloudCheckLabel = lastCloudCheckAt
    ? format(new Date(lastCloudCheckAt), 'HH:mm')
    : '--:--';
  const SyncIcon = syncTone === 'error' ? XCircle : syncTone === 'warning' ? RefreshCw : CheckCircle2;
  const syncClasses = {
    error: {
      panel: 'border-red-500/25 bg-red-500/10',
      icon: 'bg-red-500/15 text-red-300',
      dot: 'bg-red-400',
      text: 'text-red-200',
      button: 'border-red-400/25 text-red-200 hover:bg-red-500/10',
    },
    warning: {
      panel: 'border-[#c9a227]/25 bg-[#c9a227]/10',
      icon: 'bg-[#c9a227]/15 text-[#f5d77a]',
      dot: 'animate-pulse bg-[#f5d77a]',
      text: 'text-[#f5d77a]',
      button: 'border-[#c9a227]/30 text-[#f5d77a] hover:bg-[#c9a227]/10',
    },
    ok: {
      panel: 'border-emerald-500/20 bg-emerald-500/10',
      icon: 'bg-emerald-500/15 text-emerald-300',
      dot: 'bg-emerald-400',
      text: 'text-emerald-300',
      button: 'border-emerald-400/25 text-emerald-200 hover:bg-emerald-500/10',
    },
  }[syncTone];

  return (
    <header className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between lg:mb-6">
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c9a227] sm:text-xs sm:tracking-[0.35em]">LUME Elite</span>
        <h2 className="mt-1 font-display text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
          {TAB_TITLES[activeTab]}
        </h2>
      </div>

      <div className={`flex w-full flex-col gap-2 rounded-xl border p-2 sm:w-auto sm:min-w-0 sm:flex-row sm:items-center ${syncClasses.panel}`}>
        <div className="flex items-center gap-2.5">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${syncClasses.icon}`}>
            <SyncIcon className={`h-4 w-4 ${isVerifyingCloud ? 'animate-spin' : ''}`} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className={`h-1.5 w-1.5 rounded-full ${syncClasses.dot}`} />
              <p className={`truncate text-[11px] font-black uppercase tracking-[0.14em] ${syncClasses.text}`}>
                {syncStatusLabel}
                {syncTone === 'ok' && (
                  <span className="ml-1 font-normal normal-case tracking-normal text-white/55">
                    {lastSyncRelative}
                  </span>
                )}
              </p>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/38" title={lastCloudCheckAt ? `Ultima conferencia: ${lastCloudCheckLabel}` : 'Sem conferencia registrada'}>
                {lastCloudCheckLabel}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onVerifyCloud}
          disabled={isVerifyingCloud}
          className={`inline-flex h-6 items-center justify-center self-start rounded-md border px-2 text-[9px] font-black uppercase tracking-[0.12em] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto ${syncClasses.button}`}
          title="Buscar os dados mais recentes do Supabase e comparar com o que está na tela"
        >
          {isVerifyingCloud ? 'Atualizando...' : 'Atualizar agora'}
        </button>
      </div>
    </header>
  );
}
