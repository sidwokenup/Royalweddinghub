import React from 'react';
import { Star, ShieldCheck, Award } from 'lucide-react';
import { ModernHeroSearch } from './ModernHeroSearch';

export function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full max-w-5xl mx-auto my-auto select-none pt-4 sm:pt-6">
      {/* Eyebrow Tag */}
      <div className="hero-eyebrow inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 sm:mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E5C779]" />
        <span className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-white font-medium">
          LUCKNOW&apos;S PREMIER WEDDING VENUE &amp; PLANNING NETWORK
        </span>
      </div>

      {/* Main Headline (WedMeGood Pattern) */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.12] mb-3 sm:mb-4 max-w-4xl mx-auto">
        <span className="hero-title-line block font-normal text-white">
          Your Wedding,
        </span>
        <span className="hero-title-line block italic font-normal text-white/95">
          Seamlessly Planned.
        </span>
      </h1>

      {/* Clear Realistic Subtitle */}
      <p className="hero-subtitle text-xs sm:text-sm md:text-base font-light text-white/90 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 drop-shadow-sm">
        Discover 32+ verified marriage lawns and palaces, bespoke thematic decor, royal Awadhi banquets, and 4K cinema teams across Lucknow.
      </p>

      {/* Interactive WedMeGood Search Bar */}
      <div className="hero-cta-slot w-full">
        <ModernHeroSearch />
      </div>

      {/* Realistic Event Planner Social Proof Strip */}
      <div className="mt-6 sm:mt-8 hidden sm:flex items-center justify-center gap-6 text-[11px] font-medium text-white/80 select-none">
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
