'use client';

import React from 'react';
import { Camera, FileText, History, Scissors } from 'lucide-react';

interface ResultPanelProps {
    // As 3 perguntas: quanto custa? quanto comprar? está eficiente?
    finalPrice: number;
    totalAreaM2: number;
    valorPraticoM2: number;
    metrosComprar: number;
    eficiencia: number;
    // Desconto + perdas
    displayDesconto: string;
    onDescontoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    compensarPerdas: boolean;
    onTogglePerdas: () => void;
    modoPerdas: string;
    perdasFixas: number;
    // Ações junto dos números (princípio 5: nenhum número sem verbo)
    onSalvar: () => void;
    onGerarImagem: () => void;
    onGerarPDF: () => void;
    formatBRL: (v: number) => string;
}

/**
 * B2: painel de resultado da calculadora — Total Cliente + m² /
 * Valor Efetivo / Comprar (m) / Eficiência / Desconto + Perdas,
 * com Salvar/PNG/PDF junto dos números.
 */
export function ResultPanel({
    finalPrice,
    totalAreaM2,
    valorPraticoM2,
    metrosComprar,
    eficiencia,
    displayDesconto,
    onDescontoChange,
    compensarPerdas,
    onTogglePerdas,
    modoPerdas,
    perdasFixas,
    onSalvar,
    onGerarImagem,
    onGerarPDF,
    formatBRL,
}: ResultPanelProps) {
    return (
        <div className="admin-entrance bg-gradient-to-br from-[#111e33] to-[#04080f] border-2 border-[#c9a227]/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                    <div className="flex flex-col">
                        <p className="text-[10px] uppercase text-blue-300 font-bold mb-1">Total Cliente</p>
                        <div className="flex items-baseline gap-2 my-1">
                            <h2 className="text-3xl font-bold text-green-400">{formatBRL(finalPrice)}</h2>
                            <span className="text-xl font-bold text-gray-400">({totalAreaM2.toFixed(2)} m²)</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-[9px] bg-blue-900/40 text-blue-300 px-2 py-1 rounded-lg border border-blue-500/20 font-medium whitespace-nowrap">Vlr Efetivo: {formatBRL(valorPraticoM2)}/m²</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#c9a227]/10 p-3 rounded-xl border border-[#c9a227]/30 text-center">
                        <p className="text-[9px] uppercase text-[#c9a227] font-bold mb-1">Comprar</p>
                        <p className="text-xl font-bold">{metrosComprar.toFixed(2)}<span className="text-[10px] ml-1 opacity-50">m</span></p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                        <p className="text-[9px] uppercase text-gray-500 font-bold mb-1">Eficiência</p>
                        <p className={`text-xl font-bold ${eficiencia > 80 ? 'text-green-400' : 'text-yellow-400'}`}>{eficiencia}%</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-center sm:justify-start gap-3 w-full sm:w-auto">
                    <p className="text-[10px] uppercase text-red-300 font-bold">Desconto R$:</p>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-red-400 font-bold">R$</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={displayDesconto}
                            onChange={onDescontoChange}
                            onFocus={(e) => e.target.select()}
                            onClick={(e) => e.currentTarget.select()}
                            onKeyDown={(e) => {
                                if (!/[0-9]/.test(e.key) &&
                                    e.key !== 'Backspace' &&
                                    e.key !== 'Tab' &&
                                    e.key !== 'Enter' &&
                                    e.key !== 'Delete' &&
                                    e.key !== 'ArrowLeft' &&
                                    e.key !== 'ArrowRight' &&
                                    !(e.ctrlKey || e.metaKey)) {
                                    e.preventDefault();
                                }
                            }}
                            className="w-28 bg-[#040811] text-red-400 border border-red-500/30 rounded-lg pl-8 pr-2 py-1.5 text-sm text-right font-bold outline-none"
                        />
                    </div>
                    <button
                        onClick={onTogglePerdas}
                        className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 h-[34px] ${compensarPerdas ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                        title={modoPerdas === 'fixo' ? `Perdas fixas: ${perdasFixas}%` : 'Compensar perdas (dinâmico, baseado na eficiência)'}
                    >
                        <Scissors size={14} />
                        <span className="text-[9px] font-bold uppercase whitespace-nowrap">
                            Perdas
                        </span>
                    </button>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={onSalvar} className="flex-1 flex items-center justify-center gap-2 bg-[#c9a227]/10 border border-[#c9a227]/30 text-[#c9a227] px-3 py-2.5 rounded-xl font-bold uppercase text-[9px] hover:bg-[#c9a227]/20 transition-all">
                        <History size={13} /> Salvar
                    </button>
                    <button onClick={onGerarImagem} className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-xl font-bold uppercase text-[9px] transition-transform active:scale-95">
                        <Camera size={14} /> PNG
                    </button>
                    <button onClick={onGerarPDF} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#c9a227] to-[#e5c158] text-black px-3 py-2.5 rounded-xl font-bold uppercase text-[9px] transition-transform active:scale-95">
                        <FileText size={14} /> PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
