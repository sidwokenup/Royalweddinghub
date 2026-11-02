'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, Sparkles, ArrowRight, Building2, Utensils, Camera, Palette, Music, X } from 'lucide-react';
import { getAllVenues } from '@/lib/venues';

const ROTATING_PLACEHOLDERS = [
  "Search 'Palace Lawns in Gomti Nagar'...",
  "Search 'Mandap Decor & Floral Themes'...",
  "Search 'Royal Awadhi Catering Menus'...",
  "Search '500 Guests Under ₹15 Lakh'...",
  "Search '4K Cinematic Wedding Films'...",
  "Search 'Heritage Resorts on Faizabad Road'...",
];

const SEARCHABLE_SERVICES = [
  { name: 'Wedding Venues & Palaces', category: 'Venues', url: '/venues', icon: Building2 },
  { name: 'Planning & Theme Decor', category: 'Services', url: '/services/planning-and-decor', icon: Palette },
  { name: 'Royal Awadhi Catering', category: 'Services', url: '/services/catering-and-culinary', icon: Utensils },
  { name: 'Photography & 4K Cinema', category: 'Services', url: '/services/photography-and-films', icon: Camera },
  { name: 'DJs, Sufi & Live Music', category: 'Services', url: '/services/entertainment-and-music', icon: Music },
  { name: 'Bridal Styling & Makeup', category: 'Services', url: '/services/styling-and-trousseau', icon: Sparkles },
  { name: 'Turnkey Wedding Management', category: 'Services', url: '/wedding-management-lucknow', icon: Sparkles },
];

export function HeroTranslucentSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<{ name: string; category: string; url: string; icon: any }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotating placeholder interval
  useEffect(() => {
    if (isFocused || query.length > 0) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isFocused, query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching services and venues
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const venues = getAllVenues();

    const matchedServices = SEARCHABLE_SERVICES.filter(
      (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    ).map((s) => ({ ...s }));

    const matchedVenues = venues
      .filter((v) => v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q))
      .slice(0, 4)
      .map((v) => ({
        name: v.name,
        category: `Venue • ${v.address.split(',')[0]}`,
        url: `/venues/${v.slug}`,
        icon: Building2,
      }));

    setResults([...matchedServices, ...matchedVenues]);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      router.push(results[0].url);
      setIsFocused(false);
    } else if (query.toLowerCase().includes('15') || query.toLowerCase().includes('lakh')) {
      router.push('/wedding-venues-lucknow');
    } else {
      router.push(`/venues?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto text-left select-none">
      {/* Translucent Modern Search Input Bar */}
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center bg-white/90 backdrop-blur-xl rounded-full border transition-all duration-300 shadow-[0_16px_40px_rgba(0,0,0,0.24)] p-1.5 sm:p-2 ${isFocused ? 'ring-2 ring-[#521D2B]/30 border-[#521D2B] bg-white' : 'border-white/50 hover:bg-white'
          }`}
      >
        {/* Search Icon */}
        <div className="pl-3.5 sm:pl-4 pr-2 text-[#521D2B] shrink-0">
          <Search size={20} className="transition-transform group-hover:scale-110" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
          className="flex-1 bg-transparent text-sm sm:text-base font-medium text-[#211A19] placeholder:text-[#78716C] placeholder:transition-opacity outline-none py-2 pr-2 min-w-0"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="p-1.5 text-[#78716C] hover:text-[#211A19] rounded-full hover:bg-black/5 mr-1 transition-colors"
          >
            <X size={15} />
          </button>
        )}

        {/* Search Submit Button */}
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 bg-[#521D2B] hover:bg-[#671024] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider px-5 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-md transition-all shrink-0 cursor-pointer"
        >
          <span>Search</span>
          <ArrowRight size={14} className="hidden sm:inline" />
        </button>
      </form>

      {/* Live Search Auto-Suggestion Dropdown */}
      {isFocused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-2xl rounded-2xl border border-[#E8DFD3] shadow-[0_20px_50px_rgba(0,0,0,0.18)] overflow-hidden z-50 animate-fade-in divide-y divide-[#F0EAE1]">
          {results.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  router.push(item.url);
                  setIsFocused(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#FAF7F2] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#521D2B]/8 text-[#521D2B] flex items-center justify-center shrink-0">
                    <IconComponent size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#211A19] group-hover:text-[#521D2B] transition-colors truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#78716C] uppercase tracking-wider font-mono">
                      {item.category}
                    </p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#A8A29E] group-hover:text-[#521D2B] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>
            );
          })}
        </div>
      )}

      {/* Popular Quick-Click Pill Tags (WedMeGood Pattern) */}
      <div className="mt-3.5 flex items-center flex-wrap justify-center sm:justify-start gap-2 text-xs text-white/95 px-1">
        <span className="font-semibold text-white/80 text-[11px] uppercase tracking-wider mr-0.5">
          Popular:
        </span>

        <Link
          href="/wedding-venues-lucknow"
          className="inline-flex items-center gap-1 bg-black/45 hover:bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/25 text-white text-[11px] font-medium transition-all hover:border-white/60"
        >
          <span>500 Guests Under ₹15L</span>
        </Link>

        <Link
          href="/venues"
          className="inline-flex items-center gap-1 bg-black/45 hover:bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/25 text-white text-[11px] font-medium transition-all hover:border-white/60"
        >
          <span>Palace Lawns</span>
        </Link>

        <Link
          href="/services/catering-and-culinary"
          className="inline-flex items-center gap-1 bg-black/45 hover:bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/25 text-white text-[11px] font-medium transition-all hover:border-white/60"
        >
          <span>Awadhi Catering</span>
        </Link>

        <Link
          href="/services/photography-and-films"
          className="hidden sm:inline-flex items-center gap-1 bg-black/45 hover:bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/25 text-white text-[11px] font-medium transition-all hover:border-white/60"
        >
          <span>4K Cinema</span>
        </Link>

        <Link
          href="/services/planning-and-decor"
          className="hidden md:inline-flex items-center gap-1 bg-black/45 hover:bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/25 text-white text-[11px] font-medium transition-all hover:border-white/60"
        >
          <span>Mandap Decor</span>
        </Link>
      </div>
    </div>
  );
}

