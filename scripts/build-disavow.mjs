// Builds docs/seo/disavow.txt for Google Search Console's disavow tool.
//
// Input: the Ahrefs export of spam-flagged referring root domains (is_spam, or anchors
// selling links/"SEO" via Telegram etc.), plus junk "site worth / SEO stats" domains
// found in the remaining backlinks. KEEP lists domains that are flagged but are real
// relationships — never disavow these.
// Run: node scripts/build-disavow.mjs docs/seo/spam-domains-YYYY-MM-DD.txt
import fs from 'node:fs';

const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/build-disavow.mjs <spam-domains.txt>');

// Flagged by Ahrefs but legitimate.
const KEEP = new Set([
  'matchingvisions.com', // own agency — testimonials page
  'chanzaffiliates.com', // casino affiliate programme partner page
  'onlinecasinoperu.com', // own site
  'suomi24.fi', // real Finnish forum
  'gamblingwise.org', // relevant gambling resource
  'jokercasino.com',
  'ilmaista-pelirahaa.biz', // Finnish casino affiliate, on-topic
  'piperic.com',
]);

// Auto-generated "website value / SEO stats" and link-farm pages from the non-flagged
// remainder: no editorial value, only exist to host links.
const EXTRA = [
  'ycm.info',
  'alljobs.info',
  'websiterace.com',
  'pagesearch.net',
  'way2check.cv',
  'way2check.art',
  'homefinance.co.in',
  'backlinksbank.com',
  'backlinkstree.com',
  'tunca.org',
  'tyre.pro',
  'newsblogsports.site',
];

const domains = [
  ...fs.readFileSync(input, 'utf8').split(/\r?\n/),
  ...EXTRA,
]
  .map((d) => d.trim().toLowerCase())
  .filter((d) => d && !d.startsWith('#') && !KEEP.has(d));

const unique = [...new Set(domains)].sort();
const today = new Date().toISOString().slice(0, 10);
const out = [
  `# Disavow file for internettikasino.com — generated ${today} by scripts/build-disavow.mjs`,
  '# Negative-SEO spam: link-seller anchors (Telegram "SEO links", "black-links",',
  '# "access to hacked sites"), PBN/.xyz farms, backlink-checker spam and site-stats pages.',
  `# ${unique.length} root domains. Upload at https://search.google.com/search-console/disavow-links`,
  ...unique.map((d) => `domain:${d}`),
  '',
].join('\n');

fs.mkdirSync('docs/seo', { recursive: true });
fs.writeFileSync('docs/seo/disavow.txt', out);
console.log(`docs/seo/disavow.txt: ${unique.length} domains (kept ${KEEP.size} flagged-but-legit)`);
