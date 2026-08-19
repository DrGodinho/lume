import { SignJWT, jwtVerify } from 'jose';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return new TextEncoder().encode(secret);
}

export interface TokenPayload {
  email: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export async function createAccessToken(payload: { email: string }): Promise<string> {
  return new SignJWT({ ...payload, type: 'access' as const })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(getSecret());
}

export async function createRefreshToken(payload: { email: string }): Promise<string> {
  return new SignJWT({ ...payload, type: 'refresh' as const })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(getSecret());
}

export async function createTokenPair(payload: { email: string }): Promise<{ accessToken: string; refreshToken: string }> {
  return {
    accessToken: await createAccessToken(payload),
    refreshToken: await createRefreshToken(payload),
  };
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  const payload = await verifyToken(token);
  if (!payload || payload.type !== 'access') return null;
  return payload;
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  const payload = await verifyToken(token);
  if (!payload || payload.type !== 'refresh') return null;
  return payload;
}
