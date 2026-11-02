"use client";

import { useRef } from "react";
import { useGSAP } from "@/animations/gsap";
import { animateHeroEntrance } from "@/animations/gsap/heroAnimation";
import { HeroImage } from "./HeroImage";
import { HeroContent } from "./HeroContent";

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

      animateHeroEntrance({
        container: containerRef.current,
        overlay,
        eyebrow,
        titleLines,
        subtitle,
        cta,
        framing,
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative z-20 w-full min-h-[440px] sm:min-h-[480px] md:min-h-[520px] flex flex-col items-center justify-center bg-[#0d0907] text-white pt-20 sm:pt-24 pb-8 sm:pb-10"
      aria-label="Hero - Real Luxury Wedding Planner & Venues in Lucknow"
    >
      {/* Background High-Resolution Wedding Photography */}
      <HeroImage />

      {/* Main Central Composition */}
      <HeroContent />
    </section>
  );
}
