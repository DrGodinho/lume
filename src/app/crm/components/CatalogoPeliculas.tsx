'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Layers,
  Plus,
  Save,
  RefreshCw,
  RotateCcw,
  Trash2,
  Check,
  Search,
  DollarSign,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Package,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import {
  DEFAULT_FILM_CATALOG,
  FilmCatalogItem,
  FilmPurchaseType,
  normalizeFilmCatalog,
} from '../../../lib/films';
import { loadConfigFromCloud, saveConfigToCloud, ConfigData } from '../../../lib/cloudSync';
import { formatBRL } from '../../../lib/money';

export function CatalogoPeliculas() {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [catalog, setCatalog] = useState<Record<string, FilmCatalogItem>>(DEFAULT_FILM_CATALOG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Modal / Form para nova película
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFilmName, setNewFilmName] = useState('');
  const [newFilmPriceSale, setNewFilmPriceSale] = useState('');
  const [newFilmPriceCost, setNewFilmPriceCost] = useState('');
  const [newFilmPurchaseType, setNewFilmPurchaseType] = useState<FilmPurchaseType>('metro');
  const [addError, setAddError] = useState<string | null>(null);

  const carregarConfig = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await loadConfigFromCloud();
      if (data) {
        setConfig(data);
        setCatalog(normalizeFilmCatalog(data.filmCatalog, data.filmTypes));
      } else {
        setCatalog(DEFAULT_FILM_CATALOG);
      }
    } catch {
      setErrorMessage('Não foi possível carregar a tabela do servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarConfig();
  }, [carregarConfig]);

  // Atualiza um campo de um item
  const handleUpdateItem = (id: string, field: keyof FilmCatalogItem, value: unknown) => {
    setCatalog((prev) => {
      const item = prev[id];
      if (!item) return prev;
      return {
        ...prev,
        [id]: {
          ...item,
          [field]: value,
        },
      };
    });
  };

  // Restaurar padrões
  const handleRestaurarPadroes = () => {
    if (confirm('Deseja realmente restaurar os preços e películas para os padrões de fábrica?')) {
      setCatalog(DEFAULT_FILM_CATALOG);
    }
  };

  // Salvar no Supabase
  const handleSalvar = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      // Monta novo filmTypes a partir do catalogo
      const updatedFilmTypes: Record<string, number> = { ...(config?.filmTypes ?? {}) };
      Object.entries(catalog).forEach(([key, item]) => {
        updatedFilmTypes[key] = item.priceSale;
      });

      const updatedConfig: ConfigData = {
        rollW: config?.rollW ?? 1.52,
        price: config?.price ?? 90,
        margin: config?.margin ?? 0,
        modoOtimizacao: config?.modoOtimizacao ?? 'horizontal',
        userName: config?.userName ?? '',
        modoPerdas: config?.modoPerdas ?? 'dinamico',
        perdasFixas: config?.perdasFixas ?? 20,
        modoCorConfig: config?.modoCorConfig ?? 'tamanho',
        agressividadeCorte: config?.agressividadeCorte ?? 35,
        selectedFilm: config?.selectedFilm ?? 'carbono_g20',
        draftExpiration: config?.draftExpiration,
        filmTypes: updatedFilmTypes,
        filmCatalog: catalog,
      };

      const ok = await saveConfigToCloud(updatedConfig);
      if (ok) {
        setConfig(updatedConfig);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage('Erro ao salvar tabela de películas no Supabase.');
      }
    } catch {
      setErrorMessage('Erro de conexão ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  // Criar nova película
  const handleCriarPelícula = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    const name = newFilmName.trim();
    if (!name) {
      setAddError('Informe o nome da película.');
      return;
    }

    const sale = parseFloat(newFilmPriceSale.replace(',', '.'));
    if (!Number.isFinite(sale) || sale <= 0) {
      setAddError('Informe um preço de venda válido maior que zero.');
      return;
    }

    const cost = parseFloat(newFilmPriceCost.replace(',', '.'));
    if (!Number.isFinite(cost) || cost < 0) {
      setAddError('Informe um custo de aquisição válido.');
      return;
    }

    // Gera ID único a partir do nome
    const cleanId = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    const id = cleanId.length > 0 ? cleanId : `film_${Date.now()}`;

    if (catalog[id]) {
      setAddError('Já existe uma película com essa identificação.');
      return;
    }

    const newItem: FilmCatalogItem = {
      id,
      name,
      priceSale: sale,
      priceCost: cost,
      purchaseType: newFilmPurchaseType,
      active: true,
    };

    setCatalog((prev) => ({
      ...prev,
      [id]: newItem,
    }));

    // Limpa form
    setNewFilmName('');
    setNewFilmPriceSale('');
    setNewFilmPriceCost('');
    setNewFilmPurchaseType('metro');
    setShowAddModal(false);
  };

  // Remover película
  const handleRemover = (id: string) => {
    if (confirm(`Deseja excluir a película "${catalog[id]?.name}"?`)) {
      setCatalog((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  // Lista ordenada e filtrada
  const catalogList = useMemo(() => {
    const list = Object.values(catalog);
    if (!searchFilter.trim()) return list;
    const term = searchFilter.toLowerCase();
    return list.filter((item) => item.name.toLowerCase().includes(term) || item.id.toLowerCase().includes(term));
  }, [catalog, searchFilter]);

  // Estatísticas do Catálogo
  const stats = useMemo(() => {
    const list = Object.values(catalog);
    const total = list.length;
    const ativas = list.filter((f) => f.active !== false).length;
    const porMetro = list.filter((f) => f.purchaseType === 'metro').length;
    const porBloco = list.filter((f) => f.purchaseType === 'bloco_7_5m').length;

    let somaMargem = 0;
    let countMargem = 0;

    list.forEach((item) => {
      if (item.priceSale > 0) {
        const areaPorUnidade = item.purchaseType === 'bloco_7_5m' ? 7.5 * 1.52 : 1.52;
        const custoM2 = item.priceCost / areaPorUnidade;
        const margem = ((item.priceSale - custoM2) / item.priceSale) * 100;
        somaMargem += margem;
        countMargem += 1;
      }
    });

    const margemMedia = countMargem > 0 ? Math.round(somaMargem / countMargem) : 0;

    return { total, ativas, porMetro, porBloco, margemMedia };
  }, [catalog]);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(180deg,#0a1320_0%,#050a11_100%)] p-5 shadow-2xl shadow-black/25 sm:p-7 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/20 bg-[#c9a227]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#f5d77a]">
            <Layers className="h-3.5 w-3.5" />
            Precificação & Estoque
          </span>
          <h3 className="mt-3 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
            Tabela de Películas & Lucro
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/60">
            Gerencie o custo de compra e o preço de venda de cada linha. Películas compradas por metro (ex: Nano Cerâmica) são calculadas metro a metro; películas em blocos de 7,5m (ex: Nano Carbono) calculam o custo em quartos de rolo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void carregarConfig()}
            disabled={loading || saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-black uppercase tracking-[0.16em] text-white/70 transition hover:border-[#c9a227]/30 hover:bg-[#c9a227]/10 hover:text-[#f5d77a] active:scale-[0.98] disabled:opacity-50"
            title="Recarregar dados da nuvem"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Recarregar
          </button>

          <button
            type="button"
            onClick={handleRestaurarPadroes}
            disabled={loading || saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-black uppercase tracking-[0.16em] text-white/70 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300 active:scale-[0.98] disabled:opacity-50"
            title="Restaurar valores padrão"
          >
            <RotateCcw className="h-4 w-4" />
            Padrão
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-[#f5d77a] transition hover:bg-[#c9a227]/20 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Nova Película
          </button>

          <button
            type="button"
            onClick={() => void handleSalvar()}
            disabled={loading || saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c9a227] to-[#e6c043] px-5 text-xs font-black uppercase tracking-[0.16em] text-black shadow-lg shadow-[#c9a227]/20 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            <Save className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      {/* FEEDBACK STATUS */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>Tabela salva com sucesso! Os novos custos e preços já estão disponíveis na calculadora.</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between text-white/50 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Películas</span>
            <Package className="h-4 w-4 text-[#c9a227]" />
          </div>
          <p className="text-2xl font-black text-white">{stats.total}</p>
          <p className="text-[11px] text-emerald-400 mt-1">{stats.ativas} ativas no catálogo</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between text-white/50 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Margem Média</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{stats.margemMedia}%</p>
          <p className="text-[11px] text-white/40 mt-1">Margem bruta média estimada</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between text-white/50 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Compra ao Metro</span>
            <span className="text-xs font-bold text-[#f5d77a]">m²</span>
          </div>
          <p className="text-2xl font-black text-white">{stats.porMetro}</p>
          <p className="text-[11px] text-white/40 mt-1">Nano Cerâmica / Especiais</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between text-white/50 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Bloco 7,5m</span>
            <span className="text-xs font-bold text-sky-400">1/4 rolo</span>
          </div>
          <p className="text-2xl font-black text-white">{stats.porBloco}</p>
          <p className="text-[11px] text-white/40 mt-1">Nano Carbono / Refletiva</p>
        </div>
      </div>

      {/* DICA DE USO & MODO DISCRETO */}
      <div className="rounded-2xl border border-[#c9a227]/20 bg-[#c9a227]/[0.04] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-white/70">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#c9a227]/10 text-[#f5d77a] shrink-0 mt-0.5 md:mt-0">
            <Info className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-white">Como funciona o Modo Discreto na Calculadora:</span>
            <p className="text-white/60 mt-0.5">
              Ao orçar na frente do cliente, os custos e o lucro ficam ocultos. Basta <strong>pressionar e segurar</strong> (ou dar um clique longo) sobre o card <span className="text-[#f5d77a] font-semibold">Total Cliente</span> para abrir a lâmina confidencial de margem, custo de ajudante e opção de sobra.
            </p>
          </div>
        </div>
      </div>

      {/* BARRA DE PESQUISA & FILTROS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Buscar por nome da película..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 outline-none transition focus:border-[#c9a227]/50 focus:bg-white/[0.08]"
          />
        </div>
        <span className="text-xs text-white/40">
          Exibindo {catalogList.length} de {Object.keys(catalog).length} películas
        </span>
      </div>

      {/* TABELA DE PELÍCULAS */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.14em] text-white/50">
              <th className="py-3 px-4">Nome da Película</th>
              <th className="py-3 px-4">Venda (R$/m²)</th>
              <th className="py-3 px-4">Custo Aquisição (R$)</th>
              <th className="py-3 px-4">Modalidade de Compra</th>
              <th className="py-3 px-4">Margem Est.</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-xs">
            {catalogList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-white/40">
                  Nenhuma película encontrada com os filtros atuais.
                </td>
              </tr>
            ) : (
              catalogList.map((item) => {
                const areaPorUnidade = item.purchaseType === 'bloco_7_5m' ? 7.5 * 1.52 : 1.52;
                const custoM2 = item.priceCost / areaPorUnidade;
                const faturamentoUnidade = item.priceSale * areaPorUnidade;
                const lucroUnidade = faturamentoUnidade - item.priceCost;
                const margem =
                  item.priceSale > 0
                    ? Math.round(((item.priceSale - custoM2) / item.priceSale) * 100)
                    : 0;
                const markup =
                  item.priceCost > 0
                    ? Math.round((lucroUnidade / item.priceCost) * 100)
                    : 0;

                const margemTone =
                  margem >= 60
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : margem >= 40
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                return (
                  <tr
                    key={item.id}
                    className={`transition hover:bg-white/[0.02] ${
                      item.active === false ? 'opacity-50 bg-black/40' : ''
                    }`}
                  >
                    {/* NOME */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{item.name}</div>
                      <span className="text-[10px] font-mono text-white/40">{item.id}</span>
                    </td>

                    {/* PREÇO DE VENDA */}
                    <td className="py-3.5 px-4">
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 text-[11px]">
                          R$
                        </span>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          value={item.priceSale}
                          onChange={(e) =>
                            handleUpdateItem(item.id, 'priceSale', Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className="w-full rounded-lg border border-white/10 bg-white/[0.04] pl-7 pr-2 py-1.5 text-xs font-bold text-white outline-none focus:border-[#c9a227]/50 focus:bg-white/[0.08]"
                        />
                      </div>
                    </td>

                    {/* PREÇO DE CUSTO */}
                    <td className="py-3.5 px-4">
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 text-[11px]">
                          R$
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.priceCost}
                          onChange={(e) =>
                            handleUpdateItem(item.id, 'priceCost', Math.max(0, parseFloat(e.target.value) || 0))
                          }
                          className="w-full rounded-lg border border-white/10 bg-white/[0.04] pl-7 pr-2 py-1.5 text-xs font-bold text-[#f5d77a] outline-none focus:border-[#c9a227]/50 focus:bg-white/[0.08]"
                        />
                      </div>
                      <span className="text-[10px] text-white/40 block mt-0.5 whitespace-nowrap">
                        {item.purchaseType === 'bloco_7_5m'
                          ? `≈ ${formatBRL(custoM2)}/m² (${formatBRL(item.priceCost / 7.5)}/m)`
                          : `≈ ${formatBRL(custoM2)}/m² real`}
                      </span>
                    </td>

                    {/* MODALIDADE */}
                    <td className="py-3.5 px-4">
                      <select
                        value={item.purchaseType}
                        onChange={(e) =>
                          handleUpdateItem(
                            item.id,
                            'purchaseType',
                            e.target.value as FilmPurchaseType
                          )
                        }
                        className="rounded-lg border border-white/10 bg-[#070e17] px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#c9a227]/50"
                      >
                        <option value="metro">Por Metro linear</option>
                        <option value="bloco_7_5m">Bloco 7,5m (1/4 Rolo)</option>
                      </select>
                    </td>

                    {/* MARGEM ESTIMADA */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold ${margemTone}`}
                          title={`Margem líquida sobre a venda: ${margem}%`}
                        >
                          {margem}%
                        </span>
                        <span
                          className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded"
                          title="Markup: retorno percentual sobre o custo investido"
                        >
                          +{markup}%
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-300/80 font-medium block mt-1 whitespace-nowrap">
                        {item.purchaseType === 'bloco_7_5m'
                          ? `+${formatBRL(lucroUnidade)} / bloco`
                          : `+${formatBRL(lucroUnidade)} / m`}
                      </span>
                    </td>

                    {/* STATUS ATIVO */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleUpdateItem(item.id, 'active', item.active === false)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition ${
                          item.active !== false
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {item.active !== false ? 'Ativa' : 'Inativa'}
                      </button>
                    </td>

                    {/* AÇÕES */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemover(item.id)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Remover película"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL ADICIONAR PELÍCULA */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0a1320] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#c9a227]" />
                Nova Película
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {addError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-300">
                {addError}
              </div>
            )}

            <form onSubmit={handleCriarPelícula} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Nome da Película
                </label>
                <input
                  type="text"
                  placeholder="Ex: Window Blue 35%, Nano Carbon 50%"
                  value={newFilmName}
                  onChange={(e) => setNewFilmName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-[#c9a227]/50"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Preço de Venda (R$/m²)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 220"
                    value={newFilmPriceSale}
                    onChange={(e) => setNewFilmPriceSale(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none focus:border-[#c9a227]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Custo Aquisição (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 90"
                    value={newFilmPriceCost}
                    onChange={(e) => setNewFilmPriceCost(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-[#f5d77a] outline-none focus:border-[#c9a227]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Modalidade de Compra
                </label>
                <select
                  value={newFilmPurchaseType}
                  onChange={(e) => setNewFilmPurchaseType(e.target.value as FilmPurchaseType)}
                  className="w-full rounded-xl border border-white/10 bg-[#070e17] px-3 py-2 text-xs text-white outline-none focus:border-[#c9a227]/50"
                >
                  <option value="metro">Por Metro (m²) - ex: Nano Cerâmica, Window Blue</option>
                  <option value="bloco_7_5m">Bloco 7,5m (1/4 Rolo) - ex: Nano Carbon, Refletiva</option>
                </select>
                <p className="text-[11px] text-white/40 mt-1">
                  Se for Bloco 7,5m, o custo informado deve ser o valor pago pelo quarto de rolo.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white/60 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#c9a227] to-[#e6c043] px-5 py-2 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-[#c9a227]/20 hover:brightness-110"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
