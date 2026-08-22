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
  leads: 'Gestão de Leads',
  trash: 'Lixeira de Leads',
  archive: 'Arquivo de Leads',
  historico: 'Histórico Supabase',
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
      ? 'Sincronizando'
      : 'Sincronizado';
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
          title="Buscar um snapshot novo do Supabase e comparar com o que está na tela"
        >
          Sincronizar
        </button>
      </div>

      <div className="hidden">
        <span className="text-xs text-white/40">Status da Sessão:</span>
        <span
          title={[
            crmSync.message,
            crmSync.details,
            lastCloudCheckAt ? `Ultima conferencia: ${format(new Date(lastCloudCheckAt), 'HH:mm:ss')}` : '',
          ].filter(Boolean).join(' - ')}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
            crmSync.status === 'error'
              ? 'border-red-500/25 bg-red-500/10 text-red-300'
              : crmSync.status === 'warning'
                ? 'border-[#c9a227]/25 bg-[#c9a227]/10 text-[#f5d77a]'
                : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${
            crmSync.status === 'error'
              ? 'bg-red-400'
              : crmSync.status === 'warning'
                ? 'animate-pulse bg-[#f5d77a]'
                : 'bg-emerald-400'
          }`}
          />
          {crmSync.status === 'error' ? 'Erro' : crmSync.status === 'warning' ? (crmSync.message.includes('Salvando') || crmSync.message.includes('Excluindo') ? 'Salvando' : 'Sincronizando') : 'Salvo'}
        </span>
        <button
          type="button"
          onClick={onVerifyCloud}
          disabled={isVerifyingCloud}
          className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/70 transition hover:border-[#c9a227]/30 hover:text-[#f5d77a] disabled:cursor-not-allowed disabled:opacity-50"
          title="Buscar um snapshot novo do Supabase e comparar com o que esta na tela"
        >
          {isVerifyingCloud ? 'Conferindo...' : 'Verificar'}
        </button>
      </div>
    </header>
  );
}
