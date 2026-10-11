"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown, Users, RotateCcw } from "lucide-react";
import { CapacityTier, VenueSortOption } from "@/types/venue";

interface VenueFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  capacityTier: CapacityTier;
  onCapacityChange: (tier: CapacityTier) => void;
  sortBy: VenueSortOption;
  onSortChange: (sort: VenueSortOption) => void;
  totalFiltered: number;
  totalVenues: number;
  onResetFilters: () => void;
}

export function VenueFilters({
  searchQuery,
  onSearchChange,
  capacityTier,
  onCapacityChange,
  sortBy,
  onSortChange,
  totalFiltered,
  totalVenues,
  onResetFilters,
}: VenueFiltersProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const capacityOptions: { label: string; value: CapacityTier; desc: string }[] = [
    { label: "Any Capacity", value: "all", desc: "All guest counts" },
    { label: "Intimate", value: "intimate", desc: "< 300 Guests" },
    { label: "Grand", value: "grand", desc: "300 – 1000 Guests" },
    { label: "Royal", value: "royal", desc: "1000+ Guests" },
  ];

  const sortOptions: { label: string; value: VenueSortOption }[] = [
    { label: "Featured", value: "featured" },
    { label: "Name (A – Z)", value: "name-asc" },
    { label: "Capacity (High to Low)", value: "capacity-desc" },
    { label: "Capacity (Low to High)", value: "capacity-asc" },
    { label: "Rating (Highest)", value: "rating-desc" },
  ];

  const hasActiveFilters = searchQuery.trim() !== "" || capacityTier !== "all" || sortBy !== "featured";

  return (
    <div className="w-full space-y-3.5">
      {/* Main Search & Quick Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/95 border border-[#E3DACF] shadow-[0_4px_20px_rgba(33,26,25,0.04)] backdrop-blur-md">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#521D2B]" />
          <input
            id="venue-search-input"
            name="venue-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by venue name, address, or amenity..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#FAF7F2] text-sm text-[#211A19] placeholder-[#8C827A] rounded-xl border border-[#E5DDD2] focus:outline-none focus:border-[#521D2B] focus:ring-1 focus:ring-[#521D2B] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#211A19] p-1 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Desktop Filter Chips: Capacity */}
        <div className="hidden lg:flex items-center gap-1.5 px-1">
          {capacityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onCapacityChange(opt.value)}
              className={`px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer font-medium ${
                capacityTier === opt.value
                  ? "bg-[#521D2B] text-[#FAF7F2] shadow-xs"
                  : "text-[#57534E] hover:text-[#211A19] hover:bg-[#FAF7F2] border border-[#EBE3D8]"
              }`}
              title={opt.desc}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#521D2B] pointer-events-none" />
            <select
              id="venue-sort-select"
              name="venue-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as VenueSortOption)}
              className="appearance-none pl-8 pr-7 py-2.5 bg-[#FAF7F2] text-xs font-medium text-[#211A19] rounded-xl border border-[#E5DDD2] focus:outline-none focus:border-[#521D2B] transition-colors cursor-pointer"
              aria-label="Sort Venues"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-white text-[#211A19]">
                  Sort: {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Filter Drawer Button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className={`lg:hidden px-3.5 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer ${
              capacityTier !== "all"
                ? "bg-[#521D2B] text-white border-[#521D2B]"
                : "bg-[#FAF7F2] text-[#211A19] border-[#E5DDD2] hover:bg-white"
            }`}
            aria-label="Open capacity filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Capacity</span>
            {capacityTier !== "all" && (
              <span className="w-2 h-2 rounded-full bg-[#D6B56D]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Expandable) */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden p-4 rounded-2xl bg-white border border-[#E3DACF] shadow-lg space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#EAE2D8]">
            <span className="text-xs uppercase tracking-wider text-[#521D2B] font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Guest Capacity
            </span>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="text-[#8C827A] hover:text-[#211A19] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {capacityOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onCapacityChange(opt.value);
                  setIsMobileDrawerOpen(false);
                }}
                className={`p-2.5 rounded-xl text-left text-xs transition-colors border cursor-pointer ${
                  capacityTier === opt.value
                    ? "bg-[#521D2B] border-[#521D2B] text-white font-medium shadow-xs"
                    : "bg-[#FAF7F2] border-[#E5DDD2] text-[#211A19]"
                }`}
              >
                <div className="font-medium">{opt.label}</div>
                <div className={`text-[10px] font-light ${capacityTier === opt.value ? "text-white/75" : "text-[#78716C]"}`}>{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header Status */}
      <div className="flex items-center justify-between px-2 text-xs text-[#78716C] font-light">
        <span>
          Showing <strong className="text-[#211A19] font-medium">{totalFiltered}</strong> of{" "}
          <strong className="text-[#211A19] font-medium">{totalVenues}</strong> venues
        </span>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[#521D2B] font-medium hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
