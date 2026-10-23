import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Session expired.' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Database is not configured.' }, { status: 500 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: 'Database client failed.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data.' }, { status: 400 });
    }

    const filename = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
    const storageKey = `${folder}/${Date.now()}_${filename}`;
    const bucket = 'media';

    // Ensure bucket exists
    const { data: buckets } = await db.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === bucket);
    if (!exists) {
      await db.storage.createBucket(bucket, { public: true });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await db.storage
      .from(bucket)
      .upload(storageKey, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = db.storage.from(bucket).getPublicUrl(storageKey);
    const publicUrl = publicUrlData.publicUrl;

    // Record in media_assets
    const { data: asset, error: dbError } = await db
      .from('media_assets')
      .upsert(
        {
          filename,
          storage_key: storageKey,
          storage_provider: 'supabase',
          mime_type: file.type || 'image/jpeg',
          file_size_bytes: file.size,
          folder,
          alt_text: filename.replace(/[_-]/g, ' '),
          reference_count: 0,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'storage_key' }
      )
      .select('*')
      .single();

    if (dbError) {
      console.warn('[Media Upload] DB record warning:', dbError.message);
    }

    return NextResponse.json({
      success: true,
      publicUrl,
      asset: asset || { filename, storage_key: storageKey, publicUrl },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
