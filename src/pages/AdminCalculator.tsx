import React, { useState, useEffect, useRef, useMemo, useReducer, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import {
    Plus, Trash2, Smartphone, Save, FolderOpen, Scissors,
    Calculator, Camera, Layers, RotateCcw, AlignRight, AlignLeft, X,
    History, Clock, ChevronRight, Undo2, Redo2, FileText, Settings, RefreshCw, GripVertical
} from 'lucide-react';
import gsap from 'gsap';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
}

const DEFAULT_CONFIG: AppConfig = {
    rollW: 152,
    price: 80,
    margin: 3,
    modoOtimizacao: 'densidade',
    userName: 'MP Godinho',
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

interface GlassItem {
    id: string;
    h: number;
    w: number;
    ow: number;
    oh: number;
    cor: string;
    label?: string;
    forceRotate?: boolean | undefined;
    alignRight?: boolean;
    sortOrder?: number; // controls pack sequence — drag reorders this
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

interface OrcamentoSalvo {
    id: string;
    cliente: string;
    data: string;
    valor: number;
    qtd: number;
    vidros: GlassItem[];
    config: { rollW: number; price: number; margin: number };
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

    const [cfgRollW, setCfgRollW] = useState(cfg.rollW);
    const [cfgPrice, setCfgPrice] = useState(cfg.price);
    const [cfgMargin, setCfgMargin] = useState(cfg.margin);
    const [cfgModo, setCfgModo] = useState<'densidade' | 'facilidade'>(cfg.modoOtimizacao);
    const [cfgUserName, setCfgUserName] = useState(cfg.userName);

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

    // ─── DRAG / REORDER ────────────────────────────────────────────────────────
    // Drag changes sortOrder of pieces → worker repacks → no overlaps ever
    const [dragId, setDragId] = useState<string | null>(null);
    const [dragVisualPos, setDragVisualPos] = useState<{ x: number; y: number } | null>(null);
    const [dropTargetId, setDropTargetId] = useState<string | null>(null);
    const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const isDragging = dragId !== null;

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

    const invoiceRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const heightRef = useRef<HTMLInputElement>(null);
    const widthRef = useRef<HTMLInputElement>(null);
    const qtyRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('lume_historico');
            if (saved) setHistorico(JSON.parse(saved));
        } catch (e) { }
    }, []);

    useEffect(() => {
        gsap.fromTo('.admin-entrance',
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
        );
    }, []);

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
        const workerCode = `
const cloneItems = (items) => items.map(b => ({ ...b }));
self.onmessage = (e) => {
    const { vidros, rollW, margin, modoOtimizacao } = e.data;
    let baseItems = vidros.map(v => {
        const bw = v.forceRotate ? (v.oh + margin) : (v.ow + margin);
        const bh = v.forceRotate ? (v.ow + margin) : (v.oh + margin);
        const brw = v.forceRotate ? v.oh : v.ow;
        const brh = v.forceRotate ? v.ow : v.oh;
        return { id: v.id, w: bw, h: bh, rw: brw, rh: brh, cor: v.cor, label: v.label, rotated: v.forceRotate === true, h_visual: bh, forceRotate: v.forceRotate, alignRight: v.alignRight === true, sortOrder: v.sortOrder ?? 0 };
    });
    // Always pack in explicit sortOrder so drag-reorder is respected
    baseItems.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    if (modoOtimizacao === 'densidade') {
        let items = cloneItems(baseItems);
        items.sort((a, b) => (b.w * b.h) - (a.w * a.h));
        let freeRects = [{ x: 0, y: 0, w: rollW, h: 999999 }];
        let currentMaxY = 0, currentAreaV = 0;
        items.forEach(b => {
            let bestRectIdx = -1, bestY = Infinity, bestScoreX = b.alignRight ? -1 : Infinity, finalX = 0, willRotate = false;
            for (let i = 0; i < freeRects.length; i++) {
                let r = freeRects[i];
                if (b.w <= r.w && b.h <= r.h) { 
                    if (r.y < bestY || (r.y === bestY && (b.alignRight ? (r.x + r.w > bestScoreX) : (r.x < bestScoreX)))) { 
                        bestY = r.y; bestScoreX = b.alignRight ? (r.x + r.w) : r.x; finalX = b.alignRight ? (r.x + r.w - b.w) : r.x; bestRectIdx = i; willRotate = false; 
                    } 
                }
                if (b.forceRotate !== true && b.h <= r.w && b.w <= r.h) { 
                    if (r.y < bestY || (r.y === bestY && (b.alignRight ? (r.x + r.w > bestScoreX) : (r.x < bestScoreX)))) { 
                        bestY = r.y; bestScoreX = b.alignRight ? (r.x + r.w) : r.x; finalX = b.alignRight ? (r.x + r.w - b.h) : r.x; bestRectIdx = i; willRotate = true; 
                    } 
                }
            }
            if (bestRectIdx !== -1) {
                if (willRotate) { [b.w, b.h] = [b.h, b.w]; [b.rw, b.rh] = [b.rh, b.rw]; b.rotated = true; b.h_visual = b.h; }
                b.fit = { x: finalX, y: bestY };
                if (b.fit.y + b.h > currentMaxY) currentMaxY = b.fit.y + b.h;
                currentAreaV += (b.rw * b.rh);
                let newFR = [];
                for (let i = 0; i < freeRects.length; i++) {
                    let fr = freeRects[i];
                    if (b.fit.x < fr.x + fr.w && b.fit.x + b.w > fr.x && b.fit.y < fr.y + fr.h && b.fit.y + b.h > fr.y) {
                        if (b.fit.y > fr.y) newFR.push({ x: fr.x, y: fr.y, w: fr.w, h: b.fit.y - fr.y });
                        if (b.fit.y + b.h < fr.y + fr.h) newFR.push({ x: fr.x, y: b.fit.y + b.h, w: fr.w, h: (fr.y + fr.h) - (b.fit.y + b.h) });
                        if (b.fit.x > fr.x) newFR.push({ x: fr.x, y: fr.y, w: b.fit.x - fr.x, h: fr.h });
                        if (b.fit.x + b.w < fr.x + fr.w) newFR.push({ x: b.fit.x + b.w, y: fr.y, w: (fr.x + fr.w) - (b.fit.x + b.w), h: fr.h });
                    } else { newFR.push(fr); }
                }
                freeRects = [];
                for (let i = 0; i < newFR.length; i++) {
                    let r1 = newFR[i], isContained = false;
                    for (let j = 0; j < newFR.length; j++) {
                        if (i === j) continue;
                        let r2 = newFR[j];
                        if (r1.x >= r2.x && r1.y >= r2.y && r1.x + r1.w <= r2.x + r2.w && r1.y + r1.h <= r2.y + r2.h) { isContained = true; break; }
                    }
                    if (!isContained) freeRects.push(r1);
                }
            }
        });
        result = { blocos: items, maxY: currentMaxY, areaV: currentAreaV };
    } else {
        let strategies = [];
        strategies.push(cloneItems(baseItems).sort((a, b) => (b.w * b.h) - (a.w * a.h)));
        strategies.push(cloneItems(baseItems).sort((a, b) => b.h - a.h || b.w - a.w));
        strategies.push(cloneItems(baseItems).map(b => { if (b.forceRotate !== true && b.w > b.h && b.h <= rollW) { [b.w, b.h] = [b.h, b.w]; [b.rw, b.rh] = [b.rh, b.rw]; b.rotated = true; b.h_visual = b.h; } return b; }).sort((a, b) => (b.w * b.h) - (a.w * a.h)));
        strategies.push(cloneItems(baseItems).map(b => { if (b.forceRotate !== true && b.h > b.w && b.h <= rollW) { [b.w, b.h] = [b.h, b.w]; [b.rw, b.rh] = [b.rh, b.rw]; b.rotated = true; b.h_visual = b.h; } return b; }).sort((a, b) => (b.w * b.h) - (a.w * a.h)));
        let bestResult = null, minTotalY = Infinity;
        strategies.forEach(testItems => {
            let shelves = [], totalY = 0, currentAreaV = 0;
            testItems.forEach(item => {
                let placed = false, bCSI = -1, bCI = -1, bCW = Infinity;
                for (let i = 0; i < shelves.length; i++) {
                    let shelf = shelves[i];
                    for (let j = 0; j < shelf.columns.length; j++) {
                        let col = shelf.columns[j], rH = shelf.height - col.currentHeight;
                        if (item.w <= col.width && item.h <= rH) { let sc = (col.width - item.w) * 5 + (rH - item.h); if (sc < bCW) { bCW = sc; bCSI = i; bCI = j; } }
                    }
                }
                if (bCSI !== -1) {
                    let shelf = shelves[bCSI], col = shelf.columns[bCI], rH = shelf.height - col.currentHeight;
                    if (rH - item.h <= 10) item.h = rH;
                    item.fit = { x: col.x, y: shelf.y + col.currentHeight };
                    col.blocks.push(item); col.currentHeight += item.h; placed = true; currentAreaV += (item.rw * item.rh);
                }
                if (!placed) {
                    let bSI = -1, bW = Infinity;
                    for (let i = 0; i < shelves.length; i++) {
                        let shelf = shelves[i];
                        if (item.w <= (rollW - shelf.currentWidth) && item.h <= shelf.height) { let wH = shelf.height - item.h; if (wH < bW) { bW = wH; bSI = i; } }
                    }
                    if (bSI !== -1) {
                        let shelf = shelves[bSI];
                        if (shelf.height - item.h <= 10) item.h = shelf.height;
                        let nC = { x: shelf.currentWidth, width: item.w, currentHeight: item.h, blocks: [item] };
                        item.fit = { x: nC.x, y: shelf.y }; shelf.columns.push(nC); shelf.currentWidth += item.w; placed = true; currentAreaV += (item.rw * item.rh);
                    }
                }
                if (!placed) {
                    let nC = { x: 0, width: item.w, currentHeight: item.h, blocks: [item] };
                    let nS = { y: totalY, height: item.h, currentWidth: item.w, columns: [nC] };
                    item.fit = { x: 0, y: totalY }; shelves.push(nS); totalY += item.h; currentAreaV += (item.rw * item.rh);
                }
            });
            shelves.forEach(shelf => {
                const sobra = rollW - shelf.currentWidth;
                if (shelf.columns.length > 1 && sobra > 5 && sobra < 60) {
                    const lC = shelf.columns[shelf.columns.length - 1], nX = rollW - lC.width, sh = nX - lC.x;
                    lC.x = nX; lC.blocks.forEach(b => { if (b.fit) b.fit.x += sh; });
                } else if (sobra > 0) {
                    let currentRight = rollW;
                    for (let c = shelf.columns.length - 1; c >= 0; c--) {
                        let col = shelf.columns[c];
                        if (col.blocks.some(b => b.alignRight === true)) {
                            let nX = currentRight - col.width, sh = nX - col.x;
                            col.x = nX;
                            col.blocks.forEach(b => { if (b.fit) b.fit.x += sh; });
                            currentRight = nX;
                        } else break;
                    }
                }
            });
            let flatBlocks = shelves.flatMap(s => s.columns.flatMap(c => c.blocks));
            if (totalY < minTotalY) { minTotalY = totalY; bestResult = { totalY, currentAreaV, blocks: flatBlocks }; }
        });
        result = { blocos: bestResult.blocks, maxY: bestResult.totalY, areaV: bestResult.currentAreaV };
    }
    self.postMessage(result);
};
        `;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        workerRef.current = new Worker(URL.createObjectURL(blob));
        workerRef.current.onmessage = (e) => {
            const { blocos, maxY, areaV } = e.data;
            setBlocosCalculados(blocos);
            setMaxY(maxY);
            setAreaV(areaV);
            setIsCalculating(false);
        };
        return () => workerRef.current?.terminate();
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
            // FIX 2: sempre inicializar forceRotate e alignRight explicitamente
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
        setHeightIn(''); setWidthIn(''); setQtyIn('1'); setLabelIn('');
        heightRef.current?.focus();
    };

    const removerTudoTipo = (h: number, w: number, label?: string) => {
        setVidros(current => current.filter(v => !(v.oh === h && v.ow === w && (v.label || '') === (label || ''))));
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDeleteSelected = () => {
        setVidros(prev => prev.filter(v => !selectedIds.includes(v.id)));
        setSelectedIds([]);
    };

    // FIX 1: toggle entre undefined e true — evita que false quebre o worker
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

    // ─── DRAG HANDLERS ─────────────────────────────────────────────────────────

    const scale = containerWidth / rollW; // px per cm

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent, block: Block) => {
        e.stopPropagation();
        if (!containerRef.current || !block.fit) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragOffsetRef.current = {
            x: clientX - rect.left - block.fit.x * scale,
            y: clientY - rect.top - block.fit.y * scale,
        };
        setDragId(block.id);
        setDragVisualPos({ x: block.fit.x * scale, y: block.fit.y * scale });
        setSelectedIds([]);
    };

    const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!dragId || !containerRef.current) return;
        e.preventDefault();
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const pxX = clientX - rect.left - dragOffsetRef.current.x;
        const pxY = clientY - rect.top - dragOffsetRef.current.y;
        setDragVisualPos({ x: pxX, y: pxY });

        // Find which block center is closest to cursor to show drop target highlight
        const cursorCmX = (clientX - rect.left) / scale;
        const cursorCmY = (clientY - rect.top) / scale;
        let closest: string | null = null;
        let closestDist = Infinity;
        blocosCalculados.forEach(b => {
            if (b.id === dragId || !b.fit) return;
            const cx = b.fit.x + (b.w - margin) / 2;
            const cy = b.fit.y + ((b.h_visual || b.h) - margin) / 2;
            const dist = Math.hypot(cursorCmX - cx, cursorCmY - cy);
            if (dist < closestDist) { closestDist = dist; closest = b.id; }
        });
        setDropTargetId(closest);
    }, [dragId, blocosCalculados, scale, margin]);

    const handleDragEnd = useCallback(() => {
        if (!dragId) return;

        if (dropTargetId) {
            // Reorder: swap sortOrders between dragged and drop target
            // This tells the worker to pack them in the new sequence
            setVidros(prev => {
                const draggedItem = prev.find(v => v.id === dragId);
                const targetItem = prev.find(v => v.id === dropTargetId);
                if (!draggedItem || !targetItem) return prev;

                // Shift all items between the two positions
                const sorted = [...prev].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
                const draggedIdx = sorted.findIndex(v => v.id === dragId);
                const targetIdx = sorted.findIndex(v => v.id === dropTargetId);

                const reordered = [...sorted];
                const [removed] = reordered.splice(draggedIdx, 1);
                reordered.splice(targetIdx, 0, removed);

                return reordered.map((v, i) => ({ ...v, sortOrder: i }));
            });
        }

        setDragId(null);
        setDragVisualPos(null);
        setDropTargetId(null);
    }, [dragId, dropTargetId, setVidros]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove, { passive: false });
            window.addEventListener('touchmove', handleDragMove, { passive: false });
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchend', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    const resetOrdem = () => {
        // Reset sortOrder back to insertion order (sortOrder as originally set)
        setVidros(prev => prev.map((v, i) => ({ ...v, sortOrder: i })));
    };

    const hasCustomOrder = useMemo(() => {
        const sorted = [...vidros].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        return sorted.some((v, i) => {
            const natural = vidros.findIndex(x => x.id === v.id);
            return natural !== i;
        });
    }, [vidros]);

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
        if (!compensarPerdas || eficiencia >= 100 || eficiencia <= 0) return 0;
        return subtotalBruto * ((100 - eficiencia) / 100);
    }, [compensarPerdas, eficiencia, subtotalBruto]);

    const finalPrice = subtotalBruto + compensacaoPerda - desconto;

    const salvarNoHistorico = useCallback(() => {
        if (vidros.length === 0) return;
        const novo: OrcamentoSalvo = {
            id: Date.now().toString(),
            cliente: cliente || 'Sem nome',
            data: new Date().toLocaleDateString('pt-BR'),
            valor: finalPrice,
            qtd: vidros.length,
            vidros,
            config: { rollW, price, margin }
        };
        const atualizado = [novo, ...historico].slice(0, 20);
        setHistorico(atualizado);
        localStorage.setItem('lume_historico', JSON.stringify(atualizado));
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 3000);
    }, [vidros, cliente, finalPrice, rollW, price, margin, historico]);

    const carregarDoHistorico = (orc: OrcamentoSalvo) => {
        setCliente(orc.cliente);
        setRollW(orc.config.rollW);
        setPrice(orc.config.price);
        setMargin(orc.config.margin);
        dispatch({ type: 'SET', payload: orc.vidros });
        setDesconto(0);
        setHistoricoAberto(false);
    };

    const deletarDoHistorico = (id: string) => {
        const atualizado = historico.filter(o => o.id !== id);
        setHistorico(atualizado);
        localStorage.setItem('lume_historico', JSON.stringify(atualizado));
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
        const dados = { config: { cliente, rolo: rollW, preco: price }, vidros };
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
            const canvas = await html2canvas(invoiceRef.current, { scale: 2, backgroundColor: "#0a0f1e" });
            const dataUrl = canvas.toDataURL("image/png");

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
        if (!invoiceRef.current) return;
        setIsCalculating(true);
        try {
            const canvas = await html2canvas(invoiceRef.current, { scale: 3, useCORS: true, backgroundColor: "#0a0f1e" });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 100;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const pdf = new jsPDF('p', 'mm', [imgWidth, imgHeight]);
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            if (Capacitor.isNativePlatform()) {
                const fileName = `Orcamento_${cliente.replace(/\W+/g, '_') || 'LUME'}.pdf`;
                const pdfBase64 = pdf.output('datauristring').split(',')[1];
                const savedFile = await Filesystem.writeFile({
                    path: fileName,
                    data: pdfBase64,
                    directory: Directory.Cache
                });
                await Share.share({
                    title: 'Compartilhar Orçamento (PDF)',
                    url: savedFile.uri,
                });
            } else {
                pdf.save(`Orcamento_${cliente.replace(/\W+/g, '_') || 'LUME'}.pdf`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsCalculating(false);
        }
    };

    const salvarConfig = () => {
        const nova: AppConfig = { rollW: cfgRollW, price: cfgPrice, margin: cfgMargin, modoOtimizacao: cfgModo, userName: cfgUserName };
        saveConfig(nova);
        setRollW(cfgRollW);
        setPrice(cfgPrice);
        setMargin(cfgMargin);
        setModoOtimizacao(cfgModo);
        setUserName(cfgUserName);
        setConfigAberto(false);
    };

    // ─── MEMOS ─────────────────────────────────────────────────────────────────

    const valorSelecionados = useMemo(() => {
        if (selectedIds.length === 0) return 0;
        const area = vidros.filter(v => selectedIds.includes(v.id)).reduce((acc, v) => acc + (v.ow * v.oh), 0);
        return (area / 10000) * price;
    }, [vidros, selectedIds, price]);

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

    const m = maxY / 100;
    const valorPraticoM2 = areaV > 0 ? finalPrice / (areaV / 10000) : 0;

    // ─── RENDER ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#040811] text-white py-6 px-2 sm:px-4 relative">
            <Helmet><title>Admin - Otimizador de Corte | LUME</title></Helmet>

            {/* PAINEL LATERAL: CONFIGURAÇÕES */}
            <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#070f1f] border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${configAberto ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <Settings size={18} className="text-[#c9a227]" />
                        <span className="font-bold text-sm uppercase tracking-wider">Configurações Padrão</span>
                    </div>
                    <button onClick={() => setConfigAberto(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    <div>
                        <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">
                            Esses valores serão usados como padrão sempre que a calculadora for aberta. Você ainda pode alterá-los a qualquer momento durante o uso.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Nome do Responsável</label>
                            <input
                                type="text"
                                value={cfgUserName}
                                onChange={(e) => setCfgUserName(e.target.value)}
                                placeholder="Seu Nome"
                                className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#c9a227]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Largura do Rolo (cm)</label>
                            <input
                                type="number"
                                value={cfgRollW}
                                onChange={(e) => setCfgRollW(parseFloat(e.target.value) || 0)}
                                onFocus={(e) => e.target.select()}
                                className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-[#c9a227]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Preço por m² (R$)</label>
                            <input
                                type="number"
                                value={cfgPrice}
                                onChange={(e) => setCfgPrice(parseFloat(e.target.value) || 0)}
                                onFocus={(e) => e.target.select()}
                                className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-[#c9a227]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Margem de Corte (cm)</label>
                            <input
                                type="number"
                                value={cfgMargin}
                                onChange={(e) => setCfgMargin(parseFloat(e.target.value) || 0)}
                                onFocus={(e) => e.target.select()}
                                className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-[#c9a227]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase text-[#c9a227] font-bold mb-2">Algoritmo Padrão</label>
                            <div className="flex bg-[#040811] border border-white/10 p-1 rounded-xl">
                                <button
                                    onClick={() => setCfgModo('densidade')}
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${cfgModo === 'densidade' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Densidade
                                </button>
                                <button
                                    onClick={() => setCfgModo('facilidade')}
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${cfgModo === 'facilidade' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Fácil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-5 border-t border-white/10">
                    <button
                        onClick={salvarConfig}
                        className="w-full bg-[#c9a227] text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#e5c158] transition-colors"
                    >
                        <Settings size={14} /> Salvar e Aplicar
                    </button>
                </div>
            </div>
            {configAberto && (
                <div onClick={() => setConfigAberto(false)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
            )}

            {/* PAINEL LATERAL: HISTÓRICO */}
            <div className={`fixed inset-y-0 right-0 z-50 w-80 bg-[#070f1f] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${historicoAberto ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <History size={18} className="text-[#c9a227]" />
                        <span className="font-bold text-sm uppercase tracking-wider">Orçamentos Salvos</span>
                    </div>
                    <button onClick={() => setHistoricoAberto(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {historico.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-600 text-sm text-center px-4">
                            <Clock size={32} className="mb-3 opacity-30" />
                            <p>Nenhum orçamento salvo ainda.</p>
                            <p className="text-xs mt-1 opacity-60">Clique em "Salvar no Histórico" após calcular.</p>
                        </div>
                    ) : (
                        historico.map(orc => (
                            <div key={orc.id} className="bg-[#0a1628] border border-white/5 rounded-xl p-3 hover:border-[#c9a227]/30 transition-colors">
                                <div className="flex items-start justify-between mb-1">
                                    <p className="font-bold text-sm text-white leading-tight truncate max-w-[160px]">{orc.cliente}</p>
                                    <span className="text-[10px] text-gray-500 shrink-0 ml-2">{orc.data}</span>
                                </div>
                                <p className="text-green-400 font-bold text-base">{formatBRL(orc.valor)}</p>
                                <p className="text-[11px] text-gray-500 mb-3">{orc.qtd} peças · rolo {orc.config.rollW}cm</p>
                                <div className="flex gap-2">
                                    <button onClick={() => carregarDoHistorico(orc)} className="flex-1 flex items-center justify-center gap-1.5 bg-[#c9a227]/10 hover:bg-[#c9a227]/20 text-[#c9a227] text-[11px] font-bold py-1.5 rounded-lg transition-colors">
                                        <ChevronRight size={13} /> Carregar
                                    </button>
                                    <button onClick={() => deletarDoHistorico(orc.id)} className="p-1.5 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {historicoAberto && (
                <div onClick={() => setHistoricoAberto(false)} className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
            )}

            {/* BARRA FLUTUANTE: SELEÇÃO */}
            {/* FIX 3: onPointerDown + preventDefault em todos os botões de ação */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1e293b] border border-[#3b82f6]/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] p-3 rounded-2xl z-50 flex items-center gap-3 xl:gap-4 transition-all animate-fade-in w-[95%] max-w-md">
                    <div className="flex flex-col min-w-[80px]">
                        <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">{selectedIds.length} Selecionados</span>
                        <span className="text-base sm:text-lg xl:text-xl font-black text-green-400 leading-none">{formatBRL(valorSelecionados)}</span>
                    </div>
                    <div className="h-10 w-px bg-white/10 mx-1" />
                    <div className="flex gap-1.5 sm:gap-2">
                        <button
                            onPointerDown={(e) => { e.preventDefault(); handleRotateSelected(); }}
                            className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 hover:text-[#c9a227] rounded-xl transition-colors"
                            title="Girar 90º"
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            onPointerDown={(e) => { e.preventDefault(); handleAlignSelected('left'); }}
                            className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 hover:text-blue-400 rounded-xl transition-colors"
                            title="Alinhar à Esquerda"
                        >
                            <AlignLeft size={18} />
                        </button>
                        <button
                            onPointerDown={(e) => { e.preventDefault(); handleAlignSelected('right'); }}
                            className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 hover:text-blue-400 rounded-xl transition-colors"
                            title="Alinhar à Direita"
                        >
                            <AlignRight size={18} />
                        </button>
                        <button
                            onPointerDown={(e) => { e.preventDefault(); handleDeleteSelected(); }}
                            className="p-2 sm:p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-colors"
                            title="Deletar Peças"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    <div className="h-10 w-px bg-white/10 mx-1" />
                    <button onClick={() => setSelectedIds([])} className="p-2 text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
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
                            <h1 className="text-xl sm:text-2xl font-bold font-['Montserrat']">LUME <span className="font-light text-gray-400">Calculator</span></h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-nowrap justify-end xl:justify-end overflow-x-auto pb-1 scrollbar-hide">
                        <button
                            onClick={() => { setCfgRollW(rollW); setCfgPrice(price); setCfgMargin(margin); setCfgModo(modoOtimizacao); setCfgUserName(userName); setConfigAberto(true); }}
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
                    <div className="admin-entrance bg-[#0a1628] border border-white/10 rounded-2xl p-5 shadow-2xl">
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

                    <div className="admin-entrance bg-[#0a1628] border border-white/10 rounded-2xl p-5 shadow-2xl">
                        <div className="grid grid-cols-3 gap-2">
                            <div><label className="block text-[10px] text-gray-400 mb-1 text-center font-bold uppercase">Rolo</label><input type="number" value={rollW} onChange={(e) => setRollW(parseFloat(e.target.value))} onFocus={(e) => e.target.select()} className="w-full bg-[#040811] border border-white/10 rounded-lg p-3 text-sm text-center font-bold" /></div>
                            <div><label className="block text-[10px] text-gray-400 mb-1 text-center font-bold uppercase">R$/m²</label><input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} onFocus={(e) => e.target.select()} className="w-full bg-[#040811] border border-white/10 rounded-lg p-3 text-sm text-center font-bold" /></div>
                            <div><label className="block text-[10px] text-gray-400 mb-1 text-center font-bold uppercase">Margem</label><input type="number" value={margin} onChange={(e) => setMargin(parseFloat(e.target.value))} onFocus={(e) => e.target.select()} className="w-full bg-[#040811] border border-white/10 rounded-lg p-3 text-sm text-center font-bold" /></div>
                        </div>
                    </div>

                    <div className="admin-entrance bg-[#0a1628] border border-white/10 rounded-2xl p-5 shadow-2xl">
                        <label className="block text-[10px] uppercase text-[#c9a227] mb-4 font-bold flex items-center gap-2"><Layers size={14} /> Medidas</label>

                        <div className="space-y-1 mb-4">
                            <span className="text-[9px] text-gray-500 font-bold uppercase">Ambiente / Identificação</span>
                            <input
                                type="text"
                                value={labelIn}
                                onChange={(e) => setLabelIn(e.target.value)}
                                className="w-full bg-[#040811] border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#c9a227]/50"
                                placeholder="Ex: Sala, Varanda..."
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <input ref={heightRef} type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} onKeyDown={handleKeyDownHeight} placeholder="Altura" className="bg-[#040811] border border-white/10 rounded-xl p-2.5 text-sm md:text-base text-center" />
                            <input ref={widthRef} type="number" value={widthIn} onChange={(e) => setWidthIn(e.target.value)} onKeyDown={handleKeyDownWidth} placeholder="Largura" className="bg-[#040811] border border-white/10 rounded-xl p-2.5 text-sm md:text-base text-center" />
                            <input ref={qtyRef} type="number" value={qtyIn} onChange={(e) => setQtyIn(e.target.value)} onKeyDown={handleKeyDownQty} onFocus={(e) => e.target.select()} placeholder="Qtd" className="bg-[#040811] border border-white/10 rounded-xl p-2.5 text-sm md:text-base text-center" />
                        </div>
                        <button onClick={adicionar} className="w-full bg-[#c9a227] text-black py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 mb-4">
                            <Plus size={16} /> Adicionar
                        </button>
                    </div>

                    {resumo.length > 0 && (
                        <div className="admin-entrance bg-[#0a1628] border border-white/10 rounded-2xl p-3 max-h-60 overflow-y-auto space-y-4">
                            {Object.entries(
                                resumo.reduce((acc, item) => {
                                    const lbl = item.label || 'Sem Ambiente';
                                    if (!acc[lbl]) acc[lbl] = [];
                                    acc[lbl].push(item);
                                    return acc;
                                }, {} as globalThis.Record<string, typeof resumo>)
                            ).map(([ambiente, itens], idxGrp) => (
                                <div key={idxGrp} className="space-y-1">
                                    <div className="text-[9px] font-bold text-[#c9a227] uppercase tracking-widest px-1 mb-1.5 opacity-90 flex items-center gap-1.5">
                                        <Layers size={10} /> {ambiente}
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
                            <p className="font-['Montserrat'] font-medium text-lg text-white/50">Otimizador de Corte</p>
                        </div>
                    ) : (
                        <>
                            <div className="admin-entrance bg-gradient-to-br from-[#111e33] to-[#0a1628] border border-blue-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
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
                                            title="Compensar perdas (Adiciona o excedente até 100% de eficiência)"
                                        >
                                            <Scissors size={14} />
                                            <span className="text-[9px] font-bold uppercase whitespace-nowrap">
                                                {compensarPerdas ? `+${100 - eficiencia}%` : 'Perdas'}
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
                                <div className="flex bg-[#0a1628] border border-white/10 p-1.5 rounded-xl shadow-2xl flex-1 max-w-sm ml-auto">
                                    <button onClick={() => setModoOtimizacao('densidade')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${modoOtimizacao === 'densidade' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Corte Densidade</button>
                                    <button onClick={() => setModoOtimizacao('facilidade')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${modoOtimizacao === 'facilidade' ? 'bg-[#c9a227] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Corte Fácil</button>
                                </div>
                                {hasCustomOrder && (
                                    <button
                                        onClick={resetOrdem}
                                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 border border-orange-500/40 text-orange-400 hover:bg-orange-500/30 transition-all"
                                        title="Resetar ordem para o padrão otimizado"
                                    >
                                        <RefreshCw size={13} /> Reset Ordem
                                    </button>
                                )}
                            </div>

                            <div className="admin-entrance bg-[#111827] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative min-h-[500px]">
                                <div className="absolute top-0 left-0 w-full bg-[#1f2937] text-gray-400 text-[10px] uppercase font-bold flex justify-between px-3 py-1.5 z-10 border-b border-gray-700">
                                    <span className="flex items-center gap-2">
                                        0cm
                                        {isDragging && <span className="text-blue-400 text-[9px] normal-case">· arraste para reordenar</span>}
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
                                        {blocosCalculados.map((b) => {
                                            if (!b.fit) return null;
                                            const isSelected = selectedIds.includes(b.id);
                                            const isDraggingThis = dragId === b.id;
                                            const isDropTarget = dropTargetId === b.id;

                                            // The ghost stays at worker position; the floating clone follows cursor
                                            const pos = b.fit;

                                            return (
                                                <React.Fragment key={b.id}>
                                                    {/* Ghost placeholder — shown at original position while dragging */}
                                                    <div
                                                        onMouseDown={(e) => handleDragStart(e, b)}
                                                        onTouchStart={(e) => handleDragStart(e, b)}
                                                        onClick={() => { if (!isDragging) toggleSelection(b.id); }}
                                                        className="absolute flex flex-col items-center justify-center text-black font-bold"
                                                        style={{
                                                            left: pos.x * scale,
                                                            top: pos.y * scale,
                                                            width: (b.w - margin) * scale,
                                                            height: ((b.h_visual || b.h) - margin) * scale,
                                                            background: isDraggingThis ? 'rgba(255,255,255,0.05)' : b.cor,
                                                            fontSize: '8px',
                                                            border: isDraggingThis
                                                                ? '2px dashed rgba(255,255,255,0.2)'
                                                                : isDropTarget
                                                                    ? '2px solid #f97316'
                                                                    : isSelected
                                                                        ? '2px solid #3b82f6'
                                                                        : '1px solid rgba(0,0,0,0.3)',
                                                            boxShadow: isDropTarget
                                                                ? '0 0 20px rgba(249,115,22,0.5)'
                                                                : isSelected
                                                                    ? '0 0 15px rgba(59,130,246,0.8)'
                                                                    : 'none',
                                                            zIndex: isDraggingThis ? 1 : isSelected ? 20 : 10,
                                                            cursor: isDraggingThis ? 'grabbing' : 'grab',
                                                            transition: isDraggingThis ? 'none' : 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                                                            touchAction: 'none',
                                                            opacity: isDraggingThis ? 0.3 : 1,
                                                        }}
                                                    >
                                                        <GripVertical size={10} className="absolute top-0.5 right-0.5 opacity-20" />
                                                        {!isDraggingThis && b.label && (
                                                            <span className="text-[7px] font-black uppercase tracking-tighter mb-1 truncate w-full px-0.5 text-center opacity-70">{b.label}</span>
                                                        )}
                                                        {!isDraggingThis && <>
                                                            <span className="text-[9px] font-black">{Math.round(b.rw)}</span>
                                                            <div className="w-1/2 h-px bg-black/10 my-0.5" />
                                                            <span className="text-[9px] font-black">{Math.round(b.rh)}</span>
                                                        </>}
                                                    </div>

                                                    {/* Floating clone — follows cursor during drag */}
                                                    {isDraggingThis && dragVisualPos && (
                                                        <div
                                                            className="absolute flex flex-col items-center justify-center text-black font-bold pointer-events-none"
                                                            style={{
                                                                left: dragVisualPos.x,
                                                                top: dragVisualPos.y,
                                                                width: (b.w - margin) * scale,
                                                                height: ((b.h_visual || b.h) - margin) * scale,
                                                                background: b.cor,
                                                                fontSize: '8px',
                                                                border: '2px solid rgba(0,0,0,0.4)',
                                                                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                                                                zIndex: 50,
                                                                transform: 'rotate(2deg) scale(1.06)',
                                                                opacity: 0.95,
                                                                borderRadius: '3px',
                                                            }}
                                                        >
                                                            {b.label && <span className="text-[7px] font-black uppercase tracking-tighter mb-1 truncate w-full px-0.5 text-center opacity-70">{b.label}</span>}
                                                            <span className="text-[9px] font-black">{Math.round(b.rw)}</span>
                                                            <div className="w-1/2 h-px bg-black/10 my-0.5" />
                                                            <span className="text-[9px] font-black">{Math.round(b.rh)}</span>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* INVOICE OCULTO */}
            <div className="fixed top-[-10000px] left-0 pointer-events-none">
                <div
                    ref={invoiceRef}
                    style={{
                        width: '390px',
                        boxSizing: 'border-box',
                        background: '#0a0f1e',
                        padding: '28px 24px 24px',
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                        color: '#ffffff',
                        position: 'relative',
                    }}
                >
                    <div style={{ position: 'absolute', top: '-80px', right: '-60px', width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-60px', left: '-40px', width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', width: '100%' }}>
                        <div style={{ flexShrink: 0 }}>
                            <div style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-2px', lineHeight: 1, color: '#ffffff' }}>LUME</div>
                            <div style={{ fontSize: '7.5px', fontWeight: '800', letterSpacing: '4px', color: '#c9a227', marginTop: '3px', textTransform: 'uppercase' }}>Películas Premium</div>
                        </div>
                        <div style={{ textAlign: 'right', paddingTop: '4px', flexShrink: 0 }}>
                            <div style={{ fontSize: '7.5px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '2px' }}>Orçamento</div>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#6b7280', marginTop: '3px' }}>{new Date().toLocaleDateString('pt-BR')}</div>
                        </div>
                    </div>

                    <div style={{ height: '2px', background: 'linear-gradient(90deg, #c9a227 0%, rgba(201,162,39,0.2) 60%, transparent 100%)', marginBottom: '18px', borderRadius: '2px' }} />

                    <div style={{ marginBottom: '16px', width: '100%' }}>
                        <div style={{ fontSize: '7.5px', fontWeight: '800', color: '#374151', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '4px' }}>Para</div>
                        <div style={{ fontSize: '16px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.3px', lineHeight: 1.3 }}>
                            {cliente || 'Consumidor Final'}
                        </div>
                        <div style={{ fontSize: '9px', fontWeight: '600', color: '#4b5563', marginTop: '2px' }}>
                            Responsável: {userName}
                        </div>
                    </div>

                    <div style={{ marginBottom: '18px', width: '100%' }}>
                        <div style={{ fontSize: '7.5px', fontWeight: '800', color: '#374151', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '8px' }}>
                            Itens · {vidros.length} peça{vidros.length !== 1 ? 's' : ''}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', width: '100%' }}>
                            {resumo.map((r, i) => (
                                <div key={i} style={{
                                    background: 'rgba(255,255,255,0.035)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: '10px',
                                    padding: '9px 10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    overflow: 'hidden',
                                    minWidth: 0,
                                }}>
                                    <div style={{
                                        background: '#c9a227',
                                        color: '#000000',
                                        fontWeight: '900',
                                        fontSize: '11px',
                                        borderRadius: '6px',
                                        padding: '3px 7px',
                                        minWidth: '26px',
                                        textAlign: 'center',
                                        flexShrink: 0,
                                    }}>{r.q}x</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#e2e8f0', letterSpacing: '-0.5px', lineHeight: 1, overflow: 'hidden' }}>
                                            {Math.round(r.h)}<span style={{ color: '#4b5563', fontSize: '11px', margin: '0 1px' }}>×</span>{Math.round(r.w)}
                                            <span style={{ display: 'inline-block', fontSize: '8px', color: '#4b5563', fontWeight: '600', marginLeft: '2px' }}>cm</span>
                                        </div>
                                        {r.label && (
                                            <div style={{ fontSize: '7px', color: '#a1a1aa', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {r.label}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '18px' }} />

                    <div style={{
                        background: 'linear-gradient(135deg, rgba(201,162,39,0.10) 0%, rgba(16,185,129,0.06) 100%)',
                        border: '1px solid rgba(201,162,39,0.22)',
                        borderRadius: '16px',
                        padding: '18px 20px 16px',
                        marginBottom: '16px',
                        position: 'relative',
                        width: '100%',
                        boxSizing: 'border-box',
                    }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'radial-gradient(circle at top right, rgba(201,162,39,0.12), transparent 70%)', pointerEvents: 'none' }} />

                        {desconto > 0 && (
                            <div style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>Subtotal</span>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280' }}>{formatBRL(subtotalBruto)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#ef4444' }}>Desconto</span>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#ef4444' }}>– {formatBRL(desconto)}</span>
                                </div>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '10px 0 0' }} />
                            </div>
                        )}

                        <div style={{ fontSize: '8px', fontWeight: '800', color: '#c9a227', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '5px', marginTop: desconto > 0 ? '8px' : '0' }}>
                            Total à Vista
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexShrink: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '30px', fontWeight: '900', color: '#10b981', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
                                    {formatBRL(finalPrice)}
                                </div>
                                <div style={{ fontSize: '13px', fontWeight: '800', color: '#6b7280', paddingBottom: '2px', whiteSpace: 'nowrap' }}>
                                    ({totalAreaM2.toFixed(2)} m²)
                                </div>
                            </div>
                            <div style={{
                                background: '#10b981',
                                color: '#000',
                                fontSize: '8px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '1.5px',
                                padding: '5px 11px',
                                borderRadius: '99px',
                                marginBottom: '6px',
                                flexShrink: 0,
                            }}>CONFIRMADO</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '8px', color: '#1f2937', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                            Válido por 7 dias
                        </span>
                        <span style={{ fontSize: '7.5px', color: '#374151', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                            lumecontrolesolar.com.br
                        </span>
                    </div>
                </div>
            </div>

            <div className="text-center text-[10px] text-gray-500 mt-10 pb-4 font-bold tracking-widest uppercase">
                2026 - lume controle solar - todos os direitos reservados
            </div>

            {showSaveToast && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-black font-black text-xs uppercase px-6 py-3 rounded-full shadow-[0_0_40px_rgba(34,197,94,0.4)] z-[100] animate-bounce">
                    Orçamento salvo no histórico!
                </div>
            )}
        </div>
    );
}