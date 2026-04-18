import type { Metadata } from 'next';
import { GuiaInsulfilm } from '../../views/GuiaInsulfilm';

export const metadata: Metadata = {
  title: 'Guia Completo de Insulfilm Residencial 2025 | Tudo Sobre Películas - LUME',
  description: 'Guia definitivo sobre insulfilm residencial: tipos, preços, vantagens e como escolher a melhor película para sua casa. Comparativo técnico completo.',
  alternates: { canonical: 'https://lumecontrolesolar.com.br/guia-insulfilm' },
};

export default function Page() {
  return <GuiaInsulfilm />;
}
