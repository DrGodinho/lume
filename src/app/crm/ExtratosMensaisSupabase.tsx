'use client';

import { fetchWithTimeout, isAbortError } from '@/lib/fetchWithTimeout';
import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
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
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast, { Toaster } from 'react-hot-toast';
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  CalendarRange,
  Clock,
  Download,
  Layers3,
  Loader2,
  MapPin,
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
  w?: number;
  h?: number;
  ow?: number;
  oh?: number;
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
  valorPorM2: number;
  areaShare: number;
};

type BairroItem = {
  bairro: string;
  valor: number;
  jobs: number;
  ticket: number;
  share: number;
};

const FILM_LABELS: Record<string, string> = {
  carbono: 'Carbono G20',
  carbono_g5: 'Carbono G5',
  carbono_g20: 'Carbono G20',
  refletiva: 'Refletiva',
  dupla_camada: 'Dupla Camada',
  nano_ceramica: 'Nano Cerâmica 75',
  nano_ceramica_g20: 'Nano Cerâmica G20',
  jateado: 'Jateado',
};

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

function normalizeServiceStatus(status: unknown): ServiceStatus | null {
  if (
    status === 'Marcado' ||
    status === 'Confirmado' ||
    status === 'Em Execucao' ||
    status === 'Concluido' ||
    status === 'Reagendar'
  ) {
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
  return (
    parseDateValue(lead.data_servico) ||
    parseDateValue(lead.status_changed_at) ||
    parseDateValue(lead.created_at)
  );
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

function normalizeRecord(row: Record<string, unknown>, lead?: LeadServiceRecord): ExtratoRecord {
  const serviceStatus = lead ? getLeadServiceStatus(lead) : null;
  const serviceDate = lead ? getLeadServiceReferenceDate(lead)?.toISOString() || null : null;

  return {
    id: asString(row.id) || lead?.id || crypto.randomUUID(),
    cliente: asString(row.cliente) || asString(row.name) || asString(row.nome) || lead?.name || '',
    valor: asNumber(row.valor) || asNumber(lead?.value),
    qtd: asNumber(row.qtd),
    created_at:
      serviceDate ||
      asString(row.created_at) ||
      asString(row.data) ||
      asString(row.createdAt) ||
      new Date().toISOString(),
    selected_film:
      asNullableString(row.selected_film) ||
      asNullableString(row.selectedFilm) ||
      asNullableString(lead?.film_type),
    modo_otimizacao: asNullableString(row.modo_otimizacao) || asNullableString(row.modoOtimizacao),
    vidros: Array.isArray(row.vidros) ? (row.vidros as GlassPane[]) : [],
    bairro:
      asNullableString(row.bairro) ||
      asNullableString(row.neighborhood) ||
      asNullableString(row.bairro_cliente) ||
      asNullableString(lead?.neighborhood),
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
    if (record.modo_otimizacao === 'facilidade_v2') return 'Carbono G20';
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
        <div className="h-[340px] rounded-2xl border border-white/5 bg-white/[0.03] animate-pulse" />
        <div className="h-[340px] rounded-2xl border border-white/5 bg-white/[0.03] animate-pulse" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <div className="h-[380px] rounded-2xl border border-white/5 bg-white/[0.03] animate-pulse" />
        <div className="h-[380px] rounded-2xl border border-white/5 bg-white/[0.03] animate-pulse" />
      </div>
    </div>
  );
}

export function ExtratosMensaisSupabase() {
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(getMonth(hoje));
  const [anoSelecionado, setAnoSelecionado] = useState(getYear(hoje));
  const [registros, setRegistros] = useState<ExtratoRecord[]>([]);
  const [allLeads, setAllLeads] = useState<LeadServiceRecord[]>([]);
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
      setLoading(true);
      setErrorMessage(null);

      try {
        const dataReferencia = setYear(setMonth(new Date(), mesSelecionado), anoSelecionado);
        const inicio = startOfMonth(dataReferencia);
        const fim = endOfMonth(dataReferencia);

        const leadsResponse = await fetchWithTimeout('/api/crm/leads?include_all=1', {
          headers: await getCrmApiHeaders(),
          credentials: 'same-origin',
          cache: 'no-store',
        });
        const leadsPayload = await leadsResponse.json().catch(() => null);

        if (cancelled) return;

        if (!leadsResponse.ok || !Array.isArray(leadsPayload)) {
          const details = getCrmApiErrorMessage(leadsPayload, leadsResponse.statusText);
          setRegistros([]);
          setAllLeads([]);
          setErrorMessage(`Erro ao carregar serviços do CRM: ${details}`);
          toast.error('Erro ao carregar serviços do CRM');
          return;
        }

        const validLeads = (leadsPayload as LeadServiceRecord[]).filter((lead) => {
          if (lead.deleted_at || lead.status === 'Perdido') return false;
          const sStatus = getLeadServiceStatus(lead);
          return sStatus && sStatus !== 'Reagendar' && !!getLeadServiceReferenceDate(lead);
        });

        setAllLeads(validLeads);

        const serviceLeads = validLeads.filter((lead) => isServiceLeadInPeriod(lead, inicio, fim));
        const serviceLeadIds = serviceLeads.map((lead) => lead.id).filter(Boolean);

        if (serviceLeadIds.length === 0) {
          setRegistros([]);
          return;
        }

        const historyResponse = await fetchWithTimeout(
          `/api/calculator/history?leadIds=${encodeURIComponent(serviceLeadIds.join(','))}`,
          { credentials: 'include', cache: 'no-store' }
        );
        const historyPayload = await historyResponse.json().catch(() => null);

        if (cancelled) return;

        const historyData =
          historyPayload && Array.isArray(historyPayload.items)
            ? (historyPayload.items as Record<string, unknown>[])
            : [];

        const historyByLeadId = new Map<string, Record<string, unknown>>();
        historyData.forEach((row) => {
          const leadId = asNullableString(row.lead_id);
          if (leadId && !historyByLeadId.has(leadId)) {
            historyByLeadId.set(leadId, row);
          }
        });

        setRegistros(serviceLeads.map((lead) => normalizeRecord(historyByLeadId.get(lead.id) || {}, lead)));
      } catch (error) {
        if (!cancelled) {
          setRegistros([]);
          setAllLeads([]);
          setErrorMessage(
            isAbortError(error)
              ? 'A consulta demorou muito (timeout). Tente novamente.'
              : 'Erro inesperado ao carregar o extrato. Tente novamente.'
          );
          toast.error('Erro ao carregar o extrato mensal');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    carregarExtrato();

    return () => {
      cancelled = true;
    };
  }, [mesSelecionado, anoSelecionado]);

  const tituloMes = capitalizeFirst(
    format(setMonth(new Date(), mesSelecionado), 'MMMM', { locale: ptBR })
  );

  const faturamentoTotal = useMemo(
    () => registros.reduce((sum, row) => sum + Number(row.valor || 0), 0),
    [registros]
  );

  const numJobs = registros.length;
  const servicosComValor = useMemo(
    () => registros.filter((row) => Number(row.valor || 0) > 0),
    [registros]
  );
  const ticketMedio = servicosComValor.length > 0 ? faturamentoTotal / servicosComValor.length : 0;

  const m2Total = useMemo(
    () => registros.reduce((sum, row) => sum + getAreaTotal(row), 0),
    [registros]
  );

  const precoMedioPorM2 = m2Total > 0 ? faturamentoTotal / m2Total : 0;

  const servicosFeitos = useMemo(
    () => registros.filter((record) => record.service_status === 'Concluido').length,
    [registros]
  );

  const servicosAgendados = Math.max(0, numJobs - servicosFeitos);
  const taxaConclusao = numJobs > 0 ? Math.round((servicosFeitos / numJobs) * 100) : 0;

  // --- COMPARAÇÃO MÊS ANTERIOR (MoM) ---
  const dadosMesAnterior = useMemo(() => {
    const dataRefAnt = subMonths(setYear(setMonth(new Date(), mesSelecionado), anoSelecionado), 1);
    const inicioAnt = startOfMonth(dataRefAnt);
    const fimAnt = endOfMonth(dataRefAnt);
    const leadsAnt = allLeads.filter((l) => isServiceLeadInPeriod(l, inicioAnt, fimAnt));
    const faturamento = leadsAnt.reduce((acc, l) => acc + (Number(l.value) || 0), 0);
    const jobs = leadsAnt.length;
    const ticket = jobs > 0 ? faturamento / jobs : 0;
    return { faturamento, jobs, ticket };
  }, [allLeads, mesSelecionado, anoSelecionado]);

  const variacaoMoM = useMemo(() => {
    if (dadosMesAnterior.faturamento <= 0) return null;
    const diff = faturamentoTotal - dadosMesAnterior.faturamento;
    const percentual = (diff / dadosMesAnterior.faturamento) * 100;
    return { diff, percentual };
  }, [faturamentoTotal, dadosMesAnterior.faturamento]);

  // --- COMPARAÇÃO ANO ANTERIOR (YoY) ---
  const dadosMesAnoAnterior = useMemo(() => {
    const dataRefYoY = setYear(setMonth(new Date(), mesSelecionado), anoSelecionado - 1);
    const inicioYoY = startOfMonth(dataRefYoY);
    const fimYoY = endOfMonth(dataRefYoY);
    const leadsYoY = allLeads.filter((l) => isServiceLeadInPeriod(l, inicioYoY, fimYoY));
    const faturamento = leadsYoY.reduce((acc, l) => acc + (Number(l.value) || 0), 0);
    const jobs = leadsYoY.length;
    return { faturamento, jobs };
  }, [allLeads, mesSelecionado, anoSelecionado]);

  const variacaoYoY = useMemo(() => {
    if (dadosMesAnoAnterior.faturamento <= 0) return null;
    const diff = faturamentoTotal - dadosMesAnoAnterior.faturamento;
    const percentual = (diff / dadosMesAnoAnterior.faturamento) * 100;
    return { diff, percentual };
  }, [faturamentoTotal, dadosMesAnoAnterior.faturamento]);

  // --- TRAJETÓRIA ANUAL DOS 12 MESES (SAZONALIDADE) ---
  const dadosAno12Meses = useMemo(() => {
    const mesesAbrev = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return mesesAbrev.map((abrev, index) => {
      const dRef = setYear(setMonth(new Date(), index), anoSelecionado);
      const dInicio = startOfMonth(dRef);
      const dFim = endOfMonth(dRef);
      const leadsDoMes = allLeads.filter((l) => isServiceLeadInPeriod(l, dInicio, dFim));
      const faturamento = leadsDoMes.reduce((acc, l) => acc + (Number(l.value) || 0), 0);
      const jobs = leadsDoMes.length;
      return {
        index,
        mes: abrev,
        mesCompleto: capitalizeFirst(format(setMonth(new Date(), index), 'MMMM', { locale: ptBR })),
        valor: faturamento,
        jobs,
        isSelected: index === mesSelecionado,
      };
    });
  }, [allLeads, anoSelecionado, mesSelecionado]);

  const melhorMesDoAno = useMemo(() => {
    const mesesComValor = dadosAno12Meses.filter((m) => m.valor > 0);
    if (mesesComValor.length === 0) return null;
    return mesesComValor.reduce((best, cur) => (cur.valor > best.valor ? cur : best));
  }, [dadosAno12Meses]);

  const faturamentoAcumuladoAno = useMemo(() => {
    return dadosAno12Meses.reduce((acc, m) => acc + m.valor, 0);
  }, [dadosAno12Meses]);

  const mediaMensalAno = useMemo(() => {
    const mesesComValor = dadosAno12Meses.filter((m) => m.valor > 0);
    return mesesComValor.length > 0 ? faturamentoAcumuladoAno / mesesComValor.length : 0;
  }, [dadosAno12Meses, faturamentoAcumuladoAno]);

  // --- UPGRADE MASTER NO RANKING DE PELÍCULAS ---
  const rankingPeliculas = useMemo<FilmRankingItem[]>(() => {
    const porPelicula: Record<string, { valor: number; jobs: number; jobsComValor: number; area: number }> = {};

    registros.forEach((record) => {
      const nome = getFilmLabel(record);
      if (!porPelicula[nome]) porPelicula[nome] = { valor: 0, jobs: 0, jobsComValor: 0, area: 0 };
      const val = Number(record.valor || 0);
      porPelicula[nome].valor += val;
      porPelicula[nome].jobs += 1;
      if (val > 0) porPelicula[nome].jobsComValor += 1;
      porPelicula[nome].area += getAreaTotal(record);
    });

    return Object.entries(porPelicula)
      .map(([nome, dados]) => ({
        nome,
        valor: dados.valor,
        jobs: dados.jobs,
        area: dados.area,
        ticket: dados.jobsComValor > 0 ? dados.valor / dados.jobsComValor : 0,
        share: faturamentoTotal > 0 ? (dados.valor / faturamentoTotal) * 100 : 0,
        valorPorM2: dados.area > 0 ? dados.valor / dados.area : 0,
        areaShare: m2Total > 0 ? (dados.area / m2Total) * 100 : 0,
      }))
      .sort((a, b) => b.valor - a.valor);
  }, [faturamentoTotal, m2Total, registros]);

  // --- RITMO OPERACIONAL & MÉDIAS DO MÊS ---
  const diasComAtendimento = useMemo(() => {
    const dias = new Set<string>();
    registros.forEach((r) => {
      if (r.created_at) {
        dias.add(format(new Date(r.created_at), 'yyyy-MM-dd'));
      }
    });
    return dias.size;
  }, [registros]);

  const mediaDiariaAtiva = useMemo(() => {
    return diasComAtendimento > 0 ? faturamentoTotal / diasComAtendimento : 0;
  }, [diasComAtendimento, faturamentoTotal]);

  const melhorDia = useMemo(() => {
    if (faturamentoTotal <= 0) return null;

    const porDia: Record<string, { valor: number; jobs: number; clientePrincipal: string }> = {};
    registros.forEach((record) => {
      const key = format(new Date(record.created_at || new Date()), 'yyyy-MM-dd');
      if (!porDia[key]) porDia[key] = { valor: 0, jobs: 0, clientePrincipal: record.cliente || '' };
      porDia[key].valor += Number(record.valor || 0);
      porDia[key].jobs += 1;
    });

    return Object.entries(porDia)
      .map(([dia, dados]) => ({ dia, ...dados }))
      .sort((a, b) => b.valor - a.valor)[0] || null;
  }, [faturamentoTotal, registros]);

  const quinzenas = useMemo(() => {
    let q1 = 0;
    let q2 = 0;
    registros.forEach((r) => {
      const dia = getDate(new Date(r.created_at || new Date()));
      const val = Number(r.valor || 0);
      if (dia <= 15) q1 += val;
      else q2 += val;
    });
    const total = q1 + q2;
    return {
      q1Valor: q1,
      q2Valor: q2,
      q1Percent: total > 0 ? (q1 / total) * 100 : 0,
      q2Percent: total > 0 ? (q2 / total) * 100 : 0,
    };
  }, [registros]);

  const projecaoFechamento = useMemo(() => {
    const hojeData = new Date();
    const isCurrentMonthAndYear =
      getMonth(hojeData) === mesSelecionado && getYear(hojeData) === anoSelecionado;
    if (!isCurrentMonthAndYear || faturamentoTotal <= 0) return null;

    const diaAtual = getDate(hojeData);
    const totalDiasMes = getDate(endOfMonth(hojeData));
    if (diaAtual <= 0) return null;

    const runRate = faturamentoTotal / diaAtual;
    return runRate * totalDiasMes;
  }, [mesSelecionado, anoSelecionado, faturamentoTotal]);

  // --- GEOLOCALIZAÇÃO: TOP BAIRROS ---
  const topBairros = useMemo<BairroItem[]>(() => {
    const porBairro: Record<string, { valor: number; jobs: number }> = {};
    registros.forEach((r) => {
      let b = r.neighborhood || r.bairro;
      if (!b || b.trim() === '') b = 'Outros / Não inf.';
      else b = capitalizeFirst(b.trim());
      if (!porBairro[b]) porBairro[b] = { valor: 0, jobs: 0 };
      porBairro[b].valor += Number(r.valor || 0);
      porBairro[b].jobs += 1;
    });

    return Object.entries(porBairro)
      .map(([bairro, dados]) => ({
        bairro,
        valor: dados.valor,
        jobs: dados.jobs,
        ticket: dados.jobs > 0 ? dados.valor / dados.jobs : 0,
        share: faturamentoTotal > 0 ? (dados.valor / faturamentoTotal) * 100 : 0,
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);
  }, [registros, faturamentoTotal]);

  // --- TOP 4 KPIS COM SUBTEXTOS INTELIGENTES ---
  const kpis: KpiCard[] = useMemo(() => {
    let subtextFaturamento = 'faturamento de serviços do mês';
    if (variacaoMoM !== null) {
      const sinal = variacaoMoM.percentual >= 0 ? '+' : '';
      subtextFaturamento = `${sinal}${variacaoMoM.percentual.toFixed(1)}% vs mês anterior`;
    }

    return [
      {
        label: 'Faturamento',
        value: formatBRL(faturamentoTotal),
        subtext: subtextFaturamento,
        icon: Wallet,
        tone: 'gold',
      },
      {
        label: 'Serviços',
        value: String(numJobs),
        subtext: `${taxaConclusao}% concluídos (${servicosFeitos} feitos • ${servicosAgendados} agendados)`,
        icon: ReceiptText,
        tone: 'white',
      },
      {
        label: 'Ticket médio',
        value: formatBRL(ticketMedio),
        subtext:
          servicosComValor.length > 0
            ? `média em ${servicosComValor.length} serviço(s) com valor`
            : 'receita média por atendimento',
        icon: TrendingUp,
        tone: 'emerald',
      },
      {
        label: 'Área aplicada',
        value: `${m2Total.toFixed(1)} m²`,
        subtext: precoMedioPorM2 > 0 ? `média de ${formatBRL(precoMedioPorM2)}/m² instalado` : 'metragem somada no extrato',
        icon: Package,
        tone: 'sky',
      },
    ];
  }, [
    faturamentoTotal,
    m2Total,
    numJobs,
    precoMedioPorM2,
    servicosAgendados,
    servicosComValor.length,
    servicosFeitos,
    taxaConclusao,
    ticketMedio,
    variacaoMoM,
  ]);

  async function exportarPDF() {
    const elemento = document.getElementById('extrato-conteudo');
    if (!elemento) return;

    let toastId: string | undefined;

    try {
      setExportando(true);
      toastId = toast.loading('Gerando PDF analítico...');

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
    <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden space-y-5 bg-[#040811] px-4 py-6 md:px-6 md:py-8 font-sans">
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

      {/* HEADER DA PÁGINA */}
      <div className="relative rounded-2xl border border-white/5 bg-gradient-to-br from-[#07111d]/95 via-[#07111d]/80 to-[#04080f]/95 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent" />
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#eab308]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#eab308]" />
              Inteligência Financeira
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl font-heading">
              Extratos Mensais
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 md:text-[15px]">
              Visão analítica de sazonalidade anual, eficiência de faturamento por película, ritmo operacional e distribuição geográfica.
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
              Baixar PDF
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
        <div id="extrato-conteudo" className="relative space-y-6">
          {/* SECTION 1: TOP 4 KPIS */}
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
                      <p className="mt-1 truncate text-xs text-white/45">{card.subtext}</p>
                    </div>
                    <div
                      className={`rounded-2xl border p-3 shadow-inner shadow-black/20 transition ${KPI_TONES[card.tone]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* SECTION 2: VISÃO ANUAL (12 MESES) & INTELIGÊNCIA TEMPORAL */}
          <section className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
            {/* GRÁFICO ANUAL: 12 MESES (SAZONALIDADE) */}
            <article className="rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                      Sazonalidade & Trajetória Anual
                    </span>
                    <span className="rounded bg-[#c9a227]/15 px-2 py-0.5 text-[10px] font-bold text-[#f5d77a]">
                      12 Meses
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    Faturamento Mensal de {anoSelecionado}
                  </h3>
                  <p className="text-xs text-white/40">
                    Acompanhe qual é a melhor época do ano e a evolução de receita mês a mês.
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/55">
                  <CalendarRange className="h-3.5 w-3.5 text-[#eab308]" />
                  Mês ativo: {tituloMes}
                </span>
              </div>

              <div className="h-[270px]">
                {faturamentoAcumuladoAno <= 0 ? (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center text-sm text-white/35">
                    Nenhum serviço registrado no ano de {anoSelecionado}.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dadosAno12Meses}
                      barSize={28}
                      barGap={6}
                      onClick={(state) => {
                        const activeIndex = state?.activeTooltipIndex;
                        if (typeof activeIndex === 'number' && activeIndex >= 0 && activeIndex <= 11) {
                          setMesSelecionado(activeIndex);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.04)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="mes"
                        tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.6)' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.45)' }}
                        tickFormatter={(value) => `R$${(Number(value) / 1000).toFixed(0)}k`}
                        width={52}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                        formatter={(value: number) => [formatBRL(Number(value)), 'Faturamento']}
                        labelFormatter={(_, payload) => {
                          const item = payload?.[0]?.payload as (typeof dadosAno12Meses)[number] | undefined;
                          return item ? `${item.mesCompleto} / ${anoSelecionado} (${item.jobs} serviços)` : '';
                        }}
                        contentStyle={{
                          background: '#04080f',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 12,
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                        {dadosAno12Meses.map((entry) => {
                          const isCurrent = entry.index === mesSelecionado;
                          const isBest = melhorMesDoAno?.index === entry.index;
                          return (
                            <Cell
                              key={entry.mes}
                              fill={isCurrent ? '#f7d66a' : isBest ? '#c9a227' : '#735914'}
                              fillOpacity={entry.valor > 0 ? (isCurrent ? 1 : 0.75) : 0.15}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <p className="mt-2 text-center text-[11px] text-white/30">
                💡 Dica: Clique na barra de qualquer mês para navegar e analisar seus dados.
              </p>
            </article>

            {/* INTELIGÊNCIA ANUAL & SINAIS ESTRATÉGICOS */}
            <article className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                      Leitura Estratégica
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-white">Sinais & Comparativos</h3>
                  </div>
                  <Sparkles className="h-5 w-5 text-[#f5d77a]" />
                </div>

                <div className="space-y-3">
                  {/* MELHOR MÊS DO ANO */}
                  <div className="rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5d77a]">
                        <Award className="h-3.5 w-3.5" />
                        Melhor Época / Mês Recorde ({anoSelecionado})
                      </span>
                      {melhorMesDoAno && (
                        <span className="text-[11px] font-semibold text-white/50">
                          {melhorMesDoAno.jobs} serviços
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-baseline justify-between gap-2">
                      <p className="text-xl font-black text-white">
                        {melhorMesDoAno ? melhorMesDoAno.mesCompleto : 'Sem dados'}
                      </p>
                      <p className="text-base font-extrabold text-[#f5d77a]">
                        {melhorMesDoAno ? formatBRL(melhorMesDoAno.valor) : '-'}
                      </p>
                    </div>
                    <p className="mt-1 text-[11px] text-white/50">
                      Mês de maior pico financeiro da LUME neste exercício.
                    </p>
                  </div>

                  {/* CARDS COMPARATIVOS: MoM e YoY */}
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {/* COMPARATIVO MoM */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-white/40">
                          vs Mês Anterior
                        </span>
                        {variacaoMoM !== null && (
                          <span
                            className={`flex items-center text-xs font-bold ${
                              variacaoMoM.percentual >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {variacaoMoM.percentual >= 0 ? (
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowDownRight className="h-3.5 w-3.5" />
                            )}
                            {Math.abs(variacaoMoM.percentual).toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-base font-black text-white">
                        {variacaoMoM !== null ? formatBRL(variacaoMoM.diff) : '-'}
                      </p>
                      <p className="text-[10px] text-white/40">
                        {dadosMesAnterior.faturamento > 0
                          ? `Ant: ${formatBRL(dadosMesAnterior.faturamento)}`
                          : 'Sem dados no mês anterior'}
                      </p>
                    </div>

                    {/* COMPARATIVO YoY */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-white/40">
                          vs Mesmo Mês ({anoSelecionado - 1})
                        </span>
                        {variacaoYoY !== null && (
                          <span
                            className={`flex items-center text-xs font-bold ${
                              variacaoYoY.percentual >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {variacaoYoY.percentual >= 0 ? (
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowDownRight className="h-3.5 w-3.5" />
                            )}
                            {Math.abs(variacaoYoY.percentual).toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-base font-black text-white">
                        {variacaoYoY !== null ? formatBRL(variacaoYoY.diff) : '-'}
                      </p>
                      <p className="text-[10px] text-white/40">
                        {dadosMesAnoAnterior.faturamento > 0
                          ? `${formatBRL(dadosMesAnoAnterior.faturamento)} em ${anoSelecionado - 1}`
                          : `Sem base em ${anoSelecionado - 1}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RODAPÉ DO CARD ANUAL: YTD E MÉDIA MENSAL */}
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3.5 text-xs">
                <div>
                  <span className="text-white/40">Acumulado {anoSelecionado}:</span>
                  <span className="ml-1.5 font-bold text-white">
                    {formatBRL(faturamentoAcumuladoAno)}
                  </span>
                </div>
                <div>
                  <span className="text-white/40">Média mensal:</span>
                  <span className="ml-1.5 font-bold text-[#f5d77a]">
                    {formatBRL(mediaMensalAno)}
                  </span>
                </div>
              </div>
            </article>
          </section>

          {/* SECTION 3: MIX DE PELÍCULAS (UPGRADE MASTER) & RITMO / BAIRROS */}
          <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
            {/* UPGRADE MASTER: RANKING DE PELÍCULAS (ANÁLISE DE PRODUTO) */}
            <article className="rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                    Mix de Películas & Rentabilidade
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    Eficiência por Linha de Película
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-1 text-xs font-semibold text-[#f5d77a]">
                    <Layers3 className="h-3.5 w-3.5" />
                    {rankingPeliculas.length} película{rankingPeliculas.length !== 1 ? 's' : ''} no mix
                  </span>
                </div>
              </div>

              {rankingPeliculas.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-12 text-center text-sm text-white/40">
                  Nenhum serviço registrado neste mês para agrupar por película.
                </p>
              ) : (
                <div className="space-y-3.5">
                  {rankingPeliculas.map((item, index) => (
                    <div
                      key={item.nome}
                      className="group rounded-2xl border border-white/5 bg-white/[0.025] p-4 transition hover:border-[#c9a227]/30 hover:bg-white/[0.045]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${
                              index === 0
                                ? 'border-[#c9a227]/40 bg-[#c9a227]/20 text-[#f5d77a]'
                                : 'border-white/10 bg-white/[0.04] text-white/60'
                            }`}
                          >
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-base font-bold text-white">{item.nome}</p>
                              {index === 0 && (
                                <span className="rounded-full bg-[#c9a227]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#f5d77a]">
                                  Líder
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/45">
                              <span>
                                {item.jobs} atendimento{item.jobs !== 1 ? 's' : ''}
                              </span>
                              <span>•</span>
                              <span>Ticket Médio {formatBRL(item.ticket)}</span>
                              {item.area > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{item.area.toFixed(1)} m² aplicados</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col sm:items-end justify-between items-baseline gap-1">
                          <p className="text-base font-black text-[#f5d77a]">{formatBRL(item.valor)}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white/50">
                              {formatPercent(item.share)} do mês
                            </span>
                            {item.valorPorM2 > 0 && (
                              <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                                {formatBRL(item.valorPorM2)}/m²
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* BARRA DE PARTICIPAÇÃO VISUAL */}
                      <div className="mt-3.5 flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#8a6d10] via-[#c9a227] to-[#f5d77a]"
                            style={{ width: `${Math.max(4, Math.min(100, item.share))}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-[11px] font-semibold text-white/40">
                          {item.share.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>

            {/* COLUNA DA DIREITA: RITMO OPERACIONAL + GEOLOCALIZAÇÃO BAIRROS */}
            <div className="space-y-5">
              {/* CARD: RITMO OPERACIONAL DO MÊS */}
              <article className="rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                      Ritmo & Médias Operacionais
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-white">Velocidade de Venda</h3>
                  </div>
                  <Clock className="h-5 w-5 text-[#c9a227]" />
                </div>

                <div className="space-y-3">
                  {/* MÉDIA DIÁRIA ÚTIL & PROJEÇÃO */}
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3.5">
                      <p className="text-[10px] uppercase tracking-wider text-white/40">
                        Média / Dia com Serviço
                      </p>
                      <p className="mt-1 text-base font-black text-white">
                        {formatBRL(mediaDiariaAtiva)}
                      </p>
                      <p className="text-[10px] text-white/40">
                        {diasComAtendimento} dia{diasComAtendimento !== 1 ? 's' : ''} com serviços
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3.5">
                      <p className="text-[10px] uppercase tracking-wider text-white/40">
                        {projecaoFechamento ? 'Projeção Fechamento' : 'Pico do Mês'}
                      </p>
                      <p className="mt-1 text-base font-black text-[#f5d77a]">
                        {projecaoFechamento
                          ? formatBRL(projecaoFechamento)
                          : melhorDia
                          ? formatBRL(melhorDia.valor)
                          : '-'}
                      </p>
                      <p className="text-[10px] text-white/40">
                        {projecaoFechamento
                          ? 'ritmo atual até o fim do mês'
                          : melhorDia
                          ? `em ${format(new Date(`${melhorDia.dia}T12:00:00`), 'dd/MM')}`
                          : 'sem dados'}
                      </p>
                    </div>
                  </div>

                  {/* DIVISÃO QUINZENAL (1ª vs 2ª Quinzena) */}
                  <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60 font-semibold">1ª Quinzena (dias 1-15)</span>
                      <span className="text-white/60 font-semibold">2ª Quinzena (16-fim)</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between font-bold text-sm">
                      <span className="text-white">{formatBRL(quinzenas.q1Valor)}</span>
                      <span className="text-[#f5d77a]">{formatBRL(quinzenas.q2Valor)}</span>
                    </div>
                    <div className="mt-2 h-2 flex overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-white/40"
                        style={{ width: `${quinzenas.q1Percent}%` }}
                        title={`1ª Quinzena: ${quinzenas.q1Percent.toFixed(0)}%`}
                      />
                      <div
                        className="h-full bg-gradient-to-r from-[#c9a227] to-[#f5d77a]"
                        style={{ width: `${quinzenas.q2Percent}%` }}
                        title={`2ª Quinzena: ${quinzenas.q2Percent.toFixed(0)}%`}
                      />
                    </div>
                  </div>
                </div>
              </article>

              {/* CARD: GEOLOCALIZAÇÃO - TOP BAIRROS DO RJ */}
              <article className="rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                      Geolocalização RJ
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-white">Top Bairros em Receita</h3>
                  </div>
                  <MapPin className="h-5 w-5 text-[#c9a227]" />
                </div>

                {topBairros.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center text-xs text-white/40">
                    Nenhum endereço informado nos atendimentos deste mês.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {topBairros.map((item, index) => (
                      <div
                        key={item.bairro}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-2.5 transition hover:bg-white/[0.04]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/5 text-[10px] font-bold text-white/50">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-white">{item.bairro}</p>
                            <p className="text-[10px] text-white/40">
                              {item.jobs} serviço{item.jobs !== 1 ? 's' : ''} • ticket {formatBRL(item.ticket)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-[#f5d77a]">{formatBRL(item.valor)}</p>
                          <p className="text-[10px] text-white/40">{item.share.toFixed(0)}% do mês</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
