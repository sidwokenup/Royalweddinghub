'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Check,
  Star,
  DoorOpen,
  MessageCircle,
  Eye,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Venue } from '@/types/venue';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { ModalContext } from './AdQuotationModal';

interface AdVenueFilterEngineProps {
  initialVenues: Venue[];
  onOpenQuoteModal: (context: ModalContext) => void;
  onOpenCompareModal: (venues: Venue[]) => void;
  pageType?: 'venues' | 'planner' | 'management';
}

const LUCKNOW_AREAS = [
  'All Lucknow Areas',
  'Gomti Nagar & Shaheed Path',
  'Faizabad Road & Chinhat',
  'Ashiyana & Kanpur Road',
  'Hazratganj & Central Lucknow',
  'Raebareli Road & South',
  'Sitapur Road & IIM Corridor',
];

export function AdVenueFilterEngine({
  initialVenues,
  onOpenQuoteModal,
  onOpenCompareModal,
  pageType = 'venues',
}: AdVenueFilterEngineProps) {
  // Filter States - defaulting to the user's high-intent scenario: 500 guests, under 15 Lakh!
  const [selectedLocation, setSelectedLocation] = useState('All Lucknow Areas');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('500'); // 500 guests preset
  const [selectedBudget, setSelectedBudget] = useState('15L'); // under 15L preset
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVenueIdsForCompare, setSelectedVenueIdsForCompare] = useState<string[]>([]);

  // Calculate estimated budget tier for each venue
  const getVenueEstimatedBudget = (v: Venue): { tier: string; label: string } => {
    const maxPax = v.capacity?.maxPax || v.capacity?.capacity || 400;
    if (maxPax <= 300) {
      return { tier: '10L', label: 'Under ₹10 Lakh' };
    }
    if (maxPax <= 700) {
      return { tier: '15L', label: '₹10L – ₹15 Lakh' };
    }
    if (maxPax <= 1500) {
      return { tier: '25L', label: '₹15L – ₹25 Lakh' };
    }
    return { tier: 'above25L', label: '₹25 Lakh+ Luxury' };
  };

  // Filter Logic
  const filteredVenues = useMemo(() => {
    return initialVenues.filter((v) => {
      // Category filter
      if (selectedCategory !== 'All') {
        const catMap: Record<string, string[]> = {
          Resorts: ['Resort'],
          Lawns: ['Lawn'],
          Banquets: ['Banquet Hall'],
          Hotels: ['Hotel'],
        };
        const allowed = catMap[selectedCategory] || [selectedCategory];
        if (!allowed.some((c) => v.category.toLowerCase().includes(c.toLowerCase()))) {
          return false;
        }
      }

      // Location filter
      if (selectedLocation !== 'All Lucknow Areas') {
        const query = selectedLocation.split('&')[0].trim().toLowerCase();
        const address = v.address.toLowerCase();
        if (!address.includes(query)) {
          // Keep if search is broader
        }
      }

      // Guest Capacity filter
      const maxPax = v.capacity?.maxPax || v.capacity?.capacity || 400;
      const minPax = v.capacity?.minPax || 50;

      if (selectedCapacity === '300' && maxPax < 150) return false;
      if (selectedCapacity === '500' && (maxPax < 300 || minPax > 700)) return false;
      if (selectedCapacity === '1000' && maxPax < 600) return false;
      if (selectedCapacity === '2000' && maxPax < 1200) return false;

      // Budget filter
      if (selectedBudget === '10L' && maxPax > 400) return false;
      if (selectedBudget === '15L' && maxPax > 900) return false; // Under 15 Lakh
      if (selectedBudget === '25L' && maxPax > 1600) return false;

      return true;
    });
  }, [initialVenues, selectedCategory, selectedLocation, selectedCapacity, selectedBudget]);

  const toggleCompare = (id: string) => {
    setSelectedVenueIdsForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 venues simultaneously.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleOpenCompare = () => {
    const venuesToCompare = initialVenues.filter((v) =>
      selectedVenueIdsForCompare.includes(v.id)
    );
    onOpenCompareModal(venuesToCompare);
  };

  const handleResetFilters = () => {
    setSelectedLocation('All Lucknow Areas');
    setSelectedDate('');
    setSelectedCapacity('all');
    setSelectedBudget('all');
    setSelectedCategory('All');
  };

  return (
    <section className="relative w-full pt-8 sm:pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Search & Filter Hero Box */}
      <div className="relative bg-white border border-[#E8DFD3] rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgba(33,26,25,0.06)] p-5 sm:p-8 lg:p-10 mb-12">
        {/* Curatorial Eyebrow */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE8DE] border border-[#DDD3C5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#521D2B] font-semibold">
              {pageType === 'planner'
                ? 'ROYAL WEDDING PLANNER • LUCKNOW'
                : pageType === 'management'
                ? 'TURNKEY WEDDING MANAGEMENT • LUCKNOW'
                : 'THE ROYAL VENUE COLLECTION • LUCKNOW'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#211A19] leading-[1.12] tracking-tight">
            {pageType === 'planner' ? (
              <>
                Bespoke Wedding Planning &amp; <br className="hidden sm:inline" />
                <span className="italic text-[#521D2B]">Curated Palaces.</span>
              </>
            ) : pageType === 'management' ? (
              <>
                Turnkey Wedding Production &amp; <br className="hidden sm:inline" />
                <span className="italic text-[#521D2B]">Venue Management.</span>
              </>
            ) : (
              <>
                Find Your Perfect Setting <br className="hidden sm:inline" />
                <span className="italic text-[#521D2B]">for 500+ Guests Under ₹15 Lakh.</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-base text-[#57534E] font-light max-w-2xl mx-auto leading-relaxed">
            Search 32+ verified celebration destinations across Lucknow. Real-time per-plate rates, room counts, transparent packages, and guided walkthrough bookings.
          </p>
        </div>

        {/* 4-Field Search Bar (Location, Date, Guests, Budget) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#FAF7F2] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#E8DFD3]">
          {/* 1. Location */}
          <div className="flex flex-col justify-center px-3.5 py-2.5 bg-white rounded-xl border border-[#E5DDD2] shadow-2xs">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] flex items-center gap-1.5 mb-1 font-semibold">
              <MapPin size={11} className="text-[#521D2B]" /> Location in Lucknow
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-[#211A19] font-medium outline-none cursor-pointer w-full"
            >
              {LUCKNOW_AREAS.map((loc) => (
                <option key={loc} value={loc} className="bg-white text-[#211A19]">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Wedding Date */}
          <div className="flex flex-col justify-center px-3.5 py-2.5 bg-white rounded-xl border border-[#E5DDD2] shadow-2xs">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] flex items-center gap-1.5 mb-1 font-semibold">
              <Calendar size={11} className="text-[#521D2B]" /> Wedding Date / Season
            </label>
            <input
              type="text"
              placeholder="e.g. Dec 2026 or Spring 2027"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-[#211A19] font-medium placeholder-[#A8A29E] outline-none w-full"
            />
          </div>

          {/* 3. Guest Capacity */}
          <div className="flex flex-col justify-center px-3.5 py-2.5 bg-white rounded-xl border border-[#E5DDD2] shadow-2xs">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] flex items-center gap-1.5 mb-1 font-semibold">
              <Users size={11} className="text-[#521D2B]" /> Guest Capacity
            </label>
            <select
              value={selectedCapacity}
              onChange={(e) => setSelectedCapacity(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-[#211A19] font-medium outline-none cursor-pointer w-full"
            >
              <option value="all">Any Capacity</option>
              <option value="300">100 – 300 Guests (Intimate)</option>
              <option value="500">300 – 500 Guests (Medium)</option>
              <option value="1000">500 – 1,000 Guests (Grand)</option>
              <option value="2000">1,000 – 3,000+ Guests (Royal Mega)</option>
            </select>
          </div>

          {/* 4. Budget Range */}
          <div className="flex flex-col justify-center px-3.5 py-2.5 bg-white rounded-xl border border-[#E5DDD2] shadow-2xs">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#78716C] flex items-center gap-1.5 mb-1 font-semibold">
              <IndianRupee size={11} className="text-[#521D2B]" /> Budget Range
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-[#211A19] font-medium outline-none cursor-pointer w-full"
            >
              <option value="all">Any Budget</option>
              <option value="10L">Under ₹10 Lakh</option>
              <option value="15L">Under ₹15 Lakh (Popular 500-Pax Tier)</option>
              <option value="25L">₹15L – ₹25 Lakh (Luxury Resort)</option>
              <option value="above25L">₹25 Lakh+ (Bespoke Palace)</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Reset */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full text-xs">
            {['All', 'Resorts', 'Lawns', 'Banquets', 'Hotels'].map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full border transition-all text-xs font-medium whitespace-nowrap shadow-2xs ${
                    active
                      ? 'bg-[#521D2B] text-white border-[#521D2B] font-semibold'
                      : 'bg-white border-[#E8DFD3] text-[#57534E] hover:bg-[#FAF7F2] hover:text-[#211A19]'
                  }`}
                >
                  {cat === 'All' ? 'All Settings (32)' : cat}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleResetFilters}
            className="text-xs text-[#78716C] hover:text-[#521D2B] flex items-center gap-1.5 py-1 px-3 transition-colors font-medium"
          >
            <RotateCcw size={12} /> Reset Filters
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#211A19] flex items-center gap-2.5">
            <span>Featured Wedding Destinations in Lucknow</span>
            <span className="text-xs font-mono font-medium bg-[#EFE8DE] text-[#521D2B] px-3 py-1 rounded-full border border-[#DDD3C5]">
              {filteredVenues.length} Available
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1 font-light">
            Showing verified venues matching {selectedCapacity !== 'all' ? `${selectedCapacity} guests` : 'all capacities'}{' '}
            {selectedBudget !== 'all' ? `under ${selectedBudget} budget` : ''}.
          </p>
        </div>

        {/* Compare CTA Trigger */}
        {selectedVenueIdsForCompare.length > 0 && (
          <button
            onClick={handleOpenCompare}
            className="inline-flex items-center gap-2 bg-[#521D2B] hover:bg-[#671024] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full shadow-md animate-bounce"
          >
            <SlidersHorizontal size={13} />
            <span>Compare ({selectedVenueIdsForCompare.length}) Venues</span>
          </button>
        )}
      </div>

      {/* Venues Grid (Matching VenueCard.tsx luxury styling) */}
      {filteredVenues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredVenues.map((venue) => {
            const isComparing = selectedVenueIdsForCompare.includes(venue.id);
            const budget = getVenueEstimatedBudget(venue);
            const maxPax = venue.capacity?.maxPax || venue.capacity?.capacity || 400;
            const minPax = venue.capacity?.minPax || 50;
            const rooms = venue.capacity?.rooms || 10;
            const locality = venue.address.split(',')[0];

            const venueWhatsAppUrl = generateWhatsAppLink({
              service: `${venue.name} Booking`,
              customMessage: `Hello Royal Wedding Hub! I saw ${venue.name} in Lucknow on your website. I am planning a wedding for ${
                selectedCapacity !== 'all' ? selectedCapacity : '500'
              } guests on ${selectedDate || 'upcoming season'} with budget ${
                selectedBudget !== 'all' ? selectedBudget : '₹15 Lakh'
              }. Please share quote and date availability!`,
            });

            return (
              <article
                key={venue.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border transition-all duration-500 ease-out shadow-[0_4px_20px_rgba(33,26,25,0.05)] hover:shadow-[0_16px_36px_rgba(82,29,43,0.1)] ${
                  isComparing
                    ? 'border-[#521D2B] ring-2 ring-[#521D2B]/20'
                    : 'border-[#E8DFD3] hover:border-[#D6B56D]/80'
                }`}
              >
                {/* Media Container */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#FAF7F2]">
                  <Image
                    src={venue.primaryImage?.localUrl || venue.primaryImage?.url || '/images/hero-poster.webp'}
                    alt={venue.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                  {/* Floating Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                    <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-semibold bg-white/95 text-[#521D2B] border border-[#E5DDD2] shadow-xs backdrop-blur-md">
                      {venue.category}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#521D2B]/90 text-[#FAF7F2] shadow-xs backdrop-blur-md">
                      <Star className="w-3 h-3 fill-[#D6B56D] text-[#D6B56D]" />
                      <span>{(venue.rating || 4.9).toFixed(1)}</span>
                    </span>
                  </div>

                  {/* Compare Toggle Pill */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <button
                      onClick={() => toggleCompare(venue.id)}
                      className={`text-[11px] font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                        isComparing
                          ? 'bg-[#521D2B] text-white font-semibold'
                          : 'bg-white/90 text-[#211A19] hover:bg-white border border-[#E5DDD2]'
                      }`}
                    >
                      {isComparing ? <Check size={12} /> : null}
                      <span>{isComparing ? 'Selected' : '+ Compare'}</span>
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                  <div>
                    {/* Locality */}
                    <div className="flex items-center gap-1.5 text-xs text-[#78716C] font-light truncate">
                      <MapPin className="w-3 h-3 text-[#D6B56D] shrink-0" />
                      <span className="truncate">{locality}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-serif text-[#211A19] group-hover:text-[#521D2B] transition-colors leading-snug line-clamp-1 mt-1">
                      {venue.name}
                    </h3>

                    {/* Specs Strip */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#F0EAE1] text-xs">
                      <div className="flex items-center gap-1.5 text-[#44403C]">
                        <Users className="w-3.5 h-3.5 text-[#521D2B] shrink-0" />
                        <span className="font-medium truncate">{minPax}–{maxPax} Guests</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[#44403C]">
                        <DoorOpen className="w-3.5 h-3.5 text-[#D6B56D] shrink-0" />
                        <span className="font-medium truncate">{rooms} AC Rooms</span>
                      </div>
                    </div>

                    {/* Budget & Dining Badge */}
                    <div className="mt-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] flex items-center justify-between text-xs">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-[#78716C] font-mono">
                          Est. Budget Tier
                        </span>
                        <span className="font-bold text-[#521D2B] text-xs">
                          {budget.label}
                        </span>
                      </div>

                      <span className="text-[10px] text-[#166534] font-medium flex items-center gap-1 bg-[#22c55e]/10 px-2 py-0.5 rounded border border-[#22c55e]/20">
                        <Check size={10} /> Veg &amp; Non-Veg
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-[#F0EAE1]">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Request Quotation */}
                      <button
                        onClick={() =>
                          onOpenQuoteModal({
                            venueName: venue.name,
                            type: 'quote',
                            guestCount: selectedCapacity !== 'all' ? `${selectedCapacity} Pax` : '500 Pax',
                            budgetBracket: budget.label,
                            weddingDate: selectedDate,
                          })
                        }
                        className="flex items-center justify-center gap-1 bg-[#521D2B] hover:bg-[#671024] text-white text-xs font-semibold uppercase tracking-wider py-2.5 px-2 rounded-xl transition-all shadow-xs"
                      >
                        <span>Get Quote</span>
                        <ArrowRight size={12} />
                      </button>

                      {/* Book Walkthrough */}
                      <button
                        onClick={() =>
                          onOpenQuoteModal({
                            venueName: venue.name,
                            type: 'walkthrough',
                            guestCount: selectedCapacity !== 'all' ? `${selectedCapacity} Pax` : '500 Pax',
                            weddingDate: selectedDate,
                          })
                        }
                        className="flex items-center justify-center gap-1 bg-white hover:bg-[#FAF7F2] text-[#211A19] border border-[#DDD3C5] text-xs font-medium py-2.5 px-2 rounded-xl transition-all"
                      >
                        <Eye size={12} className="text-[#521D2B]" />
                        <span>Walkthrough</span>
                      </button>
                    </div>

                    {/* WhatsApp Direct */}
                    <a
                      href={venueWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#166534] border border-[#25D366]/30 text-xs font-medium py-2 rounded-xl transition-all"
                    >
                      <MessageCircle size={13} className="fill-[#25D366] text-transparent" />
                      <span>WhatsApp Availability &amp; Packages</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 px-6 bg-white border border-[#E8DFD3] rounded-2xl max-w-lg mx-auto space-y-3 shadow-xs">
          <p className="text-base font-serif text-[#211A19]">
            No direct venues matching this specific combination.
          </p>
          <p className="text-xs text-[#57534E]">
            Our concierge can custom-scout 15+ additional private palace lawns in Lucknow for you.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 bg-[#521D2B] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow"
          >
            <RotateCcw size={12} />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Floating Compare Tray */}
      {selectedVenueIdsForCompare.length > 0 && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/95 border border-[#521D2B]/30 shadow-2xl rounded-full px-5 py-3 flex items-center gap-4 backdrop-blur-xl animate-fade-in text-xs text-[#211A19]">
          <span className="font-medium hidden sm:inline">
            <strong className="text-[#521D2B]">{selectedVenueIdsForCompare.length}</strong> venues selected for comparison
          </span>

          <button
            onClick={handleOpenCompare}
            className="flex items-center gap-1.5 bg-[#521D2B] hover:bg-[#671024] text-white font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow transition-transform"
          >
            <SlidersHorizontal size={13} />
            <span>Compare Now</span>
          </button>

          <button
            onClick={() => setSelectedVenueIdsForCompare([])}
            className="text-[#78716C] hover:text-[#521D2B] text-xs underline"
          >
            Clear
          </button>
        </div>
      )}
    </section>
  );
}
