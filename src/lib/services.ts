import { SERVICES_DATA } from "@/data/services";
import { ServiceItem } from "@/types/service";

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
