'use client';

import { useMemo } from 'react';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Lead, LeadStatus, ServiceStatus, ServiceStatusMeta } from '../types';

export const normalizeLeadStatus = (status: unknown): LeadStatus => {
  if (status === 'Proposta Enviada') return 'Agendado';
  if (status === 'Novo' || status === 'Em Contato' || status === 'Agendado' || status === 'Fechado' || status === 'Perdido') {
    return status;
  }
  return 'Novo';
};

export const normalizeServiceStatus = (status: unknown): ServiceStatus | null => {
  if (status === 'Marcado' || status === 'Confirmado' || status === 'Em Execucao' || status === 'Concluido' || status === 'Reagendar') {
    return status;
  }
  if (status === 'Em execução') return 'Em Execucao';
  return null;
};

export const isClosedLead = (status: Lead['status']) => status === 'Fechado' || status === 'Perdido';

export const parseAgendaDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const getLeadActivityDate = (lead: Lead) => parseAgendaDate(lead.updatedAt || lead.statusChangedAt || lead.createdAt);

export const getLeadFollowUpDate = (lead: Lead) => parseAgendaDate(lead.proximoContato || null);

export const getLeadServiceDate = (lead: Lead) => parseAgendaDate(lead.dataServico || null);

export const getLeadServiceStatus = (lead: Lead): ServiceStatus => {
  const normalized = normalizeServiceStatus(lead.serviceStatus);
  if (normalized) return normalized;
  return lead.dataServico ? 'Marcado' : 'Reagendar';
};

export const getLeadStatusClasses = (status: LeadStatus) => {
  if (status === 'Fechado') return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400';
  if (status === 'Agendado') return 'border-sky-500/20 bg-sky-500/10 text-sky-300';
  if (status === 'Em Contato') return 'border-[#c9a227]/25 bg-[#c9a227]/10 text-[#f5d77a]';
  if (status === 'Perdido') return 'border-red-500/20 bg-red-500/10 text-red-400';
  return 'border-white/15 bg-white/[0.04] text-white/70';
};

export const SERVICE_STATUS_META: Record<ServiceStatus, ServiceStatusMeta> = {
  Marcado: {
    label: 'Marcado',
    badge: 'border-slate-400/20 bg-slate-400/10 text-slate-200',
    button: 'border-slate-400/20 bg-slate-400/10 text-slate-200 hover:bg-slate-400/15',
  },
  Confirmado: {
    label: 'Confirmado',
    badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    button: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15',
  },
  'Em Execucao': {
    label: 'Em execução',
    badge: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    button: 'border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/15',
  },
  Concluido: {
    label: 'Concluido',
    badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    button: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15',
  },
  Reagendar: {
    label: 'Reagendar',
    badge: 'border-red-500/20 bg-red-500/10 text-red-300',
    button: 'border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/15',
  },
};

export const formatCurrencyBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const formatDateInputValue = (value?: string | null) => {
  const date = parseAgendaDate(value);
  return date ? format(date, 'yyyy-MM-dd') : '';
};

export const getLeadPhoneDigits = (phone?: string | null) => (phone || '').replace(/\D/g, '');

export const getLeadPhoneHref = (phone?: string | null) => {
  const digits = getLeadPhoneDigits(phone);
  if (!digits) return '';
  const normalized = digits.startsWith('55') ? digits : `55${digits}`;
  return `tel:+${normalized}`;
};

export const getWhatsAppTemplateText = (lead: Lead, template: 'generic' | 'retorno' | 'servico') => {
  const serviceDate = getLeadServiceDate(lead);
  const serviceDateLabel = serviceDate ? format(serviceDate, 'dd/MM/yyyy', { locale: ptBR }) : null;
  const neighborhood = lead.neighborhood || 'seu endereço';

  if (template === 'retorno') {
    return `Olá, ${lead.name}! Aqui é da LUME. Passando para dar sequência no seu orçamento de insulfilm para ${neighborhood}. Posso te ajudar com alguma dúvida para avançarmos?`;
  }

  if (template === 'servico') {
    return serviceDateLabel
      ? `Olá, ${lead.name}! Aqui é da LUME. Estou passando para confirmar seu serviço de insulfilm agendado para ${serviceDateLabel}. Está tudo certo para seguirmos?`
      : `Olá, ${lead.name}! Aqui é da LUME. Estou passando para alinharmos a melhor data para o seu serviço de insulfilm.`;
  }

  return `Olá, ${lead.name}! Aqui é da LUME. Posso falar com você sobre seu atendimento de insulfilm?`;
};

export const getWhatsAppHref = (lead: Lead, template: 'generic' | 'retorno' | 'servico' = 'generic') => {
  const digits = getLeadPhoneDigits(lead.phone);
  if (!digits) return '';
  const phone = digits.startsWith('55') ? digits : `55${digits}`;
  const text = encodeURIComponent(getWhatsAppTemplateText(lead, template));
  return `https://wa.me/${phone}?text=${text}`;
};

export const useAgenda = (leads: Lead[]) => {
  const agendaUrgentCount = useMemo(() => {
    return leads.filter((lead) => {
      if (isClosedLead(lead.status)) return false;
      const followUpDate = getLeadFollowUpDate(lead);
      return !!followUpDate && (isToday(followUpDate) || isPast(followUpDate));
    }).length;
  }, [leads]);

  return {
    agendaUrgentCount,
  };
};
