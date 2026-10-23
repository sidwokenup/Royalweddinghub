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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] shadow-[0_1px_3px_rgba(28,22,17,0.03)]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8070]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, mobile phone, reference ID..."
            className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1C1611] placeholder-[#8C8070] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
          />
        </div>

        {/* Right side: Chime sound toggle & summary */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          <button
            type="button"
            onClick={toggleChime}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
              chimeEnabled
                ? 'bg-[#FDF9F0] border-[#E9DECA] text-[#705527]'
                : 'bg-[#F8F5EE] border-[#DDD5C7] text-[#5C5245] hover:text-[#1C1611]'
            }`}
            title="Toggle royal audio chime on new client inquiry arrival"
          >
            {chimeEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
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
                ? 'bg-[#521D2B] border-[#521D2B] text-white shadow-sm'
                : 'bg-[#FFFFFF] border-[#EAE4D9] text-[#5C5245] hover:text-[#1C1611] hover:border-[#DDD5C7]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                statusFilter === tab.key
                  ? 'bg-white/20 text-white'
                  : tab.highlight && tab.count > 0
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-[#F5F2EB] text-[#7A6E5F]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Inquiries Table */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#EAE4D9] overflow-hidden shadow-[0_1px_3px_rgba(28,22,17,0.03),0_4px_12px_-2px_rgba(28,22,17,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] text-[#5C5245] uppercase font-mono tracking-wider border-b border-[#EAE4D9]">
              <tr>
                <th className="py-4 px-5">Client Reference</th>
                <th className="py-4 px-4">Contact Phone</th>
                <th className="py-4 px-4">Celebration Details</th>
                <th className="py-4 px-4">Requested Offerings</th>
                <th className="py-4 px-4">Lead Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1] text-[#1C1611]">
              {filtered.length > 0 ? (
                filtered.map((lead) => {
                  const whatsappUrl = `https://wa.me/91${lead.phone}?text=${encodeURIComponent(
                    `Hello ${lead.name}! This is the senior concierge at Royal Wedding Hub Lucknow regarding your ${lead.event_type} inquiry (${lead.lead_number}). When would be a convenient time for a brief consultation?`
                  )}`;

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#FDFBF7] transition-colors group"
                    >
                      {/* Lead Ref & Name */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-[#1C1611]">{lead.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FDF9F0] text-[#705527] border border-[#E9DECA]">
                            {lead.lead_number}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#7A6E5F] mt-1 font-light flex items-center gap-2">
                          <Clock className="w-3 h-3 text-[#85662F]" />
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
                        <div className="font-mono text-xs text-[#1C1611]">{lead.phone}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-medium hover:underline"
                            title="Open WhatsApp chat"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                          <span className="text-[#DDD5C7]">•</span>
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center gap-1 text-[11px] text-[#85662F] hover:text-[#521D2B] font-medium hover:underline"
                            title="Call client phone"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                        </div>
                      </td>

                      {/* Celebration Type & Date */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-[#1C1611] font-medium font-sans">
                          <Tag className="w-3.5 h-3.5 text-[#85662F]" strokeWidth={1.5} />
                          <span>{lead.event_type}</span>
                        </div>
                        <div className="text-[11px] text-[#5C5245] mt-1 flex items-center gap-1.5 font-light">
                          <Calendar className="w-3 h-3" />
                          <span>{lead.wedding_date || 'Date TBD'}</span>
                          <span>•</span>
                          <MapPin className="w-3 h-3" />
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
                                className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8F5EE] text-[#5C5245] border border-[#EAE4D9]"
                              >
                                {srv}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-[#8C8070]">Bespoke Planning</span>
                          )}
                          {lead.services_requested?.length > 2 && (
                            <span className="text-[10px] text-[#8C8070] font-mono">
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
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : lead.status === 'contacted'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : lead.status === 'qualified'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : lead.status === 'booked'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : 'bg-[#F5F2EB] text-[#7A6E5F] border-[#E2DBD0]'
                          }`}
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="qualified">QUALIFIED</option>
                          <option value="booked">BOOKED</option>
                          <option value="archived">ARCHIVED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openLeadDrawer(lead)}
                            className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-xs font-medium text-[#1C1611] hover:bg-[#521D2B] hover:text-white hover:border-[#521D2B] transition-all shadow-sm"
                          >
                            Inspect Lead
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(lead)}
                            className="p-1.5 rounded-xl text-[#8C8070] hover:text-red-600 hover:bg-red-50 transition-colors"
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
                  <td colSpan={6} className="py-12 text-center text-[#8C8070]">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8F5EE] border border-[#EAE4D9] text-[#85662F] flex items-center justify-center mx-auto mb-3">
                      <MessageSquareText className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-medium text-[#1C1611]">No inquiries match this criteria</div>
                    <div className="text-xs text-[#5C5245] mt-1 font-light">
                      New consultations submitted via the contact card will appear here automatically.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EAE4D9] bg-[#FBF9F5] text-xs text-[#7A6E5F] flex items-center justify-between">
          <span>Displaying {filtered.length} client inquiries</span>
          <span className="font-mono text-[11px]">End-to-End Encrypted CRM Pipeline</span>
        </div>
      </div>

      {/* Lead Detail Modal / Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] border border-[#DDD5C7] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Top header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#F2ECE1]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-sans font-bold text-[#1C1611] tracking-tight">{selectedLead.name}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#FDF9F0] text-[#705527] border border-[#E9DECA]">
                    {selectedLead.lead_number}
                  </span>
                </div>
                <div className="text-xs text-[#5C5245] mt-1 flex items-center gap-2 font-sans">
                  <Clock className="w-3.5 h-3.5 text-[#85662F]" strokeWidth={1.5} />
                  <span>Received on {new Date(selectedLead.created_at).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl text-[#8C8070] hover:text-[#1C1611] hover:bg-[#F8F5EE] transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Lead Profile Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-[#F2ECE1]">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-mono text-[#5C5245]">Mobile Phone</div>
                <div className="text-sm font-mono text-[#1C1611] mt-0.5">{selectedLead.phone}</div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider font-mono text-[#5C5245]">Email Address</div>
                <div className="text-sm text-[#1C1611] mt-0.5">{selectedLead.email || 'Not Provided'}</div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider font-mono text-[#5C5245]">Event & Date</div>
                <div className="text-sm text-[#1C1611] mt-0.5 flex items-center gap-2">
                  <span>{selectedLead.event_type}</span>
                  <span className="text-[#DDD5C7]">•</span>
                  <span className="text-[#85662F] font-medium">{selectedLead.wedding_date || 'TBD'}</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider font-mono text-[#5C5245]">Celebration City</div>
                <div className="text-sm text-[#1C1611] mt-0.5">{selectedLead.location || 'Lucknow'}</div>
              </div>
            </div>

            {/* Requested Services */}
            <div className="py-4 border-b border-[#F2ECE1]">
              <div className="text-xs font-mono uppercase tracking-wider text-[#85662F] mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Requested Disciplines & Services</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedLead.services_requested?.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-[#F8F5EE] text-[#1C1611] border border-[#EAE4D9]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Marketing UTM Attribution */}
            {(selectedLead.utm_source || selectedLead.utm_campaign) && (
              <div className="py-4 border-b border-[#F2ECE1] bg-[#FBF9F5] p-4 rounded-2xl mt-4 border border-[#EAE4D9]">
                <div className="text-xs font-mono uppercase tracking-wider text-[#85662F] mb-2 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Campaign Attribution</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {selectedLead.utm_source && (
                    <div>
                      <span className="text-[#5C5245]">Source:</span>{' '}
                      <span className="font-mono text-[#1C1611]">{selectedLead.utm_source}</span>
                    </div>
                  )}
                  {selectedLead.utm_campaign && (
                    <div>
                      <span className="text-[#5C5245]">Campaign:</span>{' '}
                      <span className="font-mono text-[#1C1611]">{selectedLead.utm_campaign}</span>
                    </div>
                  )}
                  {selectedLead.utm_medium && (
                    <div>
                      <span className="text-[#5C5245]">Medium:</span>{' '}
                      <span className="font-mono text-[#1C1611]">{selectedLead.utm_medium}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Internal Staff Notes */}
            <div className="pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-wider text-[#85662F] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Internal Concierge Notes</span>
                </div>
                {notesSavedAlert && (
                  <span className="text-xs text-emerald-700 flex items-center gap-1 animate-in fade-in">
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
                className="w-full bg-[#FFFFFF] border border-[#DDD5C7] rounded-2xl p-3.5 text-xs text-[#1C1611] focus:outline-none focus:border-[#521D2B] focus:ring-2 focus:ring-[#521D2B]/10 transition-all"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5C5245]">Change Status:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                    className="bg-[#FFFFFF] border border-[#DDD5C7] text-xs font-mono text-[#1C1611] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#521D2B]"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#521D2B] text-white text-xs font-medium hover:bg-[#682637] transition-colors shadow-sm"
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
