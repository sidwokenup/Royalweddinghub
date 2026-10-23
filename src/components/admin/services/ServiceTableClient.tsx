'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Edit, ExternalLink, Check, EyeOff, Layers } from 'lucide-react';
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
            className="rounded-2xl bg-[#12100d] border border-[#241f18] p-5 flex flex-col justify-between hover:border-[#c5a880]/40 transition-all duration-300 group"
          >
            <div>
              {/* Header info & thumbnail */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#1a1612] border border-[#2b241b] overflow-hidden relative shrink-0">
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
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1e1914] text-[#c5a880] border border-[#332b21]">
                      {service.category_tag}
                    </span>
                    {service.is_featured && (
                      <span className="text-[10px] font-mono text-[#c5a880]">★ Featured</span>
                    )}
                  </div>
                  <h3 className="text-base font-serif text-[#faf6f0] font-normal tracking-wide mt-1 truncate">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#8a7f70] line-clamp-1 mt-0.5 font-light">
                    {service.headline}
                  </p>
                </div>
              </div>

              {/* Subcategories & Deliverables pill */}
              <div className="mt-4 pt-3 border-t border-[#1e1913] flex items-center gap-3 text-xs text-[#8a7f70]">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>{service.deliverables_count || 4} Deliverables</span>
                </span>
                <span>•</span>
                <span className="font-mono text-[11px]">
                  {service.subcategories_count || 4} Subcategories
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-[#1e1913] flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggle(service)}
                disabled={isPending}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
                  service.is_published
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/60'
                    : 'bg-[#1e1914] text-[#7d7263] border-[#2e261d]'
                }`}
              >
                {service.is_published ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 text-[#7d7263]" />
                    <span>Hidden</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={service.slug === 'wedding-venues' ? '/venues' : `/services/${service.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-[#8a7f70] hover:text-[#c5a880] hover:bg-[#1a1713] transition-colors"
                  title="View on live site"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <Link
                  href={`/admin/services/${service.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1f1a14] border border-[#332a20] text-xs font-medium text-[#c5a880] hover:text-white hover:bg-[#282119] transition-all"
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
