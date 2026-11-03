import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { VenueAmbientBackground } from "@/components/venues/VenueAmbientBackground";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { Footer } from "@/components/footer/Footer";
import { getServices, getLiveServiceBySlug, getRelatedServices } from "@/lib/services";

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
  const service = await getLiveServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Royal Wedding Hub",
    };
  }

  return {
    title: `${service.name} in Lucknow | Royal Wedding Hub`,
    description: `${service.headline} ${service.shortDescription}`,
    alternates: {
      canonical: `https://www.royalweddinghub.com/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.name} in Lucknow | Royal Wedding Hub`,
      description: service.shortDescription,
      url: `https://www.royalweddinghub.com/services/${service.slug}`,
      images: [
        {
          url: service.image,
          width: 1200,
          height: 800,
          alt: `${service.name} - Royal Wedding Hub`,
        },
      ],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getLiveServiceBySlug(slug);

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

      {/* Royal Luxury Footer */}
      <div className="w-full mt-16">
        <Footer />
      </div>
    </main>
  );
}
