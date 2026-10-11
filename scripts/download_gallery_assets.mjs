import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.resolve('public/images/services');

async function downloadImage(url, destPath) {
  console.log(`Downloading gallery asset: ${url} -> ${destPath}`);
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
}

const galleryAssets = [
  // Bridal Beauty Gallery
  {
    filename: 'bridal-makeup-g1.jpg',
    url: 'https://images.unsplash.com/photo-1610173827043-9db50e0d8ef9?auto=format&fit=crop&w=1200&q=80',
    subject: 'Indian bride in ornate traditional red lehenga and bridal jewelry'
  },
  {
    filename: 'bridal-makeup-g2.jpg',
    url: 'https://images.unsplash.com/photo-1600685890506-593fdf55949b?auto=format&fit=crop&w=1200&q=80',
    subject: 'Bridal portrait with intricate matha patti and ceremonial makeup'
  },
  // Catering Gallery
  {
    filename: 'catering-g1.jpg',
    url: 'https://images.unsplash.com/photo-1560117531-2304cfbbe9f6?auto=format&fit=crop&w=1200&q=80',
    subject: 'Artisanal Indian wedding banquet spread and gourmet dishes'
  },
  {
    filename: 'catering-g2.jpg',
    url: 'https://images.unsplash.com/photo-1581546085212-f25477a9d4fb?auto=format&fit=crop&w=1200&q=80',
    subject: 'Royal banquet dining service and culinary spread'
  },
  // Photography Gallery
  {
    filename: 'photography-g1.jpg',
    url: 'https://images.unsplash.com/photo-1609085178848-b2de5927eda7?auto=format&fit=crop&w=1200&q=80',
    subject: 'Professional photographer capturing wedding moments with high-end camera lens'
  },
  {
    filename: 'photography-g2.jpg',
    url: 'https://images.unsplash.com/photo-1756143058493-2d14887e41e6?auto=format&fit=crop&w=1200&q=80',
    subject: 'Bride and groom during sunset editorial photoshoot session'
  },
  // Entertainment Gallery
  {
    filename: 'entertainment-g1.jpg',
    url: 'https://images.unsplash.com/photo-1570797803365-c6eb43b1f040?auto=format&fit=crop&w=1200&q=80',
    subject: 'High-energy celebratory dhol percussion at Indian wedding'
  },
  {
    filename: 'entertainment-g2.jpg',
    url: 'https://images.unsplash.com/photo-1676804899250-18a342d77e16?auto=format&fit=crop&w=1200&q=80',
    subject: 'Traditional Indian percussion and wedding instruments'
  },
  // Ceremonies Gallery
  {
    filename: 'ceremonies-g1.jpg',
    url: 'https://images.unsplash.com/photo-1741201864879-c5e7f81c98b0?auto=format&fit=crop&w=1200&q=80',
    subject: 'Bride and groom exchanging garlands and vows during sacred Hindu ceremony'
  },
  {
    filename: 'ceremonies-g2.jpg',
    url: 'https://images.unsplash.com/photo-1679937698873-6065742c8d32?auto=format&fit=crop&w=1200&q=80',
    subject: 'Couple preparing for sacred Vedic wedding havan ritual'
  },
  // Invitations Gallery
  {
    filename: 'invitations-g1.jpg',
    url: 'https://images.unsplash.com/photo-1712313992209-93a2cc377ede?auto=format&fit=crop&w=1200&q=80',
    subject: 'Luxury wedding card suite with satin bow and custom monogram'
  },
  {
    filename: 'invitations-g2.jpg',
    url: 'https://images.unsplash.com/photo-1612611450392-826af708c34a?auto=format&fit=crop&w=1200&q=80',
    subject: 'Handcrafted floral stationery and custom wedding invite details'
  },
];

async function run() {
  for (const asset of galleryAssets) {
    const dest = path.join(ASSETS_DIR, asset.filename);
    try {
      await downloadImage(asset.url, dest);
    } catch (e) {
      console.error(`Failed ${asset.filename}:`, e.message);
    }
  }
  console.log('Finished downloading gallery supporting assets.');
}

run();
