import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeType?: 'gold' | 'emerald' | 'amber' | 'neutral';
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  href?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  badge,
  badgeType = 'gold',
  icon: Icon,
  href,
  className = '',
}: MetricCardProps) {
  const getBadgeStyles = () => {
    switch (badgeType) {
      case 'emerald':
        return 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30';
      case 'amber':
        return 'bg-amber-950/50 text-amber-300 border-amber-500/30';
      case 'neutral':
        return 'bg-white/[0.04] text-[#B8ADA3] border-white/[0.08]';
      case 'gold':
      default:
        return 'bg-[#D6B56D]/15 text-[#D6B56D] border-[#D6B56D]/30';
    }
  };

  const Content = (
    <div
      className={`relative group overflow-hidden rounded-2xl bg-[#181310]/85 border border-[#D6B56D]/15 p-5 sm:p-6 transition-all duration-300 hover:border-[#D6B56D]/45 hover:bg-[#1E1814]/95 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.45),0_0_24px_rgba(214,181,109,0.06)] backdrop-blur-xl ${className}`}
    >
      {/* Background Watermark of the Bespoke Royal Motif */}
      <div 
        className="absolute -right-3 -bottom-3 w-28 h-28 text-[#D6B56D] opacity-[0.04] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Icon size={112} strokeWidth={1.2} />
      </div>

      {/* Top subtle decorative ambient gold glow on hover */}
      <div 
        className="absolute -top-16 -right-16 w-36 h-36 bg-[radial-gradient(ellipse_at_center,_rgba(214,181,109,0.15)_0%,_transparent_70%)] rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-16 -left-16 w-32 h-32 bg-[radial-gradient(ellipse_at_center,_rgba(82,29,43,0.15)_0%,_transparent_70%)] rounded-full blur-xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="flex items-start justify-between relative z-10">
        {/* Luxury Royal Medallion Presentation */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-b from-[#2E1A1E] to-[#120B0D] border border-[#D6B56D]/35 flex items-center justify-center text-[#D6B56D] shadow-[0_0_16px_rgba(214,181,109,0.08)] group-hover:border-[#D6B56D]/70 group-hover:shadow-[0_0_20px_rgba(214,181,109,0.2)] group-hover:scale-105 transition-all duration-300">
          <Icon size={22} strokeWidth={1.5} className="text-[#D6B56D]" />
        </div>

        {badge && (
          <span
            className={`text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full border tracking-wide ${getBadgeStyles()}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4 relative z-10">
        <div className="text-3xl sm:text-4xl font-mono font-bold tabular-nums text-[#FAF7F2] tracking-tight">
          {value}
        </div>
        <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#D6B56D] mt-1 font-mono font-semibold">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-[#B8ADA3] mt-2 flex items-center gap-1 font-light leading-relaxed">
            {subtitle}
          </div>
        )}
      </div>

      {href && (
        <div className="mt-5 pt-3.5 border-t border-[#D6B56D]/15 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#D6B56D] group-hover:text-[#FAF7F2] transition-colors">
          <span>Manage Module</span>
          <ArrowUpRight
            className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#D6B56D] group-hover:text-[#FAF7F2]"
            strokeWidth={1.5}
          />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{Content}</Link>;
  }

  return Content;
}
