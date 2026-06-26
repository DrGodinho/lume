import { Shield, Sun, Thermometer, CheckCircle, ArrowRight, Eye, SunDim, Star, PiggyBank, Lock, MapPin, Zap, MessageCircle, Droplets } from 'lucide-react';
import { GoogleReviews } from '../components/GoogleReviews';
import { Particles } from '../components/Particles';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { NeighborhoodAnimations } from '../components/NeighborhoodAnimations';
import Image from 'next/image';

export function SulacapPage() {
    return (
        <div className="bg-[#04080f] text-white min-h-screen">
            <NeighborhoodAnimations />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image src="/hero-bg-v2.png" alt="Instalação de insulfilm profissional no Jardim Sulacap - LUME Controle Solar" fill sizes="(max-width: 768px) 100vw, 100vw" priority className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#04080f]/95 via-[#04080f]/80 to-[#04080f]/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-transparent to-[#04080f]/50" />
                </div>

                {/* Particles & Effects */}
                <Particles />
                
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04080f] to-transparent z-10" />
                <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#c9a227]/5 blur-3xl animate-float z-10 pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#1a3a5c]/30 blur-3xl animate-float z-10 pointer-events-none" style={{ animationDelay: '2s' }} />

                <div className="container-lume relative z-20 page-entrance text-center md:text-left pt-24 pb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse flex-shrink-0" />
                        <span className="text-[#c9a227] text-sm font-bold uppercase tracking-wider">Jardim Sulacap e Região</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-montserrat mb-6 leading-tight">
                        Insulfilm em <span className="text-gradient-gold">Sulacap</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed font-light">
                        Eleve o conforto da sua casa com películas de controle solar de alta performance. Proteção contra o calor intenso, privacidade absoluta e economia real para moradores do Jardim Sulacap e adjacências.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a
                            href="https://wa.me/5521965140612?text=Olá! Quero um orçamento de insulfilm em Sulacap."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8 transform transition hover:scale-105"
                        >
                            Pedir Orçamento pelo WhatsApp <ArrowRight size={20} />
                        </a>
                        <a
                            href="#tipos"
                            className="btn-outline inline-flex items-center justify-center gap-3 text-lg py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-widest text-sm"
                        >
                            Ver Tipos de Película
                        </a>
                    </div>
                </div>
            </section>

            {/* Faixa de Garantias e Benefícios (Merged Strip) */}
            <section className="py-8 bg-[#04080f] border-b border-white/5 relative z-10">
                <div className="container-lume page-entrance">
                    <div className="flex flex-wrap justify-center gap-6 lg:gap-8 text-sm text-gray-400 font-medium">
                        <div className="flex items-center gap-2"><Thermometer size={16} className="text-[#c9a227]" /> Até 80% de Rejeição de Calor</div>
                        <div className="flex items-center gap-2"><Sun size={16} className="text-[#c9a227]" /> 99% Bloqueio Anti-UV</div>
                        <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#c9a227]" /> Orçamento Gratuito no Local</div>
                        <div className="flex items-center gap-2"><Shield size={16} className="text-[#c9a227]" /> Garantia de 5 Anos Lume</div>
                    </div>
                </div>
            </section>

            {/* O problema do Calor em Sulacap */}
            <section className="py-24 bg-[#070f1a] relative px-4">
                <div className="container-lume page-entrance">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
                                Conforto Térmico
                            </span>
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-bold font-montserrat mb-10">O Rio exige proteção superior</h2>
                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light text-left md:text-justify px-4">
                            <p>
                                O Jardim Sulacap possui características únicas: a proximidade com áreas verdes da Zona Oeste e o clima tradicionalmente quente da região criam um contraste. Durante o verão, a radiação solar incide diretamente sobre janelas, portas de vidro e varandas, tornando o ambiente interno sufocante e exigindo que o ar-condicionado funcione no máximo.
                            </p>
                            <p>
                                O excesso de sol não apenas compromete o seu bem-estar, mas também desbota móveis, pisos e cortinas em ritmo acelerado. Com as nossas soluções de controle solar, nós transformamos seus vidros comuns em verdadeiros escudos térmicos, capazes de rejeitar até 80% do calor antes que ele invada a sua casa.
                            </p>
                            <p>
                                A <strong className="text-white">LUME Controle Solar</strong> vai até a sua residência ou comércio em Sulacap para avaliar cada detalhe. Mais do que vender um produto, nós entregamos tranquilidade. Nossa instalação de elite garante um acabamento livre de bolhas, trazendo sofisticação e conforto imediato, enquanto você economiza na conta de luz a longo prazo.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-10 rounded-3xl border border-white/10 relative overflow-hidden max-w-4xl mx-auto">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#c9a227] blur-[100px] opacity-10" />
                        <h3 className="text-2xl font-bold font-montserrat text-center mb-8">Elegância e Valorização do Imóvel</h3>
                        <p className="text-gray-400 leading-relaxed text-center max-w-3xl mx-auto font-light text-lg">
                            Aplicar insulfilm deixou de ser apenas sobre escurecer janelas. Hoje, é uma questão de arquitetura moderna. Uma película bem escolhida valoriza a fachada do seu imóvel no Jardim Sulacap, confere privacidade total para sua família e moderniza o ambiente de trabalho no comércio local, seja ao longo da Avenida Marechal Fontenelle ou dentro de condomínios residenciais.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tipos de Insulfilm */}
            <section id="tipos" className="py-24 bg-[#04080f] border-y border-white/5 px-4 overflow-hidden relative">
                <div className="container-lume relative z-10">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
                                Películas
                            </span>
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-bold font-montserrat mb-6 text-white">
                            Tecnologia em <span className="text-gradient-gold">Filmes para Vidros</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg">
                            Nós não trabalhamos com insulfilm barato que desbota em meses. Oferecemos apenas linhas premium que resolvem definitivamente o seu problema.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {[
                            {
                                title: "Nano Cerâmica", selo: "Top de Linha", icon: Star, image: "/product-nano-ceramica.webp", path: "/nano-ceramica",
                                desc: "O ápice da tecnologia térmica. Rejeita até 95% do infravermelho (calor) sem escurecer o vidro. Ideal para quem quer preservar a luz natural em salas amplas e varandas, barrando apenas o calor e os raios UV."
                            },
                            {
                                title: "Carbono Premium", selo: "Best-Seller", icon: SunDim, image: "/product-carbono.webp", path: "/carbono",
                                desc: "O tom fumê sofisticado que não fica roxo com o tempo. Oferece alta privacidade durante o dia, bloqueio superior de calor (até 80%) e um acabamento incrivelmente elegante, muito requisitado em casas de condomínio."
                            },
                            {
                                title: "Espelhado / Refletivo", selo: "Privacidade", icon: Sun, image: "/product-refletiva.webp", path: "/refletiva",
                                desc: "A armadura térmica contra o sol forte. Reflete a luz externa, bloqueando o calor extremo e garantindo que ninguém consiga ver o interior do ambiente durante o dia. Perfeito para fachadas comerciais e residenciais muito expostas."
                            },
                            {
                                title: "Jateado / Fosco", selo: "Decoração", icon: Eye, image: "/product-jateado-v2.webp", path: "/jateado",
                                desc: "A alternativa moderna e econômica ao vidro jateado. Bloqueia a visão nos dois sentidos sem impedir a passagem da luz. Fundamental para banheiros, área de serviço, portas e divisórias internas de escritórios."
                            },
                            {
                                title: "Dupla Camada", selo: "Custo-Benefício", icon: Droplets, image: "/product-smoke.webp", path: "/dupla-camada",
                                desc: "A combinação de estética e conforto térmico num nível superior ao poliéster comum. Alta redução de claridade e menos brilho intenso nas telas da sua TV ou computador, proporcionando um ambiente relaxante."
                            }
                        ].map((product, idx) => (
                            <div key={idx} className="product-card group relative bg-gradient-to-b from-[#0a1628]/60 to-[#04080f]/90 rounded-2xl overflow-hidden border border-white/5 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#c9a227] text-[#04080f] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg pointer-events-none">
                                    {product.selo}
                                </div>
                                <a href={product.path + '/'} className="flex flex-col flex-grow">
                                    <div className="relative h-44 overflow-hidden">
                                        <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-transparent to-transparent opacity-80" />
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 mb-4">
                                            <product.icon className="w-5 h-5 text-[#c9a227]" />
                                            <h3 className="text-xl font-bold text-white font-montserrat leading-tight">
                                                {product.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-6 leading-relaxed font-light flex-grow">
                                            {product.desc}
                                        </p>
                                        
                                        {/* Specs */}
                                        <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-white/5">
                                            <div className="text-[10px] sm:text-xs">
                                                <span className="text-gray-500 block">{product.path === '/nano-ceramica' ? 'Luminosidade' : 'Bloqueio UV'}</span>
                                                <span className="text-[#c9a227] font-semibold">
                                                    {product.path === '/nano-ceramica' ? 'Preservada' : product.path === '/jateado' ? '99%' : product.path === '/refletiva' ? '100%' : '99%'}
                                                </span>
                                            </div>
                                            <div className="text-[10px] sm:text-xs">
                                                <span className="text-gray-500 block">{product.path === '/jateado' ? 'Privacidade' : 'Rejeição de Calor'}</span>
                                                <span className="text-[#c9a227] font-semibold">
                                                    {product.path === '/nano-ceramica' ? 'Até 95%' : product.path === '/jateado' ? 'Total (24h)' : product.path === '/carbono' ? 'Até 70%' : product.path === '/refletiva' ? '87%' : '80%'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>

                                <div className="p-6 pt-0">
                                    <a
                                        href={`https://wa.me/5521965140612?text=Olá! Quero saber sobre a película ${product.title} em Sulacap.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3.5 rounded-xl bg-[#111e33] hover:bg-[#c9a227] text-gray-300 hover:text-[#04080f] text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 border border-white/5"
                                    >
                                        Solicitar Orçamento <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefícios */}
            <section id="vantagens" className="py-24 relative px-4 bg-[#04080f] overflow-hidden">
                <div className="container-lume">
                    <div className="text-center mb-20">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
                                Porque Escolher a Lume
                            </span>
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">Vantagens que Protegem seu Bolso e sua Família</h2>
                        <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light">Uma instalação profissional de películas não é gasto, é um investimento com retorno garantido no seu bem-estar.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Thermometer, title: "Ambiente Agradável", stat: "-8°C", label: "No Interior",
                                desc: "Diga adeus à sensação de estufa na sala. Nossas películas garantem uma queda drástica na temperatura perceptível."
                            },
                            {
                                icon: SunDim, title: "Bloqueio Anti-UV", stat: "99%", label: "De Proteção",
                                desc: "Preserve a cor e a integridade do seu sofá de couro, dos pisos laminados, cortinas caras e proteja a pele da sua família."
                            },
                            {
                                icon: PiggyBank, title: "Economia Contínua", stat: "30%", label: "Na Fatura",
                                desc: "Um ambiente mais fresco reduz o esforço e o tempo que seu ar-condicionado precisa ficar ligado, cortando os custos elétricos de forma substancial."
                            },
                            {
                                icon: Lock, title: "Garantia Documentada", stat: "100%", label: "Segurança",
                                desc: "Você recebe a nossa Garantia Oficial de 5 anos por escrito. A confiança de que seu insulfilm não vai formar bolhas no ano seguinte."
                            }
                        ].map((benefit, idx) => (
                            <div key={idx} className="benefit-card group relative p-10 rounded-2xl bg-gradient-to-b from-[#1a3a5c]/40 to-[#04080f]/60 border border-[#1a3a5c]/30 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2 text-center lg:text-left flex flex-col">
                                <div className="w-16 h-16 rounded-2xl bg-[#c9a227]/10 flex items-center justify-center mx-auto lg:mx-0 mb-8 group-hover:bg-[#c9a227]/20 transition-colors shadow-inner">
                                    <benefit.icon className="w-8 h-8 text-[#c9a227] group-hover:scale-110 transition-transform" />
                                </div>
                                
                                <div className="mb-6">
                                    <span className="text-5xl font-black text-gradient-gold font-montserrat leading-none">
                                        <AnimatedCounter 
                                            target={benefit.stat.replace(/[^0-9-]/g, '')} 
                                            suffix={benefit.stat.replace(/[0-9-]/g, '')} 
                                        />
                                    </span>
                                    <p className="text-[11px] uppercase text-gray-500 font-black tracking-widest mt-2">{benefit.label}</p>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-4 font-montserrat leading-tight">
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

            {/* Contexto Local */}
            <section className="py-24 bg-[#04080f] border-y border-white/5 relative px-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
                <div className="container-lume page-entrance relative z-10">
                    <div className="max-w-4xl mx-auto text-center lg:text-left">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
                                Atendimento
                            </span>
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-10 text-center text-[#c9a227] tracking-tight underline decoration-[#c9a227]/20 underline-offset-8">Sua Referência em Sulacap</h2>
                        
                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light text-center lg:text-justify mb-16 px-4 md:px-0">
                            <p>
                                O Jardim Sulacap é um bairro que preza pela tranquilidade e por áreas residenciais bem estruturadas. Para manter a qualidade de vida, moradores de casas de vila, condomínios e apartamentos buscam soluções que aliam discrição e alto desempenho.
                            </p>
                            <p>
                                A <strong className="text-white">LUME Controle Solar</strong> entende exatamente essa demanda. Nossa equipe leva até você na região do Parque Sulacap, Catonho e adjacências um atendimento padrão ouro: vamos até o imóvel com catálogos e medidores de calor, ajudando você a escolher a película perfeita no conforto da sua casa, sem adivinhações.
                            </p>
                        </div>
                        
                        <div className="grid lg:grid-cols-2 gap-12 items-stretch mt-12 text-left">
                            <div className="glass-card p-10 rounded-3xl border border-white/10 flex flex-col h-full bg-white/[0.01]">
                                <h3 className="text-2xl font-bold font-montserrat mb-8 text-white flex items-center gap-3">
                                    <MapPin size={24} className="text-[#c9a227]" /> Atendimento VIP em Casa
                                </h3>
                                <p className="text-gray-400 leading-relaxed mb-8 text-base font-light">
                                    Não importa se você precisa escurecer a janela do quarto para dormir melhor, reduzir o calor escaldante da varanda ou garantir privacidade na frente da rua. O processo é simples, prático e limpo.
                                </p>
                                <ul className="space-y-4 mb-4">
                                    <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Agendamento pelo WhatsApp sem burocracia</li>
                                    <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Mostruário físico no momento da visita</li>
                                    <li className="flex gap-3 text-base text-gray-300 font-bold"><CheckCircle size={20} className="text-[#c9a227] shrink-0" /> Limpeza total do ambiente pós-aplicação</li>
                                </ul>
                            </div>

                            <div className="bg-[#111e33] p-10 rounded-3xl border border-white/10 h-full shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <MapPin size={120} className="text-white" />
                                </div>
                                <h4 className="text-[#c9a227] font-black uppercase tracking-[0.2em] text-sm mb-8 flex items-center gap-3">
                                    <Zap size={18} className="animate-pulse" /> Atendimento Expresso
                                </h4>
                                <div className="space-y-6 relative z-10">
                                    <p className="text-gray-300 font-bold text-lg mb-4">Nossa zona de ação inclui:</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-400 uppercase tracking-wider">
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Jardim Sulacap</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Vila Valqueire</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Magalhães Bastos</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Realengo</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Taquara</div>
                                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" /> Campo dos Afonsos</div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-6 pt-6 border-t border-white/5">Equipe sediada estrategicamente para atender a Zona Oeste com máxima agilidade e compromisso.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 relative px-4 overflow-hidden bg-[#04080f]">
                <div className="container-lume page-entrance max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
                                FAQ
                            </span>
                            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">Principais Dúvidas</h2>
                        <p className="text-gray-500 font-medium">Respostas claras sobre os nossos serviços de aplicação no Jardim Sulacap.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "1. Vocês cobram a visita técnica em Sulacap?",
                                a: "Não. A visita técnica para medição e orçamento no Jardim Sulacap e redondezas é totalmente gratuita e não gera compromisso algum para o cliente."
                            },
                            {
                                q: "2. Posso lavar os vidros após a aplicação do insulfilm?",
                                a: "Sim, porém é necessário aguardar um período de secagem e cura de cerca de 7 dias após a instalação. Depois desse prazo, você pode limpá-los normalmente utilizando sabão neutro e pano macio, evitando abrasivos."
                            },
                            {
                                q: "3. O insulfilm resolve o problema de calor sem escurecer a sala?",
                                a: "Completamente. Para essa finalidade, nós utilizamos a tecnologia Nano Cerâmica (linhas IR). Elas rejeitam uma enorme quantidade de calor infravermelho mantendo uma tonalidade muito clara, o que preserva a visão e a iluminação original da sua janela ou varanda."
                            },
                            {
                                q: "4. Quanto tempo leva a instalação em um apartamento padrão?",
                                a: "O tempo varia de acordo com a quantidade de vidros. Para a maioria dos apartamentos residenciais, o serviço é concluído em algumas horas (geralmente entre 2 a 4 horas), de forma limpa e muito ágil."
                            },
                            {
                                q: "5. A garantia de 5 anos cobre o quê?",
                                a: "A garantia Lume cobre defeitos de instalação, descolamento natural, surgimento de bolhas inesperadas e perda agressiva de coloração (desbotamento acentuado), assegurando que seu investimento dure por anos."
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

            {/* Chamada para Ação */}
            <section className="py-24 relative overflow-hidden bg-[#04080f]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#04080f] to-[#04080f]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a227]/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#25d366]/5 blur-[120px] rounded-full" />

                <div className="container-lume relative z-10 px-4">
                    <div className="max-w-5xl mx-auto glass-card border border-white/10 rounded-[2.5rem] p-8 md:p-16 text-center animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent opacity-30" />
                        
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 font-montserrat tracking-tighter leading-tight">
                            Transforme sua Casa em um <span className="text-gradient-gold">Refúgio Térmico</span>
                        </h2>
                        
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                            A <strong className="text-white">LUME</strong> está pronta para atender o Jardim Sulacap com o que há de melhor em tecnologia de controle solar. Não adie seu conforto.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <a
                                href="https://wa.me/5521965140612?text=Olá! Gostaria de um orçamento para insulfilm na região do Sulacap."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto bg-[#25d366] hover:bg-[#20bd5a] text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.05] shadow-[0_15px_45px_rgba(37,211,102,0.3)] flex items-center justify-center gap-4 text-sm group"
                            >
                                <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                                Orçamento via WhatsApp
                            </a>
                            
                            <a
                                href="/"
                                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-6 rounded-2xl font-bold uppercase tracking-widest transition-all text-sm backdrop-blur-sm"
                            >
                                Conhecer Lume
                            </a>
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center gap-8 text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#c9a227]" /> Instalação Premium</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#c9a227]" /> Orçamento Local Grátis</span>
                            <span className="flex items-center gap-2"><CheckCircle size={14} className="text-[#c9a227]" /> 5 Anos de Garantia</span>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 bg-[#04080f] border-t border-white/5 text-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] px-4">
                 © {new Date().getFullYear()} Lume Controle Solar · Conforto e Privacidade em Sulacap e RJ
            </footer>
        </div>
    );
}
