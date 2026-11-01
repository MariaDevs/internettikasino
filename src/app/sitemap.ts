import type { MetadataRoute } from 'next';
import { CATEGORIES, casinos, hubPages, pages, posts } from '@/lib/data';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * lastmod comes from the content's real modified date (carried over from
 * WordPress), never the build time — stamping every URL as changed on each
 * deploy is a signal Google learns to ignore. Bump `modified` in the data
 * files when content actually changes.
 */
const d = (iso: string | null | undefined) => (iso ? new Date(iso) : undefined);
const newest = (dates: (string | null)[]) => d(dates.filter(Boolean).sort().at(-1));

export default function sitemap(): MetadataRoute.Sitemap {
  const home = pages.find((p) => p.slug === '');
  return [
    { url: `${SITE_URL}/`, lastModified: d(home?.modified), changeFrequency: 'weekly', priority: 1 },
    ...hubPages.map((p) => ({
      url: `${SITE_URL}/${p.slug}/`,
      lastModified: d(p.modified),
      changeFrequency: 'weekly' as const,
      priority: p.slug === 'internettikasino-arvostelu' ? 0.5 : 0.9,
    })),
    { url: `${SITE_URL}/review/`, lastModified: newest(casinos.map((c) => c.modified)), changeFrequency: 'weekly', priority: 0.8 },
    ...casinos.map((c) => ({
      url: `${SITE_URL}/review/${c.slug}/`,
      lastModified: d(c.modified),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/${p.slug}/`,
      lastModified: d(p.modified),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...Object.keys(CATEGORIES).map((cat) => ({
      url: `${SITE_URL}/category/${cat}/`,
      lastModified: newest(posts.filter((p) => p.categories.includes(cat)).map((p) => p.modified)),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    { url: `${SITE_URL}/author/traffic-puma/`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/vastuullinen-pelaaminen/`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
