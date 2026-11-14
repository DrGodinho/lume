'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Eye,
  MessageCircle,
  Sun,
  Crown,
  ChevronDown,
  ShieldCheck,
  Zap,
  Flame,
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

const WHATSAPP_URL = 'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20do%20Leblon%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20im%C3%B3vel.';

interface LeblonPageProps {
  faqs: { q: string; a: string }[];
}

export function LeblonPage({ faqs }: LeblonPageProps) {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-28 overflow-hidden px-4">
        {/* Background Ambience */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/leblon_hero_bg.webp"
            alt="Varanda gourmet de luxo com película Nano Cerâmica no Leblon - LUME"
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
              { label: 'Leblon' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_20px_rgba(201,162,39,0.15)] animate-hero">
              <Crown size={14} className="text-[#c9a227]" />
              Películas de Altíssimo Padrão · Delfim Moreira & Alto Leblon
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">no</span>
              <span className="inline-block word mr-2 text-gradient-gold">Leblon</span>
              <span className="inline-block word mr-2">RJ</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-hero">
              Atendimento exclusivo para o metro quadrado mais valorizado do país. Redução térmica de <strong className="text-white font-semibold">até 95% sem alterar a fachada</strong>, corte de 99.9% dos raios UV e proteção patrimonial absoluta com garantia de até 10 anos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Solicitar Atendimento VIP no WhatsApp"
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_10px_30px_rgba(201,162,39,0.25)]"
              >
                <MessageCircle size={20} />
                Solicitar Atendimento VIP no WhatsApp
              </a>
              <a
                href="#solucoes-leblon"
                className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-3 text-sm sm:text-base py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-wider"
              >
                Linhas Exclusivas <ArrowRight size={18} />
              </a>
            </div>
          </HeroEntrance>
        </div>
      </section>

      {/* Estatísticas de Excelência */}
      <section className="py-4 border-y border-white/5 bg-[#0a111e]/40 relative">
        <div className="container-lume">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <ScrollReveal animation="slide-up">
              <div className="stat-card p-2 sm:p-3">
                <div className="text-2xl lg:text-3xl font-black font-montserrat text-[#c9a227] mb-0.5">
                  <AnimatedCounter target="95" suffix="%" />
                </div>
                <p className="text-xs text-gray-400 font-medium">Rejeição Térmica Infravermelha</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-2 sm:p-3">
                <div className="text-2xl lg:text-3xl font-black font-montserrat text-white mb-0.5">
                  99.9%
                </div>
                <p className="text-xs text-gray-400 font-medium">Filtro de Raios UV Solar</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-2 sm:p-3">
                <div className="text-2xl lg:text-3xl font-black font-montserrat text-[#c9a227] mb-0.5">
                  100%
                </div>
                <p className="text-xs text-gray-400 font-medium">Cerâmica Pura Isenta de Metais</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-2 sm:p-3">
                <div className="text-2xl lg:text-3xl font-black font-montserrat text-white mb-0.5">
                  10 Anos
                </div>
                <p className="text-xs text-gray-400 font-medium">Garantia Formal Certificada</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Exigências & Soluções Específicas do Leblon */}
      <section className="py-20 px-4 relative" id="desafios-leblon">
        <div className="container-lume max-w-5xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Privacidade, Conforto & Discrição
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Por que a LUME é a Escolha de Moradores e Arquitetos no Leblon
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Com projetos de alta sofisticação, o morador do Leblon exige mão de obra impecável, pontualidade britânica e materiais nobres que protejam seu acervo patrimonial.
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
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Proteção UV: Acervos, Móveis e Pele</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Pinturas a óleo, gravuras assinadas, tapetes e marcenarias de grife sofrem danos irreversíveis pelo sol. Bloqueamos <strong className="text-white">99,9% dos raios UVA e UVB</strong>, protegendo tanto as obras quanto a saúde da pele com certificação óptica rigorosa.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Recomendado por arquitetos e curadores
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Alívio do Ar e Climatização Silenciosa</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Grandes aberturas de vidro na Delfim Moreira e vias do Leblon recebem calor radiante implacável. Ao barrar até 95% do calor no vidro, seu sistema de ar-condicionado atinge o conforto térmico sem esforço contínuo, gerando economia real de até <strong className="text-white">35% de energia</strong>.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Eficiência energética com conforto térmico nobre
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Crown size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Proteja-se do Calor sem Perder a Vista</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Residências exclusivas demandam transparência pura e conformidade estética integral. Nossa Nano Cerâmica rejeita o calor solar sem alterar a fachada externa e sem gerar reflexos internos à noite, preservando a vista panorâmica em sua plenitude.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Transparência óptica neutra e padrão condominial
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Catálogo de Soluções Recomendadas no Leblon */}
      <section className="py-20 px-4 bg-[#0a111e]/30 relative" id="solucoes-leblon">
        <div className="container-lume max-w-6xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Linhas de Prestígio LUME
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Películas de Alta Performance para o Leblon
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Nano Cerâmica */}
            <ScrollReveal animation="slide-up">
              <div className="product-card group rounded-2xl overflow-hidden border border-[#c9a227]/40 bg-[#04080f]/90 flex flex-col justify-between relative shadow-[0_10px_30px_rgba(201,162,39,0.1)] hover:border-[#c9a227] hover:shadow-[0_15px_35px_rgba(201,162,39,0.2)] transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-3.5 right-3.5 z-20 bg-[#c9a227] text-[#04080f] font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-lg pointer-events-none flex items-center gap-1">
                  <Sparkles size={11} /> Mais Instalada no Leblon
                </div>
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src="/product-nano-ceramica.webp"
                    alt="Película Nano Cerâmica no Leblon"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-[#04080f]/40 to-transparent" />
                </div>
                <div className="p-6 sm:p-8 flex-grow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-2xl font-black font-montserrat text-white">Nano Cerâmica</h3>
                    <Link 
                      href="/nano-ceramica/" 
                      className="text-xs text-[#c9a227] hover:underline inline-flex items-center gap-1 font-semibold whitespace-nowrap mt-1 group-hover:translate-x-1 transition-transform"
                    >
                      Ver detalhes <ArrowRight size={14} />
                    </Link>
                  </div>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Transparência Pura & Bloqueio Térmico Máximo</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Desenvolvida com partículas cerâmicas em escala nanométrica. Proporciona o maior corte de calor solar do mercado internacional sem escurecer e sem refletir.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Corte Térmico:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Transparência:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Filtro UV:</span>
                      <LevelDots level={5} />
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 pt-0">
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 200/m²</span> instalado
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20Nano%20Cer%C3%A2mica%20para%20o%20Leblon."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transform hover:scale-[1.02] transition-transform shadow-md"
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

            {/* Card 2: Dupla Camada */}
            <ScrollReveal animation="slide-up">
              <div className="product-card group rounded-2xl overflow-hidden border border-white/10 bg-[#04080f]/90 flex flex-col justify-between hover:border-[#c9a227]/50 hover:shadow-[0_15px_35px_rgba(201,162,39,0.15)] transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src="/product-smoke.webp"
                    alt="Película Dupla Camada no Leblon"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-[#04080f]/40 to-transparent" />
                </div>
                <div className="p-6 sm:p-8 flex-grow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-2xl font-black font-montserrat text-white">Dupla Camada</h3>
                    <Link 
                      href="/dupla-camada/" 
                      className="text-xs text-[#c9a227] hover:underline inline-flex items-center gap-1 font-semibold whitespace-nowrap mt-1 group-hover:translate-x-1 transition-transform"
                    >
                      Ver detalhes <ArrowRight size={14} />
                    </Link>
                  </div>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">O Melhor de Dois Mundos & Conforto Visual</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    O melhor de dois mundos: combina a alta rejeição térmica da película refletiva com o visual fumê interno nobre. Sem espelho interno à noite e diminuindo o reflexo na TV, para contemplar a vista com total conforto.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Corte Térmico:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Visão Noturna:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Filtro UV:</span>
                      <LevelDots level={5} />
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 pt-0">
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 110/m²</span> instalado
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20Dupla%20Camada%20para%20o%20Leblon."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all"
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

            {/* Card 3: Jateado Decorativo */}
            <ScrollReveal animation="slide-up">
              <div className="product-card group rounded-2xl overflow-hidden border border-white/10 bg-[#04080f]/90 flex flex-col justify-between hover:border-[#c9a227]/50 hover:shadow-[0_15px_35px_rgba(201,162,39,0.15)] transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src="/product-jateado-v2.webp"
                    alt="Película Jateada no Leblon"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-[#04080f]/40 to-transparent" />
                </div>
                <div className="p-6 sm:p-8 flex-grow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-2xl font-black font-montserrat text-white">Jateado</h3>
                    <Link 
                      href="/jateado/" 
                      className="text-xs text-[#c9a227] hover:underline inline-flex items-center gap-1 font-semibold whitespace-nowrap mt-1 group-hover:translate-x-1 transition-transform"
                    >
                      Ver detalhes <ArrowRight size={14} />
                    </Link>
                  </div>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Design Minimalista & Privacidade Absoluta</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    A solução sofisticada para banheiros, suítes máster, divisórias de escritórios e áreas técnicas residenciais. Textura suave e iluminação natural contínua.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Privacidade:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Difusão de Luz:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Acabamento:</span>
                      <LevelDots level={5} />
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 pt-0">
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 80/m²</span> instalado
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20Jateado%20para%20o%20Leblon."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all"
                    >
                      <MessageCircle size={16} /> Cotar Jateado
                    </a>
                    <Link
                      href="/jateado/"
                      className="text-center text-xs text-gray-400 hover:text-[#c9a227] py-1 transition-colors"
                    >
                      Conhecer aplicações da Película Jateada →
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Regiões Atendidas no Leblon */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="container-lume max-w-4xl mx-auto text-center">
          <ScrollReveal animation="slide-up">
            <h3 className="text-xl font-bold font-montserrat text-white mb-4">
              Atendimento Exclusivo em Todos os Endereços do Leblon
            </h3>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-300">
              {[
                'Avenida Delfim Moreira',
                'Avenida Ataulfo de Paiva',
                'Rua General San Martin',
                'Rua Dias Ferreira',
                'Rua Bartolomeu Mitre',
                'Rua Aristides Espínola',
                'Rua Cupertino Durão',
                'Rua Rainha Guilhermina',
                'Rua Venâncio Flores',
                'Rua General Artigas',
                'Rua José Linhares',
                'Alto Leblon & Chácara do Céu',
                'Praça Antero de Quental'
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
      <section className="py-20 px-4 bg-[#0a111e]/40 border-t border-white/5" id="faqs-leblon">
        <div className="container-lume max-w-3xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Informações Essenciais
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-montserrat">
                Perguntas Frequentes sobre Aplicação de Películas no Leblon
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
