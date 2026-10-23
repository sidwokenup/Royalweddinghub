export const BUSINESS_INFO = {
  name: "Royal Wedding Hub",
  tagline: "Lucknow's Luxury Wedding Planning Experience",
  experience: "10+ Years",
  serviceArea: "Lucknow & Royal Destinations",
  hours: "24/7 Concierge",
  primaryPhone: "+919170701546",
  displayPhone: "+91 91707 01546",
  rawPhone: "9170701546",
  email: "Royalweddinghug@gmail.com",
  address: {
    line1: "SS 388, Ashiyana LDA Colony",
    line2: "Kanpur Road",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226012",
    full: "SS 388, Ashiyana LDA Colony, Kanpur Road, Lucknow",
  },
  instagram: {
    handle: "@royal_weddinghug",
    url: "https://www.instagram.com/royal_weddinghug?stkn=bndlcGtpMGY5NWVm",
  },
} as const;

export function getTelUrl(phone: string = BUSINESS_INFO.primaryPhone): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function getMailtoUrl(email = BUSINESS_INFO.email, subject = "Wedding Planning Enquiry - Royal Wedding Hub"): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
