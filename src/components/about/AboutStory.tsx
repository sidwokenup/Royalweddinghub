"use client";

import Image from "next/image";
import { Heart, Compass, ShieldCheck } from "lucide-react";

export function AboutStory() {
  return (
    <section id="our-story" className="w-full py-16 sm:py-24 bg-white/70 border-y border-[#E5DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Newly Sourced Wedding Celebration Photograph */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-[#E5DDD2] shadow-[0_12px_40px_rgba(33,26,25,0.06)] group">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/images/about/about-story.jpg"
                  alt="Couple celebrating under an opulent floral canopy in a royal ballroom"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Bottom Editorial Caption */}
              <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest text-[#EFE8DE] block">
                  Intimate &amp; Royal Celebrations
                </span>
                <p className="text-xs font-serif font-light text-white/90">
                  Crafted around family heritage and timeless customs
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Brand Story Text */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-7">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#521D2B] font-medium block">
                OUR PURPOSE
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#211A19] leading-tight">
                More Than Planning.<br />
                <span className="italic text-[#521D2B]">A Promise to Make It Personal.</span>
              </h2>
            </div>

            <div className="space-y-4 text-base text-[#57534E] font-light leading-relaxed">
              <p>
                Every wedding carries its own traditions, personalities, and dreams. Our approach begins with listening—understanding what matters to each family and bringing those details together into a celebration that feels personal, thoughtful, and beautifully coordinated.
              </p>
              <p>
                Rooted in the cultural elegance and warm hospitality of Lucknow, we understand that Indian weddings are not merely single events; they are multi-chapter journeys bringing together generations. From auspicious muhurats to late-night musical soirees, we orchestrate each ritual with reverence, aesthetic clarity, and calm precision.
              </p>
            </div>

            {/* 3 Core Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5DDD2]">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-1.5">
                <div className="flex items-center gap-2 text-[#521D2B]">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-serif font-medium uppercase tracking-wider">Listening First</span>
                </div>
                <p className="text-xs text-[#78716C] leading-snug">
                  Aligning with your family&apos;s personal values before drawing a single floorplan.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-1.5">
                <div className="flex items-center gap-2 text-[#521D2B]">
                  <Compass className="w-4 h-4" />
                  <span className="text-xs font-serif font-medium uppercase tracking-wider">Heritage Respect</span>
                </div>
                <p className="text-xs text-[#78716C] leading-snug">
                  Deep familiarity with regional Awadhi and Vedic ceremonial nuances.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] space-y-1.5">
                <div className="flex items-center gap-2 text-[#521D2B]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-serif font-medium uppercase tracking-wider">Calm Mastery</span>
                </div>
                <p className="text-xs text-[#78716C] leading-snug">
                  Unobtrusive backstage coordination so your family enjoys every moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
