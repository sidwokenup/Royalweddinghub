'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, ExternalLink, Check, EyeOff, Layers } from 'lucide-react';
import { toggleServicePublishAction } from '@/app/admin/services/actions';

export interface AdminServiceRow {
  id: string;
  slug: string;
  name: string;
  category_tag: string;
  headline: string;
  cover_image_url: string;
  is_featured: boolean;
  is_published: boolean;
  deliverables_count?: number;
  subcategories_count?: number;
}

interface ServiceTableClientProps {
  initialServices: AdminServiceRow[];
}

export function ServiceTableClient({ initialServices }: ServiceTableClientProps) {
  const [services, setServices] = useState<AdminServiceRow[]>(initialServices);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (service: AdminServiceRow) => {
    const nextState = !service.is_published;
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, is_published: nextState } : s))
    );

    startTransition(async () => {
      const res = await toggleServicePublishAction(service.id, nextState);
      if (!res.success) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, is_published: service.is_published } : s))
        );
        alert(`Failed to update status: ${res.error}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl bg-[#181310]/85 backdrop-blur-xl border border-[#D6B56D]/15 p-5 sm:p-6 flex flex-col justify-between shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:border-[#D6B56D]/40 transition-all duration-300 group hover:shadow-[0_16px_40px_rgba(214,181,109,0.06)]"
          >
            <div>
              {/* Header info & thumbnail */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#0F0C0A] border border-[#D6B56D]/20 overflow-hidden relative shrink-0">
                  <Image
                    src={service.cover_image_url || '/images/services/wedding-venues.jpg'}
                    alt={service.name}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized={service.cover_image_url?.startsWith('http')}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D6B56D]/10 text-[#D6B56D] border border-[#D6B56D]/25 uppercase tracking-wider">
                      {service.category_tag}
                    </span>
                    {service.is_featured && (
                      <span className="text-[11px] font-sans font-medium text-[#D6B56D] flex items-center gap-1">
                        ★ Featured Discipline
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-serif text-[#FAF7F2] font-normal tracking-wide mt-1.5 truncate group-hover:text-[#D6B56D] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#B8ADA3] line-clamp-2 mt-0.5 font-light leading-relaxed">
                    {service.headline}
                  </p>
                </div>
              </div>

              {/* Subcategories & Deliverables pill */}
              <div className="mt-4 pt-3 border-t border-[#D6B56D]/10 flex items-center gap-4 text-xs text-[#B8ADA3]/70">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
                  <span>{service.deliverables_count || 4} Deliverables</span>
                </span>
                <span className="text-[#D6B56D]/30">•</span>
                <span className="font-mono text-[11px]">
                  {service.subcategories_count || 4} Subcategories
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-[#D6B56D]/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleToggle(service)}
                disabled={isPending}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
                  service.is_published
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/50'
                    : 'bg-[#0F0C0A]/80 text-[#B8ADA3]/60 border-[#D6B56D]/15 hover:text-[#FAF7F2] hover:border-[#D6B56D]/30'
                }`}
              >
                {service.is_published ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" strokeWidth={1.5} />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 text-[#B8ADA3]/60" strokeWidth={1.5} />
                    <span>Hidden</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={service.slug === 'wedding-venues' ? '/venues' : `/services/${service.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-[#B8ADA3] hover:text-[#D6B56D] hover:bg-[#D6B56D]/10 border border-transparent hover:border-[#D6B56D]/20 transition-all"
                  title="View on live site"
                >
                  <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                </Link>

                <Link
                  href={`/admin/services/${service.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#521D2B]/40 hover:bg-[#521D2B] text-[#FAF7F2] border border-[#D6B56D]/30 text-xs font-medium transition-all shadow-sm font-sans hover:border-[#D6B56D]/60"
                >
                  <Edit className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
                  <span>Edit Service</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
