'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Sparkles, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

const VENDOR_SERVICES = [
  { id: 'venues', label: 'Wedding Venues & Palaces', url: '/venues', badge: '32 Locations' },
  { id: 'planning-decor', label: 'Wedding Planners & Decor', url: '/services/planning-and-decor', badge: 'Stages & Mandaps' },
  { id: 'catering', label: 'Royal Awadhi Catering', url: '/services/catering-and-culinary', badge: 'Khansama Menus' },
  { id: 'photography', label: 'Photographers & 4K Cinema', url: '/services/photography-and-films', badge: 'Drone & Films' },
  { id: 'entertainment', label: 'DJs, Sufi & Live Music', url: '/services/entertainment-and-music', badge: 'Sangeet Artists' },
  { id: 'bridal-makeup', label: 'Bridal Styling & Makeup', url: '/services/styling-and-trousseau', badge: 'Trousseau' },
  { id: 'management', label: 'Turnkey Wedding Management', url: '/wedding-management-lucknow', badge: 'End-to-End' },
];

const LUCKNOW_AREAS = [
  { id: 'all', label: 'All Lucknow Areas' },
  { id: 'gomti-nagar', label: 'Gomti Nagar & Shaheed Path' },
  { id: 'faizabad-rd', label: 'Faizabad Road & Chinhat' },
  { id: 'hazratganj', label: 'Hazratganj & Central' },
  { id: 'kanpur-rd', label: 'Kanpur Road & Ashiyana' },
  { id: 'raebareli-rd', label: 'Raebareli Road & South' },
  { id: 'under-15l', label: '500 Guests Under ₹15 Lakh' },
  { id: 'luxury-resorts', label: 'Luxury Resorts & Palaces' },
];

export function ModernHeroSearch() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState('venues');
  const [selectedArea, setSelectedArea] = useState('all');
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNavigating(true);

    if (selectedArea === 'under-15l') {
      router.push('/wedding-venues-lucknow');
      return;
    }

    const matchedService = VENDOR_SERVICES.find((s) => s.id === selectedService);
    if (matchedService) {
      router.push(matchedService.url);
    } else {
      router.push('/venues');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-left">
      {/* Modern High-Conversion Search Box (WedMeGood Pattern) */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.22)] border border-[#E8DFD3] p-2.5 sm:p-3 flex flex-col md:flex-row items-center gap-2.5 transition-all"
      >
        {/* 1. Select Vendor Type / Service */}
        <div className="flex-1 w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] md:bg-transparent border md:border-0 border-[#E8DFD3]">
          <div className="w-8 h-8 rounded-lg bg-[#521D2B]/8 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#521D2B]" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-xs uppercase tracking-wider text-[#521D2B] font-bold mb-0.5">
              Select Vendor Type
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#211A19] outline-none cursor-pointer truncate"
            >
              {VENDOR_SERVICES.map((s) => (
                <option key={s.id} value={s.id} className="text-[#211A19] py-1">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Divider on Desktop */}
        <div className="hidden md:block w-px h-10 bg-[#E8DFD3]" />

        {/* 2. Select Locality / Area in Lucknow */}
        <div className="flex-1 w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] md:bg-transparent border md:border-0 border-[#E8DFD3]">
          <div className="w-8 h-8 rounded-lg bg-[#521D2B]/8 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-[#521D2B]" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-xs uppercase tracking-wider text-[#521D2B] font-bold mb-0.5">
              Select Location / Budget
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#211A19] outline-none cursor-pointer truncate"
            >
              {LUCKNOW_AREAS.map((a) => (
                <option key={a.id} value={a.id} className="text-[#211A19] py-1">
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. High-Contrast Action Button */}
        <button
          type="submit"
          disabled={isNavigating}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#521D2B] hover:bg-[#671024] active:scale-[0.98] text-white font-semibold text-sm uppercase tracking-wider px-7 py-3.5 sm:py-4 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Search size={16} />
          <span>{isNavigating ? 'Searching...' : 'Find Vendors'}</span>
          <ArrowRight size={14} className="hidden sm:inline" />
        </button>
      </form>

      {/* Popular Searches Strip (Direct WedMeGood Benchmark Feature) */}
      <div className="mt-3.5 flex items-center flex-wrap gap-2 text-xs text-white/90 px-1">
        <span className="font-semibold text-white/70 text-[11px] uppercase tracking-wider">
          Popular Searches:
        </span>

        <Link
          href="/wedding-venues-lucknow"
          className="inline-flex items-center gap-1 bg-black/40 hover:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[11px] transition-all hover:border-white/50"
        >
          <span>500 Guests Under ₹15L</span>
        </Link>

        <Link
          href="/venues"
          className="inline-flex items-center gap-1 bg-black/40 hover:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[11px] transition-all hover:border-white/50"
        >
          <span>Heritage Palace Lawns</span>
        </Link>

        <Link
          href="/services/catering-and-culinary"
          className="inline-flex items-center gap-1 bg-black/40 hover:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[11px] transition-all hover:border-white/50"
        >
          <span>Awadhi Royal Catering</span>
        </Link>

        <Link
          href="/services/photography-and-films"
          className="hidden sm:inline-flex items-center gap-1 bg-black/40 hover:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[11px] transition-all hover:border-white/50"
        >
          <span>4K Cinematic Films</span>
        </Link>

        <Link
          href="/wedding-planner-lucknow"
          className="hidden sm:inline-flex items-center gap-1 bg-black/40 hover:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[11px] transition-all hover:border-white/50"
        >
          <span>Turnkey Planning</span>
        </Link>
      </div>
    </div>
  );
}

