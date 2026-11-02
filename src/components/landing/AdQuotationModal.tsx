'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles, Send, MessageCircle, MapPin, Calendar, Clock } from 'lucide-react';
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
  'Spring 2027',
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
    service: isWalkthrough ? 'Venue Walkthrough' : 'Quotation Request',
    customMessage: `Hello Royal Wedding Hub! I requested a ${
      isWalkthrough ? 'guided walkthrough' : 'quotation'
    } on your website. My Lead ID is ${submittedLeadNumber || 'NEW'}. Name: ${name}, Venue: ${targetVenue}, Guests: ${guestCount}, Budget: ${budgetBracket}, Date: ${weddingDate || 'Upcoming'}. Please share complete packages!`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modern, Realistic Event Planner Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E8DFD3] shadow-[0_24px_64px_rgba(33,26,25,0.22)] p-6 sm:p-7 text-[#211A19] my-auto select-none transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#78716C] hover:text-[#211A19] rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          aria-label="Close"
        >
          <X size={17} />
        </button>

        {!submittedLeadNumber ? (
          <>
            {/* Header */}
            <div className="text-left pb-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#521D2B] bg-[#521D2B]/8 px-3 py-1 rounded-full border border-[#521D2B]/15 font-semibold mb-2">
                <Sparkles size={11} />
                {isWalkthrough ? 'Guided Site Walkthrough' : 'Direct Planner Consultation'}
              </span>

              <h3 id="modal-title" className="text-xl sm:text-2xl font-serif font-bold text-[#211A19] leading-tight">
                {isWalkthrough ? `Book Site Visit: ${targetVenue}` : `Get Packages: ${targetVenue}`}
              </h3>

              {/* Context Pill */}
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DFD3] text-xs text-[#57534E]">
                <MapPin size={11} className="text-[#521D2B] shrink-0" />
                <span className="font-semibold text-[#211A19] truncate max-w-[200px]">{targetVenue}</span>
                <span className="text-[#D6B56D]">•</span>
                <span className="font-medium text-[#521D2B]">{budgetBracket}</span>
              </div>
            </div>

            {/* Fast 3-Field High-Conversion Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-left">
              {/* Field 1: Name */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#521D2B] mb-1 font-bold">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#FAF7F2] focus:bg-white border border-[#DDD3C5] focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-[#211A19] placeholder:text-[#A8A29E] outline-none transition-all shadow-2xs"
                />
              </div>

              {/* Field 2: WhatsApp / Phone */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#521D2B] mb-1 font-bold">
                  WhatsApp / Mobile Number *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-semibold text-[#521D2B] select-none pointer-events-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    placeholder="9170888981"
                    className="w-full bg-[#FAF7F2] focus:bg-white border border-[#DDD3C5] focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/15 rounded-xl pl-12 pr-3.5 py-2.5 text-base sm:text-sm text-[#211A19] placeholder:text-[#A8A29E] outline-none transition-all shadow-2xs tracking-wider font-medium"
                  />
                </div>
              </div>

              {/* Field 3: Date / Muhurat */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#57534E] font-medium flex items-center gap-1">
                    <Calendar size={11} className="text-[#521D2B]" />
                    Tentative Wedding Date / Season
                  </label>
                  <span className="text-[10px] text-[#78716C] font-mono">Optional</span>
                </div>
                <input
                  type="text"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  placeholder="e.g. Dec 2026 or Spring 2027"
                  className="w-full bg-[#FAF7F2] focus:bg-white border border-[#DDD3C5] focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/15 rounded-xl px-3.5 py-2 text-base sm:text-sm text-[#211A19] placeholder:text-[#A8A29E] outline-none transition-all shadow-2xs"
                />

                {/* Quick Season Selection Chips */}
                <div className="flex items-center gap-1.5 mt-2">
                  {QUICK_SEASONS.map((season) => (
                    <button
                      type="button"
                      key={season}
                      onClick={() => setWeddingDate(season)}
                      className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                        weddingDate === season
                          ? 'bg-[#521D2B] text-white border-[#521D2B] font-semibold'
                          : 'bg-[#FAF7F2] border-[#DDD3C5] text-[#57534E] hover:border-[#521D2B]/40 hover:text-[#211A19]'
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !phone.trim()}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#521D2B] hover:bg-[#671024] active:scale-[0.99] text-white font-semibold text-sm uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send size={14} />
                <span>
                  {isSubmitting
                    ? 'Submitting Request...'
                    : isWalkthrough
                    ? 'Confirm Site Walkthrough'
                    : 'Get Free Quotation & Packages'}
                </span>
              </button>

              {/* Reassurance */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#78716C] pt-1">
                <ShieldCheck size={12} className="text-[#166534] shrink-0" />
                <span>100% Confidential • Direct Planner Response • 1-Hour PDF</span>
              </div>
            </form>
          </>
        ) : (
          /* Confirmation Screen */
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-[#166534]/10 border-2 border-[#166534]/30 text-[#166534] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle size={28} />
            </div>

            <div className="space-y-1">
              <span className="inline-block text-[10px] uppercase tracking-widest text-[#521D2B] font-mono bg-[#521D2B]/10 px-3 py-1 rounded-full font-bold">
                Lead ID: {submittedLeadNumber}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#211A19]">
                Inquiry Received!
              </h3>
              <p className="text-xs text-[#57534E] max-w-xs mx-auto leading-relaxed">
                Thank you, <strong className="text-[#211A19]">{name}</strong>. Our Senior Wedding Specialist for <span className="font-semibold">{targetVenue}</span> is preparing your customized quotation.
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
                <span>Connect on WhatsApp Directly</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-[#DDD3C5] bg-[#FAF7F2] text-xs text-[#57534E] hover:text-[#211A19] transition-all font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
