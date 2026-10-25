import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Hero } from "@/components/hero/Hero";
import { VenueAmbientBackground } from "@/components/venues/VenueAmbientBackground";

// Services Page Components
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServicesMobileList } from "@/components/services/ServicesMobileList";
import { ServicesDesktopGrid } from "@/components/services/ServicesDesktopGrid";
import { getLiveServices } from "@/lib/services";

// Venues Page Components
import { VenueHero } from "@/components/venues/VenueHero";
import { VenueDiscoveryClient } from "@/components/venues/VenueDiscoveryClient";
import { getLiveVenues, getFeaturedVenue } from "@/lib/venues";

// About Page Components
import { AboutHero } from "@/components/about/AboutHero";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutPhilosophy } from "@/components/about/AboutPhilosophy";
import { AboutExperience } from "@/components/about/AboutExperience";
import { AboutTestimonials } from "@/components/about/AboutTestimonials";
import { AboutProcess } from "@/components/about/AboutProcess";
import { AboutCta } from "@/components/about/AboutCta";
import { getLiveTestimonials } from "@/lib/testimonials";

// Contact Page Components
import { ConciergeContact } from "@/components/contact/ConciergeContact";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Royal Wedding Hub | Luxury Wedding Planner & Curated Venues in Lucknow",
  description:
    "Royal Wedding Hub is Lucknow's premier luxury wedding planning and heritage venue concierge. Explore curated palaces, bespoke decor, royal catering, and verified consultation.",
};

export const revalidate = 60; // ISR cache revalidation every minute

export default async function Home() {
  const [services, allVenues, testimonials] = await Promise.all([
    getLiveServices(),
    getLiveVenues(),
    getLiveTestimonials(),
  ]);
  const featuredVenue = getFeaturedVenue();

  const servicesWhatsappUrl = generateWhatsAppLink({
    service: "Full Wedding Planning & Services",
    customMessage:
      "Hello Royal Wedding Hub! I am planning an upcoming wedding in Lucknow and would like to consult with your wedding planning team on your curated services.",
  });

  const venuesWhatsappUrl = generateWhatsAppLink({
    service: "Venue Scouting & Planning",
    customMessage:
      "Hello Royal Wedding Hub! I am planning a wedding in Lucknow and would like to explore luxury venues and your full planning packages.",
  });

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start w-full bg-[#0a0705] selection:bg-[#521D2B]/15 selection:text-[#521D2B] overflow-x-hidden">
      {/* Global Fixed Navigation */}
      <Navbar />

      {/* =========================================================================
          STAGE 1: HERO SECTION
          ========================================================================= */}
      <Hero />

      {/* =========================================================================
          STAGE 2: SERVICES SECTION (Exact Services Page Experience)
          ========================================================================= */}
      <section id="services" className="relative w-full bg-[#F7F3ED] text-[#211A19]">
        <VenueAmbientBackground />
        
        {/* Editorial Introduction Hero */}
        <ServicesHero />

        {/* Service Disciplines Catalog */}
        <section id="services-catalog" className="w-full pb-20 sm:pb-28">
          <ServicesMobileList services={services} />
          <ServicesDesktopGrid services={services} />
        </section>

        {/* Bespoke Master Consultation Callout */}
        <section className="w-full py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-br from-[#521D2B] via-[#431622] to-[#2B0E16] text-[#FAF7F2] border-t border-[#D6B56D]/30 relative overflow-hidden">
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
                href={servicesWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#25D366] text-white text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#1EBE5D] transition-all duration-300 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {BUSINESS_INFO.displayPhone}</span>
              </a>
            </div>
          </div>
        </section>
      </section>

      {/* =========================================================================
          STAGE 3: VENUES SECTION (Exact Venues Page Experience)
          ========================================================================= */}
      <section id="venues" className="relative w-full bg-[#F7F3ED] text-[#211A19]">
        <VenueAmbientBackground />

        {/* Cinematic Venue Introduction Hero */}
        <VenueHero totalVenuesCount={allVenues.length} />

        {/* Interactive Discovery, Filters, Editorial Gallery & Spotlight */}
        <VenueDiscoveryClient initialVenues={allVenues} featuredVenue={featuredVenue} />

        {/* Refined Closing Enquiry Experience */}
        <section className="w-full mt-16 sm:mt-24 py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-br from-[#521D2B] via-[#431622] to-[#2B0E16] text-[#FAF7F2] border-t border-[#D6B56D]/30 relative overflow-hidden">
          <div 
            className="absolute -top-28 -right-28 w-80 h-80 rounded-full border border-white/5 pointer-events-none" 
            aria-hidden="true" 
          />
          <div 
            className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full border border-[#D6B56D]/10 pointer-events-none" 
            aria-hidden="true" 
          />

          <div className="max-w-4xl mx-auto text-center space-y-7 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B56D]" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2] font-medium">
                EXCLUSIVE PALACE &amp; RESORT ACCESS
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-light text-[#FAF7F2] leading-tight">
              Cannot Find the Exact Venue You Envision?
            </h2>

            <p className="text-sm sm:text-base font-light text-[#FAF7F2]/80 max-w-2xl mx-auto leading-relaxed">
              Our venue scouting directors in Lucknow maintain relationships with private heritage estates, unlisted marriage lawns, and royal estates. We verify real-time date availability and negotiate direct package rates.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#FAF7F2] text-[#521D2B] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white transition-all duration-300 shadow-lg group"
              >
                <span>Request Private Venue Walkthrough</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={venuesWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#25D366] text-white text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#1EBE5D] transition-all duration-300 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {BUSINESS_INFO.displayPhone}</span>
              </a>
            </div>
          </div>
        </section>
      </section>

      {/* =========================================================================
          STAGE 4: ABOUT US SECTION (Exact About Page Experience)
          ========================================================================= */}
      <section id="about" className="relative w-full bg-[#F7F3ED] text-[#211A19]">
        <VenueAmbientBackground />

        {/* Section 1: Editorial Hero */}
        <AboutHero />

        {/* Section 2: Our Story */}
        <AboutStory />

        {/* Section 3: Our Philosophy */}
        <AboutPhilosophy />

        {/* Section 4: The Experience We Help Create */}
        <AboutExperience />

        {/* Section 5: Customer Reviews & Verified Memoirs */}
        <AboutTestimonials initialTestimonials={testimonials} />

        {/* Section 6: A Thoughtful Approach (The Process) */}
        <AboutProcess />

        {/* Section 7: Closing Call to Action */}
        <AboutCta />
      </section>

      {/* =========================================================================
          STAGE 5: CONTACT US SECTION (Exact Contact Page with Calendar Concierge)
          ========================================================================= */}
      <section id="contact" className="relative w-full bg-[#F7F3ED] text-[#211A19]">
        <ConciergeContact showNav={false} />
      </section>
    </main>
  );
}
