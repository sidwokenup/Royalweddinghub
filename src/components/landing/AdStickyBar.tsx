'use client';

import React from 'react';
import { Phone, MessageCircle, CalendarCheck } from 'lucide-react';
import { getTelUrl, BUSINESS_INFO } from '@/lib/contact';
import { generateWhatsAppLink } from '@/lib/whatsapp';

interface AdStickyBarProps {
  onOpenQuoteModal: () => void;
}

export function AdStickyBar({ onOpenQuoteModal }: AdStickyBarProps) {
  const whatsappUrl = generateWhatsAppLink({
    service: 'Lucknow Wedding Venues & Planning',
    customMessage:
      'Hello Royal Wedding Hub! I am looking for wedding venues and planning in Lucknow. Please share quotations and date availability.',
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 border-t border-[#E8DFD3] backdrop-blur-xl px-4 py-2.5 sm:hidden shadow-[0_-4px_20px_rgba(33,26,25,0.08)]">
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Call Now */}
        <a
          href={getTelUrl()}
          className="flex flex-col items-center justify-center gap-1 bg-white border border-[#DDD3C5] rounded-xl py-2 text-[#211A19] active:scale-95 transition-transform shadow-xs"
        >
          <Phone size={14} className="text-[#521D2B]" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Call Concierge</span>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 bg-[#25D366]/15 border border-[#25D366]/30 rounded-xl py-2 text-[#166534] active:scale-95 transition-transform shadow-xs"
        >
          <MessageCircle size={14} className="fill-[#25D366] text-transparent" />
          <span className="text-[10px] uppercase font-bold tracking-wider">WhatsApp</span>
        </a>

        {/* Instant Quote */}
        <button
          onClick={onOpenQuoteModal}
          className="flex flex-col items-center justify-center gap-1 bg-[#521D2B] text-white rounded-xl py-2 active:scale-95 transition-transform shadow font-bold"
        >
          <CalendarCheck size={14} />
          <span className="text-[10px] uppercase font-bold tracking-wider">Get Quote</span>
        </button>
      </div>
    </div>
  );
}

