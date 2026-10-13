"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, MapPin, Users, DoorOpen, Star, ArrowRight, MessageCircle } from "lucide-react";
import { Venue } from "@/types/venue";
import { formatPaxRange, formatRooms, formatPrice, formatLocality } from "@/lib/venues";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface FeaturedVenueSpotlightProps {
  venue: Venue;
}

export function FeaturedVenueSpotlight({ venue }: FeaturedVenueSpotlightProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Combine primary image and gallery photos without duplicates
  const images = [venue.primaryImage, ...(venue.gallery || [])]
    .filter(Boolean)
    .filter((img, idx, arr) => arr.findIndex((item) => item.url === img.url) === idx)
    .slice(0, 5);
  const activeImage = images[activeImageIndex] || venue.primaryImage;

  const paxText = formatPaxRange(venue.capacity);
  const roomsText = formatRooms(venue.capacity.rooms);
  const priceText = formatPrice(venue.food);
  const locality = formatLocality(venue.address, venue.city);

  const whatsappUrl = generateWhatsAppLink({
    service: `Venue Selection for ${venue.name}`,
    customMessage: `Hello Royal Wedding Hub! I am interested in exploring ${venue.name} in ${venue.city} for my wedding. Could you share availability and planning packages?`,
  });

  return (
    <section className="relative w-full py-12 sm:py-20 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="mb-6 sm:mb-10 text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#521D2B] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B56D]" />
            <span>CURATED EDITORIAL SPOTLIGHT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl display-text font-serif text-[#211A19] leading-tight">
            Spotlight: <span className="italic text-[#521D2B]">{venue.name}</span>
          </h2>
        </div>

        {/* Split Editorial Composition: Rich Burgundy Drama Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-[#521D2B] via-[#431622] to-[#2B0E16] border border-[#D6B56D]/35 shadow-[0_24px_60px_rgba(82,29,43,0.25)] text-[#FAF7F2]">
          {/* Left Column: Interactive Photography Showcase (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/40 border border-white/15 shadow-xl">
              <Image
                src={activeImage.url}
                alt={activeImage.alt || venue.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center transition-all duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

              {/* Category Badge & Rating */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-black/60 text-[#FAF7F2] border border-white/20 backdrop-blur-md">
                  {venue.category}
                </span>
                {venue.rating && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-[#FAF7F2] border border-white/30 backdrop-blur-md">
                    <Star className="w-3.5 h-3.5 fill-[#D6B56D] text-[#D6B56D]" />
                    <span>{venue.rating.toFixed(1)}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {images.map((img, idx) => (
                  <button
                    key={`${img.url || "spotlight-thumb"}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 sm:w-24 aspect-[4/3] rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-[#D6B56D] scale-105 shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Editorial Narrative & Specifications (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#FAF7F2]/75">
                <MapPin className="w-3.5 h-3.5 text-[#D6B56D]" />
                <span>{venue.address}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl display-text font-serif text-white leading-snug">
                {venue.name}
              </h3>

              <p className="text-xs sm:text-sm text-[#FAF7F2]/80 font-light leading-relaxed">
                {venue.description ||
                  `A distinguished venue located in ${locality}, offering opulent settings, grand architecture, and verified hospitality for high-profile weddings in Lucknow.`}
              </p>
            </div>

            {/* Spec Matrix Grid */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/15 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#D6B56D] flex items-center gap-1 font-medium">
                  <Users className="w-3 h-3" /> Guest Capacity
                </span>
                <p className="font-medium text-white">{paxText}</p>
              </div>

              {roomsText && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#D6B56D] flex items-center gap-1 font-medium">
                    <DoorOpen className="w-3 h-3" /> Accommodation
                  </span>
                  <p className="font-medium text-white">{roomsText}</p>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#D6B56D] block font-medium">
                  Catering
                </span>
                <p className="font-medium text-white">
                  {venue.food.vegetarian && venue.food.nonVegetarian
                    ? "Veg & Non-Veg"
                    : venue.food.vegetarian
                    ? "Pure Veg"
                    : "Custom Menus"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#D6B56D] block font-medium">
                  Pricing Tier
                </span>
                <p className="font-medium text-white">{priceText}</p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href={`/venues/${venue.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FAF7F2] text-[#521D2B] text-xs uppercase tracking-widest font-semibold hover:bg-white hover:shadow-lg transition-all"
              >
                <span>Discover Venue</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#521D2B]" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Enquire Dates</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
