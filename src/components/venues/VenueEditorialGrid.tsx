"use client";

import React, { useState } from "react";
import { Venue } from "@/types/venue";
import { VenueCard } from "./VenueCard";
import { ArrowDown, Sparkles } from "lucide-react";

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
      {/* Asymmetric Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {visibleVenues.map((venue, index) => {
          // Editorial rhythm:
          // Index 0: Large Featured card (span 2 cols on lg)
          // Index 1: Portrait card (span 1 col)
          // Index 4: Wide featured card (span 2 cols on md/lg)
          // Index 7: Portrait card
          // Others: Standard card
          const isLargeFeatured = index === 0;
          const isSecondWide = index === 4;
          const isPortrait = index === 1 || index === 7;

          let colSpan = "col-span-1";
          let variant: "standard" | "featured" | "portrait" = "standard";

          if (isLargeFeatured) {
            colSpan = "md:col-span-2 lg:col-span-2";
            variant = "featured";
          } else if (isSecondWide && visibleVenues.length > 5) {
            colSpan = "md:col-span-2 lg:col-span-2";
            variant = "featured";
          } else if (isPortrait) {
            variant = "portrait";
          }

          return (
            <React.Fragment key={venue.id || venue.slug}>
              {/* Occasional Editorial Moment Strip after index 5 */}
              {index === 5 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-6 my-2">
                  <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-[#521D2B] via-[#431622] to-[#2E0F17] border border-[#D6B56D]/30 text-center flex flex-col items-center justify-center space-y-4 shadow-[0_16px_40px_rgba(82,29,43,0.2)]">
                    <div className="flex items-center gap-2 text-[#D6B56D] text-xs uppercase tracking-[0.3em] font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>THE ROYAL TOUCH</span>
                    </div>
                    <blockquote className="text-2xl sm:text-3xl md:text-4xl display-text font-serif text-[#FAF7F2] max-w-2xl font-normal italic leading-snug">
                      “Every palace, garden, and ballroom holds the promise of an unforgettable celebration.”
                    </blockquote>
                    <p className="text-xs sm:text-sm text-[#FAF7F2]/75 max-w-md font-light leading-relaxed">
                      We personally inspect, negotiate, and curate every wedding venue in Lucknow for our couples.
                    </p>
                  </div>
                </div>
              )}

              <VenueCard
                venue={venue}
                variant={variant}
                className={colSpan}
                priority={index < 3}
              />
            </React.Fragment>
          );
        })}
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
