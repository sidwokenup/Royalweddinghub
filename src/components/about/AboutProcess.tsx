"use client";

import { MessageSquareQuote, Compass, SlidersHorizontal, Sparkles } from "lucide-react";

export function AboutProcess() {
  const steps = [
    {
      phase: "PHASE 01",
      name: "Listen",
      icon: MessageSquareQuote,
      headline: "Understanding What Matters",
      description: "We meet with the couple and families to listen to their dreams, auspicious dates, guest demographics, and regional ceremonial priorities.",
    },
    {
      phase: "PHASE 02",
      name: "Curate",
      icon: Compass,
      headline: "Selecting Spaces & Artistry",
      description: "Private scouting across Lucknow's palace estates and boutique venues, alongside matching specialized master florists, caterers, and cinematic artists.",
    },
    {
      phase: "PHASE 03",
      name: "Coordinate",
      icon: SlidersHorizontal,
      headline: "Harmonizing Every Element",
      description: "Detailed minute-by-minute day-of itineraries, spatial floorplans, generator contingencies, and seamless vendor alignment into one master roadmap.",
    },
    {
      phase: "PHASE 04",
      name: "Celebrate",
      icon: Sparkles,
      headline: "Immersed in Pure Joy",
      description: "Backstage supervision and quiet logistical direction allow families to immerse themselves fully in the sacred rituals, warmth, and celebration.",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-2xl space-y-2">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#521D2B] font-medium block">
          HOW WE COLLABORATE
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#211A19]">
          A Thoughtful Approach to Every Wedding
        </h2>
        <p className="text-sm sm:text-base text-[#57534E] font-light">
          A four-stage collaborative journey designed to transform your wedding vision into an effortless reality.
        </p>
      </div>

      {/* Process Sequence: Horizontal on Desktop, Vertical on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.name}
              className="group p-6 sm:p-7 rounded-2xl border border-[#E5DDD2] bg-[#FAF7F2] hover:border-[#521D2B]/50 transition-all duration-300 shadow-[0_2px_12px_rgba(33,26,25,0.02)] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#78716C] font-mono">
                    {step.phase}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white border border-[#E5DDD2] text-[#521D2B] flex items-center justify-center group-hover:bg-[#521D2B] group-hover:text-white transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-[#211A19] group-hover:text-[#521D2B] transition-colors">
                    {step.name}
                  </h3>
                  <h4 className="text-xs uppercase tracking-wider text-[#521D2B] font-medium">
                    {step.headline}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-[#57534E] font-light leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-[10px] text-[#78716C]">
                <span className="w-1 h-1 rounded-full bg-[#521D2B]" />
                <span>Step {idx + 1} of 4</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
