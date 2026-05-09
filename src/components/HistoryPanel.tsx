import React from 'react';
import { History, X, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { OrcamentoSalvo } from '../views/AdminCalculator';


interface HistoryPanelProps {
    aberto: boolean;
    setAberto: (v: boolean) => void;
    historico: OrcamentoSalvo[];
    formatBRL: (v: number) => string;
    onCarregar: (orc: OrcamentoSalvo) => void;
    onDeletar: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
    aberto,
    setAberto,
    historico,
    formatBRL,
    onCarregar,
    onDeletar
}) => {
    return (
        <>
            <div className={`fixed inset-y-0 right-0 z-50 w-80 bg-[#070f1f] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${aberto ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <History size={18} className="text-[#c9a227]" />
                        <span className="font-bold text-sm uppercase tracking-wider">Orçamentos Salvos</span>
                    </div>
                    <button onClick={() => setAberto(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {historico.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-600 text-sm text-center px-4">
                            <Clock size={32} className="mb-3 opacity-30" />
                            <p>Nenhum orçamento salvo ainda.</p>
                            <p className="text-xs mt-1 opacity-60">Clique em "Salvar no Histórico" após calcular.</p>
                        </div>
                    ) : (
                        historico.map(orc => (
                            <div key={orc.id} className="bg-[#04080f] border border-white/5 rounded-xl p-3 hover:border-[#c9a227]/30 transition-colors">
                                <div className="flex items-start justify-between mb-1">
                                    <p className="font-bold text-sm text-white leading-tight truncate max-w-[160px]">{orc.cliente}</p>
                                    <span className="text-[10px] text-gray-500 shrink-0 ml-2">{orc.data}</span>
                                </div>
                                <p className="text-green-400 font-bold text-base">{formatBRL(orc.valor)}</p>
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
                        ))
                    )}
                </div>
            </div>
            {aberto && (
                <div onClick={() => setAberto(false)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
            )}
        </>
    );
};
