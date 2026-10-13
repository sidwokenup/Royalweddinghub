"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { ServiceItem } from "@/types/service";

interface ServicesMobileListProps {
  services: ServiceItem[];
}

export function ServicesMobileList({ services }: ServicesMobileListProps) {
  return (
    <div className="lg:hidden space-y-4 px-4 sm:px-6">
      {/* Section Subhead for Mobile */}
      <div className="flex items-center justify-between pb-2 pt-2 border-b border-[#E5DDD2]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#521D2B]" />
          <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#521D2B]">
            All Disciplines ({services.length})
          </span>
        </div>
        <span className="text-[11px] text-[#78716C] tracking-wide">
          Tap to explore deliverables
        </span>
      </div>

      {/* Stacked Image-Led Editorial Panels */}
      <div className="space-y-3.5">
        {services.map((service, index) => {
          const targetUrl = service.externalLink || `/services/${service.slug}`;
          const isVenue = Boolean(service.externalLink);

          return (
            <Link
              key={service.id}
              href={targetUrl}
              className="group block relative overflow-hidden rounded-xl border border-[#E8DFD3] shadow-[0_3px_16px_rgba(33,26,25,0.04)] active:scale-[0.985] transition-all duration-300"
              style={{ backgroundColor: service.bgSurface }}
            >
              <div className="flex items-stretch min-h-[148px] sm:min-h-[168px]">
                {/* Left Area: Editorial Typography (58% width) */}
                <div className="w-[58%] sm:w-[60%] p-4 sm:p-5 flex flex-col justify-between z-10">
                  <div className="space-y-1.5">
                    {/* Category pill */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-[#521D2B]/90">
                        {service.categoryTag}
                      </span>
                      {service.featured && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-[#521D2B]/10 text-[#521D2B] font-semibold">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    {/* Service Name */}
                    <h2 className="text-lg sm:text-xl font-serif font-medium text-[#211A19] leading-snug group-hover:text-[#521D2B] transition-colors">
                      {service.name}
                    </h2>

                    {/* Short Description */}
                    <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Interactivity Cue */}
                  <div className="pt-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-[#521D2B] group-hover:translate-x-1 transition-transform duration-200">
                    <span className="uppercase">{isVenue ? "Discover Venues" : "View Details"}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#521D2B]" />
                  </div>
                </div>

                {/* Right Area: Wedding Photograph (42% width) with elegant diagonal / soft mask */}
                <div className="w-[42%] sm:w-[40%] relative min-h-[148px] sm:min-h-[168px] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={`${service.name} - Royal Wedding Hub`}
                    fill
                    sizes="(max-width: 640px) 42vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority={index < 2}
                  />

                  {/* Subtle diagonal transition overlay & warm edge fade */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, ${service.bgSurface} 0%, transparent 22%)`,
                    }}
                  />
                  {/* Subtle dark bottom vignette for depth */}
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
