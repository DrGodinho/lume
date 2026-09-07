'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    show: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

/** Diálogo de confirmação do DS (substitui `window.confirm`). */
export function ConfirmDialog({
    show,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    danger = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-[#111e33] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle size={16} className={danger ? 'text-red-400' : 'text-[#c9a227]'} />
                        {title}
                    </h3>
                    <button onClick={onCancel} className="p-1 text-gray-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-5">{message}</p>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-white/5 border border-white/10 text-gray-300 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-white/10 hover:text-white transition-all"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all active:scale-95 ${
                            danger
                                ? 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
                                : 'bg-[#c9a227] text-black hover:brightness-110'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
