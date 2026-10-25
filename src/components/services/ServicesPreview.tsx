"use client";

import Link from "next/link";
import { Crown, Building2, Camera, Utensils, Mic2, Music, Sparkles, Palette, ArrowRight } from "lucide-react";
import { useScrollTo } from "@/animations/scroll/LenisProvider";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: typeof Crown;
}

const SERVICES: ServiceItem[] = [
  {
    id: "full-planning",
    name: "Complete Wedding Planning",
    category: "Full Production",
    description: "End-to-end management, guest hospitality, timeline curation, and seamless execution.",
    icon: Crown,
  },
  {
    id: "venue-selection",
    name: "Royal Venue Selection",
    category: "Heritage & Palaces",
    description: "Exclusive access to Lucknow's most prestigious royal lawns, heritage palaces, and luxury resorts.",
    icon: Building2,
  },
  {
    id: "photography",
    name: "Cinematic Photography",
    category: "Visual Storytelling",
    description: "Award-winning editorial photography and high-fashion wedding cinema films.",
    icon: Camera,
  },
  {
    id: "catering",
    name: "Royal Awadhi & Global Catering",
    category: "Culinary Experiences",
    description: "Authentic Nawabi Dastarkhwan, bespoke royal banquets, and modern global gastronomy.",
    icon: Utensils,
  },
  {
    id: "celebrity-artists",
    name: "Celebrity Singer & Artists",
    category: "Star Performances",
    description: "Curated headliners, Bollywood playback artists, and high-energy live celebrity bands.",
    icon: Mic2,
  },
  {
    id: "sufi-artists",
    name: "Sufi & Qawwali Ensembles",
    category: "Soulful Evenings",
    description: "Enchanting traditional Sufi singers, classical sarangi, and mystical musical nights.",
    icon: Music,
  },
  {
    id: "decor-design",
    name: "Bespoke Decor & Experiences",
    category: "Atmosphere & Floral",
    description: "Immersive theme sets, signature floral mandaps, and architectural light choreography.",
    icon: Palette,
  },
  {
    id: "entertainment",
    name: "Entertainment & Sangeet Choreography",
    category: "Celebration",
    description: "Specialized dance direction, anchor management, pyrotechnics, and DJ soundscapes.",
    icon: Sparkles,
  },
];

export function ServicesPreview() {
  const scrollTo = useScrollTo();

  const handleSelectService = (serviceName: string) => {
    scrollTo("#contact", { duration: 1.4, offset: -20 });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("select_wedding_service", { detail: { service: serviceName } }));
    }
  };

  return (
    <section id="services" className="relative w-full py-20 sm:py-28 px-4 sm:px-6 md:px-8 bg-[#0a0705] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <small className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#d4af37] font-medium block mb-3">
            WHAT WE ORCHESTRATE
          </small>
          <h2 className="text-3xl sm:text-4xl md:text-5xl display-text font-normal text-white leading-tight mb-4">
            We Handle Everything.
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-light text-[#faf9f6]/70 leading-relaxed max-w-xl mx-auto">
            From single bespoke requirements to complete royal wedding management in Lucknow, our 10+ years of relationships ensure flawless delivery.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative p-6 rounded-[2px] bg-white/[0.02] border border-white/[0.07] hover:border-[#f3e5d8]/40 hover:bg-white/[0.05] transition-all duration-400 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-[2px] bg-[#f3e5d8]/10 text-[#f3e5d8] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-[#d4af37]/80 block mb-1">
                    {service.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-normal display-text text-white mb-2 group-hover:text-[#f3e5d8] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs font-light text-white/60 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <button
                    onClick={() => handleSelectService(service.name)}
                    className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#f3e5d8] hover:text-white font-medium cursor-pointer transition-colors"
                  >
                    <span>Inquire</span>
                    <ArrowRight size={12} />
                  </button>
                  <a
                    href={generateWhatsAppLink({ service: service.name })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-[0.16em] text-white/40 hover:text-[#25D366] transition-colors"
                  >
                    WhatsApp →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-[2px] text-xs font-medium tracking-[0.24em] uppercase text-white bg-white/[0.08] hover:bg-white/[0.16] border border-[#f3e5d8]/40 hover:border-[#f3e5d8]/80 backdrop-blur-md transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.3)] cursor-pointer"
          >
            <span>Explore All Specialized Services</span>
            <ArrowRight size={14} className="text-[#f3e5d8]" />
          </Link>
          <button
            onClick={() => handleSelectService("Complete Wedding Planning")}
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-[2px] text-xs font-medium tracking-[0.24em] uppercase text-[#d4af37] hover:text-white bg-black/40 hover:bg-black/60 border border-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-300 cursor-pointer"
          >
            <span>Plan My Wedding With Us</span>
            <ArrowRight size={14} className="text-[#d4af37]" />
          </button>
        </div>
      </div>
    </section>
  );
}
