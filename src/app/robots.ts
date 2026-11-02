import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NODE_ENV === 'production';
  const rawSiteUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.royalweddinghub.com';

  // Always use the canonical www domain for production / sitemap
  const sitemapUrl =
    isProd || rawSiteUrl.includes('royalweddinghub.com')
      ? 'https://www.royalweddinghub.com/sitemap.xml'
      : `${rawSiteUrl.replace(/\/$/, '')}/sitemap.xml`;

  return {
    rules: [
      {
        userAgent: [
          'OAI-SearchBot',
          'OAI-AdsBot',
          'GPTBot',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'Google-Extended',
          'GoogleOther',
          'Applebot-Extended',
          'cohere-ai',
          'Bytespider',
        ],
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/'],
      },
    ],
    sitemap: sitemapUrl,
  };
}
