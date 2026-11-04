'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ServiceItem } from '@/types/service';

interface HomeServicesSectionProps {
  services: ServiceItem[];
}

export function HomeServicesSection({ services }: HomeServicesSectionProps) {
  // Take the primary 6 core disciplines
  const displayServices = services.filter((s) => s.slug !== 'wedding-venues').slice(0, 6);

  return (
    <section id="services" className="w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      {/* Section Header with Generous Breathing Room */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-14 border-b border-[#E8DFD3] pb-5 sm:pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#521D2B] bg-[#521D2B]/8 px-3.5 py-1 rounded-full border border-[#521D2B]/15 font-semibold">
            <Sparkles size={13} className="text-[#521D2B]" />
            Disciplines
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#211A19] mt-2.5 sm:mt-3 font-serif tracking-tight">
            Wedding Services
          </h2>
          <p className="text-xs sm:text-base text-[#57534E] mt-1.5 font-normal max-w-2xl leading-relaxed">
            From royal mandap decor and Awadhi banquets to 4K cinematic films — bespoke wedding services in Lucknow.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 bg-[#521D2B] hover:bg-[#671024] text-white text-xs font-semibold uppercase tracking-wider px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-full shadow-sm hover:shadow-md transition-all self-start md:self-auto shrink-0"
        >
          <span>View All Services</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* =========================================================================
          MOBILE VIEW: Breathable, High-Legibility 2-Column Visual Cards (No Micro-Text Clutter)
          ========================================================================= */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 md:hidden">
        {displayServices.map((service) => {
          const detailUrl = `/services/${service.slug}`;

          return (
            <Link
              key={service.id}
              href={detailUrl}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#181310] border border-[#E8DFD3] shadow-xs active:scale-[0.98] transition-all duration-300 flex flex-col justify-between p-3.5"
            >
              {/* High-Resolution Wedding Photography */}
              <Image
                src={service.image || '/images/services/wedding-planning-decor.jpg'}
                alt={service.name}
                fill
                sizes="50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Scrim for Flawless Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />

              {/* Top Tag & Arrow */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-white/90 text-[#521D2B] px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {service.categoryTag?.split(' ')[0] || 'Service'}
                </span>
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#521D2B] transition-colors">
                  <ArrowUpRight size={13} />
                </div>
              </div>

              {/* Bottom Bold, Easily Readable Title (15px-16px, Zero Tiny Clutter) */}
              <div className="relative z-10">
                <h3 className="text-[15px] sm:text-base font-serif font-bold text-white tracking-tight leading-tight drop-shadow-sm group-hover:text-[#F5E296] transition-colors">
                  {service.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>

      {/* =========================================================================
          DESKTOP VIEW: Clean 3-Column Luxury Cards
          ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {displayServices.map((service) => {
          const detailUrl = `/services/${service.slug}`;

          return (
            <div
              key={service.id}
              className="group bg-white rounded-3xl border border-[#E8DFD3] hover:border-[#521D2B]/40 shadow-[0_4px_20px_rgba(33,26,25,0.04)] hover:shadow-[0_12px_36px_rgba(82,29,43,0.12)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

                {/* Category Pill */}
                <span className="absolute top-3.5 left-3.5 text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-[#521D2B] px-3 py-1 rounded-full shadow-xs border border-[#E8DFD3]">
                  {service.categoryTag}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#211A19] group-hover:text-[#521D2B] transition-colors leading-snug">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#57534E] mt-2 leading-relaxed line-clamp-2">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Key Deliverables Highlights */}
                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="pt-2 border-t border-[#F2ECE3] space-y-1.5">
                    {service.deliverables.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#57534E]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]/60 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pricing & CTA */}
                <div className="pt-3 border-t border-[#F2ECE3] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C8070] font-mono block">
                      Starting Investment
                    </span>
                    <span className="text-sm font-semibold text-[#211A19]">
                      Bespoke Packages
                    </span>
                  </div>

                  <Link
                    href={detailUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#521D2B] hover:text-[#7A1D36] group-hover:translate-x-1 transition-all"
                  >
                    <span>Explore</span>
                    <ArrowRight size={13} />
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
