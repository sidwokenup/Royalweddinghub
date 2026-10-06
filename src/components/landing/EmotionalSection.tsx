"use client";

import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { useScrollTo } from "@/animations/scroll/LenisProvider";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function EmotionalSection() {
  const scrollTo = useScrollTo();

  const handlePlanClick = () => {
    scrollTo("#plan-wedding", { duration: 1.4, offset: -20 });
  };

  return (
    <section id="experience" className="relative w-full py-24 sm:py-36 px-4 sm:px-6 md:px-8 bg-[#0e0a08] text-white overflow-hidden border-t border-[#f3e5d8]/10">
      {/* Subtle ambient luxury backdrop glow */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_rgba(0,0,0,0)_70%)] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#d4af37] font-medium block mb-4 sm:mb-6">
          THE PHILOSOPHY OF ROYALTY
        </span>

        {/* Powerful Editorial Statements */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl display-text font-normal text-white leading-[1.15] mb-6 sm:mb-8">
          Every detail matters.<br />
          <span className="italic text-[#f3e5d8]">Because your wedding happens once.</span>
        </h2>

        <p className="text-sm sm:text-lg font-light text-white/80 max-w-xl mx-auto leading-relaxed mb-10 sm:mb-12">
          Tell us your vision. We&apos;ll take care of the rest — ensuring your families enjoy every moment while we choreograph perfection.
        </p>

        {/* Conversion Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          {/* Primary Action */}
          <button
            onClick={handlePlanClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-[2px] text-xs font-medium tracking-[0.24em] uppercase text-white bg-white/[0.12] hover:bg-white/[0.2] border border-[#f3e5d8]/50 hover:border-[#f3e5d8] backdrop-blur-md transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.3)] cursor-pointer"
          >
            <span>PLAN MY WEDDING</span>
            <ArrowRight size={14} className="text-[#f3e5d8]" />
          </button>

          {/* Quick Call */}
          <a
            href={getTelUrl()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[2px] text-xs font-medium tracking-[0.2em] uppercase text-white/90 bg-black/40 hover:bg-black/60 border border-white/20 hover:border-[#f3e5d8]/50 transition-all duration-300"
            aria-label={`Call ${BUSINESS_INFO.displayPhone}`}
          >
            <Phone size={13} className="text-[#f3e5d8]" />
            <span>CALL NOW</span>
          </a>

          {/* Direct WhatsApp */}
          <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[2px] text-xs font-medium tracking-[0.2em] uppercase text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 hover:border-[#25D366]/60 transition-all duration-300"
            aria-label="Direct WhatsApp Message"
          >
            <MessageCircle size={14} className="text-[#25D366]" />
            <span>WHATSAPP</span>
          </a>
        </div>
      </div>
    </section>
  );
}
