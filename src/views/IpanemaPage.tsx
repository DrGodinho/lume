'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Eye, 
  Building2, 
  MessageCircle, 
  Sun, 
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

const WHATSAPP_URL = 'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20de%20Ipanema%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20im%C3%B3vel.';

interface IpanemaPageProps {
  faqs: { q: string; a: string }[];
}

export function IpanemaPage({ faqs }: IpanemaPageProps) {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-28 overflow-hidden px-4">
        {/* Background Ambience */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/ipanema_hero_bg.webp"
            alt="Living de alto padrão com insulfilm Nano Cerâmica em Ipanema - LUME"
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
              { label: 'Ipanema' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_20px_rgba(201,162,39,0.15)] animate-hero">
              <Building2 size={14} className="text-[#c9a227]" />
              Películas Térmicas de Alto Luxo · Vieira Souto & Ipanema
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">em</span>
              <span className="inline-block word mr-2 text-gradient-gold">Ipanema</span>
              <span className="inline-block word mr-2">RJ</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-hero">
              Proteção solar invisível com corte térmico de <strong className="text-white font-semibold">até 95% do calor</strong> para residências de alto padrão. Preserva a vista deslumbrante de Ipanema e o design de interiores com garantia de até 10 anos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Agendar Medição Gratuita no WhatsApp"
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_10px_30px_rgba(201,162,39,0.25)]"
              >
                <MessageCircle size={20} />
                Agendar Medição Gratuita no WhatsApp
              </a>
              <a
                href="#solucoes-ipanema"
                className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-3 text-sm sm:text-base py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-wider"
              >
                Conhecer Películas <ArrowRight size={18} />
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
                  <AnimatedCounter target="95" suffix="%" />
                </div>
                <p className="text-xs text-gray-400 font-medium">Bloqueio de Calor Infravermelho</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-2 sm:p-3">
                <div className="text-2xl lg:text-3xl font-black font-montserrat text-white mb-0.5">
                  75%
                </div>
                <p className="text-xs text-gray-400 font-medium">Transparência Óptica Pura</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-2 sm:p-3">
                <div className="text-2xl lg:text-3xl font-black font-montserrat text-[#c9a227] mb-0.5">
                  Zero
                </div>
                <p className="text-xs text-gray-400 font-medium">Alteração de Fachada</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-2 sm:p-3">
                <div className="text-2xl lg:text-3xl font-black font-montserrat text-white mb-0.5">
                  10 Anos
                </div>
                <p className="text-xs text-gray-400 font-medium">Garantia Formal LUME</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Dores Específicas de Ipanema */}
      <section className="py-20 px-4 relative" id="desafios-ipanema">
        <div className="container-lume max-w-5xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Exigência & Conforto em Ipanema
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Soluções Sob Medida para o Sol Poente e Fachadas Nobres
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Em Ipanema, o sol poente no Morro Dois Irmãos é um dos cartões-postais mais belos do mundo, mas também aquece intensamente salas e varandas no final da tarde.
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
                    Tapetes importados, marcenarias sob medida, obras de arte e sofás de design sofrem com descoloração severa. Nossa barreira de <strong className="text-white">99,9% contra raios UVA/UVB</strong> preserva os acabamentos nobres e protege a saúde da sua pele.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Preservação de acervo e saúde familiar
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
                    Grandes painéis virados para o sol poente transformam os livings em estufas, forçando os aparelhos de ar-condicionado. A Nano Cerâmica bloqueia o calor radiante na fonte, gerando até <strong className="text-white">35% de economia na conta de energia</strong>.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Resfriamento acelerado e menor consumo
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Sun size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Proteja-se do Calor sem Perder a Vista</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Prédios na Vieira Souto e Prudente de Morais possuem regras rígidas de convenção. Nossas películas garantem corte térmico máximo de até 95% mantendo transparência cristalina pura — sem espelho, sem metal e sem alterar a fachada.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> 100% de aprovação condominial e visão nítida
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Catálogo de Soluções Recomendadas em Ipanema */}
      <section className="py-20 px-4 bg-[#0a111e]/30 relative" id="solucoes-ipanema">
        <div className="container-lume max-w-6xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Gama LUME Elite em Ipanema
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Películas Selecionadas para o Padrão Ipanema
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Nano Cerâmica */}
            <ScrollReveal animation="slide-up">
              <div className="product-card group rounded-2xl overflow-hidden border border-[#c9a227]/40 bg-[#04080f]/90 flex flex-col justify-between relative shadow-[0_10px_30px_rgba(201,162,39,0.1)] hover:border-[#c9a227] hover:shadow-[0_15px_35px_rgba(201,162,39,0.2)] transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-3.5 right-3.5 z-20 bg-[#c9a227] text-[#04080f] font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-lg pointer-events-none flex items-center gap-1">
                  <Sparkles size={11} /> Escolha Nº 1 Ipanema
                </div>
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src="/product-nano-ceramica.webp"
                    alt="Película Nano Cerâmica em Ipanema"
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
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Invisível ao Olho, Máxima em Rejeição Térmica</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    A película definitiva para quem não abre mão da vista panorâmica. Bloqueia o calor invisível com nano partículas cerâmicas sem escurecer os ambientes.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Calor:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Transparência Cristalina:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Proteção UV:</span>
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
                      href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20Nano%20Cer%C3%A2mica%20para%20Ipanema."
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
                    alt="Película Dupla Camada em Ipanema"
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
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">O Melhor de Dois Mundos & Sem Espelho Noturno</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    O melhor de dois mundos: une a potente rejeição de calor da película refletiva ao visual fumê interno elegante. Elimina o incômodo espelho noturno com luzes acesas e reduz o reflexo na TV em salas integradas e suítes.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Calor:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Visão Noturna sem Reflexo:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Proteção UV:</span>
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
                      href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20Dupla%20Camada%20para%20Ipanema."
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
                    alt="Película Jateada em Ipanema"
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
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Design Arquitetônico & Privacidade Elegante</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Para portas de correr, divisão de closet, banheiros e áreas de serviço. Garante privacidade total com difusão suave de luz natural e acabamento fosco refinado.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Privacidade Total:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Difusão de Luz Natural:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Acabamento Estético:</span>
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
                      href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20Jateado%20para%20Ipanema."
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

      {/* Regiões Atendidas em Ipanema */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="container-lume max-w-4xl mx-auto text-center">
          <ScrollReveal animation="slide-up">
            <h3 className="text-xl font-bold font-montserrat text-white mb-4">
              Atendimento Técnico Especializado em Ipanema e Adjacências
            </h3>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-300">
              {[
                'Avenida Vieira Souto',
                'Rua Prudente de Morais',
                'Rua Visconde de Pirajá',
                'Rua Garcia D’Ávila',
                'Rua Aníbal de Mendonça',
                'Rua Henrique Dumont',
                'Rua Joana Angélica',
                'Rua Vinicius de Moraes',
                'Rua Farme de Amoedo',
                'Rua Montenegro',
                'Praça Nossa Senhora da Paz',
                'Praça General Osório',
                'Jardim de Alah & Arpoador'
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
      <section className="py-20 px-4 bg-[#0a111e]/40 border-t border-white/5" id="faqs-ipanema">
        <div className="container-lume max-w-3xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Perguntas Frequentes
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-montserrat">
                Dúvidas sobre Insulfilm em Ipanema
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
