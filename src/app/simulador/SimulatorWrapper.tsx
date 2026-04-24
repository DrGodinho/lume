'use client';

import dynamic from 'next/dynamic';

const Simulator = dynamic(() => import('../../views/Simulator').then(mod => mod.SimulatorPage), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#04080f] flex items-center justify-center">
      <div className="text-[#c9a227] animate-pulse font-montserrat font-bold tracking-widest uppercase text-sm">
        Carregando Simulador...
      </div>
    </div>
  )
});

export function SimulatorWrapper() {
  return <Simulator />;
}
