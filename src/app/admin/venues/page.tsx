import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Building2, PlusCircle, ArrowLeft } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import { VenueTableClient, AdminVenueRow } from '@/components/admin/venues/VenueTableClient';
import rawVenues from '@/data/venues.json';

async function fetchVenuesForAdmin(): Promise<AdminVenueRow[]> {
  const db = getAdminDb();

  if (isDatabaseConfigured() && db) {
    try {
      const { data, error } = await db
        .from('venues')
        .select('id, slug, name, category, city, price_per_plate, min_pax, max_pax, rooms, primary_image_url, is_featured, is_published, rating')
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as AdminVenueRow[];
      }
    } catch (err) {
      console.warn('[Admin Venues] Supabase fetch error, using fallback:', err);
    }
  }

  // Fallback to static venues.json
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (rawVenues as any[]).map((v) => ({
    id: v.slug,
    slug: v.slug,
    name: v.name,
    category: v.category || 'Wedding Venue',
    city: v.city || 'Lucknow',
    price_per_plate: v.food?.pricePerPlate || null,
    min_pax: v.capacity?.minPax || null,
    max_pax: v.capacity?.maxPax || null,
    rooms: v.capacity?.rooms || null,
    primary_image_url: v.primaryImage?.url || '/venues/santorini-resort-lucknow/thumbnail.jpg',
    is_featured: ['santorini-resort-lucknow', 'vivanta-hotel-resort', 'vsquare'].includes(v.slug),
    is_published: true,
    rating: v.rating || null,
  }));
}

export default async function AdminVenuesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const venues = await fetchVenuesForAdmin();

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE4D9]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C8070] mb-1 font-mono">
            <Link href="/admin" className="hover:text-[#521D2B] transition-colors flex items-center gap-1 font-sans">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-[#521D2B] font-semibold font-sans">Venues Catalog</span>
          </div>
          <h1 className="text-2xl font-serif text-[#1C1611] font-normal tracking-wide flex items-center gap-3">
            <Building2 className="w-6 h-6 text-[#85662F]" />
            <span>Curated Wedding Venues</span>
          </h1>
          <p className="text-xs text-[#5C5245] mt-1 font-light">
            Manage pricing, capacity ranges, room inventory, amenities, and live status for 32+ Lucknow properties.
          </p>
        </div>

        <Link
          href="/admin/venues/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#521D2B] text-white text-xs font-medium tracking-wide hover:bg-[#682637] transition-all shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#E6C994]" />
          <span>Add New Venue</span>
        </Link>
      </div>

      {/* Venues Interactive Table */}
      <VenueTableClient initialVenues={venues} />
    </div>
  );
}
