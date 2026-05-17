'use client';

import dynamic from 'next/dynamic';

const AdminDados = dynamic(() => import('../../../views/AdminDados').then(mod => mod.AdminDados), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#040811] flex items-center justify-center">
      <div className="text-[#c9a227] animate-pulse font-montserrat font-bold tracking-widest uppercase">
        Carregando Dados...
      </div>
    </div>
  )
});

export function DadosWrapper() {
  return <AdminDados />;
}
