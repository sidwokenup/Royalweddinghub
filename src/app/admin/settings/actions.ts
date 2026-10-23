'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentAdmin } from '@/lib/auth/admin';

export interface ActionResponse {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Revalidates all public routes on-demand across edge caches
 */
export async function purgeAllEdgeCachesAction(): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized: Session required.' };
  }

  try {
    revalidatePath('/', 'layout');
    revalidatePath('/venues');
    revalidatePath('/services');
    revalidatePath('/about');
    revalidatePath('/contact');
    return { success: true, message: 'All public edge caches purged and revalidated.' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Cache revalidation failed.';
    return { success: false, error: message };
  }
}
