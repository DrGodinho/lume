import { MessageCircle, Phone, Check } from 'lucide-react';
import { RadiatingLines } from '../components/RadiatingLines';
import { ScrollReveal } from '../components/ScrollReveal';
import { GtagLink } from '../components/GtagLink';
import { businessInfo } from '@/lib/businessInfo';

const trustIndicators = [
  'Resposta em até 2h',
  'Orçamento sem compromisso',
  'Atendimento 7 dias',
];

export function ContactCTA() {
  return (
    <section
      id="contato"
      className="relative section-padding overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #070f1a 0%, #04080f 100%)',
      }}
    >
      {/* Radiating lines */}
      <RadiatingLines />

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a227]/5 blur-3xl pointer-events-none" />

      <div className="container-lume relative z-10">
        <ScrollReveal animation="slide-up" className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-2 sm:px-0">

          {/* Left Column: CTA Content */}
          <div className="text-center lg:text-left">
            {/* Headline */}
            <h2 className="animate-item text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 font-montserrat">
              Pronto para Transformar{' '}
              <span className="text-gradient-gold">Sua Casa</span>?
            </h2>

            <p className="animate-item text-base sm:text-xl text-gray-300 mb-6 sm:mb-8">
              Orçamento gratuito em menos de 24h
            </p>

            {/* Phone */}
            <div className="animate-item flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-6 sm:mb-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#c9a227]/20 flex items-center justify-center animate-pulse-glow">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a227]" />
              </div>
              <a
                href={`tel:${businessInfo.phoneE164}`}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white hover:text-[#c9a227] transition-colors font-montserrat"
              >
                {businessInfo.phoneDisplay}
              </a>
            </div>

            <div className="animate-item flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-10">
              <GtagLink
                href={businessInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                eventName="conversion_event_contact"
                className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base animate-pulse-glow w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Falar no WhatsApp
              </GtagLink>
              <a
                href={`tel:${businessInfo.phoneE164}`}
                className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                Ligar Agora
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="animate-item flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-2 sm:gap-6">
              {trustIndicators.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-400"
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#c9a227] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Google Maps Location */}
          <div className="animate-item rounded-2xl overflow-hidden glass-panel h-[350px] lg:h-[450px] w-full border border-[#1a3a5c]/50 relative shadow-2xl">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(businessInfo.address.mapsQuery)}&output=embed`}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Google Maps ${businessInfo.name}, ${businessInfo.address.display}`}
            />
          </div>

        </ScrollReveal>
      </div>
    </section>
  );
}
