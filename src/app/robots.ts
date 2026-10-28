import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    // /go/ are outbound affiliate redirects — nothing to crawl there.
    rules: [{ userAgent: '*', allow: '/', disallow: ['/go/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
