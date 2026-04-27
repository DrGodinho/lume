'use client';

import { useEffect } from 'react';
import { EyeOff, Sun, Layers, Droplets, Gem, ArrowRight, Building2, ShieldCheck, Thermometer, Zap } from 'lucide-react';
import { ContactCTA } from '../sections/ContactCTA';
import { SpecTooltip } from '../components/SpecTooltip';
import gsap from 'gsap';
import Image from 'next/image';

export function JateadoPage() {
    useEffect(() => {
        // Entrance Animation
        gsap.fromTo('.page-entrance',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 }
        );
    }, []);

    return (
        <div className="bg-[#04080f] text-white min-h-screen">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
                <div className="absolute inset-0 z-0">
                    <Image src="/jateado-hero.png" alt="Escritório moderno com divisórias de vidro jateado LUME - Rio de Janeiro" fill sizes="(max-width: 768px) 100vw, 100vw" priority className="w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#04080f] via-transparent to-[#04080f]" />
                </div>

                <div className="container-lume relative z-10 page-entrance text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 font-semibold tracking-wider text-white text-xs md:text-sm">
                        O Padrão Ouro em Arquitetura de Interiores 🏢
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-montserrat mb-6 leading-tight text-white">
                        Película <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Jateada</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed font-light">
                        Esqueça os vidros escuros pesados. Separe ambientes, crie salas de reunião e isole banheiros com o <strong>acabamento fosco sofisticado</strong> que 100% da sua claridade natural.
                    </p>

                    <a
                        href="https://wa.me/5521965140612?text=Olá! Gostaria de um orçamento para película Jateada (Fosca) nos meus vidros."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8"
                    >
                        Solicitar Orçamento no WhatsApp <ArrowRight size={20} />
                    </a>
                </div>
            </section>

            {/* Introdução Focada em Luz e Privacidade */}
            <section className="py-20 bg-[#04080f] border-b border-white/5 px-4">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold font-montserrat mb-8 text-white">Privacidade Sem Escuridão</h2>
                        <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                            Diferente das linhas térmicas (como G5 ou Refletivo Prata) cujo principal alvo é espancar o sol da Zona Oeste do Rio, a Linha <strong>Jateada</strong> atua no conforto ocular interno, na arquitetura e na privacidade direcional.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            Ela foi aclamada mundialmente por um motivo simples: <strong>ninguém consegue ver através dela (nem de dia, nem de noite)</strong>, contudo, a luz do sol cruza o material facilmente iluminando toda sua casa ou escritório de forma difusa e macia, sem sombras e sem escurecer a sala. É o adeus definitivo às persianas barulhentas acumuladoras de poeira e cortinas pesadas.
                        </p>
                    </div>
                </div>
            </section>

            {/* Engenharias e Composição */}
            <section className="py-24 relative px-4 bg-[#050A11]">
                <div className="container-lume page-entrance max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 glass-card p-10 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-gray-500/30 transition-all bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl">
                            <h3 className="text-3xl font-bold font-montserrat mb-6 text-white">Aplicações Mais Populares</h3>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300"><Building2 className="text-gray-400" size={20} /> Clínicas e Consultórios Médicos</li>
                                <li className="flex items-center gap-3 text-gray-300"><Layers className="text-gray-400" size={20} /> Divisórias de Salas de Reunião</li>
                                <li className="flex items-center gap-3 text-gray-300"><Droplets className="text-gray-400" size={20} /> Box de Banheiros (Resistente a Vapor)</li>
                                <li className="flex items-center gap-3 text-gray-300"><Sun className="text-gray-400" size={20} /> Portas e Janelas de Lavanderias</li>
                            </ul>

                            <div className="bg-white/10 border border-white/10 p-4 rounded-xl inline-flex items-center gap-3">
                                <EyeOff className="text-white" size={24} />
                                <span className="font-semibold text-sm text-gray-200">Não possui nenhum efeito espelhado. Acabamento fino e opaco.</span>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 space-y-8">
                            <div>
                                <h2 className="text-4xl lg:text-5xl font-bold font-montserrat mb-4 text-white">Composição Estrutural</h2>
                                <p className="text-gray-400 text-lg">A película é constituída por uma arquitetura focada no design e facilidade extrema de limpeza.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0 border border-gray-400/30 text-gray-300">
                                        <Layers size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Base de Transparência Poliéster</h4>
                                        <p className="text-sm text-gray-400">O chassi do filme, formulado especificamente para permitir que enormes taxas de luz passem livremente sem distorções visuais (alta difusão).</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0 border border-gray-400/30 text-gray-300">
                                        <Gem size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Tratamento Fosco (Frosted Surface)</h4>
                                        <p className="text-sm text-gray-400">A camada principal encarregada por quebrar e randomizar os feixes de luz, matando a visão humana em 100%.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0 border border-gray-400/30 text-gray-300">
                                        <Droplets size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">Acabamento Anti-Marcas</h4>
                                        <p className="text-sm text-gray-400">Revestimento sedoso que não absorve a gordura dos dedos, sendo muito superior à difícil manutenção do verdadeiro "vidro arranhado na areia".</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabela Técnica de Performance (Foco em Luminosidade) */}
            <section className="py-24 relative px-4">
                <div className="container-lume page-entrance text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold font-montserrat mb-4 text-white">O Raio-X do Jateado</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">Performance testada para decorar sem estrangular a claridade do local.</p>
                    <span className="inline-flex px-6 py-2 bg-gradient-to-r from-gray-200 to-gray-400 text-black font-black uppercase text-xl rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] tracking-wider">
                        R$ 90/m² Instalado
                    </span>
                </div>

                <div className="container-lume max-w-5xl mx-auto page-entrance">
                    <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Features Text */}
                            <div className="p-8 md:p-12 bg-black/40 border-r border-white/5 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold mb-4 font-montserrat">Por que a taxa de calor é baixa?</h3>
                                <p className="text-gray-400 leading-relaxed text-sm lg:text-base mb-6">
                                    Películas jateadas, por não conterem escurecimento denso de carbono, cerâmica ou metais pesados depositados, possuem índices baixos de TSER e Rejeição de Infravermelho (IRR). Se o seu foco for 100% matar o calor da sala, recomendamos as linhas Carbono e Nano Cerâmica. Se o foco é pura privacidade corporativa e decoração, o Jateado é a coroa do mercado.
                                </p>
                                <div className="flex items-center gap-3 text-sm text-gray-300 uppercase font-bold tracking-widest mt-auto">
                                    <Building2 size={18} /> Linha Decorativa
                                </div>
                            </div>

                            {/* Table Data */}
                            <div className="p-8 md:p-12 bg-[#02050A]">
                                <div className="space-y-8">
                                    <div className="relative">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-300 font-medium flex items-center gap-2">
                                                <Sun size={18} className="text-[#c9a227]" />
                                                <SpecTooltip term="VLT">VLT (Transmissão de Luz)</SpecTooltip>
                                            </span>
                                            <span className="font-bold text-white text-lg">50% a 85%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div className="bg-[#c9a227] h-2 rounded-full shadow-[0_0_10px_rgba(201,162,39,0.3)]" style={{ width: '85%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Altíssima taxa, ambiente incrivelmente claro e convidativo.</p>
                                        <div className="absolute -right-2 top-0 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-300 font-medium flex items-center gap-2">
                                                <ShieldCheck size={18} className="text-[#c9a227]" />
                                                <SpecTooltip term="UVR">Bloqueio UV (UltraVioleta)</SpecTooltip>
                                            </span>
                                            <span className="font-bold text-white text-lg">99%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div className="bg-[#c9a227] h-2 rounded-full shadow-[0_0_10px_rgba(201,162,39,0.3)]" style={{ width: '99%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Padrão da base PET Premium da película auxiliando objetos próximos.</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-300 font-medium flex items-center gap-2">
                                                <Thermometer size={18} className="text-[#c9a227]" />
                                                <SpecTooltip term="IRR">Infravermelho (IRR)</SpecTooltip>
                                            </span>
                                            <span className="font-bold text-white text-lg">Inferior a 10%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                            <div className="bg-[#c9a227] h-2 rounded-full" style={{ width: '10%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Filme decorativo, sem propósito térmico primário.</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-white font-bold flex items-center gap-2 uppercase tracking-wider">
                                                <Zap size={18} className="text-[#c9a227]" />
                                                <SpecTooltip term="TSER">TSER (Poder Total)</SpecTooltip>
                                            </span>
                                            <span className="font-bold text-white text-xl">15% a 25%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-white/5">
                                            <div className="bg-[#c9a227] h-2 rounded-full" style={{ width: '25%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Bloqueio solar focado em luminosidade e privacidade.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dica Técnica: Por que filmes claros protegem? */}
            <section className="py-12 relative px-4 bg-[#04080f]">
                <div className="container-lume max-w-4xl mx-auto">
                    <div className="glass-card p-8 md:p-12 rounded-3xl border border-[#c9a227]/30 bg-gradient-to-br from-[#c9a227]/5 to-transparent relative overflow-hidden">
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#c9a227]/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold font-montserrat mb-6 text-white flex items-center gap-3">
                                <ShieldCheck className="text-[#c9a227]" size={28} />
                                Por que mesmo filmes claros bloqueiam o UV?
                            </h3>

                            <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
                                <p>
                                    Muitos clientes acreditam que apenas películas escuras protegem o ambiente, mas a verdade técnica é fascinante: <strong>o bloqueio UV não depende da cor.</strong>
                                </p>
                                <p>
                                    A radiação Ultravioleta (UV) é absorvida diretamente pelos materiais que compõem a película — especificamente a base de poliéster de alta densidade e os polímeros do adesivo. Por isso, existem películas 100% transparentes que conseguem barrar até 99% do UV.
                                </p>
                                <p>
                                    No caso da nossa <strong>Linha Jateada</strong>, embora seu foco não seja a rejeição térmica (calor), ela atua como um escudo preventivo contra o desbotamento. Como o amarelamento de pisos e o desgaste de tecidos são causados majoritariamente pelo UV, você protege sua mobília sem precisar escurecer um único tom do seu imóvel.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 relative px-4 bg-[#04080f] border-t border-white/5">
                <div className="container-lume page-entrance max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-montserrat mb-4 text-white">Dúvidas Frequentes</h2>
                        <p className="text-gray-400">Tudo sobre instalação em divisórias e banheiros.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "A película jateada escurece o ambiente interno igual o insulfilm de carro?",
                                a: "De forma alguma! Essa é a maior vantagem do material jateado. Ele possui uma Transmissão de Luz (VLT) maciça. Isso significa que ele apenas torna o vidro embaciado (apagando a imagem formada do outro lado), mas repassando quase toda a radiação luminosa do dia, mantendo sua sala altamente iluminada."
                            },
                            {
                                q: "Pode ser instalada dentro de um box de banheiro? Não vai descolar com a água?",
                                a: "Sim, instalamos frequentemente! Aplicamos as películas preferencialmente pelo lado de fora do vidro do box (o lado livre do choque excessivo de shampoos e cloro forte). O material possui uma matriz de cola sensível a pressão desenhada para durar anos mesmo no banheiro suportando vapores pesados dos banhos da família."
                            },
                            {
                                q: "O Jateado em película deixa a marca cheia de gordura dos dedos igual vidro arenado real?",
                                a: "Não. Vidros realmente jateados em máquinas de área tendem a encardir rápido pois ficam com a superfície brutalmente porosa, sugando o óleo de dedos. Como você estará usando a NOSSA PELÍCULA por cima de um vidro liso, ela carrega um tratamento 'anti-fingerprint', tornando-a perfeitamente lavável com um pano úmido e detergente neutro."
                            }
                        ].map((faq, idx) => (
                            <details key={idx} className="group glass-card border flex-col rounded-xl overflow-hidden cursor-pointer bg-white/[0.01]">
                                <summary className="font-bold text-lg p-6 hover:bg-white/[0.04] transition-colors outline-none flex justify-between items-center list-none text-white">
                                    <span className="pr-4">{faq.q}</span>
                                    <span className="text-gray-400 group-open:rotate-45 transition-transform text-2xl font-light leading-none flex-shrink-0">+</span>
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
