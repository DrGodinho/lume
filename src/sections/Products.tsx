import { useEffect, useRef } from 'react';
import { ArrowRight, Star, Thermometer, Sun, Eye, Droplets } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    name: 'NANO CERÂMICA',
    tag: 'TEC DE PONTA',
    description: 'A escolha definitiva para quem busca conforto térmico sem alterar a fachada. Bloqueia o calor infravermelho sem precisar escurecer o vidro. Ideal para varandas gourmet e vitrines. Protege seus móveis e sua pele contra os raios UV.',
    image: '/product-nano-ceramica.jpg',
    specs: [
      { label: 'Bloqueio UV', value: '99,9%' },
      { label: 'Rejeição de Calor', value: 'Até 95%' },
      { label: 'Transmissão de Luz', value: '86%' },
    ],
    price: 'A partir de R$ 220/m²',
    cta: 'Quero Nano Cerâmica',
    icon: Star,
  },
  {
    id: 2,
    name: 'DUPLA CAMADA',
    tag: 'FAVORITO',
    description: 'Alta redução de calor com uma tecnologia especial: camada refletiva externa para máxima redução de calor e camada fumê interna para uma visão relaxante. Diferente das películas comuns, reduz o reflexo interno à noite.',
    image: '/product-smoke.jpg',
    specs: [
      { label: 'Bloqueio UV', value: '99%' },
      { label: 'Rejeição de Calor', value: '80%' },
      { label: 'Transmissão de Luz', value: '5% - 50%' },
    ],
    price: 'A partir de R$ 120/m²',
    cta: 'Quero Dupla Camada',
    icon: Droplets,
  },
  {
    id: 3,
    name: 'CARBONO PREMIUM',
    tag: null,
    description: 'Diferente das películas baratas que ficam roxas, a nossa linha Carbono mantém o tom grafite profundo por anos. Oferece excelente privacidade e um visual moderno para sua casa ou escritório, com alta proteção contra o sol.',
    image: '/product-carbono.jpg',
    specs: [
      { label: 'Bloqueio UV', value: '99%' },
      { label: 'Rejeição de Calor', value: 'Até 70%' },
      { label: 'Transmissão de Luz', value: '5% - 50%' },
    ],
    price: 'A partir de R$ 80/m²',
    cta: 'Quero Carbono',
    icon: Eye,
  },
  {
    id: 4,
    name: 'REFLETIVA CLÁSSICA',
    tag: null,
    description: 'A solução mais eficiente para fachadas que recebem sol direto o dia todo. Transforma sua janela em um espelho por fora, garantindo privacidade diurna e uma redução drástica na temperatura interna.',
    image: '/product-refletiva.jpg',
    specs: [
      { label: 'Bloqueio UV', value: '100%' },
      { label: 'Rejeição de Calor', value: '87%' },
      { label: 'Transmissão de Luz', value: '70%' },
    ],
    price: 'A partir de R$ 95/m²',
    cta: 'Quero Refletiva',
    icon: Sun,
  },
  {
    id: 5,
    name: 'JATEADO',
    tag: null,
    description: 'Perfeito para áreas que exigem privacidade total sem perder a luminosidade. Muito utilizado em boxes de banheiro, cozinhas e divisórias de vidro em escritórios. Fácil limpeza e acabamento sofisticado.',
    image: '/product-jateado.jpg',
    specs: [
      { label: 'Bloqueio UV', value: '5%' },
      { label: 'Rejeição de Calor', value: 'Baixa' },
      { label: 'Transmissão de Luz', value: 'Alta' },
    ],
    price: 'A partir de R$ 90/m²',
    cta: 'Quero Jateado',
    icon: Thermometer,
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
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      const cards = cardsRef.current?.querySelectorAll('.product-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, rotateY: -30, x: -50 },
          {
            opacity: 1,
            rotateY: 0,
            x: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
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
      className="relative section-padding bg-[#0d1f3c] overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#c9a227]/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#1a3a5c]/20 blur-3xl" />

      <div className="container-lume relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-10 sm:mb-16">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
              Nossas Soluções
            </span>
            <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 font-['Montserrat']">
            Nossas <span className="text-gradient-gold">Películas</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            Soluções premium para cada necessidade. Escolha a película ideal para seu ambiente.
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
              className={`product-card group relative bg-gradient-to-b from-[#1a3a5c]/60 to-[#0a1628]/90 rounded-xl sm:rounded-2xl overflow-hidden border border-[#1a3a5c]/50 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#c9a227]/10 ${index % 2 === 1 ? 'lg:mt-8' : ''
                }`}
              style={{ perspective: '1000px' }}
            >
              {/* Tag */}
              {product.tag && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-2 py-0.5 sm:px-3 sm:py-1 bg-[#c9a227] text-[#0a1628] text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full">
                  {product.tag}
                </div>
              )}

              {/* Image */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <product.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a227]" />
                  <h3 className="text-sm sm:text-lg font-bold text-white font-['Montserrat']">
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

                {/* CTA */}
                <a
                  href={`https://wa.me/5521965140612?text=Olá! Tenho interesse na ${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg bg-[#1a3a5c] hover:bg-[#c9a227] text-white hover:text-[#0a1628] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  <span className="whitespace-nowrap">{product.cta}</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10 sm:mt-16">
          <p className="text-gray-400 text-sm sm:text-base mb-4">
            Não sabe qual escolher? Nossos especialistas podem ajudar!
          </p>
          <a
            href="https://wa.me/5521965140612"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            Falar com Especialista
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
