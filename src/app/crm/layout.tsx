import { Metadata } from 'next';
import { ToastProvider } from './hooks/useToast';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'CRM - LUME Controle Solar',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
