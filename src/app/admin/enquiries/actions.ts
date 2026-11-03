'use server';

import { revalidatePath } from 'next/cache';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import { getCurrentAdmin } from '@/lib/auth/admin';

export interface ActionResponse {
  success: boolean;
  error?: string;
}

/**
 * Updates status of an enquiry (new, contacted, qualified, booked, archived)
 */
export async function updateEnquiryStatusAction(
  id: string,
  status: string
): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized.' };
  }

  if (admin.role === 'viewer') {
    return { success: false, error: 'Read-only access: Viewers cannot update enquiry status.' };
  }

  const validStatuses = ['new', 'contacted', 'qualified', 'booked', 'archived'];
  if (!validStatuses.includes(status)) {
    return { success: false, error: 'Invalid status code.' };
  }

  const db = getAdminDb();
  if (!db || !isDatabaseConfigured()) {
    return { success: false, error: 'Database unavailable.' };
  }

  const { error } = await db
    .from('enquiries')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/enquiries');

  return { success: true };
}

/**
 * Saves private internal notes for a client consultation lead
 */
export async function saveEnquiryNotesAction(
  id: string,
  internalNotes: string
): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized.' };
  }

  if (admin.role === 'viewer') {
    return { success: false, error: 'Read-only access: Viewers cannot edit internal notes.' };
  }

  const db = getAdminDb();
  if (!db || !isDatabaseConfigured()) {
    return { success: false, error: 'Database unavailable.' };
  }

  const { error } = await db
    .from('enquiries')
    .update({
      internal_notes: internalNotes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/enquiries');

  return { success: true };
}

/**
 * Deletes or archives an enquiry lead record
 */
export async function deleteEnquiryAction(id: string): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized.' };
  }

  if (admin.role === 'viewer') {
    return { success: false, error: 'Read-only access: Viewers cannot delete inquiries.' };
  }

  const db = getAdminDb();
  if (!db || !isDatabaseConfigured()) {
    return { success: false, error: 'Database unavailable.' };
  }

  const { error } = await db.from('enquiries').delete().eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  revalidatePath('/admin/enquiries');

  return { success: true };
}
