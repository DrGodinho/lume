import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Sun, Thermometer, CheckCircle, ArrowRight, Eye, SunDim, Star, PiggyBank, Lock, MapPin, Zap, MessageCircle, Droplets } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { GoogleReviews } from '../components/GoogleReviews';
import { Particles } from '../components/Particles';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function CampoGrandePage() {
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
                <title>Insulfilm em Campo Grande RJ | Aplicação Residencial e Comercial - LUME</title>
                <meta name="description" content="Instalação profissional de insulfilm em Campo Grande RJ com aplicação express em 24h. Películas para redução de calor, privacidade e segurança. Orçamento gratuito." />
                <link rel="canonical" href="https://lumecontrolesolar.com.br/insulfilm-em-campo-grande" />

                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "LUME Películas de Controle Solar",
                            "image": "https://lumecontrolesolar.com.br/novo-logo-lume.png",
                            "@id": "https://lumecontrolesolar.com.br/insulfilm-em-campo-grande",
                            "url": "https://lumecontrolesolar.com.br/insulfilm-em-campo-grande",
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
                                "latitude": -22.903,
                                "longitude": -43.559
                            },
                            "areaServed": ["Campo Grande", "Guaratiba", "Paciência", "Cosmos", "Inhoaíba", "Santíssimo", "Zona Oeste RJ"],
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": "5.0",
                                "reviewCount": "52"
                            },
                            "description": "Instalação de insulfilm em Campo Grande RJ com aplicação profissional e rápida (24h). Películas residenciais e comerciais. Controle solar, privacidade e segurança."
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
                        src="/campogrande_hero_bg.webp"
                        alt="Instalação de insulfilm residencial em Campo Grande RJ - LUME Controle Solar"
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
                        Insulfilm em <br className="hidden md:block" /> <span className="text-gradient-gold">Campo Grande</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed font-light">
                        Aplicação profissional de películas de controle solar em Campo Grande. Redução drástica de calor, proteção UV e <strong>instalação express em 24h</strong>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="https://wa.me/5521965140612?text=Olá! Quero um orçamento gratuito de insulfilm em Campo Grande."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8 transform transition hover:scale-105"
                        >
                            Orçamento Gratuito via WhatsApp <ArrowRight size={20} />
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
                        <span className="flex items-center gap-2 text-black"><Thermometer size={18} /> Rejeição Térmica de até 95%</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2 text-black"><Sun size={18} /> Orçamento On-line Imediato</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2 text-black"><Shield size={18} /> Proteção Solar de Elite</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2 text-black"><CheckCircle size={18} /> Garantia de 5 anos Lume</span>
                    </div>
                </div>
            </section>

            {/* Faixa de Garantias (Intro Strip) */}
            <section className="py-8 bg-[#0a1628] border-b border-white/5 relative z-10">
                <div className="container-lume page-entrance">
                    <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400 font-medium">
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Orçamento gratuito e especializado</div>
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Atendimento em condomínios de CG</div>
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Películas premium que não desbotam</div>
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Agilidade: Instalamos em 24h</div>
                    </div>
                </div>
            </section>

            {/* O problema do Calor em Campo Grande - Texto Completo */}
            <section className="py-24 bg-[#070f1a] relative px-4">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold font-['Montserrat'] mb-10">Conforto Térmico em Campo Grande</h2>
                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light text-left md:text-justify px-4">
                            <p>
                                <strong>Campo Grande</strong> é o centro comercial e residencial da Zona Oeste, e seu microclima exige soluções de alto padrão. Com as temperaturas batendo recordes anualmente, as janelas de vidro tornam-se o principal radiador de calor para dentro da sua residência.
                            </p>
                            <p>
                                Na <strong>Lume Controle Solar</strong>, entendemos que o morador de Campo Grande busca rapidez e eficiência. Por isso, nosso diferencial é o <strong>orçamento gratuito pelo WhatsApp</strong> e a capacidade técnica de realizar a <strong>instalação profissional em até 24 horas</strong>. 
                            </p>
                            <p>
                                Atendemos desde os grandes condomínios na Estrada do Monteiro até residências na Estrada da Posse e arredores do West Shopping. Nossas películas de Nano Cerâmica e Carbono são projetadas para suportar a radiação UV sem sofrer desbotamento ou criar aquelas bolhas comuns em películas baratas, garantindo um investimento duradouro e estético para seu imóvel.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-3xl border border-white/10 relative overflow-hidden max-w-4xl mx-auto">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#c9a227] blur-[100px] opacity-10" />
                        <h3 className="text-2xl font-bold font-['Montserrat'] text-center mb-8">Especialista em Condomínios e Comércios</h3>
                        <p className="text-gray-400 leading-relaxed text-center max-w-3xl mx-auto font-light text-lg">
                            Seja para garantir a privacidade total de um apartamento ou reduzir o calor em fachadas comerciais de lojas e clínicas, a LUME oferece a consultoria ideal. Visitamos seu local em Campo Grande com amostras físicas para que você escolha a tonalidade perfeita para seu projeto, sempre com garantia oficial certificada de 5 anos (Acabamento Arquitetônico).
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
                            Tecnologia de ponta com instalação express para quem não quer perder tempo em Campo Grande.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {[
                            {
                                title: "Nano Cerâmica", selo: "Top de Linha", icon: Star, image: "/product-nano-ceramica.webp", path: "/nano-ceramica",
                                desc: "Privacidade e frescor total. Rejeita o calor invisível (IR) sem alterar a fachada original. A escolha nº 1 para varandas em Campo Grande."
                            },
                            {
                                title: "Carbono Premium", selo: "Privacidade", icon: SunDim, image: "/product-carbono.webp", path: "/carbono",
                                desc: "O preto intenso que nunca fica roxo. Oferece elegância e bloqueio térmico de 80% para janelas residenciais."
                            },
                            {
                                title: "Refletiva / Silver", selo: "Alta Rejeição", icon: Sun, image: "/product-refletiva.webp", path: "/refletiva",
                                desc: "Efeito espelhado clássico. Máxima rejeição de calor para ambientes que recebem sol direto o dia todo."
                            },
                            {
                                title: "Jateado Design", selo: "Decoração", icon: Eye, image: "/product-jateado-v2.webp", path: "/jateado",
                                desc: "Estética fosca para privacidade em banheiros e divisórias de escritórios. Mantém a luminosidade natural difusa."
                            },
                            {
                                title: "Dupla Camada", selo: "Favorito", icon: Droplets, image: "/product-smoke.webp", path: "/dupla-camada",
                                desc: "Alta redução de calor com uma tecnologia especial: camada refletiva externa para máxima redução de calor e camada fumê interna para uma visão relaxante. Diferente das películas comuns, reduz o reflexo interno à noite. Ideal para grandes áreas envidraçadas em Campo Grande."
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
                                        href={`https://wa.me/5521965140612?text=Olá! Quero um orçamento gratuito da película ${product.title} em Campo Grande.`}
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
                        <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-6 tracking-tight">O Diferencial LUME em Campo Grande</h2>
                        <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light">Compromisso com o prazo e performance térmica real para seus vidros.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Thermometer, title: "Fim do Calor", stat: "-8°C", label: "Na Temperatura",
                                desc: "Rejeição térmica imediata, garantindo ambientes mais frescos mesmo no auge do verão da Zona Oeste."
                            },
                            {
                                icon: SunDim, title: "Proteção UV", stat: "99%", label: "Bloqueio",
                                desc: "Proteja seus eletrônicos e móveis do desbotamento solar com películas certificadas."
                            },
                            {
                                icon: PiggyBank, title: "Menos Energia", stat: "30%", label: "Economia Real",
                                desc: "Com menos calor entrando, seu ar-condicionado trabalha com menos esforço, reduzindo a conta de luz."
                            },
                            {
                                icon: Lock, title: "Entrega em 24h", stat: "24", label: "Horas p/ Instalar",
                                desc: "Diferencial LUME: orçamento rápido e instalação realizada em até 24 horas em Campo Grande."
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
                        <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-10 text-center text-[#c9a227] tracking-tight underline decoration-[#c9a227]/20 underline-offset-8">Insulfilm em Campo Grande</h2>
                        
                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light text-center lg:text-justify mb-16 px-4 md:px-0">
                            <p>
                                Campo Grande é a região que mais cresce tecnologicamente na Zona Oeste, e a infraestrutura dos novos condomínios e lojas exige películas que acompanhem esse padrão. Se você está na Estrada do Monteiro, na Estrada da Posse ou próximo ao West Shopping, a LUME é a sua parceira local para controle solar.
                            </p>
                            <p>
                                Nosso atendimento em Campo Grande foca na agilidade. Sabemos que você não quer esperar semanas por um orçamento. Com nosso sistema de **orçamento gratuito pelo WhatsApp**, você resolve tudo em minutos e tem sua película instalada profissionalmente em até 24 horas.
                            </p>
                        </div>
                        
                        <div className="grid lg:grid-cols-2 gap-12 items-stretch mt-12 text-left">
                            <div className="glass-card p-10 rounded-3xl border border-white/10 flex flex-col h-full bg-white/[0.01]">
                                <h3 className="text-2xl font-bold font-['Montserrat'] mb-8 text-white flex items-center gap-3">
                                    <MapPin size={24} className="text-[#c9a227]" /> Atendimento Especializado CG
                                </h3>
                                <p className="text-gray-400 leading-relaxed mb-8 text-base font-light">
                                    Realizamos medições técnicas precisas e levamos amostras das películas top de linha até o seu endereço. Instalação rápida, limpa e com acabamento elite.
                                </p>
                                <ul className="space-y-4 mb-4">
                                    <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Orçamento Sem Compromisso via Zap</li>
                                    <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Instalação Express em até 24 Horas</li>
                                    <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Garantia Lume de 5 anos (Redução Real de Calor)</li>
                                </ul>
                            </div>

                            <div className="bg-[#111e33] p-10 rounded-3xl border border-white/10 h-full shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <MapPin size={120} className="text-white" />
                                </div>
                                <h4 className="text-[#c9a227] font-black uppercase tracking-[0.2em] text-sm mb-8 flex items-center gap-3">
                                    <Zap size={18} className="animate-pulse" /> Atendimento Imediato
                                </h4>
                                <div className="space-y-6 relative z-10">
                                    <p className="text-gray-300 font-bold text-lg mb-4">Regiões Atendidas em CG:</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Estrada do Monteiro</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Estrada da Posse</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Centro de CG</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Inhoaíba</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Cosmos</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Santíssimo</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Mendanha</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Guaratiba</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Paciência</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Santa Cruz</div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-6 pt-6 border-t border-white/5">Levamos a estrutura completa LUME até seu imóvel com preço justo e rapidez.</p>
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
                        <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-6 tracking-tight">FAQ - Insulfilm em Campo Grande</h2>
                        <p className="text-gray-500 font-medium">Principais dúvidas sobre preço, prazos e qualidade.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "1. Qual o valor da instalação de insulfilm em Campo Grande?",
                                a: "Os valores variam de acordo com o tamanho dos vidros e o tipo de material (Nano Cerâmica, Carbono, etc.). Oferecemos orçamento gratuito via WhatsApp agora mesmo — basta enviar as medidas."
                            },
                            {
                                q: "2. Qual o prazo para instalação em Campo Grande?",
                                a: "Nosso diferencial é o prazo: realizamos a aplicação em até 24 horas após a confirmação do orçamento, sem esperas intermináveis."
                            },
                            {
                                q: "3. O insulfilm realmente tira o calor em Campo Grande?",
                                a: "Sim, nossas películas de Nano Cerâmica rejeitam até 80% do calor infravermelho. Isso resulta numa redução térmica real dentro do seu ambiente, dependendo da exposição solar."
                            },
                            {
                                q: "4. Qual a garantia do serviço da LUME?",
                                a: "Oferecemos garantia contratual de 5 anos. Nossas películas profissionais mantêm suas propriedades térmicas e estabilidade de cor por muito mais tempo que versões comuns, sem desbotar ou criar bolhas."
                            },
                            {
                                q: "5. Atendem condomínios residenciais e empresas?",
                                a: "Sim, somos especialistas em atendimento arquitetônico (imóveis). Atendemos casas, apartamentos e comércios em toda a região de Campo Grande."
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

            {/* Chamada para Ação (CTA Final) - Elegant Redesign */}
            <section className="py-24 relative overflow-hidden bg-[#070f1a]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] to-[#070f1a]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a227]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#25d366]/5 blur-[120px] rounded-full" />

                <div className="container-lume relative z-10 px-4">
                    <div className="max-w-5xl mx-auto glass-card border border-white/10 rounded-[2.5rem] p-8 md:p-16 text-center animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent opacity-30" />
                        
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 font-['Montserrat'] tracking-tighter leading-tight">
                            Seu Imóvel Protegido em <span className="text-gradient-gold">Campo Grande</span>
                        </h2>
                        
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                            Aproveite nossa <strong className="text-white">instalação express em 24h</strong>. Qualidade premium com o melhor custo-benefício da Zona Oeste.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <a
                                href="https://wa.me/5521965140612?text=Olá! Quero um orçamento gratuito de insulfilm em Campo Grande."
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
                                Ver Todos os Produtos
                            </Link>
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center gap-8 text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#c9a227]" /> 5 Anos de Garantia</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#c9a227]" /> Foco em Performance</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#c9a227]" /> Orçamento Grátis</span>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 bg-[#070f1a] border-t border-white/5 text-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] px-4">
                 © 2026 Lume Controle Solar · Especialista em Campo Grande e Zona Oeste
            </footer>
        </div>
    );
}
