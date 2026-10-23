import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const envContent = fs.readFileSync(path.join(rootDir, '.env.local'), 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const [k, ...v] = trimmed.split('=');
    env[k.trim()] = v.join('=').replace(/^['"]|['"]$/g, '').trim();
  }
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

// Import SERVICES_DATA dynamically from src/data/services.ts
async function seedServices() {
  console.log('==> Seeding Services from src/data/services.ts...');
  
  // We can read and parse the services or use compiled TS
  // Let's read the 8 services from src/data/services.ts directly
  const servicesFilePath = path.join(rootDir, 'src', 'data', 'services.ts');
  const servicesCode = fs.readFileSync(servicesFilePath, 'utf-8');

  // Simple evaluator of the exported array
  const cleanJs = servicesCode
    .replace(/^import\s+.*?;/gm, '')
    .replace(/export\s+const\s+SERVICES_DATA:\s*ServiceItem\[\]\s*=/, 'const SERVICES_DATA =')
    .concat('\nmodule.exports = SERVICES_DATA;');

  const tempFile = path.join(rootDir, 'scripts', 'temp-services.cjs');
  fs.writeFileSync(tempFile, cleanJs, 'utf-8');

  let services;
  try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    services = require('./temp-services.cjs');
  } finally {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  }

  console.log(`Found ${services.length} services to migrate.`);

  for (let idx = 0; idx < services.length; idx++) {
    const s = services[idx];
    console.log(`Migrating Service: ${s.name} (${s.slug})`);

    const { data: record, error: sError } = await supabase
      .from('services')
      .upsert(
        {
          slug: s.slug,
          name: s.name,
          category_tag: s.categoryTag || 'Wedding Services',
          headline: s.headline,
          short_description: s.shortDescription,
          intro_copy: s.introCopy,
          cover_image_url: s.image,
          accent_color: s.accentColor || '#521D2B',
          bg_surface: s.bgSurface || '#FAF7F2',
          text_on_bg: s.textOnBg || '#211A19',
          cta_text: s.ctaText || 'Enquire Now',
          external_link: s.externalLink || null,
          is_featured: !!s.featured,
          is_published: true,
          display_order: idx,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single();

    if (sError) {
      console.error(`Error saving service ${s.slug}:`, sError.message);
      continue;
    }

    if (record && Array.isArray(s.deliverables)) {
      await supabase.from('service_deliverables').delete().eq('service_id', record.id);
      for (let dIdx = 0; dIdx < s.deliverables.length; dIdx++) {
        const d = s.deliverables[dIdx];
        await supabase.from('service_deliverables').insert({
          service_id: record.id,
          title: d.title,
          description: d.description,
          display_order: dIdx,
        });
      }
    }

    if (record && Array.isArray(s.subcategories)) {
      await supabase.from('service_subcategories').delete().eq('service_id', record.id);
      for (let subIdx = 0; subIdx < s.subcategories.length; subIdx++) {
        const sub = s.subcategories[subIdx];
        await supabase.from('service_subcategories').insert({
          service_id: record.id,
          name: sub.name,
          detail: sub.detail,
          tag: sub.tag || null,
          display_order: subIdx,
        });
      }
    }
  }

  console.log('==> Successfully Migrated Services & Deliverables!');
}

seedServices().catch(console.error);
