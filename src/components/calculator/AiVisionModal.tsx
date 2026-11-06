'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    Sparkles, Camera, Upload, X, Trash2, Plus,
    CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, ZoomIn,
    Mic, Square, FileText, Volume2, MessageSquare, ChevronDown, ChevronUp, User
} from 'lucide-react';

export interface ExtractedPieceDraft {
    id: string;
    ambiente: string;
    altura: number;
    largura: number;
    quantidade: number;
    observacoes?: string;
    confianca: 'alta' | 'media' | 'baixa';
}

export interface ExtractedClientMeta {
    cliente?: string;
    bairro?: string;
    telefone?: string;
}

interface AiVisionModalProps {
    show: boolean;
    onClose: () => void;
    hasExistingGlasses: boolean;
    onApply: (items: ExtractedPieceDraft[], mode: 'append' | 'replace', meta?: ExtractedClientMeta) => void;
}

type ModalTab = 'foto' | 'texto' | 'audio';

/**
 * Redimensiona imagens pesadas de smartphone no client antes do envio.
 */
async function compressImageIfNeeded(file: File, maxDim = 1600, quality = 0.85): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(e.target?.result as string);
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function AiVisionModal({
    show,
    onClose,
    hasExistingGlasses,
    onApply,
}: AiVisionModalProps) {
    const [activeTab, setActiveTab] = useState<ModalTab>('foto');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
    const [textInput, setTextInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('O Gemini 3.8 Flash está analisando as medidas...');
    const [error, setError] = useState<string | null>(null);
    const [successNotice, setSuccessNotice] = useState<string | null>(null);
    const [extractedItems, setExtractedItems] = useState<ExtractedPieceDraft[]>([]);
    const [resumoTexto, setResumoTexto] = useState<string>('');
    const [showZoom, setShowZoom] = useState(false);
    const [showAppendBar, setShowAppendBar] = useState(false);
    const [appendTextInput, setAppendTextInput] = useState('');
    const [extractedClient, setExtractedClient] = useState('');
    const [extractedNeighborhood, setExtractedNeighborhood] = useState('');
    const [extractedPhone, setExtractedPhone] = useState('');

    // Haptic Feedback tátil
    const triggerHaptic = useCallback((pattern: number | number[]) => {
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch {
                // silencioso se não suportado
            }
        }
    }, []);

    // Gravação de Áudio
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const isAppendingAudioRef = useRef(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const audioFileInputRef = useRef<HTMLInputElement>(null);
    const appendFileInputRef = useRef<HTMLInputElement>(null);

    const handleReset = () => {
        setImagePreview(null);
        setAudioBlobUrl(null);
        setTextInput('');
        setAppendTextInput('');
        setExtractedClient('');
        setExtractedNeighborhood('');
        setExtractedPhone('');
        setIsLoading(false);
        setError(null);
        setSuccessNotice(null);
        setExtractedItems([]);
        setResumoTexto('');
        setShowZoom(false);
        setShowAppendBar(false);
        isAppendingAudioRef.current = false;
        stopRecordingCleanup();
    };

    const stopRecordingCleanup = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        setRecordingTime(0);
    };

    useEffect(() => {
        return () => {
            stopRecordingCleanup();
        };
    }, []);

    const processApiResponse = (data: any, isAppend = false) => {
        const drafts: ExtractedPieceDraft[] = (data.items || []).map((it: any, index: number) => ({
            id: `ai-item-${Date.now()}-${index}`,
            ambiente: it.ambiente || 'Geral',
            altura: Number(it.altura) || 0,
            largura: Number(it.largura) || 0,
            quantidade: Number(it.quantidade) >= 1 ? Math.floor(Number(it.quantidade)) : 1,
            observacoes: it.observacoes || '',
            confianca: it.confianca || 'alta',
        }));

        if (drafts.length === 0) {
            setError('Nenhuma medida reconhecida. Tente fornecer mais detalhes de largura e altura.');
        } else {
            if (data.cliente && (!extractedClient || !isAppend)) {
                setExtractedClient(data.cliente);
            }
            if (data.bairro && (!extractedNeighborhood || !isAppend)) {
                setExtractedNeighborhood(data.bairro);
            }
            if (data.telefone && (!extractedPhone || !isAppend)) {
                setExtractedPhone(data.telefone);
            }

            if (isAppend) {
                setExtractedItems((prev) => [...prev, ...drafts]);
                const newResumo = data.resumoTexto ? ` + ${data.resumoTexto}` : '';
                setResumoTexto((prev) => (prev ? `${prev}${newResumo}` : (data.resumoTexto || '')));
                setSuccessNotice(`${drafts.length} nova(s) medida(s) adicionada(s) à tabela!`);
                setTimeout(() => setSuccessNotice(null), 4000);
            } else {
                setExtractedItems(drafts);
                setResumoTexto(data.resumoTexto || '');
            }
        }
    };

    // 1. Processar Foto
    const handleFileSelected = useCallback(async (file: File, isAppend = false) => {
        try {
            setError(null);
            setIsLoading(true);
            setLoadingMessage(isAppend ? 'Lendo imagem complementar com Gemini...' : 'O Gemini 3.8 Flash está lendo sua anotação na imagem...');
            const compressedBase64 = await compressImageIfNeeded(file);
            setImagePreview(compressedBase64);

            const res = await fetch('/api/ai/vision-measures/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64: compressedBase64,
                    mimeType: 'image/jpeg',
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Não foi possível ler as medidas da imagem.');
            }
            processApiResponse(data, isAppend);
        } catch (err: any) {
            console.error('[AiVisionModal Foto Error]:', err);
            setError(err.message || 'Erro ao processar imagem.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 2. Processar Texto Livre
    const handleProcessText = async (textToProcess = textInput, isAppend = false) => {
        if (!textToProcess.trim()) {
            setError('Por favor, digite ou cole um texto com as medidas.');
            return;
        }
        try {
            setError(null);
            setIsLoading(true);
            setLoadingMessage(isAppend ? 'Interpretando medidas adicionais de texto...' : 'O Gemini 3.8 Flash está interpretando o texto...');

            const res = await fetch('/api/ai/vision-measures/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToProcess }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Não foi possível interpretar o texto.');
            }
            processApiResponse(data, isAppend);
            if (isAppend) {
                setAppendTextInput('');
                setShowAppendBar(false);
            }
        } catch (err: any) {
            console.error('[AiVisionModal Texto Error]:', err);
            setError(err.message || 'Erro ao processar texto.');
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Processar Arquivo de Áudio
    const handleAudioFileSelected = async (file: File, isAppend = false) => {
        try {
            setError(null);
            setIsLoading(true);
            setLoadingMessage(isAppend ? 'Ouvindo novo áudio para somar à tabela...' : 'O Gemini 3.8 Flash está ouvindo e transcrevendo o áudio...');
            setAudioBlobUrl(URL.createObjectURL(file));

            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/ai/vision-measures/', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Não foi possível processar o áudio.');
            }
            processApiResponse(data, isAppend);
        } catch (err: any) {
            console.error('[AiVisionModal Audio File Error]:', err);
            setError(err.message || 'Erro ao processar arquivo de áudio.');
        } finally {
            setIsLoading(false);
        }
    };

    // 4. Gravação de Áudio ao Vivo
    const startRecording = async (isAppend = false) => {
        try {
            setError(null);
            isAppendingAudioRef.current = isAppend;
            triggerHaptic(60);

            if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                setError(
                    'Gravação por microfone requer conexão segura (HTTPS ou localhost). Como você está acessando via rede local, use http://localhost:3000 ou envie um áudio gravado no botão "Subir Áudio do Zap".'
                );
                return;
            }

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError(
                    'Seu navegador não suporta captura direta de microfone ou bloqueou o acesso. Use o botão "Subir Áudio do Zap" para enviar um arquivo de áudio gravado.'
                );
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const mimeType = mediaRecorder.mimeType || 'audio/webm';
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                setAudioBlobUrl(URL.createObjectURL(audioBlob));
                stream.getTracks().forEach((track) => track.stop());

                // Envia para o Gemini
                try {
                    setIsLoading(true);
                    setError(null);
                    setLoadingMessage(
                        isAppendingAudioRef.current
                            ? 'Ouvindo áudio complementar e somando à lista...'
                            : 'O Gemini está ouvindo sua voz e extraindo as medidas...'
                    );

                    const formData = new FormData();
                    formData.append('file', audioBlob, 'gravacao.webm');

                    const res = await fetch('/api/ai/vision-measures/', {
                        method: 'POST',
                        body: formData,
                    });

                    const data = await res.json();
                    if (!res.ok || !data.success) {
                        throw new Error(data.error || 'Não foi possível interpretar a voz gravada.');
                    }
                    processApiResponse(data, isAppendingAudioRef.current);
                } catch (err: any) {
                    console.error('[AiVisionModal Audio Error]:', err);
                    setError(err.message || 'Erro ao enviar gravação.');
                } finally {
                    setIsLoading(false);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerIntervalRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (err: any) {
            console.error('[Audio Record Error]:', err);
            const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
            if (isDenied) {
                setError('Permissão de microfone bloqueada pelo navegador. Clique no ícone de opções/cadeado ao lado da barra de URL do navegador (ou nas permissões do site), mude "Microfone" para "Permitir" e recarregue a página.');
            } else {
                setError(`Não foi possível iniciar o microfone (${err.message || 'Erro de hardware/permissão'}). Você também pode usar o botão "Subir Áudio do Zap" para enviar arquivos de áudio gravados.`);
            }
        }
    };

    const stopRecording = () => {
        triggerHaptic([40, 60, 50]);
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
            setIsRecording(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setActiveTab('foto');
                handleFileSelected(file);
            } else if (file.type.startsWith('audio/') || file.name.endsWith('.mp3') || file.name.endsWith('.ogg') || file.name.endsWith('.m4a')) {
                setActiveTab('audio');
                handleAudioFileSelected(file);
            }
        }
    };

    const handleItemChange = (id: string, field: keyof ExtractedPieceDraft, val: any) => {
        setExtractedItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
        );
    };

    const handleRemoveItem = (id: string) => {
        setExtractedItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleAddItem = () => {
        setExtractedItems((prev) => [
            ...prev,
            {
                id: `ai-item-${Date.now()}-${prev.length}`,
                ambiente: prev[prev.length - 1]?.ambiente || 'Geral',
                altura: 100,
                largura: 100,
                quantidade: 1,
                observacoes: '',
                confianca: 'alta',
            },
        ]);
    };

    const handleConfirm = (mode: 'append' | 'replace') => {
        const valid = extractedItems.filter((it) => it.altura > 0 && it.largura > 0 && it.quantidade > 0);
        if (valid.length === 0) {
            setError('Adicione pelo menos uma peça com altura e largura válidas.');
            return;
        }
        onApply(valid, mode, {
            cliente: extractedClient.trim() || undefined,
            bairro: extractedNeighborhood.trim() || undefined,
            telefone: extractedPhone.trim() || undefined,
        });
        handleReset();
        onClose();
    };

    if (!show) return null;

    const totalFolhas = extractedItems.reduce((acc, it) => acc + (it.quantidade || 1), 0);
    const hasResults = extractedItems.length > 0;

    const formatTimer = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-[#070c14] border-2 border-[#c9a227]/40 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a111e]/80">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#c9a227]/15 border border-[#c9a227]/40 flex items-center justify-center text-[#c9a227] shadow-[0_0_15px_rgba(201,162,39,0.2)]">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                Assistente Multimodal de Medidas
                                <span className="text-[10px] bg-[#c9a227]/20 text-[#c9a227] px-2 py-0.5 rounded-full font-mono border border-[#c9a227]/30">
                                    Gemini 3.8 Flash
                                </span>
                            </h2>
                            <p className="text-[11px] text-gray-400">
                                Foto de anotação, mensagem do WhatsApp ou comando de voz em centímetros
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        title="Fechar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Abas Superiores (quando ainda não extraiu resultados) */}
                {!hasResults && !isLoading && (
                    <div className="flex items-center border-b border-white/10 bg-[#040811] px-6 pt-2">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('foto'); setError(null); }}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                                activeTab === 'foto'
                                    ? 'border-[#c9a227] text-[#c9a227]'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            <Camera size={15} /> Foto / Câmera
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('texto'); setError(null); }}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                                activeTab === 'texto'
                                    ? 'border-[#c9a227] text-[#c9a227]'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            <MessageSquare size={15} /> Colar Texto
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('audio'); setError(null); }}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                                activeTab === 'audio'
                                    ? 'border-[#c9a227] text-[#c9a227]'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            <Mic size={15} /> Gravar Voz / Áudio
                        </button>
                    </div>
                )}

                {/* Conteúdo Central */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Caso 1: Inputs Iniciais */}
                    {!hasResults && !isLoading && (
                        <React.Fragment>
                            {/* ABA FOTO */}
                            {activeTab === 'foto' && (
                                <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                    className="border-2 border-dashed border-[#c9a227]/30 hover:border-[#c9a227] rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#040811]/60 transition-all cursor-pointer group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#c9a227] mb-4 group-hover:scale-110 transition-transform">
                                        <Upload size={28} />
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-1">
                                        Clique para selecionar a foto ou arraste aqui
                                    </h3>
                                    <p className="text-xs text-gray-400 max-w-md mb-5">
                                        Papéis de rascunho, pranchetas de obra, fita crepe ou prints do WhatsApp.
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current?.click();
                                            }}
                                            className="px-4 py-2.5 rounded-xl bg-[#111e33] hover:bg-[#1a2c4e] border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                                        >
                                            <Upload size={14} className="text-[#c9a227]" />
                                            Escolher Arquivo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                cameraInputRef.current?.click();
                                            }}
                                            className="px-4 py-2.5 rounded-xl bg-[#c9a227] hover:bg-[#dfb42f] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg shadow-[#c9a227]/20"
                                        >
                                            <Camera size={14} />
                                            Tirar Foto com a Câmera
                                        </button>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileSelected(file);
                                        }}
                                    />
                                    <input
                                        ref={cameraInputRef}
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileSelected(file);
                                        }}
                                    />
                                </div>
                            )}

                            {/* ABA TEXTO */}
                            {activeTab === 'texto' && (
                                <div className="space-y-4">
                                    <div className="bg-[#040811] border border-white/10 rounded-2xl p-4">
                                        <label className="block text-xs uppercase font-bold text-[#c9a227] mb-2 flex items-center gap-1.5">
                                            <FileText size={14} /> Cole aqui a mensagem ou anotação digitada:
                                        </label>
                                        <textarea
                                            rows={6}
                                            value={textInput}
                                            onChange={(e) => setTextInput(e.target.value)}
                                            placeholder="Ex: Fala chefe, anota aí: Varanda 4 folhas de 2.15 por 80 fumê, e na cozinha uma janela de 1.20 x 1.00..."
                                            className="w-full bg-[#0a111e] border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[#c9a227]/50 resize-none font-sans"
                                        />
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">Exemplo rápido:</span>
                                            <button
                                                type="button"
                                                onClick={() => setTextInput('Varanda Gourmet: 6 folhas com 2.20 x 85 em nano cerâmica, e Banheiro: 1 basculante 60 x 40')}
                                                className="text-[11px] text-gray-400 hover:text-[#c9a227] underline"
                                            >
                                                Preencher exemplo
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleProcessText(textInput, false)}
                                            className="px-6 py-3 rounded-xl bg-[#c9a227] hover:bg-[#dfb42f] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#c9a227]/20 transition-all"
                                        >
                                            <Sparkles size={16} /> Processar Texto com IA
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ABA ÁUDIO */}
                            {activeTab === 'audio' && (
                                <div className="space-y-5">
                                    <div className="border border-white/10 rounded-2xl p-8 bg-[#040811] flex flex-col items-center justify-center text-center">
                                        {isRecording ? (
                                            <div className="space-y-4 flex flex-col items-center">
                                                <div className="relative">
                                                    <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 animate-pulse">
                                                        <Mic size={36} />
                                                    </div>
                                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                                                    </span>
                                                </div>

                                                <div className="text-center">
                                                    <span className="text-2xl font-mono font-bold text-red-400">
                                                        {formatTimer(recordingTime)}
                                                    </span>
                                                    <p className="text-xs text-gray-300 mt-1">
                                                        Gravando... Dite as medidas com calma (ex: &ldquo;Varanda quatro folhas de 2 e 15 por 80...&rdquo;)
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={stopRecording}
                                                    className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-red-600/30 transition-all"
                                                >
                                                    <Square size={16} /> Parar e Processar Medidas
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 flex flex-col items-center max-w-md">
                                                <div className="w-20 h-20 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#c9a227]">
                                                    <Mic size={36} />
                                                </div>

                                                <div>
                                                    <h3 className="text-base font-bold text-white mb-1">
                                                        Dite as medidas pelo Microfone
                                                    </h3>
                                                    <p className="text-xs text-gray-400">
                                                        Ideal para quem está no local da obra medindo com a trena.
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => startRecording(false)}
                                                        className="px-6 py-3 rounded-xl bg-[#c9a227] hover:bg-[#dfb42f] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#c9a227]/20 transition-all"
                                                    >
                                                        <Mic size={16} /> Iniciar Gravação
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => audioFileInputRef.current?.click()}
                                                        className="px-4 py-3 rounded-xl bg-[#111e33] hover:bg-[#1a2c4e] border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                                                    >
                                                        <Volume2 size={16} className="text-[#c9a227]" />
                                                        Subir Áudio do Zap (.ogg, .mp3)
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <input
                                            ref={audioFileInputRef}
                                            type="file"
                                            accept="audio/*,.ogg,.mp3,.m4a,.wav"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleAudioFileSelected(file, false);
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    )}

                    {/* Estado de Carregamento da IA */}
                    {isLoading && (
                        <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-[#c9a227]/20 border-t-[#c9a227] animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center text-[#c9a227]">
                                    <Sparkles size={20} className="animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-base font-bold text-white">
                                    {loadingMessage}
                                </h4>
                                <p className="text-xs text-gray-400">
                                    Convertendo para centímetros e organizando ambientes em segundos.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Mensagem de Erro */}
                    {error && (
                        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-3 text-red-200">
                            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                            <div className="flex-1 text-xs">
                                <p className="font-bold mb-1">Atenção:</p>
                                <p>{error}</p>
                            </div>
                            <button
                                onClick={handleReset}
                                className="text-xs text-red-300 underline hover:text-white"
                            >
                                Reiniciar
                            </button>
                        </div>
                    )}

                    {/* Aviso de Sucesso ao Somar Medidas */}
                    {successNotice && (
                        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-200 animate-in fade-in">
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                            <p className="text-xs font-bold">{successNotice}</p>
                        </div>
                    )}

                    {/* Banner de Gravação Ativa de Áudio Complementar */}
                    {hasResults && isRecording && (
                        <div className="p-3.5 rounded-2xl bg-red-950/40 border-2 border-red-500/60 flex items-center justify-between shadow-xl">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <span className="w-3.5 h-3.5 rounded-full bg-red-500 inline-block" />
                                    <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping absolute inset-0" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">
                                        Gravando complemento ({formatTimer(recordingTime)})
                                    </p>
                                    <p className="text-[11px] text-gray-300">
                                        Dite as novas peças para somar à tabela (ex: &ldquo;Mais três peças na sala...&rdquo;)
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={stopRecording}
                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all"
                            >
                                <Square size={14} /> Parar e Somar
                            </button>
                        </div>
                    )}

                    {/* Caso 2: Tabela de Revisão Rápida (para Foto, Texto ou Áudio) */}
                    {hasResults && !isLoading && (
                        <div className="space-y-4">
                            {/* CARD: DADOS DO CLIENTE / LOCALIZAÇÃO IDENTIFICADOS */}
                            {(extractedClient || extractedNeighborhood || extractedPhone) && (
                                <div className="p-3.5 rounded-2xl bg-[#0a111e] border border-[#c9a227]/40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                                    <div className="flex items-center gap-2 text-xs font-bold text-[#c9a227] uppercase tracking-wider">
                                        <User size={15} />
                                        <span>Cliente Identificado pela IA:</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 flex-1">
                                        <div className="flex items-center gap-1.5 bg-[#040811] border border-white/10 rounded-xl px-2.5 py-1">
                                            <span className="text-[10px] uppercase font-bold text-gray-500">Nome:</span>
                                            <input
                                                type="text"
                                                value={extractedClient}
                                                onChange={(e) => setExtractedClient(e.target.value)}
                                                placeholder="Nome do cliente"
                                                className="bg-transparent text-xs text-white outline-none w-28 sm:w-36 font-medium"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-[#040811] border border-white/10 rounded-xl px-2.5 py-1">
                                            <span className="text-[10px] uppercase font-bold text-gray-500">Bairro:</span>
                                            <input
                                                type="text"
                                                value={extractedNeighborhood}
                                                onChange={(e) => setExtractedNeighborhood(e.target.value)}
                                                placeholder="Bairro"
                                                className="bg-transparent text-xs text-white outline-none w-28 sm:w-36 font-medium"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-[#040811] border border-white/10 rounded-xl px-2.5 py-1">
                                            <span className="text-[10px] uppercase font-bold text-gray-500">Tel:</span>
                                            <input
                                                type="text"
                                                value={extractedPhone}
                                                onChange={(e) => setExtractedPhone(e.target.value)}
                                                placeholder="Telefone"
                                                className="bg-transparent text-xs text-white outline-none w-28 sm:w-32 font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                            {/* Coluna de Origem (Foto ou Áudio/Texto) */}
                            <div className="lg:col-span-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold text-[#c9a227] tracking-wider">
                                        Origem Analisada
                                    </span>
                                    {imagePreview && (
                                        <button
                                            type="button"
                                            onClick={() => setShowZoom(!showZoom)}
                                            className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
                                        >
                                            <ZoomIn size={12} /> {showZoom ? 'Reduzir' : 'Ampliar'}
                                        </button>
                                    )}
                                </div>

                                {imagePreview && (
                                    <div className={`relative rounded-xl overflow-hidden border border-white/10 bg-black/40 ${showZoom ? 'max-h-96' : 'max-h-48 lg:max-h-72'} transition-all flex items-center justify-center`}>
                                        <img
                                            src={imagePreview}
                                            alt="Anotação enviada"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}

                                {audioBlobUrl && (
                                    <div className="p-3 rounded-xl bg-[#040811] border border-white/10 flex flex-col gap-2">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1.5">
                                            <Volume2 size={13} className="text-[#c9a227]" /> Último áudio processado:
                                        </span>
                                        <audio src={audioBlobUrl} controls className="w-full h-8" />
                                    </div>
                                )}

                                {textInput && !imagePreview && !audioBlobUrl && (
                                    <div className="p-3 rounded-xl bg-[#040811] border border-white/10 text-xs text-gray-300 max-h-36 overflow-y-auto font-mono">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Texto original:</span>
                                        &ldquo;{textInput}&rdquo;
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <RefreshCw size={12} /> Limpar e reiniciar
                                </button>

                                {resumoTexto && (
                                    <div className="p-2.5 rounded-lg bg-[#040811] border border-white/5 text-[11px] text-gray-400 italic">
                                        &ldquo;{resumoTexto}&rdquo;
                                    </div>
                                )}
                            </div>

                            {/* Coluna da Tabela de Medidas */}
                            <div className="lg:col-span-8 flex flex-col gap-3">
                                {/* Barra Superior da Tabela com Botões de Complemento */}
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-[10px] uppercase font-bold text-white tracking-wider">
                                        Vidros Identificados ({extractedItems.length} tipos • {totalFolhas} folhas totais)
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        {/* Botão de Falar Mais Medidas (1-clique) */}
                                        <button
                                            type="button"
                                            disabled={isRecording}
                                            onClick={() => startRecording(true)}
                                            className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-300 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
                                            title="Grava mais um áudio com o microfone e soma as peças na tabela"
                                        >
                                            <Mic size={13} className="text-red-400" />
                                            Falar Mais
                                        </button>

                                        {/* Botão para abrir menu de complementos (Foto/Texto) */}
                                        <button
                                            type="button"
                                            onClick={() => setShowAppendBar(!showAppendBar)}
                                            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
                                                showAppendBar
                                                    ? 'bg-[#c9a227]/20 border-[#c9a227] text-[#c9a227]'
                                                    : 'bg-[#111e33] border-white/10 text-gray-300 hover:text-white'
                                            }`}
                                            title="Adicionar mais peças via foto ou texto"
                                        >
                                            <Sparkles size={13} className="text-[#c9a227]" />
                                            + Mais IA
                                            {showAppendBar ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                        </button>

                                        {/* Botão Manual */}
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-[11px] font-bold uppercase flex items-center gap-1 transition-colors"
                                            title="Adicionar linha vazia manualmente"
                                        >
                                            <Plus size={13} /> Manual
                                        </button>
                                    </div>
                                </div>

                                {/* Menu Retrátil para Adicionar Mais via Foto ou Texto */}
                                {showAppendBar && (
                                    <div className="p-3.5 rounded-2xl bg-[#040811] border border-[#c9a227]/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] uppercase font-bold text-[#c9a227] tracking-wider flex items-center gap-1.5">
                                                <Sparkles size={12} /> Somar mais peças à lista atual:
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setShowAppendBar(false)}
                                                className="text-gray-400 hover:text-white"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                                            <div className="sm:col-span-8 flex gap-2">
                                                <input
                                                    type="text"
                                                    value={appendTextInput}
                                                    onChange={(e) => setAppendTextInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleProcessText(appendTextInput, true);
                                                        }
                                                    }}
                                                    placeholder="Digite ex: 'mais 2 folhas na sala 2.10 x 80'..."
                                                    className="w-full bg-[#0a111e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#c9a227]/50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleProcessText(appendTextInput, true)}
                                                    className="px-3 py-2 bg-[#c9a227] text-black font-bold text-xs uppercase rounded-xl shrink-0 hover:bg-[#dfb42f] transition-colors"
                                                >
                                                    Somar
                                                </button>
                                            </div>

                                            <div className="sm:col-span-4 flex gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => appendFileInputRef.current?.click()}
                                                    className="flex-1 px-2.5 py-2 rounded-xl bg-[#111e33] hover:bg-[#1a2c4e] border border-white/10 text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                                                >
                                                    <Upload size={12} className="text-[#c9a227]" /> + Foto/Print
                                                </button>
                                                <input
                                                    ref={appendFileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleFileSelected(file, true);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#040811]">
                                    <div className="max-h-[380px] overflow-y-auto">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-[#0a111e] text-[10px] uppercase text-gray-400 font-bold">
                                                    <th className="py-2.5 px-3">Ambiente</th>
                                                    <th className="py-2.5 px-2 text-center">Altura (cm)</th>
                                                    <th className="py-2.5 px-2 text-center">Largura (cm)</th>
                                                    <th className="py-2.5 px-2 text-center">Qtd</th>
                                                    <th className="py-2.5 px-2 text-center">Status</th>
                                                    <th className="py-2.5 px-2 text-center w-8"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {extractedItems.map((item) => (
                                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="p-2">
                                                            <input
                                                                type="text"
                                                                value={item.ambiente}
                                                                onChange={(e) => handleItemChange(item.id, 'ambiente', e.target.value)}
                                                                placeholder="Ambiente"
                                                                className="w-full bg-[#0a111e] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#c9a227]/50"
                                                            />
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            <input
                                                                type="number"
                                                                step="0.1"
                                                                min="1"
                                                                value={item.altura || ''}
                                                                onChange={(e) => handleItemChange(item.id, 'altura', parseFloat(e.target.value) || 0)}
                                                                className="w-20 text-center bg-[#0a111e] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold outline-none focus:border-[#c9a227]/50"
                                                            />
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            <input
                                                                type="number"
                                                                step="0.1"
                                                                min="1"
                                                                value={item.largura || ''}
                                                                onChange={(e) => handleItemChange(item.id, 'largura', parseFloat(e.target.value) || 0)}
                                                                className="w-20 text-center bg-[#0a111e] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold outline-none focus:border-[#c9a227]/50"
                                                            />
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={item.quantidade || ''}
                                                                onChange={(e) => handleItemChange(item.id, 'quantidade', parseInt(e.target.value, 10) || 1)}
                                                                className="w-14 text-center bg-[#0a111e] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold outline-none focus:border-[#c9a227]/50"
                                                            />
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            {item.confianca === 'alta' ? (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full" title="Leitura de alta confiança">
                                                                    <CheckCircle2 size={11} /> Nítido
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full" title="Conferir número">
                                                                    <AlertTriangle size={11} /> Conferir
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveItem(item.id)}
                                                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                                title="Remover peça"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </div>

                {/* Rodapé de Ações */}
                {hasResults && !isLoading && (
                    <div className="px-6 py-4 border-t border-white/10 bg-[#0a111e]/90 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>

                        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
                            {hasExistingGlasses && (
                                <button
                                    type="button"
                                    onClick={() => handleConfirm('replace')}
                                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-red-500/30 hover:border-red-500 bg-red-950/20 text-red-300 font-bold text-xs uppercase tracking-wider transition-all"
                                    title="Apaga os vidros atuais e deixa apenas os extraídos pela IA"
                                >
                                    Substituir Lista Inteira
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => handleConfirm('append')}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#c9a227] hover:bg-[#dfb42f] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#c9a227]/20 transition-all"
                            >
                                <CheckCircle2 size={16} />
                                {hasExistingGlasses ? 'Adicionar à Lista Atual' : 'Confirmar e Injetar no Corte'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
