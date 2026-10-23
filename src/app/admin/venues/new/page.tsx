import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { VenueFormClient } from '@/components/admin/venues/VenueFormClient';

export default async function NewVenuePage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <VenueFormClient
      isNew={true}
      initialData={{
        name: '',
        slug: '',
        category: 'Palace Lawns',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        address: '',
        rating: 4.8,
        review_count: 50,
        min_pax: 300,
        max_pax: 1000,
        total_capacity: 1200,
        rooms: 10,
        price_per_plate: 1800,
        price_unit: 'per_plate',
        veg_available: true,
        non_veg_available: true,
        amenities: [
          'Valet Parking',
          'Bridal Dressing Suite',
          'Centrally Air-Conditioned',
          'In-House Catering Available',
          'DJ & Music Permitted',
        ],
        description: '',
        primary_image_url: '/venues/santorini-resort-lucknow/thumbnail.jpg',
        primary_image_alt: 'Luxury Wedding Venue in Lucknow',
        is_featured: false,
        is_published: true,
        gallery: [],
      }}
    />
  );
}
