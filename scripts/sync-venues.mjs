import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const scraperJsonPath = path.join(rootDir, "blinkwed-venue-scraper", "data", "json", "venues.json");
const scraperImagesDir = path.join(rootDir, "blinkwed-venue-scraper", "data", "images");
const publicVenuesDir = path.join(rootDir, "public", "venues");
const outputJsonPath = path.join(rootDir, "src", "data", "venues.json");

console.log("==> Starting Venue Data & Asset Sync...");

if (!fs.existsSync(scraperJsonPath)) {
  console.error("Error: Scraper venues.json not found at:", scraperJsonPath);
  process.exit(1);
}

const rawData = JSON.parse(fs.readFileSync(scraperJsonPath, "utf-8"));
const scraperVenues = rawData.venues || [];

console.log(`Found ${scraperVenues.length} venues in scraper dataset.`);

// Ensure public/venues and src/data exist
fs.mkdirSync(publicVenuesDir, { recursive: true });
fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true });

let totalImagesCopied = 0;

const processedVenues = scraperVenues.map((venue) => {
  const slug = venue.slug;
  const sourceVenueDir = path.join(scraperImagesDir, slug);
  const targetVenueDir = path.join(publicVenuesDir, slug);

  let hasLocalDir = fs.existsSync(sourceVenueDir);
  if (hasLocalDir) {
    fs.mkdirSync(targetVenueDir, { recursive: true });
  }

  // Helper to copy file and return public web path
  function syncImage(imgObj, fallbackName) {
    if (!imgObj || !imgObj.source_url) return null;

    let publicWebPath = null;
    let localSrcPath = imgObj.local_path;

    // If local_path exists in scraper data and file is on disk
    if (localSrcPath && fs.existsSync(localSrcPath)) {
      const fileName = path.basename(localSrcPath);
      const destFile = path.join(targetVenueDir, fileName);
      if (!fs.existsSync(destFile)) {
        fs.copyFileSync(localSrcPath, destFile);
      }
      publicWebPath = `/venues/${slug}/${fileName}`;
      totalImagesCopied++;
    } else if (hasLocalDir) {
      // Check if fallback file exists in source venue dir
      const candidateFiles = fs.readdirSync(sourceVenueDir);
      const match = candidateFiles.find((f) => f.startsWith(fallbackName));
      if (match) {
        const destFile = path.join(targetVenueDir, match);
        if (!fs.existsSync(destFile)) {
          fs.copyFileSync(path.join(sourceVenueDir, match), destFile);
        }
        publicWebPath = `/venues/${slug}/${match}`;
        totalImagesCopied++;
      }
    }

    return {
      url: publicWebPath || imgObj.source_url,
      localUrl: publicWebPath,
      sourceUrl: imgObj.source_url,
      width: imgObj.width || 1280,
      height: imgObj.height || 800,
      alt: `${venue.name} wedding venue in Lucknow`,
    };
  }

  // Process Thumbnail
  const thumbnail = syncImage(venue.thumbnail, "thumbnail");

  // Process Gallery
  const gallery = [];
  if (Array.isArray(venue.gallery)) {
    venue.gallery.forEach((g, idx) => {
      const gItem = syncImage(g, `gallery_${String(idx + 1).padStart(3, "0")}`);
      if (gItem) {
        gallery.push(gItem);
      }
    });
  }

  // Ensure thumbnail is always valid or uses first gallery image
  const primaryImage = thumbnail || gallery[0] || {
    url: "/images/hero-fallback.jpg",
    localUrl: null,
    sourceUrl: null,
    width: 1280,
    height: 800,
    alt: `${venue.name} - Luxury Wedding Venue`,
  };

  // Deduplicate gallery and exclude primary image
  const uniqueGallery = gallery.filter((item, index, self) =>
    item.url &&
    item.url !== primaryImage.url &&
    index === self.findIndex((t) => t.url === item.url)
  );

  // Determine starting price string cleanly
  let pricePerPlate = null;
  if (venue.food?.vegetarian_price && venue.food.vegetarian_price > 0) {
    pricePerPlate = venue.food.vegetarian_price;
  } else if (venue.food?.non_vegetarian_price && venue.food.non_vegetarian_price > 0) {
    pricePerPlate = venue.food.non_vegetarian_price;
  }

  return {
    id: venue.id || slug,
    slug: slug,
    name: venue.name,
    category: venue.category || "Wedding Venue",
    city: venue.city || "Lucknow",
    state: venue.state || "Uttar Pradesh",
    address: venue.address || `${venue.name}, Lucknow, Uttar Pradesh`,
    rating: venue.rating || null,
    reviewCount: venue.review_count || null,
    capacity: {
      minPax: venue.capacity?.min_pax || null,
      maxPax: venue.capacity?.max_pax || null,
      capacity: venue.capacity?.capacity || null,
      rooms: venue.capacity?.rooms || null,
      raw: venue.capacity?.capacity_raw || null,
    },
    food: {
      vegetarian: venue.food?.vegetarian ?? true,
      nonVegetarian: venue.food?.non_vegetarian ?? true,
      pricePerPlate: pricePerPlate,
      unit: venue.food?.price_unit || "per_plate",
    },
    amenities: Array.isArray(venue.amenities) ? venue.amenities : [],
    description: venue.description || null,
    primaryImage: primaryImage,
    gallery: uniqueGallery,
    detailUrl: venue.detail_url,
    source: venue.source || { website: "BlinkWed" },
  };
});

fs.writeFileSync(outputJsonPath, JSON.stringify(processedVenues, null, 2), "utf-8");

console.log(`==> Successfully synced ${processedVenues.length} venues to src/data/venues.json`);
console.log(`==> Assets copied to public/venues/: ${totalImagesCopied} image references`);
