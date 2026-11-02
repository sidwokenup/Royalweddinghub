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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#140F0D]/95 border-t border-[#D6B56D]/30 backdrop-blur-xl px-4 py-3 sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Call Now */}
        <a
          href={getTelUrl()}
          className="flex flex-col items-center justify-center gap-1 bg-white/5 border border-white/10 rounded-xl py-2 text-[#FAF7F2] active:scale-95 transition-transform"
        >
          <Phone size={14} className="text-[#D6B56D]" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Call Concierge</span>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 bg-[#25D366]/20 border border-[#25D366]/40 rounded-xl py-2 text-[#4ade80] active:scale-95 transition-transform"
        >
          <MessageCircle size={14} className="fill-[#25D366] text-transparent" />
          <span className="text-[10px] uppercase font-bold tracking-wider">WhatsApp</span>
        </a>

        {/* Instant Quote */}
        <button
          onClick={onOpenQuoteModal}
          className="flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-[#D6B56D] to-[#B89246] text-[#140F0D] rounded-xl py-2 active:scale-95 transition-transform shadow font-bold"
        >
          <CalendarCheck size={14} />
          <span className="text-[10px] uppercase font-extrabold tracking-wider">Get Quote</span>
        </button>
      </div>
    </div>
  );
}
