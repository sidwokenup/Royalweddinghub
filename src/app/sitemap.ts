import type { MetadataRoute } from 'next';
import { getAllVenues } from '@/lib/venues';
import { getServices } from '@/lib/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const isProd = process.env.NODE_ENV === 'production';
  const rawSiteUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.royalweddinghub.com';

  const siteUrl =
    isProd || rawSiteUrl.includes('royalweddinghub.com')
      ? 'https://www.royalweddinghub.com'
      : rawSiteUrl.replace(/\/$/, '');

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/wedding-planner-in-lucknow`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${siteUrl}/wedding-venues-lucknow`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${siteUrl}/wedding-planner-lucknow`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${siteUrl}/wedding-management-lucknow`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${siteUrl}/venues`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const venues = getAllVenues();
  const venuePages: MetadataRoute.Sitemap = venues.map((v) => ({
    url: `${siteUrl}/venues/${v.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const services = getServices();
  const servicePages: MetadataRoute.Sitemap = services
    .filter((s) => s.slug !== 'wedding-venues') // redirect handled
    .map((s) => ({
      url: `${siteUrl}/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return [...staticPages, ...venuePages, ...servicePages];
}
