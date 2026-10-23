'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Eye, 
  Building2, 
  MessageCircle, 
  Sun,
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
      <section className="py-12 border-y border-white/5 bg-[#0a111e]/40 relative">
        <div className="container-lume">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-[#c9a227] mb-1">
                  <AnimatedCounter target="95" suffix="%" />
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Bloqueio de Calor Infravermelho</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-white mb-1">
                  75%
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Transparência Óptica Pura</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-[#c9a227] mb-1">
                  Zero
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Alteração de Fachada</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-white mb-1">
                  10 Anos
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Garantia Formal LUME</p>
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
                    <Sun size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Sol Poente sem Efeito Estufa</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Grandes painéis de vidro virados para o poente transformam o ambiente em uma estufa. Nossa <strong className="text-white">Nano Cerâmica</strong> filtra o calor radiante na fonte, aliviando o ar-condicionado em até 30%.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Redução drástica da temperatura
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Shield size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Conformidade Condominial</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Prédios na Vieira Souto e Prudente de Morais possuem regras rígidas contra espelhamento externo. Nossas películas respeitam 100% o padrão estético original do edifício.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Total aprovação em convenções
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Eye size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Design & Arte Protegidos</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Tapetes importados, marcenarias sob medida e telas de arte não sofrem mais com a descoloração. A barreira 99.9% anti-UV preserva as cores e texturas originais do projeto.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Proteção patrimonial contínua
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
              <div className="glass-card rounded-2xl border border-[#c9a227]/40 bg-[#04080f]/90 p-8 flex flex-col justify-between relative shadow-[0_10px_30px_rgba(201,162,39,0.1)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a227] text-[#04080f] font-bold text-xs uppercase px-4 py-1 rounded-full shadow-lg">
                  Escolha Nº 1 em Ipanema
                </div>
                <div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Nano Cerâmica 70%</h3>
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
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 220/m²</span> instalado
                  </div>
                  <a
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20Nano%20Cer%C3%A2mica%20para%20Ipanema."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                  >
                    <MessageCircle size={16} /> Cotar Nano Cerâmica
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Dupla Camada */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-white/5 bg-[#04080f]/90 p-8 flex flex-col justify-between hover:border-[#c9a227]/30 transition-all">
                <div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Dupla Camada</h3>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Conforto Visual & Visão Noturna Preservada</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Elimina o incômodo reflexo de espelho quando as luzes do apartamento estão acesas à noite. Ideal para salas de estar integradas e suítes com vista mar.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Calor:</span>
                      <LevelDots level={4} />
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
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 150/m²</span> instalado
                  </div>
                  <a
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20Dupla%20Camada%20para%20Ipanema."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227]"
                  >
                    <MessageCircle size={16} /> Cotar Dupla Camada
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: Jateado Decorativo */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-white/5 bg-[#04080f]/90 p-8 flex flex-col justify-between hover:border-[#c9a227]/30 transition-all">
                <div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Jateado Premium</h3>
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
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 120/m²</span> instalado
                  </div>
                  <a
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20Jateado%20para%20Ipanema."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227]"
                  >
                    <MessageCircle size={16} /> Cotar Jateado
                  </a>
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
