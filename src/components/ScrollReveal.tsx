'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'slide-left' | 'stagger-stats';
  className?: string;
}

export function ScrollReveal({ children, animation = 'fade-in', className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (animation === 'fade-in' || animation === 'slide-up' || animation === 'slide-left') {
        const items = ref.current?.querySelectorAll('.animate-item');
        if (items?.length) {
          gsap.fromTo(
            items,
            { 
              opacity: 0, 
              x: animation === 'slide-left' ? -30 : 0,
              y: animation === 'slide-up' ? 30 : 0 
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      }

      if (animation === 'stagger-stats') {
        const cards = ref.current?.querySelectorAll('.stat-card');
        if (cards?.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, scale: 0.8, y: 30 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      }
    }, ref);

    return () => ctx.revert();
  }, [animation]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
