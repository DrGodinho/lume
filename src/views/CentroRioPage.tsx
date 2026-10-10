'use client';

import React from 'react';
import Link from 'next/link';
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
  ChevronDown,
  Briefcase,
  Monitor
} from 'lucide-react';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';
import { HeroEntrance } from '../components/HeroEntrance';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { Particles } from '../components/Particles';
import { GoogleReviews } from '../components/GoogleReviews';
import { LevelDots } from '../sections/SelectionGuide';
import { ContactCTA } from '../sections/ContactCTA';

const WHATSAPP_URL = 'https://wa.me/5521965140612?text=Ol%C3%A1!%20Estou%20no%20Centro%20do%20Rio%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20im%C3%B3vel.';

interface CentroRioPageProps {
  faqs: { q: string; a: string }[];
}

export function CentroRioPage({ faqs }: CentroRioPageProps) {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-28 overflow-hidden px-4">
        {/* Background Ambience */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-[#04080f] via-[#071324] to-[#04080f]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#c9a227]/10 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1a3a5c]/25 blur-[110px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <Particles />

        <div className="container-lume relative z-10 text-center max-w-4xl mx-auto">
          <NavigationBreadcrumbs 
            showVisualTrail={false}
            items={[
              { label: 'Início', href: '/' },
              { label: 'Onde Atendemos', href: '/#onde-atendemos' },
              { label: 'Centro do Rio de Janeiro' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_20px_rgba(201,162,39,0.15)] animate-hero">
              <Building2 size={14} className="text-[#c9a227]" />
              Residenciais Reviver Centro & Salas Comerciais
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">no</span>
              <span className="inline-block word mr-2 text-gradient-gold">Centro</span>
              <span className="inline-block word mr-2">do</span>
              <span className="inline-block word mr-2 text-gradient-gold">Rio</span>
              <span className="inline-block word mr-2">de</span>
              <span className="inline-block word mr-2 text-gradient-gold">Janeiro</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-hero">
              Controle solar de alta tecnologia para novos apartamentos do Reviver Centro, coberturas, escritórios e consultórios. Até <strong className="text-white font-semibold">95% de bloqueio térmico</strong>, fim dos reflexos nas telas e privacidade com garantia de até 10 anos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_10px_30px_rgba(201,162,39,0.25)]"
              >
                <MessageCircle size={20} />
                Solicitar Orçamento no WhatsApp
              </a>
              <a
                href="#solucoes-centro"
                className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-3 text-sm sm:text-base py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-wider"
              >
                Conhecer Soluções <ArrowRight size={18} />
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
              <Monitor size={16} className="text-[#c9a227]" />
              <span>Anti-Reflexo para Telas e Monitores de Trabalho</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-[#c9a227]" />
              <span>Privacidade em Fachadas e Divisórias Jateadas</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#c9a227]" />
              <span>Garantia Contratual LUME de até 10 Anos</span>
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
              <p className="text-xs sm:text-sm text-gray-400">Redução de Temperatura Interna</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 stat-card">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="99" suffix="%" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Bloqueio de Raios UV Nocivos</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 stat-card">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="35" suffix="%" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Economia no Ar-Condicionado Comercial</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 stat-card">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="10" suffix=" Anos" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400">Garantia Real sem Bolhas ou Desbotamento</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Dores do Centro: Residenciais vs Escritórios */}
      <section id="solucoes-centro" className="py-20 lg:py-28 bg-[#04080f] relative px-4">
        <div className="container-lume">
          <ScrollReveal animation="slide-up" className="max-w-3xl mx-auto text-center mb-16">
            <div className="animate-item flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                Centro do Rio · Tradição & Revitalização
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="animate-item text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat mb-6">
              Soluções Sob Medida para <span className="text-gradient-gold">Apartamentos e Empresas</span>
            </h2>
            <p className="animate-item text-gray-400 text-base sm:text-lg leading-relaxed font-light">
              O Centro do Rio reúne tanto os modernos residenciais do <strong>Reviver Centro</strong> quanto os prédios comerciais da <strong>Av. Rio Branco, Presidente Vargas, Cinelândia e Carioca</strong>. Nossas películas resolvem os principais desafios de conforto:
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Card 1 */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 benefit-card hover:border-[#c9a227]/40 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227] mb-6 shadow-inner">
                <Thermometer size={28} />
              </div>
              <h3 className="text-xl font-bold font-montserrat text-white mb-3">1. Calor Intenso nas Grandes Avenidas</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Asfalto, concreto e grandes fachadas de vidro criam ilhas de calor no Centro. A película Nano Cerâmica bloqueia o infravermelho antes de entrar no ambiente, mantendo salas e quartos frescos e poupando a conta de energia.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 benefit-card hover:border-[#c9a227]/40 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227] mb-6 shadow-inner">
                <Monitor size={28} />
              </div>
              <h3 className="text-xl font-bold font-montserrat text-white mb-3">2. Fim do Reflexo em Telas e Monitores</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Para quem trabalha em escritórios ou home-office no Centro, o reflexo do sol nos computadores causa cansaço visual e perda de produtividade. Nossas películas filtram o excesso de brilho sem escurecer a vista do Rio.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 benefit-card hover:border-[#c9a227]/40 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227] mb-6 shadow-inner">
                <Briefcase size={28} />
              </div>
              <h3 className="text-xl font-bold font-montserrat text-white mb-3">3. Divisórias Jateadas para Empresas</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Salas de reunião, consultórios médicos e recepções corporativas exigem privacidade visual permanente. A linha <strong>Jateada Fosca</strong> oferece elegância arquitetônica e sigilo total em divisórias e portas de vidro.
              </p>
            </div>
          </div>

          {/* Banner Corporativo & Condomínios */}
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-[#c9a227]/30 bg-gradient-to-r from-[#071324] via-[#0b1e36] to-[#071324] shadow-2xl">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#c9a227]/10 blur-3xl rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl text-center lg:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#c9a227]/20 text-[#c9a227] text-xs font-bold uppercase tracking-widest mb-4">
                  Atendimento Comercial & Residencial
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-montserrat text-white mb-3">
                  Precisa de aplicação em escritórios ou conjunto residencial?
                </h3>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
                  Emitimos <strong>Nota Fiscal completa</strong>, certificado de garantia e oferecemos horários flexíveis de instalação comercial (inclusive noturno e finais de semana) para não interromper as atividades da sua empresa no Centro!
                </p>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-shrink-0 inline-flex items-center gap-3 text-base py-4 px-8 shadow-lg shadow-[#c9a227]/20"
              >
                <Users size={20} />
                Agendar Visita Técnica no Centro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Exemplo Real de Preços no Centro do Rio */}
      <section id="exemplos-centro" className="py-20 lg:py-24 bg-[#070f1a] relative px-4 overflow-hidden border-y border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#c9a227]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-lume relative z-10">
          <ScrollReveal animation="slide-up" className="max-w-3xl mx-auto text-center mb-14">
            <div className="animate-item flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <CheckCircle size={14} /> Transparência de Preços
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="animate-item text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat mb-6">
              Quanto Custa Insulfilm no Centro? <br />
              <span className="text-gradient-gold">Cenários Reais de Aplicação</span>
            </h2>
            <p className="animate-item text-gray-400 text-base sm:text-lg leading-relaxed font-light">
              Trabalhamos com preços transparentes e sem surpresas. Veja estimativas de valores para as situações mais frequentes no Centro do Rio:
            </p>
          </ScrollReveal>

          {/* Cards dos 3 Cenários no Centro */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {/* Cenário 1: Apartamento Reviver Centro */}
            <div className="glass-panel p-7 sm:p-8 rounded-3xl border border-white/10 flex flex-col relative group hover:border-[#c9a227]/40 transition-all duration-300 bg-gradient-to-b from-[#0a1628]/80 to-[#04080f]">
              <div className="inline-flex self-start px-3 py-1 rounded-full bg-white/10 text-gray-300 text-[11px] font-bold uppercase tracking-wider mb-4">
                Residencial Reviver Centro
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-white mb-1">Janela / Varanda</h3>
              <p className="text-xs text-gray-400 mb-6">Janelão de sala ou varanda (aprox. 4 m²) com proteção solar e privacidade.</p>

              <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-gray-400 block uppercase tracking-wider mb-1">A partir de</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-gray-400">R$</span>
                  <span className="text-3xl sm:text-4xl font-black font-montserrat text-white">360,00</span>
                </div>
                <span className="text-[11px] text-gray-400 block mt-1">Linha Carbono (privacidade + corte térmico)</span>
              </div>

              <div className="space-y-3 mb-8 text-sm text-gray-300 flex-grow">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Privacidade diurna contra vizinhos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Redução imediata do calor na sala</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Garantia de não desbotamento (não fica roxa)</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-auto">
                <a
                  href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Tenho%20um%20apartamento%20no%20Centro%20do%20Rio%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20minhas%20janelas."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors font-bold text-xs uppercase tracking-wider"
                >
                  <MessageCircle size={16} /> Cotar Residencial
                </a>
              </div>
            </div>

            {/* Cenário 2: Sala Comercial / Escritório */}
            <div className="glass-panel p-7 sm:p-8 rounded-3xl border-2 border-[#c9a227] flex flex-col relative group shadow-[0_15px_40px_rgba(201,162,39,0.15)] bg-gradient-to-b from-[#0e213d] to-[#04080f] transform lg:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c9a227] text-[#04080f] text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-widest shadow-md whitespace-nowrap">
                ⭐ O Mais Pedido em Escritórios
              </div>
              <div className="inline-flex self-start px-3 py-1 rounded-full bg-[#c9a227]/20 text-[#c9a227] text-[11px] font-bold uppercase tracking-wider mb-4 mt-2">
                Conjunto Comercial
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-white mb-1">Nano Cerâmica Térmica</h3>
              <p className="text-xs text-gray-300 mb-6">Bloqueio brutal de calor com transparência elegante para não perder a vista do Rio.</p>

              <div className="mb-6 p-4 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/20">
                <span className="text-[11px] text-[#c9a227] font-semibold block uppercase tracking-wider mb-1">A partir de</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-[#c9a227]">R$</span>
                  <span className="text-3xl sm:text-4xl font-black font-montserrat text-white text-gradient-gold">180,00</span>
                  <span className="text-xs text-[#c9a227]">/m²</span>
                </div>
                <span className="text-[11px] text-gray-300 block mt-1">Alta rejeição de infravermelho instalada</span>
              </div>

              <div className="space-y-3 mb-8 text-sm text-gray-200 flex-grow">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Elimina o reflexo incômodo nos monitores</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Economiza até 35% no ar-condicionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Sem interferência em sinais de Wi-Fi e 5G</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 pt-3 border-t border-white/10">
                  <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                  <span>Ideal para Av. Rio Branco, Carioca e Castelo</span>
                </div>
              </div>

              <div className="pt-6 border-t border-[#c9a227]/20 mt-auto">
                <a
                  href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Tenho%20uma%20sala%20comercial%20no%20Centro%20do%20Rio%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20Nano%20Cer%C3%A2mica%20para%20reduzir%20o%20calor."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2 w-full py-3.5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#c9a227]/25"
                >
                  <MessageCircle size={16} /> Cotar Escritório / Clínica
                </a>
              </div>
            </div>

            {/* Cenário 3: Divisórias Jateadas */}
            <div className="glass-panel p-7 sm:p-8 rounded-3xl border border-white/10 flex flex-col relative group hover:border-[#c9a227]/40 transition-all duration-300 bg-gradient-to-b from-[#0a1628]/80 to-[#04080f]">
              <div className="inline-flex self-start px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-4">
                Privacidade 24h
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-white mb-1">Jateado Fosco</h3>
              <p className="text-xs text-gray-400 mb-6">Para divisórias de vidro, salas de reunião, consultórios e lavabos.</p>

              <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-gray-400 block uppercase tracking-wider mb-1">A partir de</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-gray-400">R$</span>
                  <span className="text-3xl sm:text-4xl font-black font-montserrat text-white">100,00</span>
                  <span className="text-xs text-gray-400">/m²</span>
                </div>
                <span className="text-[11px] text-gray-400 block mt-1">Acabamento fosco arquitetônico permanente</span>
              </div>

              <div className="space-y-3 mb-8 text-sm text-gray-300 flex-grow">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Privacidade total (ninguém vê através)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Passagem de luz difusa e suave</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#c9a227] flex-shrink-0" />
                  <span>Opção em faixas decorativas ou vidro inteiro</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-auto">
                <a
                  href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Preciso%20de%20insulfilm%20jateado%20para%20divis%C3%B3rias%20de%20vidro%20no%20Centro%20do%20Rio%20e%20gostaria%20de%20um%20or%C3%A7amento."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-[#c9a227]/40 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-colors font-bold text-xs uppercase tracking-wider"
                >
                  <MessageCircle size={16} /> Cotar Divisórias Jateadas
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              * Valores com aplicação profissional inclusa e nota fiscal. Envie as medidas das suas janelas ou portas pelo WhatsApp para receber seu orçamento em poucos minutos!
            </p>
          </div>
        </div>
      </section>

      {/* Tabela Comparativa de Películas */}
      <section className="py-20 bg-[#04080f] relative px-4">
        <div className="container-lume">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                Guia Técnico
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-montserrat mb-6">
              Escolha a Película Certa para o Seu <span className="text-gradient-gold">Ambiente</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed font-light">
              Compare as características técnicas mais solicitadas pelos clientes do Centro do Rio:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Película 1: Nano Cerâmica */}
            <div className="glass-panel p-8 rounded-3xl border border-[#c9a227]/30 flex flex-col relative group hover:border-[#c9a227] transition-all duration-300 bg-gradient-to-b from-[#0a1628] to-[#04080f]">
              <div className="absolute top-4 right-4 bg-[#c9a227] text-[#04080f] text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
                Top Conforto
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Nano Cerâmica</h3>
              <p className="text-xs text-gray-400 mb-6">Rejeição máxima de calor mantendo a transparência ou fumê suave.</p>

              <div className="space-y-4 mb-8 text-sm">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Corte de Calor (IRR)</span>
                    <span className="text-[#c9a227] font-bold">Até 95%</span>
                  </div>
                  <LevelDots level={5} />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Luminosidade Natural</span>
                    <span className="text-[#c9a227] font-bold">Cristalina / Suave</span>
                  </div>
                  <LevelDots level={5} />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Privacidade Diurna</span>
                    <span className="text-gray-400 font-bold">Suave</span>
                  </div>
                  <LevelDots level={3} />
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-4">Ideal para: Salas com sol poente, varandas de apartamentos e escritórios com ar-condicionado sobrecarregado.</p>
                <Link
                  href="/nano-ceramica/"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#c9a227]/40 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-colors font-bold text-xs uppercase tracking-wider"
                >
                  Conhecer Nano Cerâmica <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Película 2: Carbono Premium */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col relative group hover:border-[#c9a227]/40 transition-all duration-300 bg-gradient-to-b from-[#0a1628]/80 to-[#04080f]">
              <div className="absolute top-4 right-4 bg-white/10 text-gray-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider">
                Privacidade & Custo
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Carbono Premium</h3>
              <p className="text-xs text-gray-400 mb-6">Tom grafite nobre sem metal, não oxida e garante privacidade contra olhares externos.</p>

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
                    <span className="text-gray-400 font-bold">Fumê Médio (G20/G5)</span>
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
                <p className="text-xs text-gray-400 mb-4">Ideal para: Quartos, janelas com visão de prédios vizinhos e redução de brilho em telas.</p>
                <Link
                  href="/carbono/"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-bold text-xs uppercase tracking-wider"
                >
                  Conhecer Carbono <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Película 3: Jateado Decorativo */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col relative group hover:border-[#c9a227]/40 transition-all duration-300 bg-gradient-to-b from-[#0a1628]/80 to-[#04080f]">
              <div className="absolute top-4 right-4 bg-white/10 text-gray-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full tracking-wider">
                Privacidade 24h
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Jateado Fosco</h3>
              <p className="text-xs text-gray-400 mb-6">Bloqueio visual total permanente (dia e noite) com passagem de luz difusa e suave.</p>

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
                <p className="text-xs text-gray-400 mb-4">Ideal para: Divisórias de escritório, consultórios, salas de reunião e banheiros.</p>
                <Link
                  href="/jateado/"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-bold text-xs uppercase tracking-wider"
                >
                  Conhecer Jateado <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social: Google Reviews */}
      <GoogleReviews />

      {/* FAQ Específico do Centro do Rio */}
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
              Perguntas Frequentes sobre Insulfilm no <span className="text-gradient-gold">Centro do Rio</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Respostas claras para moradores e empresas do Centro da capital.
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
            <p className="text-sm text-gray-400 mb-4">Deseja um orçamento rápido para sua casa ou empresa no Centro?</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 py-3 px-6 text-sm"
            >
              <MessageCircle size={18} />
              Conversar com Especialista no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <ContactCTA />
    </div>
  );
}
