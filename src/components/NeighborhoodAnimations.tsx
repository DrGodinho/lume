'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function NeighborhoodAnimations() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Smooth Scroll Animations for all sections
      const elements = gsap.utils.toArray('.page-entrance');
      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Benefits Cards animation
      const cards = document.querySelectorAll('.benefit-card');
      if (cards.length > 0) {
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
              trigger: '#vantagens',
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Product Cards animation
      const productCards = document.querySelectorAll('.product-card');
      if (productCards.length > 0) {
        gsap.fromTo(
          productCards,
          { opacity: 0, rotateY: -30, x: -50 },
          {
            opacity: 1,
            rotateY: 0,
            x: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: '#tipos',
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, [prefersReducedMotion]);

  return null;
}
