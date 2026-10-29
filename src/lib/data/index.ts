import casinosJson from './casinos.json';
import pagesJson from './pages.json';
import postsJson from './posts.json';

export interface Casino {
  slug: string;
  name: string;
  logo: string;
  bonus: string;
  freeSpins: string;
  license: string;
  rating: number | null;
  go: string | null;
  affiliateUrl: string | null;
  published: string | null;
  modified: string | null;
  seoTitle: string;
  description: string;
  blurb: string;
}

export interface CasinoListEntry {
  slug: string;
  headline: string;
}

export interface Page {
  slug: string;
  h1: string;
  seoTitle: string;
  description: string;
  published: string | null;
  modified: string | null;
  casinoLists: CasinoListEntry[][];
}

export interface Post {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  published: string;
  modified: string;
  categories: string[];
  image: string | null;
  imageAlt: string | null;
  author: string;
}

export const casinos = casinosJson as Casino[];
export const pages = pagesJson as Page[];
export const posts = postsJson as Post[];

export const CATEGORIES: Record<string, { name: string; description: string }> = {
  oppaat: {
    name: 'Oppaat',
    description: 'Käytännön oppaat nettikasinoista: bonukset, maksutavat, RTP, volatiliteetti, KYC ja turvallinen pelaaminen.',
  },
  uutiset: {
    name: 'Uutiset',
    description: 'Ajankohtaista suomalaisilta rahapelimarkkinoilta: rahapelilaki 2027, lisenssit ja pikakasinoiden muutokset.',
  },
};

export const getCasino = (slug: string) => casinos.find((c) => c.slug === slug);

/**
 * A page's casino list, ranked by rating so the position always agrees with the
 * score shown next to it. The page keeps its own selection and bonus headlines.
 */
export function rankEntries(entries: CasinoListEntry[]): { entry: CasinoListEntry; casino: Casino }[] {
  return entries
    .map((entry) => ({ entry, casino: getCasino(entry.slug) }))
    .filter((r): r is { entry: CasinoListEntry; casino: Casino } => !!r.casino)
    .sort((a, b) => (b.casino.rating ?? 0) - (a.casino.rating ?? 0));
}
export const getPage = (slug: string) => pages.find((p) => p.slug === slug);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

/** Hub pages that are not the home page (home renders from slug ''). */
export const hubPages = pages.filter((p) => p.slug !== '');

/** Short Finnish licence label used in cards and tables. */
export function licenseLabel(raw: string): string {
  const l = raw.toLowerCase();
  if (l.includes('mga') || l.includes('malta')) return 'MGA (Malta)';
  if (l.includes('isle')) return 'Isle of Man';
  if (l.includes('eston') || l.includes('emta') || l.includes('viro')) return 'EMTA (Viro)';
  if (l.includes('cura')) return 'Curaçao';
  if (l.includes('anjouan')) return 'Anjouan';
  return raw || '—';
}

/**
 * Winnings are tax-free for Finnish players only from games run in an EEA state.
 * Isle of Man is a Crown Dependency outside the EU/EEA, so its winnings are taxable.
 */
export const isTaxFree = (raw: string) => /mga|malta|eston|emta|viro/i.test(raw);
