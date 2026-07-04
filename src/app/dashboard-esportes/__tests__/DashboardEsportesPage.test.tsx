import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DashboardEsportesPage from '../page';
import { sportsData } from '../data';
import type { SportMetricKey, SportSummary } from '../types';

interface ChartMockProps {
  data: SportSummary[];
  selectedMetric: SportMetricKey;
  selectedSport: string | null;
  onSelectSport: (sport: string) => void;
}

vi.mock('../components/OverviewChart', () => ({
  OverviewChart: ({ selectedMetric, selectedSport, onSelectSport }: ChartMockProps) => (
    <button
      type="button"
      data-testid="overview-chart"
      data-selected-metric={selectedMetric}
      data-selected-sport={selectedSport ?? ''}
      onClick={() => onSelectSport('Ciclismo')}
    >
      Overview mock
    </button>
  ),
}));

const flushUrlRestore = async () => {
  await new Promise((resolve) => window.setTimeout(resolve, 0));
};

const getMetricValue = (sport: SportSummary, metric: 'movEco' | 'empregos') => {
  if (metric === 'empregos') return sport.postosTrabalho.total;
  return sport.movimentacaoEconomica.total;
};

describe('DashboardEsportesPage', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/dashboard-esportes');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('restaura metrica, selecao, comparacao e ordenacao a partir da URL', async () => {
    window.history.replaceState(
      {},
      '',
      '/dashboard-esportes?metric=tributos&mode=share&sport=Atletismo&compare=Ciclismo&sort=empregos&dir=asc',
    );

    render(<DashboardEsportesPage />);
    await flushUrlRestore();

    await screen.findByText('Ordenado por: Empregos (asc)');

    const overviewChart = screen.getByTestId('overview-chart');
    expect(overviewChart.getAttribute('data-selected-sport')).toBe('Atletismo');
    expect(overviewChart.getAttribute('data-selected-metric')).toBe('tributos');
    expect(new URLSearchParams(window.location.search).get('mode')).toBeNull();
    expect(screen.getAllByText(/#\d+ em Tributos/).length).toBeGreaterThan(0);
  });

  it('usa a metrica clicada como visualizacao e ordenacao principal', async () => {
    render(<DashboardEsportesPage />);
    await flushUrlRestore();

    fireEvent.click(screen.getByRole('button', { name: /^Renda$/i }));

    const overviewChart = screen.getByTestId('overview-chart');
    expect(overviewChart.getAttribute('data-selected-metric')).toBe('renda');
    await screen.findByText('Ordenado por: Renda (desc)');
    expect(new URLSearchParams(window.location.search).get('metric')).toBe('renda');
  });

  it('sincroniza ordenacao da tabela na URL e muda a primeira linha renderizada', async () => {
    render(<DashboardEsportesPage />);
    await flushUrlRestore();

    const table = screen.getByRole('table');
    const empregosSortButton = within(table).getByRole('button', { name: /Ordenar por Empregos/i });

    fireEvent.click(empregosSortButton);
    await screen.findByText('Ordenado por: Empregos (desc)');
    expect(new URLSearchParams(window.location.search).get('sort')).toBe('empregos');
    expect(new URLSearchParams(window.location.search).get('dir')).toBeNull();

    fireEvent.click(empregosSortButton);
    await screen.findByText('Ordenado por: Empregos (asc)');

    const expectedFirstSport = [...sportsData].sort((left, right) => {
      const delta = getMetricValue(left, 'empregos') - getMetricValue(right, 'empregos');
      return delta || left.esporte.localeCompare(right.esporte);
    })[0].esporte;
    const firstDataRow = within(table).getAllByRole('row')[1];

    expect(new URLSearchParams(window.location.search).get('sort')).toBe('empregos');
    expect(new URLSearchParams(window.location.search).get('dir')).toBe('asc');
    expect(firstDataRow.textContent).toContain(expectedFirstSport);
  });

  it('permite selecionar modalidade pela tabela usando Enter', async () => {
    render(<DashboardEsportesPage />);
    await flushUrlRestore();

    await screen.findByText('Ordenado por: Mov. economica (desc)');

    const table = screen.getByRole('table');
    const firstDataRow = within(table).getAllByRole('row')[1];
    const expectedSport = [...sportsData].sort((left, right) => {
      const delta = getMetricValue(right, 'movEco') - getMetricValue(left, 'movEco');
      return delta || left.esporte.localeCompare(right.esporte);
    })[0].esporte;

    fireEvent.keyDown(firstDataRow, { key: 'Enter' });

    await waitFor(() => {
      expect(new URLSearchParams(window.location.search).get('sport')).toBe(expectedSport);
    });
  });
});
