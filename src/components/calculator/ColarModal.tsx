'use client';

import React from 'react';
import { ClipboardPaste, X, Layers, Plus } from 'lucide-react';

export interface ResumoItem {
    h: number;
    w: number;
    q: number;
    label: string;
}

interface ColarModalProps {
    show: boolean;
    onClose: () => void;
    resumo: ResumoItem[];
    colarItens: (labelDestino: string) => void;
    labelIn: string;
}

export function ColarModal({ show, onClose, resumo, colarItens, labelIn }: ColarModalProps) {
    if (!show) return null;
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
                    {Object.entries(
                        resumo.reduce((acc, item) => {
                            const lbl = item.label || 'Sem Ambiente';
                            if (!acc[lbl]) acc[lbl] = [];
                            acc[lbl].push(item);
                            return acc;
                        }, {} as globalThis.Record<string, ResumoItem[]>)
                    ).map(([ambiente]) => (
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
                    <div className="pt-2 border-t border-white/10 mt-2">
                        <button
                            onClick={() => {
                                const novoLabel = labelIn.trim();
                                if (novoLabel) {
                                    colarItens(novoLabel);
                                }
                            }}
                            disabled={!labelIn.trim()}
                            className="w-full text-left p-3 rounded-xl bg-[#c9a227]/10 hover:bg-[#c9a227]/20 border border-[#c9a227]/30 text-[#c9a227] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            <Plus size={14} />
                            <span className="text-sm font-bold">Novo: {labelIn || 'Digite o nome acima'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
