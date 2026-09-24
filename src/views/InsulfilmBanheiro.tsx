'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Eye, 
  Droplets, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Star, 
  Home, 
  Tag, 
  Check,
  Sun,
  Lock,
  Layers
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
import { banheiroFaqs } from '../content/banheiroFaq';

const WHATSAPP_BASE = 'https://wa.me/5521965140612';

export function InsulfilmBanheiro() {
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
              { label: 'Insulfilm no Banheiro' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_15px_rgba(201,162,39,0.15)] animate-hero">
              <Lock size={14} className="text-[#c9a227]" />
              Privacidade 24 Horas & Resistência Total à Umidade
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">para</span>
              <span className="inline-block word mr-2">Banheiro:</span>
              <span className="inline-block word mr-2 text-gradient-gold">Privacidade</span>
              <span className="inline-block word mr-2 text-gradient-gold">24h</span>
              <span className="inline-block word mr-2">sem</span>
              <span className="inline-block word mr-2">Perder</span>
              <span className="inline-block word mr-2">a</span>
              <span className="inline-block word text-gradient-gold">Claridade</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 mx-auto mb-10 leading-relaxed font-light max-w-3xl animate-hero">
              Sinta-se à vontade no ambiente mais privativo da sua casa. Nossas películas jateadas e opacas bloqueiam a visão externa dia e noite — mesmo com a luz acesa —, resistem ao vapor do chuveiro e não escurecem o cômodo. Básculas e boxes <strong className="text-white font-medium">a partir de R$ 180 ~ R$ 320</strong> com instalação no Rio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20banheiro!`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_0_25px_rgba(201,162,39,0.3)] w-full sm:w-auto"
              >
                Pedir Orçamento no WhatsApp <ArrowRight size={20} />
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
              <Eye size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Privacidade 24h Luz Acesa</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Droplets size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>À Prova de Vapor e Água</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Sun size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Luz Natural Preservada</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Shield size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Garantia de 2 Anos LUME</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dor e Solução: Privacidade Real no Banheiro */}
      <section className="py-24 relative px-4 bg-[#0a1628]/20">
        <div className="container-lume max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <ScrollReveal animation="slide-up">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
                  <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                    Intimidade & Segurança
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-montserrat mb-6 leading-tight">
                  Tome banho com tranquilidade sem o risco de <span className="text-gradient-gold">olhares indiscretos</span>.
                </h2>
                <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base md:text-lg">
                  <p>
                    Janelas de banheiro e básculas em prédios no Rio de Janeiro frequentemente dão de frente para outros apartamentos, áreas de serviço ou corredores comuns. Películas fumê comuns falham à noite, pois quando você acende a luz do banheiro, quem está fora enxerga perfeitamente o interior.
                  </p>
                  <p>
                    A <strong className="text-white font-medium">película Jateada LUME</strong> resolve isso definitivamente: seu acabamento acetinado bloqueia a visão nos dois sentidos 24 horas por dia, difundindo a luz suavemente para não deixar o banheiro escuro e eliminando a necessidade de cortinas plásticas que mofam com a umidade.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                      <Droplets size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Não Descola com o Vapor</h4>
                      <p className="text-xs text-gray-400">Adesão acrílica profissional impermeável</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Mais Higiênico que Cortinas</h4>
                      <p className="text-xs text-gray-400">Sem acúmulo de mofo, fungos ou limo</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Lock size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Privacidade com Luz Acesa</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Mesmo à noite com o refletor ou plafon do teto aceso, quem olha de fora vê apenas uma superfície leitosa suave.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Visual Clean e Moderno</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Substitui vidros canelados ou martelados antigos por um acabamento jateado de alto padrão arquitetônico.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Shield size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Segurança no Box</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Em caso de quebra acidental do vidro temperado do box, a película segura os fragmentos unidos, evitando acidentes graves.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Sun size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Claridade Difusa</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  A luz do sol continua entrando, permitindo secagem natural do banheiro e economia de energia durante o dia.
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
                <AnimatedCounter target="100" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Privacidade Bidirecional 24h</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="80" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Transmissão de Luz Natural (Claridade)</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="99" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Bloqueio de Raios UV</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="10" suffix=" Anos" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Durabilidade do Jateado Profissional</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO PRINCIPAL: EXEMPLOS REAIS DE PREÇOS PARA BANHEIRO */}
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
              Quanto custa colocar insulfilm <span className="text-gradient-gold">no banheiro</span>?
            </h2>
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
              Consulte nossos valores médios de referência para janelas, básculas e boxes de vidro no Rio de Janeiro:
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Opção 1: Báscula / Janela Padrão (Entrada econômica) */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/80 rounded-2xl p-7 border border-[#c9a227]/40 hover:border-[#c9a227] transition-all flex flex-col justify-between shadow-[0_0_30px_rgba(201,162,39,0.1)]">
              <div className="absolute -top-3 right-6 bg-[#c9a227] text-[#04080f] font-bold text-xs uppercase px-3 py-1 rounded-full shadow-md">
                Mais Solicitado
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Home size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Janela & Báscula</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Báscula de Banheiro</h3>
                <p className="text-gray-400 text-xs mb-6">Medida média estimada: ~0,60m x 0,60m ou ~0,80m x 0,60m</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-gradient-gold">
                    R$ 180 ~ R$ 280
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Película Jateada Profissional + Instalação</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Linha <strong>Jateada Fosca Translúcida</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Privacidade 24 horas garantida com a lâmpada acesa</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Resistência garantida contra o vapor do chuveiro</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Aplicação rápida (aprox. 40 minutos)</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Vi%20o%20exemplo%20da%20B%C3%A1scula%20de%20Banheiro%20(R$%20180%20-%20280)%20e%20gostaria%20de%20um%20or%C3%A7amento.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl"
              >
                Orçar Báscula no WhatsApp <ArrowRight size={16} />
              </a>
            </ScrollReveal>

            {/* Opção 2: Box de Vidro (Exemplo em torno de R$ 300) */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/60 rounded-2xl p-7 border border-white/10 hover:border-[#c9a227]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Droplets size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Box & Chuveiro</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Box de Vidro (2 a 4 Folhas)</h3>
                <p className="text-gray-400 text-xs mb-6">Medida média estimada: ~1,20m a 1,60m x 1,90m</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-white">
                    R$ 320 ~ R$ 480
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Conforme número de folhas fixas e móveis</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Opções <strong>Totalmente Jateado</strong> ou com <strong>Faixas Centrais</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Camada de proteção extra contra estilhaçamento de vidro</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Disfarça manchas de água e marcas de sabonete</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Fácil higienização com pano úmido e detergente neutro</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20Box%20de%20Banheiro%20em%20pel%C3%ADcula%20jateada.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-[#c9a227] text-white hover:text-[#c9a227]"
              >
                Orçar Box no WhatsApp <ArrowRight size={16} />
              </a>
            </ScrollReveal>

            {/* Opção 3: Combo Banheiro Completo (Báscula + Box) */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/60 rounded-2xl p-7 border border-white/10 hover:border-[#c9a227]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Star size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Pacote Completo</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Combo Báscula + Box</h3>
                <p className="text-gray-400 text-xs mb-6">Janela externa + box de vidro do banheiro aplicados juntos</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-white">
                    R$ 450 ~ R$ 680
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Economia progressiva ao contratar o conjunto</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Privacidade externa absoluta na báscula</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Conforto estético e sofisticação no box</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Instalação finalizada em uma única visita (1h30)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>2 Anos de Garantia LUME com termo de entrega</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20o%20Combo%20B%C3%A1scula%20%2B%20Box%20de%20Banheiro.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-[#c9a227] text-white hover:text-[#c9a227]"
              >
                Orçar Combo Banheiro <ArrowRight size={16} />
              </a>
            </ScrollReveal>
          </div>

          <div className="mt-12 text-center text-xs text-gray-400 max-w-2xl mx-auto">
            * Valores de referência para aplicação em residências no Rio de Janeiro. A cotação exata depende do número de folhas, medidas e se já existe película antiga a ser removida. Envie fotos da sua báscula ou box pelo WhatsApp para orçamento na hora!
          </div>
        </div>
      </section>

      {/* Soluções Técnicas com LevelDots */}
      <section className="py-24 bg-[#04080f] px-4 border-t border-white/5">
        <div className="container-lume max-w-5xl mx-auto">
          <ScrollReveal animation="slide-up" className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                Opções para Vidros Úmidos
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">
              Modelos de Película para o seu <span className="text-gradient-gold">Banheiro</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
              Conheça as linhas mais pedidas para básculas, boxes e divisórias:
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Jateado Fosco */}
            <ScrollReveal animation="slide-up" className="product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-2xl p-8 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative h-52 overflow-hidden rounded-xl mb-6 -mx-2 -mt-2">
                <Image
                  src="/product-jateado-v2.webp"
                  alt="Película Jateada para Banheiro - LUME"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070f1a]/95 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#c9a227] text-[#04080f] text-xs font-bold uppercase rounded-full">
                  Líder de Vendas
                </div>
              </div>

              <div className="mb-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-2xl font-bold font-montserrat text-white">Jateado Fosco Branco</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed min-h-[70px]">
                  Efeito leitoso jateado com difusão uniforme da luz. Garante privacidade total com a lâmpada acesa à noite e mantém o ambiente muito iluminado de dia.
                </p>
              </div>

              <div className="space-y-4 mb-8 bg-white/5 p-5 rounded-xl text-sm z-10 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Privacidade Dia e Noite</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Passagem de Luz Natural</span>
                  <LevelDots level={4} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Resistência à Umidade</span>
                  <LevelDots level={5} />
                </div>
              </div>

              <a href="/jateado/" className="w-full btn-outline py-3.5 text-sm text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto z-10">
                Conhecer a Linha Jateada
              </a>
            </ScrollReveal>

            {/* Jateado com Faixas Decorativas */}
            <ScrollReveal animation="slide-up" className="product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-2xl p-8 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative h-52 overflow-hidden rounded-xl mb-6 -mx-2 -mt-2">
                <Image
                  src="/jateado-hero.webp"
                  alt="Película Jateada Decorativa para Box - LUME"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070f1a]/95 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white text-[#04080f] text-xs font-bold uppercase rounded-full">
                  Design & Estilo
                </div>
              </div>

              <div className="mb-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-2xl font-bold font-montserrat text-white">Faixas Jateadas / Decorativas</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed min-h-[70px]">
                  Aplicação de faixas horizontais recortadas a laser na altura do corpo. Permite manter faixas transparentes no topo e embaixo, criando um visual sofisticado no box.
                </p>
              </div>

              <div className="space-y-4 mb-8 bg-white/5 p-5 rounded-xl text-sm z-10 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Privacidade na Altura do Corpo</span>
                  <LevelDots level={4} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Passagem de Luz Natural</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Acabamento Personalizado</span>
                  <LevelDots level={5} />
                </div>
              </div>

              <a href="/jateado/" className="w-full btn-outline py-3.5 text-sm text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto z-10">
                Ver Opções Decorativas
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
              Instalação de Insulfilm para Banheiro em Todo o Rio
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Atendemos condomínios residenciais e casas em todas as regiões cariocas:
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
                Dúvidas Frequentes
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-montserrat text-white mb-4">
              Perguntas Frequentes sobre <span className="text-[#c9a227]">Insulfilm para Banheiro</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Tire dúvidas sobre privacidade com lâmpada acesa, resistência ao vapor, valores e limpeza.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-in" className="space-y-4">
            {banheiroFaqs.map((faq, idx) => (
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
