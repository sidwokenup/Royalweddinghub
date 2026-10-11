"use client";

import React from "react";
import { MessageCircle, Phone } from "lucide-react";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface VenueStickyBottomBarProps {
  venueName: string;
  venueCity?: string;
}

export function VenueStickyBottomBar({ venueName, venueCity = "Lucknow" }: VenueStickyBottomBarProps) {
  const whatsappUrl = generateWhatsAppLink({
    service: `Wedding Enquiry for ${venueName}`,
    customMessage: `Hello Royal Weddinghub! I would like to check availability and package pricing for ${venueName} (${venueCity}) for my wedding.`,
  });

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-xl border-t border-[#E5DDD2] shadow-[0_-8px_24px_rgba(33,26,25,0.08)] animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2 max-w-lg mx-auto">
        {/* Call Concierge */}
        <a
          href={getTelUrl(BUSINESS_INFO.primaryPhone)}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#FAF7F2] border border-[#E5DDD2] text-[#211A19] text-xs font-semibold uppercase tracking-wider hover:bg-[#F2ECE3] transition-colors"
          aria-label="Call Royal Weddinghub Concierge"
        >
          <Phone className="w-3.5 h-3.5 text-[#521D2B]" />
          <span>Call Us</span>
        </a>

        {/* WhatsApp Direct Enquiry */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-[2] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-[#1EBE5D] transition-colors"
          aria-label={`Enquire about ${venueName} on WhatsApp`}
        >
          <MessageCircle className="w-4 h-4 fill-white text-transparent" />
          <span>WhatsApp Enquiry</span>
        </a>
      </div>
    </div>
  );
}
