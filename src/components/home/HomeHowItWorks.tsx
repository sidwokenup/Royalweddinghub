'use client';

import React from 'react';
import { Compass, Palette, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  {
    step: '01',
    title: 'Curate & Walkthrough',
    description:
      'We shortlist verified Lucknow palace lawns, resorts, and banquet halls based on your exact guest count and budget. Our senior concierge accompanies you on private site inspections.',
    icon: Compass,
  },
  {
    step: '02',
    title: 'Design & Pre-Production',
    description:
      'Preview custom 3D floral mandap architecture, participate in master Khansama menu tastings, and plan 4K cinematic storylines with complete timeline choreography.',
    icon: Palette,
  },
  {
    step: '03',
    title: 'Flawless On-Day Execution',
    description:
      'A dedicated team of senior event directors oversees valet logistics, baraat entry coordination, vendor handoffs, and guest hospitality from the first muhurat to bidaai.',
    icon: ShieldCheck,
  },
];

export function HomeHowItWorks() {
  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#F7F3ED] border-t border-[#E8DFD3] select-none">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#521D2B] bg-[#521D2B]/8 px-3 py-1 rounded-full border border-[#521D2B]/15 font-semibold">
          The Concierge Standard
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#211A19]">
          How We Orchestrate Your Celebration
        </h2>
        <p className="text-sm sm:text-base text-[#57534E] font-normal leading-relaxed">
          Three structured stages ensuring complete transparency, zero inflated broker markups, and pure peace of mind.
        </p>
      </div>

      {/* 3-Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {STEPS.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E8DFD3] p-7 shadow-[0_4px_20px_rgba(33,26,25,0.04)] hover:shadow-[0_12px_32px_rgba(82,29,43,0.1)] hover:border-[#521D2B]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-serif font-bold text-[#521D2B]/20 font-mono">
                    {s.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#521D2B]/8 text-[#521D2B] flex items-center justify-center">
                    <IconComp size={20} />
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#211A19] mb-3">
                  {s.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F0EAE1]">
                <span className="text-xs font-semibold text-[#521D2B] flex items-center gap-1">
                  <span>Guaranteed Professionalism</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Strip */}
      <div className="mt-12 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#521D2B] hover:bg-[#671024] text-white text-xs uppercase tracking-wider font-semibold shadow-md transition-all hover:scale-102"
        >
          <span>Schedule Free Venue &amp; Planning Consultation</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

