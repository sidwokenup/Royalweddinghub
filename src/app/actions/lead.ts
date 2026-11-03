'use server';

import { revalidatePath } from 'next/cache';
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
      } else {
        revalidatePath('/admin');
        revalidatePath('/admin/enquiries');
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

export interface SubmitShahiFarmanParams {
  name: string;
  phone: string;
  weddingDate?: string;
  celebrationStyle?: string;
}

export interface SubmitShahiFarmanResult {
  success: boolean;
  leadNumber?: string;
  error?: string;
}

export async function submitShahiFarmanAction(
  params: SubmitShahiFarmanParams
): Promise<SubmitShahiFarmanResult> {
  const cleanName = params.name?.trim();
  const cleanPhone = params.phone?.replace(/\D/g, '');

  if (!cleanName || cleanName.length < 2) {
    return { success: false, error: 'Please enter your name / family name.' };
  }
  if (!cleanPhone || cleanPhone.length < 10) {
    return { success: false, error: 'Please enter a valid 10-digit WhatsApp number.' };
  }

  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const leadNumber = `RWH-FARMAN-${randomSuffix}`;
  const db = getAdminDb();

  const services = [
    '₹50,000 Mandap Décor Privilege',
    params.celebrationStyle || 'Palace Lawn (500–1,500 Guests)',
    'Shahi Farman Decree Offer',
  ];

  const notes = `[Shahi Farman ₹50K Privilege Lead]
Family Name: ${cleanName}
WhatsApp: ${cleanPhone}
Wedding Date / Muhurat: ${params.weddingDate || 'Upcoming Season'}
Celebration Style: ${params.celebrationStyle || 'Palace Lawn (500–1,500 Guests)'}
Privilege Claimed: ₹50,000 Bespoke Mandap Décor or 10% Royal Banquet Courtesy.`;

  if (db && isDatabaseConfigured()) {
    try {
      const { error } = await db.from('enquiries').insert({
        lead_number: leadNumber,
        name: cleanName,
        phone: cleanPhone,
        email: null,
        event_type: 'WEDDING',
        services_requested: services,
        wedding_date: params.weddingDate?.trim() || 'Upcoming 2026 Season',
        guest_count_bracket: params.celebrationStyle || '500–1,500 Guests',
        location: 'Lucknow',
        status: 'new',
        internal_notes: notes,
        utm_source: 'shahi_farman_decree',
        utm_medium: 'scroll_modal',
        utm_campaign: '50k_mandap_privilege',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error('[submitShahiFarmanAction] Insert error:', error.message);
        return { success: false, error: 'Database notice: ' + error.message };
      }

      revalidatePath('/admin');
      revalidatePath('/admin/enquiries');
    } catch (e: unknown) {
      console.error('[submitShahiFarmanAction] Exception:', e);
      return { success: false, error: 'Failed to record privilege. Please contact concierge.' };
    }
  } else {
    console.info('[submitShahiFarmanAction] Recorded in memory mode:', { leadNumber, ...params });
  }

  return {
    success: true,
    leadNumber,
  };
}

