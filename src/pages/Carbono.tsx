import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, CheckCircle, EyeOff, Wifi, ArrowRight } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { ContactCTA } from '../sections/ContactCTA';
import { SpecTooltip } from '../components/SpecTooltip';
import gsap from 'gsap';

export function CarbonoPage() {
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
                <title>Insulfilm Carbono Premium RJ (G5 e G20) | Privacidade em Bangu - LUME</title>
                <meta name="description" content="Insulfilm Carbono Premium G5 e G20. Privacidade máxima, preto intenso que não desbota e rejeição de calor de até 90%. Instalação em Bangu e Zona Oeste RJ." />
                <link rel="canonical" href="https://lumecontrolesolar.com.br/carbono" />

                
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "LUME Películas de Controle Solar",
                            "image": "https://lumecontrolesolar.com.br/novo-logo-lume.png",
                            "@id": "https://lumecontrolesolar.com.br/carbono",
                            "url": "https://lumecontrolesolar.com.br/carbono",
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
                            "description": "Especialistas em instalação de Insulfilm Carbono Premium G5 e G20 no Rio de Janeiro. A solução definitiva para privacidade absoluta e altíssimo conforto térmico."
                        }
                    `}
                </script>

                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [
                                {
                                    "@type": "Question",
                                    "name": "A película Carbono G5 tira a visão de dentro para fora à noite?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "A linha Carbono Premium possui excelente nitidez ótica de dentro para fora durante o dia. À noite, por ser um grau muito escuro (G5 com VLT de 5%), a visibilidade noturna para fora é reduzida. Para quem prioriza visão noturna perfeita mantendo o tom escuro por fora, a nossa recomendação costuma ser o Carbono G20."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Qual a diferença entre o Insulfilm Carbono Premium e o filme comum tingido?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "A diferença é brutal. O filme comum tingido perde a cor, desbota, fica roxo em poucos meses sob o forte sol do Rio de Janeiro e retém baixíssimo calor. A película Carbono Premium possui nano-partículas de carbono em sua estrutura, garantindo uma proteção térmica massiva (até 90% IRR) e uma estabilidade de cor permanente (nunca ficará roxo)."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "O filme Carbono interfere no sinal de celular ou GPS em casa?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Não! Totalmente zero interferência. Por ser uma tecnologia não-metálica (ao contrário das antigas películas refletivas ou espelhadas), a linha Carbono permite a passagem livre de todos os sinais de rádio, Wi-Fi, 5G e GPS."
                                    }
                                }
                            ]
                        }
                    `}
                </script>

                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "Product",
                            "name": "Insulfilm Carbono Premium G5 e G20",
                            "image": "https://lumecontrolesolar.com.br/product-carbono.jpg",
                            "description": "Cor preto profundo que não desbota. Privacidade máxima com rejeição de calor de até 90%.",
                            "brand": {
                                "@type": "Brand",
                                "name": "LUME Películas"
                            },
                            "offers": {
                                "@type": "Offer",
                                "url": "https://lumecontrolesolar.com.br/carbono",
                                "priceCurrency": "BRL",
                                "price": "80.00",
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
            {/* WhatsApp Floating Button */}
            <WhatsAppButton />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-gradient-to-br from-[#050B14] to-[#0A1628]" />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="container-lume relative z-10 page-entrance text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6">
                        <span className="text-[#c9a227] text-sm font-bold uppercase tracking-wider">A Estética do Preto Intenso absoluto</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-['Montserrat'] mb-6 leading-tight">
                        Insulfilm <span className="text-gradient-gold">Carbono</span> Premium
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed">
                        Esqueça os filmes tingidos que ficam roxos e desbotam com o tempo. Descubra a linha definitiva para <strong>privacidade absoluta, cor permanente e altíssima rejeição de calor</strong>.
                    </p>

                    <a
                        href="https://wa.me/5521965140612?text=Olá! Quero um orçamento para Insulfilm Carbono no meu imóvel."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8"
                    >
                        Solicitar Orçamento no WhatsApp <ArrowRight size={20} />
                    </a>
                </div>
            </section>

            {/* Introduction - SEO FOCUS Bangu/RJ */}
            <section className="py-20 bg-[#0a1628] border-b border-white/5">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold font-['Montserrat'] mb-8 text-white">Por que o Insulfilm Carbono é o queridinho da Zona Oeste?</h2>
                        <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                            Nas residências e comércios do Rio de Janeiro, especialmente em bairros onde o sol é inclemente como <strong>Bangu, Campo Grande, Senador Camará e Realengo</strong>, a insolação intensa não apenas eleva as contas de luz ao extremo usando os ares-condicionados, como destrói tapetes, cortinas e estofados da noite para o dia.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            Por muito tempo, as pessoas recorriam aos "filmes escurecedores de R$30" (filmes tingidos e tintados comuns). O resultado? Em menos de seis meses a película criava bolhas terríveis, virava roxa e perdia qualquer capacidade protetiva. A nossa <strong>Linha Carbono Premium</strong> chegou para acabar com isso. Através da incorporação de nanopartículas de carbono reais, nós oferecemos a cor preta mais profunda e sofisticada do mercado, unida a uma barreira térmica colossal (reduzindo até 90% dos Raios Infravermelhos), blindando seu ambiente com garantia de não desbotamento.
                        </p>
                    </div>
                </div>
            </section>


            {/* Matriz Comparativa G5 vs G20 */}
            <section className="py-24 relative px-4 bg-[#050A11]">
                <div className="container-lume page-entrance text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-4 text-[#c9a227]">Escolha seu Grau de Privacidade</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">A exata transparência ideal para a necessidade da sua residência ou empresa (Apenas R$ 80/m² instalado).</p>
                </div>

                <div className="container-lume grid lg:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">

                    {/* G5 Card */}
                    <div className="glass-card rounded-3xl border border-white/5 hover:border-[#c9a227]/40 transition-all duration-300 page-entrance overflow-hidden flex flex-col">
                        <div className="h-32 bg-black flex items-center justify-center relative border-b border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-80 z-10"></div>
                            <h3 className="text-5xl font-black text-white/90 z-20 font-['Montserrat'] tracking-tighter">G5</h3>
                            <span className="absolute bottom-4 right-4 text-xs font-bold bg-[#c9a227] text-black px-2 py-1 rounded">PRIVACIDADE ABSOLUTA</span>
                        </div>
                        <div className="p-8 md:p-10 flex-grow relative z-10">
                            <p className="text-gray-300 mb-8 leading-relaxed">
                                A escolha número um para fechamento total de visão de fora para dentro. Ideal para janelas de térreo, guaritas, e portas de vidro voltadas para ruas movimentadas. Onde a discrição máxima manda.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <SpecTooltip term="VLT"><span className="text-gray-400">VLT (Transmissão de Luz)</span></SpecTooltip>
                                        <span className="font-bold text-white">5% a 8%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded h-1.5"><div className="bg-[#c9a227] h-1.5 rounded shadow-[0_0_10px_rgba(201,162,39,0.3)]" style={{ width: '8%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <SpecTooltip term="UVR"><span className="text-gray-400">Proteção UV</span></SpecTooltip>
                                        <span className="font-bold text-[#c9a227]">99%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded h-1.5"><div className="bg-[#c9a227] h-1.5 rounded shadow-[0_0_10px_rgba(201,162,39,0.3)]" style={{ width: '99%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <SpecTooltip term="IRR"><span className="text-gray-400">Rejeição de Calor (IRR)</span></SpecTooltip>
                                        <span className="font-bold text-[#c9a227]">Até 90%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded h-1.5"><div className="bg-[#c9a227] h-1.5 rounded shadow-[0_0_10px_rgba(201,162,39,0.3)]" style={{ width: '90%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <SpecTooltip term="TSER"><span className="text-gray-400">TSER (Poder Total)</span></SpecTooltip>
                                        <span className="font-bold text-white text-lg">Até 70%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded h-1.5 border border-white/5"><div className="bg-[#c9a227] h-1.5 rounded opacity-60" style={{ width: '70%' }}></div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* G20 Card */}
                    <div className="glass-card rounded-3xl border border-white/5 hover:border-[#c9a227]/40 transition-all duration-300 page-entrance overflow-hidden flex flex-col">
                        <div className="h-32 bg-[#1a1a1a] flex items-center justify-center relative border-b border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-transparent opacity-80 z-10"></div>
                            <h3 className="text-5xl font-black text-white/90 z-20 font-['Montserrat'] tracking-tighter">G20</h3>
                            <span className="absolute bottom-4 left-4 text-xs font-bold border border-[#c9a227]/30 text-[#c9a227] px-2 py-1 rounded">EQUILÍBRIO PERFEITO</span>
                        </div>
                        <div className="p-8 md:p-10 flex-grow relative z-10">
                            <p className="text-gray-300 mb-8 leading-relaxed">
                                A tonalidade mais vendida para apartamentos e escritórios. Oferece uma excelente estética fumê por fora garantindo privacidade diurna, mas permite uma espetacular claridade visual suave de dentro para fora, excelente para visão noturna.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <SpecTooltip term="VLT"><span className="text-gray-400">VLT (Transmissão de Luz)</span></SpecTooltip>
                                        <span className="font-bold text-white">18% a 25%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded h-1.5"><div className="bg-[#c9a227] h-1.5 rounded shadow-[0_0_10px_rgba(201,162,39,0.3)]" style={{ width: '22%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <SpecTooltip term="UVR"><span className="text-gray-400">Proteção UV</span></SpecTooltip>
                                        <span className="font-bold text-[#c9a227]">99%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded h-1.5"><div className="bg-[#c9a227] h-1.5 rounded shadow-[0_0_10px_rgba(201,162,39,0.3)]" style={{ width: '99%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <SpecTooltip term="IRR"><span className="text-gray-400">Rejeição de Calor (IRR)</span></SpecTooltip>
                                        <span className="font-bold text-[#c9a227]">Até 85%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded h-1.5"><div className="bg-[#c9a227] h-1.5 rounded shadow-[0_0_10px_rgba(201,162,39,0.3)]" style={{ width: '85%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <SpecTooltip term="TSER"><span className="text-gray-400">TSER (Poder Total)</span></SpecTooltip>
                                        <span className="font-bold text-white text-lg">Até 60%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded h-1.5 border border-white/5"><div className="bg-[#c9a227] h-1.5 rounded opacity-60" style={{ width: '60%' }}></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Diferenciais Técnicos */}
            <section className="py-20 relative px-4">
                <div className="container-lume page-entrance text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-4 text-white">Por que o Carbono é superior aos filmes comuns?</h2>
                </div>

                <div className="container-lume grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: EyeOff, title: "Estética Premium", desc: "Seu vidro com um 'Preto Piano' luxuoso. Modifica o exterior da casa entregando extrema requinte e sofisticação." },
                        { icon: CheckCircle, title: "Garantia Anti-Desbotamento", desc: "Filme tingido desbota porque o corante seca pelo calor. Carbono possui moléculas que resistem à degradação térmica para sempre." },
                        { icon: Wifi, title: "Sinal Livre", desc: "Por não conter metal em suas várias camadas, garante não gerar 'gaiolas de farraday', permitindo que celulares, 5G, roteadores e rádio funcionem 100%." },
                        { icon: Shield, title: "Proteção Física", desc: "Revestimento anti-risco de elite e uma camada adesiva formidável que funciona como película de forte retenção de cacos de vidro soltos contra acidentes." },
                    ].map((feature, idx) => (
                        <div key={idx} className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 hover:border-[#c9a227]/30 transition-colors page-entrance">
                            <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 relative px-4 bg-[#0a1628] border-t border-white/5">
                <div className="container-lume page-entrance max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-['Montserrat'] mb-4">Dúvidas Frequentes da Linha Carbono</h2>
                        <p className="text-gray-400">Desmistificando o insulfilm profissional</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "A película Carbono G5 tira a visão de dentro para fora à noite?",
                                a: "A linha Carbono Premium possui excelente nitidez ótica de dentro para fora durante o dia. À noite, por ser um grau muito escuro (G5 com VLT de 5%), a visibilidade noturna para fora é bastante reduzida. Para quem prioriza visão noturna perfeita mantendo o tom escuro por fora, a nossa recomendação costuma ser o Carbono G20, ou até ir para linhas ainda mais claras tecnologicamente como a Nano Cerâmica."
                            },
                            {
                                q: "Qual a diferença entre o Insulfilm Carbono Premium e o filme fumê comum de loja de calçada?",
                                a: "A diferença é brutal. O filme comum tingido barato perde a cor, desbota, fica roxo em pouquíssimos meses sob o forte sol do Rio de Janeiro, tende a formar bolhas grosseiras e retém quase nada de calor. A película Carbono Premium possui estruturas complexas baseadas em carbono e poliéster nobre, garantindo uma proteção térmica massiva (até 90% IRR) e uma estabilidade de cor permanente (estética intacta ao longo dos anos)."
                            },
                            {
                                q: "O filme Carbono interfere no sinal de celular ou GPS em casa?",
                                a: "Não! Totalmente zero interferência. Por ser uma tecnologia não-metálica (ao contrário das antigas películas refletivas ou espelhadas), a linha Carbono permite a passagem e o trânsito livre de todas as ondas vitais para o mundo moderno: sinais de rádio, Wi-Fi 2.4/5GHz, dados móveis 5G e sinais locais de rastreamento por GPS."
                            }
                        ].map((faq, idx) => (
                            <details key={idx} className="group glass-card border flex-col rounded-xl overflow-hidden cursor-pointer">
                                <summary className="font-bold text-lg p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors outline-none flex justify-between items-center list-none text-white">
                                    {faq.q}
                                    <span className="text-[#c9a227] group-open:rotate-45 transition-transform text-2xl font-light leading-none">+</span>
                                </summary>
                                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2">
                                    {faq.a}
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
