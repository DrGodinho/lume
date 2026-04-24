'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function RadiatingLines() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lines = ref.current?.querySelectorAll('.radiating-line');
    if (lines) {
      const anim = gsap.to(lines, {
        scaleY: 1,
        opacity: 0,
        duration: 2,
        stagger: 0.3,
        repeat: -1,
        ease: 'power2.out',
      });
      return () => anim.kill();
    }
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="radiating-line absolute w-px h-32 bg-gradient-to-b from-[#c9a227]/50 to-transparent origin-bottom"
          style={{
            transform: `rotate(${i * 45}deg) translateY(-150px)`,
            transformOrigin: 'center bottom',
          }}
        />
      ))}
    </div>
  );
}
