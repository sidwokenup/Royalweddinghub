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
    // Optimistic UI update
    setVenues((prev) =>
      prev.map((v) => (v.id === venue.id ? { ...v, is_published: nextState } : v))
    );

    startTransition(async () => {
      const res = await toggleVenuePublishAction(venue.id, nextState);
      if (!res.success) {
        // Rollback on failure
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

    // Optimistic removal
    setVenues((prev) => prev.filter((v) => v.id !== target.id));

    startTransition(async () => {
      const res = await deleteVenueAction(target.id);
      if (!res.success) {
        // Rollback
        setVenues((prev) => [...prev, target]);
        alert(`Error deleting venue: ${res.error}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Filters, Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#12100d] border border-[#241f18]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73685a]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venue by name, category, or area..."
            className="w-full bg-[#1b1713]/80 border border-[#332a20] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#f5f0eb] placeholder-[#6e6457] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/50 transition-all"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171410] border border-[#2e261d] text-xs text-[#c5a880]">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-[#e3dad0] focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#171410] text-[#e3dad0]">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#171410] text-[#e3dad0]">{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center rounded-xl bg-[#171410] border border-[#2e261d] p-1 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#2a2218] text-[#c5a880] font-medium'
                  : 'text-[#8a7f70] hover:text-[#e3dad0]'
              }`}
            >
              All ({venues.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === 'published'
                  ? 'bg-[#2a2218] text-[#c5a880] font-medium'
                  : 'text-[#8a7f70] hover:text-[#e3dad0]'
              }`}
            >
              Published ({venues.filter((v) => v.is_published).length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-[#2a2218] text-[#c5a880] font-medium'
                  : 'text-[#8a7f70] hover:text-[#e3dad0]'
              }`}
            >
              Drafts ({venues.filter((v) => !v.is_published).length})
            </button>
          </div>

          {/* Add Venue Trigger */}
          <Link
            href="/admin/venues/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c5a880] text-[#12100d] text-xs font-medium tracking-wide hover:bg-[#dfc9a5] transition-colors shadow-sm ml-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Venue</span>
          </Link>
        </div>
      </div>

      {/* Venues Data Table */}
      <div className="rounded-2xl bg-[#12100d] border border-[#241f18] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171410] text-[#8a7f70] uppercase font-mono tracking-wider border-b border-[#241f18]">
              <tr>
                <th className="py-4 px-5">Venue Property</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Capacity & Rooms</th>
                <th className="py-4 px-4">Pricing</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1913] text-[#f5f0eb]">
              {filtered.length > 0 ? (
                filtered.map((venue) => (
                  <tr
                    key={venue.id}
                    className="hover:bg-[#181410]/70 transition-colors group"
                  >
                    {/* Property info & thumbnail */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-11 rounded-lg bg-[#1f1a14] border border-[#2b241b] overflow-hidden relative shrink-0">
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
                          <div className="font-medium text-sm text-[#f5f0eb] group-hover:text-[#c5a880] transition-colors flex items-center gap-2">
                            <span>{venue.name}</span>
                            {venue.is_featured && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#3d301e] text-[#c5a880] font-mono border border-[#c5a880]/30">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#73685a] font-mono mt-0.5">
                            /{venue.slug} • {venue.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#1b1712] text-[#c5a880] border border-[#332a1f] text-[11px] font-sans">
                        {venue.category}
                      </span>
                    </td>

                    {/* Capacity & Rooms */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-[#d6ccc0]">
                        <Users className="w-3.5 h-3.5 text-[#8a7f70]" />
                        <span>
                          {venue.min_pax && venue.max_pax
                            ? `${venue.min_pax} - ${venue.max_pax} Guests`
                            : 'Bespoke Pax'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#73685a] mt-0.5">
                        {venue.rooms ? `${venue.rooms} Guest Rooms` : 'Lawn / Day Event'}
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="py-4 px-4 font-mono">
                      {venue.price_per_plate ? (
                        <div className="text-[#e0d6c8] font-medium">
                          ₹{venue.price_per_plate.toLocaleString('en-IN')}
                          <span className="text-[10px] text-[#73685a] font-sans">/plate</span>
                        </div>
                      ) : (
                        <span className="text-[#73685a] italic font-sans">On Request</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(venue)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
                          venue.is_published
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/60'
                            : 'bg-[#221c16] text-[#8a7f70] border-[#382f23] hover:text-[#e3dad0]'
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
                            <EyeOff className="w-3 h-3 text-[#73685a]" />
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
                          className="p-1.5 rounded-lg text-[#8a7f70] hover:text-[#c5a880] hover:bg-[#1f1a14] transition-colors"
                          title="Preview on live public website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/venues/${venue.id}`}
                          className="p-1.5 rounded-lg text-[#8a7f70] hover:text-[#faf6f0] hover:bg-[#1f1a14] transition-colors"
                          title="Edit venue details and images"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setVenueToDelete(venue)}
                          className="p-1.5 rounded-lg text-[#8a7f70] hover:text-red-400 hover:bg-red-950/30 transition-colors"
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
                  <td colSpan={6} className="py-12 text-center text-[#8a7f70]">
                    <div className="w-12 h-12 rounded-2xl bg-[#1b1713] text-[#c5a880] flex items-center justify-center mx-auto mb-3">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-medium text-[#f5f0eb]">No venues match your filter</div>
                    <div className="text-xs text-[#73685a] mt-1">
                      Try clearing your search term or select another category.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        <div className="p-4 border-t border-[#241f18] bg-[#14110e] text-xs text-[#73685a] flex items-center justify-between">
          <span>Showing {filtered.length} of {venues.length} venues</span>
          <span>Instant Edge Revalidation Enforced</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {venueToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#14110e] border border-red-900/50 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-serif text-[#faf6f0]">Confirm Venue Deletion</h3>
                <p className="text-xs text-[#8a7f70] mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#d6ccc0] leading-relaxed mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">&ldquo;{venueToDelete.name}&rdquo;</span>?
              Its associated gallery images and records will be permanently removed from the catalog.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setVenueToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#a39686] hover:bg-[#1e1914] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium tracking-wide shadow-lg transition-colors"
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
