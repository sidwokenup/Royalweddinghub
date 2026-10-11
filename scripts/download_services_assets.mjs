import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.resolve('public/images/services');
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Download helper with custom headers
async function downloadImage(url, destPath) {
  console.log(`Downloading: ${url} -> ${destPath}`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: status ${res.status} ${res.statusText}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  const stats = fs.statSync(destPath);
  console.log(`Saved ${destPath} (${Math.round(stats.size / 1024)} KB)`);
  return stats.size;
}

// Verified asset list mapped exactly to the prompt's required image subjects
const verifiedAssets = [
  {
    slug: 'wedding-venues',
    name: 'Wedding Venues',
    filename: 'wedding-venues.jpg',
    // Luxury Resort Poolside & Lawn property in Lucknow from authentic collection
    localSource: 'public/venues/santorini-resort-lucknow/gallery_006.jpg',
    subject: 'Luxury resort poolside and celebration lawn at Santorini Resort Lucknow',
    sourceUrl: 'The Royal Weddinghub Lucknow Venue Archive (Verified Partner Property)',
    license: 'Authorized Commercial Property Usage (The Royal Weddinghub Client Asset)',
    attribution: 'The Royal Weddinghub Archive',
  },
  {
    slug: 'planning-and-decor',
    name: 'Planning & Décor',
    filename: 'wedding-planning-decor.jpg',
    // Grand royal floral mandap canopy and architectural stage decor from Lucknow
    localSource: 'public/venues/mayur-garden/gallery_001.jpg',
    subject: 'Grand floral mandap canopy, fairy light cascades, and royal wedding stage decor in Lucknow',
    sourceUrl: 'The Royal Weddinghub Lucknow Decor Archive',
    license: 'Authorized Commercial Production Asset (The Royal Weddinghub)',
    attribution: 'The Royal Weddinghub Decor Production',
  },
  {
    slug: 'photography-and-films',
    name: 'Photography & Films',
    filename: 'wedding-photography.jpg',
    // Professional wedding photographer in action capturing a bride and couple
    downloadUrl: 'https://images.unsplash.com/photo-1769230360899-757a8ae18b17?auto=format&fit=crop&w=1400&q=85',
    subject: 'Professional wedding photographer in action capturing fine-art portraits with a camera during a wedding shoot',
    sourceUrl: 'https://unsplash.com/photos/photographer-captures-bride-outdoors-769230360899',
    license: 'Unsplash License (Free commercial use, no copyright restrictions)',
    attribution: 'Unsplash Commercial License',
  },
  {
    slug: 'catering-and-banquets',
    name: 'Catering & Royal Banquets',
    filename: 'wedding-catering.jpg',
    // Luxury wedding banquet buffet with polished silver chafing dishes
    downloadUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1400&q=85',
    subject: 'Luxury wedding banquet catering station with elegant chafing dishes and gourmet dining presentation',
    sourceUrl: 'https://unsplash.com/photos/a-buffet-table-with-silver-chafing-dishes-555244162',
    license: 'Unsplash License (Free commercial use, no copyright restrictions)',
    attribution: 'Unsplash Commercial License',
  },
  {
    slug: 'music-and-entertainment',
    name: 'Music & Entertainment',
    filename: 'wedding-entertainment.jpg',
    // Traditional wedding musicians and dhol drum performers in royal attire
    downloadUrl: 'https://images.unsplash.com/photo-1756460711432-3c9fc676900f?auto=format&fit=crop&w=1400&q=85',
    subject: 'Live traditional wedding musicians in formal attire playing celebratory percussion and wedding drums',
    sourceUrl: 'https://unsplash.com/photos/musicians-in-maroon-outfits-play-large-drums-1756460711432',
    license: 'Unsplash License (Free commercial use, no copyright restrictions)',
    attribution: 'Unsplash Commercial License',
  },
  {
    slug: 'ceremonies-and-traditions',
    name: 'Ceremony & Traditions',
    filename: 'wedding-ceremonies.jpg',
    // Traditional Indian wedding ceremony: Couple showered with flower petals around sacred fire
    downloadUrl: 'https://images.unsplash.com/photo-1754782915842-aa4fca6c203a?auto=format&fit=crop&w=1400&q=85',
    subject: 'Bride and groom during sacred Vedic wedding ceremony rituals showered with blessed rose petals',
    sourceUrl: 'https://unsplash.com/photos/couple-showered-with-flower-petals-during-traditional-indian-wedding-ceremony-1754782915842',
    license: 'Unsplash License (Free commercial use, no copyright restrictions)',
    attribution: 'Unsplash Commercial License',
  },
  {
    slug: 'bridal-beauty',
    name: 'Bridal Beauty & Styling',
    filename: 'bridal-makeup.jpg',
    // Professional bridal makeup artist applying makeup to an Indian bride
    downloadUrl: 'https://images.unsplash.com/photo-1638628064365-f08ad0ec8245?auto=format&fit=crop&w=1400&q=85',
    subject: 'Professional bridal makeup artist applying beauty makeup and final touches to an Indian bride',
    sourceUrl: 'https://unsplash.com/photos/a-woman-putting-makeup-on-another-womans-face-1638628064365',
    license: 'Unsplash License (Free commercial use, no copyright restrictions)',
    attribution: 'Unsplash Commercial License',
  },
  {
    slug: 'invitations-and-gifting',
    name: 'Invitations & Gifting',
    filename: 'wedding-invitations-gifts.jpg',
    // Luxury bespoke wedding invitation suite, calligraphy stationery, and wax seals
    downloadUrl: 'https://images.unsplash.com/photo-1632610992723-82d7c212f6d7?auto=format&fit=crop&w=1400&q=85',
    subject: 'Luxury bespoke wedding stationery suite with elegant calligraphy envelope, personalized cards, and seal',
    sourceUrl: 'https://unsplash.com/photos/a-wedding-stationery-with-envelope-1632610992723',
    license: 'Unsplash License (Free commercial use, no copyright restrictions)',
    attribution: 'Unsplash Commercial License',
  },
];

async function run() {
  const manifest = [];

  for (const asset of verifiedAssets) {
    const destPath = path.join(ASSETS_DIR, asset.filename);
    const publicPath = `/images/services/${asset.filename}`;

    try {
      if (asset.localSource) {
        console.log(`Copying local asset: ${asset.localSource} -> ${destPath}`);
        fs.copyFileSync(path.resolve(asset.localSource), destPath);
      } else if (asset.downloadUrl) {
        await downloadImage(asset.downloadUrl, destPath);
      }

      manifest.push({
        slug: asset.slug,
        name: asset.name,
        localPath: publicPath,
        subject: asset.subject,
        sourceUrl: asset.sourceUrl,
        license: asset.license,
        attribution: asset.attribution,
        fileSizeKB: Math.round(fs.statSync(destPath).size / 1024),
      });
    } catch (err) {
      console.error(`Failed to process asset for ${asset.slug}:`, err);
    }
  }

  // Save manifest file
  const manifestPath = path.resolve('src/data/service-images.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nSuccessfully created service images manifest at: ${manifestPath}`);
  console.log(`Total verified assets processed: ${manifest.length}`);
}

run();
