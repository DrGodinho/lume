'use client';

import React from 'react';
import { Scissors, X, User } from 'lucide-react';
import type { GlassItem } from '../../views/AdminCalculator';

interface CutModeToolbarProps {
    isCutMode: boolean;
    vidros: GlassItem[];
    vidrosBackup: GlassItem[];
    setVidros: (updater: GlassItem[] | ((prev: GlassItem[]) => GlassItem[])) => void;
    setIsCutMode: (v: boolean) => void;
    setVidrosBackup: (v: GlassItem[]) => void;
    criarLead: () => void;
}

export function CutModeToolbar({
    isCutMode,
    vidros,
    vidrosBackup,
    setVidros,
    setIsCutMode,
    setVidrosBackup,
    criarLead,
}: CutModeToolbarProps) {
    return (
        <div className="flex items-center justify-end mb-4 w-full gap-2">
            {isCutMode ? (
                <button
                    onClick={() => {
                        if (window.confirm("Deseja sair do modo de corte? Suas peças originais serão restauradas.")) {
                            setVidros(vidrosBackup);
                            setIsCutMode(false);
                            setVidrosBackup([]);
                        }
                    }}
                    className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase shadow-lg hover:bg-red-500/30 transition-all active:scale-95"
                >
                    <X size={14} /> Sair do Modo de Corte
                </button>
            ) : (
                <button
                    onClick={() => {
                        setVidrosBackup(vidros);
                        setIsCutMode(true);
                    }}
                    className="flex items-center gap-2 bg-[#1a2c4e] text-blue-300 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase shadow-lg hover:brightness-110 transition-all active:scale-95"
                >
                    <Scissors size={14} /> Modo de Corte
                </button>
            )}
            <button
                onClick={criarLead}
                className="flex items-center gap-2 bg-gradient-to-r from-[#c9a227] to-[#d4ad30] text-black px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase shadow-lg hover:brightness-110 transition-all active:scale-95"
            >
                <User size={14} /> Criar Lead
            </button>
        </div>
    );
}
