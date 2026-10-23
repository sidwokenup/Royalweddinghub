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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#241f18]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8a7f70] mb-1 font-mono">
            <Link
              href="/admin"
              className="hover:text-[#c5a880] transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-[#c5a880]">Verified Stories</span>
          </div>
          <h1 className="text-2xl font-serif text-[#faf6f0] font-normal tracking-wide flex items-center gap-3">
            <Star className="w-6 h-6 text-[#c5a880]" />
            <span>Client Reviews & Verified Testimonials</span>
          </h1>
          <p className="text-xs text-[#8a7f70] mt-1 font-light">
            Manage feedback with strict privacy guardrails and legal consent validation before publishing.
          </p>
        </div>
      </div>

      {/* Testimonials Manager */}
      <TestimonialsManagerClient initialTestimonials={testimonials} />
    </div>
  );
}
