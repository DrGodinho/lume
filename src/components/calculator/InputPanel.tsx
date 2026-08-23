'use client';

import React from 'react';
import { Smartphone, Save, FolderOpen, Layers, X, Plus } from 'lucide-react';
import type { GlassItem, FilmTypeKey } from '../../views/AdminCalculator';
import { ROOM_COLOR_SWATCHES, FILM_TYPE_LABELS, FILM_TYPE_KEYS } from '../../views/AdminCalculator';

interface InputPanelProps {
    vidros: GlassItem[];
    cliente: string;
    setCliente: (v: string) => void;
    phone: string;
    setPhone: (v: string) => void;
    neighborhood: string;
    setNeighborhood: (v: string) => void;
    importarZap: () => void;
    salvarProjeto: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    abrirProjeto: (e: React.ChangeEvent<HTMLInputElement>) => void;
    rollW: number;
    setRollW: (v: number) => void;
    selectedFilm: FilmTypeKey;
    setSelectedFilm: (v: FilmTypeKey) => void;
    margin: number;
    setMargin: (v: number) => void;
    price: number;
    labelIn: string;
    setLabelIn: (v: string) => void;
    usarCoresPorAmbiente: boolean;
    setUsarCoresPorAmbiente: (v: boolean) => void;
    setVidros: (updater: GlassItem[] | ((prev: GlassItem[]) => GlassItem[])) => void;
    getColorForItem: (label?: string, h?: number, w?: number, forceRoomScheme?: boolean) => string;
    currentRoomColor: string;
    currentRoomKey: string;
    currentRoomLabel: string;
    roomColors: Record<string, string>;
    setRoomColors: (updater: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
    aplicarCorNoAmbiente: (ambiente: string) => void;
    hasCurrentRoomPieces: boolean;
    heightRef: React.RefObject<HTMLInputElement | null>;
    widthRef: React.RefObject<HTMLInputElement | null>;
    qtyRef: React.RefObject<HTMLInputElement | null>;
    onHeightKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onWidthKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onQtyKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    heightIn: string;
    setHeightIn: (v: string) => void;
    widthIn: string;
    setWidthIn: (v: string) => void;
    qtyIn: string;
    setQtyIn: (v: string) => void;
    adicionar: () => void;
    limparTudo: () => void;
}

export function InputPanel({
    vidros,
    cliente,
    setCliente,
    phone,
    setPhone,
    neighborhood,
    setNeighborhood,
    importarZap,
    salvarProjeto,
    fileInputRef,
    abrirProjeto,
    rollW,
    setRollW,
    selectedFilm,
    setSelectedFilm,
    margin,
    setMargin,
    price,
    labelIn,
    setLabelIn,
    usarCoresPorAmbiente,
    setUsarCoresPorAmbiente,
    setVidros,
    getColorForItem,
    currentRoomColor,
    currentRoomKey,
    currentRoomLabel,
    roomColors,
    setRoomColors,
    aplicarCorNoAmbiente,
    hasCurrentRoomPieces,
    heightRef,
    widthRef,
    qtyRef,
    onHeightKeyDown,
    onWidthKeyDown,
    onQtyKeyDown,
    heightIn,
    setHeightIn,
    widthIn,
    setWidthIn,
    qtyIn,
    setQtyIn,
    adicionar,
    limparTudo,
}: InputPanelProps) {
    return (
        <React.Fragment>
            <div className="admin-entrance bg-[#0a0e17] border-2 border-[#c9a227]/30 rounded-2xl p-5 shadow-2xl">
                <label className="block text-[10px] uppercase text-[#c9a227] mb-2 font-bold">Cliente</label>
                <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 outline-none text-sm mb-3" />
                <label className="block text-[10px] uppercase text-gray-500 mb-2 font-bold">Telefone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 outline-none text-sm mb-3" />
                <label className="block text-[10px] uppercase text-gray-500 mb-2 font-bold">Bairro</label>
                <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 outline-none text-sm mb-4" />
                <div className="grid grid-cols-1 gap-2">
                    <button onClick={importarZap} className="w-full bg-[#25d366]/20 text-[#25d366] py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                        <Smartphone size={16} /> Zap
                    </button>
                    <div className="flex gap-2">
                        <button onClick={salvarProjeto} className="flex-1 bg-[#1a2c4e] text-blue-300 py-3 rounded-xl font-semibold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2"><Save size={14} /> Salvar</button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-[#1a2c4e] text-blue-300 py-3 rounded-xl font-semibold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2"><FolderOpen size={14} /> Abrir</button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".insul" onChange={abrirProjeto} />
                    </div>
                </div>
            </div>

            <div className="admin-entrance bg-[#070c14] border-2 border-[#c9a227]/25 rounded-2xl p-5 shadow-2xl">
                <div className="grid grid-cols-3 gap-2">
                    <div><label className="block text-[10px] text-gray-400 mb-1 text-center font-bold uppercase">Rolo</label><input type="number" value={rollW} onChange={(e) => setRollW(parseFloat(e.target.value))} onFocus={(e) => e.target.select()} className="w-full bg-[#040811] border border-white/10 rounded-lg p-3 text-sm text-center font-bold" /></div>
                    <div>
                        <label className="block text-[10px] text-gray-400 mb-1 text-center font-bold uppercase">Película</label>
                        <select value={selectedFilm} onChange={(e) => setSelectedFilm(e.target.value as FilmTypeKey)} className="w-full bg-[#040811] border border-white/10 rounded-lg p-3 text-sm text-center font-bold appearance-none cursor-pointer">
                            {(Object.keys(FILM_TYPE_LABELS) as FilmTypeKey[]).map((key) => (
                                <option key={key} value={key}>{FILM_TYPE_LABELS[key]}</option>
                            ))}
                        </select>
                    </div>
                    <div><label className="block text-[10px] text-gray-400 mb-1 text-center font-bold uppercase">Margem</label><input type="number" value={margin} onChange={(e) => setMargin(parseFloat(e.target.value))} onFocus={(e) => e.target.select()} className="w-full bg-[#040811] border border-white/10 rounded-lg p-3 text-sm text-center font-bold" /></div>
                </div>
                <div className="mt-2 text-center">
                    <span className="text-[10px] text-gray-500">R$/m²: </span>
                    <span className="text-[10px] text-[#c9a227] font-bold">{price}</span>
                </div>
            </div>

            <div className="admin-entrance bg-[#0d1018] border-2 border-[#c9a227]/35 rounded-2xl p-5 shadow-2xl">
                <label className="block text-[10px] uppercase text-[#c9a227] mb-4 font-bold flex items-center gap-2"><Layers size={14} /> Medidas</label>

                <div className="space-y-1 mb-4">
                    <span className="text-[9px] text-gray-500 font-bold uppercase">Ambiente / Identificação</span>
                    <div className="relative">
                        <input
                            type="text"
                            value={labelIn}
                            onChange={(e) => setLabelIn(e.target.value)}
                            className="w-full bg-[#040811] border border-white/10 rounded-xl p-3 pr-10 text-sm outline-none focus:border-[#c9a227]/50"
                            placeholder="Ex: Sala, Varanda..."
                        />
                        {labelIn && (
                            <button
                                onClick={() => setLabelIn('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
                                title="Limpar ambiente"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        const next = !usarCoresPorAmbiente;
                        setUsarCoresPorAmbiente(next);
                        setVidros(prev => prev.map(v => ({
                            ...v,
                            cor: getColorForItem(v.label, v.oh, v.ow, next)
                        })));
                    }}
                    className={`w-full mb-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider border transition-all ${
                        usarCoresPorAmbiente
                            ? 'bg-[#c9a227]/15 border-[#c9a227]/50 text-[#c9a227]'
                            : 'bg-[#1a2c4e] border-white/10 text-blue-300'
                    }`}
                    title="Alterna entre cor por tamanho e cor por ambiente"
                >
                    {usarCoresPorAmbiente ? 'Esquema: Cor por Ambiente (ON)' : 'Esquema: Cor por Tamanho (ON)'}
                </button>

                <div className="hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-gray-500 font-bold uppercase">Cor do Ambiente</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] text-gray-400 uppercase">Atual</span>
                            <span className="w-4 h-4 rounded-full border border-white/40" style={{ backgroundColor: currentRoomColor }} />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ROOM_COLOR_SWATCHES.map((swatch) => (
                            <button
                                key={swatch}
                                type="button"
                                onClick={() => {
                                    if (!currentRoomLabel) return;
                                    setRoomColors(prev => ({ ...prev, [currentRoomKey]: swatch }));
                                }}
                                disabled={!currentRoomLabel}
                                className={`w-6 h-6 rounded-full border transition-all ${currentRoomColor === swatch ? 'border-[#c9a227] scale-110' : 'border-white/20'} ${!currentRoomLabel ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'}`}
                                style={{ backgroundColor: swatch }}
                                title={currentRoomLabel ? `Aplicar cor em ${currentRoomLabel}` : 'Digite o ambiente para escolher cor'}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => aplicarCorNoAmbiente(currentRoomLabel)}
                        disabled={!currentRoomLabel || !hasCurrentRoomPieces}
                        className="w-full bg-[#1a2c4e] text-blue-300 py-2 rounded-lg font-semibold text-[10px] uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
                        title={!currentRoomLabel ? 'Digite o ambiente' : 'Reaplicar cor nas peças já adicionadas deste ambiente'}
                    >
                        Aplicar Cor nas Peças Deste Ambiente
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    <input ref={heightRef} type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} onKeyDown={onHeightKeyDown} placeholder="Altura" className="bg-[#040811] border border-white/10 rounded-xl p-2.5 text-sm md:text-base text-center" />
                    <input ref={widthRef} type="number" value={widthIn} onChange={(e) => setWidthIn(e.target.value)} onKeyDown={onWidthKeyDown} placeholder="Largura" className="bg-[#040811] border border-white/10 rounded-xl p-2.5 text-sm md:text-base text-center" />
                    <input ref={qtyRef} type="number" value={qtyIn} onChange={(e) => setQtyIn(e.target.value)} onKeyDown={onQtyKeyDown} onFocus={(e) => e.target.select()} placeholder="Qtd" className="bg-[#040811] border border-white/10 rounded-xl p-2.5 text-sm md:text-base text-center" />
                </div>
                <button onClick={adicionar} className="w-full bg-[#c9a227] text-black py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2">
                    <Plus size={16} /> Adicionar
                </button>

                {vidros.length > 0 && (
                    <button
                        onClick={limparTudo}
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-widest"
                    >
                        <X size={12} /> Limpar Tudo
                    </button>
                )}
            </div>
        </React.Fragment>
    );
}
