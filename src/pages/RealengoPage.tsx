import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Sun, Thermometer, CheckCircle, ArrowRight, Eye, SunDim, Star, PiggyBank, Lock, MapPin, Zap, MessageCircle, Droplets } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Particles } from '../components/Particles';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function RealengoPage() {
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
    }, []);

    return (
        <div className="bg-[#070f1a] text-white min-h-screen">
            <Helmet>
                <title>Insulfilm em Realengo | Aplicação Residencial e Comercial - LUME</title>
                <meta name="description" content="Instalação de insulfilm em Realengo e região com aplicação profissional em até 24 horas. Películas residenciais e comerciais. Orçamento gratuito pelo WhatsApp." />
                <link rel="canonical" href="https://lumecontrolesolar.com.br/insulfilm-em-realengo" />

                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "LUME Películas de Controle Solar",
                            "image": "https://lumecontrolesolar.com.br/novo-logo-lume.png",
                            "@id": "https://lumecontrolesolar.com.br/insulfilm-em-realengo",
                            "url": "https://lumecontrolesolar.com.br/insulfilm-em-realengo",
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
                            "areaServed": ["Realengo", "Bangu", "Campo Grande", "Santa Cruz", "Padre Miguel", "Senador Camará", "Zona Oeste RJ"],
                            "description": "Instalação de insulfilm em Realengo e região com aplicação profissional e rápida (24h). Películas residenciais e comerciais. Controle solar, privacidade e segurança."
                        }
                    `}
                </script>
            </Helmet>

            <WhatsAppButton />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/realengo_hero_bg.png"
                        alt="Instalação de insulfilm profissional em Realengo RJ - LUME Controle Solar"
                        className="w-full h-full object-cover"
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/80 to-[#0a1628]/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/50" />
                </div>

                {/* Particles & Effects */}
                <Particles />
                
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1628] to-transparent z-10" />
                <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#c9a227]/5 blur-3xl animate-float z-10" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#1a3a5c]/30 blur-3xl animate-float z-10" style={{ animationDelay: '2s' }} />

                <div className="container-lume relative z-20 page-entrance text-center md:text-left pt-24 pb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse flex-shrink-0" />
                        <span className="text-[#c9a227] text-sm font-bold uppercase tracking-wider">Zona Oeste do Rio de Janeiro</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-['Montserrat'] mb-6 leading-tight">
                        Insulfilm em <span className="text-gradient-gold">Realengo</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed font-light">
                        Aplicação profissional de películas de controle solar em Realengo. Proteção contra o calor extremo, privacidade absoluta e <strong>instalação rápida em até 24 horas</strong>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="https://wa.me/5521965140612?text=Olá! Quero um orçamento gratuito de insulfilm em Realengo."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8 transform transition hover:scale-105"
                        >
                            Orçamento Gratuito no WhatsApp <ArrowRight size={20} />
                        </a>
                        <a
                            href="#tipos"
                            className="btn-outline inline-flex items-center justify-center gap-3 text-lg py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-widest text-sm"
                        >
                            Ver Tipos de Película
                        </a>
                    </div>
                </div>
            </section>

            {/* Auto-Scroll Info Strip / Estatísticas */}
            <section className="bg-[#c9a227] py-6 overflow-hidden relative z-20">
                <div className="container-lume">
                    <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-6 lg:gap-4 text-black font-extrabold uppercase tracking-widest text-xs lg:text-sm text-center">
                        <span className="flex items-center gap-2"><Thermometer size={18} /> Até 80% de rejeição de calor</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><Sun size={18} /> 99% bloqueio de raios UV</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><Shield size={18} /> Proteção Solar Arquitetônica</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><CheckCircle size={18} /> Garantia de 5 anos Lume</span>
                    </div>
                </div>
            </section>

            {/* Faixa de Garantias (Intro Strip) */}
            <section className="py-8 bg-[#0a1628] border-b border-white/5 relative z-10">
                <div className="container-lume page-entrance">
                    <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400 font-medium">
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Orçamento gratuito e sem compromisso</div>
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Atendimento local em Realengo</div>
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Películas de procedência certificada</div>
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Rapidez total: Instalado em 24h</div>
                    </div>
                </div>
            </section>

            {/* O problema do Calor em Realengo - Texto Completo */}
            <section className="py-24 bg-[#070f1a] relative px-4">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold font-['Montserrat'] mb-10">Realengo merece conforto térmico</h2>
                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light text-left md:text-justify px-4">
                            <p>
                                Quem frequenta ou reside em <strong>Realengo</strong> conhece o desafio: as temperaturas da Zona Oeste atingem patamares críticos durante o verão. Sem a proteção correta, as superfícies de vidro da sua casa ou loja atuam como condutores, aprisionando o calor e tornando o ambiente exaustivo.
                            </p>
                            <p>
                                A radiação solar que entra pelas janelas e fachadas em Realengo não apenas aumenta a temperatura, como também causa o desbotamento acelerado de pisos e móveis. Na <strong>Lume Controle Solar</strong>, oferecemos um diferencial exclusivo para a região: o <strong>orçamento gratuito via WhatsApp</strong> e a <strong>instalação rápida em 24 horas</strong>, garantindo que você não precise esperar para ter o frescor que merece.
                            </p>
                            <p>
                                Trabalhamos com tecnologias avançadas que criam um escudo invisível contra o calor. Seja em residências próximas à Castelo Branco ou comércios no centro de Realengo, nossa equipe está pronta para realizar uma aplicação profissional, limpa e duradoura, restabelecendo o conforto térmico e a privacidade da sua família imediatamente.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-3xl border border-white/10 relative overflow-hidden max-w-4xl mx-auto">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#c9a227] blur-[100px] opacity-10" />
                        <h3 className="text-2xl font-bold font-['Montserrat'] text-center mb-8">Especialistas em Realengo e Região</h3>
                        <p className="text-gray-400 leading-relaxed text-center max-w-3xl mx-auto font-light text-lg">
                            Focamos no atendimento personalizado para casas, apartamentos e comércios em Realengo. Ao contrário de empresas de grande escala, valorizamos o atendimento local, a agilidade na instalação (em até 24h) e o compromisso com películas que realmente suportam a radiação UV intensa do nosso bairro sem desbotar.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tipos de Insulfilm - Cards com Imagens e Texto Completo */}
            <section id="tipos" className="py-24 bg-[#0a1628] border-y border-white/5 px-4 overflow-hidden relative">
                <div className="container-lume page-entrance relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold font-['Montserrat'] mb-6 text-white">
                            Películas de <span className="text-gradient-gold">Alta Performance</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
                            Soluções rápidas e eficazes para o seu problema de calor ou privacidade em Realengo.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {[
                            {
                                title: "Nano Cerâmica", selo: "Top de Linha", icon: Star, image: "/product-nano-ceramica.jpg", path: "/nano-ceramica",
                                desc: "Rejeição térmica de até 95% do infravermelho sem escurecer o vidro. Ideal para varandas e salas em Realengo que precisam de frescor mantendo a claridade total."
                            },
                            {
                                title: "Carbono Premium", selo: "Privacidade", icon: SunDim, image: "/product-carbono.jpg", path: "/carbono",
                                desc: "O tom grafite perfeito que não desbota. Oferece privacidade absoluta e excelente redução de calor para as janelas da sua residência ou escritório."
                            },
                            {
                                title: "Espelhado / Refletivo", selo: "Proteção Solar", icon: Sun, image: "/product-refletiva.jpg", path: "/refletiva",
                                desc: "A tecnologia clássica de rejeição solar agressiva. O efeito espelhado atua como um escudo, devolvendo o calor para fora antes que ele aqueça sua sala."
                            },
                            {
                                title: "Jateado / Fosco", selo: "Estética", icon: Eye, image: "/product-jateado-v2.png", path: "/jateado",
                                desc: "Privacidade bidirecional com acabamento fosco elegante. Perfeito para banheiros, divisórias e portas de entrada em Realengo."
                            },
                            {
                                title: "Dupla Camada", selo: "Favorito", icon: Droplets, image: "/product-smoke.jpg", path: "/dupla-camada",
                                desc: "Alta redução de calor com uma tecnologia especial: camada refletiva externa para máxima redução de calor e camada fumê interna para uma visão relaxante. Diferente das películas comuns, reduz o reflexo interno à noite. Perfeito para casas e apartamentos em Realengo."
                            }
                        ].map((product, idx) => (
                            <div key={idx} className="group relative bg-gradient-to-b from-[#1a3a5c]/60 to-[#0a1628]/90 rounded-2xl overflow-hidden border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#c9a227] text-[#0a1628] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg pointer-events-none">
                                    {product.selo}
                                </div>
                                <Link to={product.path} className="flex flex-col flex-grow">
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-80" />
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 mb-4">
                                            <product.icon className="w-5 h-5 text-[#c9a227]" />
                                            <h3 className="text-xl font-bold text-white font-['Montserrat'] leading-tight">
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
                                        href={`https://wa.me/5521965140612?text=Olá! Quero um orçamento gratuito da película ${product.title} em Realengo.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3.5 rounded-xl bg-[#111e33] hover:bg-[#c9a227] text-gray-300 hover:text-[#0a1628] text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 border border-white/5"
                                    >
                                        Orçamento Grátis <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefícios - Boxes com Texto e Estatísticas */}
            <section className="py-24 relative px-4 bg-[#070f1a] overflow-hidden">
                <div className="container-lume page-entrance">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-6 tracking-tight">O Diferencial LUME em Realengo</h2>
                        <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light">Mais que estética, entregamos performance térmica e rapidez real no atendimento.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Thermometer, title: "Fim do Calor", stat: "-8°C", label: "Na Temperatura",
                                desc: "Rejeição brutal do calor solar, poupando seu ar-condicionado mesmo nos dias mais quentes de Realengo."
                            },
                            {
                                icon: SunDim, title: "Zero Desbotamento", stat: "99%", label: "Bloqueio UV",
                                desc: "Proteção total para seus pisos de madeira, sofás e cortinas contra a radiação solar destruidora."
                            },
                            {
                                icon: PiggyBank, title: "Economia Real", stat: "30%", label: "Menos Energia",
                                desc: "Ambientes mais frescos exigem menos potência do ar-condicionado, reduzindo sua conta de luz mensalmente."
                            },
                            {
                                icon: Lock, title: "Instalação 24h", stat: "24", label: "Horas p/ Instalar",
                                desc: "Orçamento gratuito e instalação express em até 24 horas em qualquer endereço de Realengo."
                            }
                        ].map((benefit, idx) => (
                            <div key={idx} className="group relative p-10 rounded-2xl bg-gradient-to-b from-[#1a3a5c]/40 to-[#0d1f3c]/60 border border-[#1a3a5c]/30 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2 text-center lg:text-left flex flex-col">
                                <div className="w-16 h-16 rounded-2xl bg-[#c9a227]/10 flex items-center justify-center mx-auto lg:mx-0 mb-8 group-hover:bg-[#c9a227]/20 transition-colors shadow-inner">
                                    <benefit.icon className="w-8 h-8 text-[#c9a227] group-hover:scale-110 transition-transform" />
                                </div>
                                
                                <div className="mb-6">
                                    <span className="text-5xl font-black text-gradient-gold font-['Montserrat'] leading-none">
                                        {benefit.stat}
                                    </span>
                                    <p className="text-[11px] uppercase text-gray-500 font-black tracking-widest mt-2">{benefit.label}</p>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-4 font-['Montserrat'] leading-tight">
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

            {/* Contexto Local e Bairros - Importante para SEO */}
            <section className="py-24 bg-[#0a1628] border-y border-white/5 relative px-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
                <div className="container-lume page-entrance relative z-10">
                    <div className="max-w-4xl mx-auto text-center lg:text-left">
                        <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-10 text-center text-[#c9a227] tracking-tight underline decoration-[#c9a227]/20 underline-offset-8">Insulfilm na Zona Oeste</h2>
                        
                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light text-center lg:text-justify mb-16 px-4 md:px-0">
                            <p>
                                Nossa atuação em Realengo e adjacências foca em resolver problemas reais de insolação. Com a expansão imobiliária na região, muitas novas casas e apartamentos são entregues com grandes vãos de vidro que, embora bonitos, tornam-se o principal vilão do conforto térmico.
                            </p>
                            <p>
                                O insulfilm em Realengo é a solução de melhor custo-benefício para quem busca privacidade e segurança sem precisar de obras complexas. Atendemos desde o entorno da Vila Militar até áreas como Sulacap e Magalhães Bastos, sempre com o mesmo padrão LUME de excelência técnica e prazo de entrega recorde (instalação em até 24h).
                            </p>
                        </div>
                        
                        <div className="grid lg:grid-cols-2 gap-12 items-stretch mt-12 text-left">
                            <div className="glass-card p-10 rounded-3xl border border-white/10 flex flex-col h-full bg-white/[0.01]">
                                <h3 className="text-2xl font-bold font-['Montserrat'] mb-8 text-white flex items-center gap-3">
                                    <MapPin size={24} className="text-[#c9a227]" /> Atendimento Local Express
                                </h3>
                                <p className="text-gray-400 leading-relaxed mb-8 text-base font-light">
                                    Não perca tempo com orçamentos demorados. Nossa equipe em Realengo é treinada para medição técnica rápida e apresentação de amostras de acordo com o padrão do seu condomínio.
                                </p>
                                <ul className="space-y-4 mb-4">
                                    <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Orçamento Gratuito via Fotos ou Visita</li>
                                    <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Instalação Profissional em 24 Horas</li>
                                    <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Garantia Lume de 5 anos (Acabamento Elite)</li>
                                </ul>
                            </div>

                            <div className="bg-[#111e33] p-10 rounded-3xl border border-white/10 h-full shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <MapPin size={120} className="text-white" />
                                </div>
                                <h4 className="text-[#c9a227] font-black uppercase tracking-[0.2em] text-sm mb-8 flex items-center gap-3">
                                    <Zap size={18} className="animate-pulse" /> Atendimento em Realengo
                                </h4>
                                <div className="space-y-6 relative z-10">
                                    <p className="text-gray-300 font-bold text-lg mb-4">Regiões que Atendemos Hoje:</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Realengo (Centro)</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Jardim Sulacap</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Magalhães Bastos</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Vila Militar</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Padre Miguel</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Bangu</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Senador Camará</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Deodoro</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Vila Valqueire</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Marechal Hermes</div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-6 pt-6 border-t border-white/5">Equipe dedicada para instalação rápida e profissional em toda a Zona Oeste.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Perguntas Frequentes (FAQ) */}
            <section className="py-24 relative px-4 overflow-hidden bg-[#070f1a]">
                <div className="container-lume page-entrance max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-6 tracking-tight">FAQ - Insulfilm em Realengo</h2>
                        <p className="text-gray-500 font-medium">Esclareça suas principais dúvidas sobre custos e prazos.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "1. Quanto custa instalar insulfilm residencial em Realengo?",
                                a: "O valor é calculado por metro quadrado e depende da tecnologia da película (Nano Cerâmica, Carbono ou Refletiva). Oferecemos orçamento gratuito via WhatsApp: basta nos enviar as medidas aproximadas dos vidros para receber o valor na hora."
                            },
                            {
                                q: "2. Qual a velocidade do atendimento em Realengo?",
                                a: "Nosso grande diferencial é a agilidade. Temos equipes prontas para atuar na Zona Oeste e conseguimos realizar a instalação em Realengo em até 24 horas após a aprovação do orçamento."
                            },
                            {
                                q: "3. Qual o melhor insulfilm para reduzir o calor forte de Realengo?",
                                a: "Para residências que sofrem com o sol da tarde, indicamos as películas de Nano Cerâmica ou Refletivas. Elas barram até 80% do calor infravermelho, permitindo uma redução térmica real e economia no uso de ar-condicionado."
                            },
                            {
                                q: "4. Quanto tempo dura o insulfilm e qual a garantia?",
                                a: "Trabalhamos exclusivamente com películas originais que mantêm suas propriedades térmicas e estabilidade de cor por longos períodos, superando as versões comuns. Elas são resistentes a riscos e possuem garantia oficial de 5 anos."
                            },
                            {
                                q: "5. Atendem condomínios e comércios em Realengo?",
                                a: "Sim. Atendemos casas de rua, condomínios fechados, lojas, clínicas e escritórios em todo o bairro de Realengo e bairros vizinhos como Vila Militar e Sulacap."
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

            {/* Chamada para Ação (CTA Final) - Elegant Redesign */}
            <section className="py-24 relative overflow-hidden bg-[#070f1a]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] to-[#070f1a]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a227]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#25d366]/5 blur-[120px] rounded-full" />

                <div className="container-lume relative z-10 px-4">
                    <div className="max-w-5xl mx-auto glass-card border border-white/10 rounded-[2.5rem] p-8 md:p-16 text-center animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent opacity-30" />
                        
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 font-['Montserrat'] tracking-tighter leading-tight">
                            Proteja sua Casa em <span className="text-gradient-gold">Realengo</span>
                        </h2>
                        
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                            Agende uma visita técnica <strong className="text-white">gratuita em 24h</strong> e descubra como o insulfilm profissional transforma seu conforto térmico.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <a
                                href="https://wa.me/5521965140612?text=Olá! Quero um orçamento gratuito de insulfilm em Realengo."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto bg-[#25d366] hover:bg-[#20bd5a] text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.05] shadow-[0_15px_45px_rgba(37,211,102,0.3)] flex items-center justify-center gap-4 text-sm group"
                            >
                                <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                                Orçamento via WhatsApp
                            </a>
                            
                            <Link
                                to="/"
                                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-6 rounded-2xl font-bold uppercase tracking-widest transition-all text-sm backdrop-blur-sm"
                            >
                                Conhecer a LUME
                            </Link>
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center gap-8 text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#c9a227]" /> Garantia de 5 Anos</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#c9a227]" /> Estabilidade de Cor</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#c9a227]" /> Atendimento Rápido</span>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 bg-[#070f1a] border-t border-white/5 text-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] px-4">
                 © 2026 Lume Controle Solar · Especialista em Realengo e Zona Oeste
            </footer>
        </div>
    );
}
