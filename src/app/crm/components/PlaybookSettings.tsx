'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, RotateCcw, SlidersHorizontal, UserRound } from 'lucide-react';
import type { FollowUpPlaybookRule, SellerPlaybook } from '../types';

interface PlaybookSettingsProps {
  activeSellerId: string;
  activePlaybook: SellerPlaybook;
  sellerIds: string[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  onChangeSeller: (sellerId: string) => void;
  onUpdateRule: (ruleId: string, patch: Partial<FollowUpPlaybookRule>) => void;
  onResetPlaybook: () => void;
  onReload: () => Promise<void>;
}

const statusLabels: Record<FollowUpPlaybookRule['triggerStatus'], string> = {
  Novo: 'Lead novo',
  'Em Contato': 'Em contato',
  Agendado: 'Agendado',
  Fechado: 'Fechado',
  Perdido: 'Perdido',
};

export function PlaybookSettings({
  activeSellerId,
  activePlaybook,
  sellerIds,
  loading,
  saving,
  error,
  onChangeSeller,
  onUpdateRule,
  onResetPlaybook,
  onReload,
}: PlaybookSettingsProps) {
  const [sellerInput, setSellerInput] = useState(activeSellerId);

  useEffect(() => {
    setSellerInput(activeSellerId);
  }, [activeSellerId]);

  const commitSellerInput = () => {
    onChangeSeller(sellerInput);
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(180deg,#0a1320_0%,#050a11_100%)] p-5 shadow-2xl shadow-black/25 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#f5d77a]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Automacoes
          </span>
          <h3 className="mt-3 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
            Configuracoes do CRM
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/52">
            Playbooks definem a proxima acao automaticamente quando um lead entra em um status. Alterar uma regra vale apenas para novos leads e futuras mudancas de status.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void onReload()}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-black uppercase tracking-[0.16em] text-white/65 transition hover:border-[#c9a227]/30 hover:bg-[#c9a227]/10 hover:text-[#f5d77a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            title="Recarregar playbooks do Supabase"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Recarregar
          </button>
          <button
            type="button"
            onClick={onResetPlaybook}
            disabled={saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-black uppercase tracking-[0.16em] text-white/65 transition hover:border-[#c9a227]/30 hover:bg-[#c9a227]/10 hover:text-[#f5d77a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            title="Restaurar o playbook padrao deste vendedor"
          >
            <RotateCcw className="h-4 w-4" />
            Padrao
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
          error
            ? 'border-red-500/25 bg-red-500/10 text-red-300'
            : saving
              ? 'border-[#c9a227]/25 bg-[#c9a227]/10 text-[#f5d77a]'
              : loading
                ? 'border-white/10 bg-white/[0.04] text-white/45'
                : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
        }`}
        >
          {error ? 'Erro no Supabase' : saving ? 'Salvando' : loading ? 'Carregando' : 'Sincronizado'}
        </span>
        {error && <p className="text-xs leading-relaxed text-red-200/80">{error}</p>}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(220px,0.75fr)_minmax(0,1.4fr)]">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
          <label className="text-[10px] font-black uppercase tracking-[0.18em] text-white/38" htmlFor="crm-seller-playbook">
            Vendedor
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-[#03060b] px-3 py-2">
            <UserRound className="h-4 w-4 text-[#f5d77a]" />
            <input
              id="crm-seller-playbook"
              value={sellerInput}
              onChange={(event) => setSellerInput(event.target.value)}
              onBlur={commitSellerInput}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  commitSellerInput();
                }
              }}
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/25"
              placeholder="equipe-lume"
            />
          </div>

          {sellerIds.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {sellerIds.map((sellerId) => (
                <button
                  key={sellerId}
                  type="button"
                  onClick={() => onChangeSeller(sellerId)}
                  className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] transition ${
                    sellerId === activeSellerId
                      ? 'border-[#c9a227]/40 bg-[#c9a227]/15 text-[#f5d77a]'
                      : 'border-white/10 text-white/45 hover:border-white/20 hover:text-white/75'
                  }`}
                >
                  {sellerId}
                </button>
              ))}
            </div>
          )}

          <p className="mt-4 text-xs leading-relaxed text-white/42">
            Use nomes simples, como `joao`, `maria` ou `equipe-lume`. Cada vendedor guarda um conjunto proprio de regras no Supabase, compartilhado entre celular e PC.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <div className="grid grid-cols-[1fr_92px_82px] gap-2 border-b border-white/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
            <span>Status</span>
            <span className="text-center">D+n</span>
            <span className="text-right">Ativo</span>
          </div>

          <div className="divide-y divide-white/[0.08]">
            {activePlaybook.rules.map((rule) => (
              <div key={rule.id} className="grid grid-cols-[1fr_92px_82px] items-center gap-2 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-white">{statusLabels[rule.triggerStatus]}</p>
                  <p className="mt-0.5 text-xs text-white/38">Agenda follow-up quando virar {rule.triggerStatus}</p>
                </div>

                <input
                  type="number"
                  min={0}
                  max={60}
                  value={rule.scheduleOffsetDays}
                  onChange={(event) => onUpdateRule(rule.id, { scheduleOffsetDays: Number(event.target.value) })}
                  className="h-9 rounded-lg border border-white/10 bg-[#03060b] px-2 text-center text-sm font-black text-white outline-none transition focus:border-[#c9a227]/40"
                  aria-label={`Dias ate o follow-up para ${rule.triggerStatus}`}
                />

                <label className="flex justify-end" title={`Ativar playbook para ${rule.triggerStatus}`}>
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(event) => onUpdateRule(rule.id, { enabled: event.target.checked })}
                    className="peer sr-only"
                  />
                  <span className="flex h-7 w-12 items-center rounded-full border border-white/10 bg-white/10 p-1 transition peer-checked:border-[#c9a227]/40 peer-checked:bg-[#c9a227]/20">
                    <span className={`h-5 w-5 rounded-full transition ${rule.enabled ? 'translate-x-5 bg-[#f5d77a]' : 'bg-white/45'}`} />
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
