'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { ContactCTA } from '../sections/ContactCTA';
import { ArrowRight, Thermometer, Shield, CheckCircle, Moon, Clock, Power } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { GoogleReviews } from '../components/GoogleReviews';
import { Particles } from '../components/Particles';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';
import { LevelDots } from '../sections/SelectionGuide';

const faqs = [
  {
    q: "A película escurece totalmente o quarto?",
    a: "Sim! As películas Dupla Camada G5 e Carbono G5 bloqueiam entre 95% e 99% da luz visível. Com elas, você pode transformar o seu quarto em um ambiente completamente escuro, ideal para dormir até em horários diurnos ou durante o dia."
  },
  {
    q: "Posso usar ventilador ou ar-condicionado com a película aplicada?",
    a: "Com certeza. As películas de escurecimento não interfere em nenhum equipamento elétrico. Na verdade, ao reduzir a entrada de calor pelo vidro, seu ar-condicionado trabalha de forma muito mais eficiente, consumindo menos energia para resfriar o ambiente."
  },
  {
    q: "A película atrapalha na visão da TV ou leitura?",
    a: "Isso depende da sua preferência pessoal. Para quem gosta de assistir TV ou ler no quarto durante o dia, a Dupla Camada G20 (mais clara) pode ser uma opção intermediária. Porém, quem busca escuridão total para dormir, a Dupla Camada G5 ou Carbono G5 é a escolha ideal, pois criam o ambiente perfeito para o descanso."
  },
  {
    q: "Quanto tempo dura a instalação no quarto?",
    a: "Para um quarto padrão com 2 a 4 janelas, a instalação é realizada em aproximadamente 1 a 2 horas, de forma silenciosa e sem causar transtornos. O processo é limpo e não requer obras."
  }
];

export function InsulfilmQuarto() {
  useEffect(() => {
    gsap.fromTo('.page-entrance',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 }
    );
  }, []);

  return (
    <div className="bg-[#04080f] text-white min-h-screen">
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-[#04080f] to-[#040811]" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <Particles />

        <div className="container-lume relative z-10 page-entrance text-center max-w-4xl mx-auto">
          <NavigationBreadcrumbs 
            showVisualTrail={false}
            items={[
              { label: 'Início', href: '/' },
              { label: 'Quarto' }
            ]}
          />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_15px_rgba(201,162,39,0.2)]">
            Descanso e Privacidade
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight">
            Insulfilm para Quarto: <span className="text-gradient-gold">Escuro Total</span> para o Melhor Sono
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mx-auto mb-10 leading-relaxed font-light">
            A luz excessiva do sol matinal e o calor da tarde podem estragar seu descanso. Descubra como a película certa pode transformar seu quarto em um santuário de escuridão e frescor.
          </p>

          <a
            href="https://wa.me/5521965140612?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20quarto!"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-3 text-lg py-4 px-8 transform transition hover:scale-105"
          >
            Orçamento Grátis pelo WhatsApp <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Introdução e Por que investir */}
      <section className="py-24 relative px-4 border-t border-white/5 bg-[#0a1628]/20">
        <div className="container-lume max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="page-entrance">
              <h2 className="text-3xl lg:text-4xl font-bold font-montserrat mb-6">Descanso em <span className="text-[#c9a227]">escuridão total</span>.</h2>
              <div className="space-y-6 text-gray-400 leading-relaxed font-light text-lg">
                <p>
                  No Rio de Janeiro, o sol forte da manhã te faz acordar antes da hora, e o calor da tarde transforma o quarto em um forno. Quem trabalha em turnos noturnos, dorme durante o dia, ou simplesmente valoriza um sono de qualidade, sabe o quanto isso afeta o bem-estar.
                </p>
                <p>
                  As películas de escurecimento criam uma barreira completa: bloqueiam até 99% da luz visível e rejeitam o calor infravermelho, permitindo que você durma em total escuridão, em um ambiente fresco e confortável.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 page-entrance">
              <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-[#c9a227]/50 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-6">
                  <Moon className="text-[#c9a227]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Sono de Qualidade</h3>
                <p className="text-gray-400">
                  A escuridão completa estimula a produção de melatonina, o hormônio do sono. Você adormece mais rápido, dorme mais profundo e acorda muito mais descansado.
                </p>
              </div>
               
              <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-[#c9a227]/50 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-6">
                  <Thermometer className="text-[#c9a227]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Frescor para Descansar</h3>
                <p className="text-gray-400">
                  As películas escuras bloqueiam intensa radiação infravermelha, reduzindo drasticamente a temperatura do quarto, especialmente nas tardes de sol.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-[#c9a227]/10 border border-[#c9a227]/30 rounded-2xl p-8 page-entrance">
            <h4 className="text-xl font-bold text-[#c9a227] mb-3">💡 A importância da escuridão para a saúde</h4>
            <p className="text-gray-300">
              Pesquisas demonstram que dormir em ambiente iluminado pode interferir no ciclo circadiano, reduzir a produção de melatonina e afetar a qualidade do sono. Para quem trabalha em turnos, tem dificuldade em dormir durante o dia, ou simplesmente quer um sono profundamente restaurador, o escurecimento total é um investimento na sua saúde e qualidade de vida.
            </p>
          </div>
        </div>
      </section>

      {/* Soluções (Cards) */}
      <section className="py-24 bg-[#04080f] px-4">
        <div className="container-lume max-w-5xl mx-auto">
          <div className="text-center mb-16 page-entrance">
            <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">Nossas <span className="text-gradient-gold">Soluções</span> para Quartos</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Para quartos, oferecemos as películas de maior poder de escurecimento. Escolha a opção ideal para o seu perfil de descanso.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 page-entrance">
            {/* Dupla Camada G5 */}
            <div className="product-card group relative bg-gradient-to-b from-[#1a3a5c]/20 to-[#04080f] rounded-2xl p-8 lg:p-10 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c9a227] text-[#04080f] text-xs font-bold uppercase rounded-full mb-6">
                  Recomendado para Quartos
                </div>
                <h3 className="text-3xl font-bold mb-4 font-montserrat text-white">Dupla Camada G5</h3>
                <p className="text-gray-400 leading-relaxed min-h-[120px]">
                  A escolha definitiva para quem busca escuridão total. Com apenas 5% de transmissão de luz, esta película cria um ambiente noturno mesmo em plena luz do dia. Bloqueia 99% dos raios UV e rejeita até 80% do calor, além de oferecer privacidade total (efeito unidirecional).
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow bg-white/5 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Redução de Calor</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Redução de Luz</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Privacidade</span>
                  <LevelDots level={5} />
                </div>
              </div>
              
              <a href="/dupla-camada/" className="w-full btn-outline py-4 text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto">
                Ver detalhes técnicos
              </a>
            </div>

            {/* Carbono G5 */}
            <div className="product-card group relative bg-gradient-to-b from-[#1a3a5c]/20 to-[#04080f] rounded-2xl p-8 lg:p-10 border border-[#1a3a5c]/50 hover:border-white/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-[#04080f] text-xs font-bold uppercase rounded-full mb-6">
                  Melhor Custo-Benefício
                </div>
                <h3 className="text-3xl font-bold mb-4 font-montserrat text-white">Carbono G5</h3>
                <p className="text-gray-400 leading-relaxed min-h-[120px]">
                  A alternativa econômica com visual igualmente escuro. Seu acabamento fosco grafite proporciona escuridão intensa e visual sofisticado, além de excelente rejeição de calor e proteção UV. Ideal para quem quer máximo escurecimento com melhor custo-benefício.
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow bg-white/5 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Redução de Calor</span>
                  <LevelDots level={4} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Redução de Luz</span>
                  <LevelDots level={4} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Privacidade</span>
                  <LevelDots level={5} />
                </div>
              </div>
              
              <a href="/carbono/" className="w-full btn-outline py-4 text-center tracking-widest font-bold uppercase border border-white/30 text-white hover:bg-white hover:text-[#04080f] transition-all rounded-xl mt-auto">
                Ver detalhes técnicos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Diferencial Lume */}
      <section className="py-24 relative px-4 border-y border-white/5">
        <div className="container-lume max-w-5xl mx-auto page-entrance">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-montserrat mb-4">O Diferencial LUME: <span className="text-gradient-gold">Instalação Residencial Premium</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Seu quarto merece uma instalação impecável, sem sujeira e com resultado perfeito.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0a1628]/40 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Instalação Limpa</h3>
              <p className="text-gray-400 text-sm">
                Aplicamos a película com técnica que garante acabamento perfeito, sem bolhas, vincos ou imperfeições visíveis nas bordas.
              </p>
            </div>
            
            <div className="bg-[#0a1628]/40 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Power className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Análise Técnica</h3>
              <p className="text-gray-400 text-sm">
                Avaliamos a posição das janelas do seu quarto para indicar a melhor opção de película, considerando a entrada de luz natural e exposição solar.
              </p>
            </div>
            
            <div className="bg-[#0a1628]/40 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Garantia de 5 Anos</h3>
              <p className="text-gray-400 text-sm">
               Oferecemos garantia oficial de 5 anos na película e na instalação, garantindo que seu investimento dure por muitos anos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#04080f] px-4">
        <div className="container-lume max-w-3xl mx-auto page-entrance">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-montserrat mb-4">Dúvidas <span className="text-[#c9a227]">Frequentes</span></h2>
            <p className="text-gray-400">Esclareça suas principais dúvidas sobre películas para quartos.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group glass-card border border-white/5 flex-col rounded-xl overflow-hidden cursor-pointer bg-white/[0.01]">
                <summary className="font-bold text-lg p-6 hover:bg-white/[0.04] transition-colors outline-none flex justify-between items-center list-none text-white">
                  <span className="pr-4">{faq.q}</span>
                  <span className="text-[#c9a227] group-open:rotate-45 transition-transform text-2xl font-light leading-none flex-shrink-0">+</span>
                </summary>
                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-0 transition-all bg-black/20">
                  <div className="mt-4">{faq.a}</div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <GoogleReviews />
      <ContactCTA />
    </div>
  );
}