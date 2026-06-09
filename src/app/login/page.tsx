'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Sun, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toast.error(data?.error || 'Credenciais invalidas. Tente novamente.');
        setLoading(false);
        return;
      }

      window.location.href = '/crm/';
    } catch {
      toast.error('Erro inesperado. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0f1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <div className="min-h-screen bg-[#040811] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#c9a227]/30 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c9a227] to-[#8a6d10] flex items-center justify-center">
              <Sun className="w-7 h-7 text-[#040811]" />
            </div>
            <h1 className="text-2xl font-montserrat font-bold tracking-widest uppercase text-white">
              LUME
            </h1>
            <p className="text-sm text-white/50">Controle Solar - CRM</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]/40"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-lg bg-gradient-to-r from-[#c9a227] to-[#8a6d10] text-[#040811] font-bold tracking-wider uppercase text-sm transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
