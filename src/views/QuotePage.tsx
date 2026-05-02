'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Send,
    User,
    MapPin,
    Trash2,
    Star,
    Droplets,
    Eye,
    Sun,
    Thermometer,
    ShieldCheck,
    Calculator,
    HelpCircle
} from 'lucide-react';
import gsap from 'gsap';

interface GlassMeasure {
    h: number;
    w: number;
}

interface GroupedMeasure {
    h: number;
    w: number;
    q: number;
}

const filmOptions = [
    {
        name: 'NANO CERÂMICA',
        tag: 'TEC DE PONTA',
        icon: Star,
        color: '#c9a227',
        desc: 'Máxima proteção térmica e UV sem escurecer o ambiente. Ideal para varandas e vitrines.'
    },
    {
        name: 'DUPLA CAMADA',
        tag: 'FAVORITO',
        icon: Droplets,
        color: '#34d399',
        desc: 'Combina camada refletiva externa e fumê interna. Visão relaxante e alta redução de calor.'
    },
    {
        name: 'CARBONO PREMIUM',
        tag: 'PRIVACIDADE',
        icon: Eye,
        color: '#60a5fa',
        desc: 'Tom grafite profundo que não desbota. Elegância e privacidade total para sua residência.'
    },
    {
        name: 'REFLETIVA CLÁSSICA',
        tag: 'REJEIÇÃO SOLAR',
        icon: Sun,
        color: '#fbbf24',
        desc: 'Efeito espelhado para máxima rejeição de calor em fachadas com sol direto.'
    },
    {
        name: 'JATEADO',
        tag: 'DECORATIVO',
        icon: Thermometer,
        color: '#94a3b8',
        desc: 'Efeito fosco para privacidade total sem perder luz. Perfeito para banheiros e divisórias.'
    },
    {
        name: 'PRECISO DE AJUDA',
        tag: 'CONSULTORIA',
        icon: HelpCircle,
        color: '#ffffff',
        desc: 'Não tem certeza? Nossos especialistas avaliarão seu espaço para recomendar a melhor película.'
    }
];

export function QuotePage() {
    const [nome, setNome] = useState('');
    const [bairro, setBairro] = useState('');
    const [selectedFilm, setSelectedFilm] = useState('NANO CERÂMICA');
    const [vidros, setVidros] = useState<GlassMeasure[]>([]);

    // Input states
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');
    const [qty, setQty] = useState('1');

    useEffect(() => {
        gsap.fromTo('.page-entrance',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
    }, []);

    const addVidro = () => {
        const h = parseFloat(height);
        const w = parseFloat(width);
        const q = parseInt(qty) || 1;

        if (!h || !w || h <= 0 || w <= 0) {
            alert("Por favor, preencha altura e largura válidas!");
            return;
        }

        const newMeasures = Array(q).fill({ h, w });
        setVidros([...vidros, ...newMeasures]);

        // Reset inputs
        setHeight('');
        setWidth('');
        setQty('1');
    };

    const removeAll = (h: number, w: number) => {
        setVidros(current => current.filter(v => !(v.h === h && v.w === w)));
    };

    const getGroupedVidros = (): GroupedMeasure[] => {
        const map = new Map<string, GroupedMeasure>();
        vidros.forEach(v => {
            const key = `${v.h}x${v.w}`;
            if (map.has(key)) {
                map.get(key)!.q++;
            } else {
                map.set(key, { ...v, q: 1 });
            }
        });
        return Array.from(map.values());
    };

    const enviarZap = () => {
        if (!nome || !bairro) {
            alert("Por favor, preencha seu Nome e Bairro para continuarmos!");
            return;
        }
        if (vidros.length === 0) {
            alert("Por favor, inclua pelo menos uma medida de vidro!");
            return;
        }

        const codeData = { n: nome, b: bairro, f: selectedFilm, v: vidros };
        const code = btoa(JSON.stringify(codeData));

        let msg = `Olá! Me chamo *${nome}*, sou do bairro *${bairro}*.%0A%0A`;
        msg += `*Solicitação de Orçamento LUME*%0A`;
        msg += `*Material:* ${selectedFilm}%0A`;
        msg += `*Total de Vidros:* ${vidros.length}%0A%0A`;
        msg += `*CÓDIGO DE IMPORTAÇÃO:*%0A${code}`;

        const seuNumero = "5521965140612";
        const url = `https://wa.me/${seuNumero}?text=${msg}`;
        
        if (typeof (window as any).gtagSendEvent === 'function') {
            (window as any).gtagSendEvent(url);
        } else {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-[#04080f] text-white py-12 px-4 sm:px-6">
            <div className="max-w-xl mx-auto">

                {/* Header */}
                <header className="page-entrance text-center mb-10">
                    <a href="/" className="inline-block hover:opacity-80 transition-opacity group">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-montserrat">
                            LU<span className="text-gradient-gold">ME</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Voltar ao site</p>
                    </a>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#c9a227] mt-1">
                        Orçamento Online
                    </p>
                    <div className="h-1 w-20 bg-gradient-gold mx-auto mt-4 rounded-full" />
                </header>

                {/* Step 1: User Info */}
                <section className="page-entrance glass-card p-6 rounded-2xl border border-white/5 mb-6 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#c9a227]/20 flex items-center justify-center text-[#c9a227]">
                            <User size={20} />
                        </div>
                        <h2 className="text-xl font-bold font-montserrat">Seus Dados</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Como podemos te chamar?</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Seu nome completo"
                                className="w-full bg-[#04080f] border border-white/10 rounded-xl px-4 py-3.5 focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227] transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Qual o seu bairro / cidade?</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                    type="text"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                    placeholder="Ex: Bangu, Zona Oeste"
                                    className="w-full bg-[#04080f] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227] transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 2: Film Selection */}
                <section className="page-entrance glass-card p-6 rounded-2xl border border-white/5 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#c9a227]/20 flex items-center justify-center text-[#c9a227]">
                            <ShieldCheck size={20} />
                        </div>
                        <h2 className="text-xl font-bold font-montserrat">Escolha o Material</h2>
                    </div>

                    <div className="space-y-3">
                        {filmOptions.map((film) => (
                            <button
                                key={film.name}
                                onClick={() => setSelectedFilm(film.name)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${selectedFilm === film.name
                                    ? 'bg-[#c9a227]/10 border-[#c9a227] shadow-[0_0_20px_rgba(201,162,39,0.1)]'
                                    : 'bg-[#04080f] border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex gap-4">
                                        <div className={`mt-1 p-2 rounded-lg ${selectedFilm === film.name ? 'bg-[#c9a227] text-black' : 'bg-white/5 text-gray-400'}`}>
                                            <film.icon size={18} />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-sm sm:text-base ${selectedFilm === film.name ? 'text-[#c9a227]' : 'text-white'}`}>
                                                {film.name}
                                            </h3>
                                            <p className="text-[11px] sm:text-xs text-gray-400 mt-1 leading-relaxed">
                                                {film.desc}
                                            </p>
                                        </div>
                                    </div>
                                    {film.tag && (
                                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                                            {film.tag}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Step 3: Measures */}
                <section className="page-entrance glass-card p-6 rounded-2xl border border-white/5 mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#c9a227]/20 flex items-center justify-center text-[#c9a227]">
                            <Calculator size={20} />
                        </div>
                        <h2 className="text-xl font-bold font-montserrat">Medidas dos Vidros</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        <div className="col-span-1">
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Altura (cm)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="0"
                                className="w-full bg-[#04080f] border border-white/10 rounded-xl px-4 py-3 focus:border-[#c9a227] transition-all outline-none"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Largura (cm)</label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                placeholder="0"
                                className="w-full bg-[#04080f] border border-white/10 rounded-xl px-4 py-3 focus:border-[#c9a227] transition-all outline-none"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Quantidade</label>
                            <input
                                type="number"
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                                placeholder="1"
                                className="w-full bg-[#04080f] border border-white/10 rounded-xl px-4 py-3 focus:border-[#c9a227] transition-all outline-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={addVidro}
                        className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-gray-400 hover:border-[#c9a227] hover:text-[#c9a227] hover:bg-[#c9a227]/5 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                        <Plus size={18} />
                        INCLUIR ESTA MEDIDA
                    </button>

                    {/* List of Added Measures */}
                    <div className="mt-8 space-y-2">
                        {getGroupedVidros().map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group hover:border-white/20 transition-all">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-[#c9a227] text-black text-xs font-bold flex items-center justify-center">
                                        {item.q}x
                                    </span>
                                    <div>
                                        <span className="text-sm font-medium">Vidro {item.h}x{item.w} cm</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeAll(item.h, item.w)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <div className="page-entrance sticky bottom-6 z-40">
                    <button
                        onClick={enviarZap}
                        className="w-full btn-primary py-5 rounded-2xl shadow-[0_10px_40px_rgba(201,162,39,0.2)] flex items-center justify-center gap-3 text-lg group active:scale-95 transition-transform"
                    >
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        ENVIAR PELO WHATSAPP
                    </button>

                    <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-[0.2em]">
                        © 2026 LUME Películas • Sistema de Orçamento Seguro
                    </p>
                </div>

            </div>

            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#c9a227]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1a3a5c]/20 rounded-full blur-[120px]" />
            </div>
        </div>
    );
}
