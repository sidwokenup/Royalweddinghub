import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Star, ArrowLeft } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import {
  TestimonialsManagerClient,
  AdminTestimonial,
} from '@/components/admin/testimonials/TestimonialsManagerClient';

async function fetchTestimonials(): Promise<AdminTestimonial[]> {
  const db = getAdminDb();

  if (isDatabaseConfigured() && db) {
    try {
      const { data, error } = await db
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as AdminTestimonial[];
      }
    } catch (err) {
      console.warn('[Admin Testimonials] Supabase fetch error:', err);
    }
  }

  return [];
}

export default async function AdminTestimonialsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const testimonials = await fetchTestimonials();

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE4D9]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C8070] mb-1 font-mono">
            <Link
              href="/admin"
              className="hover:text-[#521D2B] transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-[#85662F] font-medium">Verified Stories</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans text-[#1C1611] font-bold tracking-tight flex items-center gap-3">
            <Star className="w-6 h-6 text-[#85662F]" strokeWidth={1.5} />
            <span>Client Reviews & Verified Testimonials</span>
          </h1>
          <p className="text-xs text-[#5C5245] mt-1 font-light">
            Manage feedback with strict privacy guardrails and legal consent validation before publishing.
          </p>
        </div>
      </div>

      {/* Testimonials Manager */}
      <TestimonialsManagerClient initialTestimonials={testimonials} />
    </div>
  );
}
