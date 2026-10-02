'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface AnimatedCounterProps {
  target: string;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({ target, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const parsed = useMemo(() => {
    let cleanPrefix = prefix;
    let cleanSuffix = suffix;

    // Handle legacy suffix that accidentally contains 'Até' (e.g. from regex replace)
    if (!cleanPrefix && cleanSuffix && /^\s*até\s*/i.test(cleanSuffix)) {
      const match = cleanSuffix.match(/^\s*até\s*/i);
      if (match) {
        cleanPrefix = match[0];
        cleanSuffix = cleanSuffix.replace(/^\s*até\s*/i, ' ');
      }
    }

    const matchTarget = target.match(/^([^\d-]*)(-?\d+)(.*)$/);
    if (matchTarget) {
      if (!cleanPrefix && matchTarget[1].trim()) {
        cleanPrefix = matchTarget[1];
      }
      if (!cleanSuffix && matchTarget[3].trim()) {
        cleanSuffix = matchTarget[3];
      }
      return {
        prefix: cleanPrefix,
        num: parseInt(matchTarget[2].replace(/\D/g, '')) || 0,
        isNegative: matchTarget[2].startsWith('-'),
        suffix: cleanSuffix
      };
    }

    return {
      prefix: cleanPrefix,
      num: parseInt(target.replace(/\D/g, '')) || 0,
      isNegative: target.startsWith('-'),
      suffix: cleanSuffix
    };
  }, [target, suffix, prefix]);

  const numTarget = parsed.num;

  useEffect(() => {
    if (!numTarget) return;

    if (prefersReducedMotion) {
      hasAnimated.current = true;
      return;
    }

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
  }, [numTarget, prefersReducedMotion]);

  const resolvedCount = prefersReducedMotion ? numTarget : count;
  const displayValue = parsed.isNegative ? `-${resolvedCount}` : `${resolvedCount}`;

  return (
    <span ref={counterRef}>
      {parsed.prefix}{displayValue}{parsed.suffix}
    </span>
  );
}
