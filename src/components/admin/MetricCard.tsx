import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeType?: 'gold' | 'emerald' | 'amber' | 'neutral';
  icon: LucideIcon;
  href?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  badge,
  badgeType = 'gold',
  icon: Icon,
  href,
}: MetricCardProps) {
  const getBadgeStyles = () => {
    switch (badgeType) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 'neutral':
        return 'bg-[#F5F2EB] text-[#5C5245] border-[#E2DAD0]';
      case 'gold':
      default:
        return 'bg-[#FDF9F0] text-[#705527] border-[#E9DECA]';
    }
  };

  const Content = (
    <div className="relative group overflow-hidden rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-5 sm:p-6 transition-all duration-300 hover:border-[#85662F]/40 shadow-[0_1px_3px_rgba(28,22,17,0.03),0_4px_12px_-2px_rgba(28,22,17,0.03)] hover:shadow-[0_8px_24px_rgba(28,22,17,0.06)]">
      {/* Top subtle decorative ambient highlight on hover */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#85662F]/5 rounded-full blur-2xl group-hover:bg-[#85662F]/10 transition-all duration-300 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div className="p-3 rounded-xl bg-[#FDF9F0] border border-[#E9DECA] text-[#85662F] group-hover:scale-105 transition-transform duration-200 shadow-2xs">
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>

        {badge && (
          <span
            className={`text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full border ${getBadgeStyles()}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4 relative z-10 font-sans">
        <div className="text-2xl sm:text-3xl font-sans font-bold tabular-nums text-[#1C1611] tracking-tight">
          {value}
        </div>
        <div className="text-[11px] uppercase tracking-wider text-[#7A6E5F] mt-1 font-mono font-semibold">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-[#8C8070] mt-1.5 flex items-center gap-1 font-normal leading-relaxed">
            {subtitle}
          </div>
        )}
      </div>

      {href && (
        <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-xs font-semibold text-[#521D2B] group-hover:text-[#7D293F] transition-colors font-sans">
          <span>Manage Module</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{Content}</Link>;
  }

  return Content;
}
