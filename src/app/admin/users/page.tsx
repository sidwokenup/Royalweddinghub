import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { getAdminUsersAction } from './actions';
import { UsersManagerClient } from '@/components/admin/users/UsersManagerClient';

export const metadata: Metadata = {
  title: 'Team & Access Control | Royal Wedding Hub Admin',
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  // Strictly enforce Super Admin access
  if (admin.role !== 'super_admin') {
    redirect('/admin');
  }

  const res = await getAdminUsersAction();
  const initialUsers = res.users || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6B56D]/15">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8C8070] mb-1 font-mono">
            <Link
              href="/admin"
              className="hover:text-[#D6B56D] transition-colors flex items-center gap-1 font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
              <span>Dashboard</span>
            </Link>
            <span className="text-[#D6B56D]/40">/</span>
            <span className="text-[#D6B56D] font-medium font-sans">Team Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF7F2] font-normal tracking-tight">
            Team & Access Control
          </h1>
        </div>
      </div>

      <UsersManagerClient
        initialUsers={initialUsers}
        currentUserId={admin.userId}
      />
    </div>
  );
}

