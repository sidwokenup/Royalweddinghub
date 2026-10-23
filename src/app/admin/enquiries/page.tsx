import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MessageSquareText, ArrowLeft } from 'lucide-react';
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
            <span className="text-[#c5a880]">Inquiries CRM</span>
          </div>
          <h1 className="text-2xl font-serif text-[#faf6f0] font-normal tracking-wide flex items-center gap-3">
            <MessageSquareText className="w-6 h-6 text-[#c5a880]" />
            <span>Client Inquiries & Consultation Leads</span>
          </h1>
          <p className="text-xs text-[#8a7f70] mt-1 font-light">
            Real-time pipeline of incoming wedding inquiries with WhatsApp direct action, status workflows, and UTM tracking.
          </p>
        </div>
      </div>

      {/* Enquiries Pipeline Manager */}
      <EnquiriesManagerClient initialEnquiries={enquiries} />
    </div>
  );
}
