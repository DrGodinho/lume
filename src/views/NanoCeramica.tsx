'use client';

import { useEffect } from 'react';
import { Shield, Sun, Thermometer, CheckCircle, Zap, Wifi, ArrowRight, Sparkles, Check } from 'lucide-react';
import { ContactCTA } from '../sections/ContactCTA';
import { SpecTooltip } from '../components/SpecTooltip';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { ScrollReveal } from '../components/ScrollReveal';
import { HeroEntrance } from '../components/HeroEntrance';
import { Particles } from '../components/Particles';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

const NANO_MODELS = [
    {
        id: 'nano-g5',
        name: 'Nano Cerâmica G5',
        tagline: 'Máxima privacidade e controle de ofuscamento',
        badge: 'Alta Privacidade',
        vlt: '5%',
        vltDesc: 'Escurecimento intenso',
        irr: '92%',
        uvr: '99,9%',
        tser: '70%',
        idealFor: 'Quartos, home theaters, salas de reunião e ambientes com incidência solar extrema que demandam privacidade total.',
        price: '180',
        whatsappMessage: 'Olá! Gostaria de um orçamento para a película Nano Cerâmica G5 (a partir de R$ 180/m²).',
    },
    {
        id: 'nano-g20',
        name: 'Nano Cerâmica G20',
        tagline: 'Equilíbrio térmico com privacidade moderada',
        badge: 'Conforto & Discrição',
        vlt: '20%',
        vltDesc: 'Fumê intermediário',
        irr: '92%',
        uvr: '99,9%',
        tser: '65%',
        idealFor: 'Salas de estar, escritórios e janelas expostas ao sol da tarde. Reduz o calor mantendo a visão externa agradável.',
        price: '180',
        whatsappMessage: 'Olá! Gostaria de um orçamento para a película Nano Cerâmica G20 (a partir de R$ 180/m²).',
    },
    {
        id: 'nano-70',
        name: 'Nano Cerâmica 70%',
        tagline: 'Alta rejeição térmica com transparência cristalina',
        badge: 'Mais Procurada',
        isPopular: true,
        vlt: '70%',
        vltDesc: 'Transparência total',
        irr: 'Até 95%',
        uvr: '99,9%',
        tser: '58%',
        idealFor: 'Varandas gourmet, cortinas de vidro, sacadas e condomínios com proibição rigorosa de alteração estética de fachada.',
        price: '200',
        whatsappMessage: 'Olá! Gostaria de um orçamento para a película Nano Cerâmica 70% (a partir de R$ 200/m²).',
    },
    {
        id: 'window-blue-75',
        name: 'Window Blue 75%',
        tagline: 'A tecnologia mais avançada do mercado mundial',
        badge: 'Ultra Premium',
        isPremium: true,
        vlt: '75%',
        vltDesc: 'Claridade superior',
        irr: 'Até 98%',
        uvr: '99,9%',
        tser: '65%',
        idealFor: 'O ápice absoluto em controle solar e nitidez óptica cristalina com a prestigiada tecnologia Window Blue.',
        price: '260',
        whatsappMessage: 'Olá! Gostaria de um orçamento para a película Nano Cerâmica Window Blue 75% (a partir de R$ 260/m²).',
    },
];

export function NanoCeramicaPage() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        const ctx = gsap.context(() => {
            // Performance Table Animation
            const perfRows = gsap.utils.toArray('.perf-row') as Element[];
            if (perfRows.length > 0) {
                gsap.fromTo(perfRows,
                    { opacity: 0, x: -20 },
                    {
                        opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out',
                        scrollTrigger: {
                            trigger: perfRows[0] as Element,
                            start: 'top 85%',
                        }
                    }
                );

                perfRows.forEach((row) => {
                    const bar = row.querySelector('.perf-bar-fill');
                    if (bar) {
                        const targetWidth = bar.getAttribute('data-width') ?? undefined;
                        gsap.fromTo(bar,
                            { width: '0%' },
                            {
                                width: targetWidth,
                                duration: 1.5,
                                ease: 'power3.out',
                                delay: 0.2,
                                scrollTrigger: {
                                    trigger: row,
                                    start: 'top 85%',
                                }
                            }
                        );
                    }
                });
            }
        });

        return () => ctx.revert();
    }, []);

    return (
                <div className="bg-[#04080f] text-white min-h-screen">

            {/* WhatsApp Floating Button */}

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
                <div className="absolute inset-0 z-0">
                    <Image src="/nano-ceramica-hero.webp" alt="Varanda gourmet com Insulfilm Nano Cerâmica Premium LUME - Rio de Janeiro" fill sizes="100vw" priority className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                </div>

                {/* Particles */}
                <Particles />

                {/* Floating gold accent */}
                <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#c9a227]/5 blur-3xl animate-float pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#c9a227]/10 blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

                <div className="container-lume relative z-10 text-center md:text-left">
                    <NavigationBreadcrumbs 
                        showVisualTrail={false}
                        items={[
                            { label: 'Início', href: '/' },
                            { label: 'Nano Cerâmica' }
                        ]}
                    />
                    <HeroEntrance className="max-w-3xl mx-auto md:mx-0">
                        <div className="animate-hero opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6">
                            <span className="text-[#c9a227] text-sm font-bold uppercase tracking-wider">A Escolha de Luxo no RJ</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-montserrat mb-6 leading-tight">
                            <span className="word opacity-0 inline-block">Insulfilm</span>{' '}
                            <span className="word opacity-0 inline-block text-gradient-gold">Nano</span>{' '}
                            <span className="word opacity-0 inline-block text-gradient-gold">Cerâmica</span>{' '}
                            <span className="word opacity-0 inline-block">Premium</span>
                        </h1>

                        <p className="animate-hero opacity-0 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-8 leading-relaxed">
                            A evolução do controle solar no Rio de Janeiro. Reduza drasticamente o calor com tecnologia de ponta em versões G5, G20, 70% e Window Blue 75% — a partir de R$ 180/m² instalado.
                        </p>

                        <div className="animate-hero opacity-0 flex flex-col sm:flex-row items-center gap-4">
                            <a
                                href="https://wa.me/5521965140612?text=Olá! Quero um orçamento para Insulfilm Nano Cerâmica no meu imóvel."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8 w-full sm:w-auto"
                            >
                                Solicitar Orçamento Grátis <ArrowRight size={20} />
                            </a>
                            <span className="text-xs sm:text-sm text-gray-400 font-medium text-center sm:text-left">
                                A partir de <strong className="text-[#c9a227]">R$ 180/m²</strong> • Até 10 Anos de Garantia
                            </span>
                        </div>
                    </HeroEntrance>
                </div>

                {/* Decorative bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#04080f] to-transparent z-10 pointer-events-none" />
            </section>

            {/* Introduction & SEO Hook */}
            <section className="py-20 bg-[#070f1a] border-b border-white/5">
                <div className="container-lume">
                    <ScrollReveal animation="slide-up" className="max-w-4xl mx-auto text-center">
                        <div className="animate-item flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
                                Conforto Térmico
                            </span>
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
                        </div>
                        <h2 className="animate-item text-3xl font-bold font-montserrat mb-8 text-white">Por que a Nano Cerâmica é a melhor escolha para o Rio de Janeiro?</h2>
                        <p className="animate-item text-gray-400 leading-relaxed mb-6 text-lg">
                            Morar no Rio de Janeiro, especialmente em bairros como <strong>Bangu, Campo Grande, Barra e Recreio</strong>, significa enfrentar temperaturas extremas em grande parte do ano. O insulfilm residencial comum não é mais suficiente. Se você tem uma varanda gourmet, uma sala com amplos vidros ou uma fachada moderna, encontrar uma película que neutralize o calor sem transformar sua casa em uma "caverna escura" sempre foi um desafio.
                        </p>
                        <p className="animate-item text-gray-400 leading-relaxed text-lg">
                            É aqui que a tecnologia da nossa <strong>Película Nano Cerâmica Premium</strong> brilha. Através da nanotecnologia, esta película atua diretamente nos raios infravermelhos (os reais causadores do abafamento), criando um escudo invisível de extremo conforto térmico e bloqueio UV, enquanto mantém 100% da identidade arquitetônica do seu ambiente livre de distorções.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Diferenciais Técnicos */}
            <section className="py-20 relative px-4">
                <div className="container-lume">
                    <ScrollReveal animation="slide-up" className="text-center mb-16">
                        <div className="animate-item flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
                                Diferenciais
                            </span>
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
                        </div>
                        <h2 className="animate-item text-3xl lg:text-4xl font-bold font-montserrat mb-4 text-[#c9a227]">Diferenciais Tecnológicos</h2>
                        <p className="animate-item text-gray-400 max-w-2xl mx-auto">Muito além de um filme escurecedor. Proteção avançada e durabilidade incomparável para seu lar.</p>
                    </ScrollReveal>

                    <ScrollReveal animation="slide-up" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Wifi, title: "Tecnologia Não-Metálica", desc: "Diferente das películas refletivas, a cerâmica não contém metais em sua liga. Isso garante ZERO interferência nos sinais de Wi-Fi, 5G ou GPS da sua residência." },
                            { icon: Shield, title: "Estabilidade de Cor Permanente", desc: "Avançada proteção contra desbotamento. Sem chances da sua película ficar roxa ou descascar com a alta exposição agressiva do sol carioca." },
                            { icon: Sun, title: "Alta Claridade Natural", desc: "Alta rejeição dos raios infravermelhos (IR) mantendo a mais alta entrada de luz (VLT). Proteja-se do calor invisivelmente." },
                        ].map((feature, idx) => (
                            <div key={idx} className="animate-item glass-card p-8 rounded-2xl border border-white/5 hover:border-[#c9a227]/30 transition-all duration-300 hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </ScrollReveal>
                </div>
            </section>

            {/* Tabela Comparativa de Modelos Nano Cerâmica */}
            <section className="py-20 relative px-4 bg-gradient-to-b from-[#04080f] via-[#070f1a] to-[#04080f] border-b border-white/5">
                <div className="container-lume">
                    <ScrollReveal animation="slide-up" className="text-center mb-14">
                        <div className="animate-item flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
                                Catálogo Completo
                            </span>
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
                        </div>
                        <h2 className="animate-item text-3xl md:text-4xl lg:text-5xl font-bold font-montserrat mb-4 text-white">
                            Tabela Comparativa de <span className="text-gradient-gold">Nano Cerâmica</span>
                        </h2>
                        <p className="animate-item text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
                            Escolha a tonalidade perfeita para seu projeto: desde a privacidade do G5 até a transparência cristalina do Window Blue 75%.
                        </p>
                    </ScrollReveal>

                    {/* Versão Desktop: Tabela de Alta Elegância */}
                    <ScrollReveal animation="slide-up" className="hidden lg:block">
                        <div className="glass-card rounded-3xl border border-[#c9a227]/30 overflow-hidden shadow-2xl relative">
                            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c9a227]/10 rounded-full blur-[120px] pointer-events-none" />
                            
                            <table className="w-full text-left border-collapse relative z-10">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.03]">
                                        <th className="py-5 px-6 font-montserrat text-xs uppercase tracking-wider text-gray-300 font-bold">Modelo & Linha</th>
                                        <th className="py-5 px-4 font-montserrat text-xs uppercase tracking-wider text-gray-300 font-bold text-center">
                                            <SpecTooltip term="VLT">VLT (Luz)</SpecTooltip>
                                        </th>
                                        <th className="py-5 px-4 font-montserrat text-xs uppercase tracking-wider text-gray-300 font-bold text-center">
                                            <SpecTooltip term="IRR">Rejeição IR</SpecTooltip>
                                        </th>
                                        <th className="py-5 px-4 font-montserrat text-xs uppercase tracking-wider text-gray-300 font-bold text-center">
                                            <SpecTooltip term="UVR">Bloqueio UV</SpecTooltip>
                                        </th>
                                        <th className="py-5 px-4 font-montserrat text-xs uppercase tracking-wider text-gray-300 font-bold text-center">
                                            <SpecTooltip term="TSER">TSER</SpecTooltip>
                                        </th>
                                        <th className="py-5 px-6 font-montserrat text-xs uppercase tracking-wider text-gray-300 font-bold">Indicação Ideal</th>
                                        <th className="py-5 px-6 font-montserrat text-xs uppercase tracking-wider text-gray-300 font-bold text-right">Valor m²</th>
                                        <th className="py-5 px-6 font-montserrat text-xs uppercase tracking-wider text-gray-300 font-bold text-center">Orçamento</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {NANO_MODELS.map((model) => (
                                        <tr
                                            key={model.id}
                                            className={`transition-colors duration-200 group ${
                                                model.isPremium
                                                    ? 'bg-[#c9a227]/[0.05] hover:bg-[#c9a227]/[0.09]'
                                                    : model.isPopular
                                                    ? 'bg-white/[0.02] hover:bg-white/[0.05]'
                                                    : 'hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            {/* Nome & Badge */}
                                            <td className="py-5 px-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-montserrat font-bold text-white text-base group-hover:text-[#c9a227] transition-colors">
                                                            {model.name}
                                                        </span>
                                                        {model.isPremium ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#c9a227]/20 text-[#e5c358] border border-[#c9a227]/40 shadow-sm">
                                                                <Sparkles size={11} /> {model.badge}
                                                            </span>
                                                        ) : model.isPopular ? (
                                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/30">
                                                                {model.badge}
                                                            </span>
                                                        ) : (
                                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 text-gray-400 border border-white/10">
                                                                {model.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-400">{model.tagline}</span>
                                                </div>
                                            </td>

                                            {/* VLT */}
                                            <td className="py-5 px-4 text-center">
                                                <span className="inline-block font-montserrat font-bold text-white text-base">
                                                    {model.vlt}
                                                </span>
                                                <span className="block text-[11px] text-gray-400 font-light">{model.vltDesc.split(' ')[0]}</span>
                                            </td>

                                            {/* IRR */}
                                            <td className="py-5 px-4 text-center">
                                                <span className="font-montserrat font-bold text-[#c9a227] text-base">
                                                    {model.irr}
                                                </span>
                                            </td>

                                            {/* UVR */}
                                            <td className="py-5 px-4 text-center">
                                                <span className="font-montserrat font-semibold text-gray-200 text-sm">
                                                    {model.uvr}
                                                </span>
                                            </td>

                                            {/* TSER */}
                                            <td className="py-5 px-4 text-center">
                                                <span className="font-montserrat font-semibold text-gray-200 text-sm">
                                                    {model.tser}
                                                </span>
                                            </td>

                                            {/* Indicação */}
                                            <td className="py-5 px-6 max-w-xs">
                                                <p className="text-xs text-gray-300 leading-relaxed">
                                                    {model.idealFor}
                                                </p>
                                            </td>

                                            {/* Preço */}
                                            <td className="py-5 px-6 text-right whitespace-nowrap">
                                                <span className="block text-[11px] text-gray-400">A partir de</span>
                                                <span className="font-montserrat font-bold text-xl text-[#c9a227]">
                                                    R$ {model.price}
                                                </span>
                                                <span className="text-xs text-gray-400">/m²</span>
                                            </td>

                                            {/* Ação */}
                                            <td className="py-5 px-6 text-center whitespace-nowrap">
                                                <a
                                                    href={`https://wa.me/5521965140612?text=${encodeURIComponent(model.whatsappMessage)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                                        model.isPremium || model.isPopular
                                                            ? 'btn-primary shadow-lg shadow-[#c9a227]/20 hover:scale-105'
                                                            : 'bg-white/10 hover:bg-[#c9a227] hover:text-[#04080f] text-white border border-white/10 hover:border-[#c9a227]'
                                                    }`}
                                                >
                                                    Pedir Orçamento <ArrowRight size={14} />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Rodapé da Tabela */}
                            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400 px-6">
                                <span className="flex items-center gap-2">
                                    <Check className="text-[#c9a227]" size={14} /> Valores válidos para película fornecida e instalada
                                </span>
                                <span className="flex items-center gap-2">
                                    <Check className="text-[#c9a227]" size={14} /> Até 10 Anos de Garantia com certificado
                                </span>
                                <span className="flex items-center gap-2">
                                    <Check className="text-[#c9a227]" size={14} /> Visita técnica e medição sem custo no Rio de Janeiro
                                </span>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Versão Mobile / Tablet: Cards Elegantes */}
                    <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                        {NANO_MODELS.map((model) => (
                            <div
                                key={model.id}
                                className={`rounded-2xl p-6 border transition-all duration-300 relative flex flex-col justify-between ${
                                    model.isPremium
                                        ? 'bg-gradient-to-b from-[#0f1f33] to-[#070f1a] border-[#c9a227]/50 shadow-xl shadow-[#c9a227]/10'
                                        : model.isPopular
                                        ? 'bg-gradient-to-b from-[#0a1524] to-[#070f1a] border-[#c9a227]/30'
                                        : 'glass-card border-white/10'
                                }`}
                            >
                                <div>
                                    {/* Top Badge & Preço */}
                                    <div className="flex items-start justify-between gap-2 mb-4">
                                        {model.isPremium ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#c9a227]/20 text-[#e5c358] border border-[#c9a227]/40">
                                                <Sparkles size={12} /> {model.badge}
                                            </span>
                                        ) : model.isPopular ? (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/30">
                                                {model.badge}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
                                                {model.badge}
                                            </span>
                                        )}
                                        <div className="text-right">
                                            <span className="text-[10px] text-gray-400 block uppercase tracking-wider">A partir de</span>
                                            <span className="text-2xl font-bold font-montserrat text-[#c9a227]">
                                                R$ {model.price}
                                            </span>
                                            <span className="text-xs text-gray-400">/m²</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold font-montserrat text-white mb-1">{model.name}</h3>
                                    <p className="text-xs text-gray-400 mb-5">{model.tagline}</p>

                                    {/* Grid de Métricas Técnicas */}
                                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-black/30 border border-white/5 mb-5">
                                        <div>
                                            <span className="text-[11px] text-gray-400 block">VLT (Transmissão)</span>
                                            <span className="font-bold text-white text-sm">{model.vlt}</span>
                                        </div>
                                        <div>
                                            <span className="text-[11px] text-gray-400 block">Rejeição IR</span>
                                            <span className="font-bold text-[#c9a227] text-sm">{model.irr}</span>
                                        </div>
                                        <div>
                                            <span className="text-[11px] text-gray-400 block">Bloqueio UV</span>
                                            <span className="font-semibold text-gray-200 text-sm">{model.uvr}</span>
                                        </div>
                                        <div>
                                            <span className="text-[11px] text-gray-400 block">TSER (Total)</span>
                                            <span className="font-semibold text-gray-200 text-sm">{model.tser}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-300 leading-relaxed mb-6">
                                        <strong className="text-white">Aplicação ideal:</strong> {model.idealFor}
                                    </p>
                                </div>

                                <a
                                    href={`https://wa.me/5521965140612?text=${encodeURIComponent(model.whatsappMessage)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full btn-primary py-3 px-4 text-center justify-center inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
                                >
                                    Pedir Orçamento WhatsApp <ArrowRight size={16} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Composição Detalhada & Tabela de Performance */}
            <section className="py-20 bg-[#070f1a]">
                <div className="container-lume">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        <ScrollReveal animation="slide-up">
                            <div className="relative pl-4 sm:pl-6 border-l-2 border-[#c9a227] mb-6">
                                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">Composição</span>
                                <h2 className="text-3xl lg:text-4xl font-bold font-montserrat mt-2">A Engenharia por trás da Nano Cerâmica</h2>
                            </div>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Como uma película tão fina e transparente pode barrar tanto calor? O segredo estrutural multicamada da nossa película de mais alta performance garante essa mágica térmica.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { title: "Nanopartículas de Cerâmica", desc: "Nitreto de titânio puro e óxidos cerâmicos injetados a nível molecular. Camada vital que filtra e rebate o infravermelho pesado." },
                                    { title: "Deposição Magnetrônica", desc: "O material não é tinto, mas sim depositado fisicamente. Garantia de uniformidade ótica sem embaçamentos." },
                                    { title: "Adesão Poliéster Premium", desc: "Material óptico de alta definição que gruda ao vidro sem rugas, assegurando extrema segurança em caso de estilhaçamento." },
                                    { title: "Revestimento Anti-Risco", desc: "Finalização acrílica de máxima durabilidade que protege o filme na rotina diária de limpeza em sua casa." },
                                ].map((item, idx) => (
                                    <div key={idx} className="animate-item flex gap-4">
                                        <div className="mt-1"><CheckCircle className="text-[#c9a227]" size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>

                        <ScrollReveal animation="slide-up">
                            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-[#c9a227]/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a227] blur-[100px] opacity-20" />

                                <h3 className="text-2xl font-bold font-montserrat text-white mb-2 border-b border-white/10 pb-4">Painel de Performance da Tecnologia</h3>
                                <div className="mb-8 text-[#c9a227] font-bold text-xl uppercase tracking-wider">Nano Cerâmica a partir de R$ 180/m² instalado</div>

                                <div className="space-y-6">
                                    <div className="perf-row opacity-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-300 font-medium flex items-center gap-2">
                                                <Sun size={18} className="text-[#c9a227]" />
                                                <SpecTooltip term="VLT">VLT (Transmissão de Luz)</SpecTooltip>
                                            </span>
                                            <span className="font-bold text-white text-lg">
                                                5% a <AnimatedCounter target="75" suffix="%" />
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div className="perf-bar-fill bg-[#c9a227] h-2 rounded-full" data-width="75%" style={{ width: '0%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Desde a privacidade alta (G5) até a visão 100% cristalina (Window Blue 75%).</p>
                                    </div>

                                    <div className="perf-row opacity-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-300 font-medium flex items-center gap-2">
                                                <Shield size={18} className="text-[#c9a227]" />
                                                <SpecTooltip term="UVR">Bloqueio UV (UltraVioleta)</SpecTooltip>
                                            </span>
                                            <span className="font-bold text-white text-lg">
                                                <AnimatedCounter target="99" suffix=",9%" />
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div className="perf-bar-fill bg-[#c9a227] h-2 rounded-full" data-width="99.9%" style={{ width: '0%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Proteção total p/ móveis, pisos de madeira e tecidos.</p>
                                    </div>

                                    <div className="perf-row opacity-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-300 font-medium flex items-center gap-2">
                                                <Thermometer size={18} className="text-[#c9a227]" />
                                                <SpecTooltip term="IRR">Rejeição de Calor (IRR)</SpecTooltip>
                                            </span>
                                            <span className="font-bold text-white text-lg">
                                                Até <AnimatedCounter target="98" suffix="%" />
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div className="perf-bar-fill bg-[#c9a227] h-2 rounded-full" data-width="98%" style={{ width: '0%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">O verdadeiro choque térmico que você sente na pele e no ambiente.</p>
                                    </div>

                                    <div className="perf-row opacity-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-300 font-medium flex items-center gap-2">
                                                <Zap size={18} className="text-[#c9a227]" />
                                                <SpecTooltip term="TSER">TSER (Energia Rejeitada)</SpecTooltip>
                                            </span>
                                            <span className="font-bold text-white text-lg">
                                                Até <AnimatedCounter target="70" suffix="%" />
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div className="perf-bar-fill bg-[#c9a227] h-2 rounded-full" data-width="70%" style={{ width: '0%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Medida global do total de energia solar barrada pela janela.</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 relative px-4">
                <div className="container-lume max-w-4xl mx-auto">
                    <ScrollReveal animation="slide-up" className="text-center mb-12">
                        <div className="animate-item flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
                                FAQ
                            </span>
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
                        </div>
                        <h2 className="animate-item text-3xl font-bold font-montserrat mb-4">Dúvidas Frequentes (FAQ)</h2>
                        <p className="animate-item text-gray-400">Respostas rápidas sobre a Instalação da Nano Cerâmica</p>
                    </ScrollReveal>

                    <ScrollReveal animation="slide-up" className="space-y-4">
                        {[
                            {
                                q: "Qual a diferença entre a Nano Cerâmica G5, G20, 70% e Window Blue 75%?",
                                a: "A diferença está na transmissão luminosa e na tecnologia óptica: as versões Nano Cerâmica G5 (5%) e G20 (20%) unem a alta rejeição de calor com privacidade e controle do ofuscamento solar, a partir de R$ 180/m². A Nano Cerâmica 70% é a escolha consagrada para varandas e fachadas, mantendo a luminosidade natural e alta filtragem térmica, a partir de R$ 200/m². Já a Window Blue 75% é o patamar máximo de tecnologia mundial, combinando altíssima rejeição térmica de até 98% no infravermelho com nitidez e visibilidade 100% cristalina, a partir de R$ 260/m²."
                            },
                            {
                                q: "O Insulfilm Nano Cerâmica pode ser instalado em apartamentos e condomínios?",
                                a: "Sim! Como a película de Nano Cerâmica possui baixíssima refletividade (não é espelhada) e mantém a transparência do vidro, ela é a opção número um para apartamentos e condomínios com regras rígidas de fachada no Rio de Janeiro."
                            },
                            {
                                q: "A película Nano Cerâmica desbota com o forte calor do Rio de Janeiro?",
                                a: "Não. Diferente das películas tintadas comuns que ficam roxas com o tempo ou criam bolhas horríveis, a Nano Cerâmica Premium da LUME possui estabilidade de cor permanente. Sua tecnologia inorgânica não baseada em tintas corantes garante a exata mesma estética por muitos anos seguidos."
                            },
                            {
                                q: "É possível economizar luz na conta usando película térmica?",
                                a: "Absolutamente. Com uma altíssima rejeição de calor por infravermelho, o ambiente interno da sua residência ou empresa esfria muito mais rápido mantendo a climatização estável, reduzindo drasticamente o esforço e o tempo de ativação do compressor do seu ar-condicionado. Em todo o Rio de Janeiro, com o calor intenso e forte insolação, nossos clientes relatam incríveis economias e maior conforto."
                            }
                        ].map((faq, idx) => (
                            <details key={idx} className="animate-item group glass-card border flex-col rounded-xl overflow-hidden cursor-pointer">
                                <summary className="font-bold text-lg p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors outline-none flex justify-between items-center list-none">
                                    {faq.q}
                                    <span className="text-[#c9a227] group-open:rotate-45 transition-transform text-2xl font-light leading-none">+</span>
                                </summary>
                                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </ScrollReveal>
                </div>
            </section>

            {/* Contact CTA Section */}
            <ContactCTA />
        </div>
    );
}
