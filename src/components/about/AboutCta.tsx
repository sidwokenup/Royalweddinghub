"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Phone, Sparkles } from "lucide-react";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function AboutCta() {
  const whatsappUrl = generateWhatsAppLink({
    service: "About Page Consultation",
    customMessage: "Hello Royal Wedding Hub! I visited your About page and would like to speak with your team about planning our upcoming wedding celebration.",
  });

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#521D2B] via-[#431622] to-[#2B0E16] text-[#FAF7F2] p-8 sm:p-14 lg:p-20 shadow-2xl border border-[#D6B56D]/30">
        {/* Newly sourced starlit evening fairy lights background with subtle dark overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about/about-cta.jpg"
            alt="Starlit wedding reception courtyard with warm fairy lights and candlelit tables"
            fill
            sizes="100vw"
            className="object-cover opacity-25 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#521D2B]/95 via-[#521D2B]/85 to-[#3b131e]/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl space-y-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B56D]" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2] font-medium">
              BEGIN THE CONVERSATION
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif leading-tight">
            Your Story Deserves<br />
            <span className="italic text-[#EFE8DE]">a Beautiful Beginning.</span>
          </h2>

          <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-xl">
            Tell us what you envision, and let&apos;s explore how to bring your celebration to life across Lucknow and royal destinations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#FAF7F2] text-[#521D2B] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white transition-all shadow-lg group"
            >
              <span>Plan Your Wedding</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs uppercase tracking-[0.18em] font-medium transition-colors"
            >
              <span>Explore Our Services</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-[#25D366] text-white text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#1EBE5D] transition-colors shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Planner</span>
            </a>
          </div>

          {/* Quick Contact Footer Bar */}
          <div className="pt-8 border-t border-white/15 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#D6B56D]" />
              <span>Direct Concierge:</span>
              <a href={getTelUrl()} className="text-white font-medium hover:underline">
                {BUSINESS_INFO.displayPhone}
              </a>
            </div>
            <div>
              <span>Hazratganj, Lucknow, Uttar Pradesh</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
