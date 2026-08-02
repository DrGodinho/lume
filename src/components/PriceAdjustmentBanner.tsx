'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { GtagLink } from './GtagLink';

const REAJUST_DATE = new Date('2026-08-31T23:59:59-03:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ZERO_TIME: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

const getTimeLeft = (now: number): TimeLeft => {
  const diff = REAJUST_DATE.getTime() - now;
  if (diff <= 0) return ZERO_TIME;
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
};

const pad = (value: number) => String(value).padStart(2, '0');

const TIME_UNITS: Array<{ key: keyof TimeLeft; label: string }> = [
  { key: 'days', label: 'Dias' },
  { key: 'hours', label: 'Horas' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Seg' },
];

export function PriceAdjustmentBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO_TIME);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      if (now >= REAJUST_DATE.getTime()) {
        setExpired(true);
        return;
      }
      setTimeLeft(getTimeLeft(now));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (expired) return null;

  return (
    <section className="relative overflow-hidden bg-[#070f1a]">
      <div className="absolute inset-x-0 top-0 h-px gradient-gold animate-shimmer" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#c9a227]/20" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full bg-[#c9a227]/[0.07] blur-3xl pointer-events-none" />

      <div className="container-lume relative z-10 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-7 lg:gap-10">
          <div className="text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a227]/10 border border-[#c9a227]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse flex-shrink-0" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#c9a227]">
                Reajuste de Preços
              </span>
            </div>
            <h2 className="font-montserrat text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              Preços reajustados em <span className="text-gradient-gold">31 de agosto</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-400 leading-relaxed">
              Garanta o valor atual da tabela no seu orçamento antes do novo preço entrar em vigor.
            </p>
          </div>

          <div className="flex flex-col items-center gap-5">
            <div className="flex items-stretch gap-2 sm:gap-3">
              {TIME_UNITS.map(({ key, label }) => (
                <div
                  key={key}
                  className="w-16 sm:w-20 text-center px-1 py-3 sm:py-4 rounded-xl bg-[#04080f] border border-[#c9a227]/25"
                >
                  <div className="font-montserrat text-2xl sm:text-3xl font-bold text-[#e8d179] tabular-nums">
                    {pad(timeLeft[key])}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-gray-500">{label}</div>
                </div>
              ))}
            </div>
            <GtagLink
              href="https://wa.me/5521965140612"
              target="_blank"
              rel="noopener noreferrer"
              eventName="conversion_event_contact"
              className="btn-primary flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Garantir Preço Atual</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </GtagLink>
          </div>
        </div>
      </div>
    </section>
  );
}
