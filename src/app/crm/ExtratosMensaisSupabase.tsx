'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { supabase } from '@/lib/supabase';
import { getCrmApiErrorMessage, getCrmApiHeaders } from './utils';
import {
  endOfMonth,
  format,
  getDate,
  getMonth,
  getYear,
  setMonth,
  setYear,
  startOfMonth,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast, { Toaster } from 'react-hot-toast';
import {
  BarChart3,
  CalendarRange,
  Download,
  Layers3,
  Link2,
  Loader2,
  Package,
  ReceiptText,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type GlassPane = {
  oh?: number;
  ow?: number;
  h?: number;
  w?: number;
  label?: string;
};

type ExtratoRecord = {
  id: string;
  cliente?: string;
  valor?: number;
  qtd?: number;
  created_at?: string;
  selected_film?: string | null;
  modo_otimizacao?: string | null;
  vidros?: GlassPane[];
  bairro?: string | null;
  neighborhood?: string | null;
  area?: number | null;
  m2?: number | null;
  metros?: number | null;
  sqm?: number | null;
  lead_id?: string | null;
  lead_status?: string | null;
  service_date?: string | null;
  service_status?: ServiceStatus | null;
  source?: 'calculator' | 'lead';
};

type ServiceStatus = 'Marcado' | 'Confirmado' | 'Em Execucao' | 'Concluido' | 'Reagendar';

type LeadServiceRecord = {
  id: string;
  name?: string | null;
  value?: number | null;
  sqm?: number | null;
  film_type?: string | null;
  neighborhood?: string | null;
  status?: string | null;
  data_servico?: string | null;
  service_status?: string | null;
  status_changed_at?: string | null;
  created_at?: string | null;
  deleted_at?: string | null;
  dormant?: boolean | null;
};

type KpiCard = {
  label: string;
  value: string;
  subtext: string;
  icon: ComponentType<{ className?: string }>;
  tone: 'gold' | 'sky' | 'emerald' | 'white';
};

type FilmRankingItem = {
  nome: string;
  valor: number;
  jobs: number;
  area: number;
  ticket: number;
  share: number;
};

const FILM_LABELS: Record<string, string> = {
  carbono: 'Carbono',
  refletiva: 'Refletiva',
  dupla_camada: 'Dupla Camada',
  nano_ceramica: 'Nano Cerâmica',
  jateado: 'Jateado',
};

const WEEK_LABELS = ['Sem. 1', 'Sem. 2', 'Sem. 3', 'Sem. 4', 'Sem. 5'] as const;

const KPI_TONES: Record<KpiCard['tone'], string> = {
  gold: 'border-[#c9a227]/20 bg-[#c9a227]/10 text-[#f5d77a]',
  sky: 'border-sky-400/15 bg-sky-400/10 text-sky-200',
  emerald: 'border-emerald-400/15 bg-emerald-400/10 text-emerald-200',
  white: 'border-white/10 bg-white/[0.04] text-white/75',
};

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asNullableString(value: unknown) {
  return typeof value === 'string' && value ? value : null;
}

function asNumber(value: unknown) {
  const numberValue = Number(value || 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function parseDateValue(value?: string | null) {
  if (!value) return null;
  const normalized = value.includes('T') ? value : `${value}T12:00:00`;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function capitalizeFirst(text: string) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function semanaDoMes(diaDoMes: number) {
  if (diaDoMes <= 7) return 'Sem. 1';
  if (diaDoMes <= 14) return 'Sem. 2';
  if (diaDoMes <= 21) return 'Sem. 3';
  if (diaDoMes <= 28) return 'Sem. 4';
  return 'Sem. 5';
}

function normalizeServiceStatus(status: unknown): ServiceStatus | null {
  if (status === 'Marcado' || status === 'Confirmado' || status === 'Em Execucao' || status === 'Concluido' || status === 'Reagendar') {
    return status;
  }
  if (status === 'Em execução' || status === 'Em execuÃ§Ã£o') return 'Em Execucao';
  if (status === 'Concluído' || status === 'ConcluÃ­do') return 'Concluido';
  return null;
}

function getLeadServiceStatus(lead: LeadServiceRecord): ServiceStatus | null {
  const explicitStatus = normalizeServiceStatus(lead.service_status);
  if (explicitStatus) return explicitStatus;
  if (lead.data_servico) return 'Marcado';
  if (lead.status === 'Fechado') return 'Concluido';
  return null;
}

function getLeadServiceReferenceDate(lead: LeadServiceRecord) {
  return parseDateValue(lead.data_servico) || parseDateValue(lead.status_changed_at) || parseDateValue(lead.created_at);
}

function isServiceLeadInPeriod(lead: LeadServiceRecord, inicio: Date, fim: Date) {
  if (lead.deleted_at || lead.status === 'Perdido') return false;

  const serviceStatus = getLeadServiceStatus(lead);
  const hasValidServiceStatus = serviceStatus && serviceStatus !== 'Reagendar';
  if (!hasValidServiceStatus) return false;

  const referenceDate = getLeadServiceReferenceDate(lead);
  if (!referenceDate) return false;

  return referenceDate >= inicio && referenceDate <= fim;
}

function getServiceStatusLabel(status?: ServiceStatus | null) {
  if (status === 'Em Execucao') return 'Em execução';
  if (status === 'Concluido') return 'Feito';
  return status || 'Serviço';
}

function normalizeRecord(row: Record<string, unknown>, lead?: LeadServiceRecord): ExtratoRecord {
  const serviceStatus = lead ? getLeadServiceStatus(lead) : null;
  const serviceDate = lead ? getLeadServiceReferenceDate(lead)?.toISOString() || null : null;

  return {
    id: asString(row.id) || lead?.id || crypto.randomUUID(),
    cliente: asString(row.cliente) || asString(row.name) || asString(row.nome) || lead?.name || '',
    valor: asNumber(row.valor) || asNumber(lead?.value),
    qtd: asNumber(row.qtd),
    created_at: serviceDate || asString(row.created_at) || asString(row.data) || asString(row.createdAt) || new Date().toISOString(),
    selected_film: asNullableString(row.selected_film) || asNullableString(row.selectedFilm) || asNullableString(lead?.film_type),
    modo_otimizacao: asNullableString(row.modo_otimizacao) || asNullableString(row.modoOtimizacao),
    vidros: Array.isArray(row.vidros) ? row.vidros as GlassPane[] : [],
    bairro: asNullableString(row.bairro) || asNullableString(row.neighborhood) || asNullableString(row.bairro_cliente) || asNullableString(lead?.neighborhood),
    neighborhood: asNullableString(row.neighborhood) || asNullableString(lead?.neighborhood),
    area: row.area === null || row.area === undefined ? null : asNumber(row.area),
    m2: row.m2 === null || row.m2 === undefined ? lead?.sqm ?? null : asNumber(row.m2),
    metros: row.metros === null || row.metros === undefined ? null : asNumber(row.metros),
    sqm: row.sqm === null || row.sqm === undefined ? lead?.sqm ?? null : asNumber(row.sqm),
    lead_id: asNullableString(row.lead_id) || lead?.id || null,
    lead_status: lead?.status || null,
    service_date: serviceDate,
    service_status: serviceStatus,
    source: row.id ? 'calculator' : 'lead',
  };
}

function getFilmLabel(record: ExtratoRecord) {
  if (record.selected_film) {
    return FILM_LABELS[record.selected_film] || record.selected_film;
  }

  if (record.modo_otimizacao) {
    if (record.modo_otimizacao === 'densidade') return 'Nano Cerâmica';
    if (record.modo_otimizacao === 'facilidade') return 'Refletiva';
    if (record.modo_otimizacao === 'facilidade_v2') return 'Carbono';
    return record.modo_otimizacao;
  }

  return 'Não informado';
}

function getAreaTotal(record: ExtratoRecord) {
  const explicitValue =
    Number(record.m2 || 0) ||
    Number(record.metros || 0) ||
    Number(record.area || 0) ||
    Number(record.sqm || 0);

  if (explicitValue > 0) return explicitValue;

  if (!Array.isArray(record.vidros) || record.vidros.length === 0) return 0;

  return record.vidros.reduce((sum, vidro) => {
    const h = Number(vidro.oh ?? vidro.h ?? 0);
    const w = Number(vidro.ow ?? vidro.w ?? 0);
    return sum + (h * w) / 10000;
  }, 0);
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl border border-white/5 bg-white/[0.03] animate-pulse"
          />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <div className="h-[320px] rounded-2xl border border-white/5 bg-white/[0.03] animate-pulse" />
        <div className="h-[320px] rounded-2xl border border-white/5 bg-white/[0.03] animate-pulse" />
      </div>
      <div className="h-[420px] rounded-2xl border border-white/5 bg-white/[0.03] animate-pulse" />
    </div>
  );
}

export function ExtratosMensaisSupabase() {
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(getMonth(hoje));
  const [anoSelecionado, setAnoSelecionado] = useState(getYear(hoje));
  const [registros, setRegistros] = useState<ExtratoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exportando, setExportando] = useState(false);

  const meses = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) =>
        capitalizeFirst(format(setMonth(new Date(), index), 'MMMM', { locale: ptBR }))
      ),
    []
  );

  const anos = useMemo(() => {
    const currentYear = getYear(new Date());
    return Array.from({ length: currentYear - 2025 + 2 }, (_, index) => 2025 + index);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function carregarExtrato() {
      if (!supabase) {
        if (cancelled) return;
        setRegistros([]);
        setLoading(false);
        setErrorMessage('Supabase não configurado.');
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      const dataReferencia = setYear(setMonth(new Date(), mesSelecionado), anoSelecionado);
      const inicio = startOfMonth(dataReferencia);
      const fim = endOfMonth(dataReferencia);

      const leadsResponse = await fetch('/api/crm/leads', {
        headers: await getCrmApiHeaders(),
        credentials: 'same-origin',
        cache: 'no-store',
      });
      const leadsPayload = await leadsResponse.json().catch(() => null);

      if (cancelled) return;

      if (!leadsResponse.ok || !Array.isArray(leadsPayload)) {
        const details = getCrmApiErrorMessage(leadsPayload, leadsResponse.statusText);
        setRegistros([]);
        setErrorMessage(`Erro ao carregar serviços do CRM: ${details}`);
        toast.error('Erro ao carregar serviços do CRM');
        setLoading(false);
        return;
      }

      const serviceLeads = (leadsPayload as LeadServiceRecord[])
        .filter((lead) => isServiceLeadInPeriod(lead, inicio, fim));
      const serviceLeadIds = serviceLeads.map((lead) => lead.id).filter(Boolean);

      if (serviceLeadIds.length === 0) {
        setRegistros([]);
        setLoading(false);
        return;
      }

      const { data: historyData, error: historyError } = await supabase
        .from('calculator_history')
        .select('*')
        .in('lead_id', serviceLeadIds)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (historyError) {
        setRegistros([]);
        setErrorMessage('Erro ao carregar orçamentos vinculados aos serviços.');
        toast.error('Erro ao carregar orçamentos vinculados');
        setLoading(false);
        return;
      }

      const historyByLeadId = new Map<string, Record<string, unknown>>();
      (historyData || []).forEach((row) => {
        const leadId = asNullableString((row as Record<string, unknown>).lead_id);
        if (leadId && !historyByLeadId.has(leadId)) {
          historyByLeadId.set(leadId, row as Record<string, unknown>);
        }
      });

      setRegistros(serviceLeads.map((lead) => normalizeRecord(historyByLeadId.get(lead.id) || {}, lead)));
      setLoading(false);
    }

    carregarExtrato();

    return () => {
      cancelled = true;
    };
  }, [mesSelecionado, anoSelecionado]);

  const tituloMes = capitalizeFirst(
    format(setMonth(new Date(), mesSelecionado), 'MMMM', { locale: ptBR })
  );

  const dadosOrdenados = useMemo(
    () =>
      [...registros].sort((a, b) => {
        const da = new Date(a.created_at || 0).getTime();
        const db = new Date(b.created_at || 0).getTime();
        return db - da;
      }),
    [registros]
  );

  const faturamentoTotal = useMemo(
    () => registros.reduce((sum, row) => sum + Number(row.valor || 0), 0),
    [registros]
  );

  const numJobs = registros.length;
  const ticketMedio = numJobs > 0 ? faturamentoTotal / numJobs : 0;

  const m2Total = useMemo(
    () => registros.reduce((sum, row) => sum + getAreaTotal(row), 0),
    [registros]
  );

  const maiorOrcamento = useMemo(
    () => (registros.length > 0 ? Math.max(...registros.map((row) => Number(row.valor || 0))) : 0),
    [registros]
  );

  const calculatorSourceCount = useMemo(
    () => registros.filter((record) => record.source === 'calculator').length,
    [registros]
  );

  const servicosFeitos = useMemo(
    () => registros.filter((record) => record.service_status === 'Concluido').length,
    [registros]
  );

  const servicosAgendados = Math.max(0, numJobs - servicosFeitos);

  const dadosSemana = useMemo(() => {
    const base = WEEK_LABELS.reduce<Record<typeof WEEK_LABELS[number], number>>((acc, label) => {
      acc[label] = 0;
      return acc;
    }, {} as Record<typeof WEEK_LABELS[number], number>);

    registros.forEach((record) => {
      const key = semanaDoMes(getDate(new Date(record.created_at || new Date()))) as typeof WEEK_LABELS[number];
      base[key] += Number(record.valor || 0);
    });

    return WEEK_LABELS.map((semana) => ({ semana, valor: base[semana] }));
  }, [registros]);

  const rankingPeliculas = useMemo<FilmRankingItem[]>(() => {
    const porPelicula: Record<string, { valor: number; jobs: number; area: number }> = {};

    registros.forEach((record) => {
      const nome = getFilmLabel(record);
      if (!porPelicula[nome]) porPelicula[nome] = { valor: 0, jobs: 0, area: 0 };
      porPelicula[nome].valor += Number(record.valor || 0);
      porPelicula[nome].jobs += 1;
      porPelicula[nome].area += getAreaTotal(record);
    });

    return Object.entries(porPelicula)
      .map(([nome, dados]) => ({
        nome,
        valor: dados.valor,
        jobs: dados.jobs,
        area: dados.area,
        ticket: dados.jobs > 0 ? dados.valor / dados.jobs : 0,
        share: faturamentoTotal > 0 ? (dados.valor / faturamentoTotal) * 100 : 0,
      }))
      .sort((a, b) => b.valor - a.valor);
  }, [faturamentoTotal, registros]);

  const melhorSemana = useMemo(() => {
    if (faturamentoTotal <= 0) return null;
    return dadosSemana.reduce((best, current) => (current.valor > best.valor ? current : best));
  }, [dadosSemana, faturamentoTotal]);

  const melhorDia = useMemo(() => {
    if (faturamentoTotal <= 0) return null;

    const porDia: Record<string, { valor: number; jobs: number }> = {};
    registros.forEach((record) => {
      const key = format(new Date(record.created_at || new Date()), 'yyyy-MM-dd');
      if (!porDia[key]) porDia[key] = { valor: 0, jobs: 0 };
      porDia[key].valor += Number(record.valor || 0);
      porDia[key].jobs += 1;
    });

    return Object.entries(porDia)
      .map(([dia, dados]) => ({ dia, ...dados }))
      .sort((a, b) => b.valor - a.valor)[0] || null;
  }, [faturamentoTotal, registros]);

  const peliculaLider = rankingPeliculas[0] || null;

  const tabelaResumo = useMemo(
    () =>
      dadosOrdenados.map((record) => ({
        cliente: record.cliente || 'Sem nome',
        pelicula: getFilmLabel(record),
        valor: formatBRL(Number(record.valor || 0)),
        area: getAreaTotal(record),
        data: record.created_at ? format(new Date(record.created_at), 'dd/MM/yyyy') : '-',
        status: getServiceStatusLabel(record.service_status),
        origem: record.source === 'calculator' ? 'Orçamento' : 'Lead',
      })),
    [dadosOrdenados]
  );

  const kpis: KpiCard[] = useMemo(() => {
    return [
      {
        label: 'Faturamento',
        value: formatBRL(faturamentoTotal),
        subtext: 'serviços feitos e agendados',
        icon: Wallet,
        tone: 'gold',
      },
      {
        label: 'Serviços',
        value: String(numJobs),
        subtext: `${servicosAgendados} agendado${servicosAgendados !== 1 ? 's' : ''} • ${servicosFeitos} feito${servicosFeitos !== 1 ? 's' : ''}`,
        icon: ReceiptText,
        tone: 'white',
      },
      {
        label: 'Ticket médio',
        value: formatBRL(ticketMedio),
        subtext: 'receita média por serviço',
        icon: TrendingUp,
        tone: 'emerald',
      },
      {
        label: m2Total > 0 ? 'Área estimada' : 'Maior serviço',
        value: m2Total > 0 ? `${m2Total.toFixed(1)} m²` : formatBRL(maiorOrcamento),
        subtext: m2Total > 0 ? 'm² somados no extrato' : 'maior valor individual',
        icon: Package,
        tone: 'sky',
      },
    ];
  }, [faturamentoTotal, maiorOrcamento, m2Total, numJobs, servicosAgendados, servicosFeitos, ticketMedio]);

  async function exportarPDF() {
    const elemento = document.getElementById('extrato-conteudo');
    if (!elemento) return;

    let toastId: string | undefined;

    try {
      setExportando(true);
      toastId = toast.loading('Gerando PDF...');

      const canvas = await html2canvas(elemento, {
        scale: 2,
        backgroundColor: '#04080f',
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`extrato-lume-${anoSelecionado}-${String(mesSelecionado + 1).padStart(2, '0')}.pdf`);

      toast.success('PDF exportado com sucesso!');
    } catch {
      toast.error('Não foi possível exportar o PDF.');
    } finally {
      if (toastId) toast.dismiss(toastId);
      setExportando(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden space-y-5 bg-[#040811] px-4 py-6 md:px-6 md:py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-12 h-80 w-80 rounded-full bg-[#c9a227]/6 blur-[120px]" />
        <div className="absolute right-[6%] top-32 h-[420px] w-[420px] rounded-full bg-sky-500/5 blur-[160px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[32rem] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[120px]" />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#07111d',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
          },
        }}
      />

      <div className="relative rounded-2xl border border-white/5 bg-gradient-to-br from-[#07111d]/95 via-[#07111d]/80 to-[#04080f]/95 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent" />
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#eab308]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#eab308]" />
              Fechamento comercial
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
              Extratos Mensais
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 md:text-[15px]">
              Receita, mix de películas e lista de serviços feitos ou agendados no mês, sem misturar orçamentos que não viraram execução.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[165px]">
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                Mês
              </label>
              <select
                value={mesSelecionado}
                onChange={(event) => setMesSelecionado(Number(event.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-[#04080f] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c9a227]/50"
              >
                {meses.map((mes, index) => (
                  <option key={mes} value={index} className="bg-[#04080f]">
                    {mes}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[135px]">
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                Ano
              </label>
              <select
                value={anoSelecionado}
                onChange={(event) => setAnoSelecionado(Number(event.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-[#04080f] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c9a227]/50"
              >
                {anos.map((ano) => (
                  <option key={ano} value={ano} className="bg-[#04080f]">
                    {ano}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={exportarPDF}
              disabled={loading || exportando}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c9a227] to-[#d4ad30] px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#04080f] shadow-lg shadow-[#c9a227]/10 transition hover:brightness-110 disabled:opacity-60"
            >
              {exportando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              PDF
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : errorMessage ? (
        <div className="relative rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-red-300">
          <p className="font-semibold">{errorMessage}</p>
        </div>
      ) : (
        <div id="extrato-conteudo" className="relative space-y-5">
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.label}
                  className="group rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-[#c9a227]/20 hover:bg-white/[0.045]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-white/40 font-semibold">
                        {card.label}
                      </span>
                      <p className="mt-2 truncate text-2xl font-black tracking-tight text-white">
                        {card.value}
                      </p>
                      <p className="mt-1 text-xs text-white/40">{card.subtext}</p>
                    </div>
                    <div className={`rounded-2xl border p-3 shadow-inner shadow-black/20 transition ${KPI_TONES[card.tone]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
            <article className="rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                    Faturamento por semana
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    {tituloMes} / {anoSelecionado}
                  </h3>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/55">
                  <CalendarRange className="h-3.5 w-3.5 text-[#eab308]" />
                  {numJobs} serviço{numJobs !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="h-[285px]">
                {faturamentoTotal <= 0 ? (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center text-sm text-white/35">
                    Nenhum serviço feito ou agendado neste período.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosSemana} barSize={44} barGap={8}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.045)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="semana"
                        tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.58)' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }}
                        tickFormatter={(value) => `R$${(Number(value) / 1000).toFixed(0)}k`}
                        width={56}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.045)' }}
                        formatter={(value: number) => formatBRL(Number(value))}
                        contentStyle={{
                          background: '#04080f',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 14,
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                        {dadosSemana.map((entry) => (
                          <Cell
                            key={entry.semana}
                            fill={entry.semana === melhorSemana?.semana ? '#f7d66a' : '#8a6d10'}
                            fillOpacity={entry.valor > 0 ? 1 : 0.28}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </article>

            <article className="rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                    Leitura do mês
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">Sinais úteis</h3>
                </div>
                <Sparkles className="h-5 w-5 text-[#f5d77a]" />
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-[#c9a227]/10 bg-[#c9a227]/10 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f5d77a]/70">
                    Película líder
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="min-w-0 truncate text-2xl font-black text-white">
                      {peliculaLider?.nome || 'Sem dados'}
                    </p>
                    <p className="shrink-0 text-sm font-bold text-[#f5d77a]">
                      {peliculaLider ? formatPercent(peliculaLider.share) : '-'}
                    </p>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8a6d10] via-[#eab308] to-[#f7d66a]"
                      style={{ width: peliculaLider ? `${Math.min(100, peliculaLider.share)}%` : '0%' }}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-white/40">Melhor semana</p>
                      <p className="mt-1 font-bold text-white">{melhorSemana?.semana || '-'}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-[#f5d77a]">
                      {formatBRL(melhorSemana?.valor || 0)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-white/40">Melhor dia</p>
                      <p className="mt-1 font-bold text-white">
                        {melhorDia ? format(new Date(`${melhorDia.dia}T12:00:00`), 'dd/MM') : '-'}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-[#f5d77a]">
                      {formatBRL(melhorDia?.valor || 0)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs text-white/40">Com orçamento vinculado</p>
                      <p className="mt-1 font-bold text-white">
                        {calculatorSourceCount}/{numJobs}
                      </p>
                    </div>
                    <Link2 className="h-4 w-4 text-sky-200" />
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
            <article className="rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                    Ranking de películas
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">Mix de receita e volume</h3>
                </div>
                <Layers3 className="h-5 w-5 text-[#c9a227]" />
              </div>

              {rankingPeliculas.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-white/40">
                  Nenhum dado para agrupar por película.
                </p>
              ) : (
                <div className="space-y-3">
                  {rankingPeliculas.map((item, index) => (
                    <div
                      key={item.nome}
                      className="rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-4 transition hover:border-[#c9a227]/20 hover:bg-white/[0.04]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-black text-white/55">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">{item.nome}</p>
                            <p className="text-xs text-white/40">
                              {item.jobs} serviço{item.jobs !== 1 ? 's' : ''} • ticket {formatBRL(item.ticket)}
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-sm font-bold text-[#f5d77a]">{formatBRL(item.valor)}</p>
                          <p className="text-xs text-white/40">
                            {formatPercent(item.share)} do mês{item.area > 0 ? ` • ${item.area.toFixed(1)} m²` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#8a6d10] via-[#d4ad30] to-[#f5d77a]"
                          style={{ width: `${Math.max(4, Math.min(100, item.share))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                    Serviços do período
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">Lista operacional</h3>
                </div>
                <BarChart3 className="h-5 w-5 text-[#c9a227]" />
              </div>

              {tabelaResumo.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-white/40">
                  Nenhum serviço feito ou agendado em {tituloMes} {anoSelecionado}.
                </p>
              ) : (
                <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
                  {tabelaResumo.map((row, index) => (
                    <div
                      key={`${row.cliente}-${row.data}-${index}`}
                      className="rounded-2xl border border-white/5 bg-white/[0.025] px-4 py-3 transition hover:border-white/10 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white">{row.cliente}</p>
                          <p className="mt-1 truncate text-xs text-white/45">
                            {row.pelicula} • {row.status} • {row.data}
                            {row.area > 0 ? ` • ${row.area.toFixed(1)} m²` : ''}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-[#f5d77a]">{row.valor}</p>
                          <p className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${row.origem === 'Orçamento' ? 'text-sky-200/80' : 'text-white/40'}`}>
                            {row.origem}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        </div>
      )}
    </div>
  );
}
