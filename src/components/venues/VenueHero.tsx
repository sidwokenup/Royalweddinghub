"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, MapPin, Compass } from "lucide-react";

interface VenueHeroProps {
  totalVenuesCount?: number;
}

export function VenueHero({ totalVenuesCount = 32 }: VenueHeroProps) {
  const scrollToCatalog = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("venue-catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Editorial Grid Composition: Text Left / Framed Architecture Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Editorial Introduction & Curatorial Statement */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
          {/* Eyebrow with Champagne Accent */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EFE8DE] border border-[#DDD3C5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#521D2B] font-medium">
              THE ROYAL COLLECTION
            </span>
          </div>

          {/* Main Editorial Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl md:text-7xl display-text font-serif text-[#211A19] leading-[1.08] tracking-tight">
              Find Your <br />
              <span className="italic text-[#521D2B]">Perfect Setting.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#57534E] font-light max-w-xl leading-relaxed pt-2">
              Extraordinary spaces for the beginning of your forever.
            </p>
          </div>

          {/* Curated Venue Statistics & Editorial Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-[#78716C] border-y border-[#E5DDD2] py-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-normal text-[#521D2B]">{totalVenuesCount}</span>
              <span className="font-light">Curated Destinations</span>
            </div>
            <span className="hidden sm:inline text-[#D8CBBE]">•</span>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D6B56D]" />
              <span className="font-light">Lucknow & Heritage Outskirts</span>
            </div>
            <span className="hidden sm:inline text-[#D8CBBE]">•</span>
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#521D2B]" />
              <span className="font-light">Full Planning Services</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#venue-catalog"
              onClick={scrollToCatalog}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#521D2B] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium hover:bg-[#3D1520] transition-all shadow-[0_6px_20px_rgba(82,29,43,0.22)] cursor-pointer group"
            >
              <span>Explore The Collection</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5 text-[#D6B56D]" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-[#D8CBBE] text-[#211A19] text-xs uppercase tracking-widest font-medium hover:bg-[#FAF7F2] hover:border-[#521D2B] transition-all"
            >
              <span>Private Concierge Desk</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Framed Signature Architectural Anchor Photograph */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Subtle Offset Decorative Backing Frame */}
            <div className="absolute -inset-2.5 sm:-inset-3.5 rounded-3xl border border-[#D8CBBE]/80 bg-[#FAF7F2] -rotate-1 pointer-events-none" />

            {/* Main Framed Venue Image */}
            <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E0D7CC] shadow-[0_20px_50px_rgba(33,26,25,0.12)]">
              <Image
                src="/venues/santorini-resort-lucknow/thumbnail.jpg"
                alt="Santorini Resort luxury wedding setting in Lucknow"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center scale-102 hover:scale-105 transition-transform duration-1000 ease-out"
              />

              {/* Delicate Gradient at Bottom for Caption Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

              {/* Editorial Caption Tag */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#D6B56D] block font-medium">
                  ARCHITECTURAL SPOTLIGHT
                </span>
                <p className="text-base sm:text-lg font-serif font-normal leading-snug">
                  Santorini Resort & Lawns
                </p>
                <p className="text-xs text-white/80 font-light">
                  Kanpur Road, Lucknow • Capacity up to 1,500 Guests
                </p>
              </div>

              {/* Top Accent Stamp */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#521D2B] px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold border border-[#E5DDD2] shadow-sm">
                Verified Venue
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
