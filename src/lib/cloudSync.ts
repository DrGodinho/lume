import { supabase } from './supabase';

interface DraftData {
  cliente: string;
  vidros: any[];
  desconto: number;
  desconto_input: string;
  roll_w: number;
  price: number;
  margin: number;
  modo_otimizacao: string;
  user_name: string;
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
  data: string;
  valor: number;
  qtd: number;
  vidros: any[];
  config: any;
  desconto: number;
  modoOtimizacao: string;
}

export async function saveHistoryItemToCloud(item: HistoryItem): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('calculator_history')
    .upsert({
      id: item.id,
      cliente: item.cliente,
      data: item.data,
      valor: item.valor,
      qtd: item.qtd,
      vidros: item.vidros,
      config: item.config,
      desconto: item.desconto,
      modo_otimizacao: item.modoOtimizacao,
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
  return data.map((row: any) => ({
    id: row.id,
    cliente: row.cliente,
    data: row.data,
    valor: row.valor,
    qtd: row.qtd,
    vidros: row.vidros,
    config: row.config,
    desconto: row.desconto,
    modoOtimizacao: row.modo_otimizacao,
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
}

const CONFIG_OPTIONAL_COLUMNS = {
  modo_perdas: "ALTER TABLE calculator_config ADD COLUMN modo_perdas text DEFAULT 'dinamico';",
  perdas_fixas: "ALTER TABLE calculator_config ADD COLUMN perdas_fixas numeric DEFAULT 20;",
  modo_cor_config: "ALTER TABLE calculator_config ADD COLUMN modo_cor_config text DEFAULT 'tamanho';",
} as const;

export async function saveConfigToCloud(config: ConfigData): Promise<boolean> {
  if (!supabase) return false;

  const row: Record<string, any> = {
    id: 'default',
    roll_w: config.rollW,
    price: config.price,
    margin: config.margin,
    modo_otimizacao: config.modoOtimizacao,
    user_name: config.userName,
    modo_perdas: config.modoPerdas,
    perdas_fixas: config.perdasFixas,
    modo_cor_config: config.modoCorConfig,
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
  };
}
