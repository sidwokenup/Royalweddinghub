import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { RoyalInquiryScrollIcon } from '@/components/admin/icons/RoyalAdminIcons';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import {
  EnquiriesManagerClient,
  AdminEnquiry,
} from '@/components/admin/enquiries/EnquiriesManagerClient';

async function fetchEnquiries(): Promise<AdminEnquiry[]> {
  const db = getAdminDb();

  if (isDatabaseConfigured() && db) {
    try {
      const { data, error } = await db
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as AdminEnquiry[];
      }
    } catch (err) {
      console.warn('[Admin Enquiries] Supabase fetch error:', err);
    }
  }

  return [];
}

export default async function AdminEnquiriesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const enquiries = await fetchEnquiries();

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6B56D]/15">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C8070] mb-1 font-mono">
            <Link
              href="/admin"
              className="hover:text-[#D6B56D] transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
              <span>Dashboard</span>
            </Link>
            <span className="text-[#D6B56D]/40">/</span>
            <span className="text-[#D6B56D] font-medium">Inquiries CRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF7F2] font-normal tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#2E1A1E] to-[#120B0D] border border-[#D6B56D]/35 flex items-center justify-center text-[#D6B56D] shadow-[0_0_16px_rgba(214,181,109,0.1)]">
              <RoyalInquiryScrollIcon size={22} className="text-[#D6B56D]" />
            </div>
            <span>Client Inquiries &amp; Consultation Leads</span>
          </h1>
          <p className="text-xs text-[#B8ADA3] mt-1 font-light">
            Real-time pipeline of incoming wedding inquiries with instant WhatsApp triage, status workflows, and UTM tracking.
          </p>
        </div>
      </div>

      {/* Enquiries Pipeline Manager */}
      <EnquiriesManagerClient initialEnquiries={enquiries} />
    </div>
  );
}
