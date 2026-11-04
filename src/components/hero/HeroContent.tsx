import React from 'react';
import { Star, ShieldCheck, Award } from 'lucide-react';
import { HeroTranslucentSearch } from './HeroTranslucentSearch';

export function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full max-w-5xl mx-auto my-auto select-none pt-2 sm:pt-4 pb-2">
      {/* Eyebrow Tag */}
      <div className="hero-eyebrow inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-2.5 sm:mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E5C779]" />
        <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white font-medium">
          <span className="sm:hidden">LUCKNOW WEDDINGS</span>
          <span className="hidden sm:inline">LUCKNOW&apos;S PREMIER WEDDING VENUES &amp; PLANNING SERVICES</span>
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.15] mb-2 sm:mb-3 max-w-3xl mx-auto drop-shadow-md">
        <span className="hero-title-line inline">Your Wedding, </span>
        <span className="hero-title-line inline italic font-normal text-white/95">Seamlessly Planned.</span>
      </h1>

      {/* Clear Realistic Subtitle */}
      <p className="hero-subtitle text-xs sm:text-sm md:text-base font-light text-white/90 max-w-2xl mx-auto leading-relaxed mb-3.5 sm:mb-5 drop-shadow-sm">
        <span className="sm:hidden">32+ Verified Venues &amp; Complete Wedding Planning in Lucknow.</span>
        <span className="hidden sm:inline">Discover 32+ verified marriage lawns and palaces, bespoke thematic decor, royal Awadhi banquets, and 4K cinema teams across Lucknow.</span>
      </p>

      {/* Translucent Modern Search Bar with Rotating Placeholders */}
      <div className="hero-cta-slot w-full">
        <HeroTranslucentSearch />
      </div>

      {/* Realistic Event Planner Social Proof Strip */}
      <div className="mt-4 sm:mt-5 hidden sm:flex items-center justify-center gap-6 text-[11px] font-medium text-white/80 select-none">
        <span className="flex items-center gap-1.5">
          <Star size={13} className="text-[#E5C779] fill-[#E5C779]" />
          <span>4.9 / 5 Rating</span>
        </span>
        <span className="w-1 h-1 rounded-full bg-white/40" />
        <span className="flex items-center gap-1.5">
          <Award size={13} className="text-[#E5C779]" />
          <span>450+ Celebrations Planned in Lucknow</span>
        </span>
        <span className="w-1 h-1 rounded-full bg-white/40" />
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-[#E5C779]" />
          <span>100% Transparent Direct Pricing</span>
        </span>
      </div>
    </div>
  );
}
