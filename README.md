# Internettikasino.com

Static Next.js rebuild of the WordPress site (Poka theme), same stack as Online Casino Peru.
Every URL from the WordPress sitemaps is kept identical (trailing slashes, `/review/<slug>/`,
posts at the root, `/category/<slug>/`, `/author/marius/`) so existing equity carries over
without redirects.

## Commands

```bash
npm run dev            # http://localhost:3000
npm run build:static   # regenerates redirects, then exports to out/
npm run redirects      # rebuild public/.htaccess + vercel.json from casinos.json
```

## Where content lives

| What | File |
| --- | --- |
| Page / post / review body copy | `src/content/{pages,posts,reviews}/<slug>.md` |
| Casino data (bonus, licence, rating, affiliate URL) | `src/lib/data/casinos.json` |
| Page meta, H1, casino list order per page | `src/lib/data/pages.json` |
| Post meta, dates, categories, images | `src/lib/data/posts.json` |

`<!-- casino-list:N -->` in a page's Markdown marks where the ranked casino list
`pages.json → casinoLists[N]` renders. When content changes, bump that item's `modified`
date — it feeds `<lastmod>` in the sitemap.

## Affiliate links

`/go/<slug>/` 302-redirects to `affiliateUrl` in `casinos.json` (via `.htaccess` on
Cloudways, `vercel.json` on Vercel). Edit the JSON, then run `npm run redirects`.

## Migration

`_wp-source/` holds the WordPress crawl and `migrate.js`, which produced the content above.
Re-running it overwrites manual edits to migrated Markdown, so treat it as a one-off.
