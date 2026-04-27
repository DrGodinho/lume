import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { Particles } from '../components/Particles';
import { HeroEntrance } from '../components/HeroEntrance';
import { GtagLink } from '../components/GtagLink';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-bg.webp" 
          alt="Sala de estar protegida com insulfilm residencial Lume na Zona Oeste do Rio" 
          fill 
          sizes="100vw" 
          priority 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04080f]/95 via-[#04080f]/80 to-[#04080f]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-transparent to-[#04080f]/50" />
      </div>

      {/* Particles */}
      <Particles />

      {/* Content */}
      <div className="relative z-20 container-lume pt-24 sm:pt-20 pb-10 sm:pb-12">
        <HeroEntrance className="max-w-3xl">
          {/* Badge */}
          <div className="animate-hero inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse flex-shrink-0" />
            <span className="text-xs sm:text-sm text-[#c9a227] font-medium">
              8 Anos de Excelência em Insulfilm
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.15] sm:leading-tight mb-4 sm:mb-6 font-montserrat">
            <span className="word inline-block">Proteção</span>{' '}
            <span className="word inline-block">Solar</span>{' '}
            <span className="word inline-block text-gradient-gold">Premium</span>{' '}
            <span className="word inline-block">para</span>{' '}
            <span className="word inline-block">Sua</span>{' '}
            <span className="word inline-block">Casa</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-hero text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
            Especialistas em insulfilm residencial na Zona Oeste do Rio.
            Garantia de 5 anos em todas as instalações. Trabalhamos apenas com películas de alta qualidade.
          </p>

          {/* CTA Buttons */}
          <div className="animate-hero flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
            <GtagLink
              href="https://wa.me/5521965140612"
              target="_blank"
              rel="noopener noreferrer"
              eventName="conversion_event_contact"
              className="btn-primary flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Solicitar Orçamento</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </GtagLink>
            <Link
              href="#produtos"
              className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Conhecer Produtos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="animate-hero flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#c9a227] flex-shrink-0" />
              <span>Atendimento em toda Zona Oeste</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-600" />
            <div className="flex items-center gap-2">
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#c9a227] flex-shrink-0" />
              <span>Bangu, Campo Grande, Realengo</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-600" />
            <div className="flex items-center gap-2">
              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#c9a227] flex-shrink-0" />
              <span>Barra, Recreio, Jacarepaguá</span>
            </div>
          </div>
        </HeroEntrance>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#04080f] to-transparent z-10" />

      {/* Floating gold accent */}
      <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#c9a227]/5 blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#1a3a5c]/30 blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
    </section>
  );
}
