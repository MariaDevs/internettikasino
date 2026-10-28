import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import PostCard from '@/components/PostCard';
import { casinos, posts } from '@/lib/data';
import { buildMetadata } from '@/lib/meta';
import { breadcrumbSchema, personSchema } from '@/lib/schema';
import { AUTHOR } from '@/lib/site';

export const metadata = buildMetadata({
  path: '/author/marius/',
  title: `${AUTHOR.name} — ${AUTHOR.role}, Internettikasino`,
  description: `${AUTHOR.name} kirjoittaa ja testaa Internettikasinon kasinoarvostelut ja oppaat. Kaikki hänen artikkelinsa ja arvostelunsa yhdellä sivulla.`,
});

export default function AuthorPage() {
  const crumbs = [
    { name: 'Etusivu', path: '/' },
    { name: AUTHOR.name, path: '/author/marius/' },
  ];
  return (
    <>
      <JsonLd data={[{ ...personSchema(), mainEntityOfPage: 'ProfilePage' }, breadcrumbSchema(crumbs)]} />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Breadcrumb items={crumbs} />
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand-800 text-3xl font-extrabold text-white" aria-hidden>
            MM
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{AUTHOR.name}</h1>
            <p className="mt-1 font-semibold text-brand-700">{AUTHOR.role}, Internettikasino.com</p>
          </div>
        </div>
        <div className="prose-ik mt-6 max-w-3xl">
          <p>
            Marius vastaa Internettikasinon kasinoarvosteluista ja oppaista. Jokainen arvostelu perustuu samaan testiin:
            tunnistautuminen tai rekisteröinti, talletus, bonusehtojen läpikäynti, pelaaminen ja kotiutus — jotta voimme kertoa
            kotiutusajat ja ehdot sellaisina kuin ne käytännössä ovat.
          </p>
          <p>
            Erityisalueita ovat pikakasinot ja Pay N Play -maksut, kasinoiden lisenssit ja verotus sekä Suomen rahapelilain muutos 2027.
            Lue lisää <Link href="/internettikasino-arvostelu/">arviointiperiaatteistamme</Link>.
          </p>
        </div>
        <h2 className="mt-12 text-2xl font-extrabold text-slate-900">Artikkelit ({posts.length})</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
        <h2 className="mt-12 text-2xl font-extrabold text-slate-900">Kasinoarvostelut ({casinos.length})</h2>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {casinos.map((c) => (
            <li key={c.slug}>
              <Link href={`/review/${c.slug}/`} className="block rounded-lg border border-slate-200 bg-white px-4 py-3 font-medium hover:border-brand-600 hover:text-brand-700">
                {c.name} arvostelu
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
