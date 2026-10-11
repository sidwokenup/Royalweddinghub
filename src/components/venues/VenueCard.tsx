"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Users, DoorOpen, ArrowUpRight } from "lucide-react";
import { Venue } from "@/types/venue";
import { formatPaxRange, formatRooms, formatPrice, formatLocality } from "@/lib/venues";

interface VenueCardProps {
  venue: Venue;
  priority?: boolean;
  className?: string;
  variant?: "standard" | "featured" | "compact" | "portrait";
}

export function VenueCard({
  venue,
  priority = false,
  className = "",
  variant = "standard",
}: VenueCardProps) {
  const [imgError, setImgError] = useState(false);

  const imageUrl = imgError
    ? "/venues/vsquare/thumbnail.jpg"
    : venue.primaryImage.url;

  const paxText = formatPaxRange(venue.capacity);
  const roomsText = formatRooms(venue.capacity.rooms);
  const priceText = formatPrice(venue.food);
  const locality = formatLocality(venue.address, venue.city);

  const isPortrait = variant === "portrait";
  const isFeatured = variant === "featured";

  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-[#E8DFD3] hover:border-[#D6B56D]/80 shadow-[0_4px_20px_rgba(33,26,25,0.05)] hover:shadow-[0_16px_36px_rgba(82,29,43,0.1)] transition-all duration-500 ease-out ${className}`}
    >
      <Link
        href={`/venues/${venue.slug}`}
        className="relative w-full h-full flex flex-col justify-between"
        aria-label={`View details for ${venue.name} in ${venue.city}`}
      >
        {/* Card Media Container */}
        <div
          className={`relative w-full overflow-hidden bg-[#FAF7F2] ${
            isFeatured
              ? "aspect-[16/10] sm:aspect-[16/9]"
              : isPortrait
              ? "aspect-[3/4]"
              : "aspect-[4/3] sm:aspect-[16/11]"
          }`}
        >
          <Image
            src={imageUrl}
            alt={venue.primaryImage.alt || `${venue.name} wedding venue in Lucknow`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            onError={() => setImgError(true)}
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
          />

          {/* Minimal Bottom Gradient for Image Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
            {/* Category Pill */}
            <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-semibold bg-white/95 text-[#521D2B] border border-[#E5DDD2] shadow-xs backdrop-blur-md">
              {venue.category}
            </span>

            {/* Rating Pill */}
            {venue.rating && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#521D2B]/90 text-[#FAF7F2] shadow-xs backdrop-blur-md">
                <Star className="w-3 h-3 fill-[#D6B56D] text-[#D6B56D]" />
                <span>{venue.rating.toFixed(1)}</span>
                {venue.reviewCount && (
                  <span className="text-[9px] text-white/70 font-light">
                    ({venue.reviewCount})
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Floating Arrow Indicator */}
          <div className="absolute bottom-3 right-3 z-10">
            <span className="w-8 h-8 rounded-full bg-white/95 text-[#521D2B] border border-[#E5DDD2] shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#521D2B] group-hover:text-white">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 bg-white">
          <div className="space-y-1.5">
            {/* Locality */}
            <div className="flex items-center gap-1.5 text-xs text-[#78716C] font-light truncate">
              <MapPin className="w-3 h-3 text-[#D6B56D] shrink-0" />
              <span className="truncate">{locality}</span>
            </div>

            {/* Venue Title in Serif */}
            <h3 className="text-xl sm:text-2xl display-text font-serif text-[#211A19] group-hover:text-[#521D2B] transition-colors leading-snug line-clamp-1">
              {venue.name}
            </h3>

            {/* Optional Short Description */}
            {venue.description && (
              <p className="text-xs sm:text-sm text-[#57534E] line-clamp-2 font-light leading-relaxed pt-0.5">
                {venue.description}
              </p>
            )}
          </div>

          {/* Specs & Pricing Strip */}
          <div className="pt-3 border-t border-[#F0EAE1] flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Capacity & Rooms */}
            <div className="flex items-center gap-3 text-[#44403C]">
              <span className="inline-flex items-center gap-1.5 font-medium" title="Guest Capacity">
                <Users className="w-3.5 h-3.5 text-[#521D2B]" />
                <span>{paxText}</span>
              </span>

              {roomsText && (
                <span className="inline-flex items-center gap-1 text-[#78716C]" title="Available Rooms">
                  <DoorOpen className="w-3.5 h-3.5 text-[#D6B56D]" />
                  <span>{roomsText}</span>
                </span>
              )}
            </div>

            {/* Price Info */}
            <div className="text-right">
              <span className="text-[11px] font-medium text-[#521D2B] bg-[#F7F3ED] px-2.5 py-1 rounded-md border border-[#E8E0D5]">
                {priceText}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
