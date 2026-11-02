import React from 'react';
import Image from 'next/image';

export function HeroImage() {
  return (
    <div className="hero-video-container absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-[#0d0a08]">
      <Image
        src="/images/hero.jpg"
        alt="Happy Indian Bride and Groom - Royal Wedding Hub Lucknow"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-[center_30%] md:object-center"
      />

      {/* Modern High-Contrast Photographic Overlays */}
      <div 
        className="hero-overlay-gradient absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/55" 
        aria-hidden="true" 
      />

      <div 
        className="hero-overlay-vignette absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_25%,_rgba(15,10,8,0.55)_100%)]" 
        aria-hidden="true" 
      />
    </div>
  );
}

