// One-off migration: WordPress (Poka theme) → Markdown + JSON for the Next.js site.
// Run from _wp-source:  node migrate.js
const c = require('cheerio');
const fs = require('fs');
const path = require('path');
const TD = require('turndown');
const { gfm } = require('turndown-plugin-gfm');

const ROOT = path.resolve(__dirname, '..');
const CONTENT = path.join(ROOT, 'src/content');
const DATA = path.join(ROOT, 'src/lib/data');
const HOST = 'https://internettikasino.com';

// Old WP URLs that already 301 to another page — rewrite links straight to the target.
const SLUG_REDIRECTS = {
  'kierratysvapaat-bonukset': 'ilmaiskierrokset',
  'kierratysvapaat-ilmaiskierrokset': 'ilmaiskierrokset',
  'nettikasino-ilman-rekisteroitymista': 'kasino-ilman-rekisteroitymista',
  'paras-nettikasino': 'parhaat-kasinot',
  'parhaat-nettikasinot': 'parhaat-kasinot',
  'list/top-rated': 'parhaat-kasinot',
  // Broken links already present in the WP content
  '?p=673': 'mita-rtp-tarkoittaa-kolikkopeleissa',
  '?p=674': 'kyc-prosessi-nettikasino',
  '?p=675': 'pikakasino-vs-nettikasino',
  '?p=676': 'volatiliteetti-osumataajuus-kolikkopeli',
  nettikasinobonuk: 'nettikasinobonukset',
  'uudet-kasinot': 'uudet-nettikasinot',
};
// The WP /go/casinofriday link points back to its own review; the working one is casino-friday.
const GO_ALIASES = { casinofriday: 'casino-friday' };

const td = new TD({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' });
td.use(gfm);
// Keep tables as HTML when they have no header row (gfm plugin skips those) — fine for marked.
td.keep(['table']);

const images = new Set();

function localImg(url) {
  if (!url) return url;
  const m = url.match(/\/wp-content\/uploads\/(.+)$/);
  if (!m) return url;
  images.add(url.replace(/^\/\//, 'https://'));
  return '/images/uploads/' + m[1];
}

function fixLinks($, scope) {
  $(scope).find('a[href]').each((_, a) => {
    let href = $(a).attr('href').trim();
    href = href.replace(/^https?:\/\/(www\.)?internettikasino\.com/, '');
    if (href === '') href = '/';
    const go = href.match(/^\/go\/([a-z0-9-]+)\/?$/);
    if (go) {
      const g = GO_ALIASES[go[1]] || go[1];
      $(a).attr('href', `/go/${g}/`);
      $(a).attr('rel', 'nofollow sponsored noopener');
      $(a).attr('target', '_blank');
      return;
    }
    if (href.startsWith('/')) {
      const [p, hash] = href.split('#');
      let slug = p.replace(/^\/|\/$/g, '');
      if (SLUG_REDIRECTS[slug]) slug = SLUG_REDIRECTS[slug];
      href = (slug ? `/${slug}/` : '/') + (hash ? `#${hash}` : '');
      $(a).attr('href', href);
      $(a).removeAttr('target');
    }
  });
  $(scope).find('img').each((_, img) => {
    const src = $(img).attr('data-src') || $(img).attr('src');
    $(img).attr('src', localImg(src));
    $(img).removeAttr('srcset').removeAttr('sizes').removeAttr('data-src').removeAttr('class')
      .removeAttr('decoding').removeAttr('width').removeAttr('height');
  });
  $(scope).find('[style]').removeAttr('style');
}

function toMd(html) {
  return td
    .turndown(html)
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s*\\-\s*$/gm, '')
    .trim() + '\n';
}

const load = (f) => c.load(fs.readFileSync(path.join(__dirname, 'html', f), 'utf8'));
const meta = ($) => ({
  seoTitle: $('title').text().trim(),
  description: ($('meta[name=description]').attr('content') || '').trim(),
  ogImage: localImg($('meta[property="og:image"]').attr('content')),
  modified: $('meta[property="article:modified_time"]').attr('content') || null,
  published: $('meta[property="article:published_time"]').attr('content') || null,
});

// ---------- casino table rows (hub pages) ----------
function parseCasinoTable($, table) {
  return $(table)
    .find('.item')
    .map((_, it) => {
      const reviewHref = $(it).find('.c2 a').attr('href') || '';
      const slug = (reviewHref.match(/\/review\/([a-z0-9-]+)/) || [])[1];
      return {
        slug,
        headline: $(it).find('.c4 h4').text().trim(),
        blurb: $(it).find('.c4 p').text().replace(/\s+/g, ' ').trim(),
        rating: $(it).find('.c3 .fa-star').length,
        logo: localImg($(it).find('.c2 img').attr('src')),
        name: $(it).find('.c2 img').attr('alt'),
      };
    })
    .get()
    .filter((r) => r.slug);
}

const casinoBlurbs = {}; // slug → best (longest) blurb seen in any table

// ---------- pages ----------
const PAGE_FILES = {
  home: '',
  kasinot: 'kasinot',
  'uudet-nettikasinot': 'uudet-nettikasinot',
  nettikasinobonukset: 'nettikasinobonukset',
  ilmaiskierrokset: 'ilmaiskierrokset',
  livekasinot: 'livekasinot',
  kasinopelit: 'kasinopelit',
  'verovapaat-kasinot': 'verovapaat-kasinot',
  pikakasinot: 'pikakasinot',
  'kasino-ilman-rekisteroitymista': 'kasino-ilman-rekisteroitymista',
  'parhaat-kasinot': 'parhaat-kasinot',
  'internettikasino-arvostelu': 'internettikasino-arvostelu',
};
const restPages = JSON.parse(fs.readFileSync(path.join(__dirname, 'full_pages.json'), 'utf8'));
const pages = [];
fs.mkdirSync(path.join(CONTENT, 'pages'), { recursive: true });
for (const [file, slug] of Object.entries(PAGE_FILES)) {
  const $ = load(file + '.html');
  const m = meta($);
  const rest = restPages.find((p) => p.slug === (slug || 'homepage'));
  $('script,style,noscript,header,footer,#mobile-menu,iframe,.uutiset,#sidebar-wrapper').remove();
  $('.section--first .row').remove(); // top-3 carousel on home
  const lists = [];
  $('.table-s1').each((i, t) => {
    const rows = parseCasinoTable($, t);
    rows.forEach((r) => {
      if (r.blurb && (!casinoBlurbs[r.slug] || r.blurb.length > casinoBlurbs[r.slug].length)) casinoBlurbs[r.slug] = r.blurb;
    });
    lists.push(rows.map((r) => ({ slug: r.slug, headline: r.headline })));
    $(t).replaceWith(`<p>%%CASINO_LIST_${i}%%</p>`);
  });
  const areas = $('#page-wrapper .text-area');
  fixLinks($, areas);
  let html = areas.map((_, a) => $(a).html()).get().join('\n');
  let md = toMd(html).replace(/%%CASINO\\?_LIST\\?_(\d+)%%/g, '<!-- casino-list:$1 -->');
  // H1 lives in the body on WP; pull it out so the template owns it.
  const h1m = md.match(/^# (.+)$/m);
  const h1 = h1m ? h1m[1].trim() : rest?.title?.rendered || m.seoTitle;
  if (h1m) md = md.replace(h1m[0] + '\n', '');
  // Drop leftover theme section titles that only labelled widgets.
  md = md.replace(/^## UUTISET\s*$/gm, '').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  const key = slug || 'home';
  // The about page was an empty theme shell on WP; its copy is hand-written in the repo.
  if (key !== 'internettikasino-arvostelu') fs.writeFileSync(path.join(CONTENT, 'pages', key + '.md'), md);
  pages.push({
    slug,
    h1: key === 'internettikasino-arvostelu' ? 'Tietoa Internettikasinosta — näin arvioimme kasinot' : h1,
    seoTitle: m.seoTitle,
    description: m.description,
    published: rest?.date?.slice(0, 10) ?? null,
    modified: (rest?.modified || m.modified || '').slice(0, 10) || null,
    casinoLists: lists,
  });
}

// ---------- reviews ----------
const goLinks = Object.fromEntries(
  fs.readFileSync(path.join(__dirname, 'go-links.txt'), 'utf8').trim().split('\n').map((l) => l.trim().split(/\s+/)),
);
const casinos = [];
fs.mkdirSync(path.join(CONTENT, 'reviews'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'html')).filter((f) => f.startsWith('review__'))) {
  const slug = f.replace('review__', '').replace('.html', '');
  const $ = load(f);
  const m = meta($);
  const up = $('.review-up-area');
  const bonuses = up.find('.review-bonus .item').map((_, it) => ({ label: $(it).find('h5').text().trim(), value: $(it).find('h4').text().trim() })).get();
  const info = {};
  up.find('.review-info li').each((_, li) => {
    const k = $(li).find('strong').text().replace(':', '').trim();
    info[k] = $(li).text().replace($(li).find('strong').text(), '').trim();
  });
  const goHref = up.find('a.btn--green').attr('href') || '';
  let go = (goHref.match(/\/go\/([a-z0-9-]+)/) || [])[1];
  go = GO_ALIASES[go] || go;
  const rdf = $('.rdf-data');
  const body = $('#main-text .single-post');
  body.find('.review-up-area,.review-bottom-group,.rdf-data').remove();
  fixLinks($, body);
  let md = toMd(body.html() || '').replace(/^# .+\n+/, ''); // the template owns the H1
  // The theme-generated "## X arvostelu" intro heading duplicates the H1 – keep it, it is real copy.
  // Strip the boilerplate RG footer (rendered globally by the template instead).
  md = md.replace(/\* \* \*\s*\n+Pelaamisen tulee olla viihdettä[\s\S]*$/m, '').trim() + '\n';
  fs.writeFileSync(path.join(CONTENT, 'reviews', slug + '.md'), md);
  casinos.push({
    slug,
    name: $('h1').first().text().trim(),
    logo: localImg(up.find('.review-logo-group img').attr('src')),
    bonus: bonuses.find((b) => /bonus/i.test(b.label))?.value || '',
    freeSpins: bonuses.find((b) => /spin/i.test(b.label))?.value || '',
    license: info['Lisensii'] || info['Lisenssi'] || '',
    rating: Number(rdf.find('[itemprop=ratingValue]').text().trim()) || up.find('.fa-star').length || null,
    go: go || null,
    affiliateUrl: goLinks[go] || null,
    published: rdf.find('meta[itemprop=datePublished]').attr('content') || null,
    modified: (m.modified || '').slice(0, 10) || null,
    seoTitle: m.seoTitle,
    description: m.description,
    blurb: '',
  });
}

// ---------- posts ----------
const posts = [];
fs.mkdirSync(path.join(CONTENT, 'posts'), { recursive: true });
for (const p of JSON.parse(fs.readFileSync(path.join(__dirname, 'posts_embed.json'), 'utf8'))) {
  const y = p.yoast_head_json || {};
  const $ = c.load(`<div id="x">${p.content.rendered}</div>`);
  fixLinks($, '#x');
  let md = toMd($('#x').html());
  md = md.replace(/^# .+\n/m, '');
  fs.writeFileSync(path.join(CONTENT, 'posts', p.slug + '.md'), md);
  const fm = p._embedded?.['wp:featuredmedia']?.[0];
  posts.push({
    slug: p.slug,
    title: c.load(p.title.rendered).text(),
    seoTitle: y.title || '',
    description: y.description || '',
    published: p.date.slice(0, 10),
    modified: p.modified.slice(0, 10),
    categories: (p._embedded?.['wp:term']?.[0] || []).map((t) => t.slug),
    image: fm ? localImg(fm.source_url) : null,
    imageAlt: fm?.alt_text || null,
    author: p._embedded?.author?.[0]?.name || 'Marius Mukuna',
  });
}

for (const cs of casinos) cs.blurb = casinoBlurbs[cs.slug] || '';
casinos.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.name.localeCompare(b.name, 'fi'));
posts.sort((a, b) => b.published.localeCompare(a.published));

fs.mkdirSync(DATA, { recursive: true });
fs.writeFileSync(path.join(DATA, 'pages.json'), JSON.stringify(pages, null, 2));
fs.writeFileSync(path.join(DATA, 'casinos.json'), JSON.stringify(casinos, null, 2));
fs.writeFileSync(path.join(DATA, 'posts.json'), JSON.stringify(posts, null, 2));
fs.writeFileSync(path.join(__dirname, 'images.txt'), [...images].join('\n') + '\n');
console.log(`pages ${pages.length}, casinos ${casinos.length}, posts ${posts.length}, images ${images.size}`);
