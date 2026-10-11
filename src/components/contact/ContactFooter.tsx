import Link from "next/link";
import { ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";
import { BUSINESS_INFO, getTelUrl, getMailtoUrl } from "@/lib/contact";

export function ContactFooter() {
  return (
    <footer className="w-full py-12 sm:py-16 px-4 sm:px-6 md:px-8 border-t border-[#DDD3C5] bg-[#EFE8DE] text-[#211A19]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 sm:gap-12">
        {/* Brand & Editorial Address */}
        <div className="space-y-2.5">
          <Link href="/" className="inline-block group">
            <span className="text-base sm:text-lg font-serif font-normal tracking-[0.22em] uppercase text-[#211A19] group-hover:text-[#521D2B] transition-colors">
              {BUSINESS_INFO.name}
            </span>
          </Link>
          <p className="text-xs font-light text-[#6B635B] max-w-sm leading-relaxed">
            {BUSINESS_INFO.address.full}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-[#78716C] pt-0.5">
            <span className="flex items-center gap-1.5">
              <MapPin size={11} className="text-[#521D2B]" />
              Lucknow, Uttar Pradesh
            </span>
            <span>•</span>
            <span>24/7 Concierge Desk</span>
          </div>
        </div>

        {/* Immediate Contact Channels */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-8 text-xs font-medium tracking-[0.16em] uppercase text-[#211A19]">
          <a
            href={getTelUrl()}
            className="flex items-center gap-2 hover:text-[#521D2B] transition-colors"
          >
            <Phone size={13} className="text-[#521D2B]" />
            <span>{BUSINESS_INFO.displayPhone}</span>
          </a>

          <a
            href={getMailtoUrl()}
            className="flex items-center gap-2 hover:text-[#521D2B] transition-colors"
          >
            <Mail size={13} className="text-[#521D2B]" />
            <span>{BUSINESS_INFO.email}</span>
          </a>

          <a
            href={BUSINESS_INFO.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#521D2B] transition-colors"
          >
            <span>Instagram</span>
            <ArrowUpRight size={13} className="text-[#521D2B]" />
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#DDD3C5] flex items-center justify-between text-[11px] font-light text-[#78716C]">
        <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</p>
        <Link href="/" className="hover:text-[#521D2B] transition-colors">
          Home Experience →
        </Link>
      </div>
    </footer>
  );
}
