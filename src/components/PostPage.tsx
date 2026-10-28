import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES, casinos, posts, type Post } from '@/lib/data';
import { loadContent, readingTime } from '@/lib/content';
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/schema';
import AuthorBox from './AuthorBox';
import Breadcrumb from './Breadcrumb';
import CasinoList from './CasinoList';
import Disclosure from './Disclosure';
import JsonLd from './JsonLd';
import PostCard from './PostCard';
import Prose from './Prose';
import Toc from './Toc';

export default function PostPage({ post }: { post: Post }) {
  const path = `/${post.slug}/`;
  const content = loadContent('posts', post.slug);
  const cat = post.categories.find((c) => CATEGORIES[c]) ?? 'oppaat';
  const crumbs = [
    { name: 'Etusivu', path: '/' },
    { name: CATEGORIES[cat].name, path: `/category/${cat}/` },
    { name: post.title.split(' — ')[0], path },
  ];
  // Related: share a category first, newest first.
  const related = posts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.categories.includes(cat)) - Number(a.categories.includes(cat)))
    .slice(0, 3);
  const sideCasinos = casinos.slice(0, 3).map((c) => ({ slug: c.slug, headline: c.bonus }));

  return (
    <>
      <JsonLd data={[articleSchema(post), breadcrumbSchema(crumbs), ...(content.faqs.length ? [faqSchema(content.faqs)] : [])]} />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
          <Breadcrumb items={crumbs} />
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{post.title}</h1>
          <p className="mt-3 text-lg text-slate-600">{post.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <AuthorBox compact published={post.published} modified={post.modified} />
            <span className="text-sm text-slate-500">{readingTime(content.wordCount)} min lukuaika</span>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-4xl px-4 py-10">
        {post.image && (
          <Image
            src={post.image}
            alt={post.imageAlt || post.title}
            width={1200}
            height={630}
            priority
            className="mb-8 aspect-[1200/630] w-full rounded-2xl object-cover"
          />
        )}
        <div className="mb-8">
          <Toc headings={content.headings} />
        </div>
        <Prose content={content} />
        <div className="mt-12 space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">Suosittelemamme kasinot</h2>
          <CasinoList entries={sideCasinos} />
          <Disclosure />
        </div>
        <div className="mt-10">
          <AuthorBox published={post.published} modified={post.modified} />
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-4 pb-6">
        <h2 className="mb-5 text-2xl font-extrabold text-slate-900">Lue myös</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
        <p className="mt-6 text-sm">
          <Link href={`/category/${cat}/`} className="font-semibold text-brand-700 hover:underline">Kaikki {CATEGORIES[cat].name.toLowerCase()} →</Link>
        </p>
      </section>
    </>
  );
}
