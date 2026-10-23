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
  const [state] = useState(initialData?.state || 'Uttar Pradesh');
  const [address, setAddress] = useState(initialData?.address || '');
  const [rating] = useState<number | string>(initialData?.rating ?? 4.8);
  const [reviewCount] = useState<number | string>(initialData?.review_count ?? 95);

  const [minPax, setMinPax] = useState<number | string>(initialData?.min_pax ?? '');
  const [maxPax, setMaxPax] = useState<number | string>(initialData?.max_pax ?? '');
  const [totalCapacity, setTotalCapacity] = useState<number | string>(initialData?.total_capacity ?? '');
  const [rooms, setRooms] = useState<number | string>(initialData?.rooms ?? '');

  const [pricePerPlate, setPricePerPlate] = useState<number | string>(initialData?.price_per_plate ?? '');
  const [vegAvailable, setVegAvailable] = useState(initialData?.veg_available ?? true);
  const [nonVegAvailable, setNonVegAvailable] = useState(initialData?.non_veg_available ?? true);

  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || []);
  const [newAmenity, setNewAmenity] = useState('');

  const [description, setDescription] = useState(initialData?.description || '');
  const [primaryImageUrl, setPrimaryImageUrl] = useState(
    initialData?.primary_image_url || '/venues/santorini-resort-lucknow/thumbnail.jpg'
  );
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

    if (pricePerPlate !== '') formData.append('price_per_plate', String(pricePerPlate));
    formData.append('veg_available', String(vegAvailable));
    formData.append('non_veg_available', String(nonVegAvailable));

    formData.append('amenities', JSON.stringify(amenities));
    formData.append('description', description);
    formData.append('primary_image_url', primaryImageUrl);
    formData.append('is_featured', String(isFeatured));
    formData.append('is_published', String(isPublished));

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE4D9]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C8070] mb-1 font-mono">
            <Link href="/admin/venues" className="hover:text-[#521D2B] transition-colors flex items-center gap-1 font-sans">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Venues</span>
            </Link>
            <span>/</span>
            <span className="text-[#521D2B] font-semibold font-sans">{isNew ? 'New Venue' : name}</span>
          </div>
          <h1 className="text-2xl font-serif text-[#1C1611] font-normal tracking-wide">
            {isNew ? 'Create New Wedding Venue' : `Edit: ${name}`}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && slug && (
            <Link
              href={`/venues/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FDF9F0] border border-[#E9DECA] text-xs font-medium text-[#521D2B] hover:bg-[#F9F1DF] transition-all"
            >
              <span>Live Page</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#85662F]" />
            </Link>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#521D2B] text-white text-xs font-medium tracking-wide hover:bg-[#682637] transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#E6C994]" />
            <span>{isPending ? 'Saving...' : 'Save Venue'}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Main Info & Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Core Details */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#521D2B] uppercase tracking-wider pb-3 border-b border-[#F0ECE1] font-mono">
              <Building2 className="w-4 h-4 text-[#85662F]" />
              <span>Core Venue Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[#5C5245] mb-1.5 font-semibold font-mono">
                  Property Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vivanta Luxury Palace"
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all shadow-2xs"
                />
              </div>

              {/* Slug with generator */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#5C5245] font-semibold font-mono">
                    URL Slug *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoSlug}
                    className="inline-flex items-center gap-1 text-[11px] text-[#521D2B] font-semibold hover:underline"
                  >
                    <Wand2 className="w-3 h-3 text-[#85662F]" />
                    <span>Generate from Name</span>
                  </button>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-[#F8F5EE] border border-r-0 border-[#DDD5C7] rounded-l-xl text-xs text-[#8C8070] font-mono">
                    /venues/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="vivanta-luxury-palace"
                    className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-r-xl px-3.5 py-2.5 text-xs text-[#1C1611] font-mono focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C5245] mb-1.5 font-semibold font-mono">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all cursor-pointer shadow-2xs"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C5245] mb-1.5 font-semibold font-mono">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all shadow-2xs"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[#5C5245] mb-1.5 font-semibold font-mono">
                  Locality / Full Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Vipin Khand, Gomti Nagar, Lucknow"
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Capacity & Room Specifications */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#521D2B] uppercase tracking-wider pb-3 border-b border-[#F0ECE1] font-mono">
              <Users className="w-4 h-4 text-[#85662F]" />
              <span>Guest Capacity & Room Logistics</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C5245] mb-1.5 font-semibold font-mono">
                  Min Guests
                </label>
                <input
                  type="number"
                  value={minPax}
                  onChange={(e) => setMinPax(e.target.value)}
                  placeholder="200"
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1611] font-mono focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C5245] mb-1.5 font-semibold font-mono">
                  Max Guests
                </label>
                <input
                  type="number"
                  value={maxPax}
                  onChange={(e) => setMaxPax(e.target.value)}
                  placeholder="1500"
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1611] font-mono focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C5245] mb-1.5 font-semibold font-mono">
                  Total Lawn Cap.
                </label>
                <input
                  type="number"
                  value={totalCapacity}
                  onChange={(e) => setTotalCapacity(e.target.value)}
                  placeholder="2000"
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1611] font-mono focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C5245] mb-1.5 font-semibold font-mono">
                  Guest Rooms
                </label>
                <input
                  type="number"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="25"
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1611] font-mono focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Catering & Pricing */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#521D2B] uppercase tracking-wider pb-3 border-b border-[#F0ECE1] font-mono">
              <Utensils className="w-4 h-4 text-[#85662F]" />
              <span>Catering & Food Packages</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#5C5245] mb-1.5 font-semibold font-mono">
                  Price Per Plate (₹)
                </label>
                <input
                  type="number"
                  value={pricePerPlate}
                  onChange={(e) => setPricePerPlate(e.target.value)}
                  placeholder="2500"
                  className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1611] font-mono focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all shadow-2xs"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-4 pt-4 sm:pt-0">
                <label className="flex items-center gap-2.5 text-xs text-[#1C1611] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vegAvailable}
                    onChange={(e) => setVegAvailable(e.target.checked)}
                    className="w-4 h-4 rounded border-[#DDD5C7] text-[#521D2B] focus:ring-[#521D2B]"
                  />
                  <span>Pure Veg Allowed</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-[#1C1611] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nonVegAvailable}
                    onChange={(e) => setNonVegAvailable(e.target.checked)}
                    className="w-4 h-4 rounded border-[#DDD5C7] text-[#521D2B] focus:ring-[#521D2B]"
                  />
                  <span>Non-Veg Allowed</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 4: Amenities Matrix */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#521D2B] uppercase tracking-wider font-mono">
                <Sparkles className="w-4 h-4 text-[#85662F]" />
                <span>Amenities Matrix ({amenities.length} selected)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {COMMON_AMENITIES.map((item) => {
                const isSelected = amenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                      isSelected
                        ? 'bg-[#FDF9F0] text-[#705527] border border-[#D6B56D] font-medium shadow-2xs'
                        : 'bg-[#F8F5EE] text-[#5C5245] border border-[#EAE4D9] hover:bg-[#F0ECE1]'
                    }`}
                  >
                    {isSelected ? `✓ ${item}` : `+ ${item}`}
                  </button>
                );
              })}
            </div>

            {/* Custom amenity input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add custom amenity tag..."
                className="bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1C1611] placeholder-[#A09585] focus:outline-none focus:border-[#521D2B] flex-1 max-w-xs shadow-2xs"
              />
              <button
                type="button"
                onClick={addCustomAmenity}
                className="p-2 rounded-xl bg-[#F8F5EE] border border-[#EAE4D9] text-[#1C1611] hover:bg-[#F0ECE1] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 5: Editorial Description */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-4 shadow-sm">
            <label className="block text-xs uppercase tracking-wider text-[#5C5245] font-semibold font-mono">
              Property Description & Concierge Notes
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the architectural grandeur, lawn aesthetics, bridal suite luxury, and location advantages..."
              className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl p-3.5 text-xs text-[#1C1611] placeholder-[#A09585] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all shadow-2xs leading-relaxed"
            />
          </div>
        </div>

        {/* Right 1 Col: Media & Controls */}
        <div className="space-y-6">
          {/* Publishing Controls */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-4 shadow-sm">
            <div className="text-xs font-semibold text-[#521D2B] uppercase tracking-wider pb-3 border-b border-[#F0ECE1] font-mono">
              Publishing Controls
            </div>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#FDFBF7] border border-[#EAE4D9] cursor-pointer shadow-2xs">
              <div>
                <div className="text-xs font-semibold text-[#1C1611]">Public Visibility</div>
                <div className="text-[11px] text-[#7A6E5F]">Live on /venues catalog</div>
              </div>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-5 h-5 rounded border-[#DDD5C7] text-[#521D2B] focus:ring-[#521D2B]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#FDFBF7] border border-[#EAE4D9] cursor-pointer shadow-2xs">
              <div>
                <div className="text-xs font-semibold text-[#1C1611]">Featured Spotlight</div>
                <div className="text-[11px] text-[#7A6E5F]">Promoted to homepage banner</div>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 rounded border-[#DDD5C7] text-[#521D2B] focus:ring-[#521D2B]"
              />
            </label>
          </div>

          {/* Primary Cover Image Preview */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-4 shadow-sm">
            <div className="text-xs font-semibold text-[#521D2B] uppercase tracking-wider pb-3 border-b border-[#F0ECE1] flex items-center justify-between font-mono">
              <span>Cover Photo</span>
              <ImageIcon className="w-3.5 h-3.5 text-[#85662F]" />
            </div>

            <div className="w-full h-44 rounded-xl bg-[#F8F5EE] border border-[#EAE4D9] overflow-hidden relative shadow-2xs">
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
                <div className="w-full h-full flex items-center justify-center text-xs text-[#8C8070]">
                  No cover image set
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#5C5245] mb-1.5 font-semibold font-mono">
                Cover Image URL / Path
              </label>
              <input
                type="text"
                required
                value={primaryImageUrl}
                onChange={(e) => setPrimaryImageUrl(e.target.value)}
                placeholder="/venues/santorini-resort-lucknow/thumbnail.jpg"
                className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs text-[#1C1611] font-mono focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 shadow-2xs"
              />
            </div>
          </div>

          {/* Gallery Strips */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-4 shadow-sm">
            <div className="text-xs font-semibold text-[#521D2B] uppercase tracking-wider pb-3 border-b border-[#F0ECE1] flex items-center justify-between font-mono">
              <span>Gallery Strip ({gallery.length})</span>
              <Sparkles className="w-3.5 h-3.5 text-[#85662F]" />
            </div>

            {/* Gallery thumbnails */}
            {gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {gallery.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden h-20 bg-[#F8F5EE] border border-[#EAE4D9] shadow-2xs">
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
                      className="absolute top-1 right-1 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
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
                placeholder="Paste photo URL / path..."
                className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl px-3 py-2 text-xs text-[#1C1611] font-mono focus:outline-none focus:border-[#521D2B] shadow-2xs"
              />
              <button
                type="button"
                onClick={addGalleryImage}
                className="p-2 rounded-xl bg-[#521D2B] text-white hover:bg-[#682637] transition-colors shrink-0 shadow-2xs"
                title="Add to gallery"
              >
                <Plus className="w-4 h-4 text-[#E6C994]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
