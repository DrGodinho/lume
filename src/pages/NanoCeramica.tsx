import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Sun, Thermometer, CheckCircle, Zap, Wifi, ArrowRight } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { ContactCTA } from '../sections/ContactCTA';
import { SpecTooltip } from '../components/SpecTooltip';
import gsap from 'gsap';

export function NanoCeramicaPage() {
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
                <title>Insulfilm Nano Cerâmica Premium RJ | Redução de Calor em Bangu - LUME</title>
                <meta name="description" content="Conheça o Insulfilm Nano Cerâmica Premium da LUME. Máxima redução de calor sem escurecer os vidros. Atendimento especializado em Bangu e Zona Oeste RJ." />
                
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "LUME Películas de Controle Solar",
                            "image": "https://lumecontrolesolar.netlify.app/novo-logo-lume.png",
                            "@id": "https://lumecontrolesolar.netlify.app/nano-ceramica",
                            "url": "https://lumecontrolesolar.netlify.app/nano-ceramica",
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
                            "areaServed": ["Bangu", "Campo Grande", "Realengo", "Barra da Tijuca", "Recreio", "Zona Oeste RJ"],
                            "description": "Especialistas em instalação de Insulfilm Nano Cerâmica Premium no Rio de Janeiro. Conforto térmico, proteção UV e redução de calor sem espelhar."
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
                                    "name": "O Insulfilm Nano Cerâmica pode ser instalado em apartamentos e condomínios?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Sim! Como a película de Nano Cerâmica possui baixíssima refletividade (não é espelhada) e mantém a transparência do vidro, ela é a opção número um para apartamentos e condomínios com regras rígidas de fachada no Rio de Janeiro."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "A película Nano Cerâmica desbota com o forte calor do Rio de Janeiro?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Não. Diferente das películas tintadas comuns que ficam roxas com o tempo, a Nano Cerâmica Premium da LUME possui estabilidade de cor permanente. Sua tecnologia não baseada em tintas garante a estética original por muitos anos."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "É possível economizar luz na conta usando película térmica?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Absolutamente. Com uma rejeição de calor (IRR) de até 95%, o ambiente interno esfria muito mais rápido, reduzindo drasticamente o esforço e o tempo de uso do seu ar-condicionado. Em locais muito quentes como Bangu e Zona Oeste, nossos clientes relatam melhorias extremas no consumo de energia."
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
                            "name": "Insulfilm Nano Cerâmica Premium",
                            "image": "https://lumecontrolesolar.netlify.app/novo-logo-lume.png",
                            "description": "Máxima redução de calor sem escurecer os vidros. Ideal para varandas gourmet e vitrines.",
                            "brand": {
                                "@type": "Brand",
                                "name": "LUME Películas"
                            },
                            "offers": {
                                "@type": "Offer",
                                "url": "https://lumecontrolesolar.netlify.app/nano-ceramica",
                                "priceCurrency": "BRL",
                                "price": "220.00",
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
                    {/* Placeholder image for hero -> Replace with real asset when available */}
                    <div className="w-full h-full bg-gradient-to-br from-[#122338] to-[#0a1628]" />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="container-lume relative z-10 page-entrance text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6">
                        <span className="text-[#c9a227] text-sm font-bold uppercase tracking-wider">A Escolha de Luxo no RJ</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-['Montserrat'] mb-6 leading-tight">
                        Insulfilm <span className="text-gradient-gold">Nano Cerâmica</span> Premium
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed">
                        A evolução do controle solar. Reduza drasticamente o calor intenso do Rio de Janeiro sem escurecer os vidros ou alterar a fachada do seu imóvel.
                    </p>

                    <a
                        href="https://wa.me/5521965140612?text=Olá! Quero um orçamento para Insulfilm Nano Cerâmica no meu imóvel."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8"
                    >
                        Solicitar Orçamento Grátis <ArrowRight size={20} />
                    </a>
                </div>
            </section>

            {/* Introduction & SEO Hook */}
            <section className="py-20 bg-[#0a1628] border-b border-white/5">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold font-['Montserrat'] mb-8 text-white">Por que a Nano Cerâmica é a melhor escolha para a Zona Oeste?</h2>
                        <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                            Morar no Rio de Janeiro, especialmente em bairros como <strong>Bangu, Campo Grande, Barra e Recreio</strong>, significa enfrentar temperaturas extremas em grande parte do ano. O insulfilm residencial comum não é mais suficiente. Se você tem uma varanda gourmet, uma sala com amplos vidros ou uma fachada moderna, encontrar uma película que neutralize o calor sem transformar sua casa em uma "caverna escura" sempre foi um desafio.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            É aqui que a tecnologia da nossa <strong>Película Nano Cerâmica Premium</strong> brilha. Através da nanotecnologia, esta película atua diretamente nos raios infravermelhos (os reais causadores do abafamento), criando um escudo invisível de extremo conforto térmico e bloqueio UV, enquanto mantém 100% da identidade arquitetônica do seu ambiente livre de distorções.
                        </p>
                    </div>
                </div>
            </section>

            {/* Diferenciais Técnicos */}
            <section className="py-20 relative px-4">
                <div className="container-lume page-entrance text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-4 text-[#c9a227]">Diferenciais Tecnológicos</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Muito além de um filme escurecedor. Proteção avançada e durabilidade incomparável para seu lar.</p>
                </div>

                <div className="container-lume grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Wifi, title: "Tecnologia Não-Metálica", desc: "Diferente das películas refletivas, a cerâmica não contém metais em sua liga. Isso garante ZERO interferência nos sinais de Wi-Fi, 5G ou GPS da sua residência." },
                        { icon: Shield, title: "Estabilidade de Cor Permanente", desc: "Avançada proteção contra desbotamento. Sem chances da sua película ficar roxa ou descascar com a alta exposição agressiva do sol carioca." },
                        { icon: Sun, title: "Alta Claridade Natural", desc: "Alta rejeição dos raios infravermelhos (IR) mantendo a mais alta entrada de luz (VLT). Proteja-se do calor invisivelmente." },
                    ].map((feature, idx) => (
                        <div key={idx} className="glass-card p-8 rounded-2xl border border-white/5 hover:border-[#c9a227]/30 transition-colors page-entrance">
                            <div className="w-14 h-14 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Composição Detalhada & Tabela de Performance */}
            <section className="py-20 bg-[#0a1628]">
                <div className="container-lume page-entrance">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-6">A Engenharia por trás da Nano Cerâmica</h2>
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
                                    <div key={idx} className="flex gap-4">
                                        <div className="mt-1"><CheckCircle className="text-[#c9a227]" size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-[#c9a227]/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a227] blur-[100px] opacity-20" />

                            <h3 className="text-2xl font-bold font-['Montserrat'] text-white mb-2 border-b border-white/10 pb-4">Tabela de Performance</h3>
                            <div className="mb-8 text-[#c9a227] font-bold text-xl uppercase tracking-wider">A partir de R$ 220/m² instalado</div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300 font-medium flex items-center gap-2">
                                            <Sun size={18} className="text-[#c9a227]" />
                                            <SpecTooltip term="UVR">Bloqueio UV (UltraVioleta)</SpecTooltip>
                                        </span>
                                        <span className="font-bold text-white text-lg">99,9%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                        <div className="bg-[#c9a227] h-2 rounded-full" style={{ width: '99%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Proteção total p/ móveis, pisos de madeira e tecidos.</p>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300 font-medium flex items-center gap-2">
                                            <Thermometer size={18} className="text-[#c9a227]" />
                                            <SpecTooltip term="IRR">Rejeição de Calor (IRR)</SpecTooltip>
                                        </span>
                                        <span className="font-bold text-white text-lg">Até 95%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                        <div className="bg-[#c9a227] h-2 rounded-full" style={{ width: '95%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">O verdadeiro choque térmico que você sente na pele e no ambiente.</p>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300 font-medium flex items-center gap-2">
                                            <Zap size={18} className="text-[#c9a227]" />
                                            <SpecTooltip term="TSER">TSER (Energia Rejeitada)</SpecTooltip>
                                        </span>
                                        <span className="font-bold text-white text-lg">55% a 65%</span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                        <div className="bg-[#c9a227] h-2 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Medida global do total de energia solar barrada pela janela.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 relative px-4">
                <div className="container-lume page-entrance max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-['Montserrat'] mb-4">Dúvidas Frequentes (FAQ)</h2>
                        <p className="text-gray-400">Respostas rápidas sobre a Instalação da Nano Cerâmica</p>
                    </div>

                    <div className="space-y-4">
                        {[
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
                                a: "Absolutamente. Com uma altíssima rejeição de calor por infravermelho, o ambiente interno da sua residência ou empresa esfria muito mais rápido mantendo a climatização estável, reduzindo drasticamente o esforço e o tempo de ativação do compressor do seu ar-condicionado. Em locais muito intensos de calor como em Bangu e toda a Zona Oeste, nossos clientes relatam incríveis economias e maior conforto."
                            }
                        ].map((faq, idx) => (
                            <details key={idx} className="group glass-card border flex-col rounded-xl overflow-hidden cursor-pointer">
                                <summary className="font-bold text-lg p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors outline-none flex justify-between items-center list-none">
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
