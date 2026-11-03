'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Sparkles,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';

export interface ReelStory {
  id: string;
  videoSrc: string;
  title: string;
  coupleOrFamily: string;
  celebrationType: string;
  location: string;
  quote: string;
  tag: string;
}

const FAMILY_REELS: ReelStory[] = [
  {
    id: 'haldi-ceremony',
    videoSrc: '/videos/Happyfamily/Bridehaldiceremony.mp4',
    title: 'The Golden Haldi Ritual',
    coupleOrFamily: 'Real Bride Celebration',
    celebrationType: 'Phoolon Ki Holi & Haldi',
    location: 'Lucknow Heritage Lawn',
    quote: 'The floral decor and Haldi arrangement were beyond our dreams!',
    tag: 'Haldi Special',
  },
  {
    id: 'ishaan-aditi',
    videoSrc: '/videos/Happyfamily/Ishaandadittheperfectbrideandgroom.mp4',
    title: "Ishaan & Aditi's Grand Union",
    coupleOrFamily: 'Ishaan & Aditi',
    celebrationType: 'Royal Jaimala & Reception',
    location: 'Palace Resort, Gomti Nagar',
    quote: 'From venue booking to royal catering, everything was seamless.',
    tag: 'Royal Couple',
  },
  {
    id: 'cutest-couples',
    videoSrc: '/videos/Happyfamily/OurCutestCouples.mp4',
    title: 'Timeless Romance',
    coupleOrFamily: 'Candid Couple Moments',
    celebrationType: 'Wedding Day Memories',
    location: 'Shaheed Path, Lucknow',
    quote: 'Royal Wedding Hub made our special day utterly stress-free.',
    tag: 'Couple Portrait',
  },
  {
    id: 'rajput-family',
    videoSrc: '/videos/Happyfamily/SandeepRajputandfamily.mp4',
    title: 'The Rajput Family Celebration',
    coupleOrFamily: 'Sandeep Rajput & Family',
    celebrationType: 'Grand Shahi Wedding',
    location: 'Kanpur Road, Lucknow',
    quote: 'Our guests still talk about the royal hospitality and management.',
    tag: 'Family Blessings',
  },
  {
    id: 'groom-prateek',
    videoSrc: '/videos/Happyfamily/TheGroomPrateek.mp4',
    title: "Prateek's Royal Shahi Baraat",
    coupleOrFamily: 'Prateek & Family',
    celebrationType: 'Baraat & Vintage Entry',
    location: 'VIP Road, Lucknow',
    quote: 'The vintage car entry and pyrotechnic cold pyro were spectacular.',
    tag: 'Groom Entry',
  },
  {
    id: 'honest-review',
    videoSrc: '/videos/Happyfamily/TheHonestone.mp4',
    title: 'Unfiltered Family Memoir',
    coupleOrFamily: 'Family Testimonial',
    celebrationType: 'Complete Wedding Planning',
    location: 'Alambagh, Lucknow',
    quote: 'Genuine rates, verified venues, and 100% transparent coordination.',
    tag: 'Honest Feedback',
  },
];

export function HomeHappyFamilyReels() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [unmutedVideoId, setUnmutedVideoId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // Store references to all video elements
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Check scroll positions for chevron visibility & active index indicator
  const updateScrollStatus = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    // Calculate which card is currently in view
    const cardWidth = el.querySelector('.reel-card')?.clientWidth || 280;
    const gap = 16;
    const currentIndex = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveStoryIndex(Math.min(Math.max(currentIndex, 0), FAMILY_REELS.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollStatus();
    el.addEventListener('scroll', updateScrollStatus, { passive: true });
    window.addEventListener('resize', updateScrollStatus);

    return () => {
      el.removeEventListener('scroll', updateScrollStatus);
      window.removeEventListener('resize', updateScrollStatus);
    };
  }, [updateScrollStatus]);

  // Handle Play/Pause toggle
  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) {
      // Pause all other videos
      Object.entries(videoRefs.current).forEach(([otherId, otherVideo]) => {
        if (otherVideo && otherId !== id && !otherVideo.paused) {
          otherVideo.pause();
        }
      });

      video.play().then(() => {
        setPlayingVideoId(id);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    } else {
      video.pause();
      setPlayingVideoId(null);
    }
  };

  // Handle Mute/Unmute toggle (strictly 1 unmuted video at a time)
  const toggleSound = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    if (unmutedVideoId === id) {
      // Mute this video
      video.muted = true;
      setUnmutedVideoId(null);
    } else {
      // Unmute this video, ensure all others are muted
      Object.entries(videoRefs.current).forEach(([otherId, otherVideo]) => {
        if (otherVideo) {
          otherVideo.muted = otherId !== id;
        }
      });
      video.muted = false;
      setUnmutedVideoId(id);

      // Also ensure it is playing
      if (video.paused) {
        togglePlay(id);
      }
    }
  };

  // Scroll navigation handlers
  const scrollByCard = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const cardWidth = el.querySelector('.reel-card')?.clientWidth || 280;
    const scrollAmount = (cardWidth + 20) * (direction === 'left' ? -1 : 1);
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Pause videos when scrolled out of viewport
  useEffect(() => {
    const sectionEl = document.getElementById('happy-families-reels');
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            // Pause all videos when user leaves section
            Object.values(videoRefs.current).forEach((v) => {
              if (v && !v.paused) v.pause();
            });
            setPlayingVideoId(null);
            setUnmutedVideoId(null);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, []);

  const whatsappInquiryUrl = generateWhatsAppLink({
    service: 'Happy Family Wedding Story',
    customMessage: 'Namaste Royal Wedding Hub! I saw your real wedding stories and family videos. I would like to plan a similar celebration for our family.',
  });

  return (
    <section
      id="happy-families-reels"
      className="w-full py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E8DFD3] relative overflow-hidden select-none"
    >
      {/* Ambient background glows */}
      <div
        className="absolute top-10 left-1/3 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(214,181,109,0.08)_0%,_transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(82,29,43,0.05)_0%,_transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 sm:mb-14 border-b border-[#E8DFD3] pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#521D2B] bg-[#521D2B]/8 px-3.5 py-1 rounded-full border border-[#521D2B]/15 font-semibold">
              <HeartHandshake size={13} className="text-[#521D2B]" />
              Real Celebrations
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#211A19] mt-3 tracking-tight font-serif">
              What Happy Families Say
            </h2>
            <p className="text-sm sm:text-base text-[#57534E] mt-2 font-normal max-w-2xl leading-relaxed">
              Real moments, unfiltered blessings, and joyful reflections from couples and families whose weddings were orchestrated by Royal Wedding Hub in Lucknow.
            </p>
          </div>

          {/* Desktop Arrow Controls & WhatsApp Hook */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#521D2B]/8 hover:bg-[#521D2B] text-[#521D2B] hover:text-[#FAF7F2] border border-[#521D2B]/20 text-xs font-semibold tracking-wide transition-all shadow-xs"
            >
              <MessageCircle size={14} />
              <span>Share Your Story</span>
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCard('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll reels left"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'border-[#521D2B]/30 bg-white text-[#521D2B] hover:bg-[#521D2B] hover:text-[#FAF7F2] shadow-xs cursor-pointer'
                    : 'border-[#E8DFD3] bg-white/40 text-[#B8ADA3] cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => scrollByCard('right')}
                disabled={!canScrollRight}
                aria-label="Scroll reels right"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'border-[#521D2B]/30 bg-white text-[#521D2B] hover:bg-[#521D2B] hover:text-[#FAF7F2] shadow-xs cursor-pointer'
                    : 'border-[#E8DFD3] bg-white/40 text-[#B8ADA3] cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Reels Container (Swipe on Mobile, Slider on Desktop) */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 pt-1 px-1 -mx-4 sm:mx-0 px-4 sm:px-0 overscroll-x-contain"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {FAMILY_REELS.map((reel, index) => {
            const isPlaying = playingVideoId === reel.id;
            const isUnmuted = unmutedVideoId === reel.id;

            return (
              <div
                key={reel.id}
                className="reel-card shrink-0 w-[275px] sm:w-[290px] md:w-[310px] snap-center group relative rounded-3xl overflow-hidden bg-[#181310] border border-[#D6B56D]/30 shadow-[0_8px_24px_rgba(33,26,25,0.12)] hover:shadow-[0_12px_36px_rgba(82,29,43,0.2)] transition-all duration-300"
              >
                {/* 9:16 Video Container */}
                <div
                  onClick={() => togglePlay(reel.id)}
                  className="relative aspect-[9/16] w-full overflow-hidden bg-black cursor-pointer"
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[reel.id] = el;
                    }}
                    src={reel.videoSrc}
                    playsInline
                    loop
                    preload="metadata"
                    muted={!isUnmuted}
                    onPlay={() => setPlayingVideoId(reel.id)}
                    onPause={() => {
                      if (playingVideoId === reel.id) setPlayingVideoId(null);
                    }}
                    className="w-full h-full object-cover select-none"
                  />

                  {/* Gradient vignettes for clean text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35 pointer-events-none" />

                  {/* Top Header Tag Pill */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-[#D6B56D]/40 text-[#D6B56D] text-[10px] font-mono uppercase tracking-wider font-semibold shadow-xs">
                      <Sparkles size={11} className="text-[#D6B56D]" />
                      <span>{reel.tag}</span>
                    </span>

                    <span className="text-[10px] font-mono text-[#FAF7F2]/80 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Play / Pause Centered Trigger */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-300 z-10 ${
                      isPlaying
                        ? 'opacity-0 group-hover:opacity-100 hover:opacity-100'
                        : 'opacity-100'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-[#D6B56D]/60 text-[#FAF7F2] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                      {isPlaying ? (
                        <Pause size={22} className="text-[#D6B56D]" />
                      ) : (
                        <Play size={22} className="text-[#D6B56D] translate-x-0.5" fill="currentColor" />
                      )}
                    </div>
                  </div>

                  {/* Bottom Corner Sound Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleSound(reel.id, e)}
                    aria-label={isUnmuted ? 'Mute audio' : 'Unmute audio'}
                    className="absolute bottom-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-[#D6B56D]/50 text-[#FAF7F2] hover:text-[#D6B56D] hover:border-[#D6B56D] flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
                    title={isUnmuted ? 'Click to Mute' : 'Click to Unmute Sound'}
                  >
                    {isUnmuted ? (
                      <Volume2 size={16} className="text-emerald-400 animate-pulse" />
                    ) : (
                      <VolumeX size={16} className="text-[#B8ADA3]" />
                    )}
                  </button>

                  {/* Bottom Story Information Overlay */}
                  <div className="absolute bottom-0 left-0 right-14 p-4 z-10 pointer-events-none">
                    <div className="text-[11px] font-mono text-[#D6B56D] uppercase tracking-wider font-semibold">
                      {reel.celebrationType}
                    </div>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-[#FAF7F2] leading-snug mt-0.5 drop-shadow-sm line-clamp-1">
                      {reel.title}
                    </h3>
                    <p className="text-[11px] text-[#FAF7F2]/90 mt-1 line-clamp-2 leading-relaxed font-light italic">
                      &ldquo;{reel.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#FAF7F2]/75 font-mono">
                      <MapPin size={11} className="text-[#D6B56D] shrink-0" />
                      <span className="truncate">{reel.location}</span>
                    </div>
                  </div>

                  {/* Active playing indicator line */}
                  {isPlaying && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#521D2B] via-[#D6B56D] to-[#521D2B] animate-pulse z-20" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Pagination Dots & Counter */}
        <div className="flex sm:hidden items-center justify-between mt-4 px-2">
          <div className="flex items-center gap-1.5">
            {FAMILY_REELS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeStoryIndex === idx
                    ? 'w-6 bg-[#521D2B]'
                    : 'w-1.5 bg-[#E8DFD3]'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-mono text-[#8C8070]">
            Story {activeStoryIndex + 1} of {FAMILY_REELS.length} (Swipe ↔)
          </span>
        </div>

        {/* Bottom Trust & Consultation Strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#F7F3ED] via-white to-[#F7F3ED] border border-[#E8DFD3] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#521D2B]/10 border border-[#521D2B]/20 text-[#521D2B] flex items-center justify-center shrink-0 mx-auto md:mx-0 shadow-xs">
              <Sparkles size={22} className="text-[#521D2B]" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-serif font-bold text-[#211A19]">
                Want your dream wedding planned with this regal perfection?
              </h4>
              <p className="text-xs sm:text-sm text-[#57534E] mt-0.5">
                Speak directly with Lucknow&apos;s senior wedding concierge for verified venues, decor quotations, and muhurat availability.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-center">
            <Link
              href="/venues"
              className="px-5 py-3 rounded-full bg-white hover:bg-[#FAF7F2] text-[#211A19] border border-[#E8DFD3] text-xs font-semibold uppercase tracking-wider transition-all shadow-xs text-center"
            >
              Browse Venues
            </Link>
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#521D2B] hover:bg-[#671024] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md text-center"
            >
              Consult Concierge
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

