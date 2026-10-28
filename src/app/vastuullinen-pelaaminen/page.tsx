import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import Prose from '@/components/Prose';
import { renderMarkdown } from '@/lib/content';
import { buildMetadata } from '@/lib/meta';
import { breadcrumbSchema, webPageSchema } from '@/lib/schema';

const TITLE = 'Vastuullinen pelaaminen — työkalut ja apu';
const DESCRIPTION =
  'Näin pelaat vastuullisesti nettikasinolla: talletusrajat, pelitauot, itsensä sulkeminen ja mistä saat apua. Peluuri neuvoo maksutta numerossa 0800 100 101.';

export const metadata = buildMetadata({ path: '/vastuullinen-pelaaminen/', title: TITLE, description: DESCRIPTION });

const BODY = `
Rahapelien pitää olla viihdettä, ei tapa ansaita rahaa tai korjata talousongelmia. Kasino voittaa pitkällä aikavälillä aina — jokaisen pelin palautusprosentti (RTP) on alle 100 %. Pelaa vain rahalla, jonka voit menettää.

## Ennen kuin pelaat

- **Päätä budjetti etukäteen** ja pidä siitä kiinni. Älä talleta lisää tappioiden perässä.
- **Aseta aikaraja.** Pitkät pelisessiot heikentävät harkintaa.
- **Älä pelaa päihteiden vaikutuksen alaisena** tai kun olet stressaantunut, väsynyt tai pahalla tuulella.
- **Lue bonusehdot.** Kierrätysvaatimus sitoo rahasi peliin — [kasinobonus-oppaamme](/kasinobonus/) kertoo, mitä ehdoissa kannattaa katsoa.

## Kasinoiden vastuullisen pelaamisen työkalut

Kaikilla suosittelemillamme lisensoiduilla kasinoilla on käytössä vähintään seuraavat työkalut:

- **Talletusrajat** päivä-, viikko- tai kuukausikohtaisesti
- **Tappio- ja panosrajat**
- **Aikamuistutukset** (reality check)
- **Pelitauko** muutamasta päivästä viikkoihin
- **Itsensä sulkeminen** (self-exclusion) pidemmäksi ajaksi tai pysyvästi

Rajojen laskeminen tulee voimaan heti, nostaminen yleensä vasta viiveellä — juuri siksi, ettei päätöstä tehdä hetken mielijohteesta.

## Varoitusmerkit

Pysähdy ja hae apua, jos huomaat jonkin näistä:

- Pelaat suuremmilla summilla kuin aioit tai yrität voittaa tappiot takaisin
- Salailet pelaamista läheisiltä
- Lainaat rahaa pelaamiseen tai laiminlyöt laskuja
- Pelaaminen aiheuttaa ahdistusta, unettomuutta tai riitoja

## Mistä saa apua

- **Peluuri** — maksuton auttava puhelin ja chat pelaajille ja läheisille: [peluuri.fi](https://www.peluuri.fi), puh. 0800 100 101
- **Peliklinikka** — hoitoa ja tukea rahapeliongelmiin: [peliklinikka.fi](https://www.peliklinikka.fi)
- **Pelirajat'on** — vertaistukea pelaajille ja läheisille: [pelirajaton.fi](https://www.pelirajaton.fi)

Rahapelaaminen on sallittua vain täysi-ikäisille (18+).
`;

export default function ResponsibleGamingPage() {
  const crumbs = [
    { name: 'Etusivu', path: '/' },
    { name: 'Vastuullinen pelaaminen', path: '/vastuullinen-pelaaminen/' },
  ];
  return (
    <>
      <JsonLd data={[webPageSchema({ path: '/vastuullinen-pelaaminen/', title: TITLE, description: DESCRIPTION }), breadcrumbSchema(crumbs)]} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumb items={crumbs} />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Vastuullinen pelaaminen</h1>
        <div className="mt-6">
          <Prose content={renderMarkdown(BODY)} />
        </div>
      </div>
    </>
  );
}
