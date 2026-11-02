/**
 * Unified Analytics & Ad Conversion Tracking for Royal Wedding Hub
 * Supports Google Analytics (gtag.js), Google Ads (AW-18508119901), and Meta Pixel (fbq)
 */

export const GOOGLE_ADS_ID = 'AW-18508119901';
export const GA4_MEASUREMENT_ID = 'G-4SJ7J5VBRS';

export function isOfficialDomain(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return host === 'www.royalweddinghub.com' || host === 'royalweddinghub.com';
}

type GtagArgs = [string, ...unknown[]];

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void;
    fbq?: (action: string, eventName: string, params?: Record<string, unknown>) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  action: string,
  params: Record<string, string | number | boolean | null | undefined> = {}
) {
  if (typeof window === 'undefined') return;
  if (!isOfficialDomain()) return;

  // Google Analytics (GA4) / Google Ads
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  }

  // Meta Pixel (fbq)
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', action, params);
  }
}

export function trackLeadGeneration(payload: {
  leadNumber?: string;
  eventType?: string;
  value?: number;
  currency?: string;
}) {
  if (typeof window === 'undefined') return;
  if (!isOfficialDomain()) return;

  const leadData: Record<string, string | number> = {
    currency: payload.currency || 'INR',
    value: payload.value ?? 10000,
    event_category: 'Lead',
    event_label: payload.eventType || 'Wedding Consultation',
  };

  if (payload.leadNumber) {
    leadData.transaction_id = payload.leadNumber;
  }

  // Google Analytics & Google Ads standard conversion events
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', leadData);
    window.gtag('event', 'conversion', {
      send_to: GOOGLE_ADS_ID,
      value: payload.value ?? 10000,
      currency: payload.currency || 'INR',
      transaction_id: payload.leadNumber || '',
    });
  }

  // Meta Pixel standard Lead event
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: payload.eventType || 'Wedding Consultation',
      currency: payload.currency || 'INR',
      value: payload.value ?? 10000,
    });
  }
}

export function trackWhatsAppClick(source: string) {
  trackEvent('contact_whatsapp', {
    event_category: 'Engagement',
    event_label: source,
  });
}

export function trackPhoneClick(source: string) {
  trackEvent('contact_phone', {
    event_category: 'Engagement',
    event_label: source,
  });
}
