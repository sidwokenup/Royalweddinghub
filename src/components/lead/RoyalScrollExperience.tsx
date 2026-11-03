'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '@/animations/gsap';
import { X, Sparkles, Crown, ArrowRight, ShieldCheck, Gift } from 'lucide-react';

export function RoyalScrollExperience() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnrolled, setHasUnrolled] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const parchmentBodyRef = useRef<HTMLDivElement>(null);
  const topRollerRef = useRef<HTMLDivElement>(null);
  const bottomRollerRef = useRef<HTMLDivElement>(null);
  const waxSealRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const petalsRef = useRef<HTMLDivElement>(null);

  // 1. Initial 30-second delay, then 60-second recurring interval
  useEffect(() => {
    // Initial 30-second appearance
    const initialTimer = setTimeout(() => {
      setIsOpen(true);
    }, 30000);

    return () => clearTimeout(initialTimer);
  }, []);

  // Listen for manual trigger from navbar or external buttons
  useEffect(() => {
    const handleTrigger = () => {
      setIsMinimized(false);
      setIsOpen(true);
    };

    window.addEventListener('open-royal-scroll', handleTrigger);
    return () => window.removeEventListener('open-royal-scroll', handleTrigger);
  }, []);

  // Interval trigger when closed
  useEffect(() => {
    if (isOpen) return;

    const intervalTimer = setInterval(() => {
      setIsOpen(true);
    }, 60000);

    return () => clearInterval(intervalTimer);
  }, [isOpen]);

  // 2. GSAP 3D Unrolling Motion Choreography
  useEffect(() => {
    if (!isOpen || !scrollWrapperRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => setHasUnrolled(true),
      });

      // Reset initial 3D states
      gsap.set(scrollWrapperRef.current, {
        opacity: 0,
        scale: 0.88,
        y: -40,
        rotateX: 18,
        transformPerspective: 1200,
      });

      gsap.set(parchmentBodyRef.current, {
        height: 0,
        opacity: 0,
        transformOrigin: 'top center',
      });

      gsap.set(bottomRollerRef.current, {
        y: 0,
        rotateX: 0,
      });

      gsap.set(waxSealRef.current, {
        scale: 1,
        opacity: 1,
      });

      gsap.set(contentRef.current, {
        opacity: 0,
        y: 20,
      });

      // Animate Entrance
      tl.to(scrollWrapperRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'back.out(1.2)',
      })
        // Wax Seal Cracks & Gleams
        .to(
          waxSealRef.current,
          {
            scale: 1.15,
            duration: 0.25,
            ease: 'power2.out',
          },
          '-=0.15'
        )
        .to(waxSealRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          ease: 'power2.in',
        })
        // Rollers Counter-Rotate and Parchment Unrolls Downward
        .to(
          parchmentBodyRef.current,
          {
            height: 'auto',
            opacity: 1,
            duration: 1.1,
            ease: 'power3.inOut',
          },
          '-=0.1'
        )
        .to(
          bottomRollerRef.current,
          {
            rotateX: 720,
            duration: 1.1,
            ease: 'power3.inOut',
          },
          '<'
        )
        .to(
          topRollerRef.current,
          {
            rotateX: -360,
            duration: 1.1,
            ease: 'power3.inOut',
          },
          '<'
        )
        // Reveal Calligraphy & Royal Fields
        .to(
          contentRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          },
          '-=0.3'
        );

      // Atmospheric Rose Petals Float
      if (petalsRef.current) {
        const petals = petalsRef.current.children;
        gsap.fromTo(
          petals,
          {
            y: -20,
            opacity: 0,
            rotate: 0,
          },
          {
            y: 'random(40, 120)',
            x: 'random(-30, 30)',
            opacity: 'random(0.4, 0.8)',
            rotate: 'random(-45, 45)',
            duration: 'random(4, 7)',
            repeat: -1,
            yoyo: true,
            stagger: 0.2,
            ease: 'sine.inOut',
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isOpen]);

  // Handle Roll-up & Dismissal
  const handleClose = () => {
    if (!scrollWrapperRef.current) {
      setIsOpen(false);
      setIsMinimized(true);
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.in' },
      onComplete: () => {
        setIsOpen(false);
        setIsMinimized(true);
        setHasUnrolled(false);
      },
    });

    tl.to(contentRef.current, {
      opacity: 0,
      y: -15,
      duration: 0.25,
    })
      .to(
        parchmentBodyRef.current,
        {
          height: 0,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.inOut',
        },
        '-=0.1'
      )
      .to(
        bottomRollerRef.current,
        {
          rotateX: -720,
          duration: 0.6,
          ease: 'power3.inOut',
        },
        '<'
      )
      .to(scrollWrapperRef.current, {
        scale: 0.85,
        opacity: 0,
        y: -30,
        duration: 0.35,
      });
  };

  const handleOpen = () => {
    setIsMinimized(false);
    setIsOpen(true);
  };

  return (
    <>
      {/* =========================================================================
          MINIMIZED FLOATING GOLD EMBLEM (When Scroll is Dismissed)
          ========================================================================= */}
      {(!isOpen || isMinimized) && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-[9980] flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#4A121E] via-[#521D2B] to-[#3B0D16] text-[#F5E296] border border-[#D4AF37]/50 shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
          aria-label="Open Royal Shahi Farman Decree"
        >
          <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center shrink-0 text-[#F5E296] group-hover:rotate-12 transition-transform">
            <Crown size={15} />
          </div>
          <div className="text-left">
            <span className="block text-[10px] font-mono tracking-[0.2em] uppercase text-[#D4AF37] leading-none">
              SHAHI FARMAN
            </span>
            <span className="block text-xs font-serif font-bold text-white tracking-wide mt-0.5">
              Claim ₹50,000 Privilege
            </span>
          </div>
          <Sparkles size={14} className="text-[#D4AF37] animate-pulse ml-0.5" />
        </button>
      )}

      {/* =========================================================================
          MAIN 3D SCROLL EXPERIENCE MODAL
          ========================================================================= */}
      {isOpen && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none"
        >
          {/* Deep Cinematic Vignette Backdrop */}
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(circle at center, rgba(15,10,8,0.78) 0%, rgba(0,0,0,0.92) 100%)',
            }}
          />

          {/* Atmospheric Drifting Rose Petals & Golden Motifs */}
          <div
            ref={petalsRef}
            className="fixed inset-0 pointer-events-none overflow-hidden z-10"
            aria-hidden="true"
          >
            {/* Petal 1 */}
            <div className="absolute top-[15%] left-[18%] w-5 h-7 rounded-[50%_0_50%_50%] bg-gradient-to-br from-[#801328] via-[#521D2B] to-[#360812] shadow-sm rotate-12 blur-[0.3px]" />
            {/* Petal 2 */}
            <div className="absolute top-[28%] right-[22%] w-6 h-8 rounded-[0_50%_50%_50%] bg-gradient-to-br from-[#A31E38] via-[#521D2B] to-[#360812] shadow-sm -rotate-45 blur-[0.5px]" />
            {/* Petal 3 */}
            <div className="absolute top-[65%] left-[12%] w-4 h-6 rounded-[50%_50%_0_50%] bg-gradient-to-br from-[#801328] via-[#451421] to-[#2B060D] shadow-sm rotate-45 blur-[0.2px]" />
            {/* Petal 4 */}
            <div className="absolute top-[75%] right-[15%] w-5 h-7 rounded-[50%_0_50%_50%] bg-gradient-to-br from-[#941A32] via-[#521D2B] to-[#2B060D] shadow-sm -rotate-12 blur-[0.4px]" />
            {/* Golden Star Bokeh 1 */}
            <div className="absolute top-[20%] right-[32%] w-2 h-2 rounded-full bg-[#E5C779] blur-[1px] shadow-[0_0_12px_#E5C779]" />
            {/* Golden Star Bokeh 2 */}
            <div className="absolute top-[70%] left-[28%] w-1.5 h-1.5 rounded-full bg-[#D4AF37] blur-[0.8px] shadow-[0_0_10px_#D4AF37]" />
          </div>

          {/* Main 3D Scroll Assembly */}
          <div
            ref={scrollWrapperRef}
            className="relative z-20 w-full max-w-lg my-auto flex flex-col items-center filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.65)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* =========================================================================
                TOP 3D GOLD CYLINDRICAL ROLLER & LOTUS FINIALS
                ========================================================================= */}
            <div
              ref={topRollerRef}
              className="relative w-[104%] h-7 sm:h-8 flex items-center justify-between z-30 filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Left Lotus Dome Finial */}
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#7A5B1D] via-[#F5E296] to-[#A67C24] border border-[#FDECB0] shadow-md flex items-center justify-center -mr-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#521D2B] border border-[#F5E296]" />
              </div>

              {/* Central Metallic Roller Tube */}
              <div
                className="flex-1 h-5 sm:h-6 rounded-sm relative overflow-hidden"
                style={{
                  background:
                    'linear-gradient(180deg, #5B4212 0%, #A67C24 22%, #F5E296 48%, #FFEAA7 55%, #D4AF37 72%, #4A330B 100%)',
                  boxShadow:
                    'inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -2px 3px rgba(0,0,0,0.5)',
                }}
              >
                {/* Micro Intricate Etch Rings */}
                <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-40">
                  <div className="w-1.5 h-full border-x border-black/40" />
                  <div className="w-1.5 h-full border-x border-black/40" />
                </div>
              </div>

              {/* Right Lotus Dome Finial */}
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-l from-[#7A5B1D] via-[#F5E296] to-[#A67C24] border border-[#FDECB0] shadow-md flex items-center justify-center -ml-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#521D2B] border border-[#F5E296]" />
              </div>
            </div>

            {/* =========================================================================
                IMPERIAL 3D WAX SEAL (Breaks on Entrance)
                ========================================================================= */}
            <div
              ref={waxSealRef}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none"
            >
              {/* Red Silk Ribbon Tails */}
              <div className="relative flex justify-center -space-x-1">
                <div className="w-3.5 h-12 bg-gradient-to-b from-[#521D2B] to-[#360812] -rotate-12 transform origin-top shadow-md" />
                <div className="w-3.5 h-12 bg-gradient-to-b from-[#631C2D] to-[#360812] rotate-12 transform origin-top shadow-md" />
              </div>

              {/* 3D Wax Medallion */}
              <div className="relative -mt-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#731D31] via-[#521D2B] to-[#2B060D] border-2 border-[#E5C779] shadow-[0_6px_20px_rgba(0,0,0,0.6)] flex items-center justify-center ring-2 ring-[#731D31]/40">
                <Crown size={22} className="text-[#F5E296] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              </div>
            </div>

            {/* =========================================================================
                THE UNROLLED AUTHENTIC DECKLED PARCHMENT BODY
                ========================================================================= */}
            <div
              ref={parchmentBodyRef}
              className="relative w-full overflow-hidden transition-all duration-300"
              style={{
                background:
                  'linear-gradient(135deg, #FAF7F2 0%, #F5ECE0 50%, #ECE2D2 100%)',
                boxShadow:
                  'inset 0 0 40px rgba(181, 140, 99, 0.22), 0 10px 40px rgba(0,0,0,0.3)',
              }}
            >
              {/* Antique Gilded Jali Filigree Border Overlay */}
              <div className="absolute inset-2 sm:inset-3 border-2 border-[#D4AF37]/50 pointer-events-none rounded-sm">
                {/* Corner Floral Ornaments */}
                <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#9B7A28]" />
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-[#9B7A28]" />
                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-[#9B7A28]" />
                <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#9B7A28]" />

                {/* Inner Thin Gold Accent Box */}
                <div className="absolute inset-1 border border-[#D4AF37]/25 pointer-events-none" />
              </div>

              {/* Close Button Styled as Antique Gold Seal */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 z-30 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAF7F2] hover:bg-[#521D2B] text-[#78716C] hover:text-[#F5E296] border border-[#D4AF37]/40 shadow-sm flex items-center justify-center transition-all duration-200 cursor-pointer group"
                aria-label="Roll up and close Shahi Farman"
              >
                <X size={15} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>

              {/* =====================================================================
                  PARCHMENT CONTENT: ROYAL DECREE & MARKETING PRIVILEGE
                  ===================================================================== */}
              <div
                ref={contentRef}
                className="relative z-10 px-5 sm:px-8 py-7 sm:py-9 text-center text-[#211A19]"
              >
                {/* Royal Monogram / Header Eyebrow */}
                <div className="inline-flex items-center justify-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9B7A28]" />
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-[#7A5B1D] font-bold">
                    SHAHI FARMAN • IMPERIAL DECREE
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9B7A28]" />
                </div>

                {/* Main Calligraphic Headline */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#3B0D16] tracking-tight leading-[1.18] mt-1">
                  The Royal Wedding Privilege
                </h2>

                <p className="text-xs sm:text-[13px] font-serif italic text-[#78716C] mt-1">
                  Reserved for Upcoming 2026 Auspicious Muhurat Celebrations
                </p>

                {/* High-Converting Greedy Marketing Privilege Badge */}
                <div className="mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#521D2B]/8 via-[#D4AF37]/15 to-[#521D2B]/8 border border-[#D4AF37]/60 text-left relative overflow-hidden shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#521D2B] text-[#F5E296] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Gift size={16} />
                    </div>
                    <div>
                      <p className="text-[12px] sm:text-xs font-bold text-[#3B0D16] leading-snug">
                        Claim ₹50,000 Bespoke Mandap Décor Privilege
                      </p>
                      <p className="text-[11px] text-[#57534E] mt-0.5 leading-relaxed">
                        Or enjoy an exclusive <strong>10% Courtesy on Royal Awadhi Banquets</strong> when you reserve your palace lawn or consultation this week.
                      </p>
                    </div>
                  </div>
                </div>

                {/* =====================================================================
                    VISUAL COMPOSITION: STYLED FORM SLOTS (Visual Mockup for Design Review)
                    ===================================================================== */}
                <div className="mt-5 space-y-3 text-left">
                  {/* Name Field Slot */}
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#7A5B1D] mb-1">
                      Bride / Groom / Family Name
                    </label>
                    <div className="w-full px-3.5 py-2.5 rounded-lg bg-white/80 border border-[#D8CBBE] focus-within:border-[#521D2B] text-xs font-medium text-[#211A19] shadow-inner transition-colors">
                      <input
                        type="text"
                        placeholder="e.g. Royal Kapoor &amp; Sharma Celebration"
                        className="w-full bg-transparent outline-none placeholder:text-[#A8A29E]"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Number & Auspicious Date Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#7A5B1D] mb-1">
                        WhatsApp Number
                      </label>
                      <div className="w-full px-3.5 py-2.5 rounded-lg bg-white/80 border border-[#D8CBBE] focus-within:border-[#521D2B] text-xs font-medium text-[#211A19] shadow-inner transition-colors">
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="w-full bg-transparent outline-none placeholder:text-[#A8A29E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#7A5B1D] mb-1">
                        Wedding Month / Muhurat
                      </label>
                      <div className="w-full px-3.5 py-2.5 rounded-lg bg-white/80 border border-[#D8CBBE] focus-within:border-[#521D2B] text-xs font-medium text-[#211A19] shadow-inner transition-colors">
                        <input
                          type="text"
                          placeholder="e.g. November 2026"
                          className="w-full bg-transparent outline-none placeholder:text-[#A8A29E]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Royal Preferred Setting / Venue Type */}
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[#7A5B1D] mb-1">
                      Celebration Style &amp; Guest Size
                    </label>
                    <div className="w-full px-3.5 py-2.5 rounded-lg bg-white/80 border border-[#D8CBBE] text-xs font-medium text-[#211A19] shadow-inner">
                      <select className="w-full bg-transparent outline-none text-[#57534E] cursor-pointer">
                        <option>Palace Lawn (500 – 1,500 Guests)</option>
                        <option>Heritage Banquet Hall (200 – 500 Guests)</option>
                        <option>Poolside Wedding Resort &amp; Buyout</option>
                        <option>Full Turnkey Planning &amp; Catering Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Royal CTA Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#521D2B] via-[#6B182B] to-[#450F1D] text-[#F5E296] hover:text-white font-serif font-bold text-xs sm:text-sm uppercase tracking-[0.2em] shadow-[0_8px_24px_rgba(82,29,43,0.35)] hover:shadow-[0_12px_32px_rgba(82,29,43,0.45)] hover:scale-[1.01] active:scale-[0.99] border border-[#D4AF37]/50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <Crown size={15} className="group-hover:rotate-12 transition-transform" />
                      <span>Claim Privilege &amp; Lock Dates</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Trust & Direct Concierge Guarantee */}
                  <div className="pt-1 flex items-center justify-center gap-4 text-[10px] sm:text-[11px] font-medium text-[#78716C]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={12} className="text-[#9B7A28]" />
                      <span>100% Confidential</span>
                    </span>
                    <span>•</span>
                    <span>Direct Concierge Callback in 15 Mins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                BOTTOM 3D GOLD CYLINDRICAL ROLLER & SILK TASSELS
                ========================================================================= */}
            <div
              ref={bottomRollerRef}
              className="relative w-[104%] h-7 sm:h-8 flex items-center justify-between z-30 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Left Lotus Dome Finial */}
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#7A5B1D] via-[#F5E296] to-[#A67C24] border border-[#FDECB0] shadow-md flex items-center justify-center -mr-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#521D2B] border border-[#F5E296]" />
              </div>

              {/* Central Metallic Roller Tube */}
              <div
                className="flex-1 h-5 sm:h-6 rounded-sm relative overflow-hidden"
                style={{
                  background:
                    'linear-gradient(180deg, #5B4212 0%, #A67C24 22%, #F5E296 48%, #FFEAA7 55%, #D4AF37 72%, #4A330B 100%)',
                  boxShadow:
                    'inset 0 1px 2px rgba(255,255,255,0.6), inset 0 -2px 3px rgba(0,0,0,0.5)',
                }}
              >
                {/* Micro Intricate Etch Rings */}
                <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-40">
                  <div className="w-1.5 h-full border-x border-black/40" />
                  <div className="w-1.5 h-full border-x border-black/40" />
                </div>
              </div>

              {/* Right Lotus Dome Finial */}
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-l from-[#7A5B1D] via-[#F5E296] to-[#A67C24] border border-[#FDECB0] shadow-md flex items-center justify-center -ml-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#521D2B] border border-[#F5E296]" />
              </div>
            </div>

            {/* Hanging Gilded Silk Tassels */}
            <div className="flex justify-between w-3/4 -mt-1 px-8 pointer-events-none">
              <div className="w-2 h-7 bg-gradient-to-b from-[#9B7A28] via-[#D4AF37] to-transparent rounded-b-full shadow-sm opacity-80" />
              <div className="w-2 h-7 bg-gradient-to-b from-[#9B7A28] via-[#D4AF37] to-transparent rounded-b-full shadow-sm opacity-80" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

