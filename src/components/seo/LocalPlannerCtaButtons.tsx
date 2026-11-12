'use client';

import Link from 'next/link';
import { CalendarCheck2, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { BUSINESS_INFO, getTelUrl } from '@/lib/contact';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { trackPhoneClick, trackWhatsAppClick, trackEvent } from '@/lib/analytics';

interface LocalPlannerCtaButtonsProps {
  source?: string;
  variant?: 'hero' | 'footer-cta';
}

/**
 * Conversion-tracked CTA button group for /wedding-planner-in-lucknow
 */
export function LocalPlannerCtaButtons({
  source = 'wedding_planner_in_lucknow',
  variant = 'hero',
}: LocalPlannerCtaButtonsProps) {
  const whatsappUrl = generateWhatsAppLink({
    service: 'Wedding Planner in Lucknow',
    customMessage:
      'Hello Royal Wedding Hub! I would like to check auspicious date availability and book a free wedding planning consultation in Lucknow.',
  });

  const isDarkSurface = variant === 'footer-cta';

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
      <Link
        href="/contact"
        onClick={() =>
          trackEvent('cta_check_availability', {
            event_category: 'Conversion',
            event_label: source,
          })
        }
        className={`group inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-[2px] text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 shadow-md ${
          isDarkSurface
            ? 'bg-[#FAF7F2] text-[#521D2B] hover:bg-white'
            : 'bg-[#521D2B] text-[#FAF7F2] hover:bg-[#3D1520] border border-[#521D2B]'
        }`}
      >
        <CalendarCheck2 size={15} className="text-[#D6B56D] shrink-0" />
        <span>Check Availability &amp; Get Free Wedding Consultation</span>
        <ArrowRight
          size={14}
          className="group-hover:translate-x-1 transition-transform shrink-0"
        />
      </Link>

      <a
        href={getTelUrl()}
        onClick={() => trackPhoneClick(source)}
        className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-[2px] text-xs uppercase tracking-[0.18em] font-semibold transition-all duration-300 shadow-sm ${
          isDarkSurface
            ? 'bg-white/10 text-[#FAF7F2] border border-white/25 hover:bg-white/20'
            : 'bg-white text-[#211A19] border border-[#D8CBBE] hover:border-[#521D2B]'
        }`}
        aria-label={`Call Wedding Concierge at ${BUSINESS_INFO.displayPhone}`}
      >
        <Phone size={14} className={isDarkSurface ? 'text-[#D6B56D]' : 'text-[#521D2B]'} />
        <span>Call Wedding Concierge</span>
      </a>

      <a
        href={whatsappUrl}
        onClick={() => trackWhatsAppClick(source)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-[2px] text-xs uppercase tracking-[0.18em] font-semibold bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-all duration-300 shadow-sm"
        aria-label="Chat on WhatsApp with Royal Wedding Hub"
      >
        <MessageCircle size={15} className="shrink-0" />
        <span>WhatsApp Desk</span>
      </a>
    </div>
  );
}

