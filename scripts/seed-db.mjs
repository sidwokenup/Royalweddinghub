import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment from .env.local if present
const envLocalPath = path.join(rootDir, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').replace(/^["']|["']$/g, '');
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val.trim();
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in .env.local before running database seeding.');
  console.log('Refer to the setup instructions to provision your database.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('==> Starting Database Migration & Seeding...');

  // 1. Seed Venues
  const venuesJsonPath = path.join(rootDir, 'src', 'data', 'venues.json');
  if (fs.existsSync(venuesJsonPath)) {
    const venuesData = JSON.parse(fs.readFileSync(venuesJsonPath, 'utf-8'));
    console.log(`Found ${venuesData.length} venues in src/data/venues.json`);

    for (const v of venuesData) {
      console.log(`Migrating Venue: ${v.name} (${v.slug})`);

      const { data: venueRecord, error: venueError } = await supabase
        .from('venues')
        .upsert(
          {
            slug: v.slug,
            name: v.name,
            category: v.category || 'Wedding Venue',
            city: v.city || 'Lucknow',
            state: v.state || 'Uttar Pradesh',
            address: v.address || `${v.name}, Lucknow`,
            rating: v.rating || null,
            review_count: v.reviewCount || null,
            min_pax: v.capacity?.minPax || null,
            max_pax: v.capacity?.maxPax || null,
            total_capacity: v.capacity?.capacity || null,
            rooms: v.capacity?.rooms || null,
            raw_capacity: v.capacity?.raw || null,
            veg_available: v.food?.vegetarian ?? true,
            non_veg_available: v.food?.nonVegetarian ?? true,
            price_per_plate: v.food?.pricePerPlate || null,
            price_unit: v.food?.unit || 'per_plate',
            amenities: Array.isArray(v.amenities) ? v.amenities : [],
            description: v.description || null,
            primary_image_url: v.primaryImage?.url || '/images/hero-fallback.jpg',
            primary_image_alt: v.primaryImage?.alt || `${v.name} - Luxury Wedding Venue`,
            is_featured: ['santorini-resort-lucknow', 'vivanta-hotel-resort', 'vsquare'].includes(v.slug),
            is_published: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'slug' }
        )
        .select('id')
        .single();

      if (venueError) {
        console.error(`Error migrating venue ${v.slug}:`, venueError.message);
        continue;
      }

      // Migrate Gallery Images if present
      if (Array.isArray(v.gallery) && venueRecord) {
        for (let idx = 0; idx < v.gallery.length; idx++) {
          const img = v.gallery[idx];
          await supabase.from('venue_images').upsert(
            {
              venue_id: venueRecord.id,
              url: img.url,
              storage_key: img.localUrl || null,
              width: img.width || 1280,
              height: img.height || 720,
              alt_text: img.alt || `${v.name} wedding gallery`,
              display_order: idx,
              is_cover: false,
            },
            { onConflict: 'venue_id,url' }
          );
        }
      }
    }
    console.log(`==> Successfully seeded ${venuesData.length} venues.`);
  }

  console.log('==> Database Seeding Completed Successfully!');
}

seedDatabase().catch((err) => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
