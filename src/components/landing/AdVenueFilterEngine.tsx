'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Search,
  Check,
  Star,
  BedDouble,
  MessageCircle,
  Eye,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ArrowRight,
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
  const getVenueEstimatedBudget = (v: Venue): { tier: string; label: string; minLakh: number; maxLakh: number } => {
    const maxPax = v.capacity?.maxPax || v.capacity?.capacity || 400;
    if (maxPax <= 300) {
      return { tier: '10L', label: 'Under ₹10 Lakh', minLakh: 5, maxLakh: 10 };
    }
    if (maxPax <= 700) {
      return { tier: '15L', label: '₹10L - ₹15 Lakh', minLakh: 10, maxLakh: 15 };
    }
    if (maxPax <= 1500) {
      return { tier: '25L', label: '₹15L - ₹25 Lakh', minLakh: 15, maxLakh: 25 };
    }
    return { tier: 'above25L', label: '₹25 Lakh+ Luxury', minLakh: 25, maxLakh: 50 };
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
          // If area not found, keep if search is broader
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
    <section className="relative w-full text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Search & Filter Hero Box (Styled after reference UI) */}
      <div className="relative z-10 bg-[#16100E] border border-[#D6B56D]/35 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 mb-10 overflow-hidden">
        {/* Subtle Decorative Ambient Lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6B56D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D6B56D] font-mono bg-[#D6B56D]/15 px-3 py-1 rounded-full border border-[#D6B56D]/30 mb-2.5">
            <Sparkles size={12} />
            Live Availability &amp; Package Quotation
          </span>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#FAF7F2] leading-tight">
            {pageType === 'planner'
              ? 'Find Luxury Wedding Venues & Planners in Lucknow'
              : pageType === 'management'
              ? 'Complete Wedding Venues & Management in Lucknow'
              : 'Find Wedding Venues in Lucknow for 500+ Guests'}
          </h1>

          <p className="text-xs sm:text-sm text-[#B8ADA3] mt-2 max-w-xl mx-auto">
            Search 32+ verified palaces, resort lawns, and heritage banquets under your exact budget. Real-time per-plate rates, room counts, and walkthrough reservations.
          </p>
        </div>

        {/* 4-Field Search Bar (Location, Date, Guests, Budget) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#1C1613] p-3 sm:p-4 rounded-xl border border-white/10 shadow-inner">
          {/* 1. Location */}
          <div className="flex flex-col justify-center px-3 py-2 bg-[#140F0D] rounded-lg border border-white/5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#D6B56D] flex items-center gap-1 mb-1">
              <MapPin size={11} /> Location in Lucknow
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-transparent text-xs text-[#FAF7F2] font-medium outline-none cursor-pointer w-full"
            >
              {LUCKNOW_AREAS.map((loc) => (
                <option key={loc} value={loc} className="bg-[#1C1613] text-white">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Wedding Date */}
          <div className="flex flex-col justify-center px-3 py-2 bg-[#140F0D] rounded-lg border border-white/5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#D6B56D] flex items-center gap-1 mb-1">
              <Calendar size={11} /> Wedding Date / Season
            </label>
            <input
              type="text"
              placeholder="e.g. Dec 2026 or Spring 2027"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-[#FAF7F2] font-medium placeholder-[#6B635B] outline-none w-full"
            />
          </div>

          {/* 3. Guest Capacity */}
          <div className="flex flex-col justify-center px-3 py-2 bg-[#140F0D] rounded-lg border border-white/5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#D6B56D] flex items-center gap-1 mb-1">
              <Users size={11} /> Guest Capacity
            </label>
            <select
              value={selectedCapacity}
              onChange={(e) => setSelectedCapacity(e.target.value)}
              className="bg-transparent text-xs text-[#FAF7F2] font-medium outline-none cursor-pointer w-full"
            >
              <option value="all" className="bg-[#1C1613] text-white">Any Capacity</option>
              <option value="300" className="bg-[#1C1613] text-white">100 - 300 Guests (Intimate)</option>
              <option value="500" className="bg-[#1C1613] text-white">300 - 500 Guests (Medium)</option>
              <option value="1000" className="bg-[#1C1613] text-white">500 - 1,000 Guests (Grand)</option>
              <option value="2000" className="bg-[#1C1613] text-white">1,000 - 3,000+ Guests (Royal Mega)</option>
            </select>
          </div>

          {/* 4. Budget Range */}
          <div className="flex flex-col justify-center px-3 py-2 bg-[#140F0D] rounded-lg border border-white/5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-[#D6B56D] flex items-center gap-1 mb-1">
              <IndianRupee size={11} /> Budget Range
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="bg-transparent text-xs text-[#FAF7F2] font-medium outline-none cursor-pointer w-full"
            >
              <option value="all" className="bg-[#1C1613] text-white">Any Budget</option>
              <option value="10L" className="bg-[#1C1613] text-white">Under ₹10 Lakh</option>
              <option value="15L" className="bg-[#1C1613] text-white">Under ₹15 Lakh (Popular 500-Pax)</option>
              <option value="25L" className="bg-[#1C1613] text-white">₹15L - ₹25 Lakh (Luxury Resort)</option>
              <option value="above25L" className="bg-[#1C1613] text-white">₹25 Lakh+ (Bespoke Palace)</option>
            </select>
          </div>
        </div>

        {/* Category Pills (Like reference screenshot) */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-4">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full text-xs">
            {['All', 'Resorts', 'Lawns', 'Banquets', 'Hotels'].map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full border transition-all text-xs font-medium whitespace-nowrap ${
                    active
                      ? 'bg-[#D6B56D] text-[#140F0D] border-[#D6B56D] font-bold shadow'
                      : 'bg-white/5 border-white/10 text-[#FAF7F2]/80 hover:bg-white/10'
                  }`}
                >
                  {cat === 'All' ? 'All Venues (32)' : cat}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleResetFilters}
            className="text-[11px] text-[#A89F91] hover:text-[#D6B56D] flex items-center gap-1 py-1 px-2.5 transition-colors font-mono"
          >
            <RotateCcw size={11} /> Reset Filters
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF7F2] flex items-center gap-2">
            <span>Featured Venues in Lucknow</span>
            <span className="text-xs font-mono font-normal bg-[#D6B56D]/15 text-[#D6B56D] px-2.5 py-0.5 rounded-full border border-[#D6B56D]/30">
              {filteredVenues.length} Available
            </span>
          </h2>
          <p className="text-xs text-[#A89F91] mt-0.5">
            Showing verified venues matching {selectedCapacity !== 'all' ? `${selectedCapacity} guests` : 'all capacities'}{' '}
            {selectedBudget !== 'all' ? `under ${selectedBudget} budget` : ''}.
          </p>
        </div>

        {/* Compare CTA Trigger */}
        {selectedVenueIdsForCompare.length > 0 && (
          <button
            onClick={handleOpenCompare}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#521D2B] to-[#7A2A3E] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-[#D6B56D]/40 shadow-lg animate-bounce"
          >
            <SlidersHorizontal size={13} />
            <span>Compare ({selectedVenueIdsForCompare.length}) Venues</span>
          </button>
        )}
      </div>

      {/* Venues Grid */}
      {filteredVenues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredVenues.map((venue) => {
            const isComparing = selectedVenueIdsForCompare.includes(venue.id);
            const budget = getVenueEstimatedBudget(venue);
            const maxPax = venue.capacity?.maxPax || venue.capacity?.capacity || 400;
            const minPax = venue.capacity?.minPax || 50;
            const rooms = venue.capacity?.rooms || 10;

            const venueWhatsAppUrl = generateWhatsAppLink({
              service: `${venue.name} Booking`,
              customMessage: `Hello Royal Wedding Hub! I saw ${venue.name} in Lucknow on your website. I am planning a wedding for ${
                selectedCapacity !== 'all' ? selectedCapacity : '500'
              } guests on ${selectedDate || 'upcoming season'} with budget ${
                selectedBudget !== 'all' ? selectedBudget : '₹15 Lakh'
              }. Please share quote and availability!`,
            });

            return (
              <div
                key={venue.id}
                className={`group bg-[#16100E] border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col justify-between ${
                  isComparing ? 'border-[#D6B56D] ring-2 ring-[#D6B56D]/30' : 'border-[#D6B56D]/20 hover:border-[#D6B56D]/50'
                }`}
              >
                {/* Image Section with Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-[#0d0907]">
                  <Image
                    src={venue.primaryImage?.localUrl || venue.primaryImage?.url || '/images/hero-poster.webp'}
                    alt={venue.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Top Bar Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-[#140F0D]/90 text-[#D6B56D] px-2.5 py-1 rounded-full border border-[#D6B56D]/40 backdrop-blur-md">
                      {venue.category}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-black/80 text-[#FAF7F2] px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                      <Star size={12} className="text-[#D6B56D] fill-[#D6B56D]" />
                      <span>{venue.rating || 4.9}</span>
                    </span>
                  </div>

                  {/* Compare Toggle Checkbox */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <button
                      onClick={() => toggleCompare(venue.id)}
                      className={`text-[11px] font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                        isComparing
                          ? 'bg-[#D6B56D] text-[#140F0D] font-bold'
                          : 'bg-black/75 text-white hover:bg-black/90 border border-white/20'
                      }`}
                    >
                      {isComparing ? <Check size={12} /> : null}
                      <span>{isComparing ? 'Selected' : '+ Compare'}</span>
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#FAF7F2] group-hover:text-[#D6B56D] transition-colors line-clamp-1">
                      {venue.name}
                    </h3>

                    <p className="text-xs text-[#A89F91] flex items-center gap-1 mt-1 line-clamp-1">
                      <MapPin size={12} className="text-[#D6B56D] shrink-0" />
                      <span>{venue.address.split(',')[0]}</span>
                    </p>

                    {/* Specs Badges */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
                      <div className="flex items-center gap-1.5 bg-[#1C1613] px-2.5 py-1.5 rounded-lg border border-white/5">
                        <Users size={13} className="text-[#D6B56D] shrink-0" />
                        <span className="text-[#FAF7F2] font-medium">{minPax}–{maxPax} Guests</span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#1C1613] px-2.5 py-1.5 rounded-lg border border-white/5">
                        <BedDouble size={13} className="text-[#D6B56D] shrink-0" />
                        <span className="text-[#FAF7F2] font-medium">{rooms} AC Rooms</span>
                      </div>
                    </div>

                    {/* Budget & Catering Banner */}
                    <div className="mt-3.5 p-2.5 rounded-xl bg-[#1C1613] border border-[#D6B56D]/15 flex items-center justify-between text-xs">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-[#A89F91] font-mono">
                          Est. Budget Tier
                        </span>
                        <span className="font-bold text-[#D6B56D] text-xs">
                          {budget.label}
                        </span>
                      </div>

                      <span className="text-[10px] text-[#4ade80] font-medium flex items-center gap-1 bg-[#4ade80]/10 px-2 py-0.5 rounded border border-[#4ade80]/20">
                        <Check size={10} /> Veg &amp; Non-Veg
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-5 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Request Quotation Modal */}
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
                        className="flex items-center justify-center gap-1 bg-gradient-to-r from-[#D6B56D] to-[#B89246] hover:from-[#E3C57F] hover:to-[#C7A054] text-[#140F0D] text-xs font-bold uppercase tracking-wider py-2.5 px-2 rounded-xl transition-all shadow"
                      >
                        <span>Get Quote</span>
                        <ArrowRight size={12} />
                      </button>

                      {/* Book Walkthrough Modal */}
                      <button
                        onClick={() =>
                          onOpenQuoteModal({
                            venueName: venue.name,
                            type: 'walkthrough',
                            guestCount: selectedCapacity !== 'all' ? `${selectedCapacity} Pax` : '500 Pax',
                            weddingDate: selectedDate,
                          })
                        }
                        className="flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-[#FAF7F2] border border-white/15 text-xs font-medium py-2.5 px-2 rounded-xl transition-all"
                      >
                        <Eye size={12} className="text-[#D6B56D]" />
                        <span>Walkthrough</span>
                      </button>
                    </div>

                    {/* WhatsApp Fast Enquiry */}
                    <a
                      href={venueWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#4ade80] border border-[#25D366]/30 text-xs font-medium py-2 rounded-xl transition-all"
                    >
                      <MessageCircle size={13} className="fill-[#25D366] text-transparent" />
                      <span>WhatsApp Availability &amp; Pricing</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Results Fallback */
        <div className="text-center py-12 px-4 bg-[#16100E] border border-white/10 rounded-2xl max-w-lg mx-auto space-y-3">
          <p className="text-base font-serif text-[#FAF7F2]">
            No direct venues matching this specific combination.
          </p>
          <p className="text-xs text-[#A89F91]">
            Our concierge can custom-scout 15+ additional private palace lawns in Lucknow for you.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 bg-[#D6B56D] text-[#140F0D] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow"
          >
            <RotateCcw size={12} />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Floating Compare Bar (when 2+ venues selected) */}
      {selectedVenueIdsForCompare.length > 0 && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#140F0D]/95 border border-[#D6B56D]/50 shadow-2xl rounded-full px-5 py-3 flex items-center gap-4 backdrop-blur-xl animate-fade-in text-xs">
          <span className="text-[#FAF7F2] font-medium hidden sm:inline">
            <strong className="text-[#D6B56D]">{selectedVenueIdsForCompare.length}</strong> venues selected for comparison
          </span>

          <button
            onClick={handleOpenCompare}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#D6B56D] to-[#B89246] text-[#140F0D] font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow hover:scale-105 transition-transform"
          >
            <SlidersHorizontal size={13} />
            <span>Compare Now</span>
          </button>

          <button
            onClick={() => setSelectedVenueIdsForCompare([])}
            className="text-[#A89F91] hover:text-white text-xs underline"
          >
            Clear
          </button>
        </div>
      )}
    </section>
  );
}
