import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAccessToken } from '@/lib/crm-auth';
import { AdminWrapper } from './AdminWrapper';

export const metadata: Metadata = {
  title: 'Calculadora Admin | LUME Controle Solar',
  robots: { index: false, follow: false },
};

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('crm-token')?.value;

  if (!accessToken) {
    redirect('/login/?redirectTo=/admin/');
  }

  const payload = await verifyAccessToken(accessToken);
  if (!payload || !payload.email) {
    redirect('/login/?redirectTo=/admin/');
  }

  return <AdminWrapper />;
}
