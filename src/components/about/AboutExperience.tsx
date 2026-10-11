"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, Palette, Camera, UtensilsCrossed, Music2, Sparkles } from "lucide-react";

export function AboutExperience() {
  const experiences = [
    {
      icon: Building2,
      title: "Royal Venue Discovery",
      description: "Private guided walkthroughs of Lucknow's finest palace lawns, heritage banquet halls, and boutique resorts.",
      linkText: "Explore 32+ Venues",
      href: "/venues",
    },
    {
      icon: Palette,
      title: "Bespoke Décor & Mandaps",
      description: "Spatial architecture, fresh botanical styling, and atmospheric lighting reflecting your bespoke aesthetic.",
      linkText: "View Décor Services",
      href: "/services/planning-and-decor",
    },
    {
      icon: Camera,
      title: "Fine-Art Photography & Film",
      description: "Award-winning editorial portraiture and cinematic storytelling capturing every fleeting intimate glance.",
      linkText: "View Cinema Services",
      href: "/services/photography-and-films",
    },
    {
      icon: UtensilsCrossed,
      title: "Royal Awadhi & Global Banquets",
      description: "Authentic Nawabi dastarkhwans, live chaat streets, and curated global gastronomy for exquisite dining.",
      linkText: "View Catering Services",
      href: "/services/catering-and-banquets",
    },
    {
      icon: Music2,
      title: "Soulful Sufi & Live Artists",
      description: "Spellbinding classical shehnai, Sufi qawwals, and high-energy celebrity performers for your sangeet.",
      linkText: "View Music Curations",
      href: "/services/music-and-entertainment",
    },
    {
      icon: Sparkles,
      title: "End-to-End Coordination",
      description: "Minute-by-minute timeline orchestration, guest hospitality, and vendor alignment so families relax.",
      linkText: "Consult Our Team",
      href: "/contact",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-[#FAF7F2] border-t border-[#E5DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E5DDD2] pb-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#521D2B] font-medium block">
              COLLABORATIVE HORIZONS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#211A19]">
              The Experience We Help Create
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-[#521D2B] font-medium hover:underline"
            >
              <span>Explore All Disciplines</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 6 Responsive Curated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => {
            const Icon = exp.icon;
            return (
              <div
                key={exp.title}
                className="group p-6 sm:p-7 rounded-2xl bg-white border border-[#E8DFD3] hover:border-[#521D2B]/40 transition-all duration-300 shadow-[0_2px_12px_rgba(33,26,25,0.02)] flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] text-[#521D2B] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif text-[#211A19] group-hover:text-[#521D2B] transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57534E] font-light leading-relaxed">
                    {exp.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F2ECE4]">
                  <Link
                    href={exp.href}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#521D2B] font-medium group-hover:translate-x-1 transition-transform"
                  >
                    <span>{exp.linkText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
