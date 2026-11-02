import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Hero } from "@/components/hero/Hero";
import { VenueAmbientBackground } from "@/components/venues/VenueAmbientBackground";
import { HomeServicesSection } from "@/components/home/HomeServicesSection";
import { HomeFeaturedVenues } from "@/components/home/HomeFeaturedVenues";
import { HomeHowItWorks } from "@/components/home/HomeHowItWorks";
import { AboutTestimonials } from "@/components/about/AboutTestimonials";
import { ConciergeContact } from "@/components/contact/ConciergeContact";
import { getLiveServices } from "@/lib/services";
import { getLiveVenues } from "@/lib/venues";
import { getLiveTestimonials } from "@/lib/testimonials";

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

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start w-full bg-[#0a0705] selection:bg-[#521D2B]/15 selection:text-[#521D2B] overflow-x-hidden">
      {/* Global Fixed Navigation with Hover Menus */}
      <Navbar />

      {/* =========================================================================
          STAGE 1: HERO SECTION (Real Photography + Translucent Rotating Search)
          ========================================================================= */}
      <Hero />

      {/* Main Content Body with Ambient Luxury Parchment */}
      <div className="relative w-full bg-[#FAF7F2] text-[#211A19]">
        <VenueAmbientBackground />

        {/* =========================================================================
            STAGE 2: OUR WEDDING SERVICES (Clean 6-Discipline Showcase)
            ========================================================================= */}
        <HomeServicesSection services={services} />

        {/* =========================================================================
            STAGE 3: CURATED WEDDING VENUES (Uniform 3-Column Grid)
            ========================================================================= */}
        <div className="bg-[#F7F3ED] border-y border-[#E8DFD3]">
          <HomeFeaturedVenues venues={allVenues} />
        </div>

        {/* =========================================================================
            STAGE 4: HOW IT WORKS (Subtle 3-Step Concierge Standard)
            ========================================================================= */}
        <HomeHowItWorks />

        {/* =========================================================================
            STAGE 5: CLIENT MEMOIRS & REVIEWS
            ========================================================================= */}
        <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8DFD3]">
          <AboutTestimonials initialTestimonials={testimonials} />
        </section>

        {/* =========================================================================
            STAGE 6: DIRECT CONCIERGE CONSULTATION & FOOTER
            ========================================================================= */}
        <section id="contact" className="relative w-full border-t border-[#E8DFD3]">
          <ConciergeContact showNav={false} />
        </section>
      </div>
    </main>
  );
}
