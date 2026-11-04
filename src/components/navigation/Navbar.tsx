"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageCircle, ChevronDown, ArrowRight, Sparkles, Building2, Palette, Utensils, Camera, Music } from "lucide-react";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

function InstagramIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Scroll listener to highlight active section and switch header contrast on Home page
  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolledPastHero(scrollY > 450);

      const sectionIds = ["contact", "about", "venues", "services", "hero"];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250) {
            setActiveSection(id === "hero" ? "home" : id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isHome = pathname === "/";
  const isVenuesActive = pathname === "/venues" || pathname?.startsWith("/venues/") || (isHome && activeSection === "venues");
  const isServicesActive = pathname === "/services" || pathname?.startsWith("/services/") || (isHome && activeSection === "services");
  const isAboutActive = pathname === "/about" || (isHome && activeSection === "about");
  const isContactActive = pathname === "/contact" || (isHome && activeSection === "contact");
  const isHomeActive = isHome && activeSection === "home";

  const isLightNav =
    pathname.startsWith("/venues") ||
    pathname.startsWith("/services") ||
    pathname === "/about" ||
    pathname === "/contact" ||
    (isHome && isScrolledPastHero);

  const handleNavClick = (sectionId: string, pageHref: string, e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      setMobileMenuOpen(false);
      if (sectionId === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.getElementById(sectionId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
    }
  };

  const whatsappUrl = generateWhatsAppLink({
    service: "General Enquiry",
    customMessage:
      "Hello Royal Wedding Hub! I would like to enquire about your luxury wedding planning and venues in Lucknow.",
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 sm:py-5 transition-colors duration-300 ${
        mobileMenuOpen
          ? isLightNav
            ? "bg-[#FAF7F2] border-b border-[#E2D8CE] shadow-xl text-[#211A19]"
            : "bg-[#0d0907]/98 border-b border-[#d4af37]/20 shadow-2xl text-white"
          : isLightNav
          ? "bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD3] text-[#211A19] shadow-sm"
          : "bg-black/60 backdrop-blur-md border-b border-white/15 text-white shadow-sm"
      }`}
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <Link
          href="/"
          className={`flex items-center gap-2.5 sm:gap-3 text-lg sm:text-xl font-bold tracking-widest uppercase display-text hover:opacity-90 transition-opacity ${
            isLightNav ? "text-[#211A19]" : "text-white"
          }`}
        >
          <Image
            src="/logo.webp"
            alt="Royal Wedding Hub Logo"
            width={36}
            height={36}
            className="h-8 sm:h-9 w-auto object-contain drop-shadow-sm shrink-0"
            priority
          />
          <span className="hidden md:inline">Royal Wedding Hub</span>
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
          {/* Services Hover Menu */}
          <div className="relative group py-2">
            <Link
              href="/services"
              onClick={(e) => handleNavClick("services", "/services", e)}
              className={`transition-all relative py-1 flex items-center gap-1 cursor-pointer ${
                isServicesActive
                  ? isLightNav
                    ? "text-[#521D2B] font-semibold"
                    : "text-[#d4af37] font-semibold"
                  : isLightNav
                  ? "hover:text-[#521D2B] text-[#211A19]"
                  : "hover:opacity-70 text-white"
              }`}
            >
              <span>Services</span>
              <ChevronDown size={13} className="group-hover:rotate-180 transition-transform duration-200" />
              {isServicesActive && (
                <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${
                  isLightNav ? "bg-[#521D2B]" : "bg-[#d4af37]"
                }`} />
              )}
            </Link>

            {/* Services Dropdown Panel */}
            <div className="absolute top-full -left-16 w-[340px] pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
              <div className="bg-white rounded-2xl border border-[#E8DFD3] shadow-[0_24px_50px_rgba(0,0,0,0.25)] p-3 text-left divide-y divide-[#F0EAE1] ring-1 ring-black/5">
                <div className="space-y-1 pb-2">
                  <Link
                    href="/services/planning-and-decor"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors group/item"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#521D2B]/10 text-[#521D2B] flex items-center justify-center shrink-0">
                      <Palette size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1F1614] group-hover/item:text-[#521D2B] transition-colors">
                        Planning &amp; Thematic Decor
                      </p>
                      <p className="text-[11px] text-[#57534E] leading-tight">Mandap architecture, floral sets &amp; styling</p>
                    </div>
                  </Link>

                  <Link
                    href="/services/catering-and-banquets"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors group/item"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#521D2B]/10 text-[#521D2B] flex items-center justify-center shrink-0">
                      <Utensils size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1F1614] group-hover/item:text-[#521D2B] transition-colors">
                        Royal Awadhi Banquets
                      </p>
                      <p className="text-[11px] text-[#57534E] leading-tight">Master Khansamas &amp; heritage Lucknow menus</p>
                    </div>
                  </Link>

                  <Link
                    href="/services/photography-and-films"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors group/item"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#521D2B]/10 text-[#521D2B] flex items-center justify-center shrink-0">
                      <Camera size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1F1614] group-hover/item:text-[#521D2B] transition-colors">
                        Photography &amp; 4K Cinema
                      </p>
                      <p className="text-[11px] text-[#57534E] leading-tight">Fine-art portraits, drone &amp; wedding films</p>
                    </div>
                  </Link>

                  <Link
                    href="/services/music-and-entertainment"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors group/item"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#521D2B]/10 text-[#521D2B] flex items-center justify-center shrink-0">
                      <Music size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1F1614] group-hover/item:text-[#521D2B] transition-colors">
                        DJs, Sufi &amp; Live Music
                      </p>
                      <p className="text-[11px] text-[#57534E] leading-tight">Celebrity DJs, Shehnai &amp; Sangeet choreography</p>
                    </div>
                  </Link>
                </div>

                <div className="pt-2">
                  <Link
                    href="/services"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#521D2B] bg-[#FAF7F2] hover:bg-[#521D2B] hover:text-white transition-colors"
                  >
                    <span>View All Services</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Venues Hover Menu */}
          <div className="relative group py-2">
            <Link
              href="/venues"
              onClick={(e) => handleNavClick("venues", "/venues", e)}
              className={`transition-all relative py-1 flex items-center gap-1 cursor-pointer ${
                isVenuesActive
                  ? isLightNav
                    ? "text-[#521D2B] font-semibold"
                    : "text-[#d4af37] font-semibold"
                  : isLightNav
                  ? "hover:text-[#521D2B] text-[#211A19]"
                  : "hover:opacity-70 text-white"
              }`}
            >
              <span>Venues</span>
              <ChevronDown size={13} className="group-hover:rotate-180 transition-transform duration-200" />
              {isVenuesActive && (
                <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${
                  isLightNav ? "bg-[#521D2B]" : "bg-[#d4af37]"
                }`} />
              )}
            </Link>

            {/* Venues Dropdown Panel */}
            <div className="absolute top-full -left-16 w-[340px] pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
              <div className="bg-white rounded-2xl border border-[#E8DFD3] shadow-[0_24px_50px_rgba(0,0,0,0.25)] p-3 text-left divide-y divide-[#F0EAE1] ring-1 ring-black/5">
                <div className="space-y-1 pb-2">
                  <Link
                    href="/wedding-venues-lucknow"
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DE] transition-colors group/item"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#521D2B] text-white flex items-center justify-center shrink-0">
                      <Sparkles size={15} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#521D2B] flex items-center gap-1">
                        500 Guests Under ₹15 Lakh
                      </p>
                      <p className="text-[11px] text-[#57534E] leading-tight">High-demand popular packages</p>
                    </div>
                  </Link>

                  <Link
                    href="/venues"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors group/item"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#521D2B]/10 text-[#521D2B] flex items-center justify-center shrink-0">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1F1614] group-hover/item:text-[#521D2B] transition-colors">
                        Palace Lawns &amp; Open Estates
                      </p>
                      <p className="text-[11px] text-[#57534E] leading-tight">Sprawling lawns for 500 to 2,500 guests</p>
                    </div>
                  </Link>

                  <Link
                    href="/venues"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors group/item"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#521D2B]/10 text-[#521D2B] flex items-center justify-center shrink-0">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1F1614] group-hover/item:text-[#521D2B] transition-colors">
                        Heritage Resorts &amp; Banquets
                      </p>
                      <p className="text-[11px] text-[#57534E] leading-tight">Poolside resorts, rooms &amp; AC halls</p>
                    </div>
                  </Link>
                </div>

                <div className="pt-2">
                  <Link
                    href="/venues"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#521D2B] bg-[#FAF7F2] hover:bg-[#521D2B] hover:text-white transition-colors"
                  >
                    <span>Explore All 32 Verified Venues</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Link
            href="/about"
            onClick={(e) => handleNavClick("about", "/about", e)}
            className={`transition-all relative py-1 ${
              isAboutActive
                ? isLightNav
                  ? "text-[#521D2B] font-semibold"
                  : "text-[#d4af37] font-semibold"
                : isLightNav
                ? "hover:text-[#521D2B] text-[#211A19]"
                : "hover:opacity-70 text-white"
            }`}
          >
            <span>About</span>
            {isAboutActive && (
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${
                isLightNav ? "bg-[#521D2B]" : "bg-[#d4af37]"
              }`} />
            )}
          </Link>
          <Link
            href="/contact"
            onClick={(e) => handleNavClick("contact", "/contact", e)}
            className={`transition-all relative py-1 ${
              isContactActive
                ? isLightNav
                  ? "text-[#521D2B] font-semibold"
                  : "text-[#d4af37] font-semibold"
                : isLightNav
                ? "hover:text-[#521D2B] text-[#211A19]"
                : "hover:opacity-70 text-white"
            }`}
          >
            <span>Contact</span>
            {isContactActive && (
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${
                isLightNav ? "bg-[#521D2B]" : "bg-[#d4af37]"
              }`} />
            )}
          </Link>

          <a
            href={BUSINESS_INFO.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all relative py-1 flex items-center gap-1.5 ${
              isLightNav
                ? "hover:text-[#521D2B] text-[#211A19]"
                : "hover:opacity-70 text-white"
            }`}
            aria-label="Instagram Profile"
          >
            <InstagramIcon size={14} className={isLightNav ? "text-[#521D2B]" : "text-[#d4af37]"} />
            <span>Instagram</span>
          </a>

          {/* Lead Trigger Button (Navbar Hook) */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-royal-scroll"));
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#521D2B] hover:bg-[#682436] text-[#FAF7F2] text-xs font-medium tracking-wide transition-all shadow-xs cursor-pointer shrink-0"
            aria-label="Claim ₹50,000 Wedding Privilege"
          >
            <span>Claim ₹50K Privilege</span>
          </button>
        </div>

        {/* Mobile Navigation Controls */}
        <div className="md:hidden flex items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-royal-scroll"));
              }
            }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#521D2B] text-[#FAF7F2] text-[11px] font-medium tracking-wide transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
            aria-label="Claim ₹50K Privilege"
          >
            <span>₹50K Privilege</span>
          </button>

          <Link
            href="/venues"
            className={`hidden sm:inline-flex text-xs uppercase tracking-widest px-2 sm:px-2.5 py-1 rounded-[2px] transition-colors border whitespace-nowrap shrink-0 ${
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
            className={`p-1 sm:p-1.5 hover:opacity-80 transition-opacity shrink-0 ${
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
          {/* Mobile Royal Privilege Hook Banner */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-royal-scroll"));
              }
            }}
            className="w-full py-3 px-4 rounded-2xl bg-[#521D2B] hover:bg-[#682436] text-[#FAF7F2] text-xs font-medium tracking-wide shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
          >
            <span>Claim ₹50,000 Wedding Privilege</span>
            <ArrowRight size={14} />
          </button>

          <div
            className={`flex flex-col space-y-4 text-base uppercase tracking-widest border-b pb-6 ${
              isLightNav ? "text-[#211A19] border-[#E5DDD2]" : "text-white border-white/10"
            }`}
          >
            <Link
              href="/"
              onClick={(e) => handleNavClick("hero", "/", e)}
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
              href="/services"
              onClick={(e) => handleNavClick("services", "/services", e)}
              className={`py-1.5 transition-colors flex items-center justify-between ${
                isServicesActive ? "text-[#521D2B] font-semibold" : "hover:text-[#521D2B]"
              }`}
            >
              <span>Services</span>
              {isServicesActive && <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]" />}
            </Link>
            <Link
              href="/venues"
              onClick={(e) => handleNavClick("venues", "/venues", e)}
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
              href="/about"
              onClick={(e) => handleNavClick("about", "/about", e)}
              className={`py-1.5 transition-colors flex items-center justify-between ${
                isAboutActive ? "text-[#521D2B] font-semibold" : "hover:text-[#521D2B]"
              }`}
            >
              <span>About</span>
              {isAboutActive && <span className="w-1.5 h-1.5 rounded-full bg-[#521D2B]" />}
            </Link>
            <Link
              href="/contact"
              onClick={(e) => handleNavClick("contact", "/contact", e)}
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
            <a
              href={BUSINESS_INFO.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 py-3 rounded-full text-xs uppercase tracking-widest font-medium transition-colors border ${
                isLightNav
                  ? "bg-white border-[#D8CBBE] text-[#211A19] hover:bg-[#FAF7F2]"
                  : "bg-white/5 border-white/20 text-white hover:bg-white/10"
              }`}
            >
              <InstagramIcon size={14} className={isLightNav ? "text-[#521D2B]" : "text-[#d4af37]"} />
              <span>Instagram: {BUSINESS_INFO.instagram.handle}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
