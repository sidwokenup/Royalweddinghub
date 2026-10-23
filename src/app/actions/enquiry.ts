'use server';

import { revalidatePath } from 'next/cache';
import { getAdminDb, isDatabaseConfigured } from '@/lib/db/client';

export interface LeadSubmissionPayload {
  name: string;
  phone: string;
  email?: string;
  eventType?: string;
  services?: string[];
  weddingDate?: string;
  location?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export interface LeadSubmissionResponse {
  success: boolean;
  leadNumber?: string;
  error?: string;
}

/**
 * Public Server Action for submitting concierge inquiries from /contact
 */
export async function submitConciergeLeadAction(
  payload: LeadSubmissionPayload
): Promise<LeadSubmissionResponse> {
  const cleanName = payload.name?.trim();
  const cleanPhone = payload.phone?.replace(/\D/g, '');

  if (!cleanName || !cleanPhone || cleanPhone.length < 10) {
    return {
      success: false,
      error: 'Please provide a valid name and 10-digit mobile number.',
    };
  }

  // Generate unique royal lead reference number e.g. RWH-847291
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const leadNumber = `RWH-${randomSuffix}`;

  if (isDatabaseConfigured()) {
    const db = getAdminDb();
    if (db) {
      try {
        const { error } = await db.from('enquiries').insert({
          lead_number: leadNumber,
          name: cleanName,
          phone: cleanPhone,
          email: payload.email?.trim() || null,
          event_type: payload.eventType || 'WEDDING',
          services_requested: payload.services || ['FULL WEDDING PLANNING'],
          wedding_date: payload.weddingDate?.trim() || 'Date TBD',
          location: payload.location?.trim() || 'Lucknow',
          status: 'new',
          internal_notes: null,
          utm_source: payload.utmSource || null,
          utm_medium: payload.utmMedium || null,
          utm_campaign: payload.utmCampaign || null,
          utm_content: payload.utmContent || null,
          utm_term: payload.utmTerm || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error('[Concierge Lead] Database insert error:', error.message);
        } else {
          // Revalidate admin views
          revalidatePath('/admin');
          revalidatePath('/admin/enquiries');
        }
      } catch (err) {
        console.error('[Concierge Lead] Submission exception:', err);
      }
    }
  }

  return {
    success: true,
    leadNumber,
  };
}
