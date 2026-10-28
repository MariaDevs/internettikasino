import Breadcrumb from '@/components/Breadcrumb';
import CasinoList from '@/components/CasinoList';
import Disclosure from '@/components/Disclosure';
import JsonLd from '@/components/JsonLd';
import { casinos } from '@/lib/data';
import { buildMetadata } from '@/lib/meta';
import { breadcrumbSchema, itemListSchema } from '@/lib/schema';

export const metadata = buildMetadata({
  path: '/review/',
  title: `Kasinoarvostelut 2026 — ${casinos.length} testattua nettikasinoa`,
  description:
    'Kaikki Internettikasinon kasinoarvostelut yhdellä sivulla. Bonukset, lisenssit, verovapaus ja kotiutusajat testattuna — valitse kasino faktojen perusteella.',
});

export default function ReviewIndex() {
  const crumbs = [
    { name: 'Etusivu', path: '/' },
    { name: 'Kasinoarvostelut', path: '/review/' },
  ];
  const entries = casinos.map((c) => ({ slug: c.slug, headline: c.bonus }));
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), itemListSchema('Kasinoarvostelut', casinos.map((c) => ({ name: c.name, path: `/review/${c.slug}/` })))]} />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Breadcrumb items={crumbs} />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Kasinoarvostelut</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-600">
          Jokainen alla oleva kasino on käyty läpi samalla tavalla: tunnistautuminen, talletus, bonusehdot, pelivalikoima, asiakaspalvelu ja kotiutus.
          Lisenssin perusteella näet suoraan, ovatko voitot Suomessa verovapaita.
        </p>
        <div className="mt-5">
          <Disclosure />
        </div>
        <CasinoList entries={entries} />
      </div>
    </>
  );
}
