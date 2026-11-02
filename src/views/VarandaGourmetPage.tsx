'use client';

import React from 'react';
import Image from 'next/image';
import {
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Sun,
  ChevronDown,
  ShieldCheck,
  Flame,
  Armchair
} from 'lucide-react';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';
import { HeroEntrance } from '../components/HeroEntrance';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { Particles } from '../components/Particles';
import { GoogleReviews } from '../components/GoogleReviews';
import { LevelDots } from '../sections/SelectionGuide';
import { ContactCTA } from '../sections/ContactCTA';

const WHATSAPP_URL = 'https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20minha%20varanda%20gourmet%20%2F%20cortina%20de%20vidro.';

interface VarandaGourmetPageProps {
  faqs: { q: string; a: string }[];
}

export function VarandaGourmetPage({ faqs }: VarandaGourmetPageProps) {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-28 overflow-hidden px-4">
        {/* Background Ambience */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/varanda_gourmet_hero_bg.webp"
            alt="Varanda gourmet de apartamento com cortina de vidro e insulfilm de alta performance térmica - LUME"
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
              { label: 'Varanda Gourmet' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_20px_rgba(201,162,39,0.15)] animate-hero">
              <Sun size={14} className="text-[#c9a227]" />
              Especialistas em Cortinas de Vidro & Sacadas Articuladas
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">para</span>
              <span className="inline-block word mr-2 text-gradient-gold">Varanda</span>
              <span className="inline-block word mr-2 text-gradient-gold">Gourmet</span>
              <span className="inline-block word mr-2">&</span>
              <span className="inline-block word mr-2">Sacadas</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-hero">
              Elimine o efeito estufa e o calor do sol poente na sua sacada envidraçada. <strong className="text-white font-semibold">Até 95% de corte térmico infravermelho</strong>, 100% de conformidade com regras de condomínio e preservação panorâmica da sua vista.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pedir Orçamento para Varanda Gourmet no WhatsApp"
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_10px_30px_rgba(201,162,39,0.25)]"
              >
                <MessageCircle size={20} />
                Pedir Orçamento com Medição Gratuita
              </a>
              <a
                href="#solucoes-varanda"
                className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-3 text-sm sm:text-base py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-wider"
              >
                Ver Películas Indicadas <ArrowRight size={18} />
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
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Rejeição de Calor Infravermelho</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-white mb-1">
                  <AnimatedCounter target="99" suffix=".9%" />
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Bloqueio de Raios UV-A / UV-B</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-[#c9a227] mb-1">
                  100%
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Aprovado por Condomínios</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-white mb-1">
                  Até 10 Anos
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Garantia Contratual</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Dores & Desafios da Varanda Envidraçada */}
      <section className="py-20 px-4 relative" id="desafios-varanda">
        <div className="container-lume max-w-5xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Problemas Reais da Cortina de Vidro
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Por Que Envidraçar a Varanda Sem Insulfilm Torna o Ambiente Inutilizável?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                O fechamento de sacada com painéis de vidro transparente cria uma armadilha térmica. Conheça as dores mais comuns e como a LUME resolve com engenharia de controle solar.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Flame size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">O 'Efeito Estufa' Insuportável</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Vidros comuns deixam o calor entrar, mas não o deixam sair. No sol poente do Rio de Janeiro, a varanda atinge facilmente mais de 40°C, sobrecarregando o ar-condicionado da sala.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Redução drástica da temperatura interna
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Armchair size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Móveis e Cortinas Destruídos</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    O sol direto desbota bancadas de madeira, sofás, poltronas de fibra sintética, queima plantas decorativas e resseca tecidos de cortinas em poucos meses de uso.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Filtro 99.9% de proteção ultravioleta
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Regras e Convenções do Condomínio</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    A maioria dos condomínios residenciais proíbe filmes espelhados ou que alterem a cor da fachada. Nossas películas <strong className="text-white">Nano Cerâmica Neutra</strong> são incolores por fora e 100% permitidas.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Zero risco de notificação ou multa
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Catálogo de Soluções Recomendadas para Varanda */}
      <section className="py-20 px-4 bg-[#0a111e]/30 relative" id="solucoes-varanda">
        <div className="container-lume max-w-6xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Engenharia Solar Aplicada
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Películas Indicadas para Varandas Gourmet & Sacadas
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Materiais nobres cortados sob medida para painéis móveis, trilhos articulados e portas de correr sem emperrar a abertura.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Nano Cerâmica Cristalina */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-[#c9a227]/40 bg-[#04080f]/90 p-8 flex flex-col justify-between relative shadow-[0_10px_30px_rgba(201,162,39,0.1)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a227] text-[#04080f] font-bold text-xs uppercase px-4 py-1 rounded-full shadow-lg">
                  Mais Recomendada
                </div>
                <div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Nano Cerâmica 75%</h3>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Máxima Rejeição de Calor & Transparência Total</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    A escolha número 1 para varandas com vista panorâmica. Bloqueia a energia do sol poente sem escurecer o ambiente e sem mudar a estética da fachada exigida pelo condomínio.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Corte Térmico (IR):</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Transparência da Vista:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Conformidade com Condomínio:</span>
                      <LevelDots level={5} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 220/m²</span> instalado
                  </div>
                  <a
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Tenho%20interesse%20na%20Nano%20Cer%C3%A2mica%20para%20minha%20varanda%20gourmet."
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
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Máxima Privacidade Diurna & Rejeição de Calor</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Ideal para varandas expostas a prédios vizinhos e sol intenso. O acabamento espelhado externo impede totalmente a visão de fora para dentro durante o dia e rebate a radiação solar antes que ela penetre no ambiente.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Calor:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Privacidade Diurna:</span>
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
                    A partir de <span className="text-[#c9a227]">R$ 110/m²</span> instalado
                  </div>
                  <a
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Tenho%20interesse%20na%20pel%C3%ADcula%20Refletiva%20para%20minha%20varanda%20gourmet."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227]"
                  >
                    <MessageCircle size={16} /> Cotar Película Refletiva
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: Carbono Elite */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-white/5 bg-[#04080f]/90 p-8 flex flex-col justify-between hover:border-[#c9a227]/30 transition-all">
                <div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Carbono Fumê G20/G35</h3>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Redução de Claridade & Tonalidade Grafite</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Para varandas com excesso de brilho solar que ofusca a TV ou a área da churrasqueira. Tonalidade grafite elegante que nunca desbota e reduz a fadiga ocular.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Corte Térmico:</span>
                      <LevelDots level={4} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Ofuscamento:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Garantia Sem Desbotar:</span>
                      <LevelDots level={5} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 90/m²</span> instalado
                  </div>
                  <a
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Tenho%20interesse%20no%20Carbono%20Fum%C3%AA%20para%20minha%20varanda."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227]"
                  >
                    <MessageCircle size={16} /> Cotar Carbono Fumê
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Tipos de Sistemas Envidraçados Atendidos */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="container-lume max-w-4xl mx-auto text-center">
          <ScrollReveal animation="slide-up">
            <h3 className="text-xl font-bold font-montserrat text-white mb-4">
              Instalação Especializada em Todos os Sistemas de Envidraçamento
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              Nossa aplicação respeita as folgas mecânicas das roldanas e vedações de silicone, garantindo deslizamento suave:
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 text-xs text-gray-300">
              {[
                'Cortinas de Vidro Retráteis (Reiki / Articulados)',
                'Portas de Correr Balcão (2, 3 e 4 folhas)',
                'Guarda-corpos de Vidro Laminado',
                'Janelas Maxim-ar e Basculantes',
                'Vidros Fixo-Pivotantes',
                'Espelhos de Varanda Gourmet',
                'Vidros com Vedação Escova e Silicone'
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

      {/* FAQs Específicas de Varanda Gourmet */}
      <section className="py-20 px-4 bg-[#0a111e]/40 border-t border-white/5" id="faqs-varanda">
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
                Perguntas Frequentes sobre Insulfilm para Varandas
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
