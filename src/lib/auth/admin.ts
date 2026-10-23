import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import { verifyPassword } from '@/lib/auth/password';
import {
  createAdminToken,
  setAdminSessionCookie,
  getAdminSessionToken,
  verifyAdminToken,
  clearAdminSessionCookie,
  AdminSessionPayload,
} from '@/lib/auth/session';
import { AdminUser } from '@/lib/db/types';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: Omit<AdminUser, 'password_hash'>;
}

/**
 * Authenticates an admin using either the database or secure environment credentials
 */
export async function authenticateAdmin(email: string, password: string): Promise<AuthResult> {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Check Database if configured
  if (isDatabaseConfigured()) {
    const db = getAdminDb();
    if (db) {
      try {
        const { data: user, error } = await db
          .from('admin_users')
          .select('*')
          .eq('email', normalizedEmail)
          .single();

        if (!error && user) {
          const isValid = await verifyPassword(password, user.password_hash);
          if (isValid) {
            // Update last_login_at
            await db
              .from('admin_users')
              .update({ last_login_at: new Date().toISOString() })
              .eq('id', user.id);

            const sessionPayload: AdminSessionPayload = {
              userId: user.id,
              email: user.email,
              fullName: user.full_name,
              role: user.role,
            };

            const token = await createAdminToken(sessionPayload);
            await setAdminSessionCookie(token);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password_hash: _, ...safeUser } = user;
            return { success: true, user: safeUser };
          }
        }
      } catch (err) {
        console.error('[Auth] Database lookup error:', err);
      }
    }
  }

  // 2. Fallback to Local Owner Credentials configured in environment
  const fallbackEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@royalweddinghub.com').toLowerCase().trim();
  const fallbackPassword = process.env.INITIAL_ADMIN_PASSWORD || 'RoyalWedding@Lucknow2026';

  if (normalizedEmail === fallbackEmail && password === fallbackPassword) {
    const sessionPayload: AdminSessionPayload = {
      userId: 'root-owner-admin',
      email: fallbackEmail,
      fullName: 'Royal Wedding Hub Owner',
      role: 'super_admin',
    };

    const token = await createAdminToken(sessionPayload);
    await setAdminSessionCookie(token);

    return {
      success: true,
      user: {
        id: 'root-owner-admin',
        email: fallbackEmail,
        full_name: 'Royal Wedding Hub Owner',
        role: 'super_admin',
        last_login_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  }

  return {
    success: false,
    error: 'Invalid email or password. Please verify your credentials.',
  };
}

/**
 * Returns the currently authenticated administrator, or null if not logged in
 */
export async function getCurrentAdmin(): Promise<AdminSessionPayload | null> {
  const token = await getAdminSessionToken();
  if (!token) {
    return null;
  }

  return verifyAdminToken(token);
}

/**
 * Logs out the administrator by invalidating session cookies
 */
export async function logoutAdmin(): Promise<void> {
  await clearAdminSessionCookie();
}
