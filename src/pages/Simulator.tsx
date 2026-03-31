import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Sun, CheckCircle, Smartphone, Home, Shield, Thermometer, Eye, Wind, Building2, Droplets, ChevronRight, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';

type Step = 'welcome' | 'location' | 'condo' | 'priorities' | 'refine_heat_view' | 'refine_privacy' | 'result';

interface ProductInfo {
    id: string;
    name: string;
    description: string;
    price: string;
    heat: string;
    light: string;
    privacy: string;
    color: string;
    tip: string;
}

const PRODUCTS: Record<string, ProductInfo> = {
    nano: { id: 'nano', name: 'NANO CERÂMICA (A Escolha de Luxo)', description: 'A joia da coroa. Bloqueio de calor extremo com transparência cristalina.', price: '220', heat: '95%', light: 'Alta (~75%)', privacy: 'Baixa', color: '#c9a227', tip: 'No Rio, a vista é nosso maior patrimônio. A Nano Cerâmica é a única que protege seus móveis e sua pele sem que você precise \'fechar\' a casa. É o investimento favorito para varandas gourmet e salas com grandes vãos de vidro, mantendo a temperatura agradável sem gastar uma fortuna em ar-condicionado.' },
    dupla: { id: 'dupla', name: 'DUPLA CAMADA (Conforto Noturno)', description: 'Visão relaxante e alta redução de calor com baixíssima refletividade interna.', price: '120', heat: '80%', light: 'Média', privacy: 'Média/Alta', color: '#34d399', tip: 'Muitos clientes reclamam que, ao colocar película, o vidro vira um espelho para dentro da sala à noite. A Dupla Camada resolve isso com tecnologia anti-reflexo. Recomendo muito para quartos e salas de TV, onde o conforto visual noturno e a privacidade são prioridade absoluta.' },
    refletiva: { id: 'refletiva', name: 'REFLETIVA PREMIUM (Privacidade e Performance)', description: 'Máxima privacidade diurna (efeito espelhado) e alta rejeição solar.', price: '95', heat: '87%', light: 'Média/Baixa', privacy: 'Alta (Dia)', color: '#fbbf24', tip: 'É a campeã em redução térmica por um preço justo. Ideal para casas de rua ou apartamentos onde o condomínio permite o efeito espelhado. Durante o dia, você vê tudo lá fora, mas ninguém vê você. É o \'efeito bunker\' contra o sol forte do Rio.' },
    carbono: { id: 'carbono', name: 'CARBONO ELITE (Estética e Durabilidade)', description: 'Estética grafite profunda que não desbota. Ótimo custo-benefício.', price: '80', heat: '70%', light: 'Baixa', privacy: 'Alta', color: '#60a5fa', tip: 'Se você busca aquele visual \'grafite\' sofisticado e quer fugir das películas baratas que ficam roxas com o tempo, a Carbono é o caminho. Ela dá um ar moderno à fachada e é excelente para reduzir o brilho excessivo em escritórios ou quartos muito claros.' },
    jateado: { id: 'jateado', name: 'JATEADO DESIGN (Privacidade Total)', description: 'Foco 100% em privacidade e estética sem perder luminosidade.', price: '90', heat: '5%', light: 'Alta (Difusa)', privacy: 'Total', color: '#94a3b8', tip: 'O Jateado transforma o vidro em um elemento de decoração. No box do banheiro, ele esconde a bagunça dos produtos e dá um ar de \'spa\'. Em escritórios, garante a privacidade das reuniões sem bloquear a luz. Lembre-se: ele é focado em privacidade, não em calor!' }
};

export function SimulatorPage() {
    const [step, setStep] = useState<Step>('welcome');

    // Logic state
    const [location, setLocation] = useState('');
    const [condoRule, setCondoRule] = useState('');
    const [priorities, setPriorities] = useState<string[]>([]);

    // Refinement state
    const [refineHeatView, setRefineHeatView] = useState('');
    const [refinePrivacy, setRefinePrivacy] = useState('');

    // Result output
    const [bestMatch, setBestMatch] = useState<ProductInfo | null>(null);
    const [alternativeMatch, setAlternativeMatch] = useState<ProductInfo | null>(null);
    const [directMatch, setDirectMatch] = useState(false);

    useEffect(() => {
        gsap.fromTo('.page-entrance',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, [step]);


    const handlePriorityToggle = (id: string) => {
        if (priorities.includes(id)) {
            setPriorities(priorities.filter(p => p !== id));
        } else if (priorities.length < 3) {
            setPriorities([...priorities, id]);
        }
    };

    const calculateResult = () => {
        let scores = { nano: 0, dupla: 0, refletiva: 0, carbono: 0, jateado: 0 };
        let restricao_condominio = false;

        // Step 1: Location
        if (location === 'janelas') scores.nano += 3;
        if (location === 'varanda') scores.nano += 5;

        // Handling direct matches
        if (location === 'box') {
            setBestMatch(PRODUCTS.jateado);
            setAlternativeMatch(null);
            setDirectMatch(true);
            setStep('result');
            return;
        }
        if (location === 'portas') {
            setBestMatch(PRODUCTS.jateado);
            setAlternativeMatch(PRODUCTS.carbono);
            setDirectMatch(true);
            setStep('result');
            return;
        }

        // Step 2: Condo Filter
        if (condoRule === 'sim') restricao_condominio = true;
        if (condoRule === 'nao') scores.refletiva += 2;

        // Step 3: Priorities
        if (priorities.includes('calor')) {
            scores.nano += 3; scores.refletiva += 3; scores.dupla += 2;
        }
        if (priorities.includes('vista')) {
            scores.nano += 5; scores.carbono -= 3;
        }
        if (priorities.includes('privacidade')) {
            scores.refletiva += 4; scores.dupla += 2; scores.carbono += 2;
        }
        if (priorities.includes('noite')) {
            scores.dupla += 4; scores.nano += 2;
        }
        if (priorities.includes('estetica')) {
            scores.carbono += 10; scores.dupla += 2;
        }
        if (priorities.includes('preco')) {
            scores.carbono += 3; scores.refletiva += 2;
        }

        // Step 4: Refinements
        if (refineHeatView === 'invisivel') scores.nano += 3;
        if (refineHeatView === 'fume') scores.dupla += 2;

        if (refinePrivacy === 'sim') scores.dupla += 4;
        if (refinePrivacy === 'nao') {
            scores.carbono += 2; scores.refletiva += 2;
        }

        // Apply Condo Restriction at the very end
        if (restricao_condominio) scores.refletiva = -100;

        // Rank products
        const ranked = Object.keys(scores)
            .filter(k => k !== 'jateado') // Usually not a winner in standard windows/balconies vs other films
            .map(key => ({ id: key, score: scores[key as keyof typeof scores] }))
            .sort((a, b) => b.score - a.score);

        setBestMatch(PRODUCTS[ranked[0].id]);
        setAlternativeMatch(PRODUCTS[ranked[1].id]);
        setDirectMatch(false);
        setStep('result');
    };

    const processNextStep = () => {
        if (step === 'welcome') setStep('location');
        else if (step === 'location') {
            if (location === 'box' || location === 'portas') {
                calculateResult();
            } else {
                setStep('condo');
            }
        }
        else if (step === 'condo') setStep('priorities');
        else if (step === 'priorities') {
            if (priorities.includes('calor') && priorities.includes('vista')) {
                setStep('refine_heat_view');
            } else if (priorities.includes('privacidade')) {
                setStep('refine_privacy');
            } else {
                calculateResult();
            }
        }
        else if (step === 'refine_heat_view') {
            if (priorities.includes('privacidade')) {
                setStep('refine_privacy');
            } else {
                calculateResult();
            }
        }
        else if (step === 'refine_privacy') {
            calculateResult();
        }
    };

    const resetSimulator = () => {
        setLocation('');
        setCondoRule('');
        setPriorities([]);
        setRefineHeatView('');
        setRefinePrivacy('');
        setBestMatch(null);
        setAlternativeMatch(null);
        setStep('welcome');
    };

    const sendWhatsApp = () => {
        if (!bestMatch) return;
        const msg = `Olá! O Assistente LUME me recomendou a película *${bestMatch.name}*. Gostaria de mais informações e um orçamento!`;
        const url = `https://wa.me/5521965140612?text=${msg}`;
        
        if (typeof (window as any).gtagSendEvent === 'function') {
            (window as any).gtagSendEvent(url);
        } else {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-[#070f1a] text-white py-12 px-4 sm:px-6 relative flex flex-col items-center">
            <Helmet>
                <title>Simulador LUME | Descubra a Película Ideal para seu Ambiente</title>
                <meta name="description" content="Utilize o Simulador da LUME e descubra gratuitamente a melhor película de controle solar (insulfilm) para sua casa ou apartamento no Rio de Janeiro." />
            </Helmet>
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#c9a227]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1a3a5c]/20 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-xl mx-auto flex-1 flex flex-col">
                {/* Header Back Link */}
                <header className="text-center mb-8">
                    <a href="/" className="inline-block hover:opacity-80 transition-opacity group">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl font-['Montserrat']">
                            LU<span className="text-gradient-gold">ME</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            <ArrowLeft size={10} /> Voltar ao site
                        </p>
                    </a>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col justify-center">

                    {step === 'welcome' && (
                        <div className="page-entrance text-center glass-card p-8 rounded-2xl border border-white/5">
                            <div className="w-16 h-16 mx-auto bg-[#c9a227]/20 rounded-full flex items-center justify-center mb-6 border border-[#c9a227]/50">
                                <Smartphone className="text-[#c9a227] w-8 h-8" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat'] mb-4">Descubra sua Película Ideal</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Olá! Sou o <strong>Assistente LUME</strong>. ☀️<br /><br />
                                No Rio de Janeiro, o sol não perdoa, mas o conforto da sua casa é nossa prioridade. Vou te ajudar a escolher a película perfeita para a sua necessidade em menos de 1 minuto.
                            </p>
                            <button onClick={processNextStep} className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4">
                                VAMOS LÁ <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 'location' && (
                        <div className="page-entrance glass-card p-6 sm:p-8 rounded-2xl border border-white/5">
                            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-[#c9a227] text-black text-sm flex items-center justify-center">1</span>
                                Onde faremos a instalação?
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { id: 'janelas', label: 'Janelas e Fachadas (Casa ou Apto)', icon: Home },
                                    { id: 'varanda', label: 'Varanda Gourmet / Cortina de Vidro', icon: Sun },
                                    { id: 'box', label: 'Box de Banheiro ou Divisórias', icon: Droplets },
                                    { id: 'portas', label: 'Portas de Vidro Internas', icon: Building2 }
                                ].map(opt => (
                                    <button key={opt.id} onClick={() => setLocation(opt.id)}
                                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all ${location === opt.id ? 'bg-[#c9a227]/10 border-[#c9a227] text-white' : 'bg-transparent border-white/10 hover:border-white/30 text-gray-300'}`}>
                                        <opt.icon className={location === opt.id ? 'text-[#c9a227]' : 'text-gray-500'} />
                                        <span className="font-medium">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                            <button onClick={processNextStep} disabled={!location} className="mt-8 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                PRÓXIMO <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 'condo' && (
                        <div className="page-entrance glass-card p-6 sm:p-8 rounded-2xl border border-white/5">
                            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mb-2 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-[#c9a227] text-black text-sm flex items-center justify-center">2</span>
                                Regras do Condomínio
                            </h2>
                            <p className="text-sm text-gray-400 mb-6 pl-11">Essencial no Rio: existe restrição para películas espelhadas/refletivas na fachada?</p>
                            <div className="space-y-3">
                                {[
                                    { id: 'sim', label: 'Sim, o condomínio é rigoroso (Não pode alterar fachada externa)' },
                                    { id: 'nao', label: 'Não, tenho liberdade ou é uma casa de rua' },
                                    { id: 'duvida', label: 'Não tenho certeza' }
                                ].map(opt => (
                                    <button key={opt.id} onClick={() => setCondoRule(opt.id)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${condoRule === opt.id ? 'bg-[#c9a227]/10 border-[#c9a227] text-white' : 'bg-transparent border-white/10 hover:border-white/30 text-gray-300'}`}>
                                        <span className="font-medium">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                            <button onClick={processNextStep} disabled={!condoRule} className="mt-8 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                PRÓXIMO <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 'priorities' && (
                        <div className="page-entrance glass-card p-6 sm:p-8 rounded-2xl border border-white/5">
                            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mb-2 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-[#c9a227] text-black text-sm flex items-center justify-center">3</span>
                                Seus Desejos Principais
                            </h2>
                            <p className="text-sm text-gray-400 mb-6 pl-11">Selecione até 3 características mais importantes para este ambiente:</p>
                            <div className="space-y-3">
                                {[
                                    { id: 'calor', label: 'Reduzir o calor excessivo e proteger móveis', icon: Thermometer },
                                    { id: 'vista', label: 'Manter a vista e a claridade natural', icon: Sun },
                                    { id: 'privacidade', label: 'Privacidade total durante o dia (quem tá fora não vê)', icon: Shield },
                                    { id: 'noite', label: 'Ver TV/Monitor sem reflexo interno do vidro à noite', icon: Eye },
                                    { id: 'estetica', label: 'Estética moderna (Vidro escurecido/grafite)', icon: Building2 },
                                    { id: 'preco', label: 'Melhor custo-benefício (Preço e Qualidade)', icon: CheckCircle }
                                ].map(opt => {
                                    const isSelected = priorities.includes(opt.id);
                                    const isDisabled = !isSelected && priorities.length >= 3;
                                    return (
                                        <button key={opt.id} onClick={() => handlePriorityToggle(opt.id)} disabled={isDisabled}
                                            className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all ${isSelected ? 'bg-[#c9a227]/10 border-[#c9a227] text-white' : 'bg-transparent border-white/10 hover:border-white/30 text-gray-300'} ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-[#c9a227] border-[#c9a227]' : 'border-gray-500'}`}>
                                                {isSelected && <CheckCircle size={14} className="text-black" />}
                                            </div>
                                            <span className="font-medium text-sm sm:text-base flex-1">{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <button onClick={processNextStep} disabled={priorities.length === 0} className="mt-8 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                VER RESULTADO {priorities.length > 0 && `(${priorities.length}/3)`} <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 'refine_heat_view' && (
                        <div className="page-entrance glass-card p-6 sm:p-8 rounded-2xl border border-white/5">
                            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mb-2 flex items-center gap-3">
                                <span className="text-[#c9a227]"><Wind size={28} /></span>
                                Para Refinar:
                            </h2>
                            <p className="text-sm text-gray-400 mb-6">Você busca redução de calor E manter a claridade. Sobre a aparência do vidro, você prefere:</p>
                            <div className="space-y-3">
                                {[
                                    { id: 'invisivel', label: 'Praticamente invisível (Não muda a estética da casa)' },
                                    { id: 'fume', label: 'Com um leve tom fumê (Suaviza a luz que entra)' }
                                ].map(opt => (
                                    <button key={opt.id} onClick={() => setRefineHeatView(opt.id)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${refineHeatView === opt.id ? 'bg-[#c9a227]/10 border-[#c9a227] text-white' : 'bg-transparent border-white/10 hover:border-white/30 text-gray-300'}`}>
                                        <span className="font-medium">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                            <button onClick={processNextStep} disabled={!refineHeatView} className="mt-8 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                CONTINUE <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 'refine_privacy' && (
                        <div className="page-entrance glass-card p-6 sm:p-8 rounded-2xl border border-white/5">
                            <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mb-2 flex items-center gap-3">
                                <span className="text-[#c9a227]"><Eye size={28} /></span>
                                Sobre a Privacidade:
                            </h2>
                            <p className="text-sm text-gray-400 mb-6">Sabemos que privacidade é importante. Porém, à noite (com a luz interna acesa), películas muito refletivas criam um efeito espelho interno. Isso te incomoda?</p>
                            <div className="space-y-3">
                                {[
                                    { id: 'sim', label: 'Sim, me incomoda. Quero evitar reflexões internas fortes.' },
                                    { id: 'nao', label: 'Não me importo tanto com isso.' }
                                ].map(opt => (
                                    <button key={opt.id} onClick={() => setRefinePrivacy(opt.id)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${refinePrivacy === opt.id ? 'bg-[#c9a227]/10 border-[#c9a227] text-white' : 'bg-transparent border-white/10 hover:border-white/30 text-gray-300'}`}>
                                        <span className="font-medium">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                            <button onClick={processNextStep} disabled={!refinePrivacy} className="mt-8 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                VER RESULTADO <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {step === 'result' && bestMatch && (
                        <div className="page-entrance">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold mb-4">
                                    <CheckCircle size={16} /> ANÁLISE CONCLUÍDA
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat']">Aqui está minha recomendação!</h2>
                            </div>

                            <div className="glass-card p-6 sm:p-8 rounded-2xl border mb-6 relative overflow-hidden" style={{ borderColor: `${bestMatch.color}40` }}>
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10" style={{ backgroundColor: bestMatch.color }} />

                                <span className="text-xs uppercase tracking-widest font-bold block mb-2" style={{ color: bestMatch.color }}>🥇 Melhor Escolha</span>
                                <h3 className="text-2xl sm:text-3xl font-bold font-['Montserrat'] mb-4 text-white">
                                    {bestMatch.name}
                                </h3>

                                <p className="text-gray-300 leading-relaxed mb-6 font-medium">
                                    A combinação ideal para o seu perfil. {bestMatch.description}
                                </p>

                                <div className="bg-[#c9a227]/10 border border-[#c9a227]/30 rounded-xl p-4 mb-6">
                                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#c9a227] mb-2">💡 Dica do Especialista</h4>
                                    <p className="text-xs text-gray-300 italic leading-relaxed">
                                        "{bestMatch.tip}"
                                    </p>
                                </div>

                                <div className="bg-[#0a1628]/50 rounded-xl p-5 border border-white/5 space-y-3 mb-6">
                                    <h4 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Ficha Técnica</h4>
                                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                        <span className="text-gray-400 text-sm">Redução de Calor</span>
                                        <span className="font-bold text-white">{bestMatch.heat}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                        <span className="text-gray-400 text-sm">Entrada de Luz</span>
                                        <span className="font-bold text-white">{bestMatch.light}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                        <span className="text-gray-400 text-sm">Privacidade</span>
                                        <span className="font-bold text-white">{bestMatch.privacy}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-gray-400 text-sm">Investimento (a partir de)</span>
                                        <span className="font-bold text-[#c9a227]">R$ {bestMatch.price}/m²</span>
                                    </div>
                                </div>

                                <button onClick={sendWhatsApp} className="w-full btn-primary py-4 text-lg flex justify-center items-center gap-3">
                                    <Smartphone /> QUERO ESSA NO MEU ORÇAMENTO
                                </button>
                            </div>

                            {alternativeMatch && !directMatch && (
                                <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/5 bg-[#0a1628]/80 text-left">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 block mb-1">🥈 Opção Alternativa</span>
                                    <h4 className="text-lg font-bold font-['Montserrat'] text-white mb-2">{alternativeMatch.name}</h4>
                                    <p className="text-sm text-gray-400 mb-3">{alternativeMatch.description}</p>
                                    <p className="text-xs font-bold text-[#c9a227]">A partir de R$ {alternativeMatch.price}/m²</p>
                                </div>
                            )}

                            <button onClick={resetSimulator} className="mt-8 w-full text-center text-sm text-gray-500 hover:text-white transition-colors underline underline-offset-4">
                                Refazer o Teste
                            </button>
                        </div>
                    )}

                    {step !== 'welcome' && step !== 'result' && (
                        <button
                            onClick={resetSimulator}
                            className="mt-6 text-gray-500 hover:text-[#c9a227] text-xs uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                            <ArrowLeft size={12} /> Reiniciar / Voltar ao Início
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
