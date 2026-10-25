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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6B56D]/15">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#B8ADA3]/70 mb-1.5 font-mono">
            <Link
              href="/admin"
              className="hover:text-[#D6B56D] transition-colors flex items-center gap-1 font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Dashboard</span>
            </Link>
            <span className="text-[#D6B56D]/40">/</span>
            <span className="text-[#D6B56D] font-medium font-sans">Verified Stories</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF7F2] tracking-wide flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D6B56D]/10 border border-[#D6B56D]/30 flex items-center justify-center text-[#D6B56D]">
              <Star className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <span>Client Reviews & Verified Testimonials</span>
          </h1>
          <p className="text-xs text-[#B8ADA3] mt-1 font-light">
            Manage feedback with strict privacy guardrails and legal consent validation before publishing.
          </p>
        </div>
      </div>

      {/* Testimonials Manager */}
      <TestimonialsManagerClient initialTestimonials={testimonials} />
    </div>
  );
}
