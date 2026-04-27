import { MessageCircle, Phone, Check } from 'lucide-react';
import { RadiatingLines } from '../components/RadiatingLines';
import { ScrollReveal } from '../components/ScrollReveal';
import { GtagLink } from '../components/GtagLink';

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
                href="tel:+5521965140612"
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white hover:text-[#c9a227] transition-colors font-montserrat"
              >
                (21) 96514-0612
              </a>
            </div>

            <div className="animate-item flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-10">
              <GtagLink
                href="https://wa.me/5521965140612"
                target="_blank"
                rel="noopener noreferrer"
                eventName="conversion_event_contact"
                className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base animate-pulse-glow w-full sm:w-auto"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Falar no WhatsApp
              </GtagLink>
              <a
                href="tel:+5521965140612"
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.3820248238127!2d-43.4358872!3d-22.880795499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9be31fbeddc125%3A0xc3bdefb9d8857fd2!2sEstr.%20do%20Realengo%2C%20973%20-%20Padre%20Miguel%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2021715-001!5e0!3m2!1sen!2sbr!4v1709401758580!5m2!1sen!2sbr"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Lume Controle Solar, Estrada do Realengo 973"
            />
          </div>

        </ScrollReveal>
      </div>
    </section>
  );
}
