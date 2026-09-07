'use client';

import { useEffect, useRef, useState } from 'react';
import { buildCalculatorStorageKey, resolveCalculatorScopeKey } from '../lib/calculatorScope';
import { loadConfig } from '../lib/calculatorConfig';
import {
  saveDraftToCloud, loadDraftFromCloud,
  loadConfigFromCloud,
} from '../lib/cloudSync';
import { DEFAULT_CONFIG, isOptimizationMode, normalizeFilmTypeKey } from '../lib/films';
import type { FilmTypeKey, GlassItem, OptimizationMode } from '../lib/films';
import { createScopedLogger } from '../lib/logger';
import type { SetVidros } from './useCalculatorState';

const logger = createScopedLogger('useDraftSync');

type CloudStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface DraftValues {
  cliente: string;
  phone: string;
  neighborhood: string;
  vidros: GlassItem[];
  desconto: number;
  descontoInput: string;
  rollW: number;
  price: number;
  margin: number;
  modoOtimizacao: OptimizationMode;
  userName: string;
  selectedFilm: FilmTypeKey;
  roomColors: Record<string, string>;
  isCutMode: boolean;
}

interface DraftActions {
  setVidros: SetVidros;
  setCliente: (v: string) => void;
  setPhone: (v: string) => void;
  setNeighborhood: (v: string) => void;
  setDesconto: (v: number) => void;
  setDescontoInput: (v: string) => void;
  setRollW: (v: number) => void;
  setPrice: (v: number) => void;
  setMargin: (v: number) => void;
  setModoOtimizacao: (v: OptimizationMode) => void;
  setUserName: (v: string) => void;
  setSelectedFilm: (v: FilmTypeKey) => void;
  setRoomColors: (updater: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  setCloudStatus: (v: CloudStatus) => void;
}

/**
 * C1: autosave do rascunho (local imediato + nuvem com debounce) e restore
 * (nuvem primeiro, localStorage como fallback). Lógica verbatim do god
 * component.
 */
export function useDraftSync(
  values: DraftValues,
  actions: DraftActions,
  authRefreshKey: number,
): { draftRestored: boolean } {
  const [draftRestored, setDraftRestored] = useState(false);
  const cloudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // C3: scope resolvido 1x no restore e reutilizado nos saves — antes cada
  // tecla disparava resolveCalculatorScopeKey() (ida à rede), com risco de
  // salvar no scope errado se a conta trocasse no meio do debounce.
  const scopeKeyRef = useRef<string | null>(null);
  // Objeto `actions` do pai é recriado a cada render — via ref para não
  // reiniciar o debounce/efeitos à toa.
  const actionsRef = useRef(actions);
  useEffect(() => {
    actionsRef.current = actions;
  });

  const {
    cliente, phone, neighborhood, vidros, desconto, descontoInput,
    rollW, price, margin, modoOtimizacao, userName, selectedFilm,
    roomColors, isCutMode,
  } = values;

  // ─── AUTO-SAVE (local imediato + nuvem debounced 5s) ───────────────────────
  useEffect(() => {
    if (!draftRestored || isCutMode) return;
    const draft = {
      cliente,
      phone,
      neighborhood,
      vidros,
      desconto,
      descontoInput,
      rollW,
      price,
      margin,
      modoOtimizacao,
      userName,
      selectedFilm,
      roomColors,
      lastSaved: Date.now()
    };
    // C3: usa o scope do restore quando disponível (sem ida à rede, sem
    // risco de trocar de scope no meio do debounce); o resolver tem cache,
    // então o fallback também é barato.
    const scopeKey = scopeKeyRef.current;
    if (scopeKey) {
      try { localStorage.setItem(buildCalculatorStorageKey('lume_calculator_draft', scopeKey), JSON.stringify(draft)); } catch { /* ignore */ }
    } else {
      resolveCalculatorScopeKey().then((resolved) => {
        scopeKeyRef.current = resolved;
        try { localStorage.setItem(buildCalculatorStorageKey('lume_calculator_draft', resolved), JSON.stringify(draft)); } catch { /* ignore */ }
      }).catch(() => {
        // Fallback sem scope (chave legada) para nunca perder o rascunho local.
        try { localStorage.setItem('lume_calculator_draft', JSON.stringify(draft)); } catch { /* ignore */ }
      });
    }

    if (cloudTimerRef.current) clearTimeout(cloudTimerRef.current);
    cloudTimerRef.current = setTimeout(async () => {
      actionsRef.current.setCloudStatus('syncing');
      const ok = await saveDraftToCloud({
        cliente, phone, neighborhood, vidros, desconto, desconto_input: descontoInput,
        roll_w: rollW, price, margin, modo_otimizacao: modoOtimizacao,
        user_name: userName, selected_film: selectedFilm,
        last_saved: Date.now(),
      });
      actionsRef.current.setCloudStatus(ok ? 'synced' : 'error');
      if (ok) setTimeout(() => actionsRef.current.setCloudStatus('idle'), 3000);
    }, 5000);
    return () => { if (cloudTimerRef.current) clearTimeout(cloudTimerRef.current); };
  }, [draftRestored, isCutMode, cliente, phone, neighborhood, vidros, desconto, descontoInput, rollW, price, margin, modoOtimizacao, userName, selectedFilm, roomColors]);

  // RESTORE DRAFT ON MOUNT (cloud-first, localStorage fallback)
  useEffect(() => {
    let mounted = true;
    const restoreDraft = async () => {
      try {
        const scopeKey = await resolveCalculatorScopeKey();
        scopeKeyRef.current = scopeKey;
        // Resolve the configured draft expiration (minutes) directly from config
        // so it works regardless of the config-restore effect's timing.
        const cfgSource = loadConfig(scopeKey);
        let expirationMin = cfgSource.draftExpiration ?? DEFAULT_CONFIG.draftExpiration;
        try {
          const cloudCfg = await loadConfigFromCloud();
          if (cloudCfg && cloudCfg.draftExpiration !== undefined) expirationMin = cloudCfg.draftExpiration;
        } catch { /* ignore */ }
        const isFresh = (lastSaved?: number) =>
          !lastSaved || expirationMin <= 0 || (Date.now() - lastSaved) <= expirationMin * 60 * 1000;

        // Local draft (source of roomColors, which aren't synced to cloud)
        const saved = localStorage.getItem(buildCalculatorStorageKey('lume_calculator_draft', scopeKey));
        let localDraft: { roomColors?: Record<string, string> } | null = null;
        if (saved) {
          try { localDraft = JSON.parse(saved); } catch { localDraft = null; }
        }
        const applyLocalRoomColors = () => {
          if (localDraft?.roomColors && typeof localDraft.roomColors === 'object') {
            actionsRef.current.setRoomColors(localDraft.roomColors);
          }
        };
        // Try cloud first
        const cloud = await loadDraftFromCloud();
        if (cloud && Array.isArray(cloud.vidros) && cloud.vidros.length > 0 && isFresh(cloud.last_saved)) {
          actionsRef.current.setVidros(cloud.vidros as GlassItem[]);
          if (cloud.cliente) actionsRef.current.setCliente(cloud.cliente);
          if (cloud.phone) actionsRef.current.setPhone(cloud.phone);
          if (cloud.neighborhood) actionsRef.current.setNeighborhood(cloud.neighborhood);
          if (cloud.desconto !== undefined) actionsRef.current.setDesconto(cloud.desconto);
          if (cloud.desconto_input !== undefined) actionsRef.current.setDescontoInput(cloud.desconto_input);
          if (cloud.roll_w) actionsRef.current.setRollW(cloud.roll_w);
          if (cloud.price) actionsRef.current.setPrice(cloud.price);
          if (cloud.margin !== undefined) actionsRef.current.setMargin(cloud.margin);
          if (isOptimizationMode(cloud.modo_otimizacao)) actionsRef.current.setModoOtimizacao(cloud.modo_otimizacao);
          if (cloud.user_name) actionsRef.current.setUserName(cloud.user_name);
          actionsRef.current.setSelectedFilm(normalizeFilmTypeKey(cloud.selected_film));
          applyLocalRoomColors();
          actionsRef.current.setCloudStatus('synced');
          setTimeout(() => actionsRef.current.setCloudStatus('idle'), 3000);
          return;
        }
        // Fallback to localStorage
        if (saved) {
          try {
            const draft = JSON.parse(saved);
            if (draft.vidros && draft.vidros.length > 0 && isFresh(draft.lastSaved)) {
              actionsRef.current.setVidros(draft.vidros);
              if (draft.cliente) actionsRef.current.setCliente(draft.cliente);
              if (draft.phone) actionsRef.current.setPhone(draft.phone);
              if (draft.neighborhood) actionsRef.current.setNeighborhood(draft.neighborhood);
              if (draft.desconto !== undefined) actionsRef.current.setDesconto(draft.desconto);
              if (draft.descontoInput !== undefined) actionsRef.current.setDescontoInput(draft.descontoInput);
              if (draft.rollW) actionsRef.current.setRollW(draft.rollW);
              if (draft.price) actionsRef.current.setPrice(draft.price);
              if (draft.margin !== undefined) actionsRef.current.setMargin(draft.margin);
              if (isOptimizationMode(draft.modoOtimizacao)) actionsRef.current.setModoOtimizacao(draft.modoOtimizacao);
              if (draft.userName) actionsRef.current.setUserName(draft.userName);
              actionsRef.current.setSelectedFilm(normalizeFilmTypeKey(draft.selectedFilm));
              applyLocalRoomColors();
            }
          } catch (e) {
            logger.error('Erro ao carregar rascunho local', e);
          }
        }
      } finally {
        if (mounted) setDraftRestored(true);
      }
    };
    restoreDraft();
    return () => { mounted = false; };
  }, [authRefreshKey]);

  return { draftRestored };
}
