export interface ServiceDeliverable {
  title: string;
  description: string;
}

export interface ServiceSubcategory {
  name: string;
  detail: string;
  tag?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  categoryTag: string;
  shortDescription: string;
  headline: string;
  introCopy: string;
  image: string;
  galleryImages: string[];
  accentColor: string; // Tailored palette token
  bgSurface: string;   // For mobile panel & editorial contrast
  textOnBg: string;
  ctaText: string;
  externalLink?: string; // e.g. for venues linking to /venues
  deliverables: ServiceDeliverable[];
  subcategories: ServiceSubcategory[];
  featured?: boolean;
}
