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
  return (
    <a 
      href={href} 
      className={className} 
      target={target} 
      rel={rel}
      data-google-conversion-event={eventName}
    >
      {children}
    </a>
  );
}
