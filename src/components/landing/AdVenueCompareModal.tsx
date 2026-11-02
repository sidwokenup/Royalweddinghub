'use client';

import React from 'react';
import Image from 'next/image';
import { X, Check, Users, BedDouble, Utensils, MapPin, Sparkles, Send } from 'lucide-react';
import { Venue } from '@/types/venue';

interface AdVenueCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  venues: Venue[];
  onSelectQuote: (venueName: string) => void;
}

export function AdVenueCompareModal({
  isOpen,
  onClose,
  venues,
  onSelectQuote,
}: AdVenueCompareModalProps) {
  if (!isOpen || venues.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div className="relative w-full max-w-5xl bg-[#140F0D] border border-[#D6B56D]/30 rounded-2xl shadow-2xl p-4 sm:p-8 text-white overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D6B56D] font-mono flex items-center gap-1.5 mb-1">
              <Sparkles size={11} />
              Side-by-Side Matrix
            </span>
            <h3 id="compare-modal-title" className="text-xl sm:text-2xl font-serif font-bold text-[#FAF7F2]">
              Compare Wedding Venues in Lucknow
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A89F91] hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Close Comparison"
          >
            <X size={18} />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="overflow-x-auto py-4 flex-1">
          <div
            className="grid gap-4 min-w-[640px]"
            style={{ gridTemplateColumns: `repeat(${venues.length}, minmax(220px, 1fr))` }}
          >
            {venues.map((v) => {
              const maxGuests = v.capacity?.maxPax || v.capacity?.capacity || 500;
              const rooms = v.capacity?.rooms || 10;
              const budgetEstimate =
                maxGuests <= 300
                  ? 'Under ₹10 Lakh'
                  : maxGuests <= 700
                  ? '₹10L - ₹15 Lakh'
                  : maxGuests <= 1500
                  ? '₹15L - ₹25 Lakh'
                  : '₹25 Lakh+ Luxury';

              return (
                <div
                  key={v.id}
                  className="bg-[#1C1613] border border-[#D6B56D]/20 rounded-xl p-4 flex flex-col justify-between"
                >
                  {/* Image & Title */}
                  <div>
                    <div className="relative h-36 w-full rounded-lg overflow-hidden mb-3 bg-[#0a0705]">
                      <Image
                        src={v.primaryImage?.localUrl || v.primaryImage?.url || '/images/hero-poster.webp'}
                        alt={v.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider bg-[#140F0D]/90 text-[#D6B56D] px-2 py-0.5 rounded font-mono border border-[#D6B56D]/30">
                        {v.category}
                      </span>
                    </div>

                    <h4 className="text-base font-serif font-bold text-[#FAF7F2] mb-1 line-clamp-1">
                      {v.name}
                    </h4>

                    <p className="text-[11px] text-[#A89F91] flex items-center gap-1 mb-3 line-clamp-1">
                      <MapPin size={11} className="text-[#D6B56D] shrink-0" />
                      <span>{v.address.split(',')[0]}</span>
                    </p>

                    {/* Specs Table */}
                    <div className="space-y-2.5 text-xs py-3 border-y border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[#A89F91] flex items-center gap-1.5">
                          <Users size={12} className="text-[#D6B56D]" /> Guest Capacity
                        </span>
                        <span className="font-semibold text-[#FAF7F2]">
                          {v.capacity?.minPax || 100} - {maxGuests} Pax
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#A89F91] flex items-center gap-1.5">
                          <BedDouble size={12} className="text-[#D6B56D]" /> Guest Rooms
                        </span>
                        <span className="font-semibold text-[#FAF7F2]">{rooms} AC Rooms</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#A89F91] flex items-center gap-1.5">
                          <Utensils size={12} className="text-[#D6B56D]" /> Dining
                        </span>
                        <span className="font-semibold text-[#4ade80] flex items-center gap-1">
                          <Check size={12} /> Veg & Non-Veg
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[#A89F91]">Est. Budget Range</span>
                        <span className="font-bold text-[#D6B56D] text-[11px] bg-[#D6B56D]/10 px-2 py-0.5 rounded border border-[#D6B56D]/30">
                          {budgetEstimate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 space-y-2">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectQuote(v.name);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#D6B56D] to-[#B89246] hover:from-[#E3C57F] hover:to-[#C7A054] text-[#140F0D] text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg shadow transition-all"
                    >
                      <Send size={12} />
                      <span>Request Quote</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
