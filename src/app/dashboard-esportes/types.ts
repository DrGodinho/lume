export interface SportRawRow {
  esporte: string;
  categoria: string;
  indicador: string;
  tipo: string;
  valor: number;
  unidade: string;
}

export interface SportMetric {
  total: number;
  direta: number;
  indireta: number;
}

export interface SportSummary {
  esporte: string;
  movimentacaoEconomica: SportMetric;
  geracaoRenda: SportMetric;
  postosTrabalho: {
    total: number;
    direto: number;
    indireto: number;
  };
  tributos: number;
  vaPib: number | null;
}

export type SportMetricKey = 'movEco' | 'renda' | 'empregos' | 'tributos' | 'vaPib';

export type SortDirection = 'asc' | 'desc';
