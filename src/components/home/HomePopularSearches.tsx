'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface VenueCategoryCard {
  id: string;
  title: string;
  subtext: string;
  image: string;
  href: string;
  badge?: string;
}

const POPULAR_SEARCH_CATEGORIES: VenueCategoryCard[] = [
  {
    id: 'hotels',
    title: '4 Star & Above Hotels',
    subtext: 'Gomti Nagar • Shaheed Path • Airport Road',
    image: '/venues/meava/thumbnail.jpg',
    href: '/wedding-venues-lucknow',
    badge: 'Luxury',
  },
  {
    id: 'banquets',
    title: 'Royal Banquet Halls',
    subtext: 'Alambagh • Hazratganj • Gomti Nagar',
    image: '/venues/vsquare/thumbnail.jpg',
    href: '/wedding-venues-lucknow',
    badge: 'AC Indoor',
  },
  {
    id: 'lawns',
    title: 'Marriage Garden / Lawns',
    subtext: 'Faizabad Road • Raebareli Road • Sitapur Rd',
    image: '/venues/hotel-kings-paradise/thumbnail.jpg',
    href: '/wedding-venues-lucknow',
    badge: 'Open Air',
  },
  {
    id: 'resorts',
    title: 'Wedding Resorts & Palaces',
    subtext: 'Bijnor Road • Mohanlalganj • Outskirts',
    image: '/venues/yash-resort/thumbnail.jpg',
    href: '/wedding-venues-lucknow',
    badge: 'Destination',
  },
];

export function HomePopularSearches() {
  return (
    <section className="w-full pt-8 sm:pt-10 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* Section Header (Matching WedMeGood typography & clarity) */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#211A19] tracking-tight">
            Popular Venue Searches
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] mt-0.5">
            Explore Lucknow&apos;s most sought-after wedding settings &amp; prime celebration zones
          </p>
        </div>

        <Link
          href="/wedding-venues-lucknow"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#521D2B] hover:text-[#671024] hover:underline transition-colors shrink-0"
        >
          <span>All 32+ Venues</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* 4-Card Popular Searches Grid / Scrollable Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {POPULAR_SEARCH_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group relative bg-white rounded-xl sm:rounded-2xl border border-[#E8DFD3] hover:border-[#521D2B]/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
          >
            {/* Card Thumbnail */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/11] overflow-hidden bg-[#FAF7F2]">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {cat.badge && (
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                    {cat.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 bg-white">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#211A19] group-hover:text-[#521D2B] transition-colors line-clamp-1">
                  {cat.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-[#78716C] mt-0.5 line-clamp-1 font-normal">
                  {cat.subtext}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-[#F2ECE3] flex items-center justify-between text-[11px] font-semibold text-[#521D2B]">
                <span className="group-hover:underline">Explore Venues</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
