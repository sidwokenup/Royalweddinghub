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
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/40 border-red-500/30 text-red-300'
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
        <div className="rounded-3xl bg-[#12100d] border border-[#262018] p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f1a14]">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#c5a880]" />
              <h2 className="text-sm font-serif text-[#faf6f0] tracking-wide font-normal">
                Concierge Contact Coordinates
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#73685a] uppercase">Global Public</span>
          </div>

          <div className="space-y-3">
            {/* Phone */}
            <div className="p-3.5 rounded-xl bg-[#171410] border border-[#241f18] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#221c16] text-[#c5a880]">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#73685a] uppercase font-mono">Primary Voice Concierge</div>
                  <div className="text-xs font-mono text-[#f5f0eb]">{BUSINESS_INFO.displayPhone}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('phone', BUSINESS_INFO.displayPhone)}
                className="p-1.5 rounded-lg text-[#73685a] hover:text-[#c5a880] hover:bg-[#201a14] transition-colors"
              >
                {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Email */}
            <div className="p-3.5 rounded-xl bg-[#171410] border border-[#241f18] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#221c16] text-[#c5a880]">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#73685a] uppercase font-mono">Official Concierge Email</div>
                  <div className="text-xs font-mono text-[#f5f0eb]">{BUSINESS_INFO.email}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('email', BUSINESS_INFO.email)}
                className="p-1.5 rounded-lg text-[#73685a] hover:text-[#c5a880] hover:bg-[#201a14] transition-colors"
              >
                {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Studio Address */}
            <div className="p-3.5 rounded-xl bg-[#171410] border border-[#241f18] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#221c16] text-[#c5a880]">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#73685a] uppercase font-mono">Lucknow Atelier Address</div>
                  <div className="text-xs text-[#f5f0eb]">{BUSINESS_INFO.address.full}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('addr', BUSINESS_INFO.address.full)}
                className="p-1.5 rounded-lg text-[#73685a] hover:text-[#c5a880] hover:bg-[#201a14] transition-colors"
              >
                {copiedKey === 'addr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Instagram */}
            <div className="p-3.5 rounded-xl bg-[#171410] border border-[#241f18] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#221c16] text-pink-400">
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#73685a] uppercase font-mono">Instagram Official Handle</div>
                  <div className="text-xs font-mono text-[#f5f0eb]">{BUSINESS_INFO.instagram.handle}</div>
                </div>
              </div>
              <a
                href={BUSINESS_INFO.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#c5a880] hover:underline font-mono"
              >
                Open ↗
              </a>
            </div>
          </div>
        </div>

        {/* Card 2: Edge Cache & Performance Engine */}
        <div className="rounded-3xl bg-[#12100d] border border-[#262018] p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f1a14]">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-[#c5a880]" />
              <h2 className="text-sm font-serif text-[#faf6f0] tracking-wide font-normal">
                Edge Cache & On-Demand Purge
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase">Vercel Edge</span>
          </div>

          <p className="text-xs text-[#8a7f70] leading-relaxed font-light">
            Public pages use Next.js on-demand ISR (Incremental Static Regeneration) for ultra-fast 0ms TTFB.
            When you publish edits to venues, services, or testimonials, caches revalidate automatically.
            You can also trigger a full site-wide purge below.
          </p>

          <div className="p-4 rounded-2xl bg-[#171410] border border-[#241f18] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8a7f70]">Revalidation Scope:</span>
              <span className="font-mono text-[#c5a880]">/, /venues, /services, /about, /contact</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8a7f70]">Dual-Read Fallback Status:</span>
              <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active & Resilient
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePurgeCache}
            disabled={isPending}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1f1a14] border border-[#332b21] hover:border-[#c5a880]/50 hover:bg-[#262019] text-[#c5a880] text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
            <span>{isPending ? 'Purging Edge Caches...' : 'Purge & Revalidate All Edge Caches'}</span>
          </button>
        </div>

        {/* Card 3: Security & Session Profile */}
        <div className="rounded-3xl bg-[#12100d] border border-[#262018] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f1a14]">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#c5a880]" />
              <h2 className="text-sm font-serif text-[#faf6f0] tracking-wide font-normal">
                Security & Session Profile
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#c5a880] uppercase">Cryptographic Guard</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-[#1c1712]">
              <span className="text-[#8a7f70]">Authenticated Admin</span>
              <span className="font-mono text-[#f5f0eb]">{adminEmail}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#1c1712]">
              <span className="text-[#8a7f70]">Assigned Role</span>
              <span className="font-mono text-[#c5a880] uppercase tracking-wider">{adminRole}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#1c1712]">
              <span className="text-[#8a7f70]">Session Cookie</span>
              <span className="font-mono text-[#e3dad0]">rwh_admin_session (httpOnly, 7-day)</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#8a7f70]">Public Registration</span>
              <span className="font-mono text-emerald-400">Strictly Disabled (Zero Signup)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Database & Resilience Architecture */}
        <div className="rounded-3xl bg-[#12100d] border border-[#262018] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f1a14]">
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-[#c5a880]" />
              <h2 className="text-sm font-serif text-[#faf6f0] tracking-wide font-normal">
                Database & Fallback Engine
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase">Resilience Mode</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-[#1c1712]">
              <span className="text-[#8a7f70]">Active Database</span>
              <span className="font-mono text-[#f5f0eb]">Supabase PostgreSQL (Managed)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#1c1712]">
              <span className="text-[#8a7f70]">Connection Health</span>
              <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {isDbConnected ? 'Connected & Operational' : 'Offline (JSON Fallback Serving)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#1c1712]">
              <span className="text-[#8a7f70]">Storage Bucket</span>
              <span className="font-mono text-[#c5a880]">media (Supabase Cloud Storage)</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[#8a7f70]">Emergency Fallback</span>
              <span className="font-mono text-emerald-400">venues.json & services.ts (0ms Downtime)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
