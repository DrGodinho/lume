'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  CheckCircle, 
  ArrowRight, 
  Eye, 
  Building2, 
  MessageCircle, 
  Sun,
  Flame,
  ChevronDown,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';
import { HeroEntrance } from '../components/HeroEntrance';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { Particles } from '../components/Particles';
import { GoogleReviews } from '../components/GoogleReviews';
import { LevelDots } from '../sections/SelectionGuide';
import { ContactCTA } from '../sections/ContactCTA';

const WHATSAPP_URL = 'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20da%20Tijuca%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20im%C3%B3vel.';

interface TijucaPageProps {
  faqs: { q: string; a: string }[];
}

export function TijucaPage({ faqs }: TijucaPageProps) {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-28 overflow-hidden px-4">
        {/* Background Ambience */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/tijuca_hero_bg.webp"
            alt="Janela ampla com película de controle solar na Tijuca - LUME"
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04080f] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#c9a227]/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#c9a227]/10 blur-3xl pointer-events-none" />
        </div>

        <Particles />

        <div className="container-lume relative z-10 text-center max-w-4xl mx-auto">
          <NavigationBreadcrumbs 
            showVisualTrail={false}
            items={[
              { label: 'Início', href: '/' },
              { label: 'Onde Atendemos', href: '/#onde-atendemos' },
              { label: 'Tijuca' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_20px_rgba(201,162,39,0.15)] animate-hero">
              <Building2 size={14} className="text-[#c9a227]" />
              Atendimento Técnico em Toda a Grande Tijuca
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">na</span>
              <span className="inline-block word mr-2 text-gradient-gold">Tijuca</span>
              <span className="inline-block word mr-2">RJ</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-hero">
              Conforto térmico definitivo contra o calor intenso da Zona Norte. Redução de temperatura de <strong className="text-white font-semibold">até 8°C nos ambientes</strong>, fim do ofuscamento em telas de TV/computador e economia comprovada na conta de luz.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pedir Orçamento com Medição Gratuita na Tijuca"
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_10px_30px_rgba(201,162,39,0.25)]"
              >
                <MessageCircle size={20} />
                Pedir Orçamento com Medição Gratuita
              </a>
              <a
                href="#solucoes-tijuca"
                className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-3 text-sm sm:text-base py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-wider"
              >
                Ver Opções de Películas <ArrowRight size={18} />
              </a>
            </div>
          </HeroEntrance>
        </div>
      </section>

      {/* Estatísticas e Diferenciais */}
      <section className="py-4 border-y border-white/5 bg-[#0a111e]/40 relative">
        <div className="container-lume">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <ScrollReveal animation="slide-up">
              <div className="stat-card p-2 sm:p-3">
                <div className="text-2xl lg:text-3xl font-black font-montserrat text-[#c9a227] mb-0.5">
                  Até -8°C
                </div>
                <p className="text-xs text-gray-400 font-medium">Sensação Térmica no Quarto/Sala</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-2 sm:p-3">
                <div className="text-2xl lg:text-3xl font-black font-montserrat text-white mb-0.5">
                  <AnimatedCounter target="35" suffix="%" />
                </div>
                <p className="text-xs text-gray-400 font-medium">Economia no Ar-Condicionado</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-2 sm:p-3">
                <div className="text-2xl lg:text-3xl font-black font-montserrat text-[#c9a227] mb-0.5">
                  <AnimatedCounter target="99" suffix=".9%" />
                </div>
                <p className="text-xs text-gray-400 font-medium">Filtro de Raios UV Solar</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-2 sm:p-3">
                <div className="text-2xl lg:text-3xl font-black font-montserrat text-white mb-0.5">
                  Até 10 Anos
                </div>
                <p className="text-xs text-gray-400 font-medium">Garantia Contra Desbotamento</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Dores & Soluções Específicas da Tijuca */}
      <section className="py-20 px-4 relative" id="desafios-tijuca">
        <div className="container-lume max-w-5xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Especialistas no Clima da Grande Tijuca
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Alívio Térmico para Apartamentos Tradicionais e Modernos
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                A topografia da Tijuca retém ar quente no verão carioca. Apartamentos com grandes janelões virados para o sol da tarde sofrem com cômodos abafados mesmo com ar-condicionado no máximo.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Proteção UV: Móveis e Pele</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Bloqueio de até <strong className="text-white">99,9% dos raios UVA e UVB</strong>. Evita o envelhecimento precoce e manchas na pele, além de impedir o desbotamento e ressecamento de sofás de couro, cortinas, pisos laminados e marcenarias planejadas.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Preservação do patrimônio e saúde familiar
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Alívio do Ar e Economia de Luz</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    O sol da tarde na Tijuca sobrecarrega o ar-condicionado no modo máximo. Ao barrar o ganho solar nos vidros, os aparelhos resfriam muito mais rápido em potências moderadas, gerando até <strong className="text-white">35% de economia na fatura de energia</strong>.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Menor consumo elétrico e maior vida útil do ar
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Flame size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Redução Térmica de até 8°C</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Barreira nanotecnológica contra os raios infravermelhos (calor radiante). Elimina o &ldquo;efeito estufa&rdquo; em salas e quartos com sol poente, devolvendo o conforto térmico natural sem a necessidade de viver confinado em cortinas fechadas.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Queda expressiva de calor nos ambientes
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Catálogo de Soluções Recomendadas na Tijuca */}
      <section className="py-20 px-4 bg-[#0a111e]/30 relative" id="solucoes-tijuca">
        <div className="container-lume max-w-6xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Películas com Excelente Custo-Benefício
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Linhas Mais Procuradas na Tijuca
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Carbono Premium */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-[#c9a227]/40 bg-[#04080f]/90 p-8 flex flex-col justify-between relative shadow-[0_10px_30px_rgba(201,162,39,0.1)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a227] text-[#04080f] font-bold text-xs uppercase px-4 py-1 rounded-full shadow-lg">
                  Campeã de Vendas Tijuca
                </div>
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-2xl font-black font-montserrat text-white">Carbono Premium</h3>
                    <Link 
                      href="/carbono/" 
                      className="text-xs text-[#c9a227] hover:underline inline-flex items-center gap-1 font-semibold whitespace-nowrap mt-1"
                    >
                      Ver detalhes <ArrowRight size={14} />
                    </Link>
                  </div>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Privacidade, Estética Grafite & Redução de Brilho</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    A película mais procurada para quartos e salas com vista devassada. Não fica roxa com o sol e entrega excelente bloqueio térmico por um valor altamente acessível.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Calor:</span>
                      <LevelDots level={3} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Privacidade Diurna:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Custo-Benefício:</span>
                      <LevelDots level={5} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 80/m²</span> instalado
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20Carbono%20Premium%20para%20a%20Tijuca."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                    >
                      <MessageCircle size={16} /> Cotar Carbono Premium
                    </a>
                    <Link
                      href="/carbono/"
                      className="text-center text-xs text-gray-400 hover:text-[#c9a227] py-1 transition-colors"
                    >
                      Conhecer benefícios da Carbono Premium →
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Nano Cerâmica */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-white/5 bg-[#04080f]/90 p-8 flex flex-col justify-between hover:border-[#c9a227]/30 transition-all">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-2xl font-black font-montserrat text-white">Nano Cerâmica</h3>
                    <Link 
                      href="/nano-ceramica/" 
                      className="text-xs text-[#c9a227] hover:underline inline-flex items-center gap-1 font-semibold whitespace-nowrap mt-1"
                    >
                      Ver detalhes <ArrowRight size={14} />
                    </Link>
                  </div>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Corte Térmico Máximo sem Escurecer a Casa</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Ideal para varandas gourmet e salas amplas onde você deseja manter a claridade e a vista aberta das montanhas da Floresta da Tijuca, eliminando o calor do sol.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Calor:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Luminosidade Natural:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Proteção UV:</span>
                      <LevelDots level={5} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 200/m²</span> instalado
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20Nano%20Cer%C3%A2mica%20para%20a%20Tijuca."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227]"
                    >
                      <MessageCircle size={16} /> Cotar Nano Cerâmica
                    </a>
                    <Link
                      href="/nano-ceramica/"
                      className="text-center text-xs text-gray-400 hover:text-[#c9a227] py-1 transition-colors"
                    >
                      Conhecer tecnologia Nano Cerâmica →
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: Dupla Camada */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-white/5 bg-[#04080f]/90 p-8 flex flex-col justify-between hover:border-[#c9a227]/30 transition-all">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-2xl font-black font-montserrat text-white">Dupla Camada</h3>
                    <Link 
                      href="/dupla-camada/" 
                      className="text-xs text-[#c9a227] hover:underline inline-flex items-center gap-1 font-semibold whitespace-nowrap mt-1"
                    >
                      Ver detalhes <ArrowRight size={14} />
                    </Link>
                  </div>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">O Melhor de Dois Mundos & Alto Desempenho</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    O melhor de dois mundos: une a potente rejeição de calor da película refletiva ao visual fumê interno confortável. Elimina o efeito espelho à noite e diminui o reflexo na TV em salas de estar e quartos.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Calor:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Visão Noturna Limpa:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Proteção UV:</span>
                      <LevelDots level={5} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 110/m²</span> instalado
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20Dupla%20Camada%20para%20a%20Tijuca."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227]"
                    >
                      <MessageCircle size={16} /> Cotar Dupla Camada
                    </a>
                    <Link
                      href="/dupla-camada/"
                      className="text-center text-xs text-gray-400 hover:text-[#c9a227] py-1 transition-colors"
                    >
                      Conhecer vantagens Dupla Camada →
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Regiões Atendidas na Grande Tijuca */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="container-lume max-w-4xl mx-auto text-center">
          <ScrollReveal animation="slide-up">
            <h3 className="text-xl font-bold font-montserrat text-white mb-4">
              Atendimento com Medição Gratuita em Toda a Grande Tijuca
            </h3>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-300">
              {[
                'Praça Saens Peña',
                'Praça Afonso Pena',
                'Rua Conde de Bonfim',
                'Rua Haddock Lobo',
                'Rua São Francisco Xavier',
                'Rua Uruguai',
                'Rua Desembargador Izidro',
                'Rua Bom Pastor',
                'Rua General Roca',
                'Rua Barão de Mesquita',
                'Maracanã & Vila Isabel',
                'Grajaú & Andaraí',
                'Usina & Muda'
              ].map((local, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  {local}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Prova Social */}
      <GoogleReviews />

      {/* FAQs */}
      <section className="py-20 px-4 bg-[#0a111e]/40 border-t border-white/5" id="faqs-tijuca">
        <div className="container-lume max-w-3xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Tire Suas Dúvidas
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-montserrat">
                Perguntas Frequentes sobre Insulfilm na Tijuca
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group glass-card rounded-xl border border-white/5 bg-[#04080f]/80 p-5 open:border-[#c9a227]/40 transition-colors"
              >
                <summary className="font-bold text-white text-base cursor-pointer flex justify-between items-center list-none">
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className="text-[#c9a227] transition-transform group-open:rotate-180 flex-shrink-0 ml-4" />
                </summary>
                <p className="mt-4 text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <ContactCTA />
    </div>
  );
}
