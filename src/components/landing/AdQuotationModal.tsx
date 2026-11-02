'use client';

import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles, Send, Phone, MessageCircle } from 'lucide-react';
import { submitLeadAction } from '@/app/actions/lead';
import { trackLeadGeneration } from '@/lib/analytics';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { BUSINESS_INFO } from '@/lib/contact';

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

export function AdQuotationModal({ isOpen, onClose, context }: AdQuotationModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [weddingDate, setWeddingDate] = useState(context?.weddingDate || '');
  const [guestCount, setGuestCount] = useState(context?.guestCount || '500 Pax');
  const [budgetBracket, setBudgetBracket] = useState(context?.budgetBracket || '₹10L - ₹15 Lakh');
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Venue Booking & Scouting',
    'Planning & Decor',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadNumber, setSubmittedLeadNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const isWalkthrough = context?.type === 'walkthrough';
  const targetVenue = context?.venueName || 'Any Verified Venue in Lucknow';

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await submitLeadAction({
        name,
        phone,
        email: email || undefined,
        eventType: 'WEDDING',
        services: selectedServices,
        weddingDate: weddingDate || 'Not finalized yet',
        guestCountBracket: guestCount,
        budgetBracket,
        location: context?.location || 'Lucknow',
        venueName: targetVenue,
        utmSource: 'google_ads',
        utmCampaign: isWalkthrough ? 'venue_walkthrough' : 'venue_quotation',
      });

      // Fire Google Ads conversion tracking
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
    customMessage: `Hello Royal Wedding Hub! I just requested a ${
      isWalkthrough ? 'guided walkthrough' : 'quotation'
    } on your website. My Lead ID is ${submittedLeadNumber || 'NEW'}. Name: ${name}, Venue: ${targetVenue}, Guests: ${guestCount}, Budget: ${budgetBracket}, Date: ${weddingDate || 'TBD'}. Please share packages!`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg bg-[#FAF7F2] border border-[#E8DFD3] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#211A19] overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#78716C] hover:text-[#211A19] rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {!submittedLeadNumber ? (
          <>
            {/* Modal Header */}
            <div className="mb-6 pr-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-[#521D2B] font-mono bg-[#521D2B]/8 px-2.5 py-1 rounded-full border border-[#521D2B]/20 mb-2 font-semibold">
                <Sparkles size={11} />
                {isWalkthrough ? 'Guided Site Walkthrough' : 'Instant Quotation & Availability'}
              </span>
              <h3 id="modal-title" className="text-xl sm:text-2xl font-serif font-bold text-[#211A19]">
                {isWalkthrough ? `Book a Site Walkthrough: ${targetVenue}` : `Get Quotation: ${targetVenue}`}
              </h3>
              <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                Connect directly with our senior wedding concierge. Receive exact date availability, transparent per-plate pricing, and customized decor estimates.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Full Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#521D2B] mb-1 font-semibold">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-white border border-[#DDD3C5] focus:border-[#521D2B] focus:ring-1 focus:ring-[#521D2B]/20 rounded-xl px-3.5 py-2.5 text-sm text-[#211A19] placeholder:text-[#A89F91] outline-none transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#521D2B] mb-1 font-semibold">
                    WhatsApp / Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9170888981"
                    className="w-full bg-white border border-[#DDD3C5] focus:border-[#521D2B] focus:ring-1 focus:ring-[#521D2B]/20 rounded-xl px-3.5 py-2.5 text-sm text-[#211A19] placeholder:text-[#A89F91] outline-none transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#57534E] mb-1 font-medium">
                  Email Address <span className="text-[10px] text-[#78716C]">(Optional for PDF quote)</span>
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul@example.com"
                  className="w-full bg-white border border-[#DDD3C5] focus:border-[#521D2B] focus:ring-1 focus:ring-[#521D2B]/20 rounded-xl px-3.5 py-2 text-sm text-[#211A19] placeholder:text-[#A89F91] outline-none transition-all shadow-xs"
                />
              </div>

              {/* Event Date & Guest Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#521D2B] mb-1 font-semibold">
                    Tentative Wedding Date
                  </label>
                  <input
                    type="text"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    placeholder="e.g. Dec 2026 or Spring 2027"
                    className="w-full bg-white border border-[#DDD3C5] focus:border-[#521D2B] focus:ring-1 focus:ring-[#521D2B]/20 rounded-xl px-3.5 py-2 text-sm text-[#211A19] placeholder:text-[#A89F91] outline-none transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#521D2B] mb-1 font-semibold">
                    Guest Count Bracket
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-white border border-[#DDD3C5] focus:border-[#521D2B] focus:ring-1 focus:ring-[#521D2B]/20 rounded-xl px-3.5 py-2 text-sm text-[#211A19] outline-none transition-all shadow-xs cursor-pointer"
                  >
                    <option value="100 - 300 Pax">100 - 300 Guests (Intimate)</option>
                    <option value="300 - 500 Pax">300 - 500 Guests (Medium)</option>
                    <option value="500 - 1000 Pax">500 - 1,000 Guests (Grand Celebration)</option>
                    <option value="1000 - 2500+ Pax">1,000 - 2,500+ Guests (Royal Mega)</option>
                  </select>
                </div>
              </div>

              {/* Budget Bracket */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#521D2B] mb-1 font-semibold">
                  Estimated Total Budget Bracket
                </label>
                <select
                  value={budgetBracket}
                  onChange={(e) => setBudgetBracket(e.target.value)}
                  className="w-full bg-white border border-[#DDD3C5] focus:border-[#521D2B] focus:ring-1 focus:ring-[#521D2B]/20 rounded-xl px-3.5 py-2 text-sm text-[#211A19] outline-none transition-all shadow-xs cursor-pointer"
                >
                  <option value="Under ₹10 Lakh">Under ₹10 Lakh (Boutique Celebration)</option>
                  <option value="₹10L - ₹15 Lakh">₹10 Lakh - ₹15 Lakh (Popular 500-Pax Tier)</option>
                  <option value="₹15L - ₹25 Lakh">₹15 Lakh - ₹25 Lakh (Luxury Resort / Grand Lawn)</option>
                  <option value="₹25 Lakh+ Luxury">₹25 Lakh+ (Bespoke Royal Palace Production)</option>
                </select>
              </div>

              {/* Additional Services Checkbox Pills */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#57534E] mb-2 font-medium">
                  Additional Services Needed:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Planning & Decor',
                    'Awadhi Royal Catering',
                    'Photography & 4K Cinema',
                    'Artist & Sufi Music',
                    'Bridal Trousseau Styling',
                  ].map((service) => {
                    const active = selectedServices.includes(service);
                    return (
                      <button
                        type="button"
                        key={service}
                        onClick={() => toggleService(service)}
                        className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                          active
                            ? 'bg-[#521D2B] border-[#521D2B] text-white font-semibold'
                            : 'bg-white border-[#DDD3C5] text-[#57534E] hover:border-[#521D2B]/40 hover:text-[#211A19]'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {service}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#521D2B] hover:bg-[#671024] text-white font-semibold py-3.5 px-6 rounded-xl uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 text-sm"
              >
                <Send size={15} />
                <span>
                  {isSubmitting
                    ? 'Transmitting to Concierge...'
                    : isWalkthrough
                    ? 'Confirm Site Walkthrough Reservation'
                    : 'Submit & Get Instant Quotation'}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#78716C] pt-1">
                <ShieldCheck size={12} className="text-[#521D2B]" />
                <span>100% Confidential. Zero spam policy. Direct Lucknow team response.</span>
              </div>
            </form>
          </>
        ) : (
          /* Success Screen */
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#166534]/10 border border-[#166534]/30 text-[#166534] flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>

            <div className="space-y-1">
              <span className="inline-block text-[11px] uppercase tracking-widest text-[#521D2B] font-mono bg-[#521D2B]/10 px-3 py-1 rounded-full font-semibold">
                Lead ID: {submittedLeadNumber}
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#211A19]">
                Quotation Request Received!
              </h3>
              <p className="text-xs text-[#57534E] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-[#211A19]">{name}</strong>. Our Senior Wedding Specialist for {targetVenue} has received your preferences and is preparing your personalized quotation.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappRedirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md"
              >
                <MessageCircle size={15} />
                <span>Chat on WhatsApp Directly</span>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#DDD3C5] bg-white text-xs text-[#57534E] hover:text-[#211A19] hover:bg-[#FAF7F2] transition-all font-medium"
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
