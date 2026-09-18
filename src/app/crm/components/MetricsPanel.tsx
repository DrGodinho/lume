'use client';

import { MonthlyChart } from './MonthlyChart';
import { DashboardHoje } from './DashboardHoje';
import { DashboardFunil } from './DashboardFunil';
import { DashboardProntos } from './DashboardProntos';
import { PeriodPills } from './PeriodPills';
import { SemanaServicos } from './SemanaServicos';
import { TargetGoalCard } from './TargetGoalCard';
import { DEFAULT_CRM_TARGET_GOAL } from '../constants';
import { useCrm } from '../context/CrmContext';
import { useMetrics } from '../hooks/useMetrics';
import { useMonthlySnapshots } from '../hooks/useMonthlySnapshots';
import type { MetricsPeriod } from '../utils/metricsPeriod';
import type { CrmTab, DashboardStats, Lead, MonthlyEvolutionData, MonthlyEvolutionSeries } from '../types';

interface MetricsPanelProps {
  onSelectTab?: (tab: CrmTab) => void;
  leads?: Lead[];
  stats?: DashboardStats;
  monthlyEvolution?: MonthlyEvolutionData;
  periodSummary?: { revenue: number; count: number; label: string };
  metricsPeriod?: MetricsPeriod;
  onMetricsPeriodChange?: (period: MetricsPeriod) => void;
  customStart?: string | null;
  customEnd?: string | null;
  onCustomStartChange?: (value: string | null) => void;
  onCustomEndChange?: (value: string | null) => void;
  monthDifference?: number;
  monthDifferencePercent?: number;
  monthTrendIsPositive?: boolean;
  visibleMonthlySeries?: Record<MonthlyEvolutionSeries, boolean>;
  onToggleMonthlySeries?: (series: MonthlyEvolutionSeries) => void;
  formatDashboardCurrency?: (value: number) => string;
  onOpenLead?: (lead: Lead) => void;
  onOpenCreateModal?: () => void;
  onOpenAgendaToday?: () => void;
  onOpenLeads?: () => void;
  targetGoal?: number | null;
  targetPercent?: number | null;
  editingTarget?: boolean;
  targetInput?: string;
  setTargetInput?: (value: string) => void;
  setEditingTarget?: (value: boolean) => void;
  saveTargetGoal?: (value: number) => Promise<void>;
}

export function MetricsPanel(props: MetricsPanelProps = {}) {
  const crm = useCrm();
  const { snapshots: monthlySnapshots } = useMonthlySnapshots();

  const internalMetrics = useMetrics(
    props.leads ?? crm.leads,
    props.targetGoal ?? crm.targetGoal,
    monthlySnapshots,
    props.metricsPeriod ?? crm.metricsPeriod,
    props.customStart ?? crm.customStart,
    props.customEnd ?? crm.customEnd,
    crm.archivedLeads,
  );

  const leads = props.leads ?? crm.leads;
  const stats = props.stats ?? internalMetrics.stats;
  const monthlyEvolution = props.monthlyEvolution ?? internalMetrics.monthlyEvolution;
  const periodSummary = props.periodSummary ?? internalMetrics.periodSummary;
  const metricsPeriod = props.metricsPeriod ?? crm.metricsPeriod;
  const onMetricsPeriodChange = props.onMetricsPeriodChange ?? crm.setMetricsPeriod;
  const customStart = props.customStart ?? crm.customStart;
  const customEnd = props.customEnd ?? crm.customEnd;
  const onCustomStartChange = props.onCustomStartChange ?? crm.setCustomStart;
  const onCustomEndChange = props.onCustomEndChange ?? crm.setCustomEnd;
  const monthDifference = props.monthDifference ?? internalMetrics.monthDifference;
  const monthDifferencePercent = props.monthDifferencePercent ?? internalMetrics.monthDifferencePercent;
  const monthTrendIsPositive = props.monthTrendIsPositive ?? internalMetrics.monthTrendIsPositive;
  const visibleMonthlySeries = props.visibleMonthlySeries ?? crm.visibleMonthlySeries;
  const onToggleMonthlySeries = props.onToggleMonthlySeries ?? crm.toggleMonthlySeries;
  const formatDashboardCurrency = props.formatDashboardCurrency ?? internalMetrics.formatDashboardCurrency;
  const onOpenLead = props.onOpenLead ?? crm.setLeadDetail;
  const onOpenCreateModal = props.onOpenCreateModal ?? (() => crm.openCreateModal());
  const onOpenAgendaToday = props.onOpenAgendaToday ?? (() => {
    crm.setAgendaInitialView('hoje');
    props.onSelectTab?.('agenda');
  });
  const onOpenLeads = props.onOpenLeads ?? (() => props.onSelectTab?.('leads'));
  const targetGoal = props.targetGoal ?? crm.targetGoal;
  const targetPercent = props.targetPercent ?? internalMetrics.targetPercent;
  const editingTarget = props.editingTarget ?? crm.editingTarget;
  const targetInput = props.targetInput ?? crm.targetInput;
  const setTargetInput = props.setTargetInput ?? crm.setTargetInput;
  const setEditingTarget = props.setEditingTarget ?? crm.setEditingTarget;
  const saveTargetGoal = props.saveTargetGoal ?? crm.saveTargetGoal;
  const beginTargetEdit = () => {
    setTargetInput(String(targetGoal ?? DEFAULT_CRM_TARGET_GOAL));
    setEditingTarget(true);
  };

  const commitTargetEdit = () => {
    const value = parseInt(targetInput, 10);
    if (value > 0) {
      void saveTargetGoal(value);
    } else {
      setEditingTarget(false);
    }
  };

  const cancelTargetEdit = () => {
    setEditingTarget(false);
  };

  return (
    <div className="space-y-8">
      <DashboardHoje
        overdue={stats.overdueFollowUps}
        today={stats.dueFollowUpsToday}
        servicesToday={stats.servicesToday}
        onOpenAgenda={onOpenAgendaToday}
        aside={
          <PeriodPills
            value={metricsPeriod}
            onChange={onMetricsPeriodChange}
            customStart={customStart}
            customEnd={customEnd}
            onCustomStartChange={onCustomStartChange}
            onCustomEndChange={onCustomEndChange}
          />
        }
      />

      {metricsPeriod === 'mes' ? (
        <MonthlyChart
          monthlyEvolution={monthlyEvolution}
          monthDifference={monthDifference}
          monthDifferencePercent={monthDifferencePercent}
          monthTrendIsPositive={monthTrendIsPositive}
          visibleMonthlySeries={visibleMonthlySeries}
          onToggleSeries={onToggleMonthlySeries}
          formatDashboardCurrency={formatDashboardCurrency}
        />
      ) : (
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg shadow-black/20 backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Faturamento no período</p>
            <p className="mt-2 text-3xl font-black text-[#f5d77a]">{formatDashboardCurrency(periodSummary.revenue)}</p>
            <p className="mt-1 text-xs text-white/45">Leads fechados entre {periodSummary.label.toLowerCase()}</p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-[#07111d]/50 p-6 shadow-lg shadow-black/20 backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Fechamentos no período</p>
            <p className="mt-2 text-3xl font-black text-white">{periodSummary.count}</p>
            <p className="mt-1 text-xs text-white/45">Contratos fechados em {periodSummary.label.toLowerCase()}</p>
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardFunil leads={leads} />

        <TargetGoalCard
          variant="full"
          targetGoal={targetGoal}
          targetPercent={targetPercent}
          editing={editingTarget}
          targetInput={targetInput}
          onInputChange={setTargetInput}
          onBeginEdit={beginTargetEdit}
          onCommitEdit={commitTargetEdit}
          onCancelEdit={cancelTargetEdit}
          monthTotal={monthlyEvolution.currentTotal}
          formatMonthTotal={formatDashboardCurrency}
        />
      </div>
      <SemanaServicos
        weeklyCapacity={stats.weeklyCapacity}
        pipelineValue={stats.servicePipelineValue}
        formatMoney={formatDashboardCurrency}
      />

      <DashboardProntos
        leads={leads}
        onOpenLead={onOpenLead}
        onOpenLeads={onOpenLeads}
        onOpenCreateModal={onOpenCreateModal}
      />
    </div>
  );
}
