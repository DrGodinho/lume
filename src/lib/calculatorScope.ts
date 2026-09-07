import { supabase } from './supabase';

export const DEFAULT_CALCULATOR_SCOPE = 'default';

export function normalizeCalculatorScopeKey(value: string | null | undefined) {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || DEFAULT_CALCULATOR_SCOPE;
}

export function buildCalculatorStorageKey(baseKey: string, scopeKey: string) {
  return `${baseKey}__${normalizeCalculatorScopeKey(scopeKey)}`;
}

// C3: cache do scope — antes cada save/restore fazia getSession + getUser
// (2 idas à rede por chamada). Agora resolve 1x e reutiliza; o reset é
// chamado no logout para a próxima conta resolver do zero.
let cachedScopeKey: string | null = null;
let inFlightScopeKey: Promise<string> | null = null;

function scopeKeyFromUser(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
} | null): { scopeKey: string; hasSession: boolean } {
  if (!user) {
    return { scopeKey: DEFAULT_CALCULATOR_SCOPE, hasSession: false };
  }

  const metadataUsername = typeof user.user_metadata?.username === 'string'
    ? normalizeCalculatorScopeKey(user.user_metadata.username)
    : typeof user.app_metadata?.username === 'string'
      ? normalizeCalculatorScopeKey(user.app_metadata.username)
      : DEFAULT_CALCULATOR_SCOPE;

  if (metadataUsername !== DEFAULT_CALCULATOR_SCOPE) {
    return { scopeKey: metadataUsername, hasSession: true };
  }

  const email = typeof user.email === 'string' ? user.email.trim().toLowerCase() : '';
  if (email.includes('@')) {
    return { scopeKey: normalizeCalculatorScopeKey(email.split('@')[0]), hasSession: true };
  }

  return { scopeKey: DEFAULT_CALCULATOR_SCOPE, hasSession: true };
}

async function readCalculatorScopeKeyOnce() {
  if (!supabase) {
    return { scopeKey: DEFAULT_CALCULATOR_SCOPE, hasSession: false };
  }

  // C3: getUser único (validado no servidor) — o getSession local + o
  // fallback getUser duplicavam a ida à rede por save/restore.
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { scopeKey: DEFAULT_CALCULATOR_SCOPE, hasSession: false };
  }

  return scopeKeyFromUser(data.user);
}

export async function resolveCalculatorScopeKey() {
  if (cachedScopeKey) return cachedScopeKey;
  if (!inFlightScopeKey) {
    inFlightScopeKey = readCalculatorScopeKeyOnce().then(({ scopeKey }) => {
      cachedScopeKey = scopeKey;
      inFlightScopeKey = null;
      return scopeKey;
    }).catch(() => {
      inFlightScopeKey = null;
      return DEFAULT_CALCULATOR_SCOPE;
    });
  }
  return inFlightScopeKey;
}

export function resetCalculatorScopeCache() {
  cachedScopeKey = null;
  inFlightScopeKey = null;
}
