import type { Metadata } from 'next';
import { SITE_NAME, abs } from './site';

export function buildMetadata(p: {
  path: string;
  title: string;
  description: string;
  image?: string | null;
  type?: 'website' | 'article';
  published?: string | null;
  modified?: string | null;
}): Metadata {
  const image = p.image ? abs(p.image) : abs('/images/logo-icon-512.png');
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: p.path, languages: { 'fi-FI': p.path, 'x-default': p.path } },
    openGraph: {
      type: p.type ?? 'website',
      url: abs(p.path),
      title: p.title,
      description: p.description,
      siteName: SITE_NAME,
      locale: 'fi_FI',
      images: [{ url: image }],
      ...(p.type === 'article' && {
        publishedTime: p.published ?? undefined,
        modifiedTime: p.modified ?? undefined,
        authors: [abs('/author/marius/')],
      }),
    },
    twitter: { card: 'summary_large_image', title: p.title, description: p.description, images: [image] },
  };
}
