import { BarChart3 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Relatórios',
  robots: { index: false, follow: false },
};

export default function RelatoriosPage() {
  return (
    <div className="min-h-screen bg-[#040811] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#c9a227]/20 bg-white/5 backdrop-blur-md px-10 py-12">
        <BarChart3 className="w-12 h-12 text-[#c9a227]/60" />
        <h1 className="text-xl font-montserrat font-bold text-white tracking-wider">
          Relatórios
        </h1>
        <p className="text-sm text-white/40 text-center max-w-xs">
          Em breve: análises detalhadas de faturamento, conversão e desempenho comercial.
        </p>
      </div>
    </div>
  );
}
