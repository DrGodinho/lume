'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isPast,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WhatsAppTemplateMenu, type WhatsAppTemplateType } from './WhatsAppTemplateMenu';
import type { AgendaView, Lead, LeadCardKind, ServiceStatus, ServiceStatusMeta } from '../types';

interface AgendaSectionProps {
  leads: Lead[];
  initialView?: AgendaView;
  onAgendarRetorno: (leadId: string, data: string) => Promise<void>;
  onMarcarFeito: (leadId: string) => Promise<void>;
  onSetDormant: (leadId: string, dormant: boolean) => Promise<void>;
  onUpdateServiceStatus: (leadId: string, serviceStatus: ServiceStatus) => Promise<void>;
  onAbrirLead: (lead: Lead) => void;
  isClosedLead: (status: Lead['status']) => boolean;
  getLeadFollowUpDate: (lead: Lead) => Date | null;
  getLeadServiceDate: (lead: Lead) => Date | null;
  getLeadActivityDate: (lead: Lead) => Date | null;
  getLeadServiceStatus: (lead: Lead) => ServiceStatus;
  getLeadStatusClasses: (status: Lead['status']) => string;
  getLeadPhoneHref: (phone?: string | null) => string;
  getWhatsAppHref: (lead: Lead, template?: WhatsAppTemplateType) => string;
  formatCurrencyBRL: (value: number) => string;
  serviceStatusMeta: Record<ServiceStatus, ServiceStatusMeta>;
}

interface LeadCardAgendaProps {
  lead: Lead;
  kind?: LeadCardKind;
  onAgendar: (leadId: string, data: string) => Promise<void>;
  onMarcarFeito: (leadId: string) => Promise<void>;
  onSetDormant: (leadId: string, dormant: boolean) => Promise<void>;
  onUpdateServiceStatus: (leadId: string, serviceStatus: ServiceStatus) => Promise<void>;
  onAbrirLead: (lead: Lead) => void;
  getLeadFollowUpDate: (lead: Lead) => Date | null;
  getLeadServiceDate: (lead: Lead) => Date | null;
  getLeadActivityDate: (lead: Lead) => Date | null;
  getLeadServiceStatus: (lead: Lead) => ServiceStatus;
  getLeadStatusClasses: (status: Lead['status']) => string;
  getLeadPhoneHref: (phone?: string | null) => string;
  getWhatsAppHref: (lead: Lead, template?: WhatsAppTemplateType) => string;
  serviceStatusMeta: Record<ServiceStatus, ServiceStatusMeta>;
}

function LeadCardAgenda({
  lead,
  kind = 'followup',
  onAgendar,
  onMarcarFeito,
  onSetDormant,
  onUpdateServiceStatus,
  onAbrirLead,
  getLeadFollowUpDate,
  getLeadServiceDate,
  getLeadActivityDate,
  getLeadServiceStatus,
  getLeadStatusClasses,
  getLeadPhoneHref,
  getWhatsAppHref,
  serviceStatusMeta,
}: LeadCardAgendaProps) {
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
  const cardLabel = isServiceCard ? 'Serviço' : isDormantCard ? 'Dormente' : isIdleCard ? 'Sem próxima ação' : 'Follow-up';
  const cardClasses = atrasado
    ? 'border-red-500/20 bg-red-500/[0.06] hover:border-red-500/35'
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
              isServiceCard
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
          {!isServiceCard && (
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

export function AgendaSection({
  leads,
  initialView = 'hoje',
  onAgendarRetorno,
  onMarcarFeito,
  onSetDormant,
  onUpdateServiceStatus,
  onAbrirLead,
  isClosedLead,
  getLeadFollowUpDate,
  getLeadServiceDate,
  getLeadActivityDate,
  getLeadServiceStatus,
  getLeadStatusClasses,
  getLeadPhoneHref,
  getWhatsAppHref,
  formatCurrencyBRL,
  serviceStatusMeta,
}: AgendaSectionProps) {
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [agendaView, setAgendaView] = useState<AgendaView>('hoje');
  const [mesVisivel, setMesVisivel] = useState(() => startOfMonth(new Date()));

  useEffect(() => {
    setAgendaView(initialView);
  }, [initialView]);

  const hoje = useMemo(() => new Date(), []);
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 });
  const diasSemana = Array.from({ length: 7 }, (_, index) => addDays(inicioSemana, index));
  const inicioGradeMes = startOfWeek(startOfMonth(mesVisivel), { weekStartsOn: 1 });
  const fimGradeMes = endOfWeek(endOfMonth(mesVisivel), { weekStartsOn: 1 });
  const diasMes = eachDayOfInterval({ start: inicioGradeMes, end: fimGradeMes });
  const agendaViews: Array<{ id: AgendaView; label: string; count: number }> = [];

  const leadsAtivos = useMemo(() => leads.filter((lead) => !isClosedLead(lead.status)), [isClosedLead, leads]);
  const leadsComRetorno = useMemo(() => leadsAtivos.filter((lead) => !!lead.proximoContato), [leadsAtivos]);
  const leadsComServico = useMemo(() => leadsAtivos.filter((lead) => !!lead.dataServico), [leadsAtivos]);

  const contactarHoje = useMemo(() => {
    return leadsAtivos.filter((lead) => {
      const followUpDate = getLeadFollowUpDate(lead);
      if (!followUpDate) return false;
      if (diaSelecionado) {
        if (isToday(diaSelecionado)) {
          return isSameDay(followUpDate, diaSelecionado) || isPast(followUpDate);
        }
        return isSameDay(followUpDate, diaSelecionado);
      }
      return isToday(followUpDate) || isPast(followUpDate);
    });
  }, [diaSelecionado, getLeadFollowUpDate, leadsAtivos]);

  const proximos7Dias = useMemo(() => {
    return leadsAtivos.filter((lead) => {
      const followUpDate = getLeadFollowUpDate(lead);
      if (!followUpDate) return false;

      const withinNextWeek = isWithinInterval(followUpDate, {
        start: addDays(hoje, 1),
        end: addDays(hoje, 7),
      });

      if (!withinNextWeek) return false;
      if (!diaSelecionado) return true;
      return isSameDay(followUpDate, diaSelecionado);
    });
  }, [diaSelecionado, getLeadFollowUpDate, leadsAtivos, hoje]);

  const parados = useMemo(() => {
    return leadsAtivos.filter((lead) => {
      if (lead.dormant) return false;
      if (lead.proximoContato || lead.dataServico) return false;
      const activityDate = getLeadActivityDate(lead);
      if (!activityDate) return false;
      return differenceInDays(hoje, activityDate) >= 3;
    });
  }, [getLeadActivityDate, hoje, leadsAtivos]);

  const dormentes = useMemo(() => {
    return leadsAtivos
      .filter((lead) => lead.dormant)
      .sort((a, b) => {
        const aDate = getLeadActivityDate(a)?.getTime() || 0;
        const bDate = getLeadActivityDate(b)?.getTime() || 0;
        return bDate - aDate;
      });
  }, [getLeadActivityDate, leadsAtivos]);

  const emDiaCount = useMemo(() => {
    return leadsAtivos.filter((lead) => {
      if (lead.proximoContato) return false;
      const activityDate = getLeadActivityDate(lead);
      if (!activityDate) return true;
      return differenceInDays(hoje, activityDate) < 3;
    }).length;
  }, [getLeadActivityDate, hoje, leadsAtivos]);

  const servicosAgendados = useMemo(() => {
    return leadsComServico
      .filter((lead) => {
        const serviceDate = getLeadServiceDate(lead);
        if (!serviceDate) return false;
        return diaSelecionado ? isSameDay(serviceDate, diaSelecionado) : true;
      })
      .sort((a, b) => {
        const aDate = getLeadServiceDate(a)?.getTime() || 0;
        const bDate = getLeadServiceDate(b)?.getTime() || 0;
        return aDate - bDate;
      });
  }, [diaSelecionado, getLeadServiceDate, leadsComServico]);

  const servicosHoje = useMemo(() => {
    return leadsComServico.filter((lead) => {
      const serviceDate = getLeadServiceDate(lead);
      return serviceDate ? isSameDay(serviceDate, diaSelecionado || hoje) : false;
    });
  }, [diaSelecionado, getLeadServiceDate, hoje, leadsComServico]);

  const serviceStatusCounts = useMemo(() => {
    return servicosAgendados.reduce<Record<ServiceStatus, number>>((acc, lead) => {
      const status = getLeadServiceStatus(lead);
      acc[status] += 1;
      return acc;
    }, {
      Marcado: 0,
      Confirmado: 0,
      'Em Execucao': 0,
      Concluido: 0,
      Reagendar: 0,
    });
  }, [getLeadServiceStatus, servicosAgendados]);

  const serviceRouteGroups = useMemo(() => {
    const grouped = servicosAgendados.reduce<Record<string, Lead[]>>((acc, lead) => {
      const key = lead.neighborhood || 'Sem bairro';
      if (!acc[key]) acc[key] = [];
      acc[key].push(lead);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([neighborhood, items]) => ({
        neighborhood,
        items: items.sort((a, b) => {
          const aDate = getLeadServiceDate(a)?.getTime() || 0;
          const bDate = getLeadServiceDate(b)?.getTime() || 0;
          return aDate - bDate;
        }),
        totalValue: items.reduce((sum, lead) => sum + lead.value, 0),
      }))
      .sort((a, b) => b.items.length - a.items.length || b.totalValue - a.totalValue);
  }, [getLeadServiceDate, servicosAgendados]);

  const monthlyFollowUps = useMemo(() => {
    return leadsAtivos
      .filter((lead) => {
        const followUpDate = getLeadFollowUpDate(lead);
        if (!followUpDate || !isSameMonth(followUpDate, mesVisivel)) return false;
        return diaSelecionado ? isSameDay(followUpDate, diaSelecionado) : true;
      })
      .sort((a, b) => {
        const aDate = getLeadFollowUpDate(a)?.getTime() || 0;
        const bDate = getLeadFollowUpDate(b)?.getTime() || 0;
        return aDate - bDate;
      });
  }, [diaSelecionado, getLeadFollowUpDate, leadsAtivos, mesVisivel]);

  const monthlyServices = useMemo(() => {
    return leadsComServico
      .filter((lead) => {
        const serviceDate = getLeadServiceDate(lead);
        if (!serviceDate || !isSameMonth(serviceDate, mesVisivel)) return false;
        return diaSelecionado ? isSameDay(serviceDate, diaSelecionado) : true;
      })
      .sort((a, b) => {
        const aDate = getLeadServiceDate(a)?.getTime() || 0;
        const bDate = getLeadServiceDate(b)?.getTime() || 0;
        return aDate - bDate;
      });
  }, [diaSelecionado, getLeadServiceDate, leadsComServico, mesVisivel]);

  const activeMonthLeadCount = useMemo(() => {
    const uniqueIds = new Set(
      leadsAtivos
        .filter((lead) => {
          const followUpDate = getLeadFollowUpDate(lead);
          const serviceDate = getLeadServiceDate(lead);
          return (followUpDate && isSameMonth(followUpDate, mesVisivel)) || (serviceDate && isSameMonth(serviceDate, mesVisivel));
        })
        .map((lead) => lead.id),
    );
    return uniqueIds.size;
  }, [getLeadFollowUpDate, getLeadServiceDate, leadsAtivos, mesVisivel]);

  const followUpCountByDay = (day: Date) =>
    leadsComRetorno.filter((lead) => {
      const followUpDate = getLeadFollowUpDate(lead);
      return followUpDate ? isSameDay(followUpDate, day) : false;
    }).length;

  const serviceCountByDay = (day: Date) =>
    leadsComServico.filter((lead) => {
      const serviceDate = getLeadServiceDate(lead);
      return serviceDate ? isSameDay(serviceDate, day) : false;
    }).length;

  const agendaCountByDay = (day: Date) => followUpCountByDay(day) + serviceCountByDay(day);

  const monthFollowUpCountByDay = (day: Date) =>
    leadsComRetorno.filter((lead) => {
      const followUpDate = getLeadFollowUpDate(lead);
      return followUpDate ? isSameDay(followUpDate, day) : false;
    }).length;

  const monthServiceCountByDay = (day: Date) =>
    leadsComServico.filter((lead) => {
      const serviceDate = getLeadServiceDate(lead);
      return serviceDate ? isSameDay(serviceDate, day) : false;
    }).length;

  const monthValueByDay = (day: Date) =>
    leadsComServico.reduce((sum, lead) => {
      const serviceDate = getLeadServiceDate(lead);
      return serviceDate && isSameDay(serviceDate, day) ? sum + lead.value : sum;
    }, 0);

  const weeklyActionDays = diasSemana.map((day) => {
    const followUps = followUpCountByDay(day);
    const services = serviceCountByDay(day);
    const dayServices = leadsComServico.filter((lead) => {
      const serviceDate = getLeadServiceDate(lead);
      return serviceDate ? isSameDay(serviceDate, day) : false;
    });
    return {
      day,
      followUps,
      services,
      total: followUps + services,
      forecastValue: dayServices.reduce((sum, lead) => sum + lead.value, 0),
    };
  });

  const selectedDayLabel = diaSelecionado ? format(diaSelecionado, "EEEE, d 'de' MMMM", { locale: ptBR }) : '';
  const sectionsEmpty = contactarHoje.length === 0 && proximos7Dias.length === 0 && parados.length === 0 && servicosAgendados.length === 0;

  agendaViews.push(
    { id: 'hoje', label: diaSelecionado ? 'Dia selecionado' : 'Hoje', count: contactarHoje.length + servicosHoje.length },
    { id: 'semana', label: 'Proximos 7 dias', count: proximos7Dias.length },
    { id: 'mes', label: 'Mes', count: activeMonthLeadCount },
    { id: 'servicos', label: 'Servicos', count: servicosAgendados.length },
    { id: 'sem_acao', label: 'Sem acao', count: parados.length },
    { id: 'dormentes', label: 'Dormentes', count: dormentes.length },
  );

  const activeAgendaEmpty =
    (agendaView === 'hoje' && contactarHoje.length === 0 && servicosHoje.length === 0) ||
    (agendaView === 'semana' && proximos7Dias.length === 0) ||
    (agendaView === 'mes' && monthlyFollowUps.length === 0 && monthlyServices.length === 0) ||
    (agendaView === 'servicos' && servicosAgendados.length === 0) ||
    (agendaView === 'sem_acao' && parados.length === 0) ||
    (agendaView === 'dormentes' && dormentes.length === 0);

  const highlightDay = (day: Date) => {
    if (diaSelecionado && isSameDay(day, diaSelecionado)) {
      setDiaSelecionado(null);
      return;
    }
    setDiaSelecionado(day);
  };

  const goToPreviousMonth = () => {
    setMesVisivel((current) => subMonths(current, 1));
    setDiaSelecionado(null);
  };

  const goToNextMonth = () => {
    setMesVisivel((current) => addMonths(current, 1));
    setDiaSelecionado(null);
  };

  const monthActionDays = diasMes.map((day) => {
    const followUps = monthFollowUpCountByDay(day);
    const services = monthServiceCountByDay(day);
    const total = followUps + services;

    return {
      day,
      followUps,
      services,
      total,
      forecastValue: monthValueByDay(day),
    };
  });

  const renderLeadCard = (lead: Lead, kind: LeadCardKind) => (
    <LeadCardAgenda
      key={`${kind}-${lead.id}`}
      lead={lead}
      kind={kind}
      onAgendar={onAgendarRetorno}
      onMarcarFeito={onMarcarFeito}
      onSetDormant={onSetDormant}
      onUpdateServiceStatus={onUpdateServiceStatus}
      onAbrirLead={onAbrirLead}
      getLeadFollowUpDate={getLeadFollowUpDate}
      getLeadServiceDate={getLeadServiceDate}
      getLeadActivityDate={getLeadActivityDate}
      getLeadServiceStatus={getLeadServiceStatus}
      getLeadStatusClasses={getLeadStatusClasses}
      getLeadPhoneHref={getLeadPhoneHref}
      getWhatsAppHref={getWhatsAppHref}
      serviceStatusMeta={serviceStatusMeta}
    />
  );

  const renderAgendaSection = (
    title: string,
    count: number,
    tone: 'red' | 'gold' | 'sky' | 'muted',
    items: Lead[],
    kind: LeadCardKind,
    emptyMessage: string,
  ) => {
    const toneClasses = {
      red: 'text-red-300 border-red-500/20 bg-red-500/10',
      gold: 'text-[#f5d77a] border-[#c9a227]/20 bg-[#c9a227]/10',
      sky: 'text-sky-300 border-sky-500/20 bg-sky-500/10',
      muted: 'text-white/55 border-white/10 bg-white/[0.03]',
    }[tone];

    if (items.length === 0) {
      return (
        <section className="rounded-[2rem] border border-white/5 bg-white/[0.02] px-6 py-10 text-center">
          <p className="text-lg font-black text-white">{title}</p>
          <p className="mt-2 text-sm text-white/45">{emptyMessage}</p>
        </section>
      );
    }

    return (
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold uppercase tracking-[0.25em] ${toneClasses.split(' ')[0]}`}>{title}</span>
          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses}`}>{count}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{items.map((lead) => renderLeadCard(lead, kind))}</div>
      </section>
    );
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2.25rem] border border-white/5 bg-[radial-gradient(circle_at_top_left,_rgba(201,162,39,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.04),_transparent_25%),linear-gradient(180deg,#0a1320_0%,#050a11_100%)] p-6 shadow-2xl shadow-black/25 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#f5d77a]">LUME ELITE</p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">Central de Agenda</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
              Separe retornos comerciais, servicos marcados e leads sem proxima acao para decidir o que fazer primeiro.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/5 bg-white/[0.04] p-4 shadow-lg shadow-black/15 backdrop-blur-md">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35">Hoje</p>
            <p className="mt-2 text-lg font-bold text-white">{format(hoje, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-red-300 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]">
                {contactarHoje.length} urgentes
              </span>
              <span className="rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-1 text-[#f5d77a] shadow-[0_0_0_1px_rgba(201,162,39,0.1)]">
                {proximos7Dias.length} proximos 7 dias
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-white/60">{emDiaCount} em dia</span>
              <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-sky-300">{servicosAgendados.length} servicos</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-red-500/20 bg-[linear-gradient(180deg,rgba(239,68,68,0.12),rgba(239,68,68,0.04))] p-5 shadow-lg shadow-black/10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-red-300/70">Contatar hoje</p>
          <p className="mt-3 text-4xl font-black text-white">{contactarHoje.length}</p>
          <p className="mt-2 text-sm text-white/50">Atrasados e contatos do dia.</p>
        </div>
        <div className="rounded-[1.75rem] border border-[#c9a227]/20 bg-[linear-gradient(180deg,rgba(201,162,39,0.16),rgba(201,162,39,0.05))] p-5 shadow-lg shadow-black/10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#f5d77a]">Proximos 7 dias</p>
          <p className="mt-3 text-4xl font-black text-white">{proximos7Dias.length}</p>
          <p className="mt-2 text-sm text-white/50">Retornos agendados para a semana.</p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-sky-300/80">Servicos</p>
          <p className="mt-3 text-4xl font-black text-white">{servicosAgendados.length}</p>
          <p className="mt-2 text-sm text-white/50">Datas de servico marcadas.</p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 shadow-lg shadow-black/10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/35">Parados</p>
          <p className="mt-3 text-4xl font-black text-white">{parados.length}</p>
          <p className="mt-2 text-sm text-white/50">Sem agenda e sem contato recente.</p>
        </div>
      </section>

      <section className="flex flex-wrap gap-2 rounded-[1.5rem] border border-white/5 bg-[#07111d]/70 p-2">
        {agendaViews.map((view) => (
          <button
            key={view.id}
            type="button"
            onClick={() => setAgendaView(view.id)}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] transition ${
              agendaView === view.id
                ? 'bg-[#c9a227] text-[#04080f]'
                : 'border border-white/5 bg-white/[0.02] text-white/50 hover:border-[#c9a227]/25 hover:text-white'
            }`}
          >
            <span>{view.label}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] ${agendaView === view.id ? 'bg-[#04080f]/15' : 'bg-white/[0.06]'}`}>
              {view.count}
            </span>
          </button>
        ))}
      </section>

      {agendaView !== 'mes' && (
        <section>
          <div className="rounded-[2rem] border border-white/5 bg-[#07111d]/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35">Acoes da semana</p>
              <h3 className="mt-1 text-lg font-black text-white sm:text-xl">Capacidade diaria</h3>
            </div>
            {diaSelecionado && (
              <button
                onClick={() => setDiaSelecionado(null)}
                className="w-fit rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs font-semibold text-white/60 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              >
                Limpar filtro
              </button>
            )}
          </div>

          <div className="mt-4 space-y-2 sm:hidden">
            {weeklyActionDays.map(({ day, followUps, services, total, forecastValue }) => {
              const selected = diaSelecionado ? isSameDay(day, diaSelecionado) : false;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => highlightDay(day)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-2.5 text-left transition ${
                    selected
                      ? 'border-[#c9a227]/50 bg-[#c9a227]/10 text-white'
                      : 'border-white/5 bg-white/[0.02] text-white/70'
                  } ${isToday(day) ? 'ring-1 ring-[#f5d77a]/30' : ''}`}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">{format(day, 'EEE', { locale: ptBR })}</p>
                    <p className={`mt-1 text-base font-black ${isToday(day) ? 'text-[#f5d77a]' : 'text-white'}`}>
                      {format(day, "d 'de' MMM", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white">{total} acoes</p>
                    <p className="mt-0.5 text-[11px] text-white/45">{services} servicos · {followUps} retornos</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#f5d77a]">{formatCurrencyBRL(forecastValue)}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 hidden grid-cols-7 gap-2 sm:grid">
            {diasSemana.map((day) => {
              const selected = diaSelecionado ? isSameDay(day, diaSelecionado) : false;
              const dayCount = agendaCountByDay(day);
              const followUps = followUpCountByDay(day);
              const services = serviceCountByDay(day);
              const forecastValue = weeklyActionDays.find((item) => isSameDay(item.day, day))?.forecastValue || 0;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => highlightDay(day)}
                  className={`group rounded-2xl border p-2.5 text-left transition duration-300 ${
                    selected
                      ? 'border-[#c9a227]/50 bg-[linear-gradient(180deg,rgba(201,162,39,0.16),rgba(201,162,39,0.06))] shadow-[0_0_0_1px_rgba(201,162,39,0.18)]'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]'
                  } ${isToday(day) ? 'ring-1 ring-[#f5d77a]/35' : ''}`}
                >
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/35 group-hover:text-white/50">{format(day, 'EEE', { locale: ptBR })}</p>
                  <p className={`mt-1.5 text-base font-black ${isToday(day) ? 'text-[#f5d77a]' : 'text-white'}`}>{format(day, 'd')}</p>
                  <p className="mt-0.5 text-[10px] text-white/45">{dayCount} itens</p>
                  <p className="mt-0.5 truncate text-[10px] font-semibold text-[#f5d77a]">{formatCurrencyBRL(forecastValue)}</p>
                  <div className="mt-1.5 flex gap-1">
                    <span className="h-1.5 flex-1 rounded-full bg-[#c9a227]/40" style={{ opacity: followUps > 0 ? 1 : 0.18 }} />
                    <span className="h-1.5 flex-1 rounded-full bg-sky-400/50" style={{ opacity: services > 0 ? 1 : 0.18 }} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
            {diaSelecionado ? (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                <p>Exibindo o dia <span className="font-semibold text-white">{selectedDayLabel}</span>.</p>
                <p className="text-white/40">Hoje seguem visiveis tambem os atrasados.</p>
              </div>
            ) : (
              <p>Clique em um dia para filtrar os blocos de contato da semana.</p>
            )}
          </div>
          </div>
        </section>
      )}

      {agendaView === 'mes' && (
        <section>
          <div className="rounded-[2rem] border border-white/5 bg-[#07111d]/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35">Calendario mensal</p>
                <h3 className="mt-1 text-lg font-black text-white sm:text-xl">{format(mesVisivel, "MMMM 'de' yyyy", { locale: ptBR })}</h3>
                <p className="mt-2 text-sm text-white/55">Azul marca retornos comerciais. Verde destaca servicos agendados. Clique no dia para filtrar os cards.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/65">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                  Retornos
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Servicos
                </div>
                {diaSelecionado && (
                  <button
                    onClick={() => setDiaSelecionado(null)}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-semibold text-white/60 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                  >
                    Limpar dia
                  </button>
                )}
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] p-1">
                  <button
                    type="button"
                    onClick={goToPreviousMonth}
                    className="rounded-full px-3 py-2 text-sm font-bold text-white/70 transition hover:bg-white/[0.05] hover:text-white"
                    aria-label="Mes anterior"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMesVisivel(startOfMonth(new Date()));
                      setDiaSelecionado(null);
                    }}
                    className="rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f5d77a] transition hover:bg-[#c9a227]/10"
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="rounded-full px-3 py-2 text-sm font-bold text-white/70 transition hover:bg-white/[0.05] hover:text-white"
                    aria-label="Proximo mes"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-2 text-center">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((label) => (
                <div key={label} className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-white/30">
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
              {monthActionDays.map(({ day, followUps, services, total, forecastValue }) => {
                const selected = diaSelecionado ? isSameDay(day, diaSelecionado) : false;
                const inCurrentMonth = isSameMonth(day, mesVisivel);
                const hasItems = total > 0;

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => highlightDay(day)}
                    className={`min-h-[92px] rounded-2xl border p-2.5 text-left transition duration-300 ${
                      selected
                        ? 'border-[#c9a227]/50 bg-[linear-gradient(180deg,rgba(201,162,39,0.18),rgba(201,162,39,0.06))] shadow-[0_0_0_1px_rgba(201,162,39,0.18)]'
                        : hasItems
                          ? 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                          : 'border-white/5 bg-white/[0.015] hover:border-white/10'
                    } ${isToday(day) ? 'ring-1 ring-[#f5d77a]/35' : ''} ${inCurrentMonth ? 'text-white' : 'text-white/28'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-black ${isToday(day) && inCurrentMonth ? 'text-[#f5d77a]' : ''}`}>{format(day, 'd')}</p>
                      {total > 0 && (
                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-white/70">
                          {total}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1.5">
                        <span className="h-2.5 flex-1 rounded-full bg-sky-400/85" style={{ opacity: followUps > 0 ? 1 : 0.14 }} />
                        <span className="h-2.5 flex-1 rounded-full bg-emerald-400/85" style={{ opacity: services > 0 ? 1 : 0.14 }} />
                      </div>
                      <div className="space-y-1 text-[10px]">
                        <p className="text-sky-200/80">{followUps} retornos</p>
                        <p className="text-emerald-200/80">{services} servicos</p>
                        <p className="truncate font-semibold text-[#f5d77a]/85">{forecastValue > 0 ? formatCurrencyBRL(forecastValue) : 'Sem valor'}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white/60">
              {diaSelecionado ? (
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                  <p>Exibindo <span className="font-semibold text-white">{selectedDayLabel}</span> dentro de {format(mesVisivel, "MMMM 'de' yyyy", { locale: ptBR })}.</p>
                  <p className="text-white/40">{monthlyFollowUps.length} retornos e {monthlyServices.length} servicos neste filtro.</p>
                </div>
              ) : (
                <p>Sem dia selecionado, os cards abaixo mostram todo o volume do mes.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {agendaView === 'servicos' && servicosAgendados.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-sky-300">Servicos agendados</span>
            <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-300">{servicosAgendados.length}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {([
              ['Marcado', serviceStatusCounts.Marcado],
              ['Confirmado', serviceStatusCounts.Confirmado],
              ['Em execucao', serviceStatusCounts['Em Execucao']],
              ['Concluido', serviceStatusCounts.Concluido],
              ['Reagendar', serviceStatusCounts.Reagendar],
            ] as const).map(([label, count]) => (
              <div key={label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">{label}</p>
                <p className="mt-2 text-2xl font-black text-white">{count}</p>
              </div>
            ))}
          </div>
          <div className="space-y-5">
            {serviceRouteGroups.map((group) => (
              <section key={group.neighborhood} className="rounded-[2rem] border border-white/5 bg-white/[0.02] p-5">
                <div className="flex flex-col gap-3 border-b border-white/5 pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-300/80">Rota</p>
                    <h3 className="mt-1 text-xl font-black text-white">{group.neighborhood}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-white/60">{group.items.length} servicos</span>
                    <span className="rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-1 text-[#f5d77a]">{formatCurrencyBRL(group.totalValue)}</span>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map((lead) => renderLeadCard(lead, 'service'))}
                </div>
              </section>
            ))}
          </div>
        </section>
      )}

      {agendaView === 'hoje' && contactarHoje.length > 0 && renderAgendaSection('Contatar hoje', contactarHoje.length, 'red', contactarHoje, 'followup', 'Nenhum lead para contatar hoje.')}
      {agendaView === 'hoje' && servicosHoje.length > 0 && renderAgendaSection(diaSelecionado ? 'Servicos do dia' : 'Servicos de hoje', servicosHoje.length, 'sky', servicosHoje, 'service', diaSelecionado ? 'Nenhum servico marcado neste dia.' : 'Nenhum servico marcado para hoje.')}
      {agendaView === 'semana' && proximos7Dias.length > 0 && renderAgendaSection('Proximos 7 dias', proximos7Dias.length, 'gold', proximos7Dias, 'followup', 'Nenhum retorno para os proximos 7 dias.')}
      {agendaView === 'mes' && monthlyFollowUps.length > 0 && renderAgendaSection(diaSelecionado ? 'Retornos do dia' : 'Retornos do mes', monthlyFollowUps.length, 'gold', monthlyFollowUps, 'followup', diaSelecionado ? 'Nenhum retorno neste dia.' : 'Nenhum retorno neste mes.')}
      {agendaView === 'mes' && monthlyServices.length > 0 && renderAgendaSection(diaSelecionado ? 'Servicos do dia' : 'Servicos do mes', monthlyServices.length, 'sky', monthlyServices, 'service', diaSelecionado ? 'Nenhum servico neste dia.' : 'Nenhum servico neste mes.')}
      {agendaView === 'sem_acao' && parados.length > 0 && renderAgendaSection('Sem atividade ha 3+ dias', parados.length, 'muted', parados, 'idle', 'Nenhum lead parado.')}
      {agendaView === 'dormentes' && dormentes.length > 0 && renderAgendaSection('Leads dormentes', dormentes.length, 'muted', dormentes, 'dormant', 'Nenhum lead dormente.')}

      {!sectionsEmpty && activeAgendaEmpty && (
        <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] px-6 py-10 text-center shadow-lg shadow-black/10">
          <p className="text-xl font-black text-white">Nada neste filtro</p>
          <p className="mt-2 text-sm text-white/45">Escolha outro trilho da agenda ou selecione outro dia no calendario.</p>
        </div>
      )}

      {sectionsEmpty && (
        <div className="rounded-[2rem] border border-emerald-500/20 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),transparent_55%),linear-gradient(180deg,rgba(16,185,129,0.06),rgba(16,185,129,0.03))] px-6 py-10 text-center shadow-lg shadow-black/10">
          <p className="text-2xl font-black text-white">Agenda em dia</p>
          <p className="mt-2 text-sm text-white/55">Nenhum contato pendente para hoje, proximos dias ou leads parados.</p>
        </div>
      )}
    </div>
  );
}
