'use client';

import React, { useState } from 'react';
import { Scissors, X, User } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

interface CutModeToolbarProps {
    isCutMode: boolean;
    onEnterCutMode: () => void;
    onExitCutMode: () => void;
    onCriarLead: () => void;
}

export function CutModeToolbar({
    isCutMode,
    onEnterCutMode,
    onExitCutMode,
    onCriarLead,
}: CutModeToolbarProps) {
    const [confirmExit, setConfirmExit] = useState(false);
    return (
        <div className="flex items-center justify-end mb-4 w-full gap-2">
            <ConfirmDialog
                show={confirmExit}
                title="Sair do modo de corte?"
                message="Suas peças originais serão restauradas."
                confirmLabel="Sair"
                danger
                onConfirm={() => {
                    onExitCutMode();
                    setConfirmExit(false);
                }}
                onCancel={() => setConfirmExit(false)}
            />
            {isCutMode ? (
                <button
                    onClick={() => setConfirmExit(true)}
                    className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase shadow-lg hover:bg-red-500/30 transition-all active:scale-95"
                >
                    <X size={14} /> Sair do Modo de Corte
                </button>
            ) : (
                <button
                    onClick={onEnterCutMode}
                    className="flex items-center gap-2 bg-[#1a2c4e] text-blue-300 px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase shadow-lg hover:brightness-110 transition-all active:scale-95"
                >
                    <Scissors size={14} /> Modo de Corte
                </button>
            )}
            <button
                onClick={onCriarLead}
                className="flex items-center gap-2 bg-gradient-to-r from-[#c9a227] to-[#d4ad30] text-black px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase shadow-lg hover:brightness-110 transition-all active:scale-95"
            >
                <User size={14} /> Criar Lead
            </button>
        </div>
    );
}
