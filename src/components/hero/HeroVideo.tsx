"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HeroVideoProps {
  onVideoReady?: () => void;
}

export function HeroVideo({ onVideoReady }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure muted is explicitly set programmatically for reliable mobile autoplay
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // Accessibility & Data Saver respect: if reduced motion or data saver is active, keep high-res poster
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

    if (prefersReducedMotion || saveData) {
      onVideoReady?.();
      return;
    }

    // Detect mobile viewport (<= 768px)
    const mql = window.matchMedia("(max-width: 768px)");
    const targetFile = mql.matches ? "/videos/Mobile.mp4" : "/videos/Desktop.mp4";

    let isCancelled = false;

    const startVideo = () => {
      if (isCancelled || !video) return;
      if (!video.src || !video.src.endsWith(targetFile)) {
        video.src = targetFile;
        video.load();
      }

      const tryPlay = () => {
        video.play().then(() => {
          if (!isCancelled) {
            setIsVideoPlaying(true);
            onVideoReady?.();
          }
        }).catch(() => {});
      };

      if (video.readyState >= 2) {
        tryPlay();
      } else {
        const handleCanPlay = () => {
          tryPlay();
        };
        video.addEventListener("canplay", handleCanPlay, { once: true });
      }
    };

    // User interaction triggers immediate playback
    const triggerNow = () => {
      window.removeEventListener("pointerdown", triggerNow);
      window.removeEventListener("scroll", triggerNow);
      window.removeEventListener("touchstart", triggerNow);
      startVideo();
    };

    window.addEventListener("pointerdown", triggerNow, { once: true, passive: true });
    window.addEventListener("scroll", triggerNow, { once: true, passive: true });
    window.addEventListener("touchstart", triggerNow, { once: true, passive: true });

    // Schedule playback during idle time so FCP, LCP, and main-thread hydration complete at maximum score
    let timeoutId: NodeJS.Timeout | null = null;
    let idleId: number | null = null;

    const schedulePlayback = () => {
      if ("requestIdleCallback" in window) {
        idleId = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(startVideo, { timeout: 1800 });
      } else {
        timeoutId = setTimeout(startVideo, 1200);
      }
    };

    if (document.readyState === "complete") {
      schedulePlayback();
    } else {
      window.addEventListener("load", schedulePlayback, { once: true });
      timeoutId = setTimeout(startVideo, 2000);
    }

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
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (idleId && "cancelIdleCallback" in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
      window.removeEventListener("pointerdown", triggerNow);
      window.removeEventListener("scroll", triggerNow);
      window.removeEventListener("touchstart", triggerNow);
      mql.removeEventListener("change", handleMediaChange);
    };
  }, [onVideoReady]);

  return (
    <div className="hero-video-container absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-[#0d0a08]">
      {/* High-priority LCP poster image: renders instantly at frame 0 */}
      <Image
        src="/images/hero-poster.webp"
        alt="Royal Wedding Hub Luxury Indian Wedding"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={80}
        className="object-cover object-[center_35%] md:object-center transition-opacity duration-700"
      />

      {/* Cinematic video background: smoothly fades in once loaded without blocking initial page paint */}
      <video
        ref={videoRef}
        id="hero-bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        suppressHydrationWarning={true}
        aria-hidden="true"
        tabIndex={-1}
        className={`w-full h-full object-cover object-[center_35%] md:object-center transition-opacity duration-700 ${
          isVideoPlaying ? "opacity-100" : "opacity-0"
        }`}
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
