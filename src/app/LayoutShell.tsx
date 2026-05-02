'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '@/sections/Navbar';
import { Footer } from '@/sections/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';

gsap.registerPlugin(ScrollTrigger);

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // Scroll to top on route change, but only if no hash is present
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // GSAP setup and Service Worker cleanup
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Kill old Service Workers from previous Vite setup to clear cache
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }

    // Delay ScrollTrigger.refresh() to ensure fonts, images and layout
    // are fully settled before calculating trigger positions.
    // A 200ms delay prevents the hard-load bug where triggers fire incorrectly.
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#04080f] text-white">
      {!isAdmin && <Navbar />}
      <main>{children}</main>
      {!isAdmin && (
        <>
          <Footer />
          <WhatsAppButton />
        </>
      )}
    </div>
  );
}
