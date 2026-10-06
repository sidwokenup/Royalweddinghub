"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Phone, MessageCircle, ArrowLeft, Home, Sparkles } from "lucide-react";
import { transitionConciergeStep } from "@/animations/contact/contactTransitions";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { captureCampaignParams } from "@/lib/campaign";
import { saveUserPreferences, getUserPreferences } from "@/lib/storage";
import { createLeadObject } from "@/lib/contact/lead";

const EVENT_TYPES = [
  "WEDDING",
  "RECEPTION",
  "ENGAGEMENT",
  "DESTINATION WEDDING",
  "OTHER",
];

const SERVICE_OPTIONS = [
  "FULL WEDDING PLANNING",
  "VENUE",
  "DECOR",
  "PHOTOGRAPHY",
  "CATERING",
  "ENTERTAINMENT",
  "CELEBRITY ARTIST",
  "SUFI ARTIST",
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

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // Pre-populate if returning user has previously submitted on our website
    const prefs = getUserPreferences();
    if (prefs.name) setName(prefs.name);
    if (prefs.phone) setPhone(prefs.phone);
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
      setErrorMsg("Please provide your name so our concierge may address you.");
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
      setErrorMsg("Please select at least one service.");
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

  const handleFinalSubmit = (e: React.FormEvent) => {
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

    // Create lead object
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

    setTimeout(() => {
      setIsSubmitting(false);
      changeStep(7);
    }, 450);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-[3px] bg-[#140e0b]/90 backdrop-blur-xl border border-[#f3e5d8]/25 p-6 sm:p-9 md:p-11 shadow-[0_12px_50px_rgba(0,0,0,0.65)] select-none">
      {/* Decorative hairline corner brackets */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-[#d4af37]/40 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-[#d4af37]/40 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-[#d4af37]/40 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-[#d4af37]/40 pointer-events-none" />

      {/* Dynamic Card Content with GSAP Step Transitions */}
      <div ref={cardBodyRef} className="min-h-[360px] flex flex-col justify-between">
        {/* STEP 0: INITIAL CONCIERGE INVITATION DESK */}
        {step === 0 && (
          <div className="flex flex-col justify-between h-full py-4 sm:py-6 text-center space-y-7">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.38em] uppercase text-[#d4af37] font-medium block">
                THE WEDDING CONCIERGE
              </span>
              <div className="w-8 h-[1px] bg-[#d4af37]/40 mx-auto" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl display-text font-normal text-white leading-snug">
                Tell us about<br />
                <span className="italic text-[#f3e5d8]">your celebration.</span>
              </h2>
              <p className="text-xs sm:text-sm font-light text-white/70 max-w-sm mx-auto leading-relaxed pt-1">
                A private, bespoke consultation tailored to your vision, guest experiences, and royal venues.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleBegin}
                className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 min-h-[48px] rounded-[2px] cursor-pointer select-none text-xs font-medium tracking-[0.26em] uppercase text-white bg-white/[0.08] hover:bg-white/[0.16] border border-[#f3e5d8]/40 hover:border-[#f3e5d8] transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
              >
                <span>BEGIN</span>
                <ArrowRight size={14} className="text-[#f3e5d8] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="text-[10px] tracking-[0.2em] uppercase text-white/40">
              ESTIMATED TIME: 25 SECONDS
            </div>
          </div>
        )}

        {/* STEP 1: NAME */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#d4af37]">
                <span>STEP 01 / 06</span>
                <span className="text-white/40">GUEST INVITATION</span>
              </div>
              <div className="w-full h-[1px] bg-white/[0.08]" />

              <label htmlFor="concierge-name" className="block text-xl sm:text-2xl display-text text-white leading-snug">
                First, may we know <span className="italic text-[#f3e5d8]">your name?</span>
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
                className="w-full px-4 py-4 rounded-[2px] bg-black/40 border border-white/20 focus:border-[#d4af37] text-white placeholder-white/30 text-base outline-none transition-colors"
              />

              {errorMsg && <p className="text-rose-400 text-xs">{errorMsg}</p>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => changeStep(0)}
                className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                ← Return
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-white bg-white/[0.12] hover:bg-white/[0.22] border border-[#f3e5d8]/50 hover:border-[#f3e5d8] transition-all cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight size={14} className="text-[#f3e5d8]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: EVENT TYPE */}
        {step === 2 && (
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#d4af37]">
                <span>STEP 02 / 06</span>
                <span className="text-white/40">CELEBRATION TYPE</span>
              </div>
              <div className="w-full h-[1px] bg-white/[0.08]" />

              <h3 className="text-xl sm:text-2xl display-text text-white leading-snug">
                What are you planning, <span className="italic text-[#f3e5d8]">{name}</span>?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {EVENT_TYPES.map((et) => (
                  <button
                    key={et}
                    type="button"
                    onClick={() => setEventType(et)}
                    className={`flex items-center justify-between p-3.5 rounded-[2px] text-xs tracking-[0.16em] uppercase transition-all cursor-pointer border ${
                      eventType === et
                        ? "bg-[#d4af37]/20 border-[#d4af37] text-white shadow-sm"
                        : "bg-black/30 border-white/10 hover:border-white/30 text-white/70"
                    }`}
                  >
                    <span>{et}</span>
                    {eventType === et && <Check size={14} className="text-[#d4af37]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => changeStep(1)}
                className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleStep2Submit}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-white bg-white/[0.12] hover:bg-white/[0.22] border border-[#f3e5d8]/50 hover:border-[#f3e5d8] transition-all cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight size={14} className="text-[#f3e5d8]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SERVICES REQUIRED */}
        {step === 3 && (
          <div className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#d4af37]">
                <span>STEP 03 / 06</span>
                <span className="text-white/40">BESPOKE SERVICES</span>
              </div>
              <div className="w-full h-[1px] bg-white/[0.08]" />

              <h3 className="text-lg sm:text-xl display-text text-white leading-snug">
                What would you like us to take care of?
              </h3>
              <p className="text-[11px] text-white/50 -mt-2">
                Select all that apply for your celebration:
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
                          ? "bg-[#d4af37]/20 border-[#d4af37] text-white"
                          : "bg-black/30 border-white/10 hover:border-white/30 text-white/70"
                      }`}
                    >
                      <span className="truncate">{srv}</span>
                      {isChecked && <Check size={13} className="text-[#d4af37] shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>

              {errorMsg && <p className="text-rose-400 text-xs">{errorMsg}</p>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => changeStep(2)}
                className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleStep3Submit}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-white bg-white/[0.12] hover:bg-white/[0.22] border border-[#f3e5d8]/50 hover:border-[#f3e5d8] transition-all cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight size={14} className="text-[#f3e5d8]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DATE */}
        {step === 4 && (
          <form onSubmit={handleStep4Submit} className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#d4af37]">
                <span>STEP 04 / 06</span>
                <span className="text-white/40">TIMELINE</span>
              </div>
              <div className="w-full h-[1px] bg-white/[0.08]" />

              <label htmlFor="concierge-date" className="block text-xl sm:text-2xl display-text text-white leading-snug">
                When is the <span className="italic text-[#f3e5d8]">celebration?</span>
              </label>

              <input
                id="concierge-date"
                type="text"
                autoFocus
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                placeholder="e.g. November 2025 or 18/12/2025"
                className="w-full px-4 py-4 rounded-[2px] bg-black/40 border border-white/20 focus:border-[#d4af37] text-white placeholder-white/30 text-base outline-none transition-colors"
              />

              <p className="text-xs text-white/50">
                Exact date or general celebration month/season is welcome.
              </p>

              {errorMsg && <p className="text-rose-400 text-xs">{errorMsg}</p>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => changeStep(3)}
                className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-white bg-white/[0.12] hover:bg-white/[0.22] border border-[#f3e5d8]/50 hover:border-[#f3e5d8] transition-all cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight size={14} className="text-[#f3e5d8]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: LOCATION */}
        {step === 5 && (
          <form onSubmit={handleStep5Submit} className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#d4af37]">
                <span>STEP 05 / 06</span>
                <span className="text-white/40">DESTINATION</span>
              </div>
              <div className="w-full h-[1px] bg-white/[0.08]" />

              <label htmlFor="concierge-location" className="block text-xl sm:text-2xl display-text text-white leading-snug">
                Where are you planning to <span className="italic text-[#f3e5d8]">celebrate?</span>
              </label>

              <input
                id="concierge-location"
                type="text"
                autoFocus
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lucknow"
                className="w-full px-4 py-4 rounded-[2px] bg-black/40 border border-white/20 focus:border-[#d4af37] text-white placeholder-white/30 text-base outline-none transition-colors"
              />

              <p className="text-xs text-white/50">
                Default: Lucknow. You may specify specific heritage palaces or alternative destinations.
              </p>

              {errorMsg && <p className="text-rose-400 text-xs">{errorMsg}</p>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => changeStep(4)}
                className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-white bg-white/[0.12] hover:bg-white/[0.22] border border-[#f3e5d8]/50 hover:border-[#f3e5d8] transition-all cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight size={14} className="text-[#f3e5d8]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 6: CONTACT INFORMATION */}
        {step === 6 && (
          <form onSubmit={handleFinalSubmit} className="flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-[#d4af37]">
                <span>STEP 06 / 06</span>
                <span className="text-white/40">FINAL STEP</span>
              </div>
              <div className="w-full h-[1px] bg-white/[0.08]" />

              <label htmlFor="concierge-phone" className="block text-xl sm:text-2xl display-text text-white leading-snug">
                And where can our concierge <span className="italic text-[#f3e5d8]">reach you?</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#d4af37] font-medium text-sm">
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
                  className="w-full pl-14 pr-4 py-4 rounded-[2px] bg-black/40 border border-white/20 focus:border-[#d4af37] text-white placeholder-white/30 text-base outline-none transition-colors"
                />
              </div>

              <input
                id="concierge-email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address (Optional)"
                className="w-full px-4 py-3.5 rounded-[2px] bg-black/40 border border-white/10 focus:border-[#d4af37] text-white placeholder-white/30 text-xs sm:text-sm outline-none transition-colors"
              />

              {errorMsg && <p className="text-rose-400 text-xs">{errorMsg}</p>}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => changeStep(5)}
                className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-black bg-[#d4af37] hover:bg-[#e2c158] font-semibold transition-all cursor-pointer shadow-[0_4px_24px_rgba(212,175,55,0.4)] disabled:opacity-50"
              >
                <span>{isSubmitting ? "PLACING ON CALENDAR..." : "REQUEST A CALLBACK"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 7: FINAL CONCIERGE CONFIRMATION (Part 20) */}
        {step === 7 && (
          <div className="flex flex-col justify-between h-full py-4 text-center space-y-7">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mx-auto">
                <Sparkles size={24} />
              </div>

              <span className="text-[10px] tracking-[0.35em] uppercase text-[#d4af37] font-medium block">
                ROYAL DESK NOTIFIED
              </span>

              <h3 className="text-2xl sm:text-3xl display-text text-white leading-snug">
                Your celebration is now<br />
                <span className="italic text-[#f3e5d8]">on our calendar.</span>
              </h3>

              <p className="text-xs sm:text-sm font-light text-white/75 max-w-sm mx-auto leading-relaxed">
                One of our wedding specialists in Lucknow will be in touch shortly to present curated themes and preliminary estimates.
              </p>
            </div>

            {/* Direct Instant Next Actions */}
            <div className="space-y-3 pt-2 max-w-sm mx-auto w-full">
              {/* WhatsApp Concierge */}
              <a
                href={generateWhatsAppLink({
                  name,
                  service: selectedServices.join(", "),
                  date: weddingDate,
                  customMessage: `Hello Royal Weddinghub! I have just placed my celebration on your concierge calendar. Name: ${name}, Event: ${eventType}, Services: ${selectedServices.join(", ")}, Date: ${weddingDate}, Location: ${location}. Looking forward to discussing!`,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-[2px] text-xs font-semibold tracking-[0.2em] uppercase text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)]"
              >
                <MessageCircle size={15} />
                <span>WHATSAPP THE CONCIERGE</span>
              </a>

              {/* Call Now */}
              <a
                href={getTelUrl()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.18em] uppercase text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
              >
                <Phone size={13} className="text-[#f3e5d8]" />
                <span>CALL NOW: {BUSINESS_INFO.displayPhone}</span>
              </a>

              {/* Return Home */}
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors pt-2"
              >
                <Home size={12} />
                <span>RETURN HOME</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
