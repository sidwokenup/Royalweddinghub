import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Building2,
  Sparkles,
  MessageSquareText,
  Star,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  Phone,
  Server,
  Zap,
} from 'lucide-react';
import { getCurrentAdmin } from '@/lib/auth/admin';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';
import { MetricCard } from '@/components/admin/MetricCard';

interface DashboardStats {
  totalVenues: number;
  publishedVenues: number;
  totalServices: number;
  totalEnquiries: number;
  newEnquiries: number;
  totalTestimonials: number;
  recentEnquiries: Array<{
    id: string;
    lead_number: string;
    name: string;
    phone: string;
    event_type: string;
    wedding_date: string;
    status: string;
    created_at: string;
  }>;
  isDbLive: boolean;
}

async function getDashboardData(): Promise<DashboardStats> {
  const dbConfigured = isDatabaseConfigured();
  const db = getAdminDb();

  // Fallback defaults reflecting static codebase
  const stats: DashboardStats = {
    totalVenues: 32,
    publishedVenues: 32,
    totalServices: 8,
    totalEnquiries: 0,
    newEnquiries: 0,
    totalTestimonials: 0,
    recentEnquiries: [],
    isDbLive: dbConfigured,
  };

  if (dbConfigured && db) {
    try {
      // 1. Venues counts
      const { count: vCount } = await db
        .from('venues')
        .select('*', { count: 'exact', head: true });
      if (typeof vCount === 'number' && vCount > 0) {
        stats.totalVenues = vCount;
        const { count: pubCount } = await db
          .from('venues')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', true);
        stats.publishedVenues = typeof pubCount === 'number' ? pubCount : vCount;
      }

      // 2. Services count
      const { count: sCount } = await db
        .from('services')
        .select('*', { count: 'exact', head: true });
      if (typeof sCount === 'number' && sCount > 0) {
        stats.totalServices = sCount;
      }

      // 3. Enquiries count & recent leads
      const { count: eCount } = await db
        .from('enquiries')
        .select('*', { count: 'exact', head: true });
      if (typeof eCount === 'number') {
        stats.totalEnquiries = eCount;

        const { count: newCount } = await db
          .from('enquiries')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');
        stats.newEnquiries = typeof newCount === 'number' ? newCount : 0;

        const { data: recentLeads } = await db
          .from('enquiries')
          .select('id, lead_number, name, phone, event_type, wedding_date, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentLeads && recentLeads.length > 0) {
          stats.recentEnquiries = recentLeads;
        }
      }

      // 4. Testimonials count
      const { count: tCount } = await db
        .from('testimonials')
        .select('*', { count: 'exact', head: true });
      if (typeof tCount === 'number') {
        stats.totalTestimonials = tCount;
      }
    } catch (err) {
      console.warn('[Admin Dashboard] Query error, using default state:', err);
    }
  }

  return stats;
}

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect('/admin/login');
  }

  const stats = await getDashboardData();

  // Current formatted date in IST
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date());

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#521D2B] via-[#431622] to-[#2B0E16] text-[#FAF7F2] shadow-[0_8px_30px_rgba(82,29,43,0.18)] border border-[#6B283A]/50 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_top_right,rgba(230,201,148,0.15)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6B56D]/30 bg-[#2B0E16]/60 text-[#E6C994] text-xs font-mono mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Royal Concierge Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF6F0] font-normal tracking-wide">
            Welcome back, {admin.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-[#D4C3B8] mt-1.5 font-light flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#E6C994]" />
            <span>{todayFormatted}</span>
            <span className="text-[#8C6D76]">•</span>
            <span>Lucknow Headquarters</span>
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/admin/venues"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E6C994] hover:bg-[#F0D8AA] text-[#2B0E16] text-xs font-semibold tracking-wide transition-all shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Venue</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3D141F] text-[#FAF6F0] border border-[#6B283A] text-xs font-medium hover:bg-[#4E1B29] transition-all"
          >
            <MessageSquareText className="w-4 h-4 text-[#E6C994]" />
            <span>View Inquiries</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Client Inquiries"
          value={stats.totalEnquiries}
          subtitle={`${stats.newEnquiries} awaiting consultation`}
          badge={stats.newEnquiries > 0 ? `${stats.newEnquiries} New` : 'Up to Date'}
          badgeType={stats.newEnquiries > 0 ? 'emerald' : 'neutral'}
          icon={MessageSquareText}
          href="/admin/enquiries"
        />

        <MetricCard
          title="Curated Venues"
          value={stats.totalVenues}
          subtitle={`${stats.publishedVenues} live on public directory`}
          badge="Lucknow"
          badgeType="gold"
          icon={Building2}
          href="/admin/venues"
        />

        <MetricCard
          title="Services & Disciplines"
          value={stats.totalServices}
          subtitle="Catering, Decor, Photo, Music & More"
          badge="Active"
          badgeType="gold"
          icon={Sparkles}
          href="/admin/services"
        />

        <MetricCard
          title="Verified Stories"
          value={stats.totalTestimonials}
          subtitle="Private discretion card enforced"
          badge="Protected"
          badgeType="neutral"
          icon={Star}
          href="/admin/testimonials"
        />
      </div>

      {/* Main Two-Column Layout: Inquiries Pipeline + Quick Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: Inquiries Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 shadow-[0_1px_3px_rgba(28,22,17,0.03),0_4px_12px_-2px_rgba(28,22,17,0.03)]">
            <div className="flex items-center justify-between pb-5 border-b border-[#F0ECE1]">
              <div>
                <h2 className="text-base font-serif text-[#1C1611] tracking-wide font-medium">
                  Recent Inquiries Pipeline
                </h2>
                <p className="text-xs text-[#5C5245] mt-0.5">
                  Direct lead submissions from the 6-step concierge consultation card.
                </p>
              </div>

              <Link
                href="/admin/enquiries"
                className="text-xs text-[#521D2B] hover:text-[#7D293F] flex items-center gap-1 font-semibold transition-colors"
              >
                <span>All Inquiries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {stats.recentEnquiries.length > 0 ? (
              <div className="divide-y divide-[#F0ECE1] mt-2">
                {stats.recentEnquiries.map((lead) => (
                  <div
                    key={lead.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[#FDFBF7] px-2.5 rounded-xl transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#1C1611]">{lead.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FDF9F0] text-[#705527] border border-[#E9DECA] font-medium">
                          {lead.lead_number}
                        </span>
                      </div>
                      <div className="text-xs text-[#5C5245] flex items-center gap-3 mt-1 font-light">
                        <span className="flex items-center gap-1 font-medium text-[#1C1611]">
                          <Sparkles className="w-3 h-3 text-[#85662F]" />
                          {lead.event_type}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#85662F]" />
                          {lead.wedding_date || 'Date TBD'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-[#8C8070]">
                          <Phone className="w-3 h-3 text-[#85662F]" />
                          {lead.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border font-medium ${
                          lead.status === 'new'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : lead.status === 'contacted'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-[#F5F2EB] text-[#5C5245] border-[#E2DAD0]'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#FDF9F0] border border-[#E9DECA] text-[#85662F] flex items-center justify-center mx-auto mb-4 shadow-2xs">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-serif text-[#1C1611] font-medium">
                  No Active Leads in Queue
                </h3>
                <p className="text-xs text-[#5C5245] max-w-sm mx-auto mt-1.5 leading-relaxed font-light">
                  Incoming client consultations submitted via{' '}
                  <span className="text-[#521D2B] font-medium">RoyalWeddingHub.com/contact</span> will record
                  here automatically in real-time with zero-latency alert notifications.
                </p>
                <div className="mt-5">
                  <Link
                    href="/contact"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs text-[#521D2B] font-semibold hover:underline"
                  >
                    <span>Test the Concierge Card on /contact</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Action Hub & System Integrity */}
        <div className="space-y-6">
          {/* Quick Hub */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 shadow-[0_1px_3px_rgba(28,22,17,0.03),0_4px_12px_-2px_rgba(28,22,17,0.03)]">
            <h2 className="text-base font-serif text-[#1C1611] tracking-wide font-medium mb-1">
              Editorial Quick Actions
            </h2>
            <p className="text-xs text-[#5C5245] mb-4">
              Direct access to content creation and live website assets.
            </p>

            <div className="space-y-2.5">
              <Link
                href="/admin/venues"
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#FDFBF7] border border-[#EAE4D9] hover:border-[#85662F]/50 hover:bg-[#FFFFFF] transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#FDF9F0] text-[#85662F] group-hover:scale-105 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1C1611] group-hover:text-[#521D2B] transition-colors">
                      Manage Venue Catalog
                    </div>
                    <div className="text-[11px] text-[#7A6E5F]">
                      Edit pricing, pax capacity & galleries
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C8070] group-hover:text-[#521D2B] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/admin/services"
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#FDFBF7] border border-[#EAE4D9] hover:border-[#85662F]/50 hover:bg-[#FFFFFF] transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#FDF9F0] text-[#85662F] group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1C1611] group-hover:text-[#521D2B] transition-colors">
                      Service Disciplines
                    </div>
                    <div className="text-[11px] text-[#7A6E5F]">
                      Update copy, deliverables & subcategories
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C8070] group-hover:text-[#521D2B] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/admin/media"
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#FDFBF7] border border-[#EAE4D9] hover:border-[#85662F]/50 hover:bg-[#FFFFFF] transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#FDF9F0] text-[#85662F] group-hover:scale-105 transition-transform">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1C1611] group-hover:text-[#521D2B] transition-colors">
                      Media Library
                    </div>
                    <div className="text-[11px] text-[#7A6E5F]">
                      Inspect high-res photos & storage buckets
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C8070] group-hover:text-[#521D2B] group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* System & Architecture Integrity Card */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] p-6 space-y-4 shadow-[0_1px_3px_rgba(28,22,17,0.03),0_4px_12px_-2px_rgba(28,22,17,0.03)]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#521D2B] uppercase tracking-wider font-mono">
              <Server className="w-4 h-4 text-[#85662F]" />
              <span>Infrastructure Health</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE1]">
                <span className="text-[#5C5245]">Next.js Runtime</span>
                <span className="font-mono text-[#1C1611] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  v16.3.8 App Router
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE1]">
                <span className="text-[#5C5245]">Database Driver</span>
                <span className="font-mono text-[#1C1611] font-medium flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      stats.isDbLive ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {stats.isDbLive ? 'Supabase PostgreSQL' : 'Local Fallback'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE1]">
                <span className="text-[#5C5245]">Session Security</span>
                <span className="font-mono text-[#1C1611] font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#85662F]" />
                  JWT HttpOnly (7d)
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#5C5245]">Lenis Admin Scroll</span>
                <span className="font-mono text-emerald-700 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Bypassed (Native Wheel)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
