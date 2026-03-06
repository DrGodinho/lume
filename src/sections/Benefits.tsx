import { useEffect, useRef, useState } from 'react';
import { Shield, Thermometer, PiggyBank, Lock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const numTarget = parseInt(target.replace(/\D/g, ''));
    if (!numTarget) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const duration = 2000;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out expo
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * numTarget));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(numTarget);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [target]);

  const displayValue = target.startsWith('-') ? `-${count}` : `${count}`;

  return (
    <span ref={counterRef}>
      {displayValue}{suffix}
    </span>
  );
}

export function Benefits() {
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
      const cards = cardsRef.current?.querySelectorAll('.benefit-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, scale: 0.8, rotate: -10 },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'elastic.out(1, 0.5)',
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
      id="beneficios"
      ref={sectionRef}
      className="relative section-padding bg-[#0a1628] overflow-hidden"
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
      <div className="absolute top-1/4 left-0 w-72 h-72 rounded-full bg-[#c9a227]/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-[#1a3a5c]/20 blur-3xl" />

      <div className="container-lume relative z-10">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
            <span className="text-[#c9a227] text-xs sm:text-sm uppercase tracking-widest font-medium">
              Vantagens
            </span>
            <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 font-['Montserrat']">
            Por Que Escolher a <span className="text-gradient-gold">Lume</span>?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            Benefícios que fazem a diferença no seu dia a dia e na qualidade de vida da sua família.
          </p>
        </div>

        {/* Benefits Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="benefit-card group relative p-5 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#1a3a5c]/40 to-[#0d1f3c]/60 border border-[#1a3a5c]/30 hover:border-[#c9a227]/50 transition-all duration-500 hover:-translate-y-2"
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
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-gold font-['Montserrat']">
                  <AnimatedCounter
                    target={benefit.stat.replace(/[^0-9-]/g, '')}
                    suffix={benefit.stat.replace(/[0-9-]/g, '')}
                  />
                </span>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{benefit.statLabel}</p>
              </div>

              {/* Content */}
              <h3 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-3 font-['Montserrat']">
                {benefit.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-10 sm:mt-16 flex flex-wrap justify-center gap-6 sm:gap-8">
          {[
            { value: '8+', label: 'Anos de Experiência' },
            { value: '500+', label: 'Residências Atendidas' },
            { value: '100%', label: 'Clientes Satisfeitos' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-gold font-['Montserrat']">
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
