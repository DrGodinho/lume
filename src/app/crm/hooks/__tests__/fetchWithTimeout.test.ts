import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWithTimeout, isAbortError } from '@/lib/fetchWithTimeout';

// Cobre o helper compartilhado (usado pelos hooks do CRM): garante que o
// timeout rejeita com AbortError de mensagem explicita — nunca o criptico
// "signal is aborted without reason" do Chromium.
describe('fetchWithTimeout', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('rejeita com AbortError com mensagem explicita ao estourar o timeout', async () => {
    vi.useFakeTimers();
    // Mock que imita o fetch real: rejeita com signal.reason ao abortar.
    vi.stubGlobal(
      'fetch',
      vi.fn((_input: unknown, init?: RequestInit) => new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener('abort', () => reject(init.signal?.reason), { once: true });
      })),
    );

    const pending = fetchWithTimeout('/api/crm/leads', {}, 2000);
    const assertion = expect(pending).rejects.toMatchObject({
      name: 'AbortError',
      message: expect.stringContaining('apos 2s'),
    });
    await vi.advanceTimersByTimeAsync(2000);
    await assertion;
  });

  it('retorna a resposta quando chega antes do timeout', async () => {
    vi.useFakeTimers();
    const response = new Response('{}', { status: 200 });
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(response)));

    const pending = fetchWithTimeout('/api/crm/leads', {}, 5000);
    await vi.advanceTimersByTimeAsync(0);
    await expect(pending).resolves.toBe(response);
  });

  it('isAbortError distingue timeout de erro real', () => {
    expect(isAbortError(new DOMException('x', 'AbortError'))).toBe(true);
    expect(isAbortError(new Error('falhou'))).toBe(false);
    expect(isAbortError(null)).toBe(false);
  });
});
