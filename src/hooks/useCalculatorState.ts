'use client';

import { useEffect, useMemo, useReducer, useState, useCallback } from 'react';
import {
  DEFAULT_ROOM_COLORS,
  normalizeFilmTypeKey,
  normalizeFilmTypes,
} from '../lib/films';
import type {
  AppConfig,
  FilmTypeKey,
  GlassItem,
  LossMode,
  OptimizationMode,
} from '../lib/films';

// ─── UNDO/REDO REDUCER (movido do god component) ─────────────────────────────

interface HistoryState {
    present: GlassItem[];
    past: GlassItem[][];
    future: GlassItem[][];
}

type HistoryAction =
    | { type: 'SET'; payload: GlassItem[] }
    | { type: 'SET_FN'; payload: (prev: GlassItem[]) => GlassItem[] }
    | { type: 'UNDO' }
    | { type: 'REDO' };

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
    switch (action.type) {
        case 'SET':
            return {
                past: [...state.past.slice(-30), state.present],
                present: action.payload,
                future: []
            };
        case 'SET_FN':
            return {
                past: [...state.past.slice(-30), state.present],
                present: action.payload(state.present),
                future: []
            };
        case 'UNDO': {
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            return {
                past: state.past.slice(0, -1),
                present: previous,
                future: [state.present, ...state.future]
            };
        }
        case 'REDO': {
            if (state.future.length === 0) return state;
            const next = state.future[0];
            return {
                past: [...state.past, state.present],
                present: next,
                future: state.future.slice(1)
            };
        }
        default:
            return state;
    }
}

export type SetVidros = (updater: GlassItem[] | ((prev: GlassItem[]) => GlassItem[])) => void;

/**
 * C1: estado de sessão da calculadora (os ~32 `useState` + `historyReducer`
 * do god component). Retorna os mesmos nomes — os call sites não mudam.
 */
export function useCalculatorState(cfg: AppConfig) {
  const [cliente, setCliente] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [rollW, setRollW] = useState(cfg.rollW);
  const [margin, setMargin] = useState(cfg.margin);
  const [price, setPrice] = useState(cfg.price);
  const [userName, setUserName] = useState(cfg.userName);
  const [desconto, setDesconto] = useState(0);
  const [descontoInput, setDescontoInput] = useState('0');
  const [modoOtimizacao, setModoOtimizacao] = useState<OptimizationMode>(cfg.modoOtimizacao);
  const [configAberto, setConfigAberto] = useState(false);
  const [compensarPerdas, setCompensarPerdas] = useState(false);
  const [modoPerdas, setModoPerdas] = useState<LossMode>(cfg.modoPerdas);
  const [perdasFixas, setPerdasFixas] = useState(cfg.perdasFixas);
  const [agressividadeCorte, setAgressividadeCorte] = useState(cfg.agressividadeCorte);
  const [filmTypes, setFilmTypes] = useState<Record<FilmTypeKey, number>>(normalizeFilmTypes(cfg.filmTypes));
  const [selectedFilm, setSelectedFilm] = useState<FilmTypeKey>(normalizeFilmTypeKey(cfg.selectedFilm));
  const [draftExpiration, setDraftExpiration] = useState(cfg.draftExpiration);
  const [configRestored, setConfigRestored] = useState(false);
  const [heightIn, setHeightIn] = useState('');
  const [widthIn, setWidthIn] = useState('');
  const [qtyIn, setQtyIn] = useState('1');
  const [labelIn, setLabelIn] = useState('');
  const [usarCoresPorAmbiente, setUsarCoresPorAmbiente] = useState(cfg.modoCorConfig === 'ambiente');
  const [roomColors, setRoomColors] = useState<Record<string, string>>(DEFAULT_ROOM_COLORS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [cloudStatus, setCloudStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [authRefreshKey, setAuthRefreshKey] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Espelha o comportamento original: zera o texto do desconto junto.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- paridade com o god component
    if (desconto === 0) setDescontoInput('0');
  }, [desconto]);

  const [vidrosState, dispatch] = useReducer(historyReducer, {
    past: [],
    present: [],
    future: []
  });
  const vidros = vidrosState.present;
  const canUndo = vidrosState.past.length > 0;
  const canRedo = vidrosState.future.length > 0;

  const setVidros = useCallback((updater: GlassItem[] | ((prev: GlassItem[]) => GlassItem[])) => {
    if (typeof updater === 'function') {
      dispatch({ type: 'SET_FN', payload: updater });
    } else {
      dispatch({ type: 'SET', payload: updater });
    }
  }, []);

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  const currentConfig = useMemo<AppConfig>(() => ({
    rollW,
    price,
    margin,
    modoOtimizacao,
    userName,
    modoPerdas,
    perdasFixas,
    modoCorConfig: usarCoresPorAmbiente ? 'ambiente' : 'tamanho',
    agressividadeCorte,
    filmTypes,
    selectedFilm,
    draftExpiration,
  }), [
    rollW,
    price,
    margin,
    modoOtimizacao,
    userName,
    modoPerdas,
    perdasFixas,
    usarCoresPorAmbiente,
    agressividadeCorte,
    filmTypes,
    selectedFilm,
    draftExpiration,
  ]);

  return {
    cliente, setCliente,
    phone, setPhone,
    neighborhood, setNeighborhood,
    rollW, setRollW,
    margin, setMargin,
    price, setPrice,
    userName, setUserName,
    desconto, setDesconto,
    descontoInput, setDescontoInput,
    modoOtimizacao, setModoOtimizacao,
    configAberto, setConfigAberto,
    compensarPerdas, setCompensarPerdas,
    modoPerdas, setModoPerdas,
    perdasFixas, setPerdasFixas,
    agressividadeCorte, setAgressividadeCorte,
    filmTypes, setFilmTypes,
    selectedFilm, setSelectedFilm,
    draftExpiration, setDraftExpiration,
    configRestored, setConfigRestored,
    heightIn, setHeightIn,
    widthIn, setWidthIn,
    qtyIn, setQtyIn,
    labelIn, setLabelIn,
    usarCoresPorAmbiente, setUsarCoresPorAmbiente,
    roomColors, setRoomColors,
    selectedIds, setSelectedIds,
    cloudStatus, setCloudStatus,
    authRefreshKey, setAuthRefreshKey,
    isLoggingOut, setIsLoggingOut,
    vidros, setVidros, canUndo, canRedo, undo, redo,
    currentConfig,
  };
}
