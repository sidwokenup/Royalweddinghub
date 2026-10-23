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
 * Saves or updates a venue record in the Supabase database
 */
export async function saveVenueAction(formData: FormData): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized: Administrative session expired.' };
  }

  if (!isDatabaseConfigured()) {
    return { success: false, error: 'Database is not configured in .env.local.' };
  }

  const db = getAdminDb();
  if (!db) {
    return { success: false, error: 'Failed to initialize database client.' };
  }

  const id = formData.get('id') as string | null;
  const name = (formData.get('name') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const category = (formData.get('category') as string)?.trim() || 'Wedding Venue';
  const city = (formData.get('city') as string)?.trim() || 'Lucknow';
  const state = (formData.get('state') as string)?.trim() || 'Uttar Pradesh';
  const address = (formData.get('address') as string)?.trim() || `${name}, Lucknow`;
  const rating = formData.get('rating') ? parseFloat(formData.get('rating') as string) : null;
  const reviewCount = formData.get('review_count') ? parseInt(formData.get('review_count') as string, 10) : null;
  
  const minPax = formData.get('min_pax') ? parseInt(formData.get('min_pax') as string, 10) : null;
  const maxPax = formData.get('max_pax') ? parseInt(formData.get('max_pax') as string, 10) : null;
  const totalCapacity = formData.get('total_capacity') ? parseInt(formData.get('total_capacity') as string, 10) : null;
  const rooms = formData.get('rooms') ? parseInt(formData.get('rooms') as string, 10) : null;
  const rawCapacity = (formData.get('raw_capacity') as string)?.trim() || null;

  const vegAvailable = formData.get('veg_available') === 'on';
  const nonVegAvailable = formData.get('non_veg_available') === 'on';
  const pricePerPlate = formData.get('price_per_plate') ? parseFloat(formData.get('price_per_plate') as string) : null;
  const priceUnit = (formData.get('price_unit') as string)?.trim() || 'per_plate';

  const amenitiesRaw = formData.get('amenities') as string;
  let amenities: string[] = [];
  try {
    amenities = amenitiesRaw ? JSON.parse(amenitiesRaw) : [];
  } catch {
    amenities = amenitiesRaw ? amenitiesRaw.split(',').map((s) => s.trim()).filter(Boolean) : [];
  }

  const description = (formData.get('description') as string)?.trim() || null;
  const primaryImageUrl = (formData.get('primary_image_url') as string)?.trim() || '/venues/santorini-resort-lucknow/thumbnail.jpg';
  const primaryImageAlt = (formData.get('primary_image_alt') as string)?.trim() || `${name} - Luxury Wedding Venue`;

  const isFeatured = formData.get('is_featured') === 'on';
  const isPublished = formData.get('is_published') === 'on';

  // Generate slug from name if missing
  if (!slug && name) {
    slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  if (!name || !slug) {
    return { success: false, error: 'Venue name and unique slug are required.' };
  }

  // Gallery images array JSON
  const galleryRaw = formData.get('gallery') as string;
  let gallery: Array<{ url: string; alt_text?: string; is_cover?: boolean }> = [];
  try {
    gallery = galleryRaw ? JSON.parse(galleryRaw) : [];
  } catch {
    gallery = [];
  }

  const venuePayload = {
    name,
    slug,
    category,
    city,
    state,
    address,
    rating,
    review_count: reviewCount,
    min_pax: minPax,
    max_pax: maxPax,
    total_capacity: totalCapacity,
    rooms,
    raw_capacity: rawCapacity,
    veg_available: vegAvailable,
    non_veg_available: nonVegAvailable,
    price_per_plate: pricePerPlate,
    price_unit: priceUnit,
    amenities,
    description,
    primary_image_url: primaryImageUrl,
    primary_image_alt: primaryImageAlt,
    is_featured: isFeatured,
    is_published: isPublished,
    updated_at: new Date().toISOString(),
  };

  let savedVenueId = id;

  if (id && id !== 'new') {
    // Update existing venue
    const { error: updateError } = await db
      .from('venues')
      .update(venuePayload)
      .eq('id', id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }
  } else {
    // Insert new venue
    const { data: inserted, error: insertError } = await db
      .from('venues')
      .insert({
        ...venuePayload,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (insertError) {
      return { success: false, error: insertError.message };
    }
    savedVenueId = inserted.id;
  }

  // Update gallery images if provided
  if (savedVenueId && gallery.length > 0) {
    // Upsert gallery images
    for (let idx = 0; idx < gallery.length; idx++) {
      const img = gallery[idx];
      await db.from('venue_images').upsert(
        {
          venue_id: savedVenueId,
          url: img.url,
          alt_text: img.alt_text || `${name} gallery photo ${idx + 1}`,
          display_order: idx,
          is_cover: !!img.is_cover,
        },
        { onConflict: 'venue_id,url' }
      );
    }
  }

  // Next.js on-demand cache revalidation
  revalidatePath('/venues');
  revalidatePath(`/venues/${slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/venues');
  revalidatePath('/');

  return { success: true, id: savedVenueId || undefined };
}

/**
 * Toggles a venue's published visibility status
 */
export async function toggleVenuePublishAction(id: string, isPublished: boolean): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized.' };
  }

  const db = getAdminDb();
  if (!db) {
    return { success: false, error: 'Database unavailable.' };
  }

  const { data: venue, error } = await db
    .from('venues')
    .update({ is_published: isPublished, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('slug')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/venues');
  if (venue?.slug) {
    revalidatePath(`/venues/${venue.slug}`);
  }
  revalidatePath('/admin/venues');
  revalidatePath('/admin');

  return { success: true };
}

/**
 * Deletes a venue record and its associated images
 */
export async function deleteVenueAction(id: string): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized.' };
  }

  const db = getAdminDb();
  if (!db) {
    return { success: false, error: 'Database unavailable.' };
  }

  // Get slug before deletion for revalidation
  const { data: venue } = await db.from('venues').select('slug').eq('id', id).single();

  // Delete related images first (referential integrity)
  await db.from('venue_images').delete().eq('venue_id', id);

  const { error } = await db.from('venues').delete().eq('id', id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/venues');
  if (venue?.slug) {
    revalidatePath(`/venues/${venue.slug}`);
  }
  revalidatePath('/admin/venues');
  revalidatePath('/admin');

  return { success: true };
}
