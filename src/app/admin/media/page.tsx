import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Image as ImageIcon, ArrowLeft, HardDrive, FolderOpen, Layers } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import {
  MediaLibraryClient,
  AdminMediaAsset,
} from '@/components/admin/media/MediaLibraryClient';

export const metadata: Metadata = {
  title: 'Media Library | Royal Wedding Hub Admin',
  robots: { index: false, follow: false },
};

async function fetchMediaAssets(): Promise<AdminMediaAsset[]> {
  const db = getAdminDb();

  if (isDatabaseConfigured() && db) {
    try {
      const { data, error } = await db
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row) => {
          let publicUrl = row.storage_key;
          if (
            row.storage_provider === 'supabase' &&
            !row.storage_key.startsWith('http') &&
            !row.storage_key.startsWith('/')
          ) {
            const { data: pubData } = db.storage.from('media').getPublicUrl(row.storage_key);
            publicUrl = pubData.publicUrl;
          }

          return {
            id: row.id,
            filename: row.filename,
            storage_key: row.storage_key,
            storage_provider: row.storage_provider || 'supabase',
            mime_type: row.mime_type || 'image/jpeg',
            file_size_bytes: row.file_size_bytes || 0,
            width: row.width,
            height: row.height,
            alt_text: row.alt_text,
            folder: row.folder || 'general',
            reference_count: row.reference_count || 0,
            publicUrl,
            created_at: row.created_at || new Date().toISOString(),
          };
        });
      }
    } catch (err) {
      console.warn('[Admin Media] Supabase fetch error:', err);
    }
  }

  return [];
}

export default async function AdminMediaPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const assets = await fetchMediaAssets();

  // Calculate statistics
  const totalAssets = assets.length;
  const totalBytes = assets.reduce((sum, a) => sum + (a.file_size_bytes || 0), 0);
  const cloudCount = assets.filter((a) => a.storage_provider === 'supabase').length;

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6B56D]/15">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#B8ADA3]/70 mb-1.5 font-mono">
            <Link
              href="/admin"
              className="hover:text-[#D6B56D] transition-colors flex items-center gap-1 font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Dashboard</span>
            </Link>
            <span className="text-[#D6B56D]/40">/</span>
            <span className="text-[#D6B56D] font-medium font-sans">Asset CDN</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF7F2] tracking-wide flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D6B56D]/10 border border-[#D6B56D]/30 flex items-center justify-center text-[#D6B56D]">
              <ImageIcon className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <span>Digital Assets & Media Library</span>
          </h1>
          <p className="text-xs text-[#B8ADA3] mt-1 font-light">
            Centralized high-resolution CDN for royal palaces, ceremony suites, banquet decor, and brand assets.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="px-3.5 py-2 rounded-xl bg-[#181310]/85 backdrop-blur-xl border border-[#D6B56D]/15 flex items-center gap-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
            <Layers className="w-4 h-4 text-[#D6B56D]" strokeWidth={1.5} />
            <div>
              <div className="text-[10px] text-[#B8ADA3]/70 uppercase font-mono">Total Assets</div>
              <div className="text-xs font-mono font-bold text-[#FAF7F2] tabular-nums">{totalAssets}</div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#181310]/85 backdrop-blur-xl border border-[#D6B56D]/15 flex items-center gap-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
            <HardDrive className="w-4 h-4 text-[#D6B56D]" />
            <div>
              <div className="text-[10px] text-[#B8ADA3]/70 uppercase font-mono">Storage Used</div>
              <div className="text-xs font-mono font-bold text-[#FAF7F2] tabular-nums">{formatSize(totalBytes)}</div>
            </div>
          </div>

          <div className="hidden md:flex px-3.5 py-2 rounded-xl bg-[#181310]/85 backdrop-blur-xl border border-[#D6B56D]/15 items-center gap-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
            <FolderOpen className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-[#B8ADA3]/70 uppercase font-mono">Cloud Synced</div>
              <div className="text-xs font-mono font-bold text-emerald-400 tabular-nums">{cloudCount} items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Client Interface */}
      <MediaLibraryClient initialAssets={assets} />
    </div>
  );
}
