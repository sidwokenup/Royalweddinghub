"use client";

import { Phone, MessageCircle } from "lucide-react";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function MobileStickyBar() {
  return (
    <aside 
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#FAF7F2]/95 backdrop-blur-xl border-t border-[#E5DDD2] px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(33,26,25,0.08)]"
      aria-label="Instant Concierge Actions"
    >
      <div className="flex items-center gap-3 max-w-md mx-auto">
        {/* CALL NOW */}
        <a
          href={getTelUrl()}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-[2px] text-[11px] font-semibold tracking-[0.2em] uppercase text-[#211A19] bg-white active:bg-[#F7F3ED] border border-[#D8CBBE] shadow-sm transition-colors"
          aria-label={`Call ${BUSINESS_INFO.displayPhone}`}
        >
          <Phone size={13} className="text-[#521D2B]" />
          <span>Call Now</span>
        </a>

        {/* WHATSAPP ACTION */}
        <a
          href={generateWhatsAppLink({
            customMessage: "Hello Royal Wedding Hub, I would like to enquire about wedding planning services in Lucknow.",
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-[2px] text-[11px] font-semibold tracking-[0.2em] uppercase text-white bg-[#521D2B] active:bg-[#3D1520] border border-[#521D2B] shadow-sm transition-colors"
          aria-label="Direct WhatsApp Message to Concierge"
        >
          <MessageCircle size={14} className="text-[#25D366]" />
          <span>WhatsApp</span>
        </a>
      </div>
    </aside>
  );
}
