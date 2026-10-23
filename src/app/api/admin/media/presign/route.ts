import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';

export async function POST(request: NextRequest) {
  // 1. Authenticate admin
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Administrative session required.' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Database is not configured.' }, { status: 500 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: 'Database client failed.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { filename, mimeType, folder = 'general', size = 0 } = body;

    if (!filename || !mimeType) {
      return NextResponse.json({ error: 'filename and mimeType are required.' }, { status: 400 });
    }

    // Sanitize filename
    const sanitized = filename.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
    const storageKey = `${folder}/${Date.now()}_${sanitized}`;
    const bucket = 'media';

    // Ensure bucket exists in Supabase Storage
    const { data: buckets } = await db.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === bucket);
    if (!bucketExists) {
      await db.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 104857600, // 100 MB max for 4K video / RAW photos
      });
    }

    // Generate signed upload URL for direct browser-to-storage upload
    const { data: signedData, error: signError } = await db.storage
      .from(bucket)
      .createSignedUploadUrl(storageKey);

    if (signError) {
      return NextResponse.json({ error: signError.message }, { status: 500 });
    }

    // Compute public CDN URL
    const { data: publicUrlData } = db.storage.from(bucket).getPublicUrl(storageKey);
    const publicUrl = publicUrlData.publicUrl;

    // Pre-register asset in media_assets table
    await db.from('media_assets').upsert(
      {
        filename: sanitized,
        storage_key: storageKey,
        storage_provider: 'supabase',
        mime_type: mimeType,
        file_size_bytes: size,
        folder,
        alt_text: sanitized.replace(/[_-]/g, ' '),
        reference_count: 0,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'storage_key' }
    );

    return NextResponse.json({
      success: true,
      uploadUrl: signedData.signedUrl,
      token: signedData.token,
      path: signedData.path,
      storageKey,
      publicUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Presigned upload URL generation failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
