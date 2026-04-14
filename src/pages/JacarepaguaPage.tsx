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

export function JacarepaguaPage() {
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
                <title>Insulfilm em Jacarepaguá | Residenciais e Comerciais - LUME</title>
                <meta name="description" content="Aplicação de insulfilm em Jacarepaguá, Freguesia e Taquara. Películas de alta performance para controle solar e privacidade. Atendimento profissional na Zona Oeste." />
                <link rel="canonical" href="https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua" />

                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "LUME Películas de Controle Solar - Jacarepaguá",
                            "image": "https://lumecontrolesolar.com.br/novo-logo-lume.png",
                            "@id": "https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua",
                            "url": "https://lumecontrolesolar.com.br/insulfilm-em-jacarepagua",
                            "telephone": "+5521965140612",
                            "priceRange": "$$$",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Atendimento em Jacarepaguá",
                                "addressLocality": "Rio de Janeiro",
                                "addressRegion": "RJ",
                                "postalCode": "22750-000",
                                "addressCountry": "BR"
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": -22.9300,
                                "longitude": -43.3400
                            },
                            "areaServed": ["Freguesia", "Taquara", "Pechincha", "Anil", "Curicica", "Tanque", "Gardenia Azul", "Cidade de Deus", "Praça Seca", "Vila Valqueire", "Jacarepaguá"],
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": "5.0",
                                "reviewCount": "52"
                            },
                            "description": "Especialistas em instalação de insulfilm residencial e comercial em Jacarepaguá. Películas de alta performance com 5 anos de garantia."
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
                        src="/jacarepagua_hero_bg.webp"
                        alt="Instalação de insulfilm profissional em Jacarepaguá - LUME Controle Solar"
                        className="w-full h-full object-cover"
                        fetchPriority="high"
                        onError={(e) => {
                            e.currentTarget.src = "/bangu_hero_bg.webp"; // Fallback temporary
                        }}
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
                        <span className="text-[#c9a227] text-sm font-bold uppercase tracking-wider">Jacarepaguá e Região</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-['Montserrat'] mb-6 leading-tight">
                        Insulfilm em <span className="text-gradient-gold">Jacarepaguá</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed font-light">
                        Proteja seu lar ou comércio no coração da Zona Oeste com películas de controle solar de elite. Atendimento especializado na Freguesia, Taquara, Pechincha e região.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="https://wa.me/5521965140612?text=Olá! Quero um orçamento de insulfilm em Jacarepaguá."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8 transform transition hover:scale-105"
                        >
                            Orçamento pelo WhatsApp <ArrowRight size={20} />
                        </a>
                        <a
                            href="#tipos"
                            className="btn-outline inline-flex items-center justify-center gap-3 text-lg py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-widest text-sm"
                        >
                            Modelos de Película
                        </a>
                    </div>
                </div>
            </section>

            {/* Auto-Scroll Info Strip */}
            <section className="bg-[#c9a227] py-6 overflow-hidden relative z-20">
                <div className="container-lume">
                    <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-6 lg:gap-4 text-black font-extrabold uppercase tracking-widest text-xs lg:text-sm text-center">
                        <span className="flex items-center gap-2"><Thermometer size={18} /> Até 80% de rejeição de calor</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><Sun size={18} /> 99% bloqueio de raios UV</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><Shield size={18} /> Proteção Solar de Elite</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><CheckCircle size={18} /> Garantia de 5 anos Lume</span>
                    </div>
                </div>
            </section>

            {/* Contexto Local JPA */}
            <section className="py-24 bg-[#070f1a] relative px-4">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold font-['Montserrat'] mb-10">Conforto térmico em meio às montanhas de JPA</h2>
                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light text-left md:text-justify px-4">
                            <p>
                                Jacarepaguá é uma das regiões geográficas mais diversas do Rio, combinando áreas de montanha com a proximidade da Baixada de Jacarepaguá. O sol intenso da tarde, especialmente frequente em bairros como a <strong className="text-white">Taquara</strong> e <strong className="text-white">Curicica</strong>, exige proteção de alto nível para manter o ambiente interno habitável sem o uso 24h do ar-condicionado.
                            </p>
                            <p>
                                Na <strong className="text-white">Freguesia</strong> e no <strong className="text-white">Anil</strong>, o foco muitas vezes recai sobre a privacidade em prédios de apartamentos e a proteção de móveis e pisos de alto padrão que sofrem com a radiação UV constante. Nossas películas de Nano Cerâmica são as favoritas para quem não quer abrir mão da vista para as montanhas, mas precisa barrar o calor.
                            </p>
                            <p>
                                Realizamos instalações profissionais em residências, coberturas, lojas e centros comerciais em toda a Estrada de Jacarepaguá, Geremário Dantas e Estrada dos Três Rios. A <strong className="text-white">LUME Controle Solar</strong> leva a solução definitiva em películas para o seu endereço com agilidade e acabamento premium.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-3xl border border-white/10 relative overflow-hidden max-w-4xl mx-auto text-center">
                        <h3 className="text-2xl font-bold font-['Montserrat'] mb-8">Atendimento em Jacarepaguá e Região</h3>
                        <p className="text-gray-400 leading-relaxed max-w-3xl mx-auto font-light text-lg">
                            Levamos as amostras de películas até você. Seja na Taquara, Pechincha ou Freguesia, nossa equipe técnica realiza a medição exata e sugere o material ideal para o seu vidro, garantindo performance e estética.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tipos de Película - Paridade Total com Bangu */}
            <section id="tipos" className="py-24 bg-[#0a1628] border-y border-white/5 px-4 overflow-hidden relative">
                <div className="container-lume page-entrance relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold font-['Montserrat'] mb-6 text-white">
                            Películas de <span className="text-gradient-gold">Alta Performance</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
                            Conheça as principais opções tecnológicas que trabalhamos e descubra qual resolve o seu problema de calor ou privacidade em Jacarepaguá.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {[
                            {
                                title: "Nano Cerâmica", selo: "Top de Linha", icon: Star, image: "/product-nano-ceramica.webp", path: "/nano-ceramica",
                                desc: "A linha de maior performance do mercado. A película nano cerâmica rejeita até 95% do calor infravermelho sem precisar escurecer o ambiente, mantendo os vidros transparentes e a luminosidade natural preservada. Ideal para quem quer manter a vista em JPA."
                            },
                            {
                                title: "Carbono Premium", selo: "Best-Seller", icon: SunDim, image: "/product-carbono.webp", path: "/carbono",
                                desc: "Película fumê fabricada a partir de nano carbono. Combina um visual elegante e escurecido com excelente rejeição térmica (até 80%). Disponível nas tonalidades G20 e G5, o Carbono é o mais escolhido na Freguesia para janelas e portas que precisam de privacidade total."
                            },
                            {
                                title: "Espelhado / Refletivo", selo: "Privacidade", icon: Sun, image: "/product-refletiva.webp", path: "/refletiva",
                                desc: "A escolha certa para quem quer privacidade total durante o dia com um visual moderno na fachada. Reflete a luz solar externamente, reduzindo drasticamente a temperatura e bloqueando a visão de fora para dentro."
                            },
                            {
                                title: "Jateado / Fosco", selo: "Decoração", icon: Eye, image: "/product-jateado-v2.webp", path: "/jateado",
                                desc: "Solução ideal para banheiros, portas de vidro, divisórias e cozinhas que precisam de privacidade total sem perder luminosidade. O efeito fosco simula o vidro jateado com um custo muito menor."
                            },
                            {
                                title: "Dupla Camada", selo: "Favorito", icon: Droplets, image: "/product-smoke.webp", path: "/dupla-camada",
                                desc: "Alta redução de calor com uma tecnologia especial: camada refletiva externa e camada fumê interna. Diferente das películas comuns, reduz o reflexo interno à noite. Excelente para o sol de JPA."
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
                                        href={`https://wa.me/5521965140612?text=Olá! Quero saber sobre a película ${product.title} em Jacarepaguá.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3.5 rounded-xl bg-[#111e33] hover:bg-[#c9a227] text-gray-300 hover:text-[#0a1628] text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 border border-white/5"
                                    >
                                        Quero Orçamento <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefícios / Vantagens - Paridade Total com Bangu */}
            <section className="py-24 relative px-4 bg-[#070f1a] overflow-hidden">
                <div className="container-lume page-entrance">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-6 tracking-tight">Vantagens que Valorizam seu Ambiente</h2>
                        <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light">Investir em películas de controle solar é garantir conforto imediato e economia a longo prazo em Jacarepaguá.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Thermometer, title: "Redução de Calor", stat: "-8°C", label: "Na Temperatura",
                                desc: "Películas premium rejeitam até 80% do calor solar direto, mantendo o ambiente fresco inclusive em Jacarepaguá."
                            },
                            {
                                icon: SunDim, title: "Proteção UV 99%", stat: "99%", label: "De Bloqueio",
                                desc: "Proteja sua pele da radiação e evite o desbotamento rápido de pisos, móveis e cortinas do seu lar em JPA."
                            },
                            {
                                icon: PiggyBank, title: "Economia de Energia", stat: "30%", label: "Menos Luz",
                                desc: "Menos uso de ar-condicionado significa contas mensais menores em bairros quentes como Curicica e Taquara."
                            },
                            {
                                icon: Lock, title: "Qualidade de Elite", stat: "100%", label: "Filme Original",
                                desc: "Trabalhamos com películas de procedência certificada, com garantia oficial de 5 anos pela LUME Controle Solar."
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

            {/* Região de Atendimento - JPA */}
            <section className="py-24 bg-[#0a1628] border-y border-white/5 relative px-4 overflow-hidden">
                <div className="container-lume page-entrance relative z-10">
                    <div className="max-w-4xl mx-auto text-center lg:text-left">
                        <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-10 text-center text-[#c9a227] tracking-tight underline decoration-[#c9a227]/20 underline-offset-8">Atendimento Jacarepaguá</h2>
                        
                        <div className="grid lg:grid-cols-2 gap-12 items-stretch mt-12 text-left">
                            <div className="glass-card p-10 rounded-3xl border border-white/10 flex flex-col h-full bg-white/[0.01]">
                                <h3 className="text-2xl font-bold font-['Montserrat'] mb-8 text-white flex items-center gap-3">
                                    <MapPin size={24} className="text-[#c9a227]" /> Onde estamos em JPA
                                </h3>
                                <p className="text-gray-400 leading-relaxed mb-8 text-base font-light">
                                    Cobrimos toda a bacia de Jacarepaguá. Se você está na Freguesia, Taquara ou Pechincha, nossa equipe técnica está a poucos minutos de distância para uma avaliação precisa.
                                </p>
                                <ul className="space-y-4 mb-4">
                                    <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Visita em condomínios e lojas</li>
                                    <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Orçamento imediato via WhatsApp</li>
                                    <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Padrão de instalação Elite LUME</li>
                                </ul>
                            </div>

                            <div className="bg-[#111e33] p-10 rounded-3xl border border-white/10 h-full shadow-2xl relative overflow-hidden group">
                                <h4 className="text-[#c9a227] font-black uppercase tracking-[0.2em] text-sm mb-8 flex items-center gap-3">
                                    <Zap size={18} className="animate-pulse" /> Sub-bairros atendidos
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Freguesia</div>
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Taquara</div>
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Pechincha</div>
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Anil</div>
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Curicica</div>
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Tanque</div>
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Praça Seca</div>
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Vila Valqueire</div>
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Gardenia Azul</div>
                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Rio das Pedras</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Perguntas Frequentes (FAQ) - Adaptado para JPA */}
            <section className="py-24 relative px-4 overflow-hidden bg-[#070f1a]">
                <div className="container-lume page-entrance max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-6 tracking-tight">Perguntas Frequentes (FAQ)</h2>
                        <p className="text-gray-500 font-medium">Principais dúvidas sobre a aplicação em Jacarepaguá.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "1. Quanto custa instalar insulfilm residencial em Jacarepaguá?",
                                a: "O valor depende da película escolhida e da metragem total. Atendemos JPA com orçamentos competitivos. Linhas como Nano Cerâmica têm custo maior por m², mas economizam mais energia a longo prazo. Fale conosco no WhatsApp para um cálculo rápido."
                            },
                            {
                                q: "2. Qual o melhor insulfilm para a Freguesia ou Taquara?",
                                a: "Devido ao calor intenso dessas áreas, recomendamos Nano Cerâmica ou Dupla Camada para máxima rejeição térmica. Se você mora em apartamento e precisa de privacidade sem escurecer muito, a Nano Cerâmica G70 é perfeita."
                            },
                            {
                                q: "3. O insulfilm residencial danifica o vidro?",
                                a: "Não. A aplicação profissional LUME utiliza solventes neutros. O filme de fato protege o vidro contra o estresse térmico direto e segura estilhaços em caso de quebra acidental."
                            },
                            {
                                q: "4. Quanto tempo dura o insulfilm instalado pela LUME?",
                                a: "Trabalhamos com poliester de alta densidade. Diferente de películas baratas que duram 1 ano, as nossas mantêm a performance e a cor original por 8 a 15 anos se bem cuidadas."
                            },
                            {
                                q: "5. Qual a garantia oferecida em Jacarepaguá?",
                                a: "Você recebe nossa garantia oficial de 5 anos cobrindo qualquer defeito de material ou falha na aplicação. Sua satisfação é nossa prioridade absoluta."
                            },
                            {
                                q: "6. Posso instalar em janelas com molduras de madeira ou alumínio?",
                                a: "Sim. Nossos instaladores são treinados para trabalhar com todos os tipos de esquadrias comuns em JPA, garantindo o corte preciso que evita infiltrações e descolamento."
                            },
                            {
                                q: "7. O insulfilm escurece muito a minha sala?",
                                a: "Somente se você desejar. Temos opções 'invisíveis' que filtram 99% do calor sem mudar a transparência do vidro, preservando a vista para as montanhas de Jacarepaguá."
                            },
                            {
                                q: "8. Atendem prédios comerciais e academias em JPA?",
                                a: "Sim. Temos ampla experiência em fachadas comerciais, lojas no Pechincha e escritórios em centros empresariais, oferecendo garantia e eficiência para o negócio."
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
            <section className="py-24 relative overflow-hidden bg-[#070f1a]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] to-[#070f1a]" />
                <div className="container-lume relative z-10 px-4">
                    <div className="max-w-5xl mx-auto glass-card border border-white/10 rounded-[2.5rem] p-8 md:p-16 text-center animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent opacity-30" />
                        
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 font-['Montserrat'] tracking-tighter leading-tight">
                            Proteja seu Lar do <span className="text-gradient-gold">Calor de JPA</span>
                        </h2>
                        
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                            Agende uma visita técnica gratuita em <strong className="text-white">Jacarepaguá</strong> e descubra por que somos referência em controle solar na Zona Oeste.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <a
                                href="https://wa.me/5521965140612?text=Olá! Gostaria de um orçamento de insulfilm residencial em Jacarepaguá."
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
                                Voltar para Início
                            </Link>
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center gap-8 text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#c9a227]" /> 5 Anos de Garantia</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#c9a227]" /> Conforto Térmico Real</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#c9a227]" /> Instalação Padrão Elite</span>
                        </div>
                    </div>
                </div>
            </section>

             <footer className="py-12 bg-[#070f1a] border-t border-white/5 text-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] px-4">
                 © 2026 Lume Controle Solar · Especialista em Jacarepaguá e Zona Oeste
            </footer>
        </div>
    );
}
