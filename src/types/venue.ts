export interface VenueImage {
  url: string;
  localUrl: string | null;
  sourceUrl: string | null;
  width: number;
  height: number;
  alt: string;
}

export interface VenueCapacity {
  minPax: number | null;
  maxPax: number | null;
  capacity: number | null;
  rooms: number | null;
  raw: string | null;
}

export interface VenueFood {
  vegetarian: boolean;
  nonVegetarian: boolean;
  pricePerPlate: number | null;
  unit: string;
}

export interface Venue {
  id: string;
  slug: string;
  name: string;
  category: string;
  city: string;
  state: string;
  address: string;
  rating: number | null;
  reviewCount: number | null;
  capacity: VenueCapacity;
  food: VenueFood;
  amenities: string[];
  description: string | null;
  primaryImage: VenueImage;
  gallery: VenueImage[];
  detailUrl: string;
  source: {
    website: string;
  };
}

export type CapacityTier = "all" | "intimate" | "grand" | "royal";

export type VenueSortOption = "featured" | "name-asc" | "capacity-desc" | "capacity-asc" | "rating-desc";

export interface VenueFilterOptions {
  category?: string;
  search?: string;
  capacityTier?: CapacityTier;
  minRooms?: number;
  vegOnly?: boolean;
  sortBy?: VenueSortOption;
}
