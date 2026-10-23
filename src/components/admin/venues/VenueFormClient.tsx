'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Building2,
  Users,
  Utensils,
  Sparkles,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  ExternalLink,
  Wand2,
} from 'lucide-react';
import { saveVenueAction } from '@/app/admin/venues/actions';

export interface VenueFormData {
  id?: string;
  name: string;
  slug: string;
  category: string;
  city: string;
  state: string;
  address: string;
  rating: number | null;
  review_count: number | null;
  min_pax: number | null;
  max_pax: number | null;
  total_capacity: number | null;
  rooms: number | null;
  raw_capacity: string | null;
  price_per_plate: number | null;
  price_unit: string;
  veg_available: boolean;
  non_veg_available: boolean;
  amenities: string[];
  description: string | null;
  primary_image_url: string;
  primary_image_alt: string;
  is_featured: boolean;
  is_published: boolean;
  gallery: Array<{ url: string; alt_text?: string; is_cover?: boolean }>;
}

const COMMON_AMENITIES = [
  'Valet Parking',
  'Bridal Dressing Suite',
  'Open Lawn Area',
  'Centrally Air-Conditioned',
  'Guest Rooms Available',
  'In-House Catering Available',
  'DJ & Music Permitted',
  'Liquor License / Alcohol Allowed',
  'Overnight Wedding Permitted',
  'Poolside Deck',
  'Power Backup Generators',
  'Bespoke Mandap Setup',
  'Parking for 200+ Cars',
];

const CATEGORIES = [
  'Palace Lawns',
  'Banquet Halls',
  'Luxury Resorts',
  'Heritage Estates',
  'Boutique Wedding Hotels',
  'Marriage Lawns',
  'Farmhouses & Villas',
];

interface VenueFormClientProps {
  initialData?: Partial<VenueFormData>;
  isNew?: boolean;
}

export function VenueFormClient({ initialData, isNew = false }: VenueFormClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category || 'Palace Lawns');
  const [city, setCity] = useState(initialData?.city || 'Lucknow');
  const [state, setState] = useState(initialData?.state || 'Uttar Pradesh');
  const [address, setAddress] = useState(initialData?.address || '');
  const [rating, setRating] = useState<number | string>(initialData?.rating ?? 4.8);
  const [reviewCount, setReviewCount] = useState<number | string>(initialData?.review_count ?? 95);

  const [minPax, setMinPax] = useState<number | string>(initialData?.min_pax ?? '');
  const [maxPax, setMaxPax] = useState<number | string>(initialData?.max_pax ?? '');
  const [totalCapacity, setTotalCapacity] = useState<number | string>(initialData?.total_capacity ?? '');
  const [rooms, setRooms] = useState<number | string>(initialData?.rooms ?? '');
  const [rawCapacity, setRawCapacity] = useState(initialData?.raw_capacity || '');

  const [pricePerPlate, setPricePerPlate] = useState<number | string>(initialData?.price_per_plate ?? '');
  const [priceUnit, setPriceUnit] = useState(initialData?.price_unit || 'per_plate');
  const [vegAvailable, setVegAvailable] = useState(initialData?.veg_available ?? true);
  const [nonVegAvailable, setNonVegAvailable] = useState(initialData?.non_veg_available ?? true);

  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || []);
  const [newAmenity, setNewAmenity] = useState('');

  const [description, setDescription] = useState(initialData?.description || '');
  const [primaryImageUrl, setPrimaryImageUrl] = useState(
    initialData?.primary_image_url || '/venues/santorini-resort-lucknow/thumbnail.jpg'
  );
  const [primaryImageAlt, setPrimaryImageAlt] = useState(initialData?.primary_image_alt || '');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured ?? false);
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? true);

  const [gallery, setGallery] = useState<Array<{ url: string; alt_text?: string }>>(
    initialData?.gallery || []
  );
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Auto-generate slug from name
  const handleAutoSlug = () => {
    if (!name) return;
    const generated = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(generated);
  };

  // Toggle amenity selection
  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const addGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGallery([...gallery, { url: newGalleryUrl.trim(), alt_text: `${name} gallery photo` }]);
      setNewGalleryUrl('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    if (initialData?.id && !isNew) {
      formData.append('id', initialData.id);
    }
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('category', category);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('address', address);
    if (rating !== '') formData.append('rating', String(rating));
    if (reviewCount !== '') formData.append('review_count', String(reviewCount));

    if (minPax !== '') formData.append('min_pax', String(minPax));
    if (maxPax !== '') formData.append('max_pax', String(maxPax));
    if (totalCapacity !== '') formData.append('total_capacity', String(totalCapacity));
    if (rooms !== '') formData.append('rooms', String(rooms));
    if (rawCapacity) formData.append('raw_capacity', rawCapacity);

    if (pricePerPlate !== '') formData.append('price_per_plate', String(pricePerPlate));
    formData.append('price_unit', priceUnit);
    if (vegAvailable) formData.append('veg_available', 'on');
    if (nonVegAvailable) formData.append('non_veg_available', 'on');

    formData.append('amenities', JSON.stringify(amenities));
    if (description) formData.append('description', description);
    formData.append('primary_image_url', primaryImageUrl);
    formData.append('primary_image_alt', primaryImageAlt || `${name} - Luxury Wedding Venue`);

    if (isFeatured) formData.append('is_featured', 'on');
    if (isPublished) formData.append('is_published', 'on');

    formData.append('gallery', JSON.stringify(gallery));

    startTransition(async () => {
      const res = await saveVenueAction(formData);
      if (res.success) {
        setSuccessMsg('Venue changes saved successfully! Public pages updated.');
        if (isNew && res.id) {
          router.push(`/admin/venues/${res.id}`);
        }
      } else {
        setErrorMsg(res.error || 'Failed to save venue.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#241f18]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8a7f70] mb-1 font-mono">
            <Link href="/admin/venues" className="hover:text-[#c5a880] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Venues</span>
            </Link>
            <span>/</span>
            <span className="text-[#c5a880]">{isNew ? 'New Venue' : name}</span>
          </div>
          <h1 className="text-2xl font-serif text-[#faf6f0] font-normal tracking-wide">
            {isNew ? 'Create New Wedding Venue' : `Edit: ${name}`}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && slug && (
            <Link
              href={`/venues/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#171410] border border-[#2b241b] text-xs font-medium text-[#c5a880] hover:text-white hover:bg-[#1f1a14] transition-all"
            >
              <span>Live Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c5a880] text-[#12100d] text-xs font-medium tracking-wide hover:bg-[#dfc9a5] transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? 'Saving...' : 'Save Venue'}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2.5">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Info & Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Core Details */}
          <div className="rounded-2xl bg-[#12100d] border border-[#241f18] p-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#c5a880] uppercase tracking-wider pb-3 border-b border-[#1f1a14]">
              <Building2 className="w-4 h-4" />
              <span>Core Venue Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[#998c7b] mb-1.5 font-medium">
                  Property Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vivanta Luxury Palace"
                  className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3.5 py-2.5 text-xs text-[#f5f0eb] focus:outline-none focus:border-[#c5a880] transition-all"
                />
              </div>

              {/* Slug with generator */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#998c7b] font-medium">
                    URL Slug *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="inline-flex items-center gap-1 text-[11px] text-[#c5a880] hover:underline"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Generate from Name</span>
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-[#171410] border border-r-0 border-[#2e261d] rounded-l-xl text-xs text-[#73685a] font-mono">
                    /venues/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="vivanta-luxury-palace"
                    className="w-full bg-[#171410] border border-[#2e261d] rounded-r-xl px-3.5 py-2.5 text-xs text-[#f5f0eb] font-mono focus:outline-none focus:border-[#c5a880] transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#998c7b] mb-1.5 font-medium">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3.5 py-2.5 text-xs text-[#f5f0eb] focus:outline-none focus:border-[#c5a880] transition-all cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#171410] text-[#f5f0eb]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#998c7b] mb-1.5 font-medium">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3.5 py-2.5 text-xs text-[#f5f0eb] focus:outline-none focus:border-[#c5a880] transition-all"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[#998c7b] mb-1.5 font-medium">
                  Full Address & Neighborhood
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. VIP Road, Gomti Nagar Extension, Lucknow"
                  className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3.5 py-2.5 text-xs text-[#f5f0eb] focus:outline-none focus:border-[#c5a880] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Capacity & Room Inventory */}
          <div className="rounded-2xl bg-[#12100d] border border-[#241f18] p-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#c5a880] uppercase tracking-wider pb-3 border-b border-[#1f1a14]">
              <Users className="w-4 h-4" />
              <span>Capacity, Pax & Guest Rooms</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#998c7b] mb-1">
                  Min Guests
                </label>
                <input
                  type="number"
                  value={minPax}
                  onChange={(e) => setMinPax(e.target.value)}
                  placeholder="200"
                  className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3 py-2 text-xs text-[#f5f0eb] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#998c7b] mb-1">
                  Max Guests
                </label>
                <input
                  type="number"
                  value={maxPax}
                  onChange={(e) => setMaxPax(e.target.value)}
                  placeholder="1500"
                  className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3 py-2 text-xs text-[#f5f0eb] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#998c7b] mb-1">
                  Total Capacity
                </label>
                <input
                  type="number"
                  value={totalCapacity}
                  onChange={(e) => setTotalCapacity(e.target.value)}
                  placeholder="2000"
                  className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3 py-2 text-xs text-[#f5f0eb] focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#998c7b] mb-1">
                  Guest Rooms
                </label>
                <input
                  type="number"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="15"
                  className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3 py-2 text-xs text-[#f5f0eb] focus:outline-none focus:border-[#c5a880]"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Food & Pricing */}
          <div className="rounded-2xl bg-[#12100d] border border-[#241f18] p-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#c5a880] uppercase tracking-wider pb-3 border-b border-[#1f1a14]">
              <Utensils className="w-4 h-4" />
              <span>Dining & Food Pricing</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#998c7b] mb-1.5 font-medium">
                  Price per Plate (₹)
                </label>
                <input
                  type="number"
                  value={pricePerPlate}
                  onChange={(e) => setPricePerPlate(e.target.value)}
                  placeholder="1850"
                  className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3.5 py-2.5 text-xs text-[#f5f0eb] font-mono focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-6 pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#e3dad0]">
                  <input
                    type="checkbox"
                    checked={vegAvailable}
                    onChange={(e) => setVegAvailable(e.target.checked)}
                    className="w-4 h-4 rounded border-[#382f23] bg-[#171410] text-[#c5a880] focus:ring-[#c5a880]"
                  />
                  <span>Vegetarian Menu Available</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#e3dad0]">
                  <input
                    type="checkbox"
                    checked={nonVegAvailable}
                    onChange={(e) => setNonVegAvailable(e.target.checked)}
                    className="w-4 h-4 rounded border-[#382f23] bg-[#171410] text-[#c5a880] focus:ring-[#c5a880]"
                  />
                  <span>Non-Veg Permitted</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 4: Curated Amenities */}
          <div className="rounded-2xl bg-[#12100d] border border-[#241f18] p-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#c5a880] uppercase tracking-wider pb-3 border-b border-[#1f1a14]">
              <Sparkles className="w-4 h-4" />
              <span>Verified Property Amenities</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COMMON_AMENITIES.map((item) => {
                const checked = amenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                      checked
                        ? 'bg-[#221c15] border-[#c5a880]/50 text-[#f5f0eb]'
                        : 'bg-[#171410] border-[#241f18] text-[#8a7f70] hover:text-[#d6ccc0]'
                    }`}
                  >
                    <span>{item}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        checked ? 'bg-[#c5a880] border-[#c5a880] text-[#12100d]' : 'border-[#42372a]'
                      }`}
                    >
                      {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom amenity input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add custom amenity (e.g. Helipad, Riverfront View)..."
                className="flex-1 bg-[#171410] border border-[#2e261d] rounded-xl px-3.5 py-2 text-xs text-[#f5f0eb] focus:outline-none focus:border-[#c5a880]"
              />
              <button
                type="button"
                onClick={addCustomAmenity}
                className="px-3.5 py-2 rounded-xl bg-[#1f1a14] border border-[#382f23] text-xs text-[#c5a880] hover:bg-[#28221a]"
              >
                Add
              </button>
            </div>
          </div>

          {/* Card 5: Editorial Description */}
          <div className="rounded-2xl bg-[#12100d] border border-[#241f18] p-6 space-y-4">
            <label className="block text-xs uppercase tracking-wider text-[#998c7b] font-medium">
              Editorial Overview & Narrative Description
            </label>
            <textarea
              rows={5}
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the aesthetic, historical architecture, guest experience, and celebratory ambiance..."
              className="w-full bg-[#171410] border border-[#2e261d] rounded-xl p-3.5 text-xs text-[#f5f0eb] leading-relaxed focus:outline-none focus:border-[#c5a880]"
            />
          </div>
        </div>

        {/* Right 1 Col: Status, Primary Image & Gallery */}
        <div className="space-y-6">
          {/* Publishing Controls */}
          <div className="rounded-2xl bg-[#12100d] border border-[#241f18] p-6 space-y-4">
            <div className="text-xs font-medium text-[#c5a880] uppercase tracking-wider pb-3 border-b border-[#1f1a14]">
              Publishing Controls
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#171410] border border-[#2e261d] cursor-pointer">
              <div>
                <div className="text-xs font-medium text-[#f5f0eb]">Public Visibility</div>
                <div className="text-[11px] text-[#73685a]">Live on /venues catalog</div>
              </div>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-5 h-5 rounded border-[#382f23] bg-[#12100d] text-[#c5a880] focus:ring-[#c5a880]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#171410] border border-[#2e261d] cursor-pointer">
              <div>
                <div className="text-xs font-medium text-[#f5f0eb]">Featured Spotlight</div>
                <div className="text-[11px] text-[#73685a]">Promoted to homepage & top banner</div>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 rounded border-[#382f23] bg-[#12100d] text-[#c5a880] focus:ring-[#c5a880]"
              />
            </label>
          </div>

          {/* Primary Cover Image Preview */}
          <div className="rounded-2xl bg-[#12100d] border border-[#241f18] p-6 space-y-4">
            <div className="text-xs font-medium text-[#c5a880] uppercase tracking-wider pb-3 border-b border-[#1f1a14] flex items-center justify-between">
              <span>Cover Photo</span>
              <ImageIcon className="w-3.5 h-3.5" />
            </div>

            <div className="w-full h-44 rounded-xl bg-[#171410] border border-[#2e261d] overflow-hidden relative">
              {primaryImageUrl ? (
                <Image
                  src={primaryImageUrl}
                  alt={name || 'Cover'}
                  fill
                  sizes="400px"
                  className="object-cover"
                  unoptimized={primaryImageUrl.startsWith('http')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#73685a]">
                  No cover image set
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#998c7b] mb-1">
                Cover Image URL
              </label>
              <input
                type="text"
                required
                value={primaryImageUrl}
                onChange={(e) => setPrimaryImageUrl(e.target.value)}
                placeholder="/venues/santorini-resort-lucknow/thumbnail.jpg"
                className="w-full bg-[#171410] border border-[#2e261d] rounded-xl px-3 py-2 text-xs text-[#f5f0eb] font-mono focus:outline-none focus:border-[#c5a880]"
              />
            </div>
          </div>

          {/* Gallery Strips */}
          <div className="rounded-2xl bg-[#12100d] border border-[#241f18] p-6 space-y-4">
            <div className="text-xs font-medium text-[#c5a880] uppercase tracking-wider pb-3 border-b border-[#1f1a14] flex items-center justify-between">
              <span>Gallery Strip ({gallery.length})</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            {/* Gallery thumbnails */}
            {gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {gallery.map((img, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden h-20 bg-[#171410] border border-[#2e261d]">
                    <Image
                      src={img.url}
                      alt={img.alt_text || 'Gallery'}
                      fill
                      sizes="120px"
                      className="object-cover"
                      unoptimized={img.url.startsWith('http')}
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded bg-black/70 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add photo input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="/venues/.../gallery_001.jpg"
                className="flex-1 bg-[#171410] border border-[#2e261d] rounded-xl px-3 py-2 text-xs text-[#f5f0eb] font-mono focus:outline-none focus:border-[#c5a880]"
              />
              <button
                type="button"
                onClick={addGalleryImage}
                className="p-2 rounded-xl bg-[#1f1a14] border border-[#382f23] text-[#c5a880] hover:bg-[#28221a]"
                title="Add to gallery"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
