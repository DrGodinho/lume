import { describe, expect, it } from 'vitest';
import { parseOrcamentoSalvo } from '../useCalculatorHistory';

const valido = {
  id: '1',
  cliente: 'Maria',
  phone: '21999999999',
  neighborhood: 'Barra da Tijuca',
  data: '05/09/2026',
  valor: 1234.56,
  qtd: 2,
  vidros: [
    { id: 'a', h: 100, w: 50, oh: 100, ow: 50, label: 'Sala', cor: '#fff', sortOrder: 0 },
  ],
  config: { rollW: 152, price: 80, margin: 3 },
  desconto: 0,
  modoOtimizacao: 'facilidade_v2',
  selectedFilm: 'carbono_g20',
  leadId: null,
};

describe('parseOrcamentoSalvo', () => {
  it('aceita item válido completo', () => {
    const parsed = parseOrcamentoSalvo(valido);
    expect(parsed?.cliente).toBe('Maria');
    expect(parsed?.neighborhood).toBe('Barra da Tijuca');
  });

  it('aceita item mínimo (opcionais ausentes)', () => {
    const { phone, neighborhood, selectedFilm, leadId, ...minimo } = valido;
    void phone; void neighborhood; void selectedFilm; void leadId;
    expect(parseOrcamentoSalvo(minimo)?.id).toBe('1');
    expect(parseOrcamentoSalvo(minimo)?.neighborhood).toBeUndefined();
  });

  it('rejeita sem id, sem cliente ou sem vidros', () => {
    const { id, ...semId } = valido;
    void id;
    expect(parseOrcamentoSalvo(semId)).toBeNull();
    expect(parseOrcamentoSalvo({ ...valido, cliente: 123 })).toBeNull();
    expect(parseOrcamentoSalvo({ ...valido, vidros: 'x' })).toBeNull();
  });

  it('rejeita vidro sem dimensões e lixo total', () => {
    expect(parseOrcamentoSalvo({ ...valido, vidros: [{ id: 'a' }] })).toBeNull();
    expect(parseOrcamentoSalvo(null)).toBeNull();
    expect(parseOrcamentoSalvo('orcamento')).toBeNull();
    expect(parseOrcamentoSalvo([])).toBeNull();
  });

  it('preserva campos extras (compatibilidade)', () => {
    const parsed = parseOrcamentoSalvo({ ...valido, campoFuturo: 42 });
    expect(parsed).not.toBeNull();
    expect((parsed as unknown as Record<string, unknown>).campoFuturo).toBe(42);
  });
});
