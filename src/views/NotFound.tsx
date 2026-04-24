'use client';

import { useEffect } from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';

export function NotFound() {
    useEffect(() => {
        // Entrance Animation
        const tl = gsap.timeline();
        
        tl.fromTo('.error-code', 
            { opacity: 0, scale: 0.8, y: 50 },
            { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.7)' }
        );
        
        tl.fromTo('.error-text',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.2 },
            '-=0.5'
        );

        // Floating animation for the 404
        gsap.to('.error-code', {
            y: -20,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        // Ambient glow animation
        gsap.to('.ambient-glow', {
            opacity: 0.4,
            scale: 1.2,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }, []);

    return (
        <div className="bg-[#04080f] text-white min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-20">

            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="ambient-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c9a227] rounded-full blur-[150px] opacity-10" />
                <div className="absolute inset-0" style={{ 
                    backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px' 
                }} />
            </div>

            <div className="container-lume relative z-10 text-center">
                <div className="error-code text-[150px] md:text-[220px] font-bold font-montserrat leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#c9a227] to-[#8a6d1a] drop-shadow-[0_0_30px_rgba(201,162,39,0.3)] inline-block">
                    404
                </div>

                <div className="error-text">
                    <h1 className="text-3xl md:text-5xl font-bold font-montserrat mb-6">
                        Página Perdida no Espaço
                    </h1>
                    
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Parece que a película que você estava procurando foi perfeitamente instalada... e agora está invisível. Desculpe, mas esta página não existe.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            href="/" 
                            className="btn-primary flex items-center gap-3 px-8 py-4 text-lg w-full sm:w-auto justify-center"
                        >
                            <Home size={20} /> Voltar ao Início
                        </Link>
                        
                        <button 
                            onClick={() => window.history.back()}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-full transition-all flex items-center gap-3 text-lg font-bold w-full sm:w-auto justify-center"
                        >
                            <ArrowLeft size={20} /> Voltar Anterior
                        </button>
                    </div>
                </div>

                {/* Products Links as helping hand */}
                <div className="error-text mt-20">
                    <p className="text-gray-500 uppercase tracking-widest text-sm font-bold mb-8">
                        Talvez você estivesse procurando por:
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {[
                            { name: 'Nano Cerâmica', path: '/nano-ceramica' },
                            { name: 'Carbono', path: '/carbono' },
                            { name: 'Dupla Camada', path: '/dupla-camada' },
                            { name: 'Simulador', path: '/simulador' },
                            { name: 'Orçamento', path: '/orcamento' },
                        ].map((link) => (
                            <Link 
                                key={link.path}
                                href={link.path}
                                className="text-gray-400 hover:text-[#c9a227] transition-colors font-medium border-b border-white/5 hover:border-[#c9a227]/50 pb-1"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
