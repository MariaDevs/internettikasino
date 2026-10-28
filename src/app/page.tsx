import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, Timer, Gift, ShieldCheck } from 'lucide-react';
import AuthorBox from '@/components/AuthorBox';
import Disclosure from '@/components/Disclosure';
import JsonLd from '@/components/JsonLd';
import PlayButton from '@/components/PlayButton';
import PostCard from '@/components/PostCard';
import Prose from '@/components/Prose';
import StarRating from '@/components/StarRating';
import { loadContent } from '@/lib/content';
import { getCasino, getPage, posts, type Casino } from '@/lib/data';
import { buildMetadata } from '@/lib/meta';
import { faqSchema, itemListSchema, webPageSchema } from '@/lib/schema';

const home = getPage('')!;

export const metadata = buildMetadata({ path: '/', title: home.seoTitle, description: home.description });

// Same top-3 the WordPress hero carousel featured.
const HERO = ['tikkari-kasino', 'taika-spinni', 'spinnair-kasino'];

const USPS = [
  { icon: BadgeCheck, title: 'Itse testatut', text: 'Talletus, bonus, pelaaminen ja kotiutus — jokainen kasino käydään läpi.' },
  { icon: Timer, title: 'Nopeat kotiutukset', text: 'Pay N Play ja pikamaksut: kotiutusajat mitattuina, ei luvattuina.' },
  { icon: Gift, title: 'Reilut bonukset', text: 'Kierrätysehdot auki kirjoitettuina ennen kuin talletat.' },
  { icon: ShieldCheck, title: 'Lisenssit tarkistettu', text: 'Näet heti, onko voitot verovapaita (MGA, EMTA, Isle of Man).' },
];

export default function HomePage() {
  const content = loadContent('pages', '');
  const hero = HERO.map(getCasino).filter((c): c is Casino => !!c);
  const list = home.casinoLists[0] ?? [];

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ path: '/', title: home.seoTitle, description: home.description, modified: home.modified }),
          ...(content.faqs.length ? [faqSchema(content.faqs)] : []),
          itemListSchema('Parhaat nettikasinot', list.map((e) => ({ name: getCasino(e.slug)?.name ?? e.slug, path: `/review/${e.slug}/` }))),
        ]}
      />
      <section className="bg-gradient-to-b from-brand-950 to-brand-900 text-white">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:pt-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-300">Nettikasinot 2026</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{home.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Testatut nettikasinot, rehelliset bonusehdot ja mitatut kotiutusajat — yhdessä paikassa, ilman hypeä.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {hero.map((c, i) => (
              <div key={c.slug} className="flex flex-col rounded-2xl bg-white p-5 text-slate-900 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent-400 px-2.5 py-0.5 text-xs font-bold text-brand-950">#{i + 1}</span>
                  <StarRating value={c.rating} size={14} />
                </div>
                <Link href={`/review/${c.slug}/`} className="mt-3 flex h-20 items-center justify-center rounded-xl border border-slate-200 bg-white">
                  <Image src={c.logo} alt={`${c.name} logo`} width={180} height={70} priority={i === 0} className="h-auto max-h-14 w-auto object-contain" />
                </Link>
                <p className="mt-3 text-lg font-bold">{c.name}</p>
                <p className="flex-1 font-semibold text-brand-800">{c.bonus}</p>
                <div className="mt-4 flex gap-2">
                  <PlayButton go={c.go} className="flex-1" />
                  <Link href={`/review/${c.slug}/`} className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium hover:border-brand-600">
                    Arvostelu
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-300">18+ | Mainos | Ehdot koskevat. Pelaa vastuullisesti.</p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <ul className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {USPS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3">
              <Icon className="mt-0.5 shrink-0 text-brand-600" size={22} aria-hidden />
              <div>
                <p className="font-bold text-slate-900">{title}</p>
                <p className="text-sm text-slate-600">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-4">
          <AuthorBox compact modified={home.modified} />
          <Disclosure />
        </div>
        <Prose content={content} lists={home.casinoLists} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900">Uusimmat oppaat ja uutiset</h2>
          <Link href="/category/oppaat/" className="text-sm font-semibold text-brand-700 hover:underline">Kaikki oppaat →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </>
  );
}
