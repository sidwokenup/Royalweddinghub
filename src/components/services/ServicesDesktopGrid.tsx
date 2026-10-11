"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Sparkles, Building2 } from "lucide-react";
import { ServiceItem } from "@/types/service";

interface ServicesDesktopGridProps {
  services: ServiceItem[];
}

export function ServicesDesktopGrid({ services }: ServicesDesktopGridProps) {
  // Separate out the flagship featured service and supporting services
  const flagship = services.find((s) => s.id === "planning-decor") || services[0];
  const venuesService = services.find((s) => s.id === "venues");
  const photographyService = services.find((s) => s.id === "photography");

  const restServices = services.filter(
    (s) => s.id !== flagship.id && s.id !== "venues" && s.id !== "photography"
  );

  return (
    <div className="hidden lg:block space-y-10 max-w-7xl mx-auto px-6 lg:px-8">
      {/* Editorial Section Header */}
      <div className="flex items-end justify-between border-b border-[#E5DDD2] pb-5">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#521D2B] font-medium block">
            CURATED CAPABILITIES
          </span>
          <h2 className="text-3xl font-serif text-[#211A19]">
            Disciplines of Celebration
          </h2>
        </div>
        <p className="text-xs uppercase tracking-[0.18em] text-[#78716C]">
          8 Specialized Departments • One Unified Vision
        </p>
      </div>

      {/* Row 1: Asymmetric Flagship Showcase (7 cols / 5 cols) */}
      <div className="grid grid-cols-12 gap-8 items-stretch">
        {/* Left Column (7 cols): Flagship Planning & Décor */}
        <div className="col-span-7">
          <Link
            href={`/services/${flagship.slug}`}
            className="group flex flex-col justify-between h-full rounded-2xl border border-[#E5DDD2] hover:border-[#521D2B]/50 transition-all duration-500 overflow-hidden shadow-[0_4px_24px_rgba(33,26,25,0.04)] hover:shadow-[0_12px_36px_rgba(82,29,43,0.1)]"
            style={{ backgroundColor: flagship.bgSurface }}
          >
            {/* Top Image Showcase */}
            <div className="relative w-full h-[320px] overflow-hidden">
              <Image
                src={flagship.image}
                alt={flagship.name}
                fill
                sizes="(max-width: 1280px) 58vw, 700px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

              {/* Badges on image */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-[#521D2B] text-white shadow-md">
                  <Sparkles className="w-3 h-3" />
                  <span>Flagship Discipline</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#211A19] font-medium">
                  {flagship.categoryTag}
                </span>
              </div>

              {/* Title overlay at image bottom */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
                <div>
                  <h3 className="text-2xl font-serif text-white drop-shadow-md">
                    {flagship.name}
                  </h3>
                  <p className="text-xs text-white/80 font-light mt-0.5">
                    {flagship.headline}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#521D2B] transition-colors duration-300">
                  <ArrowUpRight className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <p className="text-sm text-[#57534E] font-light leading-relaxed">
                {flagship.introCopy}
              </p>

              {/* Deliverables Checklist Preview */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E5DDD2]">
                {flagship.deliverables.slice(0, 4).map((d) => (
                  <div key={d.title} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#521D2B] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#211A19] font-medium leading-snug">
                      {d.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subcategories tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {flagship.subcategories.map((sub) => (
                  <span
                    key={sub.name}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-white border border-[#E5DDD2] text-[#57534E]"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>

        {/* Right Column (5 cols): Venues & Photography Stack */}
        <div className="col-span-5 flex flex-col gap-6">
          {/* Card: Wedding Venues */}
          {venuesService && (
            <Link
              href={venuesService.externalLink || "/venues"}
              className="group flex-1 flex flex-col justify-between rounded-2xl border border-[#E5DDD2] hover:border-[#521D2B]/50 transition-all duration-500 overflow-hidden shadow-[0_4px_24px_rgba(33,26,25,0.04)] hover:shadow-[0_12px_36px_rgba(82,29,43,0.1)]"
              style={{ backgroundColor: venuesService.bgSurface }}
            >
              <div className="flex h-full">
                <div className="w-[55%] p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#521D2B] font-medium">
                      <Building2 className="w-3 h-3" />
                      <span>{venuesService.categoryTag}</span>
                    </div>
                    <h3 className="text-xl font-serif text-[#211A19] group-hover:text-[#521D2B] transition-colors">
                      {venuesService.name}
                    </h3>
                    <p className="text-xs text-[#57534E] leading-relaxed line-clamp-3">
                      {venuesService.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center gap-2 text-xs font-medium text-[#521D2B]">
                    <span>DISCOVER 32+ VENUES</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <div className="w-[45%] relative overflow-hidden">
                  <Image
                    src={venuesService.image}
                    alt={venuesService.name}
                    fill
                    sizes="(max-width: 1280px) 25vw, 320px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
                </div>
              </div>
            </Link>
          )}

          {/* Card: Photography & Films */}
          {photographyService && (
            <Link
              href={`/services/${photographyService.slug}`}
              className="group flex-1 flex flex-col justify-between rounded-2xl border border-[#E5DDD2] hover:border-[#521D2B]/50 transition-all duration-500 overflow-hidden shadow-[0_4px_24px_rgba(33,26,25,0.04)] hover:shadow-[0_12px_36px_rgba(82,29,43,0.1)]"
              style={{ backgroundColor: photographyService.bgSurface }}
            >
              <div className="flex h-full">
                <div className="w-[55%] p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#521D2B] font-medium block">
                      {photographyService.categoryTag}
                    </span>
                    <h3 className="text-xl font-serif text-[#211A19] group-hover:text-[#521D2B] transition-colors">
                      {photographyService.name}
                    </h3>
                    <p className="text-xs text-[#57534E] leading-relaxed line-clamp-3">
                      {photographyService.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center gap-2 text-xs font-medium text-[#521D2B]">
                    <span>EXPLORE CINEMA</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <div className="w-[45%] relative overflow-hidden">
                  <Image
                    src={photographyService.image}
                    alt={photographyService.name}
                    fill
                    sizes="(max-width: 1280px) 25vw, 320px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Row 2: Editorial 3-Column Grid for Remaining Services */}
      <div className="grid grid-cols-3 gap-8">
        {restServices.slice(0, 3).map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-[#E5DDD2] hover:border-[#521D2B]/50 transition-all duration-500 overflow-hidden shadow-[0_4px_24px_rgba(33,26,25,0.04)] hover:shadow-[0_12px_36px_rgba(82,29,43,0.1)]"
            style={{ backgroundColor: service.bgSurface }}
          >
            <div className="relative w-full h-56 overflow-hidden">
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(max-width: 1280px) 33vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

              <div className="absolute top-4 left-4">
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#211A19] font-medium">
                  {service.categoryTag}
                </span>
              </div>

              <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center group-hover:bg-[#521D2B] transition-colors">
                <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xl font-serif text-[#211A19] group-hover:text-[#521D2B] transition-colors mb-1.5">
                  {service.name}
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed line-clamp-2">
                  {service.shortDescription}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5DDD2] flex flex-wrap gap-1.5">
                {service.subcategories.slice(0, 2).map((sub) => (
                  <span
                    key={sub.name}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#E5DDD2] text-[#78716C]"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Row 3: Balanced 2-Column Split for Final 2 Services */}
      <div className="grid grid-cols-2 gap-8">
        {restServices.slice(3, 5).map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.slug}`}
            className="group flex rounded-2xl border border-[#E5DDD2] hover:border-[#521D2B]/50 transition-all duration-500 overflow-hidden shadow-[0_4px_24px_rgba(33,26,25,0.04)] hover:shadow-[0_12px_36px_rgba(82,29,43,0.1)]"
            style={{ backgroundColor: service.bgSurface }}
          >
            <div className="w-[55%] p-6 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#521D2B] font-medium block">
                  {service.categoryTag}
                </span>
                <h3 className="text-xl font-serif text-[#211A19] group-hover:text-[#521D2B] transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {service.shortDescription}
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {service.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub.name}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#E5DDD2] text-[#78716C]"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center gap-2 text-xs font-medium text-[#521D2B]">
                <span className="uppercase">Explore Details</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            <div className="w-[45%] relative min-h-[220px] overflow-hidden">
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(max-width: 1280px) 25vw, 320px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
