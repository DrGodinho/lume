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
  const scopeKeyRef = useRef<string | null>(null);
  const actionsRef = useRef(actions);
  useEffect(() => {
    actionsRef.current = actions;
  });

  const {
    cliente, phone, neighborhood, vidros, desconto, descontoInput,
    rollW, price, margin, modoOtimizacao, userName, selectedFilm,
    roomColors, isCutMode,
  } = values;

  // Guarda o último payload para flush síncrono no unmount / beforeunload
  const pendingDraftPayloadRef = useRef<Parameters<typeof saveDraftToCloud>[0] | null>(null);

  // ─── AUTO-SAVE (local imediato + nuvem debounced 1.5s) ───────────────────────
  useEffect(() => {
    if (!draftRestored || isCutMode) return;
    const now = Date.now();
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
      lastSaved: now,
    };

    const cloudPayload = {
      cliente,
      phone,
      neighborhood,
      vidros,
      desconto,
      desconto_input: descontoInput,
      roll_w: rollW,
      price,
      margin,
      modo_otimizacao: modoOtimizacao,
      user_name: userName,
      selected_film: selectedFilm,
      last_saved: now,
    };
    pendingDraftPayloadRef.current = cloudPayload;

    const scopeKey = scopeKeyRef.current;
    if (scopeKey) {
      try { localStorage.setItem(buildCalculatorStorageKey('lume_calculator_draft', scopeKey), JSON.stringify(draft)); } catch { /* ignore */ }
    } else {
      resolveCalculatorScopeKey().then((resolved) => {
        scopeKeyRef.current = resolved;
        try { localStorage.setItem(buildCalculatorStorageKey('lume_calculator_draft', resolved), JSON.stringify(draft)); } catch { /* ignore */ }
      }).catch(() => {
        try { localStorage.setItem('lume_calculator_draft', JSON.stringify(draft)); } catch { /* ignore */ }
      });
    }

    if (cloudTimerRef.current) clearTimeout(cloudTimerRef.current);
    cloudTimerRef.current = setTimeout(async () => {
      actionsRef.current.setCloudStatus('syncing');
      const ok = await saveDraftToCloud(cloudPayload);
      actionsRef.current.setCloudStatus(ok ? 'synced' : 'error');
      if (ok) {
        pendingDraftPayloadRef.current = null;
        setTimeout(() => actionsRef.current.setCloudStatus('idle'), 3000);
      }
    }, 1500);

    return () => {
      if (cloudTimerRef.current) clearTimeout(cloudTimerRef.current);
    };
  }, [draftRestored, isCutMode, cliente, phone, neighborhood, vidros, desconto, descontoInput, rollW, price, margin, modoOtimizacao, userName, selectedFilm, roomColors]);

  // Flush do rascunho pendente no descarregamento da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingDraftPayloadRef.current) {
        saveDraftToCloud(pendingDraftPayloadRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (pendingDraftPayloadRef.current) {
        saveDraftToCloud(pendingDraftPayloadRef.current);
      }
    };
  }, []);

  // RESTORE DRAFT ON MOUNT (fresher-first entre nuvem e localStorage)
  useEffect(() => {
    let mounted = true;
    const restoreDraft = async () => {
      try {
        const scopeKey = await resolveCalculatorScopeKey();
        scopeKeyRef.current = scopeKey;
        const cfgSource = loadConfig(scopeKey);
        let expirationMin = cfgSource.draftExpiration ?? DEFAULT_CONFIG.draftExpiration;
        try {
          const cloudCfg = await loadConfigFromCloud();
          if (cloudCfg && cloudCfg.draftExpiration !== undefined) expirationMin = cloudCfg.draftExpiration;
        } catch { /* ignore */ }

        const isFresh = (lastSaved?: number) =>
          !lastSaved || expirationMin <= 0 || (Date.now() - lastSaved) <= expirationMin * 60 * 1000;

        const saved = localStorage.getItem(buildCalculatorStorageKey('lume_calculator_draft', scopeKey));
        let localDraft: Record<string, unknown> | null = null;
        if (saved) {
          try { localDraft = JSON.parse(saved); } catch { localDraft = null; }
        }

        const applyLocalRoomColors = () => {
          if (localDraft?.roomColors && typeof localDraft.roomColors === 'object') {
            actionsRef.current.setRoomColors(localDraft.roomColors as Record<string, string>);
          }
        };

        const hasDraftContent = (d: Record<string, unknown> | null | undefined): boolean => {
          if (!d) return false;
          const vidros = Array.isArray(d.vidros) && d.vidros.length > 0;
          const cliente = typeof d.cliente === 'string' && d.cliente.trim().length > 0;
          const phone = typeof d.phone === 'string' && d.phone.trim().length > 0;
          const neighborhood = typeof d.neighborhood === 'string' && d.neighborhood.trim().length > 0;
          return vidros || cliente || phone || neighborhood;
        };

        const applyDraftData = (d: Record<string, unknown>, fromCloud: boolean) => {
          if (Array.isArray(d.vidros)) actionsRef.current.setVidros(d.vidros as GlassItem[]);
          if (typeof d.cliente === 'string') actionsRef.current.setCliente(d.cliente);
          if (typeof d.phone === 'string') actionsRef.current.setPhone(d.phone);
          if (typeof d.neighborhood === 'string') actionsRef.current.setNeighborhood(d.neighborhood);
          if (typeof d.desconto === 'number') actionsRef.current.setDesconto(d.desconto);
          const descInput = d.desconto_input ?? d.descontoInput;
          if (descInput !== undefined) actionsRef.current.setDescontoInput(String(descInput));
          const rollWVal = (d.roll_w ?? d.rollW) as number | undefined;
          if (rollWVal) actionsRef.current.setRollW(rollWVal);
          if (typeof d.price === 'number') actionsRef.current.setPrice(d.price);
          if (typeof d.margin === 'number') actionsRef.current.setMargin(d.margin);
          const modo = (d.modo_otimizacao ?? d.modoOtimizacao) as OptimizationMode | undefined;
          if (modo && isOptimizationMode(modo)) actionsRef.current.setModoOtimizacao(modo);
          const user = (d.user_name ?? d.userName) as string | undefined;
          if (user) actionsRef.current.setUserName(user);
          const film = (d.selected_film ?? d.selectedFilm) as FilmTypeKey | undefined;
          if (film) actionsRef.current.setSelectedFilm(normalizeFilmTypeKey(film));
          applyLocalRoomColors();
          if (fromCloud) {
            actionsRef.current.setCloudStatus('synced');
            setTimeout(() => actionsRef.current.setCloudStatus('idle'), 3000);
          }
        };

        const cloud = await loadDraftFromCloud();
        const cloudRecord = cloud as Record<string, unknown> | null;
        const cloudTime = typeof cloudRecord?.last_saved === 'number' ? (cloudRecord.last_saved as number) : 0;
        const localTime = typeof localDraft?.lastSaved === 'number' ? (localDraft.lastSaved as number) : 0;

        const cloudValid = hasDraftContent(cloudRecord) && isFresh(cloudTime);
        const localValid = hasDraftContent(localDraft) && isFresh(localTime);

        if (localValid && (!cloudValid || localTime > cloudTime)) {
          // Versão local é mais recente (ex: usuário editou e recarregou antes de sync)
          applyDraftData(localDraft!, false);
          // Agenda sync para atualizar a nuvem com os dados locais mais recentes
          if (pendingDraftPayloadRef.current) {
            saveDraftToCloud(pendingDraftPayloadRef.current);
          }
          return;
        }

        if (cloudValid) {
          applyDraftData(cloudRecord!, true);
          return;
        }

        if (localValid) {
          applyDraftData(localDraft!, false);
          return;
        }
      } catch (err) {
        logger.error('Erro ao restaurar rascunho', err);
      } finally {
        if (mounted) setDraftRestored(true);
      }
    };
    restoreDraft();
    return () => { mounted = false; };
  }, [authRefreshKey]);

  return { draftRestored };
}
