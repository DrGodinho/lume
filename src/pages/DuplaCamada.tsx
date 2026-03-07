import { useEffect } from 'react';
import { Sun, Droplets, Zap, ShieldCheck, Layers, ArrowRight } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import gsap from 'gsap';

export function DuplaCamadaPage() {
    useEffect(() => {
        // SEO Meta Tags
        document.title = "Insulfilm Dupla Camada RJ (G5 e G20) | Fim do Calor em Bangu - LUME";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute("content", "Insulfilm Dupla Camada G5 e G20 no Rio de Janeiro. A solução definitiva com arquitetura metalizada para até 95% de bloqueio de calor. Especialistas em Bangu.");
        }

        // Entrance Animation
        gsap.fromTo('.page-entrance',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 }
        );

        // Inject JSON-LD Schema
        const schemaLocalBusiness = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "LUME Películas de Controle Solar",
            "image": "https://seusite.com.br/logo.png",
            "@id": "",
            "url": "https://seusite.com.br/dupla-camada",
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
            "description": "Especialistas em instalação de Insulfilm Dupla Camada (G5 e G20) na Zona Oeste do Rio. Alta redução de calor e excelente custo-benefício."
        };

        const schemaService = {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Instalação de Insulfilm Dupla Camada (Residencial e Comercial)",
            "provider": {
                "@type": "LocalBusiness",
                "name": "LUME Películas de Controle Solar"
            },
            "areaServed": {
                "@type": "City",
                "name": "Rio de Janeiro"
            },
            "description": "Instalação profissional de película Dupla Camada G5 e G20. Rejeição de até 95% do infravermelho, proteção UV extrema e estética premium para fechamento de varandas e janelas em Bangu, Campo Grande, e toda Zona Oeste do RJ."
        };

        const schemaFAQ = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Qual a durabilidade da película Dupla Camada contra o sol do Rio de Janeiro?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Ao contrário dos filmes tintados que duram meses, a arquitetura Dupla Camada (com deposição de alumínio ou titânio) possui estabilidade prolongada, sendo fabricada para suportar a radiação intensa do Rio de Janeiro por longos e belos anos sem gerar bolhas."
                    }
                },
                {
                    "@type": "Question",
                    "name": "A visibilidade interna é afetada fechando a varanda com Dupla Camada?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "A percepção visual depende do grau escolhido. O G5 fecha a visão diurna completamente de fora para dentro (privacidade máxima), mas obscurece a visão noturna de dentro para fora. Já a versão G20 entrega a melhor claridade ótica e conforto visual sem esforçar a vista de quem está dentro de casa."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Essa película funciona para fechamento de varandas de vidro?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Perfeitamente. A película Dupla Camada é a atual campeã em custo-benefício (custando em média R$ 150/m² instalada) para envidraçamentos de grandes varandas na Barra da Tijuca e Recreio, onde a necessidade de bloquear o calor do sol da tarde é crítica para a usabilidade do ambiente."
                    }
                }
            ]
        };

        const scriptLB = document.createElement('script');
        scriptLB.type = 'application/ld+json';
        scriptLB.text = JSON.stringify(schemaLocalBusiness);
        document.head.appendChild(scriptLB);

        const scriptService = document.createElement('script');
        scriptService.type = 'application/ld+json';
        scriptService.text = JSON.stringify(schemaService);
        document.head.appendChild(scriptService);

        const scriptFAQ = document.createElement('script');
        scriptFAQ.type = 'application/ld+json';
        scriptFAQ.text = JSON.stringify(schemaFAQ);
        document.head.appendChild(scriptFAQ);

        return () => {
            document.head.removeChild(scriptLB);
            document.head.removeChild(scriptService);
            document.head.removeChild(scriptFAQ);
        };
    }, []);

    return (
        <div className="bg-[#070f1a] text-white min-h-screen">
            <WhatsAppButton />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-gradient-to-br from-[#0c182c] to-[#040912]" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="container-lume relative z-10 page-entrance text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm">
                        Resistência Extrema ao Sol do Rio 🌞
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-['Montserrat'] mb-6 leading-tight">
                        Insulfilm <span className="text-gradient-gold">Dupla Camada</span> <br className="hidden lg:block" />(G5 e G20)
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed">
                        A união impecável de <strong>Privacidade, Estética Premium e Escudo Térmico</strong>. Construída com metais nobres interligados para rejeitar agressivamente o forte calor carioca direto da sua janela.
                    </p>

                    <a
                        href="https://wa.me/5521965140612?text=Olá! Quero proteger minha casa com Filme Dupla Camada contra o sol."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8"
                    >
                        Pedir Orçamento sem Compromisso <ArrowRight size={20} />
                    </a>
                </div>
            </section>

            {/* Como reduz a conta de luz? (SEO focado em RJ/Bangu) */}
            <section className="py-20 bg-[#0a1628] border-b border-white/5 px-4">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-8 text-white">O Fim da Conta de Luz nas Alturas na Zona Oeste</h2>
                        <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                            Se você mora ou possui comércio em <strong>Bangu, Campo Grande, Realengo ou adjacências</strong>, sabe que as temperaturas de verão não são uma mera inconveniência; elas são um dreno financeiro maciço na sua conta de energia por causa dos aparelhos de Ar Condicionado ligados no 16ºC, operando em pico durante o dia todo.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            O <strong>Insulfilm Dupla Camada</strong> é projetado especificamente para barrar esse ciclo destrutivo. Ao instalar esse material nas suas janelas de vidro ou varandas fechadas, a película rejeita brutalmente a radiação solar térmica *antes* mesmo dela aquecer o ar da sua sala. Quando a temperatura interna é estabilizada pela película, o seu Inverter gela o ambiente com <strong>metade do esforço</strong>. O retorno do investimento dessa película ($150/m²) se paga mês a mês reduzindo sua tarifa de energia elétrica.
                        </p>
                    </div>
                </div>
            </section>

            {/* Arquitetura Técnica */}
            <section className="py-20 relative px-4">
                <div className="container-lume page-entrance text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-4 text-[#c9a227]">A Ciência da Super Rejeição Térmica</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">Por que ela é muito superior a filmes básicos do mercado?</p>
                </div>

                <div className="container-lume grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Layers, title: "Dual Poliéster", desc: "Estrutura composta por duas lâminas ópticas ultrarresistentes garantindo opacidade perfeita que não descasca." },
                        { icon: ShieldCheck, title: "Deposição Metálica", desc: "No processo a vácuo, recebe nano partículas de alumínio ou titânio, transformando o vidro num espelho emissor de calor." },
                        { icon: Sun, title: "Adesivo Bloqueador UV", desc: "Revestimento colante premium com inibidores que barram 99% da degradação nos seus móveis finos e pele." },
                        { icon: Droplets, title: "Anti-Risco Superior", desc: "Top Coat (revestimento superior) em acrílico resistente a abrasão da poeira e tecidos da limpeza doméstica." },
                    ].map((feature, idx) => (
                        <div key={idx} className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 hover:border-[#c9a227]/30 transition-colors page-entrance text-center sm:text-left">
                            <div className="w-14 h-14 mx-auto sm:mx-0 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* Matriz Comparativa G5 vs G20 */}
            <section className="py-24 relative px-4 bg-[#050A11]">
                <div className="container-lume page-entrance text-center mb-16">
                    <div className="inline-flex flex-col items-center">
                        <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-2 text-white">Escolha sua Dupla Camada</h2>
                        <span className="text-[#c9a227] font-semibold tracking-wide bg-[#c9a227]/10 px-4 py-1 rounded-full text-sm">Apenas R$ 150/m² Instalado</span>
                    </div>
                </div>

                <div className="container-lume grid lg:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">

                    {/* G5 Card */}
                    <div className="glass-card rounded-3xl border border-white/5 hover:border-[#c9a227]/50 transition-all duration-300 page-entrance overflow-hidden flex flex-col relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#c9a227]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="h-32 bg-[#020508] border-b border-white/10 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-90 z-10"></div>
                            <h3 className="text-5xl font-black text-white/90 z-20 font-['Montserrat'] tracking-tighter">G5</h3>
                            <span className="absolute bottom-4 right-4 text-xs font-bold bg-[#c9a227] text-black px-2 py-1 rounded shadow-lg">MÁXIMA PERFORMANCE</span>
                        </div>
                        <div className="p-8 md:p-10 flex-grow relative z-10">
                            <p className="text-gray-300 mb-8 leading-relaxed">
                                A couraça impenetrável do calor. Recomendamos avidamente o G5 Dupla Camada para <strong>Salas de TV</strong> e <strong>Quartos</strong> muito ensolarados, onde você necessita barrar 100% da visão dos vizinhos (efeito diurno) garantindo uma densa redução térmica e luminosidade controlada extrema para assistir telas.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-1"><span className="text-gray-400 flex items-center gap-1">VLT <span className="text-xs text-gray-600">(Luz)</span></span> <span className="font-bold">5% a 8%</span></div>
                                    <div className="w-full bg-gray-800 rounded h-1.5"><div className="bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.5)] h-1.5 rounded" style={{ width: '8%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1"><span className="text-gray-400 flex items-center gap-1">Proteção UV</span> <span className="font-bold text-[#c9a227]">99%</span></div>
                                    <div className="w-full bg-gray-800 rounded h-1.5"><div className="bg-[#c9a227] shadow-[0_0_10px_rgba(201,162,39,0.5)] h-1.5 rounded" style={{ width: '99%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1"><span className="text-gray-400 flex items-center gap-1">Rejeição de Calor (IRR)</span> <span className="font-bold text-[#c9a227]">Arrasadores 95%</span></div>
                                    <div className="w-full bg-gray-800 rounded h-1.5"><div className="bg-[#c9a227] shadow-[0_0_10px_rgba(201,162,39,0.5)] h-1.5 rounded" style={{ width: '95%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-white/5"><span className="text-gray-400 flex items-center gap-1"><Zap size={14} className="text-[#c9a227]" /> TSER Térmico Total</span> <span className="font-bold text-lg text-white">Até 75%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* G20 Card */}
                    <div className="glass-card rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 page-entrance overflow-hidden flex flex-col relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="h-32 bg-[#121b2b] border-b border-white/10 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0a101a] to-transparent opacity-80 z-10"></div>
                            <h3 className="text-5xl font-black text-white/90 z-20 font-['Montserrat'] tracking-tighter">G20</h3>
                            <span className="absolute bottom-4 left-4 text-xs font-bold border border-blue-400/50 text-blue-300/90 px-2 py-1 rounded bg-blue-900/20 backdrop-blur-sm">LUZ NATURAL + CONFORTO</span>
                        </div>
                        <div className="p-8 md:p-10 flex-grow relative z-10">
                            <p className="text-gray-300 mb-8 leading-relaxed">
                                A tonalidade clássica de altíssima busca para <strong>Fechamento Completo de Varandas</strong> Gourmet e salas envidraçadas onde a vista externa da praia, piscina ou horizonte não pode ser estrangulada, porém a radiação solar ardida da tarde é aniquilada pelos metais internos antes de queimar você.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-1"><span className="text-gray-400 flex items-center gap-1">VLT <span className="text-xs text-gray-600">(Luz)</span></span> <span className="font-bold">18% a 25%</span></div>
                                    <div className="w-full bg-gray-800 rounded h-1.5"><div className="bg-white/70 h-1.5 rounded" style={{ width: '25%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1"><span className="text-gray-400 flex items-center gap-1">Proteção UV</span> <span className="font-bold text-blue-400">99%</span></div>
                                    <div className="w-full bg-gray-800 rounded h-1.5"><div className="bg-blue-400/80 h-1.5 rounded shadow-[0_0_10px_rgba(96,165,250,0.5)]" style={{ width: '99%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1"><span className="text-gray-400 flex items-center gap-1">Rejeição de Calor (IRR)</span> <span className="font-bold text-blue-400">Poderosos 90%</span></div>
                                    <div className="w-full bg-gray-800 rounded h-1.5"><div className="bg-blue-400/80 shadow-[0_0_10px_rgba(96,165,250,0.5)] h-1.5 rounded" style={{ width: '90%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-white/5"><span className="text-gray-400 flex items-center gap-1"><Zap size={14} className="text-blue-400" /> TSER Térmico Total</span> <span className="font-bold text-lg text-white">Até 65%</span></div>
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
                        <h2 className="text-3xl font-bold font-['Montserrat'] mb-4 text-[#c9a227]">Respostas Rápidas e Claras</h2>
                        <p className="text-gray-400 text-lg">Tudo sobre a instalação da linha Dupla Camada.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Qual a durabilidade desta película contra o forte sol do Rio de Janeiro?",
                                a: "Ao contrário dos filmes tintados que perdem a cor em poucos meses, a arquitetura Dupla Camada (com deposição à vácuo firme da fábrica) possui estabilidade prolongada no seu design, sendo projetada quimicamente para suportar a radiação UV constante que enfrentamos na costa sem gerar a delaminação (bolhas)."
                            },
                            {
                                q: "A visibilidade interna do meu apartamento é afetada usando Dupla Camada?",
                                a: "A percepção visual depende do grau escolhido. O grau G5 fecha a visão agressivamente (ideal para isolar Quartos ou Home Theaters onde a escuridão é bem-vinda). Já a versão G20 é o 'grau arquiteto', que entrega nitidez ótica e conforto visual sem esforçar a vista de quem está dentro de casa."
                            },
                            {
                                q: "Essa película é a ideal para fechamento e cortina de vidro em mega varandas?",
                                a: "Perfeitamente. A película Dupla Camada é um verdadeiro escudo de batalha com custo espetacular para vastos envidraçamentos. Apenas certifique-se da regra do seu condomínio com o efeito levemente metalizado que essa película gera para a vista exterior."
                            }
                        ].map((faq, idx) => (
                            <details key={idx} className="group glass-card border flex-col rounded-xl overflow-hidden cursor-pointer">
                                <summary className="font-bold text-lg p-6 bg-white/[0.02] hover:bg-white/[0.05] transition-colors outline-none flex justify-between items-center list-none text-white">
                                    <span className="pr-4">{faq.q}</span>
                                    <span className="text-[#c9a227] group-open:rotate-45 transition-transform text-2xl font-light leading-none flex-shrink-0">+</span>
                                </summary>
                                <div className="p-6 pt-0 text-gray-400 bg-black/10 leading-relaxed border-t border-white/5 mt-0 transition-all">
                                    <div className="mt-4">{faq.a}</div>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
