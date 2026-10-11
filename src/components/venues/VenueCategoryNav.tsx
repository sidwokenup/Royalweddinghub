"use client";

import React from "react";

interface CategoryItem {
  name: string;
  count: number;
}

interface VenueCategoryNavProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  totalCount: number;
}

export function VenueCategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
  totalCount,
}: VenueCategoryNavProps) {
  const allTabs = [
    { name: "All Venues", slug: "all", count: totalCount },
    ...categories.map((c) => ({ name: c.name, slug: c.name.toLowerCase(), count: c.count })),
  ];

  return (
    <nav 
      aria-label="Venue Categories"
      className="w-full flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-2 px-1"
    >
      <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-[#EFE9DF] border border-[#DDD4C7] shadow-[0_2px_12px_rgba(33,26,25,0.04)]">
        {allTabs.map((tab) => {
          const isSelected =
            selectedCategory === tab.slug ||
            (selectedCategory === "all" && tab.slug === "all");

          return (
            <button
              key={tab.slug}
              type="button"
              onClick={() => onSelectCategory(tab.slug)}
              className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#521D2B] ${
                isSelected
                  ? "bg-[#521D2B] text-[#FAF7F2] font-medium shadow-[0_4px_16px_rgba(82,29,43,0.22)]"
                  : "text-[#211A19]/70 hover:text-[#211A19] hover:bg-[#E4DCD0]/70 font-light"
              }`}
              aria-current={isSelected ? "page" : undefined}
            >
              <span>{tab.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-sans transition-colors ${
                  isSelected
                    ? "bg-white/20 text-[#FAF7F2] font-semibold"
                    : "bg-[#211A19]/5 text-[#211A19]/60"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
