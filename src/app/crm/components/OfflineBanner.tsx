'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const update = () => setIsOnline(navigator.onLine);

    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center gap-2 bg-red-500/90 px-4 py-2 text-center text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
    >
      <WifiOff className="h-4 w-4" />
      Sem conexao. Verifique se o tablet ainda esta na mesma rede do notebook. As alteracoes
      ficam salvas localmente e sincronizam ao reconectar.
    </div>
  );
}
