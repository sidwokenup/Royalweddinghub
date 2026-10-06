"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Check, Phone, MessageCircle, Sparkles, User, Calendar, Users } from "lucide-react";
import { saveUserPreferences, getUserPreferences } from "@/lib/storage";
import { captureCampaignParams, CampaignParams } from "@/lib/campaign";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";

const SERVICE_OPTIONS = [
  "Complete Wedding Planning",
  "Royal Venue Selection",
  "Photography & Cinema",
  "Royal Catering & Banquets",
  "Celebrity Singer / Live Band",
  "Sufi & Traditional Artists",
  "Entertainment & Decor",
  "Other Bespoke Service",
];

const GUEST_COUNT_OPTIONS = [
  "Intimate (< 200 Guests)",
  "Grand (200 – 500 Guests)",
  "Royal (500 – 1,000 Guests)",
  "Mega Celebration (1,000+ Guests)",
];

export function QuickLeadForm() {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("Complete Wedding Planning");
  const [weddingDate, setWeddingDate] = useState<string>("");
  const [guestCount, setGuestCount] = useState<string>("Grand (200 – 500 Guests)");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [campaign, setCampaign] = useState<CampaignParams>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    // Capture UTM attribution upon landing
    const utms = captureCampaignParams();
    setCampaign(utms);

    // Pre-fill name if user previously submitted
    const saved = getUserPreferences();
    if (saved.name) {
      setName(saved.name);
    }
    if (saved.phone) {
      setPhone(saved.phone);
    }

    // Listen for custom service selection from ServicesPreview
    const handleServiceSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ service: string }>;
      if (customEvent.detail?.service) {
        setSelectedService(customEvent.detail.service);
        // Jump directly to step 2 or 3
        setStep(2);
      }
    };

    window.addEventListener("select_wedding_service", handleServiceSelect);
    return () => {
      window.removeEventListener("select_wedding_service", handleServiceSelect);
    };
  }, []);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter your name to continue");
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  const handleNextStep3 = () => {
    setStep(4);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile phone number");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    // Persist explicitly provided user preference for convenience
    saveUserPreferences({
      name: name.trim(),
      phone: cleanPhone,
      lastService: selectedService,
    });

    // In a production backend, this is where the lead API call happens.
    // Here we record it client-side with full UTM attribution
    const leadPayload = {
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim(),
      service: selectedService,
      weddingDate,
      guestCount,
      campaign,
      submittedAt: new Date().toISOString(),
    };
    console.info("Lead generated:", leadPayload);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section id="plan-wedding" className="relative w-full py-20 sm:py-32 px-4 sm:px-6 md:px-8 bg-[#0a0705] text-white border-t border-[#f3e5d8]/10">
      <div className="max-w-3xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#d4af37] font-medium block mb-3">
            ROYAL CONCIERGE DESK
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl display-text font-normal text-white leading-tight mb-3">
            Plan Your Dream Wedding
          </h2>
          <p className="text-xs sm:text-sm md:text-base font-light text-[#faf9f6]/70 leading-relaxed max-w-lg mx-auto">
            Answer 3 quick questions. Our founder and lead planner in Lucknow will prepare a personalized vision &amp; budget consultation.
          </p>
        </div>

        {/* Multi-Step Card */}
        <div className="relative rounded-[2px] bg-white/[0.03] border border-[#f3e5d8]/25 p-6 sm:p-10 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          {!isSubmitted ? (
            <div>
              {/* Progress Bar & Step Counter */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#d4af37] font-medium">
                    Step {step} of 4
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-[11px] sm:text-xs font-light text-white/70">
                    {step === 1 && "Your Name"}
                    {step === 2 && "Service Selection"}
                    {step === 3 && "Date & Guest Count"}
                    {step === 4 && "Contact Number"}
                  </span>
                </div>

                {/* Micro step indicators */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        s === step
                          ? "w-6 bg-[#d4af37]"
                          : s < step
                          ? "w-3 bg-[#f3e5d8]/60"
                          : "w-3 bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: Name */}
              {step === 1 && (
                <form onSubmit={handleNextStep1} className="space-y-6">
                  <div>
                    <label htmlFor="lead-name" className="block text-sm sm:text-base font-normal display-text text-white mb-2">
                      Let&apos;s plan something unforgettable. What is your name?
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#f3e5d8]/60">
                        <User size={18} />
                      </div>
                      <input
                        id="lead-name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Siddhant Verma"
                        className="w-full pl-12 pr-4 py-4 rounded-[2px] bg-black/40 border border-white/20 focus:border-[#f3e5d8] focus:ring-1 focus:ring-[#f3e5d8] text-white placeholder-white/30 text-sm sm:text-base outline-none transition-all"
                      />
                    </div>
                    {errorMsg && <p className="text-rose-400 text-xs mt-2">{errorMsg}</p>}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.2em] uppercase text-white bg-white/[0.12] hover:bg-white/[0.22] border border-[#f3e5d8]/50 hover:border-[#f3e5d8] transition-all cursor-pointer"
                    >
                      <span>CONTINUE</span>
                      <ArrowRight size={14} className="text-[#f3e5d8]" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Service Selection */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm sm:text-base font-normal display-text text-white mb-1">
                      What can we curate for you, {name || "there"}?
                    </h3>
                    <p className="text-xs text-white/60 mb-5">
                      Select the primary service you are looking for in Lucknow:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {SERVICE_OPTIONS.map((srv) => (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => setSelectedService(srv)}
                          className={`flex items-center justify-between p-3.5 rounded-[2px] text-left text-xs sm:text-sm transition-all cursor-pointer border ${
                            selectedService === srv
                              ? "bg-[#d4af37]/15 border-[#d4af37] text-white"
                              : "bg-black/30 border-white/10 hover:border-white/30 text-white/80"
                          }`}
                        >
                          <span>{srv}</span>
                          {selectedService === srv && (
                            <Check size={14} className="text-[#d4af37] shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs uppercase tracking-[0.18em] text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep2}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.2em] uppercase text-white bg-white/[0.12] hover:bg-white/[0.22] border border-[#f3e5d8]/50 hover:border-[#f3e5d8] transition-all cursor-pointer"
                    >
                      <span>CONTINUE</span>
                      <ArrowRight size={14} className="text-[#f3e5d8]" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Date & Guests */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="lead-date" className="block text-sm sm:text-base font-normal display-text text-white mb-2">
                      When is your celebration?
                    </label>
                    <div className="relative mb-6">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#f3e5d8]/60">
                        <Calendar size={18} />
                      </div>
                      <input
                        id="lead-date"
                        type="text"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        placeholder="e.g. November 2025 / Winter Season"
                        className="w-full pl-12 pr-4 py-3.5 rounded-[2px] bg-black/40 border border-white/20 focus:border-[#f3e5d8] focus:ring-1 focus:ring-[#f3e5d8] text-white placeholder-white/30 text-sm outline-none transition-all"
                      />
                    </div>

                    <label className="block text-sm sm:text-base font-normal display-text text-white mb-2">
                      Approximate Guest Count (Optional):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {GUEST_COUNT_OPTIONS.map((gc) => (
                        <button
                          key={gc}
                          type="button"
                          onClick={() => setGuestCount(gc)}
                          className={`flex items-center justify-between p-3 rounded-[2px] text-left text-xs transition-all cursor-pointer border ${
                            guestCount === gc
                              ? "bg-[#d4af37]/15 border-[#d4af37] text-white"
                              : "bg-black/30 border-white/10 hover:border-white/30 text-white/80"
                          }`}
                        >
                          <span>{gc}</span>
                          {guestCount === gc && <Check size={14} className="text-[#d4af37]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs uppercase tracking-[0.18em] text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep3}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.2em] uppercase text-white bg-white/[0.12] hover:bg-white/[0.22] border border-[#f3e5d8]/50 hover:border-[#f3e5d8] transition-all cursor-pointer"
                    >
                      <span>CONTINUE</span>
                      <ArrowRight size={14} className="text-[#f3e5d8]" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Phone & Callback Submission */}
              {step === 4 && (
                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="lead-phone" className="block text-sm sm:text-base font-normal display-text text-white mb-2">
                      Where can our wedding planner reach you, {name}?
                    </label>
                    <p className="text-xs text-white/60 mb-4">
                      We will connect directly via WhatsApp or phone call to discuss venues &amp; planning.
                    </p>

                    <div className="relative mb-4">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#d4af37] font-medium text-sm">
                        +91
                      </div>
                      <input
                        id="lead-phone"
                        type="tel"
                        name="tel"
                        autoComplete="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9170701546"
                        className="w-full pl-14 pr-4 py-4 rounded-[2px] bg-black/40 border border-white/20 focus:border-[#f3e5d8] focus:ring-1 focus:ring-[#f3e5d8] text-white placeholder-white/30 text-sm sm:text-base outline-none transition-all"
                      />
                    </div>

                    <div className="relative">
                      <input
                        id="lead-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address (Optional)"
                        className="w-full px-4 py-3 rounded-[2px] bg-black/40 border border-white/10 focus:border-[#f3e5d8] text-white placeholder-white/30 text-xs sm:text-sm outline-none transition-all"
                      />
                    </div>

                    {errorMsg && <p className="text-rose-400 text-xs mt-2">{errorMsg}</p>}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs uppercase tracking-[0.18em] text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2.5 px-9 py-4 rounded-[2px] text-xs font-medium tracking-[0.22em] uppercase text-white bg-[#d4af37]/90 hover:bg-[#d4af37] text-black font-semibold transition-all cursor-pointer shadow-[0_4px_24px_rgba(212,175,55,0.4)] disabled:opacity-50"
                    >
                      <span>{isSubmitting ? "SECURING CONSULTATION..." : "GET A CALLBACK"}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* SUCCESS STATE */
            <div className="text-center py-6 sm:py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mx-auto">
                <Sparkles size={28} />
              </div>

              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#d4af37] font-medium block mb-2">
                  CONSULTATION CONFIRMED
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl display-text text-white mb-3">
                  You&apos;re All Set, {name}!
                </h3>
                <p className="text-xs sm:text-sm font-light text-white/80 max-w-md mx-auto leading-relaxed">
                  Our wedding concierge has received your request for <strong>{selectedService}</strong>. We will call you at <strong>+91 {phone}</strong> shortly.
                </p>
              </div>

              {/* Instant WhatsApp Action to skip the wait */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
                <a
                  href={generateWhatsAppLink({
                    name,
                    service: selectedService,
                    date: weddingDate,
                    customMessage: `Hello Royal Weddinghub! I just submitted an inquiry on your website for ${selectedService}. My name is ${name}. I look forward to connecting!`,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-[2px] text-xs font-medium tracking-[0.2em] uppercase text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-[0_4px_20px_rgba(37,211,102,0.3)]"
                >
                  <MessageCircle size={15} />
                  <span>CHAT ON WHATSAPP NOW</span>
                </a>

                <a
                  href={getTelUrl()}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[2px] text-xs font-medium tracking-[0.18em] uppercase text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                >
                  <Phone size={13} className="text-[#f3e5d8]" />
                  <span>OR CALL DIRECTLY</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
