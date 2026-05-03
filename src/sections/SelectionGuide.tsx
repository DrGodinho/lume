import { ScrollReveal } from '../components/ScrollReveal';

const LevelDots = ({ level }: { level: number }) => (
  <div className="flex gap-1.5 items-center">
    {[1, 2, 3, 4, 5].map((i) => (
      <div 
        key={i} 
        className={`w-3.5 h-3.5 rounded-full ${i <= level ? 'bg-[#c9a227] shadow-[0_0_8px_rgba(201,162,39,0.4)]' : 'bg-white/10'}`} 
      />
    ))}
  </div>
);

const filmsData = [
  { name: 'Nano Cerâmica', calor: 5, luz: 1, priv: 1, desc: 'Máxima proteção térmica sem escurecer o ambiente', link: '/nano-ceramica/' },
  { name: 'Dupla Camada', calor: 5, luz: 5, priv: 5, desc: 'Espelhada: proteção total e privacidade máxima', link: '/dupla-camada/' },
  { name: 'Refletiva (Prateada)', calor: 4, luz: 3, priv: 4, desc: 'Alto custo-benefício térmico com bom espelhamento', link: '/refletiva/' },
  { name: 'Carbono G5', calor: 4, luz: 4, priv: 5, desc: 'Visual escuro absoluto e excelente privacidade', link: '/carbono/' },
  { name: 'Carbono G20', calor: 3, luz: 2, priv: 2, desc: 'Opção econômica com redução confortável', link: '/carbono/' },
  { name: 'Jateado', calor: 1, luz: 2, priv: 5, desc: 'Privacidade total com luz difusa e ambiente aconchegante', link: '/jateado/' },
];

const roomsData = [
  {
    icon: '🍳',
    title: 'Cozinha',
    recs: [
      { film: 'Nano Cerâmica', tag: 'Top para calor', desc: 'Barrar o calor do sol sem escurecer o ambiente onde você prepara refeições e precisa de clareza natural.', link: '/nano-ceramica/' },
      { film: 'Jateado', tag: 'Para privacidade', desc: 'Ideal se a cozinha tiver vista direta para a rua ou área comum do condomínio, mantendo a luz suave.', link: '/jateado/' },
    ]
  },
  {
    icon: '🛏️',
    title: 'Quarto',
    recs: [
      { film: 'Dupla Camada', tag: 'Alta performance', desc: 'Escurecimento profundo + bloqueio total de calor. Perfeito para quem precisa dormir em qualquer horário.', link: '/dupla-camada/' },
      { film: 'Carbono G5', tag: 'Opção econômica', desc: 'Visual preto absoluto com excelente privacidade. Ótimo custo-benefício para quem quer escurecer sem espelhamento.', link: '/carbono/' },
    ]
  },
  {
    icon: '🛋️',
    title: 'Sala',
    recs: [
      { film: 'Nano Cerâmica', tag: 'Premium', desc: 'Mantém a sala clarinha e agradável, bloqueando intensamente o calor que entra pelas grandes janelas.', link: '/nano-ceramica/' },
      { film: 'Refletiva', tag: 'Redução de calor', desc: 'Boa barreira térmica com espelhamento externo. Equilibra proteção e orçamento.', link: '/refletiva/' },
      { film: 'Carbono G20', tag: 'Econômica', desc: 'Redução confortável de calor e luminosidade. Boa opção para sala de estar que não pega sol forte o dia todo.', link: '/carbono/' },
    ]
  },
  {
    icon: '🚿',
    title: 'Banheiro',
    recs: [
      { film: 'Jateado', tag: 'Máxima privacidade', desc: 'Privacidade total sem deixar o ambiente escuro. A luz difusa deixa o banheiro iluminado e completamente blindado de olhares.', link: '/jateado/' },
    ]
  },
  {
    icon: '💻',
    title: 'Escritório',
    recs: [
      { film: 'Nano Cerâmica', tag: 'Premium', desc: 'Evita o calor que causa sonolência e mantém a claridade para leitura e tela sem glare excessivo.', link: '/nano-ceramica/' },
      { film: 'Jateado', tag: 'Para divisórias', desc: 'Privacidade total em divisórias de vidro internas ou janelas com vista para áreas comuns, sem perder a luz.', link: '/jateado/' },
      { film: 'Carbono G20', tag: 'Confortável', desc: 'Reduz o reflexo na tela do computador e deixa a luminosidade confortável para longas jornadas de trabalho.', link: '/carbono/' },
    ]
  }
];

export function SelectionGuide() {
  return (
    <section id="escolha-ideal" className="relative section-padding bg-[#070f1a] overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#04080f] to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#04080f] to-transparent opacity-50" />
      
      <div className="container-lume relative z-10">
        <ScrollReveal animation="slide-up" className="text-center mb-12 sm:mb-16">
          <div className="animate-item flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
              Escolha Inteligente
            </span>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
          </div>
          <h2 className="animate-item text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-montserrat">
            Como Descobrir a <span className="text-gradient-gold">Película Ideal</span>
          </h2>
          <p className="animate-item text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Um guia para te ajudar a escolher a melhor película de insulfilm para cada necessidade, comparando performance técnica e funcionalidade real em cada ambiente.
          </p>
        </ScrollReveal>

        {/* Legend */}
        <ScrollReveal animation="slide-up" className="flex justify-center flex-wrap gap-4 sm:gap-8 mb-8 text-sm text-gray-400">
          <div className="flex items-center gap-2"><span className="text-[#c9a227]">●</span> Calor: rejeição térmica</div>
          <div className="flex items-center gap-2"><span className="text-[#c9a227]">●</span> Luz: redução de luminosidade</div>
          <div className="flex items-center gap-2"><span className="text-[#c9a227]">●</span> Privacidade: opacidade / espelhamento</div>
        </ScrollReveal>

        {/* Table */}
        <ScrollReveal animation="slide-up" className="overflow-x-auto mb-6 border border-white/10 rounded-2xl glass-card bg-gradient-to-br from-white/[0.02] to-transparent">
          <table className="w-full text-left min-w-[760px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="p-5 text-[#c9a227] font-semibold tracking-wider uppercase text-xs sm:text-sm">Película</th>
                <th className="p-5 text-[#c9a227] font-semibold tracking-wider uppercase text-xs sm:text-sm">Redução de Calor</th>
                <th className="p-5 text-[#c9a227] font-semibold tracking-wider uppercase text-xs sm:text-sm">Redução de Luz</th>
                <th className="p-5 text-[#c9a227] font-semibold tracking-wider uppercase text-xs sm:text-sm">Privacidade*</th>
                <th className="p-5 text-[#c9a227] font-semibold tracking-wider uppercase text-xs sm:text-sm">Perfil Resumido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filmsData.map((film, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-bold text-white whitespace-nowrap">
                    <a href={film.link} className="hover:text-[#c9a227] transition-colors">
                      {film.name}
                    </a>
                  </td>
                  <td className="p-5"><LevelDots level={film.calor} /></td>
                  <td className="p-5"><LevelDots level={film.luz} /></td>
                  <td className="p-5"><LevelDots level={film.priv} /></td>
                  <td className="p-5 text-gray-400 text-sm leading-relaxed">{film.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollReveal>

        {/* Footnote */}
        <ScrollReveal animation="fade-in" className="mb-16">
          <p className="text-[10px] sm:text-xs text-gray-500 italic text-center sm:text-left px-4">
            * A privacidade das películas (exceto Jateado) é baseada na luminosidade. Oferecem privacidade total durante o dia (quem está fora não vê dentro). À noite, com luzes internas acesas, o efeito se inverte. Apenas a película <strong>Jateada</strong> oferece privacidade 24h.
          </p>
        </ScrollReveal>

        {/* Room Cards Grid */}
        <ScrollReveal animation="slide-up" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {roomsData.map((room, idx) => (
            <div
              key={idx}
              className="animate-item group relative glass-card p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#1a3a5c]/40 to-[#04080f]/60 border border-[#1a3a5c]/30 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2 flex flex-col overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-[#c9a227]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300 inline-block">{room.icon}</span>
                  <h3 className="text-[#c9a227] font-bold text-xl sm:text-2xl font-montserrat">{room.title}</h3>
                </div>
                
                <div className="space-y-5 flex-1">
                  {room.recs.map((rec, rIdx) => (
                    <div key={rIdx} className="pb-5 border-b border-white/10 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <a href={rec.link} className="font-bold text-white hover:text-[#c9a227] transition-colors relative z-20">
                          {rec.film}
                        </a>
                        <span className="bg-[#c9a227]/15 text-[#c9a227] text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                          {rec.tag}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{rec.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </ScrollReveal>

        {/* Action Suggestion */}
        <ScrollReveal animation="slide-up" className="mt-12 sm:mt-16 text-center">
          <div className="inline-block p-6 sm:p-8 bg-[#c9a227]/[0.03] border border-[#c9a227]/20 border-dashed rounded-2xl max-w-3xl mx-auto">
            <p className="text-[#c9a227] font-medium text-lg mb-6">
              ⚡ Dúvida de qual escolher? Fale com um especialista LUME e receba um projeto gratuito.
            </p>
            <a 
              href="https://wa.me/5521965140612?text=Olá! Gostaria de uma avaliação técnica para saber qual insulfilm é melhor para minha casa."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center"
            >
              Falar com Especialista Agora
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
