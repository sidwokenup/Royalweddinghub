"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Images, Maximize2 } from "lucide-react";
import { VenueImage } from "@/types/venue";
import { VenueLightbox } from "./VenueLightbox";

interface VenueGalleryProps {
  primaryImage: VenueImage;
  gallery: VenueImage[];
  venueName: string;
}

export function VenueGallery({ primaryImage, gallery, venueName }: VenueGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Combine primary image and gallery photos without duplicates
  const allImages = [primaryImage, ...(gallery || [])].filter(
    (img, idx, arr) => arr.findIndex((item) => item.url === img.url) === idx
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section className="w-full space-y-4">
        {/* Main Stage & Supporting Photos Collage */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 rounded-3xl overflow-hidden bg-white/90 p-2 sm:p-3 border border-[#E3DACF] shadow-[0_8px_30px_rgba(33,26,25,0.06)]">
          {/* Main Hero Shot (Spans 3 cols on desktop) */}
          <div
            onClick={() => openLightbox(0)}
            className="group relative md:col-span-3 aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#FAF7F2] cursor-pointer"
          >
            <Image
              src={allImages[0].url}
              alt={allImages[0].alt || `${venueName} main view`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 75vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-104"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

            {/* Hover overlay hint */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-10">
              <span className="text-xs uppercase tracking-widest text-white font-medium bg-black/60 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                Featured View
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white bg-black/60 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md opacity-90 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-[#D6B56D]" />
                <span>Click to Expand</span>
              </span>
            </div>
          </div>

          {/* Supporting Thumbnails Column (Spans 1 col on desktop) */}
          <div className="hidden md:flex flex-col gap-3 md:col-span-1 justify-between">
            {allImages.slice(1, 4).map((img, idx) => {
              const actualIndex = idx + 1;
              const isLast = idx === 2 && allImages.length > 4;

              return (
                <div
                  key={`${img.url || "gallery-thumb"}-${idx}`}
                  onClick={() => openLightbox(actualIndex)}
                  className="group relative flex-1 aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] cursor-pointer border border-[#EBE3D8]"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${venueName} photo ${actualIndex + 1}`}
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                  {isLast && (
                    <div className="absolute inset-0 bg-[#521D2B]/85 flex flex-col items-center justify-center text-white text-center p-2 backdrop-blur-xs">
                      <Images className="w-5 h-5 text-[#D6B56D] mb-1" />
                      <span className="text-xs font-medium">
                        +{allImages.length - 4} More Photos
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* If fewer than 4 images, show placeholder invitation to view full gallery */}
            {allImages.length <= 3 && (
              <button
                type="button"
                onClick={() => openLightbox(0)}
                className="flex-1 rounded-2xl border border-dashed border-[#521D2B]/30 bg-[#FAF7F2] flex flex-col items-center justify-center p-4 text-center text-[#521D2B] hover:bg-[#F2ECE3] transition-colors cursor-pointer"
              >
                <Images className="w-6 h-6 mb-2 text-[#521D2B]" />
                <span className="text-xs uppercase tracking-wider font-medium">
                  Open Lightbox ({allImages.length} Photos)
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile View Gallery Button */}
        <div className="md:hidden flex justify-between items-center px-1">
          <span className="text-xs text-[#78716C] font-light">
            {allImages.length} Photographs Available
          </span>
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#521D2B] text-white text-xs font-medium shadow-xs"
          >
            <Images className="w-3.5 h-3.5 text-[#D6B56D]" />
            <span>View All Photos</span>
          </button>
        </div>
      </section>

      {/* Lightbox Modal */}
      <VenueLightbox
        images={allImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
        venueName={venueName}
      />
    </>
  );
}
