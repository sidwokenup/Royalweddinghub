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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8070]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venue by name, category, or area..."
            className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1C1611] placeholder-[#A09585] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all shadow-2xs"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F5EE] border border-[#EAE4D9] text-xs text-[#85662F]">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-xs text-[#1C1611] font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center rounded-xl bg-[#F8F5EE] border border-[#EAE4D9] p-1 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                statusFilter === 'all'
                  ? 'bg-[#FFFFFF] text-[#521D2B] font-semibold shadow-xs'
                  : 'text-[#5C5245] hover:text-[#1C1611]'
              }`}
            >
              All ({venues.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                statusFilter === 'published'
                  ? 'bg-[#FFFFFF] text-[#521D2B] font-semibold shadow-xs'
                  : 'text-[#5C5245] hover:text-[#1C1611]'
              }`}
            >
              Published ({venues.filter((v) => v.is_published).length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                statusFilter === 'draft'
                  ? 'bg-[#FFFFFF] text-[#521D2B] font-semibold shadow-xs'
                  : 'text-[#5C5245] hover:text-[#1C1611]'
              }`}
            >
              Drafts ({venues.filter((v) => !v.is_published).length})
            </button>
          </div>

          {/* Add Venue Trigger */}
          <Link
            href="/admin/venues/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#521D2B] text-white text-xs font-medium tracking-wide hover:bg-[#682637] transition-all shadow-sm ml-auto"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#E6C994]" />
            <span>Add Venue</span>
          </Link>
        </div>
      </div>

      {/* Venues Data Table */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F5EE] text-[#5C5245] uppercase font-mono tracking-wider border-b border-[#EAE4D9]">
              <tr>
                <th className="py-3.5 px-5">Venue Property</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Capacity & Rooms</th>
                <th className="py-3.5 px-4">Pricing</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE1] text-[#1C1611]">
              {filtered.length > 0 ? (
                filtered.map((venue) => (
                  <tr
                    key={venue.id}
                    className="hover:bg-[#FDFBF7] transition-colors group"
                  >
                    {/* Property info & thumbnail */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-11 rounded-lg bg-[#F8F5EE] border border-[#EAE4D9] overflow-hidden relative shrink-0 shadow-2xs">
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
                          <div className="font-semibold text-sm text-[#1C1611] group-hover:text-[#521D2B] transition-colors flex items-center gap-2">
                            <span>{venue.name}</span>
                            {venue.is_featured && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FDF9F0] text-[#705527] font-mono border border-[#E9DECA] font-medium">
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
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#FDF9F0] text-[#705527] border border-[#E9DECA] text-[11px] font-sans font-medium">
                        {venue.category}
                      </span>
                    </td>

                    {/* Capacity & Rooms */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[#1C1611] font-medium">
                        <Users className="w-3.5 h-3.5 text-[#85662F]" />
                        <span>
                          {venue.min_pax && venue.max_pax
                            ? `${venue.min_pax} - ${venue.max_pax} Guests`
                            : 'Bespoke Pax'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8C8070] mt-0.5">
                        {venue.rooms ? `${venue.rooms} Guest Rooms` : 'Lawn / Day Event'}
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="py-3.5 px-4 font-mono">
                      {venue.price_per_plate ? (
                        <div className="text-[#1C1611] font-semibold">
                          ₹{venue.price_per_plate.toLocaleString('en-IN')}
                          <span className="text-[10px] text-[#8C8070] font-sans font-normal ml-0.5">/plate</span>
                        </div>
                      ) : (
                        <span className="text-[#8C8070] italic font-sans">On Request</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(venue)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium border transition-all ${
                          venue.is_published
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-[#F5F2EB] text-[#5C5245] border-[#E2DAD0] hover:text-[#1C1611]'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {venue.is_published ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
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
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/venues/${venue.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-[#8C8070] hover:text-[#521D2B] hover:bg-[#F8F5EE] transition-colors"
                          title="Preview on live public website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/venues/${venue.id}`}
                          className="p-1.5 rounded-lg text-[#521D2B] hover:text-[#7D293F] hover:bg-[#FDF9F0] transition-colors"
                          title="Edit venue details and images"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setVenueToDelete(venue)}
                          className="p-1.5 rounded-lg text-[#8C8070] hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
                  <td colSpan={6} className="py-12 text-center text-[#8C8070]">
                    <div className="w-12 h-12 rounded-2xl bg-[#FDF9F0] text-[#85662F] border border-[#E9DECA] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-semibold text-[#1C1611]">No venues match your filter</div>
                    <div className="text-xs text-[#8C8070] mt-1">
                      Try clearing your search term or select another category.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        <div className="p-3.5 border-t border-[#EAE4D9] bg-[#FAF7F2] text-xs text-[#7A6E5F] flex items-center justify-between font-mono">
          <span>Showing {filtered.length} of {venues.length} venues</span>
          <span className="hidden sm:inline">Instant Edge Revalidation Enforced</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {venueToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1611]/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] border border-rose-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-700 mb-4">
              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200/80">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-serif text-[#1C1611] font-semibold">Confirm Venue Deletion</h3>
                <p className="text-xs text-[#8C8070] mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#5C5245] leading-relaxed mb-6 font-light">
              Are you sure you want to delete <span className="font-semibold text-[#1C1611]">&ldquo;{venueToDelete.name}&rdquo;</span>?
              Its associated gallery images and records will be permanently removed from the catalog.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setVenueToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#5C5245] hover:bg-[#F8F5EE] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium tracking-wide shadow-sm transition-colors"
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
