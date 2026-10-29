import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Check, X } from 'lucide-react';
import AuthorBox from '@/components/AuthorBox';
import Breadcrumb from '@/components/Breadcrumb';
import CasinoList from '@/components/CasinoList';
import Disclosure from '@/components/Disclosure';
import JsonLd from '@/components/JsonLd';
import PlayButton from '@/components/PlayButton';
import Prose from '@/components/Prose';
import StarRating from '@/components/StarRating';
import Toc from '@/components/Toc';
import { loadContent } from '@/lib/content';
import { casinos, getCasino, isTaxFree, licenseLabel } from '@/lib/data';
import { buildMetadata } from '@/lib/meta';
import { breadcrumbSchema, casinoReviewSchema, faqSchema } from '@/lib/schema';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return casinos.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCasino(slug);
  if (!c) return {};
  return buildMetadata({
    path: `/review/${slug}/`,
    title: c.seoTitle || `${c.name} arvostelu 2026`,
    description: c.description,
    image: c.logo,
    type: 'article',
    published: c.published,
    modified: c.modified,
  });
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;
  const casino = getCasino(slug);
  if (!casino) notFound();

  const path = `/review/${slug}/`;
  const content = loadContent('reviews', slug);
  const crumbs = [
    { name: 'Etusivu', path: '/' },
    { name: 'Kasinoarvostelut', path: '/review/' },
    { name: casino.name, path },
  ];
  const taxFree = isTaxFree(casino.license);
  const facts: [string, React.ReactNode][] = [
    ['Tervetuliaisbonus', casino.bonus || '—'],
    ...(casino.freeSpins ? ([['Ilmaiskierrokset', casino.freeSpins]] as [string, string][]) : []),
    ['Lisenssi', licenseLabel(casino.license)],
    [
      'Verovapaat voitot',
      taxFree ? (
        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700"><Check size={16} aria-hidden /> Kyllä (EU/ETA-lisenssi)</span>
      ) : (
        <span className="inline-flex items-center gap-1 font-semibold text-rose-700"><X size={16} aria-hidden /> Ei — voitot verotettavaa tuloa</span>
      ),
    ],
  ];
  const others = casinos
    .filter((c) => c.slug !== slug)
    .slice(0, 3)
    .map((c) => ({ slug: c.slug, headline: c.bonus }));

  return (
    <>
      <JsonLd data={[casinoReviewSchema(casino), breadcrumbSchema(crumbs), ...(content.faqs.length ? [faqSchema(content.faqs)] : [])]} />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Breadcrumb items={crumbs} />
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 sm:w-56">
                <Image src={casino.logo} alt={`${casino.name} logo`} width={200} height={80} priority className="h-auto max-h-20 w-auto object-contain" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{casino.name} arvostelu</h1>
                <div className="mt-2 flex items-center gap-2">
                  <StarRating value={casino.rating} size={18} showValue={false} />
                  {casino.rating && <span className="text-sm font-semibold text-slate-700">{casino.rating.toFixed(1)}/5</span>}
                </div>
                <div className="mt-3">
                  <AuthorBox compact published={casino.published} modified={casino.modified} />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tervetuliaistarjous</p>
              <p className="mt-1 text-lg font-bold text-brand-900">{casino.bonus}</p>
              <PlayButton go={casino.go} label={`Pelaa ${casino.name}`} className="mt-4 w-full" />
              <p className="mt-2 text-center text-xs text-slate-500">18+ | Mainos | Ehdot koskevat</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="min-w-0">
          <div className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <p className="border-b border-slate-200 bg-brand-50 px-5 py-3 font-bold text-slate-900">{casino.name} pikakatsaus</p>
            <dl className="divide-y divide-slate-100">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[10rem_1fr] gap-4 px-5 py-3 text-sm">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="font-medium text-slate-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Prose content={content} />
          <div className="mt-10 rounded-2xl bg-brand-950 p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-lg font-bold">{casino.name}</p>
              <p className="text-accent-300">{casino.bonus}</p>
            </div>
            <PlayButton go={casino.go} label="Hae bonus" className="mt-4 w-full sm:mt-0 sm:w-auto" />
          </div>
          <div className="mt-6">
            <Disclosure />
          </div>
          <div className="mt-8">
            <AuthorBox published={casino.published} modified={casino.modified} />
          </div>
          <h2 className="mt-12 text-2xl font-extrabold text-slate-900">Vertaa muihin kasinoihin</h2>
          <CasinoList entries={others} />
          <Link href="/review/" className="text-sm font-semibold text-brand-700 hover:underline">Kaikki kasinoarvostelut →</Link>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <Toc headings={content.headings} />
          </div>
        </aside>
      </div>
    </>
  );
}
