import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
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
  metadataBase: new URL("https://royalweddinghub.com"),
  title: "The Royal Weddinghub | Luxury Wedding Planner in Lucknow",
  description: "Plan your dream wedding with The Royal Weddinghub — luxury wedding planning, venues, photography, catering, entertainment and more in Lucknow.",
  openGraph: {
    title: "The Royal Weddinghub | Luxury Wedding Planner in Lucknow",
    description: "Plan your dream wedding with The Royal Weddinghub — luxury wedding planning, venues, photography, catering, entertainment and more in Lucknow.",
    url: "https://royalweddinghub.com",
    siteName: "The Royal Weddinghub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Royal Weddinghub - Luxury Wedding Planner in Lucknow",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Royal Weddinghub | Luxury Wedding Planner in Lucknow",
    description: "Plan your dream wedding with The Royal Weddinghub — luxury wedding planning, venues, photography, catering, entertainment and more in Lucknow.",
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
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-4SJ7J5VBRS"
        />
        <script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4SJ7J5VBRS');
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
