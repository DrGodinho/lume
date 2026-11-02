'use client';

import React from 'react';
import Image from 'next/image';
import {
  CheckCircle,
  ArrowRight,
  MessageCircle,
  ChevronDown,
  Shield,
  ShieldAlert,
  Hammer,
  Building,
  Zap,
  Lock
} from 'lucide-react';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';
import { HeroEntrance } from '../components/HeroEntrance';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { Particles } from '../components/Particles';
import { GoogleReviews } from '../components/GoogleReviews';
import { LevelDots } from '../sections/SelectionGuide';
import { ContactCTA } from '../sections/ContactCTA';

const WHATSAPP_URL = 'https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20de%20pel%C3%ADcula%20antivandalismo%20%2F%20seguran%C3%A7a%20para%20meu%20im%C3%B3vel.';

interface AntivandalismoPageProps {
  faqs: { q: string; a: string }[];
}

export function AntivandalismoPage({ faqs }: AntivandalismoPageProps) {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-28 overflow-hidden px-4">
        {/* Background Ambience */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/antivandalismo_hero_bg.webp"
            alt="Fachada de vidro de alto padrão com película antivandalismo de segurança - LUME"
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
              { label: 'Soluções', href: '/#solucoes' },
              { label: 'Película Antivandalismo' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_20px_rgba(201,162,39,0.15)] animate-hero">
              <Shield size={14} className="text-[#c9a227]" />
              Proteção Contra Impactos, Invasões & Quebra Acidental
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Película</span>
              <span className="inline-block word mr-2 text-gradient-gold">Antivandalismo</span>
              <span className="inline-block word mr-2">&</span>
              <span className="inline-block word mr-2">Segurança</span>
              <span className="inline-block word mr-2">RJ</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-hero">
              Transforme vidros comuns em barreiras resistentes a impactos, tentativas de arrombamento e tempestades. Linhas <strong className="text-white font-semibold">PS4, PS8 e PS12 (até 300 micras)</strong> com adesivo acrílico de alta tenacidade que retém 100% dos estilhaços.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pedir Orçamento de Película de Segurança no WhatsApp"
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 text-base sm:text-lg py-4 px-8 transform transition hover:scale-105 shadow-[0_10px_30px_rgba(201,162,39,0.25)]"
              >
                <MessageCircle size={20} />
                Pedir Orçamento com Avaliação Técnica
              </a>
              <a
                href="#comparativo-ps"
                className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-3 text-sm sm:text-base py-4 px-8 border border-white/20 hover:bg-white/5 transition-colors rounded-xl font-bold uppercase tracking-wider"
              >
                Comparar Linhas PS <ArrowRight size={18} />
              </a>
            </div>
          </HeroEntrance>
        </div>
      </section>

      {/* Estatísticas de Segurança */}
      <section className="py-12 border-y border-white/5 bg-[#0a111e]/40 relative">
        <div className="container-lume">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-[#c9a227] mb-1">
                  <AnimatedCounter target="300" suffix=" µm" />
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Espessura Máxima (PS12)</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-white mb-1">
                  100%
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Retenção de Estilhaços</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-[#c9a227] mb-1">
                  <AnimatedCounter target="4" suffix="x" />
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Mais Resistência Mecânica</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="stat-card p-4">
                <div className="text-3xl lg:text-4xl font-black font-montserrat text-white mb-1">
                  Até 10 Anos
                </div>
                <p className="text-xs lg:text-sm text-gray-400 font-medium">Garantia Certificada</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Riscos Reais & Dores que a Película Resolve */}
      <section className="py-20 px-4 relative" id="riscos-seguranca">
        <div className="container-lume max-w-5xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Segurança Passiva Indispensável
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                O Vidro é o Ponto Mais Vulnerável de Qualquer Imóvel
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Quando um vidro comum ou temperado quebra, ele se estilhaça em milhares de pedaços perigosos ou abre passagem imediata para invasores em menos de 3 segundos.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Hammer size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Invasão & Arrombamento</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Criminosos usam marretas, pedras ou pés-de-cabra buscando quebra rápida. A película antivandalismo absorve os impactos contínuos, mantendo a estrutura armada e impedindo o acesso físico.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Dificulta e atrasa invasores em minutos cruciais
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <ShieldAlert size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Acidentes com Crianças e Pets</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Colisões acidentais com portas balcão e guarda-corpos podem causar lacerações graves. A película segura 100% dos fragmentos cortantes colados à lâmina de poliéster mesmo após o choque.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Zero estilhaços voando no ambiente
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-up">
              <div className="glass-card p-8 rounded-2xl border border-white/5 bg-[#0a111e]/50 h-full flex flex-col justify-between hover:border-[#c9a227]/40 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#c9a227]/10 flex items-center justify-center mb-6 text-[#c9a227]">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">Tempestades & Rajadas de Vento</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Em andares altos no Rio de Janeiro, a pressão do vento e detritos trazidos por temporais geram microfraturas. A película confere elasticidade e resistência estrutural ao conjunto.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-[#c9a227] font-semibold">
                  <CheckCircle size={14} /> Proteção ativa contra intempéries
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Tabela Comparativa de Espessuras (PS4 vs PS8 vs PS12) */}
      <section className="py-20 px-4 bg-[#0a111e]/30 relative" id="comparativo-ps">
        <div className="container-lume max-w-6xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Escolha o Nível de Proteção Correto
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-montserrat mb-4">
                Linhas de Segurança: PS4, PS8 e PS12
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Disponíveis nas versões <strong>100% Incolor Cristalina</strong> (não altera em nada a aparência do vidro) ou combinadas com <strong>Controle Solar Térmico</strong>.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: PS4 */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-white/5 bg-[#04080f]/90 p-8 flex flex-col justify-between hover:border-[#c9a227]/30 transition-all">
                <div>
                  <div className="inline-block px-3 py-1 rounded-md bg-white/5 text-[#c9a227] font-bold text-xs uppercase mb-3">
                    100 Micras (4 Mil)
                  </div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Linha PS4</h3>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Proteção Contra Acidentes Domésticos</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Desenvolvida prioritariamente para ambientes internos e residenciais. Evita que o vidro se despedace em caso de quedas de pessoas, brinquedos ou impactos cotidianos.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Proteção Anti-Estilhaço:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Resistência a Impactos Leves:</span>
                      <LevelDots level={3} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Indicado Para:</span>
                      <span className="text-xs text-white font-medium">Box de banheiro, janelas e portas residenciais</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 110/m²</span> instalado
                  </div>
                  <a
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20da%20pel%C3%ADcula%20de%20seguran%C3%A7a%20PS4."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227]"
                  >
                    <MessageCircle size={16} /> Cotar Linha PS4
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: PS8 */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-[#c9a227]/40 bg-[#04080f]/90 p-8 flex flex-col justify-between relative shadow-[0_10px_30px_rgba(201,162,39,0.1)]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9a227] text-[#04080f] font-bold text-xs uppercase px-4 py-1 rounded-full shadow-lg">
                  Mais Vendida
                </div>
                <div>
                  <div className="inline-block px-3 py-1 rounded-md bg-[#c9a227]/20 text-[#c9a227] font-bold text-xs uppercase mb-3">
                    200 Micras (8 Mil)
                  </div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Linha PS8</h3>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Antivandalismo & Resistência Reforçada</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    A espessura de maior equilíbrio para apartamentos térreos, coberturas e lojas. Resiste a pedradas, chutes violentos e ferramentas manuais, retendo o painel firmemente no caixilho.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Proteção Anti-Estilhaço:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Resistência Antivandalismo:</span>
                      <LevelDots level={4} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Indicado Para:</span>
                      <span className="text-xs text-white font-medium">Sacadas, vitrines e casas em condomínio fechado</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 160/m²</span> instalado
                  </div>
                  <a
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20da%20pel%C3%ADcula%20antivandalismo%20PS8."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                  >
                    <MessageCircle size={16} /> Cotar Linha PS8
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: PS12 */}
            <ScrollReveal animation="slide-up">
              <div className="glass-card rounded-2xl border border-white/5 bg-[#04080f]/90 p-8 flex flex-col justify-between hover:border-[#c9a227]/30 transition-all">
                <div>
                  <div className="inline-block px-3 py-1 rounded-md bg-white/5 text-[#c9a227] font-bold text-xs uppercase mb-3">
                    300 Micras (12 Mil)
                  </div>
                  <h3 className="text-2xl font-black font-montserrat text-white mb-2">Linha PS12</h3>
                  <p className="text-[#c9a227] text-sm font-semibold mb-4">Blindagem de Segurança Pesada</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Máxima espessura em filme de segurança de poliéster multicamadas. Projetada para retardar tentativas severas de invasão com marretas, pés de cabra e ataques intencionais.
                  </p>
                  <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Resistência a Arrombamento:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Resistência ao Rasgamento:</span>
                      <LevelDots level={5} />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Indicado Para:</span>
                      <span className="text-xs text-white font-medium">Lojas de rua, farmácias, joalherias e clínicas</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white mb-4">
                    A partir de <span className="text-[#c9a227]">R$ 240/m²</span> instalado
                  </div>
                  <a
                    href="https://wa.me/5521965140612?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20da%20pel%C3%ADcula%20de%20seguran%C3%A7a%20PS12."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-white/20 hover:border-[#c9a227]"
                  >
                    <MessageCircle size={16} /> Cotar Linha PS12
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Aplicações Mais Comuns */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="container-lume max-w-4xl mx-auto text-center">
          <ScrollReveal animation="slide-up">
            <h3 className="text-xl font-bold font-montserrat text-white mb-4">
              Aplicações Estratégicas em Imóveis Residenciais e Comerciais
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              Atendemos todo o Rio de Janeiro com instalação limpa, silenciosa e com laudo de conformidade técnica:
            </p>
            <div className="flex flex-wrap justify-center gap-2.5 text-xs text-gray-300">
              {[
                'Vitrines e Fachadas Comerciais de Rua',
                'Portas Balcão e Portas de Acesso Residencial',
                'Casas em Condomínio e Mansões Térreas',
                'Sacadas Envidraçadas e Guarda-corpos',
                'Escolas, Creches e Universidades',
                'Clínicas Médicas e Consultórios Odontológicos',
                'Portarias de Edifícios Residenciais',
                'Boxes de Banheiro (Prevenção de Quebra Espontânea)'
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

      {/* FAQs Técnicas de Segurança */}
      <section className="py-20 px-4 bg-[#0a111e]/40 border-t border-white/5" id="faqs-antivandalismo">
        <div className="container-lume max-w-3xl mx-auto">
          <ScrollReveal animation="slide-up">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
                <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                  Tire Suas Dúvidas Técnicas
                </span>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-montserrat">
                Perguntas Frequentes sobre Películas Antivandalismo
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
