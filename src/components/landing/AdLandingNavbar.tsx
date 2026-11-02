'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageCircle, CalendarCheck } from 'lucide-react';
import { BUSINESS_INFO, getTelUrl } from '@/lib/contact';
import { generateWhatsAppLink } from '@/lib/whatsapp';

interface AdLandingNavbarProps {
  onOpenQuoteModal: (context?: { venueName?: string; note?: string }) => void;
}

export function AdLandingNavbar({ onOpenQuoteModal }: AdLandingNavbarProps) {
  const whatsappUrl = generateWhatsAppLink({
    service: 'Venue & Planning Quotation',
    customMessage:
      'Hello Royal Wedding Hub! I saw your Lucknow wedding venues & planning collection. I would like an instant quotation and availability check for my upcoming wedding.',
  });

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-[#0d0907]/95 border-b border-[#D6B56D]/20 backdrop-blur-md px-4 sm:px-6 py-3.5 transition-all shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <Image
            src="/logo.webp"
            alt="Royal Wedding Hub Logo"
            width={34}
            height={34}
            className="h-8 sm:h-9 w-auto object-contain drop-shadow"
            priority
          />
          <div>
            <span className="block text-sm sm:text-base font-serif font-bold tracking-widest uppercase text-[#FAF7F2] group-hover:text-[#D6B56D] transition-colors">
              Royal Wedding Hub
            </span>
            <span className="block text-[9px] uppercase tracking-[0.22em] text-[#D6B56D]/80 font-mono -mt-0.5">
              Lucknow Concierge
            </span>
          </div>
        </Link>

        {/* Quick Action Contact Desk */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Direct Phone */}
          <a
            href={getTelUrl()}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-medium tracking-wider text-[#FAF7F2]/90 hover:text-[#D6B56D] transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-[#D6B56D]/40"
            aria-label="Call Wedding Concierge"
          >
            <Phone size={13} className="text-[#D6B56D]" />
            <span>{BUSINESS_INFO.displayPhone}</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#4ade80] border border-[#25D366]/30 px-3 py-2 rounded-full transition-all"
            aria-label="WhatsApp Concierge"
          >
            <MessageCircle size={14} className="fill-[#25D366] text-transparent" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>

          {/* Fast Quotation CTA */}
          <button
            onClick={() => onOpenQuoteModal({ note: 'Navbar Request Quotation' })}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#D6B56D] to-[#B89246] hover:from-[#E3C57F] hover:to-[#C7A054] text-[#140F0D] px-3.5 sm:px-4 py-2 rounded-full shadow-md transition-all hover:scale-102 active:scale-98"
          >
            <CalendarCheck size={14} />
            <span>Get Instant Quote</span>
          </button>
        </div>
      </div>
    </header>
  );
}
