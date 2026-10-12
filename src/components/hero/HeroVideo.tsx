"use client";

import { useEffect, useRef } from "react";

interface HeroVideoProps {
  onVideoReady?: () => void;
}

export function HeroVideo({ onVideoReady }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure muted is explicitly set programmatically for reliable mobile autoplay
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // Detect mobile viewport (<= 768px)
    const mql = window.matchMedia("(max-width: 768px)");
    const targetFile = mql.matches ? "/videos/Mobile.mp4" : "/videos/Desktop.mp4";

    // Defer video source assignment slightly to allow HTML/CSS/Fonts first paint
    const timer = setTimeout(() => {
      if (!video.src || !video.src.endsWith(targetFile)) {
        video.src = targetFile;
        video.load();
      }

      const tryPlay = () => {
        video.play().catch(() => {});
      };

      if (video.readyState >= 2) {
        tryPlay();
        onVideoReady?.();
      } else {
        const handleCanPlay = () => {
          tryPlay();
          onVideoReady?.();
        };
        video.addEventListener("canplay", handleCanPlay, { once: true });
      }
    }, 50);

    // Handle viewport resize across mobile/desktop breakpoint without downloading both upfront
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const newTarget = e.matches ? "/videos/Mobile.mp4" : "/videos/Desktop.mp4";
      if (!video.src.endsWith(newTarget)) {
        const currentTime = video.currentTime;
        video.src = newTarget;
        video.currentTime = currentTime;
        video.play().catch(() => {});
      }
    };

    mql.addEventListener("change", handleMediaChange);

    return () => {
      clearTimeout(timer);
      mql.removeEventListener("change", handleMediaChange);
    };
  }, [onVideoReady]);

  return (
    <div className="hero-video-container absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-[#0d0a08]">
      <video
        ref={videoRef}
        id="hero-bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/hero-poster.webp"
        suppressHydrationWarning={true}
        aria-hidden="true"
        tabIndex={-1}
        className="w-full h-full object-cover object-[center_35%] md:object-center transition-opacity duration-700"
      />


      {/* Cinematic subtle overlays - strictly delicate to preserve wedding footage clarity */}
      
      {/* 1. Subtle vertical film gradient: keeps bride/groom vibrant while ensuring typography contrast */}
      <div 
        className="hero-overlay-gradient absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/50" 
        aria-hidden="true" 
      />

      {/* 2. Soft warm vignette: delicate champagne/amber tones around perimeter for a royal film aesthetic */}
      <div 
        className="hero-overlay-vignette absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_35%,_rgba(25,16,10,0.35)_100%)]" 
        aria-hidden="true" 
      />
    </div>
  );
}
