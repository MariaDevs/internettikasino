import Link from 'next/link';
import { casinos, posts } from '@/lib/data';

const GUIDES = [
  { label: 'Parhaat kasinot', href: '/parhaat-kasinot/' },
  { label: 'Verovapaat kasinot', href: '/verovapaat-kasinot/' },
  { label: 'Kasino ilman rekisteröintiä', href: '/kasino-ilman-rekisteroitymista/' },
  { label: 'Pikakasinot', href: '/pikakasinot/' },
  { label: 'Livekasinot', href: '/livekasinot/' },
  { label: 'Kasinopelit', href: '/kasinopelit/' },
  { label: 'MGA-kasinot', href: '/mga-kasinot/' },
  { label: 'Trustly-kasinot', href: '/trustly-kasinot/' },
  { label: 'Zimpler-kasinot', href: '/zimpler-kasinot/' },
  { label: 'Brite-kasinot', href: '/brite-kasinot/' },
];

export default function Footer() {
  const topReviews = casinos.slice(0, 8);
  const latest = posts.slice(0, 6);
  return (
    <footer className="mt-16 bg-brand-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold text-white">Internettikasino</p>
          <p className="mt-3 text-sm leading-relaxed">
            Riippumaton suomenkielinen nettikasinovertailu. Testaamme kasinot itse ja kerromme suoraan, mikä toimii ja mikä ei.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm">
            <li><Link href="/internettikasino-arvostelu/" className="hover:text-white">Tietoa meistä ja arviointiperiaatteet</Link></li>
            <li><Link href="/author/marius/" className="hover:text-white">Kirjoittaja: Marius Mukuna</Link></li>
            <li><Link href="/vastuullinen-pelaaminen/" className="hover:text-white">Vastuullinen pelaaminen</Link></li>
          </ul>
        </div>
        <FooterCol title="Vertailut" links={GUIDES} />
        <FooterCol title="Kasinoarvostelut" links={[...topReviews.map((c) => ({ label: c.name, href: `/review/${c.slug}/` })), { label: 'Kaikki arvostelut →', href: '/review/' }]} />
        <FooterCol title="Uusimmat oppaat" links={latest.map((p) => ({ label: p.title.split(' — ')[0], href: `/${p.slug}/` }))} />
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl space-y-2 px-4 py-6 text-xs text-slate-400">
          <p>
            <strong className="text-slate-200">18+</strong> Pelaa vastuullisesti. Rahapelaaminen voi aiheuttaa haittaa. Apua saat maksutta{' '}
            <a href="https://www.peluuri.fi" rel="noopener" target="_blank" className="underline hover:text-white">Peluurista</a> (0800 100 101).
          </p>
          <p>
            Internettikasino.com sisältää mainoslinkkejä. Saatamme saada korvauksen, kun rekisteröidyt kasinolle linkkiemme kautta. Tämä ei vaikuta arvioihimme.
          </p>
          <p>© {new Date().getFullYear()} Internettikasino.com</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="font-bold text-white">{title}</p>
      <ul className="mt-3 space-y-1.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-white">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
