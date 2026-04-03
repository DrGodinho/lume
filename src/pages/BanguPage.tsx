import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Sun, Thermometer, CheckCircle, ArrowRight, Eye, SunDim, Sparkles, Zap, MapPin, MousePointer2 } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function BanguPage() {
    useEffect(() => {
        // Smooth Scroll Animations for all sections
        const elements = gsap.utils.toArray('.page-entrance');
        elements.forEach((el: any) => {
            gsap.fromTo(el,
                { opacity: 0, y: 40 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 1, 
                    ease: 'power3.out', 
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        // Floating animation for some elements
        gsap.to('.floating', {
            y: -15,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }, []);

    return (
        <div className="bg-[#070f1a] text-white min-h-screen font-['Inter']">
            <Helmet>
                <title>Insulfilm em Bangu | Redução de Calor e Privacidade - LUME</title>
                <meta name="description" content="Instalação profissional de insulfilm em Bangu. Películas térmicas e de segurança com durabilidade de até 15 anos. Atendimento residencial e comercial na Zona Oeste." />
                
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "LUME Películas de Controle Solar",
                            "image": "https://lumecontrolesolar.netlify.app/novo-logo-lume.png",
                            "@id": "https://lumecontrolesolar.netlify.app/insulfilm-em-bangu",
                            "url": "https://lumecontrolesolar.netlify.app/insulfilm-em-bangu",
                            "telephone": "+5521965140612",
                            "priceRange": "$$$",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "estrada do realengo 973",
                                "addressLocality": "Rio de Janeiro",
                                "addressRegion": "RJ",
                                "postalCode": "21715-331",
                                "addressCountry": "BR"
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": -22.8767,
                                "longitude": -43.4651
                            },
                            "areaServed": ["Bangu", "Campo Grande", "Santa Cruz", "Realengo", "Padre Miguel", "Senador Camará", "Zona Oeste RJ"],
                            "description": "Instalação profissional de insulfilm em Bangu. Películas térmicas e de segurança com durabilidade de até 15 anos."
                        }
                    `}
                </script>
            </Helmet>

            <WhatsAppButton />

            {/* Hero Section - Redesigned for more impact */}
            <section className="relative pt-32 pb-24 lg:pt-52 lg:pb-40 overflow-hidden px-4">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-[#0a1628]" />
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#c9a227]/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                </div>

                <div className="container-lume relative z-10 page-entrance text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-8 animate-fade-in">
                            <MapPin size={14} className="text-[#c9a227]" />
                            <span className="text-[#c9a227] text-xs font-bold uppercase tracking-[0.2em]">Bangu & Zona Oeste RJ</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-8xl font-black font-['Montserrat'] mb-8 leading-[1.05] tracking-tight">
                            Controle o <span className="text-gradient-gold">Calor</span> Extremo.
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed font-light">
                            Instalação profissional de películas arquitetônicas em Bangu. Redução térmica real e privacidade total para sua casa ou empresa.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                            <a
                                href="https://wa.me/5521965140612?text=Olá! Quero um orçamento de insulfilm em Bangu."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary group relative overflow-hidden flex items-center justify-center gap-3 text-lg py-5 px-10 rounded-2xl shadow-[0_20px_50px_rgba(201,162,39,0.2)] transition-all hover:scale-[1.02]"
                            >
                                <span className="relative z-10 font-bold uppercase tracking-wider">Orçamento Grátis</span>
                                <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#c9a227] to-[#e5c158] opacity-100 group-hover:opacity-90 transition-opacity" />
                            </a>
                            <a
                                href="#processo"
                                className="flex items-center justify-center gap-3 text-base font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors py-5"
                            >
                                <MousePointer2 size={18} /> Ver como funciona
                            </a>
                        </div>
                    </div>

                    <div className="hidden lg:block relative">
                        <div className="floating w-full aspect-video bg-gradient-to-br from-[#111e33] to-[#070f1a] rounded-[2rem] border border-white/10 p-4 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                           <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                           <Sun size={120} className="text-[#c9a227]/20 absolute -top-10 -right-10 rotate-12" />
                           <div className="relative text-center p-8">
                               <Sparkles className="text-[#c9a227] mb-6 mx-auto" size={48} />
                               <h3 className="text-3xl font-bold font-['Montserrat'] mb-2">LUME Elite</h3>
                               <p className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold">Standard de Qualidade</p>
                           </div>
                        </div>
                        {/* Decorative cards */}
                        <div className="absolute -bottom-10 -left-10 glass-card p-6 rounded-2xl border border-white/10 shadow-2xl animate-bounce-slow">
                            <p className="text-[#c9a227] font-black text-2xl leading-none">80%</p>
                            <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mt-1">Reflexão Térmica</p>
                        </div>
                        <div className="absolute -top-6 -right-6 bg-green-500/20 backdrop-blur-md p-4 px-6 rounded-2xl border border-green-500/30 shadow-2xl">
                            <p className="text-green-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle size={14} /> Garantia 15 Anos
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats Grid */}
            <section className="bg-white/5 border-y border-white/10 py-12 relative z-20">
                <div className="container-lume px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-white/5 items-center">
                        {[
                            { icon: Thermometer, val: "80%", label: "Menos Calor" },
                            { icon: Sun, val: "99%", label: "Proteção UV" },
                            { icon: Shield, val: "10-15", label: "Anos Duração" },
                            { icon: Sparkles, val: "100%", label: "Procedência" },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center text-center px-4 transition-transform hover:scale-105">
                                <stat.icon size={20} className="text-[#c9a227] mb-3" />
                                <p className="text-2xl font-black text-white leading-none">{stat.val}</p>
                                <p className="text-[10px] uppercase text-gray-500 font-bold tracking-[0.2em] mt-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problem Section - More Elaborate */}
            <section className="py-24 relative overflow-hidden px-4">
                <div className="container-lume page-entrance">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="glass-card p-1 rounded-3xl border border-white/5 group">
                            <div className="bg-[#0a1628] rounded-[1.4rem] p-10 relative overflow-hidden transition-all group-hover:bg-[#0d1c33]">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Thermometer size={100} className="text-orange-500" />
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-8 leading-tight">
                                    O calor imbatível da <span className="text-orange-500">Zona Oeste</span>
                                </h2>
                                <p className="text-gray-400 mb-6 leading-relaxed text-lg font-light">
                                    Quem vive em Bangu sabe: o verão aqui não é brincadeira. Diferente da costa, o calor se acumula entre as montanhas, criando um efeito estufa que transforma lares em fornos.
                                </p>
                                <p className="text-gray-400 leading-relaxed text-lg font-light">
                                    A radiacão penetra nos vidros e aquece tudo: móveis, eletrônicos e, principalmente, você. Isso força o ar-condicionado ao limite, disparando sua conta de luz.
                                </p>
                                <div className="mt-10 flex items-center gap-4 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                                    <Zap className="text-orange-500 animate-pulse" size={24} />
                                    <p className="text-sm font-bold text-orange-200">Reduza em até 40% o gasto com energia elétrica.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-all duration-500">
                                <h3 className="text-xl font-bold flex items-center gap-3 mb-4 text-[#c9a227]">
                                    <Shield size={20} /> Solução Definitiva
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Nossas películas não apenas escurecem; elas atuam como escudos moleculares que refletem os raios infravermelhos antes de tocarem o ambiente interno.
                                </p>
                            </div>
                            <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-blue-400/40 transition-all duration-500">
                                <h3 className="text-xl font-bold flex items-center gap-3 mb-4 text-blue-400">
                                    <Eye size={20} /> Privacidade Com Total Visão
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Com o Carbono ou Espelhado, você tem a liberdade de olhar para o mundo exterior sem ser visto por quem passa na rua.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tipos de Insulfilm - Grid Elaborada */}
            <section id="tipos" className="py-24 bg-[#0a1628] border-y border-white/10 px-4 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#070f1a_100%)] opacity-30 pointer-events-none" />
                
                <div className="container-lume page-entrance relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-[#c9a227] font-black uppercase tracking-[0.5em] text-[10px]">Catálogo Premium</span>
                        <h2 className="text-4xl lg:text-5xl font-black font-['Montserrat'] mt-4 mb-6">A Película <span className="text-gradient-gold">Ideal</span></h2>
                        <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                            Selecione a tecnologia que melhor se adapta às suas necessidades de estética e controle solar.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                selo: "Elite", title: "Nano Cerâmica", icon: Sparkles,
                                desc: "Rejeita 79% do calor sem escurecer. Ideal para quem quer manter a transparência absoluta com máximo conforto."
                            },
                            {
                                selo: "Best-Seller", title: "Carbono G20/G5", icon: SunDim,
                                desc: "Visual Deep-Black premium. Rejeição térmica de 80% com privacidade garantida e zero desbotamento."
                            },
                            {
                                selo: "Privacidade", title: "Espelhado", icon: Eye,
                                desc: "Reflete até 85% do calor. Privacidade total durante o dia e visual moderno para fachadas comerciais."
                            },
                            {
                                selo: "Especial", title: "Segurança / Jateado", icon: Shield,
                                desc: "Ideal para divisórias, banheiros ou portas que exigem resistência contra quedas e privacidade decorativa."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="glass-card flex flex-col h-full rounded-[1.8rem] border border-white/5 hover:border-[#c9a227]/30 transition-all duration-500 overflow-hidden group">
                                <div className="p-8 pb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <item.icon size={24} className="text-[#c9a227]" />
                                    </div>
                                    <div className="text-[9px] font-black uppercase tracking-widest text-[#c9a227] mb-2">{item.selo}</div>
                                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#c9a227] transition-colors leading-tight">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                                        {item.desc}
                                    </p>
                                </div>
                                <div className="mt-auto border-t border-white/5 p-4 bg-white/[0.01]">
                                    <a href="https://wa.me/5521965140612" className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#c9a227] transition-colors">
                                        Consultar Valores <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contexto Local e Processo - Elaborate Layout */}
            <section id="processo" className="py-24 relative overflow-hidden px-4">
                <div className="container-lume page-entrance">
                    <div className="grid lg:grid-cols-12 gap-16">
                        {/* Box 1: Text context */}
                        <div className="lg:col-span-12 mb-8">
                             <div className="text-center">
                                <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-8"><span className="text-[#c9a227]">LUME</span> Zona Oeste</h2>
                                <p className="text-gray-400 text-lg lg:text-xl font-light leading-relaxed max-w-4xl mx-auto">
                                    Entendemos a topografia e a incidência solar específica de Bangu e vizinhanças. Realizamos aplicações técnicas que suportam o sol mais castigador do Rio de Janeiro.
                                </p>
                             </div>
                        </div>

                        {/* Middle section: Steps and map areas */}
                        <div className="lg:col-span-7 grid gap-6">
                            <div className="bg-[#111e33] rounded-3xl p-10 border border-white/10 relative overflow-hidden">
                                <h3 className="text-2xl font-bold mb-8 flex items-center gap-4">
                                    <Zap className="text-[#c9a227]" /> Como Trabalhamos
                                </h3>
                                <div className="space-y-10 relative">
                                    <div className="absolute left-[11px] top-[10px] bottom-[10px] w-0.5 bg-[#c9a227]/20" />
                                    {[
                                        { t: "Vistoria Técnica", d: "Vamos até seu endereço medir a radiação e as janelas." },
                                        { t: "Demonstração", d: "Você escolhe o tom e tecnologia direto no local." },
                                        { t: "Instalação", d: "Aplicação limpa, profissional e com acabamento de alto nível." },
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-8 relative">
                                            <div className="w-6 h-6 rounded-full bg-[#111e33] border-4 border-[#c9a227] z-10 shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-lg text-white mb-1 leading-none">{step.t}</h4>
                                                <p className="text-gray-500 text-sm mt-3">{step.d}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="glass-card p-10 rounded-3xl border border-white/5 h-full flex flex-col">
                                <h3 className="text-xl font-bold mb-6 text-[#c9a227] flex items-center gap-3">
                                    <MapPin size={22} /> Áreas Atendidas
                                </h3>
                                <div className="flex-grow">
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                        {["Bangu", "Realengo", "Padre Miguel", "Campo Grande", "Vila Militar", "Senador Camará", "Deodoro", "Sulacap"].map(city => (
                                            <div key={city} className="flex items-center gap-2 text-sm text-gray-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> {city}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-12 bg-white/[0.03] border border-white/5 p-6 rounded-2xl italic text-xs text-gray-500 text-center leading-relaxed">
                                    "Instalação residencial e comercial com atendimento exclusivo no conforto do seu endereço."
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Perguntas Frequentes (FAQ) - Refined */}
            <section className="py-24 bg-[#0a1628] border-t border-white/5 px-4 overflow-hidden relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[#c9a227]/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="container-lume page-entrance max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black font-['Montserrat'] mb-4 tracking-tight">Dúvidas Resolvidas</h2>
                        <p className="text-gray-500 font-medium">Tudo o que você precisa saber antes de transformar seus vidros.</p>
                    </div>

                    <div className="grid gap-4">
                        {[
                            {
                                q: "Quanto custa instalar insulfilm residencial em Bangu?",
                                a: "Varia pela metragem e tecnologia Escolha entre películas de custo-benefício ou Nano Cerâmica Elite. Orçamentos pelo WhatsApp são rápidos e sem custo."
                            },
                            {
                                q: "Quanto tempo dura o serviço realizado pela LUME?",
                                a: "Trabalhamos com marcas premium. Nossas películas arquitetônicas possuem durabilidade técnica de 10 a 15 anos com garantia certificada contra desbotamento."
                            },
                            {
                                q: "A película pode trincar o vidro no calor de Bangu?",
                                a: "Avaliamos o tipo de vidro (Comum x Temperado) antes. Utilizamos películas com controle de estresse térmico para garantir total segurança estrutural do seu imóvel."
                            },
                        ].map((faq, idx) => (
                            <details key={idx} className="group glass-card border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all hover:bg-white/[0.02]">
                                <summary className="font-bold text-lg p-7 outline-none flex justify-between items-center list-none pr-10">
                                    {faq.q}
                                    <span className="text-[#c9a227] group-open:rotate-180 transition-transform duration-300">
                                        <ArrowRight size={20} className="rotate-90" />
                                    </span>
                                </summary>
                                <div className="p-7 pt-0 text-gray-400 leading-relaxed border-t border-white/5 animate-fade-in text-sm">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Chamada para Ação (CTA Final) - Premium Redesign */}
            <section className="py-24 relative overflow-hidden px-4">
                <div className="container-lume relative z-10 page-entrance">
                    <div className="bg-[#c9a227] rounded-[2.5rem] p-12 lg:p-20 relative overflow-hidden shadow-[0_40px_100px_rgba(201,162,39,0.25)] text-center lg:text-left">
                        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-[linear-gradient(to_left,_rgba(255,255,255,0.1),_transparent)] pointer-events-none" />
                        <div className="absolute bottom-0 right-0 rotate-12 opacity-10">
                            <Sun size={240} className="text-black" />
                        </div>
                        
                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl lg:text-7xl font-black mb-8 text-black leading-[1] tracking-tight">Menos calor.<br/>Mais Estética.</h2>
                                <p className="text-xl text-black/70 max-w-lg mb-10 font-bold leading-relaxed">
                                    Agende uma visita técnica gratuita em sua casa ou comério em Bangu e comprove os benefícios térmicos imediatos.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5 items-center justify-center lg:justify-end">
                                <a
                                    href="https://wa.me/5521965140612?text=Olá! Gostaria de um orçamento de insulfilm em Bangu."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto bg-black text-white hover:bg-gray-900 px-10 py-5 rounded-2xl font-bold uppercase tracking-widest transition-all transform hover:scale-[1.03] active:scale-95 inline-flex items-center justify-center gap-4 shadow-2xl"
                                >
                                    Solicitar Visita <ArrowRight size={20} />
                                </a>
                                <div className="text-black/50 text-[10px] font-black uppercase tracking-widest hidden sm:block lg:hidden xl:block">Presença local em Bangu</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t border-white/5 text-center text-[9px] text-gray-600 font-black uppercase tracking-[0.4em] px-4">
                 © 2026 Lume Controle Solar · Insulfilm de Alto Padrão em Bangu · RJ
            </footer>
        </div>
    );
}
