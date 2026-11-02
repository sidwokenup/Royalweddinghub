'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles, Send, MessageCircle, Crown, MapPin, Calendar } from 'lucide-react';
import { submitLeadAction } from '@/app/actions/lead';
import { trackLeadGeneration } from '@/lib/analytics';
import { generateWhatsAppLink } from '@/lib/whatsapp';

export interface ModalContext {
  venueName?: string;
  weddingDate?: string;
  guestCount?: string;
  budgetBracket?: string;
  location?: string;
  type?: 'quote' | 'walkthrough';
  note?: string;
}

interface AdQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  context?: ModalContext | null;
}

const QUICK_SEASONS = [
  'Nov – Dec 2026',
  'Jan – Feb 2027',
  'Muhurat 2027',
];

export function AdQuotationModal({ isOpen, onClose, context }: AdQuotationModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [weddingDate, setWeddingDate] = useState(context?.weddingDate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadNumber, setSubmittedLeadNumber] = useState<string | null>(null);

  // Sync date when context changes
  useEffect(() => {
    if (context?.weddingDate) {
      setWeddingDate(context.weddingDate);
    }
  }, [context?.weddingDate]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSubmittedLeadNumber(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isWalkthrough = context?.type === 'walkthrough';
  const targetVenue = context?.venueName || 'Any Verified Venue in Lucknow';
  const guestCount = context?.guestCount || '500 Guests';
  const budgetBracket = context?.budgetBracket || '₹10L – ₹15 Lakh';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await submitLeadAction({
        name,
        phone,
        eventType: 'WEDDING',
        services: [
          isWalkthrough ? `Walkthrough: ${targetVenue}` : `Quotation: ${targetVenue}`,
          'Venue Scouting & Planning',
        ],
        weddingDate: weddingDate || 'Upcoming Muhurat Season',
        guestCountBracket: guestCount,
        budgetBracket,
        location: context?.location || 'Lucknow',
        venueName: targetVenue,
        utmSource: 'google_ads',
        utmCampaign: isWalkthrough ? 'venue_walkthrough' : 'venue_quotation',
      });

      // Google Ads conversion tracking
      trackLeadGeneration({
        leadNumber: res.leadNumber,
        eventType: 'WEDDING',
      });

      setSubmittedLeadNumber(res.leadNumber);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappRedirectUrl = generateWhatsAppLink({
    service: isWalkthrough ? 'Venue Walkthrough' : 'Royal Quotation Request',
    customMessage: `Hello Royal Wedding Hub! I requested a ${
      isWalkthrough ? 'guided walkthrough' : 'royal quotation'
    } on your website. My Lead ID is ${submittedLeadNumber || 'NEW'}. Name: ${name}, Venue: ${targetVenue}, Guests: ${guestCount}, Budget: ${budgetBracket}, Date: ${weddingDate || 'Upcoming'}. Please share complete packages!`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shahi-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Royal Scroll (Shahi Farman) Outer Shell */}
      <div className="relative w-full max-w-md my-auto select-none transition-all">
        {/* Top Antique Brass Scroll Roller & Finials */}
        <div className="relative z-10 flex items-center justify-between px-2 -mb-1">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#E5C779] via-[#947128] to-[#684C12] border border-[#FAF7F2] shadow-sm -mr-1" />
          <div className="flex-1 h-3 rounded-full bg-gradient-to-r from-[#805F1E] via-[#F3DE9A] to-[#805F1E] border border-[#E8DFD3]/40 shadow-xs flex items-center justify-center">
            <div className="w-16 h-0.5 bg-[#521D2B]/30 rounded-full" />
          </div>
          <div className="w-4 h-4 rounded-full bg-gradient-to-bl from-[#E5C779] via-[#947128] to-[#684C12] border border-[#FAF7F2] shadow-sm -ml-1" />
        </div>

        {/* Parchment Document Body */}
        <div className="relative bg-[#FAF7F2] border-x-2 border-y border-[#D6B56D]/40 rounded-sm shadow-[0_18px_50px_rgba(33,26,25,0.28)] p-5 sm:p-6 text-[#211A19] overflow-visible">
          {/* Subtle Decorative Golden Inset Frame */}
          <div className="absolute inset-2 border border-[#D6B56D]/25 pointer-events-none rounded-xs" />

          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-1.5 text-[#78716C] hover:text-[#521D2B] rounded-full bg-black/5 hover:bg-black/10 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {!submittedLeadNumber ? (
            <>
              {/* Royal Seal & Farman Header */}
              <div className="text-center pt-1 pb-4 relative z-10">
                {/* Royal Wax Seal (शाही मोहर) */}
                <div className="relative inline-flex flex-col items-center mb-2">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#6A1629] via-[#521D2B] to-[#360F19] text-[#FAF7F2] border-2 border-[#D6B56D] shadow-md flex items-center justify-center relative">
                    <Crown size={18} className="text-[#F3DE9A]" />
                    <span className="absolute -bottom-1 w-2.5 h-2.5 bg-[#D6B56D] rotate-45" />
                  </div>
                  <span className="mt-1 text-[9px] uppercase tracking-[0.28em] font-mono font-bold text-[#805F1E]">
                    शाही फरमान • Royal Quotation
                  </span>
                </div>

                {/* Heading */}
                <h3 id="shahi-modal-title" className="text-xl sm:text-2xl font-serif font-bold text-[#211A19] leading-tight">
                  {isWalkthrough ? 'Book Guided Site Walkthrough' : 'Instant Date & Price Quotation'}
                </h3>

                {/* Target Venue & Context Pill */}
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DE] border border-[#DDD3C5] text-[11px] text-[#44403C]">
                  <MapPin size={11} className="text-[#521D2B] shrink-0" />
                  <span className="font-semibold text-[#211A19] truncate max-w-[190px]">{targetVenue}</span>
                  <span className="text-[#805F1E]">•</span>
                  <span className="font-medium text-[#521D2B]">{budgetBracket}</span>
                </div>
              </div>

              {/* Fast 3-Field High-Conversion Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10 text-xs">
                {/* Field 1: Name */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#521D2B] mb-1 font-bold">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-white border border-[#DDD3C5] focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#211A19] placeholder:text-[#A8A29E] outline-none transition-all shadow-2xs"
                  />
                </div>

                {/* Field 2: WhatsApp Number */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#521D2B] mb-1 font-bold">
                    WhatsApp / Phone Number *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-semibold text-[#805F1E] select-none pointer-events-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      placeholder="9170888981"
                      className="w-full bg-white border border-[#DDD3C5] focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/15 rounded-xl pl-12 pr-3.5 py-2.5 text-base sm:text-sm text-[#211A19] placeholder:text-[#A8A29E] outline-none transition-all shadow-2xs tracking-wider font-medium"
                    />
                  </div>
                </div>

                {/* Field 3: Wedding Date / Season */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#57534E] font-medium flex items-center gap-1">
                      <Calendar size={11} className="text-[#805F1E]" />
                      Tentative Date / Muhurat
                    </label>
                    <span className="text-[10px] text-[#805F1E] font-mono">Optional</span>
                  </div>
                  <input
                    type="text"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    placeholder="e.g. Dec 2026 or Spring 2027"
                    className="w-full bg-white border border-[#DDD3C5] focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/15 rounded-xl px-3.5 py-2 text-base sm:text-sm text-[#211A19] placeholder:text-[#A8A29E] outline-none transition-all shadow-2xs"
                  />

                  {/* One-Tap Quick Season Chips */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {QUICK_SEASONS.map((season) => (
                      <button
                        type="button"
                        key={season}
                        onClick={() => setWeddingDate(season)}
                        className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                          weddingDate === season
                            ? 'bg-[#521D2B] text-white border-[#521D2B] font-semibold'
                            : 'bg-white border-[#DDD3C5] text-[#57534E] hover:border-[#805F1E] hover:text-[#211A19]'
                        }`}
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !phone.trim()}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-[#521D2B] hover:bg-[#6A1629] active:scale-[0.99] text-[#FAF7F2] font-serif font-bold text-sm tracking-wider uppercase py-3.5 px-6 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles size={14} className="text-[#F3DE9A]" />
                  <span>
                    {isSubmitting
                      ? 'Transmitting Shahi Farman...'
                      : isWalkthrough
                      ? 'Confirm Site Walkthrough'
                      : 'Receive Royal Quotation'}
                  </span>
                </button>

                {/* Reassurance Footnote */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#78716C] pt-0.5">
                  <ShieldCheck size={12} className="text-[#805F1E] shrink-0" />
                  <span>Direct Lucknow Concierge • Zero Brokerage • 1-Hour PDF</span>
                </div>
              </form>
            </>
          ) : (
            /* Royal Confirmation State */
            <div className="py-6 text-center space-y-3.5 relative z-10 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-[#166534]/10 border-2 border-[#166534]/30 text-[#166534] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle size={28} />
              </div>

              <div className="space-y-1">
                <span className="inline-block text-[10px] uppercase tracking-widest text-[#521D2B] font-mono bg-[#521D2B]/10 px-3 py-1 rounded-full font-bold">
                  शाही संदर्भ • Lead ID: {submittedLeadNumber}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#211A19]">
                  Shahi Farman Received!
                </h3>
                <p className="text-xs text-[#57534E] max-w-xs mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#211A19]">{name}</strong>. Our Senior Lucknow Concierge for <span className="font-semibold">{targetVenue}</span> is preparing your customized quotation and Muhurat availability.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={whatsappRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-md active:scale-[0.99]"
                >
                  <MessageCircle size={15} />
                  <span>Connect on WhatsApp Now</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl border border-[#DDD3C5] bg-white text-xs text-[#57534E] hover:text-[#211A19] hover:bg-[#FAF7F2] transition-all font-medium"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Antique Brass Scroll Roller & Finials */}
        <div className="relative z-10 flex items-center justify-between px-2 -mt-1">
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#E5C779] via-[#947128] to-[#684C12] border border-[#FAF7F2] shadow-sm -mr-1" />
          <div className="flex-1 h-3 rounded-full bg-gradient-to-r from-[#805F1E] via-[#F3DE9A] to-[#805F1E] border border-[#E8DFD3]/40 shadow-xs flex items-center justify-center">
            <div className="w-16 h-0.5 bg-[#521D2B]/30 rounded-full" />
          </div>
          <div className="w-4 h-4 rounded-full bg-gradient-to-tl from-[#E5C779] via-[#947128] to-[#684C12] border border-[#FAF7F2] shadow-sm -ml-1" />
        </div>
      </div>
    </div>
  );
}
