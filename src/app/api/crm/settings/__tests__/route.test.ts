import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PUT } from '../route';

const mockFrom = vi.fn();
const mockCreateClient = vi.fn((..._args: unknown[]) => ({
  from: mockFrom,
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: (...args: [string, string, ...unknown[]]) => mockCreateClient(...args),
}));

vi.mock('@/lib/crm-auth', () => ({
  verifyAccessToken: vi.fn(async (token: string) => (token === 'valid-token' ? { user: 'admin' } : null)),
}));

describe('CRM Settings API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-key';
  });

  const createAuthRequest = (
    url: string,
    init?: ConstructorParameters<typeof NextRequest>[1],
  ) => {
    const request = new NextRequest(url, init);
    request.cookies.set('crm-token', 'valid-token');
    return request;
  };

  it('rejects unauthorized requests with 401', async () => {
    const unauthReq = new NextRequest('http://localhost/api/crm/settings?id=crm_goal_2026-10');
    const res = await GET(unauthReq);
    expect(res.status).toBe(401);
  });

  it('returns existing monthly goal when row exists', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: { meta_valor: 15000 }, error: null }),
        }),
      }),
    });

    const req = createAuthRequest('http://localhost/api/crm/settings?id=crm_goal_2026-10');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ id: 'crm_goal_2026-10', meta_valor: 15000 });
  });

  it('falls back to previous monthly goal when current month does not exist', async () => {
    const maybeSingleMock = vi
      .fn()
      // First call: exact match for crm_goal_2026-11 returns null
      .mockResolvedValueOnce({ data: null, error: null })
      // Second call: previous month (<= crm_goal_2026-11) returns 20000
      .mockResolvedValueOnce({ data: { meta_valor: 20000 }, error: null });

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: maybeSingleMock,
        }),
        like: vi.fn().mockReturnValue({
          lte: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                maybeSingle: maybeSingleMock,
              }),
            }),
          }),
        }),
      }),
    });

    const req = createAuthRequest('http://localhost/api/crm/settings?id=crm_goal_2026-11');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ id: 'crm_goal_2026-11', meta_valor: 20000 });
  });

  it('falls back to default goal when no previous monthly goal exists', async () => {
    const maybeSingleMock = vi
      .fn()
      .mockResolvedValueOnce({ data: null, error: null }) // exact match
      .mockResolvedValueOnce({ data: null, error: null }) // <= match
      .mockResolvedValueOnce({ data: null, error: null }) // any goal match
      .mockResolvedValueOnce({ data: { meta_valor: 12000 }, error: null }); // default match

    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: maybeSingleMock,
        }),
        like: vi.fn().mockReturnValue({
          lte: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                maybeSingle: maybeSingleMock,
              }),
            }),
          }),
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              maybeSingle: maybeSingleMock,
            }),
          }),
        }),
      }),
    });

    const req = createAuthRequest('http://localhost/api/crm/settings?id=crm_goal_2026-12');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ id: 'crm_goal_2026-12', meta_valor: 12000 });
  });

  it('saves monthly goal and syncs default in PUT', async () => {
    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({
      upsert: upsertMock,
    });

    const req = createAuthRequest('http://localhost/api/crm/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'crm_goal_2026-10', meta_valor: 30000 }),
    });

    const res = await PUT(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ id: 'crm_goal_2026-10', meta_valor: 30000 });

    // Verifies it saved the monthly goal AND synced 'default'
    expect(upsertMock).toHaveBeenCalledWith(
      { id: 'crm_goal_2026-10', meta_valor: 30000 },
      { onConflict: 'id' },
    );
    expect(upsertMock).toHaveBeenCalledWith(
      { id: 'default', meta_valor: 30000 },
      { onConflict: 'id' },
    );
  });
});
