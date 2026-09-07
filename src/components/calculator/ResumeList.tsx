'use client';

import React from 'react';
import { Trash2, Layers, Pencil } from 'lucide-react';
import type { GlassItem } from '../../lib/films';
import type { ResumoItem } from '../../lib/grouping';
import { groupByAmbiente } from '../../lib/grouping';

export interface ResumeListaProps {
    resumo: ResumoItem[];
    vidros: GlassItem[];
    selectedIds: string[];
    getColorForItem: (label?: string, h?: number, w?: number, forceRoomScheme?: boolean) => string;
    onRemoverTudoTipo: (h: number, w: number, label?: string) => void;
}

export interface ResumeRenameProps {
    editingAmbiente: string | null;
    editNome: string;
    renameError: string | null;
    editInputRef: React.RefObject<HTMLInputElement | null>;
    onEditNomeChange: (v: string) => void;
    onConfirmarRenomeacao: () => void;
    onCancelarRenomeacao: () => void;
    onIniciarRenomeacao: (label: string) => void;
}

export interface ResumeSelectionProps {
    onToggleAmbienteSelection: (ambiente: string) => void;
}

interface ResumeListProps {
    listaProps: ResumeListaProps;
    renameProps: ResumeRenameProps;
    selectionProps: ResumeSelectionProps;
}

export function ResumeList({
    listaProps,
    renameProps,
    selectionProps,
}: ResumeListProps) {
    const { resumo, vidros, selectedIds, getColorForItem, onRemoverTudoTipo } = listaProps;
    const {
        editingAmbiente, editNome, renameError, editInputRef,
        onEditNomeChange, onConfirmarRenomeacao, onCancelarRenomeacao, onIniciarRenomeacao,
    } = renameProps;
    const { onToggleAmbienteSelection } = selectionProps;
    return (
        <div className="admin-entrance bg-[#080d16] border-2 border-[#c9a227]/20 rounded-2xl p-3 max-h-60 overflow-y-auto space-y-4">
            {Object.entries(groupByAmbiente(resumo)).map(([ambiente, itens]) => (
                <div key={ambiente} className="space-y-1">
                    <div className="text-[9px] font-bold text-[#c9a227] uppercase tracking-widest px-1 mb-1.5 opacity-90 flex items-center justify-between">
                        {editingAmbiente === ambiente ? (
                            <>
                            <input
                                ref={editInputRef}
                                type="text"
                                value={editNome}
                                onChange={(e) => onEditNomeChange(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') { e.preventDefault(); onConfirmarRenomeacao(); }
                                    if (e.key === 'Escape') { onCancelarRenomeacao(); }
                                }}
                                onBlur={onConfirmarRenomeacao}
                                autoFocus
                                className="bg-[#040811] border border-[#c9a227]/50 rounded px-2 py-0.5 text-[#c9a227] text-[9px] uppercase tracking-widest font-bold outline-none min-w-[80px] flex-1"
                            />
                            {renameError && (
                                <span role="alert" className="text-[9px] font-bold text-red-400 normal-case tracking-normal">
                                    {renameError}
                                </span>
                            )}
                            </>
                        ) : (
                            <div
                                className="flex items-center gap-1.5 cursor-pointer"
                                onClick={() => onToggleAmbienteSelection(ambiente)}
                                title="Selecionar ambiente"
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
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const tgt = ambiente === 'Sem Ambiente' ? '' : ambiente;
                                        onIniciarRenomeacao(tgt);
                                    }}
                                    className="p-1 text-[#c9a227]/60 hover:text-[#c9a227] hover:bg-[#c9a227]/10 rounded transition-colors"
                                    title="Renomear ambiente"
                                >
                                    <Pencil size={12} />
                                </button>
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
                            onChange={() => onToggleAmbienteSelection(ambiente)}
                            title="Selecionar ambiente"
                        />
                    </div>
                    {itens.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-[#040811] rounded-lg border border-white/5">
                            <span className="text-xs"><b>{item.q}x</b> {item.h} x {item.w} cm</span>
                            <button onClick={() => onRemoverTudoTipo(item.h, item.w, item.label)} className="text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
