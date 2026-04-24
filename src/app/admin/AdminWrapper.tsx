'use client';

import dynamic from 'next/dynamic';

const AdminCalculator = dynamic(() => import('../../views/AdminCalculator').then(mod => mod.AdminCalculator), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#040811] flex items-center justify-center">
      <div className="text-[#c9a227] animate-pulse font-montserrat font-bold tracking-widest uppercase">
        Carregando Ferramenta...
      </div>
    </div>
  )
});

export function AdminWrapper() {
  return <AdminCalculator />;
}
