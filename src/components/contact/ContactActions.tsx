"use client";

import { ArrowDown, Phone, MessageCircle } from "lucide-react";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface ContactActionsProps {
  showWhatsApp?: boolean;
  className?: string;
}

export function ContactActions({ showWhatsApp = true, className = "" }: ContactActionsProps) {
  const handleScrollToEnquiry = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("enquiry-suite");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full ${className}`}>
      {/* Primary Action: Begin Your Enquiry */}
      <a
        href="#enquiry-suite"
        onClick={handleScrollToEnquiry}
        className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 h-11 sm:h-12 rounded-[2px] text-[11px] sm:text-xs font-medium tracking-[0.18em] uppercase text-[#FAF7F2] bg-[#521D2B] hover:bg-[#3D1520] transition-all duration-300 shadow-[0_6px_20px_rgba(82,29,43,0.2)] border border-[#521D2B] whitespace-nowrap shrink-0"
      >
        <span className="whitespace-nowrap">Begin Your Enquiry</span>
        <ArrowDown size={13} className="text-[#D6B56D] group-hover:translate-y-0.5 transition-transform duration-300 shrink-0" />
      </a>

      {/* Secondary Action: Speak With Our Team */}
      <a
        href={getTelUrl()}
        className="inline-flex items-center justify-center gap-2 px-4.5 sm:px-5 h-11 sm:h-12 rounded-[2px] text-[11px] sm:text-xs font-medium tracking-[0.18em] uppercase text-[#211A19] bg-white hover:bg-[#FAF7F2] border border-[#D8CBBE] hover:border-[#521D2B] transition-all duration-300 whitespace-nowrap shrink-0 shadow-sm"
        aria-label={`Call concierge team at ${BUSINESS_INFO.displayPhone}`}
      >
        <Phone size={13} className="text-[#521D2B] shrink-0" />
        <span className="whitespace-nowrap">Speak With Our Team</span>
      </a>

      {/* Brand-Harmonized WhatsApp Consultation */}
      {showWhatsApp && (
        <a
          href={generateWhatsAppLink({
            customMessage: "Hello Royal Weddinghub, I would like to schedule a private wedding consultation in Lucknow.",
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4.5 sm:px-5 h-11 sm:h-12 rounded-[2px] text-[11px] sm:text-xs font-medium tracking-[0.18em] uppercase text-[#211A19] bg-[#FAF7F2] hover:bg-white border border-[#D8CBBE] hover:border-[#25D366] transition-all duration-300 whitespace-nowrap shrink-0 shadow-sm"
          aria-label="Direct WhatsApp Consultation with Wedding Concierge"
        >
          <MessageCircle size={14} className="text-[#25D366] shrink-0" />
          <span className="whitespace-nowrap">WhatsApp Desk</span>
        </a>
      )}
    </div>
  );
}
