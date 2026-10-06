import { Shield, Clock, MapPin, Award } from "lucide-react";
import { BUSINESS_INFO } from "@/lib/contact";

export function TrustStrip() {
  const highlights = [
    {
      icon: Award,
      title: "10+ Years",
      subtitle: "Of Royal Celebrations",
    },
    {
      icon: MapPin,
      title: "Lucknow Specialist",
      subtitle: "Ashiyana LDA Colony & Heritage Venues",
    },
    {
      icon: Clock,
      title: "24/7 Concierge",
      subtitle: "Always Accessible for Couples",
    },
    {
      icon: Shield,
      title: "Bespoke Perfection",
      subtitle: "From Intimate to Grand Palaces",
    },
  ];

  return (
    <section className="relative w-full py-16 sm:py-20 px-4 sm:px-6 md:px-8 bg-[#0d0907] border-y border-[#f3e5d8]/10 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Minimal Trust Statement */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <small className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#d4af37] font-medium block mb-3">
            VERIFIED LOCAL EXPERTISE
          </small>
          <h2 className="text-2xl sm:text-3xl md:text-4xl display-text font-normal text-white leading-tight mb-4">
            10+ Years of Creating Unforgettable Celebrations
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-light text-[#faf9f6]/75 leading-relaxed">
            {BUSINESS_INFO.tagline}. Based at {BUSINESS_INFO.address.line1}, {BUSINESS_INFO.address.line2}, Lucknow, we curate weddings with cultural richness and bespoke modern grandeur.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-5 sm:p-6 rounded-[2px] bg-white/[0.03] border border-white/[0.06] hover:border-[#f3e5d8]/30 hover:bg-white/[0.05] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f3e5d8]/10 text-[#f3e5d8] mb-3.5">
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <h3 className="text-sm sm:text-base font-medium tracking-wide text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs font-light text-white/60">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
