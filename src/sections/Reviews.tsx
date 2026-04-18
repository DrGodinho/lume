'use client';

import { useEffect, useRef } from 'react';

export function Reviews() {
    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Dynamically inject the Trustindex script so it executes properly in React
        if (widgetRef.current && !widgetRef.current.querySelector('script')) {
            const script = document.createElement('script');
            script.src = "https://cdn.trustindex.io/loader.js?9780d556642b023bd07690445bc";
            script.defer = true;
            script.async = true;
            widgetRef.current.appendChild(script);
        }
    }, []);

    return (
        <section
            id="avaliacoes"
            className="section-padding bg-[#0a1628] relative"
        >
            <div className="container-lume">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-['Montserrat']">
                        Avaliações de <span className="text-gradient-gold">Clientes</span>
                    </h2>
                    <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                        Avaliações autorizadas e opiniões de quem já transformou seus ambientes e veículos com a Lume!
                    </p>
                </div>

                {/* Trustindex Widget Wrapper */}
                <div
                    ref={widgetRef}
                    className="w-full flex justify-center"
                    style={{ minHeight: '300px' }} // Ensures the space doesn't collapse before the widget loads
                >
                    {/* Trustindex will inject its iframe/HTML here automatically */}
                </div>
            </div>
        </section>
    );
}
