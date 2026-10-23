"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Phone, MessageCircle, Home, Sparkles } from "lucide-react";
import { transitionConciergeStep } from "@/animations/contact/contactTransitions";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { captureCampaignParams } from "@/lib/campaign";
import { saveUserPreferences, getUserPreferences } from "@/lib/storage";
import { createLeadObject } from "@/lib/contact/lead";
import { submitConciergeLeadAction } from "@/app/actions/enquiry";

const EVENT_TYPES = [
  "WEDDING",
  "RECEPTION",
  "ENGAGEMENT",
  "DESTINATION WEDDING",
  "OTHER",
];

const SERVICE_OPTIONS = [
  "FULL WEDDING PLANNING",
  "HERITAGE VENUE CURATION",
  "ROYAL DECOR & ARCHITECTURE",
  "FINE-ART PHOTOGRAPHY",
  "AWADHI ROYAL CATERING",
  "SUFI & CELEBRITY ARTISTS",
  "BRIDAL CONCIERGE & STYLING",
  "COMPLETE EXPERIENCE",
];

export function ConciergeCard() {
  const cardBodyRef = useRef<HTMLDivElement>(null);

  // Steps: 0 = Initial Invitation state, 1..6 = Questions, 7 = Final Confirmation
  const [step, setStep] = useState<number>(0);

  // Form State
  const [name, setName] = useState<string>("");
  const [eventType, setEventType] = useState<string>("WEDDING");
  const [selectedServices, setSelectedServices] = useState<string[]>(["FULL WEDDING PLANNING"]);
  const [weddingDate, setWeddingDate] = useState<string>("");
  const [location, setLocation] = useState<string>("Lucknow");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [leadNumber, setLeadNumber] = useState<string>("");

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // Pre-populate if returning user has previously submitted on our website
    const timer = setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const serviceParam = params.get("service")?.toLowerCase();
          if (serviceParam) {
            if (serviceParam.includes("photo")) setSelectedServices(["FINE-ART PHOTOGRAPHY"]);
            else if (serviceParam.includes("decor") || serviceParam.includes("plan")) setSelectedServices(["ROYAL DECOR & ARCHITECTURE", "FULL WEDDING PLANNING"]);
            else if (serviceParam.includes("cater")) setSelectedServices(["AWADHI ROYAL CATERING"]);
            else if (serviceParam.includes("music") || serviceParam.includes("artist") || serviceParam.includes("entertainment")) setSelectedServices(["SUFI & CELEBRITY ARTISTS"]);
            else if (serviceParam.includes("beauty") || serviceParam.includes("makeup") || serviceParam.includes("styling")) setSelectedServices(["BRIDAL CONCIERGE & STYLING"]);
            else if (serviceParam.includes("venue")) setSelectedServices(["HERITAGE VENUE CURATION"]);
          }
        }
        const prefs = getUserPreferences();
        if (prefs.name) {
          setName((prev) => prev || prefs.name || "");
        }
        if (prefs.phone) {
          setPhone((prev) => prev || prefs.phone || "");
        }
      } catch {
        // storage unavailable
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const changeStep = (nextStep: number) => {
    setErrorMsg("");
    transitionConciergeStep(cardBodyRef.current, () => {
      setStep(nextStep);
    });
  };

  const handleBegin = () => changeStep(1);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please provide your name so our concierge team may address you.");
      return;
    }
    changeStep(2);
  };

  const handleStep2Submit = () => changeStep(3);

  const handleToggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleStep3Submit = () => {
    if (selectedServices.length === 0) {
      setErrorMsg("Please select at least one service of interest.");
      return;
    }
    changeStep(4);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weddingDate.trim()) {
      setErrorMsg("Please share your tentative date or celebration season.");
      return;
    }
    changeStep(5);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      setErrorMsg("Please specify the celebration city or venue.");
      return;
    }
    changeStep(6);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMsg("Please provide a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    // Save non-sensitive convenience info for returning visitor
    saveUserPreferences({ name: name.trim(), phone: cleanPhone });

    // Capture UTM attribution
    const utms = captureCampaignParams();

    // Create local lead object for analytics and fallback
    createLeadObject({
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim() || undefined,
      eventType,
      services: selectedServices,
      weddingDate: weddingDate.trim(),
      location: location.trim(),
      source: utms.utm_source,
      medium: utms.utm_medium,
      campaign: utms.utm_campaign,
      content: utms.utm_content,
      term: utms.utm_term,
    });

    try {
      const res = await submitConciergeLeadAction({
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim() || undefined,
        eventType,
        services: selectedServices,
        weddingDate: weddingDate.trim(),
        location: location.trim(),
        utmSource: utms.utm_source,
        utmMedium: utms.utm_medium,
        utmCampaign: utms.utm_campaign,
        utmContent: utms.utm_content,
        utmTerm: utms.utm_term,
      });

      if (res.leadNumber) {
        setLeadNumber(res.leadNumber);
      }
    } catch (err) {
      console.warn("[Concierge Submission] Database action failed, fallback active:", err);
    } finally {
      setIsSubmitting(false);
      changeStep(7);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl sm:rounded-3xl bg-white text-[#211A19] border border-[#D8CBBE] p-6 sm:p-9 md:p-11 shadow-[0_20px_50px_rgba(33,26,25,0.08)] select-none">
      {/* Refined subtle editorial top accent in oxblood */}
      <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-[#521D2B]/40 to-transparent" />

      {/* Dynamic Card Content with GSAP Step Transitions */}
      <div ref={cardBodyRef} className="min-h-[380px] flex flex-col justify-between">
        {/* STEP 0: INITIAL CONCIERGE INVITATION DESK */}
        {step === 0 && (
          <div className="flex flex-col justify-between h-full py-2 sm:py-4 text-center space-y-7">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.35em] uppercase text-[#521D2B] font-semibold block">
                PRIVATE CONSULTATION SUITE
              </span>
              <div className="w-10 h-[1px] bg-[#E5DDD2] mx-auto" />
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-[#211A19] leading-snug">
                Tell us about<br />
                <span className="italic text-[#521D2B]">your celebration.</span>
              </h3>
              <p className="text-xs sm:text-sm font-light text-[#6B635B] max-w-sm mx-auto leading-relaxed pt-1">
                A private, bespoke consultation tailored to your vision, guest experiences, and royal Lucknow venues.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleBegin}
                className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 min-h-[48px] rounded-[2px] cursor-pointer select-none text-xs font-medium tracking-[0.24em] uppercase text-[#FAF7F2] bg-[#521D2B] hover:bg-[#3D1520] border border-[#521D2B] transition-all duration-300 shadow-[0_6px_20px_rgba(82,29,43,0.22)]"
              >
                <span>Begin Consultation</span>
                <ArrowRight size={14} className="text-[#D6B56D] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="text-[10px] tracking-[0.2em] uppercase text-[#8C7D73]">
              ESTIMATED TIME: 30 SECONDS • CONFIDENTIAL
            </div>
          </div>
        )}

        {/* STEP 1: NAME */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#521D2B] font-semibold">
                <span>STEP 01 / 06</span>
                <span className="text-[#8C7D73]">GUEST INVITATION</span>
              </div>
              <div className="w-full h-[1px] bg-[#E5DDD2]" />

              <label htmlFor="concierge-name" className="block text-xl sm:text-2xl font-serif text-[#211A19] leading-snug">
                First, may we know <span className="italic text-[#521D2B]">your name?</span>
              </label>

              <input
                id="concierge-name"
                type="text"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Siddhant Verma"
                className="w-full px-4 py-4 rounded-[2px] bg-[#FDFBF7] border border-[#D8CBBE] focus:border-[#521D2B] text-[#211A19] placeholder-[#9E948A] text-base outline-none transition-colors shadow-sm focus:ring-1 focus:ring-[#521D2B]/20"
              />

              {errorMsg && <p className="text-rose-700 text-xs">{errorMsg}</p>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5DDD2]">
              <button
                type="button"
                onClick={() => changeStep(0)}
                className="text-xs uppercase tracking-[0.2em] text-[#78716C] hover:text-[#211A19] transition-colors cursor-pointer"
              >
                ← Return
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-[#FAF7F2] bg-[#521D2B] hover:bg-[#3D1520] border border-[#521D2B] transition-all cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight size={14} className="text-[#D6B56D]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: EVENT TYPE */}
        {step === 2 && (
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#521D2B] font-semibold">
                <span>STEP 02 / 06</span>
                <span className="text-[#8C7D73]">CELEBRATION TYPE</span>
              </div>
              <div className="w-full h-[1px] bg-[#E5DDD2]" />

              <h4 className="text-xl sm:text-2xl font-serif text-[#211A19] leading-snug">
                What are you planning, <span className="italic text-[#521D2B]">{name}</span>?
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {EVENT_TYPES.map((et) => {
                  const isSelected = eventType === et;
                  return (
                    <button
                      key={et}
                      type="button"
                      onClick={() => setEventType(et)}
                      className={`flex items-center justify-between p-3.5 rounded-[2px] text-xs tracking-[0.16em] uppercase transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#521D2B] border-[#521D2B] text-[#FAF7F2] shadow-sm font-medium"
                          : "bg-[#F7F3ED] border-[#E5DDD2] hover:border-[#521D2B]/50 text-[#4A3F39]"
                      }`}
                    >
                      <span>{et}</span>
                      {isSelected && <Check size={14} className="text-[#D6B56D]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5DDD2]">
              <button
                type="button"
                onClick={() => changeStep(1)}
                className="text-xs uppercase tracking-[0.2em] text-[#78716C] hover:text-[#211A19] transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleStep2Submit}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-[#FAF7F2] bg-[#521D2B] hover:bg-[#3D1520] border border-[#521D2B] transition-all cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight size={14} className="text-[#D6B56D]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SERVICES REQUIRED */}
        {step === 3 && (
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#521D2B] font-semibold">
                <span>STEP 03 / 06</span>
                <span className="text-[#8C7D73]">BESPOKE SERVICES</span>
              </div>
              <div className="w-full h-[1px] bg-[#E5DDD2]" />

              <h4 className="text-lg sm:text-xl font-serif text-[#211A19] leading-snug">
                What would you like our studio to orchestrate?
              </h4>
              <p className="text-[11px] text-[#6B635B] -mt-2">
                Select all aspects of interest for your celebration:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {SERVICE_OPTIONS.map((srv) => {
                  const isChecked = selectedServices.includes(srv);
                  return (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => handleToggleService(srv)}
                      className={`flex items-center justify-between p-3 rounded-[2px] text-[11px] tracking-[0.14em] uppercase transition-all cursor-pointer border ${
                        isChecked
                          ? "bg-[#521D2B] border-[#521D2B] text-[#FAF7F2] shadow-sm font-medium"
                          : "bg-[#F7F3ED] border-[#E5DDD2] hover:border-[#521D2B]/50 text-[#4A3F39]"
                      }`}
                    >
                      <span className="truncate">{srv}</span>
                      {isChecked && <Check size={13} className="text-[#D6B56D] shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>

              {errorMsg && <p className="text-rose-700 text-xs">{errorMsg}</p>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5DDD2]">
              <button
                type="button"
                onClick={() => changeStep(2)}
                className="text-xs uppercase tracking-[0.2em] text-[#78716C] hover:text-[#211A19] transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleStep3Submit}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-[#FAF7F2] bg-[#521D2B] hover:bg-[#3D1520] border border-[#521D2B] transition-all cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight size={14} className="text-[#D6B56D]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DATE */}
        {step === 4 && (
          <form onSubmit={handleStep4Submit} className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#521D2B] font-semibold">
                <span>STEP 04 / 06</span>
                <span className="text-[#8C7D73]">TIMELINE</span>
              </div>
              <div className="w-full h-[1px] bg-[#E5DDD2]" />

              <label htmlFor="concierge-date" className="block text-xl sm:text-2xl font-serif text-[#211A19] leading-snug">
                When is the <span className="italic text-[#521D2B]">celebration?</span>
              </label>

              <input
                id="concierge-date"
                type="text"
                autoFocus
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                placeholder="e.g. November 2025 or Winter 2025/2026"
                className="w-full px-4 py-4 rounded-[2px] bg-[#FDFBF7] border border-[#D8CBBE] focus:border-[#521D2B] text-[#211A19] placeholder-[#9E948A] text-base outline-none transition-colors shadow-sm focus:ring-1 focus:ring-[#521D2B]/20"
              />

              <p className="text-xs text-[#78716C]">
                An exact wedding date or tentative month/season is welcome.
              </p>

              {errorMsg && <p className="text-rose-700 text-xs">{errorMsg}</p>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5DDD2]">
              <button
                type="button"
                onClick={() => changeStep(3)}
                className="text-xs uppercase tracking-[0.2em] text-[#78716C] hover:text-[#211A19] transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-[#FAF7F2] bg-[#521D2B] hover:bg-[#3D1520] border border-[#521D2B] transition-all cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight size={14} className="text-[#D6B56D]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: LOCATION */}
        {step === 5 && (
          <form onSubmit={handleStep5Submit} className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#521D2B] font-semibold">
                <span>STEP 05 / 06</span>
                <span className="text-[#8C7D73]">DESTINATION & VENUE</span>
              </div>
              <div className="w-full h-[1px] bg-[#E5DDD2]" />

              <label htmlFor="concierge-location" className="block text-xl sm:text-2xl font-serif text-[#211A19] leading-snug">
                Where are you planning to <span className="italic text-[#521D2B]">celebrate?</span>
              </label>

              <input
                id="concierge-location"
                type="text"
                autoFocus
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lucknow (or specific venue)"
                className="w-full px-4 py-4 rounded-[2px] bg-[#FDFBF7] border border-[#D8CBBE] focus:border-[#521D2B] text-[#211A19] placeholder-[#9E948A] text-base outline-none transition-colors shadow-sm focus:ring-1 focus:ring-[#521D2B]/20"
              />

              <p className="text-xs text-[#78716C]">
                Default: Lucknow. You may specify specific heritage lawns, palaces or destination cities.
              </p>

              {errorMsg && <p className="text-rose-700 text-xs">{errorMsg}</p>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5DDD2]">
              <button
                type="button"
                onClick={() => changeStep(4)}
                className="text-xs uppercase tracking-[0.2em] text-[#78716C] hover:text-[#211A19] transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-[#FAF7F2] bg-[#521D2B] hover:bg-[#3D1520] border border-[#521D2B] transition-all cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight size={14} className="text-[#D6B56D]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 6: CONTACT INFORMATION */}
        {step === 6 && (
          <form onSubmit={handleFinalSubmit} className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#521D2B] font-semibold">
                <span>STEP 06 / 06</span>
                <span className="text-[#8C7D73]">FINAL CONSULTATION DETAILS</span>
              </div>
              <div className="w-full h-[1px] bg-[#E5DDD2]" />

              <label htmlFor="concierge-phone" className="block text-xl sm:text-2xl font-serif text-[#211A19] leading-snug">
                Where may our concierge <span className="italic text-[#521D2B]">reach you?</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#521D2B] font-medium text-sm">
                  +91
                </div>
                <input
                  id="concierge-phone"
                  type="tel"
                  name="tel"
                  autoComplete="tel"
                  autoFocus
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9170701546"
                  className="w-full pl-14 pr-4 py-4 rounded-[2px] bg-[#FDFBF7] border border-[#D8CBBE] focus:border-[#521D2B] text-[#211A19] placeholder-[#9E948A] text-base outline-none transition-colors shadow-sm focus:ring-1 focus:ring-[#521D2B]/20"
                />
              </div>

              <input
                id="concierge-email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address (Optional for PDF portfolio)"
                className="w-full px-4 py-3.5 rounded-[2px] bg-[#FDFBF7] border border-[#D8CBBE] focus:border-[#521D2B] text-[#211A19] placeholder-[#9E948A] text-xs sm:text-sm outline-none transition-colors shadow-sm"
              />

              {errorMsg && <p className="text-rose-700 text-xs">{errorMsg}</p>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5DDD2]">
              <button
                type="button"
                onClick={() => changeStep(5)}
                className="text-xs uppercase tracking-[0.2em] text-[#78716C] hover:text-[#211A19] transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-white bg-[#521D2B] hover:bg-[#3D1520] transition-all cursor-pointer shadow-[0_4px_20px_rgba(82,29,43,0.3)] disabled:opacity-50"
              >
                <span>{isSubmitting ? "Placing on Calendar..." : "Request Consultation"}</span>
                <ArrowRight size={14} className="text-[#D6B56D]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 7: FINAL CONCIERGE CONFIRMATION */}
        {step === 7 && (
          <div className="flex flex-col justify-between h-full py-4 text-center space-y-7">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#521D2B]/10 border border-[#521D2B]/20 text-[#521D2B] flex items-center justify-center mx-auto">
                <Sparkles size={24} className="text-[#521D2B]" />
              </div>

              <span className="text-[10px] tracking-[0.35em] uppercase text-[#521D2B] font-semibold block">
                ROYAL DESK NOTIFIED
              </span>

              <h4 className="text-2xl sm:text-3xl font-serif text-[#211A19] leading-snug">
                Your celebration is now<br />
                <span className="italic text-[#521D2B]">on our calendar.</span>
              </h4>

              <p className="text-xs sm:text-sm font-light text-[#57534E] max-w-sm mx-auto leading-relaxed">
                One of our senior wedding specialists in Lucknow will be in touch shortly to present curated venue portfolios and preliminary timelines.
              </p>

              {leadNumber && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#521D2B]/5 border border-[#521D2B]/20 text-xs font-mono text-[#521D2B]">
                  <span className="text-[#78716C]">Reference:</span>
                  <span className="font-semibold">{leadNumber}</span>
                </div>
              )}
            </div>

            {/* Direct Instant Next Actions */}
            <div className="space-y-3 pt-2 max-w-sm mx-auto w-full">
              {/* WhatsApp Concierge */}
              <a
                href={generateWhatsAppLink({
                  name,
                  service: selectedServices.join(", "),
                  date: weddingDate,
                  customMessage: `Hello Royal Wedding Hub! I have just placed my celebration on your concierge calendar. Name: ${name}, Event: ${eventType}, Services: ${selectedServices.join(", ")}, Date: ${weddingDate}, Location: ${location}. Looking forward to connecting!`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-[2px] text-xs font-semibold tracking-[0.2em] uppercase text-white bg-[#521D2B] hover:bg-[#3D1520] transition-all shadow-[0_4px_20px_rgba(82,29,43,0.25)]"
              >
                <MessageCircle size={15} className="text-[#25D366]" />
                <span>WhatsApp The Concierge</span>
              </a>

              {/* Call Now */}
              <a
                href={getTelUrl()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.18em] uppercase text-[#211A19] bg-[#F7F3ED] hover:bg-white border border-[#D8CBBE] transition-all"
              >
                <Phone size={13} className="text-[#521D2B]" />
                <span>Call Directly: {BUSINESS_INFO.displayPhone}</span>
              </a>

              {/* Return Home */}
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-[#78716C] hover:text-[#211A19] transition-colors pt-2"
              >
                <Home size={12} />
                <span>Return To Experience</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
