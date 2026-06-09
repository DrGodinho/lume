'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { supabase } from '@/lib/supabase';
import {
  format,
  getDate,
  getMonth,
  getYear,
  setMonth,
  setYear,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast, { Toaster } from 'react-hot-toast';
import {
  BarChart3,
  CalendarRange,
  Download,
  Loader2,
  MapPin,
  Package,
  ReceiptText,
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

type ExtratoRecord = {
  id: string;
  cliente?: string;
  valor?: number;
  qtd?: number;
  created_at?: string;
  selected_film?: string | null;
  modo_otimizacao?: string | null;
  vidros?: Array<{ oh?: number; ow?: number; h?: number; w?: number; label?: string }>;
  bairro?: string | null;
  neighborhood?: string | null;
  area?: number | null;
  m2?: number | null;
  metros?: number | null;
  sqm?: number | null;
  lead_id?: string | null;
};

type KpiCard = {
  label: string;
  value: string;
  subtext: string;
  icon: ComponentType<{ className?: string }>;
};

const FILM_LABELS: Record<string, string> = {
  carbono: 'Carbono',
  refletiva: 'Refletiva',
  dupla_camada: 'Dupla Camada',
  nano_ceramica: 'Nano Cerâmica',
  jateado: 'Jateado',
};

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

function semanaDoMes(diaDoMes: number) {
  if (diaDoMes <= 7) return 'Sem. 1';
  if (diaDoMes <= 14) return 'Sem. 2';
  if (diaDoMes <= 21) return 'Sem. 3';
  if (diaDoMes <= 28) return 'Sem. 4';
  return 'Sem. 5';
}

function normalizeRecord(row: any): ExtratoRecord {
  return {
    id: row.id,
    cliente: row.cliente || row.name || row.nome || '',
    valor: Number(row.valor || 0),
    qtd: Number(row.qtd || 0),
    created_at: row.created_at || row.data || row.createdAt || new Date().toISOString(),
    selected_film: row.selected_film || row.selectedFilm || null,
    modo_otimizacao: row.modo_otimizacao || row.modoOtimizacao || null,
    vidros: Array.isArray(row.vidros) ? row.vidros : [],
    bairro: row.bairro || row.neighborhood || row.bairro_cliente || null,
    neighborhood: row.neighborhood || null,
    area: row.area ?? null,
    m2: row.m2 ?? null,
    metros: row.metros ?? null,
    sqm: row.sqm ?? null,
    lead_id: row.lead_id || null,
  };
}

function getFilmLabel(record: ExtratoRecord) {
  if (record.selected_film) {
    return FILM_LABELS[record.selected_film] || record.selected_film;
  }

  if (record.modo_otimizacao) {
    return record.modo_otimizacao === 'densidade'
      ? 'Nano Cerâmica'
      : record.modo_otimizacao === 'facilidade'
        ? 'Refletiva'
        : record.modo_otimizacao === 'facilidade_v2'
          ? 'Carbono'
          : record.modo_otimizacao;
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

function getBairroLabel(record: ExtratoRecord) {
  return record.bairro || record.neighborhood || '';
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-3xl border border-white/5 bg-white/[0.03] animate-pulse"
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="h-[280px] rounded-3xl border border-white/5 bg-white/[0.03] animate-pulse" />
        <div className="h-[280px] rounded-3xl border border-white/5 bg-white/[0.03] animate-pulse" />
      </div>
      <div className="h-[420px] rounded-3xl border border-white/5 bg-white/[0.03] animate-pulse" />
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
      Array.from({ length: 12 }, (_, i) =>
        capitalizeFirst(format(setMonth(new Date(), i), 'MMMM', { locale: ptBR }))
      ),
    []
  );

  const anos = useMemo(() => {
    const currentYear = getYear(new Date());
    return Array.from({ length: currentYear - 2025 + 2 }, (_, i) => 2025 + i);
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

      const { data, error } = await supabase
        .from('calculator_history')
        .select('*')
        .gte('created_at', inicio.toISOString())
        .lte('created_at', fim.toISOString())
        .order('created_at', { ascending: true });

      if (cancelled) return;

      if (error) {
        setRegistros([]);
        setErrorMessage('Erro ao carregar extrato.');
        toast.error('Erro ao carregar extrato');
        setLoading(false);
        return;
      }

      setRegistros((data || []).map(normalizeRecord));
      setLoading(false);
    }

    carregarExtrato();

    return () => {
      cancelled = true;
    };
  }, [mesSelecionado, anoSelecionado]);

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

  const dadosGrafico = useMemo(() => {
    const base = {
      'Sem. 1': 0,
      'Sem. 2': 0,
      'Sem. 3': 0,
      'Sem. 4': 0,
      'Sem. 5': 0,
    };

    registros.forEach((record) => {
      const key = semanaDoMes(getDate(new Date(record.created_at || new Date())));
      base[key as keyof typeof base] += Number(record.valor || 0);
    });

    return Object.entries(base)
      .filter(([, valor]) => valor > 0)
      .map(([semana, valor]) => ({ semana, valor }));
  }, [registros]);

  const rankingPeliculas = useMemo(() => {
    const porPelicula: Record<string, { valor: number; jobs: number }> = {};

    registros.forEach((record) => {
      const nome = getFilmLabel(record) || 'Não informado';
      if (!porPelicula[nome]) porPelicula[nome] = { valor: 0, jobs: 0 };
      porPelicula[nome].valor += Number(record.valor || 0);
      porPelicula[nome].jobs += 1;
    });

    return Object.entries(porPelicula).sort(([, a], [, b]) => b.valor - a.valor);
  }, [registros]);

  const topBairros = useMemo(() => {
    const porBairro: Record<string, number> = {};

    registros.forEach((record) => {
      const bairro = getBairroLabel(record);
      if (!bairro) return;
      porBairro[bairro] = (porBairro[bairro] || 0) + Number(record.valor || 0);
    });

    return Object.entries(porBairro)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [registros]);

  const melhorSemana = useMemo(() => {
    if (dadosGrafico.length === 0) return null;
    return dadosGrafico.reduce((best, current) =>
      current.valor > best.valor ? current : best
    );
  }, [dadosGrafico]);

  const bairroLider = topBairros[0]?.[0] || 'Não disponível';
  const peliculaLider = rankingPeliculas[0]?.[0] || 'Não disponível';
  const melhorSemanaValor = melhorSemana?.valor || 0;

  const tabelaResumo = useMemo(
    () =>
      dadosOrdenados.map((record) => ({
        cliente: record.cliente || '—',
        pelicula: getFilmLabel(record),
        valor: formatBRL(Number(record.valor || 0)),
        data: record.created_at ? format(new Date(record.created_at), 'dd/MM/yyyy') : '—',
      })),
    [dadosOrdenados]
  );

  const kpis: KpiCard[] = useMemo(() => {
    return [
      {
        label: 'Faturamento Total',
        value: formatBRL(faturamentoTotal),
        subtext: 'total do mês',
        icon: Wallet,
      },
      {
        label: 'Nº de Jobs',
        value: String(numJobs),
        subtext: 'orçamentos emitidos',
        icon: ReceiptText,
      },
      {
        label: 'Ticket Médio',
        value: formatBRL(ticketMedio),
        subtext: 'por orçamento',
        icon: TrendingUp,
      },
      {
        label: m2Total > 0 ? 'M² Instalados' : 'Maior Orçamento',
        value: m2Total > 0 ? `${m2Total.toFixed(1)} m²` : formatBRL(maiorOrcamento),
        subtext: m2Total > 0 ? 'área total estimada' : 'maior venda do mês',
        icon: Package,
      },
    ];
  }, [faturamentoTotal, maiorOrcamento, m2Total, numJobs, ticketMedio]);

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

  const tituloMes = capitalizeFirst(
    format(setMonth(new Date(), mesSelecionado), 'MMMM', { locale: ptBR })
  );

  return (
    <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden space-y-6 bg-[#040811] px-4 py-6 md:px-6 md:py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-12 left-[8%] h-80 w-80 rounded-full bg-[#c9a227]/6 blur-[120px]" />
        <div className="absolute right-[6%] top-32 h-[420px] w-[420px] rounded-full bg-blue-500/5 blur-[160px]" />
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

      <div className="relative rounded-3xl border border-white/5 bg-gradient-to-br from-[#07111d]/95 via-[#07111d]/80 to-[#04080f]/95 p-6 shadow-2xl shadow-black/20 backdrop-blur-md md:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent" />
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#eab308]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#eab308]" />
              LUME CRM
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
              Extratos Mensais
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 md:text-[15px]">
              Acompanhe o desempenho mensal dos orçamentos com uma única consulta ao
              Supabase e consolide o faturamento por período, película e bairro.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[170px]">
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                Mês
              </label>
              <select
                value={mesSelecionado}
                onChange={(e) => setMesSelecionado(Number(e.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-[#04080f] px-4 py-3 text-sm text-white outline-none transition focus:border-[#c9a227]/50"
              >
                {meses.map((mes, index) => (
                  <option key={mes} value={index} className="bg-[#04080f]">
                    {mes}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[150px]">
              <label className="mb-1 block text-[10px] uppercase tracking-widest text-white/40 font-semibold">
                Ano
              </label>
              <select
                value={anoSelecionado}
                onChange={(e) => setAnoSelecionado(Number(e.target.value))}
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
              Exportar PDF
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-5 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/35 font-semibold">
                  Resumo do período
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">
                  {tituloMes} {anoSelecionado}
                </h3>
              </div>
              <span className="rounded-full border border-[#eab308]/20 bg-[#eab308]/10 px-3 py-1 text-[11px] font-semibold text-[#eab308]">
                Atualizado ao selecionar
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/5 bg-[#04080f]/60 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/35 font-semibold">
                  Receita
                </p>
                <p className="mt-2 text-lg font-black text-white">{formatBRL(faturamentoTotal)}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-[#04080f]/60 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/35 font-semibold">
                  Ticket
                </p>
                <p className="mt-2 text-lg font-black text-white">{formatBRL(ticketMedio)}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-[#04080f]/60 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/35 font-semibold">
                  Película líder
                </p>
                <p className="mt-2 truncate text-lg font-black text-white">{peliculaLider}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-[#04080f]/60 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/35 font-semibold">
                  Bairro líder
                </p>
                <p className="mt-2 truncate text-lg font-black text-white">{bairroLider}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-5 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/35 font-semibold">
                  Destaque rápido
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">Pico semanal</h3>
              </div>
              <BarChart3 className="h-5 w-5 text-[#eab308]" />
            </div>

            <div className="mt-5 rounded-2xl border border-white/5 bg-[#04080f]/65 p-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/35 font-semibold">
                    Melhor semana
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    {melhorSemana?.semana || '—'}
                  </p>
                </div>
                <p className="text-lg font-bold text-[#eab308]">{formatBRL(melhorSemanaValor)}</p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#8a6d10] via-[#eab308] to-[#f7d66a]"
                  style={{
                    width: faturamentoTotal > 0 ? `${Math.min(100, (melhorSemanaValor / faturamentoTotal) * 100)}%` : '0%',
                  }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-white/45">
                <span className="rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1">
                  Consulta única
                </span>
                <span className="rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1">
                  PDF pronto
                </span>
                <span className="rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1">
                  Atualização dinâmica
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : errorMessage ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 text-center text-red-300">
          <p className="font-semibold">{errorMessage}</p>
        </div>
      ) : (
        <div id="extrato-conteudo" className="relative space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.label}
                  className="group rounded-3xl border border-white/5 bg-white/[0.03] p-6 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-[#c9a227]/20 hover:bg-white/[0.045]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold">
                        {card.label}
                      </span>
                      <p className="mt-3 text-3xl font-black tracking-tight text-white">
                        {card.value}
                      </p>
                      <p className="mt-1 text-xs text-white/40">{card.subtext}</p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-[#c9a227]/10 p-3 text-[#eab308] shadow-inner shadow-black/20 transition group-hover:border-[#c9a227]/30">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
            <article className="rounded-3xl border border-white/5 bg-[#07111d]/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold">
                    FATURAMENTO POR SEMANA
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    Período: {tituloMes} / {anoSelecionado}
                  </h3>
                </div>
                <BarChart3 className="h-5 w-5 text-[#c9a227]" />
              </div>

              <div className="h-[270px]">
                {dadosGrafico.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-white/35">
                    Nenhum orçamento encontrado neste período.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosGrafico} barSize={44} barGap={8}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.04)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="semana"
                        tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.55)' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.55)' }}
                        tickFormatter={(value) => `R$${(Number(value) / 1000).toFixed(0)}k`}
                        width={56}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                        formatter={(value: number) => formatBRL(Number(value))}
                        contentStyle={{
                          background: '#04080f',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 14,
                        }}
                      />
                      <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
                        {dadosGrafico.map((_, index) => (
                          <Cell
                            key={index}
                            fill={index === 0 ? '#f7d66a' : index % 2 === 0 ? '#eab308' : '#8a6d10'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </article>

            <article className="rounded-3xl border border-white/5 bg-[#07111d]/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold">
                    TOP BAIRROS
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">Faturamento concentrado</h3>
                </div>
                <MapPin className="h-5 w-5 text-[#c9a227]" />
              </div>

              {topBairros.length === 0 ? (
                <p className="text-sm text-white/45">
                  Dados de bairro não disponíveis para este período.
                </p>
              ) : (
                <div className="space-y-2">
                  {topBairros.map(([bairro, valor], index) => (
                    <div
                      key={bairro}
                      className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-3 py-3 transition hover:border-white/10 hover:bg-white/[0.04]"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-xs font-bold text-white/40">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-white">{bairro}</span>
                      <span className="text-sm font-semibold text-[#eab308]">{formatBRL(valor)}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <article className="rounded-3xl border border-white/5 bg-[#07111d]/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold">
                    BREAKDOWN POR PELÍCULA
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">Mix de receita</h3>
                </div>
                <BarChart3 className="h-5 w-5 text-[#c9a227]" />
              </div>

              <div className="space-y-2">
                {rankingPeliculas.length === 0 ? (
                  <p className="text-sm text-white/45">Nenhum dado para agrupar por película.</p>
                ) : (
                  rankingPeliculas.map(([nome, dados]) => (
                    <div
                      key={nome}
                      className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-white/5 py-3 transition last:border-b-0 hover:bg-white/[0.02]"
                    >
                      <span className="min-w-0 truncate text-sm text-white">{nome}</span>
                      <span className="text-xs text-white/45">
                        {dados.jobs} job{dados.jobs !== 1 ? 's' : ''}
                      </span>
                      <span className="text-sm font-semibold text-[#eab308]">
                        {formatBRL(dados.valor)}
                      </span>
                      <span className="w-12 text-right text-xs text-white/40">
                        {faturamentoTotal > 0
                          ? `${((dados.valor / faturamentoTotal) * 100).toFixed(0)}%`
                          : '—'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-3xl border border-white/5 bg-[#07111d]/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold">
                    RESUMO DO MÊS
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">Lista de orçamentos</h3>
                </div>
                <CalendarRange className="h-5 w-5 text-[#c9a227]" />
              </div>

              <div className="space-y-3">
                {tabelaResumo.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-white/40">
                    Nenhum orçamento registrado em {tituloMes} {anoSelecionado}.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-3 border-b border-white/5 pb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/35">
                      <span>Cliente</span>
                      <span>Película</span>
                      <span>Valor</span>
                      <span>Data</span>
                    </div>
                    <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                      {tabelaResumo.map((row, index) => (
                        <div
                          key={`${row.cliente}-${row.data}-${index}`}
                          className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-3 py-3 transition hover:border-white/10 hover:bg-white/[0.04]"
                        >
                          <span className="truncate text-sm text-white">{row.cliente}</span>
                          <span className="truncate text-sm text-white/70">{row.pelicula}</span>
                          <span className="text-sm font-semibold text-[#eab308]">{row.valor}</span>
                          <span className="text-sm text-white/55">{row.data}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </article>
          </section>
        </div>
      )}
    </div>
  );
}
