'use client';

import React, { useState, useEffect, useRef, useMemo, useReducer, useCallback } from 'react';
import {
    Plus, Trash2, Smartphone, Save, FolderOpen, Scissors,
    Calculator, Camera, Layers, RotateCcw, AlignRight, AlignLeft, X,
    History, Clock, ChevronRight, Undo2, Redo2, FileText, Settings, Cloud, CloudOff, Loader2, Copy, ClipboardPaste
} from 'lucide-react';
import gsap from 'gsap';
import * as htmlToImage from 'html-to-image';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from '../components/InvoicePDF';
import { InvoicePNG } from '../components/InvoicePNG';
import { ConfigPanel } from '../components/ConfigPanel';
import { HistoryPanel } from '../components/HistoryPanel';
import {
    saveDraftToCloud, loadDraftFromCloud,
    saveHistoryItemToCloud, loadHistoryFromCloud, deleteHistoryItemFromCloud,
    saveConfigToCloud, loadConfigFromCloud,
} from '../lib/cloudSync';

// CAPACITOR NATIVE
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

// ─── CONFIGURAÇÕES PADRÃO ─────────────────────────────────────────────────────

interface AppConfig {
    rollW: number;
    price: number;
    margin: number;
    modoOtimizacao: 'densidade' | 'facilidade';
    userName: string;
    modoPerdas: 'dinamico' | 'fixo';
    perdasFixas: number;
}

const DEFAULT_CONFIG: AppConfig = {
    rollW: 152,
    price: 80,
    margin: 3,
    modoOtimizacao: 'densidade',
    userName: 'MP Godinho',
    modoPerdas: 'dinamico',
    perdasFixas: 20,
};

function loadConfig(): AppConfig {
    try {
        const saved = localStorage.getItem('lume_config');
        if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) { }
    return DEFAULT_CONFIG;
}

function saveConfig(cfg: AppConfig) {
    localStorage.setItem('lume_config', JSON.stringify(cfg));
}

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface GlassItem {
    id: string;
    h: number;
    w: number;
    oh: number;
    ow: number;
    label?: string;
    cor: string;
    forceRotate?: boolean;
    alignRight?: boolean;
    sortOrder: number;
}

interface Block {
    id: string;
    w: number;
    h: number;
    rw: number;
    rh: number;
    cor: string;
    label?: string;
    fit?: { x: number; y: number };
    rotated?: boolean;
    h_visual?: number;
    forceRotate?: boolean;
    alignRight?: boolean;
    sortOrder?: number;
}

export interface OrcamentoSalvo {
    id: string;
    cliente: string;
    data: string;
    valor: number;
    qtd: number;
    vidros: GlassItem[];
    config: { rollW: number; price: number; margin: number };
    desconto: number;
    modoOtimizacao: 'densidade' | 'facilidade';
}

// ─── UNDO/REDO REDUCER ────────────────────────────────────────────────────────

interface HistoryState {
    past: GlassItem[][];
    present: GlassItem[];
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
        case 'UNDO':
            if (state.past.length === 0) return state;
            const previous = state.past[state.past.length - 1];
            return {
                past: state.past.slice(0, -1),
                present: previous,
                future: [state.present, ...state.future]
            };
        case 'REDO':
            if (state.future.length === 0) return state;
            const next = state.future[0];
            return {
                past: [...state.past, state.present],
                present: next,
                future: state.future.slice(1)
            };
        default:
            return state;
    }
}

// ─── COMPONENTES AUXILIARES MEMOIZADOS ────────────────────────────────────────

const MemoBlock = React.memo(({ 
    b, 
    scale, 
    margin, 
    isSelected, 
    toggleSelection,
}: { 
    b: Block, 
    scale: number, 
    margin: number, 
    isSelected: boolean, 
    toggleSelection: (id: string) => void,
}) => {
    const pos = b.fit!;
    const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        pointerStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!pointerStartRef.current) return;
        const dx = Math.abs(e.clientX - pointerStartRef.current.x);
        const dy = Math.abs(e.clientY - pointerStartRef.current.y);
        pointerStartRef.current = null;
        if (dx < 10 && dy < 10) {
            toggleSelection(b.id);
        }
    };

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="absolute flex flex-col items-center justify-center text-black font-bold"
            style={{
                left: pos.x * scale,
                top: pos.y * scale,
                width: (b.w - margin) * scale,
                height: ((b.h_visual || b.h) - margin) * scale,
                background: b.cor,
                fontSize: '12px',
                border: isSelected
                    ? '2px solid #3b82f6'
                    : '1px solid rgba(0,0,0,0.3)',
                boxShadow: isSelected
                    ? '0 0 15px rgba(59,130,246,0.8)'
                    : 'none',
                zIndex: isSelected ? 20 : 10,
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                touchAction: 'pan-y',
            }}
        >
            {b.label && (
                <span className="text-[9px] font-black uppercase tracking-tighter mb-1 truncate w-full px-0.5 text-center opacity-70">{b.label}</span>
            )}
            <span className="text-[12px] font-black">{Math.round(b.rw)}</span>
            <div className="w-1/2 h-px bg-black/10 my-0.5" />
            <span className="text-[12px] font-black">{Math.round(b.rh)}</span>
        </div>
    );
});

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export function AdminCalculator() {
    const [cliente, setCliente] = useState('');
    const cfg = loadConfig();
    const [rollW, setRollW] = useState(cfg.rollW);
    const [margin, setMargin] = useState(cfg.margin);
    const [price, setPrice] = useState(cfg.price);
    const [userName, setUserName] = useState(cfg.userName);
    const [desconto, setDesconto] = useState(0);
    const [modoOtimizacao, setModoOtimizacao] = useState<'densidade' | 'facilidade'>(cfg.modoOtimizacao);
    const [configAberto, setConfigAberto] = useState(false);
    const [compensarPerdas, setCompensarPerdas] = useState(false);
    const [modoPerdas, setModoPerdas] = useState<'dinamico' | 'fixo'>(cfg.modoPerdas);
    const [perdasFixas, setPerdasFixas] = useState(cfg.perdasFixas);

    const [cfgRollW, setCfgRollW] = useState(cfg.rollW);
    const [cfgPrice, setCfgPrice] = useState(cfg.price);
    const [cfgMargin, setCfgMargin] = useState(cfg.margin);
    const [cfgModo, setCfgModo] = useState<'densidade' | 'facilidade'>(cfg.modoOtimizacao);
    const [cfgUserName, setCfgUserName] = useState(cfg.userName);
    const [cfgModoPerdas, setCfgModoPerdas] = useState<'dinamico' | 'fixo'>(cfg.modoPerdas);
    const [cfgPerdasFixas, setCfgPerdasFixas] = useState(cfg.perdasFixas);

    const [heightIn, setHeightIn] = useState('');
    const [widthIn, setWidthIn] = useState('');
    const [qtyIn, setQtyIn] = useState('1');
    const [labelIn, setLabelIn] = useState('');

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

    const [blocosCalculados, setBlocosCalculados] = useState<Block[]>([]);
    const [maxY, setMaxY] = useState(0);
    const [areaV, setAreaV] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [cloudStatus, setCloudStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
    const cloudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);



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

    const prevVidrosLengthRef = useRef(0);

    const [historicoAberto, setHistoricoAberto] = useState(false);
    const [historico, setHistorico] = useState<OrcamentoSalvo[]>([]);
    const [showSaveToast, setShowSaveToast] = useState(false);

    // Estados para edição de nomes de ambientes
    const [editingAmbiente, setEditingAmbiente] = useState<string | null>(null);
    const [editNome, setEditNome] = useState('');
    const editInputRef = useRef<HTMLInputElement>(null);

    // Estados para copiar e colar peças
    const [itensCopiados, setItensCopiados] = useState<GlassItem[] | null>(null);
    const [showColarModal, setShowColarModal] = useState(false);

    useEffect(() => {
        if (editingAmbiente !== null && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingAmbiente, editNome]);

    const invoiceRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const heightRef = useRef<HTMLInputElement>(null);
    const widthRef = useRef<HTMLInputElement>(null);
    const qtyRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const load = async () => {
            const cloudHistory = await loadHistoryFromCloud();
            if (cloudHistory.length > 0) {
                setHistorico(cloudHistory as OrcamentoSalvo[]);
                localStorage.setItem('lume_historico', JSON.stringify(cloudHistory));
                return;
            }
            try {
                const saved = localStorage.getItem('lume_historico');
                if (saved) setHistorico(JSON.parse(saved));
            } catch (e) { }
        };
        load();
    }, []);

    useEffect(() => {
        gsap.fromTo('.admin-entrance',
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
        );
    }, []);

    // ─── COMANDOS DE TECLADO ──────────────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                if (canUndo) dispatch({ type: 'UNDO' });
            }
            if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                if (canRedo) dispatch({ type: 'REDO' });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canUndo, canRedo]);

    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/packer.worker.ts', import.meta.url));
        workerRef.current.onmessage = (e) => {
            const { blocos, maxY, areaV } = e.data;
            setBlocosCalculados(blocos);
            setMaxY(maxY);
            setAreaV(areaV);
            setIsCalculating(false);
        };
        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    useEffect(() => {
        if (vidros.length > 0) {
            setIsCalculating(true);
            workerRef.current?.postMessage({ vidros, rollW, margin, modoOtimizacao });
            if (vidros.length !== prevVidrosLengthRef.current) {
                setDesconto(0);
            }
        } else {
            setBlocosCalculados([]);
            setMaxY(0);
            setAreaV(0);
            setDesconto(0);
            setSelectedIds([]);
        }
        prevVidrosLengthRef.current = vidros.length;
    }, [vidros, rollW, margin, modoOtimizacao]);

    // ─── FORMATAÇÃO ────────────────────────────────────────────────────────────

    const formatBRL = (num: number) =>
        num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const [descontoInput, setDescontoInput] = useState('0');

    useEffect(() => {
        if (desconto === 0) setDescontoInput('0');
    }, [desconto]);

    const handleDescontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let valor = e.target.value.replace(/\D/g, '');
        setDescontoInput(valor);
        setDesconto(parseInt(valor, 10) / 100 || 0);
    };

    const displayDesconto = useMemo(() => {
        const num = parseInt(descontoInput, 10) / 100 || 0;
        return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, [descontoInput]);

    // ─── AUTO-SAVE DRAFT ──────────────────────────────────────────────────
    useEffect(() => {
        const draft = {
            cliente,
            vidros,
            desconto,
            descontoInput,
            rollW,
            price,
            margin,
            modoOtimizacao,
            userName,
            lastSaved: Date.now()
        };
        localStorage.setItem('lume_calculator_draft', JSON.stringify(draft));
    }, [cliente, vidros, desconto, descontoInput, rollW, price, margin, modoOtimizacao, userName]);

    // ─── CLOUD AUTO-SAVE (debounced 2s) ──────────────────────────────────────
    useEffect(() => {
        if (cloudTimerRef.current) clearTimeout(cloudTimerRef.current);
        cloudTimerRef.current = setTimeout(async () => {
            setCloudStatus('syncing');
            const ok = await saveDraftToCloud({
                cliente, vidros, desconto, desconto_input: descontoInput,
                roll_w: rollW, price, margin, modo_otimizacao: modoOtimizacao,
                user_name: userName,
            });
            setCloudStatus(ok ? 'synced' : 'error');
            if (ok) setTimeout(() => setCloudStatus('idle'), 3000);
        }, 2000);
        return () => { if (cloudTimerRef.current) clearTimeout(cloudTimerRef.current); };
    }, [cliente, vidros, desconto, descontoInput, rollW, price, margin, modoOtimizacao, userName]);

    // RESTORE DRAFT ON MOUNT (cloud-first, localStorage fallback)
    useEffect(() => {
        const restoreDraft = async () => {
            // Try cloud first
            const cloud = await loadDraftFromCloud();
            if (cloud && cloud.vidros && (cloud.vidros as any[]).length > 0) {
                dispatch({ type: 'SET', payload: cloud.vidros as any });
                if (cloud.cliente) setCliente(cloud.cliente);
                if (cloud.desconto !== undefined) setDesconto(cloud.desconto);
                if (cloud.desconto_input !== undefined) setDescontoInput(cloud.desconto_input);
                if (cloud.roll_w) setRollW(cloud.roll_w);
                if (cloud.price) setPrice(cloud.price);
                if (cloud.margin !== undefined) setMargin(cloud.margin);
                if (cloud.modo_otimizacao) setModoOtimizacao(cloud.modo_otimizacao as any);
                if (cloud.user_name) setUserName(cloud.user_name);
                setCloudStatus('synced');
                setTimeout(() => setCloudStatus('idle'), 3000);
                return;
            }
            // Fallback to localStorage
            const saved = localStorage.getItem('lume_calculator_draft');
            if (saved) {
                try {
                    const draft = JSON.parse(saved);
                    if (draft.vidros && draft.vidros.length > 0) {
                        dispatch({ type: 'SET', payload: draft.vidros });
                        if (draft.cliente) setCliente(draft.cliente);
                        if (draft.desconto !== undefined) setDesconto(draft.desconto);
                        if (draft.descontoInput !== undefined) setDescontoInput(draft.descontoInput);
                        if (draft.rollW) setRollW(draft.rollW);
                        if (draft.price) setPrice(draft.price);
                        if (draft.margin !== undefined) setMargin(draft.margin);
                        if (draft.modoOtimizacao) setModoOtimizacao(draft.modoOtimizacao);
                        if (draft.userName) setUserName(draft.userName);
                    }
                } catch (e) {
                    console.error('Erro ao carregar rascunho local', e);
                }
            }
        };
        restoreDraft();
    }, []); 

    // ─── ENTER NOS INPUTS ──────────────────────────────────────────────────────

    const handleKeyDownHeight = (e: React.KeyboardEvent) => { if (e.key === 'Enter') widthRef.current?.focus(); };
    const handleKeyDownWidth = (e: React.KeyboardEvent) => { if (e.key === 'Enter') qtyRef.current?.focus(); };
    const handleKeyDownQty = (e: React.KeyboardEvent) => { if (e.key === 'Enter') adicionar(); };

    // ─── AÇÕES DE VIDROS ───────────────────────────────────────────────────────

    const adicionar = () => {
        const h = parseFloat(heightIn.replace(',', '.'));
        const w = parseFloat(widthIn.replace(',', '.'));
        const q = parseInt(qtyIn) || 1;
        if (!h || !w || h <= 0 || w <= 0 || q <= 0) return;
        const novos: GlassItem[] = [];
        for (let i = 0; i < q; i++) {
            novos.push({
                id: Math.random().toString(36).substr(2, 9),
                h, w, oh: h, ow: w,
                label: labelIn,
                cor: `hsl(${(h * w + h + w) % 360}, 65%, 75%)`,
                forceRotate: undefined,
                alignRight: false,
                sortOrder: vidros.length + i,
            });
        }
        setVidros([...vidros, ...novos]);
        setHeightIn(''); setWidthIn(''); setQtyIn('1');
        heightRef.current?.focus();
    };

    const removerTudoTipo = (h: number, w: number, label?: string) => {
        setVidros(current => current.filter(v => !(v.oh === h && v.ow === w && (v.label || '') === (label || ''))));
    };

    const limparTudo = () => {
        if (vidros.length === 0) return;
        if (window.confirm('Tem certeza que deseja remover TODAS as peças?')) {
            setVidros([]);
            setDesconto(0);
            setDescontoInput('0');
            setCliente('');
        }
    };

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }, []);

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
            return;
        }
        const novoNome = editNome.trim();
        const labelAntigo = editingAmbiente === 'Sem Ambiente' ? '' : editingAmbiente;
        if (novoNome === labelAntigo || (editingAmbiente === 'Sem Ambiente' && novoNome === '')) {
            setEditingAmbiente(null);
            setEditNome('');
            return;
        }
        // Verifica se já existe ambiente com esse nome
        const jaExiste = vidros.some(v => (v.label || '') === novoNome && (v.label || '') !== labelAntigo);
        if (jaExiste) {
            alert('Já existe um ambiente com este nome!');
            return;
        }
        setVidros(prev => prev.map(v => (v.label || '') === labelAntigo ? { ...v, label: novoNome || undefined } : v));
        setEditingAmbiente(null);
        setEditNome('');
    };

    const iniciarRenomeacao = (label: string) => {
        setEditingAmbiente(label || 'Sem Ambiente');
        setEditNome(label);
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
        setItensCopiados([...selecionados]);
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
            id: Math.random().toString(36).substr(2, 9),
            label: labelDestino || undefined,
            cor: `hsl(${(item.h * item.w + item.h + item.w + Date.now()) % 360}, 65%, 75%)`,
        }));
        setVidros(prev => [...prev, ...novos]);
        setSelectedIds([]);
        setItensCopiados(null);
        setShowColarModal(false);
    };

    // ─── DRAG HANDLERS COM MAGNETIC SNAP ────────────────────────────────────────

    const scale = containerWidth / rollW; // px per cm



    // ─── HISTÓRICO ─────────────────────────────────────────────────────────────

    const totalAreaM2 = useMemo(() => {
        const area = vidros.reduce((acc, v) => acc + (v.ow * v.oh), 0);
        return area / 10000;
    }, [vidros]);

    const subtotalBruto = useMemo(() => {
        return totalAreaM2 * price;
    }, [totalAreaM2, price]);

    const eficiencia = useMemo(() => {
        return maxY > 0 ? Math.round((areaV / (maxY * rollW)) * 100) : 0;
    }, [maxY, areaV, rollW]);

    const compensacaoPerda = useMemo(() => {
        if (!compensarPerdas) return 0;
        if (modoPerdas === 'fixo') {
            return subtotalBruto * (perdasFixas / 100);
        }
        // dinâmico
        if (eficiencia >= 100 || eficiencia <= 0) return 0;
        return subtotalBruto * ((100 - eficiencia) / 100);
    }, [compensarPerdas, modoPerdas, perdasFixas, eficiencia, subtotalBruto]);

    const finalPrice = subtotalBruto + compensacaoPerda - desconto;

    const salvarNoHistorico = useCallback(() => {
        if (vidros.length === 0) return;
        const novo: OrcamentoSalvo = {
            id: Date.now().toString(),
            cliente: cliente || 'Sem nome',
            data: new Date().toLocaleDateString('pt-BR'),
            valor: finalPrice,
            qtd: vidros.length,
            vidros: [...vidros],
            config: { rollW, price, margin },
            desconto,
            modoOtimizacao
        };
        const atualizado = [novo, ...historico].slice(0, 20);
        setHistorico(atualizado);
        localStorage.setItem('lume_historico', JSON.stringify(atualizado));
        saveHistoryItemToCloud(novo as any);
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 3000);
    }, [vidros, cliente, finalPrice, rollW, price, margin, historico, desconto, modoOtimizacao]);

    const carregarDoHistorico = (orc: OrcamentoSalvo) => {
        setCliente(orc.cliente);
        setRollW(orc.config.rollW);
        setPrice(orc.config.price);
        setMargin(orc.config.margin);
        if (orc.desconto !== undefined) {
            setDesconto(orc.desconto);
            setDescontoInput((orc.desconto * 100).toString());
        }
        if (orc.modoOtimizacao) setModoOtimizacao(orc.modoOtimizacao);
        dispatch({ type: 'SET', payload: orc.vidros });
        setHistoricoAberto(false);
    };

    const deletarDoHistorico = (id: string) => {
        const atualizado = historico.filter(o => o.id !== id);
        setHistorico(atualizado);
        localStorage.setItem('lume_historico', JSON.stringify(atualizado));
        deleteHistoryItemFromCloud(id);
    };

    // ─── IMPORTAR / SALVAR / ABRIR ─────────────────────────────────────────────

    const importarZap = () => {
        const code = prompt("Cole o CÓDIGO DE IMPORTAÇÃO:");
        if (!code) return;
        try {
            const d = JSON.parse(atob(code));
            setCliente(`${d.n} (${d.b}) - ${d.f}`);
            dispatch({ type: 'SET', payload: d.v.map((v: any) => ({ ...v, id: Math.random().toString(36).substr(2, 9), oh: v.oh ?? v.h, ow: v.ow ?? v.w, forceRotate: undefined, alignRight: false })) });
        } catch (e) { alert("Erro ao importar."); }
    };

    const salvarProjeto = () => {
        const dados = { config: { cliente, rolo: rollW, preco: price }, vidros: [...vidros] };
        const blob = new Blob([JSON.stringify(dados)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = (cliente || 'projeto') + ".insul"; a.click();
    };

    const abrirProjeto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const d = JSON.parse(ev.target?.result as string);
                setCliente(d.config.cliente || ''); setRollW(parseFloat(d.config.rolo) || 152);
                setPrice(parseFloat(d.config.preco) || 80);
                dispatch({ type: 'SET', payload: (d.vidros || []).map((v: any) => ({ ...v, oh: v.oh ?? v.h, ow: v.ow ?? v.w })) });
                setDesconto(0);
            } catch (e) { alert("Arquivo inválido"); }
        };
        reader.readAsText(file);
    };

    const gerarImagem = async () => {
        if (!invoiceRef.current) return;
        setIsCalculating(true);
        try {
            const dataUrl = await htmlToImage.toPng(invoiceRef.current, {
                pixelRatio: 2,
                backgroundColor: "#0a0f1e",
                style: {
                    transform: 'none',
                    margin: '0'
                }
            });

            if (Capacitor.isNativePlatform()) {
                const fileName = `Orcamento_${cliente.replace(/\W+/g, '_') || 'LUME'}.png`;
                const base64Data = dataUrl.split(',')[1];
                const savedFile = await Filesystem.writeFile({
                    path: fileName,
                    data: base64Data,
                    directory: Directory.Cache
                });
                await Share.share({
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
            console.error(err);
        } finally {
            setIsCalculating(false);
        }
    };

    const gerarPDF = async () => {
        setIsCalculating(true);
        try {
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

            if (Capacitor.isNativePlatform()) {
                const fileName = `Orcamento_${cliente.replace(/\W+/g, '_') || 'LUME'}.pdf`;
                const reader = new FileReader();
                reader.readAsDataURL(blob); 
                reader.onloadend = async () => {
                    const base64data = (reader.result as string).split(',')[1];
                    const savedFile = await Filesystem.writeFile({
                        path: fileName,
                        data: base64data,
                        directory: Directory.Cache
                    });
                    await Share.share({
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
            console.error(err);
        } finally {
            setIsCalculating(false);
        }
    };

    const salvarConfig = () => {
        const nova: AppConfig = { rollW: cfgRollW, price: cfgPrice, margin: cfgMargin, modoOtimizacao: cfgModo, userName: cfgUserName, modoPerdas: cfgModoPerdas, perdasFixas: cfgPerdasFixas };
        saveConfig(nova);
        saveConfigToCloud(nova);
        setRollW(cfgRollW);
        setPrice(cfgPrice);
        setMargin(cfgMargin);
        setModoOtimizacao(cfgModo);
        setUserName(cfgUserName);
        setModoPerdas(cfgModoPerdas);
        setPerdasFixas(cfgPerdasFixas);
        setConfigAberto(false);
    };

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

    const groupedResumo = useMemo(() => {
        return resumo.reduce((acc, item) => {
            const groupName = item.label || 'Sem Ambiente';
            if (!acc[groupName]) acc[groupName] = [];
            acc[groupName].push(item);
            return acc;
        }, {} as Record<string, typeof resumo>);
    }, [resumo]);

    const m = maxY / 100;
    const valorPraticoM2 = areaV > 0 ? finalPrice / (areaV / 10000) : 0;

    // ─── RENDER ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#040811] text-white py-6 px-2 sm:px-4 relative overflow-x-hidden">

            {/* PAINEL LATERAL: CONFIGURAÇÕES (EXTRAÍDO) */}
            <ConfigPanel 
                aberto={configAberto}
                setAberto={setConfigAberto}
                cfgUserName={cfgUserName}
                setCfgUserName={setCfgUserName}
                cfgRollW={cfgRollW}
                setCfgRollW={setCfgRollW}
                cfgPrice={cfgPrice}
                setCfgPrice={setCfgPrice}
                cfgMargin={cfgMargin}
                setCfgMargin={setCfgMargin}
                cfgModo={cfgModo}
                setCfgModo={setCfgModo}
                cfgModoPerdas={cfgModoPerdas}
                setCfgModoPerdas={setCfgModoPerdas}
                cfgPerdasFixas={cfgPerdasFixas}
                setCfgPerdasFixas={setCfgPerdasFixas}
                onSalvar={salvarConfig}
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
                        <div className="flex items-center gap-1.5 ml-2" title={cloudStatus === 'synced' ? 'Sincronizado com a nuvem' : cloudStatus === 'syncing' ? 'Sincronizando...' : cloudStatus === 'error' ? 'Erro de sincronização' : 'Nuvem'}>
                            {cloudStatus === 'syncing' && <Loader2 size={14} className="text-[#c9a227] animate-spin" />}
                            {cloudStatus === 'synced' && <Cloud size={14} className="text-green-400" />}
                            {cloudStatus === 'error' && <CloudOff size={14} className="text-red-400" />}
                            {cloudStatus === 'idle' && <Cloud size={14} className="text-gray-600" />}
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-nowrap justify-end xl:justify-end overflow-x-auto pb-1 scrollbar-hide">
                        <button
                            onClick={() => { setCfgRollW(rollW); setCfgPrice(price); setCfgMargin(margin); setCfgModo(modoOtimizacao); setCfgUserName(userName); setCfgModoPerdas(modoPerdas); setCfgPerdasFixas(perdasFixas); setConfigAberto(true); }}
                            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all shrink-0"
                            title="Configurações Padrão"
                        >
                            <Settings size={14} /> <span className="hidden sm:inline">Config</span>
                        </button>
                        <button
                            onClick={() => dispatch({ type: 'UNDO' })}
                            disabled={!canUndo}
                            title="Desfazer (Ctrl+Z)"
                            className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border shrink-0 ${canUndo ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white' : 'border-white/5 text-white/20 cursor-not-allowed'}`}
                        >
                            <Undo2 size={14} /> <span className="hidden sm:inline">Desfazer</span>
                        </button>
                        <button
                            onClick={() => dispatch({ type: 'REDO' })}
                            disabled={!canRedo}
                            title="Refazer (Ctrl+Y)"
                            className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border shrink-0 ${canRedo ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white' : 'border-white/5 text-white/20 cursor-not-allowed'}`}
                        >
                            <Redo2 size={14} /> <span className="hidden sm:inline">Refazer</span>
                        </button>
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
                    <div className="admin-entrance bg-[#0a0e17] border-2 border-[#c9a227]/30 rounded-2xl p-5 shadow-2xl">
                        <label className="block text-[10px] uppercase text-[#c9a227] mb-2 font-bold">Cliente</label>
                        <input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 outline-none text-sm mb-4" />
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
                            <div><label className="block text-[10px] text-gray-400 mb-1 text-center font-bold uppercase">R$/m²</label><input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} onFocus={(e) => e.target.select()} className="w-full bg-[#040811] border border-white/10 rounded-lg p-3 text-sm text-center font-bold" /></div>
                            <div><label className="block text-[10px] text-gray-400 mb-1 text-center font-bold uppercase">Margem</label><input type="number" value={margin} onChange={(e) => setMargin(parseFloat(e.target.value))} onFocus={(e) => e.target.select()} className="w-full bg-[#040811] border border-white/10 rounded-lg p-3 text-sm text-center font-bold" /></div>
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

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <input ref={heightRef} type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} onKeyDown={handleKeyDownHeight} placeholder="Altura" className="bg-[#040811] border border-white/10 rounded-xl p-2.5 text-sm md:text-base text-center" />
                            <input ref={widthRef} type="number" value={widthIn} onChange={(e) => setWidthIn(e.target.value)} onKeyDown={handleKeyDownWidth} placeholder="Largura" className="bg-[#040811] border border-white/10 rounded-xl p-2.5 text-sm md:text-base text-center" />
                            <input ref={qtyRef} type="number" value={qtyIn} onChange={(e) => setQtyIn(e.target.value)} onKeyDown={handleKeyDownQty} onFocus={(e) => e.target.select()} placeholder="Qtd" className="bg-[#040811] border border-white/10 rounded-xl p-2.5 text-sm md:text-base text-center" />
                        </div>
                        <button onClick={adicionar} className="w-full bg-[#c9a227] text-black py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2">
                            <Plus size={16} /> Adicionar
                        </button>

                        {vidros.length > 0 && (
                            <button 
                                onClick={limparTudo} 
                                className="w-full flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-widest"
                            >
                                <Trash2 size={12} /> Limpar Tudo
                            </button>
                        )}
                    </div>

                    {resumo.length > 0 && (
                        <div className="admin-entrance bg-[#080d16] border-2 border-[#c9a227]/20 rounded-2xl p-3 max-h-60 overflow-y-auto space-y-4">
                            {Object.entries(
                                resumo.reduce((acc, item) => {
                                    const lbl = item.label || 'Sem Ambiente';
                                    if (!acc[lbl]) acc[lbl] = [];
                                    acc[lbl].push(item);
                                    return acc;
                                }, {} as globalThis.Record<string, typeof resumo>)
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
                            <div className="admin-entrance bg-gradient-to-br from-[#111e33] to-[#04080f] border-2 border-[#c9a227]/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                    <div>
                                        <div className="flex flex-col">
                                            <p className="text-[10px] uppercase text-blue-300 font-bold mb-1">Total Cliente</p>
                                            <div className="flex items-baseline gap-2 my-1">
                                                <h2 className="text-3xl font-bold text-green-400">{formatBRL(finalPrice)}</h2>
                                                <span className="text-xl font-bold text-gray-400">({totalAreaM2.toFixed(2)} m²)</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-[9px] bg-blue-900/40 text-blue-300 px-2 py-1 rounded-lg border border-blue-500/20 font-medium whitespace-nowrap">Vlr Efetivo: {formatBRL(valorPraticoM2)}/m²</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-[#c9a227]/10 p-3 rounded-xl border border-[#c9a227]/30 text-center">
                                            <p className="text-[9px] uppercase text-[#c9a227] font-bold mb-1">Comprar</p>
                                            <p className="text-xl font-bold">{m.toFixed(2)}<span className="text-[10px] ml-1 opacity-50">m</span></p>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                                            <p className="text-[9px] uppercase text-gray-500 font-bold mb-1">Eficiência</p>
                                            <p className={`text-xl font-bold ${eficiencia > 80 ? 'text-green-400' : 'text-yellow-400'}`}>{eficiencia}%</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-center sm:justify-start gap-3 w-full sm:w-auto">
                                        <p className="text-[10px] uppercase text-red-300 font-bold">Desconto R$:</p>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-red-400 font-bold">R$</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={displayDesconto}
                                                onChange={handleDescontoChange}
                                                onFocus={(e) => e.target.select()}
                                                onClick={(e) => e.currentTarget.select()}
                                                onKeyDown={(e) => {
                                                    if (!/[0-9]/.test(e.key) &&
                                                        e.key !== 'Backspace' &&
                                                        e.key !== 'Tab' &&
                                                        e.key !== 'Enter' &&
                                                        e.key !== 'Delete' &&
                                                        e.key !== 'ArrowLeft' &&
                                                        e.key !== 'ArrowRight' &&
                                                        !(e.ctrlKey || e.metaKey)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                className="w-28 bg-[#040811] text-red-400 border border-red-500/30 rounded-lg pl-8 pr-2 py-1.5 text-sm text-right font-bold outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setCompensarPerdas(!compensarPerdas)}
                                            className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 h-[34px] ${compensarPerdas ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
                                            title={modoPerdas === 'fixo' ? `Perdas fixas: ${perdasFixas}%` : 'Compensar perdas (dinâmico, baseado na eficiência)'}
                                        >
                                            <Scissors size={14} />
                                            <span className="text-[9px] font-bold uppercase whitespace-nowrap">
                                                {compensarPerdas
                                                    ? (modoPerdas === 'fixo' ? `+${perdasFixas}%` : `+${100 - eficiencia}%`)
                                                    : (modoPerdas === 'fixo' ? `${perdasFixas}%` : 'Perdas')
                                                }
                                            </span>
                                        </button>
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button onClick={salvarNoHistorico} className="flex-1 flex items-center justify-center gap-2 bg-[#c9a227]/10 border border-[#c9a227]/30 text-[#c9a227] px-3 py-2.5 rounded-xl font-bold uppercase text-[9px] hover:bg-[#c9a227]/20 transition-all">
                                            <History size={13} /> Salvar
                                        </button>
                                        <button onClick={gerarImagem} className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-xl font-bold uppercase text-[9px] transition-transform active:scale-95">
                                            <Camera size={14} /> PNG
                                        </button>
                                        <button onClick={gerarPDF} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#c9a227] to-[#e5c158] text-black px-3 py-2.5 rounded-xl font-bold uppercase text-[9px] transition-transform active:scale-95">
                                            <FileText size={14} /> PDF
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4 w-full">
                                <div className="flex bg-[#04080f] border border-white/10 p-1.5 rounded-xl shadow-2xl flex-1 max-w-sm ml-auto">
                                    <button onClick={() => setModoOtimizacao('densidade')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${modoOtimizacao === 'densidade' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Corte Densidade</button>
                                    <button onClick={() => setModoOtimizacao('facilidade')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${modoOtimizacao === 'facilidade' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Corte Fácil</button>
                                </div>
                            </div>

                            <div className="admin-entrance bg-[#111827] border-2 border-[#c9a227]/25 rounded-xl overflow-hidden shadow-2xl relative min-h-[500px]">
                                <div className="absolute top-0 left-0 w-full bg-[#1f2937] text-gray-400 text-[10px] uppercase font-bold flex justify-between px-3 py-1.5 z-10 border-b border-gray-700">
                                    <span className="flex items-center gap-2">
                                        0cm
                                    </span>
                                    <span className="flex items-center gap-2">
                                        {isCalculating && <span className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse inline-block" title="Calculando..." />}
                                        Rolo: {rollW}cm
                                    </span>
                                </div>
                                <div className="w-full h-full overflow-y-auto p-4 pt-10">
                                    <div
                                        ref={containerRef}
                                        className="relative mx-auto bg-white/5 shadow-inner"
                                        style={{
                                            width: '100%',
                                            maxWidth: '100%',
                                            height: `${(maxY / rollW) * containerWidth + 40}px`,
                                            userSelect: 'none',
                                        }}
                                    >
                                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: `${10 * scale}px ${10 * scale}px` }} />
                                        {blocosCalculados.map((b) => (
                                            b.fit && (
                                                <MemoBlock
                                                    key={b.id}
                                                    b={b}
                                                    scale={scale}
                                                    margin={margin}
                                                    isSelected={selectedIds.includes(b.id)}
                                                    toggleSelection={toggleSelection}
                                                />
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
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
                formatBRL={formatBRL}
            />

            <div className="text-center text-[10px] text-gray-500 mt-10 pb-4 font-bold tracking-widest uppercase">
                2026 - lume controle solar - todos os direitos reservados
            </div>

            {showSaveToast && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-black font-black text-xs uppercase px-6 py-3 rounded-full shadow-[0_0_40px_rgba(34,197,94,0.4)] z-[100] animate-bounce">
                    Orçamento salvo no histórico!
                </div>
            )}

            {/* MODAL: COLAR EM... */}
            {showColarModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowColarModal(false)} />
                    <div className="relative bg-[#111e33] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm p-5 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <ClipboardPaste size={16} className="text-[#c9a227]" />
                                Colar em...
                            </h3>
                            <button onClick={() => setShowColarModal(false)} className="p-1 text-gray-400 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {Object.entries(
                                resumo.reduce((acc, item) => {
                                    const lbl = item.label || 'Sem Ambiente';
                                    if (!acc[lbl]) acc[lbl] = [];
                                    acc[lbl].push(item);
                                    return acc;
                                }, {} as globalThis.Record<string, typeof resumo>)
                            ).map(([ambiente, _]) => (
                                <button
                                    key={ambiente}
                                    onClick={() => colarItens(ambiente === 'Sem Ambiente' ? '' : ambiente)}
                                    className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#c9a227]/30 text-white transition-all flex items-center gap-2 active:scale-[0.98]"
                                >
                                    <Layers size={14} className="text-[#c9a227]" />
                                    <span className="text-sm font-bold">{ambiente}</span>
                                    <span className="text-[10px] text-gray-400 ml-auto">existente</span>
                                </button>
                            ))}
                            <div className="pt-2 border-t border-white/10 mt-2">
                                <button
                                    onClick={() => {
                                        const novoLabel = labelIn.trim();
                                        if (novoLabel) {
                                            colarItens(novoLabel);
                                        }
                                    }}
                                    disabled={!labelIn.trim()}
                                    className="w-full text-left p-3 rounded-xl bg-[#c9a227]/10 hover:bg-[#c9a227]/20 border border-[#c9a227]/30 text-[#c9a227] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                >
                                    <Plus size={14} />
                                    <span className="text-sm font-bold">Novo: {labelIn || 'Digite o nome acima'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
