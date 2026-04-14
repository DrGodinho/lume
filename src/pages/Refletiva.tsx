import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { EyeOff, ShieldCheck, ThermometerSnowflake, Ruler, ArrowRight, Home, Sun, Zap, Thermometer } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { ContactCTA } from '../sections/ContactCTA';
import { SpecTooltip } from '../components/SpecTooltip';
import gsap from 'gsap';

export function RefletivaPage() {
    useEffect(() => {
        // Entrance Animation
        gsap.fromTo('.page-entrance',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 }
        );
    }, []);

    return (
        <div className="bg-[#070f1a] text-white min-h-screen">
            <Helmet>
                <title>Insulfilm Refletivo Prata RJ | Privacidade e Fim do Calor - LUME</title>
                <meta name="description" content="Película Refletiva (Espelhada) no Rio de Janeiro. Efeito One-Way Mirror para privacidade diurna absoluta e redução drástica de calor. Excelente para Bangu." />
                <link rel="canonical" href="https://lumecontrolesolar.com.br/refletiva" />

                
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "LUME Películas de Controle Solar",
                            "image": "https://lumecontrolesolar.com.br/novo-logo-lume.png",
                            "@id": "https://lumecontrolesolar.com.br/refletiva",
                            "url": "https://lumecontrolesolar.com.br/refletiva",
                            "telephone": "+5521965140612",
                            "priceRange": "$$",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "Zona Oeste",
                                "addressLocality": "Rio de Janeiro",
                                "addressRegion": "RJ",
                                "postalCode": "21810-000",
                                "addressCountry": "BR"
                            },
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": -22.8767,
                                "longitude": -43.4651
                            },
                            "areaServed": ["Bangu", "Campo Grande", "Realengo", "Barra da Tijuca", "Recreio", "Zona Oeste RJ"],
                            "description": "Especialistas em instalação de Insulfilm Refletivo (Prata/Espelhado) no Rio de Janeiro. A solução clássica para privacidade diurna e rejeição de calor extrema."
                        }
                    `}
                </script>

                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "Product",
                            "name": "Insulfilm Refletivo Clássico (Prata)",
                            "image": "https://lumecontrolesolar.com.br/product-refletiva.webp",
                            "description": "Película espelhada prata com altíssima rejeição térmica (até 85% IRR). Garante privacidade diurna total com o efeito One-Way Mirror.",
                            "brand": {
                                "@type": "Brand",
                                "name": "LUME Películas"
                            },
                            "offers": {
                                "@type": "Offer",
                                "url": "https://lumecontrolesolar.com.br/refletiva",
                                "priceCurrency": "BRL",
                                "price": "95.00",
                                "unitText": "m²",
                                "availability": "https://schema.org/InStock",
                                "seller": {
                                    "@type": "LocalBusiness",
                                    "name": "LUME Controle Solar"
                                }
                            }
                        }
                    `}
                </script>
            </Helmet>
            <WhatsAppButton />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-gradient-to-br from-[#101c2e] to-[#040912]" />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="container-lume relative z-10 page-entrance text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_15px_rgba(201,162,39,0.2)]">
                        O Clássico que Derrota o Calor 🛡️
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-['Montserrat'] mb-6 leading-tight">
                        Insulfilm <span className="text-gradient-gold">Refletivo</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed font-light">
                        A solução brutal contra as tardes derretedoras do Rio de Janeiro. Transforme suas janelas de vidro plano num escudo de prata: <strong className="text-white">Privacidade Absoluta</strong> e o fim do ofuscamento solar na sua sala.
                    </p>

                    <a
                        href="https://wa.me/5521965140612?text=Olá! Gostaria de um orçamento para o Insulfilm Refletivo."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8"
                    >
                        Quero Orçamento Rápido via WhatsApp <ArrowRight size={20} />
                    </a>
                </div>
            </section>

            {/* Introdução com Foco Geográfico */}
            <section className="py-20 bg-[#0a1628] border-b border-white/5 px-4">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-8 text-white">Privacidade Diurna e Blindagem Térmica Extrema</h2>
                        <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                            É indiscutível: os bairros da Zona Oeste do Rio como <strong>Bangu, Senador Camará e Campo Grande</strong> recebem a irradiação solar mais impiedosa do estado. Muitos clientes constroem belas frentes envidraçadas e percebem no primeiro verão que a sala de estar tornou-se uma estufa de vidro, forçando o Ar Condicionado ao seu limite enquanto toda a vizinhança na rua os observa no sofá de casa.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            O <strong>Insulfilm Refletivo Clássico (Prata)</strong> entra em cena desarmando esse problema pela metade do preço de outras soluções. Com a sua poderosa camada metálica que espelha os raios solares logo na face externa do vidro, ele chuta mais de 70% da energia solar global para fora de casa (TSER). O resultado? Um ar condicionado operando suavemente e uma fachada moderna que se parece com o exterior prateado de um edifício executivo de elite.
                        </p>
                    </div>
                </div>
            </section>

            {/* Entendendo o Efeito One-Way Mirror */}
            <section className="py-24 relative px-4 bg-[#050A11]">
                <div className="container-lume page-entrance max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 glass-card p-10 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-[#c9a227]/30 transition-all">
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#c9a227]/5 rounded-full blur-3xl group-hover:bg-[#c9a227]/10 transition-colors"></div>
                            <h3 className="text-3xl font-bold font-['Montserrat'] mb-6 text-[#c9a227]">A Mágica do "One-Way Mirror"</h3>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Você já se perguntou como as salas de interrogatório funcionam nos filmes? O truque físico se baseia estritamente na iluminação!
                            </p>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Durante o dia, o lado que reflete luz atua como um espelho de prata massivo. Pessoas caminhando pela rua olharão para a sua fachada envidraçada mas só conseguirão enxergar a eles mesmos refletidos na película. Enquanto isso, do lado de dentro da sala, onde a sombra é predominante, você tem uma visão nítida do mundo exterior com um tom repousante.
                            </p>
                            <div className="bg-black/40 border border-white/5 p-4 rounded-xl inline-flex items-center gap-3">
                                <EyeOff className="text-[#c9a227]" size={24} />
                                <span className="font-semibold text-sm">Ninguém consegue vigiar a sua família da rua de dia.</span>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 space-y-8">
                            <div>
                                <h2 className="text-4xl lg:text-5xl font-bold font-['Montserrat'] mb-4 text-white">Composição Metalizada</h2>
                                <p className="text-gray-400 text-lg">Uma arquitetura em que uma camada densa de fita de metal precioso é fundida eletronicamente contra as paredes do filme PET.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#1a3a5c]/50 flex items-center justify-center flex-shrink-0 border border-blue-500/20 text-blue-400">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Poliéster de Grau Ótico</h4>
                                        <p className="text-sm text-gray-400">Base flexível e firme, a fundação mestre da película, trazendo segurança passiva.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#c9a227]/10 flex items-center justify-center flex-shrink-0 border border-[#c9a227]/20 text-[#c9a227]">
                                        <ThermometerSnowflake size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Deposição a Vácuo</h4>
                                        <p className="text-sm text-gray-400">Aplicação atômica do metal (alumínio) encarregado da barreira que manda o calor de volta para atmosfera.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#1a3a5c]/50 flex items-center justify-center flex-shrink-0 border border-blue-500/20 text-blue-400">
                                        <Ruler size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Adesivo High-Performance Sensível a Pressão</h4>
                                        <p className="text-sm text-gray-400">O material transparente que impregna a película ao vidro para a vida toda.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabela Técnica de Performance */}
            <section className="py-24 relative px-4">
                <div className="container-lume page-entrance text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-4 text-white">O Raio-X da Linha Refletiva Prata</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">Performance testada e garantida para o calor subtropical. E a melhor parte? O preço incrivelmente acessível.</p>
                    <span className="inline-flex px-6 py-2 bg-gradient-to-r from-[#c9a227]/80 to-[#c9a227] text-black font-black uppercase text-xl rounded-lg shadow-[0_0_20px_rgba(201,162,39,0.3)] tracking-wider">
                        R$ 95/m² Instalado
                    </span>
                </div>

                <div className="container-lume max-w-4xl mx-auto page-entrance">
                    <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Features Text */}
                            <div className="p-8 md:p-12 bg-black/40 border-r border-white/5 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold mb-4 font-['Montserrat']">Por que esses números importam?</h3>
                                <p className="text-gray-400 leading-relaxed text-sm lg:text-base mb-6">
                                    Os metais contidos nessa película atacam com ferocidade o Espectro Eletromagnético Solar que carrega energia quente. Uma rejeição de 70% do TSER significa que para cada hora de sol implacável ardendo contra a sua janela, somente 30% da potência térmica desse raio conseguirá vazar para sua casa.
                                </p>
                                <div className="flex items-center gap-3 text-sm text-blue-300/80 uppercase font-bold tracking-widest mt-auto">
                                    <Home size={18} /> Alta Resistência Residencial
                                </div>
                            </div>

                            {/* Table Data */}
                            <div className="p-8 md:p-12 bg-[#02050A]">
                                <div className="space-y-8">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-300 font-medium flex items-center gap-2">
                                                <Sun size={18} className="text-[#c9a227]" />
                                                <SpecTooltip term="VLT">VLT (Transmissão de Luz)</SpecTooltip>
                                            </span>
                                            <span className="font-bold text-white text-lg">8% a 35%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div className="bg-[#c9a227] h-2 rounded-full shadow-[0_0_10px_rgba(201,162,39,0.3)]" style={{ width: '35%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Nível agressivo de escurecimento para máxima proteção diurna.</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-300 font-medium flex items-center gap-2">
                                                <ShieldCheck size={18} className="text-[#c9a227]" />
                                                <SpecTooltip term="UVR">Bloqueio UV (UltraVioleta)</SpecTooltip>
                                            </span>
                                            <span className="font-bold text-[#c9a227] text-lg">99%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div className="bg-[#c9a227] h-2 rounded-full shadow-[0_0_10px_rgba(201,162,39,0.5)]" style={{ width: '99%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Móveis, estofados, tapetes e pele blindados.</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-300 font-medium flex items-center gap-2">
                                                <Thermometer size={18} className="text-[#c9a227]" />
                                                <SpecTooltip term="IRR">Infravermelho (IRR)</SpecTooltip>
                                            </span>
                                            <span className="font-bold text-white text-lg">70% a 85%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div className="bg-[#c9a227] h-2 rounded-full shadow-[0_0_10px_rgba(201,162,39,0.3)]" style={{ width: '85%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Supressão fortíssima das ondas diretas do calor sentidas na pele.</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-white font-bold flex items-center gap-2 uppercase tracking-wider">
                                                <Zap size={18} className="text-[#c9a227]" />
                                                <SpecTooltip term="TSER">TSER (Poder Total)</SpecTooltip>
                                            </span>
                                            <span className="font-bold text-white text-xl">65% a 78%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-white/5">
                                            <div className="bg-gradient-to-r from-[#c9a227] to-white h-2 rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">A métrica definitiva da eficiência energética no calor extremo.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 relative px-4 bg-[#0a1628] border-t border-white/5">
                <div className="container-lume page-entrance max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-['Montserrat'] mb-4">Dúvidas Frequentes</h2>
                        <p className="text-gray-400">Instalação e funcionalidade do Filme Refletivo (A linha R Prata).</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Como funciona o efeito espelhado? Ele some de noite?",
                                a: "Sim, isso é pura física ótica. A camada metalizada faz com que o lado com mais luz vire o espelho. De dia, a luz avassaladora do sol atinge as janelas pelo lado de fora e forma o espelho na rua. À noite, a rua escurece, e se você ligar a lâmpada da sala as leis da luz se revertem: o espelho se voltará para o interior e as pessoas na rua poderão ver a sua sala tranquilamente. Se proteção noturna for fundamental, conheça nossa linha Dupla Camada (versões fechadas)."
                            },
                            {
                                q: "Pode ser instalada em qualquer vidro? (Vidros Canelados, Temperados, etc...)",
                                a: "O material é focado para superfícies 100% lisas (retas). Não pode ser aplicado sobre o lado canelado do vidro. Sobre a resistência do vidro, por reter muita energia solar na face exterior, certas composições de vidros duplos muito velhos ou irregulares não temperados detestam choque térmico. Mas se atende ao padrão normal do RJ com vidros lisos normais/temperados será totalmente aplicável."
                            },
                            {
                                q: "Qual a durabilidade desta película diante do sol do Rio de Janeiro?",
                                a: "Para aplicações de uso interno (quando fixamos de dentro da sala virado para vidro), uma película espelhada de alto padrão que oferecemos não desbota por degradação seca como tintas comuns. São materiais compostos para servirem de barreira solar pesada, mantendo integridade e performance ao longo dos anos suportando tranquilamente sua fachada no pico do verão 40°."
                            }
                        ].map((faq, idx) => (
                            <details key={idx} className="group glass-card border flex-col rounded-xl overflow-hidden cursor-pointer bg-white/[0.01]">
                                <summary className="font-bold text-lg p-6 hover:bg-white/[0.04] transition-colors outline-none flex justify-between items-center list-none text-white">
                                    <span className="pr-4">{faq.q}</span>
                                    <span className="text-[#c9a227] group-open:rotate-45 transition-transform text-2xl font-light leading-none flex-shrink-0">+</span>
                                </summary>
                                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-0 transition-all bg-black/20">
                                    <div className="mt-4">{faq.a}</div>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA Section */}
            <ContactCTA />
        </div>
    );
}
