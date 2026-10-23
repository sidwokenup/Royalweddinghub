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
            className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-5 sm:p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(28,22,17,0.03),0_4px_12px_-2px_rgba(28,22,17,0.03)] hover:shadow-md hover:border-[#85662F]/40 transition-all duration-300 group"
          >
            <div>
              {/* Header info & thumbnail */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#F8F5EE] border border-[#EAE4D9] overflow-hidden relative shrink-0">
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
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FDF9F0] text-[#705527] border border-[#E9DECA] uppercase tracking-wider">
                      {service.category_tag}
                    </span>
                    {service.is_featured && (
                      <span className="text-[11px] font-serif italic text-[#85662F]">
                        ★ Featured Service
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-serif text-[#1C1611] font-normal tracking-tight mt-1.5 truncate">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#5C5245] line-clamp-2 mt-0.5 font-light leading-relaxed">
                    {service.headline}
                  </p>
                </div>
              </div>

              {/* Subcategories & Deliverables pill */}
              <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center gap-4 text-xs text-[#7A6E5F]">
                <span className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-[#85662F]" />
                  <span>{service.deliverables_count || 4} Deliverables</span>
                </span>
                <span>•</span>
                <span className="font-mono text-[11px]">
                  {service.subcategories_count || 4} Subcategories
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-[#F2ECE1] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleToggle(service)}
                disabled={isPending}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border transition-all ${
                  service.is_published
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-[#F5F2EB] text-[#7A6E5F] border-[#E2DBD0] hover:bg-[#EAE4D9]'
                }`}
              >
                {service.is_published ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-700" />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 text-[#7A6E5F]" />
                    <span>Hidden</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={service.slug === 'wedding-venues' ? '/venues' : `/services/${service.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-[#7A6E5F] hover:text-[#521D2B] hover:bg-[#F8F5EE] border border-transparent hover:border-[#EAE4D9] transition-all"
                  title="View on live site"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <Link
                  href={`/admin/services/${service.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-xs font-medium text-[#1C1611] hover:bg-[#521D2B] hover:text-white hover:border-[#521D2B] transition-all shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5" />
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
