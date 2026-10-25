'use client';

import React, { useState, useTransition } from 'react';
import {
  Star,
  PlusCircle,
  ShieldCheck,
  Check,
  EyeOff,
  Trash2,
  Edit,
  X,
  AlertCircle,
  Lock,
} from 'lucide-react';
import {
  saveTestimonialAction,
  toggleTestimonialPublishAction,
  deleteTestimonialAction,
} from '@/app/admin/testimonials/actions';

export interface AdminTestimonial {
  id: string;
  couple_names: string;
  celebration_type: string;
  location: string;
  wedding_season: string | null;
  quote: string;
  full_story: string | null;
  rating: number;
  verified: boolean;
  featured: boolean;
  is_published: boolean;
  client_consent_recorded: boolean;
  source: string;
  created_at: string;
}

interface TestimonialsManagerClientProps {
  initialTestimonials: AdminTestimonial[];
}

export function TestimonialsManagerClient({ initialTestimonials }: TestimonialsManagerClientProps) {
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>(initialTestimonials);
  const [isPending, startTransition] = useTransition();

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminTestimonial | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [coupleNames, setCoupleNames] = useState('');
  const [celebrationType, setCelebrationType] = useState('Royal Heritage Wedding');
  const [location, setLocation] = useState('Lucknow');
  const [weddingSeason, setWeddingSeason] = useState('Winter 2025');
  const [quote, setQuote] = useState('');
  const [fullStory, setFullStory] = useState('');
  const [rating, setRating] = useState(5.0);
  const [verified, setVerified] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [clientConsentRecorded, setClientConsentRecorded] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const openCreateModal = () => {
    setEditingItem(null);
    setCoupleNames('');
    setCelebrationType('Royal Heritage Wedding');
    setLocation('Lucknow');
    setWeddingSeason('Winter 2025');
    setQuote('');
    setFullStory('');
    setRating(5.0);
    setVerified(true);
    setFeatured(false);
    setClientConsentRecorded(false);
    setIsPublished(false);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: AdminTestimonial) => {
    setEditingItem(item);
    setCoupleNames(item.couple_names);
    setCelebrationType(item.celebration_type);
    setLocation(item.location);
    setWeddingSeason(item.wedding_season || 'Winter');
    setQuote(item.quote);
    setFullStory(item.full_story || '');
    setRating(item.rating);
    setVerified(item.verified);
    setFeatured(item.featured);
    setClientConsentRecorded(item.client_consent_recorded);
    setIsPublished(item.is_published);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleTogglePublish = (item: AdminTestimonial) => {
    if (!item.is_published && !item.client_consent_recorded) {
      alert('Cannot publish review: Client consent has not been recorded for this testimonial.');
      return;
    }

    const nextState = !item.is_published;
    setTestimonials((prev) =>
      prev.map((t) => (t.id === item.id ? { ...t, is_published: nextState } : t))
    );

    startTransition(async () => {
      const res = await toggleTestimonialPublishAction(item.id, nextState);
      if (!res.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, is_published: item.is_published } : t))
        );
        alert(res.error || 'Failed to update visibility.');
      }
    });
  };

  const handleDelete = (item: AdminTestimonial) => {
    if (confirm(`Delete testimonial for ${item.couple_names}?`)) {
      setTestimonials((prev) => prev.filter((t) => t.id !== item.id));

      startTransition(async () => {
        const res = await deleteTestimonialAction(item.id);
        if (!res.success) {
          alert(`Error deleting testimonial: ${res.error}`);
        }
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isPublished && !clientConsentRecorded) {
      setErrorMsg('Mandatory Consent Error: You must verify client consent before publishing.');
      return;
    }

    const formData = new FormData();
    if (editingItem) formData.append('id', editingItem.id);
    formData.append('couple_names', coupleNames);
    formData.append('celebration_type', celebrationType);
    formData.append('location', location);
    formData.append('wedding_season', weddingSeason);
    formData.append('quote', quote);
    formData.append('full_story', fullStory);
    formData.append('rating', String(rating));
    if (verified) formData.append('verified', 'on');
    if (featured) formData.append('featured', 'on');
    if (clientConsentRecorded) formData.append('client_consent_recorded', 'on');
    if (isPublished) formData.append('is_published', 'on');

    startTransition(async () => {
      const res = await saveTestimonialAction(formData);
      if (res.success) {
        setIsModalOpen(false);
        // Refresh local list or reload
        window.location.reload();
      } else {
        setErrorMsg(res.error || 'Failed to save testimonial.');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Client Discretion Policy */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#181310]/85 backdrop-blur-xl border border-[#D6B56D]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#D6B56D]/10 border border-[#D6B56D]/25 text-[#D6B56D] shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-serif text-[#FAF7F2] tracking-wide font-normal">
              Client Confidentiality & Discretion Policy
            </h3>
            <p className="text-xs text-[#B8ADA3] mt-1 font-light leading-relaxed max-w-xl">
              To strictly protect High-Net-Worth families in Lucknow, fabricated or unverified reviews are prohibited. A review can only be set to <span className="text-[#D6B56D] font-medium">Live</span> once explicit client consent is recorded.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D6B56D] to-[#C29D53] text-[#0F0C0A] text-xs font-semibold tracking-wide hover:brightness-110 transition-all shadow-[0_0_20px_rgba(214,181,109,0.2)] self-start sm:self-auto shrink-0 font-sans"
        >
          <PlusCircle className="w-4 h-4" strokeWidth={1.5} />
          <span>Record Client Review</span>
        </button>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {testimonials.length > 0 ? (
          testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#181310]/85 backdrop-blur-xl border border-[#D6B56D]/15 p-6 flex flex-col justify-between shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:border-[#D6B56D]/40 transition-all duration-300 group hover:shadow-[0_16px_40px_rgba(214,181,109,0.06)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#D6B56D]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.client_consent_recorded ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Consent Recorded</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/40 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Consent Pending</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3.5">
                  <h4 className="text-base font-serif text-[#FAF7F2] font-normal tracking-wide">
                    {item.couple_names}
                  </h4>
                  <div className="text-xs text-[#B8ADA3] mt-0.5 font-light">
                    {item.celebration_type} • {item.location} ({item.wedding_season || 'Winter'})
                  </div>
                </div>

                <blockquote className="mt-3.5 text-xs text-[#FAF7F2]/90 italic font-light leading-relaxed border-l-2 border-[#D6B56D]/60 bg-[#0F0C0A]/60 p-3 rounded-r-xl border-y border-r border-[#D6B56D]/10">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-[#D6B56D]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(item)}
                  disabled={isPending}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
                    item.is_published
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/50'
                      : 'bg-[#0F0C0A]/80 text-[#B8ADA3]/60 border-[#D6B56D]/15 hover:text-[#FAF7F2] hover:border-[#D6B56D]/30'
                  }`}
                >
                  {item.is_published ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Live on /about</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 text-[#B8ADA3]/60" />
                      <span>Draft</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-xl text-[#B8ADA3] hover:text-[#D6B56D] hover:bg-[#D6B56D]/10 border border-transparent hover:border-[#D6B56D]/20 transition-all"
                    title="Edit Review"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-xl text-[#B8ADA3]/60 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center rounded-2xl bg-[#181310]/85 backdrop-blur-xl border border-[#D6B56D]/15 p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#D6B56D]/10 border border-[#D6B56D]/30 text-[#D6B56D] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h4 className="text-base font-serif text-[#FAF7F2] tracking-wide font-normal">Private Discretion Card Enforced</h4>
            <p className="text-xs text-[#B8ADA3] max-w-md mx-auto mt-1.5 leading-relaxed font-light">
              Zero client reviews are published publicly by design. You can record client feedback here for internal records, or publish verified reviews once written consent is documented.
            </p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#181310] border border-[#D6B56D]/30 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.8)] relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#D6B56D]/15">
              <h3 className="text-base font-serif text-[#FAF7F2] tracking-wide font-normal">
                {editingItem ? 'Edit Client Review' : 'Record Verified Client Review'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-[#D6B56D]/10 transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#D6B56D] mb-1 font-medium">
                  Couple Names *
                </label>
                <input
                  type="text"
                  required
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  placeholder="e.g. Radhika & Vikramaditya"
                  className="w-full bg-[#0F0C0A] border border-[#D6B56D]/20 rounded-xl px-3.5 py-2 text-xs text-[#FAF7F2] placeholder-[#B8ADA3]/40 focus:outline-none focus:border-[#D6B56D] focus:ring-1 focus:ring-[#D6B56D]/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#D6B56D] mb-1 font-medium">
                    Celebration Type
                  </label>
                  <input
                    type="text"
                    value={celebrationType}
                    onChange={(e) => setCelebrationType(e.target.value)}
                    placeholder="Palace Wedding"
                    className="w-full bg-[#0F0C0A] border border-[#D6B56D]/20 rounded-xl px-3 py-2 text-xs text-[#FAF7F2] placeholder-[#B8ADA3]/40 focus:outline-none focus:border-[#D6B56D] focus:ring-1 focus:ring-[#D6B56D]/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#D6B56D] mb-1 font-medium">
                    Location & Season
                  </label>
                  <input
                    type="text"
                    value={weddingSeason}
                    onChange={(e) => setWeddingSeason(e.target.value)}
                    placeholder="Winter 2025"
                    className="w-full bg-[#0F0C0A] border border-[#D6B56D]/20 rounded-xl px-3 py-2 text-xs text-[#FAF7F2] placeholder-[#B8ADA3]/40 focus:outline-none focus:border-[#D6B56D] focus:ring-1 focus:ring-[#D6B56D]/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#D6B56D] mb-1 font-medium">
                  Testimonial Quote *
                </label>
                <textarea
                  rows={3}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Their words describing the experience..."
                  className="w-full bg-[#0F0C0A] border border-[#D6B56D]/20 rounded-xl p-3 text-xs text-[#FAF7F2] placeholder-[#B8ADA3]/40 leading-relaxed focus:outline-none focus:border-[#D6B56D] focus:ring-1 focus:ring-[#D6B56D]/30 transition-all"
                />
              </div>

              {/* Mandatory Consent Checkbox */}
              <div className="p-3.5 rounded-xl bg-[#0F0C0A]/60 border border-[#D6B56D]/20 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clientConsentRecorded}
                    onChange={(e) => setClientConsentRecorded(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D6B56D]/30 bg-[#181310] text-[#D6B56D] focus:ring-[#D6B56D] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-medium text-[#FAF7F2] block">
                      Recorded Client Consent Verified *
                    </span>
                    <span className="text-[11px] text-[#B8ADA3] font-light leading-relaxed block mt-0.5">
                      I confirm that the client has given explicit permission to showcase their celebration feedback publicly.
                    </span>
                  </div>
                </label>
              </div>

              {/* Publish Toggle */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#0F0C0A]/60 border border-[#D6B56D]/15 cursor-pointer hover:border-[#D6B56D]/30 transition-all">
                <div>
                  <div className="text-xs font-medium text-[#FAF7F2]">Public Visibility</div>
                  <div className="text-[11px] text-[#B8ADA3]/70">Show on /about testimonials</div>
                </div>
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  disabled={!clientConsentRecorded}
                  className="w-4 h-4 rounded border-[#D6B56D]/30 bg-[#181310] text-[#D6B56D] focus:ring-[#D6B56D] disabled:opacity-30"
                />
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D6B56D]/15">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-[#D6B56D]/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6B56D] to-[#C29D53] text-[#0F0C0A] text-xs font-semibold hover:brightness-110 transition-all shadow-sm disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
