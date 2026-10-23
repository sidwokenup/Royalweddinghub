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
 * Saves or updates a wedding service discipline
 */
export async function saveServiceAction(formData: FormData): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized: Session expired.' };
  }

  if (!isDatabaseConfigured()) {
    return { success: false, error: 'Database is not configured.' };
  }

  const db = getAdminDb();
  if (!db) {
    return { success: false, error: 'Database client failed.' };
  }

  const id = formData.get('id') as string;
  const name = (formData.get('name') as string)?.trim();
  const slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const categoryTag = (formData.get('category_tag') as string)?.trim() || 'Wedding Service';
  const headline = (formData.get('headline') as string)?.trim() || name;
  const shortDescription = (formData.get('short_description') as string)?.trim() || '';
  const introCopy = (formData.get('intro_copy') as string)?.trim() || '';
  const coverImageUrl = (formData.get('cover_image_url') as string)?.trim() || '/images/services/wedding-venues.jpg';
  const accentColor = (formData.get('accent_color') as string)?.trim() || '#521D2B';
  const bgSurface = (formData.get('bg_surface') as string)?.trim() || '#FAF7F2';
  const textOnBg = (formData.get('text_on_bg') as string)?.trim() || '#211A19';
  const ctaText = (formData.get('cta_text') as string)?.trim() || 'Enquire Now';
  const externalLink = (formData.get('external_link') as string)?.trim() || null;
  const isFeatured = formData.get('is_featured') === 'on';
  const isPublished = formData.get('is_published') === 'on';

  // Deliverables & Subcategories JSON
  const deliverablesRaw = formData.get('deliverables') as string;
  let deliverables: Array<{ title: string; description: string }> = [];
  try {
    deliverables = deliverablesRaw ? JSON.parse(deliverablesRaw) : [];
  } catch {
    deliverables = [];
  }

  const subcategoriesRaw = formData.get('subcategories') as string;
  let subcategories: Array<{ name: string; detail: string; tag?: string }> = [];
  try {
    subcategories = subcategoriesRaw ? JSON.parse(subcategoriesRaw) : [];
  } catch {
    subcategories = [];
  }

  if (!name || !slug) {
    return { success: false, error: 'Service name and unique slug are required.' };
  }

  const payload = {
    name,
    slug,
    category_tag: categoryTag,
    headline,
    short_description: shortDescription,
    intro_copy: introCopy,
    cover_image_url: coverImageUrl,
    accent_color: accentColor,
    bg_surface: bgSurface,
    text_on_bg: textOnBg,
    cta_text: ctaText,
    external_link: externalLink,
    is_featured: isFeatured,
    is_published: isPublished,
    updated_at: new Date().toISOString(),
  };

  // Upsert service
  let serviceId = id;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (isUuid) {
    const { error: updateError } = await db.from('services').update(payload).eq('id', id);
    if (updateError) {
      return { success: false, error: updateError.message };
    }
  } else {
    const { data: record, error: upsertError } = await db
      .from('services')
      .upsert(payload, { onConflict: 'slug' })
      .select('id')
      .single();

    if (upsertError) {
      return { success: false, error: upsertError.message };
    }
    serviceId = record.id;
  }

  // Update deliverables
  if (serviceId && deliverables.length > 0) {
    await db.from('service_deliverables').delete().eq('service_id', serviceId);
    for (let idx = 0; idx < deliverables.length; idx++) {
      const d = deliverables[idx];
      await db.from('service_deliverables').insert({
        service_id: serviceId,
        title: d.title,
        description: d.description,
        display_order: idx,
      });
    }
  }

  // Update subcategories
  if (serviceId && subcategories.length > 0) {
    await db.from('service_subcategories').delete().eq('service_id', serviceId);
    for (let idx = 0; idx < subcategories.length; idx++) {
      const sub = subcategories[idx];
      await db.from('service_subcategories').insert({
        service_id: serviceId,
        name: sub.name,
        detail: sub.detail,
        tag: sub.tag || null,
        display_order: idx,
      });
    }
  }

  // Next.js on-demand cache revalidation
  revalidatePath('/services');
  revalidatePath(`/services/${slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/services');
  revalidatePath('/');

  return { success: true, id: serviceId };
}

/**
 * Toggles a service's published visibility
 */
export async function toggleServicePublishAction(id: string, isPublished: boolean): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized.' };
  }

  const db = getAdminDb();
  if (!db) {
    return { success: false, error: 'Database unavailable.' };
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const query = db.from('services').update({ is_published: isPublished, updated_at: new Date().toISOString() });

  const { data: service, error } = isUuid
    ? await query.eq('id', id).select('slug').single()
    : await query.eq('slug', id).select('slug').single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/services');
  if (service?.slug) {
    revalidatePath(`/services/${service.slug}`);
  }
  revalidatePath('/admin/services');
  revalidatePath('/admin');

  return { success: true };
}
