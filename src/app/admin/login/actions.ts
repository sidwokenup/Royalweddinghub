'use server';

import { redirect } from 'next/navigation';
import { authenticateAdmin, logoutAdmin } from '@/lib/auth/admin';

export interface LoginActionState {
  error?: string;
  success?: boolean;
}

export async function loginAdminAction(
  prevState: LoginActionState | null,
  formData: FormData
): Promise<LoginActionState> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const from = (formData.get('from') as string)?.trim() || '/admin';

  if (!email || !password) {
    return {
      error: 'Please enter both email address and password.',
    };
  }

  const result = await authenticateAdmin(email, password);

  if (!result.success) {
    return {
      error: result.error || 'Invalid credentials. Access denied.',
    };
  }

  // Redirect to requested page or default admin dashboard
  // Only allow internal paths starting with /admin to prevent open redirect vulnerabilities
  const safeRedirectPath = from.startsWith('/admin') ? from : '/admin';
  redirect(safeRedirectPath);
}

export async function logoutAdminAction(): Promise<void> {
  await logoutAdmin();
  redirect('/admin/login');
}
