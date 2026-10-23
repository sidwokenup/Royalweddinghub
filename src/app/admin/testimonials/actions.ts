'use server';

import { revalidatePath } from 'next/cache';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import { getCurrentAdmin } from '@/lib/auth/admin';

export interface ActionResponse {
  success: boolean;
  error?: string;
  id?: string;
}

/**
 * Saves or updates a client testimonial with mandatory consent verification
 */
export async function saveTestimonialAction(formData: FormData): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized.' };
  }

  const db = getAdminDb();
  if (!db || !isDatabaseConfigured()) {
    return { success: false, error: 'Database unavailable.' };
  }

  const id = formData.get('id') as string | null;
  const coupleNames = (formData.get('couple_names') as string)?.trim();
  const celebrationType = (formData.get('celebration_type') as string)?.trim() || 'Royal Wedding';
  const location = (formData.get('location') as string)?.trim() || 'Lucknow';
  const weddingSeason = (formData.get('wedding_season') as string)?.trim() || 'Winter';
  const quote = (formData.get('quote') as string)?.trim();
  const fullStory = (formData.get('full_story') as string)?.trim() || null;
  const rating = formData.get('rating') ? parseFloat(formData.get('rating') as string) : 5.0;

  const verified = formData.get('verified') === 'on';
  const featured = formData.get('featured') === 'on';
  const clientConsentRecorded = formData.get('client_consent_recorded') === 'on';
  const isPublished = formData.get('is_published') === 'on';

  if (!coupleNames || !quote) {
    return { success: false, error: 'Couple names and review quote are required.' };
  }

  // Mandatory privacy & legal guardrail: cannot publish without recorded client consent
  if (isPublished && !clientConsentRecorded) {
    return {
      success: false,
      error: 'Privacy Guard: You must record verified client consent before publishing a testimonial on the public website.',
    };
  }

  const payload = {
    couple_names: coupleNames,
    celebration_type: celebrationType,
    location,
    wedding_season: weddingSeason,
    quote,
    full_story: fullStory,
    rating,
    verified,
    featured,
    is_published: isPublished,
    client_consent_recorded: clientConsentRecorded,
    source: 'Private Client Concierge',
    updated_at: new Date().toISOString(),
  };

  if (id && id !== 'new') {
    const { error } = await db.from('testimonials').update(payload).eq('id', id);
    if (error) return { success: false, error: error.message };
  } else {
    const { data: inserted, error } = await db
      .from('testimonials')
      .insert({ ...payload, created_at: new Date().toISOString() })
      .select('id')
      .single();
    if (error) return { success: false, error: error.message };
    if (inserted) return { success: true, id: inserted.id };
  }

  revalidatePath('/about');
  revalidatePath('/admin/testimonials');
  revalidatePath('/admin');

  return { success: true };
}

/**
 * Toggles testimonial visibility with consent verification
 */
export async function toggleTestimonialPublishAction(
  id: string,
  isPublished: boolean
): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized.' };
  }

  const db = getAdminDb();
  if (!db || !isDatabaseConfigured()) {
    return { success: false, error: 'Database unavailable.' };
  }

  if (isPublished) {
    // Check if consent is recorded
    const { data: record } = await db
      .from('testimonials')
      .select('client_consent_recorded')
      .eq('id', id)
      .single();

    if (!record?.client_consent_recorded) {
      return {
        success: false,
        error: 'Cannot publish review: Client consent has not been recorded for this testimonial.',
      };
    }
  }

  const { error } = await db
    .from('testimonials')
    .update({ is_published: isPublished, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/about');
  revalidatePath('/admin/testimonials');
  revalidatePath('/admin');

  return { success: true };
}

/**
 * Deletes a testimonial
 */
export async function deleteTestimonialAction(id: string): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized.' };
  }

  const db = getAdminDb();
  if (!db || !isDatabaseConfigured()) {
    return { success: false, error: 'Database unavailable.' };
  }

  const { error } = await db.from('testimonials').delete().eq('id', id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/about');
  revalidatePath('/admin/testimonials');
  revalidatePath('/admin');

  return { success: true };
}
