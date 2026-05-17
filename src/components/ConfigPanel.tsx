import React from 'react';
import { Settings, X } from 'lucide-react';

interface ConfigPanelProps {
    aberto: boolean;
    setAberto: (v: boolean) => void;
    cfgUserName: string;
    setCfgUserName: (v: string) => void;
    cfgRollW: number;
    setCfgRollW: (v: number) => void;
    cfgPrice: number;
    setCfgPrice: (v: number) => void;
    cfgMargin: number;
    setCfgMargin: (v: number) => void;
    cfgModo: 'densidade' | 'facilidade';
    setCfgModo: (v: 'densidade' | 'facilidade') => void;
    cfgModoPerdas: 'dinamico' | 'fixo';
    setCfgModoPerdas: (v: 'dinamico' | 'fixo') => void;
    cfgPerdasFixas: number;
    setCfgPerdasFixas: (v: number) => void;
    onSalvar: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
    aberto,
    setAberto,
    cfgUserName,
    setCfgUserName,
    cfgRollW,
    setCfgRollW,
    cfgPrice,
    setCfgPrice,
    cfgMargin,
    setCfgMargin,
    cfgModo,
    setCfgModo,
    cfgModoPerdas,
    setCfgModoPerdas,
    cfgPerdasFixas,
    setCfgPerdasFixas,
    onSalvar
}) => {
    return (
        <>
            <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#070f1f] border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${aberto ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Settings size={18} className="text-[#c9a227]" />
                        <span className="font-bold text-sm uppercase tracking-wider">Configurações Padrão</span>
                    </div>
                    <button onClick={() => setAberto(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    <div>
                        <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">
                            Esses valores serão usados como padrão sempre que a calculadora for aberta. Você ainda pode alterá-los a qualquer momento durante o uso.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Nome do Responsável</label>
                            <input
                                type="text"
                                value={cfgUserName}
                                onChange={(e) => setCfgUserName(e.target.value)}
                                placeholder="Seu Nome"
                                className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#c9a227]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Largura do Rolo (cm)</label>
                            <input
                                type="number"
                                value={cfgRollW}
                                onChange={(e) => setCfgRollW(parseFloat(e.target.value) || 0)}
                                onFocus={(e) => e.target.select()}
                                className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-[#c9a227]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Preço por m² (R$)</label>
                            <input
                                type="number"
                                value={cfgPrice}
                                onChange={(e) => setCfgPrice(parseFloat(e.target.value) || 0)}
                                onFocus={(e) => e.target.select()}
                                className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-[#c9a227]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Margem de Corte (cm)</label>
                            <input
                                type="number"
                                value={cfgMargin}
                                onChange={(e) => setCfgMargin(parseFloat(e.target.value) || 0)}
                                onFocus={(e) => e.target.select()}
                                className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-[#c9a227]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Algoritmo Padrão</label>
                            <div className="flex bg-[#040811] border border-white/10 p-1 rounded-xl">
                                <button
                                    onClick={() => setCfgModo('densidade')}
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${cfgModo === 'densidade' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Densidade
                                </button>
                                <button
                                    onClick={() => setCfgModo('facilidade')}
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${cfgModo === 'facilidade' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Fácil
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Modo de Perdas</label>
                            <div className="flex bg-[#040811] border border-white/10 p-1 rounded-xl">
                                <button
                                    onClick={() => setCfgModoPerdas('dinamico')}
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${cfgModoPerdas === 'dinamico' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Dinâmico
                                </button>
                                <button
                                    onClick={() => setCfgModoPerdas('fixo')}
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${cfgModoPerdas === 'fixo' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Fixo
                                </button>
                            </div>
                            <p className="text-[9px] text-gray-600 mt-2 leading-relaxed">
                                {cfgModoPerdas === 'dinamico'
                                    ? 'Calcula a perda automaticamente com base na eficiência do corte.'
                                    : 'Aplica uma porcentagem fixa de perda sobre o subtotal.'}
                            </p>
                            {cfgModoPerdas === 'fixo' && (
                                <div className="mt-3">
                                    <label className="block text-[9px] uppercase text-gray-400 font-bold mb-1">Porcentagem Fixa (%)</label>
                                    <input
                                        type="number"
                                        value={cfgPerdasFixas}
                                        onChange={(e) => setCfgPerdasFixas(parseFloat(e.target.value) || 0)}
                                        onFocus={(e) => e.target.select()}
                                        min={0}
                                        max={100}
                                        className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-[#c9a227]/50 transition-colors"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-5 border-t border-white/10">
                    <button
                        onClick={onSalvar}
                        className="w-full bg-[#c9a227] text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#e5c158] transition-colors"
                    >
                        <Settings size={14} /> Salvar e Aplicar
                    </button>
                </div>
            </div>
            {aberto && (
                <div onClick={() => setAberto(false)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
            )}
        </>
    );
};
