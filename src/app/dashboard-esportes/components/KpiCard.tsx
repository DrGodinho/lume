'use client';

import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  subtext?: string;
  icon: LucideIcon;
  colorClass: string;
}

export function KpiCard({ title, value, suffix = '', subtext, icon: Icon, colorClass }: KpiCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-md border border-slate-800 bg-slate-900/75 p-3 shadow-lg shadow-slate-950/15 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700">
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-current ${colorClass}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:text-[11px]">{title}</p>
          <h3 className="mt-1.5 text-lg font-black tracking-tight text-white sm:text-xl xl:text-2xl">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            {suffix && <span className="ml-1 text-[11px] font-semibold text-slate-500 sm:text-xs">{suffix}</span>}
          </h3>
          {subtext && <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-500 sm:text-xs">{subtext}</p>}
        </div>
        <div className={`rounded-sm border border-slate-800 bg-slate-950 p-2 ${colorClass}`}>
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        </div>
      </div>
    </article>
  );
}
