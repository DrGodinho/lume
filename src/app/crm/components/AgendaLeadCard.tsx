'use client';

import { useState } from 'react';
import { differenceInDays, format, isPast, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarPlus } from 'lucide-react';
import { WhatsAppTemplateMenu, type WhatsAppTemplateType } from './WhatsAppTemplateMenu';
import { buildGoogleCalendarUrl } from '../utils/googleCalendar';
import type { Lead, LeadCardKind, ServiceStatus, ServiceStatusMeta } from '../types';

interface AgendaLeadCardProps {
  lead: Lead;
  kind?: LeadCardKind;
  onAgendar: (leadId: string, data: string) => Promise<void>;
  onMarcarFeito: (leadId: string) => Promise<void>;
  onSetDormant: (leadId: string, dormant: boolean) => Promise<void>;
  onUpdateServiceStatus: (leadId: string, serviceStatus: ServiceStatus) => Promise<void>;
  onAbrirLead: (lead: Lead) => void;
  onRestoreFromArchive?: (lead: Lead) => Promise<void>;
  getLeadFollowUpDate: (lead: Lead) => Date | null;
  getLeadServiceDate: (lead: Lead) => Date | null;
  getLeadActivityDate: (lead: Lead) => Date | null;
  getLeadServiceStatus: (lead: Lead) => ServiceStatus;
  getLeadStatusClasses: (status: Lead['status']) => string;
  getLeadPhoneHref: (phone?: string | null) => string;
  getWhatsAppHref: (lead: Lead, template?: WhatsAppTemplateType) => string;
  serviceStatusMeta: Record<ServiceStatus, ServiceStatusMeta>;
}

export function AgendaLeadCard({
  lead,
  kind = 'followup',
  onAgendar,
  onMarcarFeito,
  onSetDormant,
  onUpdateServiceStatus,
  onAbrirLead,
  onRestoreFromArchive,
  getLeadFollowUpDate,
  getLeadServiceDate,
  getLeadActivityDate,
  getLeadServiceStatus,
  getLeadStatusClasses,
  getLeadPhoneHref,
  getWhatsAppHref,
  serviceStatusMeta,
}: AgendaLeadCardProps) {
  const [agendando, setAgendando] = useState(false);
  const [novaData, setNovaData] = useState('');
  const [salvando, setSalvando] = useState(false);

  const followUpDate = getLeadFollowUpDate(lead);
  const serviceDate = getLeadServiceDate(lead);
  const activityDate = getLeadActivityDate(lead);
  const inactivityDays = activityDate ? differenceInDays(new Date(), activityDate) : null;
  const atrasado = !!followUpDate && isPast(followUpDate) && !isToday(followUpDate);
  const hasFollowUp = !!followUpDate;
  const isServiceCard = kind === 'service';
  const isIdleCard = kind === 'idle';
  const isDormantCard = kind === 'dormant';
  const serviceStatus = getLeadServiceStatus(lead);
  const serviceMeta = serviceStatusMeta[serviceStatus];

  const isFiveYearsCompleted = serviceDate ? differenceInDays(new Date(), serviceDate) >= 1826 : false;

  const cardLabel = isFiveYearsCompleted && lead.archived
    ? 'Ciclo 5 Anos'
    : isServiceCard
      ? 'Serviço'
      : isDormantCard
        ? 'Dormente'
        : isIdleCard
          ? 'Sem próxima ação'
          : 'Follow-up';

  const cardClasses = atrasado
    ? 'border-red-500/20 bg-red-500/[0.06] hover:border-red-500/35'
    : isFiveYearsCompleted && lead.archived
      ? 'border-[#c9a227]/40 bg-[#c9a227]/[0.08] hover:border-[#c9a227]/60 shadow-[inset_0_0_12px_rgba(201,162,39,0.06)]'
      : isServiceCard
        ? 'border-sky-500/15 bg-sky-500/[0.05] hover:border-sky-500/30'
        : isDormantCard
          ? 'border-slate-500/20 bg-slate-500/[0.05] hover:border-slate-500/30'
        : isIdleCard
          ? 'border-white/10 bg-white/[0.025] hover:border-[#c9a227]/20'
          : 'border-white/5 bg-[#04080f]/90 hover:border-[#c9a227]/20';

  const salvarAgendamento = async () => {
    if (!novaData) return;
    setSalvando(true);
    try {
      await onAgendar(lead.id, novaData);
      setAgendando(false);
      setNovaData('');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <article className={`group rounded-3xl border p-5 shadow-lg transition duration-300 ${cardClasses}`}>
      <div className="flex items-start justify-between gap-3">
        <button onClick={() => onAbrirLead(lead)} className="min-w-0 text-left">
          <span
            className={`mb-2 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
              isFiveYearsCompleted && lead.archived
                ? 'border-[#c9a227]/40 bg-[#c9a227]/20 text-[#f5d77a]'
                : isServiceCard
                  ? 'border-sky-500/20 bg-sky-500/10 text-sky-300'
                  : isDormantCard
                    ? 'border-slate-500/20 bg-slate-500/10 text-slate-300'
                  : isIdleCard
                    ? 'border-white/10 bg-white/[0.03] text-white/45'
                    : 'border-[#c9a227]/20 bg-[#c9a227]/10 text-[#f5d77a]'
            }`}
          >
            {cardLabel}
          </span>
          <p className="truncate text-sm font-bold text-white transition group-hover:text-[#f5d77a]">{lead.name}</p>
          <p className="mt-1 text-[11px] text-white/40">
            {lead.neighborhood} · {lead.filmType}
          </p>
        </button>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${getLeadStatusClasses(lead.status)}`}>
            {lead.status}
          </span>
          {isServiceCard && (
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${serviceMeta.badge}`}>
              {serviceMeta.label}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
        {atrasado && (
          <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-red-300">
            Atrasado
          </span>
        )}
        {!hasFollowUp && inactivityDays !== null && inactivityDays >= 3 && (
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-white/50">
            Parado ha {inactivityDays}d
          </span>
        )}
        {lead.dormant && (
          <span className="rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-1 text-slate-300">
            Dormente
          </span>
        )}
        {hasFollowUp && followUpDate && (
          <span className="rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-2.5 py-1 text-[#f2d98a]">
            {atrasado ? `Atrasado ha ${differenceInDays(new Date(), followUpDate)}d` : `Retorno ${format(followUpDate, "d 'de' MMM", { locale: ptBR })}`}
          </span>
        )}
        {serviceDate && (
          <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-sky-300">
            Servico {format(serviceDate, "d 'de' MMM", { locale: ptBR })}
          </span>
        )}
      </div>

      <div className={`mt-4 grid gap-3 text-xs text-white/55 ${isServiceCard ? 'grid-cols-2 xl:grid-cols-3' : 'grid-cols-2'}`}>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">Telefone</p>
          {getLeadPhoneHref(lead.phone) ? (
            <a href={getLeadPhoneHref(lead.phone)} className="mt-1 inline-flex font-medium text-white transition hover:text-[#f5d77a]">
              {lead.phone}
            </a>
          ) : (
            <p className="mt-1 font-medium text-white">Sem telefone</p>
          )}
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">Bairro</p>
          <p className="mt-1 font-medium text-white">{lead.neighborhood || 'Sem bairro'}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">Valor</p>
          <p className="mt-1 font-semibold text-[#f5d77a]">
            R$ {lead.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        {isServiceCard && (
          <>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">Endereco</p>
              <p className="mt-1 line-clamp-2 font-medium text-white">{lead.address || 'Sem endereco'}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">Pelicula</p>
              <p className="mt-1 font-medium text-white">{lead.filmType}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">Metragem</p>
              <p className="mt-1 font-medium text-white">{lead.sqm.toFixed(2)} m²</p>
            </div>
          </>
        )}
      </div>

      {agendando ? (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="date"
            value={novaData}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => setNovaData(e.target.value)}
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a227]/40"
          />
          <button
            onClick={salvarAgendamento}
            disabled={!novaData || salvando}
            className="rounded-2xl bg-[#c9a227] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#04080f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            onClick={() => {
              setAgendando(false);
              setNovaData('');
            }}
            className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/[0.03] hover:text-white"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setAgendando(true)}
            className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-[#c9a227]/40 hover:text-[#f5d77a]"
          >
            {hasFollowUp ? 'Reagendar retorno' : 'Agendar retorno'}
          </button>
          {lead.archived && onRestoreFromArchive && (
            <button
              onClick={() => onRestoreFromArchive(lead)}
              className="rounded-2xl border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-2 text-xs font-bold text-[#f5d77a] transition hover:bg-[#c9a227]/25"
            >
              Reativar
            </button>
          )}
          {!isServiceCard && !lead.archived && (
            <button
              onClick={() => onSetDormant(lead.id, !lead.dormant)}
              className="rounded-2xl border border-slate-500/20 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-500/10"
            >
              {lead.dormant ? 'Reativar lead' : 'Marcar dormente'}
            </button>
          )}
          {hasFollowUp && (
            <button
              onClick={() => onMarcarFeito(lead.id)}
              className="rounded-2xl border border-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/10"
            >
              Feito
            </button>
          )}
          {getWhatsAppHref(lead) && (
            <a
              href={getWhatsAppHref(lead)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-emerald-500/40 hover:text-emerald-300"
            >
              WhatsApp
            </a>
          )}
          <WhatsAppTemplateMenu getHref={(template) => getWhatsAppHref(lead, template)} />
          {serviceDate && (
            <a
              href={buildGoogleCalendarUrl(lead, serviceDate)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/15"
              title="Adicionar este serviço ao Google Calendar"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              Google Calendar
            </a>
          )}
          <button
            onClick={() => onAbrirLead(lead)}
            className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
          >
            Abrir
          </button>
        </div>
      )}

      {isServiceCard && (
        <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">Status do servico</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(serviceStatusMeta) as ServiceStatus[]).map((statusOption) => (
              <button
                key={statusOption}
                type="button"
                onClick={() => onUpdateServiceStatus(lead.id, statusOption)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                  statusOption === serviceStatus
                    ? serviceStatusMeta[statusOption].button
                    : 'border-white/10 bg-white/[0.02] text-white/55 hover:border-white/20 hover:text-white'
                }`}
              >
                {serviceStatusMeta[statusOption].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
