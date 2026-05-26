'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Database, ArrowLeft, Search, Trash2, Eye, ChevronDown, ChevronUp,
    Calendar, DollarSign, Package, User, Clock, RefreshCw, Download,
    BarChart3, TrendingUp, Layers
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HistoryRow {
    id: string;
    cliente: string;
    data: string;
    valor: number;
    qtd: number;
    vidros: any[];
    config: any;
    desconto: number;
    modo_otimizacao: string;
    created_at: string;
}

interface DraftRow {
    id: string;
    cliente: string;
    vidros: any[];
    desconto: number;
    desconto_input: string;
    roll_w: number;
    price: number;
    margin: number;
    modo_otimizacao: string;
    user_name: string;
    updated_at: string;
}

interface ConfigRow {
  id: string;
  roll_w: number;
  price: number;
  margin: number;
  modo_otimizacao: string;
  user_name: string;
  updated_at: string;
  modo_perdas: string;
  perdas_fixas: number;
  modo_cor_config: string;
}

type TabType = 'history' | 'draft' | 'config';

export function AdminDados() {
    const [activeTab, setActiveTab] = useState<TabType>('history');
    const [history, setHistory] = useState<HistoryRow[]>([]);
    const [draft, setDraft] = useState<DraftRow | null>(null);
    const [config, setConfig] = useState<ConfigRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [sortField, setSortField] = useState<'created_at' | 'valor' | 'qtd'>('created_at');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const formatBRL = (num: number) =>
        num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const formatDate = (iso: string) => {
        try {
            return new Date(iso).toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch { return iso; }
    };

    const loadData = async () => {
        if (!supabase) return;
        setLoading(true);

        const [histRes, draftRes, cfgRes] = await Promise.all([
            supabase.from('calculator_history').select('*').order('created_at', { ascending: false }),
            supabase.from('calculator_draft').select('*').eq('id', 'default').single(),
            supabase.from('calculator_config').select('*').eq('id', 'default').single(),
        ]);

        if (histRes.data) setHistory(histRes.data);
        if (draftRes.data) setDraft(draftRes.data as DraftRow);
        if (cfgRes.data) setConfig(cfgRes.data as ConfigRow);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const deleteHistoryItem = async (id: string) => {
        if (!supabase) return;
        if (!window.confirm('Deletar este orçamento permanentemente?')) return;
        await supabase.from('calculator_history').delete().eq('id', id);
        setHistory(prev => prev.filter(h => h.id !== id));
    };

    const filteredHistory = useMemo(() => {
        let items = [...history];
        if (search) {
            const q = search.toLowerCase();
            items = items.filter(h =>
                h.cliente.toLowerCase().includes(q) ||
                h.data.includes(q) ||
                h.valor.toString().includes(q)
            );
        }
        items.sort((a, b) => {
            const av = a[sortField] ?? 0;
            const bv = b[sortField] ?? 0;
            if (sortDir === 'asc') return av > bv ? 1 : -1;
            return av < bv ? 1 : -1;
        });
        return items;
    }, [history, search, sortField, sortDir]);

    const stats = useMemo(() => {
        if (history.length === 0) return null;
        const totalValor = history.reduce((s, h) => s + h.valor, 0);
        const totalPecas = history.reduce((s, h) => s + h.qtd, 0);
        const mediaValor = totalValor / history.length;
        const maiorOrc = Math.max(...history.map(h => h.valor));
        return { totalValor, totalPecas, mediaValor, maiorOrc, total: history.length };
    }, [history]);

    const exportCSV = () => {
        const header = 'Cliente,Data,Valor,Peças,Desconto,Modo\n';
        const rows = history.map(h =>
            `"${h.cliente}","${h.data}",${h.valor},${h.qtd},${h.desconto},"${h.modo_otimizacao}"`
        ).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `lume_historico_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    };

    const toggleSort = (field: typeof sortField) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('desc'); }
    };

    const SortIcon = ({ field }: { field: typeof sortField }) => (
        sortField === field
            ? (sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />)
            : <ChevronDown size={12} className="opacity-30" />
    );

    if (!supabase) {
        return (
            <div className="min-h-screen bg-[#040811] text-white flex items-center justify-center">
                <p className="text-red-400">Supabase não configurado. Verifique o .env.local</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#040811] text-white py-6 px-3 sm:px-6">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <a href="/admin/" className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                            <ArrowLeft size={18} />
                        </a>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-[#111e33] border border-[#233554] rounded-xl">
                                <Database className="text-[#c9a227]" size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold font-montserrat">LUME <span className="font-light text-gray-400">Dados</span></h1>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Supabase Cloud</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={loadData} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase hover:bg-white/10 transition-colors">
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Atualizar
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex bg-[#0a0e17] border-2 border-[#c9a227]/20 p-1.5 rounded-2xl mb-6">
                    {([
                        { key: 'history' as TabType, label: 'Histórico', icon: Clock, count: history.length },
                        { key: 'draft' as TabType, label: 'Rascunho', icon: Layers },
                        { key: 'config' as TabType, label: 'Config', icon: BarChart3 },
                    ]).map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.key
                                ? 'bg-[#c9a227] text-black shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className={`rounded-full w-5 h-5 flex items-center justify-center text-[9px] font-black ${activeTab === tab.key ? 'bg-black/20 text-black' : 'bg-[#c9a227]/20 text-[#c9a227]'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <RefreshCw size={24} className="text-[#c9a227] animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* ─── HISTORY TAB ─────────────────────────────────────────── */}
                        {activeTab === 'history' && (
                            <div className="space-y-4">
                                {/* Stats */}
                                {stats && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                        {[
                                            { label: 'Total Faturado', value: formatBRL(stats.totalValor), icon: DollarSign, color: 'text-green-400' },
                                            { label: 'Orçamentos', value: stats.total, icon: Package, color: 'text-blue-400' },
                                            { label: 'Ticket Médio', value: formatBRL(stats.mediaValor), icon: TrendingUp, color: 'text-[#c9a227]' },
                                            { label: 'Total Peças', value: stats.totalPecas, icon: Layers, color: 'text-cyan-400' },
                                        ].map((s, i) => (
                                            <div key={i} className="bg-[#0a0e17] border-2 border-[#c9a227]/15 rounded-2xl p-4 text-center">
                                                <s.icon size={16} className={`${s.color} mx-auto mb-2 opacity-60`} />
                                                <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">{s.label}</p>
                                                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Search + Export */}
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            placeholder="Buscar cliente, data, valor..."
                                            className="w-full bg-[#0a0e17] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#c9a227]/50"
                                        />
                                    </div>
                                    <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-[#c9a227]/10 border border-[#c9a227]/30 text-[#c9a227] rounded-xl text-xs font-bold uppercase hover:bg-[#c9a227]/20 transition-colors shrink-0">
                                        <Download size={14} /> CSV
                                    </button>
                                </div>

                                {/* Sort Headers */}
                                <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 text-[9px] uppercase font-bold text-gray-500 tracking-wider">
                                    <div className="col-span-4">Cliente</div>
                                    <button onClick={() => toggleSort('created_at')} className="col-span-2 flex items-center gap-1 hover:text-white transition-colors">
                                        Data <SortIcon field="created_at" />
                                    </button>
                                    <button onClick={() => toggleSort('valor')} className="col-span-2 flex items-center gap-1 hover:text-white transition-colors">
                                        Valor <SortIcon field="valor" />
                                    </button>
                                    <button onClick={() => toggleSort('qtd')} className="col-span-2 flex items-center gap-1 hover:text-white transition-colors">
                                        Peças <SortIcon field="qtd" />
                                    </button>
                                    <div className="col-span-2 text-right">Ações</div>
                                </div>

                                {/* Rows */}
                                {filteredHistory.length === 0 ? (
                                    <div className="text-center py-16 text-gray-600">
                                        <Database size={40} className="mx-auto mb-4 opacity-30" />
                                        <p className="font-medium">Nenhum orçamento encontrado</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredHistory.map(h => (
                                            <div key={h.id} className="bg-[#0a0e17] border border-white/10 rounded-2xl overflow-hidden hover:border-[#c9a227]/30 transition-colors">
                                                <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 p-4 items-center">
                                                    <div className="col-span-2 sm:col-span-4">
                                                        <p className="font-bold text-sm truncate flex items-center gap-2">
                                                            <User size={12} className="text-[#c9a227] shrink-0" />
                                                            {h.cliente || 'Sem nome'}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 ml-5 sm:hidden">{h.data}</p>
                                                    </div>
                                                    <div className="hidden sm:block col-span-2 text-gray-400 text-xs">
                                                        <p>{h.data}</p>
                                                        <p className="text-[9px] text-gray-600">{formatDate(h.created_at)}</p>
                                                    </div>
                                                    <div className="col-span-1 sm:col-span-2">
                                                        <p className="text-green-400 font-bold text-sm">{formatBRL(h.valor)}</p>
                                                        {h.desconto > 0 && (
                                                            <p className="text-[9px] text-red-400">-{formatBRL(h.desconto)}</p>
                                                        )}
                                                    </div>
                                                    <div className="hidden sm:block col-span-2 text-gray-400 text-xs">
                                                        {h.qtd} peças
                                                    </div>
                                                    <div className="col-span-1 sm:col-span-2 flex gap-1.5 justify-end">
                                                        <button
                                                            onClick={() => setExpandedId(expandedId === h.id ? null : h.id)}
                                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                                            title="Ver detalhes"
                                                        >
                                                            <Eye size={14} className={expandedId === h.id ? 'text-[#c9a227]' : ''} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteHistoryItem(h.id)}
                                                            className="p-2 bg-red-500/5 hover:bg-red-500/15 text-red-400 rounded-lg transition-colors"
                                                            title="Deletar"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Expanded Detail */}
                                                {expandedId === h.id && (
                                                    <div className="border-t border-white/5 p-4 bg-[#060a12]">
                                                        <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                                                            <div>
                                                                <p className="text-[9px] text-gray-500 uppercase font-bold">Rolo</p>
                                                                <p className="font-bold">{h.config?.rollW || '—'}cm</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] text-gray-500 uppercase font-bold">R$/m²</p>
                                                                <p className="font-bold">{h.config?.price || '—'}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[9px] text-gray-500 uppercase font-bold">Modo</p>
                                                                <p className="font-bold text-[#c9a227] capitalize">{h.modo_otimizacao}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-2">Vidros ({h.vidros?.length || 0})</p>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto">
                                                            {(h.vidros || []).map((v: any, i: number) => (
                                                                <div key={i} className="bg-white/5 rounded-lg px-3 py-2 text-xs flex items-center justify-between">
                                                                    <span className="text-gray-400">{v.label ? <span className="text-[#c9a227] mr-1">{v.label}</span> : ''}{v.oh || v.h}×{v.ow || v.w}</span>
                                                                    <div className="w-3 h-3 rounded-sm shrink-0 ml-2" style={{ background: v.cor }} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ─── DRAFT TAB ───────────────────────────────────────────── */}
                        {activeTab === 'draft' && (
                            <div className="space-y-4">
                                {draft ? (
                                    <div className="bg-[#0a0e17] border-2 border-[#c9a227]/25 rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-sm font-bold uppercase text-[#c9a227] tracking-wider">Rascunho Atual</h3>
                                            <span className="text-[9px] text-gray-500">{formatDate(draft.updated_at)}</span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                            {[
                                                { label: 'Cliente', value: draft.cliente || '—', icon: User },
                                                { label: 'Peças', value: (draft.vidros as any[])?.length || 0, icon: Package },
                                                { label: 'Rolo', value: `${draft.roll_w}cm`, icon: Layers },
                                                { label: 'R$/m²', value: draft.price, icon: DollarSign },
                                            ].map((f, i) => (
                                                <div key={i} className="bg-[#060a12] rounded-xl p-3 border border-white/5">
                                                    <f.icon size={12} className="text-[#c9a227] mb-1 opacity-50" />
                                                    <p className="text-[9px] text-gray-500 uppercase font-bold">{f.label}</p>
                                                    <p className="font-bold text-sm mt-0.5">{f.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {draft.vidros && (draft.vidros as any[]).length > 0 && (
                                            <>
                                                <p className="text-[9px] text-gray-500 uppercase font-bold mb-2">Vidros no Rascunho</p>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-60 overflow-y-auto">
                                                    {(draft.vidros as any[]).map((v: any, i: number) => (
                                                        <div key={i} className="bg-white/5 rounded-lg px-3 py-2 text-xs flex items-center justify-between">
                                                            <span className="text-gray-400">{v.label ? <span className="text-[#c9a227] mr-1">{v.label}</span> : ''}{v.oh || v.h}×{v.ow || v.w}</span>
                                                            <div className="w-3 h-3 rounded-sm shrink-0 ml-2" style={{ background: v.cor }} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 text-gray-600">
                                        <Layers size={40} className="mx-auto mb-4 opacity-30" />
                                        <p className="font-medium">Nenhum rascunho salvo na nuvem</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ─── CONFIG TAB ──────────────────────────────────────────── */}
                        {activeTab === 'config' && (
                            <div className="space-y-4">
                                {config ? (
                                    <div className="bg-[#0a0e17] border-2 border-[#c9a227]/25 rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-sm font-bold uppercase text-[#c9a227] tracking-wider">Configuração Salva</h3>
                                            <span className="text-[9px] text-gray-500">{formatDate(config.updated_at)}</span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {[
              { label: 'Usuário', value: config.user_name },
              { label: 'Largura do Rolo', value: `${config.roll_w} cm` },
              { label: 'Preço por m²', value: formatBRL(config.price) },
              { label: 'Margem de Corte', value: `${config.margin} cm` },
              { label: 'Modo de Otimização', value: config.modo_otimizacao },
              { label: 'Modo de Perdas', value: config.modo_perdas ?? '—' },
              { label: 'Perdas Fixas', value: config.perdas_fixas != null ? `${config.perdas_fixas} cm` : '—' },
              { label: 'Modo de Cor', value: config.modo_cor_config ?? '—' },
                                            ].map((f, i) => (
                                                <div key={i} className="bg-[#060a12] rounded-xl p-4 border border-white/5">
                                                    <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">{f.label}</p>
                                                    <p className="font-bold text-sm capitalize">{f.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-16 text-gray-600">
                                        <BarChart3 size={40} className="mx-auto mb-4 opacity-30" />
                                        <p className="font-medium">Nenhuma configuração salva na nuvem</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}

                <div className="text-center text-[10px] text-gray-600 mt-12 pb-4 font-bold tracking-widest uppercase">
                    Dados sincronizados via Supabase
                </div>
            </div>
        </div>
    );
}
