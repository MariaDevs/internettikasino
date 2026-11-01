import type { Casino, Post } from '@/lib/data';
import type { Faq } from '@/lib/content';
import { AUTHOR, SITE_LANG, SITE_NAME, SITE_URL, abs } from '@/lib/site';

/**
 * Serialize an object for safe injection into a <script type="application/ld+json">.
 * JSON.stringify does not escape `<`, `>` or `&`, so a string containing
 * "</script>" would close the element early. Escaping keeps the JSON valid.
 */
export function ldJson(schema: unknown): string {
  return JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const AUTHOR_ID = `${AUTHOR.url}#team`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: abs('/images/logo-icon-512.png'),
    description: 'Riippumaton suomenkielinen nettikasinovertailu: kasinoarvostelut, bonukset ja pelaajan oppaat.',
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: SITE_LANG,
    publisher: { '@id': ORG_ID },
  };
}

/** The editorial team credited as author of all content. */
export function authorSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': AUTHOR_ID,
    name: AUTHOR.org,
    alternateName: AUTHOR.name,
    url: AUTHOR.url,
    logo: abs('/images/logo-icon-512.png'),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function webPageSchema(p: { path: string; title: string; description: string; published?: string | null; modified?: string | null }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${abs(p.path)}#webpage`,
    url: abs(p.path),
    name: p.title,
    description: p.description,
    inLanguage: SITE_LANG,
    isPartOf: { '@id': SITE_ID },
    ...(p.published && { datePublished: p.published }),
    ...(p.modified && { dateModified: p.modified }),
    author: { '@id': AUTHOR_ID },
    publisher: { '@id': ORG_ID },
  };
}

export function itemListSchema(name: string, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: abs(it.path) })),
  };
}

export function articleSchema(post: Post) {
  const path = `/${post.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${abs(path)}#article`,
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.modified,
    mainEntityOfPage: abs(path),
    image: post.image ? abs(post.image) : abs('/images/logo-icon-512.png'),
    inLanguage: SITE_LANG,
    author: { '@type': 'Organization', '@id': AUTHOR_ID, name: AUTHOR.org, url: AUTHOR.url },
    publisher: { '@id': ORG_ID },
  };
}

export function casinoReviewSchema(casino: Casino) {
  const path = `/review/${casino.slug}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `${abs(path)}#review`,
    name: `${casino.name} arvostelu`,
    url: abs(path),
    inLanguage: SITE_LANG,
    ...(casino.published && { datePublished: casino.published }),
    ...(casino.modified && { dateModified: casino.modified }),
    author: { '@type': 'Organization', '@id': AUTHOR_ID, name: AUTHOR.org, url: AUTHOR.url },
    publisher: { '@id': ORG_ID },
    itemReviewed: {
      '@type': 'Organization',
      name: casino.name,
      logo: abs(casino.logo),
    },
    ...(casino.rating && {
      reviewRating: { '@type': 'Rating', ratingValue: casino.rating, bestRating: 5, worstRating: 1 },
    }),
  };
}
