"use client";

import { Phone, MessageCircle } from "lucide-react";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function MobileStickyBar() {
  return (
    <aside 
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#0d0907]/90 backdrop-blur-lg border-t border-[#f3e5d8]/20 px-4 py-2.5 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
      aria-label="Instant Mobile Actions"
    >
      <div className="flex items-center gap-3 max-w-md mx-auto">
        {/* CALL NOW */}
        <a
          href={getTelUrl()}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-[2px] text-xs font-semibold tracking-[0.2em] uppercase text-white bg-white/[0.12] active:bg-white/[0.22] border border-[#f3e5d8]/40 shadow-sm"
          aria-label={`Call ${BUSINESS_INFO.displayPhone}`}
        >
          <Phone size={14} className="text-[#f3e5d8]" />
          <span>CALL NOW</span>
        </a>

        {/* WHATSAPP */}
        <a
          href={generateWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-[2px] text-xs font-semibold tracking-[0.2em] uppercase text-white bg-[#25D366] active:bg-[#20ba59] shadow-[0_2px_14px_rgba(37,211,102,0.4)]"
          aria-label="Direct WhatsApp Message"
        >
          <MessageCircle size={15} />
          <span>WHATSAPP</span>
        </a>
      </div>
    </aside>
  );
}
