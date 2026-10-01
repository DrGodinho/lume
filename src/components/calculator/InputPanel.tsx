'use client';

import React from 'react';
import { Smartphone, Save, FolderOpen, Layers, X, Plus } from 'lucide-react';
import { formatNumber2 } from '../../lib/money';
import type { FilmCatalogItem, FilmTypeKey } from '../../lib/films';
import { FILM_TYPE_LABELS } from '../../lib/films';
import { RJ_NEIGHBORHOODS } from '@/app/crm/constants';

export interface ClienteProps {
    cliente: string;
    phone: string;
    neighborhood: string;
    onClienteChange: (v: string) => void;
    onPhoneChange: (v: string) => void;
    onNeighborhoodChange: (v: string) => void;
    onImportarZap: () => void;
    onSalvarProjeto: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onAbrirProjeto: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface RoloProps {
    rollW: number;
    selectedFilm: FilmTypeKey;
    customFilmName?: string;
    margin: number;
    price: number;
    filmCatalog?: Record<string, FilmCatalogItem>;
    onRollWChange: (v: number) => void;
    onSelectedFilmChange: (v: FilmTypeKey) => void;
    onCustomFilmNameChange?: (v: string) => void;
    onMarginChange: (v: number) => void;
    onPriceChange?: (v: number) => void;
}

export interface CorProps {
    usarCoresPorAmbiente: boolean;
    currentRoomColor: string;
    currentRoomLabel: string;
    hasCurrentRoomPieces: boolean;
    onToggleCorEsquema: () => void;
    onSelectRoomColor: (swatch: string) => void;
    onAplicarCorNoAmbiente: (ambiente: string) => void;
}

export interface MedidaProps {
    labelIn: string;
    heightIn: string;
    widthIn: string;
    qtyIn: string;
    onLabelInChange: (v: string) => void;
    onHeightChange: (v: string) => void;
    onWidthChange: (v: string) => void;
    onQtyChange: (v: string) => void;
    heightRef: React.RefObject<HTMLInputElement | null>;
    widthRef: React.RefObject<HTMLInputElement | null>;
    qtyRef: React.RefObject<HTMLInputElement | null>;
    onHeightKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onWidthKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onQtyKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onAdicionar: () => void;
    addError: string | null;
}

interface InputPanelProps {
    clienteProps: ClienteProps;
    roloProps: RoloProps;
    corProps: CorProps;
    medidaProps: MedidaProps;
}

export function InputPanel({
    clienteProps,
    roloProps,
    corProps,
    medidaProps,
}: InputPanelProps) {
    const {
        cliente, phone, neighborhood,
        onClienteChange, onPhoneChange, onNeighborhoodChange,
        onImportarZap, onSalvarProjeto, fileInputRef, onAbrirProjeto,
    } = clienteProps;
    const {
        rollW, selectedFilm, customFilmName, margin, price, filmCatalog,
        onRollWChange, onSelectedFilmChange, onCustomFilmNameChange, onMarginChange, onPriceChange,
    } = roloProps;
    const {
        usarCoresPorAmbiente,
        currentRoomColor, currentRoomLabel,
        hasCurrentRoomPieces,
        onToggleCorEsquema, onSelectRoomColor, onAplicarCorNoAmbiente,
    } = corProps;
    const {
        labelIn, heightIn, widthIn, qtyIn,
        onLabelInChange, onHeightChange, onWidthChange, onQtyChange,
        heightRef, widthRef, qtyRef,
        onHeightKeyDown, onWidthKeyDown, onQtyKeyDown,
        onAdicionar, addError,
    } = medidaProps;
    return (
        <React.Fragment>
            <div className="admin-entrance bg-[#0a0e17] border-2 border-[#c9a227]/30 rounded-2xl p-5 shadow-2xl">
                <label className="block text-[10px] uppercase text-[#c9a227] mb-2 font-bold">Cliente</label>
                <input
                    type="text"
                    value={cliente}
                    onChange={(e) => onClienteChange(e.target.value)}
                    placeholder="Nome do cliente"
                    className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 outline-none text-sm mb-3 placeholder:text-white/20 focus:border-[#c9a227]/50"
                />
                <label className="block text-[10px] uppercase text-gray-300 mb-2 font-bold">Telefone / WhatsApp</label>
                <input
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    placeholder="Ex: (21) 98130-8654"
                    className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 outline-none text-sm mb-3 placeholder:text-white/20 focus:border-[#c9a227]/50"
                />
                <label className="block text-[10px] uppercase text-gray-300 mb-2 font-bold">Bairro</label>
                <input
                    type="text"
                    list="bairros-sugestoes"
                    value={neighborhood}
                    onChange={(e) => onNeighborhoodChange(e.target.value)}
                    placeholder="Ex: Barra da Tijuca, Recreio, Freguesia..."
                    className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 outline-none text-sm mb-4 placeholder:text-white/20 focus:border-[#c9a227]/50"
                />
                <datalist id="bairros-sugestoes">
                    {RJ_NEIGHBORHOODS.filter((b) => b !== 'Outro').map((b) => (
                        <option key={b} value={b} />
                    ))}
                </datalist>
                <div className="grid grid-cols-1 gap-2">
                    <button onClick={onImportarZap} className="w-full bg-[#25d366]/20 text-[#25d366] py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                        <Smartphone size={16} /> Zap
                    </button>
                    <div className="flex gap-2">
                        <button onClick={onSalvarProjeto} className="flex-1 bg-[#1a2c4e] text-blue-300 py-3 rounded-xl font-semibold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2"><Save size={14} /> Salvar</button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-[#1a2c4e] text-blue-300 py-3 rounded-xl font-semibold text-[10px] uppercase tracking-wider flex items-center justify-center gap-2"><FolderOpen size={14} /> Abrir</button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".insul" onChange={onAbrirProjeto} />
                    </div>
                </div>
            </div>

            <div className="admin-entrance bg-[#070c14] border-2 border-[#c9a227]/25 rounded-2xl p-5 shadow-2xl">
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="block text-[10px] text-gray-400 mb-1 text-center font-bold uppercase">Rolo</label>
                        <input type="number" inputMode="decimal" step="0.01" min="0" value={rollW} onChange={(e) => onRollWChange(parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} className="w-full bg-[#040811] border border-white/10 rounded-lg p-3 text-sm text-center font-bold" />
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-400 mb-1 text-center font-bold uppercase">Película</label>
                        <select value={selectedFilm} onChange={(e) => onSelectedFilmChange(e.target.value as FilmTypeKey)} className="w-full bg-[#040811] border border-white/10 rounded-lg p-3 text-sm text-center font-bold appearance-none cursor-pointer">
                            {(Object.keys(FILM_TYPE_LABELS) as FilmTypeKey[]).map((key) => {
                                const item = filmCatalog?.[key];
                                const priceTag = item && key !== 'personalizado' ? ` (R$ ${item.priceSale})` : '';
                                return (
                                    <option key={key} value={key}>
                                        {item?.name || FILM_TYPE_LABELS[key]}{priceTag}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-400 mb-1 text-center font-bold uppercase">Margem</label>
                        <input type="number" inputMode="decimal" step="0.01" min="0" value={margin} onChange={(e) => onMarginChange(parseFloat(e.target.value) || 0)} onFocus={(e) => e.target.select()} className="w-full bg-[#040811] border border-white/10 rounded-lg p-3 text-sm text-center font-bold" />
                    </div>
                </div>

                {selectedFilm === 'personalizado' && (
                    <div className="mt-3">
                        <label className="block text-[9px] text-gray-400 mb-1 font-bold uppercase tracking-wider">Nome da Película Personalizada</label>
                        <input
                            type="text"
                            value={customFilmName || ''}
                            onChange={(e) => onCustomFilmNameChange?.(e.target.value)}
                            placeholder="Ex: Fumê 35%, Película Térmica X..."
                            className="w-full bg-[#040811] border border-[#c9a227]/40 rounded-xl px-3 py-2 text-xs font-bold text-[#c9a227] placeholder:text-gray-600 outline-none focus:border-[#c9a227]"
                        />
                    </div>
                )}

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Valor do m²:</span>
                    <div className="flex items-center gap-1.5 bg-[#040811] border border-[#c9a227]/30 hover:border-[#c9a227]/60 focus-within:border-[#c9a227] rounded-lg px-2.5 py-1 transition-colors">
                        <span className="text-xs text-[#c9a227] font-bold">R$</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            value={price || ''}
                            onChange={(e) => onPriceChange?.(parseFloat(e.target.value) || 0)}
                            onFocus={(e) => e.target.select()}
                            className="w-20 bg-transparent text-right text-sm font-bold text-[#c9a227] outline-none"
                            title="Preço por m² (editável)"
                        />
                    </div>
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
                            onChange={(e) => onLabelInChange(e.target.value)}
                            className="w-full bg-[#040811] border border-white/10 rounded-xl p-3 pr-10 text-sm outline-none focus:border-[#c9a227]/50"
                            placeholder="Ex: Sala, Varanda..."
                        />
                        {labelIn && (
                            <button
                                onClick={() => onLabelInChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-white/10"
                                title="Limpar ambiente"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <button
                    id="calc-cor-esquema"
                    type="button"
                    onClick={onToggleCorEsquema}
                    className={`w-full mb-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider border transition-all ${
                        usarCoresPorAmbiente
                            ? 'bg-[#c9a227]/15 border-[#c9a227]/50 text-[#c9a227]'
                            : 'bg-[#1a2c4e] border-white/10 text-blue-300'
                    }`}
                    title="Alterna entre cor por tamanho e cor por ambiente"
                >
                    {usarCoresPorAmbiente ? 'Esquema: Cor por Ambiente (ON)' : 'Esquema: Cor por Tamanho (ON)'}
                </button>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    <input ref={heightRef} type="number" inputMode="decimal" step="0.1" min="0" value={heightIn} onChange={(e) => onHeightChange(e.target.value)} onKeyDown={onHeightKeyDown} placeholder="Altura" className="bg-[#040811] border border-white/10 rounded-xl p-2.5 text-sm md:text-base text-center" />
                    <input ref={widthRef} type="number" inputMode="decimal" step="0.1" min="0" value={widthIn} onChange={(e) => onWidthChange(e.target.value)} onKeyDown={onWidthKeyDown} placeholder="Largura" className="bg-[#040811] border border-white/10 rounded-xl p-2.5 text-sm md:text-base text-center" />
                    <input ref={qtyRef} type="number" inputMode="numeric" min="1" value={qtyIn} onChange={(e) => onQtyChange(e.target.value)} onKeyDown={onQtyKeyDown} onFocus={(e) => e.target.select()} placeholder="Qtd" className="bg-[#040811] border border-white/10 rounded-xl p-2.5 text-sm md:text-base text-center" />
                </div>
                <button onClick={onAdicionar} className="w-full bg-[#c9a227] text-black py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2">
                    <Plus size={16} /> Adicionar
                </button>
                {addError && (
                    <p role="alert" className="mt-2 text-center text-[11px] font-bold text-red-400">
                        {addError}
                    </p>
                )}
            </div>
        </React.Fragment>
    );
}
