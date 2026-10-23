import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import { ServiceFormClient, ServiceFormData } from '@/components/admin/services/ServiceFormClient';
import { SERVICES_DATA } from '@/data/services';

interface ServiceEditPageProps {
  params: Promise<{ id: string }>;
}

async function getServiceData(idOrSlug: string): Promise<ServiceFormData | null> {
  const db = getAdminDb();

  // 1. Try Supabase
  if (isDatabaseConfigured() && db) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const query = db.from('services').select('*');
      const { data: service, error } = isUuid
        ? await query.eq('id', idOrSlug).single()
        : await query.eq('slug', idOrSlug).single();

      if (!error && service) {
        // Fetch deliverables
        const { data: deliverables } = await db
          .from('service_deliverables')
          .select('title, description')
          .eq('service_id', service.id)
          .order('display_order', { ascending: true });

        // Fetch subcategories
        const { data: subcategories } = await db
          .from('service_subcategories')
          .select('name, detail, tag')
          .eq('service_id', service.id)
          .order('display_order', { ascending: true });

        return {
          id: service.id,
          name: service.name,
          slug: service.slug,
          category_tag: service.category_tag,
          headline: service.headline,
          short_description: service.short_description,
          intro_copy: service.intro_copy,
          cover_image_url: service.cover_image_url,
          accent_color: service.accent_color,
          bg_surface: service.bg_surface,
          text_on_bg: service.text_on_bg,
          cta_text: service.cta_text,
          external_link: service.external_link,
          is_featured: service.is_featured,
          is_published: service.is_published,
          deliverables: (deliverables || []).map((d) => ({
            title: d.title,
            description: d.description,
          })),
          subcategories: (subcategories || []).map((s) => ({
            name: s.name,
            detail: s.detail,
            tag: s.tag,
          })),
        };
      }
    } catch (err) {
      console.warn('[Admin Edit Service] Database fetch error, falling back:', err);
    }
  }

  // 2. Fallback to SERVICES_DATA
  const fallback = SERVICES_DATA.find((s) => s.slug === idOrSlug || s.id === idOrSlug);
  if (!fallback) return null;

  return {
    id: fallback.slug,
    name: fallback.name,
    slug: fallback.slug,
    category_tag: fallback.categoryTag,
    headline: fallback.headline,
    short_description: fallback.shortDescription,
    intro_copy: fallback.introCopy,
    cover_image_url: fallback.image,
    accent_color: fallback.accentColor,
    bg_surface: fallback.bgSurface,
    text_on_bg: fallback.textOnBg,
    cta_text: fallback.ctaText,
    external_link: fallback.externalLink,
    is_featured: !!fallback.featured,
    is_published: true,
    deliverables: fallback.deliverables.map((d) => ({
      title: d.title,
      description: d.description,
    })),
    subcategories: fallback.subcategories.map((sub) => ({
      name: sub.name,
      detail: sub.detail,
      tag: sub.tag,
    })),
  };
}

export default async function EditServicePage(props: ServiceEditPageProps) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const { id } = await props.params;
  const serviceData = await getServiceData(id);

  if (!serviceData) {
    notFound();
  }

  return <ServiceFormClient initialData={serviceData} />;
}
