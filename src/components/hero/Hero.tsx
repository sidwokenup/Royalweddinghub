"use client";

import { useRef } from "react";
import { useGSAP } from "@/animations/gsap";
import { animateHeroEntrance } from "@/animations/gsap/heroAnimation";
import { HeroVideo } from "./HeroVideo";
import { HeroContent } from "./HeroContent";
import { HeroScrollIndicator } from "./HeroScrollIndicator";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const overlay = containerRef.current.querySelector(".hero-overlay-gradient") as HTMLElement;
      const eyebrow = containerRef.current.querySelector(".hero-eyebrow") as HTMLElement;
      const titleLines = containerRef.current.querySelectorAll(".hero-title-line") as NodeListOf<HTMLElement>;
      const subtitle = containerRef.current.querySelector(".hero-subtitle") as HTMLElement;
      const cta = containerRef.current.querySelector(".hero-cta-slot") as HTMLElement;
      const framing = containerRef.current.querySelectorAll(".hero-framing-element") as NodeListOf<HTMLElement>;
      const scrollIndicator = containerRef.current.querySelector(".hero-scroll-indicator") as HTMLElement;

      animateHeroEntrance({
        container: containerRef.current,
        overlay,
        eyebrow,
        titleLines,
        subtitle,
        cta,
        framing,
        scrollIndicator,
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[100svh] flex flex-col items-center justify-between overflow-hidden bg-[#0d0907] text-white"
      aria-label="Hero - Luxury Indian Wedding Planner"
    >
      {/* Background Responsive Video */}
      <HeroVideo />

      {/* Luxury Cinematic Framing Elements (Section 14) */}
      <div className="absolute inset-4 sm:inset-6 md:inset-8 lg:inset-10 pointer-events-none select-none z-10" aria-hidden="true">
        {/* Top-Left Corner Bracket */}
        <div className="hero-framing-element absolute top-0 left-0 w-4 sm:w-6 h-4 sm:h-6 border-t border-l border-[#f3e5d8]/30" />
        
        {/* Top-Right Corner Bracket */}
        <div className="hero-framing-element absolute top-0 right-0 w-4 sm:w-6 h-4 sm:h-6 border-t border-r border-[#f3e5d8]/30" />
        
        {/* Bottom-Left Corner Bracket */}
        <div className="hero-framing-element absolute bottom-0 left-0 w-4 sm:w-6 h-4 sm:h-6 border-b border-l border-[#f3e5d8]/30" />
        
        {/* Bottom-Right Corner Bracket */}
        <div className="hero-framing-element absolute bottom-0 right-0 w-4 sm:w-6 h-4 sm:h-6 border-b border-r border-[#f3e5d8]/30" />

        {/* Subtle Vertical Editorial Typography - Desktop only */}
        <div className="hero-framing-element absolute left-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4">
          <span className="text-[9px] tracking-[0.35em] text-[#f3e5d8]/50 uppercase [writing-mode:vertical-lr] rotate-180">
            DESTINATION WEDDINGS • ROYAL PALACES
          </span>
          <span className="w-[1px] h-8 bg-[#f3e5d8]/20" />
        </div>

        <div className="hero-framing-element absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4">
          <span className="w-[1px] h-8 bg-[#f3e5d8]/20" />
          <span className="text-[9px] tracking-[0.35em] text-[#f3e5d8]/50 uppercase [writing-mode:vertical-lr]">
            BESPOKE CELEBRATIONS • EST. MMXXIV
          </span>
        </div>
      </div>

      {/* Spacer to balance top navbar */}
      <div className="w-full h-16 sm:h-20 shrink-0" aria-hidden="true" />

      {/* Main Central Editorial Composition */}
      <HeroContent />

      {/* Bottom Scroll Indicator with Spacer */}
      <div className="w-full h-16 sm:h-20 shrink-0 relative flex items-center justify-center">
        <HeroScrollIndicator />
      </div>
    </section>
  );
}
