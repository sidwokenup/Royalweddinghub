"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";

export function AboutPhilosophy() {
  const principles = [
    {
      number: "01",
      title: "Personal by Nature",
      statement: "Every celebration should reflect the couple's unique preferences, family traditions, and personal vision rather than a borrowed template.",
      detail: "We take time to discover the nuances of your relationship—honoring your heritage while leaving room for contemporary creative flair.",
    },
    {
      number: "02",
      title: "Thoughtful in Every Detail",
      statement: "Venue selection, architectural décor, dining flow, and day-of timing should feel like chapters of one singular, harmonious story.",
      detail: "Nothing is planned in isolation. The scent of fresh flowers, the cadence of Sufi melodies, and the lighting of the mandap all complement one another.",
    },
    {
      number: "03",
      title: "Celebrations with Meaning",
      statement: "A wedding should feel memorable not simply because of its visual grandeur, but because of the warmth, connection, and joy it brings to your loved ones.",
      detail: "Beyond grand photo opportunities, our foremost priority is gracious hospitality and unhurried ease for every guest and elder.",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Editorial Principles */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE8DE] border border-[#DDD3C5]">
              <Sparkles className="w-3 h-3 text-[#521D2B]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#521D2B] font-medium">
                GUIDING ETHOS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#211A19]">
              Our Planning Philosophy
            </h2>
            <p className="text-sm sm:text-base text-[#57534E] font-light max-w-xl">
              Three foundational principles shape how we listen, design, and orchestrate each milestone celebration.
            </p>
          </div>

          <div className="space-y-6 pt-2">
            {principles.map((item) => (
              <div
                key={item.number}
                className="group p-6 sm:p-7 rounded-2xl border border-[#E5DDD2] bg-[#FAF7F2] hover:border-[#521D2B]/40 transition-all duration-300 shadow-[0_2px_12px_rgba(33,26,25,0.02)] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-light text-[#521D2B] tracking-widest">
                    PRINCIPLE {item.number}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]/40 group-hover:bg-[#521D2B] transition-colors" />
                </div>

                <h3 className="text-xl sm:text-2xl font-serif text-[#211A19]">
                  {item.title}
                </h3>

                <p className="text-sm text-[#211A19] font-medium leading-relaxed">
                  {item.statement}
                </p>

                <p className="text-xs text-[#57534E] font-light leading-relaxed pt-1 border-t border-[#E8DFD3]/80">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Newly Sourced Wedding Fine Details Photograph */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden border border-[#E5DDD2] shadow-[0_12px_40px_rgba(33,26,25,0.06)] group">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/images/about/about-philosophy.jpg"
                alt="Fine-art wedding tablescape with custom place settings, taper candles, and seasonal florals"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
              <span className="text-[10px] uppercase tracking-widest text-[#EFE8DE] block">
                Artisanal Attention
              </span>
              <p className="text-xs font-serif font-light text-white/95">
                Thoughtful details that weave individual elements into one unforgettable atmosphere
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
