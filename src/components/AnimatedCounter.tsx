import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  target: string;
  suffix?: string;
}

export function AnimatedCounter({ target, suffix = '' }: AnimatedCounterProps) {
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
