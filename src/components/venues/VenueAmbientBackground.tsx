"use client";

import React from "react";

export function VenueAmbientBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 select-none bg-[#F7F3ED]"
      style={{
        backgroundImage: `
          radial-gradient(circle at 10% 0%, rgba(239, 229, 213, 0.5) 0%, transparent 55%),
          radial-gradient(circle at 90% 35%, rgba(230, 212, 200, 0.45) 0%, transparent 50%),
          radial-gradient(circle at 20% 90%, rgba(234, 220, 205, 0.4) 0%, transparent 50%)
        `,
      }}
      aria-hidden="true"
    />
  );
}
