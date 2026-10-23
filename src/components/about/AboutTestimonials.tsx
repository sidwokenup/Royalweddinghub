"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck, ChevronLeft, ChevronRight, Quote, HeartHandshake, Lock } from "lucide-react";
import { VERIFIED_TESTIMONIALS, TestimonialItem } from "@/data/testimonials";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface AboutTestimonialsProps {
  initialTestimonials?: TestimonialItem[];
}

export function AboutTestimonials({ initialTestimonials }: AboutTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const whatsappShareUrl = generateWhatsAppLink({
    service: "Client Review & Feedback",
    customMessage: "Hello Royal Wedding Hub team! I would like to share our family reflection and feedback regarding our recent wedding celebration.",
  });

  const list = (initialTestimonials && initialTestimonials.length > 0)
    ? initialTestimonials
    : VERIFIED_TESTIMONIALS;

  const hasTestimonials = list.length > 0;
  const currentItem = hasTestimonials ? list[currentIndex] : null;

  const handlePrev = () => {
    if (hasTestimonials) {
      setCurrentIndex((prev) => (prev === 0 ? VERIFIED_TESTIMONIALS.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (hasTestimonials) {
      setCurrentIndex((prev) => (prev === VERIFIED_TESTIMONIALS.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <section id="customer-stories" className="w-full py-16 sm:py-24 bg-white/70 border-t border-[#E5DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE8DE] border border-[#DDD3C5]">
            <HeartHandshake className="w-3.5 h-3.5 text-[#521D2B]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#521D2B] font-medium">
              VERIFIED WEDDING MEMOIRS
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#211A19]">
            Words from the Celebrations We’ve Shared.
          </h2>

          <p className="text-sm sm:text-base text-[#57534E] font-light leading-relaxed">
            Every celebration leaves behind memories. Discover the experiences our couples and families have chosen to share.
          </p>
        </div>

        {/* Content Area: Either Verified Testimonials or Honest Client Privacy Panel */}
        {hasTestimonials && currentItem ? (
          <div className="rounded-3xl border border-[#E5DDD2] bg-[#FAF7F2] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-sm">
            <Quote className="w-12 h-12 text-[#521D2B]/15 absolute top-8 right-8 pointer-events-none" />

            <div className="max-w-3xl space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#521D2B] font-medium">
                {currentItem.celebrationType} • {currentItem.location}
              </span>

              <blockquote className="text-2xl sm:text-3xl font-serif text-[#211A19] leading-relaxed">
                &ldquo;{currentItem.quote}&rdquo;
              </blockquote>

              {currentItem.fullStory && (
                <p className="text-sm text-[#57534E] font-light leading-relaxed">
                  {currentItem.fullStory}
                </p>
              )}

              <div className="pt-4 border-t border-[#E8DFD3] flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg text-[#211A19]">
                    {currentItem.coupleNames}
                  </h4>
                  {currentItem.weddingSeason && (
                    <span className="text-xs text-[#78716C] tracking-wide">
                      {currentItem.weddingSeason}
                    </span>
                  )}
                </div>

                {VERIFIED_TESTIMONIALS.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="p-2.5 rounded-full border border-[#DDD3C5] bg-white text-[#211A19] hover:bg-[#FAF7F2] transition-colors"
                      aria-label="Previous review"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="p-2.5 rounded-full border border-[#DDD3C5] bg-white text-[#211A19] hover:bg-[#FAF7F2] transition-colors"
                      aria-label="Next review"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Honest, Tasteful Discretion & Privacy State */
          <div className="rounded-3xl border border-[#E5DDD2] bg-[#FAF7F2] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_4px_24px_rgba(33,26,25,0.03)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#521D2B] font-medium">
                  <Lock className="w-4 h-4 text-[#521D2B]" />
                  <span>Client Discretion &amp; Private Reflections</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif text-[#211A19]">
                  Honoring the Intimacy of Every Family
                </h3>

                <p className="text-sm sm:text-base text-[#57534E] font-light leading-relaxed max-w-2xl">
                  At Royal Wedding Hub, we honor the privacy and family sanctity of our couples. Real letters, wedding memoirs, and video reflections are published exclusively with prior couple and family consent.
                </p>

                <p className="text-xs text-[#78716C] leading-relaxed max-w-xl">
                  Prospective families wishing to speak directly with verified couple references or review private portfolio albums are invited to connect with our senior concierge team under NDA.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#521D2B] text-white text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#682637] transition-all shadow-sm"
                  >
                    <span>Request Private Reference Details</span>
                  </Link>

                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#E5DDD2] text-[#211A19] text-xs uppercase tracking-[0.16em] hover:bg-[#F6EFEA] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Submit Your Wedding Reflection</span>
                  </a>
                </div>
              </div>

              {/* Right Side Trust Callout */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#E8DFD3] space-y-4">
                <div className="flex items-center gap-2 text-[#521D2B]">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-serif font-medium uppercase tracking-wider">Our Trust Standard</span>
                </div>

                <ul className="space-y-2.5 text-xs text-[#57534E] font-light">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B] mt-1 shrink-0" />
                    <span>No fabricated reviews or artificial star ratings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B] mt-1 shrink-0" />
                    <span>Direct phone or coffee references upon family approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B] mt-1 shrink-0" />
                    <span>Comprehensive contract transparency with zero hidden fees</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
