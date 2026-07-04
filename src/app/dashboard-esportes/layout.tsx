import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Impacto Econômico dos Esportes | FGV/ABDI',
  description:
    'Dashboard executivo de análise do impacto econômico de 8 modalidades esportivas brasileiras com dados da FGV/ABDI.',
  robots: 'noindex, nofollow',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
