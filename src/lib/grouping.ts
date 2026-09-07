/**
 * Agrupamento por ambiente — dono único (era copiado em ResumeList,
 * ColarModal, AdminCalculator e InvoicePDF; divergiam em silêncio).
 */

export interface ResumoItem {
  h: number;
  w: number;
  q: number;
  label: string;
}

export const SEM_AMBIENTE_LABEL = 'Sem Ambiente';

export const roomGroupKey = (label?: string) =>
  label || SEM_AMBIENTE_LABEL;

/**
 * Agrupa itens de resumo por ambiente (`label`), caindo em
 * "Sem Ambiente" quando vazio — mesma regra nos 4 consumidores.
 */
export function groupByAmbiente<T extends { label: string }>(
  items: T[],
): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const key = roomGroupKey(item.label);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}
