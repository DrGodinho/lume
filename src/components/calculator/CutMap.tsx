'use client';

import React, { useRef } from 'react';
import type { Block } from '../../views/AdminCalculator';

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
    const heightFont = Math.max(9, Math.min(34, Math.round(heightPx * 0.42)));
    const widthFont = Math.max(9, Math.min(34, Math.round(widthPx * 0.42)));
    const showHeightText = heightPx >= 32 || isSelected;
    const showWidthText = widthPx >= 32 || isSelected;

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
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 px-2 overflow-hidden">
                <span className="text-[3vw] sm:text-[2vw] lg:text-[2rem] font-black text-black select-none tracking-tighter mix-blend-overlay truncate text-center max-w-full leading-none">
                    {b.label || index}
                </span>
            </div>

            {showHeightText && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none">
                    <div
                        className="bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded-md font-black shadow-sm flex items-center justify-center whitespace-nowrap"
                        style={{ fontSize: heightFont }}
                    >
                        {Number(b.rh.toFixed(2))}
                    </div>
                </div>
            )}

            {showWidthText && (
                <div className="absolute bottom-1 right-1 pointer-events-none">
                    <div
                        className="bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded-md font-black shadow-sm flex items-center justify-center whitespace-nowrap"
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
    isCalculating: boolean;
    containerWidth: number;
    blocosCalculados: Block[];
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    selectSameSize: (oh: number, ow: number, label?: string) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export function CutMap({
    isCutMode,
    rollW,
    maxY,
    scale,
    isCalculating,
    containerWidth,
    blocosCalculados,
    selectedIds,
    toggleSelection,
    selectSameSize,
    containerRef,
}: CutMapProps) {
    return (
        <div className="admin-entrance bg-[#111827] border-2 border-[#c9a227]/25 rounded-xl overflow-hidden shadow-2xl relative min-h-[500px]">
            <div className="absolute top-0 left-0 w-full bg-[#1f2937] text-gray-400 text-[10px] uppercase font-bold flex justify-between px-3 py-1.5 z-10 border-b border-gray-700">
                <span className="flex items-center gap-2">
                    0cm
                </span>
                <span className="flex items-center gap-2">
                    {isCalculating && <span className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse inline-block" title="Calculando..." />}
                    Rolo: {rollW}cm
                </span>
            </div>
            <div className="w-full h-full overflow-y-auto p-2 pt-8 pr-10 sm:pr-14 pb-12 overflow-x-hidden">
                <div className="relative pl-7 sm:pl-8 pt-8 w-full max-w-full">
                    {/* Régua Superior (Rolo Width) */}
                    <div className="absolute top-0 left-8 right-0 h-8 border-b border-white/20">
                        {Array.from({ length: Math.floor(rollW / 10) + 1 }).map((_, i) => {
                            const val = i * 10;
                            const isMajor = val % 50 === 0 || val === rollW || val === 0;
                            if (val > rollW) return null;
                            return (
                                <div key={val} className="absolute bottom-0 flex flex-col items-center -translate-x-1/2" style={{ left: `${(val / rollW) * 100}%` }}>
                                    {isMajor && <span className="text-[10px] text-gray-400 font-black mb-0.5">{val}</span>}
                                    <div className={`w-px bg-white/30 ${isMajor ? 'h-2.5' : 'h-1.5'}`} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Régua Lateral (Altura Linear) */}
                    <div className="absolute top-8 left-0 w-8 border-r border-white/20" style={{ height: `${(maxY / rollW) * containerWidth + 40}px` }}>
                        {Array.from({ length: Math.floor(maxY / 10) + 1 }).map((_, i) => {
                            const val = i * 10;
                            const isMajor = val % 50 === 0 || val === 0;
                            return (
                                <div key={val} className="absolute right-0 flex items-center translate-y-1/2" style={{ top: val * scale }}>
                                    {isMajor && <span className="text-[10px] text-gray-400 font-black mr-1.5">{val / 100}</span>}
                                    <div className={`h-px bg-white/30 ${isMajor ? 'w-2.5' : 'w-1.5'}`} />
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
                                    {(maxY / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} m
                                </span>
                            </div>
                        </div>
                    )}

                    <div
                        ref={containerRef}
                        className="relative w-full bg-white/5 shadow-inner"
                        style={{
                            height: `${(maxY / rollW) * containerWidth + 40}px`,
                            userSelect: 'none',
                        }}
                    >
                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: `${10 * scale}px ${10 * scale}px` }} />
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
                    </div>
                </div>
            </div>
        </div>
    );
}
