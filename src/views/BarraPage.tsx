'use client';

import { useEffect } from 'react';
import { Shield, Sun, Thermometer, CheckCircle, ArrowRight, Eye, SunDim, Star, PiggyBank, Lock, MapPin, Zap, MessageCircle, Droplets } from 'lucide-react';
import { GoogleReviews } from '../components/GoogleReviews';
import { Particles } from '../components/Particles';
import { AnimatedCounter } from '../components/AnimatedCounter';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export function BarraPage() {
    useEffect(() => {
        // Smooth Scroll Animations for all sections
        const elements = gsap.utils.toArray('.page-entrance');
        elements.forEach((el: any) => {
            gsap.fromTo(el,
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    ease: 'power3.out', 
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
        
        // Benefits Cards animation (like landing page)
        const cards = document.querySelectorAll('.benefit-card');
        if (cards.length > 0) {
            gsap.fromTo(
                cards,
                { opacity: 0, scale: 0.8, rotate: -10 },
                {
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'elastic.out(1, 0.5)',
                    scrollTrigger: {
                        trigger: '#vantagens',
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }

        // Product Cards animation (like landing page)
        const productCards = document.querySelectorAll('.product-card');
        if (productCards.length > 0) {
            gsap.fromTo(
                productCards,
                { opacity: 0, rotateY: -30, x: -50 },
                {
                    opacity: 1,
                    rotateY: 0,
                    x: 0,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: '#tipos',
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }
    }, []);

    return (
        <div className="bg-[#04080f] text-white min-h-screen">


            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/barra_hero_bg.webp" 
                        alt="Instalação de insulfilm profissional na Barra da Tijuca - LUME Controle Solar" 
                        fill 
                        sizes="(max-width: 768px) 100vw, 100vw" 
                        priority 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#04080f]/95 via-[#04080f]/80 to-[#04080f]/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-transparent to-[#04080f]/50" />
                </div>

                {/* Particles & Effects */}
                <Particles />
                
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04080f] to-transparent z-10" />
                <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#c9a227]/5 blur-3xl animate-float z-10 pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#1a3a5c]/30 blur-3xl animate-float z-10 pointer-events-none" style={{ animationDelay: '2s' }} />

                <div className="container-lume relative z-20 page-entrance text-center md:text-left pt-24 pb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse flex-shrink-0" />
                        <span className="text-[#c9a227] text-sm font-bold uppercase tracking-wider">Barra da Tijuca e Região</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-montserrat mb-6 leading-tight">
                        Insulfilm na <span className="text-gradient-gold">Barra</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed font-light">
                        Eleve o padrão de conforto térmico do seu imóvel na Barra da Tijuca. Películas de alta tecnologia para residências de luxo e ambientes corporativos modernos.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="https://wa.me/5521965140612?text=Olá! Quero um orçamento de insulfilm na Barra da Tijuca."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8 transform transition hover:scale-105"
                        >
                            Solicitar Orçamento <ArrowRight size={20} />
                        </a>
                        <a
                            href="#tipos"
                            className="btn-outline inline-flex items-center justify-center gap-3 text-lg py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-widest text-sm"
                        >
                            Ver Películas Elite
                        </a>
                    </div>
                </div>
            </section>

            {/* Auto-Scroll Info Strip */}
            <section className="bg-[#c9a227] py-6 overflow-hidden relative z-20">
                <div className="container-lume">
                    <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-6 lg:gap-4 text-black font-extrabold uppercase tracking-widest text-xs lg:text-sm text-center">
                        <span className="flex items-center gap-2"><Thermometer size={18} /> Até 80% de redução térmica</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><Sun size={18} /> 99% bloqueio de raios UV</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><Shield size={18} /> Proteção Solar de Elite</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><CheckCircle size={18} /> Garantia Platinum de 5 anos</span>
                    </div>
                </div>
            </section>

            {/* Contexto Local Barra */}
            <section className="py-24 bg-[#04080f] relative px-4">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold font-montserrat mb-10 text-white">Tecnologia de ponta para a arquitetura da Barra</h2>
                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light text-left md:text-justify px-4">
                            <p>
                                A Barra da Tijuca é conhecida por sua arquitetura moderna de grandes vãos envidraçados, de frente para o mar ou para as lagoas. O sol da tarde na região é extremamente agressivo, elevando a temperatura de apartamentos no <strong className="text-white">Jardim Oceânico</strong> e casas em condomínios como a <strong className="text-white">Península</strong> a níveis desconfortáveis, além de causar o desbotamento acelerado de decorações sofisticadas.
                            </p>
                            <p>
                                A <strong className="text-white">LUME Controle Solar</strong> oferece as soluções mais avançadas do mercado global para o público da Barra. Nossas películas de Nano Cerâmica de última geração são projetadas para rejeitar o calor infravermelho sem alterar a estética original da fachada ou a visibilidade externa, sendo a escolha número um para coberturas e apartamentos com vista livre.
                            </p>
                            <p>
                                Atendemos com exclusividade e discrição em todos os grandes eixos da região: Avenida das Américas, Lúcio Costa e Salvador Allende. Oferecemos visita técnica técnica para medição a laser e apresentação de kits de amostras físicas, garantindo que o resultado final supere suas expectativas de conforto e elegância.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-3xl border border-white/10 relative overflow-hidden max-w-4xl mx-auto text-center">
                        <h3 className="text-2xl font-bold font-montserrat mb-8">Especialista em Condomínios e Lojas de Luxo</h3>
                        <p className="text-gray-400 leading-relaxed max-w-3xl mx-auto font-light text-lg">
                            Seja para proteger o acervo de uma loja no BarraShopping ou garantir privacidade em um apartamento na beira da mar, nossa equipe está preparada para entregar a melhor instalação do Rio de Janeiro.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tipos de Película - Paridade Total com Bangu */}
            <section id="tipos" className="py-24 bg-[#04080f] border-y border-white/5 px-4 overflow-hidden relative">
                <div className="container-lume relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold font-montserrat mb-6 text-white">
                            Películas de <span className="text-gradient-gold">Alta Performance</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
                            O melhor da tecnologia de controle solar para o seu imóvel na Barra da Tijuca.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {[
                            {
                                title: "Nano Cerâmica", selo: "Top de Linha", icon: Star, image: "/product-nano-ceramica.webp", path: "/nano-ceramica",
                                desc: "A elite tecnológica. Rejeita até 95% do calor mantendo a transparência quase total. Ideal para quem quer proteger o ambiente sem perder a vista privilegiada da Barra."
                            },
                            {
                                title: "Carbono Premium", selo: "Best-Seller", icon: SunDim, image: "/product-carbono.webp", path: "/carbono",
                                desc: "Visual grafite sofisticado with durabilidade certificada. Não desbota nem cria bolhas, garantindo um visual sempre impecável para suas janelas."
                            },
                            {
                                title: "Espelhado / Refletivo", selo: "Privacidade", icon: Sun, image: "/product-refletiva.webp", path: "/refletiva",
                                desc: "Máxima privacidade diurna para casas e escritórios na Barra. Reflete o calor de forma bruta, tornando o ambiente interno muito mais produtivo e fresco."
                            },
                            {
                                title: "Jateado / Fosco", selo: "Decoração", icon: Eye, image: "/product-jateado-v2.webp", path: "/jateado",
                                desc: "Elegância decorativa para banheiros e divisórias de vidro. Transforma o visual do ambiente mantendo a luminosidade natural passar de forma suave."
                            },
                            {
                                title: "Dupla Camada", selo: "Favorito", icon: Droplets, image: "/product-smoke.webp", path: "/dupla-camada",
                                desc: "A tecnologia híbrida definitiva. Rejeição de calor massiva com visão relaxada e baixa reflexão interna noturna. Perfeita para o sol da tarde carioca."
                            }
                        ].map((product, idx) => (
                            <div key={idx} className="product-card group relative bg-gradient-to-b from-[#1a3a5c]/60 to-[#04080f]/90 rounded-2xl overflow-hidden border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#c9a227] text-[#04080f] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg pointer-events-none">
                                    {product.selo}
                                </div>
                                <Link href={product.path} className="flex flex-col flex-grow">
                                    <div className="relative h-44 overflow-hidden">
                                        <Image 
                                            src={product.image} 
                                            alt={product.title} 
                                            fill 
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw" 
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-transparent to-transparent opacity-80" />
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 mb-4">
                                            <product.icon className="w-5 h-5 text-[#c9a227]" />
                                            <h3 className="text-xl font-bold text-white font-montserrat leading-tight">
                                                {product.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-6 leading-relaxed font-light flex-grow">
                                            {product.desc}
                                        </p>
                                        
                                        {/* Specs */}
                                        <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-white/5">
                                            <div className="text-[10px] sm:text-xs">
                                                <span className="text-gray-500 block">{product.path === '/nano-ceramica' ? 'Visibilidade' : 'Bloqueio UV'}</span>
                                                <span className="text-[#c9a227] font-semibold">
                                                    {product.path === '/nano-ceramica' ? 'Alta' : product.path === '/jateado' ? '99%' : product.path === '/refletiva' ? '100%' : '99%'}
                                                </span>
                                            </div>
                                            <div className="text-[10px] sm:text-xs">
                                                <span className="text-gray-500 block">{product.path === '/jateado' ? 'Privacidade' : 'Rejeição de Calor'}</span>
                                                <span className="text-[#c9a227] font-semibold">
                                                    {product.path === '/nano-ceramica' ? 'Até 95%' : product.path === '/jateado' ? 'Total' : product.path === '/carbono' ? 'Até 70%' : product.path === '/refletiva' ? '87%' : '80%'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <div className="p-6 pt-0">
                                    <a
                                        href={`https://wa.me/5521965140612?text=Olá! Quero saber sobre a película ${product.title} na Barra da Tijuca.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3.5 rounded-xl bg-[#111e33] hover:bg-[#c9a227] text-gray-300 hover:text-[#04080f] text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 border border-white/5"
                                    >
                                        Quero Orçamento <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vantagens que Valorizam seu Ambiente */}
            <section id="vantagens" className="py-24 relative px-4 bg-[#04080f] overflow-hidden">
                <div className="container-lume">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">Vantagens de Padrão Elite</h2>
                        <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light">Investir em películas de controle solar é garantir conforto imediato e economia de longo prazo na Barra da Tijuca.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Thermometer, title: "Rejeição Térmica", stat: "-8°C", label: "Na Temperatura",
                                desc: "Filtre até 80% do calor solar direto, mantendo o ambiente fresco mesmo nos dias mais quentes da Barra."
                            },
                            {
                                icon: SunDim, title: "Bloqueio UV 99%", stat: "99%", label: "De Eficiência",
                                desc: "Preserve seu patrimônio evitando o desbotamento rápido de pisos de madeira, estofados e obras de arte."
                            },
                            {
                                icon: PiggyBank, title: "Eficiência Energética", stat: "30%", label: "Economia Real",
                                desc: "Reduza significativamente o custo mensal com ar-condicionado em apartamentos amplos e lojas."
                            },
                            {
                                icon: Lock, title: "Garantia Lume", stat: "5 Anos", label: "De Tranquilidade",
                                desc: "Materiais de procedência mundial que não criam bolhas nem perdem a cor sob o sol do Rio de Janeiro."
                            }
                        ].map((benefit, idx) => (
                            <div key={idx} className="benefit-card group relative p-10 rounded-2xl bg-gradient-to-b from-[#1a3a5c]/40 to-[#04080f]/60 border border-[#1a3a5c]/30 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2 text-center lg:text-left flex flex-col">
                                <div className="w-16 h-16 rounded-2xl bg-[#c9a227]/10 flex items-center justify-center mx-auto lg:mx-0 mb-8 group-hover:bg-[#c9a227]/20 transition-colors shadow-inner">
                                    <benefit.icon className="w-8 h-8 text-[#c9a227] group-hover:scale-110 transition-transform" />
                                </div>
                                
                                <div className="mb-6">
                                    <span className="text-5xl font-black text-gradient-gold font-montserrat leading-none">
                                        <AnimatedCounter 
                                            target={benefit.stat.replace(/[^0-9-]/g, '')} 
                                            suffix={benefit.stat.replace(/[0-9-]/g, '')} 
                                        />
                                    </span>
                                    <p className="text-[11px] uppercase text-gray-500 font-black tracking-widest mt-2">{benefit.label}</p>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-4 font-montserrat leading-tight">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-light">
                                    {benefit.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Região de Atendimento - Barra */}
            <section className="py-24 bg-[#04080f] border-y border-white/5 relative px-4 overflow-hidden">
                <div className="container-lume page-entrance relative z-10 text-center lg:text-left">
                    <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-10 text-center text-[#c9a227] tracking-tight underline decoration-[#c9a227]/20 underline-offset-8">Conheça nossa área de atuação na Barra</h2>
                    
                    <div className="grid lg:grid-cols-2 gap-12 items-stretch mt-12 text-left">
                        <div className="glass-card p-10 rounded-3xl border border-white/10 flex flex-col h-full bg-white/[0.01]">
                            <h3 className="text-2xl font-bold font-montserrat mb-8 text-white flex items-center gap-3">
                                <MapPin size={24} className="text-[#c9a227]" /> Atendimento VIP na Barra
                            </h3>
                            <p className="text-gray-400 leading-relaxed mb-8 text-base font-light">
                                Oferecemos atendimento flexível: vamos até a sua residência ou empresa, realizamos a medição técnica e instalamos com o mais alto padrão de acabamento do Rio de Janeiro.
                            </p>
                            <ul className="space-y-4 mb-4">
                                <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Visita técnica em condomínios de luxo</li>
                                <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Instalação técnica sem sujeira</li>
                                <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Padrão de elite LUME Controle Solar</li>
                            </ul>
                        </div>

                        <div className="bg-[#111e33] p-10 rounded-3xl border border-white/10 h-full shadow-2xl relative overflow-hidden group">
                            <h4 className="text-[#c9a227] font-black uppercase tracking-[0.2em] text-sm mb-8 flex items-center gap-3">
                                <Zap size={18} className="animate-pulse" /> Localidades de Destaque
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-400 uppercase tracking-wider relative z-10">
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Barra da Tijuca</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Jardim Oceânico</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Península</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> ABM</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Parque Olímpico</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Rio 2</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Marapendi</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Joá</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Itanhangá</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Cidade das Artes</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Perguntas Frequentes (FAQ) - Adaptado para Barra */}
            <section className="py-24 relative px-4 overflow-hidden bg-[#04080f]">
                <div className="container-lume page-entrance max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">Perguntas Frequentes (FAQ)</h2>
                        <p className="text-gray-500 font-medium">Esclareça suas principais dúvidas sobre aplicação na Barra.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "1. Quanto custa instalar insulfilm residencial na Barra da Tijuca?",
                                a: "O valor é calculado por metro quadrado e depende da tecnologia de película escolhida. Trabalhamos desde linhas de excelente custo-benefício até nanotecnologia premium para controle solar total. Solicite um orçamento em 5 minutos pelo nosso WhatsApp."
                            },
                            {
                                q: "2. Qual o melhor tipo de insulfilm para apartamentos de frente para o mar?",
                                a: "Nesses casos, recomendamos películas que não possuem metais (Metal-free), como as nossas linhas de Nano Cerâmica. Elas não sofrem oxidação com a maresia e garantem a visão clara da praia mesmo com alto controle de calor."
                            },
                            {
                                q: "3. O insulfilm residencial altera a estética da fachada do prédio?",
                                a: "Temos opções de películas 'invisíveis' (incolor e térmica) que mantêm 100% da transparência original do vidro, aprovadas em condomínios rigorosos como os da Península e Jardim Oceânico."
                            },
                            {
                                q: "4. Quanto tempo dura a proteção térmica das películas LUME?",
                                a: "Nossas películas de padrão elite mantêm a eficiência de rejeição infravermelha e estabilidade de cor por 8 a 15 anos. Elas são resistentes a riscos e ao clima salino da Barra."
                            },
                            {
                                q: "5. O serviço na Barra tem garantia oficial?",
                                a: "Sim. Oferecemos garantia oficial de 5 anos cobrindo qualquer defeito de instalação ou material. Sua tranquilidade e satisfação na Barra são prioridade para a LUME."
                            },
                            {
                                q: "6. Posso instalar insulfilm em coberturas ou varandas envidraçadas?",
                                a: "Sim, somos especialistas em grandes vãos de vidro. A aplicação em varandas gourmet é um de nossos serviços mais solicitados para viabilizar o uso do espaço durante o sol da tarde."
                            },
                            {
                                q: "7. O insulfilm realmente reduz o brilho no monitor e TV?",
                                a: "Com certeza. Além do calor, nossas películas filtram o excesso de luminosidade, eliminando reflexos incômodos em telas, ideal para home-offices e salas de cinema particulares."
                            },
                            {
                                q: "8. Atendem clínicas e escritórios em centros empresariais na Barra?",
                                a: "Sim. Atendemos todo o setor corporativo da região, garantindo privacidade e conforto térmico para seus clientes e colaboradores com instalação rápida e discreta."
                            }
                        ].map((faq, idx) => (
                            <details key={idx} className="group glass-card border border-white/5 rounded-2xl overflow-hidden cursor-pointer transition-all hover:bg-white/[0.03]">
                                <summary className="font-bold text-lg p-7 flex justify-between items-center list-none outline-none group-open:text-[#c9a227] transition-colors">
                                    {faq.q}
                                    <span className="text-[#c9a227] group-open:rotate-180 transition-transform duration-300">▼</span>
                                </summary>
                                <div className="p-7 pt-0 text-gray-400 leading-relaxed border-t border-white/5 text-sm font-light animate-fade-in">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <GoogleReviews />

            {/* CTA Final */}
            <section className="py-24 relative overflow-hidden bg-[#04080f]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#04080f] to-[#04080f]" />
                <div className="container-lume relative z-10 px-4">
                    <div className="max-w-5xl mx-auto glass-card border border-white/10 rounded-[2.5rem] p-12 md:p-20 text-center animate-fade-in relative overflow-hidden">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 font-montserrat tracking-tighter">
                            A Solução em <span className="text-gradient-gold">Vidros Elite</span> na Barra
                        </h2>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12 font-light">
                            Estamos prontos para atender seu projeto de controle solar no Jardim Oceânico, Península e toda a Barra da Tijuca.
                        </p>
                        <a
                            href="https://wa.me/5521965140612?text=Olá! Gostaria de um orçamento de insulfilm residencial na Barra da Tijuca."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25d366] hover:bg-[#20bd5a] text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.05] inline-flex items-center gap-4 text-sm"
                        >
                            <MessageCircle size={22} /> Orçamento via WhatsApp
                        </a>
                    </div>
                </div>
            </section>

             <footer className="py-12 bg-[#04080f] border-t border-white/5 text-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] px-4">
                 © 2026 Lume Controle Solar · Especialista na Barra da Tijuca e Zona Oeste
            </footer>
        </div>
    );
}
