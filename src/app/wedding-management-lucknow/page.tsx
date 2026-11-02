import type { Metadata } from 'next';
import { getAllVenues } from '@/lib/venues';
import { AdLandingPage } from '@/components/landing/AdLandingPage';

export const metadata: Metadata = {
  title: 'Turnkey Wedding Management & Venue Production in Lucknow | Royal Wedding Hub',
  description:
    'End-to-end wedding management in Lucknow. Verified venue booking, hospitality logistics, Sufi artists, khansama catering, and decor coordination. Request instant quotations.',
  alternates: {
    canonical: 'https://www.royalweddinghub.com/wedding-management-lucknow',
  },
  openGraph: {
    title: 'Turnkey Wedding Management in Lucknow | Royal Wedding Hub',
    description:
      'Professional wedding management, hospitality logistics, and verified palace booking across Lucknow.',
    url: 'https://www.royalweddinghub.com/wedding-management-lucknow',
    siteName: 'Royal Wedding Hub',
    images: [
      {
        url: 'https://www.royalweddinghub.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Wedding Management in Lucknow - Royal Wedding Hub',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function WeddingManagementLucknowLandingPage() {
  const venues = getAllVenues();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Turnkey Wedding Management in Lucknow',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Royal Wedding Hub',
      url: 'https://www.royalweddinghub.com',
      telephone: '+91-9170888981',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lucknow',
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'IN',
      },
    },
    serviceType: 'Event Management',
    areaServed: 'Lucknow',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AdLandingPage
        venues={venues}
        pageType="management"
        canonicalUrl="https://www.royalweddinghub.com/wedding-management-lucknow"
      />
    </>
  );
}

