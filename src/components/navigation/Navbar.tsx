"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 text-foreground mix-blend-difference">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-widest uppercase display-text text-white">
          Royal Knots
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest text-white">
          <Link href="#services" className="hover:opacity-70 transition-opacity">Services</Link>
          <Link href="/venues" className="hover:opacity-70 transition-opacity">Venues</Link>
          <Link href="/about" className="hover:opacity-70 transition-opacity">About</Link>
          <Link href="/contact" className="hover:opacity-70 transition-opacity">Contact</Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <Link href="/contact" className="md:hidden text-xs uppercase tracking-widest text-white border border-white/30 px-3 py-1.5 rounded-[2px]" aria-label="Contact Concierge">
          Concierge
        </Link>
      </nav>
    </header>
  );
}
