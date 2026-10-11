"use client";

import React, { useState, useMemo } from "react";
import { Venue, CapacityTier, VenueSortOption } from "@/types/venue";
import { filterAndSortVenues, getVenueCategories } from "@/lib/venues";
import { VenueCategoryNav } from "./VenueCategoryNav";
import { VenueFilters } from "./VenueFilters";
import { VenueEditorialGrid } from "./VenueEditorialGrid";
import { FeaturedVenueSpotlight } from "./FeaturedVenueSpotlight";
import { VenueEmptyState } from "./VenueEmptyState";

interface VenueDiscoveryClientProps {
  initialVenues: Venue[];
  featuredVenue: Venue;
}

export function VenueDiscoveryClient({
  initialVenues,
  featuredVenue,
}: VenueDiscoveryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [capacityTier, setCapacityTier] = useState<CapacityTier>("all");
  const [sortBy, setSortBy] = useState<VenueSortOption>("featured");

  const categories = useMemo(() => getVenueCategories(), []);

  // Filter and sort venues in real-time
  const filteredVenues = useMemo(() => {
    return filterAndSortVenues(initialVenues, {
      category: selectedCategory,
      search: searchQuery,
      capacityTier: capacityTier,
      sortBy: sortBy,
    });
  }, [initialVenues, selectedCategory, searchQuery, capacityTier, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setCapacityTier("all");
    setSortBy("featured");
  };

  return (
    <div id="venue-catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10 sm:space-y-14">
      {/* Category Navigation Strip */}
      <div className="space-y-4">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#521D2B] font-semibold block">
            ROYAL SELECTION
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl display-text font-serif text-[#211A19]">
            Explore by Setting
          </h2>
        </div>

        <VenueCategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          totalCount={initialVenues.length}
        />
      </div>

      {/* Advanced Filter Toolbar */}
      <VenueFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        capacityTier={capacityTier}
        onCapacityChange={setCapacityTier}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalFiltered={filteredVenues.length}
        totalVenues={initialVenues.length}
        onResetFilters={handleResetFilters}
      />

      {/* Venues Gallery or Empty State */}
      {filteredVenues.length > 0 ? (
        <VenueEditorialGrid venues={filteredVenues} />
      ) : (
        <VenueEmptyState
          onReset={handleResetFilters}
          searchQuery={searchQuery}
        />
      )}

      {/* Editorial Featured Venue Spotlight (Shown below catalogue for deeper discovery) */}
      {featuredVenue && (
        <div className="pt-6 sm:pt-10">
          <FeaturedVenueSpotlight venue={featuredVenue} />
        </div>
      )}
    </div>
  );
}
