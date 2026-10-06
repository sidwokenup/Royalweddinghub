import Link from "next/link";
import { ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";
import { BUSINESS_INFO, getTelUrl, getMailtoUrl } from "@/lib/contact";

export function ContactFooter() {
  return (
    <footer className="w-full py-12 sm:py-16 px-4 sm:px-6 md:px-8 border-t border-[#f3e5d8]/15 bg-[#0a0705] text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 sm:gap-12">
        {/* Brand & Editorial Address */}
        <div className="space-y-2">
          <Link href="/" className="inline-block">
            <span className="text-base sm:text-lg font-normal tracking-[0.24em] uppercase display-text text-white">
              {BUSINESS_INFO.name}
            </span>
          </Link>
          <p className="text-xs font-light text-white/60">
            {BUSINESS_INFO.address.full}
          </p>
          <div className="flex items-center gap-4 text-[11px] text-[#f3e5d8]/70 pt-1">
            <span>24/7 Concierge Desk</span>
            <span>•</span>
            <span>Lucknow, Uttar Pradesh</span>
          </div>
        </div>

        {/* Immediate Contact Channels */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-8 text-xs font-light tracking-[0.15em] uppercase text-white/80">
          <a
            href={getTelUrl()}
            className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors"
          >
            <Phone size={13} className="text-[#d4af37]" />
            <span>{BUSINESS_INFO.displayPhone}</span>
          </a>

          <a
            href={getMailtoUrl()}
            className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors"
          >
            <Mail size={13} className="text-[#d4af37]" />
            <span>{BUSINESS_INFO.email}</span>
          </a>

          <a
            href={BUSINESS_INFO.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors"
          >
            <span>Instagram</span>
            <ArrowUpRight size={13} className="text-[#d4af37]" />
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-light text-white/40">
        <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</p>
        <Link href="/" className="hover:text-white transition-colors">
          Home Experience →
        </Link>
      </div>
    </footer>
  );
}
