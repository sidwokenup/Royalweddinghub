import type { Metadata } from "next";
import { getAllVenues, getFeaturedVenue } from "@/lib/venues";
import { Navbar } from "@/components/navigation/Navbar";
import { VenueHero } from "@/components/venues/VenueHero";
import { VenueAmbientBackground } from "@/components/venues/VenueAmbientBackground";
import { VenueDiscoveryClient } from "@/components/venues/VenueDiscoveryClient";
import Link from "next/link";
import { Phone, MessageCircle, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Wedding Venues in Lucknow | Royal Wedding Hub",
  description:
    "Explore 32 handpicked luxury wedding venues in Lucknow — banquet halls, royal palace lawns, luxury resorts, and boutique wedding hotels with complete planning support.",
  openGraph: {
    title: "Wedding Venues in Lucknow | Royal Wedding Hub",
    description:
      "Explore 32 handpicked luxury wedding venues in Lucknow — banquet halls, royal palace lawns, luxury resorts, and boutique wedding hotels.",
    url: "https://royalweddinghub.com/venues",
    siteName: "Royal Wedding Hub",
    images: [
      {
        url: "/venues/santorini-resort-lucknow/thumbnail.jpg",
        width: 1280,
        height: 720,
        alt: "Luxury Wedding Venues in Lucknow - Royal Wedding Hub",
      },
    ],
  },
};

export default function VenuesPage() {
  const allVenues = getAllVenues();
  const featured = getFeaturedVenue();

  const generalWhatsappUrl = generateWhatsAppLink({
    service: "Venue Scouting & Planning",
    customMessage:
      "Hello Royal Wedding Hub! I am planning a wedding in Lucknow and would like to explore luxury venues and your full planning packages.",
  });

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start w-full bg-[#F7F3ED] text-[#211A19]">
      {/* Ambient Lighting & Luxury Glow Background */}
      <VenueAmbientBackground />

      {/* Global Navigation */}
      <Navbar />

      {/* Section A: Cinematic Venue Introduction Hero */}
      <VenueHero totalVenuesCount={allVenues.length} />

      {/* Section C, D, 6, 7: Interactive Discovery, Filters, Editorial Gallery & Spotlight */}
      <VenueDiscoveryClient initialVenues={allVenues} featuredVenue={featured} />

      {/* Section 10: Refined Closing Enquiry Experience */}
      <section className="w-full mt-16 sm:mt-24 py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-br from-[#521D2B] via-[#431622] to-[#2B0E16] text-[#FAF7F2] border-t border-[#D6B56D]/30 relative overflow-hidden">
        {/* Subtle Decorative Editorial Ring */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none select-none"
          aria-hidden="true" 
        />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D6B56D] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BESPOKE VENUE CONCIERGE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl display-text font-serif text-white font-normal leading-tight">
            Your Celebration Deserves <br className="hidden sm:inline" />
            <span className="italic text-[#F3E5D8]">the Perfect Setting.</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#FAF7F2]/80 max-w-xl mx-auto font-light leading-relaxed">
            Let our wedding planning team help you discover a venue that feels unmistakably yours.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#FAF7F2] text-[#521D2B] text-xs sm:text-sm uppercase tracking-widest font-semibold shadow-xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Plan My Wedding</span>
              <ArrowRight className="w-4 h-4 text-[#521D2B]" />
            </Link>

            <a
              href={generalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#FAF7F2] text-xs sm:text-sm uppercase tracking-widest font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Concierge</span>
            </a>

            <a
              href={getTelUrl(BUSINESS_INFO.primaryPhone)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-transparent hover:bg-white/5 border border-white/15 text-white/80 hover:text-white text-xs sm:text-sm uppercase tracking-widest font-light transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D6B56D]" />
              <span>{BUSINESS_INFO.displayPhone}</span>
            </a>
          </div>

          <div className="pt-10 text-xs text-white/50 flex flex-wrap justify-center items-center gap-4 border-t border-white/10 mt-12">
            <span>© {new Date().getFullYear()} Royal Wedding Hub</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D6B56D]" />
              SS 388, Ashiyana LDA Colony, Lucknow
            </span>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors underline">
              Private Concierge
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
