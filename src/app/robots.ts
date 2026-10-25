import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_SITE_URL || 'https://royalweddinghub.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
