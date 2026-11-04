import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { VenueAmbientBackground } from "@/components/venues/VenueAmbientBackground";
import { ContactFooter } from "@/components/contact/ContactFooter";
import { BUSINESS_INFO } from "@/lib/contact";
import { Scale, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Royal Wedding Hub Lucknow",
  description:
    "Terms of Service for Royal Wedding Hub. Understand our luxury wedding planning terms, venue reservations, consultation agreements, and service guidelines.",
  alternates: {
    canonical: "https://www.royalweddinghub.com/terms",
  },
  openGraph: {
    title: "Terms of Service | Royal Wedding Hub Lucknow",
    description: "Terms and conditions for wedding planning, venue scouting, and consultation services in Lucknow.",
    url: "https://www.royalweddinghub.com/terms",
    siteName: "Royal Wedding Hub",
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = "November 2, 2026";

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start w-full bg-[#F7F3ED] text-[#211A19] overflow-x-hidden">
      <VenueAmbientBackground />
      <Navbar />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-32 pb-20">
        {/* Eyebrow */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE8DE] border border-[#DDD3C5]">
            <Scale size={14} className="text-[#521D2B]" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#521D2B] font-semibold">
              TRANSPARENT CLIENT AGREEMENTS
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#211A19]">
            Terms of Service
          </h1>
          <p className="text-xs tracking-[0.16em] uppercase text-[#78716C]">
            Last Updated: {lastUpdated} • {BUSINESS_INFO.name} Lucknow
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-[#D8CBBE] rounded-xl sm:rounded-2xl p-6 sm:p-10 md:p-12 shadow-sm space-y-8 text-sm sm:text-base leading-relaxed text-[#44403C]">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19] flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-[#521D2B]" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the services of <strong>{BUSINESS_INFO.name}</strong> via our website (<Link href="/" className="text-[#521D2B] underline">www.royalweddinghub.com</Link>), you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, please contact our concierge team before initiating planning agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19] flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-[#521D2B]" />
              2. Scope of Services
            </h2>
            <p>
              Royal Wedding Hub provides luxury wedding consultation, heritage venue curations, decor architecture, gourmet catering coordination, cinematography, entertainment, and concierge event production across Lucknow and destination locations.
            </p>
            <p>
              Preliminary inquiries, initial phone consultations, and website inquiries are provided complimentary. Confirmed bookings, vendor contracting, and bespoke production schedules are formalized through written client service agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19]">
              3. Venue Scouting &amp; Third-Party Partners
            </h2>
            <p>
              While we curate, verify, and coordinate with luxury hotels, heritage palaces, and private lawns in Lucknow, venue rules, maximum capacities, statutory curfews, and local noise regulations remain governed by each respective property management and municipal authority.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19]">
              4. Booking, Retainers &amp; Cancellations
            </h2>
            <p>
              Event dates and production teams are confirmed upon receipt of the agreed booking retainer as detailed in your bespoke proposal. Cancellation and rescheduling terms are tailored to each specific wedding date, venue contract, and season, and will be outlined transparently in your client contract.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19]">
              5. Intellectual Property
            </h2>
            <p>
              All branding, text, photographs, design concepts, and visual assets displayed on www.royalweddinghub.com are the intellectual property of Royal Wedding Hub or its authorized licensors and are protected under Indian and international copyright laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19] flex items-center gap-2.5">
              <HelpCircle size={18} className="text-[#521D2B]" />
              6. Dispute Resolution &amp; Jurisdiction
            </h2>
            <p>
              Any disputes arising from these Terms or the services provided by Royal Wedding Hub shall be subject to the exclusive jurisdiction of the competent courts in Lucknow, Uttar Pradesh, India.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#E5DDD2] pt-6">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19]">
              7. Inquiries &amp; Customer Support
            </h2>
            <p>If you have questions regarding our terms or bespoke packages, please contact:</p>
            <div className="bg-[#F7F3ED] p-4 rounded-lg space-y-1 text-xs sm:text-sm text-[#57534E]">
              <p><strong>{BUSINESS_INFO.name}</strong></p>
              <p>{BUSINESS_INFO.address.full}</p>
              <p>Email: <a href={`mailto:${BUSINESS_INFO.email}`} className="text-[#521D2B] underline">{BUSINESS_INFO.email}</a></p>
              <p>Phone: <a href={`tel:${BUSINESS_INFO.primaryPhone}`} className="text-[#521D2B] underline">{BUSINESS_INFO.displayPhone}</a></p>
            </div>
          </section>
        </div>
      </div>

      <ContactFooter />
    </main>
  );
}

