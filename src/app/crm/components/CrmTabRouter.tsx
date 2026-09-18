'use client';

import dynamic from 'next/dynamic';
import { TabErrorBoundary } from './ErrorBoundary';
import type { CrmTab } from '../types';
import type { useCrmSettings } from '../hooks/useCrmSettings';
import type { useMetrics } from '../hooks/useMetrics';

const AgendaSection = dynamic(() => import('./AgendaSection').then((m) => m.AgendaSection), {
  loading: () => <TabSkeleton />,
});
const HistoricoSupabase = dynamic(() => import('./HistoricoSupabase').then((m) => m.HistoricoSupabase), {
  loading: () => <TabSkeleton />,
});
const KanbanBoard = dynamic(() => import('./KanbanBoard').then((m) => m.KanbanBoard), {
  loading: () => <TabSkeleton />,
});
const MetricsPanel = dynamic(() => import('./MetricsPanel').then((m) => m.MetricsPanel), {
  loading: () => <TabSkeleton />,
});
const PlaybookSettings = dynamic(() => import('./PlaybookSettings').then((m) => m.PlaybookSettings), {
  loading: () => <TabSkeleton />,
});
const ArchivedLeadsView = dynamic(() => import('./ArchivedLeadsView').then((m) => m.ArchivedLeadsView), {
  loading: () => <TabSkeleton />,
});
const ExtratosMensaisSupabase = dynamic(() => import('../ExtratosMensaisSupabase').then((m) => m.ExtratosMensaisSupabase), {
  loading: () => <TabSkeleton />,
});

function TabSkeleton() {
  return (
    <div className="space-y-4 p-1" aria-hidden="true">
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex-1 space-y-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3"
          >
            <div className="skeleton-shimmer h-4 w-24 rounded" />
            <div className="skeleton-shimmer h-20 w-full rounded-xl" />
            <div className="skeleton-shimmer h-20 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface CrmTabRouterProps {
  activeTab: CrmTab;
  onSelectTab: (tab: CrmTab) => void;
  metrics?: ReturnType<typeof useMetrics>;
  crmSettings?: ReturnType<typeof useCrmSettings>;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export function CrmTabRouter({ activeTab, onSelectTab, searchInputRef }: CrmTabRouterProps) {
  if (activeTab === 'dashboard') {
    return (
      <TabErrorBoundary fallbackTitle="Painel Geral">
        <MetricsPanel onSelectTab={onSelectTab} />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'leads') {
    return (
      <TabErrorBoundary fallbackTitle="Leads">
        <KanbanBoard searchInputRef={searchInputRef} />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'trash') {
    return (
      <TabErrorBoundary fallbackTitle="Lixeira de Leads">
        <ArchivedLeadsView mode="trash" />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'archive') {
    return (
      <TabErrorBoundary fallbackTitle="Arquivo de Leads">
        <ArchivedLeadsView mode="archive" />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'historico') {
    return (
      <TabErrorBoundary fallbackTitle="Orçamentos">
        <HistoricoSupabase setActiveTab={onSelectTab} />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'extratos') {
    return (
      <TabErrorBoundary fallbackTitle="Extratos Mensais">
        <ExtratosMensaisSupabase />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'settings') {
    return (
      <TabErrorBoundary fallbackTitle="Configurações do CRM">
        <PlaybookSettings />
      </TabErrorBoundary>
    );
  }

  if (activeTab === 'agenda') {
    return (
      <TabErrorBoundary fallbackTitle="Agenda & Follow-up">
        <AgendaSection />
      </TabErrorBoundary>
    );
  }

  return null;
}
