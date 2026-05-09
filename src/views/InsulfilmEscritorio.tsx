'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ContactCTA } from '../sections/ContactCTA';
import { ArrowRight, Thermometer, Shield, CheckCircle, Star, Monitor, Clock, Eye, Zap } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { GoogleReviews } from '../components/GoogleReviews';
import { Particles } from '../components/Particles';
import { NavigationBreadcrumbs } from '../components/NavigationBreadcrumbs';
import { LevelDots } from '../sections/SelectionGuide';

const faqs = [
  {
    q: "A película atrapalha a visibilidade da tela do computador?",
    a: "Pelo contrário. Um dos maiores vilões da produtividade é o glare — aquele reflexo intenso do sol na tela que obriga você a forçar a vista ou mudar a posição do monitor. As películas de controle solar eliminam esse problema, criando uma iluminação uniforme e confortável no ambiente sem a necessidade de fechar cortinas e perder a vista externa."
  },
  {
    q: "A película jateada funciona em divisórias de vidro internas?",
    a: "Sim, é justamente uma das aplicações mais procuradas para escritórios. A película jateada aplicada em divisórias de vidro garante privacidade visual entre salas de reunião, áreas de trabalho e recepção, mantendo a sensação de amplitude e a passagem de luz difusa. É uma solução elegante e muito mais econômica do que trocar o vidro por um modelo fosco de fábrica."
  },
  {
    q: "Quanto tempo dura a película em um escritório com ar-condicionado?",
    a: "O ar-condicionado, na verdade, é um aliado da película. Ambientes climatizados não sofrem com as variações extremas de temperatura que aceleram o desgaste do material. Em escritórios, a durabilidade das películas premium LUME é ainda maior do que em ambientes sem climatização, mantendo a performance por muitos anos com garantia certificada."
  },
  {
    q: "É possível aplicar em grandes panos de vidro (fachadas)?",
    a: "Sim. Trabalhamos com películas certificadas para vidros de grande porte, incluindo vidros temperados e laminados comuns em fachadas comerciais. Para projetos maiores, realizamos uma análise técnica do tipo de vidro, orientação solar e carga térmica para indicar a película com a melhor relação custo-benefício e segurança estrutural."
  }
];

export function InsulfilmEscritorio() {
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
              { label: 'Escritório' }
            ]}
          />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-6 font-semibold uppercase tracking-wider text-[#c9a227] text-xs md:text-sm shadow-[0_0_15px_rgba(201,162,39,0.2)]">
            Produtividade e Conforto
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-montserrat mb-6 leading-tight">
            Insulfilm para Escritório: <span className="text-gradient-gold">Produtividade</span> sem o Calor Atrapalhar
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mx-auto mb-10 leading-relaxed font-light">
            O sol forte do Rio de Janeiro transforma escritórios em estufas, causa glare nas telas e eleva a conta de energia. Descubra como a película certa cria o ambiente ideal para trabalhar com foco e conforto.
          </p>

          <a
            href="https://wa.me/5521965140612?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20de%20insulfilm%20para%20meu%20escrit%C3%B3rio!"
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
              <h2 className="text-3xl lg:text-4xl font-bold font-montserrat mb-6">O escritório é onde seu <span className="text-[#c9a227]">dinheiro é gerado</span>. Proteja-o.</h2>
              <div className="space-y-6 text-gray-400 leading-relaxed font-light text-lg">
                <p>
                  Seja um home office, um consultório, uma sala comercial ou um coworking, o ambiente de trabalho precisa ser funcional. Quando o sol incide diretamente nas janelas, ele cria três problemas simultâneos: calor excessivo que gera sonolência, reflexo nas telas que prejudica a visão e degradação acelerada de móveis e equipamentos.
                </p>
                <p>
                  Investir em película de controle solar para o escritório não é um gasto — é uma decisão estratégica que impacta diretamente na produtividade da equipe, na economia de energia e na preservação do patrimônio.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 page-entrance">
              <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-[#c9a227]/50 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-6">
                  <Monitor className="text-[#c9a227]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Eliminação do Glare</h3>
                <p className="text-gray-400">
                  O reflexo solar na tela do computador é o maior inimigo da produtividade. Nossas películas filtram a luz direta e criam uma iluminação uniforme, eliminando a necessidade de fechar cortinas e trabalhar no escuro.
                </p>
              </div>
              
              <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-[#c9a227]/50 transition-colors">
                <div className="w-12 h-12 bg-[#c9a227]/10 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="text-[#c9a227]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Economia de Energia</h3>
                <p className="text-gray-400">
                  Escritórios com grandes panos de vidro sofrem com carga térmica elevada. Ao reduzir a entrada de calor solar em até 80%, o ar-condicionado trabalha menos, gerando economia significativa na conta de luz — especialmente no verão carioca.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-[#c9a227]/10 border border-[#c9a227]/30 rounded-2xl p-8 page-entrance">
            <h4 className="text-xl font-bold text-[#c9a227] mb-3">💡 Home Office: atenção redobrada</h4>
            <p className="text-gray-300">
              Se você trabalha de casa, o conforto do seu escritório impacta diretamente na sua saúde e rendimento. Dores de cabeça, cansaço visual e fadiga frequente podem ser sintomas de um ambiente com iluminação solar descontrolada. A película certa resolve esses problemas sem reformas ou obras.
            </p>
          </div>
        </div>
      </section>

      {/* Soluções (Cards) */}
      <section className="py-24 bg-[#04080f] px-4">
        <div className="container-lume max-w-5xl mx-auto">
          <div className="text-center mb-16 page-entrance">
            <h2 className="text-3xl lg:text-5xl font-black font-montserrat mb-6 tracking-tight">Nossas <span className="text-gradient-gold">Soluções</span> para Escritórios</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Cada escritório tem suas particularidades. Selecionamos as tecnologias que melhor performam nesse tipo de ambiente, equilibrando claridade, conforto e funcionalidade.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 page-entrance">
            {/* Nano Cerâmica */}
            <a href="/nano-ceramica/" className="product-card group relative bg-gradient-to-b from-[#1a3a5c]/20 to-[#04080f] rounded-2xl p-8 lg:p-10 border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 flex flex-col h-full overflow-hidden hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c9a227] text-[#04080f] text-xs font-bold uppercase rounded-full mb-6">
                  Recomendação Premium
                </div>
                <h3 className="text-3xl font-bold mb-4 font-montserrat text-white">Nano Cerâmica</h3>
                <p className="text-gray-400 leading-relaxed min-h-[140px]">
                  A escolha número 1 para quem precisa manter a claridade total do ambiente. Remove até 95% do calor infravermelho sem escurecer o vidro, eliminando o glare nas telas e mantendo a iluminação natural perfeita para longas jornadas de trabalho.
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow bg-white/5 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Redução de Calor</span>
                  <LevelDots level={5} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Redução de Luz</span>
                  <LevelDots level={1} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Privacidade</span>
                  <LevelDots level={1} />
                </div>
              </div>
              
              <div className="w-full btn-outline py-4 text-center tracking-widest font-bold uppercase border border-[#c9a227]/30 text-[#c9a227] group-hover:bg-[#c9a227] group-hover:text-[#04080f] transition-all rounded-xl mt-auto">
                Ver detalhes técnicos
              </div>
            </a>

            {/* Jateada */}
            <a href="/jateado/" className="product-card group relative bg-gradient-to-b from-[#1a3a5c]/20 to-[#04080f] rounded-2xl p-8 lg:p-10 border border-[#1a3a5c]/50 hover:border-white/50 transition-all duration-500 flex flex-col h-full overflow-hidden hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-[#04080f] text-xs font-bold uppercase rounded-full mb-6">
                  Divisórias e Privacidade
                </div>
                <h3 className="text-3xl font-bold mb-4 font-montserrat text-white">Película Jateada</h3>
                <p className="text-gray-400 leading-relaxed min-h-[140px]">
                  Perfeita para divisórias de vidro internas, salas de reunião e janelas com vista para áreas comuns. Simula o efeito de vidro jateado, garantindo privacidade total 24 horas sem perder a luminosidade. Solução elegante e profissional.
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow bg-white/5 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Redução de Calor</span>
                  <LevelDots level={1} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Redução de Luz</span>
                  <LevelDots level={2} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Privacidade</span>
                  <LevelDots level={5} />
                </div>
              </div>
              
              <div className="w-full btn-outline py-4 text-center tracking-widest font-bold uppercase border border-white/30 text-white group-hover:bg-white group-hover:text-[#04080f] transition-all rounded-xl mt-auto">
                Ver detalhes técnicos
              </div>
            </a>

            {/* Carbono G20 */}
            <a href="/carbono/" className="product-card group relative bg-gradient-to-b from-[#1a3a5c]/20 to-[#04080f] rounded-2xl p-8 lg:p-10 border border-[#1a3a5c]/50 hover:border-[#c9a227]/30 transition-all duration-500 flex flex-col h-full overflow-hidden hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c9a227]/3 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c9a227]/20 text-[#c9a227] text-xs font-bold uppercase rounded-full mb-6 border border-[#c9a227]/30">
                  Custo-benefício
                </div>
                <h3 className="text-3xl font-bold mb-4 font-montserrat text-white">Carbono G20</h3>
                <p className="text-gray-400 leading-relaxed min-h-[140px]">
                  Excelente equilíbrio entre conforto visual e proteção térmica. Reduz o reflexo excessivo na tela, suaviza a luminosidade e mantém o ambiente com aspecto profissional. Ótima opção para escritórios que não recebem sol direto durante todo o dia.
                </p>
              </div>

              <div className="space-y-4 mb-10 flex-grow bg-white/5 p-6 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Redução de Calor</span>
                  <LevelDots level={3} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Redução de Luz</span>
                  <LevelDots level={3} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Privacidade</span>
                  <LevelDots level={2} />
                </div>
              </div>
              
              <div className="w-full btn-outline py-4 text-center tracking-widest font-bold uppercase border border-[#c9a227]/20 text-[#c9a227]/80 group-hover:bg-[#c9a227] group-hover:text-[#04080f] transition-all rounded-xl mt-auto">
                Ver detalhes técnicos
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Diferencial Lume */}
      <section className="py-24 relative px-4 border-y border-white/5">
        <div className="container-lume max-w-5xl mx-auto page-entrance">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-montserrat mb-4">O Diferencial LUME: <span className="text-gradient-gold">Instalação Comercial Premium</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Entendemos que o escritório é um ambiente de trabalho ativo. Nosso processo é pensado para causar zero interrupção na sua rotina profissional.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0a1628]/40 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Instalação Express</h3>
              <p className="text-gray-400 text-sm">
                Agendamos a instalação nos horários de menor movimento ou fora do expediente. Uma janela padrão é instalada em menos de uma hora, sem bagunça ou barulho.
              </p>
            </div>
            
            <div className="bg-[#0a1628]/40 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Análise de Incidência Solar</h3>
              <p className="text-gray-400 text-sm">
                Avaliamos a orientação das janelas, a posição dos monitores e a incidência solar ao longo do dia para recomendar a película que vai maximizar o seu conforto visual.
              </p>
            </div>
            
            <div className="bg-[#0a1628]/40 p-8 rounded-2xl border border-white/5 text-center">
              <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-[#c9a227]" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">Proteção Patrimonial</h3>
              <p className="text-gray-400 text-sm">
                Além do conforto, nossas películas bloqueiam 99% dos raios UV que degradam móveis corporativos, cadeiras de couro, pisos e equipamentos eletrônicos expostos ao sol.
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
            <p className="text-gray-400">Esclareça suas principais dúvidas sobre películas em escritórios e ambientes de trabalho.</p>
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
