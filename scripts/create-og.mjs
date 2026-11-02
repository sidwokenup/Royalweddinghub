import sharp from 'sharp';
import fs from 'fs';

async function createOgImage() {
  const width = 1200;
  const height = 630;

  // Resize trimmed logo to fit gracefully in the center
  const logoBuffer = await sharp('C:/Users/acer/Downloads/logo (3).png')
    .trim()
    .resize(460, 320, { fit: 'inside' })
    .toBuffer();

  const logoMeta = await sharp(logoBuffer).metadata();
  const logoLeft = Math.round((width - logoMeta.width) / 2);
  const logoTop = 100;

  // SVG background with royal gradients, elegant framing brackets and subtle typography
  const svgOverlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#2a1c12" stop-opacity="0.9" />
          <stop offset="60%" stop-color="#140d09" stop-opacity="0.98" />
          <stop offset="100%" stop-color="#080504" stop-opacity="1" />
        </radialGradient>
        <radialGradient id="goldAura" cx="50%" cy="42%" r="35%">
          <stop offset="0%" stop-color="#c89b4b" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#c89b4b" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Royal Background Fill -->
      <rect width="${width}" height="${height}" fill="url(#bgGlow)" />

      <!-- Golden Subtle Ambient Aura behind logo -->
      <circle cx="600" cy="260" r="320" fill="url(#goldAura)" />

      <!-- Outer Luxury Gold Framing Border -->
      <rect x="36" y="36" width="1128" height="558" fill="none" stroke="#d4af37" stroke-width="1.2" stroke-opacity="0.35" rx="2" />
      <rect x="44" y="44" width="1112" height="542" fill="none" stroke="#d4af37" stroke-width="0.6" stroke-opacity="0.2" rx="2" />

      <!-- Four Royal Corner Flourish Accents -->
      <path d="M 36,56 L 56,36 M 36,36 L 62,36 M 36,36 L 36,62" stroke="#d4af37" stroke-width="1.8" stroke-opacity="0.6" fill="none" />
      <path d="M 1164,56 L 1144,36 M 1164,36 L 1138,36 M 1164,36 L 1164,62" stroke="#d4af37" stroke-width="1.8" stroke-opacity="0.6" fill="none" />
      <path d="M 36,574 L 56,594 M 36,594 L 62,594 M 36,594 L 36,568" stroke="#d4af37" stroke-width="1.8" stroke-opacity="0.6" fill="none" />
      <path d="M 1164,574 L 1144,594 M 1164,594 L 1138,594 M 1164,594 L 1164,568" stroke="#d4af37" stroke-width="1.8" stroke-opacity="0.6" fill="none" />

      <!-- Brand Title & Tagline -->
      <text x="600" y="468" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="36" font-weight="600" fill="#f5eedf" letter-spacing="8">ROYAL WEDDING HUB</text>
      <line x1="440" y1="490" x2="760" y2="490" stroke="#c89b4b" stroke-width="1" stroke-opacity="0.5" />
      
      <text x="600" y="522" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="400" fill="#c8baa7" letter-spacing="4">LUXURY WEDDING PLANNER &amp; CURATED HERITAGE VENUES IN LUCKNOW</text>
      <text x="600" y="554" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="500" fill="#c89b4b" letter-spacing="3">WWW.ROYALWEDDINGHUB.COM</text>
    </svg>
  `);

  // Composite background with logo
  await sharp(svgOverlay)
    .composite([
      {
        input: logoBuffer,
        top: logoTop,
        left: logoLeft,
      }
    ])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile('public/og-image.jpg');

  // Duplicate to src/app/opengraph-image.jpg
  fs.copyFileSync('public/og-image.jpg', 'src/app/opengraph-image.jpg');
  console.log('Successfully generated public/og-image.jpg and src/app/opengraph-image.jpg');
}

createOgImage().catch(console.error);
