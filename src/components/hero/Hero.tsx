"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/animations/gsap";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Placeholder animation setup
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.5 }
    );
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen min-h-screen flex flex-col items-center justify-center overflow-hidden bg-foreground text-background"
    >
      {/* Video/Media Placeholder */}
      <div className="absolute inset-0 w-full h-full bg-foreground opacity-50 z-0" />
      
      {/* Content Overlay Area */}
      <div 
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-20"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl display-text mb-6 tracking-tight text-white">
          A Cinematic Celebration of Love
        </h1>
        <p className="text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto mb-10 text-white/90">
          Crafting unforgettable luxury Indian weddings with an editorial touch.
        </p>
        
        {/* CTA Placeholder */}
        <button className="px-8 py-4 border border-white/30 text-white text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-foreground transition-colors duration-300">
          Begin Your Journey
        </button>
      </div>
    </section>
  );
}
