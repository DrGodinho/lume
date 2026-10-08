import { format } from 'date-fns';

export interface LeadExpenses {
  custoMaterial?: number;
  custoAjudante: number;
  outrasDespesas: number;
}

/**
 * Converte com segurança strings numéricas brasileiras ("150,00", "1.500,50", "150.00") em número.
 */
export const parseBrazilianNumber = (val: string | number | undefined | null): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : Math.max(0, val);
  if (!val || typeof val !== 'string') return 0;

  const clean = val.trim().replace(/[^\d.,]/g, '');
  if (!clean) return 0;

  if (clean.includes(',') && clean.includes('.')) {
    return Math.max(0, parseFloat(clean.replace(/\./g, '').replace(',', '.')) || 0);
  }
  if (clean.includes(',')) {
    return Math.max(0, parseFloat(clean.replace(',', '.')) || 0);
  }
  return Math.max(0, parseFloat(clean) || 0);
};

/**
 * Extrai os custos de material, ajudante e outras despesas das observações do lead.
 * Suporta a tag padrão `[Despesas: Material R$ 93,75 | Ajudante R$ 150,00 | Extras R$ 50,00]` e tags legadas.
 */
export const parseLeadExpenses = (notes?: string | null): LeadExpenses => {
  if (!notes || typeof notes !== 'string') {
    return { custoAjudante: 0, outrasDespesas: 0 };
  }

  let custoMaterial: number | undefined = undefined;
  let custoAjudante = 0;
  let outrasDespesas = 0;

  // 1. Tag padrão composta: [Despesas: Material R$ 93,75 | Ajudante R$ 150,00 | Extras R$ 50,00]
  const despesasMatch = notes.match(/\[Despesas:([^\]]+)\]/i);
  if (despesasMatch && despesasMatch[1]) {
    const content = despesasMatch[1];
    const materialMatch = content.match(/Material\s*R?\$?\s*([\d.,]+)/i);
    if (materialMatch) {
      custoMaterial = parseBrazilianNumber(materialMatch[1]);
    }
    const ajudanteMatch = content.match(/Ajudante\s*R?\$?\s*([\d.,]+)/i);
    if (ajudanteMatch) {
      custoAjudante = parseBrazilianNumber(ajudanteMatch[1]);
    }
    const extrasMatch = content.match(/Extras\s*R?\$?\s*([\d.,]+)/i);
    if (extrasMatch) {
      outrasDespesas = parseBrazilianNumber(extrasMatch[1]);
    }
    const res: LeadExpenses = { custoAjudante, outrasDespesas };
    if (custoMaterial !== undefined) res.custoMaterial = custoMaterial;
    return res;
  }

  // 2. Tags individuais avulsas
  const singleMaterial = notes.match(/\[(?:Custo\s*)?Material:\s*R?\$?\s*([\d.,]+)\]/i);
  if (singleMaterial) {
    custoMaterial = parseBrazilianNumber(singleMaterial[1]);
  }

  const singleAjudante = notes.match(/\[(?:Custo\s*)?Ajudante:\s*R?\$?\s*([\d.,]+)\]/i);
  if (singleAjudante) {
    custoAjudante = parseBrazilianNumber(singleAjudante[1]);
  }

  const singleExtras = notes.match(/\[Extras:\s*R?\$?\s*([\d.,]+)\]/i);
  if (singleExtras) {
    outrasDespesas = parseBrazilianNumber(singleExtras[1]);
  }

  const res: LeadExpenses = { custoAjudante, outrasDespesas };
  if (custoMaterial !== undefined) res.custoMaterial = custoMaterial;
  return res;
};

/**
 * Formata a tag padronizada de despesas para gravação em notas.
 */
export const formatExpensesTag = (
  custoAjudante: number = 0,
  outrasDespesas: number = 0,
  custoMaterial?: number
): string => {
  const parts: string[] = [];
  if (custoMaterial !== undefined) {
    const mat = Math.max(0, Number(custoMaterial) || 0);
    parts.push(`Material R$ ${mat.toFixed(2).replace('.', ',')}`);
  }
  const ajudante = Math.max(0, Number(custoAjudante) || 0);
  const extras = Math.max(0, Number(outrasDespesas) || 0);

  if (ajudante > 0) {
    parts.push(`Ajudante R$ ${ajudante.toFixed(2).replace('.', ',')}`);
  }
  if (extras > 0) {
    parts.push(`Extras R$ ${extras.toFixed(2).replace('.', ',')}`);
  }

  if (parts.length === 0) return '';
  return `[Despesas: ${parts.join(' | ')}]`;
};

/**
 * Mescla e atualiza as despesas e a nota de conclusão dentro da string `notes` do lead,
 * substituindo tags antigas para evitar duplicação.
 */
export const mergeExpensesIntoNotes = (
  currentNotes: string = '',
  custoAjudante: number = 0,
  outrasDespesas: number = 0,
  completionNote?: string,
  custoMaterial?: number,
): string => {
  let notes = (currentNotes || '')
    .replace(/\[Despesas:[^\]]*\]/gi, '')
    .replace(/\[(?:Custo\s*)?Material:[^\]]*\]/gi, '')
    .replace(/\[(?:Custo\s*)?Ajudante:[^\]]*\]/gi, '')
    .replace(/\[Extras:[^\]]*\]/gi, '')
    .trim();

  if (completionNote && completionNote.trim()) {
    const stamp = format(new Date(), 'dd/MM/yyyy');
    const compEntry = `[${stamp} Conclusão] ${completionNote.trim()}`;
    notes = notes ? `${notes}\n${compEntry}` : compEntry;
  }

  const tag = formatExpensesTag(custoAjudante, outrasDespesas, custoMaterial);
  if (tag) {
    notes = notes ? `${notes}\n${tag}` : tag;
  }

  return notes;
};
