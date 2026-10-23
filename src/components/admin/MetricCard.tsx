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
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30';
      case 'amber':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/30';
      case 'neutral':
        return 'bg-[#1f1a14] text-[#8a7f70] border-[#332b21]';
      case 'gold':
      default:
        return 'bg-[#2a2217] text-[#c5a880] border-[#c5a880]/30';
    }
  };

  const Content = (
    <div className="relative group overflow-hidden rounded-2xl bg-[#12100d] border border-[#262018] p-5 sm:p-6 transition-all duration-300 hover:border-[#c5a880]/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      {/* Top subtle glow on hover */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#c5a880]/5 rounded-full blur-2xl group-hover:bg-[#c5a880]/15 transition-all duration-300" />

      <div className="flex items-start justify-between relative z-10">
        <div className="p-3 rounded-xl bg-[#1a1612] border border-[#2e261d] text-[#c5a880] group-hover:text-[#dfc9a5] group-hover:scale-105 transition-all duration-200">
          <Icon className="w-5 h-5" />
        </div>

        {badge && (
          <span
            className={`text-[11px] font-mono px-2.5 py-1 rounded-full border ${getBadgeStyles()}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4 relative z-10">
        <div className="text-2xl sm:text-3xl font-serif text-[#faf6f0] tracking-tight font-medium">
          {value}
        </div>
        <div className="text-xs uppercase tracking-wider text-[#998c7b] mt-1 font-sans">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-[#6e6354] mt-2 flex items-center gap-1 font-light">
            {subtitle}
          </div>
        )}
      </div>

      {href && (
        <div className="mt-4 pt-3 border-t border-[#1e1913] flex items-center justify-between text-xs text-[#a39480] group-hover:text-[#c5a880] transition-colors">
          <span>Manage Module</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{Content}</Link>;
  }

  return Content;
}
