'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Filter,
  ExternalLink,
  Edit,
  Trash2,
  PlusCircle,
  EyeOff,
  Building2,
  Users,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { toggleVenuePublishAction, deleteVenueAction } from '@/app/admin/venues/actions';

export interface AdminVenueRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  price_per_plate: number | null;
  min_pax: number | null;
  max_pax: number | null;
  rooms: number | null;
  primary_image_url: string;
  is_featured: boolean;
  is_published: boolean;
  rating: number | null;
}

interface VenueTableClientProps {
  initialVenues: AdminVenueRow[];
}

export function VenueTableClient({ initialVenues }: VenueTableClientProps) {
  const [venues, setVenues] = useState<AdminVenueRow[]>(initialVenues);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isPending, startTransition] = useTransition();
  const [venueToDelete, setVenueToDelete] = useState<AdminVenueRow | null>(null);

  // Distinct categories
  const categories = Array.from(new Set(initialVenues.map((v) => v.category))).filter(Boolean);

  // Filtered venues
  const filtered = venues.filter((venue) => {
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = venue.name.toLowerCase().includes(q);
      const matchSlug = venue.slug.toLowerCase().includes(q);
      const matchCity = venue.city.toLowerCase().includes(q);
      const matchCat = venue.category.toLowerCase().includes(q);
      if (!matchName && !matchSlug && !matchCity && !matchCat) return false;
    }

    // Category
    if (categoryFilter !== 'all' && venue.category !== categoryFilter) {
      return false;
    }

    // Status
    if (statusFilter === 'published' && !venue.is_published) return false;
    if (statusFilter === 'draft' && venue.is_published) return false;

    return true;
  });

  const handleTogglePublish = (venue: AdminVenueRow) => {
    const nextState = !venue.is_published;
    setVenues((prev) =>
      prev.map((v) => (v.id === venue.id ? { ...v, is_published: nextState } : v))
    );

    startTransition(async () => {
      const res = await toggleVenuePublishAction(venue.id, nextState);
      if (!res.success) {
        setVenues((prev) =>
          prev.map((v) => (v.id === venue.id ? { ...v, is_published: venue.is_published } : v))
        );
        alert(`Failed to update status: ${res.error}`);
      }
    });
  };

  const confirmDelete = () => {
    if (!venueToDelete) return;
    const target = venueToDelete;
    setVenueToDelete(null);

    setVenues((prev) => prev.filter((v) => v.id !== target.id));

    startTransition(async () => {
      const res = await deleteVenueAction(target.id);
      if (!res.success) {
        setVenues((prev) => [...prev, target]);
        alert(`Error deleting venue: ${res.error}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Filters, Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-[#181310]/85 border border-[#D6B56D]/15 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8070]">
            <Search className="w-4 h-4 text-[#D6B56D]" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venue by name, category, or area..."
            className="w-full bg-white/[0.03] border border-[#D6B56D]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FAF7F2] placeholder-[#8C8070] focus:outline-none focus:border-[#D6B56D] focus:ring-2 focus:ring-[#D6B56D]/20 transition-all font-sans"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-[#D6B56D]/20 text-xs text-[#D6B56D]">
            <Filter className="w-3.5 h-3.5 text-[#D6B56D]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-[#FAF7F2] font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#181310] text-[#FAF7F2]">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#181310] text-[#FAF7F2]">{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center rounded-xl bg-white/[0.03] border border-[#D6B56D]/20 p-1 text-xs font-mono">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                statusFilter === 'all'
                  ? 'bg-[#521D2B] text-[#FAF7F2] font-semibold shadow-xs border border-[#D6B56D]/30'
                  : 'text-[#B8ADA3] hover:text-[#FAF7F2]'
              }`}
            >
              All ({venues.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                statusFilter === 'published'
                  ? 'bg-emerald-950/60 text-emerald-300 font-semibold shadow-xs border border-emerald-500/40'
                  : 'text-[#B8ADA3] hover:text-[#FAF7F2]'
              }`}
            >
              Live ({venues.filter((v) => v.is_published).length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                statusFilter === 'draft'
                  ? 'bg-white/10 text-[#FAF7F2] font-semibold shadow-xs border border-white/20'
                  : 'text-[#B8ADA3] hover:text-[#FAF7F2]'
              }`}
            >
              Drafts ({venues.filter((v) => !v.is_published).length})
            </button>
          </div>

          {/* Add Venue Trigger */}
          <Link
            href="/admin/venues/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D6B56D] to-[#E5CCA0] hover:from-[#E0C385] hover:to-[#F2DFC0] text-[#1C1611] text-xs font-semibold tracking-wide transition-all shadow-[0_2px_12px_rgba(214,181,109,0.25)] hover:scale-[1.02] active:scale-[0.98] ml-auto font-sans"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#1C1611]" strokeWidth={1.75} />
            <span>Add Venue</span>
          </Link>
        </div>
      </div>

      {/* Venues Data Table */}
      <div className="rounded-3xl bg-[#181310]/85 border border-[#D6B56D]/15 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] text-[#8C8070] uppercase font-mono tracking-wider border-b border-[#D6B56D]/15 text-[11px]">
              <tr>
                <th className="py-4 px-5">Venue Property</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Capacity &amp; Rooms</th>
                <th className="py-4 px-4">Pricing</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6B56D]/10 text-[#FAF7F2]">
              {filtered.length > 0 ? (
                filtered.map((venue) => (
                  <tr
                    key={venue.id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    {/* Property info & thumbnail */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-11 rounded-xl bg-black/40 border border-[#D6B56D]/20 overflow-hidden relative shrink-0 shadow-sm">
                          <Image
                            src={venue.primary_image_url || '/venues/santorini-resort-lucknow/thumbnail.jpg'}
                            alt={venue.name}
                            fill
                            sizes="60px"
                            className="object-cover"
                            unoptimized={venue.primary_image_url?.startsWith('http')}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-[#FAF7F2] group-hover:text-[#D6B56D] transition-colors flex items-center gap-2">
                            <span>{venue.name}</span>
                            {venue.is_featured && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#521D2B]/40 text-[#D6B56D] font-mono border border-[#D6B56D]/30 font-semibold">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#8C8070] font-mono mt-0.5">
                            /{venue.slug} • {venue.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/[0.04] text-[#D6B56D] border border-[#D6B56D]/20 text-[11px] font-mono font-medium">
                        {venue.category}
                      </span>
                    </td>

                    {/* Capacity & Rooms */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-[#FAF7F2] font-medium font-mono text-xs">
                        <Users className="w-3.5 h-3.5 text-[#D6B56D]" />
                        <span>
                          {venue.min_pax && venue.max_pax
                            ? `${venue.min_pax} - ${venue.max_pax} Guests`
                            : 'Bespoke Pax'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8C8070] mt-0.5 font-light">
                        {venue.rooms ? `${venue.rooms} Guest Rooms` : 'Lawn / Day Event'}
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="py-4 px-4 font-mono">
                      {venue.price_per_plate ? (
                        <div className="text-[#FAF7F2] font-semibold text-xs">
                          ₹{venue.price_per_plate.toLocaleString('en-IN')}
                          <span className="text-[10px] text-[#8C8070] font-light ml-0.5">/plate</span>
                        </div>
                      ) : (
                        <span className="text-[#8C8070] italic text-xs">On Request</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(venue)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium border transition-all ${
                          venue.is_published
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                            : 'bg-white/[0.04] text-[#B8ADA3] border-white/[0.08] hover:text-[#FAF7F2]'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {venue.is_published ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-[#8C8070]" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/venues/${venue.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl text-[#8C8070] hover:text-[#D6B56D] hover:bg-white/[0.04] transition-colors"
                          title="Preview on live public website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/venues/${venue.id}`}
                          className="p-2 rounded-xl text-[#D6B56D] hover:text-[#FAF7F2] hover:bg-[#521D2B]/40 transition-colors"
                          title="Edit venue details and images"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setVenueToDelete(venue)}
                          className="p-2 rounded-xl text-[#8C8070] hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Delete venue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-[#8C8070]">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#521D2B]/40 to-[#2A0E16]/40 text-[#D6B56D] border border-[#D6B56D]/30 flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Building2 className="w-6 h-6 text-[#D6B56D]" />
                    </div>
                    <div className="text-sm font-serif text-[#FAF7F2]">No venues match your filter</div>
                    <div className="text-xs text-[#8C8070] mt-1 font-light">
                      Try clearing your search term or select another category.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        <div className="p-4 border-t border-[#D6B56D]/15 bg-white/[0.02] text-xs text-[#8C8070] flex items-center justify-between font-mono">
          <span>Showing {filtered.length} of {venues.length} venues</span>
          <span className="hidden sm:inline text-[#D6B56D]">Instant Edge Revalidation Enforced</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {venueToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#1A1411] border border-rose-900/40 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl text-[#FAF7F2]">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <div className="p-2.5 rounded-2xl bg-rose-950/40 border border-rose-800/40">
                <AlertTriangle className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-serif text-[#FAF7F2] font-normal tracking-tight">Confirm Venue Deletion</h3>
                <p className="text-xs text-[#8C8070] mt-0.5 font-mono">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#B8ADA3] leading-relaxed mb-6 font-light">
              Are you sure you want to delete <span className="font-semibold text-[#FAF7F2]">&ldquo;{venueToDelete.name}&rdquo;</span>?
              Its associated gallery images and records will be permanently removed from the catalog.
            </p>

            <div className="flex items-center justify-end gap-3 font-sans">
              <button
                type="button"
                onClick={() => setVenueToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold tracking-wide shadow-sm transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
