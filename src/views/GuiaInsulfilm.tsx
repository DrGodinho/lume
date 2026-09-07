'use client';

import { ContactCTA } from '../sections/ContactCTA';
import { ArrowRight, MessageCircle, Zap, Target, Shield } from 'lucide-react';
import { HeroEntrance } from '../components/HeroEntrance';
import { guiaFaqGroups } from '../content/guiaInsulfilmFaq';

const guiaToc = [
    { id: 'o-que-e-insulfilm', label: 'O que é Insulfilm?' },
    { id: 'conforto-termico', label: '1. Conforto Térmico e Economia' },
    { id: 'protecao-uv', label: '2. Proteção UV' },
    { id: 'privacidade-seguranca', label: '3. Privacidade e Segurança' },
    { id: 'guia-selecao', label: '4. Guia de Seleção' },
    { id: 'comparativo-tecnico', label: 'Comparativo Técnico das Películas' },
    { id: 'qualidade-cuidados', label: '5. Qualidade e Cuidados Diários' },
    { id: 'remocao', label: '6. Remoção: Quando é Hora de Mudar?' },
];

// Reusable Accordion Component for FAQs
const FAQAccordion = ({ items }: { items: { q: string, a: string }[] }) => (
    <div className="space-y-4 my-8">
        {items.map((faq, idx) => (
            <details key={idx} className="group glass-card border border-white/5 flex-col rounded-xl overflow-hidden cursor-pointer bg-white/[0.01]">
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
);

const roomsData = [
    {
        icon: '🍳',
        title: 'Cozinha',
        titleLink: '/insulfilm-na-cozinha/',
        recs: [
            { film: 'Nano Cerâmica', tag: 'Top para calor', desc: 'Barrar o calor do sol sem escurecer o ambiente onde você prepara refeições e precisa de clareza natural.', link: '/nano-ceramica/' },
            { film: 'Jateado', tag: 'Para privacidade', desc: 'Ideal se a cozinha tiver vista direta para a rua ou área comum do condomínio, mantendo a luz suave.', link: '/jateado/' },
        ]
    },
    {
        icon: '🛏️',
        title: 'Quarto',
        titleLink: '/insulfilm-no-quarto/',
        recs: [
            { film: 'Dupla Camada', tag: 'Alta performance', desc: 'Escurecimento profundo + bloqueio total de calor. Perfeito para quem precisa dormir em qualquer horário.', link: '/dupla-camada/' },
            { film: 'Carbono G5', tag: 'Opção econômica', desc: 'Visual preto absoluto com excelente privacidade. Ótimo custo-benefício para quem quer escurecer sem espelhamento.', link: '/carbono/' },
        ]
    },
    {
        icon: '🚿',
        title: 'Banheiro',
        titleLink: '/insulfilm-no-banheiro/',
        recs: [
            { film: 'Jateado', tag: 'Máxima privacidade', desc: 'Privacidade total sem deixar o ambiente escuro. A luz difusa deixa o banheiro iluminado e completamente blindado de olhares.', link: '/jateado/' },
        ]
    },
    {
        icon: '🛋️',
        title: 'Sala',
        titleLink: '/insulfilm-na-sala/',
        recs: [
            { film: 'Nano Cerâmica', tag: 'Premium', desc: 'Mantém a sala clarinha e agradável, bloqueando intensamente o calor que entra pelas grandes janelas.', link: '/nano-ceramica/' },
            { film: 'Refletiva', tag: 'Redução de calor', desc: 'Boa barreira térmica com espelhamento externo. Equilibra proteção e orçamento.', link: '/refletiva/' },
            { film: 'Carbono G20', tag: 'Econômica', desc: 'Redução confortável de calor e luminosidade. Boa opção para sala de estar que não pega sol forte o dia todo.', link: '/carbono/' },
        ]
    },
    {
        icon: '💻',
        title: 'Escritório',
        titleLink: '/insulfilm-no-escritorio/',
        recs: [
            { film: 'Nano Cerâmica', tag: 'Premium', desc: 'Evita o calor que causa sonolência e mantém a claridade para leitura e tela sem glare excessivo.', link: '/nano-ceramica/' },
            { film: 'Jateado', tag: 'Para divisórias', desc: 'Privacidade total em divisórias de vidro internas ou janelas com vista para áreas comuns, sem perder a luz.', link: '/jateado/' },
            { film: 'Carbono G20', tag: 'Confortável', desc: 'Reduz o reflexo na tela do computador e deixa a luminosidade confortável para longas jornadas de trabalho.', link: '/carbono/' },
        ]
    },
    {
        icon: '🚪',
        title: 'Porta de Vidro',
        titleLink: '/insulfilm-para-portas-de-vidro/',
        recs: [
            { film: 'Nano Cerâmica', tag: 'Conforto térmico', desc: 'Reduz o calor da porta de vidro sem escurecer demais o ambiente, ideal para salas e varandas.', link: '/nano-ceramica/' },
            { film: 'Jateado', tag: 'Privacidade total', desc: 'Bloqueia a visão direta com visual limpo e luminosidade difusa, ótimo para banheiro, escritório e divisórias.', link: '/jateado/' },
            { film: 'Refletiva', tag: 'Fachada e sol forte', desc: 'Ajuda a controlar calor e privacidade durante o dia quando a porta pega muita incidência solar.', link: '/refletiva/' },
        ]
    }
];

export function GuiaInsulfilm() {
    return (
        <div className="bg-[#04080f] text-white min-h-screen">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-gradient-to-br from-[#04080f] to-[#040811]" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <HeroEntrance className="container-lume relative z-10 text-center max-w-4xl mx-auto">
                    <div className="animate-hero opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_15px_rgba(201,162,39,0.2)]">
                        Guia Definitivo LUME
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight">
                        <span className="word opacity-0 inline-block">Guia</span>{' '}
                        <span className="word opacity-0 inline-block">de</span>{' '}
                        <span className="word opacity-0 inline-block text-gradient-gold">insulfilm</span>{' '}
                        <span className="word opacity-0 inline-block">residencial:</span>{' '}
                        <span className="word opacity-0 inline-block">tudo</span>{' '}
                        <span className="word opacity-0 inline-block">antes</span>{' '}
                        <span className="word opacity-0 inline-block">de</span>{' '}
                        <span className="word opacity-0 inline-block">comprar</span>
                    </h1>

                    <p className="animate-hero opacity-0 text-lg md:text-xl text-gray-300 mx-auto mb-10 leading-relaxed font-light">
                        Se você mora no <strong className="text-white">Rio de Janeiro</strong>, sabe que o sol não é apenas uma estrela; ele é um vizinho onipresente que muitas vezes cobra caro pela visita. Descubra como escolher a tecnologia certa para proteger seu lar.
                    </p>

                    <a href="https://wa.me/5521965140612?text=Olá! Estava lendo o Guia de Insulfilm e gostaria de um orçamento." target="_blank" rel="noopener noreferrer" className="animate-hero opacity-0 btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8">
                        Orçamento Rápido via WhatsApp <ArrowRight size={20} />
                    </a>
                </HeroEntrance>
            </section>

            {/* Main Content */}
            <main className="container-lume max-w-4xl mx-auto py-16 px-4 space-y-20 page-entrance">

                {/* Índice do guia */}
                <nav aria-label="Neste guia" className="rounded-2xl border border-[#c9a227]/25 bg-[#c9a227]/[0.06] p-5 md:p-6">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c9a227]">Neste guia</p>
                    <ul className="mt-3 grid gap-2 md:grid-cols-2">
                        {guiaToc.map((item) => (
                            <li key={item.id}>
                                <a href={`#${item.id}`} className="text-sm font-bold leading-6 text-gray-200 hover:text-[#c9a227] hover:underline">
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Definição Técnica */}
                <section id="o-que-e-insulfilm" className="prose prose-lg prose-invert max-w-none text-gray-300 scroll-mt-24">
                    <h2 className="text-3xl font-bold font-montserrat text-white mb-6">O que é Insulfilm?</h2>
                    <p className="text-xl leading-relaxed text-gray-400">
                        Tecnicamente conhecido como <strong>Película de Controle Solar</strong>, o insulfilm é um laminado composto por múltiplas camadas de poliéster (PET) de alta resistência ótica. Diferente de um adesivo comum, ele é um dispositivo de engenharia de materiais que utiliza nanotecnologia, pigmentos inorgânicos e metais (em linhas específicas) para filtrar seletivamente o espectro solar. Sua estrutura conta com uma camada de adesivo sensível à pressão, camadas de filtragem de radiação Ultravioleta (UV) e Infravermelha (IR), e um revestimento externo chamado <strong>Hard Coat</strong>, que protege o material contra riscos e abrasão mecânica durante a limpeza.
                    </p>
                </section>

                {/* Introdução */}
                <section className="prose prose-lg prose-invert max-w-none text-gray-300">
                    <p className="text-xl leading-relaxed text-gray-400">
                        Seja em um apartamento moderno ou em uma casa espaçosa em Bangu, o calor da <strong>Zona Oeste</strong> exige soluções que vão além de simplesmente fechar as cortinas. É aqui que entra o <strong>insulfilm residencial</strong>, uma tecnologia que evoluiu de um simples "adesivo escuro" para uma ferramenta de alta engenharia.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-400 mb-12">
                        Mas antes de investir, surgem as dúvidas: Qual película escolher? Ela vai durar? Tira a visibilidade? Neste guia, vamos desvendar cada detalhe para que você faça a escolha perfeita para o seu lar.
                    </p>
                </section>

                {/* 1. Conforto Térmico */}
                <section id="conforto-termico" className="scroll-mt-24">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                            <Zap size={24} />
                        </div>
                        <h2 className="text-3xl font-bold font-montserrat text-white">1. Conforto Térmico e Economia: O Fim do "Forno" em Casa</h2>
                    </div>

                    <div className="text-gray-400 space-y-6 text-lg leading-relaxed mb-8">
                        <p>
                            O principal motivo que leva alguém a buscar insulfilm residencial no Rio de Janeiro é, sem dúvida, o calor. Quando o sol atinge o vidro comum, ele se transforma em energia térmica que fica presa no ambiente — o famoso efeito estufa.
                        </p>
                        <h3 className="text-xl font-bold text-white mt-8 mb-4">Economia Real no Bolso</h3>
                        <p>
                            As películas de alta performance atuam como um escudo inteligente. Ao reduzir a entrada de calor, o seu ar-condicionado não precisa trabalhar no limite o tempo todo para manter a temperatura agradável. Estudos indicam que a instalação de películas premium pode gerar uma <strong>economia de 25% a 40% no consumo de energia elétrica</strong> do ar-condicionado. Em regiões quentes como a Zona Oeste, esse investimento se paga em poucos meses.
                        </p>
                        <h3 className="text-xl font-bold text-white mt-8 mb-4">Alta Tecnologia: Nanocerâmica e Películas Claras</h3>
                        <p>
                            Muitas pessoas acreditam que, para tirar o calor, é preciso "escuridão total". Isso é coisa do passado. Graças à <a href="/nano-ceramica/" className="text-[#c9a227] hover:underline font-bold">Tecnologia de Nanocerâmica</a>, hoje é possível ter películas quase transparentes com uma performance térmica superior às películas escuras comuns.
                        </p>
                    </div>

                    <FAQAccordion items={guiaFaqGroups[0]} />
                </section>

                {/* 2. Proteção UV */}
                <section id="protecao-uv" className="scroll-mt-24">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-3xl font-bold font-montserrat text-white">2. Proteção UV: O Protetor Solar dos seus Móveis e Pele</h2>
                    </div>

                    <div className="text-gray-400 space-y-6 text-lg leading-relaxed mb-8">
                        <p>
                            Você já reparou que aquela poltrona perto da janela está desbotando? Ou que o piso de madeira está ficando esbranquiçado? Isso é obra dos raios Ultravioleta (UV).
                        </p>
                        <p>
                            O insulfilm residencial de qualidade <strong>bloqueia até 99% dos raios UV</strong>. Isso significa que você está protegendo simultaneamente:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-white/80">
                            <li>Pisos laminados e de madeira.</li>
                            <li>Estofados e cortinas.</li>
                            <li>Quadros e objetos de decoração.</li>
                            <li><strong>A sua pele:</strong> O câncer de pele também pode ser causado pela exposição contínua ao sol pela janela de casa.</li>
                        </ul>
                        <p>
                            Destaque para a linha <a href="/jateado/" className="text-[#c9a227] hover:underline font-bold">Jateada</a>, que além de decorativa, mantém 99% de bloqueio UV mesmo sendo fosca.
                        </p>
                    </div>

                    <FAQAccordion items={guiaFaqGroups[1]} />
                </section>

                {/* Middle CTA */}
                <div className="bg-[#0b1b33] border border-[#c9a227]/20 p-8 rounded-2xl text-center shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-4">Pronto para proteger sua casa?</h3>
                    <p className="text-gray-400 mb-6">Fale com nossos especialistas. Avaliação e orçamento gratuitos na Zona Oeste.</p>
                    <a href="https://wa.me/5521965140612?text=Olá! Quero um orçamento de Insulfilm para minha casa." target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center justify-center gap-3 text-base py-3 px-6">
                        Solicitar Orçamento via WhatsApp
                    </a>
                </div>

                {/* 3. Privacidade e Segurança */}
                <section id="privacidade-seguranca" className="scroll-mt-24">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                            <Target size={24} />
                        </div>
                        <h2 className="text-3xl font-bold font-montserrat text-white">3. Privacidade e Segurança: Seu Lar, Seu Refúgio</h2>
                    </div>

                    <div className="text-gray-400 space-y-6 text-lg leading-relaxed mb-8">
                        <p>
                            Viver em grandes centros como o Rio de Janeiro traz o desafio da proximidade. Vizinhos em prédios em frente ou pessoas na rua podem acabar tirando a sua liberdade dentro de casa.
                        </p>
                        <p>
                            As películas <a href="/carbono/" className="text-[#c9a227] hover:underline font-bold">Carbono G5</a> ou as versões <a href="/refletiva/" className="text-[#c9a227] hover:underline font-bold">Refletivas</a> criam o efeito de <strong>"visão única"</strong>: você enxerga tudo lá fora com nitidez, mas quem está do lado de fora vê apenas um reflexo ou uma superfície escura. Além disso, o filme segura estilhaços em caso de quebra de vidro, prevenindo acidentes.
                        </p>
                    </div>

                    <FAQAccordion items={guiaFaqGroups[2]} />
                </section>

                {/* 4. Guia de Seleção */}
                <section id="guia-selecao" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold font-montserrat text-white mb-4">4. Guia de Seleção: Escolha a Película Ideal</h2>
                    <p className="text-gray-400 text-lg mb-10">Escolher a película certa depende da sua prioridade. Identifique seu cenário abaixo:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roomsData.map((room, idx) => (
                            <div
                                key={idx}
                                className="page-entrance group relative glass-card p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1a3a5c]/40 to-[#04080f]/60 border border-[#1a3a5c]/30 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2 flex flex-col overflow-hidden text-left"
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 rounded-2xl bg-[#c9a227]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300 inline-block">{room.icon}</span>
                                        <h3 className="text-[#c9a227] font-bold text-xl font-montserrat">
                                            {room.titleLink ? (
                                                <a href={room.titleLink} className="hover:text-white transition-colors relative z-20">
                                                    {room.title}
                                                </a>
                                            ) : (
                                                room.title
                                            )}
                                        </h3>
                                    </div>

                                    <div className="space-y-5 flex-1">
                                        {room.recs.map((rec, rIdx) => (
                                            <div key={rIdx} className="pb-5 border-b border-white/10 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <a href={rec.link} className="font-bold text-white hover:text-[#c9a227] transition-colors relative z-20">
                                                        {rec.film}
                                                    </a>
                                                    <span className="bg-[#c9a227]/15 text-[#c9a227] text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                                                        {rec.tag}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm leading-relaxed">{rec.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <FAQAccordion items={guiaFaqGroups[3]} />
                </section>

                {/* Tabela Comparativa */}
                <section id="comparativo-tecnico" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold font-montserrat text-white mb-8 text-center md:text-left">Comparativo Técnico das Películas</h2>

                    <div className="overflow-x-auto rounded-2xl glass-card border border-white/10 shadow-2xl">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-[#c9a227]/10 border-b border-white/10">
                                    <th className="p-4 md:p-6 text-[#c9a227] font-bold uppercase tracking-wider text-xs md:text-sm">Película</th>
                                    <th className="p-4 md:p-6 text-[#c9a227] font-bold uppercase tracking-wider text-xs md:text-sm">VLT (Luz)</th>
                                    <th className="p-4 md:p-6 text-[#c9a227] font-bold uppercase tracking-wider text-xs md:text-sm">UVR (Raios UV)</th>
                                    <th className="p-4 md:p-6 text-[#c9a227] font-bold uppercase tracking-wider text-xs md:text-sm">IRR (Calor Int)</th>
                                    <th className="p-4 md:p-6 text-[#c9a227] font-bold uppercase tracking-wider text-xs md:text-sm">TSER (Energia)</th>
                                    <th className="p-4 md:p-6 text-[#c9a227] font-bold uppercase tracking-wider text-xs md:text-sm">Preço/m²</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-300 divide-y divide-white/5">
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 md:p-6 font-bold text-white">
                                        <a href="/nano-ceramica/" className="hover:text-[#c9a227] transition-colors">Nano Cerâmica</a>
                                    </td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-bold">70%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-medium">99,9%</td>
                                    <td className="p-4 md:p-6 font-bold text-white">95% a 99%</td>
                                    <td className="p-4 md:p-6">70% a 80%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-bold">R$ 200</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 md:p-6 font-bold text-white">
                                        <a href="/dupla-camada/" className="hover:text-[#c9a227] transition-colors">Dupla Camada G5</a>
                                    </td>
                                    <td className="p-4 md:p-6">5-8%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-medium">99%</td>
                                    <td className="p-4 md:p-6 font-bold text-white">60% a 70%</td>
                                    <td className="p-4 md:p-6">65% a 75%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-bold">R$ 110</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 md:p-6 font-bold text-white">
                                        <a href="/dupla-camada/" className="hover:text-[#c9a227] transition-colors">Dupla Camada G20</a>
                                    </td>
                                    <td className="p-4 md:p-6">18-25%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-medium">99%</td>
                                    <td className="p-4 md:p-6 font-bold text-white">50% a 60%</td>
                                    <td className="p-4 md:p-6">55% a 65%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-bold">R$ 110</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 md:p-6 font-bold text-white">
                                        <a href="/carbono/" className="hover:text-[#c9a227] transition-colors">Carbono Premium G5</a>
                                    </td>
                                    <td className="p-4 md:p-6">5-8%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-medium">99%</td>
                                    <td className="p-4 md:p-6 font-bold text-white">45% a 55%</td>
                                    <td className="p-4 md:p-6">50% a 60%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-bold">R$ 80</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 md:p-6 font-bold text-white">
                                        <a href="/carbono/" className="hover:text-[#c9a227] transition-colors">Carbono Premium G20</a>
                                    </td>
                                    <td className="p-4 md:p-6">18-25%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-medium">99%</td>
                                    <td className="p-4 md:p-6 font-bold text-white">40% a 50%</td>
                                    <td className="p-4 md:p-6">45% a 55%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-bold">R$ 80</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 md:p-6 font-bold text-white">
                                        <a href="/refletiva/" className="hover:text-[#c9a227] transition-colors">Refletiva Clássica</a>
                                    </td>
                                    <td className="p-4 md:p-6">8-35%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-medium">99%</td>
                                    <td className="p-4 md:p-6 font-bold text-white">70% a 85%</td>
                                    <td className="p-4 md:p-6">65% a 78%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-bold">R$ 90</td>
                                </tr>
                                <tr className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 md:p-6 font-bold text-white">
                                        <a href="/jateado/" className="hover:text-[#c9a227] transition-colors">Jateada</a>
                                    </td>
                                    <td className="p-4 md:p-6">50-85%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-medium">99%</td>
                                    <td className="p-4 md:p-6 font-medium text-gray-500">{'< 10%'}</td>
                                    <td className="p-4 md:p-6">15% a 25%</td>
                                    <td className="p-4 md:p-6 text-[#c9a227] font-bold">R$ 80</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Glossário Técnico */}
                    <div className="mt-12 grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#c9a227]" />
                                VLT (Visible Light Transmission)
                            </h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Percentual de luz visível que atravessa o vidro com película aplicada. Valores mais baixos indicam películas mais escuras. Por exemplo, <span className="text-white">VLT de 5%</span> significa maior privacidade, enquanto <span className="text-white">VLT de 70%</span> mantém o ambiente bem iluminado.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#c9a227]" />
                                UVR (UV Rejection)
                            </h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Percentual de radiação ultravioleta bloqueada. Raios UV são responsáveis pelo desbotamento de móveis e são prejudiciais à pele. Películas de qualidade LUME rejeitam <span className="text-white">99% ou mais</span> da radiação UV.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#c9a227]" />
                                IRR (Infrared Rejection)
                            </h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Percentual de radiação infravermelha bloqueada, a principal responsável pela sensação de calor. Maiores índices significam maior conforto térmico. Películas de <span className="text-white">Nano Cerâmica</span> atingem até 99% de IRR.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#c9a227]" />
                                TSER (Total Solar Energy Rejected)
                            </h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                A medida mais completa: representa o total de energia solar rejeitada (luz + UV + IR). É o melhor indicador para comparar a <strong>eficiência térmica real</strong> entre diferentes películas.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 5 e 6: Durabilidade, Cuidados e Remoção */}
                <section id="qualidade-cuidados" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold font-montserrat text-white mb-8">5. Qualidade e Cuidados Diários</h2>

                    <div className="text-gray-400 space-y-6 text-lg leading-relaxed mb-8">
                        <p>
                            Você já viu aqueles carros com o vidro cheio de bolhas e com uma cor roxa estranha? Isso é o resultado de películas tintadas de baixa qualidade. Elas duram poucos meses sob o sol do Rio.
                        </p>
                        <p>
                            Um insulfilm residencial premium aplicado por um profissional experiente deve ter longevidade de performance superior e estabilidade de cor por muitos anos. Na LUME, oferecemos <strong>garantia oficial certificada de 2 anos</strong> em nossos serviços, assegurando:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-white/80">
                            <li><strong>Tempo de Cura:</strong> Não limpe os vidros nos primeiros 5 dias após a instalação.</li>
                            <li><strong>Limpeza correta:</strong> Use apenas pano de microfibra macio, água e sabão neutro.</li>
                            <li><strong>Atenção:</strong> Jamais use limpa-vidros com amônia ou esponjas abrasivas!</li>
                        </ul>
                    </div>

                    <FAQAccordion items={guiaFaqGroups[4]} />
                </section>

                {/* 6. Remoção */}
                <section id="remocao" className="scroll-mt-24">
                    <h2 className="text-3xl font-bold font-montserrat text-white mb-6">6. Remoção: Quando é Hora de Mudar?</h2>

                    <div className="text-gray-400 space-y-6 text-lg leading-relaxed mb-8">
                        <p>
                            A remoção de insulfilm antigo é uma arte ingrata. Se a película for velha e estiver ressecada, ela sairá em pedacinhos minúsculos, deixando uma cola grudenta e fedorenta no vidro.
                        </p>
                        <h3 className="text-xl font-bold text-white mt-8 mb-4">Por que não fazer sozinho?</h3>
                        <p>
                            Você corre o risco de riscar o vidro com estiletes ou usar produtos químicos que podem manchar suas esquadrias de alumínio ou madeira. Profissionais usam vaporetos de alta temperatura e solventes específicos que preservam o vidro intacto.
                        </p>
                        <p>
                            Se você já tem uma película antiga, ressecada ou com bolhas, a <strong>LUME Controle Solar</strong> oferece o serviço especializado de remoção.
                        </p>
                        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <p className="text-white font-bold mb-1">Atenção:</p>
                            <p className="text-gray-300 text-sm">
                                A remoção é um processo técnico que exige tempo e solventes específicos para não riscar o vidro. Este serviço possui um custo adicional e deve ser informado antecipadamente no momento do orçamento, para que possamos planejar o tempo necessário de execução na sua residência.
                            </p>
                        </div>
                    </div>

                    <FAQAccordion items={guiaFaqGroups[5]} />
                </section>

            </main>

            <ContactCTA />

            <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#04080f]/95 px-4 pt-3 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <a
                    href="https://wa.me/5521965140612?text=Olá! Estava lendo o Guia de Insulfilm e gostaria de um orçamento."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex w-full items-center justify-center gap-2"
                >
                    <MessageCircle className="h-4 w-4" />
                    Pedir orçamento no WhatsApp
                </a>
            </div>
        </div>
    );
}
