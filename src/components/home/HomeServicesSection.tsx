'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, Check, ChevronDown } from 'lucide-react';
import { ServiceItem } from '@/types/service';

interface HomeServicesSectionProps {
  services: ServiceItem[];
}

const MOBILE_CARDS_CONFIG: Record<string, { bg: string; chevron: string; subtext: string }> = {
  'planning-and-decor': {
    bg: 'bg-[#EBE5DB]', // Warm sand / khaki
    chevron: 'text-[#521D2B]',
    subtext: 'Mandap Architecture, Floral Sets, Timeline Direction',
  },
  'catering-and-banquets': {
    bg: 'bg-[#E3EFF7]', // Soft powder blue
    chevron: 'text-[#1D3B52]',
    subtext: 'Royal Awadhi Khansamas, Dum Biryani, Live Street Tawa',
  },
  'photography-and-films': {
    bg: 'bg-[#FDF3D8]', // Soft golden butter
    chevron: 'text-[#7A5B1D]',
    subtext: '4K Cinematic Feature Films, Drone, Candid Portraits',
  },
  'music-and-entertainment': {
    bg: 'bg-[#EED5A5]', // Warm amber / ochre
    chevron: 'text-[#6B4B1B]',
    subtext: 'Celebrity DJs, Sufi Ensembles, Royal Shehnai & Sangeet',
  },
  'bridal-beauty': {
    bg: 'bg-[#E5E9F8]', // Soft lilac / periwinkle
    chevron: 'text-[#3D3B6B]',
    subtext: 'Airbrush HD Makeup, Couture Dupatta Draping, Hair Tresses',
  },
  'invitations-and-gifting': {
    bg: 'bg-[#F9ECEB]', // Soft blush rose
    chevron: 'text-[#6B3B42]',
    subtext: 'Handcrafted Paper Suites, Boxed Hampers, Video Invites',
  },
};

export function HomeServicesSection({ services }: HomeServicesSectionProps) {
  // Take the primary 6 core disciplines
  const displayServices = services.filter((s) => s.slug !== 'wedding-venues').slice(0, 6);

  return (
    <section id="services" className="w-full pt-8 sm:pt-12 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-12 border-b border-[#E8DFD3] pb-4 sm:pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#521D2B] bg-[#521D2B]/8 px-3 py-1 rounded-full border border-[#521D2B]/15 font-semibold">
            <Sparkles size={13} />
            Our Services
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#211A19] mt-2 sm:mt-3">
            Wedding Services
          </h2>
          <p className="text-xs sm:text-base text-[#57534E] mt-1 font-normal max-w-2xl leading-relaxed">
            Planning, mandap decor, royal Awadhi catering, photography &amp; music — everything you need for your wedding in Lucknow.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 bg-[#521D2B] hover:bg-[#671024] text-white text-xs font-semibold uppercase tracking-wider px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-full shadow-md transition-all self-start md:self-auto shrink-0"
        >
          <span>View All Services</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* =========================================================================
          MOBILE VIEW: WedMeGood-Style Horizontal Curved Cards (Screenshot 2 Match)
          ========================================================================= */}
      <div className="flex flex-col gap-3 md:hidden">
        {displayServices.map((service) => {
          const config = MOBILE_CARDS_CONFIG[service.slug] || {
            bg: 'bg-[#FAF5EF]',
            chevron: 'text-[#521D2B]',
            subtext: service.shortDescription,
          };
          const detailUrl = `/services/${service.slug}`;

          return (
            <Link
              key={service.id}
              href={detailUrl}
              className={`group relative flex items-stretch justify-between ${config.bg} rounded-2xl overflow-hidden shadow-xs hover:shadow-md active:scale-[0.985] transition-all duration-200 min-h-[92px] sm:min-h-[104px] border border-black/5`}
            >
              {/* Left Content Area (58% width) */}
              <div className="w-[58%] sm:w-[60%] p-3.5 sm:p-4 flex flex-col justify-center text-left">
                <div className="flex items-center gap-1">
                  <h3 className="text-[14px] sm:text-base font-serif font-bold text-[#211A19] group-hover:text-[#521D2B] transition-colors leading-tight">
                    {service.name}
                  </h3>
                  <ChevronDown size={14} className={`${config.chevron} opacity-80 shrink-0 group-hover:translate-y-0.5 transition-transform`} />
                </div>

                <p className="text-[11px] text-[#57534E] mt-1 line-clamp-1 leading-snug font-normal">
                  {config.subtext}
                </p>
              </div>

              {/* Right Photo Area: Signature Arched Semi-Circle Shape (42% width) */}
              <div className="w-[42%] sm:w-[40%] relative min-h-[92px] sm:min-h-[104px] rounded-l-full overflow-hidden shadow-[-4px_0_12px_rgba(0,0,0,0.06)] shrink-0">
                <Image
                  src={service.image || '/images/services/wedding-planning-decor.jpg'}
                  alt={service.name}
                  fill
                  sizes="45vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* =========================================================================
          DESKTOP VIEW: Rich 3-Column Luxury Grid
          ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {displayServices.map((service) => {
          const detailUrl = `/services/${service.slug}`;

          return (
            <div
              key={service.id}
              className="group bg-white rounded-2xl border border-[#E8DFD3] hover:border-[#521D2B]/40 shadow-[0_4px_20px_rgba(33,26,25,0.05)] hover:shadow-[0_12px_36px_rgba(82,29,43,0.12)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#FAF7F2]">
                <Image
                  src={service.image || '/images/services/wedding-planning-decor.jpg'}
                  alt={service.name}
                  fill
                  sizes="(max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Category Pill */}
                <span className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-[#521D2B] px-3 py-1 rounded-full shadow-xs border border-[#E8DFD3]">
                  {service.categoryTag}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#211A19] group-hover:text-[#521D2B] transition-colors leading-snug">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#57534E] mt-2 leading-relaxed line-clamp-2">
                    {service.shortDescription}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4 pt-3 border-t border-[#F0EAE1] space-y-2 text-xs">
                    {service.deliverables.slice(0, 2).map((d, i) => (
                      <div key={i} className="flex items-start gap-2 text-[#44403C]">
                        <Check size={14} className="text-[#521D2B] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{d.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between">
                  <Link
                    href={detailUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#521D2B] hover:text-[#671024] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explore Service Details</span>
                    <ArrowRight size={13} />
                  </Link>

                  <Link
                    href="/contact"
                    className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-[#DDD3C5] bg-[#FAF7F2] hover:bg-[#521D2B] hover:text-white transition-colors"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
