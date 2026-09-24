'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Monitor, 
  Thermometer, 
  Shield, 
  ArrowRight, 
  Sparkles, 
  Star, 
  Clock, 
  Briefcase, 
  Tag, 
  Check,
  Layers,
  Zap,
  Video,
  Home
} from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { GoogleReviews } from '../components/GoogleReviews';
import { Particles } from '../components/Particles';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';
import { ScrollReveal } from '../components/ScrollReveal';
import { HeroEntrance } from '../components/HeroEntrance';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { LevelDots } from '../sections/SelectionGuide';
import { ContactCTA } from '../sections/ContactCTA';
import { escritorioFaqs } from '../content/escritorioFaq';

const WHATSAPP_BASE = 'https://wa.me/5521965140612';

export function InsulfilmEscritorio() {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-[#04080f] via-[#081525] to-[#04080f]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#c9a227]/10 blur-[130px] rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1a3a5c]/25 blur-[110px] rounded-full" />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <Particles />

        <div className="container-lume relative z-10 text-center max-w-4xl mx-auto">
          <NavigationBreadcrumbs 
            showVisualTrail={false}
            items={[
              { label: 'Início', href: '/' },
              { label: 'Soluções por Cômodo', href: '/#produtos' },
              { label: 'Insulfilm no Escritório' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_15px_rgba(201,162,39,0.15)] animate-hero">
              <Briefcase size={14} className="text-[#c9a227]" />
              Produtividade, Ergonomia Visual & Divisórias Corporativas
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">para</span>
              <span className="inline-block word mr-2">Escritório:</span>
              <span className="inline-block word mr-2 text-gradient-gold">Zero</span>
              <span className="inline-block word mr-2 text-gradient-gold">Reflexo</span>
              <span className="inline-block word mr-2">no</span>
              <span className="inline-block word mr-2">Monitor</span>
              <span className="inline-block word mr-2">e</span>
              <span className="inline-block word text-gradient-gold">Mais</span>
              <span className="inline-block word text-gradient-gold">Foco</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 mx-auto mb-10 leading-relaxed font-light max-w-3xl animate-hero">
              Elimine o ofuscamento em telas de computadores, acabe com o contraluz em videochamadas e reduza em até 30% a conta de energia do ar-condicionado. Soluções completas para home office e empresas <strong className="text-white font-medium">a partir de R$ 280 ~ R$ 350</strong> no Rio de Janeiro.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20escrit%C3%B3rio!`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_0_25px_rgba(201,162,39,0.3)] w-full sm:w-auto"
              >
                Orçamento Rápido no WhatsApp <ArrowRight size={20} />
              </a>
              <a
                href="#exemplos-precos"
                className="btn-outline inline-flex items-center justify-center gap-2 text-base py-4 px-8 border border-white/20 hover:border-[#c9a227]/50 hover:bg-white/5 transition-all rounded-xl font-bold uppercase tracking-wider text-sm w-full sm:w-auto"
              >
                <Tag size={16} className="text-[#c9a227]" />
                Ver Exemplos de Preços
              </a>
            </div>
          </HeroEntrance>
        </div>
      </section>

      {/* Faixa de Destaques e Benefícios */}
      <section className="py-6 bg-[#070f1a] border-y border-white/5 relative z-10">
        <div className="container-lume">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Monitor size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Sem Reflexo no Monitor</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Thermometer size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Até 82% Rejeição de Calor</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Video size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Sem Contraluz na Webcam</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Shield size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Garantia de 2 Anos LUME</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dores & Desejos no Home Office e Escritório */}
      <section className="py-24 relative px-4 bg-[#0a1628]/20">
        <div className="container-lume max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <ScrollReveal animation="slide-up">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
                  <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                    Ergonomia & Alta Performance
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-montserrat mb-6 leading-tight">
                  Trabalhe com conforto sem precisar ficar em uma <span className="text-gradient-gold">caverna escura</span>.
                </h2>
                <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base md:text-lg">
                  <p>
                    Passar 8 horas por dia diante de telas sob a forte luz solar carioca provoca fadiga visual crônica, ardência nos olhos e dores de cabeça constantes. Para tentar resolver, muitos fecham cortinas pesadas, perdendo a vista externa e trabalhando sob lâmpadas artificiais o dia todo.
                  </p>
                  <p>
                    A película de controle solar para escritórios filtra o excesso de brilho ofuscante (glare) e rejeita o calor térmico antes de sobrecarregar o ar-condicionado. Você <strong className="text-white font-medium">trabalha com iluminação natural suave, enxerga os monitores com nitidez cristalina</strong> e mantém suas chamadas de vídeo com excelente apresentação visual.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Economia com Ar-Condicionado</h4>
                      <p className="text-xs text-gray-400">Até 30% menos consumo elétrico</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Instalação sem Parar o Trabalho</h4>
                      <p className="text-xs text-gray-400">Silenciosa e concluída em poucas horas</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Monitor size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Nitidez em Telas e Monitores</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Elimine aquele reflexo branco que força seus olhos e distorce cores em monitores, MacBooks e notebooks.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Video size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Reuniões Impecáveis na Câmera</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Sem estouro de luz atrás da sua cadeira no Zoom ou Teams. Imagem nítida e profissional para seus clientes e equipe.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Layers size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Privacidade em Divisórias</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Películas jateadas para salas de reunião e consultórios com total discrição e sofisticação arquitetônica.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Shield size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Preservação de Eletrônicos</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Evite superaquecimento prematuro de CPUs, impressoras e monitores expostos à radiação solar direta.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas com AnimatedCounter */}
      <section className="py-16 bg-[#04080f] border-b border-white/5 relative">
        <div className="container-lume max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="82" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Rejeição de Calor Infravermelho</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="90" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Redução de Ofuscamento e Glare</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="30" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Economia na Conta de Ar-Condicionado</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="10" suffix=" Anos" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Durabilidade com Garantia LUME</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO PRINCIPAL: EXEMPLOS REAIS DE PREÇOS PARA ESCRITÓRIO */}
      <section id="exemplos-precos" className="py-24 bg-gradient-to-b from-[#04080f] via-[#071324] to-[#04080f] px-4 relative scroll-mt-16">
        <div className="container-lume max-w-6xl mx-auto">
          <ScrollReveal animation="slide-up" className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                Transparência de Investimento
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-montserrat mb-6">
              Quanto custa colocar insulfilm <span className="text-gradient-gold">no escritório</span>?
            </h2>
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
              Consulte nossos valores médios de referência para home offices e ambientes corporativos no Rio de Janeiro:
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Opção 1: Janela de Home Office (Em torno de R$ 300) */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/80 rounded-2xl p-7 border border-[#c9a227]/40 hover:border-[#c9a227] transition-all flex flex-col justify-between shadow-[0_0_30px_rgba(201,162,39,0.1)]">
              <div className="absolute -top-3 right-6 bg-[#c9a227] text-[#04080f] font-bold text-xs uppercase px-3 py-1 rounded-full shadow-md">
                Mais Solicitado
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Home size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Home Office</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Janela de Escritório 2 Folhas</h3>
                <p className="text-gray-400 text-xs mb-6">Medida média estimada: ~1,20m x 1,20m (1,44 m²)</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-gradient-gold">
                    R$ 280 ~ R$ 350
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Película Térmica Anti-Reflexo com Aplicação</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Linha <strong>Carbono G20</strong> ou <strong>Nano Cerâmica</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Elimina reflexo solar incômodo no monitor</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Reduz drasticamente a temperatura da estação de trabalho</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Garantia oficial LUME de 2 anos</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Vi%20o%20exemplo%20da%20Janela%20de%20Home%20Office%20(R$%20280%20-%20350)%20e%20gostaria%20de%20um%20or%C3%A7amento.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl"
              >
                Orçar Home Office no WhatsApp <ArrowRight size={16} />
              </a>
            </ScrollReveal>

            {/* Opção 2: Janelão ou Sacada Integrada */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/60 rounded-2xl p-7 border border-white/10 hover:border-[#c9a227]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Sparkles size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Janelão / Varanda</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Sacada de Escritório</h3>
                <p className="text-gray-400 text-xs mb-6">Medida média estimada: ~2,00m x 2,10m (sala com vista livre)</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-white">
                    R$ 480 ~ R$ 750
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Conforme a tecnologia (Nano Cerâmica ou Refletiva)</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Linha <strong>Nano Cerâmica Alta Transparência</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Mantém a vista panorâmica e o horizonte limpos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Corta a sobrecarga do ar-condicionado na tarde</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Perfeita para salas de reunião de alto padrão</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20Janel%C3%A3o%20/%20Sacada%20de%20Escrit%C3%B3rio.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-[#c9a227] text-white hover:text-[#c9a227]"
              >
                Orçar Sacada no WhatsApp <ArrowRight size={16} />
              </a>
            </ScrollReveal>

            {/* Opção 3: Divisórias Corporativas (Por M²) */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/60 rounded-2xl p-7 border border-white/10 hover:border-[#c9a227]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Star size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Corporativo / Empresas</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Divisórias Jateadas (m²)</h3>
                <p className="text-gray-400 text-xs mb-6">Salas de reunião, consultórios e divisórias internas</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">A partir de</div>
                  <div className="text-3xl font-black font-montserrat text-white">
                    R$ 90 ~ R$ 150 <span className="text-base font-normal text-gray-400">/ m²</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Jateado Total ou Faixas Listradas sob Medida</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Privacidade confidencial entre setores e reuniões</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Opção de faixas decorativas ou recorte com logo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Horários flexíveis de aplicação sem parar o expediente</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Emissão de nota fiscal e garantia para pessoas jurídicas</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20corporativo%20para%20Divis%C3%B3rias%20de%20Vidro%20do%20meu%20escrit%C3%B3rio.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-[#c9a227] text-white hover:text-[#c9a227]"
              >
                Orçar Divisórias no WhatsApp <ArrowRight size={16} />
              </a>
            </ScrollReveal>
          </div>

          <div className="mt-12 text-center text-xs text-gray-400 max-w-2xl mx-auto">
            * Valores médios de referência no Rio de Janeiro. Fazemos orçamentos sob medida para escritórios residenciais e sedes corporativas com fotos ou plantas no WhatsApp.
          </div>
        </div>
      </section>

      {/* Soluções Técnicas com LevelDots */}
      <section className="py-24 bg-[#04080f] px-4 border-t border-white/5">
        <div className="container-lume max-w-6xl mx-auto">
          <ScrollReveal animation="slide-up" className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                Guia de Escolha Corporativa
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">
              Qual tecnologia escolher para o seu <span className="text-gradient-gold">Escritório</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
              Compare as principais películas aplicadas em estações de trabalho e salas comerciais:
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Nano Cerâmica */}
            <ScrollReveal animation="slide-up" className="product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-2xl p-6 lg:p-8 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative h-48 overflow-hidden rounded-xl mb-6 -mx-2 -mt-2">
                <Image
                  src="/product-nano-ceramica.webp"
                  alt="Película Nano Cerâmica para Escritório - LUME"
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070f1a]/95 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-[#c9a227] text-[#04080f] text-xs font-bold uppercase rounded-full">
                  Sem Escurecer
                </div>
              </div>

              <div className="mb-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-2xl font-bold font-montserrat text-white">Nano Cerâmica</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed min-h-[70px]">
                  Corte térmico cirúrgico com preservação de 100% da vista e claridade. Perfeita para escritórios panorâmicos e salas de reunião com fachada envidraçada.
                </p>
              </div>

              <div className="space-y-4 mb-8 bg-white/5 p-4 rounded-xl text-sm z-10 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rejeição de Calor</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Redução de Glare</span>
                  <LevelDots level={2} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Claridade Natural</span>
                  <LevelDots level={5} />
                </div>
              </div>

              <a href="/nano-ceramica/" className="w-full btn-outline py-3 text-sm text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto z-10">
                Ver detalhes
              </a>
            </ScrollReveal>

            {/* Carbono G20 */}
            <ScrollReveal animation="slide-up" className="product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-2xl p-6 lg:p-8 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative h-48 overflow-hidden rounded-xl mb-6 -mx-2 -mt-2">
                <Image
                  src="/product-carbono.webp"
                  alt="Película Carbono para Home Office - LUME"
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070f1a]/95 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-[#c9a227] text-[#04080f] text-xs font-bold uppercase rounded-full">
                  Melhor para Telas
                </div>
              </div>

              <div className="mb-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Monitor className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-2xl font-bold font-montserrat text-white">Carbono G20</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed min-h-[70px]">
                  Tonalidade grafite elegante que reduz o brilho excessivo nos monitores e traz conforto para os olhos durante as 8h de trabalho.
                </p>
              </div>

              <div className="space-y-4 mb-8 bg-white/5 p-4 rounded-xl text-sm z-10 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rejeição de Calor</span>
                  <LevelDots level={3} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Redução de Glare</span>
                  <LevelDots level={4} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Privacidade Diurna</span>
                  <LevelDots level={3} />
                </div>
              </div>

              <a href="/carbono/" className="w-full btn-outline py-3 text-sm text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto z-10">
                Ver detalhes
              </a>
            </ScrollReveal>

            {/* Jateada para Divisórias */}
            <ScrollReveal animation="slide-up" className="product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-2xl p-6 lg:p-8 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative h-48 overflow-hidden rounded-xl mb-6 -mx-2 -mt-2">
                <Image
                  src="/product-jateado-v2.webp"
                  alt="Película Jateada para Divisórias de Escritório - LUME"
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070f1a]/95 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-white text-[#04080f] text-xs font-bold uppercase rounded-full">
                  Privacidade Interna
                </div>
              </div>

              <div className="mb-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-2xl font-bold font-montserrat text-white">Jateado Corporativo</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed min-h-[70px]">
                  Solução campeã para salas de reunião e diretoria. Privacidade confidencial sem perder a luz e sem reformas pesadas.
                </p>
              </div>

              <div className="space-y-4 mb-8 bg-white/5 p-4 rounded-xl text-sm z-10 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Privacidade 24h</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Passagem de Luz</span>
                  <LevelDots level={4} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Acabamento Estético</span>
                  <LevelDots level={5} />
                </div>
              </div>

              <a href="/jateado/" className="w-full btn-outline py-3 text-sm text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto z-10">
                Ver detalhes
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Regiões Atendidas */}
      <section className="py-16 bg-[#04080f] px-4 border-y border-white/5">
        <div className="container-lume max-w-4xl mx-auto text-center">
          <ScrollReveal animation="slide-up">
            <h3 className="text-xl md:text-2xl font-bold font-montserrat text-white mb-4">
              Instalação em Home Offices e Sedes Corporativas no RJ
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Atendemos condomínios comerciais e residenciais com nota fiscal e agilidade:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { name: 'Barra da Tijuca', href: '/insulfilm-na-barra-da-tijuca/' },
                { name: 'Recreio dos Bandeirantes', href: '/insulfilm-no-recreio/' },
                { name: 'Jacarepaguá', href: '/insulfilm-em-jacarepagua/' },
                { name: 'Campo Grande', href: '/insulfilm-em-campo-grande/' },
                { name: 'Bangu', href: '/insulfilm-em-bangu/' },
                { name: 'Realengo', href: '/insulfilm-em-realengo/' },
                { name: 'Sulacap', href: '/insulfilm-em-sulacap/' }
              ].map((loc, idx) => (
                <a
                  key={idx}
                  href={loc.href}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#c9a227]/20 border border-white/10 hover:border-[#c9a227]/50 text-xs text-gray-300 hover:text-[#c9a227] transition-all"
                >
                  {loc.name}
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#04080f] px-4">
        <div className="container-lume max-w-3xl mx-auto">
          <ScrollReveal animation="slide-up" className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                Dúvidas sobre Escritórios
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-montserrat text-white mb-4">
              Perguntas Frequentes sobre <span className="text-[#c9a227]">Insulfilm para Escritório</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Saiba como eliminar o reflexo em telas, melhorar iluminação em chamadas e valores de instalação.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-in" className="space-y-4">
            {escritorioFaqs.map((faq, idx) => (
              <details key={idx} className="group glass-card border border-white/10 flex-col rounded-xl overflow-hidden cursor-pointer bg-white/[0.01]">
                <summary className="font-bold text-base md:text-lg p-6 hover:bg-white/[0.04] transition-colors outline-none flex justify-between items-center list-none text-white">
                  <span className="pr-4">{faq.q}</span>
                  <span className="text-[#c9a227] group-open:rotate-45 transition-transform text-2xl font-light leading-none flex-shrink-0">+</span>
                </summary>
                <div className="p-6 pt-0 text-gray-300 text-sm md:text-base leading-relaxed border-t border-white/5 mt-0 transition-all bg-black/20">
                  <div className="mt-4">{faq.a}</div>
                </div>
              </details>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Prova Social */}
      <GoogleReviews />

      {/* CTA Final */}
      <ContactCTA />
    </div>
  );
}
