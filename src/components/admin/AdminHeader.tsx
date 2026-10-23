'use client';

import React, { useTransition } from 'react';
import Link from 'next/link';
import { Menu, ExternalLink, LogOut, Database } from 'lucide-react';
import { logoutAdminAction } from '@/app/admin/login/actions';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  userFullName?: string;
  userRole?: string;
  isDbConnected?: boolean;
}

export function AdminHeader({
  onMenuToggle,
  userFullName = 'Administrator',
  userRole = 'super_admin',
  isDbConnected = true,
}: AdminHeaderProps) {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    if (confirm('Are you sure you want to end your administrative session?')) {
      startTransition(async () => {
        await logoutAdminAction();
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#FFFFFF]/90 border-b border-[#EAE4D9] backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shadow-[0_1px_3px_rgba(28,22,17,0.02)]">
      {/* Left: Mobile hamburger & breadcrumb title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2.5 rounded-xl text-[#5C5245] hover:text-[#1C1611] hover:bg-[#F8F5EE] border border-[#E2DAD0] transition-colors"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-[#8C8070] font-sans">Admin Portal</span>
          <span className="text-[#D4CBC0]">/</span>
          <span className="text-[#521D2B] font-semibold tracking-wide font-sans">Command Center</span>
        </div>
      </div>

      {/* Right: DB status badge, public site link, user profile & logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Database Status Pill */}
        <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EAE4D9] bg-[#F8F5EE] text-[11px] font-mono">
          <Database className="w-3.5 h-3.5 text-[#85662F]" />
          <span className="text-[#6E6354]">DB:</span>
          <span className="flex items-center gap-1.5 text-[#1C1611] font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                isDbConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {isDbConnected ? 'Connected' : 'Offline'}
          </span>
        </div>

        {/* View Public Site Quick Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#521D2B] bg-[#FDF9F0] hover:bg-[#F9F1DF] border border-[#E9DECA] transition-all shadow-2xs"
          title="Open live website in new tab"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#85662F]" />
        </Link>

        {/* User Mini Profile */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#EAE4D9]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#521D2B] to-[#7D293F] text-[#FAF6F0] font-semibold text-xs flex items-center justify-center shrink-0 shadow-2xs">
            {userFullName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-[#1C1611] leading-none truncate max-w-[130px]">
              {userFullName}
            </div>
            <div className="text-[10px] text-[#85662F] tracking-wider uppercase font-mono font-medium mt-0.5">
              {userRole.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={isPending}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium text-rose-800 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all flex items-center gap-1.5 disabled:opacity-50"
          title="Sign out of administrative session"
        >
          <LogOut className="w-4 h-4 text-rose-700" />
          <span className="hidden sm:inline">{isPending ? 'Exiting...' : 'Sign Out'}</span>
        </button>
      </div>
    </header>
  );
}
