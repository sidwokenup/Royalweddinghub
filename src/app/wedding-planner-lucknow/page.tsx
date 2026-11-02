import type { Metadata } from 'next';
import { getAllVenues } from '@/lib/venues';
import { AdLandingPage } from '@/components/landing/AdLandingPage';

export const metadata: Metadata = {
  title: 'Luxury Wedding Planner in Lucknow | Venues, Décor & Banquets | Royal Wedding Hub',
  description:
    'Bespoke luxury wedding planning in Lucknow. Curated heritage palaces, royal Awadhi catering, authentic floral mandaps, and verified packages from ₹10 Lakh to ₹25 Lakh+. Instant consultation & quotations.',
  alternates: {
    canonical: 'https://www.royalweddinghub.com/wedding-planner-lucknow',
  },
  openGraph: {
    title: 'Luxury Wedding Planner in Lucknow | Royal Wedding Hub',
    description:
      'Turnkey luxury wedding planning, palace venue scouting, and authentic Nawabi decor orchestration in Lucknow.',
    url: 'https://www.royalweddinghub.com/wedding-planner-lucknow',
    siteName: 'Royal Wedding Hub',
    images: [
      {
        url: 'https://www.royalweddinghub.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Luxury Wedding Planner in Lucknow - Royal Wedding Hub',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function WeddingPlannerLucknowLandingPage() {
  const venues = getAllVenues();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Bespoke Wedding Planning & Venue Concierge in Lucknow',
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
    serviceType: 'Luxury Wedding Planning',
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
        pageType="planner"
        canonicalUrl="https://www.royalweddinghub.com/wedding-planner-lucknow"
      />
    </>
  );
}

