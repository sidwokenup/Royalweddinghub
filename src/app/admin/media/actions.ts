'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import { getCurrentAdmin } from '@/lib/auth/admin';

export interface ActionResponse {
  success: boolean;
  error?: string;
  count?: number;
}

export interface MediaUsageReport {
  isUsed: boolean;
  venuesCount: number;
  servicesCount: number;
  venueNames: string[];
  serviceNames: string[];
}

/**
 * Checks if a media asset is currently used across published venues or services
 */
export async function checkMediaUsageAction(
  storageKey: string,
  publicUrl: string
): Promise<MediaUsageReport> {
  const db = getAdminDb();
  const report: MediaUsageReport = {
    isUsed: false,
    venuesCount: 0,
    servicesCount: 0,
    venueNames: [],
    serviceNames: [],
  };

  if (!db || !isDatabaseConfigured()) {
    return report;
  }

  try {
    const keyPattern = `%${storageKey}%`;
    const urlPattern = `%${publicUrl}%`;

    // 1. Check Primary Venues Image
    const { data: venuesPrimary } = await db
      .from('venues')
      .select('name')
      .or(`primary_image_url.like.${keyPattern},primary_image_url.like.${urlPattern}`);

    // 2. Check Venue Images Gallery
    const { data: venueImages } = await db
      .from('venue_images')
      .select('venues(name)')
      .or(`url.like.${keyPattern},url.like.${urlPattern},storage_key.like.${keyPattern}`);

    const venueNamesSet = new Set<string>();
    venuesPrimary?.forEach((v) => venueNamesSet.add(v.name));
    venueImages?.forEach((vi) => {
      const v = vi.venues as unknown;
      if (Array.isArray(v)) {
        v.forEach((item) => {
          if (item && typeof item === 'object' && 'name' in item && typeof item.name === 'string') {
            venueNamesSet.add(item.name);
          }
        });
      } else if (v && typeof v === 'object' && 'name' in v && typeof (v as { name: string }).name === 'string') {
        venueNamesSet.add((v as { name: string }).name);
      }
    });

    // 3. Check Services Cover
    const { data: services } = await db
      .from('services')
      .select('name')
      .or(`cover_image_url.like.${keyPattern},cover_image_url.like.${urlPattern}`);

    const serviceNamesSet = new Set<string>();
    services?.forEach((s) => serviceNamesSet.add(s.name));

    report.venuesCount = venueNamesSet.size;
    report.servicesCount = serviceNamesSet.size;
    report.venueNames = Array.from(venueNamesSet);
    report.serviceNames = Array.from(serviceNamesSet);
    report.isUsed = report.venuesCount > 0 || report.servicesCount > 0;
  } catch (err) {
    console.warn('[Media Check Usage] Query warning:', err);
  }

  return report;
}

/**
 * Deletes a media asset with strict reference safety enforcement
 */
export async function deleteMediaAssetAction(
  id: string,
  storageKey: string,
  publicUrl: string
): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized.' };
  }

  const db = getAdminDb();
  if (!db || !isDatabaseConfigured()) {
    return { success: false, error: 'Database unavailable.' };
  }

  // 1. Strict Reference Safety Check
  const usage = await checkMediaUsageAction(storageKey, publicUrl);
  if (usage.isUsed) {
    const details = [
      usage.venuesCount > 0 ? `${usage.venuesCount} venue(s) (${usage.venueNames.slice(0, 2).join(', ')})` : null,
      usage.servicesCount > 0 ? `${usage.servicesCount} service(s) (${usage.serviceNames.slice(0, 2).join(', ')})` : null,
    ].filter(Boolean).join(' and ');

    return {
      success: false,
      error: `Deletion Blocked: This asset is currently linked to ${details}. Remove it from those records first to prevent broken links on the public website.`,
    };
  }

  try {
    // 2. Delete from Supabase Storage bucket if it belongs to cloud storage
    if (storageKey.includes('/')) {
      await db.storage.from('media').remove([storageKey]);
    }

    // 3. Delete from media_assets table
    const { error: dbError } = await db.from('media_assets').delete().eq('id', id);
    if (dbError) {
      return { success: false, error: dbError.message };
    }

    revalidatePath('/admin/media');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Deletion failed.';
    return { success: false, error: message };
  }
}

/**
 * Indexes existing assets from public/venues and public/images into media_assets table
 */
export async function syncLocalMediaAssetsAction(): Promise<ActionResponse> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: 'Unauthorized.' };
  }

  const db = getAdminDb();
  if (!db || !isDatabaseConfigured()) {
    return { success: false, error: 'Database unavailable.' };
  }

  try {
    const root = process.cwd();
    const assetsToInsert: Array<{
      filename: string;
      storage_key: string;
      storage_provider: string;
      mime_type: string;
      file_size_bytes: number;
      folder: string;
      alt_text: string;
      reference_count: number;
    }> = [];

    // Scan public/images/services
    const servicesDir = path.join(root, 'public', 'images', 'services');
    if (fs.existsSync(servicesDir)) {
      const files = fs.readdirSync(servicesDir);
      for (const f of files) {
        if (/\.(jpg|jpeg|png|webp|avif)$/i.test(f)) {
          const stat = fs.statSync(path.join(servicesDir, f));
          assetsToInsert.push({
            filename: f,
            storage_key: `/images/services/${f}`,
            storage_provider: 'local',
            mime_type: 'image/jpeg',
            file_size_bytes: stat.size,
            folder: 'services',
            alt_text: f.replace(/[_-]/g, ' ').replace(/\.[^.]+$/, ''),
            reference_count: 1,
          });
        }
      }
    }

    // Scan first 15 venue directories
    const venuesDir = path.join(root, 'public', 'venues');
    if (fs.existsSync(venuesDir)) {
      const folders = fs.readdirSync(venuesDir);
      for (const vFolder of folders.slice(0, 15)) {
        const vPath = path.join(venuesDir, vFolder);
        if (fs.statSync(vPath).isDirectory()) {
          const files = fs.readdirSync(vPath);
          for (const f of files.slice(0, 4)) {
            if (/\.(jpg|jpeg|png|webp)$/i.test(f)) {
              const stat = fs.statSync(path.join(vPath, f));
              assetsToInsert.push({
                filename: f,
                storage_key: `/venues/${vFolder}/${f}`,
                storage_provider: 'local',
                mime_type: 'image/jpeg',
                file_size_bytes: stat.size,
                folder: 'venues',
                alt_text: `${vFolder} wedding photo`,
                reference_count: 1,
              });
            }
          }
        }
      }
    }

    for (const item of assetsToInsert) {
      await db.from('media_assets').upsert(item, { onConflict: 'storage_key' });
    }

    revalidatePath('/admin/media');
    return { success: true, count: assetsToInsert.length };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sync failed.';
    return { success: false, error: message };
  }
}
