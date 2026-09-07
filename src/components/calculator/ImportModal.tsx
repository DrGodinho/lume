'use client';

import React from 'react';
import { Smartphone, X } from 'lucide-react';

interface ImportModalProps {
    show: boolean;
    code: string;
    setCode: (v: string) => void;
    error: string | null;
    onClose: () => void;
    onImport: () => void;
}

/** Modal de importação Zap (substitui `prompt` + `alert` de erro). */
export function ImportModal({ show, code, setCode, error, onClose, onImport }: ImportModalProps) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#111e33] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Smartphone size={16} className="text-[#25d366]" />
                        Importar do Zap
                    </h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <label className="block text-[10px] uppercase text-gray-400 font-bold mb-2">
                    Código de importação
                </label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            onImport();
                        }
                    }}
                    rows={4}
                    autoFocus
                    placeholder="Cole o código aqui…"
                    className="w-full bg-[#040811] border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#25d366]/50 font-mono resize-none"
                />
                {error && (
                    <p role="alert" className="mt-2 text-[11px] font-bold text-red-400">
                        {error}
                    </p>
                )}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-white/5 border border-white/10 text-gray-300 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-white/10 hover:text-white transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onImport}
                        disabled={!code.trim()}
                        className="flex-1 bg-[#25d366]/20 border border-[#25d366]/40 text-[#25d366] py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-[#25d366]/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Importar
                    </button>
                </div>
            </div>
        </div>
    );
}
