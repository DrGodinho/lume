'use client';

import { Archive, BarChart3, Calculator, CalendarClock, Database, LogOut, Plus, ReceiptText, Settings, Trash2, UsersRound, type LucideIcon } from 'lucide-react';
import type { CrmTab } from '../types';
import { TargetGoalCard } from './TargetGoalCard';

type NavTone = 'gold' | 'red' | 'slate';

interface CrmNavItem {
  id: CrmTab;
  label: string;
  description: string;
  icon: LucideIcon;
  tone: NavTone;
}

const NAV_TONE_CLASSES: Record<NavTone, { active: string; icon: string; badge: string }> = {
  gold: {
    active: 'border-[#c9a227] bg-[#c9a227]/10 text-white shadow-[inset_0_0_0_1px_rgba(201,162,39,0.08)]',
    icon: 'bg-[#c9a227]/15 text-[#f5d77a]',
    badge: 'bg-[#c9a227] text-[#04080f]',
  },
  red: {
    active: 'border-red-400 bg-red-500/10 text-white shadow-[inset_0_0_0_1px_rgba(248,113,113,0.08)]',
    icon: 'bg-red-500/15 text-red-300',
    badge: 'bg-red-500 text-white',
  },
  slate: {
    active: 'border-white/30 bg-white/[0.06] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]',
    icon: 'bg-white/[0.06] text-white/70',
    badge: 'bg-white/15 text-white',
  },
};

const CRM_NAV_SECTIONS: Array<{ label: string; items: CrmNavItem[] }> = [
  {
    label: 'Operação',
    items: [
      { id: 'dashboard', label: 'Painel Geral', description: 'Métricas e meta', icon: BarChart3, tone: 'gold' },
      { id: 'leads', label: 'Leads', description: 'Funil comercial', icon: UsersRound, tone: 'gold' },
      { id: 'agenda', label: 'Agenda & Follow-up', description: 'Retornos e serviços', icon: CalendarClock, tone: 'red' },
    ],
  },
  {
    label: 'Dados',
    items: [
      { id: 'historico', label: 'Orçamentos', description: 'Da calculadora', icon: Database, tone: 'slate' },
      { id: 'extratos', label: 'Extratos Mensais', description: 'Fechamentos por mês', icon: ReceiptText, tone: 'slate' },
      { id: 'settings', label: 'Configuracoes', description: 'Playbooks e automacoes', icon: Settings, tone: 'slate' },
      { id: 'archive', label: 'Arquivo', description: 'Leads fechados antigos', icon: Archive, tone: 'gold' },
      { id: 'trash', label: 'Lixeira', description: 'Leads removidos', icon: Trash2, tone: 'red' },
    ],
  },
];

interface CrmSidebarProps {
  activeTab: CrmTab;
  onSelectTab: (tab: CrmTab) => void;
  agendaUrgentCount: number;
  sidebarEditingTarget: boolean;
  onBeginTargetEdit: () => void;
  onCommitTargetEdit: () => void;
  onCancelTargetEdit?: () => void;
  targetInput: string;
  onTargetInputChange: (value: string) => void;
  targetGoal: number | null;
  targetPercent: number | null;
  onOpenCreateModal: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function CrmSidebar({
  activeTab,
  onSelectTab,
  agendaUrgentCount,
  sidebarEditingTarget,
  onBeginTargetEdit,
  onCommitTargetEdit,
  onCancelTargetEdit,
  targetInput,
  onTargetInputChange,
  targetGoal,
  targetPercent,
  onOpenCreateModal,
  onLogout,
  isLoggingOut,
}: CrmSidebarProps) {
  return (
    <aside className="sticky top-0 z-40 flex w-full flex-col border-b border-white/10 bg-[#050b13] p-3 lg:relative lg:z-10 lg:w-64 lg:border-b-0 lg:border-r lg:p-4">
      <div className="flex items-center justify-between gap-3 lg:justify-start">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a227] p-0.5 shadow-lg shadow-[#c9a227]/10">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#04080f]">
              <svg className="h-5 w-5 text-[#c9a227]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="font-display text-lg font-black tracking-tight text-white">
              LUME <span className="text-[#c9a227]">CRM</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Painel Comercial</p>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={onOpenCreateModal} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227] text-[#04080f] shadow-lg shadow-[#c9a227]/10 transition active:scale-95" title="Novo Lead">
            <Plus className="h-4.5 w-4.5" strokeWidth={3} />
          </button>
          <button onClick={onLogout} disabled={isLoggingOut} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] text-white/45 transition hover:text-red-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" title="Sair do CRM">
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      <div className="mt-5 hidden lg:block">
        <TargetGoalCard
          variant="compact"
          targetGoal={targetGoal}
          targetPercent={targetPercent}
          editing={sidebarEditingTarget}
          targetInput={targetInput}
          onInputChange={onTargetInputChange}
          onBeginEdit={onBeginTargetEdit}
          onCommitEdit={onCommitTargetEdit}
          onCancelEdit={onCancelTargetEdit ?? onCommitTargetEdit}
        />
      </div>

      <nav className="mt-3 flex flex-1 gap-2 overflow-x-auto pb-1 lg:mt-6 lg:flex-none lg:flex-col lg:gap-4 lg:overflow-visible lg:pb-0">
        {CRM_NAV_SECTIONS.map((section) => (
          <div key={section.label} className="flex shrink-0 gap-2 lg:flex-col">
            <p className="hidden px-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/30 lg:block">
              {section.label}
            </p>
            <div className="flex gap-2 lg:flex-col">
              {section.items.map((item) => {
                const Icon = item.icon;
                const tone = NAV_TONE_CLASSES[item.tone];
                const isActive = activeTab === item.id;
                const urgentAgenda = item.id === 'agenda' && agendaUrgentCount > 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`group flex min-w-40 shrink-0 items-center gap-2.5 rounded-xl border-l-4 px-3 py-2.5 text-left text-sm font-semibold tracking-wide transition-all active:scale-[0.98] lg:min-w-0 lg:shrink ${
                      isActive
                        ? tone.active
                        : 'border-transparent text-white/58 hover:bg-white/[0.03] hover:text-white'
                    }`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${isActive ? tone.icon : 'bg-white/[0.05] text-white/55 group-hover:text-white/85'}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{item.label}</span>
                      <span className="hidden truncate text-[10px] font-medium normal-case tracking-normal text-white/35 lg:block">
                        {item.description}
                      </span>
                    </span>
                    {urgentAgenda && (
                      <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[10px] font-black ${tone.badge}`}>
                        {agendaUrgentCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        </nav>

        <a
          href="/admin/"
          className="flex w-full items-center gap-3 rounded-xl border-l-4 border-[#c9a227] bg-[#c9a227]/12 px-3 py-2.5 text-sm font-semibold tracking-wide text-[#f5d77a] transition-all hover:bg-[#c9a227]/18 hover:text-white active:scale-95 lg:mt-3"
        >
          <Calculator className="h-4.5 w-4.5" strokeWidth={2.5} />
          Calculadora
        </a>

        <div className="hidden lg:mt-3 lg:block lg:space-y-2 lg:border-t lg:border-white/10 lg:pt-3">
        <button
          onClick={onOpenCreateModal}
          className="flex w-full items-center gap-3 rounded-xl border-l-4 border-[#c9a227] bg-[#c9a227]/12 px-3 py-2.5 text-sm font-semibold tracking-wide text-[#f5d77a] transition-all hover:bg-[#c9a227]/18 hover:text-white active:scale-95"
        >
          <Plus className="h-4.5 w-4.5" strokeWidth={2.5} />
          Novo Lead
        </button>
        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-xl border-l-4 border-transparent px-3 py-2.5 text-sm font-semibold tracking-wide text-white/65 transition-all hover:bg-red-500/10 hover:text-red-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut className="h-4.5 w-4.5" />
          {isLoggingOut ? 'Saindo...' : 'Sair do CRM'}
        </button>
      </div>
    </aside>
  );
}
