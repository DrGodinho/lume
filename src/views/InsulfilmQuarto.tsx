'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Moon, 
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
  Check,
  HeartPulse,
  Wind
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
import { quartoFaqs } from '../content/quartoFaq';

const WHATSAPP_BASE = 'https://wa.me/5521965140612';

export function InsulfilmQuarto() {
  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-[#04080f] via-[#081528] to-[#04080f]" />
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
              { label: 'Insulfilm no Quarto' }
            ]}
          />

          <HeroEntrance className="mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_15px_rgba(201,162,39,0.15)] animate-hero">
              <Moon size={14} className="text-[#c9a227]" />
              Sono Profundo, Blackout Solar & Privacidade Absoluta
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight tracking-tight">
              <span className="inline-block word mr-2">Insulfilm</span>
              <span className="inline-block word mr-2">para</span>
              <span className="inline-block word mr-2">Quarto:</span>
              <span className="inline-block word mr-2 text-gradient-gold">Escuro</span>
              <span className="inline-block word mr-2 text-gradient-gold">Total</span>
              <span className="inline-block word mr-2">para</span>
              <span className="inline-block word mr-2">o</span>
              <span className="inline-block word mr-2">Melhor</span>
              <span className="inline-block word text-gradient-gold">Descanso</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 mx-auto mb-10 leading-relaxed font-light max-w-3xl animate-hero">
              Acorde quando quiser, e não quando o sol carioca mandar. Nossas películas de escurecimento bloqueiam até 99% da luz matinal e rejeitam o calor da tarde, criando o clima perfeito para produzir melatonina e dormir em paz. Janelas padrão <strong className="text-white font-medium">a partir de R$ 280 ~ R$ 350</strong> instaladas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-hero">
              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20o%20meu%20quarto!`}
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
              <Moon size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Até 99% Bloqueio de Luz (Blackout)</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Thermometer size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Até 82% Redução de Calor</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <HeartPulse size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Higiênico: Sem Ácaros de Cortinas</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-300 font-medium">
              <Shield size={18} className="text-[#c9a227] flex-shrink-0" />
              <span>Garantia de 2 Anos LUME</span>
            </div>
          </div>
        </div>
      </section>

      {/* Por que investir no Quarto: Saúde, Sono e Clima */}
      <section className="py-24 relative px-4 bg-[#0a1628]/20">
        <div className="container-lume max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <ScrollReveal animation="slide-up">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227]" />
                  <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-semibold">
                    Sono & Qualidade de Vida
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-montserrat mb-6 leading-tight">
                  Descanso verdadeiro exige <span className="text-gradient-gold">escuridão total e frescor</span>.
                </h2>
                <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base md:text-lg">
                  <p>
                    No Rio de Janeiro, o sol nasce cedo e bate com violência nas janelas voltadas para o leste. Para quem precisa dormir até mais tarde, trabalha em turnos ou escalas noturnas (médicos, policiais, TI) ou tem bebês e crianças pequenas, essa claridade interrompe o ciclo do sono e bloqueia a produção de melatonina.
                  </p>
                  <p>
                    À tarde, os quartos voltados para o poente absorvem um calor brutal que fica retido até a madrugada. Com a película de escurecimento LUME, você cria uma barreira física dupla: <strong className="text-white font-medium">elimina a luz solar invasiva e barra o calor antes dele entrar no vidro</strong>.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                      <Wind size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Ideal para Alérgicos</h4>
                      <p className="text-xs text-gray-400">Sem tecidos que acumulam poeira e ácaros</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center text-[#c9a227]">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Quarto Resfria Mais Rápido</h4>
                      <p className="text-xs text-gray-400">Ar-condicionado atinge a temperatura em minutos</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Moon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Sono Reparador e Melatonina</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  O cérebro precisa de escuridão plena para atingir o sono profundo (estágio REM). Durma melhor e acorde revigorado.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Thermometer size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Quarto Ameno à Noite</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Elimine o calor irradiado pelo vidro que transforma o quarto em um forno abafado mesmo com janelas abertas.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Eye size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Privacidade Total 24h</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Troque de roupa e circule pelo quarto sem medo de vizinhos de prédios próximos ou pessoas na rua enxergarem o interior.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="slide-up" className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#c9a227]/40 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-4 text-[#c9a227]">
                  <Sun size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Proteção para Guarda-Roupas</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Evite que a luz solar direta desbote roupas, estrague colchões nobres ou degrade armários planejados.
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
                <AnimatedCounter target="99" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Bloqueio de Luz Visível (Blackout G5)</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="82" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Rejeição de Calor Solar Térmico</div>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-montserrat text-[#c9a227] mb-2">
                <AnimatedCounter target="99" suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">Bloqueio de Radiação UV Prejudicial</div>
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

      {/* SEÇÃO PRINCIPAL: EXEMPLOS REAIS DE PREÇOS PARA QUARTO */}
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
              Quanto custa colocar insulfilm <span className="text-gradient-gold">no quarto</span>?
            </h2>
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
              Veja exemplos reais de investimento para esquadrias residenciais típicas de quartos e suítes no Rio de Janeiro:
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Opção 1: Janela de Quarto 2 Folhas (O clássico em torno de R$ 300) */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/80 rounded-2xl p-7 border border-[#c9a227]/40 hover:border-[#c9a227] transition-all flex flex-col justify-between shadow-[0_0_30px_rgba(201,162,39,0.1)]">
              <div className="absolute -top-3 right-6 bg-[#c9a227] text-[#04080f] font-bold text-xs uppercase px-3 py-1 rounded-full shadow-md">
                Mais Solicitado
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Home size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Janela Padrão</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Janela de Quarto 2 Folhas</h3>
                <p className="text-gray-400 text-xs mb-6">Medida média estimada: ~1,20m x 1,20m (1,44 m²)</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-gradient-gold">
                    R$ 280 ~ R$ 350
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Material de escurecimento + Aplicação profissional</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Linha <strong>Carbono G5 Blackout</strong> ou <strong>Dupla Camada</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Bloqueia até 99% da claridade matinal incômoda</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Instalação rápida e silenciosa (cerca de 1 hora)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Garantia oficial LUME de 2 anos</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Vi%20o%20exemplo%20da%20Janela%20de%20Quarto%20(R$%20280%20-%20350)%20e%20gostaria%20de%20um%20or%C3%A7amento%20para%20meu%20quarto.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl"
              >
                Orçar Janela no WhatsApp <ArrowRight size={16} />
              </a>
            </ScrollReveal>

            {/* Opção 2: Porta de Sacada ou Janelão 4 Folhas */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/60 rounded-2xl p-7 border border-white/10 hover:border-[#c9a227]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Sparkles size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Suítes com Varanda</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Porta de Varanda da Suíte</h3>
                <p className="text-gray-400 text-xs mb-6">Medida média estimada: ~1,80m a 2,00m x 2,10m (de correr)</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-white">
                    R$ 490 ~ R$ 780
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Conforme a tecnologia e grau de escurecimento</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Opções <strong>Dupla Camada G5</strong> ou <strong>Carbono Grafite</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Corte maciço da radiação solar que superaquece a cama</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Privacidade total contra a visão de vizinhos de frente</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Proteção antialérgica: sem poeira de cortina pesada</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20Porta%20de%20Varanda%20da%20minha%20su%C3%ADte.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-[#c9a227] text-white hover:text-[#c9a227]"
              >
                Orçar Suíte no WhatsApp <ArrowRight size={16} />
              </a>
            </ScrollReveal>

            {/* Opção 3: Combo Suíte Completa */}
            <ScrollReveal animation="slide-up" className="product-card relative bg-[#0a1628]/60 rounded-2xl p-7 border border-white/10 hover:border-[#c9a227]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#c9a227]">
                  <Star size={18} />
                  <span className="text-xs uppercase tracking-wider font-semibold">Solução Completa</span>
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-white mb-2">Combo Suíte + Banheiro</h3>
                <p className="text-gray-400 text-xs mb-6">Janela do quarto + porta balcão + báscula jateada no banheiro</p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 mb-6">
                  <div className="text-xs text-gray-400 mb-1">Investimento médio completo</div>
                  <div className="text-3xl font-black font-montserrat text-white">
                    R$ 750 ~ R$ 1.150
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Pacote com desconto proporcional por conjunto</div>
                </div>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Quarto 100% escurecido e com temperatura amena</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Báscula do banheiro em <strong>película Jateada 24h</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Atendimento no mesmo dia para toda a suíte</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check size={16} className="text-[#c9a227] mt-0.5 flex-shrink-0" />
                    <span>Certificado de garantia único para todos os cômodos</span>
                  </div>
                </div>
              </div>

              <a
                href={`${WHATSAPP_BASE}?text=Ol%C3%A1!%20Gostaria%20de%20um%20or%C3%A7amento%20para%20o%20Combo%20Su%C3%ADte%20Completa.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-3.5 text-center text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-[#c9a227] text-white hover:text-[#c9a227]"
              >
                Orçar Combo no WhatsApp <ArrowRight size={16} />
              </a>
            </ScrollReveal>
          </div>

          <div className="mt-12 text-center text-xs text-gray-400 max-w-2xl mx-auto">
            * Valores de referência para aplicação residencial no Rio de Janeiro. A cotação final é ajustada de acordo com as medidas exatas e particularidades das janelas. Envie fotos da sua esquadria pelo WhatsApp para receber um orçamento detalhado sem compromisso.
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
                Guia de Escolha para Quartos
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">
              Nossas <span className="text-gradient-gold">Tecnologias</span> para o seu Quarto
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
              Compare as películas de alta performance indicadas para escurecimento, controle térmico e privacidade em dormitórios:
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Dupla Camada G5 */}
            <ScrollReveal animation="slide-up" className="product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-2xl p-8 lg:p-10 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative h-52 overflow-hidden rounded-xl mb-6 -mx-2 -mt-2">
                <Image
                  src="/cortinavsg5.webp"
                  alt="Película Dupla Camada G5 Blackout para Quarto - LUME"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070f1a]/95 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#c9a227] text-[#04080f] text-xs font-bold uppercase rounded-full">
                  O Mais Indicado para Escuridão
                </div>
              </div>

              <div className="mb-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-2xl font-bold font-montserrat text-white">Dupla Camada G5</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed min-h-[70px]">
                  A tecnologia definitiva para quem quer quarto totalmente escuro. Com apenas 5% de transmissão de luz, cria efeito noturno durante o dia, bloqueia 99% dos raios UV e rejeita até 80% do calor infravermelho.
                </p>
              </div>

              <div className="space-y-4 mb-8 bg-white/5 p-5 rounded-xl text-sm z-10 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Escurecimento (Redução de Luz)</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Rejeição de Calor Térmico</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Privacidade Diurna e Noturna</span>
                  <LevelDots level={5} />
                </div>
              </div>

              <a href="/dupla-camada/" className="w-full btn-outline py-3.5 text-sm text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto z-10">
                Conhecer a Dupla Camada
              </a>
            </ScrollReveal>

            {/* Carbono G5 */}
            <ScrollReveal animation="slide-up" className="product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-2xl p-8 lg:p-10 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative h-52 overflow-hidden rounded-xl mb-6 -mx-2 -mt-2">
                <Image
                  src="/product-carbono.webp"
                  alt="Película Carbono G5 para Quarto - LUME"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070f1a]/95 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white text-[#04080f] text-xs font-bold uppercase rounded-full">
                  Melhor Custo-Benefício
                </div>
              </div>

              <div className="mb-6 z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-[#c9a227]" />
                  <h3 className="text-2xl font-bold font-montserrat text-white">Carbono G5</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed min-h-[70px]">
                  Pigmentação pura de nanopartículas de carbono com acabamento grafite acetinado profundo. Não desbota, não fica arroxeada com o passar dos anos e garante excelente proteção térmica com visual moderno.
                </p>
              </div>

              <div className="space-y-4 mb-8 bg-white/5 p-5 rounded-xl text-sm z-10 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Escurecimento (Redução de Luz)</span>
                  <LevelDots level={4} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Rejeição de Calor Térmico</span>
                  <LevelDots level={4} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Privacidade Diurna e Noturna</span>
                  <LevelDots level={5} />
                </div>
              </div>

              <a href="/carbono/" className="w-full btn-outline py-3.5 text-sm text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto z-10">
                Conhecer a Linha Carbono
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Diferencial de Instalação no Quarto (Limpeza e Respeito) */}
      <section className="py-24 relative px-4 border-y border-white/5 bg-[#0a1628]/30">
        <div className="container-lume max-w-5xl mx-auto">
          <ScrollReveal animation="slide-up" className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-montserrat mb-4">
              Instalação Residencial LUME: <span className="text-gradient-gold">Respeito Total ao seu Quarto</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base">
              O quarto é o cômodo mais íntimo da residência. Nosso protocolo técnico garante proteção absoluta da sua cama, pisos e mobília.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal animation="slide-up" className="bg-[#04080f] p-8 rounded-2xl border border-white/5 text-center hover:border-[#c9a227]/30 transition-all">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Proteção de Cama e Mobília</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Cobrimos colchões, lençóis e mesas de cabeceira com mantas protetoras impermeáveis. Nenhum respingo de água atinge seus pertences.
              </p>
            </ScrollReveal>
            
            <ScrollReveal animation="slide-up" className="bg-[#04080f] p-8 rounded-2xl border border-white/5 text-center hover:border-[#c9a227]/30 transition-all">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Acabamento Sem Frestas de Luz</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                O corte das lâminas é feito rente às borrachas das esquadrias, evitando aqueles filetes de luz vazando pelas bordas que incomodam pela manhã.
              </p>
            </ScrollReveal>
            
            <ScrollReveal animation="slide-up" className="bg-[#04080f] p-8 rounded-2xl border border-white/5 text-center hover:border-[#c9a227]/30 transition-all">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Rápido e Sem Obra</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Instalação silenciosa de 1 a 2 horas. Você pode dormir tranquilamente no quarto na mesma noite sem cheiro de tinta ou poeira de obra.
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
              Instalação Profissional em Quartos e Suítes em Todo o Rio
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Levamos conforto térmico e blackout para residências nos principais bairros do Rio de Janeiro:
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
                Dúvidas sobre Dormitórios
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-montserrat text-white mb-4">
              Perguntas Frequentes sobre <span className="text-[#c9a227]">Insulfilm para Quarto</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Saiba como funciona o escurecimento, valores médios, garantia e comparação com cortinas blackout.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-in" className="space-y-4">
            {quartoFaqs.map((faq, idx) => (
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
