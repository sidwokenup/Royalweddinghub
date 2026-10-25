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
    <header className="sticky top-0 z-30 h-20 bg-[#140F0D]/85 border-b border-[#D6B56D]/15 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      {/* Left: Mobile hamburger & breadcrumb title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2.5 rounded-xl text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-white/[0.06] border border-[#D6B56D]/20 transition-colors"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5 text-[#D6B56D]" strokeWidth={1.5} />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-[#8C8070] font-mono uppercase tracking-wider text-[11px]">Concierge Portal</span>
          <span className="text-[#D6B56D]/40">/</span>
          <span className="text-[#FAF7F2] font-medium tracking-wide font-serif">Command Center</span>
        </div>
      </div>

      {/* Right: DB status badge, public site link, user profile & logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Database Status Pill */}
        <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D6B56D]/20 bg-white/[0.03] text-[11px] font-mono backdrop-blur-sm">
          <Database className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
          <span className="text-[#8C8070]">DB:</span>
          <span className="flex items-center gap-1.5 text-[#FAF7F2] font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                isDbConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
              }`}
            />
            {isDbConnected ? 'Live & Synced' : 'Offline'}
          </span>
        </div>

        {/* View Public Site Quick Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#FAF7F2] bg-white/[0.03] hover:bg-white/[0.07] border border-[#D6B56D]/25 hover:border-[#D6B56D]/50 transition-all shadow-xs"
          title="Open live website in new tab"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
        </Link>

        {/* User Mini Profile */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#D6B56D]/15">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#521D2B] to-[#8C2E46] border border-[#D6B56D]/40 text-[#FAF7F2] font-semibold text-xs flex items-center justify-center shrink-0 shadow-sm font-sans">
            {userFullName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium text-[#FAF7F2] leading-none truncate max-w-[130px]">
              {userFullName}
            </div>
            <div className="text-[10px] text-[#D6B56D] tracking-wider uppercase font-mono font-medium mt-0.5">
              {userRole.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={isPending}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-200 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 hover:border-rose-800/70 transition-all flex items-center gap-1.5 disabled:opacity-50"
          title="Sign out of administrative session"
        >
          <LogOut className="w-4 h-4 text-rose-400" strokeWidth={1.5} />
          <span className="hidden sm:inline">{isPending ? 'Exiting...' : 'Sign Out'}</span>
        </button>
      </div>
    </header>
  );
}
