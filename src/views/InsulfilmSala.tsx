'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { ContactCTA } from '../sections/ContactCTA';
import { ArrowRight, Thermometer, Shield, CheckCircle, Star, Tv, Wallet, Home } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { GoogleReviews } from '../components/GoogleReviews';
import { Particles } from '../components/Particles';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';

const faqs = [
  {
    q: "A película realmente reduz o reflexo na TV?",
    a: "Sim! As películas de controle solar reduzem significativamente a entrada de luz direta e difusa, diminuindo o reflexo na tela da TV. Isso melhora muito a experiência de assistir filmes e séries, especialmente durante o dia. A Nano Cerâmica é especialmente indicada por manter a claridade sem criar reflexos indesejados."
  },
  {
    q: "Realmente economizo com ar-condicionado?",
    a: "Com certeza! Ao bloquear até 80% do calor solar, a película reduz a carga térmica no ambiente, fazendo o ar-condicionado trabalhar menos. Estudos indicam economia de até 30% na conta de energia, especialmente em salas com grandes janelas expostas ao sol."
  },
  {
    q: "A película protege os móveis da sala?",
    a: "Sim! A película bloqueia até 99% dos raios UV, que são os principais responsáveis pelo desbotamento de sofás, cortinas, tapetes e demais objetos de decoração. Seu investimento em móveis fica preservado por muito mais tempo."
  },
  {
    q: "Quanto tempo demora a instalação na sala?",
    a: "Para uma sala padrão com 3 a 5 janelas, a instalação é realizada em aproximadamente 2 a 3 horas, de forma silenciosa e limpa, sem causar transtornos à sua rotina."
  }
];

export function InsulfilmSala() {
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
            items={[
              { label: 'Início', href: '/' },
              { label: 'Insulfilm na Sala' }
            ]}
          />
          
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_15px_rgba(201,162,39,0.2)]">
            Conforto e Valorização
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight">
            Insulfilm para Sala: <span className="text-gradient-gold">Conforto Total</span> para sua Família
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mx-auto mb-10 leading-relaxed font-light">
            A sala é o coração da casa, mas o sol forte pode estragar sua experiência. Descubra como a película certa elimina reflexo na TV, reduz o gasto com ar-condicionado e valoriza seu imóvel.
          </p>

          <a
            href="https://wa.me/5521965140612?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20minha%20sala!"
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
              <h2 className="text-3xl lg:text-4xl font-bold font-montserrat mb-6">Privacidade inteligente <span className="text-[#c9a227]">sem obras</span>.</h2>
              <div className="space-y-6 text-gray-400 leading-relaxed font-light text-lg">
                <p>
                  O box de vidro do banheiro oferece modernidade, mas também expõe sua privacidade. Cortinas acumulam umidade e mofo, enquanto portas de correr ocupam espaço precioso. A película jateada resolve isso de forma elegante e permanente.
                </p>
                <p>
                  Com instalação rápida e limpa, a película transforma seu vidro transparente em uma superfície fosca e sofisticada, bloqueando completamente a visão externa enquanto mantém a passagem de luz natural.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 page-entrance">
              <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-[#c9a227]/50 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="text-[#c9a227]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Privacidade Total</h3>
                <p className="text-gray-400">
                  Quem está do lado de fora não enxerga nada. A película jateada cria uma barreira visual completa, garantindo intimidade total no seu banheiro sem a necessidade de cortinas ou persianas.
                </p>
              </div>
              
              <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-[#c9a227]/50 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-6">
                  <Droplets className="text-[#c9a227]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Resistente à Umidade</h3>
                <p className="text-gray-400">
                  Projetada para ambientes úmidos, a película jateada não sofre com o vapor do chuveiro, não desbota e não descola. Manutenção zero e durabilidade garantida por anos.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-[#c9a227]/10 border border-[#c9a227]/30 rounded-2xl p-8 page-entrance">
            <h4 className="text-xl font-bold text-[#c9a227] mb-3">💡 Por que escolher película jateada ao invés de vidro jateado?</h4>
            <p className="text-gray-300">
              O vidro jateado original é caro, exige troca completa do vidro e instalação complexa. A película jateada entrega o mesmo efeito visual por uma fração do custo, pode ser aplicada no vidro existente em menos de uma hora, e se precisar remover, o vidro volta ao estado original sem danos.
            </p>
          </div>
        </div>
      </section>

      {/* Solução Principal - Jateado */}
      <section className="py-24 bg-[#04080f] px-4">
        <div className="container-lume max-w-5xl mx-auto">
          <div className="text-center mb-16 page-entrance">
            <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">A Solução <span className="text-gradient-gold">Perfeita</span> para Banheiros</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Para banheiros, indicamos exclusivamente a película jateada. Ela foi projetada especificamente para atender às necessidades de privacidade, luminosidade e resistência à umidade desse ambiente.</p>
          </div>

          <div className="max-w-3xl mx-auto page-entrance">
            {/* Jateada - Card Principal */}
            <div className="product-card group relative bg-gradient-to-b from-[#1a3a5c]/20 to-[#04080f] rounded-2xl p-8 lg:p-10 border border-[#c9a227]/50 hover:border-[#c9a227] transition-all duration-500 flex flex-col h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/10 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c9a227] text-[#04080f] text-xs font-bold uppercase rounded-full mb-6">
                  Recomendado para Banheiros
                </div>
                <h3 className="text-3xl font-bold mb-4 font-montserrat text-white">Película Jateada</h3>
                <p className="text-gray-400 leading-relaxed">
                  A película jateada é a escolha ideal para banheiros. Ela simula o efeito do vidro trabalhado com jato de areia, criando uma superfície fosca e elegante que garante privacidade absoluta. Quem está fora não vê nada, mas a luz natural continua entrando, mantendo o banheiro claro e arejado.
                </p>
              </div>

              <div className="space-y-4 mb-10 bg-white/5 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Visibilidade</span>
                  <span className="text-[#c9a227] font-bold text-sm">Translúcida (Luz sim, Imagem não)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Privacidade</span>
                  <div className="flex gap-1 text-[#c9a227]"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Proteção UV</span>
                  <div className="flex gap-1 text-[#c9a227]"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Transmissão de Luz</span>
                  <div className="flex gap-1 text-[#c9a227]"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} className="text-gray-600" /></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Resistência à Umidade</span>
                  <div className="flex gap-1 text-[#c9a227]"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                </div>
              </div>

              <div className="bg-[#c9a227]/5 border border-[#c9a227]/20 rounded-xl p-6 mb-8">
                <h4 className="text-lg font-bold text-[#c9a227] mb-3">Ideal para:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2"><CheckCircle size={16} className="text-[#c9a227] mt-1 flex-shrink-0" /> Box de banheiro (porta e laterais de vidro)</li>
                  <li className="flex items-start gap-2"><CheckCircle size={16} className="text-[#c9a227] mt-1 flex-shrink-0" /> Janelas de banheiro com vista para vizinhos</li>
                  <li className="flex items-start gap-2"><CheckCircle size={16} className="text-[#c9a227] mt-1 flex-shrink-0" /> Portas de vidro de banheiros e lavabos</li>
                  <li className="flex items-start gap-2"><CheckCircle size={16} className="text-[#c9a227] mt-1 flex-shrink-0" /> Divisórias de vidro em áreas molhadas</li>
                </ul>
              </div>
              
              <a href="/jateado/" className="w-full btn-outline py-4 text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] hover:bg-[#c9a227] hover:text-[#04080f] transition-all rounded-xl mt-auto">
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
            <p className="text-gray-400 max-w-2xl mx-auto">Sabemos que o banheiro é um ambiente íntimo que exige respeito e cuidado. Nosso processo é adaptado para garantir uma experiência impecável.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0a1628]/40 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Instalação Limpa e Rápida</h3>
              <p className="text-gray-400 text-sm">
                Sem sujeira, sem poeira, sem obra. Aplicamos a película diretamente no vidro existente em menos de uma hora, sem alterar a estrutura do seu banheiro.
              </p>
            </div>
            
            <div className="bg-[#0a1628]/40 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Material de Alta Durabilidade</h3>
              <p className="text-gray-400 text-sm">
                Utilizamos películas jateadas premium que resistem ao vapor constante do chuveiro, não amarelam com o tempo e mantêm o acabamento fosco original por anos.
              </p>
            </div>
            
            <div className="bg-[#0a1628]/40 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Acabamento Perfeito</h3>
              <p className="text-gray-400 text-sm">
                Nossos técnicos são treinados para garantir recortes precisos e acabamento impecável nas bordas, com aspecto profissional e sofisticado.
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
            <p className="text-gray-400">Esclareça suas principais dúvidas sobre película jateada para banheiros.</p>
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
