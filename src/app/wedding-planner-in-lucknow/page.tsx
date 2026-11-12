import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Utensils,
  Music,
  Camera,
  Building2,
  Clock,
  Phone,
  HelpCircle,
  ArrowUpRight,
  Crown,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/Navbar';
import { VenueAmbientBackground } from '@/components/venues/VenueAmbientBackground';
import { Footer } from '@/components/footer/Footer';
import { MobileStickyBar } from '@/components/contact/MobileStickyBar';
import { LocalPlannerCtaButtons } from '@/components/seo/LocalPlannerCtaButtons';
import { BUSINESS_INFO, getTelUrl } from '@/lib/contact';

const CANONICAL_URL = 'https://www.royalweddinghub.com/wedding-planner-in-lucknow';
const SEO_TITLE = 'Wedding Planner in Lucknow | Royal Wedding Hub (2026)';
const META_DESCRIPTION =
  'Hire a trusted wedding planner in Lucknow. Explore 32+ curated venues, Awadhi decor, transparent packages & Baraat logistics. Book a free consultation!';

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: META_DESCRIPTION,
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: SEO_TITLE,
    description: META_DESCRIPTION,
    url: CANONICAL_URL,
    siteName: 'Royal Wedding Hub',
    images: [
      {
        url: 'https://www.royalweddinghub.com/images/services/wedding-planning-decor.jpg',
        width: 1280,
        height: 720,
        alt: 'Luxury royal floral mandap stage and candlelit wedding courtyard decorated in Lucknow',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO_TITLE,
    description: META_DESCRIPTION,
    images: ['https://www.royalweddinghub.com/images/services/wedding-planning-decor.jpg'],
  },
};

const FAQ_ITEMS = [
  {
    question: 'How much does a wedding planner in Lucknow cost?',
    answer:
      'Professional wedding planners in Lucknow charge ₹50,000 to ₹1,50,000 for partial or day-of help. Full-service planning fees range from ₹2,00,000 to ₹5,00,000. Turnkey luxury decor, lighting, and sound production ranges from ₹15,00,000 to ₹30,00,000+.',
  },
  {
    question: 'How early should we book a planner and venue in Lucknow?',
    answer:
      'For busy winter Saya dates from November to February, book your venue and planner 5 to 8 months ahead. For summer or monsoon indoor hotel dates, booking 3 to 4 months ahead gives you good venue choices and better rates.',
  },
  {
    question: 'What are the DJ and loud music curfew rules for Lucknow weddings?',
    answer:
      'Under Uttar Pradesh noise rules, all outdoor DJs, bands, and speakers in open lawns must stop at 10:00 PM sharp. Closed, soundproof hotel banquet halls can continue Sangeet music past 10:00 PM with valid venue approvals.',
  },
  {
    question: 'Which areas in Lucknow work best for outstation guests and Baraats?',
    answer:
      'Gomti Nagar suits guests who prefer modern hotels and easy dining. Amar Shaheed Path and Raebareli Road are best for big 800+ guest lawns with wide parking. Kanpur Road and Ashiyana give flyers a quick 15-minute ride from Lucknow airport.',
  },
  {
    question: 'Can you manage both Awadhi Dastarkhwan and pure vegetarian menus?',
    answer:
      'Yes. Our catering team coordinates skilled Awadhi chefs alongside separate pure vegetarian, Satvik, and Jain cooking zones. We enforce clean utensil separation, live chaat stalls, and strict per-plate tracking.',
  },
  {
    question: 'Do you offer partial help if we already booked our wedding venue?',
    answer:
      'Yes. If you already booked a hotel or lawn in Lucknow, our partial coordination team steps in for mandap decor, vendor schedules, Baraat flow, and full day-of show running.',
  },
  {
    question: 'How do I check venue dates and get a free consultation?',
    answer:
      'You can book a free wedding consultation online in 30 seconds or call our Lucknow desk at +91 91707 01546. We check live date openings across 32+ venues and send custom quotes within 60 minutes.',
  },
] as const;

const BUDGET_TIERS = [
  {
    tier: 'Day-Of & Partial Planning',
    idealFor: 'Families who already booked their lawn and main vendors.',
    cost: '₹50,000 – ₹1,50,000',
    inclusions: 'Master run sheet, Baraat gate flow, ritual cues, on-site stage team.',
  },
  {
    tier: 'Full-Service Wedding Planning',
    idealFor: 'Complete 2 to 3 day weddings across Haldi, Sangeet, and Pheras.',
    cost: '₹2,00,000 – ₹5,00,000',
    inclusions: 'Venue talks, budget tracking, vendor booking, guest RSVP desk, full show control.',
  },
  {
    tier: 'Turnkey Royal Production',
    idealFor: 'Grand multi-event weddings with custom 3D mandaps and decor.',
    cost: '₹15,00,000 – ₹30,00,000+',
    inclusions: 'Custom stage design, fresh floral walls, pro lighting, artists, airport cabs.',
  },
  {
    tier: '500-Guest Full Wedding Total',
    idealFor: 'Complete wedding budget covering venue, food, decor, and photo.',
    cost: '₹18,00,000 – ₹45,00,000+',
    inclusions: 'Per-plate food (₹1,200–₹2,800+), lawn buyout, custom decor, 4K film, makeup.',
  },
] as const;

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Free Intro Call and Budget Plan',
    detail: 'Share your dates, guest count, and preferred area on a quick 20-minute call.',
  },
  {
    step: '02',
    title: 'Shortlisted Venue Visits',
    detail: 'Tour 3 to 5 pre-checked venues with our senior planner, either in person or via live video.',
  },
  {
    step: '03',
    title: 'Mood Boards and Clear Quote',
    detail: 'Get 3D decor ideas, tasting plans, and an itemized budget sheet within 24 hours.',
  },
  {
    step: '04',
    title: 'Vendor Lock and Local Permits',
    detail: 'We sign contracts, hold room blocks, and arrange DJ and Baraat gate clearances early.',
  },
  {
    step: '05',
    title: 'On-Site Team Until Bidai',
    detail: 'Dedicated event heads run every load-in, guest check-in, phera cue, and final Bidai.',
  },
] as const;

export default function WeddingPlannerInLucknowPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': 'https://www.royalweddinghub.com/#business',
        name: BUSINESS_INFO.name,
        url: 'https://www.royalweddinghub.com',
        logo: 'https://www.royalweddinghub.com/logo.png',
        image: 'https://www.royalweddinghub.com/og-image.jpg',
        description:
          'Trusted wedding planner in Lucknow offering verified venue scouting across 32+ palaces and lawns, Awadhi Dastarkhwan catering coordination, Zardozi mandap decor, and turnkey wedding management.',
        telephone: '+91-9170701546',
        email: BUSINESS_INFO.email,
        priceRange: '₹₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${BUSINESS_INFO.address.line1}, ${BUSINESS_INFO.address.line2}`,
          addressLocality: BUSINESS_INFO.address.city,
          addressRegion: BUSINESS_INFO.address.state,
          postalCode: BUSINESS_INFO.address.pincode,
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 26.7915,
          longitude: 80.8965,
        },
        areaServed: [
          { '@type': 'City', name: 'Lucknow' },
          { '@type': 'Place', name: 'Gomti Nagar, Lucknow' },
          { '@type': 'Place', name: 'Hazratganj, Lucknow' },
          { '@type': 'Place', name: 'Indira Nagar, Lucknow' },
          { '@type': 'Place', name: 'Amar Shaheed Path, Lucknow' },
          { '@type': 'Place', name: 'Raebareli Road, Lucknow' },
          { '@type': 'Place', name: 'Kanpur Road, Lucknow' },
        ],
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
              'Sunday',
            ],
            opens: '09:00',
            closes: '21:00',
          },
        ],
        sameAs: [BUSINESS_INFO.instagram.url],
      },
      {
        '@type': 'WebPage',
        '@id': `${CANONICAL_URL}/#webpage`,
        url: CANONICAL_URL,
        name: SEO_TITLE,
        description: META_DESCRIPTION,
        inLanguage: 'en-IN',
        isPartOf: {
          '@id': 'https://www.royalweddinghub.com/#website',
        },
        about: {
          '@id': `${CANONICAL_URL}/#service`,
        },
      },
      {
        '@type': 'Service',
        '@id': `${CANONICAL_URL}/#service`,
        name: 'Wedding Planning & Turnkey Execution in Lucknow',
        serviceType: 'Wedding Planner',
        provider: {
          '@id': 'https://www.royalweddinghub.com/#business',
        },
        areaServed: {
          '@type': 'City',
          name: 'Lucknow',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Lucknow Wedding Planning Packages',
          itemListElement: [
            {
              '@type': 'Offer',
              name: 'Partial & Day-Of Wedding Coordination',
              priceCurrency: 'INR',
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: 50000,
                maxPrice: 150000,
                priceCurrency: 'INR',
              },
            },
            {
              '@type': 'Offer',
              name: 'Full-Service Wedding Planning in Lucknow',
              priceCurrency: 'INR',
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: 200000,
                maxPrice: 500000,
                priceCurrency: 'INR',
              },
            },
            {
              '@type': 'Offer',
              name: 'Turnkey Royal Wedding Production & Mandap Decor',
              priceCurrency: 'INR',
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: 1500000,
                priceCurrency: 'INR',
              },
            },
          ],
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${CANONICAL_URL}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.royalweddinghub.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Wedding Planner in Lucknow',
            item: CANONICAL_URL,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${CANONICAL_URL}/#faq`,
        mainEntity: FAQ_ITEMS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="relative min-h-screen flex flex-col w-full bg-[#F7F3ED] text-[#211A19] overflow-x-hidden selection:bg-[#521D2B]/15 selection:text-[#521D2B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <VenueAmbientBackground />
      <Navbar />

      <main className="relative z-10 flex-1 w-full pt-24 sm:pt-28 pb-16">
        {/* =====================================================================
            HERO & QUICK ANSWER (ABOVE THE FOLD)
            ===================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-14 lg:pb-20">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-[#6B635B]">
              <li>
                <Link href="/" className="hover:text-[#521D2B] transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-[#521D2B] font-medium" aria-current="page">
                Wedding Planner in Lucknow
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE8DE] border border-[#DDD3C5]">
                <Crown size={14} className="text-[#521D2B]" />
                <span className="text-[11px] uppercase tracking-[0.22em] text-[#521D2B] font-semibold">
                  LUCKNOW LUXURY &amp; TURNKEY CONCIERGE
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#211A19] leading-[1.1] tracking-tight">
                Wedding Planner in Lucknow: Luxury Venues, Awadhi Decor &amp; Turnkey Execution
              </h1>

              {/* Executive Value / Quick Answer (First 150 words) */}
              <div className="space-y-4 text-sm sm:text-base text-[#44403C] leading-relaxed">
                <p>
                  Planning a wedding in Lucknow takes more than booking a lawn or banquet hall. As a dedicated{' '}
                  <strong className="font-semibold text-[#211A19]">wedding planner in Lucknow</strong>, Royal Wedding
                  Hub brings local venue access, warm <em>Tehzeeb</em>, and calm on-site control to every function. We
                  manage 32+ verified palaces, resorts, and marriage lawns. Our team handles Awadhi{' '}
                  <em>Dastarkhwan</em> feasts, <em>Zardozi</em> mandaps, and local Baraat permits with clear pricing.
                  Day-of planning starts at ₹50,000, while full-service planning runs from ₹2,00,000 to ₹5,00,000 based
                  on your guest count and venue choice.
                </p>
                <p>
                  Want to lock your dates before peak winter slots sell out?{' '}
                  <Link href="/contact" className="text-[#521D2B] font-medium underline underline-offset-4">
                    Check Availability &amp; Get Free Wedding Consultation
                  </Link>{' '}
                  or call our studio at{' '}
                  <a href={getTelUrl()} className="text-[#521D2B] font-semibold">
                    {BUSINESS_INFO.displayPhone}
                  </a>
                  .
                </p>
              </div>

              <LocalPlannerCtaButtons source="hero_wedding_planner_in_lucknow" />

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E5DDD2] max-w-xl">
                <div>
                  <span className="block text-lg sm:text-xl font-serif font-semibold text-[#521D2B]">32+</span>
                  <span className="text-[11px] uppercase tracking-wider text-[#6B635B]">Verified Venues</span>
                </div>
                <div>
                  <span className="block text-lg sm:text-xl font-serif font-semibold text-[#521D2B]">10+ Yrs</span>
                  <span className="text-[11px] uppercase tracking-wider text-[#6B635B]">Lucknow Heritage</span>
                </div>
                <div>
                  <span className="block text-lg sm:text-xl font-serif font-semibold text-[#521D2B]">60 Min</span>
                  <span className="text-[11px] uppercase tracking-wider text-[#6B635B]">Custom Quotes</span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#D8CBBE] bg-white shadow-[0_20px_50px_rgba(33,26,25,0.08)]">
                <div className="relative aspect-[4/3] sm:aspect-[16/12] w-full">
                  <Image
                    src="/images/services/wedding-planning-decor.jpg"
                    alt="Luxury royal floral mandap stage and candlelit wedding courtyard decorated in Lucknow"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] tracking-[0.16em] uppercase">
                  <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-[2px] border border-[#E5DDD2] text-[#211A19] font-medium">
                    Bespoke Awadhi Mandap &amp; Stage Design
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 2: WHY HIRE A LOCAL PLANNER (SEASONALITY & 10 PM CURFEW)
            ===================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 border-t border-[#E5DDD2]">
          <div className="max-w-3xl mb-10 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#211A19]">
              Why Hire a Local Wedding Planner in Lucknow?
            </h2>
            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
              Lucknow weddings bring 400 to 1,500 guests together across multi-day rituals. Many families travel in from
              Delhi, Mumbai, or abroad. Without trusted help on site, families spend weeks chasing vendors, checking
              real venue rates, and fixing gate jams. Working with an experienced local planning team saves money and
              gives your family time to enjoy every ritual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <article className="bg-white rounded-2xl border border-[#D8CBBE] p-6 sm:p-8 shadow-sm space-y-3">
              <div className="inline-flex items-center gap-2 text-[#521D2B] text-xs uppercase tracking-[0.18em] font-semibold">
                <Clock size={15} />
                <span>Seasonality &amp; Comfort</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#211A19]">
                Managing Peak Winter Saya Dates vs. Summer Banquets
              </h3>
              <p className="text-sm text-[#44403C] leading-relaxed">
                Lucknow has two very different wedding seasons. Peak winter <em>Saya</em> dates from{' '}
                <strong>November to February</strong> create a rush for open lawns, top caterers, and brass bands. You
                need to book 5 to 8 months ahead for winter weekends. Open-air winter nights also need outdoor heaters,
                wind-safe drapes, and hot kahwa counters.
              </p>
              <p className="text-sm text-[#44403C] leading-relaxed">
                Summer weddings from <strong>April to July</strong> move indoors into air-conditioned hotels and halls.
                Our planners check AC cooling power, backup power generators, and shaded guest entry zones so elders and
                kids stay comfortable all day.
              </p>
            </article>

            <article className="bg-white rounded-2xl border border-[#D8CBBE] p-6 sm:p-8 shadow-sm space-y-3">
              <div className="inline-flex items-center gap-2 text-[#521D2B] text-xs uppercase tracking-[0.18em] font-semibold">
                <ShieldCheck size={15} />
                <span>Municipal Compliance</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif text-[#211A19]">
                Handling Lucknow&apos;s 10:00 PM DJ Curfew and Baraat Permits
              </h3>
              <p className="text-sm text-[#44403C] leading-relaxed">
                Many families get caught off guard by local sound rules during wedding week. Under Uttar Pradesh noise
                laws, <strong>open-air DJs, bands, and loud speakers must stop or lower sharply at 10:00 PM</strong>.
                Dial 112 patrol units enforce this cutoff strictly across city lawns.
              </p>
              <p className="text-sm text-[#44403C] leading-relaxed">
                We guide your family on local police station and SDM temporary DJ permits when needed. Even better, we
                pace your evening timeline so the Baraat and <em>Varmala</em> finish outside before 10:00 PM. Guests then
                step inside a soundproof banquet hall where Sangeet music can safely continue late into the night.
              </p>
            </article>
          </div>
        </section>

        {/* =====================================================================
            SECTION 3: HYPER-LOCAL LUCKNOW VENUES & CELEBRATION CORRIDORS
            ===================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 border-t border-[#E5DDD2]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-3xl space-y-3">
              <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#211A19]">
                Lucknow Wedding Venues and Zones We Cover
              </h2>
              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
                Choosing the right side of Lucknow keeps guests happy and cuts long cab rides. Through our{' '}
                <Link href="/venues" className="text-[#521D2B] font-medium underline underline-offset-4">
                  verified Lucknow wedding venues catalog
                </Link>
                , you get direct venue pricing and guided tours across every prime zone.
              </p>
            </div>
            <Link
              href="/venues"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#521D2B] hover:underline shrink-0"
            >
              <span>Browse All 32+ Venues</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {/* Corridor 1 */}
            <div className="bg-white rounded-2xl border border-[#D8CBBE] p-6 sm:p-7 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-[#521D2B]">
                <MapPin size={16} />
                <h3 className="text-lg sm:text-xl font-serif font-medium text-[#211A19]">
                  Gomti Nagar and Gomti Nagar Extension
                </h3>
              </div>
              <p className="text-sm text-[#44403C] leading-relaxed">
                Gomti Nagar offers sleek banquet halls, modern hotels, and easy road links near Viraj Khand and Vigyan
                Khand. It works great for Sangeet cocktails, Haldi lunches, and mid-size receptions close to star hotel
                rooms.
              </p>
              <p className="text-sm text-[#44403C] leading-relaxed">
                <strong>Top Local Picks:</strong> Book intimate hotel events at{' '}
                <Link href="/venues/veridian-inn" className="text-[#521D2B] underline">
                  Veridian Inn in Viraj Khand
                </Link>
                , indoor comfort at{' '}
                <Link href="/venues/hotel-milenia-regency" className="text-[#521D2B] underline">
                  Hotel Milenia Regency
                </Link>
                , green lawns at{' '}
                <Link href="/venues/the-madhuvan-lawn" className="text-[#521D2B] underline">
                  The Madhuvan Lawn
                </Link>
                , or urban stays at{' '}
                <Link href="/venues/hotel-classio-collection" className="text-[#521D2B] underline">
                  Hotel Classio Collection
                </Link>
                .
              </p>
            </div>

            {/* Corridor 2 */}
            <div className="bg-white rounded-2xl border border-[#D8CBBE] p-6 sm:p-7 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-[#521D2B]">
                <MapPin size={16} />
                <h3 className="text-lg sm:text-xl font-serif font-medium text-[#211A19]">
                  Amar Shaheed Path and Sultanpur Road
                </h3>
              </div>
              <p className="text-sm text-[#44403C] leading-relaxed">
                For grand 800 to 2,000+ guest weddings with huge parking needs, Amar Shaheed Path is ideal. Its wide ring
                road lets outstation guests bypass old city traffic and reach big lawns quickly.
              </p>
              <p className="text-sm text-[#44403C] leading-relaxed">
                <strong>Top Local Picks:</strong> Host big receptions at{' '}
                <Link href="/venues/mayur-garden" className="text-[#521D2B] underline">
                  Mayur Garden near Ahmamau
                </Link>
                , open-air celebrations at{' '}
                <Link href="/venues/shakuntalam-resort" className="text-[#521D2B] underline">
                  Shakuntalam Resort behind Awadh Shilp Gram
                </Link>
                , or resort buyouts at{' '}
                <Link href="/venues/yash-resort" className="text-[#521D2B] underline">
                  Yash Resort on Sultanpur Road
                </Link>
                .
              </p>
            </div>

            {/* Corridor 3 */}
            <div className="bg-white rounded-2xl border border-[#D8CBBE] p-6 sm:p-7 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-[#521D2B]">
                <MapPin size={16} />
                <h3 className="text-lg sm:text-xl font-serif font-medium text-[#211A19]">
                  Hazratganj, Kanpur Road and Ashiyana
                </h3>
              </div>
              <p className="text-sm text-[#44403C] leading-relaxed">
                Guests flying into Chaudhary Charan Singh Airport love venues along Kanpur Road and Ashiyana LDA Colony,
                right near our studio. Nearby Hazratganj adds classic heritage charm for couple photos and intimate
                dinners.
              </p>
              <p className="text-sm text-[#44403C] leading-relaxed">
                <strong>Top Local Picks:</strong> Check spacious halls at{' '}
                <Link href="/venues/vsquare" className="text-[#521D2B] underline">
                  Vsquare near Ambedkar University
                </Link>
                , guest stays at{' '}
                <Link href="/venues/hotel-kings-paradise" className="text-[#521D2B] underline">
                  Hotel Kings Paradise
                </Link>
                , classic family lawns at{' '}
                <Link href="/venues/sainik-lawn" className="text-[#521D2B] underline">
                  Sainik Lawn
                </Link>
                , or highway retreats at{' '}
                <Link href="/venues/wild-crest-resort-and-hotel" className="text-[#521D2B] underline">
                  Wild Crest Resort And Hotel
                </Link>
                .
              </p>
            </div>

            {/* Corridor 4 */}
            <div className="bg-white rounded-2xl border border-[#D8CBBE] p-6 sm:p-7 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-[#521D2B]">
                <MapPin size={16} />
                <h3 className="text-lg sm:text-xl font-serif font-medium text-[#211A19]">
                  Raebareli Road, Ayodhya Road and IIM Road
                </h3>
              </div>
              <p className="text-sm text-[#44403C] leading-relaxed">
                Want a private weekend where every room and lawn belongs only to your guests? Outer routes along Ayodhya
                Marg, Raebareli Road, and IIM Road offer wide palace lawns at strong per-plate value.
              </p>
              <p className="text-sm text-[#44403C] leading-relaxed">
                <strong>Top Local Picks:</strong> Explore full resort stays at{' '}
                <Link href="/venues/santorini-resort-lucknow" className="text-[#521D2B] underline">
                  Santorini Resort Lucknow on IIM Road
                </Link>
                , massive 2,500-guest lawns at{' '}
                <Link href="/venues/charans-club-and-resort" className="text-[#521D2B] underline">
                  Charans Club and Resort on Ayodhya Marg
                </Link>
                , green setups at{' '}
                <Link href="/venues/magnolia-garden-marriage-lawn" className="text-[#521D2B] underline">
                  Magnolia Garden Marriage Lawn
                </Link>
                , or peaceful grounds at{' '}
                <Link href="/venues/gaura-resort" className="text-[#521D2B] underline">
                  Gaura Resort on Raebareli Road
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Callout + Editorial Resort Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#EFE8DE]/70 border border-[#DDD3C5] rounded-2xl p-6 sm:p-8">
            <div className="lg:col-span-7 space-y-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#521D2B] font-semibold">
                <Sparkles size={13} />
                <span>Smart Budget Scouting Tip</span>
              </span>
              <p className="text-sm sm:text-base text-[#211A19] leading-relaxed">
                Hosting 500+ guests on a strict budget? Read our{' '}
                <Link href="/wedding-venues-lucknow" className="text-[#521D2B] font-semibold underline">
                  Lucknow wedding venues under ₹15 Lakh guide
                </Link>{' '}
                to compare room counts, parking, and lawn space side by side.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-[#D8CBBE]">
                <Image
                  src="/venues/santorini-resort-lucknow/thumbnail.jpg"
                  alt="Bride and groom celebrating under warm floral lights at a curated Lucknow resort lawn"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            SECTION 4: COMPLETE WEDDING PLANNING SERVICES BREAKDOWN
            ===================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 border-t border-[#E5DDD2]">
          <div className="max-w-3xl mb-10 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#211A19]">
              Complete Wedding Planning Services in Lucknow
            </h2>
            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
              Your wedding should feel personal, not copied from a catalog. As an end-to-end{' '}
              <strong className="font-semibold text-[#211A19]">wedding planner in Lucknow</strong>, we manage every
              department under one point of contact. Browse all scopes on our{' '}
              <Link href="/services" className="text-[#521D2B] font-medium underline underline-offset-4">
                wedding services directory
              </Link>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="bg-white rounded-2xl border border-[#D8CBBE] p-6 space-y-3 shadow-sm">
              <Building2 size={20} className="text-[#521D2B]" />
              <h3 className="text-lg sm:text-xl font-serif text-[#211A19]">
                Heritage Venue Scouting and Direct Pricing
              </h3>
              <p className="text-sm text-[#44403C] leading-relaxed">
                We never push halls for hidden cuts. Our team checks power backups, bridal room privacy, kitchen entry,
                and valet lanes before recommending any lawn. We lock <em>Muhurat</em> dates straight with venue owners
                and put power, corkage, and setup terms in writing.
              </p>
            </article>

            <article className="bg-white rounded-2xl border border-[#D8CBBE] p-6 space-y-3 shadow-sm">
              <Sparkles size={20} className="text-[#521D2B]" />
              <h3 className="text-lg sm:text-xl font-serif text-[#211A19]">
                Awadhi Decor, Zardozi Themes and Floral Mandaps
              </h3>
              <p className="text-sm text-[#44403C] leading-relaxed">
                From <em>Chikankari</em> Mehendi lounges to royal <em>Zardozi</em> and marigold mandaps, our{' '}
                <Link href="/services/planning-and-decor" className="text-[#521D2B] underline">
                  decor and planning team
                </Link>{' '}
                builds sets sized to your lawn. We use fresh local blooms like mogra, rajnigandha, and roses backed by
                clear 3D stage previews.
              </p>
            </article>

            <article className="bg-white rounded-2xl border border-[#D8CBBE] p-6 space-y-3 shadow-sm">
              <Utensils size={20} className="text-[#521D2B]" />
              <h3 className="text-lg sm:text-xl font-serif text-[#211A19]">
                Awadhi Dastarkhwan and Multi-Cuisine Food Planning
              </h3>
              <p className="text-sm text-[#44403C] leading-relaxed">
                Great food makes a Lucknow wedding unforgettable. Through our{' '}
                <Link href="/services/catering-and-banquets" className="text-[#521D2B] underline">
                  catering and banquet team
                </Link>
                , we pair Awadhi <em>khansamas</em> with clean multi-cuisine kitchens. Whether you want a pure{' '}
                <em>Satvik</em> menu, strict Jain counters, or slow-cooked Nawabi dishes beside live chaat stalls, we
                track tastings and final plate counts cleanly.
              </p>
            </article>

            <article className="bg-white rounded-2xl border border-[#D8CBBE] p-6 space-y-3 shadow-sm">
              <Music size={20} className="text-[#521D2B]" />
              <h3 className="text-lg sm:text-xl font-serif text-[#211A19]">
                Royal Baraat Logistics, Shehnai and Sangeet Shows
              </h3>
              <p className="text-sm text-[#44403C] leading-relaxed">
                We plan smooth Baraat parades with vintage baggis, dhol teams, live <em>Shehnai</em> welcomes, and
                trained gate guards. For Sangeet nights, our{' '}
                <Link href="/services/music-and-entertainment" className="text-[#521D2B] underline">
                  music and entertainment desk
                </Link>{' '}
                books Sufi singers, live bands, and sound rigs built to shift indoors before 10:00 PM.
              </p>
            </article>

            <article className="bg-white rounded-2xl border border-[#D8CBBE] p-6 space-y-3 shadow-sm md:col-span-2 lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-7 space-y-3">
                  <Camera size={20} className="text-[#521D2B]" />
                  <h3 className="text-lg sm:text-xl font-serif text-[#211A19]">
                    Fine-Art Photos, Bridal Styling and Vedic Rituals
                  </h3>
                  <p className="text-sm text-[#44403C] leading-relaxed">
                    Our{' '}
                    <Link href="/services/photography-and-films" className="text-[#521D2B] underline">
                      photography and film crew
                    </Link>{' '}
                    shoots crisp 4K wedding films, candid family moments, and heritage couple portraits. We coordinate
                    smoothly with our{' '}
                    <Link href="/services/ceremonies-and-traditions" className="text-[#521D2B] underline">
                      ceremonies desk
                    </Link>
                    ,{' '}
                    <Link href="/services/bridal-beauty" className="text-[#521D2B] underline">
                      bridal makeup artists
                    </Link>
                    , and{' '}
                    <Link href="/services/invitations-and-gifting" className="text-[#521D2B] underline">
                      custom wedding gift teams
                    </Link>{' '}
                    so every event stays on time.
                  </p>
                </div>
                <div className="sm:col-span-5">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E5DDD2]">
                    <Image
                      src="/images/services/wedding-photography.jpg"
                      alt="Fine-art wedding photography capturing joyful bride and groom portraits in Lucknow"
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* =====================================================================
            SECTION 5: TRANSPARENT 2026 PRICING & BUDGET ESTIMATION TABLE
            ===================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 border-t border-[#E5DDD2]">
          <div className="max-w-3xl mb-8 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#211A19]">
              Wedding Planner Cost and Budget Guide in Lucknow (2026)
            </h2>
            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
              Directory sites rarely show clear numbers. Here is a simple 2026 guide to planning fees and full wedding
              costs in Lucknow so you can budget cleanly.
            </p>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-[#D8CBBE] shadow-sm mb-10">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="bg-[#EFE8DE] border-b border-[#D8CBBE] text-xs uppercase tracking-[0.15em] text-[#521D2B]">
                  <th className="py-4 px-5 font-semibold">Planning Package / Scope</th>
                  <th className="py-4 px-5 font-semibold">Best Suited For</th>
                  <th className="py-4 px-5 font-semibold">Lucknow Cost Range (INR)</th>
                  <th className="py-4 px-5 font-semibold">Core Services Included</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DDD2] text-sm text-[#44403C]">
                {BUDGET_TIERS.map((row) => (
                  <tr key={row.tier} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-4 px-5 font-semibold text-[#211A19]">{row.tier}</td>
                    <td className="py-4 px-5">{row.idealFor}</td>
                    <td className="py-4 px-5 font-semibold text-[#521D2B] whitespace-nowrap">{row.cost}</td>
                    <td className="py-4 px-5">{row.inclusions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl border border-[#D8CBBE] p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-xl sm:text-2xl font-serif text-[#211A19]">
              What Shapes Your Final Wedding Cost in Lucknow?
            </h3>
            <p className="text-sm text-[#57534E]">Four main choices drive your final spend:</p>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#44403C]">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#521D2B] shrink-0 mt-0.5" />
                <span>
                  <strong>Guest Count and Venue Style:</strong> A 500-guest dinner at a star hotel in Gomti Nagar costs
                  more per plate than a grand lawn on Shaheed Path.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#521D2B] shrink-0 mt-0.5" />
                <span>
                  <strong>Guest Hotel Rooms:</strong> Outstation weddings needing 40 to 60 guest rooms for two nights
                  add stay, breakfast, and cab costs.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#521D2B] shrink-0 mt-0.5" />
                <span>
                  <strong>Floral Choices and Stage Size:</strong> Imported orchids and tall custom wood frames cost more
                  than seasonal marigold, jasmine, and fabric drapes.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#521D2B] shrink-0 mt-0.5" />
                <span>
                  <strong>Winter Saya Dates:</strong> High-demand winter weekends raise vendor rates, so booking early
                  keeps prices steady.
                </span>
              </li>
            </ol>
            <p className="text-sm text-[#44403C] pt-2">
              Need a line-by-line cost sheet for your date and guest list? See our{' '}
              <Link href="/wedding-management-lucknow" className="text-[#521D2B] font-medium underline">
                turnkey wedding management packages
              </Link>{' '}
              or{' '}
              <Link href="/contact" className="text-[#521D2B] font-medium underline">
                request a free custom quote
              </Link>
              .
            </p>
          </div>
        </section>

        {/* =====================================================================
            SECTION 6: 5-STEP PLANNING PROCESS
            ===================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 border-t border-[#E5DDD2]">
          <div className="max-w-3xl mb-10 space-y-3">
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#211A19]">
              Our 5-Step Planning Process From Call to Bidai
            </h2>
            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
              Following a clear step-by-step plan keeps both local and NRI families calm and on track:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-[#D8CBBE] p-5 space-y-2.5 shadow-sm"
              >
                <span className="inline-block text-xs font-mono font-bold tracking-widest text-[#521D2B] bg-[#EFE8DE] px-2.5 py-1 rounded">
                  STEP {item.step}
                </span>
                <h3 className="text-base font-serif font-semibold text-[#211A19] leading-snug">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================================
            SECTION 7: TOP LUCKNOW WEDDING FAQs (MATCHED 100% TO FAQPAGE SCHEMA)
            ===================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 border-t border-[#E5DDD2]">
          <div className="max-w-3xl mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#521D2B] font-semibold">
              <HelpCircle size={15} />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#211A19]">
              Top Lucknow Wedding FAQs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQ_ITEMS.map((faq) => (
              <article
                key={faq.question}
                className="bg-white rounded-2xl border border-[#D8CBBE] p-6 shadow-sm space-y-2.5"
              >
                <h3 className="text-lg font-serif font-medium text-[#211A19] leading-snug">{faq.question}</h3>
                <p className="text-sm text-[#44403C] leading-relaxed">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        {/* =====================================================================
            SECTION 8: CLOSING CTA & VERIFIED LOCAL NAP BLOCK
            ===================================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#521D2B] via-[#431622] to-[#2B0E16] text-[#FAF7F2] p-8 sm:p-12 border border-[#D6B56D]/30 shadow-xl space-y-6">
            <h2 className="text-2xl sm:text-4xl font-serif font-light text-[#FAF7F2] leading-tight max-w-3xl">
              Plan Your Lucknow Wedding With Royal Wedding Hub
            </h2>

            <p className="text-sm sm:text-base text-[#FAF7F2]/85 leading-relaxed max-w-3xl">
              Your wedding deserves warm <em>Tehzeeb</em>, honest pricing, and calm execution from <em>Tilak</em> to{' '}
              <em>Bidai</em>. Whether you plan a cozy family ceremony or a 2,000-guest reception, Royal Wedding Hub
              serves as your trusted <strong>wedding planner in Lucknow</strong> backed by 10+ years of local
              experience.
            </p>

            <div className="bg-white/10 border border-white/15 rounded-xl p-5 max-w-2xl space-y-1.5 text-xs sm:text-sm text-[#FAF7F2]/90">
              <p className="font-semibold text-[#F5E296] flex items-center gap-2">
                <MapPin size={15} />
                <span>Lucknow Concierge Studio (NAP)</span>
              </p>
              <p>
                {BUSINESS_INFO.name} — {BUSINESS_INFO.address.line1}, {BUSINESS_INFO.address.line2},{' '}
                {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.state} {BUSINESS_INFO.address.pincode}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-[#D6B56D]" />
                <span>Direct Hotline: {BUSINESS_INFO.displayPhone} • </span>
                <Link href="/about" className="underline text-[#F5E296] hover:text-white">
                  Read about our planning philosophy
                </Link>
              </p>
            </div>

            <LocalPlannerCtaButtons source="footer_wedding_planner_in_lucknow" variant="footer-cta" />
          </div>
        </section>
      </main>

      <Footer />
      <MobileStickyBar />
    </div>
  );
}

