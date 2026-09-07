'use client';

import React, { useState } from 'react';
import { ClipboardPaste, X, Layers, Plus } from 'lucide-react';
import type { ResumoItem } from '../../lib/grouping';
import { groupByAmbiente } from '../../lib/grouping';

export type { ResumoItem };

interface ColarModalProps {
    show: boolean;
    onClose: () => void;
    resumo: ResumoItem[];
    colarItens: (labelDestino: string) => void;
    labelIn: string;
}

export function ColarModal({ show, onClose, resumo, colarItens, labelIn }: ColarModalProps) {
    if (!show) return null;
    return <ColarModalBody onClose={onClose} resumo={resumo} colarItens={colarItens} initialNome={labelIn} />;
}

function ColarModalBody({ onClose, resumo, colarItens, initialNome }: {
    onClose: () => void;
    resumo: ResumoItem[];
    colarItens: (labelDestino: string) => void;
    initialNome: string;
}) {
    // Estado inicial por montagem: o body só monta quando o modal abre,
    // então o input já nasce com o ambiente atual sem precisar de efeito.
    const [novoNome, setNovoNome] = useState(initialNome);
    const trimmed = novoNome.trim();
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#111e33] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-5 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <ClipboardPaste size={16} className="text-[#c9a227]" />
                        Colar em...
                    </h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="space-y-2">
                    {Object.entries(groupByAmbiente(resumo)).map(([ambiente]) => (
                        <button
                            key={ambiente}
                            onClick={() => colarItens(ambiente === 'Sem Ambiente' ? '' : ambiente)}
                            className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#c9a227]/30 text-white transition-all flex items-center gap-2 active:scale-[0.98]"
                        >
                            <Layers size={14} className="text-[#c9a227]" />
                            <span className="text-sm font-bold">{ambiente}</span>
                            <span className="text-[10px] text-gray-400 ml-auto">existente</span>
                        </button>
                    ))}
                    <div className="pt-2 border-t border-white/10 mt-2 space-y-2">
                        <input
                            type="text"
                            value={novoNome}
                            onChange={(e) => setNovoNome(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') { e.preventDefault(); if (trimmed) colarItens(trimmed); }
                            }}
                            placeholder="Nome do novo ambiente..."
                            className="w-full bg-[#040811] border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#c9a227]/50 placeholder:text-gray-600"
                        />
                        <button
                            onClick={() => { if (trimmed) colarItens(trimmed); }}
                            disabled={!trimmed}
                            className="w-full text-left p-3 rounded-xl bg-[#c9a227]/10 hover:bg-[#c9a227]/20 border border-[#c9a227]/30 text-[#c9a227] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            <Plus size={14} />
                            <span className="text-sm font-bold">Novo: {trimmed || 'digite o nome acima'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
