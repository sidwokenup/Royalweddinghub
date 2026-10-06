import { Phone, MessageCircle, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { BUSINESS_INFO, getTelUrl, getMailtoUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

function InstagramIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="relative w-full py-20 sm:py-28 px-4 sm:px-6 md:px-8 bg-[#0d0907] text-white border-t border-[#f3e5d8]/15">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          {/* Left Column: Brand & Editorial Contact Statement */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#d4af37] font-medium block">
              REACH OUT ANYTIME
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl display-text font-normal text-white leading-tight">
              Begin Your Royal Journey.
            </h2>
            <p className="text-xs sm:text-sm md:text-base font-light text-[#faf9f6]/75 leading-relaxed">
              Whether you are planning a grand wedding at a heritage palace or an intimate celebration, our 24/7 desk in Lucknow is ready to assist you.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={getTelUrl()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.2em] uppercase text-white bg-white/[0.1] hover:bg-white/[0.2] border border-[#f3e5d8]/40 hover:border-[#f3e5d8] transition-all"
                aria-label={`Call ${BUSINESS_INFO.displayPhone}`}
              >
                <Phone size={13} className="text-[#f3e5d8]" />
                <span>CALL NOW</span>
              </a>

              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.2em] uppercase text-white bg-[#25D366]/90 hover:bg-[#25D366] transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)]"
                aria-label="WhatsApp Us"
              >
                <MessageCircle size={14} />
                <span>WHATSAPP US</span>
              </a>

              <a
                href={getMailtoUrl()}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.18em] uppercase text-white/80 hover:text-white bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/30 transition-all"
                aria-label="Email Us"
              >
                <Mail size={13} className="text-[#f3e5d8]" />
                <span>EMAIL US</span>
              </a>
            </div>

            {/* Instagram Link (Section 19) */}
            <div className="pt-4 border-t border-white/[0.08]">
              <a
                href={BUSINESS_INFO.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-xs tracking-[0.16em] uppercase text-[#f3e5d8] hover:text-white transition-colors"
              >
                <InstagramIcon size={15} className="text-[#d4af37]" />
                <span>Follow our celebrations {BUSINESS_INFO.instagram.handle}</span>
                <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: Verified Business Information Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Phone & Lead Desk */}
            <div className="p-6 rounded-[2px] bg-white/[0.03] border border-white/[0.07] hover:border-[#f3e5d8]/30 transition-all">
              <div className="w-10 h-10 rounded-[2px] bg-[#f3e5d8]/10 text-[#f3e5d8] flex items-center justify-center mb-4">
                <Phone size={18} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] block mb-1">
                PRIMARY LEAD &amp; WHATSAPP
              </span>
              <p className="text-base sm:text-lg font-normal display-text text-white mb-1">
                {BUSINESS_INFO.displayPhone}
              </p>
              <p className="text-xs font-light text-white/60">
                Direct access to wedding planners &amp; quick estimates.
              </p>
            </div>

            {/* Availability */}
            <div className="p-6 rounded-[2px] bg-white/[0.03] border border-white/[0.07] hover:border-[#f3e5d8]/30 transition-all">
              <div className="w-10 h-10 rounded-[2px] bg-[#f3e5d8]/10 text-[#f3e5d8] flex items-center justify-center mb-4">
                <Clock size={18} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] block mb-1">
                CONCIERGE DESK HOURS
              </span>
              <p className="text-base sm:text-lg font-normal display-text text-white mb-1">
                24 Hours / 7 Days
              </p>
              <p className="text-xs font-light text-white/60">
                Always available for couple consultations and event emergencies.
              </p>
            </div>

            {/* Address */}
            <div className="p-6 rounded-[2px] bg-white/[0.03] border border-white/[0.07] hover:border-[#f3e5d8]/30 transition-all sm:col-span-2">
              <div className="w-10 h-10 rounded-[2px] bg-[#f3e5d8]/10 text-[#f3e5d8] flex items-center justify-center mb-4">
                <MapPin size={18} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4af37] block mb-1">
                OFFICE &amp; STUDIO LOCATION
              </span>
              <p className="text-sm sm:text-base font-normal text-white mb-1">
                {BUSINESS_INFO.address.full}
              </p>
              <p className="text-xs font-light text-white/60">
                Ashiyana LDA Colony, Kanpur Road, Lucknow, Uttar Pradesh
              </p>
            </div>
          </div>
        </div>

        {/* Minimal Editorial Footer */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs font-light text-white/50 gap-4">
          <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</p>
          <p className="tracking-wide">
            Crafting royal memories across Lucknow &amp; destination palaces.
          </p>
        </div>
      </div>
    </section>
  );
}
