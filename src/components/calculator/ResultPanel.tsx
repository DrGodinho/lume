'use client';

import React, { useState, useRef } from 'react';
import { Camera, FileText, History, Scissors, Eye, EyeOff, TrendingUp, Check, X, DollarSign } from 'lucide-react';
import type { LucroCalculadoraResult } from '../../lib/pricing';

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
    // Modo Discreto / Lucratividade
    lucroInfo?: LucroCalculadoraResult;
    usarSobra?: boolean;
    onToggleUsarSobra?: () => void;
    custoAjudante?: number;
    onCustoAjudanteChange?: (val: number) => void;
}

/**
 * B2: painel de resultado da calculadora — Total Cliente + m² /
 * Valor Efetivo / Comprar (m) / Eficiência / Desconto + Perdas,
 * com Salvar/PNG/PDF junto dos números e Modo Discreto de Lucratividade.
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
    lucroInfo,
    usarSobra = false,
    onToggleUsarSobra,
    custoAjudante = 0,
    onCustoAjudanteChange,
}: ResultPanelProps) {
    const [mostrarLucro, setMostrarLucro] = useState(false);
    const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
    const didTriggerLongPressRef = useRef(false);

    const handlePointerDown = () => {
        didTriggerLongPressRef.current = false;
        holdTimerRef.current = setTimeout(() => {
            didTriggerLongPressRef.current = true;
            setMostrarLucro((prev) => !prev);
            if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                try { navigator.vibrate(35); } catch { /* noop */ }
            }
        }, 500);
    };

    const handlePointerUp = () => {
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current);
            holdTimerRef.current = null;
        }
    };

    const handleClick = () => {
        // Se ja estava aberto e o usuario clicou rapidamente, fecha
        if (mostrarLucro && !didTriggerLongPressRef.current) {
            setMostrarLucro(false);
        }
    };

    return (
        <div className="admin-entrance bg-gradient-to-br from-[#111e33] to-[#04080f] border-2 border-[#c9a227]/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="relative">
                    <div
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        onClick={handleClick}
                        className="flex flex-col cursor-pointer select-none group"
                    >
                        <div className="flex items-center gap-1.5 mb-1">
                            <p className="text-[10px] uppercase text-blue-300 font-bold">Total Cliente</p>
                        </div>
                        <div className="flex items-baseline gap-2 my-1">
                            <h2 className="text-3xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                                {formatBRL(finalPrice)}
                            </h2>
                            <span className="text-xl font-bold text-gray-400">({totalAreaM2.toFixed(2)} m²)</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-[9px] bg-blue-900/40 text-blue-300 px-2 py-1 rounded-lg border border-blue-500/20 font-medium whitespace-nowrap">Vlr Efetivo: {formatBRL(valorPraticoM2)}/m²</span>
                    </div>

                    {/* POPOVER DISCRETO: LUCRO E CUSTO REAL */}
                    {mostrarLucro && lucroInfo && (
                        <div className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-80 bg-[#0a101d]/95 backdrop-blur-xl border border-[#c9a227]/50 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#c9a227] uppercase tracking-wider">
                                    <TrendingUp size={14} /> Lucratividade Real
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setMostrarLucro(false); }}
                                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                    title="Fechar"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Custo do Filme */}
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-400">
                                        Custo Filme {lucroInfo.metrosMinimosCompra > 0 && `(${lucroInfo.metrosMinimosCompra}m mín)`}:
                                    </span>
                                    <span className={`font-bold ${usarSobra ? 'line-through text-gray-500' : 'text-red-400'}`}>
                                        {formatBRL(lucroInfo.custoFilme)}
                                    </span>
                                </div>

                                {/* Usar Sobra */}
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onToggleUsarSobra?.(); }}
                                    className={`w-full py-1.5 px-2.5 rounded-lg border text-[10px] font-bold uppercase transition-all flex items-center justify-between ${
                                        usarSobra
                                            ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <span>Usar Sobra de Obra</span>
                                    <span className="flex items-center gap-1">
                                        {usarSobra ? <Check size={12} className="text-green-400" /> : null}
                                        {usarSobra ? 'Custo R$ 0' : 'Cobrar filme'}
                                    </span>
                                </button>

                                {/* Ajudante / Extras */}
                                <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                                    <span className="text-[11px] text-gray-400">Ajudante / Extras:</span>
                                    <div className="relative w-24">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">R$</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="10"
                                            value={custoAjudante || ''}
                                            placeholder="0"
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => onCustoAjudanteChange?.(Math.max(0, parseFloat(e.target.value) || 0))}
                                            className="w-full bg-[#040811] border border-white/10 rounded-lg pl-6 pr-2 py-1 text-xs text-right text-white font-bold outline-none focus:border-[#c9a227]/50"
                                        />
                                    </div>
                                </div>

                                {/* Total Lucro & Margem */}
                                <div className="pt-3 border-t border-white/10 flex items-center justify-between bg-black/30 p-2.5 rounded-xl">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Lucro Líquido</p>
                                        <p className="text-lg font-black text-green-400 leading-none mt-0.5">
                                            {formatBRL(lucroInfo.lucroLiquido)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Margem</p>
                                        <span className="inline-block px-2 py-0.5 mt-0.5 rounded-md text-xs font-black bg-[#c9a227]/20 border border-[#c9a227]/40 text-[#f5d77a]">
                                            {lucroInfo.margemPercentual}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
