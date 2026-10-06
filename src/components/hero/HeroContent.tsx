import { HeroCTA } from "./HeroCTA";

export function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl mx-auto my-auto select-none">
      {/* Eyebrow / Category badge */}
      <div className="hero-eyebrow flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <span className="w-5 sm:w-8 h-[1px] bg-[#f3e5d8]/40" aria-hidden="true" />
        <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#f3e5d8] font-light">
          THE ART OF CELEBRATION
        </span>
        <span className="w-5 sm:w-8 h-[1px] bg-[#f3e5d8]/40" aria-hidden="true" />
      </div>

      {/* Main Editorial Heading */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl display-text tracking-tight text-white leading-[1.08] sm:leading-[1.06] mb-4 sm:mb-6">
        <span className="hero-title-line block italic font-normal text-white/95">
          Your Forever,
        </span>
        <span className="hero-title-line block font-normal text-white">
          Beautifully Planned.
        </span>
      </h1>

      {/* Supporting Editorial Subtitle */}
      <p className="hero-subtitle text-xs sm:text-sm md:text-base font-light tracking-[0.06em] max-w-lg sm:max-w-xl mx-auto text-white/85 leading-relaxed mb-7 sm:mb-9">
        Curating bespoke, royal celebrations across the world&apos;s most breathtaking palaces and destinations.
      </p>

      {/* BOOK NOW Action */}
      <div className="hero-cta-slot">
        <HeroCTA />
      </div>
    </div>
  );
}
