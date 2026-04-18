import type { Metadata } from 'next';
import { NotFound } from '../views/NotFound';

export const metadata: Metadata = {
  title: 'Página Não Encontrada | LUME Controle Solar',
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return <NotFound />;
}
