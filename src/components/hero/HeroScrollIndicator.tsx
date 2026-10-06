"use client";

import { useScrollTo } from "@/animations/scroll/LenisProvider";

export function HeroScrollIndicator() {
  const scrollTo = useScrollTo();

  const handleScrollClick = () => {
    scrollTo("#services", { duration: 1.4 });
  };

  return (
    <button
      type="button"
      onClick={handleScrollClick}
      className="hero-scroll-indicator group absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer select-none text-white/60 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f3e5d8]"
      aria-label="Scroll to explore our wedding collections"
    >
      <span className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase font-light text-[#f3e5d8]/75 group-hover:text-white transition-colors duration-300">
        SCROLL
      </span>

      {/* Cinematic subtle vertical line indicator */}
      <div className="relative w-[1px] h-8 sm:h-10 bg-white/20 overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-[#f3e5d8] to-transparent animate-scroll-pill" 
          aria-hidden="true"
        />
      </div>
    </button>
  );
}
