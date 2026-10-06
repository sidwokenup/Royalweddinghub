"use client";

import { Phone, MessageCircle } from "lucide-react";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function ContactActions() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      {/* CALL THE CONCIERGE */}
      <a
        href={getTelUrl()}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 min-h-[46px] rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-white bg-white/[0.08] hover:bg-white/[0.16] border border-[#f3e5d8]/40 hover:border-[#f3e5d8] transition-all shadow-sm"
        aria-label={`Call the Concierge at ${BUSINESS_INFO.displayPhone}`}
      >
        <Phone size={13} className="text-[#f3e5d8]" />
        <span>CALL THE CONCIERGE</span>
      </a>

      {/* WHATSAPP US */}
      <a
        href={generateWhatsAppLink({
          customMessage: "Hello Royal Weddinghub! I found you through your website and would like to discuss planning my wedding in Lucknow.",
        })}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 min-h-[46px] rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-white bg-[#25D366]/90 hover:bg-[#25D366] transition-all shadow-[0_4px_20px_rgba(37,211,102,0.25)]"
        aria-label="Direct WhatsApp Consultation"
      >
        <MessageCircle size={15} />
        <span>WHATSAPP US</span>
      </a>
    </div>
  );
}
