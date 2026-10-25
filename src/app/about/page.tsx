import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { VenueAmbientBackground } from "@/components/venues/VenueAmbientBackground";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutPhilosophy } from "@/components/about/AboutPhilosophy";
import { AboutExperience } from "@/components/about/AboutExperience";
import { AboutTestimonials } from "@/components/about/AboutTestimonials";
import { AboutProcess } from "@/components/about/AboutProcess";
import { AboutCta } from "@/components/about/AboutCta";
import { BUSINESS_INFO } from "@/lib/contact";
import { getAdminDb, isDatabaseConfigured } from "@/lib/db/client";
import { TestimonialItem } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "About Us & Planning Philosophy | Royal Wedding Hub Lucknow",
  description:
    "Discover the philosophy, bespoke planning approach, and story behind Royal Wedding Hub. Curating personalized luxury Indian weddings across Lucknow and royal destinations.",
  openGraph: {
    title: "About Us & Planning Philosophy | Royal Wedding Hub Lucknow",
    description:
      "Discover the philosophy, bespoke planning approach, and story behind Royal Wedding Hub. Curating personalized luxury Indian weddings across Lucknow.",
    url: "https://royalweddinghub.com/about",
    siteName: "Royal Wedding Hub",
    images: [
      {
        url: "/images/about/about-editorial-hero.jpg",
        width: 1200,
        height: 800,
        alt: "The Art of Celebration - Royal Wedding Hub",
      },
    ],
  },
};

import { getLiveTestimonials } from "@/lib/testimonials";

export default async function AboutPage() {
  const testimonials = await getLiveTestimonials();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start w-full bg-[#F7F3ED] text-[#211A19] overflow-x-hidden">
      {/* Shared Ambient Warm Glow Background */}
      <VenueAmbientBackground />

      {/* Global Navigation */}
      <Navbar />

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

      {/* Global Minimal Footer */}
      <footer className="w-full bg-[#211A19] text-[#FAF7F2]/70 py-10 px-6 border-t border-white/10 text-center text-xs space-y-2 mt-12">
        <p className="tracking-widest uppercase text-white font-serif text-sm">
          Royal Wedding Hub
        </p>
        <p className="font-light text-white/50">
          Curating royal celebrations, palace venues, and bespoke wedding experiences across Lucknow.
        </p>
        <p className="pt-1">
          <a
            href={BUSINESS_INFO.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D6B56D] hover:underline transition-colors"
          >
            Follow on Instagram {BUSINESS_INFO.instagram.handle}
          </a>
        </p>
        <p className="text-[11px] text-white/30 pt-2">
          © {new Date().getFullYear()} Royal Wedding Hub Lucknow. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
