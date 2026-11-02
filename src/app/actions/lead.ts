'use server';

import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';

export interface SubmitLeadParams {
  name: string;
  phone: string;
  email?: string;
  eventType?: string;
  services?: string[];
  weddingDate?: string;
  guestCountBracket?: string;
  budgetBracket?: string;
  location?: string;
  venueName?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface SubmitLeadResult {
  success: boolean;
  leadNumber: string;
  error?: string;
}

export async function submitLeadAction(data: SubmitLeadParams): Promise<SubmitLeadResult> {
  const leadNumber = `RWH-AD-${Date.now().toString().slice(-6)}`;
  const db = getAdminDb();

  if (db && isDatabaseConfigured()) {
    try {
      const services = data.services?.length
        ? data.services
        : [data.venueName ? `Venue: ${data.venueName}` : 'Venue Scouting & Planning', 'Shahi Quotation & Availability'];

      const notes = `[Royal Quotation Lead] Venue: ${data.venueName || 'Any'}. Budget Tier: ${data.budgetBracket || 'Under ₹15 Lakh'}. Guest Capacity: ${data.guestCountBracket || '500 Pax'}. Date/Season: ${data.weddingDate || 'Upcoming Season'}. Campaign: ${data.utmCampaign || 'Google Ads'}.`;

      const { error } = await db.from('enquiries').insert({
        lead_number: leadNumber,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || null,
        event_type: data.eventType || 'WEDDING',
        services_requested: services,
        wedding_date: data.weddingDate || 'TBD',
        guest_count_bracket: data.guestCountBracket || '500 Pax',
        location: data.location || 'Lucknow',
        status: 'new',
        internal_notes: notes,
        utm_source: data.utmSource || 'google_ads',
        utm_medium: data.utmMedium || 'cpc',
        utm_campaign: data.utmCampaign || 'wedding_venues_lucknow',
      });

      if (error) {
        console.warn('[submitLeadAction] Database insert notice:', error.message);
      }
    } catch (e: unknown) {
      console.warn('[submitLeadAction] Exception caught:', e instanceof Error ? e.message : e);
    }
  } else {
    console.info('[submitLeadAction] Captured lead in memory mode:', { leadNumber, ...data });
  }

  return {
    success: true,
    leadNumber,
  };
}

