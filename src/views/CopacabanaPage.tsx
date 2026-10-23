'use client';

import React from 'react';
import Image from 'next/image';
import { 
  CheckCircle, 
  ArrowRight, 
  Eye, 
  Building2, 
  MessageCircle, 
  Waves,
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

const WHATSAPP_URL = 'https://wa.me/5521965140612?text=Ol%C3%A1!%20Sou%20de%20Copacabana%20e%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20im%C3%B3vel.';

interface CopacabanaPageProps {
  faqs: { q: string; a: string }[];
}

export function CopacabanaPage({ faqs }: CopacabanaPageProps) {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-28 overflow-hidden px-4">
        {/* Background Ambience */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/copacabana_hero_bg.webp"
            alt="Varanda envidraçada com insulfilm de alta performance em Copacabana - LUME"
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
              { label: 'Copacabana' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_20px_rgba(201,162,39,0.15)] animate-hero">
              <Building2 size={14} className="text-[#c9a227]" />
              Atendimento Premium em Toda a Orla de Copacabana & Leme
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">em</span>
              <span className="inline-block word mr-2 text-gradient-gold">Copacabana</span>
              <span className="inline-block word mr-2">RJ</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-hero">
              Películas de alta tecnologia para apartamentos na Av. Atlântica, Barata Ribeiro e ruas nobres. <strong className="text-white font-semibold">Até 95% de corte térmico</strong>, preservação total da vista da praia e resistência reforçada à maresia com garantia de até 10 anos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pedir Orçamento com Medição Gratuita no WhatsApp"
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_10px_30px_rgba(201,162,39,0.25)]"
              >
                <MessageCircle size={20} />
                Pedir Orçamento com Medição Gratuita
              </a>
              <a
                href="#solucoes-copacabana"
                className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-3 text-sm sm:text-base py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-wider"
              >
                Conhecer Películas <ArrowRight size={18} />
              </a>
            </div>
          </HeroEntrance>
        </div>
      </section>

      {/* Estatísticas e Diferenciais de Alto Ticket */}
      <section className="py-12 border-y border-white/5 bg-[#0a111e]/40 relative">
        <div className="container-lume">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-[#c9a227] mb-1">
                  <AnimatedCounter target="95" suffix="%" />
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Rejeição de Calor Solar</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-white mb-1">
                  <AnimatedCounter target="99" suffix=".9%" />
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Bloqueio dos Raios UV</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-[#c9a227] mb-1">
                  100%
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Resistente à Maresia</p>
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

      {/* Dores & Soluções Específicas de Copacabana */}
      <section className="py-20 px-4 relative" id="desafios-copacabana">
        <div className="container-lume max-w-5xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Especialistas na Orla de Copacabana
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Desafios Térmicos & Soluções para Apartamentos na Zona Sul
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Apartamentos em Copacabana enfrentam alta exposição à maresia, sol nascente ou poente implacável e prédios próximos que exigem privacidade estratégica.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Waves size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Maresia & Durabilidade</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Películas metalizadas baratas oxidam e criam manchas esbranquiçadas com o ar marinho. Nossa linha <strong className="text-white">Nano Cerâmica 100% Cerâmica Pura</strong> é isenta de metais, imune à corrosão salina.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Não oxida nem descasca
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Sun size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Proteja Móveis & Obras de Arte</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    O sol forte da orla deteriora assoalhos de madeira nobre, sofás de couro e tapetes. Filtramos <strong className="text-white">99.9% da radiação UV prejudicial</strong>, mantendo seu patrimônio protegido por anos.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Filtro UV-A e UV-B total
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Eye size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Privacidade sem Perder a Vista</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Desfrute da paisagem da praia sem vizinhos olhando para dentro da sua sala. A tecnologia nanoestruturada equilibra luz e privacidade sem criar efeito espelho escuro.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Vista panorâmica cristalina
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Catálogo de Soluções Recomendadas em Copacabana */}
      <section className="py-20 px-4 bg-[#0a111e]/30 relative" id="solucoes-copacabana">
        <div className="container-lume max-w-6xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Linhas Indicadas para Apartamentos e Coberturas
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Películas de Alta Performance para Copacabana
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Materiais originais de padrão internacional instalados por especialistas com corte milimétrico e acabamento impecável.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Nano Cerâmica */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-[#c9a227]/40 bg-[#04080f]/90 p-8 flex flex-col justify-between relative shadow-[0_10px_30px_rgba(201,162,39,0.1)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a227] text-[#04080f] font-bold text-xs uppercase px-4 py-1 rounded-full shadow-lg">
                  Mais Pedida na Orla
                </div>
                <div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Nano Cerâmica</h3>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Conforto Térmico Extremo & Vista Cristalina</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    A película de luxo por excelência. Bloqueia até 95% do calor do sol mantendo transparência quase total do vidro. Aprovada pela maioria das convenções de condomínio de Copacabana por não alterar a estética da fachada.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Calor:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Transparência Visual:</span>
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
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Tenho%20interesse%20na%20Nano%20Cer%C3%A2mica%20para%20meu%20im%C3%B3vel%20em%20Copacabana."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                  >
                    <MessageCircle size={16} /> Cotar Nano Cerâmica
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Carbono Elite */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-white/5 bg-[#04080f]/90 p-8 flex flex-col justify-between hover:border-[#c9a227]/30 transition-all">
                <div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Carbono Elite</h3>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Privacidade & Tom Grafite Profundo</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Ideal para quartos e salas com vista devassada. Bloqueia a visão externa durante o dia e reduz o ofuscamento solar na TV e telas de trabalho, sem nunca desbotar para a cor roxa.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Calor:</span>
                      <LevelDots level={4} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Privacidade Diurna:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Brilho:</span>
                      <LevelDots level={5} />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 90/m²</span> instalado
                  </div>
                  <a
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Tenho%20interesse%20no%20Carbono%20Elite%20para%20meu%20im%C3%B3vel%20em%20Copacabana."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227]"
                  >
                    <MessageCircle size={16} /> Cotar Carbono Elite
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: Dupla Camada */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-white/5 bg-[#04080f]/90 p-8 flex flex-col justify-between hover:border-[#c9a227]/30 transition-all">
                <div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Dupla Camada</h3>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Sem Efeito Espelho Interno à Noite</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Desenvolvida especialmente para resolver a queixa de vidros que viram espelhos quando as luzes internas são acesas à noite. Permite continuar contemplando o mar e a praia iluminada à noite.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Redução de Calor:</span>
                      <LevelDots level={4} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Visão Noturna Relaxada:</span>
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
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Tenho%20interesse%20na%20Dupla%20Camada%20para%20meu%20im%C3%B3vel%20em%20Copacabana."
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

      {/* Ruas e Condomínios Atendidos em Copacabana */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="container-lume max-w-4xl mx-auto text-center">
          <ScrollReveal animation="slide-up">
            <h3 className="text-xl font-bold font-montserrat text-white mb-4">
              Atendimento com Medição Gratuita em Todas as Regiões de Copacabana
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              Nossa equipe técnica atende com pontualidade e discrição em apartamentos e edifícios icônicos:
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-300">
              {[
                'Avenida Atlântica (Postos 2 ao 6)',
                'Avenida Nossa Senhora de Copacabana',
                'Rua Barata Ribeiro',
                'Rua Domingos Ferreira',
                'Rua Santa Clara',
                'Rua Figueiredo de Magalhães',
                'Rua Siqueira Campos',
                'Rua Constante Ramos',
                'Rua Bolívar',
                'Rua Xavier da Silveira',
                'Rua Miguel Lemos',
                'Rua Djalma Ulrich',
                'Rua Francisco Sá',
                'Rua Raul Pompéia',
                'Leme & Morro da Babilônia'
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

      {/* FAQs Específicas de Copacabana */}
      <section className="py-20 px-4 bg-[#0a111e]/40 border-t border-white/5" id="faqs-copacabana">
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
                Perguntas Frequentes sobre Insulfilm em Copacabana
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
