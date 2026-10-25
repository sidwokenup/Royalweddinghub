import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Settings, ArrowLeft } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { isDatabaseConfigured } from '@/lib/db/client';
import { SettingsClient } from '@/components/admin/settings/SettingsClient';

export const metadata: Metadata = {
  title: 'Business & Edge Settings | Royal Wedding Hub Admin',
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const isDbConnected = isDatabaseConfigured();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
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
            <span className="text-[#D6B56D] font-medium font-sans">System Operations</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF7F2] tracking-wide flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D6B56D]/10 border border-[#D6B56D]/30 flex items-center justify-center text-[#D6B56D]">
              <Settings className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <span>Business Configuration & Edge Settings</span>
          </h1>
          <p className="text-xs text-[#B8ADA3] mt-1 font-light">
            Manage global concierge coordinates, trigger on-demand CDN cache purges, and inspect resilience status.
          </p>
        </div>
      </div>

      <SettingsClient
        isDbConnected={isDbConnected}
        adminEmail={admin.email}
        adminRole={admin.role}
      />
    </div>
  );
}
