'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  count: string;
  image: string;
  href: string;
  description: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'venues',
    name: 'Palace Lawns & Venues',
    count: '32 Locations',
    image: '/images/services/wedding-venues.jpg',
    href: '/venues',
    description: 'Heritage palaces, luxury lawns & banquet halls',
  },
  {
    id: 'decor',
    name: 'Planning & Theme Decor',
    count: 'Bespoke Stages',
    image: '/images/services/wedding-planning-decor.jpg',
    href: '/services/planning-and-decor',
    description: 'Mandap architecture & ambient lighting',
  },
  {
    id: 'catering',
    name: 'Royal Awadhi Banquets',
    count: 'Master Khansama',
    image: '/images/services/catering.jpg',
    href: '/services/catering-and-banquets',
    description: 'Heritage Lucknawi dining & live counters',
  },
  {
    id: 'photography',
    name: '4K Cinema & Photography',
    count: 'Drone & Editorial',
    image: '/images/services/photographer.jpg',
    href: '/services/photography-and-films',
    description: 'Fine-art portraits & cinematic wedding films',
  },
  {
    id: 'entertainment',
    name: 'Sufi, Folk & Sangeet DJs',
    count: 'Live Artists',
    image: '/images/services/wedding-entertainment.jpg',
    href: '/services/music-and-entertainment',
    description: 'Celebrity DJs, shehnai maestros & dance troops',
  },
  {
    id: 'bridal',
    name: 'Bridal Styling & Makeup',
    count: 'Trousseau Team',
    image: '/images/services/bridal-makeup.jpg',
    href: '/services/bridal-beauty',
    description: 'Royal bridal couture & bespoke artist curation',
  },
];

export function RealisticCategoryStrip() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 select-none">
      {/* Eyebrow & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#521D2B] bg-[#521D2B]/8 px-3 py-1 rounded-full border border-[#521D2B]/15 font-semibold">
            <Sparkles size={11} />
            Explore by Service Category
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#211A19] mt-2">
            Popular Wedding Services in Lucknow
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] mt-0.5 font-light">
            Every vendor and venue verified in person for flawless wedding execution.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#521D2B] hover:text-[#671024] transition-colors group shrink-0"
        >
          <span>View All Services</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 6-Column Category Grid with Real Event Photography */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-[#E8DFD3] shadow-[0_4px_16px_rgba(33,26,25,0.04)] hover:shadow-[0_12px_32px_rgba(82,29,43,0.12)] hover:border-[#521D2B]/40 transition-all duration-300"
          >
            {/* Real Wedding Photo */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F2]">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-106 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Badge */}
              <span className="absolute bottom-2 left-2 text-[11px] sm:text-xs font-sans uppercase tracking-wider bg-white/95 text-[#521D2B] font-semibold px-2.5 py-0.5 rounded-md shadow-xs border border-[#E8DFD3]">
                {cat.count}
              </span>
            </div>

            {/* Content */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-serif font-bold text-[#211A19] group-hover:text-[#521D2B] transition-colors leading-tight line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#78716C] mt-1 leading-snug line-clamp-2 font-light">
                  {cat.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#F0EAE1] flex items-center justify-between text-[10px] text-[#521D2B] font-semibold uppercase tracking-wider">
                <span>Explore</span>
                <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

