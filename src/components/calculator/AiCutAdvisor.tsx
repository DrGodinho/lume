'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, RefreshCw, Layers, ShieldCheck, Box, X } from 'lucide-react';
import type { FilmTypeKey, GlassItem } from '../../lib/films';
import { calcMetrosComprar } from '../../lib/pricing';
import { normalizeItems, packGuillotine } from '../../workers/packerCore';

interface AiCutAdvisorAnalysis {
    status: 'excelente' | 'oportunidade' | 'atencao';
    titulo: string;
    diagnostico: string;
    sugestaoBobina: {
        sugerirTroca: boolean;
        novaLargura?: number;
        motivo?: string;
        economiaEstimada?: string;
    };
    retalhoDestaque: {
        existe: boolean;
        descricao?: string;
        usoSugerido?: string;
    };
}

interface AiCutAdvisorProps {
    isOpen: boolean;
    onClose: () => void;
    vidros: GlassItem[];
    selectedFilm: FilmTypeKey;
    filmName: string;
    currentRollW: number;
    currentMaxY: number;
    eficiencia: number;
    totalAreaM2: number;
    priceM2: number;
    margin: number;
    onSwitchRollW: (newRollW: number) => void;
}

export function AiCutAdvisor({
    isOpen,
    onClose,
    vidros,
    selectedFilm,
    filmName,
    currentRollW,
    currentMaxY,
    eficiencia,
    totalAreaM2,
    priceM2,
    margin,
    onSwitchRollW,
}: AiCutAdvisorProps) {
    const [analysis, setAnalysis] = useState<AiCutAdvisorAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasRequested, setHasRequested] = useState(false);

    const isNanoCeramica = selectedFilm === 'nano_ceramica' || selectedFilm === 'nano_ceramica_g20';

    // 1. Simulação matemática da bobina de 1,00m (apenas se for Nano Cerâmica)
    const sim100 = useMemo(() => {
        if (!isNanoCeramica || vidros.length === 0) return null;

        const fits = vidros.every((v) => Math.min(v.ow, v.oh) + margin <= 100);
        if (!fits) {
            return {
                fitsAllPieces: false,
                maxY100: 0,
                eficiencia100: 0,
                metrosComprar100: 0,
                metrosComprar152: calcMetrosComprar(currentMaxY),
                diferencaMetros: 0,
                economiaReais: 0,
            };
        }

        try {
            const items = normalizeItems(vidros);
            const packed = packGuillotine(items, 100, margin);
            const m152 = calcMetrosComprar(currentRollW === 152 ? currentMaxY : packGuillotine(items, 152, margin).totalY);
            const m100 = calcMetrosComprar(packed.totalY);
            const areaComp152 = m152 * 1.52;
            const areaComp100 = m100 * 1.00;
            const diferencaArea = areaComp152 - areaComp100;
            const economia = Math.max(0, diferencaArea * priceM2 * 0.4); // estimativa de custo de material

            const areaVidrosM2 = packed.areaV / 10000;
            const ef100 = areaComp100 > 0 ? (areaVidrosM2 / areaComp100) * 100 : 0;

            return {
                fitsAllPieces: true,
                maxY100: packed.totalY,
                eficiencia100: ef100,
                metrosComprar100: m100,
                metrosComprar152: m152,
                diferencaMetros: m152 - m100,
                economiaReais: economia,
            };
        } catch (e) {
            console.error('[Sim100 Error]:', e);
            return null;
        }
    }, [isNanoCeramica, vidros, margin, currentMaxY, currentRollW, priceM2]);

    // 2. Detecção de Retalho Nobre
    const retalhoNobre = useMemo(() => {
        if (currentMaxY < 80 || vidros.length === 0) return undefined;
        // Se a largura for 152 e as peças usarem menos de 110cm de largura média
        const items = normalizeItems(vidros);
        const maxPieceDim = Math.max(...items.map((i) => Math.max(i.ow, i.oh)));
        if (currentRollW === 152 && maxPieceDim <= 105) {
            const sobrW = currentRollW - maxPieceDim;
            if (sobrW >= 35) {
                const comp = Math.round(currentMaxY);
                return {
                    largura: Math.round(sobrW),
                    comprimento: comp,
                    areaM2: Number(((sobrW * comp) / 10000).toFixed(2)),
                };
            }
        }
        return undefined;
    }, [currentMaxY, vidros, currentRollW]);

    // 3. Execução da Análise com Gemini 3.8 Flash
    const fetchAnalysis = useCallback(async () => {
        if (vidros.length === 0) return;
        setIsLoading(true);
        setError(null);
        setHasRequested(true);

        try {
            const res = await fetch('/api/ai/cut-advisor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedFilm,
                    filmName,
                    currentRollW,
                    currentMaxY,
                    currentEficiencia: eficiencia,
                    totalAreaM2,
                    priceM2,
                    canUseRoll100: isNanoCeramica,
                    roll100Simulation: sim100,
                    totalPecas: vidros.length,
                    retalhoNobre,
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Erro ao consultar IA.');
            }

            setAnalysis(data.analysis);
        } catch (err: any) {
            console.error('[AiCutAdvisor Error]:', err);
            setError(err.message || 'Não foi possível gerar a análise.');
        } finally {
            setIsLoading(false);
        }
    }, [vidros, selectedFilm, filmName, currentRollW, currentMaxY, eficiencia, totalAreaM2, priceM2, isNanoCeramica, sim100, retalhoNobre]);

    // Reseta a análise ao trocar vidros significativamente
    useEffect(() => {
        setAnalysis(null);
        setHasRequested(false);
    }, [vidros.length, selectedFilm]);

    if (!isOpen || vidros.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[#0a0f1d] border-2 border-[#c9a227]/40 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                {/* Header com Identidade Bluetech + IA + Fechar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#c9a227]/15 border border-[#c9a227]/40 flex items-center justify-center text-[#c9a227]">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                    Consultor de Rentabilidade & Sobras
                                </h3>
                                <span className="text-[9px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono">
                                    Catálogo Bluetech
                                </span>
                            </div>
                            <p className="text-xs text-gray-400">
                                {isNanoCeramica
                                    ? 'Linha Nano Cerâmica: bobinas de 1,52m e 1,00m disponíveis na distribuidora'
                                    : `Linha ${filmName}: restrita a bobina de 1,52m na distribuidora`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={fetchAnalysis}
                            disabled={isLoading}
                            className="px-3 py-1.5 rounded-xl bg-[#c9a227]/15 hover:bg-[#c9a227]/25 border border-[#c9a227]/40 text-[#c9a227] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
                            title="Pedir diagnóstico ao Gemini"
                        >
                            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                            {isLoading ? 'Analisando...' : hasRequested ? 'Reanalisar' : 'Analisar com IA'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                            title="Fechar"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

            {/* Estado de Carregamento */}
            {isLoading && (
                <div className="py-4 flex items-center justify-center gap-3 text-xs text-gray-300">
                    <div className="w-4 h-4 rounded-full border-2 border-[#c9a227] border-t-transparent animate-spin" />
                    <span>O Gemini 3.8 Flash está calculando a melhor estratégia de corte...</span>
                </div>
            )}

            {/* Erro */}
            {error && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200">
                    {error}
                </div>
            )}

            {/* Sugestão Imediata (Heurística) quando ainda não clicou em Analisar */}
            {!analysis && !isLoading && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#040811] p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-gray-300 space-y-0.5">
                        <p className="font-semibold text-white flex items-center gap-1.5">
                            <TrendingUp size={14} className="text-[#c9a227]" />
                            {isNanoCeramica && sim100?.fitsAllPieces
                                ? sim100.eficiencia100 > eficiencia
                                    ? `Oportunidade: Bobina de 1,00m pode subir sua eficiência de ${eficiencia.toFixed(0)}% para ${sim100.eficiencia100.toFixed(0)}%!`
                                    : `Bobina atual (${currentRollW}cm) parece adequada.`
                                : `Corte em 1,52m calculado com ${eficiencia.toFixed(0)}% de aproveitamento.`}
                        </p>
                        <p className="text-[11px] text-gray-400">
                            Clique em &ldquo;Analisar com IA&rdquo; para ver o parecer comercial completo e retalhos nobres.
                        </p>
                    </div>

                    {isNanoCeramica && sim100?.fitsAllPieces && currentRollW === 152 && sim100.eficiencia100 > eficiencia && (
                        <button
                            type="button"
                            onClick={() => onSwitchRollW(100)}
                            className="px-3.5 py-2 rounded-xl bg-[#c9a227] hover:bg-[#dfb42f] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all shadow-md shadow-[#c9a227]/20"
                        >
                            Trocar para 1,00m <ArrowRight size={13} />
                        </button>
                    )}
                </div>
            )}

            {/* Resultado da Análise da IA */}
            {analysis && !isLoading && (
                <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-start gap-3 bg-[#040811] p-3.5 rounded-xl border border-white/10">
                        <div className="mt-0.5">
                            {analysis.status === 'excelente' ? (
                                <CheckCircle2 size={18} className="text-emerald-400" />
                            ) : analysis.status === 'oportunidade' ? (
                                <TrendingUp size={18} className="text-[#c9a227]" />
                            ) : (
                                <AlertTriangle size={18} className="text-amber-400" />
                            )}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                    {analysis.titulo}
                                </h4>
                                <span
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                        analysis.status === 'excelente'
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            : analysis.status === 'oportunidade'
                                            ? 'bg-[#c9a227]/20 text-[#c9a227] border border-[#c9a227]/30'
                                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    }`}
                                >
                                    {analysis.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed">
                                {analysis.diagnostico}
                            </p>
                        </div>
                    </div>

                    {/* Ação de Troca de Bobina Sugerida */}
                    {analysis.sugestaoBobina?.sugerirTroca && analysis.sugestaoBobina.novaLargura && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/40">
                            <div className="text-xs">
                                <span className="font-bold text-[#c9a227] block">
                                    Sugestão de Bobina Bluetech:
                                </span>
                                <span className="text-gray-300 text-[11px]">
                                    {analysis.sugestaoBobina.motivo}
                                    {analysis.sugestaoBobina.economiaEstimada && (
                                        <strong className="text-white ml-1">
                                            ({analysis.sugestaoBobina.economiaEstimada})
                                        </strong>
                                    )}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => onSwitchRollW(analysis.sugestaoBobina.novaLargura!)}
                                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#c9a227] hover:bg-[#dfb42f] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0 transition-all shadow-md shadow-[#c9a227]/20"
                            >
                                Mudar para Bobina de {analysis.sugestaoBobina.novaLargura}cm
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    )}

                    {/* Destaque de Retalho Nobre */}
                    {analysis.retalhoDestaque?.existe && (
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-200">
                            <Box size={16} className="text-blue-400 shrink-0" />
                            <div className="flex-1">
                                <span className="font-bold text-blue-300">Retalho Nobre: </span>
                                <span className="text-gray-300 text-[11px]">
                                    {analysis.retalhoDestaque.descricao} —{' '}
                                    <em className="text-blue-200">{analysis.retalhoDestaque.usoSugerido}</em>
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
            </div>
        </div>
    );
}

