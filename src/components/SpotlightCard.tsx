'use client';

import React, { useRef, useCallback } from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

/**
 * SpotlightCard - Componente de acabamento de luxo LUME
 * Ilumina suavemente a superfície e o bisotê da borda conforme o cursor do mouse se move.
 * Utiliza mutação direta de CSS Custom Properties para 60/120fps sem re-renderizações no React.
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(201, 162, 39, 0.12)',
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  const handleMouseEnter = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--spotlight-opacity', '1');
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--spotlight-opacity', '0');
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card relative ${className}`}
      style={{
        // @ts-expect-error CSS custom variable
        '--spotlight-color': spotlightColor,
        ...props.style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
