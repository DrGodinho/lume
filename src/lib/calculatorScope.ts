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

async function readCalculatorScopeKeyOnce() {
  if (!supabase) {
    return { scopeKey: DEFAULT_CALCULATOR_SCOPE, hasSession: false };
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return { scopeKey: DEFAULT_CALCULATOR_SCOPE, hasSession: false };
  }

  let user = data.session?.user ?? null;
  if (!user) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (!userError) {
      user = userData.user ?? null;
    }
  }

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

export async function resolveCalculatorScopeKey() {
  const { scopeKey } = await readCalculatorScopeKeyOnce();
  return scopeKey;
}

export function resetCalculatorScopeCache() {
  return undefined;
}

