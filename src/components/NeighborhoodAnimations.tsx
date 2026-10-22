'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function NeighborhoodAnimations() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      const elements = document.querySelectorAll('.page-entrance, .benefit-card, .product-card');
      elements.forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Smooth animations: animate visible Hero immediately, ScrollTrigger for below-the-fold
      const elements = gsap.utils.toArray('.page-entrance') as HTMLElement[];
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < (window.innerHeight || 800) * 0.85;

        if (isInViewport) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
          );
        } else {
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
        }
      });

      // Benefits Cards animation
      const cards = document.querySelectorAll('.benefit-card');
      const benefitTrigger = document.getElementById('vantagens') || cards[0];
      if (cards.length > 0 && benefitTrigger) {
        gsap.fromTo(
          cards,
          { opacity: 0, scale: 0.85, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: benefitTrigger,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Product Cards animation
      const productCards = document.querySelectorAll('.product-card');
      const productTrigger = document.getElementById('tipos') || productCards[0];
      if (productCards.length > 0 && productTrigger) {
        gsap.fromTo(
          productCards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: productTrigger,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Stat Cards animation
      const statCards = document.querySelectorAll('.stat-card');
      if (statCards.length > 0) {
        gsap.fromTo(
          statCards,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: statCards[0],
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return null;
}
