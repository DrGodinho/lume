'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, DollarSign, Loader2, Sparkles, UserCheck, X } from 'lucide-react';
import type { Lead } from '../types';
import { parseBrazilianNumber } from '../utils/expenses';

export interface CompleteServiceModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    leadId: string,
    expenses: { custoAjudante: number; outrasDespesas: number; note: string }
  ) => Promise<void>;
  formatCurrencyBRL?: (val: number) => string;
}

export function CompleteServiceModal({
  lead,
  isOpen,
  onClose,
  onConfirm,
  formatCurrencyBRL = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(val),
}: CompleteServiceModalProps) {
  const [custoAjudante, setCustoAjudante] = useState<number>(0);
  const [outrasDespesas, setOutrasDespesas] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (lead && isOpen) {
      setCustoAjudante(lead.custoAjudante || 0);
      setOutrasDespesas(lead.outrasDespesas || 0);
      setNote('');
      setIsSubmitting(false);
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const valorServico = Math.max(0, lead.value || 0);
  const totalDespesas = custoAjudante + outrasDespesas;
  const lucroEstimado = Math.max(0, valorServico - totalDespesas);
  const margemPercentual = valorServico > 0 ? (lucroEstimado / valorServico) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirm(lead.id, {
        custoAjudante,
        outrasDespesas,
        note,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAjudante = (val: number) => {
    setCustoAjudante(val);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="complete-service-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-[#c9a227]/30 bg-[#07111d] p-6 text-white shadow-2xl shadow-black/80">
        {/* Glow dourado de topo */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a227]/80 to-transparent" />

        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-5 top-5 rounded-xl p-1.5 text-white/40 transition hover:bg-white/5 hover:text-white"
          aria-label="Fechar janela"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3.5 border-b border-white/5 pb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#f5d77a]">
                Check-in de Conclusão
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-300">
                Finalizar Obra
              </span>
            </div>
            <h3 id="complete-service-title" className="font-display text-lg font-bold tracking-tight text-white">
              Concluir Serviço e Fechar Venda
            </h3>
          </div>
        </div>

        {/* Card do Cliente e Serviço */}
        <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-bold text-white">{lead.name}</span>
            <span className="text-sm font-black text-[#f5d77a]">{formatCurrencyBRL(valorServico)}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/50">
            {lead.neighborhood && <span>{lead.neighborhood}</span>}
            {lead.neighborhood && lead.filmType && <span>•</span>}
            {lead.filmType && <span className="text-white/70">{lead.filmType}</span>}
            {lead.sqm > 0 && <span>• {lead.sqm} m²</span>}
          </div>
        </div>

        {/* Formulário de Custos */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Campo: Custo com Ajudante */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/80">
                <UserCheck className="h-3.5 w-3.5 text-[#c9a227]" />
                Gasto com Ajudante / Diária (R$)
              </label>
              <span className="text-[10px] text-white/40">Deixe 0 se fez sozinho</span>
            </div>

            {/* Quick Presets */}
            <div className="mb-2 flex flex-wrap gap-1.5">
              {[0, 100, 150, 200].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleQuickAjudante(preset)}
                  className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition ${
                    custoAjudante === preset
                      ? 'border border-[#c9a227]/60 bg-[#c9a227]/20 text-[#f5d77a] shadow-[0_0_8px_rgba(201,162,39,0.2)]'
                      : 'border border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {preset === 0 ? 'Sozinho (R$ 0)' : `R$ ${preset}`}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-white/40">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={custoAjudante || ''}
                onChange={(e) => setCustoAjudante(parseBrazilianNumber(e.target.value))}
                placeholder="0,00"
                className="w-full rounded-2xl border border-white/10 bg-[#04080f] py-2.5 pl-10 pr-4 text-sm font-semibold text-white placeholder:text-white/20 focus:border-[#c9a227]/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Campo: Outras Despesas / Extras */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/80">
                <DollarSign className="h-3.5 w-3.5 text-[#c9a227]" />
                Outras Despesas / Extras (R$)
              </label>
              <span className="text-[10px] text-white/40">Estacionamento, pedágio, etc.</span>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-white/40">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                value={outrasDespesas || ''}
                onChange={(e) => setOutrasDespesas(parseBrazilianNumber(e.target.value))}
                placeholder="0,00"
                className="w-full rounded-2xl border border-white/10 bg-[#04080f] py-2.5 pl-10 pr-4 text-sm font-semibold text-white placeholder:text-white/20 focus:border-[#c9a227]/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Campo: Observação / Relato de Conclusão */}
          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-white/80">
              Observação da Conclusão (Opcional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex: Instalação finalizada sem retrabalho, cliente satisfeito..."
              className="w-full rounded-2xl border border-white/10 bg-[#04080f] px-3.5 py-2.5 text-xs text-white placeholder:text-white/25 focus:border-[#c9a227]/50 focus:outline-none"
            />
          </div>

          {/* Box de Apuração do Lucro em Tempo Real */}
          <div className="rounded-2xl border border-[#c9a227]/25 bg-gradient-to-br from-[#c9a227]/10 via-transparent to-emerald-500/5 p-3.5">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>Valor Cobrado (Cliente):</span>
              <span className="font-semibold text-white">{formatCurrencyBRL(valorServico)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-white/70">
              <span>Despesas Totais Informadas:</span>
              <span className="font-semibold text-rose-300">
                {totalDespesas > 0 ? `- ${formatCurrencyBRL(totalDespesas)}` : 'R$ 0,00'}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#f5d77a]">
                <Sparkles className="h-3.5 w-3.5" />
                Resultado Operacional:
              </span>
              <div className="text-right">
                <span className="text-sm font-black text-emerald-400">{formatCurrencyBRL(lucroEstimado)}</span>
                {valorServico > 0 && (
                  <span className="ml-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    {margemPercentual.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-2xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-110 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Confirmar Conclusão
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
