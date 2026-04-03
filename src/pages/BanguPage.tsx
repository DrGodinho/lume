import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Sun, Thermometer, CheckCircle, ArrowRight, Eye, SunDim } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function BanguPage() {
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
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }, []);

    return (
        <div className="bg-[#070f1a] text-white min-h-screen">
            <Helmet>
                <title>Insulfilm em Bangu | Aplicação Residencial e Comercial - LUME</title>
                <meta name="description" content="Instalação de insulfilm em Bangu e região com aplicação profissional. Películas residenciais e comerciais. Controle solar, privacidade e segurança. Orçamento gratuito pelo WhatsApp." />
                
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": "LUME Películas de Controle Solar",
                            "image": "https://lumecontrolesolar.netlify.app/novo-logo-lume.png",
                            "@id": "https://lumecontrolesolar.netlify.app/insulfilm-em-bangu",
                            "url": "https://lumecontrolesolar.netlify.app/insulfilm-em-bangu",
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
                            "areaServed": ["Bangu", "Campo Grande", "Santa Cruz", "Realengo", "Padre Miguel", "Senador Camará", "Zona Oeste RJ"],
                            "description": "Instalação de insulfilm em Bangu e região com aplicação profissional. Películas residenciais e comerciais. Controle solar, privacidade e segurança."
                        }
                    `}
                </script>
            </Helmet>

            <WhatsAppButton />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-gradient-to-br from-[#122338] to-[#0a1628]" />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="container-lume relative z-10 page-entrance text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6">
                        <span className="text-[#c9a227] text-sm font-bold uppercase tracking-wider">Zona Oeste do Rio de Janeiro</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-['Montserrat'] mb-6 leading-tight">
                        Insulfilm em <span className="text-gradient-gold">Bangu</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed">
                        Aplicação profissional de películas de controle solar para residências e empresas em Bangu e toda a região da Zona Oeste.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="https://wa.me/5521965140612?text=Olá! Quero um orçamento de insulfilm em Bangu."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8"
                        >
                            Pedir Orçamento pelo WhatsApp <ArrowRight size={20} />
                        </a>
                        <a
                            href="#tipos"
                            className="btn-outline inline-flex items-center justify-center gap-3 text-lg py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl"
                        >
                            Ver Tipos de Película
                        </a>
                    </div>
                </div>
            </section>

            {/* Auto-Scroll Info Strip / Estatísticas */}
            <section className="bg-[#c9a227] py-6 overflow-hidden">
                <div className="container-lume">
                    <div className="flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-6 lg:gap-4 text-black font-extrabold uppercase tracking-widest text-xs lg:text-sm text-center">
                        <span className="flex items-center gap-2"><Thermometer size={18} /> Até 80% de rejeição de calor</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><Sun size={18} /> 99% bloqueio de raios UV</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><Shield size={18} /> 5–15 anos de durabilidade</span>
                        <span className="hidden lg:inline opacity-30">•</span>
                        <span className="flex items-center gap-2"><CheckCircle size={18} /> Zona Oeste — Atendimento no local</span>
                    </div>
                </div>
            </section>

            {/* Faixa de Garantias (Intro Strip) */}
            <section className="py-8 bg-[#0a1628] border-b border-white/5">
                <div className="container-lume page-entrance">
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 font-medium">
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Orçamento gratuito e sem compromisso</div>
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Aplicação com garantia Lume</div>
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Atendimento em Bangu e adjacências</div>
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Películas de procedência certificada</div>
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Sem sujeira ou danos ao vidro</div>
                    </div>
                </div>
            </section>

            {/* O problema do Calor em Bangu */}
            <section className="py-20 bg-[#070f1a] relative px-4">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-6">O calor da Zona Oeste é diferente</h2>
                        <p className="text-gray-400 leading-relaxed mb-6 text-lg text-left md:text-center">
                            Quem mora em Bangu sabe: o verão carioca é especialmente implacável na Zona Oeste. Enquanto a Zona Sul conta com a brisa do mar, bairros como Bangu, Campo Grande e Realengo acumulam calor ao longo do dia, transformando casas e apartamentos em fornos — mesmo com as janelas fechadas.
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-6 text-lg text-left md:text-center">
                            A radiação solar penetra pelos vidros das janelas, portas e varandas, elevando a temperatura interna em vários graus. O resultado é o uso excessivo de ar-condicionado, contas de luz mais altas e um desconforto constante para toda a família. O insulfilm residencial atua diretamente nesse ponto: ele cria uma barreira invisível sobre o vidro que rejeita o calor antes que ele entre no ambiente.
                        </p>
                        <p className="text-gray-400 leading-relaxed text-lg text-left md:text-center">
                            Na Lume Controle Solar, atendemos Bangu e toda a região da Zona Oeste com instalação local. Avaliamos o ambiente, indicamos a película ideal para cada situação e realizamos a aplicação com acabamento impecável.
                        </p>
                    </div>

                    <div className="glass-card p-10 rounded-3xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#c9a227] blur-[100px] opacity-10" />
                        <h3 className="text-2xl font-bold font-['Montserrat'] text-center mb-6">Residencial ou Comercial?</h3>
                        <p className="text-gray-400 leading-relaxed text-center max-w-3xl mx-auto">
                            Focamos exclusivamente no atendimento a imóveis. Para casas e apartamentos, as películas de controle solar são a solução mais econômica e eficaz para o clima do Rio. Para comércios — lojas, escritórios, clínicas, salões — as películas trazem conforto para clientes e funcionários, além de valorizar a fachada e proteger os produtos da exposição ao sol.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tipos de Insulfilm */}
            <section id="tipos" className="py-20 bg-[#0a1628] border-y border-white/5 px-4">
                <div className="container-lume page-entrance">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-6 text-[#c9a227]">Tipos de Insulfilm</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Cada ambiente tem uma necessidade diferente. Conheça as principais opções de película que a Lume trabalha — e o que cada uma resolve na prática.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                selo: "Máximo Desempenho", title: "1. Nano Cerâmica",
                                desc: "A linha de maior performance do mercado. A película nano cerâmica rejeita até 79% do calor proveniente da radiação solar sem escurecer o ambiente, mantendo os vidros transparentes e a luminosidade natural preservada. Ideal para salas, varandas e escritórios que precisam de máximo controle térmico sem perder claridade. Bloqueia até 99% dos raios UV, protegendo móveis, pisos e a pele."
                            },
                            {
                                selo: "Melhor Custo-Benefício", title: "2. Carbono",
                                desc: "Película fumê de alta tecnologia, fabricada a partir de nano carbono. Combina visual elegante e escurecido com excelente rejeição de calor — até 80% de bloqueio térmico e proteção UV de 99%. Disponível nas tonalidades G20 e G5, ideais para janelas e portas de residências que precisam de privacidade durante o dia."
                            },
                            {
                                selo: "Visual Profissional", title: "3. Espelhado / Refletivo",
                                desc: "A película espelhada é a escolha certa para quem quer privacidade total durante o dia com um visual moderno e sofisticado na fachada. Ela reflete a luz solar externamente, contribuindo para a redução de calor e bloqueando a visão de fora para dentro enquanto houver mais iluminação do lado externo. Muito usada em lojas e clínicas."
                            },
                            {
                                selo: "Decorativo", title: "4. Jateado / Fosco",
                                desc: "Solução ideal para banheiros, portas de vidro, divisórias e ambientes que precisam de privacidade sem perder luminosidade. O efeito fosco simula o vidro jateado sem necessidade de troca do vidro, com custo muito menor. Pode ser aplicado em faixas e recortes personalizados para empresas."
                            },
                            {
                                selo: "Segurança", title: "5. Antivandalismo",
                                desc: "Película de alta resistência que mantém os cacos do vidro unidos em caso de impacto ou tentativa de arrombamento, dificultando a entrada de invasores e evitando ferimentos. Indicada para casas com grade de vidro, portas de entrada, comércios e condomínios."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="glass-card p-8 rounded-2xl border border-white/5 hover:border-[#c9a227]/30 transition-colors flex flex-col h-full">
                                <div className="mb-4 inline-block px-3 py-1 bg-[#c9a227]/10 text-[#c9a227] text-xs font-bold uppercase rounded-full border border-[#c9a227]/20">
                                    {item.selo}
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm flex-grow">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefícios */}
            <section className="py-20 relative px-4">
                <div className="container-lume page-entrance">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-4">Os benefícios reais do insulfilm em casa</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="flex gap-4">
                            <Thermometer className="text-[#c9a227] shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Redução de Calor</h4>
                                <p className="text-gray-400">Películas premium rejeitam até 79% do calor solar, mantendo o ambiente mais fresco.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <CheckCircle className="text-[#c9a227] shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Economia de Energia</h4>
                                <p className="text-gray-400">Menos uso de climatização significa contas de luz menores e menos desgaste do ar-condicionado.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <SunDim className="text-[#c9a227] shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Proteção UV</h4>
                                <p className="text-gray-400">Bloqueio de até 99% dos raios ultravioleta protege a pele e evita o desbotamento de pisos e móveis.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Eye className="text-[#c9a227] shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Privacidade</h4>
                                <p className="text-gray-400">Com películas fumê ou espelhadas, você enxerga para fora normalmente, mas ninguém vê o interior do seu ambiente durante o dia.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Shield className="text-[#c9a227] shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-2">Segurança</h4>
                                <p className="text-gray-400">Películas de segurança retêm estilhaços em caso de quebra e dificultam invasões e acidentes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contexto Local e Processo */}
            <section className="py-20 bg-[#0a1628] border-y border-white/5 relative px-4">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold font-['Montserrat'] mb-6 text-center text-[#c9a227]">Insulfilm na Zona Oeste</h2>
                        <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                            A Zona Oeste do Rio de Janeiro — que inclui Bangu, Campo Grande, Santa Cruz, Realengo, Padre Miguel, Senador Camará e dezenas de outros bairros — é uma das regiões que mais crescem na cidade. Com esse crescimento vem também a demanda por soluções práticas e acessíveis para melhorar a qualidade de vida dentro de casa e no trabalho.
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-12 text-lg">
                            O insulfilm em Bangu tem se tornado cada vez mais popular não só como medida de conforto, mas também de segurança e economia. Moradores de casas amplas, apartamentos em condomínios e donos de comércios na Estrada do Mendanha, na Rua Fonseca, no Largo do Bangu e nas ruas adjacentes buscam películas que reduzam o calor intenso típico da região.
                        </p>

                        <div className="glass-card p-8 rounded-2xl border border-white/5 mb-12">
                            <h3 className="text-2xl font-bold font-['Montserrat'] mb-4 text-white">Atendimento no Local em Bangu</h3>
                            <p className="text-gray-400 leading-relaxed mb-4">
                                A Lume Controle Solar oferece atendimento personalizado: vou até o seu endereço em Bangu e região, faço a avaliação técnica dos vidros, apresento as opções de película mais adequadas para o seu caso e realizo a instalação no local — sem que você precise se deslocar.
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                O processo é rápido, limpo e sem danos à estrutura: a aplicação não danifica os vidros e, caso necessário no futuro, a película pode ser removida sem deixar resíduos. Trabalho apenas com produtos de procedência certificada e ofereço garantia contra bolhas, delaminação e desbotamento.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center mt-16">
                        <div>
                            <h3 className="text-2xl font-bold font-['Montserrat'] mb-6 text-white">Como funciona a aplicação</h3>
                            <p className="text-gray-400 mb-6 leading-relaxed">Muita gente tem dúvida sobre como é feita a instalação do insulfilm. O processo é simples e não gera transtorno:</p>
                            <ul className="space-y-4">
                                <li className="flex gap-3 items-start">
                                    <CheckCircle size={20} className="text-[#c9a227] shrink-0 mt-0.5" />
                                    <div>
                                        <b className="text-white">Visita técnica gratuita:</b> <span className="text-gray-400">Avaliação no seu endereço em Bangu, medindo a incidência de sol em cada cômodo.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle size={20} className="text-[#c9a227] shrink-0 mt-0.5" />
                                    <div>
                                        <b className="text-white">Indicação da película:</b> <span className="text-gray-400">Recomendação do tipo de filme mais adequado, com clareza nos resultados.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle size={20} className="text-[#c9a227] shrink-0 mt-0.5" />
                                    <div>
                                        <b className="text-white">Aplicação profissional:</b> <span className="text-gray-400">Limpeza total e preparo. Película recortada e aplicada garantindo aderência.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <CheckCircle size={20} className="text-[#c9a227] shrink-0 mt-0.5" />
                                    <div>
                                        <b className="text-white">Pós-aplicação:</b> <span className="text-gray-400">Orientação sobre a secagem e limpeza, deixando tudo no lugar sem sujeira.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-[#111e33] p-8 rounded-2xl border border-white/5">
                            <h4 className="text-[#c9a227] font-bold uppercase tracking-widest text-sm mb-4">Bairros Atendidos na Zona Oeste</h4>
                            <p className="text-gray-300 leading-relaxed text-sm">
                                <strong className="text-white">Bangu</strong>, Campo Grande, Santa Cruz, Realengo, Padre Miguel, Senador Camará, Santíssimo, Cosmos, Inhoaíba, Paciência, Sepetiba, Jardim Sulacap, Deodoro, Magalhães Bastos, Vila Militar, Jacarepaguá, Taquara e toda a região metropolitana do Rio de Janeiro.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Perguntas Frequentes (FAQ) */}
            <section className="py-20 relative px-4">
                <div className="container-lume page-entrance max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-['Montserrat'] mb-4">Perguntas Frequentes (FAQ)</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "1. Quanto custa instalar insulfilm residencial em Bangu?",
                                a: "O valor varia conforme o tipo de película escolhida e a quantidade de metros quadrados de vidro. Películas básicas custam menos do que as linhas nano cerâmica ou de segurança. Ofereço orçamento gratuito e sem compromisso pelo WhatsApp — basta enviar uma mensagem com as medidas ou agendar uma visita para medição no local."
                            },
                            {
                                q: "2. Qual o melhor tipo de insulfilm para casas em Bangu?",
                                a: "Para o clima quente da Zona Oeste, recomendo as películas nano cerâmica ou nano carbono para máxima rejeição de calor. Se privacidade for a prioridade, o G5 fumê é o mais indicado. Para quem não quer alterar a aparência do vidro, a linha IR transparente é a melhor opção."
                            },
                            {
                                q: "3. O insulfilm residencial danifica o vidro?",
                                a: "Não. A aplicação é feita com produtos específicos para limpeza e adesão, sem riscos ao vidro. A instalação profissional garante que não fiquem arranhados ou manchas."
                            },
                            {
                                q: "4. Quanto tempo dura o insulfilm residencial?",
                                a: "Películas residenciais de qualidade têm durabilidade entre 5 e 15 anos, dependendo do tipo de filme e da incidência solar diária. Ofereço garantia em todos os serviços."
                            },
                            {
                                q: "5. Posso instalar insulfilm em vidro temperado?",
                                a: "Sim, desde que seja usada a película correta. Vidros temperados requerem películas com taxa de absorção de calor adequada para evitar estresse térmico. Avalio o tipo de vidro antes de indicar a película, garantindo total segurança."
                            },
                            {
                                q: "6. O insulfilm escurece o ambiente?",
                                a: "Depende do tipo escolhido. Películas como o G5 fumê reduzem bastante a luminosidade — são ideais para quartos ou ambientes onde se quer privacidade. Já as películas nano cerâmica e a linha IR transparente não alteram visualmente os vidros, mantendo a claridade."
                            },
                            {
                                q: "7. Vocês atendem condomínios e empresas em Bangu?",
                                a: "Sim. Atendo residências, apartamentos, condomínios, lojas, clínicas, escritórios e qualquer ambiente comercial arquitetônico."
                            },
                            {
                                q: "8. Por que a Lume não trabalha com insulfilm automotivo?",
                                a: "As películas automotivas e arquitetônicas (para imóveis) possuem tecnologias e comportamentos muito diferentes. Vidros de carros são curvos e sofrem outras pressões, enquanto janelas residenciais são planas e exigem maior absorção e reflexão térmica contínua. Foco 100% no segmento arquitetônico para garantir a máxima durabilidade e performance que a sua casa ou empresa exigem."
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

            {/* Chamada para Ação (CTA Final) */}
            <section className="py-20 relative overflow-hidden bg-[#c9a227]">
                <div className="absolute inset-0 bg-black/10" />
                <div className="container-lume relative z-10 text-center page-entrance">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-black tracking-tight">Pronto para reduzir o calor e a conta de luz?</h2>
                    <p className="text-xl text-black/80 max-w-2xl mx-auto mb-10 font-bold">
                        Peça seu orçamento agora pelo WhatsApp. Atendimento rápido, visita técnica gratuita e aplicação profissional na sua casa ou empresa em Bangu.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://wa.me/5521965140612?text=Olá! Gostaria de um orçamento de insulfilm em Bangu."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-black text-white hover:bg-gray-900 px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-3 drop-shadow-2xl text-sm"
                        >
                            Solicitar Orçamento Grátis <ArrowRight size={18} />
                        </a>
                        <a
                            href="/"
                            className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center text-sm"
                        >
                            Ver Mais Serviços
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
