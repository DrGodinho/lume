import { Check, Award, Users, Calendar, Shield } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

const differentiators = [
  'Trabalhamos apenas com películas de alta qualidade',
  'Garantia de 5 anos em todas as películas',
  'Atendimento personalizado na sua casa',
  'Mais de 500 residências atendidas',
];

const stats = [
  { icon: Calendar, value: '8+', label: 'Anos de Experiência' },
  { icon: Users, value: '500+', label: 'Residências Atendidas' },
  { icon: Shield, value: '5', label: 'Anos de Garantia' },
  { icon: Award, value: '100%', label: 'Clientes Satisfeitos' },
];

export function About() {
  return (
    <section
      className="relative section-padding bg-[#070f1a] overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1a3a5c]/10 to-transparent" />

      {/* Rotating gear decoration */}
      <div className="absolute bottom-20 right-20 w-64 h-64 opacity-5">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_60s_linear_infinite]">
          <path
            fill="currentColor"
            className="text-[#c9a227]"
            d="M50 0L53 10H47L50 0ZM50 100L53 90H47L50 100ZM0 50L10 53V47L0 50ZM100 50L90 53V47L100 50ZM14.6 14.6L21.7 21.7L18.3 25.1L11.2 18L14.6 14.6ZM85.4 85.4L78.3 78.3L81.7 74.9L88.8 82L85.4 85.4ZM14.6 85.4L21.7 78.3L18.3 74.9L11.2 82L14.6 85.4ZM85.4 14.6L78.3 21.7L81.7 25.1L88.8 18L85.4 14.6Z"
          />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="container-lume relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          {/* Content */}
          <ScrollReveal animation="slide-left">
            {/* Border accent */}
            <div className="animate-item relative pl-4 sm:pl-6 border-l-2 border-[#c9a227]">
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
                Sobre a Lume
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-1 sm:mt-2 mb-4 sm:mb-6 font-montserrat">
                8 Anos de <span className="text-gradient-gold">Excelência</span> em Insulfilm Residencial
              </h2>
            </div>

            <p className="animate-item text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
              A Lume Controle Solar nasceu da paixão por transformar ambientes. Há 8 anos,
              trazemos conforto térmico e proteção UV para famílias da Zona Oeste do Rio de Janeiro.
              Nossa missão é simples: oferecer produtos premium com instalação impecável e garantia real.
            </p>

            {/* Differentiators */}
            <div className="space-y-3 sm:space-y-4">
              {differentiators.map((item, index) => (
                <div
                  key={index}
                  className="animate-item flex items-center gap-2 sm:gap-3 group"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#c9a227]/20 flex items-center justify-center group-hover:bg-[#c9a227]/30 transition-colors flex-shrink-0">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#c9a227]" />
                  </div>
                  <span className="text-gray-300 text-sm sm:text-base group-hover:text-white transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Stats Grid */}
          <ScrollReveal animation="stagger-stats" className="grid grid-cols-2 gap-3 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`stat-card group relative p-5 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#1a3a5c]/50 to-[#04080f]/70 border border-[#1a3a5c]/30 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2 ${index % 2 === 1 ? 'sm:mt-8' : ''
                  }`}
              >
                {/* Glow */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-[#c9a227]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg bg-[#c9a227]/10 flex items-center justify-center group-hover:bg-[#c9a227]/20 transition-colors">
                    <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 text-[#c9a227]" />
                  </div>
                </div>

                {/* Value */}
                <div className="relative">
                  <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-gradient-gold font-montserrat">
                    {stat.value}
                  </span>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">{stat.label}</p>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
