// Canonical host matches the WordPress site (www → bare domain), so URLs that
// Google has already seen keep exactly the same address.
export const SITE_URL = 'https://internettikasino.com';
export const SITE_NAME = 'Internettikasino';
export const SITE_LOCALE = 'fi_FI';
export const SITE_LANG = 'fi-FI';

export const AUTHOR = {
  name: 'Marius Mukuna',
  slug: 'marius',
  url: `${SITE_URL}/author/marius/`,
  role: 'Päätoimittaja',
};

export const abs = (path: string) => `${SITE_URL}${path}`;

/** Finnish-friendly slug for heading anchors. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äå]/g, 'a')
    .replace(/ö/g, 'o')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const MONTHS = ['tammikuuta', 'helmikuuta', 'maaliskuuta', 'huhtikuuta', 'toukokuuta', 'kesäkuuta', 'heinäkuuta', 'elokuuta', 'syyskuuta', 'lokakuuta', 'marraskuuta', 'joulukuuta'];

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${d}. ${MONTHS[m - 1]} ${y}`;
}
