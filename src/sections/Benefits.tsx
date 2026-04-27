import { Shield, Thermometer, PiggyBank, Lock } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { AnimatedCounter } from '../components/AnimatedCounter';

const benefits = [
  {
    id: 1,
    icon: Shield,
    title: 'Proteção UV 99%',
    description: 'Bloqueia quase todos os raios ultravioletas, protegendo sua pele e móveis do desbotamento.',
    stat: '99%',
    statLabel: 'Bloqueio UV',
  },
  {
    id: 2,
    icon: Thermometer,
    title: 'Conforto Térmico',
    description: 'Reduza a temperatura interna em até 8°C e aproveite ambientes mais agradáveis o ano todo.',
    stat: '-8°C',
    statLabel: 'Redução',
  },
  {
    id: 3,
    icon: PiggyBank,
    title: 'Economia de Energia',
    description: 'Reduza o uso de ar-condicionado e economize até 30% na conta de luz todos os meses.',
    stat: '30%',
    statLabel: 'Economia',
  },
  {
    id: 4,
    icon: Lock,
    title: 'Segurança',
    description: 'Películas antivandalismo que dificultam a invasão e seguram vidros quebrados.',
    stat: '5 anos',
    statLabel: 'Garantia',
  },
];

export function Benefits() {
  return (
    <section
      id="beneficios"
      className="relative section-padding bg-[#04080f] overflow-hidden"
    >
      {/* Wave background */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgba(26, 58, 92, 0.3)"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 rounded-full bg-[#c9a227]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-[#1a3a5c]/20 blur-3xl pointer-events-none" />

      <div className="container-lume relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="slide-up" className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
              Vantagens
            </span>
            <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 font-montserrat">
            Por Que Escolher a <span className="text-gradient-gold">Lume</span>?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            Benefícios que fazem a diferença no seu dia a dia e na qualidade de vida da sua família.
          </p>
        </ScrollReveal>

        {/* Benefits Grid */}
        <ScrollReveal
          animation="stagger-stats"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="stat-card benefit-card group relative p-5 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#1a3a5c]/40 to-[#04080f]/60 border border-[#1a3a5c]/30 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-[#c9a227]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon */}
              <div className="relative mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-[#c9a227]/10 flex items-center justify-center group-hover:bg-[#c9a227]/20 transition-colors duration-300">
                  <benefit.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#c9a227] group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Floating decoration */}
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#c9a227]/20 animate-float" />
              </div>

              {/* Stat */}
              <div className="mb-3 sm:mb-4">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-gold font-montserrat">
                  <AnimatedCounter
                    target={benefit.stat.replace(/[^0-9-]/g, '')}
                    suffix={benefit.stat.replace(/[0-9-]/g, '')}
                  />
                </span>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{benefit.statLabel}</p>
              </div>

              {/* Content */}
              <h3 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-3 font-montserrat">
                {benefit.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </ScrollReveal>

        {/* Trust indicators */}
        <div className="mt-10 sm:mt-16 flex flex-wrap justify-center gap-6 sm:gap-8">
          {[
            { value: '8+', label: 'Anos de Experiência' },
            { value: '500+', label: 'Residências Atendidas' },
            { value: '100%', label: 'Clientes Satisfeitos' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-gold font-montserrat">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
