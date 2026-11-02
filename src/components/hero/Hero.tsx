"use client";

import { useRef } from "react";
import { useGSAP } from "@/animations/gsap";
import { animateHeroEntrance } from "@/animations/gsap/heroAnimation";
import { HeroImage } from "./HeroImage";
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
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-between overflow-hidden bg-[#0d0907] text-white pt-20 pb-6 sm:pb-8"
      aria-label="Hero - Real Luxury Wedding Planner & Venues in Lucknow"
    >
      {/* Background High-Resolution Wedding Photography */}
      <HeroImage />

      {/* Main Central Composition */}
      <HeroContent />

      {/* Subtle Scroll Indicator */}
      <div className="w-full relative flex items-center justify-center pt-4 z-10">
        <HeroScrollIndicator />
      </div>
    </section>
  );
}
