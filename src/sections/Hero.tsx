import { useEffect, useRef } from 'react';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { Particles } from '../components/Particles';
import gsap from 'gsap';
import { handleGtagClick } from '../lib/gtag';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for entrance animations
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      // Headline animation - word by word
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          { opacity: 0, y: 50, clipPath: 'inset(0 100% 0 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.6, stagger: 0.1 },
          0.3
        );
      }

      // Subheadline
      tl.fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.8
      );

      // CTA buttons
      tl.fromTo(
        ctaRef.current?.children || [],
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 },
        1.1
      );

      // Trust badge
      tl.fromTo(
        trustRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        1.4
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt="Sala de estar protegida com insulfilm residencial Lume na Zona Oeste do Rio"
          className="w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/80 to-[#0a1628]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/50" />
      </div>

      {/* Particles */}
      <Particles />

      {/* Content */}
      <div className="relative z-20 container-lume pt-24 sm:pt-20 pb-10 sm:pb-12">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse flex-shrink-0" />
            <span className="text-xs sm:text-sm text-[#c9a227] font-medium">
              8 Anos de Excelência em Insulfilm
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.15] sm:leading-tight mb-4 sm:mb-6 font-['Montserrat']"
          >
            <span className="word inline-block">Proteção</span>{' '}
            <span className="word inline-block">Solar</span>{' '}
            <span className="word inline-block text-gradient-gold">Premium</span>{' '}
            <span className="word inline-block">para</span>{' '}
            <span className="word inline-block">Sua</span>{' '}
            <span className="word inline-block">Casa</span>
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl"
          >
            Especialistas em insulfilm residencial na Zona Oeste do Rio.
            Garantia de 5 anos em todas as instalações. Trabalhamos apenas com películas de alta qualidade.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
            <a
              href="https://wa.me/5521965140612"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                handleGtagClick((e.currentTarget as HTMLAnchorElement).href);
              }}
              className="btn-primary flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Solicitar Orçamento</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <button
              onClick={() => scrollToSection('#produtos')}
              className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Conhecer Produtos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust Badge */}
          <div ref={trustRef} className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
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
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1628] to-transparent z-10" />

      {/* Floating gold accent */}
      <div className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-[#c9a227]/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#1a3a5c]/30 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
}
