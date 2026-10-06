"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useScrollTo } from "@/animations/scroll/LenisProvider";

export function HeroCTA() {
  const scrollTo = useScrollTo();
  const [isPressed, setIsPressed] = useState(false);

  const triggerScroll = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 240);
    scrollTo("#services", { duration: 1.4, offset: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    triggerScroll();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerScroll();
    }
  };

  return (
    <div className="hero-cta-wrapper inline-flex items-center justify-center">
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`group relative inline-flex items-center justify-center gap-3.5 px-8 sm:px-10 py-3.5 sm:py-4 min-h-[48px] rounded-[2px] cursor-pointer select-none transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f3e5d8] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
          isPressed ? "scale-[0.98] brightness-125" : "hover:scale-[1.01]"
        }`}
        aria-label="Book Now - Explore wedding planning services"
      >
        {/* Glass backdrop & champagne border */}
        <div 
          className="absolute inset-0 rounded-[2px] bg-white/[0.08] backdrop-blur-md border border-[#f3e5d8]/35 shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-500 ease-out group-hover:bg-white/[0.15] group-hover:border-[#f3e5d8]/75 group-hover:shadow-[0_0_28px_rgba(243,229,216,0.24)]" 
          aria-hidden="true"
        />

        {/* Ambient champagne hairline highlight on top edge */}
        <div 
          className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#f3e5d8]/70 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" 
          aria-hidden="true"
        />

        {/* Button Typography */}
        <span className="relative z-10 text-[11px] sm:text-xs font-medium tracking-[0.28em] uppercase text-white transition-transform duration-300 ease-out group-hover:translate-x-0.5">
          BOOK NOW
        </span>

        {/* Sophisticated Animated Arrow */}
        <ArrowRight
          size={14}
          strokeWidth={1.75}
          className="relative z-10 text-[#f3e5d8] transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:text-white"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
