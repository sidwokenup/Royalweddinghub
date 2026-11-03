'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, MapPin, Phone, Mail, Award, Clock } from 'lucide-react';
import { Venue } from '@/types/venue';
import { AdLandingNavbar } from './AdLandingNavbar';
import { AdVenueFilterEngine } from './AdVenueFilterEngine';
import { AdServicesSection } from './AdServicesSection';
import { AdQuotationModal, ModalContext } from './AdQuotationModal';
import { AdVenueCompareModal } from './AdVenueCompareModal';
import { AdStickyBar } from './AdStickyBar';
import { BUSINESS_INFO, getTelUrl, getMailtoUrl } from '@/lib/contact';

interface AdLandingPageProps {
  venues: Venue[];
  pageType: 'venues' | 'planner' | 'management';
  canonicalUrl: string;
}

export function AdLandingPage({ venues, pageType, canonicalUrl }: AdLandingPageProps) {
  const [modalContext, setModalContext] = useState<ModalContext | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareVenues, setCompareVenues] = useState<Venue[]>([]);

  const handleOpenQuoteModal = (context?: ModalContext) => {
    setModalContext(context || null);
    setIsQuoteModalOpen(true);
  };

  const handleOpenCompareModal = (selectedVenues: Venue[]) => {
    setCompareVenues(selectedVenues);
    setIsCompareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F3ED] text-[#211A19] font-sans selection:bg-[#521D2B] selection:text-white">
      {/* 1. High-Converting Header */}
      <AdLandingNavbar onOpenQuoteModal={handleOpenQuoteModal} />

      {/* 2. Interactive Venue Filter & Comparison Engine */}
      <main>
        <AdVenueFilterEngine
          initialVenues={venues}
          onOpenQuoteModal={handleOpenQuoteModal}
          onOpenCompareModal={handleOpenCompareModal}
          pageType={pageType}
        />

        {/* 3. Value Proposition & Trust Guarantees */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#521D2B] font-mono bg-[#521D2B]/8 px-3 py-1 rounded-full border border-[#521D2B]/15 mb-2 font-medium">
              The Nawabi Concierge Standard
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#211A19]">
              Why Discerning Families Trust Royal Wedding Hub
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="p-6 rounded-2xl bg-white border border-[#E8DFD3] shadow-[0_4px_20px_rgba(33,26,25,0.04)] hover:border-[#521D2B]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#521D2B]/8 text-[#521D2B] flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <Award size={20} />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#211A19]">32+ Verified Lucknow Settings</h4>
              <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                Every palace, lawn, and resort is personally verified for physical capacity, acoustics, bridal suites, and backup generators.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8DFD3] shadow-[0_4px_20px_rgba(33,26,25,0.04)] hover:border-[#521D2B]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#521D2B]/8 text-[#521D2B] flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <ShieldCheck size={20} />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#211A19]">Direct Venue Relationship Pricing</h4>
              <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                Guaranteed transparent rates with zero inflated middleman markups on auspicious muhurat dates and weekend slots.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8DFD3] shadow-[0_4px_20px_rgba(33,26,25,0.04)] hover:border-[#521D2B]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#521D2B]/8 text-[#521D2B] flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <Clock size={20} />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#211A19]">1-Hour Quotation Turnaround</h4>
              <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                Receive customized proposals with per-plate catering, mandap decor tiers, and room buyouts within 60 minutes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8DFD3] shadow-[0_4px_20px_rgba(33,26,25,0.04)] hover:border-[#521D2B]/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#521D2B]/8 text-[#521D2B] flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <MapPin size={20} />
              </div>
              <h4 className="text-sm font-serif font-bold text-[#211A19]">Guided Site Walkthroughs</h4>
              <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                Accompanied site visits with our senior concierge to evaluate guest flow, kitchen docks, barat staging, and guest valet.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Complete Services Showcase */}
        <AdServicesSection onOpenQuoteModal={handleOpenQuoteModal} />
      </main>

      {/* 5. Luxury Heritage Footer */}
      <footer className="w-full bg-[#EFE8DE] border-t border-[#DDD3C5] py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#57534E]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.webp"
              alt="Royal Wedding Hub Logo"
              width={30}
              height={30}
              className="h-8 w-auto object-contain"
            />
            <div>
              <span className="font-serif text-sm font-bold uppercase tracking-widest text-[#211A19]">
                Royal Wedding Hub
              </span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-[#78716C] font-mono">
                Lucknow Concierge Desk
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-wider font-medium text-[#44403C]">
            <a href={getTelUrl()} className="hover:text-[#521D2B] transition-colors flex items-center gap-1.5">
              <Phone size={12} className="text-[#521D2B]" /> {BUSINESS_INFO.displayPhone}
            </a>
            <a href={getMailtoUrl()} className="hover:text-[#521D2B] transition-colors flex items-center gap-1.5">
              <Mail size={12} className="text-[#521D2B]" /> {BUSINESS_INFO.email}
            </a>
            <Link href="/privacy" className="hover:text-[#521D2B] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#521D2B] transition-colors">
              Terms of Service
            </Link>
          </div>

          <p className="text-[11px] text-[#78716C]">
            © {new Date().getFullYear()} Royal Wedding Hub. SS 388, Ashiyana LDA Colony, Kanpur Road, Lucknow, UP.
          </p>
        </div>
      </footer>

      {/* 6. Quotation Modal */}
      <AdQuotationModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        context={modalContext}
      />

      {/* 7. Comparison Modal */}
      <AdVenueCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        venues={compareVenues}
        onSelectQuote={(venueName) => handleOpenQuoteModal({ venueName, type: 'quote' })}
      />

      {/* 8. Sticky Mobile Action Bar */}
      <AdStickyBar onOpenQuoteModal={() => handleOpenQuoteModal({ note: 'Sticky Mobile Bar Quote' })} />
    </div>
  );
}

