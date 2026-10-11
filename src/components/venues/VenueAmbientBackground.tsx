"use client";

import React from "react";

export function VenueAmbientBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Warm Ivory Base Editorial Surface */}
      <div className="absolute inset-0 bg-[#F7F3ED]" />

      {/* Atmospheric Soft Warm Glows - Champagne & Muted Rose */}
      <div 
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] rounded-full opacity-40 blur-[150px] bg-gradient-to-br from-[#EFE5D5] via-[#EADBCE] to-transparent will-change-transform"
      />
      
      <div 
        className="absolute top-[30%] -right-[15%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full opacity-35 blur-[160px] bg-gradient-to-bl from-[#E6D4C8] via-[#EFE7DC] to-transparent will-change-transform"
      />

      <div 
        className="absolute bottom-[5%] left-[10%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full opacity-30 blur-[140px] bg-gradient-to-tr from-[#EADCCD] via-[#F4EDE3] to-transparent will-change-transform"
      />

      {/* Subtle Paper Grain Texture */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
