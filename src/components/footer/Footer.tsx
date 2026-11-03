"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUp,
  Crown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Compass,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";
import { BUSINESS_INFO, getTelUrl, getMailtoUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

function InstagramIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleOpenShahiFarman = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-royal-scroll"));
    }
  };

  const whatsappUrl = generateWhatsAppLink({
    service: "Royal Wedding Concierge & Venues",
    customMessage: "Hello Royal Wedding Hub concierge, I would like to enquire about wedding venues, decor, and catering services in Lucknow.",
  });

  return (
    <footer className="relative w-full bg-[#120B0D] text-[#FAF7F2] border-t border-[#D4AF37]/30 overflow-hidden font-sans">
      {/* Decorative Royal Awadhi Top Arch & Filigree Border Accent */}
      <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />
      
      {/* Subtle Background Radial Luxury Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08)_0%,_rgba(82,29,43,0.12)_45%,_transparent_75%)] pointer-events-none"
        aria-hidden="true"
      />

      {/* =========================================================================
          TOP BANNER: ROYAL WEDDING CONCIERGE CALLOUT (VIP ACCESS)
          ========================================================================= */}
      <div className="relative border-b border-white/10 bg-[#1A0F13]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5E296] text-[10px] sm:text-xs tracking-[0.25em] uppercase font-serif">
              <Crown size={12} className="text-[#D4AF37]" />
              <span>Private Wedding Concierge • Lucknow</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#FAF7F2] font-normal tracking-tight">
              Planning a Grand Celebration in Lucknow?
            </h3>
            <p className="text-xs sm:text-sm text-[#C5BCB3] font-light leading-relaxed">
              Connect directly with our senior wedding directors for private palace walkthroughs, auspicious dates consultation, and authentic Awadhi royal banquets.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 shrink-0">
            {/* WhatsApp Direct */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(37,211,102,0.25)] hover:scale-105 active:scale-95"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Concierge</span>
            </a>

            {/* Direct Call */}
            <a
              href={getTelUrl()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-[#FAF7F2] border border-white/20 text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Phone size={14} className="text-[#D4AF37]" />
              <span>{BUSINESS_INFO.displayPhone}</span>
            </a>

            {/* Shahi Farman Lead Modal Trigger */}
            <button
              type="button"
              onClick={handleOpenShahiFarman}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5E296] to-[#C59B27] text-[#3B0D16] font-serif font-bold text-xs uppercase tracking-wider shadow-[0_4px_18px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 border border-[#FDECB0] cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Claim ₹50K Privilege</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN FOOTER: 4-COLUMN REGAL DIRECTORY
          ========================================================================= */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Heritage Presence (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/logo.webp"
                alt="Royal Wedding Hub Logo"
                width={44}
                height={44}
                className="h-10 sm:h-11 w-auto object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform"
                priority={false}
              />
              <div>
                <span className="block text-lg sm:text-xl font-serif font-bold tracking-[0.2em] uppercase text-[#FAF7F2] group-hover:text-[#F5E296] transition-colors leading-tight">
                  {BUSINESS_INFO.name}
                </span>
                <span className="block text-[10px] tracking-[0.28em] uppercase text-[#D4AF37] font-mono">
                  Royal Wedding Concierge
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-[13px] text-[#C5BCB3] font-light leading-relaxed max-w-sm">
              Lucknow&apos;s premier luxury wedding planning and curated venue concierge. Orchestrating majestic palace lawns, heritage banquets, royal Awadhi culinary feasts, 4K cinema, and bespoke thematic decor.
            </p>

            {/* Royal Trust Badges */}
            <div className="pt-2 space-y-2 border-t border-white/10 text-xs text-[#E5DDD2]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#D4AF37] shrink-0" />
                <span>32+ Verified Heritage &amp; Palace Venues</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#D4AF37] shrink-0" />
                <span>Authentic Awadhi Dastarkhwan &amp; Catering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#D4AF37] shrink-0" />
                <span>Zero Hidden Brokerage • Transparent Pricing</span>
              </div>
            </div>
          </div>

          {/* Column 2: Curated Wedding Venues (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <h4 className="text-xs uppercase tracking-[0.22em] text-[#F5E296] font-semibold font-serif">
                Curated Venues
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs text-[#C5BCB3]">
              <li>
                <Link href="/venues" className="hover:text-[#F5E296] transition-colors flex items-center justify-between group">
                  <span>Palace &amp; Heritage Lawns</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">→</span>
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-[#F5E296] transition-colors flex items-center justify-between group">
                  <span>AC Indoor Banquet Halls</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">→</span>
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-[#F5E296] transition-colors flex items-center justify-between group">
                  <span>Luxury Wedding Resorts</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">→</span>
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-[#F5E296] transition-colors flex items-center justify-between group">
                  <span>Gomti Nagar &amp; Ext. Venues</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">→</span>
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-[#F5E296] transition-colors flex items-center justify-between group">
                  <span>Shaheed Path &amp; Golf City Lawns</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">→</span>
                </Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-[#F5E296] transition-colors flex items-center justify-between group">
                  <span>Ashiyana &amp; Kanpur Road Estates</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">→</span>
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/venues"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#D4AF37] hover:text-[#F5E296] font-medium"
                >
                  <span>Explore All 32+ Venues</span>
                  <ArrowUpRight size={13} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Wedding Services & Disciplines (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <h4 className="text-xs uppercase tracking-[0.22em] text-[#F5E296] font-semibold font-serif">
                Royal Services
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs text-[#C5BCB3]">
              <li>
                <Link href="/services/planning-and-decor" className="hover:text-[#F5E296] transition-colors">
                  Planning &amp; Decor
                </Link>
              </li>
              <li>
                <Link href="/services/photography-and-films" className="hover:text-[#F5E296] transition-colors">
                  4K Photography &amp; Cinema
                </Link>
              </li>
              <li>
                <Link href="/services/catering-and-culinary" className="hover:text-[#F5E296] transition-colors">
                  Royal Awadhi Catering
                </Link>
              </li>
              <li>
                <Link href="/services/music-and-entertainment" className="hover:text-[#F5E296] transition-colors">
                  Sufi, Live Bands &amp; DJs
                </Link>
              </li>
              <li>
                <Link href="/services/ceremonies-and-traditions" className="hover:text-[#F5E296] transition-colors">
                  Sacred Vedic Rituals
                </Link>
              </li>
              <li>
                <Link href="/services/styling-and-attire" className="hover:text-[#F5E296] transition-colors">
                  Bridal Styling &amp; Mehendi
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#D4AF37] hover:text-[#F5E296] font-medium"
                >
                  <span>All 6 Services</span>
                  <ArrowUpRight size={13} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Studio Address & Direct Inquiries (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <h4 className="text-xs uppercase tracking-[0.22em] text-[#F5E296] font-semibold font-serif">
                Studio &amp; Inquiries
              </h4>
            </div>

            {/* Physical Business Address */}
            <div className="space-y-2.5 text-xs text-[#C5BCB3]">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="text-[#FAF7F2] font-medium block">Head Office &amp; Concierge Studio:</span>
                  <span>{BUSINESS_INFO.address.line1},</span>
                  <br />
                  <span>{BUSINESS_INFO.address.line2}, Lucknow,</span>
                  <br />
                  <span>Uttar Pradesh — {BUSINESS_INFO.address.pincode}</span>
                  <span className="block text-[11px] text-[#A89F91] pt-0.5">
                    (Near Lucknow Airport Corridor)
                  </span>
                </div>
              </div>

              {/* Concierge Desk Hours */}
              <div className="flex items-start gap-2.5 pt-1">
                <Clock size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="leading-relaxed text-[11px]">
                  <span className="text-[#FAF7F2] font-medium block">Consultation Hours:</span>
                  <span>Studio Walk-ins: 10:00 AM – 8:00 PM</span>
                  <br />
                  <span className="text-[#F5E296]">Concierge Hotline: 24/7 Available</span>
                </div>
              </div>

              {/* Direct Communication Channels */}
              <div className="pt-2 space-y-2 border-t border-white/10">
                <a
                  href={getTelUrl()}
                  className="flex items-center gap-2.5 text-xs text-[#FAF7F2] hover:text-[#F5E296] transition-colors"
                >
                  <Phone size={13} className="text-[#D4AF37] shrink-0" />
                  <span className="font-medium">{BUSINESS_INFO.displayPhone}</span>
                </a>

                <a
                  href={getMailtoUrl()}
                  className="flex items-center gap-2.5 text-xs text-[#FAF7F2] hover:text-[#F5E296] transition-colors"
                >
                  <Mail size={13} className="text-[#D4AF37] shrink-0" />
                  <span>{BUSINESS_INFO.email}</span>
                </a>

                <a
                  href={BUSINESS_INFO.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs text-[#FAF7F2] hover:text-[#F5E296] transition-colors group"
                >
                  <InstagramIcon size={14} className="text-[#D4AF37] shrink-0" />
                  <span>Instagram: {BUSINESS_INFO.instagram.handle}</span>
                  <ArrowUpRight size={11} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================================
            LUXURY TRUST PILLARS BAR
            ========================================================================= */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="block text-base sm:text-lg font-serif font-bold text-[#F5E296]">32+ Palaces</span>
            <span className="block text-[11px] text-[#A89F91] uppercase tracking-wider">Verified Lawns &amp; Resorts</span>
          </div>
          <div className="space-y-1">
            <span className="block text-base sm:text-lg font-serif font-bold text-[#F5E296]">Awadhi Heritage</span>
            <span className="block text-[11px] text-[#A89F91] uppercase tracking-wider">Master Chef Dastarkhwan</span>
          </div>
          <div className="space-y-1">
            <span className="block text-base sm:text-lg font-serif font-bold text-[#F5E296]">4K Cinema</span>
            <span className="block text-[11px] text-[#A89F91] uppercase tracking-wider">Fine-Art Wedding Films</span>
          </div>
          <div className="space-y-1">
            <span className="block text-base sm:text-lg font-serif font-bold text-[#F5E296]">100% Direct</span>
            <span className="block text-[11px] text-[#A89F91] uppercase tracking-wider">Zero Hidden Brokerage</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM COPYRIGHT & LEGAL COMPLIANCE BAR
          ========================================================================= */}
      <div className="relative border-t border-white/10 bg-[#0B0607] px-4 sm:px-6 lg:px-8 py-6 text-xs text-[#8E867C]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright notice */}
          <div className="text-center md:text-left space-y-1">
            <p>
              © {currentYear} {BUSINESS_INFO.name}. All rights reserved.
            </p>
            <p className="text-[11px] text-[#6E665E]">
              Lucknow&apos;s Luxury Wedding Planning &amp; Venue Concierge Experience.
            </p>
          </div>

          {/* Legal and Discoverability Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-light">
            <Link
              href="/privacy"
              className="hover:text-[#F5E296] transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/terms"
              className="hover:text-[#F5E296] transition-colors underline-offset-4 hover:underline"
            >
              Terms of Service
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/contact"
              className="hover:text-[#F5E296] transition-colors underline-offset-4 hover:underline"
            >
              Contact Concierge
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/sitemap.xml"
              className="hover:text-[#F5E296] transition-colors"
            >
              Sitemap
            </Link>
            <span className="text-white/20">•</span>
            <Link
              href="/llms.txt"
              className="hover:text-[#F5E296] transition-colors"
            >
              llms.txt
            </Link>
          </div>

          {/* Scroll to Top Action */}
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-[#C5BCB3] hover:text-[#FAF7F2] border border-white/10 text-xs transition-all duration-300 group cursor-pointer"
            aria-label="Back to Top"
          >
            <span>Back to Top</span>
            <ArrowUp size={13} className="text-[#D4AF37] group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
