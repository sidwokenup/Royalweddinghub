'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Layers,
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
    icon: Layers,
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
          className="fixed inset-0 z-40 bg-[#1C1611]/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#FFFFFF] border-r border-[#EAE4D9] flex flex-col transition-transform duration-300 ease-out shadow-[0_0_24px_rgba(28,22,17,0.04)] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Crest & Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#EAE4D9] shrink-0 bg-[#FFFFFF]">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#521D2B] to-[#38111B] text-[#FAF6F0] flex items-center justify-center shadow-[0_2px_8px_rgba(82,29,43,0.25)] group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-[#E6C994]" strokeWidth={1.5} />
            </div>
            <div>
              <span className="block font-sans text-sm tracking-tight text-[#1C1611] font-bold leading-tight">
                Royal Wedding Hub
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-[#85662F] font-semibold mt-0.5 font-mono">
                Admin Center
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-[#7A6E5F] hover:text-[#1C1611] hover:bg-[#F8F5EE] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* User Card Mini */}
        <div className="px-5 py-3.5 border-b border-[#F0ECE1] bg-[#FDFBF7] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#521D2B] to-[#7D293F] text-[#FAF6F0] font-semibold text-xs flex items-center justify-center shadow-sm">
              {userFullName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-[#1C1611] truncate">{userFullName}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3 h-3 text-[#85662F]" />
                <span className="text-[10px] uppercase tracking-wider text-[#85662F] font-mono font-medium">
                  {userRole.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overscroll-contain">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#9E9282]">
            Menu
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
                    ? 'bg-[#F9F4E8] text-[#521D2B] font-semibold border-l-4 border-[#521D2B] shadow-[0_1px_4px_rgba(82,29,43,0.06)]'
                    : 'text-[#5C5245] hover:text-[#1C1611] hover:bg-[#F8F5EE]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? 'text-[#521D2B]' : 'text-[#8C8070] group-hover:text-[#521D2B]'
                    }`}
                    strokeWidth={1.5}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      active
                        ? 'bg-[#521D2B] text-[#FFFFFF]'
                        : 'bg-[#EFE8DA] text-[#705527] group-hover:bg-[#E6DEC9]'
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
        <div className="p-4 border-t border-[#EAE4D9] shrink-0 bg-[#FFFFFF] space-y-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#521D2B] bg-[#FDF9F0] border border-[#E9DECA] hover:bg-[#F9F1DF] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#85662F]" strokeWidth={1.5} />
              <span className="font-medium">Live Website</span>
            </span>
            <span className="text-[10px] text-[#85662F]">↗</span>
          </Link>

          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-[#8C8070]">
            <span>RoyalWeddingHub v1.0</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-700 font-medium">Edge Ready</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
