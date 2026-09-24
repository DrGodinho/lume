'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Tv, 
  Thermometer, 
  Sun, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Star, 
  Clock, 
  Zap, 
  Home, 
  Eye, 
  Tag, 
  Check
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
import { salaFaqs } from '../content/salaFaq';

const WHATSAPP_BASE = 'https://wa.me/5521965140612';

export function InsulfilmSala() {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-[#04080f] via-[#071324] to-[#04080f]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#c9a227]/10 blur-[130px] rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1a3a5c]/20 blur-[100px] rounded-full" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <Particles />

        <div className="container-lume relative z-10 text-center max-w-4xl mx-auto">
          <NavigationBreadcrumbs 
            showVisualTrail={false}
            items={[
              { label: 'Início', href: '/' },
              { label: 'Soluções por Cômodo', href: '/#produtos' },
              { label: 'Insulfilm na Sala' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_15px_rgba(201,162,39,0.15)] animate-hero">
              <Sparkles size={14} className="text-[#c9a227]" />
              Conforto Térmico & Proteção Visual para Salas
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">para</span>
              <span className="inline-block word mr-2">Sala:</span>
              <span className="inline-block word mr-2 text-gradient-gold">Zero</span>
              <span className="inline-block word mr-2 text-gradient-gold">Reflexo</span>
              <span className="inline-block word mr-2">na</span>
              <span className="inline-block word mr-2">TV</span>
              <span className="inline-block word mr-2">e</span>
              <span className="inline-block word mr-2">Mais</span>
              <span className="inline-block word text-gradient-gold">Frescor</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 mx-auto mb-10 leading-relaxed font-light max-w-3xl animate-hero">
              Transforme a sala da sua casa em um ambiente acolhedor e fresco. Elimine o reflexo incômodo na tela da TV, reduza até 82% do calor solar e preserve sofás e pisos contra o sol carioca. Instalações residenciais completas <strong className="text-white font-medium">a partir de R$ 280 ~ R$ 320</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20a%20minha%20sala!`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_0_25px_rgba(201,162,39,0.3)] w-full sm:w-auto"
              >
                Pedir Orçamento Grátis <ArrowRight size={20} />
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

      {/* Faixa de Destaques e Garantias */}
      <section className="py-6 bg-[#070f1a] border-y border-white/5 relative z-10">
        <div className="container-lume">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Thermometer size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Até 82% Rejeição de Calor</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Tv size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Sem Reflexo na TV</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Sun size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>99% Bloqueio Anti-UV</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Shield size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Garantia de 2 Anos LUME</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dor e Desejo na Sala de Estar */}
      <section className="py-24 relative px-4 bg-[#0a1628]/20">
        <div className="container-lume max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <ScrollReveal animation="slide-up">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
                  <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                    Vida Real no Rio de Janeiro
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-montserrat mb-6 leading-tight">
                  Sua sala é o coração da casa, não uma <span className="text-gradient-gold">estufa de calor</span>.
                </h2>
                <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base md:text-lg">
                  <p>
                    Quem mora no Rio sabe o desafio de curtir a sala no período da tarde: o sol poente entra com força pelas janelas e portas de sacada, transformando o sofá em um ponto insuportável e ofuscando a tela da televisão.
                  </p>
                  <p>
                    Muitas famílias recorrem a cortinas grossas ou persianas pesadas, o que resolve o reflexo mas aprisiona o calor e deixa a sala escura e com aspecto fechado. Com a película solar certa, você <strong className="text-white font-medium">mantém a luz natural e a vista externa</strong>, reduz drasticamente o calor e assiste televisão sem qualquer incômodo.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Sem Obra ou Quebradeira</h4>
                      <p className="text-xs text-gray-400">Instalação limpa em poucas horas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Economia na Conta de Luz</h4>
                      <p className="text-xs text-gray-400">Ar-condicionado trabalha menos</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Tv size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Nitidez Absoluta na TV</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Diga adeus àquele ponto branco de sol no meio da tela da sua Smart TV ou do home theater durante o dia.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Sun size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Proteção de Móveis e Pisos</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Sofás de linho ou couro, tapetes nobres e pisos de madeira protegidos contra o ressecamento e o desbotamento solar.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Thermometer size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Clima Agradável 24h</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Redução sensível de temperatura que permite reunir a família e amigos sem precisar congelar a sala no ar-condicionado.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Eye size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Privacidade Diurna</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Veja toda a vista panorâmica para o exterior sem que vizinhos ou transeuntes consigam enxergar o interior da sua sala.
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
                <AnimatedCounter target="99" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Bloqueio de Raios UV</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="30" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Alívio no Gasto com Ar-Condicionado</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="10" suffix=" Anos" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Durabilidade Estimada das Películas</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO PRINCIPAL: EXEMPLOS REAIS DE PREÇOS PARA SALA */}
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
              Quanto custa colocar insulfilm <span className="text-gradient-gold">na sala</span>?
            </h2>
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
              Sabemos que a transparência de valores é essencial para o seu planejamento. Confira abaixo exemplos reais de janelas e portas típicas no Rio de Janeiro:
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Opção 1: Janela Padrão (Exemplo em torno de R$ 300) */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/80 rounded-2xl p-7 border border-[#c9a227]/40 hover:border-[#c9a227] transition-all flex flex-col justify-between shadow-[0_0_30px_rgba(201,162,39,0.1)]">
              <div className="absolute -top-3 right-6 bg-[#c9a227] text-[#04080f] font-bold text-xs uppercase px-3 py-1 rounded-full shadow-md">
                Mais Popular
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Home size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Janela Convencional</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Janela de Sala 2 Folhas</h3>
                <p className="text-gray-400 text-xs mb-6">Medida média estimada: ~1,20m x 1,20m (1,44 m²)</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-gradient-gold">
                    R$ 280 ~ R$ 350
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Material + Mão de obra especializada inclusa</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Linha <strong>Carbono Térmico</strong> ou <strong>Fumê Intermediário</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Elimina reflexo direto na Smart TV</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Instalação rápida e silenciosa (1 a 2 horas)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Termo de Garantia LUME de 2 anos</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Vi%20o%20exemplo%20da%20Janela%20de%20Sala%20(R$%20280%20-%20350)%20e%20gostaria%20de%20um%20or%C3%A7amento%20para%20minha%20casa.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl"
              >
                Orçar Janela no WhatsApp <ArrowRight size={16} />
              </a>
            </ScrollReveal>

            {/* Opção 2: Porta Balcão / Sacada */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/60 rounded-2xl p-7 border border-white/10 hover:border-[#c9a227]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Sparkles size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Varanda & Sacada</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Porta de Varanda</h3>
                <p className="text-gray-400 text-xs mb-6">Medida média estimada: ~2,00m x 2,10m (2 a 4 folhas de correr)</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-white">
                    R$ 580 ~ R$ 890
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Conforme a tecnologia (Refletiva ou Carbono)</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Opções <strong>Refletiva Suave</strong> ou <strong>Dupla Camada</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Barreira máxima contra o sol poente da tarde</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Privacidade diurna total com relação aos prédios vizinhos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Proteção completa para o piso e cortinas da sala</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20Porta%20de%20Varanda%20da%20minha%20sala.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-[#c9a227] text-white hover:text-[#c9a227]"
              >
                Orçar Porta no WhatsApp <ArrowRight size={16} />
              </a>
            </ScrollReveal>

            {/* Opção 3: Nano Cerâmica (M² ou Alta Performance) */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/60 rounded-2xl p-7 border border-white/10 hover:border-[#c9a227]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Star size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Linha Elite Arquitetura</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Nano Cerâmica Clara</h3>
                <p className="text-gray-400 text-xs mb-6">Para quem deseja rejeição térmica sem escurecer o vidro</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">A partir de</div>
                  <div className="text-3xl font-black font-montserrat text-white">
                    R$ 130 ~ R$ 180 <span className="text-base font-normal text-gray-400">/ m²</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Alta rejeição de calor com transparência natural</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Não altera a cor da fachada do condomínio</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Preserva 100% da vista panorâmica e horizonte</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Bloqueia até 82% do calor infravermelho real</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Aprovado para coberturas e edifícios de alto padrão</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Quero%20um%20or%C3%A7amento%20de%20Nano%20Cer%C3%A2mica%20para%20as%20janelas%20da%20minha%20sala.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-[#c9a227] text-white hover:text-[#c9a227]"
              >
                Orçar Nano Cerâmica <ArrowRight size={16} />
              </a>
            </ScrollReveal>
          </div>

          <div className="mt-12 text-center text-xs text-gray-400 max-w-2xl mx-auto">
            * Os valores acima são estimativas de referência para o Rio de Janeiro com material e aplicação profissional. O valor final varia conforme as medidas exatas, altura das esquadrias e necessidade de remoção de películas antigas. Envie fotos pelo WhatsApp para orçamento na hora!
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
                Guia de Escolha
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">
              Qual a película ideal para a sua <span className="text-gradient-gold">sala</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
              Compare as principais tecnologias LUME recomendadas para salas residenciais e selecione o equilíbrio perfeito entre claridade, calor e privacidade.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Nano Cerâmica */}
            <ScrollReveal animation="slide-up" className="product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-2xl p-6 lg:p-8 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative h-48 overflow-hidden rounded-xl mb-6 -mx-2 -mt-2">
                <Image
                  src="/product-nano-ceramica.webp"
                  alt="Película Nano Cerâmica para Sala - LUME"
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070f1a]/95 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-[#c9a227] text-[#04080f] text-xs font-bold uppercase rounded-full">
                  Recomendado para Vista Panorâmica
                </div>
              </div>

              <div className="mb-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-2xl font-bold font-montserrat text-white">Nano Cerâmica</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed min-h-[70px]">
                  Bloqueio térmico máximo sem escurecer o vidro. Ideal para quem valoriza a luz natural da sala e não quer alterar a fachada.
                </p>
              </div>

              <div className="space-y-4 mb-8 bg-white/5 p-4 rounded-xl text-sm z-10 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Redução de Calor</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Redução de Luz</span>
                  <LevelDots level={1} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Privacidade Diurna</span>
                  <LevelDots level={1} />
                </div>
              </div>

              <a href="/nano-ceramica/" className="w-full btn-outline py-3 text-sm text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto z-10">
                Ver detalhes da Nano Cerâmica
              </a>
            </ScrollReveal>

            {/* Carbono G20 */}
            <ScrollReveal animation="slide-up" className="product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-2xl p-6 lg:p-8 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative h-48 overflow-hidden rounded-xl mb-6 -mx-2 -mt-2">
                <Image
                  src="/product-carbono.webp"
                  alt="Película Carbono para Sala - LUME"
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070f1a]/95 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-[#c9a227] text-[#04080f] text-xs font-bold uppercase rounded-full">
                  Melhor Custo-Benefício
                </div>
              </div>

              <div className="mb-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Tv className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-2xl font-bold font-montserrat text-white">Carbono G20</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed min-h-[70px]">
                  Tonalidade grafite elegante que reduz o brilho excessivo na TV e traz privacidade suave sem transformar a sala em um ambiente escuro.
                </p>
              </div>

              <div className="space-y-4 mb-8 bg-white/5 p-4 rounded-xl text-sm z-10 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Redução de Calor</span>
                  <LevelDots level={3} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Redução de Luz</span>
                  <LevelDots level={3} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Privacidade Diurna</span>
                  <LevelDots level={3} />
                </div>
              </div>

              <a href="/carbono/" className="w-full btn-outline py-3 text-sm text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto z-10">
                Ver detalhes do Carbono
              </a>
            </ScrollReveal>

            {/* Refletiva / Espelhada */}
            <ScrollReveal animation="slide-up" className="product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-2xl p-6 lg:p-8 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative h-48 overflow-hidden rounded-xl mb-6 -mx-2 -mt-2">
                <Image
                  src="/product-refletiva.webp"
                  alt="Película Refletiva para Sala - LUME"
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070f1a]/95 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-white text-[#04080f] text-xs font-bold uppercase rounded-full">
                  Sol Agressivo da Tarde
                </div>
              </div>

              <div className="mb-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-2xl font-bold font-montserrat text-white">Refletiva Metalizada</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed min-h-[70px]">
                  Cria efeito espelhado para quem olha de fora, rejeita radiação solar intensa e confere privacidade total durante todo o dia.
                </p>
              </div>

              <div className="space-y-4 mb-8 bg-white/5 p-4 rounded-xl text-sm z-10 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Redução de Calor</span>
                  <LevelDots level={4} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Redução de Luz</span>
                  <LevelDots level={2} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Privacidade Diurna</span>
                  <LevelDots level={5} />
                </div>
              </div>

              <a href="/refletiva/" className="w-full btn-outline py-3 text-sm text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto z-10">
                Ver detalhes da Refletiva
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Diferencial de Instalação Residencial */}
      <section className="py-24 relative px-4 border-y border-white/5 bg-[#0a1628]/30">
        <div className="container-lume max-w-5xl mx-auto">
          <ScrollReveal animation="slide-up" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-montserrat mb-4">
              O Padrão LUME: <span className="text-gradient-gold">Cuidado Cirúrgico com a sua Sala</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base">
              A sala é o cartão de visita da sua residência. Nossa equipe opera com padrões de etiqueta e limpeza de alto nível.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal animation="slide-up" className="bg-[#04080f] p-8 rounded-2xl border border-white/5 text-center hover:border-[#c9a227]/30 transition-all">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Proteção de Pisos e Móveis</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Utilizamos mantas impermeáveis para proteger tacos, porcelanatos e carpetes. Móveis e rodapés permanecem 100% protegidos contra respingos.
              </p>
            </ScrollReveal>
            
            <ScrollReveal animation="slide-up" className="bg-[#04080f] p-8 rounded-2xl border border-white/5 text-center hover:border-[#c9a227]/30 transition-all">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Corte Milimétrico e Acabamento</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Películas instaladas rente às borrachas das esquadrias, sem bolhas, sem rebarbas aparentes e com selagem perfeita para durar anos.
              </p>
            </ScrollReveal>
            
            <ScrollReveal animation="slide-up" className="bg-[#04080f] p-8 rounded-2xl border border-white/5 text-center hover:border-[#c9a227]/30 transition-all">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Pontualidade e Eficiência</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Horário marcado com precisão, atendimento rápido e conclusão do serviço em 2 a 3 horas, sem interromper o descanso ou a rotina da família.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Regiões Atendidas (GEO Local SEO) */}
      <section className="py-16 bg-[#04080f] px-4 border-b border-white/5">
        <div className="container-lume max-w-4xl mx-auto text-center">
          <ScrollReveal animation="slide-up">
            <h3 className="text-xl md:text-2xl font-bold font-montserrat text-white mb-4">
              Atendimento Residencial Especializado em Todo o Rio de Janeiro
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Instalamos insulfilm para salas em apartamentos e casas nos principais bairros cariocas:
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
                Tire suas Dúvidas
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-montserrat text-white mb-4">
              Perguntas Frequentes sobre <span className="text-[#c9a227]">Insulfilm para Sala</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Respostas claras sobre valores, claridade, reflexo na TV e instalação.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-in" className="space-y-4">
            {salaFaqs.map((faq, idx) => (
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
