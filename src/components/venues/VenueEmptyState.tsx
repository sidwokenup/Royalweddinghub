"use client";

import React from "react";
import { SearchX, RotateCcw, MessageCircle } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface VenueEmptyStateProps {
  onReset: () => void;
  searchQuery?: string;
}

export function VenueEmptyState({ onReset, searchQuery }: VenueEmptyStateProps) {
  const whatsappUrl = generateWhatsAppLink({
    service: "Custom Venue Scouting",
    customMessage: `Hello Royal Wedding Hub! I searched for "${searchQuery || "venues"}" on your discovery page and would like personalized recommendations for my wedding in Lucknow.`,
  });

  return (
    <div className="w-full py-16 sm:py-24 px-6 rounded-3xl bg-white border border-[#E3DACF] shadow-[0_8px_30px_rgba(33,26,25,0.05)] text-center flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#521D2B]/10 border border-[#521D2B]/20 flex items-center justify-center text-[#521D2B]">
        <SearchX className="w-7 h-7" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-2xl sm:text-3xl display-text font-serif text-[#211A19]">No Matching Venues Found</h3>
        <p className="text-sm text-[#78716C] font-light leading-relaxed">
          {searchQuery ? (
            <>
              No venues matched your search for <span className="text-[#521D2B] font-medium">&ldquo;{searchQuery}&rdquo;</span>. Try adjusting your guest capacity or category filters.
            </>
          ) : (
            "We could not find venues matching your selected filters. Try broadening your criteria or speaking with our wedding concierge."
          )}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#521D2B] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#3D1520] transition-colors cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#128C7E] text-xs uppercase tracking-wider font-medium transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span>Ask Our Concierge</span>
        </a>
      </div>
    </div>
  );
}
