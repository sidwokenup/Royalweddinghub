import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.resolve('public/images/about');
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function downloadImage(url, destPath) {
  console.log(`Downloading: ${url} -> ${destPath}`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: status ${res.status}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  const stats = fs.statSync(destPath);
  console.log(`Saved ${destPath} (${Math.round(stats.size / 1024)} KB)`);
  return stats.size;
}

const aboutAssets = [
  {
    key: 'hero',
    filename: 'about-editorial-hero.jpg',
    url: 'https://images.unsplash.com/photo-1761472606347-bfebc5a3e546?auto=format&fit=crop&w=1400&q=85',
    subject: 'Ornate royal palace archway entrance with crystal chandeliers and luxury celebration seating',
    section: 'Section 1: Editorial About Hero',
    sourceUrl: 'https://unsplash.com/photos/ornate-archway-entrance-with-chandeliers-1761472606347',
    license: 'Unsplash License (Free commercial use, no copyright restrictions)',
    attribution: 'Unsplash Commercial License',
  },
  {
    key: 'story',
    filename: 'about-story.jpg',
    url: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=1400&q=85',
    subject: 'Couple performing wedding ritual under an opulent floral canopy in a royal ballroom setting',
    section: 'Section 2: Our Story (A Promise to Make It Personal)',
    sourceUrl: 'https://unsplash.com/photos/a-couple-performing-a-wedding-ritual-under-a-floral-canopy-1587271407850',
    license: 'Unsplash License (Free commercial use, no copyright restrictions)',
    attribution: 'Unsplash Commercial License',
  },
  {
    key: 'philosophy',
    filename: 'about-philosophy.jpg',
    url: 'https://images.unsplash.com/photo-1649615644622-6d83f48e69c5?auto=format&fit=crop&w=1400&q=85',
    subject: 'Fine-art wedding tablescape with custom place settings, taper candles, and floral artistry',
    section: 'Section 3: Our Philosophy (Thoughtful in Every Detail)',
    sourceUrl: 'https://unsplash.com/photos/a-table-set-for-a-formal-dinner-1649615644622',
    license: 'Unsplash License (Free commercial use, no copyright restrictions)',
    attribution: 'Unsplash Commercial License',
  },
  {
    key: 'experience',
    filename: 'about-experience.jpg',
    url: 'https://images.unsplash.com/photo-1621801306185-8c0ccf9c8eb8?auto=format&fit=crop&w=1400&q=85',
    subject: 'Two hands with intricate bridal henna patterns gently clasping each other in a sacred vow',
    section: 'Section 4: The Experience & Planning Approach',
    sourceUrl: 'https://unsplash.com/photos/two-hands-with-intricate-henna-patterns-1621801306185',
    license: 'Unsplash License (Free commercial use, no copyright restrictions)',
    attribution: 'Unsplash Commercial License',
  },
  {
    key: 'cta',
    filename: 'about-cta.jpg',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85',
    subject: 'Starlit reception celebration courtyard with warm fairy light canopies and candlelit tables',
    section: 'Section 7: Closing Call to Action (Your Story Deserves a Beautiful Beginning)',
    sourceUrl: 'https://unsplash.com/photos/wedding-fairy-lights-night-reception-1519741497674',
    license: 'Unsplash License (Free commercial use, no copyright restrictions)',
    attribution: 'Unsplash Commercial License',
  },
];

async function run() {
  const manifest = [];
  for (const asset of aboutAssets) {
    const dest = path.join(ASSETS_DIR, asset.filename);
    const localPath = `/images/about/${asset.filename}`;
    try {
      await downloadImage(asset.url, dest);
      manifest.push({
        key: asset.key,
        filename: asset.filename,
        localPath,
        section: asset.section,
        subject: asset.subject,
        sourceUrl: asset.sourceUrl,
        license: asset.license,
        attribution: asset.attribution,
        fileSizeKB: Math.round(fs.statSync(dest).size / 1024),
      });
    } catch (e) {
      console.error(`Failed ${asset.filename}:`, e.message);
    }
  }

  const manifestPath = path.resolve('src/data/about-images.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest saved to ${manifestPath}`);
  console.log(`Total downloaded: ${manifest.length}`);
}

run();
