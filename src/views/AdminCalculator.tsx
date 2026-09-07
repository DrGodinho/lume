'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    Trash2, Scissors,
    Calculator, RotateCcw, AlignRight, AlignLeft, X,
    History, Undo2, Redo2, Settings, Copy, ClipboardPaste, User
} from 'lucide-react';
import { InvoicePNG } from '../components/InvoicePNG';
import { createScopedLogger } from '../lib/logger';

const logger = createScopedLogger('AdminCalculator');
import { ConfigPanel } from '../components/ConfigPanel';
import { HistoryPanel } from '../components/HistoryPanel';
import { InputPanel } from '../components/calculator/InputPanel';
import { CutMap } from '../components/calculator/CutMap';
import { ResumeList } from '../components/calculator/ResumeList';
import { ColarModal } from '../components/calculator/ColarModal';
import { ResultPanel } from '../components/calculator/ResultPanel';
import { ConfirmDialog } from '../components/calculator/ConfirmDialog';
import { Toast, type ToastData } from '../components/calculator/Toast';
import { ImportModal } from '../components/calculator/ImportModal';
import { CutModeToolbar } from '../components/calculator/CutModeToolbar';
import { buildCalculatorStorageKey, resetCalculatorScopeCache, resolveCalculatorScopeKey } from '../lib/calculatorScope';
import {
    saveHistoryItemToCloud,
    saveConfigToCloud, loadConfigFromCloud,
} from '../lib/cloudSync';
import { roundMeasure } from '../lib/numberPrecision';
import {
  calcCompensacaoPerda,
  calcEficiencia,
  calcFinalPrice,
  calcMetrosComprar,
  calcSubtotalBruto,
  calcTotalAreaM2,
  calcValorPraticoM2,
} from '../lib/pricing';
import { formatBRL, formatNumber2 } from '../lib/money';
import { groupByAmbiente } from '../lib/grouping';
import { supabase } from '../lib/supabase';

// ─── CONFIGURAÇÕES PADRÃO ─────────────────────────────────────────────────────
// C1: domínio em lib/films.ts; load/save em lib/calculatorConfig.ts.

const getCrmLeadHeaders = async () => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!supabase) return headers;

  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
};

import {
  AppConfig,
  ColorMode,
  DEFAULT_CONFIG,
  FILM_TYPE_LABELS,
  FilmTypeKey,
  GlassItem,
  LossMode,
  OptimizationMode,
  OrcamentoSalvo,
  createGlassId,
  getSizeColor,
  isColorMode,
  isLossMode,
  isOptimizationMode,
  normalizeFilmTypeKey,
  normalizeFilmTypes,
  resolveRoomKey,
  stableRoomColor,
} from '../lib/films';
import { loadConfig, saveConfig } from '../lib/calculatorConfig';
import { useCalculatorState } from '../hooks/useCalculatorState';
import { usePackingWorker } from '../hooks/usePackingWorker';
import { useDraftSync } from '../hooks/useDraftSync';
import { useCalculatorHistory } from '../hooks/useCalculatorHistory';

// ─── TIPOS ────────────────────────────────────────────────────────────────────


type ImportedGlass = Partial<GlassItem> & {
  h?: number;
  w?: number;
};

interface ImportedZapPayload {
  n?: string;
  b?: string;
  f?: string;
  p?: string;
  v?: ImportedGlass[];
}

interface SavedProjectPayload {
  config?: {
    cliente?: string;
    phone?: string;
    neighborhood?: string;
    rolo?: number | string;
    preco?: number | string;
    selectedFilm?: string;
  };
  vidros?: ImportedGlass[];
}

// ─── UNDO/REDO REDUCER ────────────────────────────────────────────────────────
// C1: movido para useCalculatorState (com os states da sessão).

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export function AdminCalculator() {
  const cfg = useMemo(() => loadConfig(), []);
  // C1: estado de sessão extraído (os ~32 useState + historyReducer).
  const {
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
  } = useCalculatorState(cfg);

  const [isCutMode, setIsCutMode] = useState(false);
  const [vidrosBackup, setVidrosBackup] = useState<GlassItem[]>([]);

  useEffect(() => {
    setPrice(filmTypes[selectedFilm] || 0);
  }, [selectedFilm, filmTypes, setPrice]);



    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(500);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const [currentLeadId, setCurrentLeadId] = useState<string | null>(null);
    // B1: toast único do DS (sucesso/erro) — substitui `alert`.
    const [toast, setToast] = useState<ToastData | null>(null);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const showToast = useCallback((msg: string, tone: ToastData['tone']) => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        setToast({ msg, tone });
        toastTimerRef.current = setTimeout(() => setToast(null), 3000);
    }, []);
    // B1: confirmação destrutiva do DS — substitui `window.confirm`.
    const [confirmDialog, setConfirmDialog] = useState<{
        title: string;
        message: string;
        confirmLabel: string;
        onConfirm: () => void;
    } | null>(null);
    // B1: importação Zap via modal — substitui `prompt`.
    const [importAberto, setImportAberto] = useState(false);
    const [importCode, setImportCode] = useState('');
    const [importError, setImportError] = useState<string | null>(null);
    // B1: validação inline — substitui `alert` silencioso/evasivo.
    const [addError, setAddError] = useState<string | null>(null);
    const [renameError, setRenameError] = useState<string | null>(null);

    // Estados para edição de nomes de ambientes
    const [editingAmbiente, setEditingAmbiente] = useState<string | null>(null);
    const [editNome, setEditNome] = useState('');
    const editInputRef = useRef<HTMLInputElement>(null);

    // Estados para copiar e colar peças
    const [itensCopiados, setItensCopiados] = useState<GlassItem[] | null>(null);
    const [showColarModal, setShowColarModal] = useState(false);
    const CLIPBOARD_KEY = 'lume_calculator_clipboard';

    useEffect(() => {
        if (editingAmbiente !== null && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingAmbiente, editNome]);

    // ─── RESTAURA CLIPBOARD GLOBAL DE PEÇAS (copiar/colar persiste reload) ───
    useEffect(() => {
        try {
            const saved = localStorage.getItem(CLIPBOARD_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setItensCopiados(parsed as GlassItem[]);
                }
            }
        } catch { /* ignore */ }
    }, []);

    const invoiceRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const heightRef = useRef<HTMLInputElement>(null);
    const widthRef = useRef<HTMLInputElement>(null);
    const qtyRef = useRef<HTMLInputElement>(null);

    // C1: histórico extraído (load nuvem→local + schema) — ver useCalculatorHistory.
    const {
        historico, setHistorico,
        historicoAberto, setHistoricoAberto,
        salvarNoHistorico: salvarNoHistoricoHook,
        carregarDoHistorico: carregarDoHistoricoHook,
        deletarDoHistorico,
    } = useCalculatorHistory({ authRefreshKey, notify: showToast });

    // C5: entrada animada via CSS (.admin-entrance em globals.css) — sem gsap.

    // ─── COMANDOS DE TECLADO ──────────────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                if (canUndo) undo();
            }
            if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                if (canRedo) redo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo, undo, redo]);

    // C1: worker de otimização extraído (com timeout/erro) — ver usePackingWorker.
    const { blocosCalculados, maxY, areaV, isCalculating, setIsCalculating } = usePackingWorker({
        vidros, rollW, margin, modoOtimizacao, agressividadeCorte, isCutMode,
        onEmptyVidros: () => { setDesconto(0); setSelectedIds([]); },
        onCutModeEmpty: () => { setSelectedIds([]); },
        onVidrosCountChange: () => { setDesconto(0); },
        onError: (msg) => showToast(msg, 'error'),
    });

    const currentAuthUserRef = useRef<string | null>(null);

    useEffect(() => {
        if (!supabase) return;

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const nextUserId = session?.user?.id ?? null;
            if (currentAuthUserRef.current !== null && currentAuthUserRef.current !== nextUserId) {
                setAuthRefreshKey((value) => value + 1);
            }
            currentAuthUserRef.current = nextUserId;
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [setAuthRefreshKey]);

    // ─── FORMATAÇÃO ────────────────────────────────────────────────────────────
    // (formatBRL/formatNumber2 canônicos em lib/money.ts)

    const handleDescontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value.replace(/\D/g, '');
        setDescontoInput(valor);
        setDesconto(parseInt(valor, 10) / 100 || 0);
    };

    const displayDesconto = useMemo(() => {
        const num = parseInt(descontoInput, 10) / 100 || 0;
        return formatNumber2(num);
    }, [descontoInput]);

// ─── AUTO-SAVE DRAFT ──────────────────────────────────────────────────
  // C1: rascunho extraído (autosave local+nuvem + restore) — ver useDraftSync.
  useDraftSync(
    {
      cliente, phone, neighborhood, vidros, desconto, descontoInput,
      rollW, price, margin, modoOtimizacao, userName, selectedFilm,
      roomColors, isCutMode,
    },
    {
      setVidros,
      setCliente, setPhone, setNeighborhood,
      setDesconto, setDescontoInput,
      setRollW, setPrice, setMargin,
      setModoOtimizacao, setUserName, setSelectedFilm,
      setRoomColors, setCloudStatus,
    },
    authRefreshKey,
  );

// ─── CLOUD CONFIG AUTO-SAVE (debounced 2s) ────────────────────────────────
  const configCloudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!configRestored) return;
    if (configCloudTimerRef.current) clearTimeout(configCloudTimerRef.current);
    configCloudTimerRef.current = setTimeout(() => {
      saveConfigToCloud(currentConfig);
    }, 2000);
    return () => { if (configCloudTimerRef.current) clearTimeout(configCloudTimerRef.current); };
  }, [configRestored, currentConfig]);

  // RESTORE CONFIG ON MOUNT (cloud-first, localStorage fallback) ────────────
  useEffect(() => {
    const restoreConfig = async () => {
      try {
        const scopeKey = await resolveCalculatorScopeKey();
        const cloud = await loadConfigFromCloud();
        const source = cloud || loadConfig(scopeKey);

        if (source.rollW) setRollW(source.rollW);
        if (source.price) setPrice(source.price);
        if (source.margin !== undefined) setMargin(source.margin);
        if (isOptimizationMode(source.modoOtimizacao)) setModoOtimizacao(source.modoOtimizacao);
        if (source.userName) setUserName(source.userName);
        if (isLossMode(source.modoPerdas)) setModoPerdas(source.modoPerdas);
        if (source.perdasFixas !== undefined) setPerdasFixas(source.perdasFixas);
        if (isColorMode(source.modoCorConfig)) setUsarCoresPorAmbiente(source.modoCorConfig === 'ambiente');
        if (source.agressividadeCorte !== undefined) setAgressividadeCorte(source.agressividadeCorte);
        if (source.filmTypes) setFilmTypes(normalizeFilmTypes(source.filmTypes));
        setSelectedFilm(normalizeFilmTypeKey(source.selectedFilm));
        if (source.draftExpiration !== undefined) setDraftExpiration(source.draftExpiration);

        if (cloud) {
          saveConfig({
            ...DEFAULT_CONFIG,
            ...source,
            modoOtimizacao: isOptimizationMode(source.modoOtimizacao) ? source.modoOtimizacao : DEFAULT_CONFIG.modoOtimizacao,
            modoPerdas: isLossMode(source.modoPerdas) ? source.modoPerdas : DEFAULT_CONFIG.modoPerdas,
            modoCorConfig: isColorMode(source.modoCorConfig) ? source.modoCorConfig : DEFAULT_CONFIG.modoCorConfig,
            selectedFilm: normalizeFilmTypeKey(source.selectedFilm),
            filmTypes: normalizeFilmTypes(source.filmTypes),
          }, scopeKey);
        }
      } finally {
        setConfigRestored(true);
      }
    };
    restoreConfig();
  }, [authRefreshKey, setRollW, setPrice, setMargin, setModoOtimizacao, setUserName, setModoPerdas, setPerdasFixas, setUsarCoresPorAmbiente, setAgressividadeCorte, setFilmTypes, setSelectedFilm, setDraftExpiration, setConfigRestored]);

  // C1: restore do rascunho movido para useDraftSync (nuvem primeiro, local como fallback).

    // ─── ENTER NOS INPUTS ──────────────────────────────────────────────────────

    const handleKeyDownHeight = (e: React.KeyboardEvent) => { if (e.key === 'Enter') widthRef.current?.focus(); };
    const handleKeyDownWidth = (e: React.KeyboardEvent) => { if (e.key === 'Enter') qtyRef.current?.focus(); };
    const handleKeyDownQty = (e: React.KeyboardEvent) => { if (e.key === 'Enter') adicionar(); };

  const getColorForItem = useCallback((label?: string, h?: number, w?: number, forceRoomScheme?: boolean) => {
    const useRoomScheme = forceRoomScheme ?? usarCoresPorAmbiente;
    if (!useRoomScheme) {
      return getSizeColor(h, w);
    }
    const roomLabel = (label || '').trim();
    if (!roomLabel) {
      return getSizeColor(h, w);
    }
    const key = resolveRoomKey(roomLabel);
    return roomColors[key] || stableRoomColor(roomLabel);
  }, [usarCoresPorAmbiente, roomColors]);

    // ─── AÇÕES DE VIDROS ───────────────────────────────────────────────────────

  const selectSameSize = useCallback((oh: number, ow: number, label?: string) => {
    const targetLabel = label || '';
    const ids = vidros
      .filter(v => v.oh === oh && v.ow === ow && (v.label || '') === targetLabel)
      .map(v => v.id);
    const allAlreadySelected = ids.length > 0 && ids.every(id => selectedIds.includes(id));
    if (allAlreadySelected) {
      setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...ids])]);
    }
  }, [vidros, selectedIds, setSelectedIds]);

    const adicionar = () => {
        const h = parseFloat(heightIn.replace(',', '.'));
        const w = parseFloat(widthIn.replace(',', '.'));
        const q = parseInt(qtyIn) || 1;
        if (!h || !w || h <= 0 || w <= 0 || q <= 0) {
            setAddError('Informe altura e largura válidas (maiores que zero).');
            return;
        }
        const label = labelIn.trim();
        const roomColor = getColorForItem(label, h, w);
        const novos: GlassItem[] = [];
        for (let i = 0; i < q; i++) {
            novos.push({
                id: createGlassId(),
                h, w, oh: h, ow: w,
                label: label || undefined,
                cor: roomColor,
                forceRotate: undefined,
                alignRight: false,
                sortOrder: vidros.length + i,
            });
        }
        setVidros([...vidros, ...novos]);
        setAddError(null);
        setHeightIn(''); setWidthIn(''); setQtyIn('1');
        heightRef.current?.focus();
    };

    // B1: some com o erro inline assim que o usuário corrige os campos.
    useEffect(() => {
        if (addError) setAddError(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [heightIn, widthIn, qtyIn]);

    const removerTudoTipo = (h: number, w: number, label?: string) => {
        setVidros(current => current.filter(v => !(v.oh === h && v.ow === w && (v.label || '') === (label || ''))));
    };

    const limparTudo = () => {
        if (vidros.length === 0) return;
        setConfirmDialog({
            title: 'Limpar tudo?',
            message: 'Remove TODAS as peças, o cliente e as configurações da sessão. Essa ação não pode ser desfeita.',
            confirmLabel: 'Remover tudo',
            onConfirm: () => {
                setVidros([]);
                try { localStorage.removeItem(CLIPBOARD_KEY); } catch { /* ignore */ }
                setItensCopiados(null);
                setDesconto(0);
                setDescontoInput('0');
                setCliente('');
                setPhone('');
                setNeighborhood('');
                setRollW(DEFAULT_CONFIG.rollW);
                setPrice(DEFAULT_CONFIG.price);
                setMargin(DEFAULT_CONFIG.margin);
                setSelectedIds([]);
                setConfirmDialog(null);
            },
        });
    };

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }, [setSelectedIds]);

    const toggleAmbienteSelection = (ambiente: string) => {
        const targetLabel = ambiente === 'Sem Ambiente' ? '' : ambiente;
        const vidrosAmbiente = vidros.filter(v => (v.label || '') === targetLabel);
        if (vidrosAmbiente.length === 0) return;

        const allSelected = vidrosAmbiente.every(v => selectedIds.includes(v.id));

        if (allSelected) {
            // Deselect all
            const idsToRemove = new Set(vidrosAmbiente.map(v => v.id));
            setSelectedIds(prev => prev.filter(id => !idsToRemove.has(id)));
        } else {
            // Select all
            const idsToAdd = vidrosAmbiente.map(v => v.id).filter(id => !selectedIds.includes(id));
            setSelectedIds(prev => [...prev, ...idsToAdd]);
        }
    };

    const confirmarRenomeacao = () => {
        if (!editingAmbiente || !editNome.trim()) {
            setEditingAmbiente(null);
            setEditNome('');
            setRenameError(null);
            return;
        }
        const novoNome = editNome.trim();
        const labelAntigo = editingAmbiente === 'Sem Ambiente' ? '' : editingAmbiente;
        if (novoNome === labelAntigo || (editingAmbiente === 'Sem Ambiente' && novoNome === '')) {
            setEditingAmbiente(null);
            setEditNome('');
            setRenameError(null);
            return;
        }
        // Verifica se já existe ambiente com esse nome
        const jaExiste = vidros.some(v => (v.label || '') === novoNome && (v.label || '') !== labelAntigo);
        if (jaExiste) {
            setRenameError('Já existe um ambiente com este nome.');
            return;
        }
        setVidros(prev => prev.map(v => (v.label || '') === labelAntigo ? { ...v, label: novoNome || undefined } : v));
        setEditingAmbiente(null);
        setEditNome('');
        setRenameError(null);
    };

    const iniciarRenomeacao = (label: string) => {
        setEditingAmbiente(label || 'Sem Ambiente');
        setEditNome(label);
        setRenameError(null);
    };

    const handleEditNomeChange = (v: string) => {
        setEditNome(v);
        if (renameError) setRenameError(null);
    };

    // B4: cancela a renomeação sem setter cru no filho.
    const handleCancelarRenomeacao = () => {
        setEditingAmbiente(null);
        setEditNome('');
        setRenameError(null);
    };

    const handleDeleteSelected = () => {
        setVidros(prev => prev.filter(v => !selectedIds.includes(v.id)));
        setSelectedIds([]);
    };

    const handleRotateSelected = () => {
        setVidros(prev => prev.map(v =>
            selectedIds.includes(v.id)
                ? { ...v, forceRotate: v.forceRotate === true ? undefined : true }
                : v
        ));
    };

    const handleAlignSelected = (dir: 'left' | 'right') => {
        setVidros(prev => prev.map(v =>
            selectedIds.includes(v.id) ? { ...v, alignRight: dir === 'right' } : v
        ));
    };

    const handleCopiarSelecionados = () => {
        const selecionados = vidros.filter(v => selectedIds.includes(v.id));
        if (selecionados.length === 0) return;
        const copia = [...selecionados];
        setItensCopiados(copia);
        try { localStorage.setItem(CLIPBOARD_KEY, JSON.stringify(copia)); } catch { /* ignore */ }
        setSelectedIds([]);
    };

    const handleAbrirModalColar = () => {
        if (!itensCopiados || itensCopiados.length === 0) return;
        setShowColarModal(true);
    };

    const colarItens = (labelDestino: string) => {
        if (!itensCopiados || itensCopiados.length === 0) return;
        const novos = itensCopiados.map(item => ({
            ...item,
            id: createGlassId(),
            label: labelDestino || undefined,
            cor: getColorForItem(labelDestino, item.oh, item.ow),
        }));
        setVidros(prev => [...prev, ...novos]);
        setSelectedIds([]);
        setItensCopiados(null);
        try { localStorage.removeItem(CLIPBOARD_KEY); } catch { /* ignore */ }
        setShowColarModal(false);
    };

    // ─── DRAG HANDLERS COM MAGNETIC SNAP ────────────────────────────────────────

    const scale = containerWidth / rollW; // px per cm



    // ─── HISTÓRICO ─────────────────────────────────────────────────────────────

    const totalAreaM2 = useMemo(() => {
        return calcTotalAreaM2(vidros);
    }, [vidros]);

    const subtotalBruto = useMemo(() => {
        return calcSubtotalBruto(totalAreaM2, price);
    }, [totalAreaM2, price]);

    const eficiencia = useMemo(() => {
        return calcEficiencia(maxY, areaV, rollW);
    }, [maxY, areaV, rollW]);

    const compensacaoPerda = useMemo(() => {
        return calcCompensacaoPerda({ compensarPerdas, modoPerdas, perdasFixas, eficiencia, subtotalBruto });
    }, [compensarPerdas, modoPerdas, perdasFixas, eficiencia, subtotalBruto]);

    const finalPrice = calcFinalPrice(subtotalBruto, compensacaoPerda, desconto);

    // C1: persistência no hook (com schema); aqui só o snapshot da sessão.
    const salvarNoHistorico = useCallback(() => {
        salvarNoHistoricoHook({
            cliente: cliente || 'Sem nome',
            phone,
            neighborhood,
            valor: finalPrice,
            qtd: vidros.length,
            vidros: [...vidros],
            config: { rollW, price, margin },
            desconto,
            modoOtimizacao,
            selectedFilm,
            leadId: currentLeadId ?? undefined,
        });
    }, [vidros, cliente, phone, neighborhood, finalPrice, rollW, price, margin, desconto, modoOtimizacao, selectedFilm, currentLeadId, salvarNoHistoricoHook]);

    const criarLead = useCallback(async () => {
      if (!cliente && !phone) {
        showToast('Preencha o nome ou telefone do cliente.', 'error');
        return;
      }
      const totalM2 = roundMeasure(vidros.reduce((acc, v) => acc + (v.oh * v.ow), 0) / 10000);
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: await getCrmLeadHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          name: cliente || `Cliente ${phone}`,
          phone,
          email: '',
          address: '',
          neighborhood: neighborhood || '',
          filmType: FILM_TYPE_LABELS[selectedFilm] || 'Nano Cerâmica',
            sqm: totalM2,
            value: finalPrice,
          status: 'Novo',
          notes: `Película: ${FILM_TYPE_LABELS[selectedFilm]}.`,
        }),
      });
      if (res.ok) {
        const createdLead = await res.json().catch(() => null);
        const leadId = createdLead?.id || null;
        setCurrentLeadId(leadId);

        if (vidros.length > 0 && leadId) {
          const clienteNome = cliente || `Cliente ${phone}`;
          const existing = historico.find(h => h.cliente === clienteNome && !h.leadId);
          if (existing) {
            const atualizado = historico.map(h => (h.id === existing.id ? { ...h, leadId } : h));
            setHistorico(atualizado);
            saveHistoryItemToCloud({ ...existing, leadId });
            resolveCalculatorScopeKey().then((scopeKey) => {
              localStorage.setItem(buildCalculatorStorageKey('lume_historico', scopeKey), JSON.stringify(atualizado));
            }).catch(() => null);
          } else {
            const orcId = crypto.randomUUID();
            await saveHistoryItemToCloud({
              id: orcId,
              cliente: clienteNome,
              phone,
              neighborhood,
              data: new Date().toLocaleDateString('pt-BR'),
              valor: finalPrice,
              qtd: vidros.length,
              vidros: vidros.map(v => ({ h: v.oh, w: v.ow, label: v.label || '' })),
              config: { rollW, price, margin },
              desconto,
              modoOtimizacao: modoOtimizacao,
              selectedFilm,
              leadId,
            });
            const novoLocal: OrcamentoSalvo = {
              id: orcId,
              cliente: clienteNome,
              phone,
              neighborhood,
              data: new Date().toLocaleDateString('pt-BR'),
              valor: finalPrice,
              qtd: vidros.length,
              vidros: [...vidros],
              config: { rollW, price, margin },
              desconto,
              modoOtimizacao: modoOtimizacao,
              selectedFilm,
              leadId,
            };
            const atualizado = [novoLocal, ...historico].slice(0, 100);
            setHistorico(atualizado);
            resolveCalculatorScopeKey().then((scopeKey) => {
              localStorage.setItem(buildCalculatorStorageKey('lume_historico', scopeKey), JSON.stringify(atualizado));
            }).catch(() => null);
          }
        }

        showToast('Lead criado com sucesso!', 'success');
      } else {
        const err = await res.json();
        const details = [err.error, err.details, err.hint].filter(Boolean).join(' - ');
        showToast('Erro ao criar lead: ' + (details || 'desconhecido'), 'error');
      }
    }, [cliente, phone, neighborhood, vidros, selectedFilm, finalPrice, rollW, price, margin, desconto, modoOtimizacao, historico, setHistorico, showToast]);

// C1: abrir passa pelo schema do hook; aqui só a aplicação na sessão.
const carregarDoHistorico = (orc: OrcamentoSalvo) => {
    carregarDoHistoricoHook(orc, (valid) => {
    setCliente(valid.cliente);
    setPhone(valid.phone || '');
    setNeighborhood(valid.neighborhood || '');
    setRollW(valid.config.rollW);
        setPrice(valid.config.price);
        setMargin(valid.config.margin);
        if (valid.desconto !== undefined) {
            setDesconto(valid.desconto);
            setDescontoInput((valid.desconto * 100).toString());
        }
  if (isOptimizationMode(valid.modoOtimizacao)) setModoOtimizacao(valid.modoOtimizacao);
    setSelectedFilm(normalizeFilmTypeKey(valid.selectedFilm));
    if (valid.leadId) setCurrentLeadId(valid.leadId);
    setVidros(valid.vidros);
    });
    };

    // ─── IMPORTAR / SALVAR / ABRIR ─────────────────────────────────────────────

    const importarZap = () => {
        setImportCode('');
        setImportError(null);
        setImportAberto(true);
    };

    const confirmarImportacaoZap = () => {
        const code = importCode.trim();
        if (!code) return;
        try {
            const d = JSON.parse(atob(code)) as ImportedZapPayload;
            if (!Array.isArray(d.v)) throw new Error('Payload sem vidros');
            setCliente(`${d.n} (${d.b}) - ${d.f}`);
            if (d.p) setPhone(d.p);
            setVidros(d.v.map((v) => ({ ...v, id: createGlassId(), oh: v.oh ?? v.h ?? 0, ow: v.ow ?? v.w ?? 0, forceRotate: undefined, alignRight: false })) as GlassItem[]);
            setImportAberto(false);
            showToast(`${d.v.length} peça(s) importada(s)!`, 'success');
        } catch {
            setImportError('Código inválido. Confira e tente de novo.');
        }
    };

    const salvarProjeto = () => {
        const dados = {
            config: { cliente, phone, neighborhood, rolo: rollW, preco: price, selectedFilm },
            vidros: [...vidros],
        };
        const blob = new Blob([JSON.stringify(dados)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${cliente.replace(/\W+/g, '_') || 'projeto'}.insul`;
        a.click();
    };

    const abrirProjeto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const d = JSON.parse(ev.target?.result as string) as SavedProjectPayload;
                setCliente(d.config?.cliente || '');
                setPhone(d.config?.phone || '');
                if (d.config?.neighborhood) setNeighborhood(d.config.neighborhood);
                setRollW(parseFloat(String(d.config?.rolo ?? '')) || 152);
                setPrice(parseFloat(String(d.config?.preco ?? '')) || 80);
                setSelectedFilm(normalizeFilmTypeKey(d.config?.selectedFilm));
                setVidros((d.vidros || []).map((v) => ({ ...v, oh: v.oh ?? v.h ?? 0, ow: v.ow ?? v.w ?? 0 })) as GlassItem[]);
                setDesconto(0);
            } catch {
                showToast('Arquivo inválido.', 'error');
            }
        };
        reader.readAsText(file);
    };

    const getNativeShareContext = async () => {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return null;

        const [{ Filesystem, Directory }, { Share }] = await Promise.all([
            import('@capacitor/filesystem'),
            import('@capacitor/share'),
        ]);

        return { Filesystem, Directory, Share };
    };

    const gerarImagem = async () => {
        if (!invoiceRef.current) return;
        setIsCalculating(true);
        try {
            const { toPng } = await import('html-to-image');
            const dataUrl = await toPng(invoiceRef.current, {
                pixelRatio: 2,
                backgroundColor: "#0a0f1e",
                style: {
                    transform: 'none',
                    margin: '0'
                }
            });

            const nativeShare = await getNativeShareContext();
            if (nativeShare) {
                const fileName = `Orcamento_${cliente.replace(/\W+/g, '_') || 'LUME'}.png`;
                const base64Data = dataUrl.split(',')[1];
                const savedFile = await nativeShare.Filesystem.writeFile({
                    path: fileName,
                    data: base64Data,
                    directory: nativeShare.Directory.Cache
                });
                await nativeShare.Share.share({
                    title: 'Compartilhar Orçamento (PNG)',
                    url: savedFile.uri,
                });
            } else {
                const link = document.createElement('a');
                link.download = `Orcamento_${cliente.replace(/\s+/g, '_') || 'LUME'}.png`;
                link.href = dataUrl;
                link.click();
            }
        } catch (err) {
            logger.error('Falha no calculo', err);
        } finally {
            setIsCalculating(false);
        }
    };

    const gerarPDF = async () => {
        setIsCalculating(true);
        try {
            const [{ pdf }, { InvoicePDF }] = await Promise.all([
                import('@react-pdf/renderer'),
                import('../components/InvoicePDF'),
            ]);

            const blob = await pdf(
                <InvoicePDF
                    cliente={cliente}
                    userName={userName}
                    resumo={resumo}
                    totalAreaM2={totalAreaM2}
                    areaV={areaV}
                    eficiencia={eficiencia}
                    finalPrice={finalPrice}
                    descontoInput={descontoInput}
                />
            ).toBlob();

            const nativeShare = await getNativeShareContext();
            if (nativeShare) {
                const fileName = `Orcamento_${cliente.replace(/\W+/g, '_') || 'LUME'}.pdf`;
                const reader = new FileReader();
                reader.readAsDataURL(blob); 
                reader.onloadend = async () => {
                    const base64data = (reader.result as string).split(',')[1];
                    const savedFile = await nativeShare.Filesystem.writeFile({
                        path: fileName,
                        data: base64data,
                        directory: nativeShare.Directory.Cache
                    });
                    await nativeShare.Share.share({
                        title: 'Compartilhar Orçamento (PDF)',
                        url: savedFile.uri,
                    });
                };
            } else {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Orcamento_${cliente.replace(/\W+/g, '_') || 'LUME'}.pdf`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 100);
            }
        } catch (err) {
            logger.error('Falha no calculo', err);
        } finally {
            setIsCalculating(false);
        }
    };

const atualizarConfig = useCallback(<K extends keyof AppConfig>(key: K, value: AppConfig[K]) => {
    if (key === 'modoCorConfig') {
      const nextMode = value as ColorMode;
      setUsarCoresPorAmbiente(nextMode === 'ambiente');
      setVidros(prev => prev.map(v => ({
        ...v,
        cor: getColorForItem(v.label, v.oh, v.ow, nextMode === 'ambiente'),
      })));
    } else {
      switch (key) {
        case 'rollW':
          setRollW(value as number);
          break;
        case 'price':
          setPrice(value as number);
          break;
        case 'margin':
          setMargin(value as number);
          break;
        case 'modoOtimizacao':
          setModoOtimizacao(value as OptimizationMode);
          break;
        case 'userName':
          setUserName(value as string);
          break;
        case 'modoPerdas':
          setModoPerdas(value as LossMode);
          break;
        case 'perdasFixas':
          setPerdasFixas(Math.min(100, Math.max(0, value as number)));
          break;
        case 'agressividadeCorte':
          setAgressividadeCorte(value as number);
          break;
        case 'filmTypes':
          setFilmTypes(value as Record<FilmTypeKey, number>);
          break;
        case 'selectedFilm':
          setSelectedFilm(value as FilmTypeKey);
          break;
        case 'draftExpiration':
          setDraftExpiration(Math.max(0, value as number));
          break;
      }
    }
    const normalizedValue = key === 'perdasFixas' ? Math.min(100, Math.max(0, value as number)) : value;
    const updated = { ...currentConfig, [key]: normalizedValue };
    resolveCalculatorScopeKey().then((scopeKey) => saveConfig(updated, scopeKey)).catch(() => saveConfig(updated));
  }, [currentConfig, getColorForItem, setVidros, setUsarCoresPorAmbiente, setRollW, setPrice, setMargin, setModoOtimizacao, setUserName, setModoPerdas, setPerdasFixas, setAgressividadeCorte, setFilmTypes, setSelectedFilm, setDraftExpiration]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setConfigAberto(false);

    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      logger.warn('Falha ao encerrar a sessao do Supabase', { error });
    }

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      logger.warn('Falha ao limpar cookies da sessao', { error });
    }

    // C3: limpa o scope em cache para a próxima conta resolver do zero.
    resetCalculatorScopeCache();

    window.location.href = '/login';
  }, [isLoggingOut, setIsLoggingOut, setConfigAberto]);

    // ─── MEMOS ─────────────────────────────────────────────────────────────────

    const valorSelecionados = useMemo(() => {
        if (selectedIds.length === 0) return 0;
        const area = vidros.filter(v => selectedIds.includes(v.id)).reduce((acc, v) => acc + (v.ow * v.oh), 0);
        return (area / 10000) * price;
    }, [vidros, selectedIds, price]);
    const areaSelecionadaM2 = useMemo(() => {
        if (selectedIds.length === 0) return 0;
        const area = vidros.filter(v => selectedIds.includes(v.id)).reduce((acc, v) => acc + (v.ow * v.oh), 0);
        return area / 10000;
  }, [vidros, selectedIds]);

    const resumo = useMemo(() => {
        const map = new Map<string, { h: number, w: number, q: number, label: string }>();
        vidros.forEach(v => {
            const label = v.label || '';
            const k = `${label}-${v.oh}x${v.ow}`;
            if (map.has(k)) map.get(k)!.q++;
            else map.set(k, { h: v.oh, w: v.ow, q: 1, label });
        });
        return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
    }, [vidros]);

    const groupedResumo = useMemo(() => groupByAmbiente(resumo), [resumo]);

    const currentRoomLabel = labelIn.trim();
    const currentRoomKey = resolveRoomKey(currentRoomLabel);
    const currentRoomColor = currentRoomLabel ? (roomColors[currentRoomKey] || stableRoomColor(currentRoomLabel)) : '#94a3b8';
    const hasCurrentRoomPieces = currentRoomLabel ? vidros.some(v => (v.label || '') === currentRoomLabel) : false;
    const aplicarCorNoAmbiente = (ambiente: string) => {
        const trimmed = ambiente.trim();
        if (!trimmed) return;
        const color = getColorForItem(trimmed, undefined, undefined, true);
        setVidros(prev => prev.map(v => (v.label || '') === trimmed ? { ...v, cor: color } : v));
    };

    // C2: callbacks de intenção (filhos não recebem setter cru).
    const handleToggleCorEsquema = () => {
        const next = !usarCoresPorAmbiente;
        setUsarCoresPorAmbiente(next);
        setVidros(prev => prev.map(v => ({
            ...v,
            cor: getColorForItem(v.label, v.oh, v.ow, next)
        })));
    };
    const handleSelectRoomColor = (swatch: string) => {
        if (!currentRoomLabel) return;
        setRoomColors(prev => ({ ...prev, [currentRoomKey]: swatch }));
    };
    const handleEnterCutMode = () => {
        setVidrosBackup(vidros);
        setIsCutMode(true);
    };
    const handleExitCutMode = () => {
        setVidros(vidrosBackup);
        setIsCutMode(false);
        setVidrosBackup([]);
    };

    const m = calcMetrosComprar(maxY);
    const valorPraticoM2 = calcValorPraticoM2(finalPrice, areaV);

    // ─── RENDER ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#040811] text-white py-6 px-2 sm:px-4 relative overflow-x-hidden">

            {/* PAINEL LATERAL: CONFIGURAÇÕES (EXTRAÍDO) */}
      <ConfigPanel
        aberto={configAberto}
        setAberto={setConfigAberto}
        config={{ rollW, price, margin, modoOtimizacao, userName, modoPerdas, perdasFixas, modoCorConfig: usarCoresPorAmbiente ? 'ambiente' : 'tamanho', agressividadeCorte, filmTypes, selectedFilm, draftExpiration }}
        onUpdate={atualizarConfig}
        onLogout={handleLogout}
        loggingOut={isLoggingOut}
      />

            {/* PAINEL LATERAL: HISTÓRICO (EXTRAÍDO) */}
            <HistoryPanel 
                aberto={historicoAberto}
                setAberto={setHistoricoAberto}
                historico={historico}
                formatBRL={formatBRL}
                onCarregar={carregarDoHistorico}
                onDeletar={deletarDoHistorico}
            />

            {/* BARRA FLUTUANTE: SELEÇÃO */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1e293b] border border-[#3b82f6]/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] p-3 rounded-2xl z-50 flex flex-col gap-3 transition-all animate-fade-in w-[95%] max-w-md">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-sm sm:text-base font-black text-white leading-none whitespace-nowrap">{selectedIds.length} <span className="text-gray-400 text-xs">filme(s)</span></span>
                        <span className="text-base sm:text-lg xl:text-xl font-black text-green-400 leading-none">{formatBRL(valorSelecionados)}</span>
                        <span className="text-sm sm:text-base font-bold text-blue-300 leading-none whitespace-nowrap">{areaSelecionadaM2.toFixed(2)} m²</span>
                    </div>
                    <div className="h-px w-full bg-white/10" />
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 flex items-center gap-2 sm:gap-3">
                        <button
                            onPointerDown={(e) => { e.preventDefault(); handleRotateSelected(); }}
                            className="flex-1 p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 hover:text-[#c9a227] rounded-xl transition-colors flex items-center justify-center"
                            title="Girar 90º"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            onPointerDown={(e) => { e.preventDefault(); handleAlignSelected('left'); }}
                            className="flex-1 p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 hover:text-blue-400 rounded-xl transition-colors flex items-center justify-center"
                            title="Alinhar à Esquerda"
                        >
                            <AlignLeft size={18} />
                        </button>
                        <button
                            onPointerDown={(e) => { e.preventDefault(); handleAlignSelected('right'); }}
                            className="flex-1 p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 hover:text-blue-400 rounded-xl transition-colors flex items-center justify-center"
                            title="Alinhar à Direita"
                        >
                            <AlignRight size={18} />
                        </button>
                        <button
                            onPointerDown={(e) => { e.preventDefault(); handleCopiarSelecionados(); }}
                            className="flex-1 p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 hover:text-[#25d366] rounded-xl transition-colors flex items-center justify-center"
                            title="Copiar Peças Selecionadas"
                        >
                            <Copy size={18} />
                        </button>
                        {itensCopiados && itensCopiados.length > 0 && (
                            <button
                                onPointerDown={(e) => { e.preventDefault(); handleAbrirModalColar(); }}
                                className="flex-1 p-2 sm:p-2.5 bg-[#c9a227]/10 border border-[#c9a227]/30 hover:bg-[#c9a227]/20 text-[#c9a227] rounded-xl transition-colors flex items-center justify-center"
                                title={`Colar ${itensCopiados.length} peça(s) copiada(s)`}
                            >
                                <ClipboardPaste size={18} />
                            </button>
                        )}
                        <button
                            onPointerDown={(e) => { e.preventDefault(); handleDeleteSelected(); }}
                            className="flex-1 p-2 sm:p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-colors flex items-center justify-center"
                            title="Deletar Peças"
                        >
                            <Trash2 size={18} />
                        </button>
                        </div>
                        <button onClick={() => setSelectedIds([])} className="p-2 text-gray-400 hover:text-white transition-colors shrink-0"><X size={18} /></button>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 pb-24">

                {/* HEADER */}
                <div className="col-span-1 xl:col-span-12 admin-entrance flex flex-col xl:flex-row items-center justify-between mb-2">
                    <div className="flex items-center gap-4 mb-4 xl:mb-0">
                        <div className="p-3 bg-[#111e33] border border-[#233554] rounded-xl">
                            <Calculator className="text-[#c9a227]" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold font-montserrat">LUME <span className="font-light text-gray-400">Calculator</span></h1>
                        </div>
                        <div className="flex items-center gap-1.5 ml-2" title={isCutMode ? 'Sincronização pausada (Modo de Corte)' : cloudStatus === 'synced' ? 'Sincronizado com a nuvem' : cloudStatus === 'syncing' ? 'Sincronizando...' : cloudStatus === 'error' ? 'Erro de sincronização' : 'Nuvem'}>
                            <span className={`h-2 w-2 rounded-full ${isCutMode || cloudStatus === 'error' ? 'bg-red-400' : cloudStatus === 'syncing' ? 'bg-[#f5d77a] animate-pulse' : cloudStatus === 'synced' ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-nowrap justify-end xl:justify-end overflow-x-auto pb-1 scrollbar-hide">
                        <button
                            onClick={() => setConfigAberto(true)}
                            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all shrink-0"
                            title="Configurações Padrão"
                        >
                            <Settings size={14} /> <span className="hidden sm:inline">Config</span>
                        </button>
                        <a
                            href="/crm/"
                            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all shrink-0"
                            title="Abrir CRM"
                        >
                            <User size={14} /> <span className="hidden sm:inline">CRM</span>
                        </a>
                        <button
                            onClick={limparTudo}
                            disabled={vidros.length === 0}
                            title="Limpar tudo"
                            className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border shrink-0 ${vidros.length > 0 ? 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20 hover:text-red-200' : 'border-white/5 text-white/20 cursor-not-allowed'}`}
                        >
                            <Trash2 size={14} /> <span className="hidden sm:inline">Limpar</span>
                        </button>
                        <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-0.5 shrink-0">
                            <button
                                onClick={() => undo()}
                                disabled={!canUndo}
                                title="Desfazer (Ctrl+Z)"
                                className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${canUndo ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-white/20 cursor-not-allowed'}`}
                            >
                                <Undo2 size={14} /> <span className="hidden sm:inline">Desfazer</span>
                            </button>
                            <div className="w-px self-stretch bg-white/10" />
                            <button
                                onClick={() => redo()}
                                disabled={!canRedo}
                                title="Refazer (Ctrl+Y)"
                                className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${canRedo ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-white/20 cursor-not-allowed'}`}
                            >
                                <Redo2 size={14} /> <span className="hidden sm:inline">Refazer</span>
                            </button>
                        </div>
                        <button
                            onClick={() => setHistoricoAberto(true)}
                            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#c9a227]/10 border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227]/20 transition-all shrink-0"
                        >
                            <History size={14} /> <span className="hidden sm:inline">Histórico</span>
                            {historico.length > 0 && (
                                <span className="bg-[#c9a227] text-black rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] font-black">{historico.length}</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* COLUNA ESQUERDA */}
                <div className="col-span-1 xl:col-span-4 space-y-6">
                    <InputPanel
                        clienteProps={{
                            cliente, phone, neighborhood,
                            onClienteChange: setCliente,
                            onPhoneChange: setPhone,
                            onNeighborhoodChange: setNeighborhood,
                            onImportarZap: importarZap,
                            onSalvarProjeto: salvarProjeto,
                            fileInputRef,
                            onAbrirProjeto: abrirProjeto,
                        }}
                        roloProps={{
                            rollW, selectedFilm, margin, price,
                            onRollWChange: setRollW,
                            onSelectedFilmChange: setSelectedFilm,
                            onMarginChange: setMargin,
                        }}
                        corProps={{
                            usarCoresPorAmbiente,
                            currentRoomColor,
                            currentRoomLabel,
                            hasCurrentRoomPieces,
                            onToggleCorEsquema: handleToggleCorEsquema,
                            onSelectRoomColor: handleSelectRoomColor,
                            onAplicarCorNoAmbiente: aplicarCorNoAmbiente,
                        }}
                        medidaProps={{
                            labelIn, heightIn, widthIn, qtyIn,
                            onLabelInChange: setLabelIn,
                            onHeightChange: setHeightIn,
                            onWidthChange: setWidthIn,
                            onQtyChange: setQtyIn,
                            heightRef, widthRef, qtyRef,
                            onHeightKeyDown: handleKeyDownHeight,
                            onWidthKeyDown: handleKeyDownWidth,
                            onQtyKeyDown: handleKeyDownQty,
                            onAdicionar: adicionar,
                            addError,
                        }}
                    />

                    {resumo.length > 0 && (
                        <ResumeList
                            listaProps={{
                                resumo, vidros, selectedIds, getColorForItem,
                                onRemoverTudoTipo: removerTudoTipo,
                            }}
                            renameProps={{
                                editingAmbiente, editNome, renameError, editInputRef,
                                onEditNomeChange: handleEditNomeChange,
                                onConfirmarRenomeacao: confirmarRenomeacao,
                                onCancelarRenomeacao: handleCancelarRenomeacao,
                                onIniciarRenomeacao: iniciarRenomeacao,
                            }}
                            selectionProps={{
                                onToggleAmbienteSelection: toggleAmbienteSelection,
                            }}
                        />
                    )}
                </div>

                {/* COLUNA DIREITA */}
                <div className="col-span-1 xl:col-span-8 space-y-6">
                    {vidros.length === 0 ? (
                        <div className="admin-entrance flex-1 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-gray-500 p-10 min-h-[400px]">
                            <Scissors size={48} className="mb-4 opacity-50 text-[#c9a227]" />
                            <p className="font-montserrat font-medium text-lg text-white/50">Otimizador de Corte</p>
                        </div>
                    ) : (
                        <>
                            <ResultPanel
                                finalPrice={finalPrice}
                                totalAreaM2={totalAreaM2}
                                valorPraticoM2={valorPraticoM2}
                                metrosComprar={m}
                                eficiencia={eficiencia}
                                displayDesconto={displayDesconto}
                                onDescontoChange={handleDescontoChange}
                                compensarPerdas={compensarPerdas}
                                onTogglePerdas={() => setCompensarPerdas(!compensarPerdas)}
                                modoPerdas={modoPerdas}
                                perdasFixas={perdasFixas}
                                onSalvar={salvarNoHistorico}
                                onGerarImagem={gerarImagem}
                                onGerarPDF={gerarPDF}
                                formatBRL={formatBRL}
                            />

                            <CutModeToolbar
                                isCutMode={isCutMode}
                                onEnterCutMode={handleEnterCutMode}
                                onExitCutMode={handleExitCutMode}
                                onCriarLead={criarLead}
                            />

                              {isCutMode && (
                                  <div className="w-full bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-center text-[10px] font-bold uppercase tracking-wider mb-4 animate-pulse flex items-center justify-center gap-2 shadow-lg">
                                      <Scissors size={14} /> Modo de Corte Ativo - Sincronização Pausada
                                  </div>
                              )}

                            <div id="calc-algoritmo" className="flex items-center gap-2 mb-4 w-full scroll-mt-24">
                                <div className="flex bg-[#04080f] border border-white/10 p-1.5 rounded-xl shadow-2xl flex-1 max-w-sm ml-auto">
                                    <button onClick={() => setModoOtimizacao('densidade')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${modoOtimizacao === 'densidade' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Corte Densidade</button>
                                    <button onClick={() => setModoOtimizacao('facilidade')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${modoOtimizacao === 'facilidade' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Corte Fácil v1</button>
                                    <button onClick={() => setModoOtimizacao('facilidade_v2')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${modoOtimizacao === 'facilidade_v2' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Corte Fácil v2</button>
                                </div>
                            </div>

                            <CutMap
                                isCutMode={isCutMode}
                                rollW={rollW}
                                maxY={maxY}
                                scale={scale}
                                isCalculating={isCalculating}
                                containerWidth={containerWidth}
                                blocosCalculados={blocosCalculados}
                                selectedIds={selectedIds}
                                toggleSelection={toggleSelection}
                                selectSameSize={selectSameSize}
                                containerRef={containerRef}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* INVOICE PNG OCULTO (EXTRAÍDO) */}
            <InvoicePNG 
                ref={invoiceRef}
                cliente={cliente}
                userName={userName}
                vidrosCount={vidros.length}
                groupedResumo={groupedResumo}
                totalAreaM2={totalAreaM2}
                finalPrice={finalPrice}
                subtotalBruto={subtotalBruto}
                desconto={desconto}
                perdas={compensacaoPerda}
                formatBRL={formatBRL}
            />

            <div className="text-center text-[10px] text-gray-500 mt-10 pb-4 font-bold tracking-widest uppercase">
                2026 - lume controle solar - todos os direitos reservados
            </div>

            <Toast toast={toast} />

            {/* B1: confirmação destrutiva do DS (ex-`confirm` do Limpar) */}
            <ConfirmDialog
                show={confirmDialog !== null}
                title={confirmDialog?.title ?? ''}
                message={confirmDialog?.message ?? ''}
                confirmLabel={confirmDialog?.confirmLabel ?? 'Confirmar'}
                danger
                onConfirm={() => confirmDialog?.onConfirm()}
                onCancel={() => setConfirmDialog(null)}
            />

            {/* B1: importação Zap via modal (ex-`prompt`) */}
            <ImportModal
                show={importAberto}
                code={importCode}
                setCode={(v) => { setImportCode(v); if (importError) setImportError(null); }}
                error={importError}
                onClose={() => setImportAberto(false)}
                onImport={confirmarImportacaoZap}
            />

            {/* MODAL: COLAR EM... */}
            <ColarModal
                show={showColarModal}
                onClose={() => setShowColarModal(false)}
                resumo={resumo}
                colarItens={colarItens}
                labelIn={labelIn}
            />
        </div>
    );
}
