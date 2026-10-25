import { getAdminDb, isDatabaseConfigured } from "@/lib/db/client";
import { TestimonialItem, VERIFIED_TESTIMONIALS } from "@/data/testimonials";

export async function getLiveTestimonials(): Promise<TestimonialItem[]> {
  if (isDatabaseConfigured()) {
    const db = getAdminDb();
    if (db) {
      try {
        const { data, error } = await db
          .from("testimonials")
          .select("*")
          .eq("is_published", true)
          .eq("client_consent_recorded", true)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return data.map((t: any) => ({
            id: t.id,
            coupleNames: t.couple_names,
            celebrationType: t.celebration_type,
            location: t.location,
            quote: t.quote,
            fullStory: t.full_story || undefined,
            weddingSeason: t.wedding_season || undefined,
            verified: t.verified,
            featured: t.featured,
            source: t.source,
          }));
        }
      } catch (err) {
        console.warn("[Testimonials Dual-Read] Fetch error, using fallback:", err);
      }
    }
  }
  return VERIFIED_TESTIMONIALS;
}
