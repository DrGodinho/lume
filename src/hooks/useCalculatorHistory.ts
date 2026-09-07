'use client';

import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { buildCalculatorStorageKey, resolveCalculatorScopeKey } from '../lib/calculatorScope';
import {
  saveHistoryItemToCloud, loadHistoryFromCloud, deleteHistoryItemFromCloud,
} from '../lib/cloudSync';
import type { OrcamentoSalvo } from '../lib/films';

// ─── SCHEMA (C1: hoje o JSON entra sem validação) ─────────────────────────────

const GlassItemSchema = z.object({
  id: z.string(),
  h: z.number(),
  w: z.number(),
  oh: z.number(),
  ow: z.number(),
  label: z.string().optional(),
  cor: z.string(),
  sortOrder: z.number(),
}).catchall(z.unknown());

const OrcamentoSalvoSchema = z.object({
  id: z.string(),
  cliente: z.string(),
  phone: z.string().optional(),
  neighborhood: z.string().optional(),
  data: z.string(),
  valor: z.number(),
  qtd: z.number(),
  vidros: z.array(GlassItemSchema),
  config: z.object({
    rollW: z.number(),
    price: z.number(),
    margin: z.number(),
  }).catchall(z.unknown()),
  desconto: z.number(),
  modoOtimizacao: z.string(),
  selectedFilm: z.string().optional(),
  leadId: z.string().nullable().optional(),
}).catchall(z.unknown());

/** Valida um item de histórico (nuvem/localStorage/abrir). Retorna null se inválido. */
export function parseOrcamentoSalvo(value: unknown): OrcamentoSalvo | null {
  const parsed = OrcamentoSalvoSchema.safeParse(value);
  if (!parsed.success) return null;
  return parsed.data as OrcamentoSalvo;
}

export type HistorySnapshotBase = Omit<OrcamentoSalvo, 'id' | 'data'>;

interface HistoryHooksParams {
  authRefreshKey: number;
  notify: (msg: string, tone: 'success' | 'error') => void;
}

/**
 * C1: histórico de orçamentos (load nuvem→local, salvar, abrir, deletar).
 * Todo JSON que entra passa pelo schema — antes caía direto no estado.
 */
export function useCalculatorHistory({ authRefreshKey, notify }: HistoryHooksParams) {
  const [historico, setHistorico] = useState<OrcamentoSalvo[]>([]);
  const [historicoAberto, setHistoricoAberto] = useState(false);

  useEffect(() => {
    const load = async () => {
      const scopeKey = await resolveCalculatorScopeKey();
      const cloudHistory = await loadHistoryFromCloud();
      const validCloud = cloudHistory
        .map(parseOrcamentoSalvo)
        .filter((o): o is OrcamentoSalvo => o !== null);
      if (validCloud.length > 0) {
        setHistorico(validCloud);
        localStorage.setItem(buildCalculatorStorageKey('lume_historico', scopeKey), JSON.stringify(validCloud));
        return;
      }
      try {
        const saved = localStorage.getItem(buildCalculatorStorageKey('lume_historico', scopeKey));
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          const items = Array.isArray(parsed) ? parsed : [];
          setHistorico(
            items
              .map(parseOrcamentoSalvo)
              .filter((o): o is OrcamentoSalvo => o !== null),
          );
        }
      } catch {
        setHistorico([]);
      }
    };
    load();
  }, [authRefreshKey]);

  const persistLocal = useCallback((atualizado: OrcamentoSalvo[]) => {
    setHistorico(atualizado);
    resolveCalculatorScopeKey().then((scopeKey) => {
      localStorage.setItem(buildCalculatorStorageKey('lume_historico', scopeKey), JSON.stringify(atualizado));
    }).catch(() => null);
  }, []);

  const salvarNoHistorico = useCallback((base: HistorySnapshotBase | null) => {
    if (!base || base.vidros.length === 0) return;
    const novo: OrcamentoSalvo = {
      ...base,
      id: Date.now().toString(),
      data: new Date().toLocaleDateString('pt-BR'),
    };
    const valid = parseOrcamentoSalvo(novo);
    if (!valid) {
      notify('Orçamento inválido, não foi salvo.', 'error');
      return;
    }
    persistLocal([valid, ...historico].slice(0, 100));
    saveHistoryItemToCloud(valid);
    notify('Orçamento salvo no histórico!', 'success');
  }, [historico, persistLocal, notify]);

  const carregarDoHistorico = useCallback((orc: unknown, apply: (valid: OrcamentoSalvo) => void) => {
    const valid = parseOrcamentoSalvo(orc);
    if (!valid) {
      notify('Orçamento inválido ou corrompido.', 'error');
      return;
    }
    apply(valid);
    setHistoricoAberto(false);
  }, [notify]);

  const deletarDoHistorico = useCallback((id: string) => {
    const atualizado = historico.filter(o => o.id !== id);
    persistLocal(atualizado);
    deleteHistoryItemFromCloud(id);
  }, [historico, persistLocal]);

  return {
    historico, setHistorico,
    historicoAberto, setHistoricoAberto,
    salvarNoHistorico, carregarDoHistorico, deletarDoHistorico,
  };
}
