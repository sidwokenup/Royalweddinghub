'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, DoorOpen, Star, ArrowRight, Building2 } from 'lucide-react';
import { Venue } from '@/types/venue';

interface HomeFeaturedVenuesProps {
  venues: Venue[];
}

export function HomeFeaturedVenues({ venues }: HomeFeaturedVenuesProps) {
  // Take the top 6 high-demand venues
  const featuredVenues = venues.slice(0, 6);

  return (
    <section id="venues" className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* Section Header with Clear Contrast */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12 border-b border-[#E8DFD3] pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#521D2B] bg-[#521D2B]/8 px-3 py-1 rounded-full border border-[#521D2B]/15 font-semibold">
            <Building2 size={13} />
            Top Locations
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#211A19] mt-3">
            Dreamy Wedding Venues
          </h2>
          <p className="text-sm sm:text-base text-[#57534E] mt-1.5 font-normal max-w-2xl leading-relaxed">
            Explore 32+ verified marriage lawns, luxury banquet halls, and wedding resorts in Lucknow.
          </p>
        </div>

        <Link
          href="/venues"
          className="inline-flex items-center gap-2 bg-[#521D2B] hover:bg-[#671024] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-full shadow-md transition-all self-start md:self-auto shrink-0"
        >
          <span>View All 32 Venues</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Clean, Uniform 3-Column Venue Grid (Zero Asymmetry) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {featuredVenues.map((venue) => {
          const minPax = venue.capacity?.minPax || 100;
          const maxPax = venue.capacity?.maxPax || venue.capacity?.capacity || 500;
          const rooms = venue.capacity?.rooms || 12;
          const locality = venue.address.split(',')[0];
          const budgetTier =
            maxPax <= 400
              ? 'Under ₹10 Lakh'
              : maxPax <= 800
                ? '₹10L – ₹15 Lakh'
                : maxPax <= 1500
                  ? '₹15L – ₹25 Lakh'
                  : '₹25 Lakh+ Luxury';

          return (
            <Link
              key={venue.id}
              href={`/venues/${venue.slug}`}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-[#E8DFD3] hover:border-[#521D2B]/40 shadow-[0_4px_20px_rgba(33,26,25,0.05)] hover:shadow-[0_12px_36px_rgba(82,29,43,0.12)] transition-all duration-300 overflow-hidden"
            >
              {/* Image Container with Consistent 16:10 Aspect Ratio */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#FAF7F2]">
                <Image
                  src={venue.primaryImage?.localUrl || venue.primaryImage?.url || '/images/hero-poster.webp'}
                  alt={venue.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Category Pill */}
                <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-[#521D2B] px-3 py-1 rounded-full shadow-xs border border-[#E8DFD3]">
                  {venue.category}
                </span>

                {/* Rating Badge */}
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs font-semibold bg-[#521D2B]/90 text-white px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs">
                  <Star size={12} className="text-[#E5C779] fill-[#E5C779]" />
                  <span>{(venue.rating || 4.9).toFixed(1)}</span>
                </span>
              </div>

              {/* Venue Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Locality */}
                  <div className="flex items-center gap-1.5 text-xs text-[#57534E] font-medium mb-1.5 truncate">
                    <MapPin size={13} className="text-[#521D2B] shrink-0" />
                    <span className="truncate">{locality}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-serif font-bold text-[#211A19] group-hover:text-[#521D2B] transition-colors leading-snug line-clamp-1">
                    {venue.name}
                  </h3>

                  {/* Specs Strip */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#F0EAE1] text-xs text-[#211A19]">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Users size={14} className="text-[#521D2B] shrink-0" />
                      <span>{minPax}–{maxPax} Guests</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-medium text-[#57534E]">
                      <DoorOpen size={14} className="text-[#521D2B] shrink-0" />
                      <span>{rooms} AC Rooms</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action Footer */}
                <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#78716C] font-mono">
                      Estimated Package
                    </span>
                    <span className="text-xs font-bold text-[#521D2B]">
                      {budgetTier}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#521D2B] group-hover:translate-x-1 transition-transform">
                    <span>View Venue</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Exploration Link */}
      <div className="mt-12 text-center">
        <Link
          href="/venues"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#DDD3C5] bg-white text-xs uppercase tracking-wider font-semibold text-[#211A19] hover:bg-[#FAF7F2] hover:border-[#521D2B] transition-all shadow-xs"
        >
          <span>Explore All 32 Lucknow Venues (Filter by Capacity &amp; Locality)</span>
          <ArrowRight size={14} className="text-[#521D2B]" />
        </Link>
      </div>
    </section>
  );
}

