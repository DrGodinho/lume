'use client';

import React, { useRef, useState, useMemo } from 'react';
import { formatNumber2 } from '../../lib/money';
import type { Block } from '../../lib/films';

const MemoBlock = React.memo(({
    b,
    scale,
    isSelected,
    toggleSelection,
    selectSameSize,
    index,
}: {
    b: Block;
    scale: number;
    isSelected: boolean;
    toggleSelection: (id: string) => void;
    selectSameSize: (oh: number, ow: number, label?: string) => void;
    index: number;
}) => {
    const pos = b.fit!;
    const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        pointerStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!pointerStartRef.current) return;
        const dx = Math.abs(e.clientX - pointerStartRef.current.x);
        const dy = Math.abs(e.clientY - pointerStartRef.current.y);
        pointerStartRef.current = null;
        if (dx < 10 && dy < 10) {
            toggleSelection(b.id);
        }
    };

    const handleDoubleClick = () => {
        selectSameSize(b.rh, b.rw, b.label);
    };

    const heightPx = b.rh * scale;
    const widthPx = b.rw * scale;
    const minDim = Math.min(widthPx, heightPx);

    // Escala proporcional ao tamanho do vidro: preserva tamanho grande para boa visualização
    // e reduz suavemente para vidros compactos ou estreitos, evitando sobreposição
    const baseFont = Math.max(8, Math.min(32, Math.round(minDim * 0.22)));
    const heightFont = Math.max(8, Math.min(baseFont, Math.round(heightPx * 0.35)));
    const widthFont = Math.max(8, Math.min(baseFont, Math.round(widthPx * 0.35)));
    const labelFont = Math.max(10, Math.min(32, Math.round(minDim * 0.38)));

    const isCompact = minDim < 70;
    const isUltraCompact = minDim < 45;

    const showHeightText = heightPx >= 24 || isSelected;
    const showWidthText = widthPx >= 24 || isSelected;

    const badgeClass = `bg-white/90 backdrop-blur-sm text-black font-black shadow-sm flex items-center justify-center whitespace-nowrap leading-none select-none ${
        isUltraCompact
            ? 'px-1 py-0.5 rounded-[2px]'
            : isCompact
            ? 'px-1.5 py-0.5 rounded'
            : 'px-2.5 py-1 rounded-md'
    }`;

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            className="absolute flex items-center justify-center text-black font-bold group rounded-sm overflow-hidden"
            style={{
                left: pos.x * scale,
                top: pos.y * scale,
                width: b.rw * scale,
                height: b.rh * scale,
                background: b.cor,
                border: isSelected ? '2px solid #3b82f6' : '1px solid rgba(0,0,0,0.15)',
                boxShadow: isSelected ? '0 0 15px rgba(59,130,246,0.8)' : 'inset 0 0 10px rgba(255,255,255,0.2)',
                zIndex: isSelected ? 20 : 10,
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                touchAction: 'pan-y',
            }}
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 px-1 overflow-hidden">
                <span
                    className="font-black text-black select-none tracking-tighter mix-blend-overlay truncate text-center max-w-full leading-none"
                    style={{ fontSize: labelFont }}
                >
                    {b.label || index}
                </span>
            </div>

            {showHeightText && (
                <div className={`absolute ${isCompact ? 'left-0.5' : 'left-1'} top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none origin-center`}>
                    <div
                        className={badgeClass}
                        style={{ fontSize: heightFont }}
                    >
                        {Number(b.rh.toFixed(2))}
                    </div>
                </div>
            )}

            {showWidthText && (
                <div className={`absolute ${isCompact ? 'bottom-0.5 right-0.5' : 'bottom-1 right-1'} pointer-events-none`}>
                    <div
                        className={badgeClass}
                        style={{ fontSize: widthFont }}
                    >
                        {Number(b.rw.toFixed(2))}
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 pointer-events-none transition-colors duration-200" />
        </div>
    );
});

interface CutMapProps {
    isCutMode: boolean;
    rollW: number;
    maxY: number;
    scale: number;
    margin?: number;
    isCalculating: boolean;
    containerWidth: number;
    blocosCalculados: Block[];
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    selectSameSize: (oh: number, ow: number, label?: string) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export function CutMap({
    rollW,
    maxY,
    scale,
    margin = 0,
    isCalculating,
    containerWidth,
    blocosCalculados,
    selectedIds,
    toggleSelection,
    selectSameSize,
    containerRef,
}: CutMapProps) {
    const [activeCutY, setActiveCutY] = useState<number | null>(null);

    // Detecta linhas de corte contínuas considerando a margem de corte entre os lotes/peças
    const cutLines = useMemo(() => {
        if (!blocosCalculados || blocosCalculados.length === 0 || maxY <= 0) return [];

        const candidateYs = new Set<number>();
        for (const b of blocosCalculados) {
            if (b.fit) {
                // Fim da peça + margem de corte definida na calculadora
                const withMarginY = Math.round((b.fit.y + b.rh + margin) * 100) / 100;
                if (withMarginY > 1 && withMarginY < maxY - 0.5) {
                    candidateYs.add(withMarginY);
                }
                // Início da próxima fileira de peças
                const startY = Math.round(b.fit.y * 100) / 100;
                if (startY > 1 && startY < maxY - 0.5) {
                    candidateYs.add(startY);
                }
            }
        }

        const validLines: number[] = [];
        for (const y of Array.from(candidateYs).sort((a, b) => a - b)) {
            // Nenhuma peça pode ser interceptada no meio por esta linha
            const hasIntersection = blocosCalculados.some((b) => {
                if (!b.fit) return false;
                const bStartY = b.fit.y;
                const bEndY = b.fit.y + b.rh;
                return bStartY < y - 0.05 && bEndY > y + 0.05;
            });

            if (hasIntersection) continue;

            // Deve haver peças antes e depois da linha para ser uma divisão válida
            const hasBefore = blocosCalculados.some((b) => b.fit && (b.fit.y + b.rh) <= y + 0.05);
            const hasAfter = blocosCalculados.some((b) => b.fit && b.fit.y >= y - 0.05);

            if (hasBefore && hasAfter) {
                validLines.push(y);
            }
        }

        return validLines;
    }, [blocosCalculados, maxY, margin]);

    // Resumo do corte selecionado para a pílula
    const cutLineDetails = useMemo(() => {
        if (activeCutY === null || !blocosCalculados) return null;

        const pecasAntes: Block[] = [];
        const pecasDepois: Block[] = [];

        for (const b of blocosCalculados) {
            if (!b.fit) continue;
            const endY = b.fit.y + b.rh;
            if (endY <= activeCutY + 0.05) {
                pecasAntes.push(b);
            } else if (b.fit.y >= activeCutY - 0.05) {
                pecasDepois.push(b);
            }
        }

        const areaAntes = pecasAntes.reduce((acc, b) => acc + (b.rw * b.rh) / 10000, 0);
        const areaDepois = pecasDepois.reduce((acc, b) => acc + (b.rw * b.rh) / 10000, 0);

        return {
            distanciaM: activeCutY / 100,
            restanteM: Math.max(0, (maxY - activeCutY) / 100),
            totalM: maxY / 100,
            qtdAntes: pecasAntes.length,
            areaAntes,
            qtdDepois: pecasDepois.length,
            areaDepois,
        };
    }, [activeCutY, blocosCalculados, maxY]);

    return (
        <div className="admin-entrance bg-[#111827] border-2 border-[#c9a227]/25 rounded-xl overflow-hidden shadow-2xl relative min-h-[500px]">
            <div className="absolute top-0 left-0 w-full bg-[#1f2937] text-gray-200 text-[10px] uppercase font-bold flex justify-between px-3 py-1.5 z-10 border-b border-gray-700">
                <span className="flex items-center gap-2">
                    0cm
                </span>
                <span className="flex items-center gap-2">
                    {isCalculating && <span className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse inline-block" title="Calculando..." />}
                    Rolo: {rollW}cm · réguas em cm
                </span>
            </div>
            <div className="w-full h-full overflow-y-auto p-2 pt-8 pr-10 sm:pr-14 pb-12 overflow-x-hidden">
                <div className="relative pl-8 pt-8 w-full max-w-full">
                    {/* Régua Superior (cm) */}
                    <div className="absolute top-0 left-8 right-0 h-8 border-b border-white/40">
                        {Array.from({ length: Math.floor(rollW / 10) + 1 }).map((_, i) => {
                            const val = i * 10;
                            const isMajor = val % 50 === 0 || val === rollW || val === 0;
                            if (val > rollW) return null;
                            return (
                                <div key={val} className="absolute bottom-0 flex flex-col items-center -translate-x-1/2" style={{ left: `${(val / rollW) * 100}%` }}>
                                    {isMajor && <span className="text-[10px] text-gray-200 font-black mb-0.5">{val}</span>}
                                    <div className={`w-px bg-white/50 ${isMajor ? 'h-3' : 'h-2'}`} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Régua Lateral (cm) */}
                    <div className="absolute top-8 left-0 w-8 border-r border-white/40" style={{ height: `${(maxY / rollW) * containerWidth + 40}px` }}>
                        {Array.from({ length: Math.floor(maxY / 10) + 1 }).map((_, i) => {
                            const val = i * 10;
                            const isMajor = val % 50 === 0 || val === 0;
                            return (
                                <div
                                    key={val}
                                    className="absolute right-0 h-4 flex items-center justify-end -translate-y-1/2 pointer-events-none"
                                    style={{ top: val * scale }}
                                >
                                    {isMajor && (
                                        <span className="text-[10px] text-gray-200 font-black mr-1.5 leading-none select-none">
                                            {val}
                                        </span>
                                    )}
                                    <div className={`h-px bg-white/50 ${isMajor ? 'w-3' : 'w-2'}`} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Contador de Comprimento Total (Pílula) */}
                    {maxY > 0 && (
                        <div
                            className="absolute right-[-45px] origin-center flex items-center justify-center z-20 pointer-events-none"
                            style={{ top: 32 + ((maxY * scale) / 2), transform: 'translateY(-50%) rotate(90deg)' }}
                        >
                            <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-white/20 flex items-center pr-1 pl-3 py-1 gap-2">
                                <span className="text-[10px] font-black tracking-widest text-black/50 uppercase">Compr.</span>
                                <span className="bg-black text-white px-2 py-0.5 rounded-full text-xs font-black">
                                    {formatNumber2(maxY / 100)} m
                                </span>
                            </div>
                        </div>
                    )}

                    <div
                        ref={containerRef}
                        onClick={() => {
                            if (activeCutY !== null) setActiveCutY(null);
                        }}
                        className="relative w-full bg-white/5 shadow-inner"
                        style={{
                            height: `${(maxY / rollW) * containerWidth + 40}px`,
                            userSelect: 'none',
                        }}
                    >
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: `${10 * scale}px ${10 * scale}px` }} />
                        {blocosCalculados.map((b, idx) => (
                            b.fit && (
                                <MemoBlock
                                    key={b.id}
                                    b={b}
                                    scale={scale}
                                    isSelected={selectedIds.includes(b.id)}
                                    toggleSelection={toggleSelection}
                                    selectSameSize={selectSameSize}
                                    index={idx + 1}
                                />
                            )
                        ))}

                        {/* Linhas de corte guilhotina invisíveis (clicáveis com feedback sutil de hover) */}
                        {cutLines.map((y) => {
                            const isSelectedLine = activeCutY === y;
                            return (
                                <div
                                    key={y}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveCutY(isSelectedLine ? null : y);
                                    }}
                                    className="absolute left-0 right-0 h-6 -translate-y-1/2 cursor-pointer z-30 group pointer-events-auto flex items-center"
                                    style={{ top: y * scale }}
                                    title={`Linha de corte seguro: ${formatNumber2(y / 100)}m (clique para ver detalhes)`}
                                >
                                    <div
                                        className={`w-full h-px transition-all duration-200 ${
                                            isSelectedLine
                                                ? 'bg-[#c9a227] shadow-[0_0_10px_#c9a227]'
                                                : 'border-b border-dashed border-[#c9a227]/0 group-hover:border-[#c9a227]/70'
                                        }`}
                                    />
                                    <div
                                        className={`absolute right-2 px-2 py-0.5 rounded text-[10px] font-black tracking-wider transition-opacity duration-200 pointer-events-none flex items-center gap-1 ${
                                            isSelectedLine
                                                ? 'bg-[#c9a227] text-black shadow'
                                                : 'bg-black/80 text-[#c9a227] border border-[#c9a227]/40 opacity-0 group-hover:opacity-100'
                                        }`}
                                    >
                                        <span>✂️</span>
                                        <span>{formatNumber2(y / 100)}m</span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Pílula flutuante detalhada na linha de corte selecionada */}
                        {activeCutY !== null && cutLineDetails && (
                            <div
                                className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
                                style={{
                                    top: activeCutY * scale,
                                    transform: 'translate(-50%, -50%)',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-[#0b1329]/95 backdrop-blur-md border-2 border-[#c9a227] rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.85)] text-white w-[310px] sm:w-[360px] animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
                                        <div className="flex items-center gap-2">
                                            <span className="p-1 rounded bg-[#c9a227]/20 text-[#c9a227] text-xs">✂️</span>
                                            <span className="text-xs font-black uppercase tracking-wider text-[#c9a227]">Linha de Corte Guilhotina</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveCutY(null);
                                            }}
                                            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors text-xs font-bold leading-none"
                                            title="Fechar"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">Ponto de Corte</span>
                                            <span className="text-lg font-black text-white">{formatNumber2(cutLineDetails.distanciaM)} <span className="text-xs text-[#c9a227]">m</span></span>
                                            <span className="text-[9px] text-gray-400 block mt-0.5">do início do rolo</span>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-0.5">Restante</span>
                                            <span className="text-lg font-black text-white">{formatNumber2(cutLineDetails.restanteM)} <span className="text-xs text-gray-400">m</span></span>
                                            <span className="text-[9px] text-gray-400 block mt-0.5">de {formatNumber2(cutLineDetails.totalM)} m total</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-[#c9a227]/10 border border-[#c9a227]/30 rounded-xl p-2.5">
                                            <div className="flex items-center gap-1 text-[11px] font-black text-[#c9a227] mb-1">
                                                <span>⬆️</span> Rolo 1 (Antes)
                                            </div>
                                            <p className="font-extrabold text-white text-sm">{cutLineDetails.qtdAntes} <span className="text-[10px] font-medium text-gray-300">peças</span></p>
                                            <p className="text-[10px] text-gray-300 mt-0.5">{formatNumber2(cutLineDetails.areaAntes)} m²</p>
                                        </div>
                                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-2.5">
                                            <div className="flex items-center gap-1 text-[11px] font-black text-blue-400 mb-1">
                                                <span>⬇️</span> Rolo 2 (Depois)
                                            </div>
                                            <p className="font-extrabold text-white text-sm">{cutLineDetails.qtdDepois} <span className="text-[10px] font-medium text-gray-300">peças</span></p>
                                            <p className="text-[10px] text-gray-300 mt-0.5">{formatNumber2(cutLineDetails.areaDepois)} m²</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
