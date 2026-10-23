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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171410] via-[#12100d] to-[#0d0c0a] border border-[#2b241b] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c5a880]/20 bg-[#1e1913]/60 text-[#c5a880] text-xs font-mono mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Royal Concierge Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#faf6f0] font-normal tracking-wide">
            Welcome back, {admin.fullName}
          </h1>
          <p className="text-sm text-[#9c8e7b] mt-1 font-light flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>{todayFormatted}</span>
            <span className="text-[#4a4135]">•</span>
            <span>Lucknow Headquarters</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/venues"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c5a880] text-[#12100d] text-xs font-medium tracking-wide hover:bg-[#dfc9a5] transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Venue</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1f1a14] text-[#e3dad0] border border-[#382f23] text-xs font-medium hover:border-[#c5a880]/50 hover:bg-[#28221a] transition-all"
          >
            <MessageSquareText className="w-4 h-4 text-[#c5a880]" />
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
          <div className="rounded-2xl bg-[#12100d] border border-[#262018] p-6">
            <div className="flex items-center justify-between pb-5 border-b border-[#211b15]">
              <div>
                <h2 className="text-lg font-serif text-[#faf6f0] tracking-wide font-normal">
                  Recent Inquiries Pipeline
                </h2>
                <p className="text-xs text-[#8a7f70] mt-0.5">
                  Direct lead submissions from the 6-step concierge consultation card.
                </p>
              </div>

              <Link
                href="/admin/enquiries"
                className="text-xs text-[#c5a880] hover:text-[#dfc9a5] flex items-center gap-1 font-medium transition-colors"
              >
                <span>All Inquiries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {stats.recentEnquiries.length > 0 ? (
              <div className="divide-y divide-[#1e1913] mt-3">
                {stats.recentEnquiries.map((lead) => (
                  <div
                    key={lead.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[#16130f]/60 px-2 rounded-xl transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#f5f0eb]">{lead.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1f1a14] text-[#c5a880] border border-[#332b21]">
                          {lead.lead_number}
                        </span>
                      </div>
                      <div className="text-xs text-[#8a7f70] flex items-center gap-3 mt-1 font-light">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#c5a880]" />
                          {lead.event_type}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#c5a880]" />
                          {lead.wedding_date || 'Date TBD'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-[#c5a880]" />
                          {lead.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          lead.status === 'new'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                            : lead.status === 'contacted'
                            ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                            : 'bg-[#1e1914] text-[#8a7e6e] border-[#2e261d]'
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
                <div className="w-12 h-12 rounded-2xl bg-[#1a1612] border border-[#2b241b] text-[#c5a880] flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-serif text-[#faf6f0] font-normal">
                  No Active Leads in Queue
                </h3>
                <p className="text-xs text-[#8a7f70] max-w-sm mx-auto mt-1.5 leading-relaxed font-light">
                  Incoming client consultations submitted via{' '}
                  <span className="text-[#c5a880]">RoyalWeddingHub.com/contact</span> will record
                  here automatically in real-time with zero-latency alert notifications.
                </p>
                <div className="mt-5">
                  <Link
                    href="/contact"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs text-[#c5a880] hover:underline"
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
          <div className="rounded-2xl bg-[#12100d] border border-[#262018] p-6">
            <h2 className="text-base font-serif text-[#faf6f0] tracking-wide font-normal mb-1">
              Editorial Quick Actions
            </h2>
            <p className="text-xs text-[#8a7f70] mb-4">
              Direct access to content creation and live website assets.
            </p>

            <div className="space-y-2.5">
              <Link
                href="/admin/venues"
                className="flex items-center justify-between p-3 rounded-xl bg-[#171410] border border-[#262018] hover:border-[#c5a880]/40 hover:bg-[#1f1a14] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#221c16] text-[#c5a880]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#f0e9df] group-hover:text-[#c5a880] transition-colors">
                      Manage Venue Catalog
                    </div>
                    <div className="text-[11px] text-[#786c5d]">
                      Edit pricing, pax capacity & galleries
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#786c5d] group-hover:text-[#c5a880] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/admin/services"
                className="flex items-center justify-between p-3 rounded-xl bg-[#171410] border border-[#262018] hover:border-[#c5a880]/40 hover:bg-[#1f1a14] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#221c16] text-[#c5a880]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#f0e9df] group-hover:text-[#c5a880] transition-colors">
                      Service Disciplines
                    </div>
                    <div className="text-[11px] text-[#786c5d]">
                      Update copy, deliverables & subcategories
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#786c5d] group-hover:text-[#c5a880] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/admin/media"
                className="flex items-center justify-between p-3 rounded-xl bg-[#171410] border border-[#262018] hover:border-[#c5a880]/40 hover:bg-[#1f1a14] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#221c16] text-[#c5a880]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#f0e9df] group-hover:text-[#c5a880] transition-colors">
                      Media Library
                    </div>
                    <div className="text-[11px] text-[#786c5d]">
                      Inspect high-res photos & storage buckets
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#786c5d] group-hover:text-[#c5a880] group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* System & Architecture Integrity Card */}
          <div className="rounded-2xl bg-[#12100d] border border-[#262018] p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-medium text-[#c5a880] uppercase tracking-wider">
              <Server className="w-4 h-4" />
              <span>Infrastructure Health</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[#1e1913]">
                <span className="text-[#8a7f70]">Next.js Runtime</span>
                <span className="font-mono text-[#e3dad0] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  v16.3.8 App Router
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#1e1913]">
                <span className="text-[#8a7f70]">Database Driver</span>
                <span className="font-mono text-[#e3dad0] flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      stats.isDbLive ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {stats.isDbLive ? 'Supabase PostgreSQL' : 'Local Fallback'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#1e1913]">
                <span className="text-[#8a7f70]">Session Security</span>
                <span className="font-mono text-[#e3dad0] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" />
                  JWT HttpOnly (7d)
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#8a7f70]">Lenis Admin Scroll</span>
                <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
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
