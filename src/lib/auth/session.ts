import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { AdminRole } from '@/lib/db/types';

export const ADMIN_SESSION_COOKIE = 'rwh_admin_session';
const SESSION_EXPIRATION_DAYS = 7;

export interface AdminSessionPayload {
  userId: string;
  email: string;
  fullName: string;
  role: AdminRole;
  [key: string]: unknown;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET || 'rwh-default-super-secure-jwt-signing-secret-key-lucknow-2026';
  return new TextEncoder().encode(secret);
}

/**
 * Creates a signed JWT session token for an authenticated administrator
 */
export async function createAdminToken(payload: AdminSessionPayload): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRATION_DAYS}d`)
    .sign(secret);
}

/**
 * Verifies a JWT session token and returns the payload if valid
 */
export async function verifyAdminToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
      role: (payload.role as AdminRole) || 'editor',
    };
  } catch {
    return null;
  }
}

/**
 * Sets the httpOnly session cookie
 */
export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * SESSION_EXPIRATION_DAYS,
  });
}

/**
 * Reads the current session token from cookies
 */
export async function getAdminSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_SESSION_COOKIE);
  return cookie?.value || null;
}

/**
 * Clears the session cookie on logout
 */
export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
