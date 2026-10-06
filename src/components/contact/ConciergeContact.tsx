"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, MapPin, Phone, Clock } from "lucide-react";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { ConciergeCard } from "./ConciergeCard";
import { ContactActions } from "./ContactActions";
import { ContactFooter } from "./ContactFooter";
import { MobileStickyBar } from "./MobileStickyBar";

export function ConciergeContact() {
  return (
    <div className="relative min-h-screen w-full bg-[#0d0907] text-[#faf9f6] flex flex-col justify-between overflow-x-hidden selection:bg-[#d4af37]/30 selection:text-white">
      {/* Subtle luxury ambient lighting */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08)_0%,_rgba(0,0,0,0)_70%)] pointer-events-none"
        aria-hidden="true" 
      />

      {/* Top Concierge Header & Return Link */}
      <header className="relative z-20 w-full px-4 sm:px-8 py-5 border-b border-white/[0.06] bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={13} />
            <span>HOME</span>
          </Link>

          <div className="text-center">
            <span className="text-xs sm:text-sm font-normal tracking-[0.3em] uppercase display-text text-white block">
              {BUSINESS_INFO.name}
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.35em] uppercase text-[#d4af37] block">
              LUXURY WEDDING CONCIERGE
            </span>
          </div>

          <a
            href={getTelUrl()}
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-[#f3e5d8] hover:text-white transition-colors"
          >
            <Phone size={12} className="text-[#d4af37]" />
            <span>{BUSINESS_INFO.displayPhone}</span>
          </a>
        </div>
      </header>

      {/* Main Concierge Interactive Section */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 sm:py-16 flex flex-col justify-center">
        {/* Page Opening Statement & Immediate Actions (Part 5) */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="w-6 h-[1px] bg-[#d4af37]/40" />
            <span className="text-[10px] sm:text-xs tracking-[0.38em] uppercase text-[#d4af37] font-light">
              PRIVATE CONCIERGE DESK
            </span>
            <span className="w-6 h-[1px] bg-[#d4af37]/40" />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl display-text font-normal text-white leading-[1.12]">
            Let&apos;s Begin<br />
            <span className="italic text-[#f3e5d8]">Your Forever.</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base font-light text-white/75 leading-relaxed max-w-lg mx-auto">
            Every extraordinary wedding begins with a conversation. Speak directly with our concierge desk or curate your vision below.
          </p>

          {/* Immediate Action Buttons (Visible Above The Fold) */}
          <div className="pt-2 flex justify-center">
            <ContactActions />
          </div>
        </div>

        {/* Desktop Asymmetric Editorial Composition (Part 16 & 17) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Editorial Statement & Verified Local Credentials */}
          <div className="lg:col-span-5 space-y-8 hidden lg:block pr-4">
            <div className="space-y-4 border-l-2 border-[#d4af37]/40 pl-6">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#d4af37] font-medium block">
                CRAFTING MEMORIES
              </span>
              <h2 className="text-3xl xl:text-4xl display-text font-normal text-white leading-snug">
                Your celebration deserves nothing ordinary.
              </h2>
              <p className="text-xs xl:text-sm font-light text-white/70 leading-relaxed">
                Whether you envision a grand royal palace procession in Lucknow or an intimate destination soirée, our 10+ years of relationships ensure seamless mastery of decor, artists, banquets, and timeline.
              </p>
            </div>

            {/* Quick Pillars */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 text-xs text-white/80">
                <MapPin size={16} className="text-[#d4af37] shrink-0 mt-0.5" />
                <span>
                  <strong>Ashiyana Studio:</strong> {BUSINESS_INFO.address.full}
                </span>
              </div>
              <div className="flex items-start gap-3 text-xs text-white/80">
                <Clock size={16} className="text-[#d4af37] shrink-0 mt-0.5" />
                <span>
                  <strong>24/7 Availability:</strong> Immediate response for wedding consultations &amp; venue bookings.
                </span>
              </div>
              <div className="flex items-start gap-3 text-xs text-white/80">
                <Sparkles size={16} className="text-[#d4af37] shrink-0 mt-0.5" />
                <span>
                  <strong>Celebrity &amp; Sufi Talent:</strong> Exclusive artist management and royal Awadhi culinary banquets.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Concierge Card */}
          <div className="lg:col-span-7 w-full flex justify-center">
            <ConciergeCard />
          </div>
        </div>
      </main>

      {/* Contact Page Minimal Luxury Footer (Part 21) */}
      <ContactFooter />

      {/* Mobile-Only Sticky Conversion Bar (Part 13) */}
      <MobileStickyBar />
    </div>
  );
}
