import rawVenues from "@/data/venues.json";
import { Venue, VenueFilterOptions } from "@/types/venue";

export const VENUES_DATA: Venue[] = rawVenues as Venue[];

/**
 * Retrieve all wedding venues
 */
export function getAllVenues(): Venue[] {
  return VENUES_DATA;
}

/**
 * Retrieve a single venue by slug
 */
export function getVenueBySlug(slug: string): Venue | undefined {
  if (!slug) return undefined;
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  return VENUES_DATA.find((v) => v.slug.toLowerCase() === decoded);
}

/**
 * Get distinct categories with active venue counts
 */
export function getVenueCategories(): { name: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const v of VENUES_DATA) {
    const cat = v.category || "Other";
    counts[cat] = (counts[cat] || 0) + 1;
  }

  const list = Object.entries(counts).map(([name, count]) => ({
    name,
    count,
  }));

  // Sort by count descending
  return list.sort((a, b) => b.count - a.count);
}

/**
 * Deterministically pick an editorial spotlight venue with rich gallery
 */
export function getFeaturedVenue(): Venue {
  // Santorini Resort Lucknow or Vivanta Hotel Resort or Vsquare
  const premier = VENUES_DATA.find(
    (v) =>
      v.slug === "santorini-resort-lucknow" ||
      v.slug === "vivanta-hotel-resort" ||
      v.slug === "magnolia-garden-marriage-lawn"
  );
  return premier || VENUES_DATA[0];
}

/**
 * Filter and sort venues according to search and selection criteria
 */
export function filterAndSortVenues(
  venues: Venue[],
  options: VenueFilterOptions = {}
): Venue[] {
  const {
    category = "all",
    search = "",
    capacityTier = "all",
    minRooms = 0,
    vegOnly = false,
    sortBy = "featured",
  } = options;

  let filtered = [...venues];

  // 1. Category Filter
  if (category && category !== "all") {
    filtered = filtered.filter(
      (v) => v.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 2. Search Filter (name, address, city, amenities)
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.address.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.amenities.some((a) => a.toLowerCase().includes(q))
    );
  }

  // 3. Capacity Tier Filter
  if (capacityTier && capacityTier !== "all") {
    filtered = filtered.filter((v) => {
      const max = v.capacity.maxPax ?? v.capacity.capacity ?? 0;
      switch (capacityTier) {
        case "intimate":
          return max > 0 && max <= 300;
        case "grand":
          return max > 300 && max <= 1000;
        case "royal":
          return max > 1000;
        default:
          return true;
      }
    });
  }

  // 4. Min Rooms Filter
  if (minRooms > 0) {
    filtered = filtered.filter(
      (v) => v.capacity.rooms !== null && v.capacity.rooms >= minRooms
    );
  }

  // 5. Veg Only Filter
  if (vegOnly) {
    filtered = filtered.filter((v) => v.food.vegetarian && !v.food.nonVegetarian);
  }

  // 6. Sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "capacity-desc": {
        const capA = a.capacity.maxPax ?? a.capacity.capacity ?? 0;
        const capB = b.capacity.maxPax ?? b.capacity.capacity ?? 0;
        return capB - capA;
      }
      case "capacity-asc": {
        const capA = a.capacity.minPax ?? a.capacity.capacity ?? 0;
        const capB = b.capacity.minPax ?? b.capacity.capacity ?? 0;
        return capA - capB;
      }
      case "rating-desc": {
        const ratA = a.rating ?? 0;
        const ratB = b.rating ?? 0;
        return ratB - ratA;
      }
      case "featured":
      default: {
        // Prioritize venues with richer galleries and rooms
        const scoreA = (a.gallery?.length || 0) * 2 + (a.capacity.rooms || 0);
        const scoreB = (b.gallery?.length || 0) * 2 + (b.capacity.rooms || 0);
        return scoreB - scoreA;
      }
    }
  });

  return filtered;
}

/**
 * Format capacity cleanly without displaying null
 */
export function formatPaxRange(capacity: Venue["capacity"]): string {
  if (capacity.minPax && capacity.maxPax) {
    if (capacity.minPax === capacity.maxPax) {
      return `${capacity.minPax} Guests`;
    }
    return `${capacity.minPax} – ${capacity.maxPax} Guests`;
  }
  if (capacity.capacity) {
    return `Up to ${capacity.capacity} Guests`;
  }
  if (capacity.raw) {
    return capacity.raw;
  }
  return "Bespoke Capacity";
}

/**
 * Format rooms count cleanly
 */
export function formatRooms(rooms: number | null): string | null {
  if (!rooms || rooms <= 0) return null;
  return `${rooms} ${rooms === 1 ? "Room" : "Rooms"}`;
}

/**
 * Format price cleanly without inventing values
 */
export function formatPrice(food: Venue["food"]): string {
  if (food.pricePerPlate && food.pricePerPlate > 0) {
    return `From ₹${food.pricePerPlate.toLocaleString("en-IN")}/plate`;
  }
  return "Price on Request";
}

/**
 * Clean locality/neighborhood from address
 */
export function formatLocality(address: string, city = "Lucknow"): string {
  if (!address) return city;
  // If address contains landmark or area before Lucknow
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length > 1) {
    // Return landmark or area
    const area = parts.find(
      (p) =>
        p.toLowerCase() !== "lucknow" &&
        p.toLowerCase() !== "uttar pradesh" &&
        !p.match(/^\d{6}$/) &&
        p.length < 35
    );
    if (area) return `${area}, ${city}`;
  }
  return city;
}
