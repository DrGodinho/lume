import { format } from 'date-fns';

export interface LeadExpenses {
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
 * Extrai os custos de ajudante e outras despesas das observações do lead.
 * Suporta a tag padrão `[Despesas: Ajudante R$ 150,00 | Extras R$ 50,00]` e tags legadas.
 */
export const parseLeadExpenses = (notes?: string | null): LeadExpenses => {
  if (!notes || typeof notes !== 'string') {
    return { custoAjudante: 0, outrasDespesas: 0 };
  }

  let custoAjudante = 0;
  let outrasDespesas = 0;

  // 1. Tag padrão composta: [Despesas: Ajudante R$ 150,00 | Extras R$ 50,00]
  const despesasMatch = notes.match(/\[Despesas:([^\]]+)\]/i);
  if (despesasMatch && despesasMatch[1]) {
    const content = despesasMatch[1];
    const ajudanteMatch = content.match(/Ajudante\s*R?\$?\s*([\d.,]+)/i);
    if (ajudanteMatch) {
      custoAjudante = parseBrazilianNumber(ajudanteMatch[1]);
    }
    const extrasMatch = content.match(/Extras\s*R?\$?\s*([\d.,]+)/i);
    if (extrasMatch) {
      outrasDespesas = parseBrazilianNumber(extrasMatch[1]);
    }
    return { custoAjudante, outrasDespesas };
  }

  // 2. Tags individuais avulsas (ex: [Ajudante: R$ 150,00] ou [Extras: R$ 50,00])
  const singleAjudante = notes.match(/\[(?:Custo\s*)?Ajudante:\s*R?\$?\s*([\d.,]+)\]/i);
  if (singleAjudante) {
    custoAjudante = parseBrazilianNumber(singleAjudante[1]);
  }

  const singleExtras = notes.match(/\[Extras:\s*R?\$?\s*([\d.,]+)\]/i);
  if (singleExtras) {
    outrasDespesas = parseBrazilianNumber(singleExtras[1]);
  }

  return { custoAjudante, outrasDespesas };
};

/**
 * Formata a tag padronizada de despesas para gravação em notas.
 */
export const formatExpensesTag = (custoAjudante: number, outrasDespesas: number): string => {
  const parts: string[] = [];
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
  completionNote?: string
): string => {
  let notes = (currentNotes || '')
    .replace(/\[Despesas:[^\]]*\]/gi, '')
    .replace(/\[Ajudante:[^\]]*\]/gi, '')
    .replace(/\[Extras:[^\]]*\]/gi, '')
    .replace(/\[Custo Ajudante:[^\]]*\]/gi, '')
    .trim();

  if (completionNote && completionNote.trim()) {
    const stamp = format(new Date(), 'dd/MM/yyyy');
    const compEntry = `[${stamp} Conclusão] ${completionNote.trim()}`;
    notes = notes ? `${notes}\n${compEntry}` : compEntry;
  }

  const tag = formatExpensesTag(custoAjudante, outrasDespesas);
  if (tag) {
    notes = notes ? `${notes}\n${tag}` : tag;
  }

  return notes;
};
