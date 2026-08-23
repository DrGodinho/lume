'use client';

import React from 'react';
import { Trash2, Layers } from 'lucide-react';
import type { GlassItem } from '../../views/AdminCalculator';
import type { ResumoItem } from './ColarModal';

interface ResumeListProps {
    resumo: ResumoItem[];
    vidros: GlassItem[];
    selectedIds: string[];
    editingAmbiente: string | null;
    editNome: string;
    setEditNome: (v: string) => void;
    setEditingAmbiente: (v: string | null) => void;
    editInputRef: React.RefObject<HTMLInputElement | null>;
    confirmarRenomeacao: () => void;
    iniciarRenomeacao: (label: string) => void;
    toggleAmbienteSelection: (ambiente: string) => void;
    removerTudoTipo: (h: number, w: number, label?: string) => void;
    getColorForItem: (label?: string, h?: number, w?: number, forceRoomScheme?: boolean) => string;
}

export function ResumeList({
    resumo,
    vidros,
    selectedIds,
    editingAmbiente,
    editNome,
    setEditNome,
    setEditingAmbiente,
    editInputRef,
    confirmarRenomeacao,
    iniciarRenomeacao,
    toggleAmbienteSelection,
    removerTudoTipo,
    getColorForItem,
}: ResumeListProps) {
    return (
        <div className="admin-entrance bg-[#080d16] border-2 border-[#c9a227]/20 rounded-2xl p-3 max-h-60 overflow-y-auto space-y-4">
            {Object.entries(
                resumo.reduce((acc, item) => {
                    const lbl = item.label || 'Sem Ambiente';
                    if (!acc[lbl]) acc[lbl] = [];
                    acc[lbl].push(item);
                    return acc;
                }, {} as globalThis.Record<string, ResumoItem[]>)
            ).map(([ambiente, itens], idxGrp) => (
                <div key={idxGrp} className="space-y-1">
                    <div className="text-[9px] font-bold text-[#c9a227] uppercase tracking-widest px-1 mb-1.5 opacity-90 flex items-center justify-between">
                        {editingAmbiente === ambiente ? (
                            <input
                                ref={editInputRef}
                                type="text"
                                value={editNome}
                                onChange={(e) => setEditNome(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') { e.preventDefault(); confirmarRenomeacao(); }
                                    if (e.key === 'Escape') { setEditingAmbiente(null); setEditNome(''); }
                                }}
                                onBlur={confirmarRenomeacao}
                                autoFocus
                                className="bg-[#040811] border border-[#c9a227]/50 rounded px-2 py-0.5 text-[#c9a227] text-[9px] uppercase tracking-widest font-bold outline-none min-w-[80px] flex-1"
                            />
                        ) : (
                            <div
                                className="flex items-center gap-1.5 cursor-pointer"
                                onClick={() => {
                                    const tgt = ambiente === 'Sem Ambiente' ? '' : ambiente;
                                    const pts = vidros.filter(v => (v.label || '') === tgt);
                                    const allSelected = pts.length > 0 && pts.every(v => selectedIds.includes(v.id));
                                    if (allSelected) {
                                        iniciarRenomeacao(pts[0].label || '');
                                    } else {
                                        toggleAmbienteSelection(ambiente);
                                    }
                                }}
                            >
                                <span
                                    className="w-2.5 h-2.5 rounded-full border border-white/40"
                                    style={{
                                        backgroundColor: (() => {
                                            const tgt = ambiente === 'Sem Ambiente' ? '' : ambiente;
                                            const first = vidros.find(v => (v.label || '') === tgt);
                                            return first?.cor || getColorForItem(tgt);
                                        })()
                                    }}
                                />
                                <Layers size={10} /> {ambiente}
                            </div>
                        )}
                        <input
                            type="checkbox"
                            className="w-3 h-3 accent-[#c9a227] cursor-pointer"
                            checked={(() => {
                                const tgt = ambiente === 'Sem Ambiente' ? '' : ambiente;
                                const pts = vidros.filter(v => (v.label || '') === tgt);
                                return pts.length > 0 && pts.every(v => selectedIds.includes(v.id));
                            })()}
                            onChange={() => toggleAmbienteSelection(ambiente)}
                        />
                    </div>
                    {itens.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-[#040811] rounded-lg border border-white/5">
                            <span className="text-xs"><b>{item.q}x</b> {item.h} x {item.w} cm</span>
                            <button onClick={() => removerTudoTipo(item.h, item.w, item.label)} className="text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
