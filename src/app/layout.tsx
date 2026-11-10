import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import { LenisProvider } from "@/animations/scroll/LenisProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { ClarityRouteChangeTracker } from "@/components/analytics/ClarityRouteChangeTracker";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#faf9f6",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.royalweddinghub.com"),
  alternates: {
    canonical: "https://www.royalweddinghub.com",
  },
  title: "Royal Wedding Hub | Luxury Wedding Planner in Lucknow",
  description: "Plan your dream wedding with Royal Wedding Hub - luxury wedding planning, venues, photography, catering, entertainment and more in Lucknow.",
  openGraph: {
    title: "Royal Wedding Hub | Luxury Wedding Planner in Lucknow",
    description: "Plan your dream wedding with Royal Wedding Hub - luxury wedding planning, venues, photography, catering, entertainment and more in Lucknow.",
    url: "https://www.royalweddinghub.com",
    siteName: "Royal Wedding Hub",
    images: [
      {
        url: "https://www.royalweddinghub.com/og-image.jpg",
        secureUrl: "https://www.royalweddinghub.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Happy Indian Bride and Groom - Royal Wedding Hub Lucknow",
        type: "image/jpeg",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Wedding Hub | Luxury Wedding Planner in Lucknow",
    description: "Plan your dream wedding with Royal Wedding Hub - luxury wedding planning, venues, photography, catering, entertainment and more in Lucknow.",
    images: ["https://www.royalweddinghub.com/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col font-sans" suppressHydrationWarning>
        {/* Preconnect & high-priority LCP hero image hints */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="preconnect" href="https://c.clarity.ms" />
        <link rel="dns-prefetch" href="https://c.clarity.ms" />
        <link
          rel="preload"
          as="image"
          href="/images/hero.jpg"
          type="image/jpeg"
          // @ts-expect-error fetchpriority attribute is supported in modern browsers and React 19
          fetchpriority="high"
        />
        {/* Machine & AI Agent Discoverability */}
        <link rel="alternate" type="text/markdown" title="LLM Context" href="/llms.txt" />
        <link rel="describedby" href="/llms.txt" />
        {/* Schema.org Structured Data */}
        <JsonLd />

        {/* Google tag (gtag.js) - Google Ads & Google Analytics strictly restricted to official production domain */}
        <Script
          id="google-tags"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var host = window.location.hostname;
                // Only load and initialize Google Ads for official production domain
                if (host !== 'www.royalweddinghub.com' && host !== 'royalweddinghub.com') {
                  return;
                }

                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                // Privacy Sandbox & Consent Mode - Eliminates deprecated 3rd-party cookie flags
                gtag('consent', 'default', {
                  'ad_storage': 'granted',
                  'analytics_storage': 'granted',
                  'ad_user_data': 'granted',
                  'ad_personalization': 'denied',
                });

                // First-Party Linker Mode & Restricted Data Processing
                gtag('set', 'ads_data_redaction', true);
                gtag('set', 'restricted_data_processing', true);

                // Strictly lock measurement to royalweddinghub.com domain only (blocks vercel.app / staging / previews)
                gtag('set', 'linker', {
                  domains: ['www.royalweddinghub.com', 'royalweddinghub.com']
                });

                gtag('config', 'AW-18508119901', {
                  conversion_linker: true,
                  restricted_data_processing: true,
                });
                gtag('config', 'G-4SJ7J5VBRS', {
                  anonymize_ip: true,
                });

                var s = document.createElement('script');
                s.async = true;
                s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18508119901';
                document.head.appendChild(s);
              })();
            `,
          }}
        />

        {/* Microsoft Clarity - Session Recording, Heatmaps & User Navigation Tracking */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "zbj9wujpy6");
            `,
          }}
        />

        {/* Sync App Router SPA navigations with Microsoft Clarity across all pages */}
        <Suspense fallback={null}>
          <ClarityRouteChangeTracker />
        </Suspense>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
