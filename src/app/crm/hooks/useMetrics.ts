'use client';

import { useMemo } from 'react';
import { addDays, differenceInDays, eachDayOfInterval, endOfMonth, format, isPast, isSameDay, isToday, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrencyBRL, getLeadActivityDate, getLeadFollowUpDate, getLeadServiceDate, getLeadServiceStatus, isClosedLead, parseAgendaDate } from './useAgenda';
import type { DashboardStats, Lead, MonthlyEvolutionData } from '../types';

const getLeadRevenueDate = (lead: Lead) => {
  const serviceDate = getLeadServiceDate(lead);
  const closingDate = parseAgendaDate(lead.statusChangedAt || lead.createdAt);

  return serviceDate || closingDate;
};

export const useMetrics = (leads: Lead[], targetGoal: number | null) => {
  const monthlyEvolution = useMemo<MonthlyEvolutionData>(() => {
    const now = new Date();
    const todayStart = parseAgendaDate(format(now, 'yyyy-MM-dd')) || now;
    const currentStart = startOfMonth(now);
    const currentEnd = now;
    const currentMonthEnd = endOfMonth(now);
    const previousReference = subMonths(now, 1);
    const previousStart = startOfMonth(previousReference);
    const previousEnd = endOfMonth(previousReference);
    let chartEnd = currentMonthEnd;
    const currentByDay: Record<string, { value: number; count: number }> = {};
    const previousByDay: Record<string, { value: number; count: number }> = {};
    const futureByDay: Record<string, { value: number; count: number }> = {};

    leads.filter((lead) => lead.status === 'Fechado').forEach((lead) => {
      const date = getLeadRevenueDate(lead);
      if (!date) return;

      const bucket =
        date >= currentStart && date <= currentEnd
          ? currentByDay
          : date >= previousStart && date <= previousEnd
            ? previousByDay
            : null;

      if (!bucket) return;

      const key = format(date, 'yyyy-MM-dd');
      bucket[key] = {
        value: (bucket[key]?.value || 0) + lead.value,
        count: (bucket[key]?.count || 0) + 1,
      };
    });

    let futureTotal = 0;
    let futureCount = 0;

    leads.forEach((lead) => {
      const serviceDate = getLeadServiceDate(lead);
      if (!serviceDate || serviceDate < todayStart || getLeadServiceStatus(lead) === 'Concluido') return;

      futureTotal += lead.value;
      futureCount += 1;
      if (serviceDate > chartEnd) chartEnd = serviceDate;

      if (serviceDate >= currentStart) {
        const key = format(serviceDate, 'yyyy-MM-dd');
        futureByDay[key] = {
          value: (futureByDay[key]?.value || 0) + lead.value,
          count: (futureByDay[key]?.count || 0) + 1,
        };
      }
    });

    const days = eachDayOfInterval({ start: currentStart, end: chartEnd });

    const monthlyTotals = days.reduce(
      (acc, day, index) => {
        const currentKey = format(day, 'yyyy-MM-dd');
        const previousDay = addDays(previousStart, index);
        const previousKey = format(previousDay, 'yyyy-MM-dd');
        const isCurrentPeriod = day <= currentEnd;
        const isForecastPeriod = day >= todayStart;
        const currentDay = isCurrentPeriod ? currentByDay[currentKey] || { value: 0, count: 0 } : { value: 0, count: 0 };
        const previousDayData =
          isCurrentPeriod && previousDay <= previousEnd ? previousByDay[previousKey] || { value: 0, count: 0 } : { value: 0, count: 0 };
        const futureDay = futureByDay[currentKey] || { value: 0, count: 0 };
        const currentAcc = acc.currentAcc + currentDay.value;
        const previousAcc = acc.previousAcc + previousDayData.value;
        const currentCount = acc.currentCount + currentDay.count;
        const previousCount = acc.previousCount + previousDayData.count;
        const bestDay =
          isCurrentPeriod && currentDay.value > acc.bestDay.value
            ? { label: format(day, 'dd/MM'), value: currentDay.value }
            : acc.bestDay;

        return {
          currentAcc,
          previousAcc,
          currentCount,
          previousCount,
          bestDay,
          chartData: [
            ...acc.chartData,
            {
              dia: format(day, 'dd/MM'),
              diaAnterior: previousDay <= previousEnd ? format(previousDay, 'dd/MM') : '--',
              atual: isCurrentPeriod ? currentAcc : null,
              anterior: isCurrentPeriod ? previousAcc : null,
              previsto: futureTotal > 0 && isForecastPeriod ? futureDay.value : null,
              atualDia: isCurrentPeriod ? currentDay.value : null,
              anteriorDia: isCurrentPeriod ? previousDayData.value : null,
              previstoDia: isForecastPeriod ? futureDay.value : 0,
            },
          ],
        };
      },
      {
        chartData: [] as MonthlyEvolutionData['chartData'],
        currentAcc: 0,
        previousAcc: 0,
        currentCount: 0,
        previousCount: 0,
        bestDay: { label: '--', value: 0 },
      },
    );

    return {
      chartData: monthlyTotals.chartData,
      currentTotal: monthlyTotals.currentAcc,
      previousTotal: monthlyTotals.previousAcc,
      currentCount: monthlyTotals.currentCount,
      previousCount: monthlyTotals.previousCount,
      bestDay: monthlyTotals.bestDay,
      futureTotal,
      futureCount,
    };
  }, [leads]);

  const stats = useMemo<DashboardStats>(() => {
    const today = new Date();
    const todayStart = parseAgendaDate(format(today, 'yyyy-MM-dd')) || today;
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
    const total = leads.length;
    const activeProposals = leads.filter((lead) => lead.status === 'Agendado').length;
    const closed = leads.filter((lead) => lead.status === 'Fechado').length;
    const activeLeads = leads.filter((lead) => !isClosedLead(lead.status));
    const overdueFollowUpsList = leads.filter((lead) => {
      if (isClosedLead(lead.status)) return false;
      const followUpDate = getLeadFollowUpDate(lead);
      return !!followUpDate && isPast(followUpDate) && !isToday(followUpDate);
    });
    const dueFollowUpsToday = leads.filter((lead) => {
      if (isClosedLead(lead.status)) return false;
      const followUpDate = getLeadFollowUpDate(lead);
      return !!followUpDate && isToday(followUpDate);
    }).length;
    const noNextActionLeads = activeLeads.filter((lead) => !lead.dormant && !lead.proximoContato && !lead.dataServico);
    const staleNoAgendaLeads = noNextActionLeads.filter((lead) => {
      const activityDate = getLeadActivityDate(lead);
      return activityDate ? differenceInDays(today, activityDate) >= 3 : false;
    });
    const futureServices = leads.filter((lead) => {
      if (getLeadServiceStatus(lead) === 'Concluido') return false;
      const serviceDate = getLeadServiceDate(lead);
      return !!serviceDate && serviceDate >= todayStart;
    });
    const servicesToday = futureServices.filter((lead) => {
      const serviceDate = getLeadServiceDate(lead);
      return serviceDate ? isSameDay(serviceDate, today) : false;
    }).length;
    const servicePipelineValue = futureServices.reduce((sum, lead) => sum + lead.value, 0);
    const weeklyCapacity = weekDays.map((day) => {
      const services = futureServices.filter((lead) => {
        const serviceDate = getLeadServiceDate(lead);
        return serviceDate ? isSameDay(serviceDate, day) : false;
      });

      return {
        label: format(day, 'EEE', { locale: ptBR }),
        day: format(day, 'dd/MM'),
        count: services.length,
        value: services.reduce((sum, lead) => sum + lead.value, 0),
      };
    });
    const serviceStatusCounts = leads.reduce<Record<DashboardStats['serviceStatusCounts'] extends infer T ? keyof T : never, number>>((acc, lead) => {
      if (!lead.dataServico) return acc;
      const serviceStatus = getLeadServiceStatus(lead);
      acc[serviceStatus] += 1;
      return acc;
    }, {
      Marcado: 0,
      Confirmado: 0,
      'Em Execucao': 0,
      Concluido: 0,
      Reagendar: 0,
    });
    const topServiceNeighborhood = leads
      .filter((lead) => !!lead.dataServico && getLeadServiceStatus(lead) !== 'Concluido')
      .reduce<Record<string, number>>((acc, lead) => {
        const key = lead.neighborhood || 'Sem bairro';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

    const revenue = leads
      .filter((lead) => lead.status === 'Fechado')
      .reduce((sum, lead) => sum + lead.value, 0);

    const conversionRate = total > 0 ? Math.round((closed / total) * 100) : 0;
    const answeredLeads = activeLeads.filter((lead) => lead.status !== 'Novo' || !!lead.proximoContato || !!lead.dataServico).length;
    const responseRate = activeLeads.length > 0 ? Math.round((answeredLeads / activeLeads.length) * 100) : 0;
    const priorityRoute = Object.entries(topServiceNeighborhood).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sem rota';

    return {
      total,
      activeLeads: activeLeads.length,
      activeProposals,
      closed,
      revenue,
      conversionRate,
      responseRate,
      servicesToday,
      futureServices: futureServices.length,
      overdueFollowUps: overdueFollowUpsList.length,
      dueFollowUpsToday,
      noNextAction: noNextActionLeads.length,
      staleNoAgenda: staleNoAgendaLeads.length,
      servicePipelineValue,
      serviceStatusCounts,
      priorityRoute,
      weeklyCapacity,
    };
  }, [leads]);

  const monthDifference = monthlyEvolution.currentTotal - monthlyEvolution.previousTotal;
  const monthDifferencePercent =
    monthlyEvolution.previousTotal > 0
      ? (monthDifference / monthlyEvolution.previousTotal) * 100
      : monthlyEvolution.currentTotal > 0
        ? 100
        : 0;
  const monthTrendIsPositive = monthDifference >= 0;
  const targetPercent =
    targetGoal && targetGoal > 0
      ? Math.min(Math.round((stats.revenue / targetGoal) * 100), 100)
      : null;

  return {
    stats,
    monthlyEvolution,
    monthDifference,
    monthDifferencePercent,
    monthTrendIsPositive,
    targetPercent,
    formatDashboardCurrency: formatCurrencyBRL,
  };
};
