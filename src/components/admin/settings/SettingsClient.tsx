'use client';

import React, { useState, useTransition } from 'react';
import {
  RefreshCw,
  Phone,
  MapPin,
  CheckCircle2,
  Shield,
  Zap,
  HardDrive,
  Copy,
  Check,
  Camera,
  Mail,
} from 'lucide-react';
import { purgeAllEdgeCachesAction } from '@/app/admin/settings/actions';
import { BUSINESS_INFO } from '@/lib/contact';

interface SettingsClientProps {
  isDbConnected: boolean;
  adminEmail: string;
  adminRole: string;
}

export function SettingsClient({ isDbConnected, adminEmail, adminRole }: SettingsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePurgeCache = () => {
    setStatusMsg(null);
    startTransition(async () => {
      const res = await purgeAllEdgeCachesAction();
      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message || 'All caches successfully revalidated!' });
      } else {
        setStatusMsg({ type: 'error', text: res.error || 'Failed to revalidate cache.' });
      }
    });
  };

  return (
    <div className="space-y-8">
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between animate-in fade-in ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Concierge Contact Coordinates */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 sm:p-7 space-y-5 shadow-[0_1px_3px_rgba(28,22,17,0.03)]">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#85662F]" />
              <h2 className="text-sm sm:text-base font-serif text-[#1C1611] tracking-tight font-normal">
                Concierge Contact Coordinates
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#85662F] bg-[#FDF9F0] border border-[#E9DECA] px-2 py-0.5 rounded-full uppercase">
              Global Public
            </span>
          </div>

          <div className="space-y-3">
            {/* Phone */}
            <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EAE4D9] flex items-center justify-between hover:border-[#DDD5C7] transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#FDF9F0] text-[#705527] border border-[#E9DECA]">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#5C5245] uppercase font-mono">Primary Voice Concierge</div>
                  <div className="text-xs font-mono font-medium text-[#1C1611]">{BUSINESS_INFO.displayPhone}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('phone', BUSINESS_INFO.displayPhone)}
                className="p-1.5 rounded-lg text-[#8C8070] hover:text-[#521D2B] hover:bg-[#F2ECE1] transition-colors"
              >
                {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Email */}
            <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EAE4D9] flex items-center justify-between hover:border-[#DDD5C7] transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#FDF9F0] text-[#705527] border border-[#E9DECA]">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#5C5245] uppercase font-mono">Official Concierge Email</div>
                  <div className="text-xs font-mono font-medium text-[#1C1611]">{BUSINESS_INFO.email}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('email', BUSINESS_INFO.email)}
                className="p-1.5 rounded-lg text-[#8C8070] hover:text-[#521D2B] hover:bg-[#F2ECE1] transition-colors"
              >
                {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Studio Address */}
            <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EAE4D9] flex items-center justify-between hover:border-[#DDD5C7] transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#FDF9F0] text-[#705527] border border-[#E9DECA]">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#5C5245] uppercase font-mono">Lucknow Atelier Address</div>
                  <div className="text-xs text-[#1C1611] font-medium">{BUSINESS_INFO.address.full}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('addr', BUSINESS_INFO.address.full)}
                className="p-1.5 rounded-lg text-[#8C8070] hover:text-[#521D2B] hover:bg-[#F2ECE1] transition-colors"
              >
                {copiedKey === 'addr' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Instagram */}
            <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#EAE4D9] flex items-center justify-between hover:border-[#DDD5C7] transition-all">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-50 text-pink-700 border border-pink-200">
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#5C5245] uppercase font-mono">Instagram Official Handle</div>
                  <div className="text-xs font-mono font-medium text-[#1C1611]">{BUSINESS_INFO.instagram.handle}</div>
                </div>
              </div>
              <a
                href={BUSINESS_INFO.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#85662F] hover:text-[#521D2B] hover:underline font-mono"
              >
                Open ↗
              </a>
            </div>
          </div>
        </div>

        {/* Card 2: Edge Cache & Performance Engine */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 sm:p-7 space-y-5 shadow-[0_1px_3px_rgba(28,22,17,0.03)]">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-[#85662F]" />
              <h2 className="text-sm sm:text-base font-serif text-[#1C1611] tracking-tight font-normal">
                Edge Cache & On-Demand Purge
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
              Vercel Edge
            </span>
          </div>

          <p className="text-xs text-[#5C5245] leading-relaxed font-light">
            Public pages use Next.js on-demand ISR (Incremental Static Regeneration) for ultra-fast 0ms TTFB.
            When you publish edits to venues, services, or testimonials, caches revalidate automatically.
            You can also trigger a full site-wide purge below.
          </p>

          <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EAE4D9] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5C5245]">Revalidation Scope:</span>
              <span className="font-mono text-[#85662F] font-medium">/, /venues, /services, /about, /contact</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5C5245]">Dual-Read Fallback Status:</span>
              <span className="font-mono text-emerald-800 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Active & Resilient
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePurgeCache}
            disabled={isPending}
            className="w-full py-2.5 px-4 rounded-xl bg-[#521D2B] text-white hover:bg-[#682637] text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_1px_2px_rgba(82,29,43,0.2)] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
            <span>{isPending ? 'Purging Edge Caches...' : 'Purge & Revalidate All Edge Caches'}</span>
          </button>
        </div>

        {/* Card 3: Security & Session Profile */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 sm:p-7 space-y-4 shadow-[0_1px_3px_rgba(28,22,17,0.03)]">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#85662F]" />
              <h2 className="text-sm sm:text-base font-serif text-[#1C1611] tracking-tight font-normal">
                Security & Session Profile
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#705527] bg-[#FDF9F0] border border-[#E9DECA] px-2 py-0.5 rounded-full uppercase">
              Cryptographic Guard
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-[#F2ECE1]">
              <span className="text-[#5C5245]">Authenticated Admin</span>
              <span className="font-mono text-[#1C1611] font-medium">{adminEmail}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F2ECE1]">
              <span className="text-[#5C5245]">Assigned Role</span>
              <span className="font-mono text-[#85662F] font-medium uppercase tracking-wider">{adminRole}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F2ECE1]">
              <span className="text-[#5C5245]">Session Cookie</span>
              <span className="font-mono text-[#1C1611]">rwh_admin_session (httpOnly, 7-day)</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#5C5245]">Public Registration</span>
              <span className="font-mono text-emerald-800 font-medium">Strictly Disabled (Zero Signup)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Database & Resilience Architecture */}
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 sm:p-7 space-y-4 shadow-[0_1px_3px_rgba(28,22,17,0.03)]">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-[#85662F]" />
              <h2 className="text-sm sm:text-base font-serif text-[#1C1611] tracking-tight font-normal">
                Database & Fallback Engine
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
              Resilience Mode
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-[#F2ECE1]">
              <span className="text-[#5C5245]">Active Database</span>
              <span className="font-mono text-[#1C1611] font-medium">Supabase PostgreSQL (Managed)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F2ECE1]">
              <span className="text-[#5C5245]">Connection Health</span>
              <span className="font-mono text-emerald-800 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                {isDbConnected ? 'Connected & Operational' : 'Offline (JSON Fallback Serving)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F2ECE1]">
              <span className="text-[#5C5245]">Storage Bucket</span>
              <span className="font-mono text-[#85662F] font-medium">media (Supabase Cloud Storage)</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#5C5245]">Emergency Fallback</span>
              <span className="font-mono text-emerald-800 font-medium">venues.json & services.ts (0ms Downtime)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
