/**
 * fetch com timeout. Se a resposta nao chegar em `timeoutMs`, a requisicao e
 * abortada (AbortController) e o fetch rejeita com um AbortError com mensagem
 * explicita (evita o criptico "signal is aborted without reason" do Chromium),
 * para a UI nunca ficar travada em "Carregando..." quando o servidor
 * (dev server compilando, queda de rede, rota lenta) nao responde.
 *
 * Chamadores devem tratar timeout via `isAbortError(error)` — timeout sob
 * compilacao do dev server e esperado, nao e bug.
 */
export const DEFAULT_REQUEST_TIMEOUT_MS = 30000;

const buildTimeoutReason = (timeoutMs: number) =>
  new DOMException(
    `Requisicao abortada apos ${Math.round(timeoutMs / 1000)}s sem resposta (timeout). Tente novamente.`,
    'AbortError',
  );

/**
 * Retorna true se o erro foi um abort/timeout do `fetchWithTimeout`.
 * Checa por `name` (sem `instanceof Error`) porque `DOMException` nao
 * herda de `Error` — `instanceof` nunca detectaria o AbortError.
 */
export function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object'
    && error !== null
    && 'name' in error
    && (error as { name?: unknown }).name === 'AbortError'
  );
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(buildTimeoutReason(timeoutMs)), timeoutMs);

  try {
    return await fetch(input, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
