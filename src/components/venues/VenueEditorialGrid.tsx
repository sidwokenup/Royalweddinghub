"use client";

import React, { useState } from "react";
import { Venue } from "@/types/venue";
import { VenueCard } from "./VenueCard";
import { ArrowDown } from "lucide-react";

interface VenueEditorialGridProps {
  venues: Venue[];
}

export function VenueEditorialGrid({ venues }: VenueEditorialGridProps) {
  const [displayCount, setDisplayCount] = useState(12);

  const visibleVenues = venues.slice(0, displayCount);
  const hasMore = displayCount < venues.length;

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 12, venues.length));
  };

  return (
    <div className="w-full space-y-12">
      {/* Uniform Symmetrical 3-Column Venue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {visibleVenues.map((venue, index) => (
          <VenueCard
            key={venue.id || venue.slug}
            venue={venue}
            variant="standard"
            className="col-span-1 h-full"
            priority={index < 3}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="pt-6 pb-2 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF7F2] border border-[#D8CBBE] hover:border-[#521D2B] text-[#211A19] text-xs sm:text-sm uppercase tracking-widest font-medium transition-all duration-300 shadow-[0_4px_16px_rgba(33,26,25,0.06)] cursor-pointer"
          >
            <span>Load More Venues ({venues.length - displayCount} remaining)</span>
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5 text-[#521D2B]" />
          </button>
        </div>
      )}
    </div>
  );
}
