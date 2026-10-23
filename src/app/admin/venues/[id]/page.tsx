import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import { VenueFormClient, VenueFormData } from '@/components/admin/venues/VenueFormClient';
import rawVenues from '@/data/venues.json';

interface VenueEditPageProps {
  params: Promise<{ id: string }>;
}

async function getVenueData(idOrSlug: string): Promise<VenueFormData | null> {
  const db = getAdminDb();

  // 1. Try Supabase
  if (isDatabaseConfigured() && db) {
    try {
      // Query by ID or Slug
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const query = db.from('venues').select('*');
      const { data: venue, error } = isUuid
        ? await query.eq('id', idOrSlug).single()
        : await query.eq('slug', idOrSlug).single();

      if (!error && venue) {
        // Fetch gallery images
        const { data: images } = await db
          .from('venue_images')
          .select('url, alt_text, is_cover')
          .eq('venue_id', venue.id)
          .order('display_order', { ascending: true });

        return {
          id: venue.id,
          name: venue.name,
          slug: venue.slug,
          category: venue.category,
          city: venue.city,
          state: venue.state,
          address: venue.address,
          rating: venue.rating,
          review_count: venue.review_count,
          min_pax: venue.min_pax,
          max_pax: venue.max_pax,
          total_capacity: venue.total_capacity,
          rooms: venue.rooms,
          raw_capacity: venue.raw_capacity,
          price_per_plate: venue.price_per_plate,
          price_unit: venue.price_unit,
          veg_available: venue.veg_available,
          non_veg_available: venue.non_veg_available,
          amenities: Array.isArray(venue.amenities) ? venue.amenities : [],
          description: venue.description,
          primary_image_url: venue.primary_image_url,
          primary_image_alt: venue.primary_image_alt,
          is_featured: venue.is_featured,
          is_published: venue.is_published,
          gallery: (images || []).map((img) => ({
            url: img.url,
            alt_text: img.alt_text || '',
            is_cover: img.is_cover,
          })),
        };
      }
    } catch (err) {
      console.warn('[Admin Edit Venue] Database fetch error, falling back:', err);
    }
  }

  // 2. Fallback to raw venues.json
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fallback = (rawVenues as any[]).find(
    (v) => v.slug === idOrSlug || v.id === idOrSlug
  );

  if (!fallback) return null;

  return {
    id: fallback.slug,
    name: fallback.name,
    slug: fallback.slug,
    category: fallback.category || 'Wedding Venue',
    city: fallback.city || 'Lucknow',
    state: fallback.state || 'Uttar Pradesh',
    address: fallback.address || `${fallback.name}, Lucknow`,
    rating: fallback.rating || 4.8,
    review_count: fallback.reviewCount || 75,
    min_pax: fallback.capacity?.minPax || null,
    max_pax: fallback.capacity?.maxPax || null,
    total_capacity: fallback.capacity?.capacity || null,
    rooms: fallback.capacity?.rooms || null,
    raw_capacity: fallback.capacity?.raw || null,
    price_per_plate: fallback.food?.pricePerPlate || null,
    price_unit: fallback.food?.unit || 'per_plate',
    veg_available: fallback.food?.vegetarian ?? true,
    non_veg_available: fallback.food?.nonVegetarian ?? true,
    amenities: Array.isArray(fallback.amenities) ? fallback.amenities : [],
    description: fallback.description || null,
    primary_image_url: fallback.primaryImage?.url || '/venues/santorini-resort-lucknow/thumbnail.jpg',
    primary_image_alt: fallback.primaryImage?.alt || fallback.name,
    is_featured: ['santorini-resort-lucknow', 'vivanta-hotel-resort', 'vsquare'].includes(fallback.slug),
    is_published: true,
    gallery: Array.isArray(fallback.gallery)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? fallback.gallery.map((g: any) => ({
          url: g.url,
          alt_text: g.alt || fallback.name,
          is_cover: false,
        }))
      : [],
  };
}

export default async function EditVenuePage(props: VenueEditPageProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const { id } = await props.params;
  const venueData = await getVenueData(id);

  if (!venueData) {
    notFound();
  }

  return <VenueFormClient initialData={venueData} isNew={false} />;
}
