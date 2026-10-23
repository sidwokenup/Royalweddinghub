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
            <span className="text-[#c5a880]">System Operations</span>
          </div>

          <h1 className="text-2xl font-serif text-[#faf6f0] font-normal tracking-wide flex items-center gap-3">
            <Settings className="w-6 h-6 text-[#c5a880]" />
            <span>Business Configuration & Edge Settings</span>
          </h1>
          <p className="text-xs text-[#8a7f70] mt-1 font-light">
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
