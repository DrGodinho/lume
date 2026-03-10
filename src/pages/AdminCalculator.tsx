import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import {
    Plus,
    Trash2,
    Smartphone,
    Save,
    FolderOpen,
    Scissors,
    Calculator,
    Camera,
    Layers,
    ChevronLeft
} from 'lucide-react';
import gsap from 'gsap';
import html2canvas from 'html2canvas';

interface GlassItem {
    id: string;
    h: number;
    w: number;
    cor: string;
}

interface Block {
    w: number;
    h: number;
    rw: number;
    rh: number;
    cor: string;
    fit?: { x: number; y: number };
}

export function AdminCalculator() {
    const [cliente, setCliente] = useState('');
    const [rollW, setRollW] = useState(152);
    const [margin, setMargin] = useState(3);
    const [price, setPrice] = useState(80);
    const [desconto, setDesconto] = useState(0);

    const [heightIn, setHeightIn] = useState('');
    const [widthIn, setWidthIn] = useState('');
    const [qtyIn, setQtyIn] = useState('1');

    const [vidros, setVidros] = useState<GlassItem[]>([]);
    const [blocosCalculados, setBlocosCalculados] = useState<Block[]>([]);
    const [maxY, setMaxY] = useState(0);
    const [areaV, setAreaV] = useState(0);

    const invoiceRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        gsap.fromTo('.admin-entrance',
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' }
        );
    }, []);

    useEffect(() => {
        // Auto process on changes
        if (vidros.length > 0) {
            processarCorte();
        } else {
            setBlocosCalculados([]);
            setMaxY(0);
            setAreaV(0);
            setDesconto(0);
        }
    }, [vidros, rollW, margin]);

    const formatBRL = (num: number) => {
        return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const handleDescontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let valor = e.target.value.replace(/\D/g, '');
        let numero = parseInt(valor, 10) / 100 || 0;
        setDesconto(numero);
    };

    const adicionar = () => {
        const h = parseFloat(heightIn.replace(',', '.'));
        const w = parseFloat(widthIn.replace(',', '.'));
        const q = parseInt(qtyIn) || 1;

        if (!h || !w || h <= 0 || w <= 0 || q <= 0) return;

        const novos: GlassItem[] = [];
        for (let i = 0; i < q; i++) {
            novos.push({
                id: Math.random().toString(36).substr(2, 9),
                h, w,
                cor: `hsl(${(h * w + h + w) % 360}, 65%, 75%)`
            });
        }
        setVidros([...vidros, ...novos]);

        setHeightIn('');
        setWidthIn('');
        setQtyIn('1');
    };

    const removerTudoTipo = (h: number, w: number) => {
        setVidros(current => current.filter(v => !(v.h === h && v.w === w)));
    };

    const processarCorte = () => {
        let blocos: Block[] = vidros.map(v => ({
            w: v.w + margin,
            h: v.h + margin,
            rw: v.w,
            rh: v.h,
            cor: v.cor
        }));

        blocos.sort((a, b) => (b.w * b.h) - (a.w * a.h));

        let freeRects = [{ x: 0, y: 0, w: rollW, h: 100000 }];
        let currentMaxY = 0, currentAreaV = 0;

        blocos.forEach(b => {
            let bestRectIdx = -1;
            for (let i = 0; i < freeRects.length; i++) {
                let r = freeRects[i];
                if (b.w <= r.w && b.h <= r.h) { bestRectIdx = i; break; }
            }
            if (bestRectIdx !== -1) {
                let r = freeRects[bestRectIdx];
                b.fit = { x: r.x, y: r.y };
                if (b.fit.y + b.h > currentMaxY) currentMaxY = b.fit.y + b.h;
                currentAreaV += (b.rw * b.rh);
                freeRects.splice(bestRectIdx, 1,
                    { x: r.x + b.w, y: r.y, w: r.w - b.w, h: b.h },
                    { x: r.x, y: r.y + b.h, w: r.w, h: r.h - b.h }
                );
                freeRects.sort((a, b) => a.y - b.y);
            }
        });

        setBlocosCalculados(blocos);
        setMaxY(currentMaxY);
        setAreaV(currentAreaV);
    };

    const importarZap = () => {
        const code = prompt("Cole aqui o CÓDIGO DE IMPORTAÇÃO enviado pelo cliente:");
        if (!code) return;
        try {
            const d = JSON.parse(atob(code));
            setCliente(`${d.n} (${d.b}) - ${d.f}`);
            const novos: GlassItem[] = d.v.map((v: any) => ({
                id: Math.random().toString(36).substr(2, 9),
                h: parseFloat(v.h),
                w: parseFloat(v.w),
                cor: `hsl(${(parseFloat(v.h) * parseFloat(v.w)) % 360}, 65%, 75%)`
            }));
            setVidros(novos);
            setDesconto(0);
            alert("✅ Medidas e dados do cliente importados com sucesso!");
        } catch (e) {
            alert("❌ Erro: Código inválido.");
        }
    };

    const salvarProjeto = () => {
        const dados = {
            config: { cliente, rolo: rollW, preco: price },
            vidros
        };
        const blob = new Blob([JSON.stringify(dados)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (cliente || 'projeto') + ".insul";
        a.click();
    };

    const abrirProjeto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const d = JSON.parse(ev.target?.result as string);
                setCliente(d.config.cliente || '');
                setRollW(parseFloat(d.config.rolo) || 152);
                setPrice(parseFloat(d.config.preco) || 80);
                setVidros(d.vidros || []);
                setDesconto(0);
            } catch (e) {
                alert("Arquivo inválido");
            }
        };
        reader.readAsText(file);
    };

    const m = maxY / 100;
    const filmAreaM2 = (m * rollW / 100);
    const subtotalBruto = filmAreaM2 * price;
    const finalPrice = Math.max(0, subtotalBruto - desconto);
    const eficiencia = maxY > 0 ? Math.round((areaV / (maxY * rollW)) * 100) : 0;
    const valorPraticoM2 = filmAreaM2 > 0 ? (finalPrice / filmAreaM2) : 0;

    const gerarImagem = async () => {
        if (!invoiceRef.current) return;
        window.scrollTo(0, 0);
        const canvas = await html2canvas(invoiceRef.current, {
            scale: 2,
            backgroundColor: "#ffffff",
        });
        const link = document.createElement('a');
        link.download = `Orcamento_${cliente.replace(/\s+/g, '_') || 'LUME'}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    // Resumo para as listas
    const getResumoVidros = () => {
        const map = new Map<string, { h: number, w: number, q: number }>();
        vidros.forEach(v => {
            const k = `${v.h}x${v.w}`;
            if (map.has(k)) map.get(k)!.q++;
            else map.set(k, { h: v.h, w: v.w, q: 1 });
        });
        return Array.from(map.values());
    };

    const resumo = getResumoVidros();

    return (
        <div className="min-h-screen bg-[#040811] text-white py-10 px-4 sm:px-6">
            <Helmet>
                <title>Admin - Otimizador de Corte | LUME</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Cabeçalho */}
                <div className="col-span-1 md:col-span-12 admin-entrance flex flex-col md:flex-row items-center justify-between mb-2">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <a href="#" className="p-3 bg-[#111e33] border border-[#233554] rounded-xl hover:bg-[#1a2c4e] transition-colors">
                            <ChevronLeft size={20} className="text-[#c9a227]" />
                        </a>
                        <div>
                            <h1 className="text-2xl font-bold font-['Montserrat'] flex items-center gap-2">
                                <Calculator className="text-[#c9a227]" />
                                LUME <span className="font-light text-gray-400">Admin Calculator</span>
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Coluna Esquerda: Controles */}
                <div className="col-span-1 md:col-span-4 space-y-6">
                    {/* Ações / Cliente */}
                    <div className="admin-entrance bg-[#0a1628] border border-white/10 rounded-2xl p-5 shadow-2xl">
                        <label className="block text-[10px] uppercase tracking-widest text-[#c9a227] mb-2 font-bold">Cliente / Detalhes</label>
                        <input
                            type="text"
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                            placeholder="Nome / Material"
                            className="w-full bg-[#040811] border border-white/10 rounded-xl px-4 py-3 focus:border-[#c9a227] transition-colors outline-none text-sm mb-4"
                        />
                        <div className="grid grid-cols-1 gap-2">
                            <button onClick={importarZap} className="flex items-center justify-center gap-2 bg-[#25d366]/20 text-[#25d366] hover:bg-[#25d366]/30 px-4 py-3 rounded-xl transition-colors font-semibold text-xs uppercase tracking-wider">
                                <Smartphone size={16} /> Importar do WhatsApp
                            </button>
                            <div className="flex gap-2">
                                <button onClick={salvarProjeto} className="flex-1 flex items-center justify-center gap-2 bg-[#1a2c4e] text-blue-300 hover:bg-[#233554] px-4 py-3 rounded-xl transition-colors font-semibold text-xs uppercase tracking-wider">
                                    <Save size={16} /> Salvar
                                </button>
                                <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 bg-[#1a2c4e] text-blue-300 hover:bg-[#233554] px-4 py-3 rounded-xl transition-colors font-semibold text-xs uppercase tracking-wider">
                                    <FolderOpen size={16} /> Abrir
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept=".insul" onChange={abrirProjeto} />
                            </div>
                        </div>
                    </div>

                    {/* Confgs Fixas */}
                    <div className="admin-entrance bg-[#0a1628] border border-white/10 rounded-2xl p-5 shadow-2xl">
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-4 font-bold">Configurações Base</label>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-1">Rolo</label>
                                <input type="number" value={rollW} onChange={(e) => setRollW(parseFloat(e.target.value))} className="w-full bg-[#040811] border border-white/10 rounded-xl px-2 py-2 text-xs focus:border-[#c9a227] outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-1">R$ / m²</label>
                                <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} className="w-full bg-[#040811] border border-white/10 rounded-xl px-2 py-2 text-xs focus:border-[#c9a227] outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-1">Margem</label>
                                <input type="number" value={margin} onChange={(e) => setMargin(parseFloat(e.target.value))} className="w-full bg-[#040811] border border-white/10 rounded-xl px-2 py-2 text-xs focus:border-[#c9a227] outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Adicionar Vidros */}
                    <div className="admin-entrance bg-[#0a1628] border border-white/10 rounded-2xl p-5 shadow-2xl">
                        <label className="block text-[10px] uppercase tracking-widest text-[#c9a227] mb-4 font-bold flex items-center gap-2"><Layers size={14} /> Medidas</label>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-1">Alt (cm)</label>
                                <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="0" className="w-full bg-[#040811] border border-white/10 rounded-xl px-2 sm:px-3 py-2.5 text-sm focus:border-[#c9a227] outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-1">Larg (cm)</label>
                                <input type="number" value={widthIn} onChange={(e) => setWidthIn(e.target.value)} placeholder="0" className="w-full bg-[#040811] border border-white/10 rounded-xl px-2 sm:px-3 py-2.5 text-sm focus:border-[#c9a227] outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400 mb-1">Qtd</label>
                                <input
                                    type="number"
                                    value={qtyIn}
                                    onChange={(e) => setQtyIn(e.target.value)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="1"
                                    className="w-full bg-[#040811] border border-white/10 rounded-xl px-2 sm:px-3 py-2.5 text-sm focus:border-[#c9a227] outline-none"
                                />
                            </div>
                        </div>
                        <button onClick={adicionar} className="w-full flex items-center justify-center gap-2 bg-[#c9a227] text-black hover:bg-yellow-500 px-4 py-3 rounded-xl transition-colors font-bold text-xs uppercase tracking-wider">
                            <Plus size={16} /> Adicionar
                        </button>
                    </div>

                    {/* Lista */}
                    {resumo.length > 0 && (
                        <div className="admin-entrance bg-[#0a1628] border border-white/10 rounded-2xl p-3 shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
                            {resumo.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 mb-1 bg-[#040811] rounded-lg border border-white/5">
                                    <span className="text-xs font-medium"><span className="text-[#c9a227] font-bold">{item.q}x</span> {item.h} x {item.w} cm</span>
                                    <button onClick={() => removerTudoTipo(item.h, item.w)} className="text-gray-500 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Coluna Direita: Resultados & Canvas */}
                <div className="col-span-1 md:col-span-8 flex flex-col space-y-6">
                    {vidros.length === 0 ? (
                        <div className="admin-entrance flex-1 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-gray-500 p-10 min-h-[400px]">
                            <Scissors size={48} className="mb-4 opacity-50 text-[#c9a227]" />
                            <p className="font-['Montserrat'] font-medium text-lg text-white/50">Otimizador de Corte</p>
                            <p className="text-sm mt-2 text-center max-w-sm">Adicione medidas ou importe um código do WhatsApp para visualizar o plano de corte e o orçamento.</p>
                        </div>
                    ) : (
                        <>
                            {/* Dashboard de Preços */}
                            <div className="admin-entrance space-y-4">
                                <div className="bg-gradient-to-br from-[#111e33] to-[#0a1628] border border-blue-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold mb-1">Valor Total Cliente</p>
                                            <h2 className="text-3xl sm:text-4xl font-bold font-['Montserrat'] text-green-400 my-1">{formatBRL(finalPrice)}</h2>

                                            <div className="mt-1 flex gap-2">
                                                <span className="text-[10px] bg-blue-900/40 text-blue-300 px-2 py-1.5 rounded-lg border border-blue-500/20 font-medium">
                                                    Vlr Efetivo p/ Cliente: <b className="text-white">{formatBRL(valorPraticoM2)} / m²</b>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-[#c9a227]/10 p-3 rounded-xl border border-[#c9a227]/30 text-center">
                                                <p className="text-[9px] uppercase tracking-widest text-[#c9a227] mb-1 font-bold">Comprar</p>
                                                <p className="text-xl font-bold text-white">{m.toFixed(2)}<span className="text-[10px] ml-1 opacity-50 font-normal">m</span></p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                                                <p className="text-[9px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Eficiência</p>
                                                <p className={`text-xl font-bold ${eficiencia > 80 ? 'text-green-400' : eficiencia > 65 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                    {eficiencia}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-3">
                                            <p className="text-[10px] uppercase tracking-widest text-red-300 font-bold">Aplicar Desconto R$:</p>
                                            <input
                                                type="text"
                                                value={formatBRL(desconto)}
                                                onChange={handleDescontoChange}
                                                inputMode="numeric"
                                                onFocus={(e) => { const len = e.target.value.length; e.target.setSelectionRange(len, len); }}
                                                onClick={(e) => { const len = (e.target as HTMLInputElement).value.length; (e.target as HTMLInputElement).setSelectionRange(len, len); }}
                                                className="w-24 sm:w-28 bg-[#040811] text-red-400 border border-red-500/30 rounded-lg px-2 py-1.5 text-sm text-center font-bold focus:border-red-500 outline-none transition-colors"
                                            />
                                        </div>
                                        <button onClick={gerarImagem} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] hover:from-[#1e40af] hover:to-[#2563eb] px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors shadow-lg shadow-blue-900/20">
                                            <Camera size={14} /> Baixar PNG
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Canvas visual */}
                            <div className="admin-entrance bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden shadow-2xl flex-1 relative min-h-[500px]">
                                <div className="absolute top-0 left-0 w-full bg-[#1f2937] text-gray-400 text-[10px] uppercase font-bold flex justify-between px-3 py-1.5 z-10 border-b border-gray-700">
                                    <span>0cm</span>
                                    <span>Rolo: {rollW}cm</span>
                                </div>

                                <div className="w-full h-full overflow-y-auto p-4 pt-10">
                                    <div className="relative mx-auto bg-[#334155]/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]" style={{ width: '100%', maxWidth: '500px', height: `${(maxY / rollW) * Math.min(500, typeof window !== 'undefined' ? window.innerWidth - 60 : 500)}px` }}>
                                        {/* Grid de fundo */}
                                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                                        {blocosCalculados.map((b, i) => {
                                            if (!b.fit) return null;
                                            const scale = Math.min(500, window.innerWidth - 60) / rollW;
                                            return (
                                                <div
                                                    key={i}
                                                    className="absolute border border-black/50 flex flex-col items-center justify-center text-black font-bold shadow-inner"
                                                    style={{
                                                        left: b.fit.x * scale,
                                                        top: b.fit.y * scale,
                                                        width: (b.w - margin) * scale,
                                                        height: (b.h - margin) * scale,
                                                        background: b.cor,
                                                        fontSize: `${Math.max(5, 8 * scale)}px`
                                                    }}
                                                >
                                                    <span className="bg-white/80 px-1 rounded-sm leading-none drop-shadow-md">
                                                        {Math.round(b.rw)}x{Math.round(b.rh)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Template Off-screen para a imagem do comprovante */}
            <div className="fixed top-[-10000px] left-0 pointer-events-none bg-blue-50/50">
                <div ref={invoiceRef} className="w-[450px] bg-white text-slate-800 p-8 font-sans">
                    <div className="border-b-4 border-blue-600 pb-4 mb-6 text-center">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">LUME</h1>
                        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Orçamento de Instalação</h2>
                        <p className="text-xs text-slate-400 mt-2">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 pb-1 mb-2">Cliente / Serviço</h3>
                        <p className="text-lg font-bold text-slate-800">{cliente || 'Cliente LUME'}</p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 pb-1 mb-2">Resumo em Medidas</h3>
                        <div className="flex justify-between text-sm mb-1"><span>Quantidade:</span> <b>{vidros.length} peças</b></div>
                        <div className="flex justify-between text-sm"><span>Área Total de Corte:</span> <b>{(vidros.reduce((acc, v) => acc + (v.h * v.w), 0) / 10000).toFixed(2)} m²</b></div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200 pb-1 mb-2">Lista Detalhada</h3>
                        <div className="text-xs text-slate-600 space-y-1">
                            {resumo.map((r, i) => (
                                <div key={i} className="flex gap-2">
                                    <span className="font-bold text-slate-400 w-4 text-right">{r.q}x</span>
                                    <span>Vidro {r.h} x {r.w} cm</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 mt-6">
                        <div className="flex justify-between text-sm mb-2 text-slate-500">
                            <span>Subtotal:</span>
                            <span>{formatBRL(subtotalBruto)}</span>
                        </div>
                        {desconto > 0 && (
                            <div className="flex justify-between text-sm mb-3 text-red-500 font-medium">
                                <span>Desconto Especial:</span>
                                <span>- {formatBRL(desconto)}</span>
                            </div>
                        )}
                        <div className="border-t-2 border-slate-200 pt-3 mt-1 text-center">
                            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest block mb-1">Valor Final a Pagar</span>
                            <span className="text-4xl font-black text-emerald-600 block">{formatBRL(finalPrice)}</span>
                        </div>
                    </div>

                    <div className="text-center mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400">
                        <p>Este orçamento é uma estimativa baseada nas medidas fornecidas.</p>
                        <p className="font-bold mt-1 text-slate-500">LUME Películas - Soluções Premium</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
