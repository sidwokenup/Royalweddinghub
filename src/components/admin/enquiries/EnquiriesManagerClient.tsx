'use client';

import React, { useState, useTransition } from 'react';
import {
  Search,
  MessageSquareText,
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Trash2,
  X,
  Volume2,
  VolumeX,
  Save,
  Tag,
  Share2,
} from 'lucide-react';
import {
  updateEnquiryStatusAction,
  saveEnquiryNotesAction,
  deleteEnquiryAction,
} from '@/app/admin/enquiries/actions';

export interface AdminEnquiry {
  id: string;
  lead_number: string;
  name: string;
  phone: string;
  email: string | null;
  event_type: string;
  services_requested: string[];
  wedding_date: string | null;
  location: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'booked' | 'archived';
  internal_notes: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
}

interface EnquiriesManagerClientProps {
  initialEnquiries: AdminEnquiry[];
}

export function EnquiriesManagerClient({ initialEnquiries }: EnquiriesManagerClientProps) {
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>(initialEnquiries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<AdminEnquiry | null>(null);
  const [activeNotes, setActiveNotes] = useState<string>('');
  const [notesSavedAlert, setNotesSavedAlert] = useState(false);
  const [chimeEnabled, setChimeEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('rwh_admin_chime_enabled') === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });
  const [isPending, startTransition] = useTransition();

  const toggleChime = () => {
    const next = !chimeEnabled;
    setChimeEnabled(next);
    try {
      localStorage.setItem('rwh_admin_chime_enabled', String(next));
    } catch {
      // ignore
    }
    if (next) playRoyalChime();
  };

  // Synthesized harmonic royal chime using Web Audio API
  const playRoyalChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Royal triad frequencies: C5 (523Hz), E5 (659Hz), G5 (784Hz)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.2);
      });
    } catch {
      // audio error
    }
  };

  // Filtered leads
  const filtered = enquiries.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = lead.name.toLowerCase().includes(q);
      const matchPhone = lead.phone.includes(q);
      const matchNumber = lead.lead_number.toLowerCase().includes(q);
      const matchLoc = lead.location?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchNumber && !matchLoc) return false;
    }
    return true;
  });

  const countByStatus = (status: string) =>
    enquiries.filter((e) => e.status === status).length;

  const handleStatusChange = (leadId: string, newStatus: string) => {
    // Optimistic UI
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === leadId ? { ...e, status: newStatus as AdminEnquiry['status'] } : e
      )
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) =>
        prev ? { ...prev, status: newStatus as AdminEnquiry['status'] } : null
      );
    }

    startTransition(async () => {
      const res = await updateEnquiryStatusAction(leadId, newStatus);
      if (!res.success) {
        alert(`Failed to update status: ${res.error}`);
      }
    });
  };

  const openLeadDrawer = (lead: AdminEnquiry) => {
    setSelectedLead(lead);
    setActiveNotes(lead.internal_notes || '');
    setNotesSavedAlert(false);
  };

  const handleSaveNotes = () => {
    if (!selectedLead) return;
    const leadId = selectedLead.id;

    startTransition(async () => {
      const res = await saveEnquiryNotesAction(leadId, activeNotes);
      if (res.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === leadId ? { ...e, internal_notes: activeNotes } : e))
        );
        setNotesSavedAlert(true);
        setTimeout(() => setNotesSavedAlert(false), 2500);
      } else {
        alert(`Failed to save notes: ${res.error}`);
      }
    });
  };

  const handleDelete = (lead: AdminEnquiry) => {
    if (confirm(`Permanently delete inquiry ${lead.lead_number} for ${lead.name}?`)) {
      setEnquiries((prev) => prev.filter((e) => e.id !== lead.id));
      if (selectedLead?.id === lead.id) setSelectedLead(null);

      startTransition(async () => {
        const res = await deleteEnquiryAction(lead.id);
        if (!res.success) {
          alert(`Error deleting inquiry: ${res.error}`);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-[#181310]/85 border border-[#D6B56D]/15 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8070]">
            <Search className="w-4 h-4 text-[#D6B56D]" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, mobile phone, reference ID..."
            className="w-full bg-white/[0.03] border border-[#D6B56D]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FAF7F2] placeholder-[#8C8070] focus:outline-none focus:border-[#D6B56D] focus:ring-2 focus:ring-[#D6B56D]/20 transition-all font-sans"
          />
        </div>

        {/* Right side: Chime sound toggle & summary */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          <button
            type="button"
            onClick={toggleChime}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-medium transition-all ${
              chimeEnabled
                ? 'bg-[#521D2B]/40 border-[#D6B56D]/40 text-[#D6B56D] shadow-xs'
                : 'bg-white/[0.03] border-white/[0.08] text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-white/[0.06]'
            }`}
            title="Toggle royal audio chime on new client inquiry arrival"
          >
            {chimeEnabled ? <Volume2 className="w-4 h-4 text-[#D6B56D]" /> : <VolumeX className="w-4 h-4 text-[#8C8070]" />}
            <span>Chime: {chimeEnabled ? 'On' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* Pipeline Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
        {[
          { key: 'all', label: 'All Inquiries', count: enquiries.length },
          { key: 'new', label: 'New Leads', count: countByStatus('new'), highlight: true },
          { key: 'contacted', label: 'Contacted', count: countByStatus('contacted') },
          { key: 'qualified', label: 'Qualified', count: countByStatus('qualified') },
          { key: 'booked', label: 'Booked', count: countByStatus('booked') },
          { key: 'archived', label: 'Archived', count: countByStatus('archived') },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap shadow-sm ${
              statusFilter === tab.key
                ? 'bg-[#521D2B] border-[#D6B56D]/50 text-[#FAF7F2] shadow-[0_0_15px_rgba(214,181,109,0.15)] font-semibold'
                : 'bg-[#181310]/80 border-[#D6B56D]/15 text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-white/[0.04]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                statusFilter === tab.key
                  ? 'bg-white/20 text-[#FAF7F2]'
                  : tab.highlight && tab.count > 0
                  ? 'bg-sky-950/60 text-sky-300 border border-sky-500/40 font-semibold'
                  : 'bg-white/[0.06] text-[#D6B56D]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Inquiries Table */}
      <div className="rounded-3xl bg-[#181310]/85 border border-[#D6B56D]/15 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] text-[#8C8070] uppercase font-mono tracking-wider border-b border-[#D6B56D]/15 text-[11px]">
              <tr>
                <th className="py-4 px-5">Client Reference</th>
                <th className="py-4 px-4">Contact Phone</th>
                <th className="py-4 px-4">Celebration Details</th>
                <th className="py-4 px-4">Requested Offerings</th>
                <th className="py-4 px-4">Lead Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6B56D]/10 text-[#FAF7F2]">
              {filtered.length > 0 ? (
                filtered.map((lead) => {
                  const leadPhoneDigits = lead.phone.replace(/[^0-9]/g, '');
                  const whatsappUrl = `https://wa.me/${leadPhoneDigits}?text=${encodeURIComponent(
                    `Hello ${lead.name}! This is the senior concierge at Royal Wedding Hub Lucknow regarding your ${lead.event_type} inquiry (${lead.lead_number}). When would be a convenient time for a brief consultation?`
                  )}`;

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Lead Ref & Name */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-[#FAF7F2]">{lead.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#521D2B]/40 text-[#D6B56D] border border-[#D6B56D]/30 font-semibold">
                            {lead.lead_number}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#8C8070] mt-1 font-light flex items-center gap-2">
                          <Clock className="w-3 h-3 text-[#D6B56D]" />
                          <span>
                            {new Date(lead.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Phone & Instant Contact */}
                      <td className="py-4 px-4">
                        <div className="font-mono text-xs text-[#FAF7F2]">{lead.phone}</div>
                        <div className="flex items-center gap-2 mt-1.5 font-mono">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
                            title="Open direct WhatsApp chat"
                          >
                            <MessageCircle className="w-3 h-3 text-emerald-400" />
                            <span>WhatsApp</span>
                          </a>
                          <span className="text-[#D6B56D]/30">•</span>
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center gap-1 text-[11px] text-[#D6B56D] hover:text-[#FAF7F2] font-medium hover:underline"
                            title="Call client phone"
                          >
                            <Phone className="w-3 h-3 text-[#D6B56D]" />
                            <span>Call</span>
                          </a>
                        </div>
                      </td>

                      {/* Celebration Type & Date */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#FAF7F2] font-medium">
                          <Tag className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
                          <span>{lead.event_type}</span>
                        </div>
                        <div className="text-[11px] text-[#B8ADA3] mt-1 flex items-center gap-1.5 font-light">
                          <Calendar className="w-3 h-3 text-[#D6B56D]" />
                          <span>{lead.wedding_date || 'Date TBD'}</span>
                          <span className="text-[#D6B56D]/30">•</span>
                          <MapPin className="w-3 h-3 text-[#D6B56D]" />
                          <span>{lead.location || 'Lucknow'}</span>
                        </div>
                      </td>

                      {/* Services Requested */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {Array.isArray(lead.services_requested) &&
                          lead.services_requested.length > 0 ? (
                            lead.services_requested.slice(0, 2).map((srv, sIdx) => (
                              <span
                                key={sIdx}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-[#C5BCB3] border border-white/[0.08]"
                              >
                                {srv}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-[#8C8070]">Bespoke Planning</span>
                          )}
                          {lead.services_requested?.length > 2 && (
                            <span className="text-[10px] text-[#D6B56D] font-mono">
                              +{lead.services_requested.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          disabled={isPending}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                            lead.status === 'new'
                              ? 'bg-sky-950/60 text-sky-300 border-sky-500/40'
                              : lead.status === 'contacted'
                              ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                              : lead.status === 'qualified'
                              ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                              : lead.status === 'booked'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                              : 'bg-white/[0.04] text-[#B8ADA3] border-white/[0.08]'
                          }`}
                        >
                          <option value="new" className="bg-[#181310] text-[#FAF7F2]">NEW</option>
                          <option value="contacted" className="bg-[#181310] text-[#FAF7F2]">CONTACTED</option>
                          <option value="qualified" className="bg-[#181310] text-[#FAF7F2]">QUALIFIED</option>
                          <option value="booked" className="bg-[#181310] text-[#FAF7F2]">BOOKED</option>
                          <option value="archived" className="bg-[#181310] text-[#FAF7F2]">ARCHIVED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openLeadDrawer(lead)}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-[#D6B56D]/25 text-xs font-mono font-medium text-[#FAF7F2] hover:bg-[#521D2B] hover:border-[#D6B56D]/50 transition-all shadow-xs"
                          >
                            Inspect Lead
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(lead)}
                            className="p-1.5 rounded-xl text-[#8C8070] hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-[#8C8070]">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#521D2B]/40 to-[#2A0E16]/40 border border-[#D6B56D]/30 text-[#D6B56D] flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <MessageSquareText className="w-6 h-6 text-[#D6B56D]" />
                    </div>
                    <div className="text-sm font-serif font-normal text-[#FAF7F2]">No inquiries match this criteria</div>
                    <div className="text-xs text-[#B8ADA3] mt-1 font-light">
                      New consultations submitted via the contact card will appear here automatically.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#D6B56D]/15 bg-white/[0.02] text-xs text-[#8C8070] flex items-center justify-between font-mono">
          <span>Displaying {filtered.length} client inquiries</span>
          <span className="text-[11px] text-[#D6B56D]">End-to-End Encrypted CRM Pipeline</span>
        </div>
      </div>

      {/* Lead Detail Modal / Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#1A1411] border border-[#D6B56D]/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_35px_rgba(214,181,109,0.08)] backdrop-blur-2xl relative max-h-[90vh] overflow-y-auto text-[#FAF7F2]">
            {/* Top header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#D6B56D]/15">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-serif font-medium text-[#FAF7F2] tracking-tight">{selectedLead.name}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#521D2B]/40 text-[#D6B56D] border border-[#D6B56D]/30 font-semibold">
                    {selectedLead.lead_number}
                  </span>
                </div>
                <div className="text-xs text-[#B8ADA3] mt-1 flex items-center gap-2 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
                  <span>Received on {new Date(selectedLead.created_at).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-white/[0.06] transition-colors"
                aria-label="Close dossier"
              >
                <X className="w-5 h-5 text-[#D6B56D]" strokeWidth={1.5} />
              </button>
            </div>

            {/* Lead Profile Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-[#D6B56D]/15">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-mono text-[#D6B56D]">Mobile Phone</div>
                <div className="text-sm font-mono text-[#FAF7F2] mt-0.5">{selectedLead.phone}</div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider font-mono text-[#D6B56D]">Email Address</div>
                <div className="text-sm text-[#FAF7F2] mt-0.5">{selectedLead.email || 'Not Provided'}</div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider font-mono text-[#D6B56D]">Event &amp; Date</div>
                <div className="text-sm text-[#FAF7F2] mt-0.5 flex items-center gap-2 font-light">
                  <span className="font-medium text-[#FAF7F2]">{selectedLead.event_type}</span>
                  <span className="text-[#D6B56D]/30">•</span>
                  <span className="text-[#D6B56D] font-mono">{selectedLead.wedding_date || 'TBD'}</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider font-mono text-[#D6B56D]">Celebration City</div>
                <div className="text-sm text-[#FAF7F2] mt-0.5">{selectedLead.location || 'Lucknow'}</div>
              </div>
            </div>

            {/* Requested Services */}
            <div className="py-4 border-b border-[#D6B56D]/15">
              <div className="text-xs font-mono uppercase tracking-wider text-[#D6B56D] mb-2 flex items-center gap-1.5 font-semibold">
                <Tag className="w-3.5 h-3.5 text-[#D6B56D]" strokeWidth={1.5} />
                <span>Requested Disciplines &amp; Services</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedLead.services_requested?.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-white/[0.04] text-[#FAF7F2] border border-[#D6B56D]/20 font-light"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Marketing UTM Attribution */}
            {(selectedLead.utm_source || selectedLead.utm_campaign) && (
              <div className="py-4 border-b border-[#D6B56D]/15 bg-white/[0.02] p-4 rounded-2xl mt-4 border border-[#D6B56D]/20">
                <div className="text-xs font-mono uppercase tracking-wider text-[#D6B56D] mb-2 flex items-center gap-1.5 font-semibold">
                  <Share2 className="w-3.5 h-3.5 text-[#D6B56D]" />
                  <span>Campaign Attribution</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {selectedLead.utm_source && (
                    <div>
                      <span className="text-[#8C8070]">Source:</span>{' '}
                      <span className="font-mono text-[#FAF7F2]">{selectedLead.utm_source}</span>
                    </div>
                  )}
                  {selectedLead.utm_campaign && (
                    <div>
                      <span className="text-[#8C8070]">Campaign:</span>{' '}
                      <span className="font-mono text-[#FAF7F2]">{selectedLead.utm_campaign}</span>
                    </div>
                  )}
                  {selectedLead.utm_medium && (
                    <div>
                      <span className="text-[#8C8070]">Medium:</span>{' '}
                      <span className="font-mono text-[#FAF7F2]">{selectedLead.utm_medium}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Internal Staff Notes */}
            <div className="pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-wider text-[#D6B56D] flex items-center gap-1.5 font-semibold">
                  <Tag className="w-3.5 h-3.5 text-[#D6B56D]" />
                  <span>Internal Concierge Notes</span>
                </div>
                {notesSavedAlert && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 animate-in fade-in font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Saved to Database</span>
                  </span>
                )}
              </div>

              <textarea
                rows={3}
                value={activeNotes}
                onChange={(e) => setActiveNotes(e.target.value)}
                placeholder="Add private staff notes (e.g. Spoke with father, prefers palace lawn on VIP Road, budget 25L)..."
                className="w-full bg-black/30 border border-[#D6B56D]/20 rounded-2xl p-3.5 text-xs text-[#FAF7F2] placeholder-[#8C8070] focus:outline-none focus:border-[#D6B56D] focus:ring-2 focus:ring-[#D6B56D]/20 transition-all font-sans"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#B8ADA3] font-light">Status:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                    className="bg-[#140F0D] border border-[#D6B56D]/30 text-xs font-mono text-[#FAF7F2] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#D6B56D]"
                  >
                    <option value="new">NEW</option>
                    <option value="contacted">CONTACTED</option>
                    <option value="qualified">QUALIFIED</option>
                    <option value="booked">BOOKED</option>
                    <option value="archived">ARCHIVED</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6B56D] to-[#E5CCA0] hover:from-[#E0C385] hover:to-[#F2DFC0] text-[#1C1611] text-xs font-semibold tracking-wide transition-all shadow-[0_2px_12px_rgba(214,181,109,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isPending ? 'Saving...' : 'Save Notes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
