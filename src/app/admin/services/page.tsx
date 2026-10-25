import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { RoyalLotusCrestIcon } from '@/components/admin/icons/RoyalAdminIcons';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import { ServiceTableClient, AdminServiceRow } from '@/components/admin/services/ServiceTableClient';
import { SERVICES_DATA } from '@/data/services';

async function fetchServicesForAdmin(): Promise<AdminServiceRow[]> {
  const db = getAdminDb();

  if (isDatabaseConfigured() && db) {
    try {
      const { data, error } = await db
        .from('services')
        .select(`
          id,
          slug,
          name,
          category_tag,
          headline,
          cover_image_url,
          is_featured,
          is_published,
          service_deliverables(count),
          service_subcategories(count)
        `)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.map((s: any) => ({
          id: s.id,
          slug: s.slug,
          name: s.name,
          category_tag: s.category_tag,
          headline: s.headline,
          cover_image_url: s.cover_image_url,
          is_featured: s.is_featured,
          is_published: s.is_published,
          deliverables_count: s.service_deliverables?.[0]?.count || 4,
          subcategories_count: s.service_subcategories?.[0]?.count || 4,
        }));
      }
    } catch (err) {
      console.warn('[Admin Services] Database fetch error, falling back:', err);
    }
  }

  // Fallback to static SERVICES_DATA
  return SERVICES_DATA.map((s) => ({
    id: s.slug,
    slug: s.slug,
    name: s.name,
    category_tag: s.categoryTag,
    headline: s.headline,
    cover_image_url: s.image,
    is_featured: !!s.featured,
    is_published: true,
    deliverables_count: s.deliverables.length,
    subcategories_count: s.subcategories.length,
  }));
}

export default async function AdminServicesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const services = await fetchServicesForAdmin();

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6B56D]/15">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#B8ADA3]/70 mb-1.5 font-mono">
            <Link href="/admin" className="hover:text-[#D6B56D] transition-colors flex items-center gap-1 font-sans">
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Dashboard</span>
            </Link>
            <span className="text-[#D6B56D]/40">/</span>
            <span className="text-[#D6B56D] font-medium font-sans">Services & Disciplines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF7F2] tracking-wide flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#2E1A1E] to-[#120B0D] border border-[#D6B56D]/35 flex items-center justify-center text-[#D6B56D] shadow-[0_0_16px_rgba(214,181,109,0.1)]">
              <RoyalLotusCrestIcon size={22} className="text-[#D6B56D]" />
            </div>
            <span>Wedding Disciplines & Offerings</span>
          </h1>
          <p className="text-xs text-[#B8ADA3] mt-1 font-light">
            Manage headlines, deliverables, subcategory tags, and styling for Lucknow luxury wedding services.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <ServiceTableClient initialServices={services} />
    </div>
  );
}
