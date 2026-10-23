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
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#171410] via-[#12100d] to-[#0d0c0a] border border-[#2b241b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#221c16] text-[#c5a880] shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-serif text-[#faf6f0] font-normal tracking-wide">
              Client Confidentiality & Discretion Policy
            </h3>
            <p className="text-xs text-[#8a7f70] mt-0.5 font-light leading-relaxed max-w-xl">
              To strictly protect High-Net-Worth families in Lucknow, fabricated or unverified reviews are prohibited. A review can only be set to <span className="text-[#c5a880]">Live</span> once explicit client consent is recorded.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c5a880] text-[#12100d] text-xs font-medium tracking-wide hover:bg-[#dfc9a5] transition-colors shadow-sm self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Client Review</span>
        </button>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {testimonials.length > 0 ? (
          testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#12100d] border border-[#241f18] p-6 flex flex-col justify-between hover:border-[#c5a880]/40 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.client_consent_recorded ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Consent Recorded</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Consent Pending</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="text-base font-serif text-[#faf6f0] font-normal">
                    {item.couple_names}
                  </h4>
                  <div className="text-xs text-[#8a7f70] mt-0.5">
                    {item.celebration_type} • {item.location} ({item.wedding_season || 'Winter'})
                  </div>
                </div>

                <blockquote className="mt-3 text-xs text-[#d6ccc0] italic font-light leading-relaxed border-l-2 border-[#c5a880]/30 pl-3 py-0.5">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-[#1e1913] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(item)}
                  disabled={isPending}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
                    item.is_published
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                      : 'bg-[#1e1914] text-[#7d7263] border-[#2e261d]'
                  }`}
                >
                  {item.is_published ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Live on /about</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 text-[#7d7263]" />
                      <span>Draft</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-xl text-[#8a7f70] hover:text-[#f5f0eb] hover:bg-[#1a1713] transition-colors"
                    title="Edit Review"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-xl text-[#8a7f70] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center rounded-2xl bg-[#12100d] border border-[#241f18] p-8">
            <div className="w-12 h-12 rounded-2xl bg-[#1a1612] text-[#c5a880] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-serif text-[#faf6f0]">Private Discretion Card Enforced</h4>
            <p className="text-xs text-[#8a7f70] max-w-md mx-auto mt-1.5 leading-relaxed font-light">
              Zero client reviews are published publicly by design. You can record client feedback here for internal records, or publish verified reviews once written consent is documented.
            </p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#12100d] border border-[#2e261d] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#211b15]">
              <h3 className="text-base font-serif text-[#faf6f0]">
                {editingItem ? 'Edit Client Review' : 'Record Verified Client Review'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-[#8a7f70] hover:text-[#f5f0eb]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#998c7b] mb-1 font-medium">
                  Couple Names *
                </label>
                <input
                  type="text"
                  required
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  placeholder="e.g. Radhika & Vikramaditya"
                  className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3.5 py-2 text-xs text-[#f5f0eb] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#998c7b] mb-1 font-medium">
                    Celebration Type
                  </label>
                  <input
                    type="text"
                    value={celebrationType}
                    onChange={(e) => setCelebrationType(e.target.value)}
                    placeholder="Palace Wedding"
                    className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3 py-2 text-xs text-[#f5f0eb] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#998c7b] mb-1 font-medium">
                    Location & Season
                  </label>
                  <input
                    type="text"
                    value={weddingSeason}
                    onChange={(e) => setWeddingSeason(e.target.value)}
                    placeholder="Winter 2025"
                    className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3 py-2 text-xs text-[#f5f0eb] focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#998c7b] mb-1 font-medium">
                  Testimonial Quote *
                </label>
                <textarea
                  rows={3}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Their words describing the experience..."
                  className="w-full bg-[#171410] border border-[#2e261d] rounded-xl p-3 text-xs text-[#f5f0eb] leading-relaxed focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              {/* Mandatory Consent Checkbox */}
              <div className="p-3.5 rounded-xl bg-[#1b1712] border border-[#382f23] space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clientConsentRecorded}
                    onChange={(e) => setClientConsentRecorded(e.target.checked)}
                    className="w-4 h-4 rounded border-[#382f23] bg-[#12100d] text-[#c5a880] focus:ring-[#c5a880] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-medium text-[#f5f0eb] block">
                      Recorded Client Consent Verified *
                    </span>
                    <span className="text-[11px] text-[#8a7f70] font-light leading-relaxed block mt-0.5">
                      I confirm that the client has given explicit permission to showcase their celebration feedback publicly.
                    </span>
                  </div>
                </label>
              </div>

              {/* Publish Toggle */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#171410] border border-[#2e261d] cursor-pointer">
                <div>
                  <div className="text-xs font-medium text-[#f5f0eb]">Public Visibility</div>
                  <div className="text-[11px] text-[#73685a]">Show on /about testimonials</div>
                </div>
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  disabled={!clientConsentRecorded}
                  className="w-4 h-4 rounded border-[#382f23] bg-[#12100d] text-[#c5a880] focus:ring-[#c5a880] disabled:opacity-30"
                />
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#211b15]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#a39686] hover:bg-[#1e1914]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-xl bg-[#c5a880] text-[#12100d] text-xs font-medium hover:bg-[#dfc9a5] shadow-sm disabled:opacity-50"
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
