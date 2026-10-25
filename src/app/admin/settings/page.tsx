import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { RoyalAtelierCompassIcon } from '@/components/admin/icons/RoyalAdminIcons';
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#2E1A1E] to-[#120B0D] border border-[#D6B56D]/35 flex items-center justify-center text-[#D6B56D] shadow-[0_0_16px_rgba(214,181,109,0.1)]">
              <RoyalAtelierCompassIcon size={22} className="text-[#D6B56D]" />
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
