'use client';

import React, { useState, useTransition, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Folder,
  Copy,
  Check,
  Trash2,
  Maximize2,
  X,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { deleteMediaAssetAction, syncLocalMediaAssetsAction } from '@/app/admin/media/actions';

export interface AdminMediaAsset {
  id: string;
  filename: string;
  storage_key: string;
  storage_provider: string;
  mime_type: string;
  file_size_bytes: number;
  width?: number | null;
  height?: number | null;
  alt_text?: string | null;
  folder: string;
  reference_count: number;
  publicUrl: string;
  created_at: string;
}

interface MediaLibraryClientProps {
  initialAssets: AdminMediaAsset[];
}

export function MediaLibraryClient({ initialAssets }: MediaLibraryClientProps) {
  const [assets, setAssets] = useState<AdminMediaAsset[]>(initialAssets);
  const [folderFilter, setFolderFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [uploadFolder, setUploadFolder] = useState('general');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<AdminMediaAsset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<AdminMediaAsset | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered list
  const filtered = assets.filter((asset) => {
    if (folderFilter !== 'all' && asset.folder !== folderFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!asset.filename.toLowerCase().includes(q) && !asset.storage_key.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleCopyUrl = (asset: AdminMediaAsset) => {
    const url = asset.publicUrl || asset.storage_key;
    navigator.clipboard.writeText(url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    const file = files[0];

    try {
      // Direct upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', uploadFolder);

      setUploadProgress(40);

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(80);

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadProgress(100);

      // Add to list
      const newAsset: AdminMediaAsset = {
        id: data.asset?.id || `new-${Date.now()}`,
        filename: file.name,
        storage_key: data.asset?.storage_key || `${uploadFolder}/${file.name}`,
        storage_provider: 'supabase',
        mime_type: file.type,
        file_size_bytes: file.size,
        folder: uploadFolder,
        reference_count: 0,
        publicUrl: data.publicUrl,
        created_at: new Date().toISOString(),
      };

      setAssets((prev) => [newAsset, ...prev]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed.';
      setUploadError(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmDelete = () => {
    if (!assetToDelete) return;
    const target = assetToDelete;
    setDeleteError(null);

    startTransition(async () => {
      const res = await deleteMediaAssetAction(target.id, target.storage_key, target.publicUrl);
      if (res.success) {
        setAssets((prev) => prev.filter((a) => a.id !== target.id));
        setAssetToDelete(null);
      } else {
        setDeleteError(res.error || 'Failed to delete asset.');
      }
    });
  };

  const handleSyncLocal = () => {
    startTransition(async () => {
      const res = await syncLocalMediaAssetsAction();
      if (res.success) {
        window.location.reload();
      } else {
        alert(res.error || 'Failed to sync local assets.');
      }
    });
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Dropzone Card */}
      <div className="p-6 rounded-3xl bg-[#181310]/85 backdrop-blur-xl border border-[#D6B56D]/15 space-y-4 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-serif text-[#FAF7F2] tracking-wide font-normal">
              Direct-to-Cloud Asset Ingestion
            </h3>
            <p className="text-xs text-[#B8ADA3] font-light mt-0.5">
              Upload high-resolution photography, floorplans, and royal videos. Files upload directly to storage with zero Vercel payload restrictions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={uploadFolder}
              onChange={(e) => setUploadFolder(e.target.value)}
              className="bg-[#0F0C0A] border border-[#D6B56D]/20 text-xs font-mono text-[#FAF7F2] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#D6B56D] cursor-pointer"
            >
              <option value="general">Folder: General</option>
              <option value="venues">Folder: Venues</option>
              <option value="services">Folder: Services</option>
              <option value="hero">Folder: Hero & About</option>
            </select>

            <button
              type="button"
              onClick={handleSyncLocal}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F0C0A] border border-[#D6B56D]/20 text-xs text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-[#D6B56D]/10 hover:border-[#D6B56D]/40 transition-colors"
              title="Index existing public/venues and public/images into media library"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
              <span>Index Local Assets</span>
            </button>
          </div>
        </div>

        {/* Dropzone Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#D6B56D]/20 hover:border-[#D6B56D]/50 rounded-2xl p-7 text-center cursor-pointer bg-[#0F0C0A]/40 hover:bg-[#0F0C0A]/70 transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-[#D6B56D]/10 border border-[#D6B56D]/30 text-[#D6B56D] group-hover:scale-105 flex items-center justify-center mx-auto mb-3 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="text-xs font-medium text-[#FAF7F2]">
            Click or drag & drop files to upload
          </div>
          <div className="text-[11px] text-[#B8ADA3] mt-1 font-light">
            Supports WebP, JPEG, PNG, AVIF & MP4 (Up to 100 MB per asset)
          </div>

          {isUploading && (
            <div className="max-w-xs mx-auto mt-4 space-y-1.5">
              <div className="w-full bg-[#0F0C0A] rounded-full h-1.5 overflow-hidden border border-[#D6B56D]/20">
                <div
                  className="bg-gradient-to-r from-[#D6B56D] to-[#C29D53] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="text-[10px] font-mono text-[#D6B56D] font-medium">
                Uploading directly to cloud storage... {uploadProgress}%
              </div>
            </div>
          )}

          {uploadError && (
            <div className="mt-3 text-xs text-red-400">{uploadError}</div>
          )}
        </div>
      </div>

      {/* Toolbar: Search & Folder Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#181310]/85 backdrop-blur-xl border border-[#D6B56D]/15 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D6B56D]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by asset filename..."
            className="w-full bg-[#0F0C0A] border border-[#D6B56D]/20 rounded-xl pl-10 pr-4 py-2 text-xs text-[#FAF7F2] placeholder-[#B8ADA3]/40 focus:outline-none focus:border-[#D6B56D] focus:ring-1 focus:ring-[#D6B56D]/30 transition-all"
          />
        </div>

        {/* Folder filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          {['all', 'venues', 'services', 'general'].map((f) => (
            <button
              key={f}
              onClick={() => setFolderFilter(f)}
              className={`px-3 py-1.5 rounded-xl border capitalize transition-all whitespace-nowrap ${
                folderFilter === f
                  ? 'bg-gradient-to-r from-[#D6B56D] to-[#C29D53] border-[#D6B56D] text-[#0F0C0A] font-semibold shadow-sm'
                  : 'bg-[#0F0C0A]/60 border-[#D6B56D]/15 text-[#B8ADA3] hover:text-[#FAF7F2] hover:border-[#D6B56D]/30'
              }`}
            >
              {f === 'all' ? `All (${assets.length})` : f}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((asset) => {
          const isCopied = copiedId === asset.id;
          const displayUrl = asset.publicUrl || asset.storage_key;

          return (
            <div
              key={asset.id}
              className="rounded-2xl bg-[#181310]/85 backdrop-blur-xl border border-[#D6B56D]/15 overflow-hidden flex flex-col justify-between shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:border-[#D6B56D]/40 transition-all duration-300 group hover:shadow-[0_16px_40px_rgba(214,181,109,0.06)]"
            >
              {/* Thumbnail Container */}
              <div className="relative h-36 bg-[#0F0C0A] overflow-hidden">
                <Image
                  src={displayUrl}
                  alt={asset.filename}
                  fill
                  sizes="200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized={displayUrl.startsWith('http')}
                />

                {/* Inspect Button Overlay */}
                <button
                  type="button"
                  onClick={() => setPreviewAsset(asset)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  title="Inspect Full Image"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Folder pill badge */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#0F0C0A]/90 text-[10px] font-mono text-[#D6B56D] border border-[#D6B56D]/25 backdrop-blur-sm flex items-center gap-1 shadow-sm">
                  <Folder className="w-2.5 h-2.5" />
                  <span>{asset.folder}</span>
                </div>
              </div>

              {/* Info & Metadata */}
              <div className="p-3.5 space-y-2">
                <div className="text-xs font-medium text-[#FAF7F2] truncate" title={asset.filename}>
                  {asset.filename}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#B8ADA3] font-mono">
                  <span>{formatBytes(asset.file_size_bytes)}</span>
                  {asset.reference_count > 0 ? (
                    <span className="text-emerald-400 text-[10px] font-medium">Linked</span>
                  ) : (
                    <span className="text-[#B8ADA3]/50 text-[10px]">Unlinked</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-[#D6B56D]/10 flex items-center justify-between gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(asset)}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                      isCopied
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#0F0C0A] text-[#FAF7F2] hover:bg-[#D6B56D]/10 hover:border-[#D6B56D]/40 border border-[#D6B56D]/20'
                    }`}
                    title="Copy path or URL to clipboard"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#D6B56D]" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssetToDelete(asset)}
                    className="p-1 rounded-lg text-[#B8ADA3]/60 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                    title="Delete media asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center rounded-2xl bg-[#181310]/85 backdrop-blur-xl border border-[#D6B56D]/15 p-8 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#D6B56D]/10 border border-[#D6B56D]/30 text-[#D6B56D] flex items-center justify-center mx-auto mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-sm font-serif text-[#FAF7F2] font-normal tracking-wide">No media assets found</div>
          <div className="text-xs text-[#B8ADA3] mt-1 max-w-sm mx-auto leading-relaxed font-light">
            Upload new assets using the drag-and-drop zone above, or click &ldquo;Index Local Assets&rdquo; to scan existing images.
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-[#FAF7F2] pb-3 border-b border-[#D6B56D]/20">
              <div className="text-xs font-mono truncate max-w-md text-[#D6B56D]">
                {previewAsset.filename} ({formatBytes(previewAsset.file_size_bytes)})
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={previewAsset.publicUrl || previewAsset.storage_key}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-[#D6B56D]/10 transition-colors"
                  title="Open raw in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewAsset(null)}
                  className="p-1.5 rounded-lg text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-[#D6B56D]/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden bg-black/60 border border-[#D6B56D]/20 mt-3">
              <Image
                src={previewAsset.publicUrl || previewAsset.storage_key}
                alt={previewAsset.filename}
                fill
                sizes="1000px"
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal with Reference Safety Check */}
      {assetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#181310] border border-red-500/30 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30">
                <AlertTriangle className="w-5 h-5 text-red-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-serif text-[#FAF7F2] tracking-wide font-normal">Delete Media Asset</h3>
                <p className="text-xs text-[#B8ADA3]">Reference safety checker active</p>
              </div>
            </div>

            {deleteError ? (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 leading-relaxed mb-4">
                {deleteError}
              </div>
            ) : (
              <p className="text-xs text-[#B8ADA3] leading-relaxed mb-6 font-light">
                Are you sure you want to delete <span className="font-semibold text-[#D6B56D]">&ldquo;{assetToDelete.filename}&rdquo;</span>?
                If this image is currently linked to published venues or services, the system will block deletion to prevent broken images.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6B56D]/15">
              <button
                type="button"
                onClick={() => {
                  setAssetToDelete(null);
                  setDeleteError(null);
                }}
                className="px-4 py-2 rounded-xl text-xs text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-[#D6B56D]/10 transition-colors"
              >
                {deleteError ? 'Close' : 'Cancel'}
              </button>
              {!deleteError && (
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium tracking-wide shadow-sm disabled:opacity-50 transition-colors"
                >
                  {isPending ? 'Checking & Deleting...' : 'Confirm Delete'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
