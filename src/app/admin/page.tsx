import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar,
  Phone,
  Server,
  Zap,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import {
  RoyalPalaceIcon,
  RoyalInquiryScrollIcon,
  RoyalLotusCrestIcon,
  RoyalTestimonialSealIcon,
  RoyalGalleryFrameIcon,
} from '@/components/admin/icons/RoyalAdminIcons';
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

  // Dynamic Time-of-Day Greeting (Asia/Kolkata timezone)
  const currentHour = parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false,
    }).format(new Date()),
    10
  );
  const timeGreeting =
    currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#3D141F] via-[#240A12] to-[#120509] text-[#FAF7F2] shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(214,181,109,0.06)] border border-[#D6B56D]/30 relative overflow-hidden backdrop-blur-xl">
        {/* Subtle decorative glow */}
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(214,181,109,0.15)_0%,transparent_60%)] pointer-events-none" 
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6B56D]/40 bg-[#140509]/80 text-[#D6B56D] text-xs font-mono mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wider uppercase text-[10px] font-semibold">Royal Concierge Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF7F2] font-normal tracking-tight">
            {timeGreeting}, <span className="italic font-light text-[#D6B56D]">{admin.fullName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#B8ADA3] mt-2 font-light flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
            <span>{todayFormatted}</span>
            <span className="text-[#D6B56D]/40">•</span>
            <span>Lucknow Headquarters</span>
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link
            href="/admin/venues"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D6B56D] to-[#E5CCA0] hover:from-[#E0C385] hover:to-[#F2DFC0] text-[#1C1611] text-xs font-semibold tracking-wide transition-all shadow-[0_2px_12px_rgba(214,181,109,0.25)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-[#1C1611]" strokeWidth={1.75} />
            <span>Add Venue</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#FAF7F2] border border-[#D6B56D]/30 text-xs font-medium transition-all hover:border-[#D6B56D]/60"
          >
            <RoyalInquiryScrollIcon size={16} className="text-[#D6B56D]" />
            <span>View Inquiries</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid with Bespoke Royal Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Client Inquiries"
          value={stats.totalEnquiries}
          subtitle={`${stats.newEnquiries} awaiting consultation`}
          badge={stats.newEnquiries > 0 ? `${stats.newEnquiries} New` : 'Up to Date'}
          badgeType={stats.newEnquiries > 0 ? 'emerald' : 'neutral'}
          icon={RoyalInquiryScrollIcon}
          href="/admin/enquiries"
        />

        <MetricCard
          title="Curated Venues"
          value={stats.totalVenues}
          subtitle={`${stats.publishedVenues} live on public directory`}
          badge="Lucknow"
          badgeType="gold"
          icon={RoyalPalaceIcon}
          href="/admin/venues"
        />

        <MetricCard
          title="Services & Disciplines"
          value={stats.totalServices}
          subtitle="Catering, Decor, Photo, Music & More"
          badge="Active"
          badgeType="gold"
          icon={RoyalLotusCrestIcon}
          href="/admin/services"
        />

        <MetricCard
          title="Verified Stories"
          value={stats.totalTestimonials}
          subtitle="Private discretion card enforced"
          badge="Protected"
          badgeType="neutral"
          icon={RoyalTestimonialSealIcon}
          href="/admin/testimonials"
        />
      </div>

      {/* Main Two-Column Layout: Inquiries Pipeline + Quick Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: Inquiries Pipeline Bento Tile */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-[#181310]/85 border border-[#D6B56D]/15 p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl relative overflow-hidden">
            {/* Top subtle decorative ambient glow */}
            <div 
              className="absolute -top-16 -left-16 w-48 h-48 bg-[radial-gradient(ellipse_at_center,_rgba(214,181,109,0.08)_0%,_transparent_70%)] pointer-events-none" 
              aria-hidden="true" 
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#D6B56D]/15 relative z-10">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D6B56D] font-semibold mb-1">
                  Concierge Lead Queue
                </div>
                <h2 className="text-xl font-serif font-normal text-[#FAF7F2] tracking-tight">
                  Recent Inquiries Pipeline
                </h2>
                <p className="text-xs text-[#B8ADA3] mt-0.5 font-light">
                  Direct submissions from the interactive consultation concierge.
                </p>
              </div>

              <Link
                href="/admin/enquiries"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#D6B56D] hover:text-[#FAF7F2] border border-[#D6B56D]/20 text-xs font-mono font-medium transition-all group shrink-0"
              >
                <span>All Inquiries</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
              </Link>
            </div>

            {stats.recentEnquiries.length > 0 ? (
              <div className="divide-y divide-[#D6B56D]/10 mt-3 relative z-10">
                {stats.recentEnquiries.map((lead) => {
                  const leadPhoneDigits = lead.phone.replace(/[^0-9]/g, '');
                  const whatsappMessage = encodeURIComponent(
                    `Hello ${lead.name}, this is the Senior Wedding Concierge at Royal Wedding Hub. Thank you for your inquiry for your upcoming ${lead.event_type}. How may we assist your family?`
                  );
                  const whatsappUrl = `https://wa.me/${leadPhoneDigits}?text=${whatsappMessage}`;

                  return (
                    <div
                      key={lead.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-white/[0.03] px-3 rounded-2xl transition-all border border-transparent hover:border-[#D6B56D]/20"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-medium text-[#FAF7F2]">{lead.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#521D2B]/40 text-[#D6B56D] border border-[#D6B56D]/30 font-semibold">
                            {lead.lead_number}
                          </span>
                        </div>
                        <div className="text-xs text-[#B8ADA3] flex flex-wrap items-center gap-2.5 sm:gap-3 font-light">
                          <span className="flex items-center gap-1 font-medium text-[#FAF7F2]">
                            <Zap className="w-3 h-3 text-[#D6B56D]" strokeWidth={1.5} />
                            {lead.event_type}
                          </span>
                          <span className="text-[#D6B56D]/40">•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#D6B56D]" strokeWidth={1.5} />
                            {lead.wedding_date || 'Date TBD'}
                          </span>
                          <span className="text-[#D6B56D]/40">•</span>
                          <span className="flex items-center gap-1 font-mono text-[#C5BCB3]">
                            <Phone className="w-3 h-3 text-[#D6B56D]" strokeWidth={1.5} />
                            {lead.phone}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        {/* Direct WhatsApp Trigger Button */}
                        {leadPhoneDigits && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50 transition-all hover:scale-105 shadow-xs"
                            title={`Send direct WhatsApp message to ${lead.name}`}
                            aria-label={`Send direct WhatsApp message to ${lead.name}`}
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          </a>
                        )}

                        {/* Direct Phone Dial Button */}
                        {leadPhoneDigits && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-2 rounded-xl bg-white/[0.04] text-[#D6B56D] border border-[#D6B56D]/20 hover:bg-white/[0.08] transition-all hover:scale-105 shadow-xs"
                            title={`Call ${lead.name}`}
                            aria-label={`Call ${lead.name}`}
                          >
                            <Phone className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
                          </a>
                        )}

                        {/* Status Chip */}
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border font-semibold ${
                            lead.status === 'new'
                              ? 'bg-sky-950/50 text-sky-300 border-sky-500/40'
                              : lead.status === 'contacted'
                              ? 'bg-amber-950/50 text-amber-300 border-amber-500/40'
                              : lead.status === 'booked'
                              ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40'
                              : 'bg-white/[0.04] text-[#B8ADA3] border-white/[0.08]'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-14 px-4 text-center relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#521D2B]/40 to-[#2A0E16]/40 border border-[#D6B56D]/30 text-[#D6B56D] flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Clock className="w-6 h-6 text-[#D6B56D]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-serif font-normal text-[#FAF7F2]">
                  No Active Leads in Queue
                </h3>
                <p className="text-xs text-[#B8ADA3] max-w-sm mx-auto mt-2 leading-relaxed font-light">
                  Incoming client consultations submitted via{' '}
                  <span className="text-[#D6B56D] font-medium">RoyalWeddingHub.com/contact</span> will record
                  here automatically in real-time with zero latency.
                </p>
                <div className="mt-5">
                  <Link
                    href="/contact"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-[#D6B56D]/30 text-xs font-mono text-[#D6B56D] hover:text-[#FAF7F2] transition-all"
                  >
                    <span>Test Concierge Card on /contact</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Action Hub & System Integrity */}
        <div className="space-y-6">
          {/* Quick Hub Bento Card */}
          <div className="rounded-3xl bg-[#181310]/85 border border-[#D6B56D]/15 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D6B56D] font-semibold mb-1">
              Concierge Operations
            </div>
            <h2 className="text-lg font-serif font-normal text-[#FAF7F2] tracking-tight mb-1">
              Editorial Quick Actions
            </h2>
            <p className="text-xs text-[#B8ADA3] mb-4 font-light">
              Direct access to content creation and live website assets.
            </p>

            <div className="space-y-2.5">
              <Link
                href="/admin/venues"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#D6B56D]/40 hover:bg-white/[0.05] transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#2E1A1E] to-[#120B0D] border border-[#D6B56D]/30 text-[#D6B56D] flex items-center justify-center group-hover:scale-105 group-hover:border-[#D6B56D]/70 transition-all shadow-xs">
                    <RoyalPalaceIcon size={18} className="text-[#D6B56D]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#FAF7F2] group-hover:text-[#D6B56D] transition-colors">
                      Manage Venue Catalog
                    </div>
                    <div className="text-[10px] text-[#8C8070] font-light">
                      Pricing, pax capacity & galleries
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C8070] group-hover:text-[#D6B56D] group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
              </Link>

              <Link
                href="/admin/services"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#D6B56D]/40 hover:bg-white/[0.05] transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#2E1A1E] to-[#120B0D] border border-[#D6B56D]/30 text-[#D6B56D] flex items-center justify-center group-hover:scale-105 group-hover:border-[#D6B56D]/70 transition-all shadow-xs">
                    <RoyalLotusCrestIcon size={18} className="text-[#D6B56D]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#FAF7F2] group-hover:text-[#D6B56D] transition-colors">
                      Service Disciplines
                    </div>
                    <div className="text-[10px] text-[#8C8070] font-light">
                      Copy, deliverables & packages
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C8070] group-hover:text-[#D6B56D] group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
              </Link>

              <Link
                href="/admin/media"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#D6B56D]/40 hover:bg-white/[0.05] transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#2E1A1E] to-[#120B0D] border border-[#D6B56D]/30 text-[#D6B56D] flex items-center justify-center group-hover:scale-105 group-hover:border-[#D6B56D]/70 transition-all shadow-xs">
                    <RoyalGalleryFrameIcon size={18} className="text-[#D6B56D]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#FAF7F2] group-hover:text-[#D6B56D] transition-colors">
                      Media Library
                    </div>
                    <div className="text-[10px] text-[#8C8070] font-light">
                      High-res assets & storage buckets
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C8070] group-hover:text-[#D6B56D] group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
              </Link>

              <Link
                href="/admin/testimonials"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#D6B56D]/40 hover:bg-white/[0.05] transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#2E1A1E] to-[#120B0D] border border-[#D6B56D]/30 text-[#D6B56D] flex items-center justify-center group-hover:scale-105 group-hover:border-[#D6B56D]/70 transition-all shadow-xs">
                    <RoyalTestimonialSealIcon size={18} className="text-[#D6B56D]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#FAF7F2] group-hover:text-[#D6B56D] transition-colors">
                      Verified Stories
                    </div>
                    <div className="text-[10px] text-[#8C8070] font-light">
                      Couples feedback & testimonials
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8C8070] group-hover:text-[#D6B56D] group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* System & Architecture Integrity Bento Card */}
          <div className="rounded-3xl bg-[#181310]/85 border border-[#D6B56D]/15 p-6 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D6B56D] uppercase tracking-wider font-mono">
              <Server className="w-4 h-4 text-[#D6B56D]" />
              <span>Infrastructure Health</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-[#D6B56D]/10">
                <span className="text-[#B8ADA3] font-light">Next.js Runtime</span>
                <span className="font-mono text-[#FAF7F2] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  v16.3.8 App Router
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#D6B56D]/10">
                <span className="text-[#B8ADA3] font-light">Database Driver</span>
                <span className="font-mono text-[#FAF7F2] font-medium flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      stats.isDbLive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-amber-400'
                    }`}
                  />
                  {stats.isDbLive ? 'Supabase PostgreSQL' : 'Local Fallback'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#D6B56D]/10">
                <span className="text-[#B8ADA3] font-light">Session Security</span>
                <span className="font-mono text-[#FAF7F2] font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D6B56D]" />
                  JWT HttpOnly (7d)
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-[#B8ADA3] font-light">Lenis Admin Scroll</span>
                <span className="font-mono text-emerald-400 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
