import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { VenueAmbientBackground } from "@/components/venues/VenueAmbientBackground";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesMobileList } from "@/components/services/ServicesMobileList";
import { ServicesDesktopGrid } from "@/components/services/ServicesDesktopGrid";
import { getServices } from "@/lib/services";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Luxury Wedding Planning Services in Lucknow | Royal Wedding Hub",
  description:
    "Explore bespoke royal wedding services in Lucknow by Royal Wedding Hub: luxury venues, bespoke decor & mandaps, fine-art cinema, royal catering, and artist management.",
  openGraph: {
    title: "Luxury Wedding Planning Services in Lucknow | Royal Wedding Hub",
    description:
      "Explore bespoke royal wedding services in Lucknow: luxury venues, bespoke decor & mandaps, fine-art cinema, royal catering, and artist management.",
    url: "https://royalweddinghub.com/services",
    siteName: "Royal Wedding Hub",
    images: [
      {
        url: "/images/services/wedding-planning-decor.jpg",
        width: 1280,
        height: 720,
        alt: "Royal Wedding Hub Luxury Services in Lucknow",
      },
    ],
  },
};

export default function ServicesPage() {
  const services = getServices();

  const generalWhatsappUrl = generateWhatsAppLink({
    service: "Full Wedding Planning & Services",
    customMessage:
      "Hello Royal Wedding Hub! I am planning an upcoming wedding in Lucknow and would like to consult with your wedding planning team on your curated services.",
  });

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start w-full bg-[#F7F3ED] text-[#211A19] overflow-x-hidden">
      {/* Shared Ambient Warm Glow Background */}
      <VenueAmbientBackground />

      {/* Global Navigation */}
      <Navbar />

      {/* Section 1: Editorial Introduction Hero */}
      <ServicesHero />

      {/* Section 2: Service Disciplines Catalog */}
      <section id="services-catalog" className="w-full pb-20 sm:pb-28">
        {/* Mobile View: Stacked Image-Led Editorial Panels (inspired by client reference) */}
        <ServicesMobileList services={services} />

        {/* Desktop View: Luxury Asymmetric Editorial Grid */}
        <ServicesDesktopGrid services={services} />
      </section>

      {/* Section 3: Bespoke Master Consultation Callout */}
      <section className="w-full py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-br from-[#521D2B] via-[#431622] to-[#2B0E16] text-[#FAF7F2] border-t border-[#D6B56D]/30 relative overflow-hidden">
        {/* Subtle Decorative Editorial Ring */}
        <div 
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/5 pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-[#D6B56D]/10 pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="max-w-4xl mx-auto text-center space-y-7 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B56D]" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2] font-medium">
              COMPLETE WEDDING DIRECTION
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-[#FAF7F2] leading-tight">
            Planning a Wedding in Lucknow or Beyond?
          </h2>

          <p className="text-sm sm:text-base font-light text-[#FAF7F2]/80 max-w-2xl mx-auto leading-relaxed">
            Whether you require a single specialized department like mandap architecture or an end-to-end royal wedding production, our concierge team is at your service.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#FAF7F2] text-[#521D2B] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white transition-all duration-300 shadow-lg group"
            >
              <span>Schedule Concierge Consultation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#25D366] text-white text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#1EBE5D] transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Planner</span>
            </a>
          </div>

          {/* Business Credentials */}
          <div className="pt-8 border-t border-white/10 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D6B56D]" />
              <span>100% Curated & Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Direct Call:</span>
              <a href={getTelUrl()} className="text-white font-medium hover:underline">
                {BUSINESS_INFO.displayPhone}
              </a>
            </div>
            <div>
              <span>Hazratganj, Lucknow</span>
            </div>
          </div>
        </div>
      </section>

      {/* Global Minimal Footer */}
      <footer className="w-full bg-[#211A19] text-[#FAF7F2]/70 py-10 px-6 border-t border-white/10 text-center text-xs space-y-2">
        <p className="tracking-widest uppercase text-white font-serif text-sm">
          Royal Wedding Hub
        </p>
        <p className="font-light text-white/50">
          Curating royal celebrations, palace venues, and bespoke wedding experiences across Lucknow.
        </p>
        <p className="text-[11px] text-white/30 pt-2">
          © {new Date().getFullYear()} Royal Wedding Hub Lucknow. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
