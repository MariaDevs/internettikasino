# Internettikasino.com

Static Next.js rebuild of the WordPress site (Poka theme), same stack as Online Casino Peru.
Every URL from the WordPress sitemaps is kept identical (trailing slashes, `/review/<slug>/`,
posts at the root, `/category/<slug>/`, `/author/marius/`) so existing equity carries over
without redirects.

## Commands

```bash
npm run dev            # http://localhost:3000
npm run build          # what Vercel runs
```

## Hosting (Vercel)

Vercel builds with `next build`. All 53 pages are prerendered; `next.config.ts` serves
the redirects (affiliate `/go/` links + old WordPress URLs) and trailing-slash handling.

Domains: add `internettikasino.com` as the primary domain and `www.internettikasino.com`
as a redirect to it (Settings → Domains). The bare domain is canonical, same as WordPress.

Optional env vars: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`.

`npm run build:static` / `npm run redirects` / `deploy-cloudways.sh` are only for hosting
the static export on Apache instead (they generate `public/.htaccess`).

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

`/go/<slug>/` temporarily redirects to `affiliateUrl` in `casinos.json`. Old WordPress
URLs are listed in `src/lib/data/legacy-redirects.json`. Edit the JSON and redeploy.

## Migration

`_wp-source/` holds the WordPress crawl and `migrate.js`, which produced the content above.
Re-running it overwrites manual edits to migrated Markdown, so treat it as a one-off.
