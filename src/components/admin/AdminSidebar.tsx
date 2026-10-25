'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  ExternalLink,
  Shield,
} from 'lucide-react';
import {
  RoyalPalaceIcon,
  RoyalInquiryScrollIcon,
  RoyalLotusCrestIcon,
  RoyalTestimonialSealIcon,
  RoyalGalleryFrameIcon,
  RoyalAtelierCompassIcon,
  RoyalConciergeOverviewIcon,
  RoyalMonogramCrest,
} from '@/components/admin/icons/RoyalAdminIcons';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userFullName?: string;
  userRole?: string;
}

const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/admin',
    exact: true,
    icon: RoyalConciergeOverviewIcon,
    badge: null,
  },
  {
    label: 'Venues Directory',
    href: '/admin/venues',
    exact: false,
    icon: RoyalPalaceIcon,
    badge: '32',
  },
  {
    label: 'Services & Disciplines',
    href: '/admin/services',
    exact: false,
    icon: RoyalLotusCrestIcon,
    badge: '8',
  },
  {
    label: 'Enquiries CRM',
    href: '/admin/enquiries',
    exact: false,
    icon: RoyalInquiryScrollIcon,
    badge: 'Leads',
  },
  {
    label: 'Testimonials',
    href: '/admin/testimonials',
    exact: false,
    icon: RoyalTestimonialSealIcon,
    badge: null,
  },
  {
    label: 'Media Library',
    href: '/admin/media',
    exact: false,
    icon: RoyalGalleryFrameIcon,
    badge: null,
  },
  {
    label: 'Business Settings',
    href: '/admin/settings',
    exact: false,
    icon: RoyalAtelierCompassIcon,
    badge: null,
  },
];

export function AdminSidebar({
  isOpen,
  onClose,
  userFullName = 'Administrator',
  userRole = 'super_admin',
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#140F0D]/95 border-r border-[#D6B56D]/15 backdrop-blur-2xl flex flex-col transition-transform duration-300 ease-out shadow-[0_0_35px_rgba(0,0,0,0.6)] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Crest & Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#D6B56D]/15 shrink-0 bg-[#140F0D]/80">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#521D2B] via-[#3D141F] to-[#240A12] border border-[#D6B56D]/40 text-[#D6B56D] flex items-center justify-center shadow-[0_2px_12px_rgba(82,29,43,0.4)] group-hover:scale-105 group-hover:border-[#D6B56D] transition-all">
              <RoyalMonogramCrest size={22} className="text-[#D6B56D]" />
            </div>
            <div>
              <span className="block font-serif text-sm tracking-tight text-[#FAF7F2] font-medium leading-tight">
                Royal Wedding Hub
              </span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-[#D6B56D] font-semibold mt-0.5 font-mono">
                Command Center
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-white/[0.06] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* User Card Mini */}
        <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#521D2B] to-[#8C2E46] border border-[#D6B56D]/30 text-[#FAF7F2] font-semibold text-xs flex items-center justify-center shadow-sm">
              {userFullName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-medium text-[#FAF7F2] truncate">{userFullName}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3 h-3 text-[#D6B56D]" />
                <span className="text-[10px] uppercase tracking-wider text-[#D6B56D] font-mono font-medium">
                  {userRole.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overscroll-contain">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C8070] font-mono">
            Concierge Modules
          </div>

          {NAV_ITEMS.map((item) => {
            const active = isLinkActive(item.href, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isOpen) onClose();
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-[#521D2B]/35 text-[#FAF7F2] font-semibold border-l-2 border-[#D6B56D] shadow-[0_0_15px_rgba(214,181,109,0.08)]'
                    : 'text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      active
                        ? 'bg-[#D6B56D]/15 text-[#D6B56D] border border-[#D6B56D]/30 shadow-[0_0_8px_rgba(214,181,109,0.15)]'
                        : 'text-[#8C8070] group-hover:text-[#D6B56D] group-hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      active
                        ? 'bg-[#521D2B] text-[#FAF7F2] border border-[#D6B56D]/30'
                        : 'bg-white/[0.06] text-[#D6B56D] border border-white/[0.06] group-hover:bg-white/[0.1]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info & View Public Site */}
        <div className="p-4 border-t border-[#D6B56D]/15 shrink-0 bg-[#140F0D]/90 space-y-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#FAF7F2] bg-white/[0.03] border border-[#D6B56D]/20 hover:bg-white/[0.07] hover:border-[#D6B56D]/50 transition-all shadow-sm"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
              <span className="font-medium">Live Website</span>
            </span>
            <span className="text-[10px] text-[#D6B56D]">↗</span>
          </Link>

          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-[#8C8070] font-mono">
            <span>RWH Concierge v1.0</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium">Edge Live</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
