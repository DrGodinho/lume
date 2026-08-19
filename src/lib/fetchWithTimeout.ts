/**
 * fetch com timeout. Se a resposta nao chegar em `timeoutMs`, a requisicao e
 * abortada (AbortController) e o fetch rejeita com um AbortError, evitando que a
 * UI fique travada para sempre em estado de "Carregando..." quando o servidor
 * (dev server compilando, queda de rede, rota lenta) nao responde.
 */
export const DEFAULT_REQUEST_TIMEOUT_MS = 30000;

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
