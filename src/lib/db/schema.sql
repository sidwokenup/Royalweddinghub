-- ============================================================================
-- Royal Wedding Hub — Production Database Schema
-- Compatible with PostgreSQL 15+ / Supabase
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ADMIN USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. VENUES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'Wedding Venue',
  city VARCHAR(100) NOT NULL DEFAULT 'Lucknow',
  state VARCHAR(100) NOT NULL DEFAULT 'Uttar Pradesh',
  address TEXT NOT NULL,
  rating NUMERIC(2, 1),
  review_count INTEGER,
  min_pax INTEGER,
  max_pax INTEGER,
  total_capacity INTEGER,
  rooms INTEGER,
  raw_capacity VARCHAR(100),
  veg_available BOOLEAN NOT NULL DEFAULT TRUE,
  non_veg_available BOOLEAN NOT NULL DEFAULT TRUE,
  price_per_plate NUMERIC(10, 2),
  price_unit VARCHAR(50) NOT NULL DEFAULT 'per_plate',
  amenities TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  primary_image_url TEXT NOT NULL,
  primary_image_alt TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venues_slug ON venues(slug);
CREATE INDEX IF NOT EXISTS idx_venues_published ON venues(is_published);
CREATE INDEX IF NOT EXISTS idx_venues_featured ON venues(is_featured);
CREATE INDEX IF NOT EXISTS idx_venues_category ON venues(category);

-- ----------------------------------------------------------------------------
-- 3. VENUE IMAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venue_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_key TEXT,
  width INTEGER NOT NULL DEFAULT 1280,
  height INTEGER NOT NULL DEFAULT 720,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_venue_images_venue_id ON venue_images(venue_id);

-- ----------------------------------------------------------------------------
-- 4. SERVICES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category_tag VARCHAR(100) NOT NULL,
  headline VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  intro_copy TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  accent_color VARCHAR(50) NOT NULL DEFAULT '#521D2B',
  bg_surface VARCHAR(50) NOT NULL DEFAULT '#FAF7F2',
  text_on_bg VARCHAR(50) NOT NULL DEFAULT '#211A19',
  cta_text VARCHAR(100) NOT NULL DEFAULT 'Enquire Now',
  external_link TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_published ON services(is_published);

-- ----------------------------------------------------------------------------
-- 5. SERVICE DELIVERABLES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_service_deliverables_service_id ON service_deliverables(service_id);

-- ----------------------------------------------------------------------------
-- 6. SERVICE SUBCATEGORIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  detail TEXT NOT NULL,
  tag VARCHAR(50),
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_service_subcategories_service_id ON service_subcategories(service_id);

-- ----------------------------------------------------------------------------
-- 7. SERVICE GALLERY IMAGES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_key TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_service_gallery_service_id ON service_gallery_images(service_id);

-- ----------------------------------------------------------------------------
-- 8. VENDORS & ARTISTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  bio TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  instagram_handle VARCHAR(100),
  profile_image_url TEXT,
  rating NUMERIC(2, 1),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_slug ON vendors(slug);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);

-- ----------------------------------------------------------------------------
-- 9. ENQUIRIES / LEADS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_number VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  event_type VARCHAR(100) NOT NULL DEFAULT 'WEDDING',
  services_requested TEXT[] NOT NULL DEFAULT '{}',
  wedding_date VARCHAR(100),
  guest_count_bracket VARCHAR(100),
  location VARCHAR(255) DEFAULT 'Lucknow',
  status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'booked', 'archived')),
  internal_notes TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_content VARCHAR(100),
  utm_term VARCHAR(100),
  ip_address_hash VARCHAR(128),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);

-- ----------------------------------------------------------------------------
-- 10. TESTIMONIALS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_names VARCHAR(255) NOT NULL,
  celebration_type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  wedding_season VARCHAR(100),
  quote TEXT NOT NULL,
  full_story TEXT,
  rating NUMERIC(2, 1) DEFAULT 5.0,
  verified BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  client_consent_recorded BOOLEAN NOT NULL DEFAULT FALSE,
  source VARCHAR(100) DEFAULT 'Private Client Concierge',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);

-- ----------------------------------------------------------------------------
-- 11. BUSINESS SETTINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS business_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 12. MEDIA ASSETS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) NOT NULL,
  storage_key VARCHAR(500) NOT NULL UNIQUE,
  storage_provider VARCHAR(50) NOT NULL DEFAULT 'supabase',
  mime_type VARCHAR(100) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  folder VARCHAR(100) NOT NULL DEFAULT 'general',
  reference_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_folder ON media_assets(folder);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Public can view published venues" ON venues FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view venue images" ON venue_images FOR SELECT USING (TRUE);
CREATE POLICY "Public can view published services" ON services FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view service deliverables" ON service_deliverables FOR SELECT USING (TRUE);
CREATE POLICY "Public can view service subcategories" ON service_subcategories FOR SELECT USING (TRUE);
CREATE POLICY "Public can view service gallery" ON service_gallery_images FOR SELECT USING (TRUE);
CREATE POLICY "Public can view published vendors" ON vendors FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view published testimonials" ON testimonials FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view business settings" ON business_settings FOR SELECT USING (TRUE);

-- Public can INSERT enquiries (leads)
CREATE POLICY "Public can submit enquiries" ON enquiries FOR INSERT WITH CHECK (TRUE);

-- Service role has full access to everything
CREATE POLICY "Service role has full access to admin_users" ON admin_users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to venues" ON venues FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to venue_images" ON venue_images FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to services" ON services FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to service_deliverables" ON service_deliverables FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to service_subcategories" ON service_subcategories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to service_gallery_images" ON service_gallery_images FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to vendors" ON vendors FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to enquiries" ON enquiries FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to testimonials" ON testimonials FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to business_settings" ON business_settings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to media_assets" ON media_assets FOR ALL USING (auth.role() = 'service_role');
