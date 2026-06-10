import type { Metadata } from 'next';
import { AdminBlogClient } from './AdminBlogClient';

export const metadata: Metadata = {
  title: 'Admin Blog | LUME Controle Solar',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminBlogClient />;
}
