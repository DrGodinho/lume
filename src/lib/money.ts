/** Formatação canônica de moeda (com símbolo, ex.: "R$ 1.234,56"). */
export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Número com 2 casas decimais, sem símbolo (ex.: "1.234,56"). */
export function formatNumber2(value: number): string {
  if (!Number.isFinite(value)) return '0,00';
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
