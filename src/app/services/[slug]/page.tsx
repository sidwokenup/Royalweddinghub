import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { VenueAmbientBackground } from "@/components/venues/VenueAmbientBackground";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { getServices, getServiceBySlug, getRelatedServices } from "@/lib/services";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const services = getServices();
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | The Royal Weddinghub",
    };
  }

  return {
    title: `${service.name} in Lucknow | The Royal Weddinghub`,
    description: `${service.headline} ${service.shortDescription}`,
    openGraph: {
      title: `${service.name} in Lucknow | The Royal Weddinghub`,
      description: service.shortDescription,
      url: `https://royalweddinghub.com/services/${service.slug}`,
      images: [
        {
          url: service.image,
          width: 1200,
          height: 800,
          alt: `${service.name} - The Royal Weddinghub`,
        },
      ],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // If this service has a dedicated external URL (e.g. /venues)
  if (service.externalLink && service.slug === "wedding-venues") {
    redirect(service.externalLink);
  }

  const relatedServices = getRelatedServices(service.id, 3);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start w-full bg-[#F7F3ED] text-[#211A19] overflow-x-hidden">
      {/* Ambient Luxury Warm Glow */}
      <VenueAmbientBackground />

      {/* Global Navigation */}
      <Navbar />

      {/* Reusable Editorial Service Detail View */}
      <ServiceDetailView service={service} relatedServices={relatedServices} />

      {/* Global Minimal Footer */}
      <footer className="w-full bg-[#211A19] text-[#FAF7F2]/70 py-10 px-6 border-t border-white/10 text-center text-xs space-y-2 mt-16">
        <p className="tracking-widest uppercase text-white font-serif text-sm">
          The Royal Weddinghub
        </p>
        <p className="font-light text-white/50">
          Curating royal celebrations, palace venues, and bespoke wedding experiences across Lucknow.
        </p>
        <p className="text-[11px] text-white/30 pt-2">
          © {new Date().getFullYear()} The Royal Weddinghub Lucknow. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
