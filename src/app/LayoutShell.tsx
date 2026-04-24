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

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // GSAP setup and Service Worker cleanup
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Kill old Service Workers from previous Vite setup to clear cache
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
          registration.unregister();
          console.log('Old Service Worker unregistered');
        }
      });
    }

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#04080f] text-white overflow-x-hidden">
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
