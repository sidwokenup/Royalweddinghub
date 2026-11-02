'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Check, Send } from 'lucide-react';
import { SERVICES_DATA } from '@/data/services';
import { ModalContext } from './AdQuotationModal';

interface AdServicesSectionProps {
  onOpenQuoteModal: (context: ModalContext) => void;
}

export function AdServicesSection({ onOpenQuoteModal }: AdServicesSectionProps) {
  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3] bg-[#FAF7F2]">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#521D2B] font-mono bg-[#521D2B]/8 px-3.5 py-1.5 rounded-full border border-[#521D2B]/20 mb-3 font-semibold">
          <Sparkles size={12} />
          End-to-End Royal Orchestration
        </span>

        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#211A19]">
          Artisan Wedding Services in Lucknow
        </h2>

        <p className="text-xs sm:text-sm text-[#57534E] mt-2.5 leading-relaxed">
          Beyond venue curation, Royal Wedding Hub delivers full bespoke wedding planning, Nawabi decor, master khansama banquets, and fine-art 4K cinema.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {SERVICES_DATA.slice(0, 6).map((service) => {
          const detailUrl =
            service.slug === 'wedding-venues'
              ? '/venues'
              : `/services/${service.slug}`;

          return (
            <div
              key={service.id}
              className="group bg-white border border-[#E8DFD3] hover:border-[#521D2B]/40 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(33,26,25,0.04)] hover:shadow-[0_10px_30px_rgba(82,29,43,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Badge */}
              <div className="relative h-48 w-full overflow-hidden bg-[#EFE8DE]">
                <Image
                  src={service.image || '/images/services/wedding-planning-decor.jpg'}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-white/95 backdrop-blur-xs text-[#521D2B] font-bold px-3 py-1 rounded-full shadow-xs border border-[#E8DFD3] font-mono">
                  {service.categoryTag}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#211A19] group-hover:text-[#521D2B] transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed line-clamp-2">
                    {service.shortDescription}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4 space-y-1.5 border-t border-[#E8DFD3] pt-3 text-[11px]">
                    {service.deliverables.slice(0, 2).map((d, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[#44403C]">
                        <Check size={12} className="text-[#521D2B] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{d.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-5 pt-3 border-t border-[#E8DFD3] flex items-center justify-between gap-3">
                  <button
                    onClick={() =>
                      onOpenQuoteModal({
                        venueName: `Service: ${service.name}`,
                        note: `Interested in ${service.name}`,
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#521D2B] hover:text-white bg-[#521D2B]/8 hover:bg-[#521D2B] px-3.5 py-1.5 rounded-lg border border-[#521D2B]/20 transition-all"
                  >
                    <Send size={11} />
                    <span>Get Quote</span>
                  </button>

                  <Link
                    href={detailUrl}
                    className="inline-flex items-center gap-1 text-xs text-[#57534E] hover:text-[#521D2B] font-medium transition-colors group-hover:translate-x-0.5"
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

