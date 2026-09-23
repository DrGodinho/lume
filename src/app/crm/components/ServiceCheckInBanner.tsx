'use client';

import { useState } from 'react';
import { differenceInDays, format, isPast, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarClock, CheckCircle2, Calendar, X, AlertTriangle } from 'lucide-react';
import type { Lead, ServiceStatus } from '../types';

export interface ServiceCheckInBannerProps {
  pendingServices: Lead[];
  onCompleteService: (leadId: string) => Promise<void>;
  onRescheduleService: (leadId: string, newDate: string) => Promise<void>;
  onMarkLost: (lead: Lead) => Promise<void> | void;
  onAbrirLead: (lead: Lead) => void;
  getLeadServiceDate: (lead: Lead) => Date | null;
  getLeadServiceStatus: (lead: Lead) => ServiceStatus;
  getWhatsAppHref: (lead: Lead) => string;
  formatCurrencyBRL?: (value: number) => string;
}

export function ServiceCheckInBanner({
  pendingServices,
  onCompleteService,
  onRescheduleService,
  onMarkLost,
  onAbrirLead,
  getLeadServiceDate,
  getLeadServiceStatus,
  getWhatsAppHref,
  formatCurrencyBRL = (val) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val),
}: ServiceCheckInBannerProps) {
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  if (pendingServices.length === 0) return null;

  const handleComplete = async (leadId: string) => {
    setActionLoadingId(leadId);
    try {
      await onCompleteService(leadId);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmReschedule = async (leadId: string) => {
    if (!rescheduleDate) return;
    setActionLoadingId(leadId);
    try {
      await onRescheduleService(leadId, rescheduleDate);
      setReschedulingId(null);
      setRescheduleDate('');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLost = async (lead: Lead) => {
    setActionLoadingId(lead.id);
    try {
      await onMarkLost(lead);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-[#c9a227]/30 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,39,0.14),_transparent_60%),linear-gradient(180deg,#0a1524_0%,#050b14_100%)] p-6 shadow-2xl shadow-black/40">
      {/* Decorative top accent line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a227]/60 to-transparent" />

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#c9a227]/30 bg-[#c9a227]/10 text-[#f5d77a] shadow-[0_0_15px_rgba(201,162,39,0.15)]">
            <CalendarClock className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f5d77a]">Ação do Dia</span>
              <span className="rounded-full border border-[#c9a227]/30 bg-[#c9a227]/15 px-2 py-0.5 text-[10px] font-bold text-[#f5d77a]">
                {pendingServices.length} {pendingServices.length === 1 ? 'pendência' : 'pendências'}
              </span>
            </div>
            <h3 className="mt-0.5 font-display text-lg font-black tracking-tight text-white sm:text-xl">
              Check-in de Serviços Agendados
            </h3>
          </div>
        </div>
        <p className="text-xs text-white/50 max-w-sm sm:text-right">
          Confirme a realização dos serviços previstos para hoje ou atualize a data caso tenha havido imprevisto.
        </p>
      </div>

      {/* List of pending service cards */}
      <div className="mt-5 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {pendingServices.map((lead) => {
          const serviceDate = getLeadServiceDate(lead);
          const isTodayService = serviceDate ? isToday(serviceDate) : false;
          const isOverdue = serviceDate ? isPast(serviceDate) && !isToday(serviceDate) : false;
          const daysOverdue = serviceDate ? differenceInDays(new Date(), serviceDate) : 0;
          const isReschedulingThis = reschedulingId === lead.id;
          const isLoadingThis = actionLoadingId === lead.id;

          return (
            <div
              key={lead.id}
              className={`flex flex-col justify-between rounded-2xl border p-4.5 transition-all duration-200 ${
                isTodayService
                  ? 'border-[#c9a227]/25 bg-white/[0.03] shadow-md shadow-black/20 hover:border-[#c9a227]/45'
                  : 'border-amber-500/25 bg-amber-500/[0.03] shadow-md shadow-black/20 hover:border-amber-500/40'
              }`}
            >
              <div>
                {/* Status tag & value */}
                <div className="flex items-start justify-between gap-2">
                  {isTodayService ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#c9a227]/40 bg-[#c9a227]/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#f5d77a] shadow-[0_0_8px_rgba(201,162,39,0.2)] animate-pulse">
                      Hoje
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      <AlertTriangle className="h-3 w-3" />
                      Pendente há {daysOverdue} {daysOverdue === 1 ? 'dia' : 'dias'}
                    </span>
                  )}
                  {lead.value > 0 && (
                    <span className="text-xs font-black text-white/90">{formatCurrencyBRL(lead.value)}</span>
                  )}
                </div>

                {/* Lead Name & Details */}
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={() => onAbrirLead(lead)}
                    className="group flex items-baseline gap-1.5 text-left"
                  >
                    <span className="text-sm font-bold text-white transition group-hover:text-[#f5d77a]">
                      {lead.name}
                    </span>
                  </button>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-white/50">
                    {lead.neighborhood && <span>{lead.neighborhood}</span>}
                    {lead.neighborhood && lead.filmType && <span>•</span>}
                    {lead.filmType && <span className="text-white/70">{lead.filmType}</span>}
                    {serviceDate && (
                      <>
                        <span>•</span>
                        <span>{format(serviceDate, "dd 'de' MMM", { locale: ptBR })}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-white/5">
                {isReschedulingThis ? (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-white/50">
                      Nova data do serviço
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        min={format(new Date(), 'yyyy-MM-dd')}
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#c9a227]/40"
                      />
                      <button
                        type="button"
                        onClick={() => handleConfirmReschedule(lead.id)}
                        disabled={!rescheduleDate || isLoadingThis}
                        className="rounded-xl bg-[#c9a227] px-3 py-1.5 text-xs font-bold text-[#04080f] transition hover:brightness-110 disabled:opacity-40"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReschedulingId(null);
                          setRescheduleDate('');
                        }}
                        className="rounded-xl border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-white/60 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Concluir Serviço (1-clique) */}
                    <button
                      type="button"
                      disabled={isLoadingThis}
                      onClick={() => handleComplete(lead.id)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition hover:brightness-110 disabled:opacity-50"
                      title="Marcar serviço como concluído e fechar venda"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Concluir
                    </button>

                    {/* Reagendar */}
                    <button
                      type="button"
                      disabled={isLoadingThis}
                      onClick={() => {
                        setReschedulingId(lead.id);
                        setRescheduleDate(format(new Date(), 'yyyy-MM-dd'));
                      }}
                      className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2 text-xs font-semibold text-white/80 transition hover:border-[#c9a227]/30 hover:text-[#f5d77a] disabled:opacity-50"
                      title="Reagendar este serviço para outra data"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Reagendar
                    </button>

                    {/* Não Realizado / Perdido */}
                    <button
                      type="button"
                      disabled={isLoadingThis}
                      onClick={() => handleLost(lead)}
                      className="inline-flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-2.5 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                      title="Marcar como não realizado / cancelado"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    {/* WhatsApp */}
                    {getWhatsAppHref(lead) && (
                      <a
                        href={getWhatsAppHref(lead)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-2.5 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/10"
                        title="Abrir WhatsApp com cliente"
                      >
                        WPP
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
