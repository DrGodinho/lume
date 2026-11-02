'use client';

import React from 'react';
import Image from 'next/image';
import {
  CheckCircle,
  ArrowRight,
  MessageCircle,
  ChevronDown,
  Sun,
  Thermometer,
  Zap,
  Sparkles,
} from 'lucide-react';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';
import { HeroEntrance } from '../components/HeroEntrance';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { Particles } from '../components/Particles';
import { GoogleReviews } from '../components/GoogleReviews';
import { LevelDots } from '../sections/SelectionGuide';
import { ContactCTA } from '../sections/ContactCTA';

const WHATSAPP_URL = 'https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20teto%20de%20vidro%20%2F%20clarab%C3%B3ia.';

interface TetoVidroPageProps {
  faqs: { q: string; a: string }[];
}

export function TetoVidroPage({ faqs }: TetoVidroPageProps) {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-28 overflow-hidden px-4">
        {/* Background Ambience */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/teto_vidro_hero_bg.webp"
            alt="Teto de vidro moderno e clarabóia panorâmica com película térmica de alta eficiência - LUME"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-35"
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
              { label: 'Soluções', href: '/#solucoes' },
              { label: 'Teto de Vidro' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_20px_rgba(201,162,39,0.15)] animate-hero">
              <Sun size={14} className="text-[#c9a227]" />
              Especialistas em Coberturas Zenitais, Clarabóias & Pergolados
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">para</span>
              <span className="inline-block word mr-2 text-gradient-gold">Teto</span>
              <span className="inline-block word mr-2 text-gradient-gold">de</span>
              <span className="inline-block word mr-2 text-gradient-gold">Vidro</span>
              <span className="inline-block word mr-2">&</span>
              <span className="inline-block word mr-2">Clarabóias</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-hero">
              Bloqueie a radiação solar vertical que sobreaquece sua casa. Redução de até <strong className="text-white font-semibold">-8°C na sensação térmica</strong>, até 97% de corte do calor infravermelho e alívio imediato no consumo de energia do ar-condicionado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pedir Orçamento para Teto de Vidro no WhatsApp"
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_10px_30px_rgba(201,162,39,0.25)]"
              >
                <MessageCircle size={20} />
                Pedir Orçamento com Estudo Térmico Gratuito
              </a>
              <a
                href="#solucoes-teto"
                className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-3 text-sm sm:text-base py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-wider"
              >
                Conhecer Soluções <ArrowRight size={18} />
              </a>
            </div>
          </HeroEntrance>
        </div>
      </section>

      {/* Estatísticas Térmicas para Coberturas */}
      <section className="py-12 border-y border-white/5 bg-[#0a111e]/40 relative">
        <div className="container-lume">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-[#c9a227] mb-1">
                  <AnimatedCounter target="8" suffix="°C" prefix="Até -" />
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Queda na Sensação Térmica</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-white mb-1">
                  <AnimatedCounter target="97" suffix="%" />
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Rejeição de Infravermelho (Calor)</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-[#c9a227] mb-1">
                  <AnimatedCounter target="99" suffix=".9%" />
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Bloqueio de Raios UV Nocivos</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-white mb-1">
                  Até 10 Anos
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Garantia Contra Delaminação</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Dores & Desafios Térmicos de Tetos de Vidro */}
      <section className="py-20 px-4 relative" id="desafios-teto">
        <div className="container-lume max-w-5xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  A Maior Carga Térmica da Residência
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Por Que o Teto de Vidro Esquenta Mais Que Qualquer Janela?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Ao contrário das janelas verticais, a cobertura de vidro recebe luz solar em ângulo perpendicular quase o dia todo. Sem tratamento adequado, a área abaixo se torna inutilizável.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Thermometer size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Insolação Zenital Direta</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    O sol atinge o topo do imóvel no zênite (entre 10h e 15h), gerando temperaturas que podem ultrapassar 50°C no vidro e irradiando calor constante para todo o interior da casa.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Barreira física contra radiação térmica
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Sobrecarga de Ar-Condicionado</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Mesmo com aparelhos split de alta potência ligados no máximo, o calor descendente anula o resfriamento, gerando contas de eletricidade altíssimas no verão carioca.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Economia de energia comprovada
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Risco de Trinca Térmica</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Películas escuras genéricas absorvem calor em excesso e dilatam o vidro de forma desigual, provocando trincas térmicas perigosas. Na LUME, usamos películas certificadas para vidro zenital.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Aplicação técnica segura sem risco ao vidro
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Catálogo de Soluções Recomendadas para Teto */}
      <section className="py-20 px-4 bg-[#0a111e]/30 relative" id="solucoes-teto">
        <div className="container-lume max-w-6xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Materiais de Alta Engenharia Zenital
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Películas de Alta Performance para Coberturas & Clarabóias
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Selecione o nível ideal entre visibilidade total do céu ou máxima rejeição de calor com tonalidades reflexivas.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Nano Cerâmica */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-[#c9a227]/40 bg-[#04080f]/90 p-8 flex flex-col justify-between relative shadow-[0_10px_30px_rgba(201,162,39,0.1)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a227] text-[#04080f] font-bold text-xs uppercase px-4 py-1 rounded-full shadow-lg">
                  Mais Tecnológica
                </div>
                <div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Nano Cerâmica</h3>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Céu Azul Nítido & Rejeição Térmica Extrema</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Para quem quer continuar vendo o céu e desfrutar da claridade natural sem a sensação de estar dentro de uma estufa. Nanopartículas absorvem o calor e deixam a luz agradável passar.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Corte de Infravermelho (Calor):</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Transparência do Céu:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Segurança Térmica do Vidro:</span>
                      <LevelDots level={5} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 220/m²</span> instalado
                  </div>
                  <a
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20da%20Nano%20Cer%C3%A2mica%20para%20teto%20de%20vidro."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                  >
                    <MessageCircle size={16} /> Cotar Nano Cerâmica
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Refletiva */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-white/5 bg-[#04080f]/90 p-8 flex flex-col justify-between hover:border-[#c9a227]/30 transition-all">
                <div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Refletiva</h3>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Máxima Rejeição Solar por Espelhamento</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    A melhor relação custo-benefício para locais onde o calor é intolerável e se deseja criar uma sombra fresca e confortável. O espelhamento externo rebate a luz antes de atravessar o vidro.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Rejeição Solar Total:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Claridade:</span>
                      <LevelDots level={3} />
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
                  <a
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20da%20pel%C3%ADcula%20Refletiva%20para%20teto%20de%20vidro."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227]"
                  >
                    <MessageCircle size={16} /> Cotar Linha Refletiva
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: Dupla Camada */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-white/5 bg-[#04080f]/90 p-8 flex flex-col justify-between hover:border-[#c9a227]/30 transition-all">
                <div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Dupla Camada</h3>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Elegância Sem Brilho Espelhado Excessivo</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Combina rejeição térmica com visual sóbrio fumê. Ideal para coberturas de madeira nobre e pergolados modernos que pedem um acabamento discreto e arquitetônico.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Corte Térmico:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Estética Arquitetônica:</span>
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
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20da%20Dupla%20Camada%20para%20teto%20de%20vidro."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227]"
                  >
                    <MessageCircle size={16} /> Cotar Dupla Camada
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Tipos de Coberturas Atendidas */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="container-lume max-w-4xl mx-auto text-center">
          <ScrollReveal animation="slide-up">
            <h3 className="text-xl font-bold font-montserrat text-white mb-4">
              Instalação Segura com Andaimes & Equipamentos Especializados
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              Trabalhamos com aplicação interna ou externa utilizando linhas de vida, andaimes modulares e proteção total do imóvel:
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 text-xs text-gray-300">
              {[
                'Clarabóias Residenciais e Comerciais',
                'Pergolados de Vidro em Áreas Gourmet',
                'Coberturas Retráteis e Basculantes',
                'Jardins de Inverno e Gazebos Envidraçados',
                'Domus e Lanternins de Iluminação Zenital',
                'Vidros Laminados e Temperados de Cobertura',
                'Passarelas e Túneis de Vidro'
              ].map((local, idx) => (
                <span key={idx} className="px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 font-medium">
                  {local}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Prova Social */}
      <GoogleReviews />

      {/* FAQs Técnicas de Teto de Vidro */}
      <section className="py-20 px-4 bg-[#0a111e]/40 border-t border-white/5" id="faqs-teto">
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
                Perguntas Frequentes sobre Insulfilm para Teto de Vidro
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
