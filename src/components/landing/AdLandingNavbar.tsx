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
      'Hello Royal Wedding Hub! I saw your Lucknow wedding venues & planning collection. I would like an instant quotation and date availability check for my upcoming wedding.',
  });

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 border-b border-[#E8DFD3] backdrop-blur-md px-4 sm:px-6 py-3.5 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <Image
            src="/logo.webp"
            alt="Royal Wedding Hub Logo"
            width={34}
            height={34}
            className="h-8 sm:h-9 w-auto object-contain"
            priority
          />
          <div>
            <span className="block text-sm sm:text-base font-serif font-bold tracking-widest uppercase text-[#211A19] group-hover:text-[#521D2B] transition-colors">
              Royal Wedding Hub
            </span>
            <span className="block text-[9px] uppercase tracking-[0.22em] text-[#78716C] font-mono -mt-0.5">
              Lucknow Concierge
            </span>
          </div>
        </Link>

        {/* Quick Action Contact Desk */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Direct Phone */}
          <a
            href={getTelUrl()}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-[#44403C] hover:text-[#521D2B] transition-colors px-3 py-1.5 rounded-full border border-[#DDD3C5] bg-white/60 hover:bg-white"
            aria-label="Call Wedding Concierge"
          >
            <Phone size={13} className="text-[#521D2B]" />
            <span>{BUSINESS_INFO.displayPhone}</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#166534] border border-[#25D366]/30 px-3 py-1.5 rounded-full transition-all"
            aria-label="WhatsApp Concierge"
          >
            <MessageCircle size={14} className="fill-[#25D366] text-transparent" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>

          {/* Fast Quotation CTA */}
          <button
            onClick={() => onOpenQuoteModal({ note: 'Navbar Request Quotation' })}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-[#521D2B] hover:bg-[#671024] text-[#FAF7F2] px-3.5 sm:px-4 py-2 rounded-full shadow-xs transition-all hover:scale-102 active:scale-98"
          >
            <CalendarCheck size={13} />
            <span>Get Instant Quote</span>
          </button>
        </div>
      </div>
    </header>
  );
}
