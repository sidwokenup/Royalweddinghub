"use client";

import Image from "next/image";
import { MapPin, Phone, Clock, Mail, Sparkles, Building2, UtensilsCrossed, Music2, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { BUSINESS_INFO, getTelUrl, getMailtoUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { ConciergeCard } from "./ConciergeCard";
import { ContactActions } from "./ContactActions";
import { ContactFooter } from "./ContactFooter";
import { MobileStickyBar } from "./MobileStickyBar";

export function ConciergeContact() {
  return (
    <div className="relative min-h-screen w-full bg-[#F7F3ED] text-[#211A19] flex flex-col justify-between overflow-x-hidden selection:bg-[#521D2B]/15 selection:text-[#521D2B]">
      {/* Shared Global Navigation styled in warm ivory */}
      <Navbar />

      {/* Atmospheric Soft Warm Glows (matching Venues page) */}
      <div 
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-[radial-gradient(ellipse_at_top,_rgba(239,229,213,0.85)_0%,_rgba(234,219,206,0.35)_45%,_transparent_75%)] pointer-events-none"
        aria-hidden="true" 
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full pt-28 pb-16">
        {/* =========================================================================
            SECTION 5: ASYMMETRIC EDITORIAL CONCIERGE HERO (Light Theme)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (Editorial text & actions) */}
            <div className="lg:col-span-6 space-y-7 text-left">
              {/* Eyebrow Pill Badge (matching Venue Collection badge) */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EFE8DE] border border-[#DDD3C5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#521D2B] font-medium">
                  YOUR PRIVATE WEDDING CONCIERGE
                </span>
              </div>

              {/* Serif Headline with deliberate breaks */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-[#211A19] leading-[1.08] tracking-tight">
                Every great<br className="hidden sm:inline" /> celebration begins<br />
                <span className="italic text-[#521D2B]">with a conversation.</span>
              </h1>

              {/* Restrained Supporting Copy */}
              <p className="text-base sm:text-lg text-[#57534E] font-light max-w-xl leading-relaxed">
                Tell us what you are dreaming of. Together, we&apos;ll shape a celebration that feels unmistakably yours.
              </p>

              {/* Single Alignment Action Buttons */}
              <div className="pt-2">
                <ContactActions />
              </div>

              {/* Restrained Direct Availability Note */}
              <div className="flex items-center gap-2.5 pt-1 text-xs tracking-[0.14em] text-[#78716C]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B] animate-pulse" />
                <span>Private Consultations Open • Lucknow Studio &amp; Royal Venues</span>
              </div>
            </div>

            {/* Right Column — Large Genuine Wedding Photo in Luxury Frame */}
            <div className="lg:col-span-6 w-full">
              <div className="relative group rounded-xl sm:rounded-2xl overflow-hidden border border-[#D8CBBE] bg-white shadow-[0_20px_50px_rgba(33,26,25,0.08)]">
                {/* Genuine authorized wedding celebration photo from scraper library */}
                <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src="/venues/shakuntalam-resort/gallery_004.jpg"
                    alt="Royal wedding celebration pavilion illuminated at night in Lucknow"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                  {/* Subtle soft vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Editorial Caption Tag */}
                <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5 right-4 flex items-center justify-between text-[10px] sm:text-[11px] tracking-[0.2em] uppercase pointer-events-none">
                  <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-[2px] border border-[#E5DDD2] text-[#211A19] font-medium shadow-sm">
                    Bespoke Pavilion &amp; Courtyard Staging • Lucknow
                  </span>
                  <span className="hidden sm:inline-block text-[#FAF7F2] font-semibold drop-shadow-md">
                    Royal Wedding Hub
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: REFINED TRUST AND SERVICE STRIP (Light Editorial Surface)
            ========================================================================= */}
        <section className="w-full border-y border-[#E5DDD2] bg-white/70 backdrop-blur-sm py-10 my-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {/* Pillar 1 */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-[#521D2B]">
                  <Sparkles size={16} />
                  <span className="text-[11px] tracking-[0.24em] uppercase font-semibold text-[#211A19]">Bespoke Architecture</span>
                </div>
                <p className="text-xs font-light text-[#6B635B] leading-relaxed">
                  End-to-end wedding direction, guest logistics &amp; minute-by-minute timeline orchestration.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-[#521D2B]">
                  <Building2 size={16} />
                  <span className="text-[11px] tracking-[0.24em] uppercase font-semibold text-[#211A19]">Heritage Venues</span>
                </div>
                <p className="text-xs font-light text-[#6B635B] leading-relaxed">
                  32+ verified palace lawns, luxury resorts &amp; banquet estates curated across Lucknow.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-[#521D2B]">
                  <UtensilsCrossed size={16} />
                  <span className="text-[11px] tracking-[0.24em] uppercase font-semibold text-[#211A19]">Awadhi Banquets</span>
                </div>
                <p className="text-xs font-light text-[#6B635B] leading-relaxed">
                  Custom multi-course royal feasts, live culinary theatricals &amp; tailored hospitality.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-[#521D2B]">
                  <Music2 size={16} />
                  <span className="text-[11px] tracking-[0.24em] uppercase font-semibold text-[#211A19]">Sufi &amp; Star Talent</span>
                </div>
                <p className="text-xs font-light text-[#6B635B] leading-relaxed">
                  Curated Sufi ensembles, bridal entry soundscapes &amp; exclusive celebrity artist coordination.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: ASYMMETRIC TWO-COLUMN CONSULTATION SUITE
            ========================================================================= */}
        <section id="enquiry-suite" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column — The Invitation */}
            <div className="lg:col-span-5 space-y-8">
              {/* Editorial Heading */}
              <div className="space-y-4 border-l-2 border-[#521D2B] pl-6">
                <span className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-[#521D2B] font-semibold block">
                  CRAFTING MEMORIES
                </span>
                <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#211A19] leading-snug">
                  Your celebration deserves nothing ordinary.
                </h2>
                <p className="text-xs sm:text-sm font-light text-[#57534E] leading-relaxed">
                  Whether you envision a grand royal palace procession in Lucknow or an intimate candlelit destination soirée, our decade of trusted relationships ensures seamless mastery of decor, artists, banquets, and timeline.
                </p>
              </div>

              {/* Genuine Business & Studio Details */}
              <div className="space-y-4.5 pt-2 border-t border-[#E5DDD2]">
                <div className="flex items-start gap-3.5 text-xs text-[#211A19]">
                  <MapPin size={17} className="text-[#521D2B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#211A19] block">Ashiyana Studio</span>
                    <span className="text-xs font-light text-[#6B635B] leading-relaxed">
                      {BUSINESS_INFO.address.full}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs text-[#211A19]">
                  <Clock size={17} className="text-[#521D2B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#211A19] block">24/7 Concierge Availability</span>
                    <span className="text-xs font-light text-[#6B635B] leading-relaxed">
                      Immediate response for date locks, venue walkthroughs &amp; bridal consultations.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs text-[#211A19]">
                  <Phone size={17} className="text-[#521D2B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#211A19] block">Direct Concierge Lines</span>
                    <div className="flex flex-wrap items-center gap-3 pt-0.5 text-xs text-[#211A19]">
                      <a href={getTelUrl(BUSINESS_INFO.primaryPhone)} className="hover:text-[#521D2B] transition-colors underline decoration-[#521D2B]/40 underline-offset-4 font-medium">
                        {BUSINESS_INFO.displayPhone}
                      </a>
                      <span>•</span>
                      <a href={getTelUrl("9792134014")} className="hover:text-[#521D2B] transition-colors underline decoration-[#521D2B]/40 underline-offset-4 font-medium">
                        +91 97921 34014
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-xs text-[#211A19]">
                  <Mail size={17} className="text-[#521D2B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#211A19] block">Email Dossier</span>
                    <a href={getMailtoUrl()} className="text-xs font-light text-[#6B635B] hover:text-[#521D2B] transition-colors">
                      {BUSINESS_INFO.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Authentic Wedding Tablescape Photograph Accent */}
              <div className="pt-2">
                <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-[#D8CBBE] shadow-sm bg-white">
                  <Image
                    src="/venues/shakuntalam-resort/gallery_002.jpg"
                    alt="Fine-art wedding tablescape and floral setting by Royal Wedding Hub"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-3 text-[10px] tracking-[0.18em] uppercase text-white font-medium drop-shadow">
                    Fine-Art Tablescapes &amp; Floral Architecture
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column — The Consultation Suite */}
            <div className="lg:col-span-7 w-full flex justify-center">
              <ConciergeCard />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 11: ELEGANT CLOSING SECTION (Light Luxury Surface)
            ========================================================================= */}
        <section className="relative w-full border-t border-[#DDD3C5] bg-[#EFE8DE] py-20 sm:py-28 overflow-hidden text-[#211A19]">
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center space-y-7">
            <span className="text-[10px] sm:text-[11px] tracking-[0.38em] uppercase text-[#521D2B] font-semibold block">
              BEGIN YOUR CELEBRATION
            </span>

            <h3 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal text-[#211A19] leading-[1.14]">
              Let&apos;s make room for<br />
              <span className="italic text-[#521D2B]">something extraordinary.</span>
            </h3>

            <p className="text-sm sm:text-base font-light text-[#57534E] max-w-lg mx-auto leading-relaxed">
              Share your vision with us, and let the planning begin. Our concierge team in Lucknow is ready to assist you.
            </p>

            {/* Deliberate closing actions in single alignment */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto">
              <a
                href="#enquiry-suite"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 h-11 sm:h-12 rounded-[2px] text-[11px] sm:text-xs font-medium tracking-[0.2em] uppercase text-white bg-[#521D2B] hover:bg-[#3D1520] transition-all shadow-md whitespace-nowrap"
              >
                <span>Curate Your Celebration</span>
              </a>

              <a
                href={generateWhatsAppLink({
                  customMessage: "Hello Royal Wedding Hub, I would like to speak with a wedding specialist about my upcoming celebration.",
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-11 sm:h-12 rounded-[2px] text-[11px] sm:text-xs font-medium tracking-[0.18em] uppercase text-[#211A19] bg-white hover:bg-[#FAF7F2] border border-[#D8CBBE] hover:border-[#25D366] transition-all shadow-sm whitespace-nowrap"
              >
                <MessageCircle size={15} className="text-[#25D366]" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Contact Page Minimal Luxury Footer */}
      <ContactFooter />

      {/* Mobile-Only Sticky Conversion Bar */}
      <MobileStickyBar />
    </div>
  );
}
