import { supabase } from './supabase';

type CloudGlass = object;
type CloudConfig = object;

interface DraftData {
  cliente: string;
  phone: string;
  vidros: CloudGlass[];
  desconto: number;
  desconto_input: string;
  roll_w: number;
  price: number;
  margin: number;
  modo_otimizacao: string;
  user_name: string;
  selected_film: string;
}

export async function saveDraftToCloud(draft: DraftData): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('calculator_draft')
    .upsert({ id: 'default', ...draft, updated_at: new Date().toISOString() });
  if (error) console.error('[Cloud] Draft save failed:', error.message);
  return !error;
}

export async function loadDraftFromCloud(): Promise<DraftData | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('calculator_draft')
    .select('*')
    .eq('id', 'default')
    .single();
  if (error || !data) return null;
  return data as DraftData;
}

interface HistoryItem {
  id: string;
  cliente: string;
  phone?: string;
  data: string;
  valor: number;
  qtd: number;
  vidros: CloudGlass[];
  config: CloudConfig;
  desconto: number;
  modoOtimizacao: string;
  selectedFilm?: string;
}

interface CalculatorHistoryRow {
  id: string;
  cliente: string;
  phone?: string | null;
  data: string;
  valor: number;
  qtd: number;
  vidros: CloudGlass[];
  config: CloudConfig;
  desconto: number;
  modo_otimizacao: string;
  selected_film?: string | null;
}

export async function saveHistoryItemToCloud(item: HistoryItem): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('calculator_history')
    .upsert({
      id: item.id,
      cliente: item.cliente,
      phone: item.phone || null,
      data: item.data,
      valor: item.valor,
      qtd: item.qtd,
      vidros: item.vidros,
      config: item.config,
      desconto: item.desconto,
      modo_otimizacao: item.modoOtimizacao,
      selected_film: item.selectedFilm || null,
    });
  if (error) console.error('[Cloud] History save failed:', error.message);
  return !error;
}

export async function loadHistoryFromCloud(): Promise<HistoryItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('calculator_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error || !data) return [];
  return (data as CalculatorHistoryRow[]).map((row) => ({
    id: row.id,
    cliente: row.cliente,
    phone: row.phone || undefined,
    data: row.data,
    valor: row.valor,
    qtd: row.qtd,
    vidros: row.vidros,
    config: row.config,
    desconto: row.desconto,
    modoOtimizacao: row.modo_otimizacao,
    selectedFilm: row.selected_film || undefined,
  }));
}

export async function deleteHistoryItemFromCloud(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('calculator_history')
    .delete()
    .eq('id', id);
  if (error) console.error('[Cloud] History delete failed:', error.message);
  return !error;
}

interface ConfigData {
  rollW: number;
  price: number;
  margin: number;
  modoOtimizacao: string;
  userName: string;
  modoPerdas: string;
  perdasFixas: number;
  modoCorConfig: string;
  agressividadeCorte: number;
  filmTypes: Record<string, number>;
  selectedFilm: string;
}

const CONFIG_OPTIONAL_COLUMNS = {
  modo_perdas: "ALTER TABLE calculator_config ADD COLUMN modo_perdas text DEFAULT 'dinamico';",
  perdas_fixas: "ALTER TABLE calculator_config ADD COLUMN perdas_fixas numeric DEFAULT 20;",
  modo_cor_config: "ALTER TABLE calculator_config ADD COLUMN modo_cor_config text DEFAULT 'tamanho';",
  agressividade_corte: "ALTER TABLE calculator_config ADD COLUMN agressividade_corte numeric DEFAULT 35;",
  film_types: "ALTER TABLE calculator_config ADD COLUMN film_types jsonb DEFAULT '{\"carbono\":80,\"refletiva\":95,\"dupla_camada\":120,\"nano_ceramica\":220,\"jateado\":90}';",
  selected_film: "ALTER TABLE calculator_config ADD COLUMN selected_film text DEFAULT 'carbono';",
} as const;

export async function saveConfigToCloud(config: ConfigData): Promise<boolean> {
  if (!supabase) return false;

  const row: Record<string, unknown> = {
    id: 'default',
    roll_w: config.rollW,
    price: config.price,
    margin: config.margin,
    modo_otimizacao: config.modoOtimizacao,
    user_name: config.userName,
    modo_perdas: config.modoPerdas,
    perdas_fixas: config.perdasFixas,
    modo_cor_config: config.modoCorConfig,
    agressividade_corte: config.agressividadeCorte,
    film_types: config.filmTypes,
    selected_film: config.selectedFilm,
    updated_at: new Date().toISOString(),
  };

  while (true) {
    const { error } = await supabase
      .from('calculator_config')
      .upsert(row);

    if (!error) return true;

    const missingColumn = (Object.keys(CONFIG_OPTIONAL_COLUMNS) as Array<keyof typeof CONFIG_OPTIONAL_COLUMNS>)
      .find((column) => error.message?.includes(column));

    if (!missingColumn || !(missingColumn in row)) {
      console.error('[Cloud] Config save failed:', error.message);
      return false;
    }

    delete row[missingColumn];
    console.warn(`[Cloud] Column ${missingColumn} missing - run: ${CONFIG_OPTIONAL_COLUMNS[missingColumn]}`);
  }
}

export async function loadConfigFromCloud(): Promise<ConfigData | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('calculator_config')
    .select('*')
    .eq('id', 'default')
    .single();
  if (error || !data) return null;
  return {
    rollW: data.roll_w,
    price: data.price,
    margin: data.margin,
    modoOtimizacao: data.modo_otimizacao,
    userName: data.user_name,
    modoPerdas: data.modo_perdas ?? 'dinamico',
    perdasFixas: data.perdas_fixas ?? 20,
    modoCorConfig: data.modo_cor_config ?? 'tamanho',
    agressividadeCorte: data.agressividade_corte ?? 35,
    filmTypes: data.film_types ?? { carbono: 80, refletiva: 95, dupla_camada: 120, nano_ceramica: 220, jateado: 90 },
    selectedFilm: data.selected_film ?? 'carbono',
  };
}
