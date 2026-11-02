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
    <div className="min-h-screen bg-[#0d0907] text-[#FAF7F2] font-sans selection:bg-[#D6B56D] selection:text-[#140F0D]">
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
        <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="p-5 rounded-2xl bg-[#140F0D] border border-[#D6B56D]/15">
              <Award className="text-[#D6B56D] mb-3 mx-auto sm:mx-0" size={24} />
              <h4 className="text-sm font-serif font-bold text-[#FAF7F2]">32+ Verified Lucknow Settings</h4>
              <p className="text-xs text-[#B8ADA3] mt-1">
                Every palace, lawn, and resort is personally verified for physical capacity, acoustics, and power backup.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#140F0D] border border-[#D6B56D]/15">
              <ShieldCheck className="text-[#D6B56D] mb-3 mx-auto sm:mx-0" size={24} />
              <h4 className="text-sm font-serif font-bold text-[#FAF7F2]">Direct Venue Relationship Pricing</h4>
              <p className="text-xs text-[#B8ADA3] mt-1">
                Guaranteed transparent rates with zero inflated broker markups on muhurat and weekend dates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#140F0D] border border-[#D6B56D]/15">
              <Clock className="text-[#D6B56D] mb-3 mx-auto sm:mx-0" size={24} />
              <h4 className="text-sm font-serif font-bold text-[#FAF7F2]">1-Hour Quotation Turnaround</h4>
              <p className="text-xs text-[#B8ADA3] mt-1">
                Receive customized packages including catering, mandap decor, and room buyouts within 60 minutes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#140F0D] border border-[#D6B56D]/15">
              <MapPin className="text-[#D6B56D] mb-3 mx-auto sm:mx-0" size={24} />
              <h4 className="text-sm font-serif font-bold text-[#FAF7F2]">Guided Site Walkthroughs</h4>
              <p className="text-xs text-[#B8ADA3] mt-1">
                Accompanied site visits with our senior concierge to evaluate guest flow, kitchen docks, and staging.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Complete Services Showcase */}
        <AdServicesSection onOpenQuoteModal={handleOpenQuoteModal} />
      </main>

      {/* 5. Minimal Luxury Footer */}
      <footer className="w-full bg-[#140F0D] border-t border-[#D6B56D]/20 py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#A89F91]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.webp"
              alt="Royal Wedding Hub Logo"
              width={28}
              height={28}
              className="h-7 w-auto object-contain"
            />
            <span className="font-serif text-sm font-bold uppercase tracking-widest text-[#FAF7F2]">
              Royal Wedding Hub
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-wider text-[#FAF7F2]/80">
            <a href={getTelUrl()} className="hover:text-[#D6B56D] transition-colors flex items-center gap-1.5">
              <Phone size={12} className="text-[#D6B56D]" /> {BUSINESS_INFO.displayPhone}
            </a>
            <a href={getMailtoUrl()} className="hover:text-[#D6B56D] transition-colors flex items-center gap-1.5">
              <Mail size={12} className="text-[#D6B56D]" /> {BUSINESS_INFO.email}
            </a>
            <Link href="/privacy" className="hover:text-[#D6B56D] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#D6B56D] transition-colors">
              Terms of Service
            </Link>
          </div>

          <p className="text-[11px] text-[#6B635B]">
            © {new Date().getFullYear()} Royal Wedding Hub. Hazratganj Luxury Corridor, Lucknow, UP.
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
