import type { Metadata } from 'next';
import { AdminWrapper } from './AdminWrapper';

export const metadata: Metadata = {
  title: 'Calculadora Admin | LUME Controle Solar',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminWrapper />;
}
