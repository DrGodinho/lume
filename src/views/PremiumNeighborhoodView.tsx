'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  Building2, 
  MessageCircle, 
  Sun,
  ChevronDown,
  ShieldCheck,
  ThermometerSnowflake,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  Award,
  Zap
} from 'lucide-react';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';
import { HeroEntrance } from '../components/HeroEntrance';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { Particles } from '../components/Particles';
import { GoogleReviews } from '../components/GoogleReviews';
import { LevelDots } from '../sections/SelectionGuide';
import { ContactCTA } from '../sections/ContactCTA';

export interface LocalPainPoint {
  title: string;
  problem: string;
  solution: string;
}

export interface RecommendedFilm {
  name: string;
  category: string;
  tag: string;
  highlight?: boolean;
  heatRejection: number; // 1-5 for LevelDots
  uvBlock: number;
  privacy: number;
  durability: string;
  idealFor: string;
  priceNote: string;
}

export interface NeighborhoodConfig {
  name: string;
  region: string;
  heroBadge: string;
  heroBg: string;
  heroTitleWords: string[];
  heroGoldIndices: number[]; // which indices are styled with text-gradient-gold
  subtitleBadge: string;
  description: string;
  whatsappUrl: string;
  stats: {
    target: string;
    suffix: string;
    label: string;
    sublabel: string;
  }[];
  localPainsTitle: string;
  localPainsSubtitle: string;
  localPains: LocalPainPoint[];
  recommendedFilms: RecommendedFilm[];
  coverageLocations: string[];
  faqs: { q: string; a: string }[];
}

interface Props {
  config: NeighborhoodConfig;
}

export function PremiumNeighborhoodView({ config }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-24 overflow-hidden px-4">
        {/* Background Ambience (padrão Página Principal) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={config.heroBg}
            alt={`Instalação de insulfilm residencial e comercial em ${config.name} - LUME`}
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04080f] to-transparent z-10" />
          <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#c9a227]/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#c9a227]/10 blur-3xl pointer-events-none" />
        </div>

        <Particles />

        <div className="container-lume relative z-10 text-center max-w-4xl mx-auto">
          <NavigationBreadcrumbs 
            showVisualTrail={false}
            items={[
              { label: 'Início', href: '/' },
              { label: 'Onde Atendemos', href: '/#onde-atendemos' },
              { label: config.name }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_20px_rgba(201,162,39,0.15)] animate-hero">
              <Building2 size={14} className="text-[#c9a227]" />
              {config.heroBadge}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              {config.heroTitleWords.map((word, idx) => (
                <span 
                  key={idx} 
                  className={`inline-block word mr-2 sm:mr-3 ${config.heroGoldIndices.includes(idx) ? 'text-gradient-gold' : ''}`}
                >
                  {word}
                </span>
              ))}
            </h1>

            <div className="flex items-center justify-center gap-4 mb-6 animate-hero">
              <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold text-center">
                {config.subtitleBadge}
              </span>
              <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-hero">
              {config.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={config.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto btn-primary inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_10px_30px_rgba(201,162,39,0.25)]"
              >
                <MessageCircle size={20} />
                Pedir Orçamento Gratuito no WhatsApp
              </a>
              <a
                href="#solucoes"
                className="w-full sm:w-auto btn-outline inline-flex items-center justify-center gap-2 text-sm sm:text-base py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-wider text-white"
              >
                Ver Películas Recomendadas
                <ArrowRight size={18} />
              </a>
            </div>
          </HeroEntrance>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="relative z-10 py-10 bg-[#0a111e]/90 border-y border-[#c9a227]/20 backdrop-blur-md">
        <div className="container-lume">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {config.stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-montserrat text-[#c9a227] mb-1">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-semibold text-white tracking-wide">{stat.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Challenges & Solutions */}
      <section className="relative py-20 px-4">
        <div className="container-lume max-w-5xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-14">
              <span className="text-[#c9a227] text-xs uppercase tracking-widest font-semibold block mb-2">
                {config.localPainsSubtitle}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-montserrat tracking-tight">
                {config.localPainsTitle}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.localPains.map((item, idx) => (
              <ScrollReveal key={idx} animation="slide-up">
                <div className="h-full bg-gradient-to-b from-[#0a111e] to-[#04080f] border border-white/10 hover:border-[#c9a227]/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group shadow-lg">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 border border-[#c9a227]/30 flex items-center justify-center text-[#c9a227] mb-5 group-hover:scale-110 transition-transform">
                      {idx === 0 && <Sun className="w-6 h-6" />}
                      {idx === 1 && <Eye className="w-6 h-6" />}
                      {idx === 2 && <ShieldCheck className="w-6 h-6" />}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 font-montserrat">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                      {item.problem}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#c9a227] block mb-1">
                      Solução LUME:
                    </span>
                    <p className="text-xs text-gray-300 leading-relaxed font-light">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products Grid */}
      <section id="solucoes" className="relative py-20 px-4 bg-[#0a111e]/40 border-t border-white/5">
        <div className="container-lume max-w-6xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-14">
              <span className="text-[#c9a227] text-xs uppercase tracking-widest font-semibold block mb-2">
                Linhas de Alta Tecnologia
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-montserrat tracking-tight">
                Películas Recomendadas para {config.name}
              </h2>
              <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mt-3">
                Seleção calibrada para o clima e a arquitetura da região. Aplicação limpa, sem cheiro e com certificado de garantia.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.recommendedFilms.map((film, index) => (
              <ScrollReveal key={index} animation="slide-up">
                <div className={`h-full relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  film.highlight 
                    ? 'bg-gradient-to-b from-[#121c2e] to-[#0a111e] border-2 border-[#c9a227] shadow-[0_0_30px_rgba(201,162,39,0.2)] -translate-y-1' 
                    : 'bg-[#0a111e]/80 border border-white/10 hover:border-white/20'
                }`}>
                  {film.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#c9a227] text-[#04080f] text-[10px] uppercase tracking-wider font-extrabold rounded-full shadow-md flex items-center gap-1">
                      <Sparkles size={12} />
                      Mais Escolhida
                    </div>
                  )}

                  <div>
                    <div className="text-[11px] font-semibold text-[#c9a227] uppercase tracking-wider mb-1">
                      {film.category}
                    </div>
                    <h3 className="text-xl font-bold text-white font-montserrat mb-2">
                      {film.name}
                    </h3>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 text-xs mb-4 font-mono">
                      {film.tag}
                    </div>

                    <div className="space-y-3 py-4 border-y border-white/5 text-xs">
                      <div>
                        <div className="flex justify-between text-gray-400 mb-1">
                          <span>Rejeição de Calor</span>
                          <span className="text-[#c9a227] font-semibold">{film.heatRejection}/5</span>
                        </div>
                        <LevelDots level={film.heatRejection} />
                      </div>
                      <div>
                        <div className="flex justify-between text-gray-400 mb-1">
                          <span>Bloqueio UV</span>
                          <span className="text-[#c9a227] font-semibold">{film.uvBlock}/5</span>
                        </div>
                        <LevelDots level={film.uvBlock} />
                      </div>
                      <div>
                        <div className="flex justify-between text-gray-400 mb-1">
                          <span>Privacidade Diurna</span>
                          <span className="text-[#c9a227] font-semibold">{film.privacy}/5</span>
                        </div>
                        <LevelDots level={film.privacy} />
                      </div>
                    </div>

                    <div className="my-4 space-y-1 text-xs">
                      <p className="text-gray-300">
                        <strong className="text-white">Garantia:</strong> {film.durability}
                      </p>
                      <p className="text-gray-400 line-clamp-2">
                        <strong className="text-white">Ideal para:</strong> {film.idealFor}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <span className="text-xs text-[#c9a227] font-semibold block mb-3">
                      {film.priceNote}
                    </span>
                    <a
                      href={`${config.whatsappUrl}%20Gostaria%20de%20saber%20mais%20sobre%20a%20pel%C3%ADcula%20${encodeURIComponent(film.name)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        film.highlight
                          ? 'bg-[#c9a227] text-[#04080f] hover:bg-[#d4b035]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Pedir Orçamento
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section className="relative py-20 px-4">
        <div className="container-lume max-w-5xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-14">
              <span className="text-[#c9a227] text-xs uppercase tracking-widest font-semibold block mb-2">
                Padrão de Excelência LUME
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-montserrat tracking-tight">
                Por que Instalar Conosco em {config.name}?
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                title: 'Atendimento Rápido',
                desc: 'Visita técnica e medição sem custo em qualquer condomínio ou rua de ' + config.name + '.',
              },
              {
                icon: Zap,
                title: 'Eficiência Energética',
                desc: 'Redução de até 8°C na incidência direta de calor, aliviando o uso do ar-condicionado e gerando economia real na conta de luz.',
              },
              {
                icon: ShieldCheck,
                title: 'Até 10 Anos de Garantia',
                desc: 'Películas de alta durabilidade com estabilidade de cor: não descascam e não ficam roxas.',
              },
              {
                icon: Award,
                title: 'Instalação Limpa',
                desc: 'Equipe especializada com proteção de pisos, sofás e cortinas durante toda a aplicação.',
              },
            ].map((d, i) => (
              <ScrollReveal key={i} animation="slide-up">
                <div className="p-6 rounded-2xl bg-[#0a111e]/60 border border-white/5 hover:border-[#c9a227]/30 transition-all text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227] mx-auto mb-4">
                    <d.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-2 font-montserrat">{d.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">{d.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hyper-local Coverage Areas */}
      <section className="relative py-16 px-4 bg-[#0a111e]/60 border-y border-white/5">
        <div className="container-lume max-w-5xl mx-auto text-center">
          <ScrollReveal animation="slide-up">
            <div className="inline-flex items-center gap-2 text-[#c9a227] text-xs font-semibold uppercase tracking-widest mb-3">
              <MapPin size={16} />
              Presença e Mobilidade Local
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-montserrat mb-4">
              Ruas, Avenidas e Condomínios Atendidos em {config.name}
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto mb-8 font-light">
              Nossa equipe técnica atende com agilidade e flexibilidade de horário, inclusive finais de semana e noites em condomínios residenciais e centros comerciais.
            </p>
          </ScrollReveal>

          <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
            {config.coverageLocations.map((loc, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:border-[#c9a227]/40 hover:text-white transition-colors"
              >
                <CheckCircle2 size={13} className="text-[#c9a227] flex-shrink-0" />
                {loc}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <GoogleReviews />

      {/* Interactive FAQ Section */}
      <section className="relative py-20 px-4">
        <div className="container-lume max-w-3xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-14">
              <span className="text-[#c9a227] text-xs uppercase tracking-widest font-semibold block mb-2">
                Tire Suas Dúvidas
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-montserrat tracking-tight">
                Perguntas Frequentes sobre Insulfilm em {config.name}
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {config.faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-[#0a111e]/80 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full py-5 px-6 text-left flex justify-between items-center gap-4 hover:bg-white/5 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-bold text-white font-montserrat">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-[#c9a227] flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-gray-300 leading-relaxed font-light border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Conversion CTA */}
      <ContactCTA />
    </div>
  );
}
