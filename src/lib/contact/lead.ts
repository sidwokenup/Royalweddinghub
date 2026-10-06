export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  eventType: string;
  services: string[];
  weddingDate: string;
  location: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  createdAt: string;
}

export function createLeadObject(params: Omit<LeadData, "createdAt">): LeadData {
  const lead: LeadData = {
    ...params,
    createdAt: new Date().toISOString(),
  };

  // Development logging only - prepared for CRM integration
  if (process.env.NODE_ENV !== "production") {
    console.info("[Royal Weddinghub Concierge Lead Captured]:", lead);
  }

  return lead;
}
