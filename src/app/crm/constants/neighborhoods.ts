export const RJ_NEIGHBORHOODS = [
  'Barra da Tijuca',
  'Recreio dos Bandeirantes',
  'Jacarepagua',
  'Bangu',
  'Realengo',
  'Campo Grande',
  'Outro',
] as const;

export type RjNeighborhood = (typeof RJ_NEIGHBORHOODS)[number];
