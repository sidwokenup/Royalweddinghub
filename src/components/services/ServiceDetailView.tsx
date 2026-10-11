"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Check, 
  MessageCircle, 
  Phone, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  ChevronRight,
  Send
} from "lucide-react";
import { ServiceItem } from "@/types/service";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";

interface ServiceDetailViewProps {
  service: ServiceItem;
  relatedServices: ServiceItem[];
}

export function ServiceDetailView({ service, relatedServices }: ServiceDetailViewProps) {
  const whatsappUrl = generateWhatsAppLink({
    service: service.name,
    customMessage: `Hello Royal Weddinghub! I would like to enquire about your ${service.name} services for our upcoming celebration in Lucknow.`,
  });

  const contactUrl = `/contact?service=${encodeURIComponent(service.slug)}`;

  return (
    <div className="relative w-full text-[#211A19]">
      {/* Top Breadcrumb Navigation */}
      <div className="pt-24 sm:pt-28 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#57534E] hover:text-[#521D2B] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Services</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Details */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EFE8DE] border border-[#DDD3C5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#521D2B] font-medium">
                {service.categoryTag}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <span className="text-sm uppercase tracking-[0.25em] text-[#78716C] block">
                {service.name}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#211A19] leading-[1.1] tracking-tight">
                {service.headline}
              </h1>
              <p className="text-base sm:text-lg text-[#57534E] font-light max-w-xl leading-relaxed pt-1">
                {service.introCopy}
              </p>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#78716C] border-y border-[#E5DDD2] py-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#521D2B]" />
                <span>Verified Quality Standards</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#521D2B]" />
                <span>Tailored Timeline Alignment</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#521D2B]" />
                <span>Dedicated Production Lead</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href={contactUrl}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#521D2B] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#682637] transition-all shadow-md group"
              >
                <span>{service.ctaText}</span>
                <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#1EBE5D] transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Enquiry</span>
              </a>

              <a
                href={getTelUrl()}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white border border-[#E5DDD2] text-[#211A19] text-xs uppercase tracking-[0.16em] hover:bg-[#FAF7F2] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#521D2B]" />
                <span>Call Direct</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Wedding Photography Showcase */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[#E5DDD2] shadow-[0_12px_40px_rgba(33,26,25,0.08)]">
              <Image
                src={service.image}
                alt={service.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#EFE8DE] block">
                  The Royal Weddinghub Curation
                </span>
                <p className="text-sm font-serif font-light text-white/95">
                  {service.shortDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: What We Deliver (Core Deliverables) */}
      <section className="bg-white/60 border-y border-[#E5DDD2] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#521D2B] font-medium block">
              SCOPE OF EXCELLENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#211A19]">
              What This Service Encompasses
            </h2>
            <p className="text-sm text-[#57534E] font-light">
              We coordinate every facet with established Lucknow vendors and master artisans to guarantee unmatched consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {service.deliverables.map((d, index) => (
              <div
                key={d.title}
                className="p-6 sm:p-8 rounded-2xl border border-[#E8DFD3] bg-[#FAF7F2] shadow-[0_2px_12px_rgba(33,26,25,0.02)] space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#521D2B]/10 flex items-center justify-center text-[#521D2B]">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.16em] text-[#78716C]">
                    Pillar 0{index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-serif text-[#211A19]">
                  {d.title}
                </h3>
                <p className="text-sm text-[#57534E] font-light leading-relaxed">
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Subcategories & Options Breakdown */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#521D2B] font-medium block">
            CUSTOMIZATION & FORMATS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#211A19]">
            Available Options & Formats
          </h2>
          <p className="text-sm text-[#57534E] font-light">
            Select specific standalone requirements or combine them into your bespoke master wedding itinerary.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {service.subcategories.map((sub) => (
            <div
              key={sub.name}
              className="p-5 rounded-xl border border-[#E5DDD2] bg-[#FAF7F2] space-y-2 hover:border-[#521D2B]/40 transition-colors"
            >
              {sub.tag && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-[#E5DDD2] text-[#521D2B] font-medium inline-block">
                  {sub.tag}
                </span>
              )}
              <h3 className="text-base font-serif font-medium text-[#211A19]">
                {sub.name}
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                {sub.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Visual Editorial Gallery */}
      {service.galleryImages.length > 0 && (
        <section className="bg-white/50 border-t border-[#E5DDD2] py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-end justify-between border-b border-[#E5DDD2] pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#521D2B] font-medium block">
                  VISUAL ESSENCE
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#211A19]">
                  Editorial Gallery
                </h2>
              </div>
              <span className="text-xs text-[#78716C] tracking-wide">
                Authentic Royal Weddinghub Real Works
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.galleryImages.map((img, i) => (
                <div
                  key={img + i}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E5DDD2] shadow-sm group"
                >
                  <Image
                    src={img}
                    alt={`${service.name} real capture ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Service-Specific Enquiry Conversion Strip */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#521D2B] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          {/* Subtle floral/ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-xs uppercase tracking-[0.28em] text-[#EFE8DE] font-medium block">
              BESPOKE WEDDING CONSULTATION
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
              Ready to Orchestrate Your {service.name}?
            </h2>
            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-xl">
              Connect directly with our senior wedding director in Lucknow. We will prepare an itemized proposal and walkthrough tailored to your celebration dates.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={contactUrl}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#521D2B] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#FAF7F2] transition-colors shadow-md"
              >
                <span>{service.ctaText}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#25D366] text-white text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#1EBE5D] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {BUSINESS_INFO.displayPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Related Disciplines */}
      {relatedServices.length > 0 && (
        <section className="border-t border-[#E5DDD2] py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#521D2B] font-medium block">
                COMPLEMENTARY DEPARTMENTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#211A19]">
                Related Wedding Services
              </h2>
            </div>
            <Link
              href="/services"
              className="text-xs uppercase tracking-[0.18em] text-[#521D2B] font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>View All 8 Disciplines</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((rel) => {
              const relUrl = rel.externalLink || `/services/${rel.slug}`;
              return (
                <Link
                  key={rel.id}
                  href={relUrl}
                  className="group block rounded-xl border border-[#E5DDD2] overflow-hidden bg-[#FAF7F2] hover:border-[#521D2B]/50 transition-all shadow-sm"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="p-5 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-widest text-[#521D2B] font-medium block">
                      {rel.categoryTag}
                    </span>
                    <h3 className="text-lg font-serif text-[#211A19] group-hover:text-[#521D2B] transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-[#57534E] line-clamp-2">
                      {rel.shortDescription}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
