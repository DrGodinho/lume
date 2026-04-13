import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Sun, Thermometer, CheckCircle, ArrowRight, Eye, SunDim, Star, PiggyBank, Lock, MapPin, Zap, MessageCircle, Droplets } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Particles } from '../components/Particles';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function RecreioPage() {
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
                <title>Insulfilm no Recreio dos Bandeirantes | Residencial e Comercial - LUME</title>
                <meta name="description" content="Instalação de insulfilm no Recreio dos Bandeirantes, Barra Bonita e Pontal. Proteção térmica premium para casas e apartamentos. Agende seu orçamento pelo WhatsApp." />
                <link rel="canonical" href="https://lumecontrolesolar.com.br/insulfilm-no-recreio" />

                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "LUME Películas de Controle Solar - Recreio",
                            "image": "https://lumecontrolesolar.com.br/novo-logo-lume.png",
                            "@id": "https://lumecontrolesolar.com.br/insulfilm-no-recreio",
                            "url": "https://lumecontrolesolar.com.br/insulfilm-no-recreio",
                            "telephone": "+5521965140612",
                            "priceRange": "$$$",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Atendimento no Recreio dos Bandeirantes",
                                "addressLocality": "Rio de Janeiro",
                                "addressRegion": "RJ",
                                "postalCode": "22790-000",
                                "addressCountry": "BR"
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": -23.0183,
                                "longitude": -43.4683
                            },
                            "areaServed": ["Recreio dos Bandeirantes", "Barra Bonita", "Pontal", "Gleba A", "Gleba B", "Terreirão", "Vargem Grande", "Vargem Pequena"],
                            "description": "Especialistas em instalação de insulfilm residencial e comercial no Recreio dos Bandeirantes. Películas de alta performance com padrão elite."
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
                        src="/recreio_hero_bg.png"
                        alt="Instalação de insulfilm profissional no Recreio dos Bandeirantes - LUME Controle Solar"
                        className="w-full h-full object-cover"
                        fetchPriority="high"
                        onError={(e) => {
                            e.currentTarget.src = "/campogrande_hero_bg.png"; // Fallback temporary
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
                        <span className="text-[#c9a227] text-sm font-bold uppercase tracking-wider">Recreio dos Bandeirantes</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-['Montserrat'] mb-6 leading-tight">
                        Insulfilm no <span className="text-gradient-gold">Recreio</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed font-light">
                        Conforto térmico absoluto para quem vive o melhor do Rio. Aplicação de películas residenciais e comerciais no Recreio com padrão de elite LUME.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="https://wa.me/5521965140612?text=Olá! Quero um orçamento de insulfilm no Recreio."
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
                            Linha de Produtos
                        </a>
                    </div>
                </div>
            </section>

            {/* Auto-Scroll Info Strip */}
            <section className="bg-[#c9a227] py-6 overflow-hidden relative z-20">
                <div className="container-lume">
                    <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-6 lg:gap-4 text-black font-extrabold uppercase tracking-widest text-xs lg:text-sm text-center">
                        <span className="flex items-center gap-2"><Thermometer size={18} /> Rejeição térmica de alta performance</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><Sun size={18} /> Bloqueio de 99% dos raios UV</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><Shield size={18} /> Privacidade para seu lar</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><CheckCircle size={18} /> Garantia Platinum de 5 anos</span>
                    </div>
                </div>
            </section>

            {/* Contexto Local Recreio */}
            <section className="py-24 bg-[#070f1a] relative px-4">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold font-['Montserrat'] mb-10 text-white">Proteção e sofisticação para o estilo Recreio</h2>
                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light text-left md:text-justify px-4">
                            <p>
                                O Recreio dos Bandeirantes é um bairro que respira qualidade de vida e contato com a natureza. No entanto, a alta exposição solar, especialmente nos apartamentos da <strong className="text-white">Gleba A</strong> e <strong className="text-white">Gleba B</strong>, pode transformar ambientes em locais quentes e desconfortáveis, além de danificar móveis devido à forte incidência de raios UV vinda do mar.
                            </p>
                            <p>
                                Na <strong className="text-white">LUME Controle Solar</strong>, entendemos as necessidades específicas do morador do Recreio. Se você vive na região de <strong className="text-white">Barra Bonita</strong> ou em prédios baixos próxios ao <strong className="text-white">Pontal</strong>, sabe que a privacidade e o controle térmico são fundamentais. Nossas películas de Nano Cerâmica são ideais para essas residências, pois barram o calor sem escurecer os ambientes nem interferir na recepção de sinal Wi-Fi e celular.
                            </p>
                            <p>
                                Atendemos em todos os eixos do Recreio: Avenida das Américas, Benvindo de Novaes e via Lúcio Costa. Oferecemos um atendimento consultivo, levando amostras físicas e realizando a medição técnica gratuita no local para garantir que seu projeto tenha o acabamento perfeito e a máxima durabilidade.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-3xl border border-white/10 relative overflow-hidden max-w-4xl mx-auto text-center">
                        <h3 className="text-2xl font-bold font-['Montserrat'] mb-8">Películas para Apartamentos e Lojas no Recreio</h3>
                        <p className="text-gray-400 leading-relaxed max-w-3xl mx-auto font-light text-lg">
                            Seja para reduzir o calor na sua varanda gourmet ou dar segurança e privacidade para sua loja de rua, a LUME entrega o melhor serviço de aplicação de películas do Recreio dos Bandeirantes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tipos de Película - Paridade Total */}
            <section id="tipos" className="py-24 bg-[#0a1628] border-y border-white/5 px-4 overflow-hidden relative">
                <div className="container-lume page-entrance relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-bold font-['Montserrat'] mb-6 text-white">
                            Películas de <span className="text-gradient-gold">Alta Performance</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
                            O melhor da tecnologia de controle solar para o seu imóvel no Recreio.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {[
                            {
                                title: "Nano Cerâmica", selo: "Top de Linha", icon: Star, image: "/product-nano-ceramica.jpg", path: "/nano-ceramica",
                                desc: "Máxima rejeição de calor com transparência tecnológica. Ideal para apartamentos no Recreio que querem proteção total sem perder a claridade natural do sol."
                            },
                            {
                                title: "Carbono Premium", selo: "Best-Seller", icon: SunDim, image: "/product-carbono.jpg", path: "/carbono",
                                desc: "O visual grafite elegante que nunca sai de moda. Rejeição térmica de alto nível com garantia de estabilidade de cor por muitos anos."
                            },
                            {
                                title: "Espelhado / Refletivo", selo: "Privacidade", icon: Sun, image: "/product-refletiva.jpg", path: "/refletiva",
                                desc: "Privacidade absoluta durante o dia. Reflete a luz solar externa drasticamente, reduzindo a temperatura em quartos e salas de forma imediata."
                            },
                            {
                                title: "Jateado / Fosco", selo: "Decoração", icon: Eye, image: "/product-jateado-v2.png", path: "/jateado",
                                desc: "Transforme vidros transparentes em foscos com elegância. Perfeito para banheiros, cozinhas e divisórias internas com acabamento profissional."
                            },
                            {
                                title: "Dupla Camada", selo: "Favorito", icon: Droplets, image: "/product-smoke.jpg", path: "/dupla-camada",
                                desc: "Tecnologia especial que combina redução de calor extrema com uma visão interna relaxante, ideal para enfrentar o sol da tarde no Recreio."
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
                                        href={`https://wa.me/5521965140612?text=Olá! Quero saber sobre a película ${product.title} no Recreio.`}
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

            {/* Vantagens que Valorizam seu Ambiente */}
            <section className="py-24 relative px-4 bg-[#070f1a] overflow-hidden">
                <div className="container-lume page-entrance">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-6 tracking-tight">Vantagens que Valorizam seu Imóvel</h2>
                        <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light">Garanta o conforto térmico da sua família no Recreio com películas de padrão Elite.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Thermometer, title: "Filtro de Calor", stat: "-8°C", label: "Na Temperatura",
                                desc: "Filtramos até 80% do calor externo, mantendo sua sala ou quarto muito mais agradável inclusive no auge do verão do Recreio."
                            },
                            {
                                icon: SunDim, title: "Bloqueio UV 99%", stat: "99%", label: "De Eficiência",
                                desc: "Acabe com o desbotamento de cortinas, sofás e eletrônicos provocado pela radiação solar constante em JPA/Barra/Recreio."
                            },
                            {
                                icon: PiggyBank, title: "Economia Extra", stat: "30%", label: "Menos Energia",
                                desc: "Otimize o uso do seu ar-condicionado e sinta a diferença na conta de luz todos os meses."
                            },
                            {
                                icon: Lock, title: "Filme Original", stat: "5 Anos", label: "De Garantia",
                                desc: "Trabalhamos exclusivamente com poliester de alta densidade que não cria bolhas, garantindo a estética do seu vidro por anos."
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

            {/* Região de Atendimento - Recreio */}
            <section className="py-24 bg-[#0a1628] border-y border-white/5 relative px-4 overflow-hidden">
                <div className="container-lume page-entrance relative z-10 text-center lg:text-left">
                    <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-10 text-center text-[#c9a227] tracking-tight underline decoration-[#c9a227]/20 underline-offset-8">Atendimento em todo o Recreio</h2>
                    
                    <div className="grid lg:grid-cols-2 gap-12 items-stretch mt-12 text-left">
                        <div className="glass-card p-10 rounded-3xl border border-white/10 flex flex-col h-full bg-white/[0.01]">
                            <h3 className="text-2xl font-bold font-['Montserrat'] mb-8 text-white flex items-center gap-3">
                                <MapPin size={24} className="text-[#c9a227]" /> Onde estamos no Recreio
                            </h3>
                            <p className="text-gray-400 leading-relaxed mb-8 text-base font-light">
                                Conhecemos cada canto do Recreio. Realizamos instalações rápidas e limpas em condomínios residenciais e centros comerciais, sempre com foco em alta performance e privacidade.
                            </p>
                            <ul className="space-y-4 mb-4">
                                <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Visita agendada em prédios e casas</li>
                                <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Medição técnica com amostras físicas</li>
                                <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Padrão de acabamento Elite LUME</li>
                            </ul>
                        </div>

                        <div className="bg-[#111e33] p-10 rounded-3xl border border-white/10 h-full shadow-2xl relative overflow-hidden group">
                            <h4 className="text-[#c9a227] font-black uppercase tracking-[0.2em] text-sm mb-8 flex items-center gap-3">
                                <Zap size={18} className="animate-pulse" /> Sub-áreas atendidas
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-400 uppercase tracking-wider relative z-10">
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Recreio dos Bandeirantes</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Barra Bonita</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Pontal</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Gleba A</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Gleba B</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Terreirão</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Vargem Grande</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Vargem Pequena</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Guiomar de Novaes</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Estrada do Pontal</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Perguntas Frequentes (FAQ) - Adaptado para Recreio */}
            <section className="py-24 relative px-4 overflow-hidden bg-[#070f1a]">
                <div className="container-lume page-entrance max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-black font-['Montserrat'] mb-6 tracking-tight">Perguntas Frequentes (FAQ)</h2>
                        <p className="text-gray-500 font-medium">Esclareça suas principais dúvidas sobre aplicação no Recreio.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "1. Quanto custa instalar insulfilm residencial no Recreio?",
                                a: "O valor é baseado no tipo de película e na área total dos vidros. No Recreio, atendemos desde projetos compactos até grandes coberturas. Oferecemos orçamento rápido pelo WhatsApp, basta nos enviar as medidas ou agendar uma medição no local."
                            },
                            {
                                q: "2. Qual o melhor tipo de insulfilm para apartamentos no Recreio?",
                                a: "Para as Glebas A e B, onde a incidência solar é alta, as películas de Nano Cerâmica são as campeãs por barrarem o calor mantendo a transparência. Se a busca for por privacidade, a linha Carbono Premium G5 ou G20 é a mais indicada."
                            },
                            {
                                q: "3. O insulfilm residencial descola com a maresia do Recreio?",
                                a: "Nossas películas são de poliester de alta densidade com adesivos químicos resistentes. Diferente de materiais de baixa qualidade, nossas películas não descolam nem criam 'oxidação' com a maresia típica do Pontal e arredores."
                            },
                            {
                                q: "4. Quanto tempo dura a película depois de instalada?",
                                a: "Trabalhamos com materiais de padrão elite que mantém sua eficiência térmica e cor original por 8 a 15 anos. Elas possuem camada anti-risco para facilitar a limpeza do dia a dia."
                            },
                            {
                                q: "5. O serviço tem garantia oficial no Recreio?",
                                a: "Sim. Oferecemos 5 anos de garantia oficial da LUME Controle Solar cobrindo instalação e material. Sua satisfação total é o nosso compromisso no bairro."
                            },
                            {
                                q: "6. Posso instalar em varandas gourmet de vidro?",
                                a: "Com certeza. Somos especialistas em fechamento de varandas. A película reduz a temperatura da varanda drasticamente, transformando-a em uma área realmente útil inclusive no verão carioca."
                            },
                            {
                                q: "7. O insulfilm altera muito a luminosidade interna?",
                                a: "Isso depende de você. Temos filmes de Nano Cerâmica que são quase imperceptíveis ao olho humano, mas que barram o calor brutalmente. Também temos opções mais escuras para quem prefere ambientes mais privativos."
                            },
                            {
                                q: "8. Atendem comércios e academias na região do Recreio?",
                                a: "Sim. Realizamos aplicações em vitrines de lojas, janelas de escritórios e academias locais, garantindo conforto térmico e privacidade para clientes e colaboradores."
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

            {/* CTA Final */}
            <section className="py-24 relative overflow-hidden bg-[#070f1a]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] to-[#070f1a]" />
                <div className="container-lume relative z-10 px-4 text-center">
                    <div className="max-w-5xl mx-auto glass-card border border-white/10 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 font-['Montserrat'] tracking-tighter">
                             Sua Casa Fresca no <span className="text-gradient-gold">Recreio</span>
                        </h2>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12 font-light">
                            Estamos prontos para atender seu imóvel no Recreio, Barra Bonita e Pontal com a melhor durabilidade do Rio.
                        </p>
                        <a
                            href="https://wa.me/5521965140612?text=Olá! Gostaria de um orçamento de insulfilm residencial no Recreio."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25d366] hover:bg-[#20bd5a] text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.05] inline-flex items-center gap-4 text-sm"
                        >
                            <MessageCircle size={22} /> Orçamento via WhatsApp
                        </a>
                    </div>
                </div>
            </section>

             <footer className="py-12 bg-[#070f1a] border-t border-white/5 text-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] px-4">
                 © 2026 Lume Controle Solar · Especialista no Recreio dos Bandeirantes e Zona Oeste
            </footer>
        </div>
    );
}
