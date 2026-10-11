export interface TestimonialItem {
  id: string;
  coupleNames: string;
  celebrationType: string;
  location: string;
  quote: string;
  fullStory?: string;
  weddingSeason?: string;
  verified: boolean;
  featured?: boolean;
  source?: string;
}

/**
 * SOURCE OF TRUTH FOR CUSTOMER STORIES & REVIEWS:
 * 
 * Strict Editorial Policy:
 * In accordance with client privacy standards, no fabricated quotes, fake names,
 * or invented reviews are published.
 * 
 * To add verified reviews: add client-approved records to this array.
 * When empty, the UI gracefully renders the private reflections & discretion card.
 */
export const VERIFIED_TESTIMONIALS: TestimonialItem[] = [];
