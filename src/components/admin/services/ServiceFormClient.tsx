'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Palette,
} from 'lucide-react';
import { saveServiceAction } from '@/app/admin/services/actions';

export interface ServiceFormData {
  id: string;
  name: string;
  slug: string;
  category_tag: string;
  headline: string;
  short_description: string;
  intro_copy: string;
  cover_image_url: string;
  accent_color: string;
  bg_surface: string;
  text_on_bg: string;
  cta_text: string;
  external_link?: string | null;
  is_featured: boolean;
  is_published: boolean;
  deliverables: Array<{ title: string; description: string }>;
  subcategories: Array<{ name: string; detail: string; tag?: string }>;
}

interface ServiceFormClientProps {
  initialData: ServiceFormData;
}

export function ServiceFormClient({ initialData }: ServiceFormClientProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(initialData.name);
  const [slug] = useState(initialData.slug);
  const [categoryTag, setCategoryTag] = useState(initialData.category_tag);
  const [headline, setHeadline] = useState(initialData.headline);
  const [shortDescription, setShortDescription] = useState(initialData.short_description);
  const [introCopy, setIntroCopy] = useState(initialData.intro_copy);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData.cover_image_url);
  const [accentColor, setAccentColor] = useState(initialData.accent_color || '#521D2B');
  const [bgSurface] = useState(initialData.bg_surface || '#FAF7F2');
  const [textOnBg] = useState(initialData.text_on_bg || '#211A19');
  const [ctaText, setCtaText] = useState(initialData.cta_text || 'Enquire Now');
  const [externalLink] = useState(initialData.external_link || '');
  const [isFeatured, setIsFeatured] = useState(initialData.is_featured);
  const [isPublished, setIsPublished] = useState(initialData.is_published);

  // Deliverables
  const [deliverables, setDeliverables] = useState(initialData.deliverables || []);
  const [newDelivTitle, setNewDelivTitle] = useState('');
  const [newDelivDesc, setNewDelivDesc] = useState('');

  // Subcategories
  const [subcategories, setSubcategories] = useState(initialData.subcategories || []);
  const [newSubName, setNewSubName] = useState('');
  const [newSubDetail, setNewSubDetail] = useState('');
  const [newSubTag, setNewSubTag] = useState('');

  const addDeliverable = () => {
    if (newDelivTitle.trim()) {
      setDeliverables([
        ...deliverables,
        { title: newDelivTitle.trim(), description: newDelivDesc.trim() },
      ]);
      setNewDelivTitle('');
      setNewDelivDesc('');
    }
  };

  const removeDeliverable = (idx: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== idx));
  };

  const addSubcategory = () => {
    if (newSubName.trim()) {
      setSubcategories([
        ...subcategories,
        {
          name: newSubName.trim(),
          detail: newSubDetail.trim(),
          tag: newSubTag.trim() || undefined,
        },
      ]);
      setNewSubName('');
      setNewSubDetail('');
      setNewSubTag('');
    }
  };

  const removeSubcategory = (idx: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('id', initialData.id);
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('category_tag', categoryTag);
    formData.append('headline', headline);
    formData.append('short_description', shortDescription);
    formData.append('intro_copy', introCopy);
    formData.append('cover_image_url', coverImageUrl);
    formData.append('accent_color', accentColor);
    formData.append('bg_surface', bgSurface);
    formData.append('text_on_bg', textOnBg);
    formData.append('cta_text', ctaText);
    if (externalLink) formData.append('external_link', externalLink);
    if (isFeatured) formData.append('is_featured', 'on');
    if (isPublished) formData.append('is_published', 'on');

    formData.append('deliverables', JSON.stringify(deliverables));
    formData.append('subcategories', JSON.stringify(subcategories));

    startTransition(async () => {
      const res = await saveServiceAction(formData);
      if (res.success) {
        setSuccessMsg('Service updated successfully! Public page and cache revalidated.');
      } else {
        setErrorMsg(res.error || 'Failed to update service.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE4D9]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C8070] mb-1 font-mono">
            <Link href="/admin/services" className="hover:text-[#521D2B] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Services</span>
            </Link>
            <span>/</span>
            <span className="text-[#85662F] font-medium">{name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#1C1611] font-normal tracking-tight">
            Edit Service: {name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={slug === 'wedding-venues' ? '/venues' : `/services/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#DDD5C7] text-xs font-medium text-[#5C5245] hover:text-[#1C1611] hover:border-[#1C1611] transition-all shadow-sm"
          >
            <span>Live Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#521D2B] text-white text-xs font-medium tracking-wide hover:bg-[#682637] transition-all shadow-[0_1px_2px_rgba(82,29,43,0.2)] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? 'Saving...' : 'Save Discipline'}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Copy, Deliverables & Subcategories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Core Service Copy */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-5 shadow-[0_1px_3px_rgba(28,22,17,0.03)]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#85662F] pb-3 border-b border-[#F2ECE1]">
              <Sparkles className="w-4 h-4" />
              <span>Service Discipline Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5245] mb-1.5 font-medium">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5245] mb-1.5 font-medium">
                  Category Tag
                </label>
                <input
                  type="text"
                  required
                  value={categoryTag}
                  onChange={(e) => setCategoryTag(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5245] mb-1.5 font-medium">
                  Editorial Headline
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1611] font-serif focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5245] mb-1.5 font-medium">
                  Short Summary
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl p-3.5 text-xs text-[#1C1611] leading-relaxed focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5245] mb-1.5 font-medium">
                  In-Depth Introduction Copy
                </label>
                <textarea
                  rows={4}
                  value={introCopy}
                  onChange={(e) => setIntroCopy(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl p-3.5 text-xs text-[#1C1611] leading-relaxed focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Deliverables Checklist */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-5 shadow-[0_1px_3px_rgba(28,22,17,0.03)]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#85662F] pb-3 border-b border-[#F2ECE1] justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Deliverables & Commitments ({deliverables.length})</span>
              </span>
            </div>

            <div className="space-y-3">
              {deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EAE4D9] flex items-start justify-between gap-3 group hover:border-[#DDD5C7] transition-all"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-[#1C1611]">{item.title}</div>
                    <div className="text-[11px] text-[#5C5245] font-light leading-relaxed">
                      {item.description}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDeliverable(idx)}
                    className="p-1.5 rounded-lg text-[#8C8070] hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                    title="Remove deliverable"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add deliverable */}
            <div className="pt-3 border-t border-[#F2ECE1] space-y-2.5">
              <div className="text-[11px] font-mono text-[#5C5245] font-medium uppercase tracking-wider">
                Add Deliverable
              </div>
              <input
                type="text"
                value={newDelivTitle}
                onChange={(e) => setNewDelivTitle(e.target.value)}
                placeholder="Deliverable Title (e.g. Cinematic 4K Teaser)..."
                className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
              />
              <textarea
                rows={2}
                value={newDelivDesc}
                onChange={(e) => setNewDelivDesc(e.target.value)}
                placeholder="Detailed description of what the couple receives..."
                className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl p-3 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
              />
              <button
                type="button"
                onClick={addDeliverable}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F5EE] border border-[#DDD5C7] text-xs font-medium text-[#1C1611] hover:bg-[#521D2B] hover:text-white hover:border-[#521D2B] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Deliverable</span>
              </button>
            </div>
          </div>

          {/* Card 3: Subcategories */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-5 shadow-[0_1px_3px_rgba(28,22,17,0.03)]">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#85662F] pb-3 border-b border-[#F2ECE1] justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Subcategories & Disciplines ({subcategories.length})</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subcategories.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EAE4D9] flex items-start justify-between gap-2 group hover:border-[#DDD5C7] transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#1C1611]">{sub.name}</span>
                      {sub.tag && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FDF9F0] text-[#705527] border border-[#E9DECA]">
                          {sub.tag}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#5C5245] mt-1 font-light leading-relaxed">
                      {sub.detail}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubcategory(idx)}
                    className="p-1 rounded text-[#8C8070] hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add subcategory */}
            <div className="pt-3 border-t border-[#F2ECE1] space-y-2.5">
              <div className="text-[11px] font-mono text-[#5C5245] font-medium uppercase tracking-wider">
                Add Subcategory
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="Subcategory Name..."
                  className="bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
                />
                <input
                  type="text"
                  value={newSubTag}
                  onChange={(e) => setNewSubTag(e.target.value)}
                  placeholder="Tag (e.g. Grand, Cinematic)..."
                  className="bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
                />
              </div>
              <textarea
                rows={2}
                value={newSubDetail}
                onChange={(e) => setNewSubDetail(e.target.value)}
                placeholder="Brief detail of this sub-discipline..."
                className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl p-2.5 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
              />
              <button
                type="button"
                onClick={addSubcategory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8F5EE] border border-[#DDD5C7] text-xs font-medium text-[#1C1611] hover:bg-[#521D2B] hover:text-white hover:border-[#521D2B] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Subcategory</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Cover image, Palettes, Publishing */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-4 shadow-[0_1px_3px_rgba(28,22,17,0.03)]">
            <div className="text-xs font-mono uppercase tracking-wider text-[#85662F] pb-3 border-b border-[#F2ECE1]">
              Publishing Controls
            </div>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EAE4D9] cursor-pointer hover:border-[#DDD5C7] transition-all">
              <div>
                <div className="text-xs font-medium text-[#1C1611]">Public Visibility</div>
                <div className="text-[11px] text-[#5C5245]">Live on /services directory</div>
              </div>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-5 h-5 rounded border-[#DDD5C7] text-[#521D2B] focus:ring-[#521D2B]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EAE4D9] cursor-pointer hover:border-[#DDD5C7] transition-all">
              <div>
                <div className="text-xs font-medium text-[#1C1611]">Featured on Homepage</div>
                <div className="text-[11px] text-[#5C5245]">Show in service highlights</div>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 rounded border-[#DDD5C7] text-[#521D2B] focus:ring-[#521D2B]"
              />
            </label>
          </div>

          {/* Cover image preview */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-4 shadow-[0_1px_3px_rgba(28,22,17,0.03)]">
            <div className="text-xs font-mono uppercase tracking-wider text-[#85662F] pb-3 border-b border-[#F2ECE1] flex items-center justify-between">
              <span>Cover Photo</span>
              <ImageIcon className="w-3.5 h-3.5" />
            </div>

            <div className="w-full h-44 rounded-xl bg-[#F8F5EE] border border-[#EAE4D9] overflow-hidden relative">
              {coverImageUrl ? (
                <Image
                  src={coverImageUrl}
                  alt={name || 'Service'}
                  fill
                  sizes="400px"
                  className="object-cover"
                  unoptimized={coverImageUrl.startsWith('http')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#8C8070]">
                  No cover photo set
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5245] mb-1">
                Image URL
              </label>
              <input
                type="text"
                required
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="/images/services/..."
                className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs text-[#1C1611] font-mono focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
              />
            </div>
          </div>

          {/* Styling Tokens */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-4 shadow-[0_1px_3px_rgba(28,22,17,0.03)]">
            <div className="text-xs font-mono uppercase tracking-wider text-[#85662F] pb-3 border-b border-[#F2ECE1] flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" />
              <span>Palette & Surface Tokens</span>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5245] mb-1">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-[#DDD5C7] bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1C1611] font-mono focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5C5245] mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Enquire Now"
                className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
