import type { Metadata } from 'next';
import { DadosWrapper } from './DadosWrapper';

export const metadata: Metadata = {
  title: 'Dados Cloud | LUME Controle Solar',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DadosWrapper />;
}
