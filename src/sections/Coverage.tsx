import { MapPin, Navigation } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import Link from 'next/link';

const locations = [
  { name: 'Bangu', active: true },
  { name: 'Campo Grande', active: true },
  { name: 'Realengo', active: true },
  { name: 'Jacarepaguá', active: true },
  { name: 'Barra da Tijuca', active: true },
  { name: 'Recreio', active: true },
];

const urlMap: Record<string, string> = {
  'Bangu': '/insulfilm-em-bangu',
  'Realengo': '/insulfilm-em-realengo',
  'Campo Grande': '/insulfilm-em-campo-grande',
  'Jacarepaguá': '/insulfilm-em-jacarepagua',
  'Barra da Tijuca': '/insulfilm-na-barra-da-tijuca',
  'Recreio': '/insulfilm-no-recreio'
};

export function Coverage() {
  return (
    <section
      className="relative section-padding bg-[#04080f] overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#04080f]/50 to-transparent" />

      {/* Decorative map pins */}
      <div className="absolute top-20 left-10 opacity-10">
        <MapPin aria-hidden="true" className="w-16 h-16 text-[#c9a227] animate-bounce" style={{ animationDuration: '3s' }} />
      </div>
      <div className="absolute bottom-20 right-20 opacity-10">
        <MapPin aria-hidden="true" className="w-20 h-20 text-[#c9a227] animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      </div>
      <div className="absolute top-1/2 left-1/4 opacity-5">
        <MapPin aria-hidden="true" className="w-24 h-24 text-[#c9a227] animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
      </div>

      <div className="container-lume relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content */}
          <ScrollReveal animation="slide-up">
            <div className="animate-item flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
              <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
              <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
                Onde Atendemos
              </span>
              <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
            </div>

            <h2 className="animate-item text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 font-montserrat">
              Atendimento em Toda a{' '}
              <Link 
                href="/insulfilm-em-bangu" 
                className="text-gradient-gold hover:opacity-80 transition-opacity"
              >
                Zona Oeste
              </Link> do Rio
            </h2>

            {/* Address Card */}
            <div className="animate-item inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-[#1a3a5c]/30 border border-[#1a3a5c]/50 mb-6 sm:mb-10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#c9a227]/20 flex items-center justify-center animate-pulse-glow flex-shrink-0">
                <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a227]" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm sm:text-base font-medium">Nossa Sede</p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Estrada do Realengo, 973 - <Link href="/insulfilm-em-bangu" className="text-[#c9a227] hover:underline">Bangu</Link>, Rio de Janeiro
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="stagger-stats" className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {locations.map((location, index) => {
              const url = urlMap[location.name];

              if (url) {
                return (
                  <Link
                    key={index}
                    href={url}
                    className="stat-card location-tag group px-3 sm:px-5 py-2 sm:py-3 rounded-full border transition-all duration-300 hover:-translate-y-1 text-xs sm:text-base flex items-center gap-1.5 sm:gap-2 shadow-[0_10px_30px_rgba(201,162,39,0.1)] bg-[#1a3a5c]/30 border-[#1a3a5c]/50 text-gray-300 hover:bg-[#c9a227] hover:border-[#c9a227] hover:text-[#04080f]"
                  >
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    {location.name}
                  </Link>
                );
              }

              return (
                <div
                  key={index}
                  className="stat-card location-tag group px-3 sm:px-5 py-2 sm:py-3 rounded-full border transition-all duration-300 cursor-default hover:-translate-y-1 text-xs sm:text-base bg-[#1a3a5c]/30 border-[#1a3a5c]/50 text-gray-300"
                >
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    {location.name}
                  </span>
                </div>
              );
            })}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
