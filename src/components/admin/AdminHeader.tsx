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
    <header className="sticky top-0 z-30 h-20 bg-[#0d0b09]/90 border-b border-[#241f18] backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger & breadcrumb title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-[#9c8e7b] hover:text-[#faf6f0] hover:bg-[#1a1713] border border-[#2b241b] transition-colors"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-[#73685a]">Admin Portal</span>
          <span className="text-[#3d362d]">/</span>
          <span className="text-[#c5a880] font-medium tracking-wide">Command Center</span>
        </div>
      </div>

      {/* Right: DB status badge, public site link, user profile & logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Database Status Pill */}
        <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2b241b] bg-[#14110e] text-[11px] font-mono">
          <Database className="w-3.5 h-3.5 text-[#c5a880]" />
          <span className="text-[#a39686]">Database:</span>
          <span className="flex items-center gap-1.5 text-[#e0d6c8]">
            <span
              className={`w-2 h-2 rounded-full ${
                isDbConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'
              }`}
            />
            {isDbConnected ? 'Supabase Active' : 'Fallback Local'}
          </span>
        </div>

        {/* View Public Site Quick Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#c5a880] hover:text-[#f5f0eb] hover:bg-[#1c1813] border border-[#2e261d] transition-all"
          title="Open live website in new tab"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* User Mini Profile */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#241f18]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#997e59] to-[#c5a880] text-[#12100d] font-bold text-xs flex items-center justify-center shrink-0">
            {userFullName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium text-[#faf6f0] leading-none truncate max-w-[130px]">
              {userFullName}
            </div>
            <div className="text-[10px] text-[#8a7f70] tracking-wider uppercase font-mono mt-0.5">
              {userRole.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={isPending}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium text-[#a39686] hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/40 transition-all flex items-center gap-1.5 disabled:opacity-50"
          title="Sign out of administrative session"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="hidden sm:inline">{isPending ? 'Exiting...' : 'Sign Out'}</span>
        </button>
      </div>
    </header>
  );
}
