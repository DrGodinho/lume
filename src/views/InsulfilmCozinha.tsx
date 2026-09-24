'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Thermometer, 
  Sun, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Home, 
  Tag, 
  Check,
  Layers,
  UtensilsCrossed,
  Refrigerator
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
import { cozinhaFaqs } from '../content/cozinhaFaq';

const WHATSAPP_BASE = 'https://wa.me/5521965140612';

export function InsulfilmCozinha() {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-[#04080f] via-[#081525] to-[#04080f]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#c9a227]/10 blur-[130px] rounded-full" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#1a3a5c]/25 blur-[110px] rounded-full" />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <Particles />

        <div className="container-lume relative z-10 text-center max-w-4xl mx-auto">
          <NavigationBreadcrumbs 
            showVisualTrail={false}
            items={[
              { label: 'Início', href: '/' },
              { label: 'Soluções por Cômodo', href: '/#produtos' },
              { label: 'Insulfilm na Cozinha' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_15px_rgba(201,162,39,0.15)] animate-hero">
              <UtensilsCrossed size={14} className="text-[#c9a227]" />
              Conforto Térmico ao Cozinhar & Divisórias Elegantes
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">para</span>
              <span className="inline-block word mr-2">Cozinha:</span>
              <span className="inline-block word mr-2 text-gradient-gold">Menos</span>
              <span className="inline-block word mr-2 text-gradient-gold">Calor</span>
              <span className="inline-block word mr-2">sem</span>
              <span className="inline-block word mr-2">Perder</span>
              <span className="inline-block word mr-2">a</span>
              <span className="inline-block word text-gradient-gold">Claridade</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 mx-auto mb-10 leading-relaxed font-light max-w-3xl animate-hero">
              Cozinhar não precisa ser uma prova de resistência ao calor. Nossas películas de Nano Cerâmica e Jateadas bloqueiam até 82% do calor solar, protegem armários e eletrodomésticos e isolam a lavanderia com sofisticação. Janelas e divisórias <strong className="text-white font-medium">a partir de R$ 280 ~ R$ 350</strong> no Rio de Janeiro.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20minha%20cozinha!`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_0_25px_rgba(201,162,39,0.3)] w-full sm:w-auto"
              >
                Pedir Orçamento pelo WhatsApp <ArrowRight size={20} />
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
              <Thermometer size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Até 82% Rejeição de Calor Solar</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Sun size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Transparência Máxima (Nano Cerâmica)</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Refrigerator size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Proteção de Eletros e Armários</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Shield size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Garantia de 2 Anos LUME</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dores & Desejos na Cozinha e Lavanderia */}
      <section className="py-24 relative px-4 bg-[#0a1628]/20">
        <div className="container-lume max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <ScrollReveal animation="slide-up">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
                  <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                    Conforto Térmico & Organização
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-montserrat mb-6 leading-tight">
                  Chega de preparar refeições em uma <span className="text-gradient-gold">cozinha abafada</span>.
                </h2>
                <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base md:text-lg">
                  <p>
                    A cozinha já é naturalmente o cômodo mais quente da residência devido ao calor do fogão, forno e eletrodomésticos. Quando o sol bate direto na janela ou na área de serviço integrada, a temperatura torna a rotina de cozinhar desgastante e faz a geladeira consumir muito mais energia.
                  </p>
                  <p>
                    Além do calor, apartamentos modernos possuem a lavanderia colada na cozinha. A aplicação da <strong className="text-white font-medium">película Nano Cerâmica</strong> nas janelas elimina a carga térmica solar, enquanto a <strong className="text-white font-medium">película Jateada</strong> na divisória esconde varais de roupas e utensílios sem bloquear a claridade.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                      <Refrigerator size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Geladeira Econômica</h4>
                      <p className="text-xs text-gray-400">Motor trabalha menos sem sol direto</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Resiste a Vapor e Gordura</h4>
                      <p className="text-xs text-gray-400">Limpeza fácil com água e detergente neutro</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Thermometer size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Alívio Térmico ao Cozinhar</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Corte de até 82% do calor infravermelho. Prepare pratos em um ambiente fresco e agradável mesmo ao meio-dia.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Layers size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Divisória de Lavanderia</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Oculte o varal de roupas e a máquina de lavar da vista de quem está na cozinha com acabamento jateado fosco.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Shield size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Proteção de Armários MDF</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Evite que a radiação UV empene portas planejadas, resseque borrachas de geladeiras e desbote acabamentos em inox.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Sun size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Claridade Intacta</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Iluminação natural 100% preservada para você cortar alimentos e manusear utensílios com segurança e visibilidade.
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
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Rejeição Térmica Infravermelha</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="99" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Bloqueio de Raios UV Destrutivos</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="85" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Luz Natural Preservada (Nano Cerâmica)</div>
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

      {/* SEÇÃO PRINCIPAL: EXEMPLOS REAIS DE PREÇOS PARA COZINHA */}
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
              Quanto custa colocar insulfilm <span className="text-gradient-gold">na cozinha</span>?
            </h2>
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
              Confira exemplos práticos de janelas e divisórias de vidro residenciais no Rio de Janeiro:
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Opção 1: Janela de Cozinha / Área (Em torno de R$ 300) */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/80 rounded-2xl p-7 border border-[#c9a227]/40 hover:border-[#c9a227] transition-all flex flex-col justify-between shadow-[0_0_30px_rgba(201,162,39,0.1)]">
              <div className="absolute -top-3 right-6 bg-[#c9a227] text-[#04080f] font-bold text-xs uppercase px-3 py-1 rounded-full shadow-md">
                Mais Pedido
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Home size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Janela de Cozinha</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Janela 2 a 3 Folhas</h3>
                <p className="text-gray-400 text-xs mb-6">Medida média estimada: ~1,20m x 1,20m na bancada ou pia</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-gradient-gold">
                    R$ 280 ~ R$ 350
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Película Térmica ou Fumê Suave com Instalação</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Linha <strong>Térmica Anti-Calor</strong> ou <strong>Fumê G20</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Corta a sensação de forno ao lado do fogão</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Protege bancadas de granito e armários aéreos</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Garantia oficial de 2 anos LUME</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Vi%20o%20exemplo%20da%20Janela%20de%20Cozinha%20(R$%20280%20-%20350)%20e%20gostaria%20de%20um%20or%C3%A7amento.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl"
              >
                Orçar Janela no WhatsApp <ArrowRight size={16} />
              </a>
            </ScrollReveal>

            {/* Opção 2: Divisória Cozinha / Lavanderia */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/60 rounded-2xl p-7 border border-white/10 hover:border-[#c9a227]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Layers size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Porta ou Painel</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Divisória de Lavanderia</h3>
                <p className="text-gray-400 text-xs mb-6">Medida média estimada: ~0,80m a 1,20m x 2,10m</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-white">
                    R$ 350 ~ R$ 520
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Película Jateada Opaca ou Faixas Decorativas</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Linha <strong>Jateada Translúcida</strong> de alto padrão</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Esconde roupas no varal e máquina de lavar</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Mantém a luz natural da área entrando na cozinha</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Aplicação limpa sem necessidade de furar paredes</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20Divis%C3%B3ria%20de%20Vidro%20Cozinha%20/%20Lavanderia.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-[#c9a227] text-white hover:text-[#c9a227]"
              >
                Orçar Divisória no WhatsApp <ArrowRight size={16} />
              </a>
            </ScrollReveal>

            {/* Opção 3: Combo Cozinha Gourmet Completa */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/60 rounded-2xl p-7 border border-white/10 hover:border-[#c9a227]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Star size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Cozinha Gourmet</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Combo Janela + Divisória</h3>
                <p className="text-gray-400 text-xs mb-6">Janela em Nano Cerâmica + Divisória de lavanderia em Jateado</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-white">
                    R$ 550 ~ R$ 780
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Conforto térmico no vidro externo + visual clean interno</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Vidro externo com até 82% de corte de calor</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Vidro interno 100% privativo e elegante</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Proteção total para eletrodomésticos em inox</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Conclusão em uma única visita sem atrapalhar a rotina</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20o%20Combo%20Cozinha%20Gourmet%20(Janela%20%2B%20Divis%C3%B3ria).`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-[#c9a227] text-white hover:text-[#c9a227]"
              >
                Orçar Combo Cozinha <ArrowRight size={16} />
              </a>
            </ScrollReveal>
          </div>

          <div className="mt-12 text-center text-xs text-gray-400 max-w-2xl mx-auto">
            * Valores de referência para o Rio de Janeiro com material de alta tecnologia e instalação profissional. Solicite uma cotação exata enviando fotos das janelas ou da divisória pelo WhatsApp.
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
                Guia Técnico para Cozinhas
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">
              A Tecnologia Certa para a sua <span className="text-gradient-gold">Cozinha</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
              Compare as duas opções mais instaladas em residências:
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Nano Cerâmica */}
            <ScrollReveal animation="slide-up" className="product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-2xl p-8 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative h-52 overflow-hidden rounded-xl mb-6 -mx-2 -mt-2">
                <Image
                  src="/product-nano-ceramica.webp"
                  alt="Película Nano Cerâmica para Cozinha - LUME"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070f1a]/95 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#c9a227] text-[#04080f] text-xs font-bold uppercase rounded-full">
                  Recomendado para Janela Externa
                </div>
              </div>

              <div className="mb-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-2xl font-bold font-montserrat text-white">Nano Cerâmica Clara</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed min-h-[70px]">
                  Barreira invisível contra o calor. Rejeita o sol forte sem escurecer o vidro, mantendo a cozinha perfeitamente iluminada para o preparo dos alimentos.
                </p>
              </div>

              <div className="space-y-4 mb-8 bg-white/5 p-5 rounded-xl text-sm z-10 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Rejeição de Calor Solar</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Passagem de Luz Natural</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Proteção UV para Armários</span>
                  <LevelDots level={5} />
                </div>
              </div>

              <a href="/nano-ceramica/" className="w-full btn-outline py-3.5 text-sm text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto z-10">
                Conhecer a Nano Cerâmica
              </a>
            </ScrollReveal>

            {/* Jateada para Divisórias */}
            <ScrollReveal animation="slide-up" className="product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-2xl p-8 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative h-52 overflow-hidden rounded-xl mb-6 -mx-2 -mt-2">
                <Image
                  src="/product-jateado-v2.webp"
                  alt="Película Jateada para Divisória de Cozinha - LUME"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070f1a]/95 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white text-[#04080f] text-xs font-bold uppercase rounded-full">
                  Ideal para Lavanderia
                </div>
              </div>

              <div className="mb-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-2xl font-bold font-montserrat text-white">Jateado Fosco Leitoso</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed min-h-[70px]">
                  Efeito fosco acetinado que esconde varais de roupas e áreas de serviço com total elegância, permitindo que a luz natural continue fluindo.
                </p>
              </div>

              <div className="space-y-4 mb-8 bg-white/5 p-5 rounded-xl text-sm z-10 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Privacidade da Lavanderia</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Passagem de Luz Natural</span>
                  <LevelDots level={4} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Facilidade de Limpeza</span>
                  <LevelDots level={5} />
                </div>
              </div>

              <a href="/jateado/" className="w-full btn-outline py-3.5 text-sm text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto z-10">
                Conhecer a Linha Jateada
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
              Instalação Residencial de Insulfilm para Cozinhas no RJ
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Levamos mais conforto térmico e elegância para cozinhas em todas as regiões:
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
              Perguntas Frequentes sobre <span className="text-[#c9a227]">Insulfilm na Cozinha</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Respostas sobre resistência ao calor do fogão, limpeza de gordura, divisórias e preços.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-in" className="space-y-4">
            {cozinhaFaqs.map((faq, idx) => (
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
