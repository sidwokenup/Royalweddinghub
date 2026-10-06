import type { Metadata } from "next";
import { ConciergeContact } from "@/components/contact/ConciergeContact";

export const metadata: Metadata = {
  title: "The Wedding Concierge | The Royal Weddinghub Lucknow",
  description: "Connect directly with The Royal Weddinghub wedding concierge in Lucknow. Plan your royal celebration, heritage venues, catering, and artist management.",
  openGraph: {
    title: "The Wedding Concierge | The Royal Weddinghub Lucknow",
    description: "Connect directly with The Royal Weddinghub wedding concierge in Lucknow. Plan your royal celebration, heritage venues, catering, and artist management.",
  },
};

export default function ContactPage() {
  return <ConciergeContact />;
}
