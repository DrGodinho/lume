'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroEntranceProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroEntrance({ children, className }: HeroEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      // Headline animation - find words inside
      const words = containerRef.current?.querySelectorAll('.word');
      if (words?.length) {
        tl.fromTo(
          words,
          { opacity: 0, y: 50, clipPath: 'inset(0 100% 0 0)' },
          { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.6, stagger: 0.1 },
          0.3
        );
      }

      // Other items with .animate-hero class
      const items = containerRef.current?.querySelectorAll('.animate-hero');
      if (items?.length) {
        tl.fromTo(
          items,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
          0.8
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
