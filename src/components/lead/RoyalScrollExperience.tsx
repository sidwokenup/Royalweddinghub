'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { submitShahiFarmanAction } from '@/app/actions/lead';

export function RoyalScrollExperience() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [confirmedLeadNumber, setConfirmedLeadNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasClaimed, setHasClaimed] = useState(false);

  // Check on mount if user already filled form
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const claimed = localStorage.getItem('rwh_shahi_farman_claimed');
        const savedId = localStorage.getItem('rwh_shahi_farman_lead_id');
        if (claimed === 'true') {
          setHasClaimed(true);
          setSubmitSuccess(true);
          if (savedId) setConfirmedLeadNumber(savedId);
        }
      }
    } catch {
      // LocalStorage access check
    }
  }, []);

  // Listen for custom trigger event (Navbar / Footer button clicks)
  useEffect(() => {
    const handleTrigger = () => {
      setIsOpen(true);
      setErrorMessage('');
    };

    window.addEventListener('open-royal-scroll', handleTrigger);
    return () => window.removeEventListener('open-royal-scroll', handleTrigger);
  }, []);

  // Timed popup: appears 15 seconds after page load, and reappears every 15s after closing until filled
  useEffect(() => {
    if (isOpen || hasClaimed) return;

    try {
      if (typeof window !== 'undefined' && localStorage.getItem('rwh_shahi_farman_claimed') === 'true') {
        setHasClaimed(true);
        return;
      }
    } catch {
      // ignore
    }

    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && localStorage.getItem('rwh_shahi_farman_claimed') === 'true') {
          setHasClaimed(true);
          return;
        }
      } catch {
        // ignore
      }
      setIsOpen(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [isOpen, hasClaimed]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setErrorMessage('');
  };

  const handleOpen = () => {
    setIsOpen(true);
    setErrorMessage('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitShahiFarmanAction({
        name: cleanName,
        phone: cleanPhone,
        weddingDate: 'Upcoming Season',
        celebrationStyle: 'Palace Lawn & Banquets',
      });

      if (res.success) {
        setSubmitSuccess(true);
        setHasClaimed(true);
        const refId = res.leadNumber || `RWH-${Date.now().toString().slice(-6)}`;
        setConfirmedLeadNumber(refId);

        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('rwh_shahi_farman_claimed', 'true');
            localStorage.setItem('rwh_shahi_farman_lead_id', refId);
          }
        } catch {
          // ignore
        }

        // Auto close after 3 seconds
        setTimeout(() => {
          setIsOpen(false);
        }, 3200);
      } else {
        setErrorMessage(res.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMessage('Network error. Please try again or reach us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* =========================================================================
          1. MINIMAL FLOATING BUTTON (Desktop & Tablet)
          ========================================================================= */}
      {!isOpen && !hasClaimed && (
        <button
          type="button"
          onClick={handleOpen}
          className="hidden md:inline-flex fixed bottom-6 right-6 z-[9980] items-center gap-2 px-4 py-2.5 rounded-full bg-[#1F1918] hover:bg-[#2C2422] text-[#FAF7F2] border border-white/10 shadow-lg hover:shadow-xl transition-all text-xs font-medium cursor-pointer"
          aria-label="Open Privilege Form"
        >
          <Sparkles size={14} className="text-[#D6B56D]" />
          <span>Claim ₹50,000 Privilege</span>
        </button>
      )}

      {/* =========================================================================
          2. MINIMAL LEAD FORM MODAL (Matches Reference Screenshot)
          ========================================================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
          {/* Subtle Backdrop */}
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          />

          {/* Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full sm:max-w-[420px] bg-white rounded-t-[32px] sm:rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
          >
            {/* Close Button in Top Right */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#EBEBEF] text-[#71717A] hover:text-[#18181B] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close form"
            >
              <X size={16} />
            </button>

            {submitSuccess ? (
              /* Success State */
              <div className="text-center py-6 sm:py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">
                  You&apos;re All Set!
                </h3>
                <p className="text-xs sm:text-sm text-[#71717A] max-w-xs mx-auto leading-relaxed">
                  Our wedding concierge will share detailed venue pricing &amp; availability on WhatsApp shortly.
                </p>
                {confirmedLeadNumber && (
                  <span className="inline-block text-[11px] font-mono text-[#521D2B] bg-[#521D2B]/8 px-3 py-1 rounded-full font-medium">
                    Reference ID: {confirmedLeadNumber}
                  </span>
                )}
              </div>
            ) : (
              /* Minimal Form */
              <div className="pt-2">
                {/* Heading (Kept same as original as requested) */}
                <h2 className="text-2xl sm:text-[26px] font-serif font-bold text-[#1A1A1A] tracking-tight text-center leading-tight">
                  The Royal Wedding Privilege
                </h2>

                <p className="text-xs sm:text-sm text-[#71717A] mt-1.5 text-center font-sans font-normal">
                  See exact pricing &amp; availability for your dates
                </p>

                {errorMessage && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-medium">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="mt-6 space-y-3">
                  {/* Name Input */}
                  <div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#F5F5F7] border border-transparent focus:border-[#D6B56D] focus:bg-white text-sm text-[#1A1A1A] placeholder-[#A1A1AA] outline-none transition-all font-sans"
                    />
                  </div>

                  {/* Phone Input with Country Code */}
                  <div className="flex gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-3.5 rounded-2xl bg-[#F5F5F7] text-sm text-[#1A1A1A] font-medium select-none shrink-0">
                      <span>+91</span>
                      <ChevronDown size={14} className="text-[#71717A]" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="flex-1 px-4 py-3.5 rounded-2xl bg-[#F5F5F7] border border-transparent focus:border-[#D6B56D] focus:bg-white text-sm text-[#1A1A1A] placeholder-[#A1A1AA] outline-none transition-all font-sans"
                    />
                  </div>

                  {/* Micro-trust line */}
                  <div className="pt-1">
                    <p className="text-[11px] text-[#71717A] flex items-center justify-center gap-1.5 font-normal">
                      <span>Instant access</span>
                      <span>•</span>
                      <span>No spam calls</span>
                    </p>
                  </div>

                  {/* CTA Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 sm:py-4 px-6 rounded-full bg-[#521D2B] hover:bg-[#682436] text-[#FAF7F2] font-medium text-xs sm:text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-[#FAF7F2]" />
                          <span>Checking Availability...</span>
                        </>
                      ) : (
                        <span>View Detailed Pricing &amp; Availability</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
