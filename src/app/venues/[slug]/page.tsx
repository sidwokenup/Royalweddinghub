import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllVenues,
  getVenueBySlug,
  formatPaxRange,
  formatRooms,
  formatPrice,
  formatLocality,
} from "@/lib/venues";
import { Navbar } from "@/components/navigation/Navbar";
import { VenueAmbientBackground } from "@/components/venues/VenueAmbientBackground";
import { VenueGallery } from "@/components/venues/VenueGallery";
import { VenueCard } from "@/components/venues/VenueCard";
import { VenueStickyBottomBar } from "@/components/venues/VenueStickyBottomBar";
import {
  MapPin,
  Star,
  Users,
  DoorOpen,
  Utensils,
  CheckCircle2,
  Phone,
  MessageCircle,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { BUSINESS_INFO, getTelUrl } from "@/lib/contact";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface VenuePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const venues = getAllVenues();
  return venues.map((v) => ({
    slug: v.slug,
  }));
}

export async function generateMetadata({
  params,
}: VenuePageProps): Promise<Metadata> {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);

  if (!venue) {
    return {
      title: "Venue Not Found | Royal Wedding Hub",
    };
  }

  const title = `${venue.name} | Wedding Venue in ${venue.city} | Royal Wedding Hub`;
  const description =
    venue.description ||
    `Plan your dream luxury wedding at ${venue.name} in ${venue.city}. Verified capacity, accommodation, and royal wedding planning packages.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://royalweddinghub.com/venues/${venue.slug}`,
      siteName: "Royal Wedding Hub",
      images: [
        {
          url: venue.primaryImage.url,
          width: venue.primaryImage.width || 1280,
          height: venue.primaryImage.height || 720,
          alt: `${venue.name} - Luxury Wedding Venue`,
        },
      ],
    },
  };
}

export default async function VenueDetailPage({ params }: VenuePageProps) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);

  if (!venue) {
    notFound();
  }

  const allVenues = getAllVenues();
  const similarVenues = allVenues
    .filter((v) => v.slug !== venue.slug && v.category === venue.category)
    .slice(0, 3);

  const paxText = formatPaxRange(venue.capacity);
  const roomsText = formatRooms(venue.capacity.rooms);
  const priceText = formatPrice(venue.food);
  const locality = formatLocality(venue.address, venue.city);

  const whatsappUrl = generateWhatsAppLink({
    service: `Venue Booking & Planning for ${venue.name}`,
    customMessage: `Hello Royal Wedding Hub! I am planning a wedding and would like to enquire about ${venue.name} in ${venue.city}. Please share available dates and package details.`,
  });

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start w-full bg-[#F7F3ED] text-[#211A19] pb-24 md:pb-16">
      {/* Ambient Luxury Lighting */}
      <VenueAmbientBackground />

      {/* Navigation */}
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 space-y-10 sm:space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-between text-xs text-[#78716C] py-1 border-b border-[#E5DDD2] pb-3"
        >
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Link href="/" className="hover:text-[#521D2B] transition-colors shrink-0">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#D6B56D] shrink-0" />
            <Link href="/venues" className="hover:text-[#521D2B] transition-colors shrink-0 font-medium">
              Venues
            </Link>
            <ChevronRight className="w-3 h-3 text-[#D6B56D] shrink-0" />
            <span className="text-[#521D2B] font-semibold truncate shrink-0 max-w-[180px] sm:max-w-none">
              {venue.name}
            </span>
          </div>

          <Link
            href="/venues"
            className="inline-flex items-center gap-1.5 text-xs text-[#521D2B] hover:text-[#211A19] transition-colors shrink-0 font-medium ml-4 bg-white px-3 py-1.5 rounded-full border border-[#D8CBBE] shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#521D2B]" />
            <span className="hidden sm:inline">Back to Venues</span>
            <span className="sm:hidden">Venues</span>
          </Link>
        </nav>

        {/* Venue Title & Key Info Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-white text-[#521D2B] border border-[#E5DDD2] shadow-xs">
              {venue.category}
            </span>

            {venue.rating && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#521D2B] text-[#FAF7F2] shadow-xs">
                <Star className="w-3.5 h-3.5 fill-[#D6B56D] text-[#D6B56D]" />
                <span>{venue.rating.toFixed(1)}</span>
                {venue.reviewCount && (
                  <span className="text-white/80 font-light">
                    ({venue.reviewCount} Reviews)
                  </span>
                )}
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-[#57534E] bg-white border border-[#E5DDD2]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#521D2B]" />
              <span>Verified Destination</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl md:text-6xl display-text font-serif text-[#211A19] leading-tight">
              {venue.name}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#78716C] font-light">
              <MapPin className="w-4 h-4 text-[#D6B56D] shrink-0" />
              <span>{locality} • {venue.address}</span>
            </div>
          </div>
        </div>

        {/* Section: Interactive Photography Gallery with Lightbox */}
        <VenueGallery
          primaryImage={venue.primaryImage}
          gallery={venue.gallery}
          venueName={venue.name}
        />

        {/* Main Content Layout: Specs & Concierge Booking Card (Two columns on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-4">
          {/* Left Column: Venue Specifications & Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Quick Specs Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 p-6 rounded-2xl bg-white border border-[#E5DDD2] shadow-[0_4px_20px_rgba(33,26,25,0.04)]">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#521D2B] flex items-center gap-1 font-semibold">
                  <Users className="w-3.5 h-3.5" /> Guest Pax
                </span>
                <p className="text-base font-semibold text-[#211A19]">{paxText}</p>
                <span className="text-[10px] text-[#78716C] block">Seating & floating</span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#521D2B] flex items-center gap-1 font-semibold">
                  <DoorOpen className="w-3.5 h-3.5" /> Rooms
                </span>
                <p className="text-base font-semibold text-[#211A19]">
                  {roomsText || "Available on Recce"}
                </p>
                <span className="text-[10px] text-[#78716C] block">Guest accommodation</span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#521D2B] flex items-center gap-1 font-semibold">
                  <Utensils className="w-3.5 h-3.5" /> Catering
                </span>
                <p className="text-base font-semibold text-[#211A19]">
                  {venue.food.vegetarian && venue.food.nonVegetarian
                    ? "Veg & Non-Veg"
                    : venue.food.vegetarian
                    ? "Pure Veg"
                    : "Flexible Catering"}
                </p>
                <span className="text-[10px] text-[#78716C] block">{priceText}</span>
              </div>
            </div>

            {/* Editorial Description */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5DDD2] shadow-[0_4px_20px_rgba(33,26,25,0.04)] space-y-4">
              <h2 className="text-xl sm:text-2xl display-text font-serif text-[#211A19] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D6B56D]" />
                <span>About {venue.name}</span>
              </h2>
              <p className="text-sm sm:text-base text-[#57534E] font-light leading-relaxed">
                {venue.description ||
                  `${venue.name} is one of Lucknow's premier ${venue.category.toLowerCase()} destinations. It offers exquisite settings, expansive event spaces, and trusted hospitality tailored for royal wedding celebrations.`}
              </p>
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] text-xs sm:text-sm text-[#521D2B] font-light leading-relaxed">
                <strong>The Royal Wedding Hub Advantage:</strong> As your dedicated wedding planners, we handle full spatial design, bespoke mandap architecture, lighting, hospitality desks, and guest logistics for this property.
              </div>
            </div>

            {/* Verified Amenities */}
            {venue.amenities.length > 0 && (
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5DDD2] shadow-[0_4px_20px_rgba(33,26,25,0.04)] space-y-4">
                <h3 className="text-lg sm:text-xl display-text font-serif text-[#211A19]">
                  Included Amenities & Facilities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {venue.amenities.map((amenity, aIdx) => (
                    <div
                      key={`${amenity}-${aIdx}`}
                      className="flex items-center gap-2 p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] text-xs sm:text-sm text-[#211A19] font-light"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#521D2B] shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Address Card */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5DDD2] shadow-[0_4px_20px_rgba(33,26,25,0.04)] space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#521D2B] font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D6B56D]" /> Destination Address
              </span>
              <p className="text-sm text-[#211A19] font-light leading-relaxed">
                {venue.address}
              </p>
              <p className="text-xs text-[#78716C]">
                City: {venue.city} • State: {venue.state}
              </p>
            </div>
          </div>

          {/* Right Column: Luxury Concierge Action Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#521D2B] via-[#431622] to-[#2B0E16] border border-[#D6B56D]/35 shadow-[0_20px_50px_rgba(82,29,43,0.25)] text-[#FAF7F2] space-y-6">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#D6B56D] font-medium block">
                  CONCIERGE BOOKING
                </span>
                <h3 className="text-2xl sm:text-3xl display-text font-serif text-white">
                  Plan Your Wedding Here
                </h3>
                <p className="text-xs sm:text-sm text-[#FAF7F2]/80 font-light leading-relaxed pt-1">
                  Connect with Royal Wedding Hub to verify celebration dates, negotiate preferred rates, and arrange a private venue recce.
                </p>
              </div>

              {/* Price Highlight */}
              <div className="p-4 rounded-xl bg-black/25 border border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-white/70 block">
                    Starting Food Package
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-[#FAF7F2]">
                    {priceText}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-white/70 block">
                    Venue Status
                  </span>
                  <span className="text-xs text-[#25D366] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                    Accepting Bookings
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-[#25D366] text-white text-xs sm:text-sm uppercase tracking-widest font-semibold shadow-lg hover:bg-[#1EBE5D] transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                  <span>Enquire on WhatsApp</span>
                </a>

                <a
                  href={getTelUrl(BUSINESS_INFO.primaryPhone)}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm uppercase tracking-widest font-medium transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#D6B56D]" />
                  <span>Call {BUSINESS_INFO.displayPhone}</span>
                </a>

                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-transparent hover:bg-white/5 text-[#FAF7F2]/80 hover:text-white text-xs uppercase tracking-wider transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D6B56D]" />
                  <span>Schedule Consultation</span>
                </Link>
              </div>

              {/* Planner Guarantee Strip */}
              <div className="pt-2 border-t border-white/10 text-center space-y-1">
                <span className="text-[11px] text-[#D6B56D] font-medium">
                  The Royal Wedding Hub Guarantee
                </span>
                <p className="text-[10px] text-white/60 leading-tight">
                  Transparent contracts • Priority venue dates • Complete decor & hospitality execution
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Similar Venues in Same Category */}
        {similarVenues.length > 0 && (
          <section className="pt-12 sm:pt-16 border-t border-[#E5DDD2] space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.25em] text-[#521D2B] font-semibold block">
                  EXPLORE ALTERNATIVES
                </span>
                <h2 className="text-2xl sm:text-3xl display-text font-serif text-[#211A19]">
                  More {venue.category}s in Lucknow
                </h2>
              </div>
              <Link
                href="/venues"
                className="text-xs uppercase tracking-widest text-[#521D2B] font-medium hover:underline flex items-center gap-1"
              >
                <span>View All Venues</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarVenues.map((v) => (
                <VenueCard key={v.id || v.slug} venue={v} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Bottom Conversion Bar */}
      <VenueStickyBottomBar venueName={venue.name} venueCity={venue.city} />
    </main>
  );
}
