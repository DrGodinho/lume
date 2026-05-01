'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export function GoogleReviews() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-20 bg-[#04080f] overflow-hidden">
      <Script 
        id="google-reviews-loader"
        src="https://featurable.com/assets/v2/carousel_default.min.js"
        strategy="afterInteractive"
      />
      <div className="container-lume">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a227]" />
            <span className="text-[#c9a227] text-sm uppercase tracking-widest font-medium">Experiência LUME</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a227]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-montserrat">
            O que nossos <span className="text-gradient-gold">Clientes Dizem</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto px-4">
            Confira as avaliações reais de quem já transformou o ambiente com nossas películas de alta performance no Google.
          </p>
        </div>

        {/* Featurable Widget Container with unique key to force re-render on navigation */}
        <div className="glass-card p-4 sm:p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
          <div 
            key={pathname}
            id="featurable-e1c220e3-0fca-4d03-974d-3cd8c1b1e37b" 
            data-featurable-async 
            data-location-code="pt-BR"
          ></div>
        </div>
      </div>
    </section>
  );
}
