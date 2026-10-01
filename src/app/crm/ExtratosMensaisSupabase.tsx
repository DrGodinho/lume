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
  ArrowUpDown,
  ArrowUpRight,
  Award,
  CalendarRange,
  CheckCircle2,
  Clock,
  Download,
  Layers3,
  Loader2,
  MapPin,
  Package,
  ReceiptText,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { DEFAULT_FILM_CATALOG, type FilmCatalogItem } from '@/lib/films';
import { loadConfigFromCloud } from '@/lib/cloudSync';
import { parseLeadExpenses } from './utils/expenses';
import { roundCurrency } from '@/lib/numberPrecision';
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
  custo_ajudante?: number;
  outras_despesas?: number;
  notes?: string;
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
  notes?: string | null;
  custo_ajudante?: number | null;
  outras_despesas?: number | null;
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
  custoTotal: number;
  custoM2: number;
  lucroLiquido: number;
  margemLiquida: number;
  lucroPorM2: number;
  lucroShare: number;
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
  window_blue_75: 'Window Blue 75%',
  window_blue_05: 'Window Blue 05%',
  window_blue_20: 'Window Blue 20%',
  nano_carbon_20: 'Nano Carbon 20%',
  nano_carbon_05: 'Nano Carbon 05%',
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
  const leadExpenses = parseLeadExpenses(asString(lead?.notes) || asString(row.notes));

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
    custo_ajudante: asNumber(row.custo_ajudante) || leadExpenses.custoAjudante,
    outras_despesas: asNumber(row.outras_despesas) || leadExpenses.outrasDespesas,
    notes: asString(lead?.notes) || asString(row.notes),
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

function getFilmCostM2FromLabel(labelOrKey: string, catalog: Record<string, FilmCatalogItem>): number {
  const filmLabel = labelOrKey.toLowerCase().trim();
  const filmKey = labelOrKey.toLowerCase().trim();

  // 1. Chave exata no catálogo
  if (catalog[filmKey]) {
    const item = catalog[filmKey];
    const areaPerUnit = item.purchaseType === 'bloco_7_5m' ? 7.5 * 1.52 : 1.52;
    return item.priceCost / areaPerUnit;
  }

  // 2. Busca por nome no catálogo
  const matched = Object.values(catalog).find((item) => {
    const itemName = item.name.toLowerCase().trim();
    const itemId = item.id.toLowerCase().trim();
    return (
      itemName === filmLabel ||
      itemId === filmKey ||
      filmLabel.includes(itemName) ||
      itemName.includes(filmLabel)
    );
  });

  if (matched) {
    const areaPerUnit = matched.purchaseType === 'bloco_7_5m' ? 7.5 * 1.52 : 1.52;
    return matched.priceCost / areaPerUnit;
  }

  // 3. Fallback de referência Bluetech RJ
  if (filmLabel.includes('window blue 75')) return 139.98 / 1.52;
  if (filmLabel.includes('window blue')) return 69.98 / 1.52;
  if (filmLabel.includes('nano ceramica 75') || filmLabel.includes('nano cerâmica 75')) return 90.00 / 1.52;
  if (filmLabel.includes('nano ceramica') || filmLabel.includes('nano cerâmica')) return 52.00 / 1.52;
  if (filmLabel.includes('dupla camada') || filmLabel.includes('ps4')) return 365.87 / (7.5 * 1.52);
  if (filmLabel.includes('refletiva') || filmLabel.includes('jateado')) return 239.85 / (7.5 * 1.52);
  if (filmLabel.includes('nano carbon')) return 262.35 / (7.5 * 1.52);
  if (filmLabel.includes('carbono')) return 93.75 / (7.5 * 1.52);

  return 239.85 / (7.5 * 1.52);
}

function getFilmCostM2(record: ExtratoRecord, catalog: Record<string, FilmCatalogItem>): number {
  const filmLabel = getFilmLabel(record);
  const filmKey = record.selected_film || '';
  return getFilmCostM2FromLabel(filmKey || filmLabel, catalog);
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
  const [catalog, setCatalog] = useState<Record<string, FilmCatalogItem>>(DEFAULT_FILM_CATALOG);
  const [visaoGrafico, setVisaoGrafico] = useState<'anual' | 'diario'>('anual');
  const [metricaGrafico, setMetricaGrafico] = useState<'faturamento' | 'lucro' | 'comparativo'>('faturamento');
  const [ordenacaoPeliculas, setOrdenacaoPeliculas] = useState<'lucro' | 'faturamento' | 'area'>('lucro');
  const [filtroTabelaBusca, setFiltroTabelaBusca] = useState('');
  const [filtroTabelaStatus, setFiltroTabelaStatus] = useState<'todos' | 'concluidos' | 'agendados'>('todos');
  const [ordenacaoTabela, setOrdenacaoTabela] = useState<'data' | 'lucro' | 'faturamento' | 'margem'>('data');

  useEffect(() => {
    let isMounted = true;
    void loadConfigFromCloud().then((cloudConfig) => {
      if (isMounted && cloudConfig?.filmCatalog) {
        setCatalog(cloudConfig.filmCatalog);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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

  // --- DRE OPERACIONAL (RECEITA, INSUMOS BLUETECH, EQUIPE, LUCRO LÍQUIDO REAL) ---
  const dre = useMemo(() => {
    let custoTotalFilmes = 0;
    let custoTotalAjudantes = 0;
    let custoTotalExtras = 0;

    registros.forEach((r) => {
      const area = getAreaTotal(r);
      const custoM2 = getFilmCostM2(r, catalog);
      const custoFilme = roundCurrency(area * custoM2);
      custoTotalFilmes += custoFilme;
      custoTotalAjudantes += r.custo_ajudante || 0;
      custoTotalExtras += r.outras_despesas || 0;
    });

    const despesasOperacionais = custoTotalAjudantes + custoTotalExtras;
    const despesasTotais = custoTotalFilmes + despesasOperacionais;
    const lucroLiquido = Math.max(0, faturamentoTotal - despesasTotais);
    const margemLiquidaReal = faturamentoTotal > 0 ? (lucroLiquido / faturamentoTotal) * 100 : 0;
    const shareFilmes = faturamentoTotal > 0 ? (custoTotalFilmes / faturamentoTotal) * 100 : 0;
    const shareEquipe = faturamentoTotal > 0 ? (despesasOperacionais / faturamentoTotal) * 100 : 0;

    return {
      custoTotalFilmes,
      custoTotalAjudantes,
      custoTotalExtras,
      despesasOperacionais,
      despesasTotais,
      lucroLiquido,
      margemLiquidaReal,
      shareFilmes,
      shareEquipe,
    };
  }, [registros, catalog, faturamentoTotal]);

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

  // --- TRAJETÓRIA ANUAL DOS 12 MESES (SAZONALIDADE & RESULTADO LÍQUIDO) ---
  const dadosAno12Meses = useMemo(() => {
    const mesesAbrev = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return mesesAbrev.map((abrev, index) => {
      const dRef = setYear(setMonth(new Date(), index), anoSelecionado);
      const dInicio = startOfMonth(dRef);
      const dFim = endOfMonth(dRef);
      const leadsDoMes = allLeads.filter((l) => isServiceLeadInPeriod(l, dInicio, dFim));
      const faturamento = leadsDoMes.reduce((acc, l) => acc + (Number(l.value) || 0), 0);
      const jobs = leadsDoMes.length;

      let lucroLiquido = 0;
      let custoTotal = 0;

      if (index === mesSelecionado) {
        lucroLiquido = dre.lucroLiquido;
        custoTotal = dre.despesasTotais;
      } else {
        leadsDoMes.forEach((l) => {
          const area = Number(l.sqm || 0);
          const custoM2 = getFilmCostM2FromLabel(l.film_type || '', catalog);
          const custoFilme = roundCurrency(area * custoM2);
          const exp = parseLeadExpenses(asString(l.notes));
          const despesas = (Number(l.custo_ajudante) || 0) + (Number(l.outras_despesas) || 0) + exp.custoAjudante + exp.outrasDespesas;
          custoTotal += custoFilme + despesas;
        });
        lucroLiquido = Math.max(0, faturamento - custoTotal);
      }

      const margemLiquida = faturamento > 0 ? (lucroLiquido / faturamento) * 100 : 0;

      return {
        index,
        mes: abrev,
        mesCompleto: capitalizeFirst(format(setMonth(new Date(), index), 'MMMM', { locale: ptBR })),
        valor: faturamento, // Mantém compatibilidade total com o código original
        faturamento,
        lucroLiquido,
        custoTotal,
        margemLiquida,
        jobs,
        isSelected: index === mesSelecionado,
      };
    });
  }, [allLeads, anoSelecionado, mesSelecionado, dre.lucroLiquido, dre.despesasTotais, catalog]);

  // --- EVOLUÇÃO DIÁRIA DO MÊS SELECIONADO ---
  const dadosDiasDoMes = useMemo(() => {
    const dataReferencia = setYear(setMonth(new Date(), mesSelecionado), anoSelecionado);
    const totalDias = getDate(endOfMonth(dataReferencia));

    return Array.from({ length: totalDias }, (_, i) => {
      const diaNum = i + 1;
      const diaStr = String(diaNum).padStart(2, '0');
      const dataDiaStr = `${anoSelecionado}-${String(mesSelecionado + 1).padStart(2, '0')}-${diaStr}`;
      let diaSemana = '';
      try {
        diaSemana = capitalizeFirst(format(new Date(`${dataDiaStr}T12:00:00`), 'EEE', { locale: ptBR }));
      } catch {
        diaSemana = '';
      }

      const registrosDoDia = registros.filter((r) => {
        if (!r.created_at) return false;
        try {
          const dStr = format(new Date(r.created_at), 'yyyy-MM-dd');
          return dStr === dataDiaStr;
        } catch {
          return false;
        }
      });

      const faturamento = registrosDoDia.reduce((sum, r) => sum + Number(r.valor || 0), 0);
      let custoFilmes = 0;
      let despesasOperacionais = 0;

      registrosDoDia.forEach((r) => {
        const area = getAreaTotal(r);
        const custoM2 = getFilmCostM2(r, catalog);
        custoFilmes += roundCurrency(area * custoM2);
        despesasOperacionais += (Number(r.custo_ajudante) || 0) + (Number(r.outras_despesas) || 0);
      });

      const custoTotal = custoFilmes + despesasOperacionais;
      const lucroLiquido = Math.max(0, faturamento - custoTotal);
      const margemLiquida = faturamento > 0 ? (lucroLiquido / faturamento) * 100 : 0;
      const jobs = registrosDoDia.length;
      const clientes = registrosDoDia
        .map((r) => r.cliente)
        .filter(Boolean)
        .slice(0, 2)
        .join(', ');

      return {
        dia: diaStr,
        diaNum,
        diaSemana,
        dataCompleta: `${diaStr}/${String(mesSelecionado + 1).padStart(2, '0')}`,
        valor: faturamento,
        faturamento,
        lucroLiquido,
        custoTotal,
        custoFilmes,
        despesasOperacionais,
        margemLiquida,
        jobs,
        clientes,
      };
    });
  }, [anoSelecionado, mesSelecionado, registros, catalog]);

  const melhorMesDoAno = useMemo(() => {
    const mesesComValor = dadosAno12Meses.filter((m) => m.faturamento > 0);
    if (mesesComValor.length === 0) return null;
    return mesesComValor.reduce((best, cur) => (cur.faturamento > best.faturamento ? cur : best));
  }, [dadosAno12Meses]);

  const melhorMesLucro = useMemo(() => {
    const mesesComLucro = dadosAno12Meses.filter((m) => m.lucroLiquido > 0);
    if (mesesComLucro.length === 0) return null;
    return mesesComLucro.reduce((best, cur) => (cur.lucroLiquido > best.lucroLiquido ? cur : best));
  }, [dadosAno12Meses]);

  const faturamentoAcumuladoAno = useMemo(() => {
    return dadosAno12Meses.reduce((acc, m) => acc + m.faturamento, 0);
  }, [dadosAno12Meses]);

  const lucroAcumuladoAno = useMemo(() => {
    return dadosAno12Meses.reduce((acc, m) => acc + m.lucroLiquido, 0);
  }, [dadosAno12Meses]);

  const mediaMensalAno = useMemo(() => {
    const mesesComValor = dadosAno12Meses.filter((m) => m.faturamento > 0);
    return mesesComValor.length > 0 ? faturamentoAcumuladoAno / mesesComValor.length : 0;
  }, [dadosAno12Meses, faturamentoAcumuladoAno]);

  // --- RANKING DE PELÍCULAS POR LUCRO REAL E FATURAMENTO ---
  const rankingPeliculas = useMemo<FilmRankingItem[]>(() => {
    const porPelicula: Record<
      string,
      {
        valor: number;
        jobs: number;
        jobsComValor: number;
        area: number;
        custoTotal: number;
      }
    > = {};

    registros.forEach((record) => {
      const nome = getFilmLabel(record);
      if (!porPelicula[nome]) {
        porPelicula[nome] = { valor: 0, jobs: 0, jobsComValor: 0, area: 0, custoTotal: 0 };
      }
      const val = Number(record.valor || 0);
      const area = getAreaTotal(record);
      const custoM2 = getFilmCostM2(record, catalog);
      const custoFilme = roundCurrency(area * custoM2);

      porPelicula[nome].valor += val;
      porPelicula[nome].jobs += 1;
      if (val > 0) porPelicula[nome].jobsComValor += 1;
      porPelicula[nome].area += area;
      porPelicula[nome].custoTotal += custoFilme;
    });

    const totalLucroFilmes = Object.values(porPelicula).reduce(
      (sum, d) => sum + Math.max(0, d.valor - d.custoTotal),
      0
    );

    const items: FilmRankingItem[] = Object.entries(porPelicula).map(([nome, dados]) => {
      const lucroLiquido = Math.max(0, dados.valor - dados.custoTotal);
      const margemLiquida = dados.valor > 0 ? (lucroLiquido / dados.valor) * 100 : 0;
      const custoM2 = dados.area > 0 ? dados.custoTotal / dados.area : 0;
      const valorPorM2 = dados.area > 0 ? dados.valor / dados.area : 0;
      const lucroPorM2 = dados.area > 0 ? lucroLiquido / dados.area : 0;
      const share = faturamentoTotal > 0 ? (dados.valor / faturamentoTotal) * 100 : 0;
      const areaShare = m2Total > 0 ? (dados.area / m2Total) * 100 : 0;
      const lucroShare = totalLucroFilmes > 0 ? (lucroLiquido / totalLucroFilmes) * 100 : 0;
      const ticket = dados.jobsComValor > 0 ? dados.valor / dados.jobsComValor : 0;

      return {
        nome,
        valor: dados.valor,
        jobs: dados.jobs,
        area: dados.area,
        ticket,
        share,
        valorPorM2,
        areaShare,
        custoTotal: dados.custoTotal,
        custoM2,
        lucroLiquido,
        margemLiquida,
        lucroPorM2,
        lucroShare,
      };
    });

    if (ordenacaoPeliculas === 'lucro') {
      return items.sort((a, b) => b.lucroLiquido - a.lucroLiquido);
    }
    if (ordenacaoPeliculas === 'area') {
      return items.sort((a, b) => b.area - a.area);
    }
    return items.sort((a, b) => b.valor - a.valor);
  }, [catalog, faturamentoTotal, m2Total, ordenacaoPeliculas, registros]);

  const peliculaMaisLucrativa = useMemo(() => {
    if (rankingPeliculas.length === 0) return null;
    return rankingPeliculas.reduce((best, cur) => (cur.lucroLiquido > best.lucroLiquido ? cur : best));
  }, [rankingPeliculas]);

  const peliculaMaisVendida = useMemo(() => {
    if (rankingPeliculas.length === 0) return null;
    return rankingPeliculas.reduce((best, cur) => (cur.valor > best.valor ? cur : best));
  }, [rankingPeliculas]);

  const peliculaMaiorMargem = useMemo(() => {
    const comValor = rankingPeliculas.filter((p) => p.valor > 0);
    if (comValor.length === 0) return null;
    return comValor.reduce((best, cur) => (cur.margemLiquida > best.margemLiquida ? cur : best));
  }, [rankingPeliculas]);

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

  // --- RAIO-X FINANCEIRO: ATENDIMENTOS DO MÊS DETALHADOS ---
  const atendimentosDetalhados = useMemo(() => {
    return registros.map((r) => {
      const area = getAreaTotal(r);
      const custoM2 = getFilmCostM2(r, catalog);
      const custoFilme = roundCurrency(area * custoM2);
      const custoAjudante = Number(r.custo_ajudante) || 0;
      const custoExtras = Number(r.outras_despesas) || 0;
      const despesasTotais = custoFilme + custoAjudante + custoExtras;
      const valor = Number(r.valor || 0);
      const lucroLiquido = Math.max(0, valor - despesasTotais);
      const margemLiquida = valor > 0 ? (lucroLiquido / valor) * 100 : 0;
      const dataObj = r.created_at ? new Date(r.created_at) : null;
      let dataFormatada = '-';
      try {
        if (dataObj && !Number.isNaN(dataObj.getTime())) {
          dataFormatada = format(dataObj, 'dd/MM/yyyy');
        }
      } catch {
        dataFormatada = '-';
      }
      const vidrosCount = Array.isArray(r.vidros) ? r.vidros.length : 0;

      return {
        id: r.id,
        cliente: r.cliente || 'Cliente sem nome',
        bairro: r.neighborhood || r.bairro || 'Rio de Janeiro',
        dataObj,
        dataFormatada,
        status: r.service_status || 'Concluido',
        pelicula: getFilmLabel(r),
        area,
        vidrosCount,
        valor,
        custoFilme,
        custoM2,
        custoAjudante,
        custoExtras,
        despesasTotais,
        lucroLiquido,
        margemLiquida,
      };
    });
  }, [catalog, registros]);

  const atendimentosFiltrados = useMemo(() => {
    let result = [...atendimentosDetalhados];

    if (filtroTabelaBusca.trim() !== '') {
      const termo = filtroTabelaBusca.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.cliente.toLowerCase().includes(termo) ||
          item.bairro.toLowerCase().includes(termo) ||
          item.pelicula.toLowerCase().includes(termo)
      );
    }

    if (filtroTabelaStatus === 'concluidos') {
      result = result.filter((item) => item.status === 'Concluido');
    } else if (filtroTabelaStatus === 'agendados') {
      result = result.filter((item) => item.status !== 'Concluido');
    }

    if (ordenacaoTabela === 'lucro') {
      result.sort((a, b) => b.lucroLiquido - a.lucroLiquido);
    } else if (ordenacaoTabela === 'faturamento') {
      result.sort((a, b) => b.valor - a.valor);
    } else if (ordenacaoTabela === 'margem') {
      result.sort((a, b) => b.margemLiquida - a.margemLiquida);
    } else {
      result.sort((a, b) => {
        const timeA = a.dataObj ? a.dataObj.getTime() : 0;
        const timeB = b.dataObj ? b.dataObj.getTime() : 0;
        return timeB - timeA;
      });
    }

    return result;
  }, [atendimentosDetalhados, filtroTabelaBusca, filtroTabelaStatus, ordenacaoTabela]);

  const totaisTabela = useMemo(() => {
    let faturamento = 0;
    let custoFilmes = 0;
    let custoAjudantes = 0;
    let custoExtras = 0;
    let lucroLiquido = 0;
    let area = 0;

    atendimentosFiltrados.forEach((item) => {
      faturamento += item.valor;
      custoFilmes += item.custoFilme;
      custoAjudantes += item.custoAjudante;
      custoExtras += item.custoExtras;
      lucroLiquido += item.lucroLiquido;
      area += item.area;
    });

    const despesasTotais = custoFilmes + custoAjudantes + custoExtras;
    const margemMedia = faturamento > 0 ? (lucroLiquido / faturamento) * 100 : 0;

    return {
      faturamento,
      custoFilmes,
      custoAjudantes,
      custoExtras,
      despesasTotais,
      lucroLiquido,
      margemMedia,
      area,
      count: atendimentosFiltrados.length,
    };
  }, [atendimentosFiltrados]);

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
        label: 'Lucro Líquido Real',
        value: formatBRL(dre.lucroLiquido),
        subtext: `${dre.margemLiquidaReal.toFixed(1)}% líquido no bolso (${formatBRL(dre.despesasTotais)} despesas)`,
        icon: Award,
        tone: 'emerald',
      },
      {
        label: 'Ticket médio',
        value: formatBRL(ticketMedio),
        subtext:
          servicosComValor.length > 0
            ? `média em ${servicosComValor.length} serviço(s) com valor`
            : 'receita média por atendimento',
        icon: TrendingUp,
        tone: 'sky',
      },
      {
        label: 'Metragem e Obras',
        value: `${m2Total.toFixed(1)} m²`,
        subtext: `${numJobs} serviços (${taxaConclusao}% concluídos)`,
        icon: Package,
        tone: 'white',
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
          {/* ========================================================================= */}
          {/* DRE EXECUTIVO: DEMONSTRAÇÃO DO RESULTADO LÍQUIDO OPERACIONAL */}
          {/* ========================================================================= */}
          <section className="relative overflow-hidden rounded-[2.25rem] border border-[#c9a227]/30 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,39,0.15),_transparent_65%),linear-gradient(180deg,#0a1524_0%,#050b14_100%)] p-6 shadow-2xl shadow-black/40">
            {/* Linha dourada superior */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a227]/80 to-transparent" />

            {/* Cabeçalho do DRE */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#c9a227]/30 bg-[#c9a227]/10 text-[#f5d77a] shadow-[0_0_15px_rgba(201,162,39,0.15)]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#f5d77a]">
                      DRE Operacional
                    </span>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                      Resultado Real
                    </span>
                  </div>
                  <h3 className="mt-0.5 font-display text-xl font-black tracking-tight text-white sm:text-2xl">
                    Demonstração do Resultado Líquido
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">Margem Líquida Real</p>
                  <p className="text-xl font-black text-emerald-300">{dre.margemLiquidaReal.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Grid da Trinca Financeira */}
            <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {/* 1. Faturamento Bruto */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4.5 hover:border-white/10 transition">
                <div className="flex items-center justify-between text-white/50 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">1. Receita Bruta</span>
                  <Wallet className="h-4 w-4 text-[#c9a227]" />
                </div>
                <p className="text-2xl font-black text-white">{formatBRL(faturamentoTotal)}</p>
                <p className="mt-1 text-xs text-white/40">100% faturado no mês</p>
              </div>

              {/* 2. Custo Insumos Bluetech */}
              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/[0.03] p-4.5 hover:border-sky-500/30 transition">
                <div className="flex items-center justify-between text-white/50 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300/80">2. (−) Películas Bluetech</span>
                  <Layers3 className="h-4 w-4 text-sky-400" />
                </div>
                <p className="text-2xl font-black text-sky-200">
                  {dre.custoTotalFilmes > 0 ? `- ${formatBRL(dre.custoTotalFilmes)}` : 'R$ 0,00'}
                </p>
                <p className="mt-1 text-xs text-sky-300/60">
                  {dre.shareFilmes.toFixed(1)}% da receita ({m2Total.toFixed(1)} m² aplicados)
                </p>
              </div>

              {/* 3. Ajudantes & Despesas Operacionais */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-4.5 hover:border-amber-500/30 transition">
                <div className="flex items-center justify-between text-white/50 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80">3. (−) Ajudantes & Extras</span>
                  <Clock className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-amber-200">
                  {dre.despesasOperacionais > 0 ? `- ${formatBRL(dre.despesasOperacionais)}` : 'R$ 0,00'}
                </p>
                <p className="mt-1 text-xs text-amber-300/60">
                  {dre.shareEquipe.toFixed(1)}% da receita (diárias e extras)
                </p>
              </div>

              {/* 4. Lucro Líquido Real */}
              <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent p-4.5 shadow-lg shadow-emerald-500/10">
                <div className="flex items-center justify-between text-white/50 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">4. (=) Lucro Líquido</span>
                  <Award className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-emerald-300">{formatBRL(dre.lucroLiquido)}</p>
                <p className="mt-1 text-xs text-emerald-200/70 font-semibold">
                  {dre.margemLiquidaReal.toFixed(1)}% líquido no bolso
                </p>
              </div>
            </div>

            {/* Barra de Distribuição Visual do Faturamento */}
            <div className="mt-5 space-y-2 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider">Composição do Faturamento</span>
                <span className="text-[11px] font-bold text-white">
                  Lucro {dre.margemLiquidaReal.toFixed(0)}% • Películas {dre.shareFilmes.toFixed(0)}% • Equipe {dre.shareEquipe.toFixed(0)}%
                </span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5 p-0.5 border border-white/10">
                <div
                  style={{ width: `${Math.min(100, Math.max(0, dre.margemLiquidaReal))}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                  title={`Lucro Líquido: ${formatBRL(dre.lucroLiquido)} (${dre.margemLiquidaReal.toFixed(1)}%)`}
                />
                <div
                  style={{ width: `${Math.min(100, Math.max(0, dre.shareFilmes))}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500"
                  title={`Películas Bluetech: ${formatBRL(dre.custoTotalFilmes)} (${dre.shareFilmes.toFixed(1)}%)`}
                />
                <div
                  style={{ width: `${Math.min(100, Math.max(0, dre.shareEquipe))}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                  title={`Ajudantes & Extras: ${formatBRL(dre.despesasOperacionais)} (${dre.shareEquipe.toFixed(1)}%)`}
                />
              </div>
            </div>
          </section>

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
            {/* GRÁFICO ANUAL (12 MESES) & DIÁRIO COM SELETOR BIMODAL (FATURAMENTO VS LUCRO) */}
            <article className="rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
              <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  {visaoGrafico === 'anual' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                          Sazonalidade & Trajetória Anual
                        </span>
                        <span className="rounded bg-[#c9a227]/15 px-2 py-0.5 text-[10px] font-bold text-[#f5d77a]">
                          12 Meses
                        </span>
                      </div>
                      <h3 className="mt-1 text-lg font-bold text-white">
                        {metricaGrafico === 'faturamento'
                          ? `Faturamento Mensal de ${anoSelecionado}`
                          : metricaGrafico === 'lucro'
                          ? `Lucro Líquido Real de ${anoSelecionado}`
                          : `Faturamento vs. Lucro Líquido (${anoSelecionado})`}
                      </h3>
                      <p className="text-xs text-white/40">
                        {metricaGrafico === 'faturamento'
                          ? 'Acompanhe qual é a melhor época do ano e a evolução de receita mês a mês.'
                          : metricaGrafico === 'lucro'
                          ? 'Acompanhe quanto dinheiro líquido sobrou no caixa mês a mês após insumos e equipe.'
                          : 'Comparativo lado a lado entre faturamento bruto e lucro líquido real de cada mês.'}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                          Ritmo Diário de Atendimentos
                        </span>
                        <span className="rounded bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold text-sky-300">
                          {tituloMes} / {anoSelecionado}
                        </span>
                      </div>
                      <h3 className="mt-1 text-lg font-bold text-white">
                        {metricaGrafico === 'faturamento'
                          ? `Faturamento Diário de ${tituloMes}`
                          : metricaGrafico === 'lucro'
                          ? `Lucro Líquido Dia a Dia (${tituloMes})`
                          : `Faturamento vs. Lucro Diário (${tituloMes})`}
                      </h3>
                      <p className="text-xs text-white/40">
                        {metricaGrafico === 'faturamento'
                          ? 'Acompanhe a curva de vendas e serviços executados em cada dia do mês ativo.'
                          : metricaGrafico === 'lucro'
                          ? 'Descubra os dias de maior retenção líquida de caixa no mês.'
                          : 'Comparativo diário entre o valor bruto cobrado e o lucro líquido real retido.'}
                      </p>
                    </>
                  )}
                </div>

                {/* CONTROLES: SELETORES DE VISÃO E MÉTRICA */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Seletor de Período (12 Meses vs Diário) */}
                  <div className="inline-flex rounded-xl border border-white/10 bg-[#04080f] p-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setVisaoGrafico('anual')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        visaoGrafico === 'anual'
                          ? 'bg-[#c9a227] text-[#04080f] font-bold shadow'
                          : 'text-white/60 hover:text-white'
                      }`}
                      title="Exibir gráfico anual consolidado (12 meses)"
                    >
                      <CalendarRange className="h-3.5 w-3.5" />
                      12 Meses
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisaoGrafico('diario')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        visaoGrafico === 'diario'
                          ? 'bg-[#c9a227] text-[#04080f] font-bold shadow'
                          : 'text-white/60 hover:text-white'
                      }`}
                      title="Exibir evolução diária do mês selecionado"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      Dias ({tituloMes})
                    </button>
                  </div>

                  {/* Seletor Bimodal / Trimoddal de Métrica */}
                  <div className="inline-flex rounded-xl border border-white/10 bg-[#04080f] p-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setMetricaGrafico('faturamento')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        metricaGrafico === 'faturamento'
                          ? 'border border-[#c9a227]/40 bg-[#c9a227]/20 font-bold text-[#f5d77a]'
                          : 'text-white/50 hover:text-white'
                      }`}
                      title="Exibir Faturamento Bruto"
                    >
                      <Wallet className="h-3.5 w-3.5 text-[#c9a227]" />
                      Faturamento
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetricaGrafico('lucro')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        metricaGrafico === 'lucro'
                          ? 'border border-emerald-500/40 bg-emerald-500/20 font-bold text-emerald-300'
                          : 'text-white/50 hover:text-white'
                      }`}
                      title="Exibir Lucro Líquido Real"
                    >
                      <Award className="h-3.5 w-3.5 text-emerald-400" />
                      Lucro Líquido
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetricaGrafico('comparativo')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        metricaGrafico === 'comparativo'
                          ? 'border border-sky-500/40 bg-sky-500/20 font-bold text-sky-200'
                          : 'text-white/50 hover:text-white'
                      }`}
                      title="Comparar Faturamento vs Lucro Líquido"
                    >
                      <TrendingUp className="h-3.5 w-3.5 text-sky-400" />
                      Comparativo
                    </button>
                  </div>
                </div>
              </div>

              {/* ÁREA DO GRÁFICO (RECHARTS) */}
              <div className="h-[270px]">
                {visaoGrafico === 'anual' ? (
                  faturamentoAcumuladoAno <= 0 ? (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center text-sm text-white/35">
                      Nenhum serviço registrado no ano de {anoSelecionado}.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dadosAno12Meses}
                        barSize={metricaGrafico === 'comparativo' ? 14 : 28}
                        barGap={4}
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
                          content={({ active, payload }) => {
                            if (!active || !payload || !payload.length) return null;
                            const item = payload[0].payload as (typeof dadosAno12Meses)[number];
                            if (!item) return null;

                            return (
                              <div className="rounded-xl border border-white/10 bg-[#04080f]/95 p-3.5 shadow-2xl backdrop-blur-md min-w-[210px]">
                                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1.5 mb-2">
                                  <span className="font-bold text-white text-xs">
                                    {item.mesCompleto} / {anoSelecionado}
                                  </span>
                                  <span className="text-[10px] text-white/50">{item.jobs} serviço(s)</span>
                                </div>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex items-center justify-between gap-3 text-[#f5d77a]">
                                    <span>Faturamento:</span>
                                    <span className="font-bold">{formatBRL(item.faturamento)}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3 text-rose-300/80">
                                    <span>Insumos / Custos:</span>
                                    <span>- {formatBRL(item.custoTotal)}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-3 text-emerald-300 font-bold border-t border-white/10 pt-1">
                                    <span>Lucro Líquido:</span>
                                    <span>{formatBRL(item.lucroLiquido)}</span>
                                  </div>
                                  <div className="text-[10px] text-emerald-400/80 text-right font-medium">
                                    Margem líquida: {item.margemLiquida.toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        />

                        {metricaGrafico === 'faturamento' && (
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
                        )}

                        {metricaGrafico === 'lucro' && (
                          <Bar dataKey="lucroLiquido" radius={[6, 6, 0, 0]}>
                            {dadosAno12Meses.map((entry) => {
                              const isCurrent = entry.index === mesSelecionado;
                              const isBest = melhorMesLucro?.index === entry.index;
                              return (
                                <Cell
                                  key={entry.mes}
                                  fill={isCurrent ? '#34d399' : isBest ? '#10b981' : '#065f46'}
                                  fillOpacity={entry.lucroLiquido > 0 ? (isCurrent ? 1 : 0.75) : 0.15}
                                />
                              );
                            })}
                          </Bar>
                        )}

                        {metricaGrafico === 'comparativo' && (
                          <>
                            <Bar
                              dataKey="faturamento"
                              name="Faturamento Bruto"
                              fill="#c9a227"
                              radius={[4, 4, 0, 0]}
                            />
                            <Bar
                              dataKey="lucroLiquido"
                              name="Lucro Líquido Real"
                              fill="#10b981"
                              radius={[4, 4, 0, 0]}
                            />
                          </>
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  )
                ) : (
                  /* VISÃO DIÁRIA DO MÊS ATIVO */
                  registros.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center text-sm text-white/35">
                      Nenhum serviço registrado no mês de {tituloMes} de {anoSelecionado}.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dadosDiasDoMes}
                        barSize={metricaGrafico === 'comparativo' ? 7 : 11}
                        barGap={2}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.04)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="dia"
                          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }}
                          axisLine={false}
                          tickLine={false}
                          interval={1}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.45)' }}
                          tickFormatter={(value) =>
                            `R$${Number(value) >= 1000 ? (Number(value) / 1000).toFixed(0) + 'k' : Number(value)}`
                          }
                          width={48}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                          content={({ active, payload }) => {
                            if (!active || !payload || !payload.length) return null;
                            const item = payload[0].payload as (typeof dadosDiasDoMes)[number];
                            if (!item) return null;

                            return (
                              <div className="rounded-xl border border-white/10 bg-[#04080f]/95 p-3.5 shadow-2xl backdrop-blur-md min-w-[210px]">
                                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1.5 mb-2">
                                  <span className="font-bold text-white text-xs">
                                    Dia {item.dia} ({item.diaSemana}) - {item.dataCompleta}
                                  </span>
                                  <span className="text-[10px] text-white/50">{item.jobs} serviço(s)</span>
                                </div>
                                <div className="space-y-1.5 text-xs">
                                  <div className="flex items-center justify-between gap-3 text-[#f5d77a]">
                                    <span>Faturamento:</span>
                                    <span className="font-bold">{formatBRL(item.faturamento)}</span>
                                  </div>
                                  {item.custoFilmes > 0 && (
                                    <div className="flex items-center justify-between gap-3 text-sky-300/80">
                                      <span>Películas Bluetech:</span>
                                      <span>- {formatBRL(item.custoFilmes)}</span>
                                    </div>
                                  )}
                                  {item.despesasOperacionais > 0 && (
                                    <div className="flex items-center justify-between gap-3 text-amber-300/80">
                                      <span>Ajudante & Extras:</span>
                                      <span>- {formatBRL(item.despesasOperacionais)}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-between gap-3 text-emerald-300 font-bold border-t border-white/10 pt-1">
                                    <span>Lucro Líquido:</span>
                                    <span>{formatBRL(item.lucroLiquido)}</span>
                                  </div>
                                  {item.faturamento > 0 && (
                                    <div className="text-[10px] text-emerald-400/80 text-right font-medium">
                                      Margem líquida: {item.margemLiquida.toFixed(1)}%
                                    </div>
                                  )}
                                  {item.clientes && (
                                    <div className="mt-1.5 pt-1.5 border-t border-white/5 text-[10px] text-white/55 truncate max-w-[200px]">
                                      Clientes: {item.clientes}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }}
                        />

                        {metricaGrafico === 'faturamento' && (
                          <Bar dataKey="faturamento" radius={[4, 4, 0, 0]}>
                            {dadosDiasDoMes.map((entry) => (
                              <Cell
                                key={entry.dia}
                                fill={entry.faturamento > 0 ? '#c9a227' : '#221903'}
                                fillOpacity={entry.faturamento > 0 ? 1 : 0.15}
                              />
                            ))}
                          </Bar>
                        )}

                        {metricaGrafico === 'lucro' && (
                          <Bar dataKey="lucroLiquido" radius={[4, 4, 0, 0]}>
                            {dadosDiasDoMes.map((entry) => (
                              <Cell
                                key={entry.dia}
                                fill={entry.lucroLiquido > 0 ? '#10b981' : '#042f2e'}
                                fillOpacity={entry.lucroLiquido > 0 ? 1 : 0.15}
                              />
                            ))}
                          </Bar>
                        )}

                        {metricaGrafico === 'comparativo' && (
                          <>
                            <Bar
                              dataKey="faturamento"
                              name="Faturamento Bruto"
                              fill="#c9a227"
                              radius={[3, 3, 0, 0]}
                            />
                            <Bar
                              dataKey="lucroLiquido"
                              name="Lucro Líquido Real"
                              fill="#10b981"
                              radius={[3, 3, 0, 0]}
                            />
                          </>
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  )
                )}
              </div>

              {/* LEGENDA NO MODO COMPARATIVO */}
              {metricaGrafico === 'comparativo' && (
                <div className="mt-3 flex items-center justify-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#c9a227]" />
                    <span className="text-white/70 font-medium">Faturamento Bruto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-[#10b981]" />
                    <span className="text-white/70 font-medium">Lucro Líquido Real</span>
                  </div>
                </div>
              )}

              <p className="mt-2 text-center text-[11px] text-white/30">
                {visaoGrafico === 'anual'
                  ? '💡 Dica: Clique na barra de qualquer mês para navegar ou use os botões acima para comparar com o lucro líquido.'
                  : '💡 Dica: Passe o mouse nas barras dos dias para ver os clientes atendidos e os custos do dia.'}
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
            {/* UPGRADE MASTER: RANKING DE PELÍCULAS POR LUCRO REAL E FATURAMENTO */}
            <article className="rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                      Mix de Películas & Rentabilidade
                    </span>
                    <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      Lucro Líquido Real
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    Ranking de Películas por Lucro & Venda
                  </h3>
                  <p className="text-xs text-white/40">
                    Descubra quais películas deixam mais dinheiro no bolso após o custo dos rolos Bluetech RJ.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Seletor de Ordenação */}
                  <div className="inline-flex rounded-xl border border-white/10 bg-[#04080f] p-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setOrdenacaoPeliculas('lucro')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        ordenacaoPeliculas === 'lucro'
                          ? 'border border-emerald-500/40 bg-emerald-500/20 font-bold text-emerald-300'
                          : 'text-white/50 hover:text-white'
                      }`}
                      title="Ordenar por maior lucro líquido em reais"
                    >
                      <Award className="h-3.5 w-3.5 text-emerald-400" />
                      Maior Lucro (R$)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrdenacaoPeliculas('faturamento')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        ordenacaoPeliculas === 'faturamento'
                          ? 'border border-[#c9a227]/40 bg-[#c9a227]/20 font-bold text-[#f5d77a]'
                          : 'text-white/50 hover:text-white'
                      }`}
                      title="Ordenar por maior faturamento bruto"
                    >
                      <Wallet className="h-3.5 w-3.5 text-[#c9a227]" />
                      Faturamento
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrdenacaoPeliculas('area')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        ordenacaoPeliculas === 'area'
                          ? 'border border-sky-500/40 bg-sky-500/20 font-bold text-sky-200'
                          : 'text-white/50 hover:text-white'
                      }`}
                      title="Ordenar por metragem quadrada aplicada"
                    >
                      <Layers3 className="h-3.5 w-3.5 text-sky-400" />
                      Metragem (m²)
                    </button>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold text-white/55">
                    {rankingPeliculas.length} linha{rankingPeliculas.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {rankingPeliculas.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-12 text-center text-sm text-white/40">
                  Nenhum serviço registrado neste mês para agrupar por película.
                </p>
              ) : (
                <div className="space-y-3.5">
                  {rankingPeliculas.map((item, index) => {
                    const isTopProfit = peliculaMaisLucrativa?.nome === item.nome && item.lucroLiquido > 0;
                    const isTopRevenue = peliculaMaisVendida?.nome === item.nome && item.valor > 0 && !isTopProfit;
                    const isTopMargin =
                      peliculaMaiorMargem?.nome === item.nome &&
                      item.valor > 0 &&
                      !isTopProfit &&
                      !isTopRevenue;

                    const shareInsumo = item.valor > 0 ? (item.custoTotal / item.valor) * 100 : 0;
                    const shareLucro = item.valor > 0 ? (item.lucroLiquido / item.valor) * 100 : 0;

                    return (
                      <div
                        key={item.nome}
                        className={`group rounded-2xl border p-4 transition ${
                          isTopProfit
                            ? 'border-emerald-500/30 bg-emerald-500/[0.03] hover:border-emerald-500/50'
                            : 'border-white/5 bg-white/[0.025] hover:border-[#c9a227]/30 hover:bg-white/[0.045]'
                        }`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex min-w-0 items-start gap-3">
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${
                                isTopProfit
                                  ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                                  : index === 0
                                  ? 'border-[#c9a227]/40 bg-[#c9a227]/20 text-[#f5d77a]'
                                  : 'border-white/10 bg-white/[0.04] text-white/60'
                              }`}
                            >
                              {index + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate text-base font-bold text-white">{item.nome}</p>
                                {isTopProfit && (
                                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                                    🏆 Campeã de Lucro
                                  </span>
                                )}
                                {isTopRevenue && (
                                  <span className="rounded-full border border-[#c9a227]/40 bg-[#c9a227]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#f5d77a]">
                                    🔥 Mais Vendida
                                  </span>
                                )}
                                {isTopMargin && (
                                  <span className="rounded-full border border-sky-400/40 bg-sky-400/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-sky-200">
                                    ⚡ Maior Margem ({item.margemLiquida.toFixed(0)}%)
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
                                {item.custoTotal > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-sky-300/80">
                                      Custo Bluetech: {formatBRL(item.custoTotal)} ({formatBRL(item.custoM2)}/m²)
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col sm:items-end justify-between items-baseline gap-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-[11px] font-medium uppercase text-emerald-400/70 sm:hidden">
                                Lucro:
                              </span>
                              <p className="text-lg font-black text-emerald-300">{formatBRL(item.lucroLiquido)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-white/50">
                                Fat: {formatBRL(item.valor)} ({item.share.toFixed(0)}%)
                              </span>
                              {item.margemLiquida > 0 && (
                                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                                  {item.margemLiquida.toFixed(1)}% margem
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* BARRA DE PROPORÇÃO DE VALOR: LUCRO LÍQUIDO VS CUSTO BLUETECH */}
                        <div className="mt-3.5 space-y-1.5">
                          <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(5, shareLucro))}%` }}
                              title={`Lucro Líquido: ${formatBRL(item.lucroLiquido)} (${shareLucro.toFixed(1)}%)`}
                            />
                            {item.custoTotal > 0 && (
                              <div
                                className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(2, shareInsumo))}%` }}
                                title={`Custo Insumos Bluetech: ${formatBRL(item.custoTotal)} (${shareInsumo.toFixed(1)}%)`}
                              />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-white/40">
                            <span className="text-emerald-300 font-medium">
                              {formatBRL(item.lucroLiquido)} de lucro líquido ({shareLucro.toFixed(0)}%)
                            </span>
                            <span className="text-sky-300/80">
                              {item.custoTotal > 0 ? `Custo Bluetech: -${formatBRL(item.custoTotal)}` : 'Sem custo de filme'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

          {/* ========================================================================= */}
          {/* SECTION 4: RAIO-X FINANCEIRO DOS ATENDIMENTOS DO MÊS (CLIENTE A CLIENTE) */}
          {/* ========================================================================= */}
          <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#07111d]/78 p-5 shadow-2xl shadow-black/20 backdrop-blur-md md:p-6 space-y-5">
            {/* Header da Seção */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/5 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.26em] text-white/40 font-semibold">
                    Auditoria de Caixa & Obras
                  </span>
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    Raio-X Financeiro
                  </span>
                </div>
                <h3 className="mt-1 text-xl font-bold text-white md:text-2xl">
                  Detalhamento de Atendimentos de {tituloMes}
                </h3>
                <p className="mt-1 text-xs text-white/45 max-w-2xl">
                  Demonstração transparente cliente a cliente com receita bruta, custos reais de películas Bluetech RJ, diárias de ajudante/extras e lucro líquido real retido.
                </p>
              </div>

              {/* Filtros e Busca */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Campo de Busca */}
                <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={filtroTabelaBusca}
                    onChange={(e) => setFiltroTabelaBusca(e.target.value)}
                    placeholder="Buscar cliente, bairro ou filme..."
                    className="w-full rounded-xl border border-white/10 bg-[#04080f] py-2 pl-9 pr-3 text-xs text-white placeholder-white/35 outline-none transition focus:border-[#c9a227]/50"
                  />
                </div>

                {/* Status Tabs */}
                <div className="inline-flex rounded-xl border border-white/10 bg-[#04080f] p-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setFiltroTabelaStatus('todos')}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      filtroTabelaStatus === 'todos'
                        ? 'bg-[#c9a227] text-[#04080f] font-bold shadow'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Todos ({atendimentosDetalhados.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltroTabelaStatus('concluidos')}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      filtroTabelaStatus === 'concluidos'
                        ? 'bg-[#c9a227] text-[#04080f] font-bold shadow'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Concluídos
                  </button>
                  <button
                    type="button"
                    onClick={() => setFiltroTabelaStatus('agendados')}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      filtroTabelaStatus === 'agendados'
                        ? 'bg-[#c9a227] text-[#04080f] font-bold shadow'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Agendados
                  </button>
                </div>

                {/* Seletor de Ordenação */}
                <div className="inline-flex rounded-xl border border-white/10 bg-[#04080f] p-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setOrdenacaoTabela('data')}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      ordenacaoTabela === 'data'
                        ? 'border border-white/20 bg-white/10 text-white font-bold'
                        : 'text-white/50 hover:text-white'
                    }`}
                    title="Mais recentes primeiro"
                  >
                    <CalendarRange className="h-3 w-3" />
                    Data
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrdenacaoTabela('lucro')}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      ordenacaoTabela === 'lucro'
                        ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'text-white/50 hover:text-white'
                    }`}
                    title="Maior lucro líquido em reais"
                  >
                    <Award className="h-3 w-3 text-emerald-400" />
                    Lucro
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrdenacaoTabela('faturamento')}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      ordenacaoTabela === 'faturamento'
                        ? 'border border-[#c9a227]/40 bg-[#c9a227]/20 text-[#f5d77a] font-bold'
                        : 'text-white/50 hover:text-white'
                    }`}
                    title="Maior faturamento bruto"
                  >
                    <Wallet className="h-3 w-3 text-[#c9a227]" />
                    Faturamento
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrdenacaoTabela('margem')}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      ordenacaoTabela === 'margem'
                        ? 'border border-sky-500/40 bg-sky-500/20 text-sky-200 font-bold'
                        : 'text-white/50 hover:text-white'
                    }`}
                    title="Maior margem líquida percentual"
                  >
                    <TrendingUp className="h-3 w-3 text-sky-400" />
                    Margem %
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo da Tabela / Cards */}
            {atendimentosFiltrados.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center text-sm text-white/40">
                {filtroTabelaBusca
                  ? `Nenhum atendimento encontrado para o termo "${filtroTabelaBusca}".`
                  : 'Nenhum atendimento registrado com os filtros selecionados.'}
              </div>
            ) : (
              <>
                {/* VISÃO DESKTOP: TABELA COMPLETA */}
                <div className="hidden lg:block overflow-x-auto rounded-xl border border-white/5 bg-[#04080f]/50">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/40 bg-white/[0.02]">
                        <th className="py-3.5 pl-4">Cliente & Bairro</th>
                        <th className="py-3.5 px-3">Data</th>
                        <th className="py-3.5 px-3">Película & Área</th>
                        <th className="py-3.5 px-3 text-right">Faturamento</th>
                        <th className="py-3.5 px-3 text-right">Película Bluetech</th>
                        <th className="py-3.5 px-3 text-right">Ajudante & Extras</th>
                        <th className="py-3.5 px-3 text-right">Lucro Líquido</th>
                        <th className="py-3.5 pr-4 text-right">Margem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {atendimentosFiltrados.map((item) => (
                        <tr key={item.id} className="transition hover:bg-white/[0.025]">
                          <td className="py-3 pl-4">
                            <div className="font-bold text-white text-sm">{item.cliente}</div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/40">
                              <MapPin className="h-3 w-3 text-[#c9a227]" />
                              <span>{item.bairro}</span>
                              <span>•</span>
                              {item.status === 'Concluido' ? (
                                <span className="inline-flex items-center gap-0.5 text-emerald-400 font-medium">
                                  <CheckCircle2 className="h-3 w-3" /> Concluído
                                </span>
                              ) : (
                                <span className="text-white/50">{item.status}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-white/60 whitespace-nowrap">
                            {item.dataFormatada}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-white">{item.pelicula}</div>
                            <div className="text-[11px] text-white/40">
                              {item.area > 0 ? `${item.area.toFixed(1)} m²` : '-'}
                              {item.vidrosCount > 0 ? ` (${item.vidrosCount} vidros)` : ''}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-black text-[#f5d77a] whitespace-nowrap">
                            {formatBRL(item.valor)}
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap text-sky-300/80">
                            {item.custoFilme > 0 ? `- ${formatBRL(item.custoFilme)}` : 'R$ 0,00'}
                            {item.area > 0 && item.custoFilme > 0 && (
                              <span className="block text-[10px] text-sky-400/50">
                                ({formatBRL(item.custoM2)}/m²)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap text-amber-300/80">
                            {item.despesasTotais - item.custoFilme > 0 ? (
                              <>
                                <span>- {formatBRL(item.custoAjudante + item.custoExtras)}</span>
                                {item.custoAjudante > 0 && item.custoExtras > 0 && (
                                  <span className="block text-[10px] text-amber-400/50">
                                    (Aj: {formatBRL(item.custoAjudante)} | Ex: {formatBRL(item.custoExtras)})
                                  </span>
                                )}
                              </>
                            ) : (
                              'R$ 0,00'
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-black text-emerald-300 whitespace-nowrap text-sm">
                            {formatBRL(item.lucroLiquido)}
                          </td>
                          <td className="py-3 pr-4 text-right whitespace-nowrap">
                            <span
                              className={`rounded-md border px-2 py-0.5 text-[11px] font-black ${
                                item.margemLiquida >= 80
                                  ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                                  : item.margemLiquida >= 60
                                  ? 'border-[#c9a227]/30 bg-[#c9a227]/15 text-[#f5d77a]'
                                  : 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                              }`}
                            >
                              {item.margemLiquida.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-white/10 bg-[#07111d]/95 font-bold">
                        <td colSpan={3} className="py-4 pl-4 text-white text-xs">
                          Totais do Filtro ({totaisTabela.count} serviço{totaisTabela.count !== 1 ? 's' : ''} • {totaisTabela.area.toFixed(1)} m²)
                        </td>
                        <td className="py-4 px-3 text-right font-black text-[#f5d77a] text-sm whitespace-nowrap">
                          {formatBRL(totaisTabela.faturamento)}
                        </td>
                        <td className="py-4 px-3 text-right text-sky-300 font-bold whitespace-nowrap">
                          - {formatBRL(totaisTabela.custoFilmes)}
                        </td>
                        <td className="py-4 px-3 text-right text-amber-300 font-bold whitespace-nowrap">
                          - {formatBRL(totaisTabela.custoAjudantes + totaisTabela.custoExtras)}
                        </td>
                        <td className="py-4 px-3 text-right font-black text-emerald-300 text-base whitespace-nowrap">
                          {formatBRL(totaisTabela.lucroLiquido)}
                        </td>
                        <td className="py-4 pr-4 text-right whitespace-nowrap">
                          <span className="rounded-md border border-emerald-500/40 bg-emerald-500/20 px-2 py-1 text-xs font-black text-emerald-300">
                            {totaisTabela.margemMedia.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* VISÃO MOBILE / TABLET: CARDS INDIVIDUAIS */}
                <div className="grid gap-3 lg:hidden">
                  {atendimentosFiltrados.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-white/5 bg-[#04080f]/80 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-white text-sm">{item.cliente}</p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-white/40">
                            <span>{item.bairro}</span>
                            <span>•</span>
                            <span>{item.dataFormatada}</span>
                          </div>
                        </div>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[11px] font-black ${
                            item.margemLiquida >= 80
                              ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                              : item.margemLiquida >= 60
                              ? 'border-[#c9a227]/30 bg-[#c9a227]/15 text-[#f5d77a]'
                              : 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                          }`}
                        >
                          {item.margemLiquida.toFixed(1)}% margem
                        </span>
                      </div>

                      <div className="rounded-lg bg-white/[0.02] p-2.5 text-xs text-white/60">
                        <span className="font-semibold text-white">{item.pelicula}</span>
                        <span className="ml-1.5 text-white/40">
                          ({item.area > 0 ? `${item.area.toFixed(1)} m²` : '-'})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5">
                        <div>
                          <span className="text-[10px] uppercase text-white/40 block">Faturamento</span>
                          <span className="font-bold text-[#f5d77a]">{formatBRL(item.valor)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-emerald-400/80 block">Lucro Líquido</span>
                          <span className="font-black text-emerald-300">{formatBRL(item.lucroLiquido)}</span>
                        </div>
                        {item.custoFilme > 0 && (
                          <div className="col-span-2 flex items-center justify-between text-[11px] text-sky-300/80">
                            <span>Custo Película Bluetech:</span>
                            <span>- {formatBRL(item.custoFilme)}</span>
                          </div>
                        )}
                        {(item.custoAjudante > 0 || item.custoExtras > 0) && (
                          <div className="col-span-2 flex items-center justify-between text-[11px] text-amber-300/80">
                            <span>Ajudante & Extras:</span>
                            <span>- {formatBRL(item.custoAjudante + item.custoExtras)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Resumo Mobile */}
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs">
                    <div className="flex items-center justify-between font-bold text-white mb-1.5">
                      <span>Total Filtrado ({totaisTabela.count} serviços)</span>
                      <span className="text-emerald-300">{totaisTabela.margemMedia.toFixed(1)}% líquido</span>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span>Faturamento: <strong className="text-[#f5d77a]">{formatBRL(totaisTabela.faturamento)}</strong></span>
                      <span>Lucro: <strong className="text-emerald-300">{formatBRL(totaisTabela.lucroLiquido)}</strong></span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
