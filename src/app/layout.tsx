import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import { LenisProvider } from "@/animations/scroll/LenisProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
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
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        {/* Google tag (gtag.js) - Google Ads & Google Analytics loaded after interactive for top performance */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18508119901"
          strategy="afterInteractive"
        />
        <Script
          id="google-tags"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18508119901');
              gtag('config', 'G-4SJ7J5VBRS');
            `,
          }}
        />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
