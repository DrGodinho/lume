import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ContactCTA } from '../sections/ContactCTA';
import { ArrowRight, Zap, Target, Shield, CheckCircle } from 'lucide-react';

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

export function GuiaInsulfilm() {
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
                <title>Guia Completo: Tudo sobre Insulfilm Residencial no RJ | LUME</title>
                <meta name="description" content="Descubra qual a película de controle solar perfeita para sua necessidade. Privacidade, Redução de Calor e Proteção UV no Rio de Janeiro." />
                
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "Article",
                            "headline": "Absolutamente tudo o que você precisa saber sobre insulfilm antes de comprar",
                            "image": "https://lumecontrolesolar.netlify.app/novo-logo-lume.png",
                            "author": {
                                "@type": "Organization",
                                "name": "LUME Controle Solar"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "LUME Controle Solar",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://lumecontrolesolar.netlify.app/novo-logo-lume.png"
                                }
                            },
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "@id": "https://lumecontrolesolar.netlify.app/guia-insulfilm"
                            }
                        }
                    `}
                </script>
            </Helmet>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-gradient-to-br from-[#0a1628] to-[#040811]" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="container-lume relative z-10 page-entrance text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_15px_rgba(201,162,39,0.2)]">
                        Guia Definitivo LUME
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-['Montserrat'] mb-6 leading-tight">
                        Absolutamente tudo o que você precisa saber sobre <span className="text-gradient-gold">insulfilm</span> antes de comprar
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 mx-auto mb-10 leading-relaxed font-light">
                        Se você mora no <strong className="text-white">Rio de Janeiro</strong>, sabe que o sol não é apenas uma estrela; ele é um vizinho onipresente que muitas vezes cobra caro pela visita. Descubra como escolher a tecnologia certa para proteger seu lar.
                    </p>

                    <a href="https://wa.me/5521965140612?text=Olá! Estava lendo o Guia de Insulfilm e gostaria de um orçamento." target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8">
                        Orçamento Rápido via WhatsApp <ArrowRight size={20} />
                    </a>
                </div>
            </section>

            {/* Main Content */}
            <main className="container-lume max-w-4xl mx-auto py-16 px-4 space-y-20 page-entrance">

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
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                            <Zap size={24} />
                        </div>
                        <h2 className="text-3xl font-bold font-['Montserrat'] text-white">1. Conforto Térmico e Economia: O Fim do "Forno" em Casa</h2>
                    </div>
                    
                    <div className="text-gray-400 space-y-6 text-lg leading-relaxed mb-8">
                        <p>
                            O principal motivo que leva alguém a buscar insulfilm residencial no Rio de Janeiro é, sem dúvida, o calor. Quando o sol atinge o vidro comum, ele se transforma em energia térmica que fica presa no ambiente — o famoso efeito estufa.
                        </p>
                        <h3 className="text-xl font-bold text-white mt-8 mb-4">Economia Real no Bolso</h3>
                        <p>
                            As películas de alta performance atuam como um escudo inteligente. Ao reduzir a entrada de calor, o seu ar-condicionado não precisa trabalhar no limite o tempo todo para manter a temperatura agradável. Estudos indicam que a instalação de películas premium pode gerar uma <strong>economia de até 30% no consumo de energia elétrica</strong> do ar-condicionado. Em regiões quentes como a Zona Oeste, esse investimento se paga em poucos meses.
                        </p>
                        <h3 className="text-xl font-bold text-white mt-8 mb-4">Alta Tecnologia: Nanocerâmica e Películas Claras</h3>
                        <p>
                            Muitas pessoas acreditam que, para tirar o calor, é preciso "escuridão total". Isso é coisa do passado. Graças à <strong>Tecnologia de Nanocerâmica</strong>, hoje é possível ter películas quase transparentes com uma performance térmica superior às películas escuras comuns.
                        </p>
                    </div>

                    <FAQAccordion items={[
                        { q: "O insulfilm ajuda no inverno carioca?", a: "Sim! Ele ajuda a manter a temperatura interna mais estável, funcionando como um isolante térmico nas janelas." },
                        { q: "O insulfilm substitui o ar-condicionado?", a: "Não, mas ele mantém o frescor por muito mais tempo e faz o aparelho resfriar o ambiente muito mais rápido." },
                        { q: "Películas claras também tiram o calor?", a: "Sim! Através da rejeição de infravermelho. Existem tecnologias de nanocerâmica que são quase transparentes e bloqueiam mais calor que muitas películas escuras comuns." }
                    ]} />
                </section>

                {/* 2. Proteção UV */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-3xl font-bold font-['Montserrat'] text-white">2. Proteção UV: O Protetor Solar dos seus Móveis e Pele</h2>
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
                    </div>

                    <FAQAccordion items={[
                        { q: "Mesmo em dias nublados o UV é perigoso?", a: "Sim, o raio UV atravessa nuvens e vidros comuns sem dificuldade. A proteção da película é constante." },
                        { q: "A película perde o filtro UV com o tempo?", a: "Películas de baixa qualidade (tingidas) perdem. Películas premium mantêm a proteção por muitos anos." },
                        { q: "Por que o jateado também protege contra o UV?", a: "Porque o bloqueio UV não depende da cor ou da transparência, mas sim dos inibidores químicos presentes nas camadas internas do poliéster da película." }
                    ]} />
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
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                            <Target size={24} />
                        </div>
                        <h2 className="text-3xl font-bold font-['Montserrat'] text-white">3. Privacidade e Segurança: Seu Lar, Seu Refúgio</h2>
                    </div>

                    <div className="text-gray-400 space-y-6 text-lg leading-relaxed mb-8">
                        <p>
                            Viver em grandes centros como o Rio de Janeiro traz o desafio da proximidade. Vizinhos em prédios em frente ou pessoas na rua podem acabar tirando a sua liberdade dentro de casa.
                        </p>
                        <p>
                            As películas Carbono G5 ou as versões Refletivas criam o efeito de <strong>"visão única"</strong>: você enxerga tudo lá fora com nitidez, mas quem está do lado de fora vê apenas um reflexo ou uma superfície escura. Além disso, o filme segura estilhaços em caso de quebra de vidro, prevenindo acidentes.
                        </p>
                    </div>

                    <FAQAccordion items={[
                        { q: "À noite, com as luzes acesas, o efeito de privacidade continua?", a: "Não. A física da luz dita que o lado mais iluminado é o que reflete. À noite, se a luz interna estiver forte, a privacidade diminui. Cortinas ainda são recomendadas para a noite." },
                        { q: "Qual a diferença da G5 para a G20?", a: "A G5 é mais escura (permite 5% de entrada de luz), oferecendo máxima privacidade diurna. A G20 é média, equilibrando privacidade leve e mais claridade natural." }
                    ]} />
                </section>

                {/* 4. Guia de Seleção */}
                <section>
                    <h2 className="text-3xl font-bold font-['Montserrat'] text-white mb-4">4. Guia de Seleção: Escolha a Película Ideal</h2>
                    <p className="text-gray-400 text-lg mb-10">Escolher a película certa depende da sua prioridade. Identifique seu cenário abaixo:</p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Cenário 1 */}
                        <div className="glass-card border border-white/10 rounded-2xl p-6 hover:border-[#c9a227]/30 transition-all">
                            <h3 className="text-[#c9a227] font-bold text-xl mb-2">Cenário 1: Privacidade Máxima</h3>
                            <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider">Para salas e quartos térreos</p>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex gap-2"><CheckCircle size={20} className="text-[#c9a227] flex-shrink-0" /> <strong>Dupla Camada G5:</strong> Espelhada por fora, clara por dentro.</li>
                                <li className="flex gap-2"><CheckCircle size={20} className="text-[#c9a227] flex-shrink-0" /> <strong>Carbono G5:</strong> Visual preto absoluto.</li>
                            </ul>
                        </div>

                        {/* Cenário 2 */}
                        <div className="glass-card border border-white/10 rounded-2xl p-6 hover:border-[#c9a227]/30 transition-all">
                            <h3 className="text-[#c9a227] font-bold text-xl mb-2">Cenário 2: Foco em Luz Natural</h3>
                            <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider">Tira o calor sem escurecer</p>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex gap-2"><CheckCircle size={20} className="text-[#c9a227] flex-shrink-0" /> <strong>Nano Cerâmica:</strong> Rejeita 97% do calor, alta transparência.</li>
                                <li className="flex gap-2"><CheckCircle size={20} className="text-[#c9a227] flex-shrink-0" /> <strong>Jateada:</strong> Difunde luz suavemente (fosco).</li>
                            </ul>
                        </div>

                        {/* Cenário 3 */}
                        <div className="glass-card border border-white/10 rounded-2xl p-6 hover:border-[#c9a227]/30 transition-all">
                            <h3 className="text-[#c9a227] font-bold text-xl mb-2">Cenário 3: Custo-Benefício</h3>
                            <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider">Proteção com orçamento controlado</p>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex gap-2"><CheckCircle size={20} className="text-[#c9a227] flex-shrink-0" /> <strong>Carbono Premium:</strong> A partir de R$ 80/m².</li>
                                <li className="flex gap-2"><CheckCircle size={20} className="text-[#c9a227] flex-shrink-0" /> <strong>Refletiva Clássica:</strong> Melhor custo para redução de abafamento bruto.</li>
                            </ul>
                        </div>

                        {/* Cenário 4 */}
                        <div className="glass-card border border-white/10 rounded-2xl p-6 hover:border-[#c9a227]/30 transition-all bg-gradient-to-br from-[#c9a227]/5 to-transparent">
                            <h3 className="text-[#c9a227] font-bold text-xl mb-2">Cenário Especial: O Astro-Rei</h3>
                            <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider">Contra o sol da tarde extremo</p>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex gap-2"><CheckCircle size={20} className="text-[#c9a227] flex-shrink-0" /> <strong>Dupla Camada G5:</strong> A barreira térmica definitiva (TSER 75%).</li>
                            </ul>
                        </div>
                    </div>

                    <FAQAccordion items={[
                        { q: "Moro em condomínio e não posso usar película refletiva, o que fazer?", a: "Nestes casos, recomendamos fortemente a Linha Nanocerâmica. Como ela é praticamente invisível por fora, ela não altera a fachada do prédio e entrega um conforto térmico superior a qualquer película escura." },
                        { q: "Qual a diferença entre Carbono e Tintada?", a: "Películas tintadas são apenas 'adesivos pintados' que desbotam e ficam roxos rapidamente. A Carbono tem a cor na própria massa e estrutura, garantindo que nunca mude de cor." }
                    ]} />
                </section>

                {/* 5 e 6: Durabilidade, Cuidados e Remoção */}
                <section>
                    <h2 className="text-3xl font-bold font-['Montserrat'] text-white mb-8">5. Qualidade e Cuidados Diários</h2>
                    
                    <div className="text-gray-400 space-y-6 text-lg leading-relaxed mb-8">
                        <p>
                            Você já viu aqueles carros com o vidro cheio de bolhas e com uma cor roxa estranha? Isso é o resultado de películas tintadas de baixa qualidade. Elas duram poucos meses sob o sol do Rio.
                        </p>
                        <p>
                            Um insulfilm residencial premium aplicado por um profissional experiente deve durar de <strong>5 a 10 anos</strong>. E para garantir essa longevidade:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-white/80">
                            <li><strong>Tempo de Cura:</strong> Não limpe os vidros nos primeiros 5 dias após a instalação.</li>
                            <li><strong>Limpeza correta:</strong> Use apenas pano de microfibra macio, água e sabão neutro.</li>
                            <li><strong>Atenção:</strong> Jamais use limpa-vidros com amônia ou esponjas abrasivas!</li>
                        </ul>
                    </div>

                    <FAQAccordion items={[
                        { q: "Por que as películas baratas criam bolhas horríveis?", a: "Geralmente é má aplicação combinada ao uso de adesivos de baixa qualidade que fervem e reagem com o calor do sol gerando gases." },
                        { q: "O cloro da piscina perto da janela estraga o filme?", a: "O vapor de cloro pode afetar películas metalizadas com o passar dos anos. Para áreas de lazer, recomendamos uso de Carbono ou Nanocerâmica." },
                        { q: "A remoção de filme velho estraga o vidro?", a: "A remoção é técnica. Se feita sozinho com lâminas erradas, sim. Mas feita por nossos profissionais com removedores corretos, o vidro volta a ser novo." }
                    ]} />
                </section>

            </main>

            <ContactCTA />
        </div>
    );
}
