import type { Metadata } from 'next';
import { getAllVenues } from '@/lib/venues';
import { AdLandingPage } from '@/components/landing/AdLandingPage';

export const metadata: Metadata = {
  title: 'Wedding Venues in Lucknow for 500+ Guests Under ₹15 Lakh | Royal Wedding Hub',
  description:
    'Compare 32+ verified wedding venues in Lucknow for 500 guests under ₹15 lakh. Explore palaces, luxury resort lawns, and heritage banquets with live capacity, guest rooms, and instant walkthrough booking.',
  alternates: {
    canonical: 'https://www.royalweddinghub.com/wedding-venues-lucknow',
  },
  openGraph: {
    title: 'Wedding Venues in Lucknow for 500+ Guests Under ₹15 Lakh',
    description:
      'Search 32+ verified wedding venues in Lucknow. Check per-plate pricing, AC room inventory, and request direct quotations.',
    url: 'https://www.royalweddinghub.com/wedding-venues-lucknow',
    siteName: 'Royal Wedding Hub',
    images: [
      {
        url: 'https://www.royalweddinghub.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wedding Venues in Lucknow - Royal Wedding Hub',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function WeddingVenuesLucknowLandingPage() {
  const venues = getAllVenues();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Verified Wedding Venues in Lucknow',
    description:
      'Curated portfolio of wedding venues in Lucknow for 500+ guests under ₹15 lakh.',
    numberOfItems: venues.length,
    itemListElement: venues.slice(0, 10).map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'EventVenue',
        name: v.name,
        description: v.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: v.address,
          addressLocality: 'Lucknow',
          addressRegion: 'Uttar Pradesh',
          addressCountry: 'IN',
        },
        maximumAttendeeCapacity: v.capacity?.maxPax || 1000,
        url: `https://www.royalweddinghub.com/venues/${v.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AdLandingPage
        venues={venues}
        pageType="venues"
        canonicalUrl="https://www.royalweddinghub.com/wedding-venues-lucknow"
      />
    </>
  );
}
