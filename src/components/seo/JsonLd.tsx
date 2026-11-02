import React from "react";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.royalweddinghub.com/#business",
        "name": "Royal Wedding Hub",
        "url": "https://www.royalweddinghub.com",
        "logo": "https://www.royalweddinghub.com/og-image.jpg",
        "image": "https://www.royalweddinghub.com/og-image.jpg",
        "description":
          "Lucknow's premier luxury wedding planning and curated heritage venue concierge. Curating bespoke royal destination weddings, palace venues, and artisan catering across Lucknow.",
        "telephone": "+91-9170888981",
        "email": "contact@royalweddinghub.com",
        "priceRange": "₹₹₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Hazratganj Luxury Corridor",
          "addressLocality": "Lucknow",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "226001",
          "addressCountry": "IN",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "26.8467",
          "longitude": "80.9462",
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            "opens": "09:00",
            "closes": "21:00",
          },
        ],
        "sameAs": ["https://www.instagram.com/royal_weddinghug"],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Luxury Wedding Concierge Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Heritage Wedding Venue Scouting & Booking",
                "description":
                  "Curated selection and direct consultation for 32+ verified palaces, banquet lawns, and luxury resorts in Lucknow.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Royal Wedding Planning & Thematic Décor",
                "description":
                  "End-to-end bespoke wedding production with heritage Awadhi aesthetics, floral mandaps, and light orchestration.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Fine-Art Cinematic Photography & Films",
                "description":
                  "Fine-art bridal portraits, pre-wedding films, and multi-camera 4K cinematography.",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Awadhi Dastarkhwan & Royal Catering",
                "description":
                  "Authentic Nawabi cuisine and signature royal banquets curated by master chefs.",
              },
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://www.royalweddinghub.com/#website",
        "url": "https://www.royalweddinghub.com",
        "name": "Royal Wedding Hub",
        "publisher": {
          "@id": "https://www.royalweddinghub.com/#business",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
