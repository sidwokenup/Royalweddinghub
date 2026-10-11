"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";

export function ServicesHero() {
  const scrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("services-catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-28 sm:pt-36 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Editorial Introduction */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
          {/* Eyebrow Pill Badge (matching Venues page design system) */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EFE8DE] border border-[#DDD3C5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#521D2B] font-medium">
              THOUGHTFULLY CURATED
            </span>
          </div>

          {/* Main Editorial Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#211A19] leading-[1.08] tracking-tight">
              Every Detail.<br />
              <span className="italic text-[#521D2B]">One Extraordinary Celebration.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#57534E] font-light max-w-xl leading-relaxed pt-1">
              From the first venue visit to the final farewell, discover the bespoke services that bring your wedding vision to life across Lucknow and royal destinations.
            </p>
          </div>

          {/* Quick Metrics / Guarantees Strip */}
          <div className="pt-1 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-[#78716C] border-y border-[#E5DDD2] py-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-normal text-[#521D2B]">8</span>
              <span className="font-light">Curated Disciplines</span>
            </div>
            <span className="hidden sm:inline text-[#D8CBBE]">•</span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#521D2B]" />
              <span className="font-light">End-to-End Orchestration</span>
            </div>
            <span className="hidden sm:inline text-[#D8CBBE]">•</span>
            <div className="flex items-center gap-2">
              <span className="font-light">10+ Years of Awadhi Mastery</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <a
              href="#services-catalog"
              onClick={scrollToServices}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#521D2B] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium hover:bg-[#3D1520] transition-all shadow-[0_6px_20px_rgba(82,29,43,0.22)] cursor-pointer group"
            >
              <span>Explore All Services</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5 text-[#D6B56D]" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-[#D8CBBE] text-[#211A19] text-xs uppercase tracking-widest font-medium hover:bg-[#FAF7F2] hover:border-[#521D2B] transition-all shadow-sm"
            >
              <span>Request Private Consultation</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Large Authentic Wedding Photograph */}
        <div className="lg:col-span-5 w-full">
          <div className="relative group rounded-2xl overflow-hidden border border-[#D8CBBE] bg-white shadow-[0_20px_50px_rgba(33,26,25,0.08)]">
            <div className="relative aspect-[4/5] sm:aspect-[16/13] lg:aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/images/services/wedding-planning-decor.jpg"
                alt="Bespoke luxury wedding planning and floral canopy by The Royal Weddinghub"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Editorial Caption Tag */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] sm:text-[11px] tracking-[0.2em] uppercase pointer-events-none">
              <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-[2px] border border-[#E5DDD2] text-[#211A19] font-medium shadow-sm">
                Floral Ceiling &amp; Royal Lounge • Lucknow
              </span>
              <span className="text-white font-semibold drop-shadow-md">
                Bespoke Design
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
