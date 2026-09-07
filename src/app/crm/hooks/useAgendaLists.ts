'use client';

import { useMemo } from 'react';
import {
  addDays,
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
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Lead, ServiceStatus } from '../types';

interface UseAgendaListsParams {
  leads: Lead[];
  diaSelecionado: Date | null;
  mesVisivel: Date;
  isClosedLead: (status: Lead['status']) => boolean;
  getLeadFollowUpDate: (lead: Lead) => Date | null;
  getLeadServiceDate: (lead: Lead) => Date | null;
  getLeadActivityDate: (lead: Lead) => Date | null;
  getLeadServiceStatus: (lead: Lead) => ServiceStatus;
}

/** Listas e contagens derivadas da agenda (extraído do AgendaSection — sem mudança de lógica). */
export interface WeekActionDay {
  day: Date;
  followUps: number;
  services: number;
  total: number;
  forecastValue: number;
}

export type MonthActionDay = WeekActionDay;
export function useAgendaLists({
  leads,
  diaSelecionado,
  mesVisivel,
  isClosedLead,
  getLeadFollowUpDate,
  getLeadServiceDate,
  getLeadActivityDate,
  getLeadServiceStatus,
}: UseAgendaListsParams) {
  const hoje = useMemo(() => new Date(), []);
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 });
  const diasSemana = Array.from({ length: 7 }, (_, index) => addDays(inicioSemana, index));
  const inicioGradeMes = startOfWeek(startOfMonth(mesVisivel), { weekStartsOn: 1 });
  const fimGradeMes = endOfWeek(endOfMonth(mesVisivel), { weekStartsOn: 1 });
  const diasMes = eachDayOfInterval({ start: inicioGradeMes, end: fimGradeMes });
  const leadsAtivos = useMemo(() => leads.filter((lead) => !isClosedLead(lead.status)), [isClosedLead, leads]);
  const leadsComRetorno = useMemo(() => leadsAtivos.filter((lead) => !!lead.proximoContato), [leadsAtivos]);
  const leadsComServico = useMemo(() => leadsAtivos.filter((lead) => !!lead.dataServico), [leadsAtivos]);

  const leadsCincoAnos = useMemo(() => {
    return leads.filter((lead) => {
      if (!lead.archived && lead.status !== 'Fechado') return false;
      const serviceDate = getLeadServiceDate(lead);
      if (!serviceDate) return false;
      return differenceInDays(new Date(), serviceDate) >= 1826;
    });
  }, [getLeadServiceDate, leads]);

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

  const weeklyActionDays: WeekActionDay[] = diasSemana.map((day) => {
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
  const sectionsEmpty = contactarHoje.length === 0 && proximos7Dias.length === 0 && parados.length === 0 && servicosAgendados.length === 0 && leadsCincoAnos.length === 0;

  const monthActionDays: MonthActionDay[] = diasMes.map((day) => {
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

  return {
    hoje,
    diasSemana,
    diasMes,
    leadsAtivos,
    leadsComRetorno,
    leadsComServico,
    leadsCincoAnos,
    contactarHoje,
    proximos7Dias,
    parados,
    dormentes,
    emDiaCount,
    servicosAgendados,
    servicosHoje,
    serviceStatusCounts,
    serviceRouteGroups,
    monthlyFollowUps,
    monthlyServices,
    activeMonthLeadCount,
    followUpCountByDay,
    serviceCountByDay,
    agendaCountByDay,
    monthFollowUpCountByDay,
    monthServiceCountByDay,
    monthValueByDay,
    weeklyActionDays,
    monthActionDays,
    selectedDayLabel,
    sectionsEmpty,
  };
}
