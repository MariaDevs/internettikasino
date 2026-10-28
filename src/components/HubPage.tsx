import type { Page } from '@/lib/data';
import { loadContent } from '@/lib/content';
import { breadcrumbSchema, faqSchema, itemListSchema, webPageSchema } from '@/lib/schema';
import { getCasino } from '@/lib/data';
import AuthorBox from './AuthorBox';
import Breadcrumb from './Breadcrumb';
import Disclosure from './Disclosure';
import JsonLd from './JsonLd';
import Prose from './Prose';
import Toc from './Toc';

/** Template for the WordPress "money pages" (casino lists + long-form guide). */
export default function HubPage({ page }: { page: Page }) {
  const path = `/${page.slug}/`;
  const content = loadContent('pages', page.slug);
  const crumbs = [
    { name: 'Etusivu', path: '/' },
    { name: page.h1.split(' — ')[0], path },
  ];
  const firstList = page.casinoLists[0] ?? [];
  const schema = [
    webPageSchema({ path, title: page.seoTitle, description: page.description, published: page.published, modified: page.modified }),
    breadcrumbSchema(crumbs),
    ...(content.faqs.length ? [faqSchema(content.faqs)] : []),
    ...(firstList.length
      ? [itemListSchema(page.h1, firstList.map((e) => ({ name: getCasino(e.slug)?.name ?? e.slug, path: `/review/${e.slug}/` })))]
      : []),
  ];

  return (
    <>
      <JsonLd data={schema} />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
          <Breadcrumb items={crumbs} />
          <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{page.h1}</h1>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <AuthorBox compact published={page.published} modified={page.modified} />
          </div>
          <div className="mt-5 max-w-4xl">
            <Disclosure />
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="min-w-0">
          <Prose content={content} lists={page.casinoLists} />
          <div className="mt-12">
            <AuthorBox published={page.published} modified={page.modified} />
          </div>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Toc headings={content.headings} />
          </div>
        </aside>
      </div>
    </>
  );
}
