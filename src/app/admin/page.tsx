import type { Metadata } from 'next';
import { AdminCalculator } from '../../views/AdminCalculator';

export const metadata: Metadata = {
  title: 'Calculadora Admin | LUME Controle Solar',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminCalculator />;
}
