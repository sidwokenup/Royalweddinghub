import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { LenisProvider } from "@/animations/scroll/LenisProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
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
  title: "Premium Indian Wedding Planner | Luxury Cinematic Weddings",
  description: "Crafting royal, luxurious, and cinematic Indian weddings with an editorial touch.",
  openGraph: {
    title: "Premium Indian Wedding Planner",
    description: "Crafting royal, luxurious, and cinematic Indian weddings with an editorial touch.",
    url: "https://example.com",
    siteName: "Luxury Weddings",
    images: [
      {
        url: "https://example.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Luxury Indian Wedding Planner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Indian Wedding Planner",
    description: "Crafting royal, luxurious, and cinematic Indian weddings with an editorial touch.",
    images: ["https://example.com/twitter-image.jpg"],
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
      <body className="antialiased min-h-screen flex flex-col">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
