'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Sparkles,
  MessageSquareText,
  Star,
  Image as ImageIcon,
  Settings,
  X,
  ExternalLink,
  Shield,
} from 'lucide-react';

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
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: 'Venues Directory',
    href: '/admin/venues',
    exact: false,
    icon: Building2,
    badge: '32',
  },
  {
    label: 'Services & Disciplines',
    href: '/admin/services',
    exact: false,
    icon: Sparkles,
    badge: '8',
  },
  {
    label: 'Enquiries CRM',
    href: '/admin/enquiries',
    exact: false,
    icon: MessageSquareText,
    badge: 'Leads',
  },
  {
    label: 'Testimonials',
    href: '/admin/testimonials',
    exact: false,
    icon: Star,
    badge: null,
  },
  {
    label: 'Media Library',
    href: '/admin/media',
    exact: false,
    icon: ImageIcon,
    badge: null,
  },
  {
    label: 'Business Settings',
    href: '/admin/settings',
    exact: false,
    icon: Settings,
    badge: null,
  },
];

export function AdminSidebar({ isOpen, onClose, userFullName = 'Administrator', userRole = 'super_admin' }: AdminSidebarProps) {
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
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0d0b09] border-r border-[#241f18] flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Crest & Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#241f18] shrink-0">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a241c] to-[#12100d] border border-[#c5a880]/40 flex items-center justify-center shadow-[0_0_15px_rgba(197,168,128,0.15)] group-hover:border-[#c5a880] transition-colors">
              <Sparkles className="w-5 h-5 text-[#c5a880]" />
            </div>
            <div>
              <span className="block font-serif text-base tracking-wide text-[#faf6f0] font-medium leading-none">
                Royal Wedding
              </span>
              <span className="block text-[11px] uppercase tracking-widest text-[#9c8e7b] mt-1 font-sans">
                Concierge Admin
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-[#9c8e7b] hover:text-[#faf6f0] hover:bg-[#1a1713] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card Mini */}
        <div className="px-5 py-4 border-b border-[#1f1a14] bg-[#12100d]/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#997e59] to-[#c5a880] text-[#12100d] font-bold text-xs flex items-center justify-center shadow-sm">
              {userFullName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-medium text-[#f0e9df] truncate">{userFullName}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3 h-3 text-[#c5a880]" />
                <span className="text-[10px] uppercase tracking-wider text-[#c5a880] font-mono">
                  {userRole.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overscroll-contain">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#73685a]">
            Navigation
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
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  active
                    ? 'bg-[#221c15] text-[#f5f0eb] border border-[#c5a880]/30 shadow-[0_2px_12px_rgba(0,0,0,0.4)]'
                    : 'text-[#a39686] hover:text-[#faf6f0] hover:bg-[#16130f]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? 'text-[#c5a880]' : 'text-[#7d7263] group-hover:text-[#c5a880]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      active
                        ? 'bg-[#c5a880] text-[#12100d]'
                        : 'bg-[#1e1a14] text-[#8a7e6e] group-hover:text-[#c5a880]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#c5a880] rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info & View Public Site */}
        <div className="p-4 border-t border-[#241f18] shrink-0 bg-[#0d0b09] space-y-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#c5a880] bg-[#16130f] border border-[#2b241b] hover:bg-[#201a14] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Public Website</span>
            </span>
            <span className="text-[10px] text-[#827463]">↗</span>
          </Link>

          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-[#5e5446]">
            <span>RoyalWeddingHub v1.0</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Edge Ready</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
