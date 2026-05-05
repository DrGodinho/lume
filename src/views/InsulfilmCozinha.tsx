'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { ContactCTA } from '../sections/ContactCTA';
import { ArrowRight, Thermometer, Shield, CheckCircle, Star, SunDim, Clock } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { GoogleReviews } from '../components/GoogleReviews';
import { Particles } from '../components/Particles';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';

const faqs = [
  {
    q: "O vapor da cozinha pode descolar o insulfilm?",
    a: "Não. Quando a instalação é feita com materiais de qualidade e por profissionais, a película adere perfeitamente ao vidro e suporta as variações de umidade e vapor comuns do ambiente doméstico."
  },
  {
    q: "Como devo limpar as janelas com película na cozinha?",
    a: "A limpeza é simples: basta usar um pano macio e sabão neutro. Deve-se evitar produtos abrasivos, esponjas de aço ou limpa-vidros com amônia, que podem riscar ou comprometer a camada de proteção da película."
  },
  {
    q: "A película de nanocerâmica realmente não escurece nada?",
    a: "Existem diferentes graduações, mas as opções mais procuradas para cozinhas são quase imperceptíveis ao olho humano. Você ganha a proteção térmica de uma parede, mantendo a transparência total do vidro."
  },
  {
    q: "Quanto tempo demora a instalação?",
    a: "Para uma janela de cozinha padrão, o serviço costuma ser realizado em menos de duas horas, de forma silenciosa e sem causar transtornos à rotina da casa."
  }
];

export function InsulfilmCozinha() {
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
          {/* We'll use a gradient background to represent a premium look, similar to other product pages */}
          <div className="w-full h-full bg-gradient-to-br from-[#04080f] to-[#040811]" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <Particles />

        <div className="container-lume relative z-10 page-entrance text-center max-w-4xl mx-auto">
          <NavigationBreadcrumbs
            items={[
              { label: 'Início', href: '/' },
              { label: 'Insulfilm na Cozinha' }
            ]}
          />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_15px_rgba(201,162,39,0.2)]">
            Conforto e Proteção
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight">
            Insulfilm para Cozinha: <span className="text-gradient-gold">Conforto Térmico</span> para o Coração da sua Casa
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mx-auto mb-10 leading-relaxed font-light">
            A cozinha é o ambiente mais movimentado da casa, mas o sol do Rio de Janeiro transforma o prazer de cozinhar em um desafio. Descubra como a película certa pode proteger seus móveis e trazer conforto térmico instantâneo.
          </p>

          <a
            href="https://wa.me/5521965140612?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20minha%20cozinha!"
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
              <h2 className="text-3xl lg:text-4xl font-bold font-montserrat mb-6">Mais do que estética, uma necessidade <span className="text-[#c9a227]">estratégica</span>.</h2>
              <div className="space-y-6 text-gray-400 leading-relaxed font-light text-lg">
                <p>
                  No Rio de Janeiro, o calor excessivo que entra pela janela muitas vezes transforma a cozinha em uma estufa. Se somarmos o calor natural de fogões e fornos com o sol batendo na janela, o ambiente se torna insuportável.
                </p>
                <p>
                  As películas de controle solar atuam como uma verdadeira barreira térmica. Elas bloqueiam o calor infravermelho e os raios UV, permitindo que você aproveite a iluminação natural sem os efeitos colaterais da radiação solar direta.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 page-entrance">
              <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-[#c9a227]/50 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="text-[#c9a227]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Proteção da Marcenaria</h3>
                <p className="text-gray-400">
                  A incidência direta de sol acelera a degradação dos armários planejados e eletrodomésticos, causando desbotamento e amarelamento. Nossas películas bloqueiam até 99% dos raios UV, preservando seu investimento.
                </p>
              </div>
              
              <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-[#c9a227]/50 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-6">
                  <Thermometer className="text-[#c9a227]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Conforto Térmico no Preparo</h3>
                <p className="text-gray-400">
                  As películas de alta tecnologia reduzem drasticamente a entrada de calor, mantendo a cozinha com uma temperatura muito mais agradável e reduzindo a necessidade de ventiladores no máximo.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-[#c9a227]/10 border border-[#c9a227]/30 rounded-2xl p-8 page-entrance">
            <h4 className="text-xl font-bold text-[#c9a227] mb-3">⚠️ Por que não indicamos Películas Fumê na cozinha?</h4>
            <p className="text-gray-300">
              É muito comum recebermos pedidos de películas fumê (G5, G20) para cozinhas. Porém, na Lume, desaconselhamos essa escolha. A cozinha é um ambiente de trabalho que exige precisão, iluminação e segurança. Escurecer excessivamente o ambiente pode prejudicar a visibilidade no manuseio de alimentos e utensílios.
            </p>
          </div>
        </div>
      </section>

      {/* Soluções (Cards) */}
      <section className="py-24 bg-[#04080f] px-4">
        <div className="container-lume max-w-5xl mx-auto">
          <div className="text-center mb-16 page-entrance">
            <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">Nossas <span className="text-gradient-gold">Soluções</span> para Cozinhas</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Direcionamos nossos clientes para as melhores tecnologias que realmente performam bem nesse ambiente, aliando claridade, funcionalidade e design.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 page-entrance">
            {/* Nano Cerâmica */}
            <div className="product-card group relative bg-gradient-to-b from-[#1a3a5c]/20 to-[#04080f] rounded-2xl p-8 lg:p-10 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c9a227] text-[#04080f] text-xs font-bold uppercase rounded-full mb-6">
                  Alta Performance
                </div>
                <h3 className="text-3xl font-bold mb-4 font-montserrat text-white">Nano Cerâmica</h3>
                <p className="text-gray-400 leading-relaxed min-h-[120px]">
                  A escolha definitiva para quem não quer abrir mão da vista e da claridade. Utiliza nanotecnologia para filtrar o calor invisível sem precisar escurecer o vidro. Mantém a iluminação natural ideal para o manuseio de alimentos, oferecendo a máxima rejeição de calor do mercado.
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow bg-white/5 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Visibilidade</span>
                  <span className="text-[#c9a227] font-bold">Cristalina</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Rejeição de Calor</span>
                  <div className="flex gap-1 text-[#c9a227]"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Proteção UV</span>
                  <div className="flex gap-1 text-[#c9a227]"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Privacidade</span>
                  <div className="flex gap-1 text-[#c9a227] opacity-60"><Star size={16} fill="currentColor" /><Star size={16} className="text-gray-600" /><Star size={16} className="text-gray-600" /><Star size={16} className="text-gray-600" /><Star size={16} className="text-gray-600" /></div>
                </div>
              </div>
              
              <a href="/nano-ceramica/" className="w-full btn-outline py-4 text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto">
                Ver detalhes técnicos
              </a>
            </div>

            {/* Jateada */}
            <div className="product-card group relative bg-gradient-to-b from-[#1a3a5c]/20 to-[#04080f] rounded-2xl p-8 lg:p-10 border border-[#1a3a5c]/50 hover:border-white/50 transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-[#04080f] text-xs font-bold uppercase rounded-full mb-6">
                  Privacidade e Design
                </div>
                <h3 className="text-3xl font-bold mb-4 font-montserrat text-white">Película Jateada</h3>
                <p className="text-gray-400 leading-relaxed min-h-[120px]">
                  Excelente para cozinhas com janelas voltadas para áreas de serviço, corredores ou prédios vizinhos. Simula o efeito do vidro trabalhado com areia, garantindo total privacidade (quem está fora não vê nada) enquanto difunde a luz solar de forma suave, elegante e moderna.
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow bg-white/5 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Visibilidade</span>
                  <span className="text-white font-bold text-sm">Translúcida (Luz sim, Imagem não)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Rejeição de Calor</span>
                  <div className="flex gap-1 text-white"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} className="text-gray-600" /><Star size={16} className="text-gray-600" /><Star size={16} className="text-gray-600" /></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Proteção UV</span>
                  <div className="flex gap-1 text-white"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Privacidade</span>
                  <div className="flex gap-1 text-white"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                </div>
              </div>
              
              <a href="/jateado/" className="w-full btn-outline py-4 text-center tracking-widest font-bold uppercase border border-white/30 text-white hover:bg-white hover:text-[#04080f] transition-all rounded-xl mt-auto">
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
            <p className="text-gray-400 max-w-2xl mx-auto">Sabemos que a cozinha é um ambiente que exige higiene e cuidado redobrado. Por isso, nosso processo é adaptado para o máximo respeito ao seu lar.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0a1628]/40 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Instalação Limpa</h3>
              <p className="text-gray-400 text-sm">
                Técnicas que minimizam o uso de água, garantindo que seus móveis, bancadas e eletrodomésticos permaneçam perfeitamente secos e protegidos.
              </p>
            </div>
            
            <div className="bg-[#0a1628]/40 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <SunDim className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Análise Especializada</h3>
              <p className="text-gray-400 text-sm">
                Avaliamos a posição solar da sua janela para indicar a porcentagem ideal de proteção térmica, equilibrando redução de calor e passagem de luz.
              </p>
            </div>
            
            <div className="bg-[#0a1628]/40 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Durabilidade Garantida</h3>
              <p className="text-gray-400 text-sm">
                Trabalhamos apenas com materiais de padrão premium que resistem ao vapor e à rotina de limpeza pesada das cozinhas, sem descolar ou criar bolhas.
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
            <p className="text-gray-400">Esclareça suas principais dúvidas sobre películas em cozinhas residenciais.</p>
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
