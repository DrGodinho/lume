'use client';

import React from 'react';

interface GtagLinkProps {
  href: string;
  className?: string;
  eventName: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}

export function GtagLink({ href, className, eventName, children, target, rel }: GtagLinkProps) {
  const handleClick = () => {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName);
    }
  };

  return (
    <a 
      href={href} 
      className={className} 
      onClick={handleClick} 
      target={target} 
      rel={rel}
    >
      {children}
    </a>
  );
}
