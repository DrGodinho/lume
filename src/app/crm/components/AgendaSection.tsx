'use client';

import { useEffect, useState } from 'react';
import {
  addMonths,
  format,
  isSameDay,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AgendaLeadCard } from './AgendaLeadCard';
import { AgendaFilters } from './AgendaFilters';
import { AgendaWeekStrip } from './AgendaWeekStrip';
import { AgendaMonthCalendar } from './AgendaMonthCalendar';
import { useAgendaLists } from '../hooks/useAgendaLists';
import type { WhatsAppTemplateType } from './WhatsAppTemplateMenu';
import type { AgendaView, Lead, LeadCardKind, ServiceStatus, ServiceStatusMeta } from '../types';

interface AgendaSectionProps {
  leads: Lead[];
  initialView?: AgendaView;
  onAgendarRetorno: (leadId: string, data: string) => Promise<void>;
  onMarcarFeito: (leadId: string) => Promise<void>;
  onSetDormant: (leadId: string, dormant: boolean) => Promise<void>;
  onUpdateServiceStatus: (leadId: string, serviceStatus: ServiceStatus) => Promise<void>;
  onAbrirLead: (lead: Lead) => void;
  onRestoreFromArchive?: (lead: Lead) => Promise<void>;
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

export function AgendaSection({
  leads,
  initialView = 'hoje',
  onAgendarRetorno,
  onMarcarFeito,
  onSetDormant,
  onUpdateServiceStatus,
  onAbrirLead,
  onRestoreFromArchive,
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
  const {
    hoje,
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
    weeklyActionDays,
    monthActionDays,
    selectedDayLabel,
    sectionsEmpty,
  } = useAgendaLists({
    leads,
    diaSelecionado,
    mesVisivel,
    isClosedLead,
    getLeadFollowUpDate,
    getLeadServiceDate,
    getLeadActivityDate,
    getLeadServiceStatus,
  });

  const activeAgendaEmpty =
    (agendaView === 'hoje' && contactarHoje.length === 0 && servicosHoje.length === 0) ||
    (agendaView === 'semana' && proximos7Dias.length === 0) ||
    (agendaView === 'mes' && monthlyFollowUps.length === 0 && monthlyServices.length === 0) ||
    (agendaView === 'servicos' && servicosAgendados.length === 0) ||
    (agendaView === 'parados' && parados.length === 0 && dormentes.length === 0) ||
    (agendaView === 'ciclo_5anos' && leadsCincoAnos.length === 0);

  const highlightDay = (day: Date) => {
    if (diaSelecionado && isSameDay(day, diaSelecionado)) {
      setDiaSelecionado(null);
      return;
    }
    setDiaSelecionado(day);
  };

  const openAgendaView = (view: AgendaView) => {
    setDiaSelecionado(null);
    setAgendaView(view);
  };

  const goToPreviousMonth = () => {
    setMesVisivel((current) => subMonths(current, 1));
    setDiaSelecionado(null);
  };

  const goToNextMonth = () => {
    setMesVisivel((current) => addMonths(current, 1));
    setDiaSelecionado(null);
  };

  const filterCounts = {
    hoje: contactarHoje.length,
    semana: proximos7Dias.length,
    parados: parados.length + dormentes.length,
    servicos: servicosAgendados.length,
    mes: activeMonthLeadCount,
    ciclo5Anos: leadsCincoAnos.length,
  };

  const renderLeadCard = (lead: Lead, kind: LeadCardKind) => (
    <AgendaLeadCard
      key={`${kind}-${lead.id}`}
      lead={lead}
      kind={kind}
      onAgendar={onAgendarRetorno}
      onMarcarFeito={onMarcarFeito}
      onSetDormant={onSetDormant}
      onUpdateServiceStatus={onUpdateServiceStatus}
      onAbrirLead={onAbrirLead}
      onRestoreFromArchive={onRestoreFromArchive}
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
              {leadsCincoAnos.length > 0 && (
                <span className="rounded-full border border-[#c9a227]/30 bg-[#c9a227]/15 px-3 py-1 text-[#f5d77a] shadow-[0_0_0_1px_rgba(201,162,39,0.15)] animate-pulse">
                  {leadsCincoAnos.length} ciclo de 5 anos
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <AgendaFilters activeView={agendaView} counts={filterCounts} onSelect={openAgendaView} />

      {agendaView !== 'mes' && (
        <AgendaWeekStrip
          days={weeklyActionDays}
          diaSelecionado={diaSelecionado}
          onHighlightDay={highlightDay}
          onClearFilter={() => setDiaSelecionado(null)}
          formatMoney={formatCurrencyBRL}
        />
      )}

      {agendaView === 'mes' && (
        <AgendaMonthCalendar
          days={monthActionDays}
          mesVisivel={mesVisivel}
          diaSelecionado={diaSelecionado}
          onHighlightDay={highlightDay}
          onClearDay={() => setDiaSelecionado(null)}
          onPrevMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onGoToday={() => {
            setMesVisivel(startOfMonth(new Date()));
            setDiaSelecionado(null);
          }}
          filteredFollowUps={monthlyFollowUps.length}
          filteredServices={monthlyServices.length}
          selectedDayLabel={selectedDayLabel}
          formatMoney={formatCurrencyBRL}
        />
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
      {agendaView === 'ciclo_5anos' && leadsCincoAnos.length > 0 && renderAgendaSection('Ciclo de 5 Anos', leadsCincoAnos.length, 'gold', leadsCincoAnos, 'followup', 'Nenhum lead no ciclo de 5 anos.')}
      {agendaView === 'parados' && (parados.length > 0 || dormentes.length > 0) && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-white/55">Parados</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-semibold text-white/55">{parados.length + dormentes.length}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {parados.map((lead) => renderLeadCard(lead, 'idle'))}
            {dormentes.map((lead) => renderLeadCard(lead, 'dormant'))}
          </div>
        </section>
      )}

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
