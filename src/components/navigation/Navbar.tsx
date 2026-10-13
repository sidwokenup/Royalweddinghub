"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const isVenuesActive = pathname === "/venues" || pathname?.startsWith("/venues/");
  const isServicesActive = pathname === "/services" || pathname?.startsWith("/services/");
  const isAboutActive = pathname === "/about";
  const isContactActive = pathname === "/contact";
  const isHomeActive = pathname === "/";
  const isLightNav = isVenuesActive || isContactActive || isServicesActive || isAboutActive;

  const whatsappUrl = generateWhatsAppLink({
    service: "General Enquiry",
    customMessage:
      "Hello Royal Wedding Hub! I would like to enquire about your luxury wedding planning and venues in Lucknow.",
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-5 sm:py-6 transition-colors duration-300 ${
        mobileMenuOpen
          ? isLightNav
            ? "bg-[#FAF7F2] border-b border-[#E2D8CE] shadow-xl text-[#211A19]"
            : "bg-[#0d0907]/98 border-b border-[#d4af37]/20 shadow-2xl text-white"
          : isLightNav
          ? "bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD3] text-[#211A19] shadow-sm"
          : "mix-blend-difference text-foreground"
      }`}
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <Link
          href="/"
          className={`text-lg sm:text-xl font-bold tracking-widest uppercase display-text hover:opacity-90 transition-opacity ${
            isLightNav ? "text-[#211A19]" : "text-white"
          }`}
        >
          Royal Wedding Hub
        </Link>

        {/* Desktop Navigation */}
        <div
          className={`hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest ${
            isLightNav ? "text-[#211A19]" : "text-white"
          }`}
        >
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className={`transition-all relative py-1 ${
              isHomeActive
                ? isLightNav
                  ? "text-[#521D2B] font-semibold"
                  : "text-[#d4af37] font-semibold"
                : isLightNav
                ? "hover:text-[#521D2B] text-[#211A19]"
                : "hover:opacity-70 text-white"
            }`}
          >
            <span>Home</span>
            {isHomeActive && (
              <span
                className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${
                  isLightNav ? "bg-[#521D2B]" : "bg-[#d4af37]"
                }`}
              />
            )}
          </Link>
          <Link
            href="/services"
            className={`transition-all relative py-1 ${
              isServicesActive
                ? "text-[#521D2B] font-semibold"
                : isLightNav
                ? "hover:text-[#521D2B] text-[#211A19]"
                : "hover:opacity-70 text-white"
            }`}
          >
            <span>Services</span>
            {isServicesActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#521D2B] rounded-full" />
            )}
          </Link>
          <Link
            href="/venues"
            className={`transition-all relative py-1 ${
              isVenuesActive
                ? "text-[#521D2B] font-semibold"
                : isLightNav
                ? "hover:text-[#521D2B] text-[#211A19]"
                : "hover:opacity-70 text-white"
            }`}
          >
            <span>Venues</span>
            {isVenuesActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#521D2B] rounded-full" />
            )}
          </Link>
          <Link
            href="/about"
            className={`transition-all relative py-1 ${
              isAboutActive
                ? "text-[#521D2B] font-semibold"
                : isLightNav
                ? "hover:text-[#521D2B] text-[#211A19]"
                : "hover:opacity-70 text-white"
            }`}
          >
            <span>About</span>
            {isAboutActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#521D2B] rounded-full" />
            )}
          </Link>
          <Link
            href="/contact"
            className={`transition-all relative py-1 ${
              isContactActive
                ? "text-[#521D2B] font-semibold"
                : isLightNav
                ? "hover:text-[#521D2B] text-[#211A19]"
                : "hover:opacity-70 text-white"
            }`}
          >
            <span>Contact</span>
            {isContactActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#521D2B] rounded-full" />
            )}
          </Link>
        </div>

        {/* Mobile Navigation Controls */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            href="/venues"
            className={`text-xs uppercase tracking-widest px-2.5 py-1 rounded-[2px] transition-colors border ${
              isVenuesActive
                ? "border-[#521D2B] text-[#521D2B] bg-[#521D2B]/10 font-medium"
                : isLightNav
                ? "border-[#D8CBBE] text-[#211A19] hover:bg-[#FAF7F2]"
                : "border-white/30 text-white hover:bg-white/10"
            }`}
          >
            Venues
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1.5 hover:opacity-80 transition-opacity ${
              isLightNav ? "text-[#211A19]" : "text-white"
            }`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-6 pb-6 px-4 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            className={`flex flex-col space-y-4 text-base uppercase tracking-widest border-b pb-6 ${
              isLightNav ? "text-[#211A19] border-[#E5DDD2]" : "text-white border-white/10"
            }`}
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 transition-colors flex items-center justify-between ${
                isHomeActive
                  ? isLightNav
                    ? "text-[#521D2B] font-semibold"
                    : "text-[#d4af37] font-semibold"
                  : "hover:opacity-75"
              }`}
            >
              <span>Home</span>
              {isHomeActive && (
                <span className={`w-1.5 h-1.5 rounded-full ${isLightNav ? "bg-[#521D2B]" : "bg-[#d4af37]"}`} />
              )}
            </Link>
            <Link
              href="/venues"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 transition-colors flex items-center justify-between ${
                isVenuesActive ? "text-[#521D2B] font-semibold" : "hover:text-[#521D2B]"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>Venues</span>
                <span className={`text-[10px] tracking-wider px-2 py-0.5 rounded-full font-normal lowercase ${
                  isLightNav ? "bg-[#521D2B]/10 text-[#521D2B]" : "bg-[#d4af37]/20 text-[#d4af37]"
                }`}>
                  32 places
                </span>
              </span>
              {isVenuesActive && <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]" />}
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 transition-colors flex items-center justify-between ${
                isServicesActive ? "text-[#521D2B] font-semibold" : "hover:text-[#521D2B]"
              }`}
            >
              <span>Services</span>
              {isServicesActive && <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]" />}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 transition-colors flex items-center justify-between ${
                isAboutActive ? "text-[#521D2B] font-semibold" : "hover:text-[#521D2B]"
              }`}
            >
              <span>About</span>
              {isAboutActive && <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]" />}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 transition-colors flex items-center justify-between ${
                isContactActive
                  ? "text-[#521D2B] font-semibold"
                  : "hover:opacity-75"
              }`}
            >
              <span>Contact Concierge</span>
              {isContactActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]" />
              )}
            </Link>
          </div>

          {/* Quick Concierge Direct Contacts in Mobile Menu */}
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-full bg-[#25D366] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#1EBE5D] transition-colors shadow-sm"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Planner</span>
            </a>
            <a
              href={getTelUrl()}
              className={`flex items-center justify-center gap-2 py-3 rounded-full text-xs uppercase tracking-widest font-medium transition-colors border ${
                isLightNav
                  ? "bg-white border-[#D8CBBE] text-[#211A19] hover:bg-[#FAF7F2]"
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              }`}
            >
              <Phone size={14} className={isLightNav ? "text-[#521D2B]" : "text-[#d4af37]"} />
              <span>Call: {BUSINESS_INFO.displayPhone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
