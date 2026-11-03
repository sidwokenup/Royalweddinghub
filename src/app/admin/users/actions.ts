'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import { hashPassword } from '@/lib/auth/password';
import { AdminRole } from '@/lib/db/types';

export interface AdminUserView {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  isRootOwner?: boolean;
}

export interface UserActionResponse {
  success: boolean;
  error?: string;
  users?: AdminUserView[];
}

/**
 * Ensures caller is an active Super Admin
 */
async function requireSuperAdmin() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin) {
    throw new Error('Authentication required.');
  }
  if (currentAdmin.role !== 'super_admin') {
    throw new Error('Access denied. Super Administrator privileges required.');
  }
  return currentAdmin;
}

/**
 * Fetches all registered admin team members
 */
export async function getAdminUsersAction(): Promise<UserActionResponse> {
  try {
    await requireSuperAdmin();

    const rootEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@royalweddinghub.com').toLowerCase().trim();
    const usersList: AdminUserView[] = [
      {
        id: 'root-owner-admin',
        email: rootEmail,
        full_name: 'Royal Wedding Hub Owner',
        role: 'super_admin',
        last_login_at: null,
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
        isRootOwner: true,
      },
    ];

    if (isDatabaseConfigured()) {
      const db = getAdminDb();
      if (db) {
        const { data, error } = await db
          .from('admin_users')
          .select('id, email, full_name, role, last_login_at, created_at, updated_at')
          .order('created_at', { ascending: false });

        if (!error && data) {
          for (const u of data) {
            // Skip if database row matches root email to prevent duplicate display
            if (u.email.toLowerCase() === rootEmail) continue;

            let resolvedRole: AdminRole = u.role;
            let cleanName = u.full_name || 'Admin';

            if (u.role === 'viewer' || cleanName.includes('[VIEWER]')) {
              resolvedRole = 'viewer';
              cleanName = cleanName.replace(/\s*\[VIEWER\]\s*/gi, '').trim();
            }

            usersList.push({
              id: u.id,
              email: u.email,
              full_name: cleanName,
              role: resolvedRole,
              last_login_at: u.last_login_at,
              created_at: u.created_at,
              updated_at: u.updated_at,
              isRootOwner: false,
            });
          }
        }
      }
    }

    return { success: true, users: usersList };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch team members.';
    return { success: false, error: message };
  }
}

/**
 * Creates a new team account directly from the Super Admin Panel
 */
export async function createAdminUserAction(data: {
  email: string;
  password: string;
  fullName: string;
  role: AdminRole;
}): Promise<UserActionResponse> {
  try {
    await requireSuperAdmin();

    const email = data.email.toLowerCase().trim();
    const fullName = data.fullName.trim();
    const password = data.password.trim();
    const role = data.role;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'A valid email address is required.' };
    }

    if (!fullName || fullName.length < 2) {
      return { success: false, error: 'Full name must be at least 2 characters.' };
    }

    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }

    const validRoles: AdminRole[] = ['super_admin', 'editor', 'viewer'];
    if (!validRoles.includes(role)) {
      return { success: false, error: 'Invalid role selection.' };
    }

    const rootEmail = (process.env.INITIAL_ADMIN_EMAIL || 'admin@royalweddinghub.com').toLowerCase().trim();
    if (email === rootEmail) {
      return { success: false, error: 'This email is reserved for the primary Root Super Admin.' };
    }

    const db = getAdminDb();
    if (!db || !isDatabaseConfigured()) {
      return { success: false, error: 'Database connection unavailable.' };
    }

    // Check if user already exists
    const { data: existingUser } = await db
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const passwordHash = await hashPassword(password);

    // Attempt direct insert
    if (role === 'viewer') {
      const { error: insertError } = await db.from('admin_users').insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        role: 'viewer',
      });

      // If check constraint rejects 'viewer', gracefully fallback to 'editor' with [VIEWER] tag
      if (insertError) {
        if (insertError.code === '23514') {
          const { error: fallbackError } = await db.from('admin_users').insert({
            email,
            password_hash: passwordHash,
            full_name: `${fullName} [VIEWER]`,
            role: 'editor',
          });

          if (fallbackError) {
            return { success: false, error: fallbackError.message };
          }
        } else {
          return { success: false, error: insertError.message };
        }
      }
    } else {
      const { error: insertError } = await db.from('admin_users').insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        role,
      });

      if (insertError) {
        return { success: false, error: insertError.message };
      }
    }

    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create user account.';
    return { success: false, error: message };
  }
}

/**
 * Updates a team member's role
 */
export async function updateAdminUserRoleAction(
  userId: string,
  newRole: AdminRole
): Promise<UserActionResponse> {
  try {
    const currentAdmin = await requireSuperAdmin();

    if (userId === 'root-owner-admin') {
      return { success: false, error: 'Cannot modify permissions for the primary Root Super Admin.' };
    }

    if (userId === currentAdmin.userId) {
      return { success: false, error: 'Cannot modify your own active administrator role.' };
    }

    const validRoles: AdminRole[] = ['super_admin', 'editor', 'viewer'];
    if (!validRoles.includes(newRole)) {
      return { success: false, error: 'Invalid role selection.' };
    }

    const db = getAdminDb();
    if (!db || !isDatabaseConfigured()) {
      return { success: false, error: 'Database connection unavailable.' };
    }

    // Retrieve existing user record
    const { data: user, error: fetchErr } = await db
      .from('admin_users')
      .select('full_name')
      .eq('id', userId)
      .single();

    if (fetchErr || !user) {
      return { success: false, error: 'Target user not found.' };
    }

    const cleanName = (user.full_name || 'Admin').replace(/\s*\[VIEWER\]\s*/gi, '').trim();

    if (newRole === 'viewer') {
      const { error: updateErr } = await db
        .from('admin_users')
        .update({
          role: 'viewer',
          full_name: cleanName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateErr) {
        if (updateErr.code === '23514') {
          // Fallback if check constraint doesn't accept 'viewer'
          const { error: fallbackErr } = await db
            .from('admin_users')
            .update({
              role: 'editor',
              full_name: `${cleanName} [VIEWER]`,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          if (fallbackErr) return { success: false, error: fallbackErr.message };
        } else {
          return { success: false, error: updateErr.message };
        }
      }
    } else {
      const { error: updateErr } = await db
        .from('admin_users')
        .update({
          role: newRole,
          full_name: cleanName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }
    }

    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update user role.';
    return { success: false, error: message };
  }
}

/**
 * Resets a team member's password
 */
export async function resetAdminUserPasswordAction(
  userId: string,
  newPassword: string
): Promise<UserActionResponse> {
  try {
    await requireSuperAdmin();

    if (userId === 'root-owner-admin') {
      return {
        success: false,
        error: 'The primary Root Super Admin password is configured via system environment variables.',
      };
    }

    const password = newPassword.trim();
    if (!password || password.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters.' };
    }

    const db = getAdminDb();
    if (!db || !isDatabaseConfigured()) {
      return { success: false, error: 'Database connection unavailable.' };
    }

    const passwordHash = await hashPassword(password);

    const { error } = await db
      .from('admin_users')
      .update({
        password_hash: passwordHash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reset password.';
    return { success: false, error: message };
  }
}

/**
 * Deletes a team member account
 */
export async function deleteAdminUserAction(userId: string): Promise<UserActionResponse> {
  try {
    const currentAdmin = await requireSuperAdmin();

    if (userId === 'root-owner-admin') {
      return { success: false, error: 'The primary Root Super Admin account cannot be deleted.' };
    }

    if (userId === currentAdmin.userId) {
      return { success: false, error: 'You cannot delete your own active administrator account.' };
    }

    const db = getAdminDb();
    if (!db || !isDatabaseConfigured()) {
      return { success: false, error: 'Database connection unavailable.' };
    }

    const { error } = await db.from('admin_users').delete().eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/users');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete user account.';
    return { success: false, error: message };
  }
}

