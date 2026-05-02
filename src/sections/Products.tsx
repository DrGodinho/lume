'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight, Star, Thermometer, Sun, Eye, Droplets, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import Link from 'next/link';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    name: 'NANO CERÂMICA',
    tag: 'TEC DE PONTA',
    description: 'A escolha definitiva para quem busca conforto térmico sem alterar a fachada. Bloqueia o calor infravermelho sem precisar escurecer o vidro. Ideal para varandas gourmet e vitrines. Protege seus móveis e sua pele contra os raios UV.',
    image: '/product-nano-ceramica.webp',
    specs: [
      { label: 'Bloqueio UV', value: '99,9%' },
      { label: 'Rejeição de Calor', value: 'Até 95%' },
      { label: 'Transmissão de Luz', value: '86%' },
    ],
    price: 'A partir de R$ 220/m²',
    cta: 'Quero Nano Cerâmica',
    icon: Star,
    path: '/nano-ceramica',
  },
  {
    id: 2,
    name: 'DUPLA CAMADA',
    tag: 'FAVORITO',
    description: 'Alta redução de calor com uma tecnologia especial: camada refletiva externa para máxima redução de calor e camada fumê interna para uma visão relaxante. Diferente das películas comuns, reduz o reflexo interno à noite.',
    image: '/product-smoke.webp',
    specs: [
      { label: 'Bloqueio UV', value: '99%' },
      { label: 'Rejeição de Calor', value: '80%' },
      { label: 'Transmissão de Luz', value: '5% - 50%' },
    ],
    price: 'A partir de R$ 120/m²',
    cta: 'Quero Dupla Camada',
    icon: Droplets,
    path: '/dupla-camada',
  },
  {
    id: 3,
    name: 'CARBONO PREMIUM',
    tag: null,
    description: 'Diferente das películas baratas que ficam roxas, a nossa linha Carbono mantém o tom grafite profundo por anos. Oferece excelente privacidade e um visual moderno para sua casa ou escritório, com alta proteção contra o sol.',
    image: '/product-carbono.webp',
    specs: [
      { label: 'Bloqueio UV', value: '99%' },
      { label: 'Rejeição de Calor', value: 'Até 70%' },
      { label: 'Transmissão de Luz', value: '5% - 50%' },
    ],
    price: 'A partir de R$ 80/m²',
    cta: 'Quero Carbono',
    icon: Eye,
    path: '/carbono',
  },
  {
    id: 4,
    name: 'REFLETIVA CLÁSSICA',
    tag: null,
    description: 'A solução mais eficiente para fachadas que recebem sol direto o dia todo. Transforma sua janela em um espelho por fora, garantindo privacidade diurna e uma redução drástica na temperatura interna.',
    image: '/product-refletiva.webp',
    specs: [
      { label: 'Bloqueio UV', value: '100%' },
      { label: 'Rejeição de Calor', value: '87%' },
      { label: 'Transmissão de Luz', value: '70%' },
    ],
    price: 'A partir de R$ 95/m²',
    cta: 'Quero Refletiva',
    icon: Sun,
    path: '/refletiva',
  },
  {
    id: 5,
    name: 'JATEADO',
    tag: null,
    description: 'Perfeito para áreas que exigem privacidade total sem perder a luminosidade. Muito utilizado em boxes de banheiro, cozinhas e divisórias de vidro em escritórios. Fácil limpeza e acabamento sofisticado.',
    image: '/product-jateado-v2.webp',
    specs: [
      { label: 'Bloqueio UV', value: '99%' },
      { label: 'Rejeição de Calor', value: 'Baixa' },
      { label: 'Transmissão de Luz', value: 'Alta' },
    ],
    price: 'A partir de R$ 90/m²',
    cta: 'Quero Jateado',
    icon: Thermometer,
    path: '/jateado',
  },
];

export function Products() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.product-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'expo.out',
            clearProps: 'all',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="produtos"
      ref={sectionRef}
      className="relative section-padding bg-[#070f1a] overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#c9a227]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#1a3a5c]/20 blur-3xl pointer-events-none" />

      <div className="container-lume relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
              Nossas Soluções
            </span>
            <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 font-montserrat">
            Tipos de <span className="text-gradient-gold">Insulfilm</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            Soluções premium para cada necessidade. Escolha o insulfilm ideal para seu ambiente.
          </p>
        </div>

        {/* Products Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`product-card group relative bg-gradient-to-b from-[#0a1628]/80 to-[#070f1a]/95 rounded-xl sm:rounded-2xl border border-white/5 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#c9a227]/10 ${index % 2 === 1 ? 'lg:mt-8' : ''
                }`}
            >
              {/* Tag */}
              {product.tag && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-2 py-0.5 sm:px-3 sm:py-1 bg-[#c9a227] text-[#04080f] text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full">
                  {product.tag}
                </div>
              )}

              <Link 
                href={product.path} 
                prefetch={true}
                className="block cursor-pointer relative z-30"
              >
                {/* Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw" 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <product.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a227]" />
                    <h3 className="text-sm sm:text-lg font-bold text-white font-montserrat">
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                    {product.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
                    {product.specs.slice(0, 2).map((spec, i) => (
                      <div key={i} className="text-[10px] sm:text-xs">
                        <span className="text-gray-500 block">{spec.label}</span>
                        <span className="text-[#c9a227] font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="mb-3 sm:mb-4">
                    <span className="text-sm sm:text-lg font-bold text-gradient-gold">
                      {product.price}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Botão de WhatsApp fixo dentro do card, mas fora do Link da página */}
              <div className="p-4 sm:p-5 pt-0">
                <a
                  href={`https://wa.me/5521965140612?text=Olá! Tenho interesse na ${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg bg-[#070f1a] hover:bg-[#c9a227] text-white hover:text-[#04080f] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-white/5"
                >
                  <span className="whitespace-nowrap">{product.cta}</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA - Simulator Highlight */}
        <div className="text-center mt-12 sm:mt-20">
          <div className="inline-block p-[1px] rounded-xl bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent mb-6">
            <div className="bg-[#04080f] rounded-xl px-6 py-4 border border-white/5">
              <p className="text-gray-300 text-sm sm:text-base mb-6 font-medium">
                Dúvida na escolha? <span className="text-white">Veja na prática</span> como cada película transforma seu ambiente.
              </p>
              <Link
                href="/simulador"
                prefetch={true}
                className="btn-primary inline-flex items-center gap-3 py-4 px-8 text-lg group relative overflow-hidden z-30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Sparkles className="w-5 h-5 animate-pulse" />
                Testar Simulador de Ambientes
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
