'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  Building,
  Calculator,
  Flame,
  Library,
  Minus,
  PiggyBank,
  Plus,
  ShieldCheck,
  Snowflake,
  ThermometerSun,
  Wallet,
  Zap,
} from 'lucide-react';
import { HeroEntrance } from '../components/HeroEntrance';
import { Particles } from '../components/Particles';
import { ContactCTA } from '../sections/ContactCTA';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';

type Filme = 'metalizada' | 'nano';

const FAQS = [
  {
    q: 'A película vai deixar a casa muito escura?',
    a: 'Não necessariamente. Películas de Nano Cerâmica podem manter alta passagem de luz com forte bloqueio de calor.',
  },
  {
    q: 'Qual a durabilidade do investimento?',
    a: 'Linhas premium costumam ter garantias de fábrica de 5 a 10 anos, com retorno financeiro em poucos anos.',
  },
  {
    q: 'Esse simulador substitui visita técnica?',
    a: 'Não. Ele é uma estimativa inicial para tomada de decisão. O estudo final depende de orientação solar, área de vidro e rotina real de uso.',
  },
];

const FILMES = {
  metalizada: {
    nome: 'Metalizada Premium',
    reducao: 0.25,
    precoM2: 120,
    resumo: 'Alta reflexão solar para reduzir o esforço do ar-condicionado.',
  },
  nano: {
    nome: 'Nano Cerâmica',
    reducao: 0.3,
    precoM2: 220,
    resumo: 'Maior bloqueio de infravermelho com mais transparência.',
  },
} satisfies Record<Filme, { nome: string; reducao: number; precoM2: number; resumo: string }>;

const formatBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function CalculadoraEconomiaEnergiaPage() {
  const [contaMensal, setContaMensal] = useState(500);
  const [quantidadeAC, setQuantidadeAC] = useState(1);
  const [horasDia, setHorasDia] = useState(8);
  const [areaVidro, setAreaVidro] = useState(8);
  const [filme, setFilme] = useState<Filme>('nano');
  const filmeSelecionado = FILMES[filme];

  // Ref para monitorar visibilidade da calculadora no mobile
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [showMobileSticky, setShowMobileSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Exibe a barra flutuante apenas quando a calculadora está visível na tela
        setShowMobileSticky(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    const currentRef = calculatorRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const simulacao = useMemo(() => {
    const tarifaKwh = 1.0;
    const consumoSplitKwh = 1.1;
    const participacaoContaAr = 0.5; // media de 45-55%
    const reducaoCompressor = filmeSelecionado.reducao;

    const custoAcPorUso = quantidadeAC * horasDia * 30 * consumoSplitKwh * tarifaKwh;
    const custoAcPorConta = contaMensal * participacaoContaAr;
    const baseReferencia = (custoAcPorUso + custoAcPorConta) / 2;

    const economiaMensal = baseReferencia * reducaoCompressor;
    const economiaAnual = economiaMensal * 12;
    const investimento = areaVidro * filmeSelecionado.precoM2;
    const paybackMeses = economiaMensal > 0 ? investimento / economiaMensal : 0;

    const economiaMin = (contaMensal * 0.45) * 0.25;
    const economiaMax = (contaMensal * 0.55) * 0.3;

    return {
      tarifaKwh,
      consumoSplitKwh,
      custoAcPorUso,
      custoAcPorConta,
      economiaMensal,
      economiaAnual,
      investimento,
      paybackMeses,
      economiaMin,
      economiaMax,
    };
  }, [areaVidro, contaMensal, filmeSelecionado.precoM2, filmeSelecionado.reducao, horasDia, quantidadeAC]);

  // Hook personalizado embutido para interpolação suave
  function useAnimatedValue(targetValue: number) {
    const [currentValue, setCurrentValue] = useState(targetValue);
    const frameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const startValueRef = useRef(targetValue);

    useEffect(() => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      startValueRef.current = currentValue;
      startTimeRef.current = null;

      const duration = 250; // transição ultra-rápida e fluida

      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        const ease = 1 - Math.pow(1 - progress, 3); // ease out cubic
        const nextValue = startValueRef.current + (targetValue - startValueRef.current) * ease;
        
        setCurrentValue(nextValue);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setCurrentValue(targetValue);
        }
      };

      frameRef.current = requestAnimationFrame(animate);

      return () => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
        }
      };
    }, [targetValue]);

    return currentValue;
  }

  // Valores animados em tempo real
  const animEconomiaMensal = useAnimatedValue(simulacao.economiaMensal);
  const animEconomiaAnual = useAnimatedValue(simulacao.economiaAnual);
  const animInvestimento = useAnimatedValue(simulacao.investimento);
  const animPaybackMeses = useAnimatedValue(simulacao.paybackMeses);
  const animEconomiaMin = useAnimatedValue(simulacao.economiaMin);
  const animEconomiaMax = useAnimatedValue(simulacao.economiaMax);

  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.webp"
            alt="Fachada residencial com incidência solar"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-[#04080f]/60 to-[#04080f]/20" />
        </div>
        <Particles />
        <div className="absolute top-24 right-8 w-32 h-32 rounded-full bg-[#c9a227]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 rounded-full bg-[#c9a227]/10 blur-3xl pointer-events-none" />

        <div className="container-lume relative z-20">
          <HeroEntrance className="max-w-5xl">
            <div className="animate-hero inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6">
              <Image
                src="/novo-logo-lume.png"
                alt="Logo LUME Controle Solar"
                width={28}
                height={28}
                className="rounded"
              />
              <span className="text-[11px] uppercase tracking-wider text-[#c9a227] font-bold">
                Dossiê Técnico + Simulador Interativo
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] md:leading-tight mb-6 max-w-4xl">
              <span className="word opacity-0 inline-block">Corte</span>{' '}
              <span className="word opacity-0 inline-block">gastos</span>{' '}
              <span className="word opacity-0 inline-block">com</span>{' '}
              <span className="word opacity-0 inline-block text-gradient-gold">energia</span>{' '}
              <span className="word opacity-0 inline-block">blindando</span>{' '}
              <span className="word opacity-0 inline-block">seus</span>{' '}
              <span className="word opacity-0 inline-block">vidros</span>
            </h1>

            <p className="animate-hero text-base md:text-xl text-gray-300 leading-relaxed max-w-3xl">
              Descubra como películas de alta performance bloqueiam até 97% do calor infravermelho antes de entrar no ambiente, reduzindo o esforço do seu ar-condicionado e garantindo economia real todos os meses.
            </p>

            <div className="animate-hero mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#simulador-economia"
                className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Simular agora <ArrowRight size={16} />
              </a>
              <a
                href="#autoridade-tecnica"
                className="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Ver dados técnicos
              </a>
            </div>
          </HeroEntrance>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#04080f] to-transparent z-10" />
      </section>

      <main className="container-lume py-16 md:py-20 space-y-16 md:space-y-20">
        <section className="rounded-2xl border border-[#c9a227]/20 bg-gradient-to-br from-[#0a1220] to-[#111b2d] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto md:text-left">
            <h2 className="text-2xl md:text-4xl font-black mb-6 flex flex-col md:flex-row items-start md:items-center gap-3 text-white">
              <ThermometerSun className="text-[#c9a227] w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
              O Fim do Efeito Estufa e o Retorno do Seu Investimento
            </h2>
            <div className="space-y-4 text-base md:text-lg text-gray-300 leading-relaxed">
              <p>
                O vidro comum é o maior vilão da sua conta de luz. Ele permite a entrada massiva de radiação infravermelha (calor), que é absorvida por móveis e pisos e reemitida para o ambiente. Isso cria um verdadeiro <strong>efeito estufa</strong> dentro da sua casa ou escritório, forçando o seu ar-condicionado a trabalhar no limite o tempo todo.
              </p>
              <p>
                A aplicação de películas de controle solar premium (como Nano Cerâmica ou Metalizadas de alta performance) não é apenas uma questão estética, é um <strong className="text-white">investimento inteligente que se paga sozinho</strong>. Ao bloquear até 97% do calor antes mesmo dele entrar, a película alivia imediatamente o esforço do compressor do seu ar-condicionado, reduzindo sua atividade em até 30%.
              </p>
              <p className="font-bold text-[#c9a227] text-lg md:text-xl pt-2">
                O resultado? Uma redução drástica e contínua no seu consumo elétrico. A economia mensal gerada compensa o custo da instalação em poucos anos, transformando seus vidros em um verdadeiro escudo térmico.
              </p>
            </div>
          </div>
        </section>

        <section id="autoridade-tecnica" className="relative py-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-[#c9a227]/5 rounded-full blur-[120px] pointer-events-none" />
          
          <ScrollReveal animation="slide-up" className="text-center mb-12 relative z-10">
            <div className="animate-item flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
                Comprovação Científica
              </span>
              <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="animate-item text-3xl md:text-5xl font-black mb-4 font-montserrat text-white">
              Dados de Autoridade Técnica
            </h2>
            <p className="animate-item text-gray-400 max-w-2xl mx-auto">
              A eficiência das películas premium não é promessa, é ciência. Instituições globais atestam o impacto direto na conservação de energia.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="elastic-rotate" className="grid md:grid-cols-3 gap-6 mb-12 relative z-10">
            {/* Card 1 */}
            <div className="stat-card group rounded-3xl border border-white/10 bg-gradient-to-b from-[#0f172a] to-[#04080f] p-8 text-center hover:border-[#c9a227]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_-5px_rgba(201,162,39,0.2)]">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Building className="text-[#c9a227] w-8 h-8" />
              </div>
              <p className="text-5xl font-black text-white mb-2 group-hover:text-[#c9a227] transition-colors">
                <AnimatedCounter target="40" suffix="%" />
              </p>
              <h4 className="text-sm font-bold text-gray-200 mb-3">Carga de Resfriamento</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Pode vir exclusivamente do calor que entra pelas janelas de vidro sem proteção.
              </p>
            </div>

            {/* Card 2 */}
            <div className="stat-card group rounded-3xl border border-white/10 bg-gradient-to-b from-[#0f172a] to-[#04080f] p-8 text-center hover:border-[#c9a227]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_-5px_rgba(201,162,39,0.2)]">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Zap className="text-[#c9a227] w-8 h-8" />
              </div>
              <p className="text-5xl font-black text-white mb-2 group-hover:text-[#c9a227] transition-colors">
                <AnimatedCounter target="19" /> <span className="text-2xl">kWh</span>
              </p>
              <h4 className="text-sm font-bold text-gray-200 mb-3">Economia Anual Média</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Estimada por m² de vidro com a instalação de película arquitetônica de alta performance.
              </p>
            </div>

            {/* Card 3 */}
            <div className="stat-card group rounded-3xl border border-white/10 bg-gradient-to-b from-[#0f172a] to-[#04080f] p-8 text-center hover:border-[#c9a227]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_-5px_rgba(201,162,39,0.2)]">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#c9a227]/10 border border-[#c9a227]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <PiggyBank className="text-[#c9a227] w-8 h-8" />
              </div>
              <p className="text-5xl font-black text-white mb-2 group-hover:text-[#c9a227] transition-colors">
                ~<AnimatedCounter target="3" /> <span className="text-2xl">anos</span>
              </p>
              <h4 className="text-sm font-bold text-gray-200 mb-3">Payback Estimado</h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Retorno do investimento médio para retrofit de controle solar em cenários residenciais.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="elastic-rotate" className="grid lg:grid-cols-3 gap-4 relative z-10">
            <div className="stat-card rounded-2xl border border-white/5 bg-[#0a1320]/80 p-6 hover:bg-[#0c1627] hover:border-white/10 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-[#c9a227] w-6 h-6" />
                <h4 className="font-bold text-white group-hover:text-[#c9a227] transition-colors">
                  <a href="https://www.energy.gov" target="_blank" rel="noopener noreferrer">U.S. Dept. of Energy</a>
                </h4>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                O DoE classifica películas de controle solar como tecnologia de ponta para conservação, apontando o vidro desprotegido como o grande responsável pela sobrecarga do ar-condicionado.
              </p>
            </div>

            <div className="stat-card rounded-2xl border border-white/5 bg-[#0a1320]/80 p-6 hover:bg-[#0c1627] hover:border-white/10 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <Library className="text-[#c9a227] w-6 h-6" />
                <h4 className="font-bold text-white group-hover:text-[#c9a227] transition-colors">
                  <a href="https://iwfa.com/energy-control/" target="_blank" rel="noopener noreferrer">IWFA & MDPI</a>
                </h4>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Estudos compilados pela International Window Film Association e publicações no portal MDPI atestam uma redução de 15% a 35% no consumo elétrico do compressor.
              </p>
            </div>

            <div className="stat-card rounded-2xl border border-white/5 bg-[#0a1320]/80 p-6 hover:bg-[#0c1627] hover:border-white/10 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-[#c9a227] w-6 h-6" />
                <h4 className="font-bold text-white group-hover:text-[#c9a227] transition-colors">
                  <a href="https://www.3m.com/3M/en_US/building-window-solutions-us/solutions/energy/" target="_blank" rel="noopener noreferrer">Testes Globais (3M)</a>
                </h4>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Fabricantes de classe mundial, como a 3M, validam que películas de nanotecnologia entregam economia real de até 19 kWh/m² anualmente em ambientes com alta incidência solar.
              </p>
            </div>
          </ScrollReveal>
        </section>

        <section>
          <h2 className="text-2xl md:text-4xl font-black mb-6">Física da película: o que muda no resultado</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0a1320]">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="bg-[#c9a227]/15 text-left">
                  <th className="p-4 text-xs uppercase tracking-wider text-[#c9a227]">Tecnologia</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-[#c9a227]">Mecanismo</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-[#c9a227]">Rejeição IR</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-[#c9a227]">Impacto financeiro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                <tr className="text-gray-300">
                  <td className="p-4 font-bold text-white">Tintada econômica</td>
                  <td className="p-4">Escurece a luz visível, com baixa eficiência térmica</td>
                  <td className="p-4">Baixa (geralmente abaixo de 20%)</td>
                  <td className="p-4">Redução limitada de consumo</td>
                </tr>
                <tr className="text-gray-300">
                  <td className="p-4 font-bold text-white">Metalizada premium</td>
                  <td className="p-4">Reflexão seletiva da radiação solar</td>
                  <td className="p-4">Alta (50% a 75%)</td>
                  <td className="p-4">Queda perceptível de uso do compressor</td>
                </tr>
                <tr className="text-gray-300">
                  <td className="p-4 font-bold text-white">Nano cerâmica</td>
                  <td className="p-4">Bloqueio de infravermelho com transparência</td>
                  <td className="p-4">Muito alta (80% a 97%)</td>
                  <td className="p-4">Melhor equilíbrio entre conforto e economia</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section
          id="simulador-economia"
          ref={calculatorRef}
          className="rounded-3xl border border-[#c9a227]/30 bg-gradient-to-br from-[#0c1628] via-[#040914] to-[#0b1322] p-5 md:p-10 shadow-[0_0_50px_-10px_rgba(201,162,39,0.15)] relative overflow-hidden"
        >
          {/* Luzes de fundo de atmosfera térmica */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#c9a227]/5 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#c9a227]/10 blur-[100px] pointer-events-none" />

          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c9a227]/20 to-[#c9a227]/5 border border-[#c9a227]/40 flex items-center justify-center shadow-lg shadow-black/30">
              <Calculator className="text-[#c9a227]" size={24} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black font-montserrat uppercase tracking-tight text-white">
                Simulador de Economia Inteligente
              </h2>
              <p className="text-[#c9a227] text-xs font-semibold tracking-wider uppercase mt-0.5">
                Estimativa técnica personalizada de retorno
              </p>
            </div>
          </div>

          <div className="grid xl:grid-cols-2 gap-8 relative z-10">
            {/* Bloco de Controles */}
            <div className="space-y-6">
              {/* Gasto Mensal Slider */}
              <div className="rounded-2xl border border-white/5 bg-[#040b15]/60 backdrop-blur-md p-6 hover:border-white/10 transition-all duration-300 shadow-inner">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                    Gasto Mensal de Energia
                  </label>
                  <span className="rounded-xl border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-1.5 text-lg font-black text-white shadow-md">
                    {formatBRL(contaMensal)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={50}
                  value={contaMensal}
                  onChange={(e) => setContaMensal(clamp(Number(e.target.value) || 100, 100, 5000))}
                  className="w-full cursor-pointer h-1.5 rounded-lg appearance-none bg-white/10 outline-none transition-all"
                  style={{
                    background: `linear-gradient(to right, #c9a227 0%, #c9a227 ${(contaMensal - 100) / (5000 - 100) * 100}%, rgba(255,255,255,0.1) ${(contaMensal - 100) / (5000 - 100) * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <span>R$ 100</span>
                  <span>R$ 5.000</span>
                </div>
              </div>

              {/* Horas por Dia Slider */}
              <div className="rounded-2xl border border-white/5 bg-[#040b15]/60 backdrop-blur-md p-6 hover:border-white/10 transition-all duration-300 shadow-inner">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                    Uso Diário de Ar-Condicionado
                  </label>
                  <span className="rounded-xl border border-white/10 bg-[#02060d] px-4 py-1.5 text-lg font-black text-white shadow-md">
                    {horasDia}h
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={24}
                  step={1}
                  value={horasDia}
                  onChange={(e) => setHorasDia(clamp(Number(e.target.value) || 1, 1, 24))}
                  className="w-full cursor-pointer h-1.5 rounded-lg appearance-none bg-white/10 outline-none transition-all"
                  style={{
                    background: `linear-gradient(to right, #c9a227 0%, #c9a227 ${(horasDia - 1) / (24 - 1) * 100}%, rgba(255,255,255,0.1) ${(horasDia - 1) / (24 - 1) * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <div className="mt-3 flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <span>1h / dia</span>
                  <span>24h / dia</span>
                </div>
              </div>

              {/* AC e Area Vidro Controles */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/5 bg-[#040b15]/60 backdrop-blur-md p-4 hover:border-white/10 transition-all duration-300 shadow-inner">
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-black mb-3">
                    Aparelhos de Ar
                  </label>
                  <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2">
                    <button
                      type="button"
                      aria-label="Diminuir ar-condicionados"
                      onClick={() => setQuantidadeAC((value) => clamp(value - 1, 1, 10))}
                      className="h-11 rounded-xl border border-white/10 bg-[#02060d] text-gray-400 hover:border-[#c9a227]/50 hover:text-[#c9a227] hover:bg-[#c9a227]/10 flex items-center justify-center transition-all active:scale-95 shadow-md"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={quantidadeAC}
                      onChange={(e) => setQuantidadeAC(clamp(Number(e.target.value) || 1, 1, 10))}
                      className="h-11 w-full bg-[#02060d] border border-white/10 rounded-xl px-3 text-center text-white font-black outline-none focus:border-[#c9a227]/60 focus:bg-[#02060d]/80 transition-colors shadow-inner"
                    />
                    <button
                      type="button"
                      aria-label="Aumentar ar-condicionados"
                      onClick={() => setQuantidadeAC((value) => clamp(value + 1, 1, 10))}
                      className="h-11 rounded-xl border border-white/10 bg-[#02060d] text-gray-400 hover:border-[#c9a227]/50 hover:text-[#c9a227] hover:bg-[#c9a227]/10 flex items-center justify-center transition-all active:scale-95 shadow-md"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#040b15]/60 backdrop-blur-md p-4 hover:border-white/10 transition-all duration-300 shadow-inner">
                  <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-black mb-3">
                    Área Total de Vidros (m²)
                  </label>
                  <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2">
                    <button
                      type="button"
                      aria-label="Diminuir area de vidro"
                      onClick={() => setAreaVidro((value) => clamp(value - 1, 1, 1000))}
                      className="h-11 rounded-xl border border-white/10 bg-[#02060d] text-gray-400 hover:border-[#c9a227]/50 hover:text-[#c9a227] hover:bg-[#c9a227]/10 flex items-center justify-center transition-all active:scale-95 shadow-md"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={areaVidro}
                      onChange={(e) => setAreaVidro(clamp(Number(e.target.value) || 1, 1, 1000))}
                      className="h-11 w-full bg-[#02060d] border border-white/10 rounded-xl px-3 text-center text-white font-black outline-none focus:border-[#c9a227]/60 focus:bg-[#02060d]/80 transition-colors shadow-inner"
                    />
                    <button
                      type="button"
                      aria-label="Aumentar area de vidro"
                      onClick={() => setAreaVidro((value) => clamp(value + 1, 1, 1000))}
                      className="h-11 rounded-xl border border-white/10 bg-[#02060d] text-gray-400 hover:border-[#c9a227]/50 hover:text-[#c9a227] hover:bg-[#c9a227]/10 flex items-center justify-center transition-all active:scale-95 shadow-md"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Escolha do Tipo de Película */}
              <div className="rounded-2xl border border-white/5 bg-[#040b15]/60 backdrop-blur-md p-5 hover:border-white/10 transition-all duration-300 shadow-inner">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
                    Tecnologia de Película
                  </p>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Investimento Estimado</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(Object.keys(FILMES) as Filme[]).map((tipo) => {
                    const isSelected = filme === tipo;
                    return (
                      <button
                        key={tipo}
                        type="button"
                        onClick={() => setFilme(tipo)}
                        className={`min-h-[110px] rounded-2xl px-5 py-4 text-left transition-all duration-500 border relative ${
                          isSelected
                            ? 'bg-[#c9a227]/15 border-[#c9a227] shadow-[0_0_20px_rgba(201,162,39,0.15)] scale-[1.02]'
                            : 'bg-[#02060d]/70 border-white/5 hover:border-white/20 hover:bg-[#02060d]/90 hover:scale-[1.01]'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-[#c9a227] text-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                            <ShieldCheck size={13} />
                          </div>
                        )}
                        <span className="block text-sm font-black text-white">{FILMES[tipo].nome}</span>
                        <span className="mt-1.5 block text-xs leading-relaxed text-gray-400 pr-4">{FILMES[tipo].resumo}</span>
                        <span className={`mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                          isSelected ? 'bg-[#c9a227] text-[#04080f]' : 'bg-white/5 text-[#c9a227]'
                        }`}>
                          {(FILMES[tipo].reducao * 100).toFixed(0)}% de Redução IR
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Painel de Resultados (Dossiê de Eficiência) */}
            <div className="space-y-6">
              {/* Painel Principal de Economia Mensal */}
              <div className="rounded-2xl border border-[#c9a227]/40 bg-[#050a12]/90 backdrop-blur-md p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[160px]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#c9a227]/5 rounded-full blur-3xl pointer-events-none" />
                
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#c9a227] font-extrabold flex items-center gap-1.5 mb-1.5">
                    <span className="animate-pulse w-2 h-2 rounded-full bg-[#c9a227]" />
                    Economia Estimada por Mês
                  </p>
                  <p className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow">
                    {formatBRL(animEconomiaMensal)}<span className="text-base text-gray-400 font-medium">/mês</span>
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-400 flex items-center justify-between">
                  <span>Faixa de Referência:</span>
                  <span className="text-white font-bold">
                    {formatBRL(animEconomiaMin)} a {formatBRL(animEconomiaMax)}
                  </span>
                </div>
              </div>

              {/* Cards Grid de Investimento e Economia Anual */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/5 bg-[#050a12]/80 p-5 shadow-lg">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-2">
                    <PiggyBank size={14} className="text-[#c9a227]" />
                    Economia Anual
                  </div>
                  <p className="text-2xl font-black text-white">{formatBRL(animEconomiaAnual)}</p>
                  <span className="text-[10px] text-gray-500 mt-1 block">Acumulado em 12 meses</span>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#050a12]/80 p-5 shadow-lg">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-2">
                    <Wallet size={14} className="text-[#c9a227]" />
                    Investimento Estimado
                  </div>
                  <p className="text-2xl font-black text-white">{formatBRL(animInvestimento)}</p>
                  <span className="text-[10px] text-gray-500 mt-1 block">Fornecimento & Instalação</span>
                </div>
              </div>

              {/* Tempo de Retorno (Payback) com Timeline Visual */}
              <div className="rounded-2xl border border-white/5 bg-[#050a12]/80 p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                    <BarChart3 size={14} className="text-[#c9a227]" />
                    Tempo de Retorno (Payback)
                  </div>
                  <span className="text-lg font-black text-white">
                    {simulacao.paybackMeses > 0
                      ? simulacao.paybackMeses > 60
                        ? 'Muito longo (> 5 anos)'
                        : `${animPaybackMeses.toFixed(1)} meses`
                      : '--'}
                  </span>
                </div>

                {/* Timeline visual */}
                {simulacao.paybackMeses > 0 && simulacao.paybackMeses <= 60 && (
                  <div className="pt-2">
                    <div className="relative h-2 bg-white/10 rounded-full w-full">
                      {/* Indicador de posição atual */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 rounded-full bg-[#c9a227] shadow-[0_0_10px_#c9a227] transition-all duration-300"
                        style={{ left: `${Math.min((animPaybackMeses / 60) * 100, 100)}%` }}
                      />
                      {/* Preenchimento até a posição */}
                      <div
                        className="absolute h-full bg-gradient-to-r from-[#c9a227]/40 to-[#c9a227] rounded-full"
                        style={{ width: `${Math.min((animPaybackMeses / 60) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-2 px-1">
                      <span>Imediato</span>
                      <span>3 anos</span>
                      <span>5 anos (Limite)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Premissas Técnicas */}
              <div className="rounded-2xl border border-white/5 bg-[#050a12]/60 p-5 space-y-3.5 shadow-lg">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#c9a227]" />
                  Premissas da Simulação Técnica
                </p>
                <div className="text-xs text-gray-300 space-y-2.5">
                  <p className="flex items-center gap-3.5">
                    <Zap size={14} className="text-[#c9a227] flex-shrink-0" />
                    <span>Tarifa energética de referência média da região: R$ {simulacao.tarifaKwh.toFixed(2)}/kWh</span>
                  </p>
                  <p className="flex items-center gap-3.5">
                    <Snowflake size={14} className="text-[#c9a227] flex-shrink-0" />
                    <span>Consumo referencial (Split 12k BTUs): {simulacao.consumoSplitKwh.toFixed(1)} kWh/h</span>
                  </p>
                  <p className="flex items-center gap-3.5">
                    <Flame size={14} className="text-[#c9a227] flex-shrink-0" />
                    <span>Climatização representa cerca de 45% a 55% da conta de luz mensal</span>
                  </p>
                </div>
              </div>

              {/* Botão de Ação WhatsApp com link dinâmico */}
              <a
                href={`https://wa.me/5521965140612?text=${encodeURIComponent(
                  `Olá! Fiz uma simulação técnica com insulfilm de controle solar LUME. Minha conta atual é de R$ ${contaMensal}, tenho ${quantidadeAC} ar-condicionados ligados cerca de ${horasDia}h por dia e ${areaVidro}m2 de vidros. O simulador estimou uma economia de R$ ${simulacao.economiaMensal.toFixed(2)}/mês com película tipo ${filmeSelecionado.nome}. Gostaria de solicitar um estudo de engenharia formal para o meu endereço.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full inline-flex items-center justify-center gap-3 py-4 text-sm font-bold uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-[#c9a227]/10 transition-all duration-300 border border-[#c9a227]/30 hover:border-[#c9a227]"
              >
                Solicitar Laudo Técnico pelo WhatsApp <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Formula e disclaimer */}
          <div className="mt-8 rounded-2xl border border-white/5 bg-black/35 p-5 text-[11px] text-gray-400 leading-relaxed relative overflow-hidden shadow-inner">
            <p className="mb-2 font-black text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1 h-3 bg-[#c9a227] rounded-full" />
              Base de Cálculo Utilizada:
            </p>
            <code className="block bg-black/45 px-3.5 py-2.5 rounded-lg border border-white/5 text-gray-300 font-mono text-[10px] break-all mb-2">
              Base da Referência = ((Quantidade AC * Horas * 30 * 1.1 * Tarifa) + (Gasto Mensal * 0.50)) / 2
              <br />
              Economia Estimada = Base da Referência * Redução da Película Selecionada
            </code>
            <p>
              Esta é uma simulação matemática que estima o alívio térmico no compressor dos aparelhos de ar-condicionado. Os resultados podem oscilar de acordo com a carga de radiação solar direta (bairros do Rio de Janeiro, orientação solar Norte/Oeste), idade dos aparelhos e vedação do local.
            </p>
          </div>
        </section>

        {/* Barra flutuante (Sticky Bottom) no Mobile */}
        {showMobileSticky && (
          <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#040914]/90 backdrop-blur-lg border-t border-[#c9a227]/30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] animate-fade-in transition-all">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#c9a227] font-bold">Economia Estimada</p>
                <p className="text-xl font-black text-white">{formatBRL(animEconomiaMensal)}/mês</p>
              </div>
              <a
                href={`https://wa.me/5521965140612?text=${encodeURIComponent(
                  `Olá! Fiz uma simulação técnica rápida no mobile. Com conta de R$ ${contaMensal} e área de ${areaVidro}m2 de vidro, estimei uma economia de R$ ${simulacao.economiaMensal.toFixed(2)}/mês. Gostaria de prosseguir.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#c9a227] text-black px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-white transition-colors shadow-lg"
              >
                Laudo Completo <ArrowRight size={12} />
              </a>
            </div>
          </div>
        )}

        <section>
          <h2 className="text-2xl md:text-4xl font-black mb-6">FAQ estratégico</h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="rounded-2xl border border-white/10 bg-[#091221] group"
              >
                <summary className="list-none cursor-pointer p-5 flex items-center justify-between">
                  <span className="font-bold text-white">{faq.q}</span>
                  <span className="text-[#c9a227] text-2xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-gray-300 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#c9a227]/30 bg-gradient-to-r from-[#111f35] to-[#0a1628] p-8 md:p-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/novo-logo-lume.png"
              alt="Logo LUME Controle Solar"
              width={34}
              height={34}
              className="rounded"
            />
            <span className="text-[11px] tracking-wider uppercase text-[#c9a227] font-bold">LUME Controle Solar</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black mb-3">
            Pronto para transformar suas janelas em escudos térmicos inteligentes?
          </h3>
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
            Pare de financiar ineficiência térmica. Solicite agora um estudo de viabilidade técnica com
            orientação para seu perfil de consumo.
          </p>
          <a
            href="https://wa.me/5521965140612?text=Olá! Quero um estudo técnico de economia de energia com insulfilm."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            Falar com especialista <ArrowRight size={16} />
          </a>
        </section>



      </main>

      <ContactCTA />
    </div>
  );
}
