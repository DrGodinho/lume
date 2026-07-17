'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { roundCurrency, roundMeasure } from '@/lib/numberPrecision';
import { getHistoryFilmLabel } from '../utils';
import type { CalculatorHistoryRow, CreateLeadModalOptions, CrmTab, Lead } from '../types';

const HISTORY_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

interface HistoricoSupabaseProps {
  setActiveTab: (tab: CrmTab) => void;
  openCreateModal: (options?: CreateLeadModalOptions) => void;
}

export function HistoricoSupabase({ setActiveTab, openCreateModal }: HistoricoSupabaseProps) {
  const [history, setHistory] = useState<CalculatorHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrcamento, setSelectedOrcamento] = useState<CalculatorHistoryRow | null>(null);

  const fetchData = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    if (silent) setRefreshing(true);
    try {
      const { data } = await supabase.from('calculator_history').select('*').order('created_at', { ascending: false }).limit(100);

      if (data) setHistory(data as CalculatorHistoryRow[]);
      setLastSyncedAt(new Date());
    } finally {
      setLoading(false);
      if (silent) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();

    const intervalId = window.setInterval(() => {
      void fetchData({ silent: true });
    }, HISTORY_REFRESH_INTERVAL_MS);

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') {
        void fetchData({ silent: true });
      }
    };

    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [fetchData]);

  const pendingHistory = useMemo(() => history.filter((item) => !item.lead_id), [history]);

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return pendingHistory;
    const query = searchQuery.toLowerCase();
    return pendingHistory.filter((item) =>
      (item.cliente || '').toLowerCase().includes(query) ||
      getHistoryFilmLabel(item).toLowerCase().includes(query),
    );
  }, [pendingHistory, searchQuery]);

  const stats = useMemo(() => {
    const total = pendingHistory.length;
    const totalValue = pendingHistory.reduce((sum, item) => sum + (item.valor || 0), 0);
    const avgValue = total > 0 ? totalValue / total : 0;
    return { total, totalValue, avgValue };
  }, [pendingHistory]);

  const exportToCSV = useCallback(() => {
    const headers = ['Cliente', 'Película', 'Valor', 'Qtd Vidros', 'Data'];
    const rows = filteredHistory.map((item) => [
      item.cliente || '',
      getHistoryFilmLabel(item),
      item.valor || 0,
      item.qtd || 0,
      item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '',
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historico_lume_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredHistory]);

  const deleteOrcamento = useCallback(async (id: string) => {
    if (!confirm('Excluir este orçamento do histórico?')) return;
    if (!supabase) return;

    const { error } = await supabase.from('calculator_history').delete().eq('id', id);
    if (!error) {
      setHistory((current) => current.filter((item) => item.id !== id));
    }
  }, []);

  const convertToLead = useCallback((orcamento: CalculatorHistoryRow) => {
    if (orcamento.lead_id) return;

    const totalM2 = roundMeasure((orcamento.vidros?.reduce((sum, vidro) => sum + (vidro.h || 0) * (vidro.w || 0), 0) || 0) / 10000);
    const prefill: Omit<Lead, 'id' | 'createdAt'> = {
      name: orcamento.cliente || 'Cliente do Histórico',
      phone: orcamento.phone || '',
      email: '',
      address: '',
      neighborhood: 'Barra da Tijuca',
      filmType: getHistoryFilmLabel(orcamento),
      sqm: totalM2,
      value: roundCurrency(orcamento.valor),
      status: 'Novo',
      statusChangedAt: new Date().toISOString().split('T')[0],
      dataServico: null,
      serviceStatus: null,
      proximoContato: null,
      dormant: false,
      notes: `Orçamento convertido do Supabase (ID: ${orcamento.id}).\nPelícula: ${getHistoryFilmLabel(orcamento)}.\nVidros: ${orcamento.qtd}.`,
    };
    setActiveTab('leads');
    openCreateModal({ prefill, sourceCalculatorHistoryId: orcamento.id });
  }, [openCreateModal, setActiveTab]);

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#c9a227]" />
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 text-center">
        <p className="font-semibold text-red-400">Supabase não configurado</p>
        <p className="mt-2 text-sm text-white/50">Adicione as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg backdrop-blur-md sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-3.5 h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por cliente ou película..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-2xl border border-white/5 bg-white/[0.02] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-[#c9a227]/40 focus:outline-none"
          />
        </div>
        <button
          onClick={() => void fetchData({ silent: true })}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-3 text-sm font-bold text-white/60 transition hover:border-[#c9a227]/30 hover:text-[#c9a227] disabled:cursor-wait disabled:opacity-60"
        >
          <svg className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-3M19 5A9 9 0 005 8" />
          </svg>
          {refreshing ? 'Atualizando' : 'Atualizar'}
        </button>
        <button
          onClick={exportToCSV}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c9a227] to-[#d4ad30] px-6 py-3 text-sm font-bold text-[#04080f] shadow-lg shadow-[#c9a227]/10 transition hover:brightness-110"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar CSV
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-[#07111d]/50 p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Total de Orçamentos</span>
          <p className="mt-1 text-xl font-black text-white">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#07111d]/50 p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Valor Total</span>
          <p className="mt-1 text-lg font-black text-[#c9a227]">{formatCurrency(stats.totalValue)}</p>
        </div>
      </div>

      {lastSyncedAt && (
        <p className="text-right text-[10px] font-semibold uppercase tracking-wider text-white/35">
          Atualizado às {lastSyncedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}

      <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg backdrop-blur-md">
        <table className="w-full border-collapse text-left text-sm text-white/80">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-widest text-white/40">
              <th className="pb-3 font-semibold">Cliente</th>
              <th className="pb-3 font-semibold">Película</th>
              <th className="pb-3 text-right font-semibold">Valor</th>
              <th className="pb-3 text-center font-semibold">Qtd</th>
              <th className="pb-3 font-semibold">Data</th>
              <th className="pb-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center font-semibold text-white/30">
                  {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhum orçamento no histórico'}
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => (
                <tr key={item.id} className="cursor-pointer hover:bg-white/[0.01]" onClick={() => setSelectedOrcamento(item)}>
                  <td className="group py-3.5 font-semibold text-white">
                    <span className="border-b border-dotted border-white/20 transition hover:border-[#c9a227]/60">{item.cliente || '—'}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-0.5 text-xs text-white/70">
                      {getHistoryFilmLabel(item)}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-bold text-[#c9a227]">{formatCurrency(item.valor || 0)}</td>
                  <td className="py-3.5 text-center font-mono">{item.qtd || 0}</td>
                  <td className="py-3.5 text-white/50">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={(event) => {
                        event.stopPropagation();
                        setSelectedOrcamento(item);
                      }} className="text-white/40 hover:text-white" title="Ver detalhes">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          convertToLead(item);
                        }}
                        disabled={!!item.lead_id}
                        className="text-[#c9a227]/60 hover:text-[#c9a227] disabled:cursor-not-allowed disabled:text-emerald-300/45"
                        title={item.lead_id ? 'Já vinculado a um lead' : 'Converter em Lead'}
                      >
                        {item.lead_id ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>
                      <button type="button" onClick={(event) => {
                        event.stopPropagation();
                        void deleteOrcamento(item.id);
                      }} className="text-white/30 hover:text-red-400" title="Excluir">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrcamento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setSelectedOrcamento(null)}>
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-[#07111d] p-5 text-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-black tracking-tight text-white">
                {selectedOrcamento.cliente || 'Orçamento'}
              </h3>
              <button onClick={() => setSelectedOrcamento(null)} className="text-white/40 hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Película</span>
                <span className="text-sm font-bold text-white">{getHistoryFilmLabel(selectedOrcamento)}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Valor Total</span>
                <span className="text-lg font-black text-[#c9a227]">{formatCurrency(selectedOrcamento.valor || 0)}</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Quantidade</span>
                <span className="text-sm font-bold text-white">{selectedOrcamento.qtd || 0} vidros</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Data</span>
                <span className="text-sm font-bold text-white">
                  {selectedOrcamento.created_at ? new Date(selectedOrcamento.created_at).toLocaleDateString('pt-BR') : '—'}
                </span>
              </div>
              <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/50">Vínculo com Lead</span>
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  selectedOrcamento.lead_id
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/10 bg-white/[0.03] text-white/45'
                }`}>
                  {selectedOrcamento.lead_id ? 'Lead vinculado' : 'Sem vínculo'}
                </span>
              </div>
            </div>

            {selectedOrcamento.vidros && selectedOrcamento.vidros.length > 0 && (
              <div className="mt-3">
                <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/50">Vidros</h4>
                <div className="max-h-36 space-y-1 overflow-y-auto">
                  {selectedOrcamento.vidros.map((vidro, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-sm">
                      <span className="text-white/70">{vidro.label || `Vidro ${index + 1}`}</span>
                      <span className="font-mono text-xs text-white">{vidro.h || 0} x {vidro.w || 0} cm</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-3 border-t border-white/5 pt-3">
              <button onClick={() => setSelectedOrcamento(null)} className="flex-1 rounded-xl border border-white/5 bg-white/[0.01] py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/5">
                Fechar
              </button>
              <button
                onClick={() => {
                  const orc = selectedOrcamento;
                  setSelectedOrcamento(null);
                  convertToLead(orc);
                }}
                disabled={!!selectedOrcamento.lead_id}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#d4ad30] py-2.5 text-sm font-bold text-[#04080f] shadow-lg shadow-[#c9a227]/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {selectedOrcamento.lead_id ? 'Lead já vinculado' : 'Converter em Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
