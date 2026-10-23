export type AdminRole = 'super_admin' | 'editor';

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: AdminRole;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbVenue {
  id: string;
  slug: string;
  name: string;
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
  veg_available: boolean;
  non_veg_available: boolean;
  price_per_plate: number | null;
  price_unit: string;
  amenities: string[];
  description: string | null;
  primary_image_url: string;
  primary_image_alt: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbVenueImage {
  id: string;
  venue_id: string;
  url: string;
  storage_key: string | null;
  width: number;
  height: number;
  alt_text: string | null;
  display_order: number;
  is_cover: boolean;
  created_at: string;
}

export interface DbService {
  id: string;
  slug: string;
  name: string;
  category_tag: string;
  headline: string;
  short_description: string;
  intro_copy: string;
  cover_image_url: string;
  accent_color: string;
  bg_surface: string;
  text_on_bg: string;
  cta_text: string;
  external_link: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbServiceDeliverable {
  id: string;
  service_id: string;
  title: string;
  description: string;
  display_order: number;
}

export interface DbServiceSubcategory {
  id: string;
  service_id: string;
  name: string;
  detail: string;
  tag: string | null;
  display_order: number;
}

export interface DbServiceGalleryImage {
  id: string;
  service_id: string;
  url: string;
  storage_key: string | null;
  display_order: number;
}

export interface DbVendor {
  id: string;
  slug: string;
  name: string;
  category: string;
  bio: string | null;
  phone: string | null;
  email: string | null;
  instagram_handle: string | null;
  profile_image_url: string | null;
  rating: number | null;
  is_verified: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = 'new' | 'contacted' | 'qualified' | 'booked' | 'archived';

export interface DbEnquiry {
  id: string;
  lead_number: string;
  name: string;
  phone: string;
  email: string | null;
  event_type: string;
  services_requested: string[];
  wedding_date: string | null;
  guest_count_bracket: string | null;
  location: string | null;
  status: EnquiryStatus;
  internal_notes: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  ip_address_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbTestimonial {
  id: string;
  couple_names: string;
  celebration_type: string;
  location: string;
  wedding_season: string | null;
  quote: string;
  full_story: string | null;
  rating: number | null;
  verified: boolean;
  featured: boolean;
  is_published: boolean;
  client_consent_recorded: boolean;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbBusinessSetting {
  id: string;
  setting_key: string;
  setting_value: Record<string, unknown>;
  updated_at: string;
}

export interface DbMediaAsset {
  id: string;
  filename: string;
  storage_key: string;
  storage_provider: string;
  mime_type: string;
  file_size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  folder: string;
  reference_count: number;
  created_at: string;
}
