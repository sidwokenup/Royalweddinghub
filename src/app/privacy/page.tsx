import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { VenueAmbientBackground } from "@/components/venues/VenueAmbientBackground";
import { ContactFooter } from "@/components/contact/ContactFooter";
import { BUSINESS_INFO } from "@/lib/contact";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Royal Wedding Hub Lucknow",
  description:
    "Privacy Policy for Royal Wedding Hub. Learn how we safeguard your personal data, wedding consultation details, and event inquiries in Lucknow.",
  alternates: {
    canonical: "https://www.royalweddinghub.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Royal Wedding Hub Lucknow",
    description: "Learn how Royal Wedding Hub safeguards your personal information and wedding consultation requests.",
    url: "https://www.royalweddinghub.com/privacy",
    siteName: "Royal Wedding Hub",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 2, 2026";

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start w-full bg-[#F7F3ED] text-[#211A19] overflow-x-hidden">
      <VenueAmbientBackground />
      <Navbar />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-32 pb-20">
        {/* Eyebrow */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE8DE] border border-[#DDD3C5]">
            <ShieldCheck size={14} className="text-[#521D2B]" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#521D2B] font-semibold">
              TRUST &amp; PRIVACY COMMITMENT
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#211A19]">
            Privacy Policy
          </h1>
          <p className="text-xs tracking-[0.16em] uppercase text-[#78716C]">
            Last Updated: {lastUpdated} • {BUSINESS_INFO.name} Lucknow
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-[#D8CBBE] rounded-xl sm:rounded-2xl p-6 sm:p-10 md:p-12 shadow-sm space-y-8 text-sm sm:text-base leading-relaxed text-[#44403C]">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19] flex items-center gap-2.5">
              <Lock size={18} className="text-[#521D2B]" />
              1. Overview &amp; Data Controller
            </h2>
            <p>
              At <strong>{BUSINESS_INFO.name}</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), we respect and protect the privacy of every couple, family, and partner who reaches out to us for luxury wedding planning, venue scouting, decor, and concierge services.
            </p>
            <p>
              This Privacy Policy explains how we collect, process, store, and safeguard your personal details when you interact with our website (<Link href="/" className="text-[#521D2B] underline">www.royalweddinghub.com</Link>), submit consultation inquiries, or connect with our concierge team via WhatsApp or telephone.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19] flex items-center gap-2.5">
              <Eye size={18} className="text-[#521D2B]" />
              2. Information We Collect
            </h2>
            <p>When you request a bespoke wedding consultation or venue walkthrough, we may collect:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Contact Identifiers:</strong> Name, phone number, and optional email address.</li>
              <li><strong>Wedding &amp; Event Preferences:</strong> Event type (Wedding, Reception, Engagement), estimated event dates, preferred venues in Lucknow, and requested service scopes (catering, decor, cinematography).</li>
              <li><strong>Marketing &amp; Campaign Attribution:</strong> Campaign parameters (such as UTM parameters, Google Ads click identifiers, Meta click identifiers) to evaluate advertising performance and customer engagement.</li>
              <li><strong>Technical Logs:</strong> Browser type, operating system, IP address, and anonymized aggregate usage metrics via Google Analytics.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19] flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-[#521D2B]" />
              3. How We Use Your Information
            </h2>
            <p>Your details are used strictly for:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Scheduling private consultations and venue walkthroughs in Lucknow.</li>
              <li>Curating customized wedding portfolios, date checks, and pricing proposals.</li>
              <li>Direct concierge communications via phone call or WhatsApp message as requested.</li>
              <li>Measuring ad campaign effectiveness and improving our web experience.</li>
            </ul>
            <p className="font-medium text-[#211A19] bg-[#FAF7F2] p-4 rounded-lg border border-[#E5DDD2]">
              Strict Zero-Spam Guarantee: We never sell, rent, or lease your personal information to third-party marketing brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19] flex items-center gap-2.5">
              <FileText size={18} className="text-[#521D2B]" />
              4. Cookies, Analytics &amp; Advertising Tags
            </h2>
            <p>
              We utilize Google Analytics (GA4) and advertising tracking tags (e.g. Google Ads, Meta Pixel) to monitor site traffic and measure conversion events (e.g. form submissions, WhatsApp clicks). You may disable cookies in your web browser settings at any time without impacting your ability to browse our venues or services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19]">
              5. Data Security &amp; Retention
            </h2>
            <p>
              All inquiry data is encrypted in transit using SSL/TLS protocols and hosted on secure enterprise database infrastructure. We retain consultation records only as long as necessary to coordinate your wedding celebration and fulfill statutory accounting or legal obligations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19]">
              6. Your Privacy Rights
            </h2>
            <p>
              In accordance with applicable privacy laws and India&apos;s Digital Personal Data Protection Act (DPDP), you have the right to request access to, correction of, or deletion of your personal contact records at any time.
            </p>
          </section>

          <section className="space-y-3 border-t border-[#E5DDD2] pt-6">
            <h2 className="text-xl sm:text-2xl font-serif text-[#211A19]">
              7. Contact Our Privacy &amp; Concierge Desk
            </h2>
            <p>For any privacy inquiries or to update your celebration details, contact our registered office:</p>
            <div className="bg-[#F7F3ED] p-4 rounded-lg space-y-1 text-xs sm:text-sm text-[#57534E]">
              <p><strong>{BUSINESS_INFO.name}</strong></p>
              <p>{BUSINESS_INFO.address.full}</p>
              <p>Email: <a href={`mailto:${BUSINESS_INFO.email}`} className="text-[#521D2B] underline">{BUSINESS_INFO.email}</a></p>
              <p>Phone: <a href={`tel:${BUSINESS_INFO.rawPhone}`} className="text-[#521D2B] underline">{BUSINESS_INFO.displayPhone}</a></p>
            </div>
          </section>
        </div>
      </div>

      <ContactFooter />
    </main>
  );
}

