'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Shield, 
  Sun, 
  Thermometer, 
  CheckCircle, 
  ArrowRight, 
  Eye, 
  Building2, 
  Sparkles, 
  MessageCircle, 
  Users, 
  Layers, 
  ChevronDown
} from 'lucide-react';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';
import { HeroEntrance } from '../components/HeroEntrance';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { Particles } from '../components/Particles';
import { GoogleReviews } from '../components/GoogleReviews';
import { LevelDots } from '../sections/SelectionGuide';
import { ContactCTA } from '../sections/ContactCTA';

const WHATSAPP_URL = 'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20morador%20de%20Santo%20Cristo%20(Porto%20Maravilha)%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20apartamento.';

interface SantoCristoPageProps {
  faqs: { q: string; a: string }[];
}

export function SantoCristoPage({ faqs }: SantoCristoPageProps) {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-28 overflow-hidden px-4">
        {/* Background Ambience */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/santocristo_hero_bg.webp"
            alt="Varanda envidraçada com insulfilm em Santo Cristo e Porto Maravilha - LUME"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-[#04080f]/80 to-[#04080f]/60" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#c9a227]/10 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1a3a5c]/25 blur-[110px] rounded-full pointer-events-none" />
        </div>

        <Particles />

        <div className="container-lume relative z-10 text-center max-w-4xl mx-auto">
          <NavigationBreadcrumbs 
            showVisualTrail={false}
            items={[
              { label: 'Início', href: '/' },
              { label: 'Onde Atendemos', href: '/#onde-atendemos' },
              { label: 'Santo Cristo (Porto Maravilha)' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_20px_rgba(201,162,39,0.15)] animate-hero">
              <Building2 size={14} className="text-[#c9a227]" />
              Ponto de Atendimento Expresso · Porto Maravilha
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">em</span>
              <span className="inline-block word mr-2 text-gradient-gold">Santo</span>
              <span className="inline-block word mr-2 text-gradient-gold">Cristo</span>
              <span className="inline-block word mr-2">e</span>
              <span className="inline-block word mr-2">Porto</span>
              <span className="inline-block word mr-2 text-gradient-gold">Maravilha</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-hero">
              Aplicação profissional de películas de alta performance para novos condomínios residenciais e apartamentos. Até <strong className="text-white font-semibold">95% de corte térmico</strong>, privacidade absoluta entre torres vizinhas e proteção solar sem alterar a fachada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_10px_30px_rgba(201,162,39,0.25)]"
              >
                <MessageCircle size={20} />
                Pedir Orçamento no WhatsApp
              </a>
              <a
                href="#solucoes-condominios"
                className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-3 text-sm sm:text-base py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-wider"
              >
                Ver Películas Recomendadas <ArrowRight size={18} />
              </a>
            </div>
          </HeroEntrance>
        </div>
      </section>

      {/* Faixa de Benefícios Rápidos */}
      <section className="py-6 bg-[#04080f] border-y border-white/5 relative z-10">
        <div className="container-lume">
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10 text-xs sm:text-sm text-gray-400 font-medium">
            <div className="flex items-center gap-2">
              <Thermometer size={16} className="text-[#c9a227]" />
              <span>Até 95% Rejeição de Calor Infravermelho</span>
            </div>
            <div className="flex items-center gap-2">
              <Sun size={16} className="text-[#c9a227]" />
              <span>99.9% Bloqueio UV (Proteção de Pisos e Sofás)</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-[#c9a227]" />
              <span>Compatível com Convenções de Fachada</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#c9a227]" />
              <span>Garantia Contratual de até 10 Anos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas de Impacto */}
      <section className="py-16 bg-[#070f1a] relative">
        <div className="container-lume">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="glass-card p-6 rounded-2xl border border-white/10 stat-card">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="8" suffix="°C" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Redução na Temperatura Interna do Apartamento</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 stat-card">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="99" suffix="%" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Bloqueio de Raios UV Nocivos</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 stat-card">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="30" suffix="%" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Economia no Consumo do Ar-Condicionado</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 stat-card">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="10" suffix=" Anos" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Garantia LUME sem Bolhas ou Desbotamento</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Condomínios Santo Cristo: O Desafio dos Novos Prédios */}
      <section id="solucoes-condominios" className="py-20 lg:py-28 bg-[#04080f] relative px-4">
        <div className="container-lume">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                Porto Maravilha & Santo Cristo
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat mb-6">
              O Desafio do Sol nos <span className="text-gradient-gold">Novos Apartamentos</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-light">
              A revitalização de Santo Cristo trouxe lindos edifícios com amplas janelas e varandas integradas. Porém, os moradores enfrentam 3 dores imediatas assim que recebem as chaves:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Card 1 */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 benefit-card hover:border-[#c9a227]/40 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227] mb-6 shadow-inner">
                <Thermometer size={28} />
              </div>
              <h3 className="text-xl font-bold font-montserrat text-white mb-3">1. Calor Extremo e Efeito Estufa</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A região portuária e a proximidade com a Baía de Guanabara recebem insolação contínua ao longo do dia. Sem película técnica, o vidro vira um radiador térmico, forçando o ar-condicionado a trabalhar no limite.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 benefit-card hover:border-[#c9a227]/40 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227] mb-6 shadow-inner">
                <Eye size={28} />
              </div>
              <h3 className="text-xl font-bold font-montserrat text-white mb-3">2. Privacidade entre Torres Próximas</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Nos condomínios verticais de alta densidade, as torres vizinhas ficam frente a frente. A película de controle solar cria uma barreira diurna que impede que vizinhos enxerguem sua sala ou quarto.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 benefit-card hover:border-[#c9a227]/40 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227] mb-6 shadow-inner">
                <Building2 size={28} />
              </div>
              <h3 className="text-xl font-bold font-montserrat text-white mb-3">3. Regras de Fachada do Condomínio</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Muitas convenções vetam películas espelhadas agressivas ou cortinas fora do padrão. A tecnologia <strong>Nano Cerâmica 70/75</strong> bloqueia até 95% do calor mantendo a transparência cristalina exigida pelas normas.
              </p>
            </div>
          </div>

          {/* Banner de Condição Especial para Vizinhos */}
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-[#c9a227]/30 bg-gradient-to-r from-[#071324] via-[#0b1e36] to-[#071324] shadow-2xl">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#c9a227]/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl text-center lg:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#c9a227]/20 text-[#c9a227] text-xs font-bold uppercase tracking-widest mb-4">
                  Condição Especial de Inauguração
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-montserrat text-white mb-3">
                  Vai fechar com vizinhos do mesmo condomínio?
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
                  Para os novos empreendimentos em Santo Cristo e Porto Maravilha (Cury, Novocanto, Rio Wonder, Pateo Nazaret e outros), oferecemos <strong>descontos progressivos</strong> quando mais de uma unidade agenda a medição e aplicação no mesmo dia!
                </p>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-shrink-0 inline-flex items-center gap-3 text-base py-4 px-8 shadow-lg shadow-[#c9a227]/20"
              >
                <Users size={20} />
                Consultar Desconto para Condomínio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Exemplo Real de Instalação em Santo Cristo: Varanda / Cortina de Vidro */}
      <section id="exemplo-real-varanda" className="py-20 lg:py-24 bg-[#070f1a] relative px-4 overflow-hidden border-y border-white/5">
        {/* Glow de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#c9a227]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-lume relative z-10">
          <ScrollReveal animation="slide-up" className="max-w-3xl mx-auto text-center mb-14">
            <div className="animate-item flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <CheckCircle size={14} /> Estudo de Caso Real
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="animate-item text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat mb-6">
              Quanto Custa Insulfilm na Prática? <br />
              <span className="text-gradient-gold">Exemplo Real de Varanda em Santo Cristo</span>
            </h2>
            <p className="animate-item text-gray-400 text-base sm:text-lg leading-relaxed font-light">
              Veja a transparência de um fechamento de cortina de vidro realizado recentemente em um apartamento aqui no bairro.
              Eram <strong>11 painéis de vidro</strong>, somando <strong>5,78 m²</strong> de área total instalada:
            </p>
          </ScrollReveal>

          {/* Resumo da Obra / Especificação Técnica */}
          <div className="max-w-4xl mx-auto mb-12 p-5 sm:p-6 rounded-2xl bg-[#0a1628]/80 border border-white/10 flex flex-wrap items-center justify-around gap-4 text-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                <Building2 size={20} />
              </div>
              <div className="text-left">
                <span className="text-[11px] text-gray-400 block uppercase tracking-wider">Local</span>
                <span className="text-sm sm:text-base font-bold text-white">Apartamento em Santo Cristo</span>
              </div>
            </div>

            <div className="w-px h-10 bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                <Layers size={20} />
              </div>
              <div className="text-left">
                <span className="text-[11px] text-gray-400 block uppercase tracking-wider">Estrutura</span>
                <span className="text-sm sm:text-base font-bold text-white">11 Vidros (Cortina de Vidro)</span>
              </div>
            </div>

            <div className="w-px h-10 bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                <Sparkles size={20} />
              </div>
              <div className="text-left">
                <span className="text-[11px] text-gray-400 block uppercase tracking-wider">Área Total Medida</span>
                <span className="text-sm sm:text-base font-bold text-[#c9a227]">5,78 m²</span>
              </div>
            </div>
          </div>

          {/* Foto Ilustrativa da Varanda */}
          <div className="max-w-4xl mx-auto mb-12 overflow-hidden rounded-3xl border border-white/10 relative group shadow-2xl">
            <div className="relative h-64 sm:h-80 md:h-96 w-full">
              <Image
                src="/santocristo_hero_bg.webp"
                alt="Exemplo real de cortina de vidro com 11 painéis em Santo Cristo - LUME"
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-gray-300 bg-[#04080f]/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
                <span className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle size={15} className="text-[#c9a227]" /> 
                  Fechamento Real: 11 Vidros · 5,78 m² em Santo Cristo
                </span>
                <span className="text-[#c9a227] font-bold hidden sm:inline">Conforto Térmico & Vista da Baía</span>
              </div>
            </div>
          </div>

          {/* Cards dos 3 Cenários e Preços */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* 1. Refletiva */}
            <div className="glass-panel p-7 sm:p-8 rounded-3xl border border-white/10 flex flex-col relative group hover:border-[#c9a227]/40 transition-all duration-300 bg-gradient-to-b from-[#0a1628]/80 to-[#04080f]">
              <div className="inline-flex self-start px-3 py-1 rounded-full bg-white/10 text-gray-300 text-[11px] font-bold uppercase tracking-wider mb-4">
                Opção 1 · Custo Acessível
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-white mb-1">Linha Refletiva</h3>
              <p className="text-xs text-gray-400 mb-6">Máxima privacidade diurna espelhada e alto bloqueio solar térmico.</p>

              <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-gray-400 block uppercase tracking-wider mb-1">Valor Total Instalado</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-gray-400">R$</span>
                  <span className="text-3xl sm:text-4xl font-black font-montserrat text-white">636,22</span>
                </div>
                <span className="text-[11px] text-gray-400 block mt-1">Para os 11 vidros (5,78 m²) completos</span>
              </div>

              <div className="space-y-3 mb-8 text-sm text-gray-300 flex-grow">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Rejeição de calor rápida e eficaz</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Privacidade total durante o dia</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-amber-300/90 pt-3 border-t border-white/5">
                  <span className="text-amber-400 font-bold">⚠️</span>
                  <span>Atenção: Requer liberação do condomínio caso proíba efeito espelhado na fachada.</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-auto">
                <a
                  href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Vi%20o%20exemplo%20da%20varanda%20em%20Santo%20Cristo%20(5,78m%C2%B2%20com%2011%20vidros)%20por%20R$%20636,22%20na%20Refletiva%20e%20gostaria%20de%20um%20or%C3%A7amento."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors font-bold text-xs uppercase tracking-wider"
                >
                  <MessageCircle size={16} /> Quero Opção Refletiva
                </a>
              </div>
            </div>

            {/* 2. Nano Cerâmica G20 (Destaque Principal) */}
            <div className="glass-panel p-7 sm:p-8 rounded-3xl border-2 border-[#c9a227] flex flex-col relative group shadow-[0_15px_40px_rgba(201,162,39,0.15)] bg-gradient-to-b from-[#0e213d] to-[#04080f] transform lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c9a227] text-[#04080f] text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest shadow-md whitespace-nowrap">
                ⭐ Aceita pela Maioria dos Condomínios
              </div>
              <div className="inline-flex self-start px-3 py-1 rounded-full bg-[#c9a227]/20 text-[#c9a227] text-[11px] font-bold uppercase tracking-wider mb-4 mt-2">
                Opção 2 · Melhor Equilíbrio
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-white mb-1">Nano Cerâmica G20</h3>
              <p className="text-xs text-gray-300 mb-6">Bloqueio brutal de infravermelho sem espelhamento, com sofisticação fumê nobre.</p>

              <div className="mb-6 p-4 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/20">
                <span className="text-[11px] text-[#c9a227] font-semibold block uppercase tracking-wider mb-1">Valor Total Instalado</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-[#c9a227]">R$</span>
                  <span className="text-3xl sm:text-4xl font-black font-montserrat text-white text-gradient-gold">1.041,08</span>
                </div>
                <span className="text-[11px] text-gray-300 block mt-1">Para os 11 vidros (5,78 m²) completos</span>
              </div>

              <div className="space-y-3 mb-8 text-sm text-gray-200 flex-grow">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Rejeição profunda de calor (nanotecnologia)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Tom fumê suave que não reflete na fachada</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Aceita pela ampla maioria das convenções</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 pt-3 border-t border-white/10">
                  <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                  <span>A escolha favorita dos moradores no Porto Maravilha</span>
                </div>
              </div>

              <div className="pt-6 border-t border-[#c9a227]/20 mt-auto">
                <a
                  href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Vi%20o%20exemplo%20da%20varanda%20em%20Santo%20Cristo%20(5,78m%C2%B2%20com%2011%20vidros)%20por%20R$%201.041,08%20na%20Nano%20Cer%C3%A2mica%20G20%20e%20gostaria%20de%20um%20or%C3%A7amento."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2 w-full py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c9a227]/25"
                >
                  <MessageCircle size={16} /> Quero Cerâmica G20
                </a>
              </div>
            </div>

            {/* 3. Nano Cerâmica 75% Transparente */}
            <div className="glass-panel p-7 sm:p-8 rounded-3xl border border-white/10 flex flex-col relative group hover:border-[#c9a227]/40 transition-all duration-300 bg-gradient-to-b from-[#0a1628]/80 to-[#04080f]">
              <div className="inline-flex self-start px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-4">
                Opção 3 · Regra Estrita de Fachada
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-white mb-1">Nano Cerâmica 75%</h3>
              <p className="text-xs text-gray-400 mb-6">Transparência cristalina: bloqueia o calor sem alterar 1% da cor do vidro.</p>

              <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-gray-400 block uppercase tracking-wider mb-1">Valor Total Instalado</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-gray-400">R$</span>
                  <span className="text-3xl sm:text-4xl font-black font-montserrat text-white">1.388,11</span>
                </div>
                <span className="text-[11px] text-gray-400 block mt-1">Para os 11 vidros (5,78 m²) completos</span>
              </div>

              <div className="space-y-3 mb-8 text-sm text-gray-300 flex-grow">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>100% permitida por qualquer convenção</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Visão 100% cristalina da Baía e da paisagem</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Rejeição térmica invisível de alta tecnologia</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-sky-400 pt-3 border-t border-white/5">
                  <CheckCircle size={14} className="text-sky-400 flex-shrink-0" />
                  <span>Solução definitiva para prédios com normas rigorosas</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-auto">
                <a
                  href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Vi%20o%20exemplo%20da%20varanda%20em%20Santo%20Cristo%20(5,78m%C2%B2%20com%2011%20vidros)%20por%20R$%201.388,11%20na%20Nano%20Cer%C3%A2mica%2075%25%20Transparente%20e%20gostaria%20de%20um%20or%C3%A7amento."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-[#c9a227]/40 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-colors font-bold text-xs uppercase tracking-wider"
                >
                  <MessageCircle size={16} /> Quero Cerâmica Transparente
                </a>
              </div>
            </div>
          </div>

          {/* Garantia e Transparência */}
          <div className="mt-12 text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              * Valores com instalação profissional inclusa, sem sujeira e com garantia de até 10 anos da LUME Controle Solar.
              Sua varanda tem medidas diferentes? <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[#c9a227] font-semibold underline underline-offset-4 hover:text-white transition-colors">Solicite medição gratuita no WhatsApp!</a>
            </p>
          </div>
        </div>
      </section>

      {/* Tabela Comparativa de Películas Recomendadas */}
      <section className="py-20 bg-[#04080f] relative px-4">
        <div className="container-lume">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                Guia de Escolha
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat mb-6">
              Qual Película é a Ideal para o Seu <span className="text-gradient-gold">Apartamento?</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed font-light">
              Compare as especificações técnicas recomendadas para cada ambiente em Santo Cristo:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Película 1: Nano Cerâmica */}
            <div className="glass-panel p-8 rounded-3xl border border-[#c9a227]/30 flex flex-col relative group hover:border-[#c9a227] transition-all duration-300 bg-gradient-to-b from-[#0a1628] to-[#04080f]">
              <div className="absolute top-4 right-4 bg-[#c9a227] text-[#04080f] text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
                Top para Varanda
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Nano Cerâmica</h3>
              <p className="text-xs text-gray-400 mb-6">Rejeição máxima de calor mantendo a transparência e vista da Baía.</p>

              <div className="space-y-4 mb-8 text-sm">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Corte de Calor (IRR)</span>
                    <span className="text-[#c9a227] font-bold">95%</span>
                  </div>
                  <LevelDots level={5} />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Luminosidade Natural</span>
                    <span className="text-[#c9a227] font-bold">75% (Cristalina)</span>
                  </div>
                  <LevelDots level={5} />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Privacidade Diurna</span>
                    <span className="text-gray-400 font-bold">Suave</span>
                  </div>
                  <LevelDots level={2} />
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-4">Ideal para: Varandas gourmet, salas envidraçadas e prédios com regras estritas de fachada.</p>
                <Link
                  href="/nano-ceramica/"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#c9a227]/40 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-colors font-bold text-xs uppercase tracking-wider"
                >
                  Ver Detalhes da Cerâmica <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Película 2: Carbono Premium */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col relative group hover:border-[#c9a227]/40 transition-all duration-300 bg-gradient-to-b from-[#0a1628]/80 to-[#04080f]">
              <div className="absolute top-4 right-4 bg-white/10 text-gray-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider">
                Privacidade & Custo
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Carbono Premium</h3>
              <p className="text-xs text-gray-400 mb-6">Tom grafite nobre que não desbota e garante privacidade contra olhares vizinhos.</p>

              <div className="space-y-4 mb-8 text-sm">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Corte de Calor (IRR)</span>
                    <span className="text-[#c9a227] font-bold">70%</span>
                  </div>
                  <LevelDots level={3} />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Luminosidade Natural</span>
                    <span className="text-gray-400 font-bold">Média / Baixa (G5/G20)</span>
                  </div>
                  <LevelDots level={2} />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Privacidade Diurna</span>
                    <span className="text-[#c9a227] font-bold">Alta</span>
                  </div>
                  <LevelDots level={5} />
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-4">Ideal para: Quartos, janelas com prédios em frente e controle de luminosidade na TV.</p>
                <Link
                  href="/carbono/"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-bold text-xs uppercase tracking-wider"
                >
                  Ver Detalhes do Carbono <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Película 3: Jateado Decorativo */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col relative group hover:border-[#c9a227]/40 transition-all duration-300 bg-gradient-to-b from-[#0a1628]/80 to-[#04080f]">
              <div className="absolute top-4 right-4 bg-white/10 text-gray-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider">
                Privacidade 24h
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Jateado Fosco</h3>
              <p className="text-xs text-gray-400 mb-6">Bloqueio visual total permanente (dia e noite, luz acesa) com luz suave difusa.</p>

              <div className="space-y-4 mb-8 text-sm">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Corte de Calor</span>
                    <span className="text-gray-400 font-bold">Leve</span>
                  </div>
                  <LevelDots level={1} />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Luminosidade Natural</span>
                    <span className="text-[#c9a227] font-bold">Luz Difusa</span>
                  </div>
                  <LevelDots level={4} />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Privacidade 24h</span>
                    <span className="text-[#c9a227] font-bold">Total (100%)</span>
                  </div>
                  <LevelDots level={5} />
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-4">Ideal para: Boxes de banheiro, divisórias de cozinha/área de serviço e lavabos.</p>
                <Link
                  href="/jateado/"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-bold text-xs uppercase tracking-wider"
                >
                  Ver Detalhes do Jateado <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social: Google Reviews */}
      <GoogleReviews />

      {/* FAQ Específico de Santo Cristo */}
      <section className="py-20 bg-[#04080f] relative px-4">
        <div className="container-lume max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                Tire Suas Dúvidas
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-white mb-4">
              Perguntas Frequentes sobre Insulfilm em <span className="text-gradient-gold">Santo Cristo</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Respostas claras para as principais dúvidas dos moradores do Porto Maravilha.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group glass-card rounded-2xl border border-white/10 p-6 transition-all duration-300 open:border-[#c9a227]/40 open:bg-[#071324]"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-montserrat font-semibold text-base sm:text-lg text-white group-hover:text-[#c9a227] transition-colors">
                  <span>{faq.q}</span>
                  <span className="ml-4 flex-shrink-0 transition-transform duration-300 group-open:rotate-180 text-[#c9a227]">
                    <ChevronDown size={20} />
                  </span>
                </summary>
                <p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed font-light border-t border-white/5 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400 mb-4">Tem alguma medida ou janela específica no seu apartamento?</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 py-3 px-6 text-sm"
            >
              <MessageCircle size={18} />
              Conversar com o Instalador no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <ContactCTA />
    </div>
  );
}
