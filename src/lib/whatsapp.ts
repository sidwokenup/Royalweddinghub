import { BUSINESS_INFO } from "./contact";
import { getStoredCampaignParams } from "./campaign";

export interface WhatsAppOptions {
  service?: string;
  name?: string;
  date?: string;
  customMessage?: string;
  includeCampaign?: boolean;
}

export function generateWhatsAppLink(options: WhatsAppOptions = {}): string {
  const { service, name, date, customMessage, includeCampaign = true } = options;

  let text = customMessage;

  if (!text) {
    let greeting = "Hello Royal Wedding Hub!";
    if (name) {
      greeting = `Hello Royal Wedding Hub! My name is ${name}.`;
    }

    let detail = "I found you through your website and would like to discuss planning my wedding in Lucknow.";
    if (service) {
      detail = `I would like to discuss ${service} for my wedding in Lucknow.`;
    }
    if (date) {
      detail += ` Tentative celebration date: ${date}.`;
    }

    text = `${greeting} ${detail}`;

    if (includeCampaign) {
      const campaign = getStoredCampaignParams();
      if (campaign.utm_campaign || campaign.utm_source) {
        const tag = ` [Ref: ${campaign.utm_campaign || campaign.utm_source}]`;
        text += tag;
      }
    }
  }

  const encoded = encodeURIComponent(text);
  const raw = (('whatsappPhone' in BUSINESS_INFO ? (BUSINESS_INFO as Record<string, unknown>).whatsappPhone : null) || BUSINESS_INFO.rawPhone || '919170701546') as string;
  const digits = raw.replace(/\D/g, '');
  const waNumber = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${waNumber}?text=${encoded}`;
}
