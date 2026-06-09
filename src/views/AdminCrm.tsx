'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-server';
import { format, isThisMonth, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import {
  LogOut,
  X,
  Save,
  Trash2,
  TrendingUp,
  DollarSign,
  Percent,
  AlertTriangle,
  Search,
  BarChart3,
  Calendar,
  Layers,
} from 'lucide-react';

type CrmStatus =
  | 'Novo'
  | 'Orcamento Enviado'
  | 'Em Negociacao'
  | 'Aprovado'
  | 'Aguardando Retorno'
  | 'Declinado';

interface OrcamentoCrm {
  id: string;
  cliente: string;
  valor: number;
  qtd: number;
  modo_otimizacao: string;
  desconto: number;
  created_at: string;
  status: CrmStatus;
  data_ultimo_contato: string;
  data_proximo_contato: string | null;
  motivo_declinio: string | null;
  anotacoes: string | null;
}

function normalizeOrcamento(data: any): OrcamentoCrm {
  return {
    id: data.id,
    cliente: data.cliente || '',
    valor: data.valor || 0,
    qtd: data.qtd || 0,
    modo_otimizacao: data.modo_otimizacao || data.modoOtimizacao || '',
    desconto: data.desconto || 0,
    created_at: data.created_at || data.data || new Date().toISOString(),
    status: data.status || 'Novo',
    data_ultimo_contato: data.data_ultimo_contato || data.created_at || data.data || new Date().toISOString(),
    data_proximo_contato: data.data_proximo_contato || null,
    motivo_declinio: data.motivo_declinio || null,
    anotacoes: data.anotacoes || null,
  };
}

const KANBAN_COLUMNS: { status: CrmStatus; color: string; label: string }[] = [
  { status: 'Novo', color: '#3b82f6', label: 'Novo' },
  { status: 'Orcamento Enviado', color: '#8b5cf6', label: 'Orç. Enviado' },
  { status: 'Em Negociacao', color: '#eab308', label: 'Em Negociação' },
  { status: 'Aprovado', color: '#22c55e', label: 'Aprovado' },
  { status: 'Aguardando Retorno', color: '#f97316', label: 'Aguardando' },
  { status: 'Declinado', color: '#ef4444', label: 'Declinado' },
];

const STATUS_OPTIONS = KANBAN_COLUMNS.map((c) => c.status);

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function AnimatedCounter({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = display;
    const end = value;
    const duration = 600;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [value]);

  const formatted = display.toLocaleString('pt-BR');
  return (
    <span>
      {prefix}
      {formatted}
    </span>
  );
}

function KanbanCard({
  orc,
  onClick,
  onDragStart,
}: {
  orc: OrcamentoCrm;
  onClick: (o: OrcamentoCrm) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) {
  const col = KANBAN_COLUMNS.find((c) => c.status === orc.status);
  const isOverdue =
    orc.data_proximo_contato &&
    isBefore(startOfDay(new Date(orc.data_proximo_contato)), startOfDay(new Date()));

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, orc.id)}
      onClick={() => onClick(orc)}
      className="w-full text-left rounded-xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.06] cursor-pointer select-none"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-bold text-white text-sm leading-tight truncate">
          {orc.cliente}
        </span>
        {isOverdue && (
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 animate-pulse" />
        )}
      </div>

      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <span
          className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${col?.color}20`,
            color: col?.color,
          }}
        >
          {orc.modo_otimizacao || '—'}
        </span>
        {orc.qtd > 0 && (
          <span className="inline-block text-[10px] font-semibold text-white/40 tracking-wider px-2 py-0.5 rounded-full bg-white/5">
            {orc.qtd} vidro{orc.qtd > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-2xl font-bold" style={{ color: col?.color }}>
          {formatCurrency(orc.valor)}
        </span>
        {orc.desconto > 0 && (
          <span className="text-[10px] font-semibold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded-full">
            -{orc.desconto}%
          </span>
        )}
      </div>

      <div className="mt-2 text-[11px] text-white/40">
        Último contato:{' '}
        {format(new Date(orc.data_ultimo_contato), "dd MMM yyyy", { locale: ptBR })}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  prefix,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  prefix?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="flex-1 min-w-[160px] rounded-xl border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" style={{ color: accent }} />
        <span className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">
          {label}
        </span>
      </div>
      <div className="text-xl font-bold text-white">
        <AnimatedCounter value={value} prefix={prefix} />
      </div>
    </div>
  );
}

function EditModal({
  orc,
  onClose,
  onSave,
  onDelete,
}: {
  orc: OrcamentoCrm;
  onClose: () => void;
  onSave: (id: string, updates: Partial<OrcamentoCrm>) => void;
  onDelete: (id: string) => void;
}) {
  const [cliente, setCliente] = useState(orc.cliente);
  const [status, setStatus] = useState<CrmStatus>(orc.status);
  const [dataProximoContato, setDataProximoContato] = useState(
    orc.data_proximo_contato || ''
  );
  const [anotacoes, setAnotacoes] = useState(orc.anotacoes || '');
  const [motivoDeclinio, setMotivoDeclinio] = useState(orc.motivo_declinio || '');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const col = KANBAN_COLUMNS.find((c) => c.status === orc.status);

  const handleSave = async () => {
    if (status === 'Declinado' && !motivoDeclinio.trim()) {
      toast.error('Informe o motivo do declínio.');
      return;
    }
    if (!cliente.trim()) {
      toast.error('Nome do cliente é obrigatório.');
      return;
    }

    setSaving(true);
    const updates: Partial<OrcamentoCrm> = {
      cliente: cliente.trim(),
      status,
      data_proximo_contato: dataProximoContato || null,
      anotacoes: anotacoes || null,
      motivo_declinio: status === 'Declinado' ? motivoDeclinio : null,
      data_ultimo_contato: new Date().toISOString(),
    };

    await onSave(orc.id, updates);
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0f1a] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white truncate">{orc.cliente}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.03] p-3">
            <span className="text-xs text-white/40 uppercase tracking-wider">Filme:</span>
            <span className="text-sm text-white font-medium">{orc.modo_otimizacao}</span>
            <span className="ml-auto text-lg font-bold" style={{ color: col?.color }}>
              {formatCurrency(orc.valor)}
            </span>
          </div>

          <div className="flex gap-3">
            {orc.qtd > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
                <Layers className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs text-white/60">{orc.qtd} vidro{orc.qtd > 1 ? 's' : ''}</span>
              </div>
            )}
            {orc.desconto > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/[0.05] px-3 py-2">
                <span className="text-xs text-green-400">-{orc.desconto}% desconto</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 ml-auto">
              <Calendar className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs text-white/60">
                {format(new Date(orc.created_at), "dd/MM/yyyy")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">
              Cliente
            </label>
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#c9a227] transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CrmStatus)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#c9a227] transition"
            >
              {STATUS_OPTIONS.map((s) => {
                const c = KANBAN_COLUMNS.find((k) => k.status === s);
                return (
                  <option key={s} value={s} className="bg-[#0a0f1a]">
                    {c?.label}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">
              Próximo Contato
            </label>
            <input
              type="date"
              value={dataProximoContato}
              onChange={(e) => setDataProximoContato(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#c9a227] transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">
              Anotações
            </label>
            <textarea
              value={anotacoes}
              onChange={(e) => setAnotacoes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-[#c9a227] transition resize-none"
            />
          </div>

          {status === 'Declinado' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-red-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Motivo do Declínio *
              </label>
              <input
                type="text"
                value={motivoDeclinio}
                onChange={(e) => setMotivoDeclinio(e.target.value)}
                placeholder="Ex: preço alto, desistiu..."
                className="w-full rounded-lg border border-red-500/40 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-red-400 transition"
              />
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/5 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#c9a227] to-[#8a6d10] text-[#040811] text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full py-2.5 rounded-lg border border-red-500/20 text-red-400/60 text-xs font-semibold hover:border-red-500/40 hover:text-red-400 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Excluir Orçamento
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-red-400 text-center">
                  Tem certeza? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-2 rounded-lg border border-white/10 text-white/60 text-xs font-semibold hover:bg-white/5 transition"
                  >
                    Não
                  </button>
                  <button
                    onClick={() => onDelete(orc.id)}
                    className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-500 transition"
                  >
                    Sim, Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto p-4 md:p-6">
      {KANBAN_COLUMNS.map((col) => (
        <div key={col.status} className="min-w-[260px] flex-1">
          <div className="h-8 w-32 rounded-lg mb-4 animate-pulse" style={{ backgroundColor: `${col.color}15` }} />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl mb-3 animate-pulse bg-white/[0.03]"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

type PeriodFilter = 'mes' | 'todos';

export default function AdminCrm() {
  const [orcamentos, setOrcamentos] = useState<OrcamentoCrm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrcamento, setSelectedOrcamento] = useState<OrcamentoCrm | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileColumn, setMobileColumn] = useState<CrmStatus>('Novo');
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('mes');
  const [dragOverStatus, setDragOverStatus] = useState<CrmStatus | null>(null);

  const draggedIdRef = useRef<string | null>(null);

  const supabaseRef = useRef(createSupabaseBrowserClient());

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchOrcamentos = useCallback(async () => {
    const { data, error } = await supabaseRef.current
      .from('calculator_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      toast.error('Erro ao carregar orçamentos.');
      setLoading(false);
      return;
    }

    setOrcamentos((data as any[])?.map(normalizeOrcamento) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrcamentos();

    const channel = supabaseRef.current
      .channel('crm-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'calculator_history' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRecord = normalizeOrcamento(payload.new);
            setOrcamentos((prev) => [newRecord, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = normalizeOrcamento(payload.new);
            setOrcamentos((prev) =>
              prev.map((o) => (o.id === updated.id ? updated : o))
            );
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id: string };
            setOrcamentos((prev) => prev.filter((o) => o.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabaseRef.current.removeChannel(channel);
    };
  }, [fetchOrcamentos]);

  const handleSaveModal = useCallback(
    async (id: string, updates: Partial<OrcamentoCrm>) => {
      const previous = [...orcamentos];
      setOrcamentos((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
      );
      setSelectedOrcamento(null);

      const { error } = await supabaseRef.current
        .from('calculator_history')
        .update(updates)
        .eq('id', id);

      if (error) {
        setOrcamentos(previous);
        toast.error('Erro ao salvar. Tente novamente.');
      } else {
        toast.success('Orçamento atualizado!');
      }
    },
    [orcamentos]
  );

  const handleLogout = async () => {
    await supabaseRef.current.auth.signOut();
    window.location.href = '/login';
  };

  const handleDelete = useCallback(
    async (id: string) => {
      const previous = [...orcamentos];
      setOrcamentos((prev) => prev.filter((o) => o.id !== id));
      setSelectedOrcamento(null);

      const { error } = await supabaseRef.current
        .from('calculator_history')
        .delete()
        .eq('id', id);

      if (error) {
        setOrcamentos(previous);
        toast.error('Erro ao excluir. Tente novamente.');
      } else {
        toast.success('Orçamento excluído.');
      }
    },
    [orcamentos]
  );

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    draggedIdRef.current = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: CrmStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStatus(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverStatus(null);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, newStatus: CrmStatus) => {
      e.preventDefault();
      setDragOverStatus(null);
      const id = draggedIdRef.current;
      if (!id) return;

      const orc = orcamentos.find((o) => o.id === id);
      if (!orc || orc.status === newStatus) {
        draggedIdRef.current = null;
        return;
      }

      const previous = [...orcamentos];
      setOrcamentos((prev) =>
        prev.map((o) =>
          o.id === id
            ? { ...o, status: newStatus, data_ultimo_contato: new Date().toISOString() }
            : o
        )
      );

      const { error } = await supabaseRef.current
        .from('calculator_history')
        .update({ status: newStatus, data_ultimo_contato: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        setOrcamentos(previous);
        toast.error('Erro ao mover. Tente novamente.');
      } else {
        const colLabel = KANBAN_COLUMNS.find((c) => c.status === newStatus)?.label;
        toast.success(`Movido para "${colLabel}"`);
      }

      draggedIdRef.current = null;
    },
    [orcamentos]
  );

  const filteredOrcamentos = useMemo(() => {
    let result = orcamentos;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.cliente.toLowerCase().includes(q) ||
          o.modo_otimizacao?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orcamentos, searchQuery]);

  const metrics = useMemo(() => {
    const base =
          periodFilter === 'mes'
        ? filteredOrcamentos.filter((o) =>
            isThisMonth(new Date(o.created_at))
          )
        : filteredOrcamentos;

    const faturamentoConfirmado = base
      .filter((o) => o.status === 'Aprovado')
      .reduce((s, o) => s + o.valor, 0);
    const faturamentoPotencial = base
      .filter((o) =>
        ['Novo', 'Orcamento Enviado', 'Em Negociacao', 'Aguardando Retorno'].includes(
          o.status
        )
      )
      .reduce((s, o) => s + o.valor, 0);
    const total = base.length || 1;
    const aprovados = base.filter((o) => o.status === 'Aprovado').length;
    const taxaConversao = Math.round((aprovados / total) * 100);

    return { faturamentoConfirmado, faturamentoPotencial, taxaConversao };
  }, [filteredOrcamentos, periodFilter]);

  const columns = KANBAN_COLUMNS.map((col) => ({
    ...col,
    items: filteredOrcamentos.filter((o) => o.status === col.status),
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040811]">
        <div className="p-4 md:p-6">
          <div className="h-10 w-48 rounded-lg mb-4 animate-pulse bg-white/[0.05]" />
          <div className="flex gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-20 rounded-xl animate-pulse bg-white/[0.03]" />
            ))}
          </div>
        </div>
        <KanbanSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040811]">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0f1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />

      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/5">
        <h1 className="text-lg font-montserrat font-bold tracking-wider uppercase text-white">
          LUME CRM
        </h1>
        <div className="flex items-center gap-4">
          <a
            href="/admin/relatorios"
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#c9a227] transition"
          >
            <BarChart3 className="w-4 h-4" />
            Relatórios
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <div className="px-4 md:px-6 py-4 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente ou película..."
              className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-[#c9a227] transition"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setPeriodFilter('mes')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                periodFilter === 'mes'
                  ? 'bg-[#c9a227] text-[#040811]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => setPeriodFilter('todos')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                periodFilter === 'todos'
                  ? 'bg-[#c9a227] text-[#040811]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Todos
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <MetricCard
            label="Faturamento Confirmado"
            value={metrics.faturamentoConfirmado}
            prefix="R$ "
            icon={DollarSign}
            accent="#22c55e"
          />
          <MetricCard
            label="Faturamento Potencial"
            value={metrics.faturamentoPotencial}
            prefix="R$ "
            icon={TrendingUp}
            accent="#eab308"
          />
          <MetricCard
            label="Taxa de Conversão"
            value={metrics.taxaConversao}
            prefix="% "
            icon={Percent}
            accent="#3b82f6"
          />
        </div>
      </div>

      {isMobile && (
        <div className="px-4 pb-2">
          <select
            value={mobileColumn}
            onChange={(e) => setMobileColumn(e.target.value as CrmStatus)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white text-sm outline-none"
          >
            {KANBAN_COLUMNS.map((col) => (
              <option key={col.status} value={col.status} className="bg-[#0a0f1a]">
                {col.label} ({columns.find((c) => c.status === col.status)?.items.length || 0})
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        className={
          isMobile
            ? 'px-4 pb-6 flex flex-col gap-3'
            : 'flex gap-4 overflow-x-auto px-4 md:px-6 pb-6'
        }
      >
        {(isMobile
          ? columns.filter((c) => c.status === mobileColumn)
          : columns
        ).map((col) => (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.status)}
            className={`transition-colors rounded-xl ${
              isMobile ? 'flex flex-col' : 'min-w-[260px] flex-1 flex flex-col'
            } ${dragOverStatus === col.status ? 'bg-white/[0.02] ring-1 ring-white/20' : ''}`}
          >
            <div
              className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
              style={{ backgroundColor: `${col.color}10` }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: col.color }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                {col.label}
              </span>
              <span
                className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${col.color}20`,
                  color: col.color,
                }}
              >
                {col.items.length}
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-[calc(100vh-340px)] overflow-y-auto pr-1 min-h-[80px]">
              {col.items.length === 0 ? (
                <div className="text-center text-white/20 text-xs py-8">
                  Nenhum orçamento
                </div>
              ) : (
                col.items.map((orc) => (
                  <KanbanCard
                    key={orc.id}
                    orc={orc}
                    onClick={setSelectedOrcamento}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedOrcamento && (
        <EditModal
          orc={selectedOrcamento}
          onClose={() => setSelectedOrcamento(null)}
          onSave={handleSaveModal}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
