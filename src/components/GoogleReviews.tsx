import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Carlos Mendes',
    date: '1 semana atrás',
    text: 'Trabalho impecável! Instalaram a película Nano Cerâmica no meu apartamento e a redução de calor foi imediata. Excelente atendimento do início ao fim.',
    initial: 'C',
    color: 'bg-[#1a3a5c]'
  },
  {
    id: 2,
    name: 'Mariana Silva',
    date: '3 semanas atrás',
    text: 'Pesquisei muito antes de fechar e a LUME me passou mais confiança. Fizeram a varanda com a película refletiva. Ficou lindo e muito privativo.',
    initial: 'M',
    color: 'bg-[#c9a227]'
  },
  {
    id: 3,
    name: 'Roberto Castro',
    date: '1 mês atrás',
    text: 'Profissionais de altíssimo nível. O insulfilm de carbono escureceu na medida certa para a minha sala sem perder a visibilidade de dentro para fora.',
    initial: 'R',
    color: 'bg-slate-700'
  }
];

export function GoogleReviews() {
  return (
    <section className="py-20 bg-[#04080f] overflow-hidden">
      <div className="container-lume">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
            <span className="text-[#c9a227] text-sm uppercase tracking-widest font-medium">Experiência LUME</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-montserrat">
            O que nossos <span className="text-gradient-gold">Clientes Dizem</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-4">
            Confira as avaliações reais de quem já transformou o ambiente com nossas películas de alta performance.
          </p>
        </div>

        {/* Native Tailwind CSS Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-0">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 relative group hover:-translate-y-2 transition-transform duration-300 shadow-2xl bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#c9a227]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-2xl pointer-events-none" />
              
              <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5" />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#c9a227] text-[#c9a227]" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 italic relative z-10">
                "{review.text}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-4 mt-auto">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${review.color}`}>
                  {review.initial}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm font-montserrat">{review.name}</h4>
                  <p className="text-gray-500 text-xs">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action for more reviews */}
        <div className="text-center mt-12">
          <a 
            href="https://g.page/r/YOUR_GOOGLE_MAPS_LINK" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-[#c9a227] hover:text-white transition-colors text-sm font-medium border border-[#c9a227]/30 hover:border-[#c9a227] rounded-full px-6 py-2 bg-[#c9a227]/5"
          >
            Ver mais avaliações no Google
          </a>
        </div>
      </div>
    </section>
  );
}
