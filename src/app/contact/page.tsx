import type { Metadata } from "next";
import { ConciergeContact } from "@/components/contact/ConciergeContact";

export const metadata: Metadata = {
  title: "The Wedding Concierge | Royal Wedding Hub Lucknow",
  description: "Connect directly with Royal Wedding Hub wedding concierge in Lucknow. Plan your royal celebration, heritage venues, catering, and artist management.",
  openGraph: {
    title: "The Wedding Concierge | Royal Wedding Hub Lucknow",
    description: "Connect directly with Royal Wedding Hub wedding concierge in Lucknow. Plan your royal celebration, heritage venues, catering, and artist management.",
  },
};

export default function ContactPage() {
  return <ConciergeContact />;
}
