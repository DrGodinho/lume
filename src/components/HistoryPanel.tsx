import React, { useState, useEffect, useMemo } from 'react';
import { History, X, Clock, ChevronRight, Trash2, ChevronDown, Search } from 'lucide-react';
import type { OrcamentoSalvo } from '../lib/films';


interface HistoryPanelProps {
    aberto: boolean;
    setAberto: (v: boolean) => void;
    historico: OrcamentoSalvo[];
    formatBRL: (v: number) => string;
    onCarregar: (orc: OrcamentoSalvo) => void;
    onDeletar: (id: string) => void;
}

const PAGE_SIZE = 15;

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
    aberto,
    setAberto,
    historico,
    formatBRL,
    onCarregar,
    onDeletar
}) => {
    const [search, setSearch] = useState('');
    const [visible, setVisible] = useState(PAGE_SIZE);

    useEffect(() => {
        if (aberto) setVisible(PAGE_SIZE);
    }, [aberto, historico.length]);

    const filtrados = useMemo(() => {
        if (!search.trim()) return historico;
        const q = search.toLowerCase().trim();
        return historico.filter(orc =>
            orc.cliente.toLowerCase().includes(q) ||
            (orc.neighborhood && orc.neighborhood.toLowerCase().includes(q)) ||
            (orc.data && orc.data.includes(q))
        );
    }, [historico, search]);

    const visiveis = filtrados.slice(0, visible);
    const temMais = visible < filtrados.length;

    return (
        <>
            <div className={`fixed inset-y-0 right-0 z-50 w-80 bg-[#070f1f] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${aberto ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <History size={18} className="text-[#c9a227]" />
                        <span className="font-bold text-sm uppercase tracking-wider">Orçamentos Salvos</span>
                        {historico.length > 0 && (
                            <span className="text-[10px] text-gray-500 bg-white/5 rounded-full px-2 py-0.5">{historico.length}</span>
                        )}
                    </div>
                    <button onClick={() => setAberto(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {historico.length > 0 && (
                    <div className="p-3 border-b border-white/5">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setVisible(PAGE_SIZE);
                                }}
                                placeholder="Buscar por cliente, bairro..."
                                className="w-full bg-[#04080f] border border-white/10 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#c9a227] transition-colors"
                            />
                            {search && (
                                <button
                                    onClick={() => { setSearch(''); setVisible(PAGE_SIZE); }}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {historico.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-600 text-sm text-center px-4">
                            <Clock size={32} className="mb-3 opacity-30" />
                            <p>Nenhum orçamento salvo ainda.</p>
                            <p className="text-xs mt-1 opacity-60">Clique em "Salvar no Histórico" após calcular.</p>
                        </div>
                    ) : filtrados.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-xs text-center px-4">
                            <p>Nenhum orçamento encontrado para "{search}".</p>
                        </div>
                    ) : (
                        <>
                            {visiveis.map(orc => (
                                <div key={orc.id} className="bg-[#04080f] border border-white/5 rounded-xl p-3 hover:border-[#c9a227]/30 transition-colors">
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="leading-tight min-w-0 max-w-[160px]">
                                            <p className="font-bold text-sm text-white truncate">{orc.cliente}</p>
                                            {orc.neighborhood && (
                                                <p className="text-[11px] text-gray-500 truncate">{orc.neighborhood}</p>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-500 shrink-0 ml-2">{orc.data}</span>
                                    </div>
                                    <div className="flex items-baseline justify-between mb-1">
                                        <p className="text-green-400 font-bold text-base">{formatBRL(orc.valor)}</p>
                                        {orc.desconto > 0 && (
                                            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                                                -{formatBRL(orc.desconto)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-gray-500 mb-3">{orc.qtd} peças · rolo {orc.config.rollW}cm</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => onCarregar(orc)} className="flex-1 flex items-center justify-center gap-1.5 bg-[#c9a227]/10 hover:bg-[#c9a227]/20 text-[#c9a227] text-[11px] font-bold py-1.5 rounded-lg transition-colors">
                                            <ChevronRight size={13} /> Carregar
                                        </button>
                                        <button onClick={() => onDeletar(orc.id)} className="p-1.5 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {temMais && (
                                <button
                                    onClick={() => setVisible(v => v + PAGE_SIZE)}
                                    className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-[#c9a227] py-2 rounded-lg border border-white/5 hover:border-[#c9a227]/30 transition-colors"
                                >
                                    <ChevronDown size={14} /> Carregar mais ({filtrados.length - visible})
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            {aberto && (
                <div onClick={() => setAberto(false)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
            )}
        </>
    );
};
