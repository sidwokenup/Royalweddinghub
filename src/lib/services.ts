import { SERVICES_DATA } from "@/data/services";
import { ServiceItem } from "@/types/service";
import { getAdminDb, isDatabaseConfigured } from "@/lib/db/client";

export function getServices(): ServiceItem[] {
  return SERVICES_DATA;
}

export function getFeaturedServices(): ServiceItem[] {
  return SERVICES_DATA.filter((s) => s.featured);
}

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return SERVICES_DATA.find((s) => s.slug === slug);
}

export function getRelatedServices(currentSlug: string, limit = 3): ServiceItem[] {
  return SERVICES_DATA.filter((s) => s.slug !== currentSlug).slice(0, limit);
}

/**
 * Maps a database service record to the public ServiceItem interface
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbServiceToPublic(s: any, deliverables: any[] = [], subcategories: any[] = []): ServiceItem {
  return {
    id: s.slug,
    slug: s.slug,
    name: s.name,
    categoryTag: s.category_tag,
    shortDescription: s.short_description,
    headline: s.headline,
    introCopy: s.intro_copy,
    image: s.cover_image_url,
    galleryImages: [s.cover_image_url],
    accentColor: s.accent_color,
    bgSurface: s.bg_surface,
    textOnBg: s.text_on_bg,
    ctaText: s.cta_text,
    externalLink: s.external_link || undefined,
    deliverables: deliverables.map((d) => ({
      title: d.title,
      description: d.description,
    })),
    subcategories: subcategories.map((sub) => ({
      name: sub.name,
      detail: sub.detail,
      tag: sub.tag || undefined,
    })),
    featured: s.is_featured,
  };
}

/**
 * Retrieve live published services from database with automatic fallback
 */
export async function getLiveServices(): Promise<ServiceItem[]> {
  if (isDatabaseConfigured()) {
    const db = getAdminDb();
    if (db) {
      try {
        const { data: services, error } = await db
          .from("services")
          .select("*, service_deliverables(*), service_subcategories(*)")
          .eq("is_published", true)
          .order("display_order", { ascending: true });

        if (!error && services && services.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return services.map((s: any) =>
            mapDbServiceToPublic(s, s.service_deliverables || [], s.service_subcategories || [])
          );
        }
      } catch (err) {
        console.warn("[Services Dual-Read] Database query failed, using static fallback:", err);
      }
    }
  }

  return getServices();
}

/**
 * Retrieve live single service by slug with automatic fallback
 */
export async function getLiveServiceBySlug(slug: string): Promise<ServiceItem | undefined> {
  if (isDatabaseConfigured()) {
    const db = getAdminDb();
    if (db) {
      try {
        const { data: service, error } = await db
          .from("services")
          .select("*, service_deliverables(*), service_subcategories(*)")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();

        if (!error && service) {
          return mapDbServiceToPublic(
            service,
            service.service_deliverables || [],
            service.service_subcategories || []
          );
        }
      } catch (err) {
        console.warn("[Service Dual-Read] Single service query failed, using static fallback:", err);
      }
    }
  }

  return getServiceBySlug(slug);
}
