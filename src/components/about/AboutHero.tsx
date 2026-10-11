"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";

export function AboutHero() {
  const scrollToStory = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("our-story");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full pt-28 sm:pt-36 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Editorial Introduction */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EFE8DE] border border-[#DDD3C5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#521D2B] font-medium">
              THE ART OF CELEBRATION
            </span>
          </div>

          {/* Main Editorial Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#211A19] leading-[1.08] tracking-tight">
              Every Love Story Deserves<br />
              <span className="italic text-[#521D2B]">Its Own Kind of Grandeur.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#57534E] font-light max-w-xl leading-relaxed pt-1">
              At Royal Wedding Hub, we believe a wedding is more than an occasion. It is a collection of moments, traditions, and emotions that deserve to be brought together with care.
            </p>
          </div>

          {/* Core Guiding Tenets Strip */}
          <div className="pt-1 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-[#78716C] border-y border-[#E5DDD2] py-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-[#521D2B]">01</span>
              <span className="font-light">Uncompromising Discretion</span>
            </div>
            <span className="hidden sm:inline text-[#D8CBBE]">•</span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#521D2B]" />
              <span className="font-light">Bespoke Curation</span>
            </div>
            <span className="hidden sm:inline text-[#D8CBBE]">•</span>
            <div className="flex items-center gap-2">
              <span className="font-light">Lucknow &amp; Royal Destinations</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <a
              href="#our-story"
              onClick={scrollToStory}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#521D2B] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#682637] transition-all shadow-md group"
            >
              <span>Discover Our Story</span>
              <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-[#E5DDD2] text-[#211A19] text-xs uppercase tracking-[0.18em] hover:bg-[#FAF7F2] transition-colors"
            >
              <span>Explore Services</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Newly Sourced Royal Wedding Palace Photograph */}
        <div className="lg:col-span-5 w-full">
          <div className="relative group rounded-2xl overflow-hidden border border-[#D8CBBE] bg-white shadow-[0_20px_50px_rgba(33,26,25,0.08)]">
            <div className="relative aspect-[4/5] sm:aspect-[16/13] lg:aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/images/about/about-editorial-hero.jpg"
                alt="Ornate royal palace archway entrance with crystal chandeliers and celebration seating"
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
                Palace Grandeur • Royal Ambience
              </span>
              <span className="text-white/90 font-light drop-shadow">
                The Royal Wedding Hub
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
