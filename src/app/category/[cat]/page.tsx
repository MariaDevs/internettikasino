import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import PostCard from '@/components/PostCard';
import { CATEGORIES, posts } from '@/lib/data';
import { buildMetadata } from '@/lib/meta';
import { breadcrumbSchema, itemListSchema } from '@/lib/schema';

interface Props {
  params: Promise<{ cat: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((cat) => ({ cat }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params;
  const c = CATEGORIES[cat];
  if (!c) return {};
  return buildMetadata({ path: `/category/${cat}/`, title: `${c.name} — Nettikasino-oppaat 2026`, description: c.description });
}

export default async function CategoryPage({ params }: Props) {
  const { cat } = await params;
  const c = CATEGORIES[cat];
  if (!c) notFound();
  const list = posts.filter((p) => p.categories.includes(cat));
  const crumbs = [
    { name: 'Etusivu', path: '/' },
    { name: c.name, path: `/category/${cat}/` },
  ];
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), itemListSchema(c.name, list.map((p) => ({ name: p.title, path: `/${p.slug}/` })))]} />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Breadcrumb items={crumbs} />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{c.name}</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-600">{c.description}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </>
  );
}
